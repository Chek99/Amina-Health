import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Download, Upload, RefreshCw, Shield, BookOpen, CheckCircle2, AlertCircle } from 'lucide-react';

interface BackupSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackupSyncModal: React.FC<BackupSyncModalProps> = ({ isOpen, onClose }) => {
  const { exportDatabase, importDatabase, resetDatabase, activeChild } = useApp();
  const [importJson, setImportJson] = useState('');
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!isOpen) return null;

  const handleDownload = () => {
    const json = exportDatabase();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `maternal_infant_health_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg({ text: 'Backup downloaded successfully. Store securely.', type: 'success' });
  };

  const handleImport = () => {
    if (!importJson.trim()) return;
    const ok = importDatabase(importJson);
    if (ok) {
      setMsg({ text: 'Health records imported and restored successfully!', type: 'success' });
      setImportJson('');
    } else {
      setMsg({ text: 'Invalid JSON backup format. Please verify file integrity.', type: 'error' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 transition-colors p-1"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">Data Protection &amp; Paper Sync</h3>
            <p className="text-xs text-slate-500">Hybrid paper-digital sync and offline backup security</p>
          </div>
        </div>

        {/* Message banner */}
        {msg && (
          <div
            className={`mt-4 flex items-center gap-2 rounded-lg p-3 text-xs ${
              msg.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
            }`}
          >
            {msg.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <span>{msg.text}</span>
          </div>
        )}

        <div className="mt-4 space-y-4">
          {/* Hybrid Philosophy Banner */}
          <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200 text-xs text-slate-600">
            <div className="flex items-center gap-2 font-semibold text-slate-800 mb-1">
              <BookOpen className="h-4 w-4 text-teal-600" />
              <span>Hybrid Paper-Booklet Philosophy</span>
            </div>
            <p>
              Digital records are synchronized with the physical MOH Child Health Handbook ({activeChild.paperBookletNumber}).
              Doctors sign physical booklets during clinic visits, while this digital system provides instant alerts,
              growth curve intelligence, and emergency backups.
            </p>
          </div>

          {/* Export section */}
          <div className="rounded-xl border border-slate-200 p-4">
            <h4 className="text-xs font-semibold text-slate-900">Export Encrypted Health Snapshot</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Download your infant growth history, vaccine ledger, daily feedings, and maternal recovery records as a portable JSON file.
            </p>
            <button
              onClick={handleDownload}
              className="mt-3 flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-xs font-medium text-white hover:bg-teal-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              Download Full Health Backup (.json)
            </button>
          </div>

          {/* Import section */}
          <div className="rounded-xl border border-slate-200 p-4">
            <h4 className="text-xs font-semibold text-slate-900">Restore from Existing Backup</h4>
            <textarea
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder="Paste JSON backup text here..."
              rows={3}
              className="mt-2 w-full rounded-lg border border-slate-300 p-2 font-mono text-2xs text-slate-800 focus:outline-hidden"
            />
            <div className="mt-2 flex gap-2">
              <button
                onClick={handleImport}
                disabled={!importJson.trim()}
                className="flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-50"
              >
                <Upload className="h-3.5 w-3.5" />
                Restore Records
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Reset all demo data to initial factory state?')) {
                    resetDatabase();
                    setMsg({ text: 'Data reset to standard baseline.', type: 'success' });
                  }
                }}
                className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
              >
                <RefreshCw className="h-3 w-3" />
                Reset Demo Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
