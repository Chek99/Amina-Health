import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { GrowthView } from './components/GrowthView';
import { VaccinationView } from './components/VaccinationView';
import { MotherJournalView } from './components/MotherJournalView';
import { AIAssistantView } from './components/AIAssistantView';
import { DoctorPortalView } from './components/DoctorPortalView';
import { CommunityEducationView } from './components/CommunityEducationView';
import { EmergencySosModal } from './components/EmergencySosModal';

function MainLayout() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [showSosModal, setShowSosModal] = useState<boolean>(false);
  const { role } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSos={() => setShowSosModal(true)}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenSos={() => setShowSosModal(true)}
          />
        )}

        {activeTab === 'growth' && <GrowthView />}

        {activeTab === 'vaccines' && <VaccinationView />}

        {activeTab === 'journal' && <MotherJournalView />}

        {activeTab === 'ai_triage' && <AIAssistantView />}

        {activeTab === 'doctor_portal' && <DoctorPortalView />}

        {activeTab === 'education' && <CommunityEducationView />}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Amina Health</span>
            <span>·</span>
            <span>Hybrid Maternal &amp; Infant Digital Health System</span>
          </div>
          <div className="flex items-center gap-4 text-2xs">
            <span>WHO IMCI Protocols Grounded</span>
            <span>·</span>
            <span>MOH Paper-Booklet Synchronization</span>
            <span>·</span>
            <span>Offline Resilient Storage</span>
          </div>
        </div>
      </footer>

      {/* Emergency SOS Modal */}
      <EmergencySosModal
        isOpen={showSosModal}
        onClose={() => setShowSosModal(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
