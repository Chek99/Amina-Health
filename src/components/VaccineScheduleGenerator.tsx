import React, { useState, useMemo } from 'react';
import { VaccineRecord, ChildProfile } from '../types';
import { generateSmartVaccinationSchedule, WHO_EPI_SCHEDULE } from '../data/vaccineSchedule';
import { Translations, SupportedLanguage } from '../locales/translations';
import {
  Calendar,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  Info,
  CalendarDays,
  RotateCcw,
  Check,
  Syringe,
  HelpCircle,
  X,
  FileCheck,
} from 'lucide-react';

interface VaccineScheduleGeneratorProps {
  child: ChildProfile;
  currentVaccines: VaccineRecord[];
  onApplySchedule: (birthDate: string, preserveCompleted: boolean) => void;
  language: SupportedLanguage;
  t: Translations;
}

export const VaccineScheduleGenerator: React.FC<VaccineScheduleGeneratorProps> = ({
  child,
  currentVaccines,
  onApplySchedule,
  language,
  t,
}) => {
  const [inputDob, setInputDob] = useState(child.dob);
  const [scheduleMode, setScheduleMode] = useState<'preserve' | 'all_new'>('preserve');
  const [appliedToast, setAppliedToast] = useState(false);
  const [showWhoRulesModal, setShowWhoRulesModal] = useState(false);
  const [selectedMilestoneWeeks, setSelectedMilestoneWeeks] = useState<number | null>(null);

  // Quick preset helper
  const setPresetDate = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    setInputDob(d.toISOString().split('T')[0]);
  };

  const completedCodes = useMemo(() => {
    return currentVaccines
      .filter((v) => v.status === 'completed')
      .map((v) => v.vaccineCode);
  }, [currentVaccines]);

  // Compute live preview schedule based on inputDob and mode
  const generatedSchedule = useMemo(() => {
    const activeCodes = scheduleMode === 'preserve' ? completedCodes : [];
    return generateSmartVaccinationSchedule(child.id, inputDob, activeCodes);
  }, [child.id, inputDob, scheduleMode, completedCodes]);

  // Group into WHO Milestones
  const milestoneGroups = useMemo(() => {
    const groups = [
      {
        weeks: 0,
        label: language === 'sw' ? 'Wakati wa Kuzaliwa (Siku ya 0)' : 'At Birth (Day 0)',
        recommendedWindow: language === 'sw' ? 'Masaa 24 ya kwanza' : 'Within 24 hours of birth',
        minInterval: language === 'sw' ? 'Hakuna kipindi cha kabla' : 'Baseline / Birth dose',
      },
      {
        weeks: 6,
        label: language === 'sw' ? 'Wiki 6 (Mwezi 1.5)' : '6 Weeks (1.5 Months)',
        recommendedWindow: language === 'sw' ? 'Siku 42 baada ya kuzaliwa' : '42 days after birth',
        minInterval: language === 'sw' ? 'Kiwango cha chini: wiki 6 kamili' : 'Minimum age: 6 full weeks',
      },
      {
        weeks: 10,
        label: language === 'sw' ? 'Wiki 10 (Miezi 2.5)' : '10 Weeks (2.5 Months)',
        recommendedWindow: language === 'sw' ? 'Siku 70 baada ya kuzaliwa' : '70 days after birth',
        minInterval: language === 'sw' ? 'Kiwango cha chini: wiki 4 baada ya Dozi 1' : 'Min 4 weeks after Dose 1',
      },
      {
        weeks: 14,
        label: language === 'sw' ? 'Wiki 14 (Miezi 3.5)' : '14 Weeks (3.5 Months)',
        recommendedWindow: language === 'sw' ? 'Siku 98 baada ya kuzaliwa' : '98 days after birth',
        minInterval: language === 'sw' ? 'Kiwango cha chini: wiki 4 baada ya Dozi 2' : 'Min 4 weeks after Dose 2',
      },
      {
        weeks: 26,
        label: language === 'sw' ? 'Miezi 6 (Siku 182)' : '6 Months (182 Days)',
        recommendedWindow: language === 'sw' ? 'Miezi 6 kamili' : 'At 6 months completed',
        minInterval: language === 'sw' ? 'Kipindi cha kuanzia kuongeza kinga' : 'Routine immune supplementation',
      },
      {
        weeks: 39,
        label: language === 'sw' ? 'Miezi 9 (Siku 273)' : '9 Months (273 Days)',
        recommendedWindow: language === 'sw' ? 'Kipindi cha Miezi 9' : 'At 9 months completed',
        minInterval: language === 'sw' ? 'Kiwango cha chini: miezi 9 ili kuepuka vizuizi vya mama' : 'Min 9 months (avoids maternal antibody block)',
      },
      {
        weeks: 78,
        label: language === 'sw' ? 'Miezi 18 (Mwaka 1.5)' : '18 Months (1.5 Years)',
        recommendedWindow: language === 'sw' ? 'Dozi ya Kuimarisha Kinga (Booster)' : 'Booster / Reinforcement dose',
        minInterval: language === 'sw' ? 'Kiwango cha chini: miezi 6 baada ya Dozi 1 ya MR' : 'Min 6 months after MR Dose 1',
      },
    ];

    return groups.map((g) => {
      const vaxes = generatedSchedule.filter((v) => v.targetAgeWeeks === g.weeks);
      const scheduledDate = vaxes[0]?.scheduledDate || inputDob;
      const formattedDate = new Date(scheduledDate).toLocaleDateString(
        language === 'sw' ? 'sw-KE' : 'en-US',
        { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }
      );

      const hasOverdue = vaxes.some((v) => v.status === 'overdue');
      const hasDue = vaxes.some((v) => v.status === 'due');
      const allCompleted = vaxes.every((v) => v.status === 'completed');

      let groupStatus: 'completed' | 'due' | 'overdue' | 'upcoming' = 'upcoming';
      if (allCompleted && vaxes.length > 0) groupStatus = 'completed';
      else if (hasOverdue) groupStatus = 'overdue';
      else if (hasDue) groupStatus = 'due';

      return {
        ...g,
        scheduledDate,
        formattedDate,
        vaxes,
        groupStatus,
      };
    });
  }, [generatedSchedule, inputDob, language]);

  // Handle Apply to Child Profile
  const handleApply = () => {
    onApplySchedule(inputDob, scheduleMode === 'preserve');
    setAppliedToast(true);
    setTimeout(() => setAppliedToast(false), 5000);
  };

  // Metrics summary of calculated schedule
  const dueCount = generatedSchedule.filter((v) => v.status === 'due' || v.status === 'overdue').length;
  const completedCount = generatedSchedule.filter((v) => v.status === 'completed').length;
  const upcomingCount = generatedSchedule.filter((v) => v.status === 'upcoming').length;

  return (
    <div className="rounded-2xl border border-teal-200 bg-linear-to-b from-teal-50/50 to-white p-5 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-teal-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white shadow-xs">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>{t.scheduleGeneratorTitle}</span>
              <span className="text-2xs font-medium text-teal-700 bg-teal-100/80 px-2 py-0.5 rounded-full">
                WHO EPI Standard
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{t.scheduleGeneratorSubtitle}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowWhoRulesModal(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-teal-200 bg-white px-2.5 py-1.5 text-xs font-medium text-teal-800 hover:bg-teal-50 transition-colors shrink-0"
        >
          <HelpCircle className="h-3.5 w-3.5 text-teal-600" />
          <span>{t.whoIntervalRulesTitle}</span>
        </button>
      </div>

      {/* Input Controls: Birth Date & Mode Selection */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
        {/* Date Input */}
        <div className="lg:col-span-5 space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-teal-600" />
            <span>{t.birthDateInputLabel}</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={inputDob}
              onChange={(e) => setInputDob(e.target.value)}
              className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-mono font-medium text-slate-900 shadow-2xs focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-2xs">
            <span className="text-slate-400">{language === 'sw' ? 'Chagua haraka:' : 'Presets:'}</span>
            <button
              type="button"
              onClick={() => setPresetDate(0)}
              className="rounded bg-slate-100 hover:bg-teal-100 hover:text-teal-900 px-2 py-0.5 text-slate-600 font-medium transition-colors"
            >
              {language === 'sw' ? 'Kuzaliwa Leo (Newborn)' : 'Born Today'}
            </button>
            <button
              type="button"
              onClick={() => setPresetDate(42)}
              className="rounded bg-slate-100 hover:bg-teal-100 hover:text-teal-900 px-2 py-0.5 text-slate-600 font-medium transition-colors"
            >
              {language === 'sw' ? 'Wiki 6 zilizopita' : '6 Weeks Ago'}
            </button>
            <button
              type="button"
              onClick={() => setPresetDate(70)}
              className="rounded bg-slate-100 hover:bg-teal-100 hover:text-teal-900 px-2 py-0.5 text-slate-600 font-medium transition-colors"
            >
              {language === 'sw' ? 'Wiki 10 zilizopita' : '10 Weeks Ago'}
            </button>
            <button
              type="button"
              onClick={() => setInputDob(child.dob)}
              className="rounded bg-slate-100 hover:bg-teal-100 hover:text-teal-900 px-2 py-0.5 text-slate-600 font-medium transition-colors"
            >
              {child.name}&apos;s DOB ({child.dob})
            </button>
          </div>
        </div>

        {/* Schedule Mode Radio Options */}
        <div className="lg:col-span-4 space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">
            {t.selectChildModeLabel}
          </label>
          <div className="space-y-1 rounded-lg border border-slate-200 bg-white p-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs">
              <input
                type="radio"
                name="scheduleMode"
                checked={scheduleMode === 'preserve'}
                onChange={() => setScheduleMode('preserve')}
                className="text-teal-600 focus:ring-teal-500"
              />
              <span className="text-slate-800 font-medium">
                {t.keepExistingDosesOption} ({completedCodes.length} {language === 'sw' ? 'dozi zilizopita' : 'doses'})
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs">
              <input
                type="radio"
                name="scheduleMode"
                checked={scheduleMode === 'all_new'}
                onChange={() => setScheduleMode('all_new')}
                className="text-teal-600 focus:ring-teal-500"
              />
              <span className="text-slate-800 font-medium">{t.allUpcomingOption}</span>
            </label>
          </div>
        </div>

        {/* Apply Button */}
        <div className="lg:col-span-3 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={handleApply}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs py-2.5 px-3.5 shadow-xs transition-colors"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>{t.applyScheduleBtn}</span>
          </button>
          <span className="text-2xs text-center text-slate-500">
            {language === 'sw'
              ? `Inasasisha ratiba ya mtoto ${child.name}`
              : `Updates ${child.name}'s official timetable`}
          </span>
        </div>
      </div>

      {/* Applied Confirmation Alert */}
      {appliedToast && (
        <div className="mt-3 flex items-center justify-between rounded-xl bg-emerald-600 p-3 text-xs text-white shadow-xs">
          <div className="flex items-center gap-2">
            <FileCheck className="h-4 w-4" />
            <span className="font-semibold">{t.scheduleUpdatedAlert}</span>
          </div>
          <button
            onClick={() => setAppliedToast(false)}
            className="rounded p-1 hover:bg-emerald-700 text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* KPI Overview of Generated Schedule */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 border-t border-teal-100/60 pt-3 text-xs">
        <div className="rounded-lg bg-white border border-slate-200 p-2.5">
          <span className="text-2xs font-semibold text-slate-500 uppercase">
            {language === 'sw' ? 'Jumla ya Dozi za WHO' : 'Total WHO Doses'}
          </span>
          <div className="font-mono text-base font-bold text-slate-900 mt-0.5">
            {generatedSchedule.length} {language === 'sw' ? 'chanjo' : 'vaccines'}
          </div>
        </div>

        <div className="rounded-lg bg-white border border-slate-200 p-2.5">
          <span className="text-2xs font-semibold text-slate-500 uppercase">
            {language === 'sw' ? 'Zinazotakiwa / Zilizochelewa' : 'Due / Overdue'}
          </span>
          <div className="font-mono text-base font-bold text-amber-700 mt-0.5">
            {dueCount} {language === 'sw' ? 'dozi sasa' : 'doses now'}
          </div>
        </div>

        <div className="rounded-lg bg-white border border-slate-200 p-2.5">
          <span className="text-2xs font-semibold text-slate-500 uppercase">
            {language === 'sw' ? 'Zilizokamilika' : 'Completed Doses'}
          </span>
          <div className="font-mono text-base font-bold text-teal-800 mt-0.5">
            {completedCount} {language === 'sw' ? 'zimetolewa' : 'administered'}
          </div>
        </div>

        <div className="rounded-lg bg-white border border-slate-200 p-2.5">
          <span className="text-2xs font-semibold text-slate-500 uppercase">
            {language === 'sw' ? 'Zijazo za Baadaye' : 'Future Doses'}
          </span>
          <div className="font-mono text-base font-bold text-slate-700 mt-0.5">
            {upcomingCount} {language === 'sw' ? 'zinazosubiri' : 'scheduled'}
          </div>
        </div>
      </div>

      {/* Generated Milestones Grid (7 WHO Clinic Appointments) */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 text-teal-600" />
            <span>{t.previewScheduleTitle}</span>
          </h4>
          <span className="text-2xs text-slate-500">
            {language === 'sw'
              ? 'Bofya hatua yoyote kuona taarifa za ugonjwa & namna ya kupewa'
              : 'Click any appointment to view target diseases & route'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {milestoneGroups.map((mg) => {
            const isSelected = selectedMilestoneWeeks === mg.weeks;

            return (
              <div
                key={mg.weeks}
                onClick={() => setSelectedMilestoneWeeks(isSelected ? null : mg.weeks)}
                className={`rounded-xl border p-3 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-teal-500 bg-white ring-2 ring-teal-200 shadow-md'
                    : mg.groupStatus === 'completed'
                    ? 'border-teal-200 bg-teal-50/40 hover:bg-teal-50'
                    : mg.groupStatus === 'due' || mg.groupStatus === 'overdue'
                    ? 'border-amber-300 bg-amber-50/40 hover:bg-amber-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{mg.label}</span>
                  <span
                    className={`text-2xs font-semibold px-2 py-0.5 rounded-full ${
                      mg.groupStatus === 'completed'
                        ? 'bg-teal-100 text-teal-800'
                        : mg.groupStatus === 'due'
                        ? 'bg-amber-100 text-amber-900'
                        : mg.groupStatus === 'overdue'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {mg.groupStatus === 'completed'
                      ? language === 'sw' ? 'Imekamilika' : 'Completed'
                      : mg.groupStatus === 'due'
                      ? language === 'sw' ? 'Inatakiwa Sasa' : 'Due Now'
                      : mg.groupStatus === 'overdue'
                      ? language === 'sw' ? 'Imechelewa' : 'Overdue'
                      : language === 'sw' ? 'Inayokuja' : 'Upcoming'}
                  </span>
                </div>

                <div className="mt-1 flex items-baseline justify-between">
                  <span className="font-mono text-xs font-bold text-teal-800">
                    {mg.scheduledDate}
                  </span>
                  <span className="text-2xs text-slate-500 font-medium">
                    {mg.formattedDate.split(',')[0]}
                  </span>
                </div>

                <p className="mt-1 text-2xs text-slate-500 line-clamp-1">
                  {mg.recommendedWindow} · {mg.minInterval}
                </p>

                {/* Vaccines List in this visit */}
                <div className="mt-2 space-y-1 border-t border-slate-100 pt-2">
                  {mg.vaxes.map((vax) => (
                    <div
                      key={vax.id}
                      className="flex items-center justify-between text-2xs"
                    >
                      <span className="font-medium text-slate-800 truncate pr-2">
                        {vax.vaccineName}
                      </span>
                      {vax.status === 'completed' ? (
                        <Check className="h-3 w-3 text-teal-600 shrink-0" />
                      ) : (
                        <span className="font-mono text-slate-400 shrink-0">
                          {vax.vaccineCode}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Expanded Details when selected */}
                {isSelected && (
                  <div className="mt-2.5 rounded-lg bg-slate-50 p-2.5 text-2xs border border-slate-200 space-y-1.5 animate-fadeIn">
                    <div className="font-semibold text-slate-700">
                      {language === 'sw' ? 'Kinga ya Magonjwa & Njia ya Kupewa:' : 'Disease Protection & Route:'}
                    </div>
                    {mg.vaxes.map((vax) => (
                      <div key={vax.vaccineCode} className="border-b border-slate-200/60 pb-1 last:border-none">
                        <span className="font-semibold text-slate-800">{vax.vaccineCode}: </span>
                        <span className="text-slate-600">{vax.diseasesPrevented.join(', ')}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* WHO Interval Rules Reference Modal */}
      {showWhoRulesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-teal-600" />
                  <span>WHO Recommended Immunization Intervals &amp; Clinical Rules</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Scientific rationale for spacing pediatric vaccine doses in the Expanded Programme on Immunization (EPI).
                </p>
              </div>
              <button
                onClick={() => setShowWhoRulesModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs text-slate-700">
              {/* Rule 1: Birth Doses */}
              <div className="rounded-xl border border-teal-200 bg-teal-50/50 p-3.5">
                <h4 className="font-bold text-teal-950 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-teal-700" />
                  <span>1. Birth Doses (BCG, OPV-0, HepB-BD) — Day 0 (Within 24 Hours)</span>
                </h4>
                <p className="mt-1 text-slate-600">
                  Hepatitis B birth dose must be administered within 24 hours of delivery to prevent perinatal transmission from carrier mothers. BCG protects against severe disseminated childhood TB and tuberculous meningitis.
                </p>
              </div>

              {/* Rule 2: Minimum Age for Primary Series */}
              <div className="rounded-xl border border-slate-200 bg-white p-3.5">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-slate-600" />
                  <span>2. 6-Week Minimum Age Rule for Primary Series</span>
                </h4>
                <p className="mt-1 text-slate-600">
                  Pentavalent-1, PCV-1, and Rotavirus-1 should not be administered before 6 weeks of age (42 days). Circulating maternal IgG antibodies and immature neonatal immune receptors can interfere with vaccine antibody response if given too early.
                </p>
              </div>

              {/* Rule 3: 4-Week Minimum Spacing Rule */}
              <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3.5">
                <h4 className="font-bold text-amber-950 flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4 text-amber-700" />
                  <span>3. 4-Week (28-Day) Minimum Spacing Rule for Multi-Dose Series</span>
                </h4>
                <p className="mt-1 text-slate-600">
                  Doses within a multidose series (e.g. Penta 1 to Penta 2, or Penta 2 to Penta 3) must be separated by an absolute minimum of 4 weeks (28 days). The standard WHO schedule uses 4-week intervals (6 weeks, 10 weeks, 14 weeks). Any dose given less than 28 days after the preceding dose does not count toward valid immunization and must be repeated.
                </p>
              </div>

              {/* Rule 4: Measles & Rubella Timing */}
              <div className="rounded-xl border border-slate-200 bg-white p-3.5">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Syringe className="h-4 w-4 text-teal-600" />
                  <span>4. Measles-Rubella (MR) Schedule — 9 Months &amp; 18 Months</span>
                </h4>
                <p className="mt-1 text-slate-600">
                  MR-1 is recommended at 9 completed months (39 weeks) in countries with ongoing measles transmission. MR-2 is given at 18 months (minimum 6 months after MR-1) to achieve herd immunity of 95%+ and close any primary vaccine failure gaps.
                </p>
              </div>

              {/* Rule 5: Catch-up Guidance */}
              <div className="rounded-xl border border-slate-200 bg-white p-3.5">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <RotateCcw className="h-4 w-4 text-slate-600" />
                  <span>5. Catch-up Protocol — Never Restart the Series</span>
                </h4>
                <p className="mt-1 text-slate-600">
                  If a child arrives late for any scheduled vaccine, there is no need to restart the course from dose 1. Simply administer the next due dose and schedule subsequent doses following the minimum 4-week interval.
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end border-t border-slate-200 pt-3">
              <button
                type="button"
                onClick={() => setShowWhoRulesModal(false)}
                className="rounded-lg bg-teal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-700 transition-colors"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
