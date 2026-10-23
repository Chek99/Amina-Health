import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ChildProfile,
  GrowthRecord,
  VaccineRecord,
  DailyCareLog,
  MaternalHealthLog,
  MilestoneItem,
  HospitalAppointment,
  ClinicalEncounter,
  SmsLog,
  FeedingEvent,
  DiaperEvent,
  SleepEvent,
} from '../types';
import {
  INITIAL_CHILDREN,
  INITIAL_GROWTH_RECORDS,
  INITIAL_VACCINES_LEO,
  INITIAL_VACCINES_MAYA,
  INITIAL_DAILY_LOG,
  INITIAL_MATERNAL_LOG,
  INITIAL_MILESTONES,
  INITIAL_APPOINTMENTS,
  INITIAL_CLINICAL_ENCOUNTERS,
  INITIAL_SMS_LOGS,
} from '../data/mockData';
import { generateSmartVaccinationSchedule } from '../data/vaccineSchedule';

import { SupportedLanguage, translations, Translations } from '../locales/translations';

interface AppContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: Translations;
  role: 'mother' | 'clinician';
  setRole: (role: 'mother' | 'clinician') => void;
  children: ChildProfile[];
  activeChildId: string;
  activeChild: ChildProfile;
  setActiveChildId: (id: string) => void;
  growthRecords: GrowthRecord[];
  addGrowthRecord: (record: Omit<GrowthRecord, 'id' | 'childId'>) => void;
  vaccines: VaccineRecord[];
  updateVaccineStatus: (vaccineId: string, status: VaccineRecord['status'], batch?: string, nurse?: string) => void;
  generateAndApplySchedule: (childId: string, birthDateStr: string, preserveCompleted?: boolean) => VaccineRecord[];
  dailyLog: DailyCareLog;
  addFeeding: (feed: Omit<FeedingEvent, 'id'>) => void;
  addDiaper: (diaper: Omit<DiaperEvent, 'id'>) => void;
  addSleep: (sleep: Omit<SleepEvent, 'id'>) => void;
  updateDailyTummyTime: (minutes: number) => void;
  maternalLog: MaternalHealthLog;
  updateMaternalLog: (patch: Partial<MaternalHealthLog>) => void;
  milestones: MilestoneItem[];
  toggleMilestone: (id: string) => void;
  appointments: HospitalAppointment[];
  addAppointment: (apt: Omit<HospitalAppointment, 'id' | 'childId'>) => void;
  clinicalEncounters: ClinicalEncounter[];
  addClinicalEncounter: (enc: Omit<ClinicalEncounter, 'id' | 'childId'>) => void;
  smsLogs: SmsLog[];
  sendSmsReminder: (phone: string, messageType: string, customText?: string) => Promise<SmsLog>;
  addChild: (child: Omit<ChildProfile, 'id'>) => void;
  exportDatabase: () => string;
  importDatabase: (jsonStr: string) => boolean;
  resetDatabase: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY = 'smart_motherhood_infant_data_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_lang`);
    return saved === 'sw' || saved === 'en' ? saved : 'en';
  });
  const [role, setRole] = useState<'mother' | 'clinician'>('mother');
  const [childrenList, setChildrenList] = useState<ChildProfile[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_children`);
    return saved ? JSON.parse(saved) : INITIAL_CHILDREN;
  });

  const [activeChildId, setActiveChildId] = useState<string>(() => {
    return childrenList[0]?.id || 'child_1';
  });

  const [growthRecords, setGrowthRecords] = useState<GrowthRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_growth`);
    return saved ? JSON.parse(saved) : INITIAL_GROWTH_RECORDS;
  });

  const [vaccinesMap, setVaccinesMap] = useState<Record<string, VaccineRecord[]>>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_vaccines`);
    return saved
      ? JSON.parse(saved)
      : {
          child_1: INITIAL_VACCINES_LEO,
          child_2: INITIAL_VACCINES_MAYA,
        };
  });

  const [dailyLogsMap, setDailyLogsMap] = useState<Record<string, DailyCareLog>>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_daily`);
    return saved ? JSON.parse(saved) : { child_1: INITIAL_DAILY_LOG };
  });

  const [maternalLog, setMaternalLog] = useState<MaternalHealthLog>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_maternal`);
    return saved ? JSON.parse(saved) : INITIAL_MATERNAL_LOG;
  });

  const [milestones, setMilestones] = useState<MilestoneItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_milestones`);
    return saved ? JSON.parse(saved) : INITIAL_MILESTONES;
  });

  const [appointments, setAppointments] = useState<HospitalAppointment[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_appointments`);
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [clinicalEncounters, setClinicalEncounters] = useState<ClinicalEncounter[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_clinical`);
    return saved ? JSON.parse(saved) : INITIAL_CLINICAL_ENCOUNTERS;
  });

  const [smsLogs, setSmsLogs] = useState<SmsLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_sms`);
    return saved ? JSON.parse(saved) : INITIAL_SMS_LOGS;
  });

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_lang`, language);
  }, [language]);

  // Sync to local storage for persistence & data protection
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_children`, JSON.stringify(childrenList));
  }, [childrenList]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_growth`, JSON.stringify(growthRecords));
  }, [growthRecords]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_vaccines`, JSON.stringify(vaccinesMap));
  }, [vaccinesMap]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_daily`, JSON.stringify(dailyLogsMap));
  }, [dailyLogsMap]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_maternal`, JSON.stringify(maternalLog));
  }, [maternalLog]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_milestones`, JSON.stringify(milestones));
  }, [milestones]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_appointments`, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_clinical`, JSON.stringify(clinicalEncounters));
  }, [clinicalEncounters]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_sms`, JSON.stringify(smsLogs));
  }, [smsLogs]);

  const activeChild = childrenList.find((c) => c.id === activeChildId) || childrenList[0];

  const currentVaccines = vaccinesMap[activeChildId] || [];

  const currentDailyLog: DailyCareLog = dailyLogsMap[activeChildId] || {
    id: `log_${activeChildId}_${new Date().toISOString().split('T')[0]}`,
    childId: activeChildId,
    date: new Date().toISOString().split('T')[0],
    feedings: [],
    diapers: [],
    sleepSessions: [],
    tummyTimeMinutes: 0,
  };

  const addGrowthRecord = (rec: Omit<GrowthRecord, 'id' | 'childId'>) => {
    const newRec: GrowthRecord = {
      ...rec,
      id: `gr_${Date.now()}`,
      childId: activeChildId,
    };
    setGrowthRecords((prev) => [...prev, newRec]);
  };

  const updateVaccineStatus = (
    vaccineId: string,
    status: VaccineRecord['status'],
    batch?: string,
    nurse?: string
  ) => {
    setVaccinesMap((prev) => {
      const childVaxes = prev[activeChildId] || [];
      const updated = childVaxes.map((v) => {
        if (v.id === vaccineId) {
          return {
            ...v,
            status,
            administeredDate: status === 'completed' ? new Date().toISOString().split('T')[0] : undefined,
            batchNumber: batch || v.batchNumber || `BATCH-MOH-${Date.now().toString().slice(-5)}`,
            administeredBy: nurse || v.administeredBy || 'Sister Mary Mwangi (RN-Cert #49102)',
          };
        }
        return v;
      });
      return { ...prev, [activeChildId]: updated };
    });
  };

  const generateAndApplySchedule = (
    childId: string,
    birthDateStr: string,
    preserveCompleted: boolean = true
  ): VaccineRecord[] => {
    let completedCodes: string[] = [];
    if (preserveCompleted) {
      const existing = vaccinesMap[childId] || [];
      completedCodes = existing.filter((v) => v.status === 'completed').map((v) => v.vaccineCode);
    }
    const newSchedule = generateSmartVaccinationSchedule(childId, birthDateStr, completedCodes);
    setVaccinesMap((prev) => ({ ...prev, [childId]: newSchedule }));
    setChildrenList((prev) =>
      prev.map((c) => (c.id === childId ? { ...c, dob: birthDateStr } : c))
    );
    return newSchedule;
  };

  const addFeeding = (feed: Omit<FeedingEvent, 'id'>) => {
    const newFeed: FeedingEvent = { ...feed, id: `feed_${Date.now()}` };
    setDailyLogsMap((prev) => {
      const existing = prev[activeChildId] || currentDailyLog;
      return {
        ...prev,
        [activeChildId]: {
          ...existing,
          feedings: [newFeed, ...existing.feedings],
        },
      };
    });
  };

  const addDiaper = (diaper: Omit<DiaperEvent, 'id'>) => {
    const newDiaper: DiaperEvent = { ...diaper, id: `diaper_${Date.now()}` };
    setDailyLogsMap((prev) => {
      const existing = prev[activeChildId] || currentDailyLog;
      return {
        ...prev,
        [activeChildId]: {
          ...existing,
          diapers: [newDiaper, ...existing.diapers],
        },
      };
    });
  };

  const addSleep = (sleep: Omit<SleepEvent, 'id'>) => {
    const newSleep: SleepEvent = { ...sleep, id: `sleep_${Date.now()}` };
    setDailyLogsMap((prev) => {
      const existing = prev[activeChildId] || currentDailyLog;
      return {
        ...prev,
        [activeChildId]: {
          ...existing,
          sleepSessions: [newSleep, ...existing.sleepSessions],
        },
      };
    });
  };

  const updateDailyTummyTime = (minutes: number) => {
    setDailyLogsMap((prev) => {
      const existing = prev[activeChildId] || currentDailyLog;
      return {
        ...prev,
        [activeChildId]: {
          ...existing,
          tummyTimeMinutes: Math.max(0, existing.tummyTimeMinutes + minutes),
        },
      };
    });
  };

  const updateMaternalLog = (patch: Partial<MaternalHealthLog>) => {
    setMaternalLog((prev) => ({ ...prev, ...patch }));
  };

  const toggleMilestone = (id: string) => {
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const newAchieved = !m.isAchieved;
          return {
            ...m,
            isAchieved: newAchieved,
            achievedDate: newAchieved ? new Date().toISOString().split('T')[0] : undefined,
          };
        }
        return m;
      })
    );
  };

  const addAppointment = (apt: Omit<HospitalAppointment, 'id' | 'childId'>) => {
    const newApt: HospitalAppointment = {
      ...apt,
      id: `apt_${Date.now()}`,
      childId: activeChildId,
    };
    setAppointments((prev) => [newApt, ...prev]);
  };

  const addClinicalEncounter = (enc: Omit<ClinicalEncounter, 'id' | 'childId'>) => {
    const newEnc: ClinicalEncounter = {
      ...enc,
      id: `enc_${Date.now()}`,
      childId: activeChildId,
    };
    setClinicalEncounters((prev) => [newEnc, ...prev]);
  };

  const sendSmsReminder = async (phone: string, messageType: string, customText?: string) => {
    try {
      const res = await fetch('/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientPhone: phone,
          messageType,
          infantName: activeChild.name,
          scheduledDate: 'Next Tuesday',
          customBody: customText,
        }),
      });
      const data = await res.json();
      const log = data.log || {
        id: `sms_${Date.now()}`,
        phone,
        messageType,
        body: customText || `Vaccine notification for ${activeChild.name}`,
        timestamp: new Date().toLocaleTimeString(),
        status: 'Delivered',
        carrier: 'Safaricom GSM',
      };
      setSmsLogs((prev) => [log, ...prev]);
      return log;
    } catch {
      const fallbackLog: SmsLog = {
        id: `sms_${Date.now()}`,
        phone,
        messageType,
        body: customText || `Reminder sent for ${activeChild.name}`,
        timestamp: new Date().toLocaleTimeString(),
        status: 'Delivered',
        carrier: 'Simulated GSM',
      };
      setSmsLogs((prev) => [fallbackLog, ...prev]);
      return fallbackLog;
    }
  };

  const addChild = (child: Omit<ChildProfile, 'id'>) => {
    const newId = `child_${Date.now()}`;
    const newProfile: ChildProfile = { ...child, id: newId };
    setChildrenList((prev) => [...prev, newProfile]);
    // Generate initial vaccine calendar for new child
    const newVaxes = generateSmartVaccinationSchedule(newId, child.dob, []);
    setVaccinesMap((prev) => ({ ...prev, [newId]: newVaxes }));
    setActiveChildId(newId);
  };

  const exportDatabase = () => {
    const fullBackup = {
      exportedAt: new Date().toISOString(),
      appVersion: '2.0.0',
      children: childrenList,
      growthRecords,
      vaccinesMap,
      dailyLogsMap,
      maternalLog,
      milestones,
      appointments,
      clinicalEncounters,
      smsLogs,
    };
    return JSON.stringify(fullBackup, null, 2);
  };

  const importDatabase = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.children && Array.isArray(parsed.children)) {
        setChildrenList(parsed.children);
        if (parsed.growthRecords) setGrowthRecords(parsed.growthRecords);
        if (parsed.vaccinesMap) setVaccinesMap(parsed.vaccinesMap);
        if (parsed.dailyLogsMap) setDailyLogsMap(parsed.dailyLogsMap);
        if (parsed.maternalLog) setMaternalLog(parsed.maternalLog);
        if (parsed.milestones) setMilestones(parsed.milestones);
        if (parsed.appointments) setAppointments(parsed.appointments);
        if (parsed.clinicalEncounters) setClinicalEncounters(parsed.clinicalEncounters);
        if (parsed.smsLogs) setSmsLogs(parsed.smsLogs);
        if (parsed.children[0]) setActiveChildId(parsed.children[0].id);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  };

  const resetDatabase = () => {
    setChildrenList(INITIAL_CHILDREN);
    setActiveChildId('child_1');
    setGrowthRecords(INITIAL_GROWTH_RECORDS);
    setVaccinesMap({
      child_1: INITIAL_VACCINES_LEO,
      child_2: INITIAL_VACCINES_MAYA,
    });
    setDailyLogsMap({ child_1: INITIAL_DAILY_LOG });
    setMaternalLog(INITIAL_MATERNAL_LOG);
    setMilestones(INITIAL_MILESTONES);
    setAppointments(INITIAL_APPOINTMENTS);
    setClinicalEncounters(INITIAL_CLINICAL_ENCOUNTERS);
    setSmsLogs(INITIAL_SMS_LOGS);
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language],
        role,
        setRole,
        children: childrenList,
        activeChildId,
        activeChild,
        setActiveChildId,
        growthRecords,
        addGrowthRecord,
        vaccines: currentVaccines,
        updateVaccineStatus,
        generateAndApplySchedule,
        dailyLog: currentDailyLog,
        addFeeding,
        addDiaper,
        addSleep,
        updateDailyTummyTime,
        maternalLog,
        updateMaternalLog,
        milestones,
        toggleMilestone,
        appointments,
        addAppointment,
        clinicalEncounters,
        addClinicalEncounter,
        smsLogs,
        sendSmsReminder,
        addChild,
        exportDatabase,
        importDatabase,
        resetDatabase,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
