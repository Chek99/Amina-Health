export type SupportedLanguage = 'en' | 'sw';

export interface Translations {
  // Navigation & Branding
  brandName: string;
  brandTagline: string;
  navDashboard: string;
  navGrowth: string;
  navVaccines: string;
  navJournal: string;
  navAiTriage: string;
  navDoctorPortal: string;
  navEducation: string;
  emergencySos: string;
  qrPassport: string;
  syncBackup: string;
  motherView: string;
  doctorPortal: string;
  activeInfant: string;
  switchToTwin: string;
  addInfantOrTwin: string;
  languageLabel: string;

  // Dashboard
  welcomeTitle: string;
  welcomeSubtitle: string;
  dayPostpartum: string;
  growthWeightKpi: string;
  vaccinesKpi: string;
  dailyCareKpi: string;
  maternalKpi: string;
  hospitalSchedule: string;
  latestDoctorExam: string;
  askAminaCardTitle: string;
  askAminaCardDesc: string;
  parentingTipTitle: string;
  showQrBtn: string;
  openTriageBtn: string;

  // Growth View
  growthTitle: string;
  growthSubtitle: string;
  logGrowthBtn: string;
  weightTab: string;
  heightTab: string;
  headCircTab: string;
  timelineTitle: string;
  milestonesTitle: string;
  whoCurveTitle: string;
  idealMedian: string;
  currentWeightLabel: string;
  headCircLabel: string;
  lengthLabel: string;
  percentileBandLabel: string;

  // Vaccines View
  vaccinesTitle: string;
  vaccinesSubtitle: string;
  allFilter: string;
  dueFilter: string;
  completedFilter: string;
  upcomingFilter: string;
  completionRateLabel: string;
  currentStageLabel: string;
  smsSimulatorTitle: string;
  smsSimulatorDesc: string;
  motherPhoneLabel: string;
  msgTemplateLabel: string;
  dispatchSmsBtn: string;
  markGivenBtn: string;
  scheduleGeneratorTitle: string;
  scheduleGeneratorSubtitle: string;
  birthDateInputLabel: string;
  generateScheduleBtn: string;
  applyScheduleBtn: string;
  scheduleUpdatedAlert: string;
  selectChildModeLabel: string;
  allUpcomingOption: string;
  keepExistingDosesOption: string;
  whoIntervalRulesTitle: string;
  previewScheduleTitle: string;

  // Journal View
  journalTitle: string;
  journalSubtitle: string;
  infantCareTab: string;
  maternalRecoveryTab: string;
  epdsTab: string;
  nursingTimerTitle: string;
  startNursing: string;
  pauseNursing: string;
  logFeedBtn: string;
  leftBreast: string;
  rightBreast: string;
  bothBreasts: string;
  diaperTitle: string;
  wetDiaperBtn: string;
  dirtyDiaperBtn: string;
  bothDiaperBtn: string;
  stoolCheckLabel: string;
  tummyTimeTitle: string;
  napQuickLog: string;
  lochiaTitle: string;
  painScoreTitle: string;
  breastConditionTitle: string;
  hydrationTitle: string;

  // AI Assistant & Cry Triage
  aiTitle: string;
  aiSubtitle: string;
  chatMode: string;
  cryMode: string;
  triageMode: string;
  voiceReadout: string;
  stopVoice: string;
  voiceLangLabel: string;
  askPlaceholder: string;
  cryCadenceLabel: string;
  cryDurationLabel: string;
  timeSinceFeedLabel: string;
  timeAwakeLabel: string;
  classifyCryBtn: string;
  executeTriageBtn: string;

  // Emergency SOS Modal
  emergencyModalTitle: string;
  emergencyAlertBanner: string;
  observedSymptomsTitle: string;
  measuredTempLabel: string;
  firstAidTitle: string;
  callClinicBtn: string;
  callNationalAmbulanceBtn: string;

  // Common
  cancel: string;
  save: string;
  close: string;
  verified: string;
}

export const translations: Record<SupportedLanguage, Translations> = {
  en: {
    // Navigation & Branding
    brandName: 'Amina Health',
    brandTagline: 'Smart Maternal & Infant Monitoring System',
    navDashboard: 'Dashboard',
    navGrowth: 'Growth & Milestones',
    navVaccines: 'Vaccines & Reminders',
    navJournal: 'Mother Journal',
    navAiTriage: 'AI Assistant & Cry Triage',
    navDoctorPortal: 'Doctor / Nurse Portal',
    navEducation: 'Education',
    emergencySos: 'Emergency SOS',
    qrPassport: 'QR Passport',
    syncBackup: 'Sync / Backup',
    motherView: 'Mother View',
    doctorPortal: 'Doctor / Nurse Portal',
    activeInfant: 'Active Infant:',
    switchToTwin: 'Switch to Twin',
    addInfantOrTwin: 'Add Infant or Twin',
    languageLabel: 'Language',

    // Dashboard
    welcomeTitle: 'Welcome back, Mama Grace',
    welcomeSubtitle: 'Monitoring baby development, immunization, and postpartum health.',
    dayPostpartum: 'Day Postpartum',
    growthWeightKpi: 'Growth & Weight',
    vaccinesKpi: 'Vaccines (WHO EPI)',
    dailyCareKpi: "Today's Daily Care",
    maternalKpi: 'Maternal Wellbeing',
    hospitalSchedule: 'Hospital & Clinic Schedule',
    latestDoctorExam: 'Latest Doctor Examination',
    askAminaCardTitle: 'Amina AI Maternal Assistant',
    askAminaCardDesc: 'Have a question about sleep windows, breastfeeding latch, or normal stool colors? Amina provides clinical guidance in English and Kiswahili.',
    parentingTipTitle: 'Parenting Tip of the Day',
    showQrBtn: 'Show QR Passport',
    openTriageBtn: 'Emergency Triage',

    // Growth View
    growthTitle: 'Smart WHO Growth Curves & Milestones',
    growthSubtitle: 'Real-time biometric percentiles compared against World Health Organization standards.',
    logGrowthBtn: 'Log Growth Measurement',
    weightTab: 'Weight (kg)',
    heightTab: 'Length (cm)',
    headCircTab: 'Head Circ (cm)',
    timelineTitle: 'Child Health History Timeline',
    milestonesTitle: 'Developmental Milestones Intelligence',
    whoCurveTitle: 'WHO Growth Curve (0 to 12 Months)',
    idealMedian: 'WHO 50th Percentile (Ideal Median)',
    currentWeightLabel: 'Current Weight',
    headCircLabel: 'Head Circumference',
    lengthLabel: 'Length / Height',
    percentileBandLabel: 'Percentile Band',

    // Vaccines View
    vaccinesTitle: 'Smart Vaccination Schedule & SMS Reminders',
    vaccinesSubtitle: 'Dynamic WHO EPI immunization calendar predicted from infant birth date.',
    allFilter: 'All',
    dueFilter: 'Due / Overdue',
    completedFilter: 'Completed',
    upcomingFilter: 'Upcoming',
    completionRateLabel: 'Immunization Completion Rate',
    currentStageLabel: 'Current Immunization Stage',
    smsSimulatorTitle: 'SMS Notification Simulator',
    smsSimulatorDesc: 'Test automated SMS reminders sent to the mother before immunization appointments.',
    motherPhoneLabel: "Mother's Mobile Number",
    msgTemplateLabel: 'Message Template',
    dispatchSmsBtn: 'Dispatch Test SMS Notification',
    markGivenBtn: 'Mark Given',
    scheduleGeneratorTitle: 'WHO Smart Immunization Schedule Generator',
    scheduleGeneratorSubtitle: 'Input child birth date to automatically compute personalized clinic appointment dates and WHO recommended intervals.',
    birthDateInputLabel: "Child's Birth Date",
    generateScheduleBtn: 'Calculate WHO Schedule',
    applyScheduleBtn: 'Apply & Save to Child Record',
    scheduleUpdatedAlert: 'Personalized immunization schedule generated and updated for the child!',
    selectChildModeLabel: 'Vaccination History Baseline',
    allUpcomingOption: 'Newborn Baseline (All doses upcoming)',
    keepExistingDosesOption: 'Preserve Already Administered Doses',
    whoIntervalRulesTitle: 'WHO Recommended Interval Standards',
    previewScheduleTitle: 'Personalized Immunization Milestones Preview',

    // Journal View
    journalTitle: 'Digital Mother Journal & Recovery',
    journalSubtitle: 'Holistic daily logging for infant care and maternal postpartum physical & emotional recovery.',
    infantCareTab: 'Infant Daily Care',
    maternalRecoveryTab: 'Postpartum Health',
    epdsTab: 'Mental Health (EPDS)',
    nursingTimerTitle: 'Nursing & Feeding Timer',
    startNursing: 'Start Nursing',
    pauseNursing: 'Pause',
    logFeedBtn: 'Log Feed',
    leftBreast: 'Left Breast',
    rightBreast: 'Right Breast',
    bothBreasts: 'Both Sides',
    diaperTitle: 'Diaper Output & Stool Health',
    wetDiaperBtn: '+ Wet Diaper',
    dirtyDiaperBtn: '+ Dirty Diaper',
    bothDiaperBtn: '+ Both Wet & Dirty',
    stoolCheckLabel: 'Stool Color Check',
    tummyTimeTitle: 'Sleep & Tummy Time Strength',
    napQuickLog: 'Quick Log Nap:',
    lochiaTitle: 'Lochia (Postpartum Discharge) Stage',
    painScoreTitle: 'Wound & Perineal Pain Score (0–10)',
    breastConditionTitle: 'Breast & Nipple Condition',
    hydrationTitle: "Mother's Daily Hydration (Water Glasses)",

    // AI Assistant & Cry Triage
    aiTitle: 'AI Clinical Assistant & Cry Triage',
    aiSubtitle: 'Voice-enabled maternal intelligence, WHO IMCI emergency danger sign detection, and baby cry acoustic classifier.',
    chatMode: 'Amina CareAI Chat',
    cryMode: 'Cry Acoustic Analyzer',
    triageMode: 'Emergency Danger Triage',
    voiceReadout: 'Voice Readout',
    stopVoice: 'Stop Audio',
    voiceLangLabel: 'Voice & Text Language:',
    askPlaceholder: 'Ask Amina about baby care or postpartum recovery...',
    cryCadenceLabel: 'Cry Sound Cadence & Pitch',
    cryDurationLabel: 'Crying Duration',
    timeSinceFeedLabel: 'Minutes Since Last Feed',
    timeAwakeLabel: 'Minutes Awake Since Last Nap',
    classifyCryBtn: 'Classify Baby Cry & Get Soothing Steps',
    executeTriageBtn: 'Execute Immediate Clinical Triage',

    // Emergency SOS Modal
    emergencyModalTitle: 'Immediate Danger Sign Alert',
    emergencyAlertBanner: 'CRITICAL EMERGENCY CLINICAL DISPATCH',
    observedSymptomsTitle: 'Observed Acute Symptoms:',
    measuredTempLabel: 'Measured Infant Body Temperature:',
    firstAidTitle: 'WHO First-Aid Stabilization Protocol:',
    callClinicBtn: 'Call Clinic',
    callNationalAmbulanceBtn: 'Call National Emergency Medical Services (999 / 112 / 911)',

    // Common
    cancel: 'Cancel',
    save: 'Save',
    close: 'Close',
    verified: 'Verified',
  },

  sw: {
    // Navigation & Branding
    brandName: 'Amina Afya',
    brandTagline: 'Mfumo Mahiri wa Kufuatilia Afya ya Mama na Mtoto',
    navDashboard: 'Dashibodi',
    navGrowth: 'Ukuaji & Hatua',
    navVaccines: 'Chanjo & Vikumbusho',
    navJournal: 'Shajara ya Mama',
    navAiTriage: 'Msaidizi wa AI & Kilio',
    navDoctorPortal: 'Kituo cha Daktari / Muuguzi',
    navEducation: 'Elimu ya Jamii',
    emergencySos: 'Dharura ya Haraka',
    qrPassport: 'Pasipoti ya QR',
    syncBackup: 'Hifadhi / Rudisha',
    motherView: 'Mtazamo wa Mama',
    doctorPortal: 'Kituo cha Daktari / Muuguzi',
    activeInfant: 'Mtoto Aliyepo:',
    switchToTwin: 'Badili kwa Pacha',
    addInfantOrTwin: 'Ongeza Mtoto au Pacha',
    languageLabel: 'Lugha',

    // Dashboard
    welcomeTitle: 'Karibu tena, Mama Grace',
    welcomeSubtitle: 'Kufuatilia ukuaji wa mtoto, ratiba ya chanjo, na afya ya mama baada ya kujifungua.',
    dayPostpartum: 'Siku Baada ya Kujifungua',
    growthWeightKpi: 'Ukuaji & Uzito',
    vaccinesKpi: 'Chanjo (WHO EPI)',
    dailyCareKpi: 'Huduma ya Kila Siku',
    maternalKpi: 'Afya ya Mama',
    hospitalSchedule: 'Ratiba ya Kliniki & Hospitali',
    latestDoctorExam: 'Uchunguzi wa Daktari wa Hivi Karibuni',
    askAminaCardTitle: 'Msaidizi wa AI Amina',
    askAminaCardDesc: 'Una swali kuhusu kunyonyesha, ratiba ya usingizi, au rangi ya kinyesi cha mtoto? Amina anatoa ushauri wa kitaalamu kwa Kiswahili na Kiingereza.',
    parentingTipTitle: 'Dokezo la Uzazi la Leo',
    showQrBtn: 'Onyesha Pasipoti ya QR',
    openTriageBtn: 'Uchunguzi wa Dharura',

    // Growth View
    growthTitle: 'Chati Mahiri za Ukuaji za WHO & Hatua za Mtoto',
    growthSubtitle: 'Viwango halisi vya ukuaji kulingana na viwango vya Shirika la Afya Duniani (WHO).',
    logGrowthBtn: 'Rekodi Vipimo vya Ukuaji',
    weightTab: 'Uzito (kg)',
    heightTab: 'Urefu (cm)',
    headCircTab: 'Mzunguko wa Kichwa (cm)',
    timelineTitle: 'Historia ya Afya ya Mtoto (Kutoka Kuzaliwa)',
    milestonesTitle: 'Ufuatiliaji wa Hatua za Ukuaji wa Mtoto',
    whoCurveTitle: 'Mchirizo wa Ukuaji wa WHO (Miezi 0 hadi 12)',
    idealMedian: 'Kiwango cha Kati cha WHO (P50)',
    currentWeightLabel: 'Uzito wa Sasa',
    headCircLabel: 'Mzunguko wa Kichwa',
    lengthLabel: 'Urefu wa Mtoto',
    percentileBandLabel: 'Kiwango cha Asilimia',

    // Vaccines View
    vaccinesTitle: 'Ratiba ya Chanjo & Vikumbusho vya Ujumbe Mfupi (SMS)',
    vaccinesSubtitle: 'Ratiba ya chanjo ya WHO inayotabiriwa moja kwa moja kutoka tarehe ya kuzaliwa kwa mtoto.',
    allFilter: 'Zote',
    dueFilter: 'Zinazotakiwa / Zilizochelewa',
    completedFilter: 'Zilizokamilika',
    upcomingFilter: 'Zijazo',
    completionRateLabel: 'Kiwango cha Kukamilisha Chanjo',
    currentStageLabel: 'Hatua ya Sasa ya Chanjo',
    smsSimulatorTitle: 'Kielelezo cha Vikumbusho vya SMS',
    smsSimulatorDesc: 'Jaribu ujumbe wa tahadhari unaotumwa kwa simu ya mama kabla ya tarehe ya chanjo.',
    motherPhoneLabel: 'Nambari ya Simu ya Mama',
    msgTemplateLabel: 'Ujumbe Ulioandaliwa',
    dispatchSmsBtn: 'Tuma Ujumbe wa Majaribio (SMS)',
    markGivenBtn: 'Weka Imepokelewa',
    scheduleGeneratorTitle: 'Kizalishi cha Ratiba Mahiri ya Chanjo (WHO)',
    scheduleGeneratorSubtitle: 'Weka tarehe ya kuzaliwa ya mtoto ili kuhesabu kiotomatiki tarehe kamili za kliniki kulingana na miongozo ya WHO.',
    birthDateInputLabel: 'Tarehe ya Kuzaliwa ya Mtoto',
    generateScheduleBtn: 'Kokotoa Ratiba ya WHO',
    applyScheduleBtn: 'Hifadhi & Weka kwenye Rekodi ya Mtoto',
    scheduleUpdatedAlert: 'Ratiba ya kibinafsi ya chanjo imeundwa na kuhifadhiwa kikamilifu!',
    selectChildModeLabel: 'Hali ya Sasa ya Chanjo',
    allUpcomingOption: 'Mtoto Mchanga (Dozi zote zijazo)',
    keepExistingDosesOption: 'Baki na Dozi Zilizokamilika Tayari',
    whoIntervalRulesTitle: 'Miongozo ya Vipindi vya Chanjo vya WHO',
    previewScheduleTitle: 'Muhtasari wa Hatua za Chanjo Zilizokokotolewa',

    // Journal View
    journalTitle: 'Shajara ya Dijitali ya Mama & Uponyaji',
    journalSubtitle: 'Ufuatiliaji wa kila siku wa mtoto na afya ya kimwili na kisaikolojia ya mama baada ya kujifungua.',
    infantCareTab: 'Huduma ya Kila Siku ya Mtoto',
    maternalRecoveryTab: 'Afya Baada ya Kujifungua',
    epdsTab: 'Afya ya Akili ya Mama (EPDS)',
    nursingTimerTitle: 'Kipima Muda cha Kunyonyesha',
    startNursing: 'Anza Kunyonyesha',
    pauseNursing: 'Sitisha',
    logFeedBtn: 'Hifadhi Kunyonya',
    leftBreast: 'Titi la Kushoto',
    rightBreast: 'Titi la Kulia',
    bothBreasts: 'Pande Zote Mbili',
    diaperTitle: 'Nepi za Mtoto & Hali ya Kinyesi',
    wetDiaperBtn: '+ Nepi ya Mkojo',
    dirtyDiaperBtn: '+ Nepi ya Kinyesi',
    bothDiaperBtn: '+ Mkojo & Kinyesi Pamoja',
    stoolCheckLabel: 'Uchunguzi wa Rangi ya Kinyesi',
    tummyTimeTitle: 'Usingizi & Muda wa Kulala Tumbo',
    napQuickLog: 'Rekodi Usingizi Haraka:',
    lochiaTitle: 'Hatua ya Damu Baada ya Kujifungua (Lochia)',
    painScoreTitle: 'Kiwango cha Maumivu ya Kidonda (0–10)',
    breastConditionTitle: 'Hali ya Matiti & Chuchu',
    hydrationTitle: 'Maji Anayokunywa Mama Kila Siku (Glasi)',

    // AI Assistant & Cry Triage
    aiTitle: 'Msaidizi wa Kliniki wa AI & Utambuzi wa Kilio',
    aiSubtitle: 'Ushauri wa sauti kwa mama, kugundua ishara za hatari za WHO IMCI, na uchambuzi wa sauti ya kilio cha mtoto.',
    chatMode: 'Mazungumzo ya Amina AI',
    cryMode: 'Mchambuzi wa Sauti ya Kilio',
    triageMode: 'Uchambuzi wa Ishara za Hatari',
    voiceReadout: 'Soma kwa Sauti',
    stopVoice: 'Sitisha Sauti',
    voiceLangLabel: 'Lugha ya Sauti na Maandishi:',
    askPlaceholder: 'Muulize Amina kuhusu malezi ya mtoto au afya ya mama...',
    cryCadenceLabel: 'Mlio na Mwangwi wa Kilio',
    cryDurationLabel: 'Muda wa Kilio',
    timeSinceFeedLabel: 'Dakika Tangu Anyonye Mara ya Mwisho',
    timeAwakeLabel: 'Dakika Ambazo Mtoto Amekuwa Macho',
    classifyCryBtn: 'Chambua Kilio cha Mtoto & Pata Hatua za Kumtuliza',
    executeTriageBtn: 'Fanya Uchunguzi wa Dharura Mara Moja',

    // Emergency SOS Modal
    emergencyModalTitle: 'Tahadhari ya Ishara za Hatari',
    emergencyAlertBanner: 'TUMA MSAADA WA HARAKA WA DHARURA YA MATIBABU',
    observedSymptomsTitle: 'Dalili Hatari Zilizoonekana:',
    measuredTempLabel: 'Kiwango cha Joto la Mwili la Mtoto:',
    firstAidTitle: 'Mwongozo wa Huduma ya Kwanza wa WHO:',
    callClinicBtn: 'Piga Simu Kituo cha Afya',
    callNationalAmbulanceBtn: 'Piga Simu ya Dharura ya Kitaifa (999 / 112 / 911)',

    // Common
    cancel: 'Ghairi',
    save: 'Hifadhi',
    close: 'Funga',
    verified: 'Imethibitishwa',
  },
};
