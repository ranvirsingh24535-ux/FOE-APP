import React, { useState } from 'react';
import { Habit, HabitCategory } from '../types';
import { X, Plus, Sparkles, Bike, Salad, PowerOff, Droplets, Recycle } from 'lucide-react';

interface AddCustomHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHabit: (newHabit: Habit) => void;
}

export const AddCustomHabitModal: React.FC<AddCustomHabitModalProps> = ({
  isOpen,
  onClose,
  onAddHabit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<HabitCategory>('circular');
  const [points, setPoints] = useState(30);
  const [co2SavedKg, setCo2SavedKg] = useState(1.5);
  const [waterSavedL, setWaterSavedL] = useState(50);
  const [wasteDivertedG, setWasteDivertedG] = useState(200);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let iconName = 'Recycle';
    if (category === 'transit') iconName = 'Bike';
    if (category === 'diet') iconName = 'Salad';
    if (category === 'energy') iconName = 'PowerOff';
    if (category === 'water') iconName = 'Droplets';

    const customHabit: Habit = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'Custom sustainable community habit.',
      category,
      points: Number(points) || 25,
      co2SavedKg: Number(co2SavedKg) || 1.0,
      waterSavedL: Number(waterSavedL) || 0,
      wasteDivertedG: Number(wasteDivertedG) || 0,
      iconName,
      isCustom: true,
    };

    onAddHabit(customHabit);
    onClose();
    setTitle('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-xl border border-stone-200 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="pr-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Create Custom Habit</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">
            Add Your Sustainable Routine
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Tailor a daily action tailored to your lifestyle, household, or neighborhood.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Habit Name *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Neighborhood compost drop-off"
              className="w-full text-sm p-3 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-stone-900 bg-stone-50/50"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Description / Instructions
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Deliver kitchen organic scraps to the district community garden."
              rows={2}
              className="w-full text-sm p-3 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-stone-900 bg-stone-50/50 resize-none"
            />
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Impact Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'transit', label: 'Clean Mobility', icon: Bike },
                { id: 'diet', label: 'Plant Diet', icon: Salad },
                { id: 'energy', label: 'Energy Saver', icon: PowerOff },
                { id: 'water', label: 'Water Steward', icon: Droplets },
                { id: 'circular', label: 'Circular Life', icon: Recycle },
              ].map((cat) => {
                const IconComponent = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id as HabitCategory)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-colors text-left ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-semibold'
                        : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Impact Estimates */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Eco Points Awarded
              </label>
              <input
                type="number"
                min="5"
                max="100"
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                className="w-full text-sm p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 outline-none font-mono-numbers"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                CO₂ Averted (kg)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="50"
                value={co2SavedKg}
                onChange={(e) => setCo2SavedKg(Number(e.target.value))}
                className="w-full text-sm p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 outline-none font-mono-numbers"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Water Saved (Liters)
              </label>
              <input
                type="number"
                min="0"
                max="1000"
                value={waterSavedL}
                onChange={(e) => setWaterSavedL(Number(e.target.value))}
                className="w-full text-sm p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 outline-none font-mono-numbers"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Waste Diverted (grams)
              </label>
              <input
                type="number"
                min="0"
                max="5000"
                value={wasteDivertedG}
                onChange={(e) => setWasteDivertedG(Number(e.target.value))}
                className="w-full text-sm p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 outline-none font-mono-numbers"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Habits</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
