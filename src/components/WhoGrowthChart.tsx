import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  WHO_WEIGHT_BOYS,
  WHO_WEIGHT_GIRLS,
  WHO_HEIGHT_BOYS,
  WHO_HEIGHT_GIRLS,
  WHO_HEAD_CIRC,
  WHODataPoint,
  evaluateGrowthPercentile,
} from '../data/whoStandards';
import { ChildProfile, GrowthRecord } from '../types';
import { Translations, SupportedLanguage } from '../locales/translations';
import {
  TrendingUp,
  Activity,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Maximize2,
  Calendar,
  Layers,
} from 'lucide-react';

interface WhoGrowthChartProps {
  child: ChildProfile;
  records: GrowthRecord[];
  activeMetric: 'weight' | 'height' | 'head';
  onMetricChange: (metric: 'weight' | 'height' | 'head') => void;
  language: SupportedLanguage;
  t: Translations;
}

interface ChartPoint {
  month: number;
  monthLabel: string;
  p3: number;
  p15: number;
  p50: number;
  p85: number;
  p97: number;
  normativeRange: [number, number];
  childValue: number | null;
  childDate?: string;
  clinicVerified?: boolean;
  recordedBy?: string;
  notes?: string;
  isInterpolated?: boolean;
}

// Linear interpolation for WHO standards at non-integer child measurement ages
function interpolateStandards(month: number, standards: WHODataPoint[]): Omit<WHODataPoint, 'month'> {
  if (month <= standards[0].month) {
    const s = standards[0];
    return { p3: s.p3, p15: s.p15, p50: s.p50, p85: s.p85, p97: s.p97 };
  }
  const last = standards[standards.length - 1];
  if (month >= last.month) {
    return { p3: last.p3, p15: last.p15, p50: last.p50, p85: last.p85, p97: last.p97 };
  }

  // Find bounding standards
  for (let i = 0; i < standards.length - 1; i++) {
    const s1 = standards[i];
    const s2 = standards[i + 1];
    if (month >= s1.month && month <= s2.month) {
      const span = s2.month - s1.month;
      const ratio = span > 0 ? (month - s1.month) / span : 0;
      return {
        p3: +(s1.p3 + ratio * (s2.p3 - s1.p3)).toFixed(2),
        p15: +(s1.p15 + ratio * (s2.p15 - s1.p15)).toFixed(2),
        p50: +(s1.p50 + ratio * (s2.p50 - s1.p50)).toFixed(2),
        p85: +(s1.p85 + ratio * (s2.p85 - s1.p85)).toFixed(2),
        p97: +(s1.p97 + ratio * (s2.p97 - s1.p97)).toFixed(2),
      };
    }
  }

  return { p3: last.p3, p15: last.p15, p50: last.p50, p85: last.p85, p97: last.p97 };
}

export const WhoGrowthChart: React.FC<WhoGrowthChartProps> = ({
  child,
  records,
  activeMetric,
  onMetricChange,
  language,
  t,
}) => {
  const [maxRangeMonths, setMaxRangeMonths] = useState<12 | 24>(12);
  const [showBands, setShowBands] = useState(true);
  const [showExtremes, setShowExtremes] = useState(true);

  // Determine active standard based on gender and metric
  const currentStandard = useMemo(() => {
    if (activeMetric === 'weight') {
      return child.gender === 'boy' ? WHO_WEIGHT_BOYS : WHO_WEIGHT_GIRLS;
    }
    if (activeMetric === 'height') {
      return child.gender === 'boy' ? WHO_HEIGHT_BOYS : WHO_HEIGHT_GIRLS;
    }
    return WHO_HEAD_CIRC;
  }, [activeMetric, child.gender]);

  const unit = activeMetric === 'weight' ? 'kg' : 'cm';
  const metricName =
    activeMetric === 'weight' ? t.weightTab : activeMetric === 'height' ? t.heightTab : t.headCircTab;

  // Filter child records for active child and metric
  const childPoints = useMemo(() => {
    return records
      .filter((r) => r.childId === child.id && r.ageInMonths <= maxRangeMonths)
      .sort((a, b) => a.ageInMonths - b.ageInMonths);
  }, [records, child.id, maxRangeMonths]);

  // Combine WHO standard grid points and child actual measurement points
  const chartData = useMemo<ChartPoint[]>(() => {
    const pointsMap = new Map<number, ChartPoint>();

    // 1. Add WHO standard points up to maxRangeMonths
    currentStandard
      .filter((s) => s.month <= maxRangeMonths)
      .forEach((s) => {
        pointsMap.set(s.month, {
          month: s.month,
          monthLabel: `${s.month}m`,
          p3: s.p3,
          p15: s.p15,
          p50: s.p50,
          p85: s.p85,
          p97: s.p97,
          normativeRange: [s.p3, s.p97],
          childValue: null,
        });
      });

    // 2. Add or merge Child actual records
    childPoints.forEach((r) => {
      const monthKey = +(r.ageInMonths.toFixed(1));
      const val =
        activeMetric === 'weight' ? r.weightKg : activeMetric === 'height' ? r.heightCm : r.headCircCm;

      if (pointsMap.has(monthKey)) {
        const existing = pointsMap.get(monthKey)!;
        existing.childValue = val;
        existing.childDate = r.date;
        existing.clinicVerified = r.clinicVerified;
        existing.recordedBy = r.recordedBy;
        existing.notes = r.notes;
      } else {
        const interpolated = interpolateStandards(monthKey, currentStandard);
        pointsMap.set(monthKey, {
          month: monthKey,
          monthLabel: `${monthKey}m`,
          p3: interpolated.p3,
          p15: interpolated.p15,
          p50: interpolated.p50,
          p85: interpolated.p85,
          p97: interpolated.p97,
          normativeRange: [interpolated.p3, interpolated.p97],
          childValue: val,
          childDate: r.date,
          clinicVerified: r.clinicVerified,
          recordedBy: r.recordedBy,
          notes: r.notes,
          isInterpolated: true,
        });
      }
    });

    return Array.from(pointsMap.values()).sort((a, b) => a.month - b.month);
  }, [currentStandard, maxRangeMonths, childPoints, activeMetric]);

  // Calculate dynamic Y-axis bounds
  const yDomain = useMemo(() => {
    let min = 999;
    let max = -999;
    chartData.forEach((d) => {
      if (d.p3 < min) min = d.p3;
      if (d.p97 > max) max = d.p97;
      if (d.childValue !== null) {
        if (d.childValue < min) min = d.childValue;
        if (d.childValue > max) max = d.childValue;
      }
    });
    const padding = activeMetric === 'weight' ? 1 : 4;
    return [Math.max(0, Math.floor(min - padding)), Math.ceil(max + padding)];
  }, [chartData, activeMetric]);

  // Latest measurement record evaluation
  const latestRecord = childPoints[childPoints.length - 1];
  const latestValue = latestRecord
    ? activeMetric === 'weight'
      ? latestRecord.weightKg
      : activeMetric === 'height'
      ? latestRecord.heightCm
      : latestRecord.headCircCm
    : null;

  const latestEvaluation = useMemo(() => {
    if (!latestValue || !latestRecord) return null;
    return evaluateGrowthPercentile(latestValue, latestRecord.ageInMonths, currentStandard);
  }, [latestValue, latestRecord, currentStandard]);

  // Custom Tooltip component for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data: ChartPoint = payload[0]?.payload;
    if (!data) return null;

    const diffFromMedian =
      data.childValue !== null ? +(data.childValue - data.p50).toFixed(2) : null;

    return (
      <div className="rounded-xl border border-slate-200 bg-white/95 p-3.5 shadow-xl backdrop-blur-xs text-xs min-w-[240px]">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
          <span className="font-semibold text-slate-900">
            {language === 'sw' ? 'Umri' : 'Age'}: {data.month} {language === 'sw' ? 'miezi' : 'months'}
          </span>
          {data.childDate && (
            <span className="font-mono text-2xs text-slate-500">{data.childDate}</span>
          )}
        </div>

        {/* Child Record Callout if present */}
        {data.childValue !== null ? (
          <div className="mb-2.5 rounded-lg bg-teal-50 border border-teal-200 p-2.5">
            <div className="flex items-center justify-between">
              <span className="font-medium text-teal-900">
                {child.name}&apos;s {language === 'sw' ? 'Kipimo' : 'Measurement'}:
              </span>
              <span className="font-mono font-bold text-sm text-teal-800">
                {data.childValue} {unit}
              </span>
            </div>

            {diffFromMedian !== null && (
              <div className="mt-1 flex items-center gap-1 text-2xs text-teal-700">
                <span>
                  {diffFromMedian >= 0 ? `+${diffFromMedian}` : diffFromMedian} {unit}{' '}
                  {language === 'sw' ? 'ikilinganishwa na P50 (Kiwango cha Kati)' : 'vs WHO Median'}
                </span>
              </div>
            )}

            {data.clinicVerified && (
              <div className="mt-1 flex items-center gap-1 text-2xs text-emerald-700 font-medium">
                <ShieldCheck className="h-3 w-3" />
                <span>{language === 'sw' ? 'Kimethibitishwa na Kliniki' : 'Clinic Verified'}</span>
              </div>
            )}

            {data.recordedBy && (
              <p className="mt-1 text-2xs text-slate-500 line-clamp-1">
                {data.recordedBy}
              </p>
            )}
          </div>
        ) : (
          <div className="mb-2 text-2xs text-slate-400 italic">
            {language === 'sw'
              ? 'Hakuna kipimo kilichorekodiwa mwezi huu'
              : 'WHO reference checkpoint (no measurement)'}
          </div>
        )}

        {/* WHO Standards Breakdown */}
        <div className="space-y-1 text-2xs">
          <div className="text-slate-400 uppercase tracking-wider font-semibold">
            {language === 'sw' ? 'Viwango vya WHO' : 'WHO Percentiles'}:
          </div>
          <div className="flex justify-between items-center text-slate-600">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
              <span>P3 (-3 SD):</span>
            </span>
            <span className="font-mono font-medium">{data.p3} {unit}</span>
          </div>
          <div className="flex justify-between items-center text-slate-600">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
              <span>P15 (-2 SD):</span>
            </span>
            <span className="font-mono font-medium">{data.p15} {unit}</span>
          </div>
          <div className="flex justify-between items-center text-teal-800 font-semibold bg-teal-50/50 px-1 py-0.5 rounded">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />
              <span>P50 ({language === 'sw' ? 'Kiwango cha Kati' : 'Median'}):</span>
            </span>
            <span className="font-mono">{data.p50} {unit}</span>
          </div>
          <div className="flex justify-between items-center text-slate-600">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
              <span>P85 (+2 SD):</span>
            </span>
            <span className="font-mono font-medium">{data.p85} {unit}</span>
          </div>
          <div className="flex justify-between items-center text-slate-600">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              <span>P97 (+3 SD):</span>
            </span>
            <span className="font-mono font-medium">{data.p97} {unit}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Chart Control Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        {/* Metric Switcher */}
        <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 p-1 text-xs">
          <button
            type="button"
            onClick={() => onMetricChange('weight')}
            className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
              activeMetric === 'weight'
                ? 'bg-white text-teal-800 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.weightTab}
          </button>
          <button
            type="button"
            onClick={() => onMetricChange('height')}
            className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
              activeMetric === 'height'
                ? 'bg-white text-teal-800 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.heightTab}
          </button>
          <button
            type="button"
            onClick={() => onMetricChange('head')}
            className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
              activeMetric === 'head'
                ? 'bg-white text-teal-800 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.headCircTab}
          </button>
        </div>

        {/* Time Window & Toggles */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* 12m vs 24m range */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-white p-0.5 text-2xs">
            <button
              type="button"
              onClick={() => setMaxRangeMonths(12)}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                maxRangeMonths === 12
                  ? 'bg-teal-600 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              0–12m ({language === 'sw' ? 'Mwaka 1' : 'Year 1'})
            </button>
            <button
              type="button"
              onClick={() => setMaxRangeMonths(24)}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                maxRangeMonths === 24
                  ? 'bg-teal-600 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              0–24m ({language === 'sw' ? 'Miaka 2' : '2 Years'})
            </button>
          </div>

          {/* Shaded Corridor Toggle */}
          <button
            type="button"
            onClick={() => setShowBands(!showBands)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-2xs font-medium transition-colors ${
              showBands
                ? 'border-teal-300 bg-teal-50 text-teal-800'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Layers className="h-3 w-3" />
            <span>{language === 'sw' ? 'Eneo la Kawaida' : 'Normative Area'}</span>
          </button>

          {/* Extreme percentiles toggle */}
          <button
            type="button"
            onClick={() => setShowExtremes(!showExtremes)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-2xs font-medium transition-colors ${
              showExtremes
                ? 'border-slate-300 bg-slate-50 text-slate-800'
                : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
            }`}
          >
            <span>{language === 'sw' ? 'Mistari ya P3/P97' : 'P3/P97 Alert Lines'}</span>
          </button>
        </div>
      </div>

      {/* Main Recharts Visualization */}
      <div className="relative w-full h-[380px] pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 15, right: 25, left: 0, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={true} />

            <XAxis
              dataKey="month"
              type="number"
              domain={[0, maxRangeMonths]}
              tickCount={maxRangeMonths === 12 ? 13 : 13}
              tickFormatter={(val) => `${val}m`}
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              label={{
                value:
                  language === 'sw' ? 'Umri wa Mtoto (Miezi)' : 'Child Age (Months)',
                position: 'insideBottom',
                offset: -12,
                fontSize: 11,
                fill: '#64748b',
              }}
            />

            <YAxis
              domain={yDomain}
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              label={{
                value: `${metricName} (${unit})`,
                angle: -90,
                position: 'insideLeft',
                offset: 10,
                fontSize: 11,
                fill: '#64748b',
              }}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Shaded Normative Area between P3 and P97 */}
            {showBands && (
              <Area
                type="monotone"
                dataKey="normativeRange"
                stroke="none"
                fill="#f0fdfa"
                fillOpacity={0.8}
                name={language === 'sw' ? 'Ukanda wa WHO (P3-P97)' : 'WHO Normal Corridor (P3-P97)'}
              />
            )}

            {/* Standard WHO Lines */}
            {showExtremes && (
              <Line
                type="monotone"
                dataKey="p97"
                stroke="#f59e0b"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
                activeDot={false}
                name="WHO 97th %ile (+3 SD)"
              />
            )}

            <Line
              type="monotone"
              dataKey="p85"
              stroke="#cbd5e1"
              strokeWidth={1}
              strokeDasharray="2 2"
              dot={false}
              activeDot={false}
              name="WHO 85th %ile"
            />

            {/* Ideal Median P50 Line */}
            <Line
              type="monotone"
              dataKey="p50"
              stroke="#0d9488"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, stroke: '#0d9488', fill: '#ffffff' }}
              name="WHO 50th %ile (Median)"
            />

            <Line
              type="monotone"
              dataKey="p15"
              stroke="#cbd5e1"
              strokeWidth={1}
              strokeDasharray="2 2"
              dot={false}
              activeDot={false}
              name="WHO 15th %ile"
            />

            {showExtremes && (
              <Line
                type="monotone"
                dataKey="p3"
                stroke="#f43f5e"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
                activeDot={false}
                name="WHO 3rd %ile (-3 SD)"
              />
            )}

            {/* Child's Actual Plotted Measurements */}
            <Line
              type="monotone"
              dataKey="childValue"
              stroke="#0f172a"
              strokeWidth={3}
              connectNulls={true}
              dot={{
                r: 5,
                fill: '#0f172a',
                stroke: '#38bdf8',
                strokeWidth: 2,
              }}
              activeDot={{
                r: 7,
                fill: '#0284c7',
                stroke: '#ffffff',
                strokeWidth: 3,
              }}
              name={`${child.name}'s Actual Curve`}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Dynamic Interpretation & Legend Footnote */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs">
        {/* Child Trajectory Status */}
        {latestEvaluation && (
          <div className="flex items-center gap-2">
            <span
              className={`flex h-2.5 w-2.5 rounded-full ${
                latestEvaluation.alert ? 'bg-amber-500 animate-pulse' : 'bg-teal-500'
              }`}
            />
            <span className="text-slate-700">
              <strong className="text-slate-900 font-semibold">{child.name}</strong>:{' '}
              {latestEvaluation.band} · {latestEvaluation.description}
            </span>
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-2xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-900 ring-2 ring-sky-400" />
            <span className="font-medium text-slate-800">{child.name}&apos;s Trajectory</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 bg-teal-600 rounded-sm" />
            <span>WHO P50 Median</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 bg-rose-500 rounded-sm border-dashed" />
            <span>P3 Lower alert</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 bg-amber-500 rounded-sm border-dashed" />
            <span>P97 Upper alert</span>
          </div>
        </div>
      </div>
    </div>
  );
};
