import React, { useState } from 'react';
import { Habit } from '../types';
import { X, Sparkles, CheckCircle2, Leaf, Droplets, Trash2 } from 'lucide-react';

interface HabitLogModalProps {
  habit: Habit;
  isOpen: boolean;
  onClose: () => void;
  onSave: (habitId: string, multiplier: number, note: string) => void;
  initialMultiplier?: number;
  initialNote?: string;
  isAlreadyCompleted?: boolean;
}

export const HabitLogModal: React.FC<HabitLogModalProps> = ({
  habit,
  isOpen,
  onClose,
  onSave,
  initialMultiplier = 1,
  initialNote = '',
  isAlreadyCompleted = false,
}) => {
  const [multiplier, setMultiplier] = useState(initialMultiplier);
  const [note, setNote] = useState(initialNote);

  if (!isOpen) return null;

  const totalPoints = Math.round(habit.points * multiplier);
  const totalCo2 = Number((habit.co2SavedKg * multiplier).toFixed(1));
  const totalWater = Math.round(habit.waterSavedL * multiplier);
  const totalWaste = Math.round(habit.wasteDivertedG * multiplier);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(habit.id, multiplier, note.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-xl border border-stone-200 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="pr-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Habit Detail & Logging</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">
            {habit.title}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
            {habit.description}
          </p>
        </div>

        {/* Calculated Impact Preview */}
        <div className="mt-6 p-4 rounded-2xl bg-stone-50 border border-stone-200 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="text-center p-2 rounded-xl bg-white border border-stone-100 shadow-2xs">
            <div className="text-[11px] text-stone-500 font-medium flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>Points</span>
            </div>
            <div className="text-lg font-bold text-stone-900 font-mono-numbers mt-0.5">
              +{totalPoints}
            </div>
          </div>

          <div className="text-center p-2 rounded-xl bg-white border border-stone-100 shadow-2xs">
            <div className="text-[11px] text-stone-500 font-medium flex items-center justify-center gap-1">
              <Leaf className="w-3 h-3 text-emerald-600" />
              <span>CO₂ Averted</span>
            </div>
            <div className="text-lg font-bold text-emerald-700 font-mono-numbers mt-0.5">
              {totalCo2} <span className="text-xs font-normal text-stone-500">kg</span>
            </div>
          </div>

          <div className="text-center p-2 rounded-xl bg-white border border-stone-100 shadow-2xs">
            <div className="text-[11px] text-stone-500 font-medium flex items-center justify-center gap-1">
              <Droplets className="w-3 h-3 text-cyan-600" />
              <span>Water Saved</span>
            </div>
            <div className="text-lg font-bold text-cyan-700 font-mono-numbers mt-0.5">
              {totalWater} <span className="text-xs font-normal text-stone-500">L</span>
            </div>
          </div>

          <div className="text-center p-2 rounded-xl bg-white border border-stone-100 shadow-2xs">
            <div className="text-[11px] text-stone-500 font-medium flex items-center justify-center gap-1">
              <Trash2 className="w-3 h-3 text-amber-600" />
              <span>Waste Saved</span>
            </div>
            <div className="text-lg font-bold text-amber-800 font-mono-numbers mt-0.5">
              {totalWaste} <span className="text-xs font-normal text-stone-500">g</span>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Multiplier / Quantity */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Action Multiplier (e.g. 2 trips, 3 meals, or extra effort)
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setMultiplier(val)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors border ${
                    multiplier === val
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                      : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  {val}×
                </button>
              ))}
            </div>
          </div>

          {/* Note Input */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Reflection Note or Verification Detail (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g., Pedaled 8 km along the greenway instead of taking the car."
              rows={3}
              maxLength={240}
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-stone-900 bg-stone-50/50 resize-none"
            />
            <div className="text-[11px] text-stone-400 text-right mt-1">
              {note.length}/240 characters
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isAlreadyCompleted ? 'Update Log' : 'Save & Complete'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
