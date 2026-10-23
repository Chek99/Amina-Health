import React, { useState } from 'react';
import { INITIAL_EDUCATION_ARTICLES } from '../data/mockData';
import { EducationArticle } from '../types';
import {
  BookOpen,
  Volume2,
  VolumeX,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  HeartHandshake,
  Moon,
  Smile,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';

export const CommunityEducationView: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<EducationArticle>(INITIAL_EDUCATION_ARTICLES[0]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Simple quiz state
  const [quizAnswered, setQuizAnswered] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const categories = ['All', 'Newborn Care', 'Breastfeeding & Nutrition', 'Hygiene & Safety', 'Maternal Recovery'];

  const filteredArticles = activeCategory === 'All'
    ? INITIAL_EDUCATION_ARTICLES
    : INITIAL_EDUCATION_ARTICLES.filter((a) => a.category === activeCategory);

  const handleToggleVoice = (text: string) => {
    if (isPlayingAudio) {
      window.speechSynthesis?.cancel();
      setIsPlayingAudio(false);
      return;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Community Education &amp; Parenting Guides</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Evidence-based clinical guides on umbilical hygiene, exclusive breastfeeding, safe sleep, and maternal mental wellness.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1 text-xs">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                activeCategory === c ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Articles List (Left) + Selected Article Reader (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Article Cards List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          {filteredArticles.map((art) => {
            const isSelected = selectedArticle.id === art.id;
            return (
              <div
                key={art.id}
                onClick={() => {
                  setSelectedArticle(art);
                  if (isPlayingAudio) {
                    window.speechSynthesis?.cancel();
                    setIsPlayingAudio(false);
                  }
                }}
                className={`rounded-2xl border p-4 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-teal-500 bg-teal-50/40 shadow-xs ring-1 ring-teal-500'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-2xs text-slate-500">
                  <span className="font-semibold text-teal-700">{art.category}</span>
                  <span>{art.readingTimeMin} min read</span>
                </div>
                <h3 className="mt-1.5 text-xs font-bold text-slate-900 leading-snug">
                  {art.title}
                </h3>
                <p className="mt-1 text-2xs text-slate-500 line-clamp-2">
                  {art.summary}
                </p>
              </div>
            );
          })}

          {/* Interactive Knowledge Quiz */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <HelpCircle className="h-4 w-4 text-teal-600" />
              <span>Motherhood Hygiene Quiz</span>
            </div>
            <p className="mt-1 text-2xs text-slate-500">
              Question: For how many completed months does WHO recommend exclusive breastfeeding without water or porridge?
            </p>

            <div className="mt-2.5 space-y-1.5 text-2xs">
              {[
                { label: 'A. 2 months', correct: false },
                { label: 'B. 6 completed months (Recommended)', correct: true },
                { label: 'C. 12 months without solids', correct: false },
              ].map((ans, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuizAnswered(idx);
                    setQuizScore(ans.correct ? 1 : 0);
                  }}
                  className={`w-full text-left p-2 rounded-lg border transition-colors ${
                    quizAnswered === idx
                      ? ans.correct
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold'
                        : 'bg-rose-50 border-rose-500 text-rose-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {ans.label}
                </button>
              ))}
            </div>

            {quizAnswered !== null && (
              <div
                className={`mt-2 rounded-md p-2 text-2xs ${
                  quizScore === 1 ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                }`}
              >
                {quizScore === 1
                  ? 'Correct! Breast milk supplies 100% of fluids, immunoglobulins, and energy needed for 6 months.'
                  : 'WHO recommends exclusive breastfeeding for exactly 6 completed months before introducing safe complementary foods.'}
              </div>
            )}
          </div>
        </div>

        {/* Selected Article Body (8 cols) */}
        <div className="lg:col-span-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
            {/* Article Header */}
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-2xs font-semibold text-teal-700 uppercase tracking-wider">
                  {selectedArticle.category} · {selectedArticle.readingTimeMin} Min Guide
                </span>

                {/* Voice support in local language button */}
                <button
                  onClick={() => handleToggleVoice(selectedArticle.localAudioText || selectedArticle.summary)}
                  className="flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-800 hover:bg-teal-100 transition-colors shadow-2xs"
                  title="Voice narration in local language for mothers"
                >
                  {isPlayingAudio ? (
                    <>
                      <VolumeX className="h-4 w-4 text-rose-600 animate-pulse" />
                      <span>Stop Voice</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-4 w-4 text-teal-700" />
                      <span>Play Audio Voice (Kiswahili / Local)</span>
                    </>
                  )}
                </button>
              </div>

              <h2 className="mt-2 text-lg font-bold text-slate-900 leading-snug">
                {selectedArticle.title}
              </h2>
              <p className="mt-1 text-xs text-slate-500">{selectedArticle.summary}</p>
            </div>

            {/* Paragraphs */}
            <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
              {selectedArticle.bodyParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {/* Key Actionable Tips Box */}
            <div className="rounded-xl border border-teal-100 bg-teal-50/60 p-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-teal-900">
                <Sparkles className="h-4 w-4 text-teal-700" />
                <span>Essential Clinical Rules:</span>
              </div>
              <ul className="mt-2 space-y-1.5 text-xs text-teal-950">
                {selectedArticle.keyTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-teal-700 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Local Language Audio transcript preview */}
            <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 text-xs">
              <span className="font-semibold text-slate-700 text-2xs uppercase tracking-wider">
                Local Voice Broadcast (Swahili Audio Track):
              </span>
              <p className="mt-1 text-xs font-medium text-slate-800 italic">
                &ldquo;{selectedArticle.localAudioText}&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
