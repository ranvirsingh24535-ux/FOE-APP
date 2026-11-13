import React, { useState } from 'react';
import { Habit, HabitCategory, HabitLogEntry } from '../types';
import { HabitCard } from './HabitCard';
import { PhotoProofModal } from './PhotoProofModal';
import {
  Calendar,
  Sparkles,
  Leaf,
  Droplets,
  Flame,
  Plus,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Camera,
  ShieldCheck,
} from 'lucide-react';

interface HabitsTrackerProps {
  habits: Habit[];
  logs: HabitLogEntry[];
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
  onToggleHabit: (habitId: string, date: string) => void;
  onSaveHabitWithPhoto: (
    habitId: string,
    date: string,
    photoUrl: string,
    multiplier: number,
    note: string
  ) => void;
  onOpenCustomHabitModal: () => void;
  streakDays: number;
  onNavigateToScoreboard: () => void;
}

export const HabitsTracker: React.FC<HabitsTrackerProps> = ({
  habits,
  logs,
  selectedDate,
  onSelectDate,
  onToggleHabit,
  onSaveHabitWithPhoto,
  onOpenCustomHabitModal,
  streakDays,
  onNavigateToScoreboard,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | HabitCategory>('all');
  const [selectedHabitForPhoto, setSelectedHabitForPhoto] = useState<Habit | null>(null);

  // Generate date carousel options: today, yesterday, and previous 5 days
  const todayStr = new Date().toISOString().split('T')[0];
  const dateOptions = Array.from({ length: 7 }).map((_, index) => {
    const d = new Date();
    d.setDate(d.getDate() - index);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = index === 0 ? 'Today' : index === 1 ? 'Yesterday' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.getDate();
    const monthShort = d.toLocaleDateString('en-US', { month: 'short' });
    return {
      dateStr,
      dayLabel,
      dayNum,
      monthShort,
    };
  });

  // Calculate day-specific metrics
  const dayLogs = logs.filter((log) => log.date === selectedDate);
  const completedHabitIds = new Set(dayLogs.map((log) => log.habitId));

  const totalDayPoints = dayLogs.reduce((acc, log) => acc + log.impact.points, 0);
  const totalDayCo2 = Number(dayLogs.reduce((acc, log) => acc + log.impact.co2Kg, 0).toFixed(1));
  const totalDayWater = dayLogs.reduce((acc, log) => acc + log.impact.waterL, 0);
  const totalDayWaste = dayLogs.reduce((acc, log) => acc + log.impact.wasteG, 0);

  // Filter habits by category
  const filteredHabits = habits.filter((habit) => {
    if (activeCategory === 'all') return true;
    return habit.category === activeCategory;
  });

  const completedCount = filteredHabits.filter((h) => completedHabitIds.has(h.id)).length;
  const currentLogForSelected = selectedHabitForPhoto
    ? dayLogs.find((l) => l.habitId === selectedHabitForPhoto.id)
    : undefined;

  return (
    <div className="space-y-8">
      {/* Hero Impact Banner with Generated Illustration */}
      <div className="relative rounded-3xl overflow-hidden border border-stone-200 bg-stone-900 text-white shadow-md">
        {/* Visual Background image with measured dark contrast scrim */}
        <div className="absolute inset-0">
          <img
            src="/src/assets/images/eco_hero_community_1793848388619.jpg"
            alt="Vibrant sustainable eco community with bicycles and urban gardens"
            className="w-full h-full object-cover opacity-35"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 p-6 sm:p-8 lg:p-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sustainable Daily Action</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-300 font-mono-numbers">
                {completedHabitIds.size} of {habits.length} habits logged
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display text-white">
              Cultivate small rituals. Change your neighborhood.
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl">
              Upload photo proof of your daily actions to verify sustainable tasks, earn verified badges, and climb your regional community scoreboard.
            </p>

            {/* Photo verification active callout */}
            <div className="mt-4 inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 rounded-xl px-3 py-1.5 text-xs text-emerald-200">
              <Camera className="w-3.5 h-3.5 text-emerald-400" />
              <span>Photo Proof Required: Snap or upload your action to mark each task complete.</span>
            </div>
          </div>

          {/* Quick Metrics Bar on Hero */}
          <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10">
              <div className="flex items-center gap-1.5 text-xs text-stone-300">
                <Leaf className="w-4 h-4 text-emerald-400" />
                <span>CO₂ Avoided Today</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono-numbers text-white mt-1">
                {totalDayCo2} <span className="text-xs font-normal text-stone-400">kg</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10">
              <div className="flex items-center gap-1.5 text-xs text-stone-300">
                <Droplets className="w-4 h-4 text-cyan-400" />
                <span>Water Conserved</span>
              </div>
              <div className="text-xl sm:text-2xl font-mono-numbers font-bold text-white mt-1">
                {totalDayWater} <span className="text-xs font-normal text-stone-400">L</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10">
              <div className="flex items-center gap-1.5 text-xs text-stone-300">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Points Earned</span>
              </div>
              <div className="text-xl sm:text-2xl font-mono-numbers font-bold text-white mt-1">
                +{totalDayPoints}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10">
              <div className="flex items-center gap-1.5 text-xs text-stone-300">
                <Flame className="w-4 h-4 text-orange-400" />
                <span>Active Streak</span>
              </div>
              <div className="text-xl sm:text-2xl font-mono-numbers font-bold text-white mt-1">
                {streakDays} <span className="text-xs font-normal text-stone-400">days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Date Navigation Carousel */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-bold text-stone-900 font-display">
            Select Day
          </h2>
          <p className="text-xs text-stone-500">
            View or backfill completed tasks across this week
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {dateOptions.map((opt) => {
            const isSelected = opt.dateStr === selectedDate;
            const isToday = opt.dateStr === todayStr;
            const dayCompleted = logs.filter((l) => l.date === opt.dateStr).length;

            return (
              <button
                key={opt.dateStr}
                onClick={() => onSelectDate(opt.dateStr)}
                className={`flex flex-col items-center justify-center min-w-[70px] py-2 px-3 rounded-2xl border text-xs transition-all ${
                  isSelected
                    ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                    : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                }`}
              >
                <span className="text-[10px] uppercase font-medium opacity-80">
                  {opt.dayLabel}
                </span>
                <span className="text-base font-bold font-mono-numbers mt-0.5">
                  {opt.dayNum}
                </span>
                {dayCompleted > 0 && (
                  <span
                    className={`mt-1 w-1.5 h-1.5 rounded-full ${
                      isSelected ? 'bg-emerald-400' : 'bg-emerald-600'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Filter Bar & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Tasks' },
            { id: 'transit', label: 'Mobility' },
            { id: 'diet', label: 'Plant Diet' },
            { id: 'energy', label: 'Energy' },
            { id: 'water', label: 'Water' },
            { id: 'circular', label: 'Circular' },
          ].map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as 'all' | HabitCategory)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Counter and Custom Habit trigger */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-stone-500 font-medium">
            {completedCount} of {filteredHabits.length} verified
          </span>
          <button
            onClick={onOpenCustomHabitModal}
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl px-3 py-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom</span>
          </button>
        </div>
      </div>

      {/* Habit Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredHabits.map((habit) => {
          const isCompleted = completedHabitIds.has(habit.id);
          const currentLog = dayLogs.find((l) => l.habitId === habit.id);
          return (
            <HabitCard
              key={habit.id}
              habit={habit}
              isCompleted={isCompleted}
              onToggle={(id) => onToggleHabit(id, selectedDate)}
              onPromptPhotoProof={(h) => setSelectedHabitForPhoto(h)}
              note={currentLog?.note}
              photoUrl={currentLog?.photoUrl}
            />
          );
        })}
      </div>

      {/* Regional Scoreboard Quick Teaser Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900 to-teal-950 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>District Challenge Active</span>
          </div>
          <h3 className="text-lg font-bold font-display text-white">
            See how your neighborhood ranks against nearby districts!
          </h3>
          <p className="text-xs text-emerald-100/80 mt-1 max-w-xl">
            Your verified photo tasks contribute points directly to your district's weekly clean energy challenge.
          </p>
        </div>

        <button
          onClick={onNavigateToScoreboard}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-semibold text-xs rounded-xl transition-all shadow-sm flex items-center gap-2 whitespace-nowrap shrink-0"
        >
          <span>Open Scoreboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Photo Proof Verification & Task Completion Modal */}
      {selectedHabitForPhoto && (
        <PhotoProofModal
          habit={selectedHabitForPhoto}
          isOpen={!!selectedHabitForPhoto}
          onClose={() => setSelectedHabitForPhoto(null)}
          onCompleteWithPhoto={(habitId, photoUrl, multiplier, note) => {
            onSaveHabitWithPhoto(habitId, selectedDate, photoUrl, multiplier, note);
          }}
          initialMultiplier={currentLogForSelected?.multiplier || 1}
          initialNote={currentLogForSelected?.note || ''}
          initialPhotoUrl={currentLogForSelected?.photoUrl || ''}
          isAlreadyCompleted={completedHabitIds.has(selectedHabitForPhoto.id)}
        />
      )}
    </div>
  );
};
