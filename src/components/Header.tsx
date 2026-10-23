import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Baby,
  Stethoscope,
  AlertTriangle,
  QrCode,
  Users,
  Database,
  ChevronDown,
  PlusCircle,
  Globe,
} from 'lucide-react';
import { QrPassportModal } from './QrPassportModal';
import { BackupSyncModal } from './BackupSyncModal';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSos: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenSos }) => {
  const {
    language,
    setLanguage,
    t,
    role,
    setRole,
    children,
    activeChildId,
    activeChild,
    setActiveChildId,
    addChild,
  } = useApp();

  const [showQr, setShowQr] = useState(false);
  const [showBackup, setShowBackup] = useState(false);
  const [showChildMenu, setShowChildMenu] = useState(false);
  const [showAddChildModal, setShowAddChildModal] = useState(false);

  // New child form state
  const [newChildName, setNewChildName] = useState('');
  const [newChildGender, setNewChildGender] = useState<'boy' | 'girl'>('boy');
  const [newChildDob, setNewChildDob] = useState('2026-09-01');
  const [newChildWeight, setNewChildWeight] = useState(3.2);

  const handleCreateChild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildName.trim()) return;
    addChild({
      name: newChildName.trim(),
      gender: newChildGender,
      dob: newChildDob,
      birthWeightKg: Number(newChildWeight),
      birthHeightCm: 49.5,
      birthHeadCircCm: 34.2,
      gestationalAgeWeeks: 39,
      apgarScore: '9/10',
      deliveryType: 'Spontaneous Vaginal Delivery',
      bloodGroup: 'O+',
      allergies: ['None reported'],
      emergencyContact: {
        name: 'Parent',
        relationship: 'Guardian',
        phone: '+254 700 000000',
      },
      paperBookletNumber: `MOH-CW-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      clinicAssigned: 'Community Maternal & Child Clinic',
    });
    setNewChildName('');
    setShowAddChildModal(false);
  };

  return (
    <>
      {/* 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
          {/* Zone 1: Single text wordmark in display face */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white shadow-xs">
              <Baby className="h-5 w-5" />
            </div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('dashboard');
              }}
              className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap"
            >
              {t.brandName}
            </a>
          </div>

          {/* Zone 2: 4-5 concise single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'dashboard' ? 'text-teal-700 font-semibold' : ''
              }`}
            >
              {t.navDashboard}
            </button>
            <button
              onClick={() => setActiveTab('growth')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'growth' ? 'text-teal-700 font-semibold' : ''
              }`}
            >
              {t.navGrowth}
            </button>
            <button
              onClick={() => setActiveTab('vaccines')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'vaccines' ? 'text-teal-700 font-semibold' : ''
              }`}
            >
              {t.navVaccines}
            </button>
            <button
              onClick={() => setActiveTab('journal')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'journal' ? 'text-teal-700 font-semibold' : ''
              }`}
            >
              {t.navJournal}
            </button>
            <button
              onClick={() => setActiveTab('ai_triage')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'ai_triage' ? 'text-teal-700 font-semibold' : ''
              }`}
            >
              {t.navAiTriage}
            </button>
            <button
              onClick={() => setActiveTab('education')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'education' ? 'text-teal-700 font-semibold' : ''
              }`}
            >
              {t.navEducation}
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenSos}
              className="flex items-center gap-2 rounded-lg bg-rose-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 transition-colors whitespace-nowrap shrink-0"
              title="Emergency Danger Signs Triage"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>{t.emergencySos}</span>
            </button>
          </div>
        </div>

        {/* Workspace Toolbar (Secondary context strip below header) */}
        <div className="bg-slate-50 border-t border-slate-100 py-2">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            {/* Child Selector & Multi-child twin switcher */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">{t.activeInfant}</span>
              <div className="relative">
                <button
                  onClick={() => setShowChildMenu(!showChildMenu)}
                  className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-800 shadow-2xs hover:bg-slate-50"
                >
                  <span className={`inline-block h-2 w-2 rounded-full ${activeChild.gender === 'boy' ? 'bg-blue-500' : 'bg-rose-400'}`} />
                  <span>{activeChild.name}</span>
                  {activeChild.isTwin && (
                    <span className="text-slate-400 font-normal">· Twin</span>
                  )}
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>

                {showChildMenu && (
                  <div className="absolute left-0 mt-1 w-56 rounded-xl border border-slate-200 bg-white py-1 shadow-lg z-50">
                    <div className="px-3 py-1.5 text-2xs font-semibold text-slate-400 uppercase tracking-wider">
                      Switch Child / Twin
                    </div>
                    {children.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setActiveChildId(c.id);
                          setShowChildMenu(false);
                        }}
                        className={`flex w-full items-center justify-between px-3 py-2 text-xs text-left hover:bg-slate-50 ${
                          c.id === activeChildId ? 'bg-teal-50 text-teal-800 font-semibold' : 'text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className={`h-2 w-2 rounded-full ${c.gender === 'boy' ? 'bg-blue-500' : 'bg-rose-400'}`} />
                          <span className="truncate">{c.name}</span>
                        </div>
                        <span className="text-2xs text-slate-400">{c.gender}</span>
                      </button>
                    ))}
                    <div className="border-t border-slate-100 my-1" />
                    <button
                      onClick={() => {
                        setShowChildMenu(false);
                        setShowAddChildModal(true);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-xs text-teal-700 hover:bg-teal-50"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span>{t.addInfantOrTwin}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Quick toggle if twin exists */}
              {activeChild.twinId && (
                <button
                  onClick={() => {
                    if (activeChild.twinId) setActiveChildId(activeChild.twinId);
                  }}
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-md bg-slate-200/70 px-2 py-0.5 text-2xs font-medium text-slate-700 hover:bg-slate-300"
                >
                  <Users className="h-3 w-3" />
                  <span>{t.switchToTwin}</span>
                </button>
              )}
            </div>

            {/* Right utilities: Language Switcher + Doctor/Mother Role Switch + QR Passport + Backup */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Language Switcher: English / Kiswahili */}
              <div className="flex items-center rounded-lg bg-slate-200/80 p-0.5 text-xs shadow-2xs">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-2xs font-semibold transition-all ${
                    language === 'en' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Switch language to English"
                >
                  <Globe className="h-3 w-3 text-slate-500" />
                  <span>English</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('sw')}
                  className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-2xs font-semibold transition-all ${
                    language === 'sw' ? 'bg-teal-700 text-white shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Badili lugha kuwa Kiswahili"
                >
                  <span>Kiswahili</span>
                </button>
              </div>

              {/* Role Toggle */}
              <div className="flex items-center rounded-lg bg-slate-200/80 p-0.5 text-xs">
                <button
                  onClick={() => setRole('mother')}
                  className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-2xs font-semibold transition-all ${
                    role === 'mother' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Baby className="h-3 w-3 text-teal-600" />
                  <span>{t.motherView}</span>
                </button>
                <button
                  onClick={() => {
                    setRole('clinician');
                    setActiveTab('doctor_portal');
                  }}
                  className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-2xs font-semibold transition-all ${
                    role === 'clinician' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Stethoscope className="h-3 w-3 text-blue-600" />
                  <span>{t.doctorPortal}</span>
                </button>
              </div>

              {/* QR Code button */}
              <button
                onClick={() => setShowQr(true)}
                className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
                title="Child QR Health Passport"
              >
                <QrCode className="h-3.5 w-3.5 text-slate-600" />
                <span className="hidden sm:inline">{t.qrPassport}</span>
              </button>

              {/* Data Backup button */}
              <button
                onClick={() => setShowBackup(true)}
                className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-600 hover:bg-slate-50"
                title="Backup and Recovery"
              >
                <Database className="h-3.5 w-3.5 text-slate-500" />
                <span className="hidden md:inline text-2xs">{t.syncBackup}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden overflow-x-auto border-t border-slate-200 bg-white px-2 py-1.5 scrollbar-none gap-1 text-xs">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-2.5 py-1 rounded-md shrink-0 ${activeTab === 'dashboard' ? 'bg-teal-50 text-teal-800 font-semibold' : 'text-slate-600'}`}
          >
            {t.navDashboard}
          </button>
          <button
            onClick={() => setActiveTab('growth')}
            className={`px-2.5 py-1 rounded-md shrink-0 ${activeTab === 'growth' ? 'bg-teal-50 text-teal-800 font-semibold' : 'text-slate-600'}`}
          >
            {t.navGrowth}
          </button>
          <button
            onClick={() => setActiveTab('vaccines')}
            className={`px-2.5 py-1 rounded-md shrink-0 ${activeTab === 'vaccines' ? 'bg-teal-50 text-teal-800 font-semibold' : 'text-slate-600'}`}
          >
            {t.navVaccines}
          </button>
          <button
            onClick={() => setActiveTab('journal')}
            className={`px-2.5 py-1 rounded-md shrink-0 ${activeTab === 'journal' ? 'bg-teal-50 text-teal-800 font-semibold' : 'text-slate-600'}`}
          >
            {t.navJournal}
          </button>
          <button
            onClick={() => setActiveTab('ai_triage')}
            className={`px-2.5 py-1 rounded-md shrink-0 ${activeTab === 'ai_triage' ? 'bg-teal-50 text-teal-800 font-semibold' : 'text-slate-600'}`}
          >
            {t.navAiTriage}
          </button>
          <button
            onClick={() => setActiveTab('doctor_portal')}
            className={`px-2.5 py-1 rounded-md shrink-0 ${activeTab === 'doctor_portal' ? 'bg-teal-50 text-teal-800 font-semibold' : 'text-slate-600'}`}
          >
            {t.doctorPortal.slice(0, 10)}
          </button>
          <button
            onClick={() => setActiveTab('education')}
            className={`px-2.5 py-1 rounded-md shrink-0 ${activeTab === 'education' ? 'bg-teal-50 text-teal-800 font-semibold' : 'text-slate-600'}`}
          >
            {t.navEducation}
          </button>
        </div>
      </header>

      {/* Modals */}
      <QrPassportModal isOpen={showQr} onClose={() => setShowQr(false)} />
      <BackupSyncModal isOpen={showBackup} onClose={() => setShowBackup(false)} />

      {/* Add Infant Modal */}
      {showAddChildModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-semibold text-slate-900">Add Infant Profile</h3>
            <p className="text-xs text-slate-500 mt-0.5">Supports singletons, twins, or multiple siblings.</p>

            <form onSubmit={handleCreateChild} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-700">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Liam Kariuki"
                  value={newChildName}
                  onChange={(e) => setNewChildName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900 focus:border-teal-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700">Gender</label>
                  <select
                    value={newChildGender}
                    onChange={(e) => setNewChildGender(e.target.value as any)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs text-slate-900"
                  >
                    <option value="boy">Boy</option>
                    <option value="girl">Girl</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={newChildDob}
                    onChange={(e) => setNewChildDob(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700">Birth Weight (kg)</label>
                <input
                  type="number"
                  step="0.05"
                  value={newChildWeight}
                  onChange={(e) => setNewChildWeight(parseFloat(e.target.value) || 3.0)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900"
                />
              </div>

              <div className="mt-5 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddChildModal(false)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-teal-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-teal-700"
                >
                  Save Infant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
