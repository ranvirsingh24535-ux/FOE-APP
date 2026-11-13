import React, { useState } from 'react';
import { HabitLogEntry, Habit, UserProfile, Region } from '../types';
import {
  Leaf,
  Droplets,
  Trash2,
  Sparkles,
  TreePine,
  Car,
  Coffee,
  CheckCircle2,
  Calendar,
  Download,
  Check,
  FileJson,
} from 'lucide-react';

interface ImpactAnalyticsProps {
  logs: HabitLogEntry[];
  habits: Habit[];
  totalPoints: number;
  totalCo2Kg: number;
  totalWaterL: number;
  totalWasteG: number;
  streakDays: number;
  userProfile?: UserProfile;
  region?: Region;
}

export const ImpactAnalytics: React.FC<ImpactAnalyticsProps> = ({
  logs,
  habits,
  totalPoints,
  totalCo2Kg,
  totalWaterL,
  totalWasteG,
  streakDays,
  userProfile,
  region,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Equivalency calculations
  const treesEquiv = (totalCo2Kg / 20).toFixed(1);
  const carMilesAvoided = Math.round(totalCo2Kg * 2.5);
  const showerMinutesSaved = Math.round(totalWaterL / 10);
  const singleUseItemsPrevented = Math.round(totalWasteG / 30);

  // Group by category for breakdown
  const categoryMap: Record<string, { co2: number; points: number; count: number }> = {
    transit: { co2: 0, points: 0, count: 0 },
    diet: { co2: 0, points: 0, count: 0 },
    energy: { co2: 0, points: 0, count: 0 },
    water: { co2: 0, points: 0, count: 0 },
    circular: { co2: 0, points: 0, count: 0 },
  };

  logs.forEach((log) => {
    const habit = habits.find((h) => h.id === log.habitId);
    if (habit && categoryMap[habit.category]) {
      categoryMap[habit.category].co2 += log.impact.co2Kg;
      categoryMap[habit.category].points += log.impact.points;
      categoryMap[habit.category].count += 1;
    }
  });

  const categoryLabels: Record<string, string> = {
    transit: 'Clean Mobility',
    diet: 'Plant-Based Diet',
    energy: 'Energy Conservation',
    water: 'Water Stewardship',
    circular: 'Circular Living',
  };

  // Generate & Download Formatted JSON Report
  const handleDownloadReport = () => {
    const timestamp = new Date().toISOString();
    const dateFormatted = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const enrichedLogs = logs.map((log) => {
      const matchedHabit = habits.find((h) => h.id === log.habitId);
      return {
        logId: log.id,
        date: log.date,
        loggedAt: new Date(log.timestamp).toISOString(),
        habitId: log.habitId,
        habitTitle: matchedHabit?.title || 'Custom Sustainable Action',
        category: matchedHabit?.category || 'circular',
        categoryName: matchedHabit ? categoryLabels[matchedHabit.category] : 'Circular Living',
        quantityMultiplier: log.multiplier || 1,
        reflectionNote: log.note || null,
        hasPhotoVerification: Boolean(log.photoUrl),
        photoUrl: log.photoUrl || null,
        impactSavings: {
          co2AvoidedKg: log.impact.co2Kg,
          waterConservedLiters: log.impact.waterL,
          wasteDivertedGrams: log.impact.wasteG,
          ecoPointsEarned: log.impact.points,
        },
      };
    });

    const reportData = {
      reportSchema: 'https://foe.app/schemas/habit-report-v1.json',
      reportTitle: 'F.O.E(FRIENDS OF ENVIROMENT) Sustainable Habits Audit & Environmental Impact Report',
      generatedAt: timestamp,
      generatedDate: dateFormatted,
      citizenProfile: {
        name: userProfile?.name || 'Eco-Citizen',
        district: userProfile?.district || 'Evergreen District',
        region: region?.name || 'Pacific Northwest (Cascadia)',
        country: region?.country || 'USA / Canada',
        joinDate: userProfile?.joinDate || 'Nov 2026',
        activeStreakDays: streakDays,
        totalEcoPoints: totalPoints,
        bio: userProfile?.bio || '',
      },
      cumulativeEnvironmentalImpact: {
        carbonDioxideAvoidedKg: totalCo2Kg,
        cleanWaterConservedLiters: totalWaterL,
        landfillWasteDivertedGrams: totalWasteG,
        totalEcoPointsEarned: totalPoints,
        activeStreakDays: streakDays,
        ecologicalEquivalencies: {
          matureUrbanTreesPlanted: Number(treesEquiv),
          gasolineCarMilesAvoided: carMilesAvoided,
          showerFlowMinutesConserved: showerMinutesSaved,
          singleUseDisposablesPrevented: singleUseItemsPrevented,
        },
      },
      pillarBreakdown: Object.entries(categoryMap).reduce(
        (acc, [catKey, data]) => {
          acc[catKey] = {
            label: categoryLabels[catKey] || catKey,
            actionsCompleted: data.count,
            ecoPointsEarned: data.points,
            co2AvoidedKg: Number(data.co2.toFixed(1)),
          };
          return acc;
        },
        {} as Record<string, { label: string; actionsCompleted: number; ecoPointsEarned: number; co2AvoidedKg: number }>
      ),
      totalLogsCount: logs.length,
      habitLogHistory: enrichedLogs,
    };

    const jsonString = JSON.stringify(reportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const safeName = (userProfile?.name || 'eco-citizen')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    const dateSlug = new Date().toISOString().split('T')[0];
    const fileName = `foe-habit-report-${safeName}-${dateSlug}.json`;

    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false), 3000;
    });
  };

  return (
    <div className="space-y-8">
      {/* Intro Header & Download Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified Environmental Footprint</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display">
            Your Cumulative Climate Impact
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
            Tangible planetary savings calculated from every completed daily habit, photo proof, and logged routine.
          </p>
        </div>

        {/* Download Report Button */}
        <button
          onClick={handleDownloadReport}
          title="Export complete habit logs history as formatted JSON"
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-xs border whitespace-nowrap shrink-0 active:scale-[0.98] ${
            downloadSuccess
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-white border-stone-200 hover:border-emerald-500 hover:bg-stone-50 text-stone-800'
          }`}
        >
          {downloadSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
              <span className="text-emerald-700">Report Downloaded!</span>
            </>
          ) : (
            <>
              <FileJson className="w-4 h-4 text-emerald-600" />
              <span>Download Report (JSON)</span>
              <Download className="w-3.5 h-3.5 text-stone-400 ml-0.5" />
            </>
          )}
        </button>
      </div>

      {/* 4 Primary Big Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
            <Leaf className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-stone-500 block">Carbon Dioxide Averted</span>
          <div className="text-3xl font-black text-emerald-800 font-mono-numbers mt-1">
            {totalCo2Kg} <span className="text-sm font-normal text-stone-500">kg CO₂e</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-2">
            Directly avoided through clean mobility and energy thrift.
          </p>
        </div>

        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center mb-4">
            <Droplets className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-stone-500 block">Clean Water Conserved</span>
          <div className="text-3xl font-black text-cyan-800 font-mono-numbers mt-1">
            {totalWaterL.toLocaleString()} <span className="text-sm font-normal text-stone-500">Liters</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-2">
            Fresh water saved across diet and household rituals.
          </p>
        </div>

        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
            <Trash2 className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-stone-500 block">Landfill Waste Diverted</span>
          <div className="text-3xl font-black text-amber-900 font-mono-numbers mt-1">
            {(totalWasteG / 1000).toFixed(2)} <span className="text-sm font-normal text-stone-500">kg</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-2">
            Plastics, packaging, and organics kept in circular use.
          </p>
        </div>

        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-stone-500 block">Eco-Citizen Points</span>
          <div className="text-3xl font-black text-purple-900 font-mono-numbers mt-1">
            {totalPoints.toLocaleString()} <span className="text-sm font-normal text-stone-500">pts</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-2">
            {streakDays} consecutive day streak contributing to regional rank.
          </p>
        </div>
      </div>

      {/* Real-World Planetary Equivalencies */}
      <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xs">
        <h2 className="text-lg font-bold text-stone-900 font-display mb-1">
          Real-World Equivalencies
        </h2>
        <p className="text-xs text-stone-500 mb-6">
          What your individual cumulative savings translate to in the living biosphere:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <TreePine className="w-6 h-6" />
            </div>
            <div>
              <div className="text-lg font-bold text-stone-900 font-mono-numbers">
                {treesEquiv} Trees
              </div>
              <div className="text-xs text-stone-600">
                Annual carbon sequestration equivalent
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <div className="text-lg font-bold text-stone-900 font-mono-numbers">
                {carMilesAvoided} Miles
              </div>
              <div className="text-xs text-stone-600">
                Gasoline car driving emissions avoided
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-cyan-600 text-white flex items-center justify-center shrink-0">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <div className="text-lg font-bold text-stone-900 font-mono-numbers">
                {showerMinutesSaved} Min
              </div>
              <div className="text-xs text-stone-600">
                Shower tap flow conserved
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
              <Coffee className="w-6 h-6" />
            </div>
            <div>
              <div className="text-lg font-bold text-stone-900 font-mono-numbers">
                {singleUseItemsPrevented} Items
              </div>
              <div className="text-xs text-stone-600">
                Single-use disposables averted
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown & Action Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs">
          <h3 className="text-base font-bold text-stone-900 font-display mb-1">
            Impact by Action Pillar
          </h3>
          <p className="text-xs text-stone-500 mb-5">
            How your completed tasks distribute across environmental disciplines
          </p>

          <div className="space-y-4">
            {Object.entries(categoryMap).map(([catKey, data]) => {
              const label = categoryLabels[catKey];
              const pct = totalPoints > 0 ? Math.round((data.points / totalPoints) * 100) : 0;
              return (
                <div key={catKey}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-stone-800">{label}</span>
                    <span className="font-mono-numbers text-stone-500">
                      {data.count} actions · {data.points} pts ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Logged Actions History */}
        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-stone-900 font-display">
                Recent Action Ledger
              </h3>
              <button
                onClick={handleDownloadReport}
                className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 hover:underline"
              >
                Export JSON
              </button>
            </div>
            <p className="text-xs text-stone-500 mb-4">
              Latest tasks logged by you with photographic verification
            </p>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {logs.length === 0 ? (
                <div className="py-8 text-center text-xs text-stone-400">
                  No habits logged yet. Complete tasks in the Daily Tracker to see your audit ledger!
                </div>
              ) : (
                logs.slice(0, 7).map((log) => {
                  const habit = habits.find((h) => h.id === log.habitId);
                  return (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        {log.photoUrl && (
                          <img
                            src={log.photoUrl}
                            alt="Task proof"
                            className="w-10 h-10 rounded-lg object-cover shrink-0 border border-emerald-300"
                            referrerPolicy="no-referrer"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-stone-900 truncate flex items-center gap-1.5">
                            <span className="truncate">{habit?.title || 'Habit Action'}</span>
                            {log.photoUrl && (
                              <span className="text-[10px] text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded font-bold shrink-0">
                                Photo Proof
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-stone-500 mt-0.5 truncate">
                            {log.date} {log.note ? `· "${log.note}"` : ''}
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0 font-mono-numbers">
                        <span className="font-bold text-emerald-700">
                          +{log.impact.points} pts
                        </span>
                        <div className="text-[10px] text-stone-400">
                          -{log.impact.co2Kg}kg CO₂
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
