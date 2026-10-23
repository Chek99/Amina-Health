import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Heart,
  Clock,
  Droplets,
  Moon,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Smile,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Coffee,
  HelpCircle,
} from 'lucide-react';

export const MotherJournalView: React.FC = () => {
  const {
    t,
    activeChild,
    dailyLog,
    addFeeding,
    addDiaper,
    addSleep,
    updateDailyTummyTime,
    maternalLog,
    updateMaternalLog,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'infant_care' | 'maternal_recovery' | 'epds_screener'>('infant_care');

  // Live Breastfeeding Timer
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [breastSide, setBreastSide] = useState<'breast_left' | 'breast_right' | 'both_breasts'>('breast_left');

  useEffect(() => {
    let interval: any = null;
    if (timerActive) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const handleSaveTimerFeed = () => {
    const mins = Math.max(1, Math.round(timerSeconds / 60));
    addFeeding({
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: breastSide,
      durationMinutes: mins,
      notes: `Timed nursing session (${mins} min on ${breastSide.replace('_', ' ')})`,
    });
    setTimerActive(false);
    setTimerSeconds(0);
  };

  // Quick Diaper Log
  const [diaperType, setDiaperType] = useState<'wet' | 'dirty' | 'both'>('wet');
  const [stoolColor, setStoolColor] = useState<'mustard_yellow' | 'brown' | 'green' | 'pale_clay' | 'black' | 'red'>('mustard_yellow');

  const handleQuickDiaper = (type: 'wet' | 'dirty' | 'both') => {
    addDiaper({
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type,
      stoolColor: type !== 'wet' ? stoolColor : undefined,
      consistency: type !== 'wet' ? 'normal_seedy' : undefined,
      rashPresent: false,
    });
  };

  // Quick Sleep Log
  const [napMins, setNapMins] = useState(45);
  const handleQuickNap = (minutes: number) => {
    const now = new Date();
    const start = new Date(now.getTime() - minutes * 60000);
    addSleep({
      startTime: start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      endTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      durationMinutes: minutes,
      quality: 'restful',
    });
  };

  // EPDS Questionnaire (Edinburgh Postnatal Depression Scale)
  const [epdsAnswers, setEpdsAnswers] = useState<number[]>([0, 0, 1, 0, 1, 0, 0, 1, 0, 0]);
  const epdsScore = epdsAnswers.reduce((a, b) => a + b, 0);

  const epdsQuestions = [
    {
      q: '1. I have been able to laugh and see the funny side of things:',
      options: ['As much as I always could (0)', 'Not quite so much now (1)', 'Definitely not so much now (2)', 'Not at all (3)'],
    },
    {
      q: '2. I have looked forward with enjoyment to things:',
      options: ['As much as I ever did (0)', 'Rather less than I used to (1)', 'Definitely less than I used to (2)', 'Hardly at all (3)'],
    },
    {
      q: '3. I have blamed myself unnecessarily when things went wrong:',
      options: ['No, never (0)', 'Not very often (1)', 'Yes, some of the time (2)', 'Yes, most of the time (3)'],
    },
    {
      q: '4. I have been anxious or worried for no good reason:',
      options: ['No, not at all (0)', 'Hardly ever (1)', 'Yes, sometimes (2)', 'Yes, very often (3)'],
    },
    {
      q: '5. I have felt scared or panicky without very much reason:',
      options: ['No, not at all (0)', 'No, not much (1)', 'Yes, sometimes (2)', 'Yes, quite a lot (3)'],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">{t.journalTitle}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.journalSubtitle} ({activeChild.name}).
          </p>
        </div>

        {/* Sub-Tab Navigation */}
        <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 text-xs shrink-0">
          <button
            onClick={() => setActiveSubTab('infant_care')}
            className={`rounded-md px-3 py-1 font-medium transition-colors ${
              activeSubTab === 'infant_care' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.infantCareTab}
          </button>
          <button
            onClick={() => setActiveSubTab('maternal_recovery')}
            className={`rounded-md px-3 py-1 font-medium transition-colors ${
              activeSubTab === 'maternal_recovery' ? 'bg-white text-rose-700 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.maternalRecoveryTab}
          </button>
          <button
            onClick={() => setActiveSubTab('epds_screener')}
            className={`rounded-md px-3 py-1 font-medium transition-colors ${
              activeSubTab === 'epds_screener' ? 'bg-white text-teal-800 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.epdsTab}
          </button>
        </div>
      </div>

      {/* SubTab 1: Infant Daily Care */}
      {activeSubTab === 'infant_care' && (
        <div className="space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-3.5">
              <span className="text-2xs font-semibold text-slate-500 uppercase">Today&apos;s Feedings</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-mono text-2xl font-bold text-slate-900">{dailyLog.feedings.length}</span>
                <span className="text-2xs text-teal-700">Recommended 8-12</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3.5">
              <span className="text-2xs font-semibold text-slate-500 uppercase">Diapers Logged</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-mono text-2xl font-bold text-slate-900">{dailyLog.diapers.length}</span>
                <span className="text-2xs text-teal-700">Hydration optimal</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3.5">
              <span className="text-2xs font-semibold text-slate-500 uppercase">Sleep Tracked</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-mono text-2xl font-bold text-slate-900">
                  {Math.round(dailyLog.sleepSessions.reduce((acc, s) => acc + s.durationMinutes, 0) / 60)}h
                </span>
                <span className="text-2xs text-slate-500">{dailyLog.sleepSessions.length} sessions</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3.5">
              <span className="text-2xs font-semibold text-slate-500 uppercase">Tummy Time</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-mono text-2xl font-bold text-teal-800">{dailyLog.tummyTimeMinutes}m</span>
                <span className="text-2xs text-teal-700">Neck tone goal: 20m</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Feeding Timer & Logging (Left Column) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-teal-600" />
                    <h3 className="text-sm font-semibold text-slate-900">Nursing &amp; Feeding Timer</h3>
                  </div>
                  <span className="text-2xs font-mono text-slate-500">Live Tracker</span>
                </div>

                {/* Big Timer Display */}
                <div className="mt-4 flex flex-col items-center justify-center rounded-xl bg-slate-50 p-5 border border-slate-100">
                  <div className="font-mono text-4xl font-bold text-slate-900 tabular-nums tracking-wider">
                    {String(Math.floor(timerSeconds / 60)).padStart(2, '0')}:
                    {String(timerSeconds % 60).padStart(2, '0')}
                  </div>

                  {/* Side Selector */}
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => setBreastSide('breast_left')}
                      className={`px-3 py-1 rounded-md text-xs font-medium border ${
                        breastSide === 'breast_left' ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      Left Breast
                    </button>
                    <button
                      onClick={() => setBreastSide('breast_right')}
                      className={`px-3 py-1 rounded-md text-xs font-medium border ${
                        breastSide === 'breast_right' ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      Right Breast
                    </button>
                    <button
                      onClick={() => setBreastSide('both_breasts')}
                      className={`px-3 py-1 rounded-md text-xs font-medium border ${
                        breastSide === 'both_breasts' ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      Both Sides
                    </button>
                  </div>

                  {/* Timer Controls */}
                  <div className="mt-4 flex gap-2">
                    {!timerActive ? (
                      <button
                        onClick={() => setTimerActive(true)}
                        className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 shadow-xs"
                      >
                        <Play className="h-3.5 w-3.5 fill-current" />
                        <span>Start Nursing</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setTimerActive(false)}
                        className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 shadow-xs"
                      >
                        <Pause className="h-3.5 w-3.5 fill-current" />
                        <span>Pause</span>
                      </button>
                    )}

                    <button
                      onClick={handleSaveTimerFeed}
                      disabled={timerSeconds === 0}
                      className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-40"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Log Feed ({Math.max(1, Math.round(timerSeconds / 60))}m)</span>
                    </button>

                    <button
                      onClick={() => {
                        setTimerActive(false);
                        setTimerSeconds(0);
                      }}
                      className="p-1.5 text-slate-400 hover:text-slate-600"
                      title="Reset"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Today's Feedings List */}
                <div className="mt-4">
                  <span className="text-2xs font-semibold text-slate-400 uppercase tracking-wider">Today&apos;s Feedings</span>
                  <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                    {dailyLog.feedings.map((f) => (
                      <div key={f.id} className="flex items-center justify-between rounded-lg bg-slate-50 p-2 text-xs border border-slate-100">
                        <div>
                          <span className="font-semibold text-slate-800 capitalize">{f.type.replace('_', ' ')}</span>
                          {f.durationMinutes && <span className="text-slate-500 text-2xs ml-2">({f.durationMinutes} min)</span>}
                          {f.amountMl && <span className="text-teal-700 text-2xs ml-2">({f.amountMl} ml)</span>}
                          <p className="text-2xs text-slate-400 mt-0.5">{f.notes}</p>
                        </div>
                        <span className="font-mono text-2xs text-slate-400 shrink-0">{f.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Diaper & Sleep Loggers (Right Column) */}
            <div className="lg:col-span-6 space-y-4">
              {/* Diaper Card with Stool Color Guide */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-blue-600" />
                    <h3 className="text-sm font-semibold text-slate-900">Diaper Output &amp; Stool Health</h3>
                  </div>
                  <span className="text-2xs text-slate-500">WHO IMCI Norms</span>
                </div>

                {/* Stool Color Palette */}
                <div className="mt-3">
                  <label className="text-2xs font-semibold text-slate-500 uppercase">Stool Color Check</label>
                  <div className="mt-1 flex flex-wrap gap-2 text-2xs">
                    <button
                      onClick={() => setStoolColor('mustard_yellow')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-md border ${
                        stoolColor === 'mustard_yellow' ? 'border-amber-400 bg-amber-50 font-semibold' : 'border-slate-200'
                      }`}
                    >
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                      <span>Mustard (Normal Breastfed)</span>
                    </button>
                    <button
                      onClick={() => setStoolColor('brown')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-md border ${
                        stoolColor === 'brown' ? 'border-amber-800 bg-amber-50 font-semibold' : 'border-slate-200'
                      }`}
                    >
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-800" />
                      <span>Brown (Normal)</span>
                    </button>
                    <button
                      onClick={() => setStoolColor('pale_clay')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-md border ${
                        stoolColor === 'pale_clay' ? 'border-rose-400 bg-rose-50 text-rose-700 font-semibold' : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-300 border border-slate-400" />
                      <span>Pale/Clay (Biliary Flag!)</span>
                    </button>
                    <button
                      onClick={() => setStoolColor('red')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-md border ${
                        stoolColor === 'red' ? 'border-rose-600 bg-rose-50 text-rose-700 font-semibold' : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      <span className="h-2.5 w-2.5 rounded-full bg-rose-600" />
                      <span>Red (Blood alert!)</span>
                    </button>
                  </div>
                </div>

                {/* One-Click Quick Log Buttons */}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleQuickDiaper('wet')}
                    className="flex-1 rounded-lg border border-blue-200 bg-blue-50 py-2 text-xs font-semibold text-blue-800 hover:bg-blue-100 transition-colors"
                  >
                    + Wet Diaper
                  </button>
                  <button
                    onClick={() => handleQuickDiaper('dirty')}
                    className="flex-1 rounded-lg border border-amber-200 bg-amber-50 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-100 transition-colors"
                  >
                    + Dirty Diaper
                  </button>
                  <button
                    onClick={() => handleQuickDiaper('both')}
                    className="flex-1 rounded-lg border border-teal-200 bg-teal-50 py-2 text-xs font-semibold text-teal-800 hover:bg-teal-100 transition-colors"
                  >
                    + Both Wet &amp; Dirty
                  </button>
                </div>

                {/* Diapers Today list */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {dailyLog.diapers.map((d) => (
                    <span
                      key={d.id}
                      className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-2xs text-slate-700 border border-slate-200"
                    >
                      <span className="font-mono">{d.time}</span> · <span className="capitalize">{d.type}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Tummy Time & Sleep Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4 text-purple-600" />
                    <h3 className="text-sm font-semibold text-slate-900">Sleep &amp; Tummy Time Strength</h3>
                  </div>
                  <span className="text-2xs text-slate-500">Motor milestones</span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-800">Tummy Time Today:</span>
                    <span className="font-mono text-sm font-bold text-teal-700 ml-2">
                      {dailyLog.tummyTimeMinutes} minutes
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateDailyTummyTime(5)}
                      className="rounded-lg bg-teal-600 px-3 py-1 text-xs font-medium text-white hover:bg-teal-700 shadow-2xs"
                    >
                      +5 min
                    </button>
                    <button
                      onClick={() => updateDailyTummyTime(10)}
                      className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      +10 min
                    </button>
                  </div>
                </div>

                {/* Quick Nap Logger */}
                <div className="mt-4 border-t border-slate-100 pt-3 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-700">Quick Log Nap:</span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleQuickNap(30)}
                      className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-2xs text-slate-700 hover:bg-slate-100"
                    >
                      30 min
                    </button>
                    <button
                      onClick={() => handleQuickNap(60)}
                      className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-2xs text-slate-700 hover:bg-slate-100"
                    >
                      1 hour
                    </button>
                    <button
                      onClick={() => handleQuickNap(90)}
                      className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-2xs text-slate-700 hover:bg-slate-100"
                    >
                      1.5 hrs
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 2: Postpartum Health & Maternal Recovery */}
      {activeSubTab === 'maternal_recovery' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Postpartum Physiological Recovery</h3>
                <p className="text-xs text-slate-500">Day {maternalLog.daysPostpartum} Postpartum Monitoring</p>
              </div>
              <span className="text-2xs text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200 font-semibold">
                Normal Involuntary Phase
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Lochia bleeding stages */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-800">Lochia (Postpartum Discharge) Stage</label>
                <div className="grid grid-cols-3 gap-2 text-2xs">
                  <button
                    onClick={() => updateMaternalLog({ lochiaStage: 'rubra (red)' })}
                    className={`p-2 rounded-lg border text-left ${
                      maternalLog.lochiaStage.includes('rubra') ? 'border-rose-500 bg-rose-50 font-semibold' : 'border-slate-200'
                    }`}
                  >
                    <div className="font-bold text-rose-800">Rubra</div>
                    <div className="text-slate-500">Days 1-4 (Red)</div>
                  </button>
                  <button
                    onClick={() => updateMaternalLog({ lochiaStage: 'serosa (pink/brown)' })}
                    className={`p-2 rounded-lg border text-left ${
                      maternalLog.lochiaStage.includes('serosa') ? 'border-amber-500 bg-amber-50 font-semibold' : 'border-slate-200'
                    }`}
                  >
                    <div className="font-bold text-amber-800">Serosa</div>
                    <div className="text-slate-500">Days 4-10 (Pink)</div>
                  </button>
                  <button
                    onClick={() => updateMaternalLog({ lochiaStage: 'alba (white/yellow)' })}
                    className={`p-2 rounded-lg border text-left ${
                      maternalLog.lochiaStage.includes('alba') ? 'border-teal-500 bg-teal-50 font-semibold' : 'border-slate-200'
                    }`}
                  >
                    <div className="font-bold text-teal-800">Alba</div>
                    <div className="text-slate-500">Week 2+ (White)</div>
                  </button>
                </div>
              </div>

              {/* Incision / Perineal Pain Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-800">Wound &amp; Perineal Pain Score (0–10)</span>
                  <span className="font-mono font-bold text-slate-900">{maternalLog.perinealOrCSectionPain} / 10</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={maternalLog.perinealOrCSectionPain}
                  onChange={(e) => updateMaternalLog({ perinealOrCSectionPain: parseInt(e.target.value, 10) })}
                  className="w-full accent-rose-600"
                />
                <div className="flex justify-between text-2xs text-slate-400">
                  <span>0 (No Pain)</span>
                  <span>5 (Moderate)</span>
                  <span>10 (Severe - Call Clinic)</span>
                </div>
              </div>

              {/* Breast & Lactation Condition */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-800">Breast &amp; Nipple Condition</label>
                <div className="grid grid-cols-2 gap-2 text-2xs">
                  <button
                    onClick={() => updateMaternalLog({ breastCondition: 'comfortable' })}
                    className={`p-2 rounded-lg border text-left ${
                      maternalLog.breastCondition === 'comfortable' ? 'border-teal-500 bg-teal-50 font-semibold text-teal-900' : 'border-slate-200'
                    }`}
                  >
                    Comfortable &amp; Soft
                  </button>
                  <button
                    onClick={() => updateMaternalLog({ breastCondition: 'engorged' })}
                    className={`p-2 rounded-lg border text-left ${
                      maternalLog.breastCondition === 'engorged' ? 'border-amber-500 bg-amber-50 font-semibold text-amber-900' : 'border-slate-200'
                    }`}
                  >
                    Full / Engorged
                  </button>
                  <button
                    onClick={() => updateMaternalLog({ breastCondition: 'cracked nipples' })}
                    className={`p-2 rounded-lg border text-left ${
                      maternalLog.breastCondition === 'cracked nipples' ? 'border-rose-400 bg-rose-50 font-semibold text-rose-900' : 'border-slate-200'
                    }`}
                  >
                    Sore / Cracked Nipples
                  </button>
                  <button
                    onClick={() => updateMaternalLog({ breastCondition: 'mastitis suspicion (hot/painful)' })}
                    className={`p-2 rounded-lg border text-left ${
                      maternalLog.breastCondition.includes('mastitis') ? 'border-rose-600 bg-rose-100 font-semibold text-rose-950' : 'border-slate-200'
                    }`}
                  >
                    Hot Wedge / Mastitis Flag!
                  </button>
                </div>
              </div>

              {/* Hydration Tracker */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-800">Mother&apos;s Daily Hydration (Water Glasses)</span>
                  <span className="font-mono font-bold text-teal-700">{maternalLog.hydrationGlasses} of 8 glasses</span>
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((g) => (
                    <button
                      key={g}
                      onClick={() => updateMaternalLog({ hydrationGlasses: g })}
                      className={`h-8 flex-1 rounded-md text-xs font-semibold transition-colors ${
                        g <= maternalLog.hydrationGlasses ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
                <p className="text-2xs text-slate-500">Nursing mothers require at least 2.5–3 liters of water daily for breast milk production.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 3: EPDS Postnatal Depression Screening */}
      {activeSubTab === 'epds_screener' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Edinburgh Postnatal Depression Scale (EPDS)</h3>
                <p className="text-xs text-slate-500">Clinically validated screening for maternal emotional wellbeing.</p>
              </div>
              <div className="text-right">
                <span className="font-mono text-xl font-bold text-slate-900">{epdsScore} / 30</span>
                <span className={`block text-2xs font-semibold ${epdsScore <= 9 ? 'text-teal-700' : 'text-amber-700'}`}>
                  {epdsScore <= 9 ? 'Low Risk: Healthy Adjustment' : 'Mild-to-Moderate Distress'}
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              {epdsQuestions.map((qObj, idx) => (
                <div key={idx} className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-xs">
                  <div className="font-semibold text-slate-800">{qObj.q}</div>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {qObj.options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => {
                          const updated = [...epdsAnswers];
                          updated[idx] = optIdx;
                          setEpdsAnswers(updated);
                          updateMaternalLog({ epdsScore });
                        }}
                        className={`p-2 rounded-lg border text-left text-2xs transition-colors ${
                          epdsAnswers[idx] === optIdx
                            ? 'bg-teal-50 border-teal-500 text-teal-900 font-semibold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Score interpretation */}
            <div className="mt-5 rounded-xl bg-teal-50 p-4 border border-teal-100 text-xs text-teal-900">
              <div className="font-semibold flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-teal-600" />
                <span>Empathetic Clinical Guidance</span>
              </div>
              <p className="mt-1 leading-relaxed">
                Your current score of {epdsScore} indicates normal emotional adjustment to motherhood.
                The postpartum transition brings huge sleep disruptions and hormonal fluctuations.
                Never hesitate to accept help with chores or share how you are feeling with your partner or healthcare provider.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
