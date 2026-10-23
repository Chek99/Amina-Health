import {
  ChildProfile,
  GrowthRecord,
  VaccineRecord,
  DailyCareLog,
  MaternalHealthLog,
  MilestoneItem,
  HospitalAppointment,
  ClinicalEncounter,
  EducationArticle,
  SmsLog,
} from '../types';
import { generateSmartVaccinationSchedule } from './vaccineSchedule';

export const INITIAL_CHILDREN: ChildProfile[] = [
  {
    id: 'child_1',
    name: 'Leo Ochieng',
    gender: 'boy',
    dob: '2026-08-12', // approx 10 weeks old
    birthWeightKg: 3.3,
    birthHeightCm: 50.2,
    birthHeadCircCm: 34.8,
    gestationalAgeWeeks: 39,
    apgarScore: '9/10 (1min: 8, 5min: 9)',
    deliveryType: 'Spontaneous Vaginal Delivery',
    bloodGroup: 'O+',
    allergies: ['No known drug/food allergies'],
    emergencyContact: {
      name: 'Grace Ochieng (Mother)',
      relationship: 'Mother',
      phone: '+254 712 345 678',
    },
    paperBookletNumber: 'MOH-CW-2026-8941',
    clinicAssigned: 'St. Jude Maternal & Child Health Clinic, Nairobi West',
    notes: 'Born vigorous, cried immediately at birth. Exclusive breastfeeding initiated within 45 minutes.',
    isTwin: true,
    twinId: 'child_2',
  },
  {
    id: 'child_2',
    name: 'Maya Ochieng (Twin B)',
    gender: 'girl',
    dob: '2026-08-12',
    birthWeightKg: 2.85,
    birthHeightCm: 48.6,
    birthHeadCircCm: 33.9,
    gestationalAgeWeeks: 39,
    apgarScore: '9/10 (1min: 8, 5min: 9)',
    deliveryType: 'Spontaneous Vaginal Delivery',
    bloodGroup: 'O+',
    allergies: ['No known drug/food allergies'],
    emergencyContact: {
      name: 'Grace Ochieng (Mother)',
      relationship: 'Mother',
      phone: '+254 712 345 678',
    },
    paperBookletNumber: 'MOH-CW-2026-8942',
    clinicAssigned: 'St. Jude Maternal & Child Health Clinic, Nairobi West',
    notes: 'Twin B delivered 14 minutes after Twin A. Vigorous cry, latching well.',
    isTwin: true,
    twinId: 'child_1',
  },
];

export const INITIAL_GROWTH_RECORDS: GrowthRecord[] = [
  // Leo (Child 1)
  {
    id: 'gr_1_0',
    childId: 'child_1',
    date: '2026-08-12',
    ageInMonths: 0,
    weightKg: 3.3,
    heightCm: 50.2,
    headCircCm: 34.8,
    bmi: 13.1,
    recordedBy: 'Nurse Grace - Delivery Ward',
    clinicVerified: true,
    notes: 'Birth assessment baseline. Normal reflexes.',
  },
  {
    id: 'gr_1_2w',
    childId: 'child_1',
    date: '2026-08-26',
    ageInMonths: 0.5,
    weightKg: 3.65,
    heightCm: 52.0,
    headCircCm: 35.8,
    bmi: 13.5,
    recordedBy: 'Mother Grace (Home Digital Scale)',
    clinicVerified: false,
    notes: 'Regained birth weight smoothly, feeding every 2-3 hours.',
  },
  {
    id: 'gr_1_6w',
    childId: 'child_1',
    date: '2026-09-23',
    ageInMonths: 1.5,
    weightKg: 4.8,
    heightCm: 56.4,
    headCircCm: 37.9,
    bmi: 15.1,
    recordedBy: 'Nurse Sister Mary Mwangi - Clinic',
    clinicVerified: true,
    notes: '6-week EPI visit. Growth velocity optimal on 50th percentile curve.',
  },
  {
    id: 'gr_1_10w',
    childId: 'child_1',
    date: '2026-10-21',
    ageInMonths: 2.3,
    weightKg: 5.85,
    heightCm: 59.8,
    headCircCm: 39.6,
    bmi: 16.3,
    recordedBy: 'Nurse Sister Mary Mwangi - Clinic',
    clinicVerified: true,
    notes: '10-week review. Muscle tone strong, tracks toys with eyes.',
  },

  // Maya (Child 2 - Twin)
  {
    id: 'gr_2_0',
    childId: 'child_2',
    date: '2026-08-12',
    ageInMonths: 0,
    weightKg: 2.85,
    heightCm: 48.6,
    headCircCm: 33.9,
    bmi: 12.1,
    recordedBy: 'Nurse Grace - Delivery Ward',
    clinicVerified: true,
    notes: 'Birth assessment. Mildly lower birth weight than Twin A, warm incubator care 2 hrs.',
  },
  {
    id: 'gr_2_6w',
    childId: 'child_2',
    date: '2026-09-23',
    ageInMonths: 1.5,
    weightKg: 4.3,
    heightCm: 54.8,
    headCircCm: 36.8,
    bmi: 14.3,
    recordedBy: 'Nurse Sister Mary Mwangi - Clinic',
    clinicVerified: true,
    notes: 'Strong catch-up growth noted, exclusively breastfed.',
  },
  {
    id: 'gr_2_10w',
    childId: 'child_2',
    date: '2026-10-21',
    ageInMonths: 2.3,
    weightKg: 5.25,
    heightCm: 58.1,
    headCircCm: 38.7,
    bmi: 15.5,
    recordedBy: 'Nurse Sister Mary Mwangi - Clinic',
    clinicVerified: true,
    notes: 'Alert, smiling responsively, symmetric arm movements.',
  },
];

export const INITIAL_VACCINES_LEO: VaccineRecord[] = generateSmartVaccinationSchedule(
  'child_1',
  '2026-08-12',
  ['BCG', 'OPV_0', 'HEPB_0', 'PENTA_1', 'OPV_1', 'PCV_1', 'ROTA_1']
);

export const INITIAL_VACCINES_MAYA: VaccineRecord[] = generateSmartVaccinationSchedule(
  'child_2',
  '2026-08-12',
  ['BCG', 'OPV_0', 'HEPB_0', 'PENTA_1', 'OPV_1', 'PCV_1', 'ROTA_1']
);

export const INITIAL_DAILY_LOG: DailyCareLog = {
  id: 'log_today',
  childId: 'child_1',
  date: '2026-10-23',
  feedings: [
    {
      id: 'feed_1',
      time: '02:30 AM',
      type: 'breast_left',
      durationMinutes: 18,
      notes: 'Baby fed calmly and slept right away',
    },
    {
      id: 'feed_2',
      time: '06:15 AM',
      type: 'both_breasts',
      durationMinutes: 24,
      notes: 'Good latch on both sides',
    },
    {
      id: 'feed_3',
      time: '09:40 AM',
      type: 'breast_right',
      durationMinutes: 15,
      notes: 'Burped twice after feeding',
    },
    {
      id: 'feed_4',
      time: '01:10 PM',
      type: 'pumped_milk',
      amountMl: 90,
      notes: 'Expressed breast milk given via cup',
    },
  ],
  diapers: [
    {
      id: 'diaper_1',
      time: '02:45 AM',
      type: 'wet',
      rashPresent: false,
    },
    {
      id: 'diaper_2',
      time: '06:30 AM',
      type: 'both',
      stoolColor: 'mustard_yellow',
      consistency: 'normal_seedy',
      rashPresent: false,
    },
    {
      id: 'diaper_3',
      time: '10:00 AM',
      type: 'wet',
      rashPresent: false,
    },
    {
      id: 'diaper_4',
      time: '01:30 PM',
      type: 'wet',
      rashPresent: false,
    },
  ],
  sleepSessions: [
    {
      id: 'sleep_1',
      startTime: '10:30 PM',
      endTime: '02:20 AM',
      durationMinutes: 230,
      quality: 'restful',
    },
    {
      id: 'sleep_2',
      startTime: '03:00 AM',
      endTime: '06:00 AM',
      durationMinutes: 180,
      quality: 'restful',
    },
    {
      id: 'sleep_3',
      startTime: '07:15 AM',
      endTime: '08:45 AM',
      durationMinutes: 90,
      quality: 'interrupted',
    },
    {
      id: 'sleep_4',
      startTime: '10:30 AM',
      endTime: '12:00 PM',
      durationMinutes: 90,
      quality: 'restful',
    },
  ],
  tummyTimeMinutes: 18,
  temperature: 36.8,
  milestoneObserved: 'Held chest off playmat for 15 seconds during tummy time!',
  dailyNotes: 'Very cheerful morning. Enjoyed looking at high-contrast black-and-white picture cards.',
};

export const INITIAL_MATERNAL_LOG: MaternalHealthLog = {
  id: 'mat_today',
  date: '2026-10-23',
  daysPostpartum: 72,
  lochiaStage: 'alba (white/yellow)',
  bleedingIntensity: 'spotting',
  perinealOrCSectionPain: 1,
  woundHealingCondition: 'clean & healing well',
  breastCondition: 'comfortable',
  hydrationGlasses: 8,
  sleepHours: 6.5,
  energyLevel: 'normal',
  moodRating: 'calm',
  epdsScore: 4, // low risk for depression
  notes: 'Feeling physically stronger each week. Taking postnatal iron and calcium supplements regularly.',
};

export const INITIAL_MILESTONES: MilestoneItem[] = [
  {
    id: 'ms_1',
    category: 'gross_motor',
    expectedAgeMonths: 1,
    title: 'Lifts Head Briefly When on Tummy',
    description: 'Turns head from side to side while lying on stomach.',
    achievedDate: '2026-09-02',
    isAchieved: true,
  },
  {
    id: 'ms_2',
    category: 'social_emotional',
    expectedAgeMonths: 2,
    title: 'Responsive Social Smile',
    description: 'Smiles spontaneously in response to mother talking or smiling.',
    achievedDate: '2026-09-28',
    isAchieved: true,
  },
  {
    id: 'ms_3',
    category: 'speech_language',
    expectedAgeMonths: 2,
    title: 'Vocalizes Coos and Vowel Sounds',
    description: 'Makes soft "ooh" and "aah" sounds when spoken to.',
    achievedDate: '2026-10-05',
    isAchieved: true,
  },
  {
    id: 'ms_4',
    category: 'cognitive',
    expectedAgeMonths: 2,
    title: 'Visual Tracking of Moving Faces/Objects',
    description: 'Follows colorful toys or parents face past the midline (180 degrees).',
    achievedDate: '2026-10-14',
    isAchieved: true,
  },
  {
    id: 'ms_5',
    category: 'fine_motor',
    expectedAgeMonths: 3,
    title: 'Brings Hands to Mouth and Clasps Fingers',
    description: 'Discovers hands, clasps them together at midline, and sucks fingers.',
    isAchieved: false,
  },
  {
    id: 'ms_6',
    category: 'gross_motor',
    expectedAgeMonths: 4,
    title: 'Holds Head Steady Without Support',
    description: 'Maintains upright head control when held in sitting position.',
    isAchieved: false,
  },
  {
    id: 'ms_7',
    category: 'social_emotional',
    expectedAgeMonths: 4,
    title: 'Laughs Out Loud',
    description: 'Chuckles or giggles during gentle tickling or peek-a-boo play.',
    isAchieved: false,
  },
];

export const INITIAL_APPOINTMENTS: HospitalAppointment[] = [
  {
    id: 'apt_1',
    childId: 'child_1',
    title: '10-Week Child Immunization & Growth Audit',
    doctorName: 'Dr. Angela Waweru (Pediatrician) & Nurse Mary Mwangi',
    facility: 'St. Jude Maternal & Child Health Clinic, Nairobi West',
    date: '2026-10-25',
    time: '09:30 AM',
    status: 'scheduled',
    purpose: 'routine_immunization',
    notes: 'Doses scheduled: Penta-2, PCV-2, Rota-2, OPV-2. Bring MOH Mother-Child Health Handbook.',
  },
  {
    id: 'apt_2',
    childId: 'child_1',
    title: 'Maternal 12-Week Postpartum Well-Woman Check',
    doctorName: 'Dr. Susan Kiprono (Obstetrician/Gynecologist)',
    facility: 'St. Jude Women’s Pavilion',
    date: '2026-11-04',
    time: '11:00 AM',
    status: 'scheduled',
    purpose: 'postnatal_maternal',
    notes: 'Pelvic floor assessment, blood pressure screen, family planning consultation.',
  },
];

export const INITIAL_CLINICAL_ENCOUNTERS: ClinicalEncounter[] = [
  {
    id: 'enc_1',
    childId: 'child_1',
    date: '2026-09-23',
    clinicianName: 'Dr. Angela Waweru, MBChB, MMed (Pediatrics)',
    cadre: 'Pediatrician',
    facility: 'St. Jude Maternal & Child Health Clinic',
    vitals: {
      weightKg: 4.8,
      heightCm: 56.4,
      tempCelsius: 36.7,
      respiratoryRateBpm: 38,
      heartRateBpm: 128,
      muacMm: 115,
    },
    clinicalFindings: 'Well-nourished male infant. Anterior fontanelle soft and flat. Clear breath sounds bilaterally, heart sounds S1 S2 normal with no murmurs. Abdomen soft, no organomegaly. Femoral pulses strong.',
    diagnosis: 'Healthy 6-week infant well-child milestone visit. Satisfactory weight trajectory.',
    prescriptions: [
      { medicine: 'Vitamin D3 Drops (Cholecalciferol)', dosage: '400 IU (1 drop)', frequency: 'Once daily', duration: 'Ongoing' },
      { medicine: 'Paracetamol Pediatric Drops 100mg/ml', dosage: '0.6 ml', frequency: 'PRN for fever >38°C after immunization', duration: 'As needed for 48h' },
    ],
    officialPaperBookletStamped: true,
    stampId: 'ST-JUDE-MCH-STAMP-#9412-VERIFIED',
  },
];

export const INITIAL_EDUCATION_ARTICLES: EducationArticle[] = [
  {
    id: 'edu_1',
    title: 'Essential Newborn Umbilical Cord Hygiene & Care',
    category: 'Newborn Care',
    readingTimeMin: 3,
    summary: 'WHO-recommended dry cord care methods, chlorhexidine application guidelines, and how to spot infection early.',
    bodyParagraphs: [
      'The umbilical cord stump typically falls off naturally within 7 to 21 days after birth. The gold standard recommended by the World Health Organization is dry cord care in hygienic environments.',
      'Keep the cord stump clean, dry, and exposed to air. When diapering baby, fold down the top of the diaper below the navel so the stump stays dry and does not touch urine or stool.',
      'Never apply cow dung, ash, herbal pastes, or cooking oil to the stump. In high-infection community settings, 7.1% chlorhexidine digluconate gel may be prescribed by your midwife for the first week.'
    ],
    keyTips: [
      'Clean only with boiled, cooled water if soiled; dry gently with clean gauze.',
      'Fold the front of the diaper below the stump.',
      'Watch for danger signs: foul odor, yellow pus, or redness spreading onto belly skin.'
    ],
    localAudioText: 'Habari mama! Kuhusu kitovu cha mtoto, kiweke safi na kikavu wakati wote. Usiweke mafuta au majivu.',
    iconName: 'ShieldCheck',
  },
  {
    id: 'edu_2',
    title: 'Latching Mastery & Exclusive Breastfeeding (0–6 Months)',
    category: 'Breastfeeding & Nutrition',
    readingTimeMin: 4,
    summary: 'Positioning techniques for a painless, deep latch, boosting milk supply, and recognizing fullness cues.',
    bodyParagraphs: [
      'Exclusive breastfeeding means feeding the infant ONLY breast milk with no other liquids, water, or porridge for the first 6 completed months of life.',
      'A deep latch is key to preventing cracked nipples and ensuring adequate milk transfer. Wait until baby opens mouth wide like a yawn, then bring baby quickly to breast with chin touching first and lower lip curled outward.',
      'Frequent feeding (8 to 12 times in 24 hours) stimulates the release of prolactin and oxytocin, naturally regulating your milk supply to match your baby\'s exact appetite.'
    ],
    keyTips: [
      'Tummy-to-tummy position: baby\'s nose opposite your nipple.',
      'Look for wide jaw movements and rhythmic swallowing pauses.',
      'Baby should produce 6 or more pale, clear wet diapers daily.'
    ],
    localAudioText: 'Kunyonyesha mtoto maziwa ya mama pekee kwa miezi sita ya kwanza bila maji wala chakula chochote humlinda mtoto na magonjwa.',
    iconName: 'HeartHandshake',
  },
  {
    id: 'edu_3',
    title: 'Recognizing SIDS Risks & Safe Infant Sleep Rules',
    category: 'Hygiene & Safety',
    readingTimeMin: 3,
    summary: 'The ABCs of safe sleep: Alone, on their Back, in a safe Crib. Protecting your infant from sudden sleep risks.',
    bodyParagraphs: [
      'Sudden Infant Death Syndrome (SIDS) is significantly reduced when parents adhere to evidence-based sleep architecture.',
      'Always place your baby on their BACK to sleep for every sleep session—both naps and nighttime. The back sleeping position keeps the trachea above the esophagus, preventing aspiration.',
      'Use a firm, flat mattress with a fitted sheet. Never place pillows, plush toys, loose blankets, or bumper pads inside the crib.'
    ],
    keyTips: [
      'Back to sleep for every sleep.',
      'Share a room, not a bed: keep baby\'s bassinet right next to parents\' bed for the first 6 months.',
      'Avoid overheating: dress baby in only one more layer than an adult would wear comfortably.'
    ],
    localAudioText: 'Mweke mtoto kulala chali mgongoni wakati wote. Usiweke mito au blanketi nzito kitandani.',
    iconName: 'Moon',
  },
  {
    id: 'edu_4',
    title: 'Understanding Postpartum Mood Changes & Baby Blues vs PPD',
    category: 'Maternal Recovery',
    readingTimeMin: 4,
    summary: 'Compassionate guidance on hormonal transitions, the Edinburgh Postnatal Depression Scale, and getting support.',
    bodyParagraphs: [
      'Up to 80% of mothers experience the "baby blues" in the first 2 weeks after birth—feeling tearful, tired, and emotionally vulnerable due to sudden estrogen and progesterone drops.',
      'If sadness, severe anxiety, feelings of inadequacy, or emotional detachment persist beyond 2 to 3 weeks, it may be Postpartum Depression (PPD). PPD is a treatable medical condition, never a personal failure.',
      'Partners, family, and healthcare workers can provide crucial emotional validation and practical respite care.'
    ],
    keyTips: [
      'Take the 10-question EPDS screening in your Mother Journal.',
      'Prioritize small resting intervals when baby sleeps.',
      'Speak openly to your nurse or doctor without shame—help is readily available.'
    ],
    localAudioText: 'Kujisikia huzuni au uchovu mwingi baada ya kujifungua ni jambo la kawaida kwa sababu ya mabadiliko ya homoni. Usikae peke yako, omba msaada.',
    iconName: 'Smile',
  },
];

export const INITIAL_SMS_LOGS: SmsLog[] = [
  {
    id: 'sms_1',
    phone: '+254 712 345 678',
    messageType: 'vaccine_due',
    body: '[MOH Alert] Jambo mama Grace! Reminder: Leo is due for Pentavalent-2 & PCV-2 vaccines on Oct 25, 2026 at St. Jude Clinic. Please carry the Child Health Booklet.',
    timestamp: '2026-10-22 08:30 AM',
    status: 'Delivered',
    carrier: 'Safaricom GSM Gateway',
  },
  {
    id: 'sms_2',
    phone: '+254 712 345 678',
    messageType: 'wellness_check',
    body: '[Smart Care] Hello Mama! Remember to drink at least 8 glasses of water today and record baby feeding times in your digital journal. You are doing an amazing job!',
    timestamp: '2026-10-23 09:00 AM',
    status: 'Delivered',
    carrier: 'Safaricom GSM Gateway',
  },
];
