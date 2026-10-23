export type Gender = 'boy' | 'girl';

export interface ChildProfile {
  id: string;
  name: string;
  gender: Gender;
  dob: string; // ISO format YYYY-MM-DD
  birthWeightKg: number;
  birthHeightCm: number;
  birthHeadCircCm: number;
  gestationalAgeWeeks: number;
  apgarScore: string; // e.g. "9/10"
  deliveryType: 'Spontaneous Vaginal Delivery' | 'Cesarean Section' | 'Assisted Delivery';
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  allergies: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  paperBookletNumber: string; // Hybrid paper booklet ID e.g. "MOH-CW-2026-8941"
  clinicAssigned: string;
  notes?: string;
  isTwin?: boolean;
  twinId?: string;
}

export interface GrowthRecord {
  id: string;
  childId: string;
  date: string;
  ageInMonths: number;
  weightKg: number;
  heightCm: number;
  headCircCm: number;
  bmi: number;
  recordedBy: string; // e.g., "Mother", "Nurse Grace - City Health Clinic"
  clinicVerified: boolean;
  notes?: string;
}

export interface VaccineRecord {
  id: string;
  childId: string;
  vaccineCode: string; // BCG, OPV0, PENTA1, PCV1, ROTA1, etc.
  vaccineName: string;
  targetAgeWeeks: number;
  targetAgeLabel: string; // "At Birth", "6 Weeks", "10 Weeks", "14 Weeks", "6 Months", "9 Months", "18 Months"
  diseasesPrevented: string[];
  scheduledDate: string;
  administeredDate?: string;
  status: 'completed' | 'due' | 'overdue' | 'upcoming';
  batchNumber?: string;
  administeredBy?: string;
  facility?: string;
  reactionNotes?: string;
}

export interface FeedingEvent {
  id: string;
  time: string;
  type: 'breast_left' | 'breast_right' | 'both_breasts' | 'formula' | 'pumped_milk' | 'solids';
  durationMinutes?: number;
  amountMl?: number;
  solidFoodDetails?: string;
  notes?: string;
}

export interface DiaperEvent {
  id: string;
  time: string;
  type: 'wet' | 'dirty' | 'both' | 'dry';
  stoolColor?: 'mustard_yellow' | 'brown' | 'green' | 'pale_clay' | 'black' | 'red';
  consistency?: 'normal_seedy' | 'soft' | 'watery' | 'hard';
  rashPresent?: boolean;
}

export interface SleepEvent {
  id: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  quality: 'restful' | 'fussy' | 'interrupted';
}

export interface DailyCareLog {
  id: string;
  childId: string;
  date: string;
  feedings: FeedingEvent[];
  diapers: DiaperEvent[];
  sleepSessions: SleepEvent[];
  tummyTimeMinutes: number;
  temperature?: number;
  milestoneObserved?: string;
  dailyNotes?: string;
}

export interface MaternalHealthLog {
  id: string;
  date: string;
  daysPostpartum: number;
  lochiaStage: 'rubra (red)' | 'serosa (pink/brown)' | 'alba (white/yellow)' | 'none';
  bleedingIntensity: 'light' | 'moderate' | 'heavy (alert)' | 'spotting';
  perinealOrCSectionPain: number; // 0-10
  woundHealingCondition: 'clean & healing well' | 'mild redness' | 'painful/discharge (alert)';
  breastCondition: 'comfortable' | 'engorged' | 'cracked nipples' | 'mastitis suspicion (hot/painful)';
  hydrationGlasses: number;
  sleepHours: number;
  energyLevel: 'energetic' | 'normal' | 'fatigued' | 'exhausted';
  moodRating: 'joyful' | 'calm' | 'anxious' | 'tearful' | 'overwhelmed';
  epdsScore?: number; // Edinburgh Postnatal Depression Scale (0-30)
  notes?: string;
}

export interface MilestoneItem {
  id: string;
  category: 'gross_motor' | 'fine_motor' | 'speech_language' | 'cognitive' | 'social_emotional';
  expectedAgeMonths: number;
  title: string;
  description: string;
  achievedDate?: string;
  isAchieved: boolean;
}

export interface HospitalAppointment {
  id: string;
  childId: string;
  title: string;
  doctorName: string;
  facility: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  purpose: 'routine_immunization' | 'well_baby_check' | 'postnatal_maternal' | 'sick_visit';
  notes?: string;
}

export interface ClinicalEncounter {
  id: string;
  childId: string;
  date: string;
  clinicianName: string;
  cadre: 'Pediatrician' | 'Midwife / Nurse' | 'Clinical Officer';
  facility: string;
  vitals: {
    weightKg: number;
    heightCm: number;
    tempCelsius: number;
    respiratoryRateBpm: number;
    heartRateBpm: number;
    muacMm?: number; // Mid-Upper Arm Circumference
  };
  clinicalFindings: string;
  diagnosis: string;
  prescriptions: Array<{
    medicine: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
  officialPaperBookletStamped: boolean;
  stampId: string;
}

export interface SmsLog {
  id: string;
  phone: string;
  messageType: string;
  body: string;
  timestamp: string;
  status: 'Delivered' | 'Pending' | 'Scheduled';
  carrier: string;
}

export interface EducationArticle {
  id: string;
  title: string;
  category: 'Newborn Care' | 'Breastfeeding & Nutrition' | 'Immunization' | 'Development' | 'Maternal Recovery' | 'Hygiene & Safety';
  readingTimeMin: number;
  summary: string;
  bodyParagraphs: string[];
  keyTips: string[];
  localAudioText: string;
  iconName: string;
}
