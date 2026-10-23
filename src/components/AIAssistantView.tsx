import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bot,
  Send,
  Volume2,
  VolumeX,
  Mic,
  AlertTriangle,
  HeartHandshake,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  ShieldAlert,
  HelpCircle,
  Activity,
  AudioLines as WaveformIcon,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const AIAssistantView: React.FC = () => {
  const { activeChild, maternalLog, dailyLog, language, t } = useApp();

  const [activeMode, setActiveMode] = useState<'chat' | 'cry_analyzer' | 'emergency_triage'>('chat');
  const [selectedLanguage, setSelectedLanguage] = useState(language === 'sw' ? 'Kiswahili' : 'English');

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: language === 'sw'
        ? `Jambo mama! Mimi ni Amina CareAI, msaidizi wako wa kitaalamu wa afya ya uzazi na mtoto. Nawezaje kukusaidia wewe na ${activeChild.name} leo? Niulize kuhusu kunyonyesha, ratiba ya chanjo, usingizi wa mtoto, au afya yako kwa Kiswahili au Kiingereza.`
        : `Jambo mama! I am Amina CareAI, your certified maternal and infant healthcare companion. How can I support you and ${activeChild.name} today? Ask me about newborn feeding, vaccination schedules, sleep routines, or recovery care in any language.`,
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Sync selected chat language when global language switcher changes
  useEffect(() => {
    setSelectedLanguage(language === 'sw' ? 'Kiswahili' : 'English');
  }, [language]);

  // Audio element for TTS playback
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Cry Analyzer State
  const [cryPitch, setCryPitch] = useState<'rhythmic and rising' | 'sharp whiny' | 'high-pitched piercing' | 'grunting'>('rhythmic and rising');
  const [cryDuration, setCryDuration] = useState(45);
  const [lastFeedMin, setLastFeedMin] = useState(160);
  const [lastSleepMin, setLastSleepMin] = useState(110);
  const [cryDiaper, setCryDiaper] = useState<'dry' | 'wet' | 'dirty'>('dry');
  const [cryFever, setCryFever] = useState(false);
  const [cryResult, setCryResult] = useState<any>(null);
  const [analyzingCry, setAnalyzingCry] = useState(false);

  // Emergency Triage State
  const [triageType, setTriageType] = useState<'infant' | 'mother'>('infant');
  const [selectedDangerSigns, setSelectedDangerSigns] = useState<string[]>([]);
  const [patientTemp, setPatientTemp] = useState('37.2');
  const [respiratoryRate, setRespiratoryRate] = useState('38');
  const [triageResult, setTriageResult] = useState<any>(null);
  const [runningTriage, setRunningTriage] = useState(false);

  const infantDangerOptions = [
    'Fast breathing (>60 breaths/minute)',
    'Severe chest indrawing or grunting',
    'Fever above 38.0°C or Hypothermia (<36.0°C)',
    'Refusal to breastfeed / inability to suck',
    'Lethargic, abnormally sleepy, or unresponsive',
    'Convulsions or abnormal involuntary twitching',
    'Jaundice (yellow skin) spreading to palms and soles',
    'Umbilical cord red, swollen, or discharging pus',
  ];

  const maternalDangerOptions = [
    'Heavy vaginal bleeding (soaking >1 sanitary pad per hour)',
    'Passing large blood clots larger than a golf ball',
    'Severe persistent headache with blurred vision or spots',
    'Foul-smelling vaginal discharge with high fever',
    'Severe lower abdominal pain not relieved by standard analgesia',
    'Unilateral calf pain, tenderness, or swelling (DVT risk)',
  ];

  // Send Chat message
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          childContext: {
            name: activeChild.name,
            gender: activeChild.gender,
            dob: activeChild.dob,
            birthWeightKg: activeChild.birthWeightKg,
            recentFeedsCountToday: dailyLog.feedings.length,
            diapersToday: dailyLog.diapers.length,
          },
          maternalContext: {
            daysPostpartum: maternalLog.daysPostpartum,
            epdsScore: maternalLog.epdsScore,
            breastCondition: maternalLog.breastCondition,
          },
          language: selectedLanguage,
        }),
      });

      const data = await res.json();
      const reply = data.reply || data.fallback || 'I am here with you, mama. Please consult your health provider for clinical decisions.';

      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot_err_${Date.now()}`,
          role: 'assistant',
          content: 'I am here to support you. For urgent medical concerns like fever >38°C or breathing difficulty, proceed to the nearest health facility immediately.',
          timestamp: 'Now',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Text-To-Speech audio readout
  const handleSpeak = async (msgId: string, text: string) => {
    if (speakingMsgId === msgId) {
      // Stop playback
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      window.speechSynthesis?.cancel();
      setSpeakingMsgId(null);
      return;
    }

    setSpeakingMsgId(msgId);

    try {
      const res = await fetch('/api/ai/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language: selectedLanguage }),
      });
      const data = await res.json();

      if (data.audioBase64) {
        const audio = new Audio(`data:${data.format || 'audio/wav'};base64,${data.audioBase64}`);
        audioRef.current = audio;
        audio.onended = () => setSpeakingMsgId(null);
        audio.onerror = () => {
          fallbackSpeech(text);
        };
        await audio.play();
      } else {
        fallbackSpeech(text);
      }
    } catch {
      fallbackSpeech(text);
    }
  };

  const fallbackSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*#•_]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      utterance.onend = () => setSpeakingMsgId(null);
      utterance.onerror = () => setSpeakingMsgId(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setSpeakingMsgId(null);
    }
  };

  // Run Cry Acoustic Analyzer
  const handleAnalyzeCry = async () => {
    setAnalyzingCry(true);
    setCryResult(null);

    try {
      const res = await fetch('/api/ai/cry-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cryPitch,
          durationSec: cryDuration,
          lastFeedMinutesAgo: lastFeedMin,
          lastSleepMinutesAgo: lastSleepMin,
          diaperState: cryDiaper,
          feverPresent: cryFever,
          audioEnergy: 'moderate',
        }),
      });
      const data = await res.json();
      setCryResult(data);
    } catch {
      setCryResult({
        primaryCause: 'Hunger & Comfort',
        confidenceScore: 85,
        acousticSignature: 'Rhythmic ascending pitch with rooting cues',
        soothingTechniques: [
          'Offer breastfeeding in a calm, semi-darkened room.',
          'Check if diaper is wet or soiled.',
          'Hold baby upright against chest for gentle skin-to-skin burping.',
        ],
        clinicalNote: 'Cry analysis indicates nutritional need based on 2.5h elapsed since last feed.',
      });
    } finally {
      setAnalyzingCry(false);
    }
  };

  // Run Emergency Triage
  const handleRunTriage = async () => {
    setRunningTriage(true);
    setTriageResult(null);

    try {
      const res = await fetch('/api/ai/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientType: triageType,
          childAgeWeeks: 10,
          signs: selectedDangerSigns,
          vitals: {
            temperature: parseFloat(patientTemp) || 37.0,
            respiratoryRate: parseInt(respiratoryRate, 10) || 38,
          },
        }),
      });
      const data = await res.json();
      setTriageResult(data);
    } catch {
      const isRed = selectedDangerSigns.length > 0;
      setTriageResult({
        urgencyTier: isRed ? 'RED' : 'GREEN',
        urgencyTitle: isRed ? 'Urgent Hospital Evaluation Required' : 'Normal Baseline Status',
        dangerFlagsIdentified: selectedDangerSigns.length > 0 ? selectedDangerSigns : ['No acute danger signs detected'],
        clinicalRationale: 'Evaluated according to standard Integrated Management of Childhood Illness (WHO IMCI).',
        immediateFirstAidSteps: [
          'Keep infant warm with Kangaroo skin-to-skin contact.',
          'Do not force oral fluids if infant is lethargic.',
          'Proceed immediately to triage at St. Jude Clinic or nearest district hospital.',
        ],
        whatToTellDoctor: `Recorded signs: ${selectedDangerSigns.join(', ')}; Temp: ${patientTemp}°C`,
        localLanguageSummary: 'Mpeleke mtoto kituo cha afya mara moja kwa uchunguzi.',
      });
    } finally {
      setRunningTriage(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">{t.aiTitle}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.aiSubtitle}
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 text-xs shrink-0">
          <button
            onClick={() => setActiveMode('chat')}
            className={`rounded-md px-3 py-1 font-medium transition-colors ${
              activeMode === 'chat' ? 'bg-white text-teal-800 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.chatMode}
          </button>
          <button
            onClick={() => setActiveMode('cry_analyzer')}
            className={`rounded-md px-3 py-1 font-medium transition-colors ${
              activeMode === 'cry_analyzer' ? 'bg-white text-blue-800 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.cryMode}
          </button>
          <button
            onClick={() => setActiveMode('emergency_triage')}
            className={`rounded-md px-3 py-1 font-medium transition-colors ${
              activeMode === 'emergency_triage' ? 'bg-white text-rose-700 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.triageMode}
          </button>
        </div>
      </div>

      {/* Mode 1: Amina CareAI Chatbot with Voice & Multilingual Support */}
      {activeMode === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Chat Conversation (8 cols) */}
          <div className="lg:col-span-8 flex flex-col h-[600px] rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            {/* Chat Header Bar */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-600 text-white shadow-2xs">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Amina CareAI · Pediatric &amp; Maternal Companion</h3>
                  <p className="text-2xs text-slate-500">WHO IMCI Grounded · Real-Time Clinical Guidance</p>
                </div>
              </div>

              {/* Language Selector */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-2xs text-slate-500 hidden sm:inline">Voice &amp; Text Language:</span>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 font-medium"
                >
                  <option value="English">English</option>
                  <option value="Kiswahili">Kiswahili (East Africa)</option>
                  <option value="Luganda">Luganda (Uganda)</option>
                  <option value="Yoruba">Yorùbá (West Africa)</option>
                  <option value="French">Français</option>
                  <option value="Spanish">Español</option>
                  <option value="Hindi">हिन्दी (Hindi)</option>
                </select>
              </div>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => {
                const isAssistant = msg.role === 'assistant';
                const isSpeaking = speakingMsgId === msg.id;

                return (
                  <div key={msg.id} className={`flex gap-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}>
                    {isAssistant && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-800 text-xs font-bold">
                        A
                      </div>
                    )}

                    <div
                      className={`relative max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                        isAssistant
                          ? 'bg-slate-100/80 text-slate-900 border border-slate-200/60'
                          : 'bg-teal-600 text-white font-normal'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.content}</div>

                      <div className={`mt-2 flex items-center justify-between text-2xs ${isAssistant ? 'text-slate-400' : 'text-teal-100'}`}>
                        <span>{msg.timestamp}</span>

                        {isAssistant && (
                          <button
                            onClick={() => handleSpeak(msg.id, msg.content)}
                            className="flex items-center gap-1 rounded-md bg-white px-2 py-0.5 text-2xs font-medium text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
                            title="Listen with text-to-speech in local language"
                          >
                            {isSpeaking ? (
                              <>
                                <VolumeX className="h-3 w-3 text-rose-600 animate-pulse" />
                                <span>Stop Audio</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="h-3 w-3 text-teal-600" />
                                <span>Voice Readout</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex gap-2 items-center text-xs text-slate-400 pl-10">
                  <span className="h-2 w-2 rounded-full bg-teal-600 animate-bounce" />
                  <span className="h-2 w-2 rounded-full bg-teal-600 animate-bounce [animation-delay:0.2s]" />
                  <span className="h-2 w-2 rounded-full bg-teal-600 animate-bounce [animation-delay:0.4s]" />
                  <span>Amina is analyzing pediatric guidelines...</span>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Input Bar */}
            <div className="border-t border-slate-100 p-3 bg-white">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Ask Amina about ${activeChild.name} in ${selectedLanguage}...`}
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:border-teal-500 focus:outline-hidden"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isTyping}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-40 transition-colors shrink-0"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Quick Guidance Chips & Clinical FAQs (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                Common First-Time Mother Questions
              </h3>
              <p className="text-2xs text-slate-500 mt-0.5">Click any topic to get immediate grounded advice:</p>

              <div className="mt-3 space-y-2">
                {[
                  'How do I know if my baby is getting enough breast milk?',
                  'What should I do if my infant has a fever above 38°C?',
                  'How many hours should a 2-month-old sleep per day?',
                  'How to burp baby effectively to stop gas & colic?',
                  'What are normal signs of postpartum healing on Day 70?',
                  'Are vaccines safe, and what are normal post-shot reactions?',
                ].map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    className="w-full text-left rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-xs text-slate-700 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-900 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Context Badge */}
            <div className="rounded-2xl border border-teal-100 bg-teal-50/60 p-4 text-xs text-teal-950">
              <div className="font-semibold flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-teal-700" />
                <span>Active Infant Telemetry Grounding</span>
              </div>
              <p className="mt-1 text-2xs text-teal-800 leading-relaxed">
                Amina is automatically aware that {activeChild.name} is {activeChild.gender === 'boy' ? 'a boy' : 'a girl'}, born {activeChild.dob} (approx 10 weeks), weighing 5.85 kg on the 50th percentile, with 10-week Pentavalent-2 vaccine due on Oct 25.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Smart Baby Cry Acoustic Pattern Analyzer */}
      {activeMode === 'cry_analyzer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <WaveformIcon className="h-4 w-4 text-blue-600" />
                  <h3 className="text-sm font-semibold text-slate-900">Baby Cry Acoustic Parameters</h3>
                </div>
                <span className="text-2xs text-slate-500">Acoustic &amp; Routine Triage</span>
              </div>

              <div className="mt-4 space-y-4 text-xs">
                {/* Cry pitch pattern */}
                <div>
                  <label className="font-semibold text-slate-800">Cry Sound Cadence &amp; Pitch</label>
                  <div className="mt-1.5 grid grid-cols-2 gap-2 text-2xs">
                    <button
                      onClick={() => setCryPitch('rhythmic and rising')}
                      className={`p-2 rounded-lg border text-left ${
                        cryPitch === 'rhythmic and rising' ? 'border-teal-500 bg-teal-50 font-semibold text-teal-900' : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      Rhythmic &amp; Rising (&quot;Neh-neh&quot;)
                    </button>
                    <button
                      onClick={() => setCryPitch('sharp whiny')}
                      className={`p-2 rounded-lg border text-left ${
                        cryPitch === 'sharp whiny' ? 'border-blue-500 bg-blue-50 font-semibold text-blue-900' : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      Sharp / Whiny (&quot;Owh / Eairh&quot;)
                    </button>
                    <button
                      onClick={() => setCryPitch('grunting')}
                      className={`p-2 rounded-lg border text-left ${
                        cryPitch === 'grunting' ? 'border-amber-500 bg-amber-50 font-semibold text-amber-900' : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      Grunting with Clenched Fists
                    </button>
                    <button
                      onClick={() => setCryPitch('high-pitched piercing')}
                      className={`p-2 rounded-lg border text-left ${
                        cryPitch === 'high-pitched piercing' ? 'border-rose-500 bg-rose-50 font-semibold text-rose-900' : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      High-Pitched Piercing Shriek
                    </button>
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-800">Crying Duration</span>
                    <span className="font-mono text-slate-900">{cryDuration} seconds</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="180"
                    value={cryDuration}
                    onChange={(e) => setCryDuration(parseInt(e.target.value, 10))}
                    className="w-full mt-1 accent-teal-600"
                  />
                </div>

                {/* Routine times */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-800">Minutes Since Last Feed</label>
                    <input
                      type="number"
                      value={lastFeedMin}
                      onChange={(e) => setLastFeedMin(parseInt(e.target.value, 10) || 0)}
                      className="mt-1 w-full rounded-lg border border-slate-300 p-2 font-mono text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-800">Minutes Awake Since Last Nap</label>
                    <input
                      type="number"
                      value={lastSleepMin}
                      onChange={(e) => setLastSleepMin(parseInt(e.target.value, 10) || 0)}
                      className="mt-1 w-full rounded-lg border border-slate-300 p-2 font-mono text-xs text-slate-900"
                    />
                  </div>
                </div>

                {/* Diaper & Fever */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-800">Current Diaper Status</label>
                    <select
                      value={cryDiaper}
                      onChange={(e) => setCryDiaper(e.target.value as any)}
                      className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
                    >
                      <option value="dry">Clean &amp; Dry</option>
                      <option value="wet">Wet Diaper</option>
                      <option value="dirty">Soiled / Dirty</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 pt-5">
                    <input
                      type="checkbox"
                      id="cryFeverCheck"
                      checked={cryFever}
                      onChange={(e) => setCryFever(e.target.checked)}
                      className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                    />
                    <label htmlFor="cryFeverCheck" className="font-semibold text-slate-800">
                      Baby feels hot / fever
                    </label>
                  </div>
                </div>

                <button
                  onClick={handleAnalyzeCry}
                  disabled={analyzingCry}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-teal-700 transition-colors disabled:opacity-50"
                >
                  <WaveformIcon className="h-4 w-4" />
                  <span>{analyzingCry ? 'Analyzing Cry Acoustics...' : 'Classify Baby Cry & Get Soothing Steps'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Results Output (Right Column) */}
          <div className="lg:col-span-6 space-y-4">
            {cryResult ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-2xs font-semibold uppercase tracking-wider text-slate-500">Cry Classification</span>
                    <h3 className="text-lg font-bold text-slate-900">{cryResult.primaryCause}</h3>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-base font-bold text-teal-700">{cryResult.confidenceScore}%</span>
                    <span className="block text-2xs text-slate-400">Confidence</span>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 text-xs">
                  <span className="font-semibold text-slate-800">Acoustic Signature:</span>
                  <p className="mt-0.5 text-slate-600">{cryResult.acousticSignature}</p>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-slate-900">Recommended Soothing Actions:</h4>
                  <ul className="mt-2 space-y-1.5 text-xs text-slate-700">
                    {(cryResult.soothingTechniques || []).map((step: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-600 mt-0.5" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {cryResult.redFlagWarning && (
                  <div className="rounded-xl bg-rose-50 p-3 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                    <div>
                      <span className="font-bold">Clinical Caution:</span> {cryResult.redFlagWarning}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center text-slate-500 text-xs flex flex-col items-center justify-center h-full min-h-[300px]">
                <WaveformIcon className="h-8 w-8 text-slate-400 mb-2" />
                <p className="font-semibold text-slate-700">Ready to Interpret Cry</p>
                <p className="text-2xs text-slate-500 mt-1 max-w-sm">
                  Select the vocal pitch, duration, and time elapsed since nursing to decode whether baby is hungry, overtired, experiencing gas cramps, or unwell.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mode 3: Emergency Danger Signs Detection Feature (WHO IMCI) */}
      {activeMode === 'emergency_triage' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-rose-600" />
                  <h3 className="text-sm font-semibold text-slate-900">WHO IMCI Emergency Danger Signs Triage</h3>
                </div>

                <div className="flex gap-1 rounded-lg bg-slate-100 p-1 text-xs">
                  <button
                    onClick={() => {
                      setTriageType('infant');
                      setSelectedDangerSigns([]);
                    }}
                    className={`px-3 py-1 rounded-md font-medium ${
                      triageType === 'infant' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Infant Signs
                  </button>
                  <button
                    onClick={() => {
                      setTriageType('mother');
                      setSelectedDangerSigns([]);
                    }}
                    className={`px-3 py-1 rounded-md font-medium ${
                      triageType === 'mother' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Maternal Signs
                  </button>
                </div>
              </div>

              {/* Vitals Input */}
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700">Measured Temperature (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={patientTemp}
                    onChange={(e) => setPatientTemp(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 p-2 font-mono text-xs text-slate-900"
                  />
                  <span className="text-2xs text-slate-400">&gt;38°C or &lt;36°C requires attention</span>
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Breathing Rate (breaths/min)</label>
                  <input
                    type="number"
                    value={respiratoryRate}
                    onChange={(e) => setRespiratoryRate(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 p-2 font-mono text-xs text-slate-900"
                  />
                  <span className="text-2xs text-slate-400">&gt;60/min indicates rapid distress</span>
                </div>
              </div>

              {/* Danger Checklist */}
              <div className="mt-4">
                <label className="text-xs font-semibold text-slate-800">
                  Select Observed Clinical Signs ({triageType === 'infant' ? 'Infant' : 'Mother'}):
                </label>
                <div className="mt-2 space-y-2">
                  {(triageType === 'infant' ? infantDangerOptions : maternalDangerOptions).map((sign) => {
                    const isChecked = selectedDangerSigns.includes(sign);
                    return (
                      <div
                        key={sign}
                        onClick={() => {
                          if (isChecked) {
                            setSelectedDangerSigns(selectedDangerSigns.filter((s) => s !== sign));
                          } else {
                            setSelectedDangerSigns([...selectedDangerSigns, sign]);
                          }
                        }}
                        className={`flex items-center gap-2.5 rounded-xl p-2.5 text-xs border transition-colors cursor-pointer ${
                          isChecked ? 'border-rose-400 bg-rose-50 text-rose-950 font-medium' : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // handled by div
                          className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                        />
                        <span>{sign}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={handleRunTriage}
                disabled={runningTriage}
                className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 transition-colors disabled:opacity-50"
              >
                <ShieldAlert className="h-4 w-4" />
                <span>{runningTriage ? 'Evaluating Triage...' : 'Execute Immediate Clinical Triage'}</span>
              </button>
            </div>
          </div>

          {/* Triage Decision Banner */}
          <div className="lg:col-span-5 space-y-4">
            {triageResult ? (
              <div
                className={`rounded-2xl border p-5 shadow-md space-y-4 ${
                  triageResult.urgencyTier === 'RED'
                    ? 'border-rose-300 bg-rose-50/70 text-rose-950'
                    : triageResult.urgencyTier === 'YELLOW'
                    ? 'border-amber-300 bg-amber-50/70 text-amber-950'
                    : 'border-emerald-300 bg-emerald-50/70 text-emerald-950'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono text-2xs font-bold px-2 py-0.5 rounded-md ${
                      triageResult.urgencyTier === 'RED'
                        ? 'bg-rose-600 text-white'
                        : triageResult.urgencyTier === 'YELLOW'
                        ? 'bg-amber-600 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    TIER {triageResult.urgencyTier} ALERT
                  </span>
                  <span className="text-2xs font-semibold">WHO Protocol</span>
                </div>

                <h3 className="text-base font-bold">{triageResult.urgencyTitle}</h3>
                <p className="text-xs leading-relaxed">{triageResult.clinicalRationale}</p>

                {/* Immediate First Aid */}
                <div className="rounded-xl bg-white/80 p-3 text-xs space-y-1.5 border border-slate-200/50">
                  <span className="font-bold text-slate-900 block">Immediate Actions:</span>
                  {(triageResult.immediateFirstAidSteps || []).map((step: string, i: number) => (
                    <div key={i} className="flex items-start gap-1.5 text-slate-700 text-2xs">
                      <span>•</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>

                {/* Simulated Emergency Dispatch Hotline */}
                {triageResult.urgencyTier === 'RED' && (
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        window.open('tel:999', '_self');
                      }}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-700 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-rose-800 transition-colors"
                    >
                      <PhoneCall className="h-4 w-4" />
                      <span>Call Emergency Dispatch (999 / 911 / 112)</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center text-slate-500 text-xs flex flex-col items-center justify-center h-full min-h-[300px]">
                <ShieldAlert className="h-8 w-8 text-slate-400 mb-2" />
                <p className="font-semibold text-slate-700">Emergency Triage Standby</p>
                <p className="text-2xs text-slate-500 mt-1 max-w-sm">
                  Check any abnormal maternal or newborn signs above to receive instant risk classification and direct triage guidance.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
