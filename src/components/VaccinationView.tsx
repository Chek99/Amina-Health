import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VaccineRecord } from '../types';
import { VaccineScheduleGenerator } from './VaccineScheduleGenerator';
import {
  Shield,
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageSquare,
  Send,
  Calendar,
  Syringe,
  Check,
  Smartphone,
  ChevronRight,
  Info,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const VaccinationView: React.FC = () => {
  const {
    language,
    t,
    activeChild,
    vaccines,
    updateVaccineStatus,
    generateAndApplySchedule,
    sendSmsReminder,
    smsLogs,
  } = useApp();

  const [showGenerator, setShowGenerator] = useState(true);
  const [filter, setFilter] = useState<'all' | 'due' | 'completed' | 'upcoming'>('all');
  const [selectedVaccine, setSelectedVaccine] = useState<VaccineRecord | null>(null);

  // Administration modal
  const [adminBatch, setAdminBatch] = useState('BATCH-MOH-2026-9921');
  const [adminNurse, setAdminNurse] = useState('Sister Mary Mwangi (RN Cert #49102)');

  // SMS Simulator State
  const [smsPhone, setSmsPhone] = useState(activeChild.emergencyContact.phone || '+254 712 345678');
  const [smsTemplate, setSmsTemplate] = useState('vaccine_due');
  const [customSmsText, setCustomSmsText] = useState('');
  const [smsSending, setSmsSending] = useState(false);
  const [lastDeliveredSms, setLastDeliveredSms] = useState<string | null>(null);

  // Compute analytics
  const totalCount = vaccines.length;
  const completedCount = vaccines.filter((v) => v.status === 'completed').length;
  const dueCount = vaccines.filter((v) => v.status === 'due' || v.status === 'overdue').length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Filtered list
  const filteredVaccines = vaccines.filter((v) => {
    if (filter === 'due') return v.status === 'due' || v.status === 'overdue';
    if (filter === 'completed') return v.status === 'completed';
    if (filter === 'upcoming') return v.status === 'upcoming';
    return true;
  });

  const handleMarkAdministered = () => {
    if (!selectedVaccine) return;
    updateVaccineStatus(selectedVaccine.id, 'completed', adminBatch, adminNurse);
    setSelectedVaccine(null);
  };

  const handleTriggerSms = async (e: React.FormEvent) => {
    e.preventDefault();
    setSmsSending(true);
    const log = await sendSmsReminder(
      smsPhone,
      smsTemplate,
      customSmsText || undefined
    );
    setSmsSending(false);
    setLastDeliveredSms(log.body);
    setTimeout(() => setLastDeliveredSms(null), 8000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">{t.vaccinesTitle}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.vaccinesSubtitle} ({activeChild.name} · {activeChild.dob}).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Toggle WHO Generator Button */}
          <button
            type="button"
            onClick={() => setShowGenerator(!showGenerator)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors shrink-0 shadow-2xs ${
              showGenerator
                ? 'bg-teal-700 text-white'
                : 'bg-white border border-teal-300 text-teal-800 hover:bg-teal-50'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{language === 'sw' ? 'Kizalishi cha Ratiba (DOB)' : 'WHO DOB Generator'}</span>
            {showGenerator ? (
              <ChevronUp className="h-3.5 w-3.5 opacity-80" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 opacity-80" />
            )}
          </button>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 text-xs shrink-0">
            <button
              onClick={() => setFilter('all')}
              className={`rounded-md px-3 py-1 font-medium transition-colors ${
                filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.allFilter} ({totalCount})
            </button>
            <button
              onClick={() => setFilter('due')}
              className={`rounded-md px-3 py-1 font-medium transition-colors ${
                filter === 'due' ? 'bg-white text-amber-700 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.dueFilter} ({dueCount})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`rounded-md px-3 py-1 font-medium transition-colors ${
                filter === 'completed' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.completedFilter} ({completedCount})
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`rounded-md px-3 py-1 font-medium transition-colors ${
                filter === 'upcoming' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.upcomingFilter}
            </button>
          </div>
        </div>
      </div>

      {/* WHO Smart Immunization Schedule Generator Component */}
      {showGenerator && (
        <VaccineScheduleGenerator
          child={activeChild}
          currentVaccines={vaccines}
          onApplySchedule={(dob, preserve) => {
            generateAndApplySchedule(activeChild.id, dob, preserve);
          }}
          language={language}
          t={t}
        />
      )}

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-2xs font-semibold text-slate-500 uppercase tracking-wider">
            Immunization Completion Rate
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="font-mono text-3xl font-bold text-slate-900 tabular-nums">
              {completionRate}%
            </span>
            <span className="text-xs font-medium text-teal-700">
              {completedCount} of {totalCount} doses
            </span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full bg-teal-600 transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-2xs font-semibold text-slate-500 uppercase tracking-wider">
            Current Immunization Stage
          </div>
          <div className="mt-1 text-base font-bold text-slate-900">
            10-Week EPI Doses Due
          </div>
          <p className="text-2xs text-slate-500 mt-1">
            Pentavalent 2, PCV 2, Rotavirus 2, OPV 2 recommended within this window.
          </p>
          <span className="inline-block mt-2 text-2xs font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
            Visit St. Jude Clinic by Oct 25
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-2xs font-semibold text-slate-500 uppercase tracking-wider">
            Automated SMS Notification Status
          </div>
          <div className="mt-1 text-base font-bold text-slate-900">
            Active · Phone: {activeChild.emergencyContact.phone}
          </div>
          <p className="text-2xs text-slate-500 mt-1">
            2 SMS alerts dispatched via GSM gateway; 0 delivery failures.
          </p>
          <span className="inline-block mt-2 text-2xs font-medium text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
            Free Public Health SMS Enabled
          </span>
        </div>
      </div>

      {/* Main Grid: Vaccine List (left 60%) + SMS Simulator (right 40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Vaccine List */}
        <div className="lg:col-span-7 space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">WHO Immunization Timeline</h3>

            <div className="space-y-2.5">
              {filteredVaccines.map((v) => {
                const isDone = v.status === 'completed';
                const isDue = v.status === 'due' || v.status === 'overdue';

                return (
                  <div
                    key={v.id}
                    className={`rounded-xl border p-3 transition-colors ${
                      isDone
                        ? 'border-teal-200 bg-teal-50/30'
                        : isDue
                        ? 'border-amber-300 bg-amber-50/40'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
                            isDone
                              ? 'bg-teal-600 text-white'
                              : isDue
                              ? 'bg-amber-500 text-white'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {isDone ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : (
                            <Syringe className="h-3.5 w-3.5" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-slate-900">{v.vaccineName}</span>
                            <span className="text-2xs font-medium text-slate-500">({v.targetAgeLabel})</span>
                          </div>

                          <div className="mt-1 text-2xs text-slate-500">
                            Prevents: {v.diseasesPrevented.join(', ')}
                          </div>

                          {isDone ? (
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-2xs text-teal-800">
                              <span>Administered: {v.administeredDate}</span>
                              <span>·</span>
                              <span className="font-mono">{v.batchNumber}</span>
                              <span>·</span>
                              <span>{v.administeredBy}</span>
                            </div>
                          ) : (
                            <div className="mt-1 text-2xs text-slate-600">
                              Target Date: <span className="font-mono font-medium">{v.scheduledDate}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="shrink-0">
                        {isDone ? (
                          <span className="text-2xs font-semibold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-md">
                            Verified
                          </span>
                        ) : (
                          <button
                            onClick={() => setSelectedVaccine(v)}
                            className="rounded-lg bg-teal-600 px-2.5 py-1 text-2xs font-semibold text-white hover:bg-teal-700 transition-colors"
                          >
                            Mark Given
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* SMS Simulator & Notification Engine */}
        <div className="lg:col-span-5 space-y-4">
          {/* Simulated Mobile Handset Notification Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-white shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-2xs text-slate-400">
              <span className="font-mono">SAFARICOM 4G</span>
              <div className="flex items-center gap-1">
                <span>SIMULATED PHONE DRAWER</span>
              </div>
            </div>

            {/* Notification Drawer Banner */}
            <div className="mt-3 rounded-xl bg-slate-800/90 p-3 border border-slate-700 text-xs">
              <div className="flex items-center justify-between text-2xs text-teal-400">
                <span className="font-semibold flex items-center gap-1">
                  <Smartphone className="h-3 w-3" /> MOH Clinic SMS Gateway
                </span>
                <span className="text-slate-400">Just Now</span>
              </div>
              <p className="mt-1 text-xs text-slate-200 leading-relaxed font-sans">
                {lastDeliveredSms ||
                  `[MOH Alert] Jambo mama Grace! Reminder: Leo is due for Pentavalent-2 & PCV-2 vaccines on Oct 25, 2026 at St. Jude Clinic. Please carry the Child Health Booklet.`}
              </p>
            </div>
          </div>

          {/* SMS Trigger Tester Form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <MessageSquare className="h-4 w-4 text-teal-600" />
              <h3 className="text-sm font-semibold text-slate-900">SMS Notification Simulator</h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Test automated SMS reminders sent to the mother&apos;s phone before immunization appointments.
            </p>

            <form onSubmit={handleTriggerSms} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-700">Mother&apos;s Mobile Number</label>
                <input
                  type="text"
                  value={smsPhone}
                  onChange={(e) => setSmsPhone(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700">Message Template</label>
                <select
                  value={smsTemplate}
                  onChange={(e) => setSmsTemplate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs text-slate-900"
                >
                  <option value="vaccine_due">Vaccine Due 48h Advance Reminder</option>
                  <option value="overdue_catchup">Overdue Vaccine Catch-up Notice</option>
                  <option value="emergency_alert">Emergency High Fever Dispatch Alert</option>
                  <option value="wellness_check">Maternal Postnatal Care &amp; Hydration Tip</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700">Custom SMS Body (Optional)</label>
                <textarea
                  value={customSmsText}
                  onChange={(e) => setCustomSmsText(e.target.value)}
                  placeholder="Leave blank to use official MOH template..."
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
                />
              </div>

              <button
                type="submit"
                disabled={smsSending}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-teal-700 transition-colors disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{smsSending ? 'Transmitting SMS...' : 'Dispatch Test SMS Notification'}</span>
              </button>
            </form>

            {/* Recent SMS logs */}
            <div className="mt-4 border-t border-slate-100 pt-3">
              <span className="text-2xs font-semibold text-slate-400 uppercase tracking-wider">Recent Dispatches</span>
              <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                {smsLogs.slice(0, 3).map((log) => (
                  <div key={log.id} className="rounded-lg bg-slate-50 p-2 text-2xs border border-slate-100">
                    <div className="flex justify-between text-slate-500 font-mono">
                      <span>{log.phone}</span>
                      <span className="text-teal-700 font-semibold">{log.status}</span>
                    </div>
                    <p className="mt-0.5 text-slate-700 font-sans line-clamp-2">{log.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vaccine Administration Modal */}
      {selectedVaccine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-semibold text-slate-900">Record Vaccine Administration</h3>
            <p className="text-xs text-slate-500 mt-0.5">{selectedVaccine.vaccineName} ({selectedVaccine.targetAgeLabel})</p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-700">Batch / Lot Number</label>
                <input
                  type="text"
                  value={adminBatch}
                  onChange={(e) => setAdminBatch(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700">Administered By (Nurse / Midwife)</label>
                <input
                  type="text"
                  value={adminNurse}
                  onChange={(e) => setAdminNurse(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900"
                />
              </div>

              <div className="rounded-lg bg-teal-50 p-3 border border-teal-100 text-xs text-teal-900">
                <span className="font-semibold">MOH Legal Verification:</span> Saving this entry signs off the digital immunization card and syncs with paper booklet #{activeChild.paperBookletNumber}.
              </div>

              <div className="mt-5 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedVaccine(null)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleMarkAdministered}
                  className="rounded-lg bg-teal-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-teal-700"
                >
                  Confirm Administration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
