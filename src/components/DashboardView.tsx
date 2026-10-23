import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Baby,
  Heart,
  Syringe,
  Activity,
  Calendar,
  AlertTriangle,
  QrCode,
  Droplets,
  Clock,
  Moon,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
  Users,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { QrPassportModal } from './QrPassportModal';

interface DashboardViewProps {
  onNavigate: (tab: string) => void;
  onOpenSos: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate, onOpenSos }) => {
  const {
    t,
    activeChild,
    children,
    growthRecords,
    vaccines,
    dailyLog,
    maternalLog,
    appointments,
    clinicalEncounters,
    setActiveChildId,
  } = useApp();

  const [showQr, setShowQr] = useState(false);

  // Child-specific stats
  const childGrowth = growthRecords.filter((g) => g.childId === activeChild.id);
  const latestGrowth = childGrowth[childGrowth.length - 1];

  const totalVaccines = vaccines.length;
  const completedVaccines = vaccines.filter((v) => v.status === 'completed').length;
  const vaccinePercent = totalVaccines > 0 ? Math.round((completedVaccines / totalVaccines) * 100) : 0;
  const nextVaccine = vaccines.find((v) => v.status === 'due' || v.status === 'overdue' || v.status === 'upcoming');

  // Multi-child twin check
  const twinSibling = children.find((c) => c.id !== activeChild.id && c.dob === activeChild.dob);

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 border border-teal-200 shadow-xs">
              <Baby className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  {t.welcomeTitle}
                </h1>
                <span className="rounded-md bg-teal-50 px-2 py-0.5 text-2xs font-semibold text-teal-800 border border-teal-200">
                  {maternalLog.daysPostpartum} {t.dayPostpartum}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {t.welcomeSubtitle} <strong className="text-slate-800">{activeChild.name}</strong> ({activeChild.gender === 'boy' ? 'Boy' : 'Girl'}, born {activeChild.dob}) · Assigned Clinic: {activeChild.clinicAssigned}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-2xs text-slate-500 font-mono">
                <span>Booklet #{activeChild.paperBookletNumber}</span>
                <span>·</span>
                <span>Blood: {activeChild.bloodGroup}</span>
                <span>·</span>
                <span>Gestation: {activeChild.gestationalAgeWeeks}w</span>
              </div>
            </div>
          </div>

          {/* Quick Action buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setShowQr(true)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors"
            >
              <QrCode className="h-4 w-4 text-teal-600" />
              <span>{t.showQrBtn}</span>
            </button>
            <button
              onClick={onOpenSos}
              className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-rose-700 shadow-xs transition-colors"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>{t.openTriageBtn}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI 4-Column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Infant Growth Weight */}
        <div
          onClick={() => onNavigate('growth')}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-teal-400 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-2xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>{t.growthWeightKpi}</span>
            <Activity className="h-4 w-4 text-teal-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-slate-900 tabular-nums">
              {latestGrowth ? `${latestGrowth.weightKg} kg` : `${activeChild.birthWeightKg} kg`}
            </span>
            <span className="text-2xs text-teal-700 font-semibold">WHO 50th %ile</span>
          </div>
          <p className="mt-1 text-2xs text-slate-500">
            Birth: {activeChild.birthWeightKg} kg · Height: {latestGrowth ? `${latestGrowth.heightCm} cm` : `${activeChild.birthHeightCm} cm`}
          </p>
        </div>

        {/* Metric 2: Immunization Progress */}
        <div
          onClick={() => onNavigate('vaccines')}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-teal-400 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-2xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>{t.vaccinesKpi}</span>
            <Syringe className="h-4 w-4 text-teal-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-slate-900 tabular-nums">
              {vaccinePercent}%
            </span>
            <span className="text-2xs text-slate-500">{completedVaccines}/{totalVaccines} doses</span>
          </div>
          <p className="mt-1 text-2xs text-amber-700 font-medium">
            Next: {nextVaccine ? nextVaccine.vaccineCode : 'Pentavalent 2'} (Oct 25)
          </p>
        </div>

        {/* Metric 3: Today's Feeds & Diapers */}
        <div
          onClick={() => onNavigate('journal')}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-teal-400 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-2xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>{t.dailyCareKpi}</span>
            <Droplets className="h-4 w-4 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-slate-900 tabular-nums">
              {dailyLog.feedings.length} feeds
            </span>
            <span className="text-2xs text-blue-700">{dailyLog.diapers.length} diapers</span>
          </div>
          <p className="mt-1 text-2xs text-slate-500">
            Tummy Time: {dailyLog.tummyTimeMinutes} min · Hydration normal
          </p>
        </div>

        {/* Metric 4: Maternal Postpartum Wellbeing */}
        <div
          onClick={() => onNavigate('journal')}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-rose-400 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-2xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>{t.maternalKpi}</span>
            <Heart className="h-4 w-4 text-rose-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-slate-900 tabular-nums">
              EPDS: {maternalLog.epdsScore || 4}/30
            </span>
            <span className="text-2xs text-teal-700 font-medium">Low risk</span>
          </div>
          <p className="mt-1 text-2xs text-slate-500">
            Pain: {maternalLog.perinealOrCSectionPain}/10 · Lochia: {maternalLog.lochiaStage}
          </p>
        </div>
      </div>

      {/* Multi-Child Twin Comparison Banner (if twins exist) */}
      {twinSibling && (
        <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50/60 to-teal-50/60 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-2xs">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">
                  Multi-Child Twin Synchronization ({activeChild.name} &amp; {twinSibling.name})
                </h3>
                <p className="text-2xs text-slate-600 mt-0.5">
                  Born same day ({activeChild.dob}). Leo: 5.85 kg · Maya: 5.25 kg. Both on track with 6-week EPI immunizations.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveChildId(twinSibling.id)}
              className="flex items-center gap-1.5 rounded-lg bg-white border border-blue-300 px-3 py-1.5 text-xs font-semibold text-blue-800 hover:bg-blue-50 shadow-2xs transition-colors shrink-0"
            >
              <span>Switch View to {twinSibling.name}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main 2-Column Split: Clinical Appointments & AI Quick Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Clinical Appointments & Timeline Snapshot */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-teal-600" />
                <h3 className="text-sm font-semibold text-slate-900">{t.hospitalSchedule}</h3>
              </div>
              <button
                onClick={() => onNavigate('vaccines')}
                className="text-2xs font-semibold text-teal-700 hover:underline"
              >
                View Immunization Calendar →
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-xs transition-colors hover:bg-slate-50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="font-semibold text-slate-900">{apt.title}</span>
                      <p className="text-2xs text-slate-500 mt-0.5">{apt.doctorName} · {apt.facility}</p>
                      <p className="text-2xs text-slate-600 mt-1 italic">{apt.notes}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono font-bold text-slate-800 text-xs">{apt.date}</span>
                      <span className="block font-mono text-2xs text-slate-400">{apt.time}</span>
                      <span className="inline-block mt-1 rounded bg-teal-100 px-2 py-0.5 text-2xs font-semibold text-teal-800">
                        {apt.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Doctor Notes Snapshot */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-slate-900">{t.latestDoctorExam}</h3>
              </div>
              <button
                onClick={() => onNavigate('doctor_portal')}
                className="text-2xs font-semibold text-blue-700 hover:underline"
              >
                Open Clinician Portal →
              </button>
            </div>

            {clinicalEncounters.length > 0 && (
              <div className="mt-3 text-xs space-y-2">
                <div className="flex justify-between text-2xs text-slate-500">
                  <span className="font-semibold text-slate-800">{clinicalEncounters[0].clinicianName}</span>
                  <span className="font-mono">{clinicalEncounters[0].date}</span>
                </div>
                <p className="text-slate-600 leading-relaxed">{clinicalEncounters[0].clinicalFindings}</p>
                <div className="flex items-center gap-1.5 text-2xs text-teal-800 font-medium">
                  <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
                  <span>Verified &amp; Stamped: {clinicalEncounters[0].stampId}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (5 cols): AI Triage & Quick Help Box */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-teal-200 bg-gradient-to-b from-teal-50/70 to-white p-5 shadow-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-teal-600" />
              <h3 className="text-sm font-bold text-slate-900">{t.askAminaCardTitle}</h3>
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {t.askAminaCardDesc}
            </p>

            <div className="mt-4 space-y-2">
              <button
                onClick={() => onNavigate('ai_triage')}
                className="w-full flex items-center justify-between rounded-xl bg-white border border-teal-200 p-3 text-xs text-left hover:bg-teal-50/50 transition-colors shadow-2xs"
              >
                <span className="font-semibold text-slate-800">Ask Amina AI Pediatric Assistant</span>
                <ChevronRight className="h-4 w-4 text-teal-600" />
              </button>

              <button
                onClick={() => onNavigate('ai_triage')}
                className="w-full flex items-center justify-between rounded-xl bg-white border border-blue-200 p-3 text-xs text-left hover:bg-blue-50/50 transition-colors shadow-2xs"
              >
                <span className="font-semibold text-slate-800">Analyze Baby Crying Sound (Acoustic Triage)</span>
                <ChevronRight className="h-4 w-4 text-blue-600" />
              </button>

              <button
                onClick={onOpenSos}
                className="w-full flex items-center justify-between rounded-xl bg-white border border-rose-200 p-3 text-xs text-left hover:bg-rose-50/50 transition-colors shadow-2xs"
              >
                <span className="font-semibold text-rose-800">Check for Neonatal or Maternal Danger Signs</span>
                <ChevronRight className="h-4 w-4 text-rose-600" />
              </button>
            </div>
          </div>

          {/* Community Parenting Section Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Parenting Tip of the Day
            </h3>
            <p className="mt-1.5 text-xs text-slate-700 font-medium">
              Tummy Time Builds Neck &amp; Shoulder Muscles
            </p>
            <p className="mt-1 text-2xs text-slate-500 leading-relaxed">
              At 2 to 3 months, 15 to 20 minutes of daily awake tummy time strengthens infant cervical extensors,
              paving the way for rolling over and sitting up!
            </p>
            <button
              onClick={() => onNavigate('education')}
              className="mt-3 text-2xs font-semibold text-teal-700 hover:underline"
            >
              Explore Community Education Articles →
            </button>
          </div>
        </div>
      </div>

      <QrPassportModal isOpen={showQr} onClose={() => setShowQr(false)} />
    </div>
  );
};
