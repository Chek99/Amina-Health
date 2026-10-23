import { VaccineRecord } from '../types';

export interface VaccineMasterTemplate {
  code: string;
  name: string;
  targetWeeks: number;
  label: string;
  diseases: string[];
  route: string;
  site: string;
}

export const WHO_EPI_SCHEDULE: VaccineMasterTemplate[] = [
  {
    code: 'BCG',
    name: 'BCG (Bacille Calmette-Guérin)',
    targetWeeks: 0,
    label: 'At Birth',
    diseases: ['Tuberculosis meningitis', 'Disseminated TB'],
    route: 'Intradermal',
    site: 'Left upper arm',
  },
  {
    code: 'OPV_0',
    name: 'Oral Polio Vaccine 0 (OPV 0)',
    targetWeeks: 0,
    label: 'At Birth',
    diseases: ['Poliomyelitis (Infantile Paralysis)'],
    route: 'Oral drops (2 drops)',
    site: 'Mouth',
  },
  {
    code: 'HEPB_0',
    name: 'Hepatitis B Birth Dose (HepB-BD)',
    targetWeeks: 0,
    label: 'Within 24 Hours of Birth',
    diseases: ['Perinatal Hepatitis B virus infection'],
    route: 'Intramuscular',
    site: 'Anterolateral thigh',
  },
  {
    code: 'PENTA_1',
    name: 'Pentavalent 1 (DTP-HepB-Hib 1)',
    targetWeeks: 6,
    label: '6 Weeks',
    diseases: ['Diphtheria', 'Tetanus', 'Pertussis (Whooping cough)', 'Hepatitis B', 'Haemophilus influenzae type b'],
    route: 'Intramuscular',
    site: 'Outer mid-thigh (left)',
  },
  {
    code: 'OPV_1',
    name: 'Oral Polio Vaccine 1 (OPV 1)',
    targetWeeks: 6,
    label: '6 Weeks',
    diseases: ['Poliomyelitis'],
    route: 'Oral (2 drops)',
    site: 'Mouth',
  },
  {
    code: 'PCV_1',
    name: 'Pneumococcal Conjugate Vaccine 1 (PCV 1)',
    targetWeeks: 6,
    label: '6 Weeks',
    diseases: ['Streptococcus pneumoniae (Pneumonia, Meningitis, Sepsis)'],
    route: 'Intramuscular',
    site: 'Outer mid-thigh (right)',
  },
  {
    code: 'ROTA_1',
    name: 'Rotavirus Vaccine 1 (Rota 1)',
    targetWeeks: 6,
    label: '6 Weeks',
    diseases: ['Severe rotavirus acute dehydrating diarrhea'],
    route: 'Oral drops',
    site: 'Mouth',
  },
  {
    code: 'PENTA_2',
    name: 'Pentavalent 2 (DTP-HepB-Hib 2)',
    targetWeeks: 10,
    label: '10 Weeks',
    diseases: ['Diphtheria', 'Tetanus', 'Pertussis', 'Hepatitis B', 'Hib'],
    route: 'Intramuscular',
    site: 'Outer mid-thigh (left)',
  },
  {
    code: 'OPV_2',
    name: 'Oral Polio Vaccine 2 (OPV 2)',
    targetWeeks: 10,
    label: '10 Weeks',
    diseases: ['Poliomyelitis'],
    route: 'Oral (2 drops)',
    site: 'Mouth',
  },
  {
    code: 'PCV_2',
    name: 'Pneumococcal Conjugate Vaccine 2 (PCV 2)',
    targetWeeks: 10,
    label: '10 Weeks',
    diseases: ['Pneumonia', 'Pneumococcal Meningitis'],
    route: 'Intramuscular',
    site: 'Outer mid-thigh (right)',
  },
  {
    code: 'ROTA_2',
    name: 'Rotavirus Vaccine 2 (Rota 2)',
    targetWeeks: 10,
    label: '10 Weeks',
    diseases: ['Rotavirus Gastroenteritis'],
    route: 'Oral drops',
    site: 'Mouth',
  },
  {
    code: 'PENTA_3',
    name: 'Pentavalent 3 (DTP-HepB-Hib 3)',
    targetWeeks: 14,
    label: '14 Weeks',
    diseases: ['Diphtheria', 'Tetanus', 'Pertussis', 'Hepatitis B', 'Hib'],
    route: 'Intramuscular',
    site: 'Outer mid-thigh (left)',
  },
  {
    code: 'IPV_1',
    name: 'Inactivated Polio Vaccine (IPV 1)',
    targetWeeks: 14,
    label: '14 Weeks',
    diseases: ['Poliomyelitis Booster'],
    route: 'Intramuscular',
    site: 'Outer mid-thigh (right)',
  },
  {
    code: 'PCV_3',
    name: 'Pneumococcal Conjugate Vaccine 3 (PCV 3)',
    targetWeeks: 14,
    label: '14 Weeks',
    diseases: ['Pneumonia & Meningitis Booster'],
    route: 'Intramuscular',
    site: 'Outer mid-thigh (right)',
  },
  {
    code: 'VITA_6M',
    name: 'Vitamin A Supplementation (100,000 IU)',
    targetWeeks: 26,
    label: '6 Months',
    diseases: ['Vitamin A deficiency', 'Xerophthalmia / night blindness', 'Immunity booster'],
    route: 'Oral capsule drops',
    site: 'Mouth',
  },
  {
    code: 'MR_1',
    name: 'Measles-Rubella Vaccine 1 (MR 1)',
    targetWeeks: 39,
    label: '9 Months',
    diseases: ['Measles (Rubeola)', 'Rubella (German Measles)'],
    route: 'Subcutaneous',
    site: 'Right upper arm (deltoid)',
  },
  {
    code: 'YF',
    name: 'Yellow Fever Vaccine',
    targetWeeks: 39,
    label: '9 Months',
    diseases: ['Yellow Fever viral encephalitis'],
    route: 'Subcutaneous',
    site: 'Left upper arm',
  },
  {
    code: 'MR_2',
    name: 'Measles-Rubella Vaccine 2 (MR 2)',
    targetWeeks: 78,
    label: '18 Months',
    diseases: ['Measles Booster', 'Rubella Immunity Reinforcement'],
    route: 'Subcutaneous',
    site: 'Right upper arm',
  },
];

// Helper to compute scheduled dates from birth date and current completion status
export function generateSmartVaccinationSchedule(
  childId: string,
  birthDateStr: string,
  completedCodes: string[] = ['BCG', 'OPV_0', 'HEPB_0', 'PENTA_1', 'OPV_1', 'PCV_1', 'ROTA_1']
): VaccineRecord[] {
  const birth = new Date(birthDateStr);
  const now = new Date();

  return WHO_EPI_SCHEDULE.map((tpl, idx) => {
    // Target date = birth + targetWeeks * 7 days
    const scheduled = new Date(birth.getTime() + tpl.targetWeeks * 7 * 24 * 60 * 60 * 1000);
    const scheduledIso = scheduled.toISOString().split('T')[0];
    const isCompleted = completedCodes.includes(tpl.code);

    let status: VaccineRecord['status'] = 'upcoming';
    let administeredDate: string | undefined = undefined;

    if (isCompleted) {
      status = 'completed';
      // Approximate administered date near scheduled date
      const adminDate = new Date(scheduled.getTime() + 2 * 24 * 60 * 60 * 1000);
      administeredDate = adminDate.toISOString().split('T')[0];
    } else {
      const diffDays = Math.round((now.getTime() - scheduled.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays > 14) {
        status = 'overdue';
      } else if (diffDays >= -7 && diffDays <= 14) {
        status = 'due';
      } else {
        status = 'upcoming';
      }
    }

    return {
      id: `vax_${childId}_${tpl.code}`,
      childId,
      vaccineCode: tpl.code,
      vaccineName: tpl.name,
      targetAgeWeeks: tpl.targetWeeks,
      targetAgeLabel: tpl.label,
      diseasesPrevented: tpl.diseases,
      scheduledDate: scheduledIso,
      administeredDate,
      status,
      batchNumber: isCompleted ? `BATCH-WHO-${202600 + idx}` : undefined,
      administeredBy: isCompleted ? 'Nurse Sister Mary Mwangi (Cert #RN-49102)' : undefined,
      facility: isCompleted ? 'St. Jude Maternal & Child Health Clinic' : undefined,
    };
  });
}
