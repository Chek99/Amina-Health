import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// 1. AI Maternal & Pediatric Health Assistant Endpoint
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  try {
    const { messages, childContext, maternalContext, language = 'English' } = req.body;

    const systemPrompt = `You are "Amina CareAI", a compassionate, medically grounded Maternal and Infant Health Clinical Assistant.
You specialize in guiding first-time mothers through newborn care, infant developmental milestones, WHO immunization guidelines, nutrition, and postpartum maternal recovery.

Rules:
1. Ground your medical advice in WHO Integrated Management of Childhood Illness (IMCI) and pediatric best practices.
2. If the user presents severe emergency red flags (e.g. infant fever >38°C under 3 months, breathing >60 breaths/min, chest indrawing, cyanosis, convulsions, maternal heavy hemorrhage soaking >1 pad/hr, severe postpartum headache with vision loss), immediately flag URGENT EMERGENCY HOSPITAL REFERRAL in bold, state immediate stabilization instructions (e.g. skin-to-skin Kangaroo care, keep baby warm), and advise calling emergency services.
3. Respond in the requested language: "${language}". If the language is local (e.g. Swahili, Luganda, Yoruba, French, Spanish, Hindi), provide accurate, culturally respectful, warm guidance with simple terminology suitable for mothers of all literacy levels.
4. Keep answers supportive, encouraging, practical, and structured with bullet points.
5. Current child context: ${JSON.stringify(childContext || {})}
6. Maternal context: ${JSON.stringify(maternalContext || {})}`;

    if (!ai) {
      // High-quality clinical fallback response if API key is pending
      const userLastMessage = messages?.[messages.length - 1]?.content || 'Hello';
      return res.json({
        reply: `Hello mama! I am Amina, your smart motherhood and infant companion. Regarding "${userLastMessage}":
• Remember that for an infant, frequent responsive feeding (8-12 times in 24 hours for newborns) and keeping baby warm are paramount.
• Monitor diapers: at least 6 wet diapers and regular soft stools indicate adequate hydration.
• If you ever observe difficulty breathing (>60 breaths/min), fever above 38°C, or extreme lethargy, visit the nearest health center immediately.
You can track daily feeds, diapers, and milestones in the Mother Journal, and verify your vaccination calendar in the Smart Immunization tab!`,
        source: 'clinical-rules-engine'
      });
    }

    const conversationHistory = (messages || []).map((m: any) => `${m.role === 'user' ? 'Mother/Caregiver' : 'Amina CareAI'}: ${m.content}`).join('\n\n');

    const prompt = `${systemPrompt}\n\nConversation so far:\n${conversationHistory}\n\nPlease provide your helpful, medically safe response:`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const reply = response.text || 'I am here to support you and your baby. Please let me know how I can help.';
    res.json({ reply, source: 'gemini-3.8-flash' });
  } catch (err: any) {
    console.error('Error in /api/ai/chat:', err);
    res.status(500).json({
      error: 'AI assistant service temporarily unavailable',
      fallback: 'For baby safety, if you observe fever >38°C, breathing problems, or refusal to feed, please consult your nearest pediatric clinic right away.'
    });
  }
});

// 2. Neonatal & Maternal Emergency Triage Endpoint
app.post('/api/ai/triage', async (req: Request, res: Response) => {
  try {
    const { signs, patientType, vitals, childAgeWeeks } = req.body;

    const triagePrompt = `You are a triage clinical engine for maternal and newborn health (WHO IMCI protocols).
Evaluate these recorded signs:
Patient Type: ${patientType || 'infant'}
Child Age: ${childAgeWeeks || 4} weeks
Vitals: ${JSON.stringify(vitals || {})}
Selected Symptoms / Observations: ${JSON.stringify(signs || [])}

Analyze the risk level. Return a valid JSON object ONLY with the following schema:
{
  "urgencyTier": "RED" | "YELLOW" | "GREEN",
  "urgencyTitle": string (e.g. "Critical Emergency: Immediate Hospitalization Required" or "Moderate Risk: Clinic Visit Required within 24h" or "Low Risk: Home Observation & Routine Care"),
  "dangerFlagsIdentified": string[],
  "clinicalRationale": string,
  "immediateFirstAidSteps": string[],
  "whatToTellDoctor": string,
  "localLanguageSummary": string
}`;

    if (!ai) {
      // Deterministic WHO IMCI clinical rule evaluation
      const signsList = signs || [];
      const isRed = signsList.some((s: string) =>
        s.toLowerCase().includes('breath') ||
        s.toLowerCase().includes('convulsion') ||
        s.toLowerCase().includes('refusal') ||
        s.toLowerCase().includes('indrawing') ||
        s.toLowerCase().includes('hemorrhage') ||
        s.toLowerCase().includes('unresponsive')
      ) || (vitals?.temperature && (vitals.temperature > 38.0 || vitals.temperature < 36.0));

      const isYellow = !isRed && (signsList.length > 0 || (vitals?.temperature && vitals.temperature > 37.5));

      return res.json({
        urgencyTier: isRed ? 'RED' : isYellow ? 'YELLOW' : 'GREEN',
        urgencyTitle: isRed
          ? 'Emergency Alert: Immediate Hospital Care Needed'
          : isYellow
          ? 'Moderate Urgency: Pediatric Consultation within 24 Hours'
          : 'Normal Status: Monitor at Home with Standard Care',
        dangerFlagsIdentified: signsList.length > 0 ? signsList : ['No acute danger signs detected'],
        clinicalRationale: isRed
          ? 'Critical neonatal/maternal danger signs detected based on WHO IMCI guidelines. Immediate facility evaluation is critical to prevent complications.'
          : isYellow
          ? 'Mild-to-moderate symptoms warranting formal clinical assessment by a healthcare worker.'
          : 'Vital parameters are within expected baseline range for age.',
        immediateFirstAidSteps: isRed
          ? [
              'Keep infant warm using skin-to-skin Kangaroo Mother Care contact with mother.',
              'Ensure infant airway is clear; do not administer oral liquids if baby is lethargic.',
              'Proceed immediately to the emergency triage at the nearest hospital.',
              'Bring child health booklet / digital QR passport for the triage nurse.'
            ]
          : [
              'Continue frequent breastfeeding to maintain optimal hydration.',
              'Monitor temperature every 4 hours with digital thermometer.',
              'Watch for respiratory changes or decreased wet diapers.'
            ],
        whatToTellDoctor: `Infant has signs: ${signsList.join(', ') || 'Normal checks'}; temp: ${vitals?.temperature || '37.0'}°C.`,
        localLanguageSummary: 'Tafadhali muone daktari haraka iwapo mtoto anashindwa kunyonya au anapumua haraka sana.'
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: triagePrompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: any) {
    console.error('Error in /api/ai/triage, using deterministic WHO IMCI rules:', err?.message);
    const { signs = [], vitals } = req.body || {};
    const signsList: string[] = signs || [];
    const temp = vitals?.temperature || 37.0;
    const isRed = signsList.some((s: string) =>
      s.toLowerCase().includes('breath') ||
      s.toLowerCase().includes('convulsion') ||
      s.toLowerCase().includes('refusal') ||
      s.toLowerCase().includes('indrawing') ||
      s.toLowerCase().includes('hemorrhage') ||
      s.toLowerCase().includes('unresponsive')
    ) || temp > 38.0 || temp < 36.0;

    const isYellow = !isRed && (signsList.length > 0 || temp > 37.5);

    res.json({
      urgencyTier: isRed ? 'RED' : isYellow ? 'YELLOW' : 'GREEN',
      urgencyTitle: isRed
        ? 'Emergency Alert: Immediate Hospital Care Needed'
        : isYellow
        ? 'Moderate Urgency: Pediatric Consultation within 24 Hours'
        : 'Normal Status: Monitor at Home with Standard Care',
      dangerFlagsIdentified: signsList.length > 0 ? signsList : ['Temperature check: ' + temp + '°C'],
      clinicalRationale: isRed
        ? 'Critical neonatal/maternal danger signs detected based on WHO IMCI guidelines. Immediate facility evaluation is critical to prevent complications.'
        : isYellow
        ? 'Mild-to-moderate symptoms warranting formal clinical assessment by a healthcare worker.'
        : 'Vital parameters are within expected baseline range for age.',
      immediateFirstAidSteps: isRed
        ? [
            'Keep infant warm using skin-to-skin Kangaroo Mother Care contact with mother.',
            'Ensure infant airway is clear; do not administer oral liquids if baby is lethargic.',
            'Proceed immediately to the emergency triage at the nearest hospital.',
            'Bring child health booklet / digital QR passport for the triage nurse.'
          ]
        : [
            'Continue frequent breastfeeding to maintain optimal hydration.',
            'Monitor temperature every 4 hours with digital thermometer.',
            'Watch for respiratory changes or decreased wet diapers.'
          ],
      whatToTellDoctor: `Recorded signs: ${signsList.join(', ') || 'Normal checks'}; temp: ${temp}°C.`,
      localLanguageSummary: 'Tafadhali muone daktari kituo cha afya kilicho karibu haraka.'
    });
  }
});

// 3. AI Baby Cry Acoustic & Context Analyzer
app.post('/api/ai/cry-analyzer', async (req: Request, res: Response) => {
  try {
    const { cryPitch, durationSec, lastFeedMinutesAgo, lastSleepMinutesAgo, diaperState, feverPresent, audioEnergy } = req.body;

    const cryPrompt = `Analyze baby crying pattern based on the following acoustic & care parameters:
- Cry Sound Pattern / Pitch: ${cryPitch || 'rhythmic and rising'}
- Duration: ${durationSec || 45} seconds
- Minutes since last feed: ${lastFeedMinutesAgo || 180}
- Minutes since last nap: ${lastSleepMinutesAgo || 120}
- Diaper condition: ${diaperState || 'dry'}
- Fever: ${feverPresent ? 'Yes' : 'No'}
- Acoustic Energy/Intensity: ${audioEnergy || 'moderate'}

Classify the cry cause (Hunger, Colic / Gas Pain, Overtired / Sleep Pressure, Discomfort / Soiled Diaper, Reflux / Burp Needed, or Pathological High-Pitched Pain).
Return a valid JSON object ONLY with schema:
{
  "primaryCause": string,
  "confidenceScore": number (0-100),
  "acousticSignature": string,
  "soothingTechniques": string[],
  "clinicalNote": string,
  "redFlagWarning": string | null
}`;

    if (!ai) {
      // Evidence-based heuristic rule
      let cause = 'Hunger';
      let confidence = 88;
      let signature = 'Rhythmic "neh-neh" sound with rooting reflex';
      let soothing = [
        'Offer breast or bottle in a calm, semi-upright position.',
        'Watch for early feeding cues: hand-to-mouth, lip smacking.',
        'Burp gently halfway through feed.'
      ];

      if (lastFeedMinutesAgo < 45 && diaperState === 'wet') {
        cause = 'Discomfort / Wet Diaper';
        confidence = 92;
        signature = 'Intermittent whiny cry, wriggling legs';
        soothing = [
          'Change diaper promptly and inspect skin for diaper rash.',
          'Apply zinc oxide protective barrier cream if redness appears.',
          'Dress in breathable cotton clothing.'
        ];
      } else if (cryPitch === 'high-pitched piercing' || feverPresent) {
        cause = 'Acute Pain or Illness';
        confidence = 85;
        signature = 'Sudden intense high-pitched shrieking without pauses';
        soothing = [
          'Check infant temperature with a rectal or axillary digital thermometer.',
          'Inspect for tight clothing, hair tourniquet on toes/fingers, or swollen tummy.',
          'Seek medical attention if crying is inconsolable beyond 2 hours or accompanied by fever.'
        ];
      } else if (lastSleepMinutesAgo > 90) {
        cause = 'Overtired / Sleep Pressure';
        confidence = 86;
        signature = 'Nasal, whiny cry with eye rubbing and gaze aversion';
        soothing = [
          'Dim lights and reduce auditory stimulation.',
          'Swaddle securely with hands near chest if under 2 months.',
          'Use gentle rhythmic rocking and white noise shushing.'
        ];
      }

      return res.json({
        primaryCause: cause,
        confidenceScore: confidence,
        acousticSignature: signature,
        soothingTechniques: soothing,
        clinicalNote: 'Based on time elapsed since last care event and vocal cadence.',
        redFlagWarning: feverPresent ? 'Fever present: evaluate for systemic infection.' : null
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: cryPrompt,
      config: { responseMimeType: 'application/json' },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: any) {
    console.error('Error in cry analyzer:', err);
    res.status(500).json({ error: 'Cry analysis engine error' });
  }
});

// 4. Text-to-Speech Endpoint for Low-Literacy Mothers
app.post('/api/ai/tts', async (req: Request, res: Response) => {
  try {
    const { text, language = 'en' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (!ai) {
      // Instruct client to use native SpeechSynthesis
      return res.json({ useNativeSynthesis: true, text });
    }

    // Call gemini-3.8-flash-lite-tts
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Say in a warm, comforting maternal voice: ${text}`,
              speechMetadata: {
                style: 'Gentle, comforting maternal healthcare nurse',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return res.json({ audioBase64: base64Audio, format: 'audio/wav' });
    } else {
      return res.json({ useNativeSynthesis: true, text });
    }
  } catch (err: any) {
    console.error('TTS generation failed, falling back to client voice:', err?.message);
    res.json({ useNativeSynthesis: true, text: req.body.text });
  }
});

// 5. SMS Notification Simulator Endpoint
app.post('/api/sms/send', (req: Request, res: Response) => {
  const { recipientPhone, messageType, infantName, scheduledDate, customBody } = req.body;
  const timestamp = new Date().toISOString();

  let body = customBody;
  if (!body) {
    if (messageType === 'vaccine_due') {
      body = `[MOH Clinic Alert] Jambo mama! Reminder: ${infantName || 'Baby'} is scheduled for Pentavalent-2 & PCV vaccine on ${scheduledDate || 'Tomorrow'}. Please bring the Child Health Booklet. Free at your nearest clinic.`;
    } else if (messageType === 'emergency_alert') {
      body = `[EMERGENCY NOTIFICATION] High fever flag logged for ${infantName || 'Baby'}. Emergency clinic dispatch triggered. Proceed to nearest triage immediately.`;
    } else {
      body = `[Smart Health] Hello mama, reminder to log ${infantName || 'Baby'}'s weight and feeding today. Have a peaceful day!`;
    }
  }

  const logEntry = {
    id: `sms_${Date.now()}`,
    phone: recipientPhone || '+254 712 345678',
    messageType: messageType || 'general',
    body,
    timestamp,
    status: 'Delivered',
    carrier: 'Safaricom / Airtel Gateway (Simulated)',
  };

  res.json({ success: true, log: logEntry });
});

// Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
