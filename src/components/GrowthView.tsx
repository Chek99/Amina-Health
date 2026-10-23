import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WhoGrowthChart } from './WhoGrowthChart';
import {
  WHO_WEIGHT_BOYS,
  WHO_WEIGHT_GIRLS,
  WHO_HEIGHT_BOYS,
  WHO_HEIGHT_GIRLS,
  WHO_HEAD_CIRC,
  evaluateGrowthPercentile,
} from '../data/whoStandards';
import {
  LineChart,
  TrendingUp,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Award,
  Sparkles,
  Calendar,
  Activity,
  History,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const GrowthView: React.FC = () => {
  const {
    language,
    t,
    activeChild,
    growthRecords,
    addGrowthRecord,
    milestones,
    toggleMilestone,
    vaccines,
    clinicalEncounters,
  } = useApp();

  const [activeChart, setActiveChart] = useState<'weight' | 'height' | 'head'>('weight');
  const [showAddModal, setShowAddModal] = useState(false);

  // New record form
  const [recordDate, setRecordDate] = useState(new Date().toISOString().split('T')[0]);
  const [recordWeight, setRecordWeight] = useState(5.8);
  const [recordHeight, setRecordHeight] = useState(59.5);
  const [recordHeadCirc, setRecordHeadCirc] = useState(39.5);
  const [recordBy, setRecordBy] = useState('Mother Grace (Home Digital Scale)');
  const [isClinicVerified, setIsClinicVerified] = useState(false);
  const [recordNotes, setRecordNotes] = useState('');

  // Child-specific growth records sorted by date
  const childRecords = growthRecords
    .filter((r) => r.childId === activeChild.id)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const latestRecord = childRecords[childRecords.length - 1];

  // Select appropriate WHO standard
  const weightStandards = activeChild.gender === 'boy' ? WHO_WEIGHT_BOYS : WHO_WEIGHT_GIRLS;
  const heightStandards = activeChild.gender === 'boy' ? WHO_HEIGHT_BOYS : WHO_HEIGHT_GIRLS;
  const currentStandard = activeChart === 'weight' ? weightStandards : activeChart === 'height' ? heightStandards : WHO_HEAD_CIRC;

  const latestMetricValue = latestRecord
    ? activeChart === 'weight'
      ? latestRecord.weightKg
      : activeChart === 'height'
      ? latestRecord.heightCm
      : latestRecord.headCircCm
    : 3.3;

  const currentPercentile = latestRecord
    ? evaluateGrowthPercentile(latestMetricValue, latestRecord.ageInMonths, currentStandard)
    : { band: 'Median (P50)', alert: false, description: 'Normal newborn baseline' };

  // Growth velocity calculation (weight change between last two records)
  let velocitySummary = 'Baseline weight established';
  if (childRecords.length >= 2) {
    const prev = childRecords[childRecords.length - 2];
    const diffKg = latestRecord.weightKg - prev.weightKg;
    const days = Math.max(1, Math.round((new Date(latestRecord.date).getTime() - new Date(prev.date).getTime()) / (1000 * 3600 * 24)));
    const gramsPerDay = Math.round((diffKg * 1000) / days);
    velocitySummary = `+${diffKg.toFixed(2)} kg over ${days} days (~${gramsPerDay} g/day)`;
  }

  // Handle milestone toggle with confetti celebration
  const handleMilestoneClick = (id: string, currentlyAchieved: boolean) => {
    toggleMilestone(id);
    if (!currentlyAchieved) {
      try {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {}
    }
  };

  const handleSaveGrowthRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const birthDate = new Date(activeChild.dob);
    const recDate = new Date(recordDate);
    const diffMonths = Math.max(0, (recDate.getTime() - birthDate.getTime()) / (1000 * 3600 * 24 * 30.4375));
    const bmiCalc = Number(recordHeight) > 0 ? Number(recordWeight) / Math.pow(Number(recordHeight) / 100, 2) : 14;

    addGrowthRecord({
      date: recordDate,
      ageInMonths: parseFloat(diffMonths.toFixed(1)),
      weightKg: parseFloat(Number(recordWeight).toFixed(2)),
      heightCm: parseFloat(Number(recordHeight).toFixed(1)),
      headCircCm: parseFloat(Number(recordHeadCirc).toFixed(1)),
      bmi: parseFloat(bmiCalc.toFixed(1)),
      recordedBy: recordBy,
      clinicVerified: isClinicVerified,
      notes: recordNotes || 'Periodic routine measurement',
    });

    setShowAddModal(false);
    setRecordNotes('');
  };



  return (
    <div className="space-y-6">
      {/* Top Banner / Headline */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">{t.growthTitle}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.growthSubtitle} ({activeChild.name} · {activeChild.gender === 'boy' ? 'Boy' : 'Girl'}).
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-teal-700 transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>{t.logGrowthBtn}</span>
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-2xs font-semibold text-slate-500 uppercase tracking-wider">{t.currentWeightLabel}</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-slate-900 tabular-nums">
              {latestRecord ? `${latestRecord.weightKg} kg` : '3.30 kg'}
            </span>
            <span className="text-xs text-teal-700 font-medium">WHO P50</span>
          </div>
          <p className="text-2xs text-slate-500 mt-1">Birth: {activeChild.birthWeightKg} kg · Gain: {velocitySummary}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-2xs font-semibold text-slate-500 uppercase tracking-wider">{t.lengthLabel}</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-slate-900 tabular-nums">
              {latestRecord ? `${latestRecord.heightCm} cm` : '50.2 cm'}
            </span>
            <span className="text-xs text-slate-500">Normal Range</span>
          </div>
          <p className="text-2xs text-slate-500 mt-1">Birth length: {activeChild.birthHeightCm} cm</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-2xs font-semibold text-slate-500 uppercase tracking-wider">{t.headCircLabel}</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-slate-900 tabular-nums">
              {latestRecord ? `${latestRecord.headCircCm} cm` : '34.8 cm'}
            </span>
            <span className="text-xs text-slate-500">Brain development</span>
          </div>
          <p className="text-2xs text-slate-500 mt-1">Fontanelle soft &amp; flat (Normative)</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-2xs font-semibold text-slate-500 uppercase tracking-wider">{t.percentileBandLabel}</div>
          <div className="mt-1 text-sm font-bold text-teal-800">{currentPercentile.band}</div>
          <p className="text-2xs text-slate-500 mt-1 line-clamp-1">{currentPercentile.description}</p>
        </div>
      </div>

      {/* WHO Growth Percentile Recharts Visualization */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-teal-600" />
            <h3 className="text-sm font-semibold text-slate-900">
              {t.whoCurveTitle}
            </h3>
          </div>
          <span className="text-2xs text-slate-500 font-medium">
            WHO Anthro Reference Standards · {activeChild.gender === 'boy' ? 'Boys' : 'Girls'}
          </span>
        </div>

        <WhoGrowthChart
          child={activeChild}
          records={growthRecords}
          activeMetric={activeChart}
          onMetricChange={setActiveChart}
          language={language}
          t={t}
        />
      </div>

      {/* Two-Column Section: Growth History Table & Developmental Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Child Health History Timeline (as requested in PDF Page 2) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-teal-600" />
              <h3 className="text-sm font-semibold text-slate-900">{t.timelineTitle}</h3>
            </div>
            <span className="text-2xs text-slate-500">Birth to Present Event Log</span>
          </div>

          <div className="mt-4 relative pl-6 border-l-2 border-slate-200 space-y-6">
            {/* Event 1: Birth */}
            <div className="relative">
              <span className="absolute -left-[31px] top-0 flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-white text-2xs font-bold ring-4 ring-white">
                1
              </span>
              <div className="text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">Birth &amp; Neonatal Baseline</span>
                  <span className="font-mono text-slate-400 text-2xs">{activeChild.dob}</span>
                </div>
                <p className="text-slate-600 mt-1">
                  Delivered at term ({activeChild.gestationalAgeWeeks}w), Apgar {activeChild.apgarScore}. Birth weight {activeChild.birthWeightKg} kg, Length {activeChild.birthHeightCm} cm.
                </p>
                <div className="mt-1 flex gap-2 text-2xs text-slate-500">
                  <span className="font-medium text-teal-700">BCG &amp; OPV-0 administered at delivery</span>
                </div>
              </div>
            </div>

            {/* Event 2: 2-week check */}
            <div className="relative">
              <span className="absolute -left-[31px] top-0 flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-white text-2xs font-bold ring-4 ring-white">
                2
              </span>
              <div className="text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">2-Week Home Weight Verification</span>
                  <span className="font-mono text-slate-400 text-2xs">2026-08-26</span>
                </div>
                <p className="text-slate-600 mt-1">
                  Regained birth weight smoothly (3.65 kg). Umbilical cord stump dried and detached cleanly.
                </p>
              </div>
            </div>

            {/* Event 3: 6-week EPI */}
            <div className="relative">
              <span className="absolute -left-[31px] top-0 flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-white text-2xs font-bold ring-4 ring-white">
                3
              </span>
              <div className="text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">6-Week Clinic Visit &amp; EPI Vaccination</span>
                  <span className="font-mono text-slate-400 text-2xs">2026-09-23</span>
                </div>
                <p className="text-slate-600 mt-1">
                  Weight 4.8 kg. Pentavalent-1, PCV-1, Rota-1 administered by Nurse Sister Mary Mwangi. MOH Handbook stamped.
                </p>
              </div>
            </div>

            {/* Event 4: 10-week milestones */}
            <div className="relative">
              <span className="absolute -left-[31px] top-0 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white text-2xs font-bold ring-4 ring-white">
                4
              </span>
              <div className="text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">10-Week Development Checkpoint</span>
                  <span className="font-mono text-slate-400 text-2xs">2026-10-21</span>
                </div>
                <p className="text-slate-600 mt-1">
                  Weight 5.85 kg. Cooing sounds, smiling responsively, strong neck tone during tummy time.
                </p>
                <span className="inline-block mt-1 text-2xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md font-medium">
                  Pentavalent-2 &amp; PCV-2 due Oct 25
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Development Milestones Checklist */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-teal-600" />
              <h3 className="text-sm font-semibold text-slate-900">{t.milestonesTitle}</h3>
            </div>
            <span className="text-2xs text-teal-700 font-semibold">
              {milestones.filter((m) => m.isAchieved).length} of {milestones.length} Achieved
            </span>
          </div>

          <div className="mt-3 space-y-2.5">
            {milestones.map((m) => (
              <div
                key={m.id}
                onClick={() => handleMilestoneClick(m.id, m.isAchieved)}
                className={`flex items-start gap-3 rounded-xl p-3 border transition-colors cursor-pointer ${
                  m.isAchieved ? 'border-teal-200 bg-teal-50/50' : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div
                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-md border ${
                    m.isAchieved ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300 bg-white'
                  }`}
                >
                  {m.isAchieved && <CheckCircle2 className="h-3 w-3" />}
                </div>

                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className={`font-semibold ${m.isAchieved ? 'text-teal-900' : 'text-slate-800'}`}>
                      {m.title}
                    </span>
                    <span className="text-2xs font-mono text-slate-400">Target: {m.expectedAgeMonths}m</span>
                  </div>
                  <p className="text-slate-500 mt-0.5">{m.description}</p>
                  {m.isAchieved && m.achievedDate && (
                    <span className="inline-block mt-1 text-2xs text-teal-700 font-medium">
                      Achieved: {m.achievedDate}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Log Measurement Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-semibold text-slate-900">Record Growth Measurement</h3>
            <p className="text-xs text-slate-500 mt-0.5">Will be plotted directly against WHO percentile curves.</p>

            <form onSubmit={handleSaveGrowthRecord} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-700">Measurement Date</label>
                <input
                  type="date"
                  required
                  value={recordDate}
                  onChange={(e) => setRecordDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-medium text-slate-700">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={recordWeight}
                    onChange={(e) => setRecordWeight(parseFloat(e.target.value) || 0)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700">Length (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={recordHeight}
                    onChange={(e) => setRecordHeight(parseFloat(e.target.value) || 0)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700">Head (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={recordHeadCirc}
                    onChange={(e) => setRecordHeadCirc(parseFloat(e.target.value) || 0)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700">Recorded By</label>
                <input
                  type="text"
                  value={recordBy}
                  onChange={(e) => setRecordBy(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="clinicVerifiedCheck"
                  checked={isClinicVerified}
                  onChange={(e) => setIsClinicVerified(e.target.checked)}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="clinicVerifiedCheck" className="text-xs text-slate-700">
                  Verified by healthcare provider with medical scale
                </label>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700">Clinical or Mother Observations</label>
                <textarea
                  value={recordNotes}
                  onChange={(e) => setRecordNotes(e.target.value)}
                  placeholder="e.g. Vigorous feeding, smiling, good muscle tone"
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
                />
              </div>

              <div className="mt-4 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-teal-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-teal-700"
                >
                  Save Measurement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
