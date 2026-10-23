import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ClinicalEncounter } from '../types';
import {
  Stethoscope,
  ClipboardList,
  FileCheck,
  Plus,
  Printer,
  Calendar,
  ShieldCheck,
  Activity,
  Pill,
  Award,
} from 'lucide-react';

export const DoctorPortalView: React.FC = () => {
  const {
    activeChild,
    clinicalEncounters,
    addClinicalEncounter,
    vaccines,
    growthRecords,
    appointments,
    addAppointment,
  } = useApp();

  const [showAddEncounterModal, setShowAddEncounterModal] = useState(false);
  const [showPrintBooklet, setShowPrintBooklet] = useState(false);

  // New Encounter State
  const [clinicianName, setClinicianName] = useState('Dr. Angela Waweru, MBChB, MMed');
  const [cadre, setCadre] = useState<'Pediatrician' | 'Midwife / Nurse' | 'Clinical Officer'>('Pediatrician');
  const [weightKg, setWeightKg] = useState('5.90');
  const [heightCm, setHeightCm] = useState('60.0');
  const [tempC, setTempC] = useState('36.8');
  const [rrBpm, setRrBpm] = useState('38');
  const [hrBpm, setHrBpm] = useState('126');
  const [muacMm, setMuacMm] = useState('120');
  const [findings, setFindings] = useState('Infant alert, responsive smiling, anterior fontanelle flat. Chest clear, heart normal.');
  const [diagnosis, setDiagnosis] = useState('10-Week Healthy Infant Routine Follow-up');
  const [rxMedicine, setRxMedicine] = useState('Vitamin D3 400 IU');
  const [rxDose, setRxDose] = useState('1 drop daily');

  const handleSaveEncounter = (e: React.FormEvent) => {
    e.preventDefault();
    addClinicalEncounter({
      date: new Date().toISOString().split('T')[0],
      clinicianName,
      cadre,
      facility: 'St. Jude Maternal & Child Health Clinic',
      vitals: {
        weightKg: parseFloat(weightKg) || 5.8,
        heightCm: parseFloat(heightCm) || 60,
        tempCelsius: parseFloat(tempC) || 36.8,
        respiratoryRateBpm: parseInt(rrBpm, 10) || 38,
        heartRateBpm: parseInt(hrBpm, 10) || 120,
        muacMm: parseInt(muacMm, 10) || 120,
      },
      clinicalFindings: findings,
      diagnosis,
      prescriptions: rxMedicine
        ? [
            {
              medicine: rxMedicine,
              dosage: rxDose,
              frequency: 'Once Daily',
              duration: '3 Months',
            },
          ]
        : [],
      officialPaperBookletStamped: true,
      stampId: `MOH-CERT-#${Math.floor(10000 + Math.random() * 90000)}`,
    });
    setShowAddEncounterModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-blue-100 px-2 py-0.5 text-2xs font-bold text-blue-800">
              HEALTHCARE PROVIDER PORTAL
            </span>
            <span className="text-2xs text-slate-500">Facility: St. Jude MCH Clinic</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Clinical Examination &amp; Paper-Booklet Sync
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Review pediatric biometric history, record official encounters, and audit MOH Child Health Handbook #{activeChild.paperBookletNumber}.
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setShowPrintBooklet(!showPrintBooklet)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
          >
            <Printer className="h-4 w-4" />
            <span>{showPrintBooklet ? 'Hide Booklet View' : 'Print / Export Paper Booklet'}</span>
          </button>
          <button
            onClick={() => setShowAddEncounterModal(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>Record Clinical Encounter</span>
          </button>
        </div>
      </div>

      {/* Printable 1:1 Child Health Booklet View (Hybrid Approach) */}
      {showPrintBooklet && (
        <div className="rounded-2xl border-2 border-teal-600 bg-white p-6 shadow-md print:border-none">
          <div className="flex items-center justify-between border-b-2 border-teal-600 pb-3">
            <div>
              <div className="text-2xs font-bold text-teal-800 tracking-widest uppercase">
                MINISTRY OF HEALTH · CHILD HEALTH RECORD (ROAD TO HEALTH)
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Official Maternal &amp; Child Health Booklet #{activeChild.paperBookletNumber}
              </h3>
            </div>
            <div className="text-right">
              <span className="font-mono text-xs font-bold text-slate-700">QR LINKED</span>
              <span className="block text-2xs text-teal-700 font-semibold">LEGAL MEDICAL RECORD</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs border-b border-slate-200 pb-4">
            <div>
              <span className="text-slate-400 text-2xs">CHILD NAME</span>
              <p className="font-bold text-slate-900">{activeChild.name}</p>
            </div>
            <div>
              <span className="text-slate-400 text-2xs">DATE OF BIRTH</span>
              <p className="font-mono text-slate-900">{activeChild.dob} ({activeChild.gender})</p>
            </div>
            <div>
              <span className="text-slate-400 text-2xs">BIRTH WEIGHT &amp; APGAR</span>
              <p className="font-mono text-slate-900">{activeChild.birthWeightKg} kg · {activeChild.apgarScore}</p>
            </div>
            <div>
              <span className="text-slate-400 text-2xs">MOTHER / GUARDIAN</span>
              <p className="text-slate-900">{activeChild.emergencyContact.name}</p>
            </div>
          </div>

          {/* Stamped Immunization Table */}
          <div className="mt-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Verified Immunization Register
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200">
                <thead className="bg-slate-100 text-slate-700 text-2xs uppercase">
                  <tr>
                    <th className="p-2 border">Vaccine</th>
                    <th className="p-2 border">Target Age</th>
                    <th className="p-2 border">Status</th>
                    <th className="p-2 border">Admin Date</th>
                    <th className="p-2 border">Batch Lot</th>
                    <th className="p-2 border">Clinician Signature</th>
                  </tr>
                </thead>
                <tbody>
                  {vaccines.slice(0, 8).map((v) => (
                    <tr key={v.id} className="border-t text-2xs">
                      <td className="p-2 border font-medium text-slate-900">{v.vaccineName}</td>
                      <td className="p-2 border text-slate-600">{v.targetAgeLabel}</td>
                      <td className="p-2 border">
                        <span
                          className={`px-1.5 py-0.5 rounded font-semibold ${
                            v.status === 'completed'
                              ? 'bg-teal-100 text-teal-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {v.status}
                        </span>
                      </td>
                      <td className="p-2 border font-mono">{v.administeredDate || '—'}</td>
                      <td className="p-2 border font-mono">{v.batchNumber || '—'}</td>
                      <td className="p-2 border text-slate-600">{v.administeredBy || 'Pending'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center text-2xs text-slate-500 border-t border-slate-100 pt-3">
            <span>Official digital duplicate of physical MOH booklet. Complies with legal medical archive laws.</span>
            <button
              onClick={() => window.print()}
              className="rounded-md bg-slate-900 px-3 py-1 text-white hover:bg-slate-800"
            >
              Print Clean Hardcopy
            </button>
          </div>
        </div>
      )}

      {/* Clinical Encounters List */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-900">Clinical Encounters &amp; Pediatric Notes</h3>

        <div className="space-y-3">
          {clinicalEncounters.map((enc) => (
            <div key={enc.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-slate-900">{enc.clinicianName}</span>
                    <span className="text-2xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md font-medium">
                      {enc.cadre}
                    </span>
                  </div>
                  <p className="text-2xs text-slate-500 mt-0.5">{enc.facility} · Date: {enc.date}</p>
                </div>

                <div className="flex items-center gap-2 text-2xs text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                  <ShieldCheck className="h-4 w-4 text-teal-600" />
                  <span className="font-mono">{enc.stampId}</span>
                </div>
              </div>

              {/* Vitals Strip */}
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-6 gap-2 rounded-xl bg-slate-50 p-2.5 text-xs border border-slate-100 font-mono">
                <div>
                  <span className="text-2xs text-slate-400 block font-sans">Weight</span>
                  <span className="font-bold text-slate-800">{enc.vitals.weightKg} kg</span>
                </div>
                <div>
                  <span className="text-2xs text-slate-400 block font-sans">Length</span>
                  <span className="font-bold text-slate-800">{enc.vitals.heightCm} cm</span>
                </div>
                <div>
                  <span className="text-2xs text-slate-400 block font-sans">Temperature</span>
                  <span className="font-bold text-slate-800">{enc.vitals.tempCelsius}°C</span>
                </div>
                <div>
                  <span className="text-2xs text-slate-400 block font-sans">Resp. Rate</span>
                  <span className="font-bold text-slate-800">{enc.vitals.respiratoryRateBpm}/min</span>
                </div>
                <div>
                  <span className="text-2xs text-slate-400 block font-sans">Heart Rate</span>
                  <span className="font-bold text-slate-800">{enc.vitals.heartRateBpm} bpm</span>
                </div>
                <div>
                  <span className="text-2xs text-slate-400 block font-sans">MUAC</span>
                  <span className="font-bold text-teal-700">{enc.vitals.muacMm || 115} mm (Green)</span>
                </div>
              </div>

              {/* Findings & Prescriptions */}
              <div className="mt-3 space-y-2 text-xs">
                <div>
                  <span className="font-semibold text-slate-800">Clinical Findings:</span>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">{enc.clinicalFindings}</p>
                </div>
                <div>
                  <span className="font-semibold text-slate-800">Diagnosis:</span>
                  <p className="text-slate-900 font-medium">{enc.diagnosis}</p>
                </div>

                {enc.prescriptions.length > 0 && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-2.5">
                    <span className="text-2xs font-semibold text-slate-500 uppercase flex items-center gap-1">
                      <Pill className="h-3 w-3" /> Prescribed Medications
                    </span>
                    <div className="mt-1 space-y-1">
                      {enc.prescriptions.map((p, idx) => (
                        <div key={idx} className="flex justify-between text-2xs text-slate-700">
                          <span className="font-semibold text-slate-900">{p.medicine}</span>
                          <span className="font-mono">{p.dosage} · {p.frequency} · {p.duration}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Record Encounter Modal */}
      {showAddEncounterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-semibold text-slate-900">Record Pediatric Clinical Encounter</h3>
            <p className="text-xs text-slate-500 mt-0.5">Will stamp digital MOH booklet and update child growth records.</p>

            <form onSubmit={handleSaveEncounter} className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700">Clinician Name</label>
                  <input
                    type="text"
                    value={clinicianName}
                    onChange={(e) => setClinicianName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700">Cadre</label>
                  <select
                    value={cadre}
                    onChange={(e) => setCadre(e.target.value as any)}
                    className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
                  >
                    <option value="Pediatrician">Pediatrician</option>
                    <option value="Midwife / Nurse">Midwife / Nurse</option>
                    <option value="Clinical Officer">Clinical Officer</option>
                  </select>
                </div>
              </div>

              {/* Vitals row */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-medium text-slate-700">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 p-2 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700">Height (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 p-2 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700">MUAC (mm)</label>
                  <input
                    type="number"
                    value={muacMm}
                    onChange={(e) => setMuacMm(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 p-2 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700">Clinical Examination Findings</label>
                <textarea
                  value={findings}
                  onChange={(e) => setFindings(e.target.value)}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700">Diagnosis / Assessment</label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700">Prescription Item</label>
                  <input
                    type="text"
                    value={rxMedicine}
                    onChange={(e) => setRxMedicine(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700">Dosage Instructions</label>
                  <input
                    type="text"
                    value={rxDose}
                    onChange={(e) => setRxDose(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-xs"
                  />
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddEncounterModal(false)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                >
                  Sign &amp; Stamp Encounter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
