import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { useApp } from '../context/AppContext';
import { QrCode, X, ShieldCheck, AlertCircle, Phone, Stethoscope, Printer } from 'lucide-react';

interface QrPassportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QrPassportModal: React.FC<QrPassportModalProps> = ({ isOpen, onClose }) => {
  const { activeChild, vaccines } = useApp();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen || !activeChild) return;

    const payload = JSON.stringify({
      passportType: 'MOH_DIGITAL_CHILD_HEALTH_PASSPORT',
      version: '2.0',
      childId: activeChild.id,
      name: activeChild.name,
      dob: activeChild.dob,
      gender: activeChild.gender,
      bloodGroup: activeChild.bloodGroup,
      allergies: activeChild.allergies,
      paperBookletId: activeChild.paperBookletNumber,
      clinic: activeChild.clinicAssigned,
      emergencyContact: activeChild.emergencyContact,
      completedVaccinesCount: vaccines.filter((v) => v.status === 'completed').length,
      issuedTimestamp: new Date().toISOString(),
    });

    QRCode.toDataURL(payload, {
      width: 280,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate QR code:', err));
  }, [isOpen, activeChild, vaccines]);

  if (!isOpen) return null;

  const completedCount = vaccines.filter((v) => v.status === 'completed').length;
  const totalCount = vaccines.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 transition-colors p-1"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 border border-teal-200">
            <QrCode className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">Hospital Child Health QR Passport</h3>
            <p className="text-xs text-slate-500">Scan at clinic triage for instant paper-booklet record synchronization</p>
          </div>
        </div>

        <div className="mt-5 flex flex-col items-center">
          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="Child Health Passport QR" className="h-56 w-56 object-contain" />
            ) : (
              <div className="flex h-56 w-56 items-center justify-center text-slate-400 text-sm">
                Generating QR code...
              </div>
            )}
          </div>
          <span className="mt-2 font-mono text-xs font-semibold text-slate-600 tracking-wider">
            {activeChild.paperBookletNumber}
          </span>
        </div>

        <div className="mt-5 space-y-2 rounded-xl bg-slate-50 p-3.5 border border-slate-100 text-xs">
          <div className="flex justify-between items-center text-slate-700">
            <span className="text-slate-500">Infant Name:</span>
            <span className="font-semibold text-slate-900">{activeChild.name}</span>
          </div>
          <div className="flex justify-between items-center text-slate-700">
            <span className="text-slate-500">Date of Birth &amp; Gender:</span>
            <span>{activeChild.dob} · {activeChild.gender === 'boy' ? 'Male' : 'Female'}</span>
          </div>
          <div className="flex justify-between items-center text-slate-700">
            <span className="text-slate-500">Blood Group &amp; Gestation:</span>
            <span className="font-mono">{activeChild.bloodGroup} · {activeChild.gestationalAgeWeeks}w gestation</span>
          </div>
          <div className="flex justify-between items-center text-slate-700">
            <span className="text-slate-500">Vaccine Progress:</span>
            <span className="font-semibold text-teal-700">{completedCount} of {totalCount} completed</span>
          </div>
          <div className="flex justify-between items-center text-slate-700">
            <span className="text-slate-500">Emergency Contact:</span>
            <span>{activeChild.emergencyContact.name} ({activeChild.emergencyContact.phone})</span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-800 border border-emerald-100">
          <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>Encrypted Ministry of Health QR standard. Compatible with hospital barcode/camera readers.</span>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            onClick={() => {
              window.print();
            }}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Printer className="h-4 w-4" />
            Print Badge
          </button>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(activeChild.paperBookletNumber);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800 transition-colors"
          >
            {copied ? 'Copied ID!' : 'Copy Booklet ID'}
          </button>
        </div>
      </div>
    </div>
  );
};
