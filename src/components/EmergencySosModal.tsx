import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  AlertTriangle,
  X,
  PhoneCall,
  MapPin,
  ShieldAlert,
  HeartPulse,
  Activity,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface EmergencySosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencySosModal: React.FC<EmergencySosModalProps> = ({ isOpen, onClose }) => {
  const { activeChild, language, t } = useApp();
  const [selectedSigns, setSelectedSigns] = useState<string[]>([]);
  const [tempInput, setTempInput] = useState('38.4');
  const [callInitiated, setCallInitiated] = useState(false);

  if (!isOpen) return null;

  const dangerChecklist = language === 'sw'
    ? [
        { id: 'fever', label: 'Homa Kali (>38.0°C) au Mtoto Kuwa wa Baridi Sana (<36.0°C)' },
        { id: 'breathing', label: 'Kupumua Haraka Sana (>Pumzi 60/dakika) au Kifua Kubonyea Ndani' },
        { id: 'feeding', label: 'Kukataa Kunyonya / Kushindwa Kumeza Kabisa' },
        { id: 'lethargy', label: 'Mtoto Mlegevu Sana, Asiyeguswa au Asiyeamka' },
        { id: 'convulsion', label: 'Kutapatapa / Kutetemeka / Degedege' },
        { id: 'bleeding', label: 'Kutoka Damu Nyingi Baada ya Kujifungua (>Pedi 1 ndani ya saa 1)' },
      ]
    : [
        { id: 'fever', label: 'High Fever (>38.0°C) or Cold Baby (<36.0°C)' },
        { id: 'breathing', label: 'Fast Breathing (>60 breaths/min) or Chest Indrawing' },
        { id: 'feeding', label: 'Refusal to Feed / Inability to Latch or Swallow' },
        { id: 'lethargy', label: 'Lethargic / Abnormally Flaccid or Unresponsive' },
        { id: 'convulsion', label: 'Convulsions, Twitching, or Involuntary Rolling Eyes' },
        { id: 'bleeding', label: 'Heavy Maternal Hemorrhage (>1 Pad Soaked in 1 Hour)' },
      ];

  const emergencyClinics = [
    {
      name: 'St. Jude Maternal & Child Health Clinic (Assigned)',
      distance: '1.2 km away',
      phone: '+254 700 112 233',
      emergencyRoom: '24/7 Neonatal Triage Open',
    },
    {
      name: 'Nairobi National Referral Hospital Pediatric ER',
      distance: '4.8 km away',
      phone: '+254 711 999 000',
      emergencyRoom: 'NICU Level 3 Available',
    },
  ];

  const hasSigns = selectedSigns.length > 0 || parseFloat(tempInput) >= 38.0;

  const handleSimulateCall = (clinicPhone: string) => {
    setCallInitiated(true);
    setTimeout(() => {
      window.open(`tel:${clinicPhone}`, '_self');
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl border-2 border-rose-500 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 p-1"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-rose-100 pb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-md">
            <AlertTriangle className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <span className="text-2xs font-bold text-rose-700 uppercase tracking-wider">
              {t.emergencyAlertBanner}
            </span>
            <h3 className="text-base font-bold text-slate-900">
              {t.emergencyModalTitle}: {activeChild.name}
            </h3>
          </div>
        </div>

        {/* Danger Sign Quick Check */}
        <div className="mt-4">
          <h4 className="text-xs font-bold text-slate-900">{t.observedSymptomsTitle}</h4>
          <div className="mt-2 space-y-1.5 text-xs">
            {dangerChecklist.map((item) => {
              const isChecked = selectedSigns.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (isChecked) {
                      setSelectedSigns(selectedSigns.filter((s) => s !== item.id));
                    } else {
                      setSelectedSigns([...selectedSigns, item.id]);
                    }
                  }}
                  className={`flex items-center gap-2.5 rounded-xl p-2.5 border transition-colors cursor-pointer ${
                    isChecked
                      ? 'border-rose-500 bg-rose-50 text-rose-950 font-semibold'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                  />
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Temperature Quick Input */}
        <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 p-3 border border-slate-200 text-xs">
          <span className="font-semibold text-slate-800">{t.measuredTempLabel}</span>
          <div className="flex items-center gap-1">
            <input
              type="number"
              step="0.1"
              value={tempInput}
              onChange={(e) => setTempInput(e.target.value)}
              className="w-20 rounded-md border border-slate-300 p-1 font-mono text-xs text-slate-900 text-center font-bold"
            />
            <span className="font-mono text-xs">°C</span>
          </div>
        </div>

        {/* Immediate Stabilization First Aid Instructions */}
        <div className="mt-4 rounded-xl bg-rose-50 p-3.5 border border-rose-200 text-xs text-rose-950">
          <div className="font-bold flex items-center gap-1.5 text-rose-800">
            <ShieldAlert className="h-4 w-4" />
            <span>{t.firstAidTitle}</span>
          </div>
          {language === 'sw' ? (
            <ul className="mt-2 space-y-1 text-2xs text-rose-900">
              <li>• <strong>Mweke Mtoto Joto:</strong> Mweke mtoto akiwa uchi kwenye kifua cha mama (Kangaroo Mother Care) na umfunike na shuka safi.</li>
              <li>• <strong>Usimlishe vinywaji kwa nguvu:</strong> Ikiwa mtoto amelegea, usimpe maji, dawa za kienyeji au uji kwa mdomo.</li>
              <li>• <strong>Fungua Njia ya Hewa:</strong> Hakikisha pua na mdomo wa mtoto havijazibwa; mshike wima anapotoa sauti ya kuguna.</li>
              <li>• <strong>Beba Kitabu cha Kliniki:</strong> Beba kijitabu cha MOH #{activeChild.paperBookletNumber} au pasipoti ya QR ya kidijitali.</li>
            </ul>
          ) : (
            <ul className="mt-2 space-y-1 text-2xs text-rose-900">
              <li>• <strong>Keep Baby Warm:</strong> Place naked infant against mother&apos;s bare chest (Kangaroo Mother Care) and cover with a clean blanket.</li>
              <li>• <strong>Do NOT force feed liquids:</strong> If baby is lethargic or choking, do not administer water, herbal tea, or paracetamol syrup orally.</li>
              <li>• <strong>Clear Airway:</strong> Ensure infant&apos;s nose and mouth are unobstructed; hold upright if grunting.</li>
              <li>• <strong>Bring Health Booklet:</strong> Carry MOH Handbook #{activeChild.paperBookletNumber} or QR passport for the triage nurse.</li>
            </ul>
          )}
        </div>

        {/* 1-Click Dialers */}
        <div className="mt-5 space-y-2.5">
          <h4 className="text-xs font-bold text-slate-900">
            {language === 'sw' ? 'Piga Simu Ambulansi ya Dharura au Kituo cha Afya:' : 'Dispatch Emergency Ambulance or Call Clinic:'}
          </h4>

          {emergencyClinics.map((c, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 hover:border-slate-300 transition-colors shadow-2xs"
            >
              <div>
                <span className="font-bold text-xs text-slate-900">{c.name}</span>
                <div className="flex items-center gap-2 text-2xs text-slate-500 mt-0.5">
                  <span className="flex items-center gap-0.5">
                    <MapPin className="h-3 w-3 text-slate-400" /> {c.distance}
                  </span>
                  <span>·</span>
                  <span className="text-teal-700 font-medium">{c.emergencyRoom}</span>
                </div>
              </div>

              <button
                onClick={() => handleSimulateCall(c.phone)}
                className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-rose-700 transition-colors shadow-xs"
              >
                <PhoneCall className="h-3.5 w-3.5" />
                <span>{t.callClinicBtn}</span>
              </button>
            </div>
          ))}

          {/* National Ambulance 999 / 911 Hotline */}
          <button
            onClick={() => handleSimulateCall('999')}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
          >
            <PhoneCall className="h-4 w-4 text-rose-500" />
            <span>{t.callNationalAmbulanceBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
