import React from 'react';
import { Habit, HabitCategory } from '../types';
import {
  Bike,
  Train,
  Salad,
  Apple,
  PowerOff,
  Wind,
  ThermometerSnowflake,
  Droplets,
  Waves,
  Coffee,
  Wrench,
  Recycle,
  Check,
  FileText,
  Camera,
  CheckCircle2,
} from 'lucide-react';

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  onToggle: (habitId: string) => void;
  onPromptPhotoProof: (habit: Habit) => void;
  note?: string;
  photoUrl?: string;
}

const CATEGORY_STYLES: Record<
  HabitCategory,
  { label: string; iconBg: string; textAccent: string }
> = {
  transit: {
    label: 'Clean Mobility',
    iconBg: 'bg-sky-100 text-sky-800',
    textAccent: 'text-sky-700',
  },
  diet: {
    label: 'Plant-Forward',
    iconBg: 'bg-emerald-100 text-emerald-800',
    textAccent: 'text-emerald-700',
  },
  energy: {
    label: 'Energy Saver',
    iconBg: 'bg-amber-100 text-amber-800',
    textAccent: 'text-amber-700',
  },
  water: {
    label: 'Water Steward',
    iconBg: 'bg-cyan-100 text-cyan-800',
    textAccent: 'text-cyan-700',
  },
  circular: {
    label: 'Circular Life',
    iconBg: 'bg-teal-100 text-teal-800',
    textAccent: 'text-teal-700',
  },
};

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  isCompleted,
  onToggle,
  onPromptPhotoProof,
  note,
  photoUrl,
}) => {
  const categoryMeta = CATEGORY_STYLES[habit.category] || CATEGORY_STYLES.circular;

  const renderIcon = () => {
    const props = { className: 'w-5 h-5' };
    switch (habit.iconName) {
      case 'Bike':
        return <Bike {...props} />;
      case 'Train':
        return <Train {...props} />;
      case 'Salad':
        return <Salad {...props} />;
      case 'Apple':
        return <Apple {...props} />;
      case 'PowerOff':
        return <PowerOff {...props} />;
      case 'Wind':
        return <Wind {...props} />;
      case 'ThermometerSnowflake':
        return <ThermometerSnowflake {...props} />;
      case 'Droplets':
        return <Droplets {...props} />;
      case 'Waves':
        return <Waves {...props} />;
      case 'Coffee':
        return <Coffee {...props} />;
      case 'Wrench':
        return <Wrench {...props} />;
      case 'Recycle':
      default:
        return <Recycle {...props} />;
    }
  };

  const handleActionClick = () => {
    if (!isCompleted) {
      // First prompt for photo proof before completing
      onPromptPhotoProof(habit);
    } else {
      // Allow unchecking or re-toggling
      onToggle(habit.id);
    }
  };

  return (
    <div
      className={`group relative rounded-2xl border transition-all duration-200 p-5 ${
        isCompleted
          ? 'bg-emerald-50/70 border-emerald-300 shadow-sm'
          : 'bg-white border-stone-200 hover:border-stone-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left Side: Icon & Content */}
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${categoryMeta.iconBg}`}
          >
            {renderIcon()}
          </div>

          <div className="flex-1 min-w-0">
            {/* Metadata row with clean unboxed text and typographic dots */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-500 mb-1">
              <span className={`font-semibold ${categoryMeta.textAccent}`}>
                {categoryMeta.label}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-numbers text-stone-700 font-medium">
                +{habit.points} pts
              </span>
              {habit.co2SavedKg > 0 && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-700 font-mono-numbers">
                    -{habit.co2SavedKg}kg CO₂
                  </span>
                </>
              )}
              {habit.waterSavedL > 0 && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-cyan-700 font-mono-numbers">
                    -{habit.waterSavedL}L H₂O
                  </span>
                </>
              )}
            </div>

            {/* Title */}
            <h3
              className={`text-base font-semibold transition-colors ${
                isCompleted ? 'text-emerald-950 font-bold' : 'text-stone-900'
              }`}
            >
              {habit.title}
            </h3>

            {/* Description */}
            <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
              {habit.description}
            </p>

            {/* Attached Photo Proof Preview (if verified) */}
            {photoUrl && isCompleted && (
              <div className="mt-3 flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-white border border-emerald-200 shadow-2xs">
                <button
                  type="button"
                  onClick={() => onPromptPhotoProof(habit)}
                  className="relative rounded-lg overflow-hidden w-14 h-11 shrink-0 group/photo cursor-pointer"
                  title="View / Change verified photo"
                >
                  <img
                    src={photoUrl}
                    alt="Verified task proof"
                    className="w-full h-full object-cover group-hover/photo:scale-110 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity">
                    <Camera className="w-3.5 h-3.5 text-white" />
                  </div>
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Photo Verified</span>
                  </div>
                  {note ? (
                    <p className="text-[11px] text-stone-600 italic truncate mt-0.5">
                      "{note}"
                    </p>
                  ) : (
                    <p className="text-[10px] text-stone-400">Proof attached to daily ledger</p>
                  )}
                </div>
              </div>
            )}

            {/* Logged Note preview if present and no photo attached */}
            {note && !photoUrl && (
              <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-stone-600 bg-white/80 rounded-md px-2.5 py-1 border border-emerald-200">
                <FileText className="w-3 h-3 text-emerald-600 shrink-0" />
                <span className="truncate italic">"{note}"</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Primary Photo Verification / Completion Trigger */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <button
            onClick={handleActionClick}
            aria-label={isCompleted ? `Mark ${habit.title} incomplete` : `Upload photo to complete ${habit.title}`}
            title={isCompleted ? 'Mark incomplete' : 'Upload photo according to task to complete'}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              isCompleted
                ? 'bg-emerald-600 text-white shadow-xs hover:bg-emerald-700 active:scale-95'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 active:scale-95'
            }`}
          >
            {isCompleted ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Done</span>
              </>
            ) : (
              <>
                <Camera className="w-3.5 h-3.5" />
                <span>Upload Proof</span>
              </>
            )}
          </button>

          {isCompleted && (
            <button
              onClick={() => onPromptPhotoProof(habit)}
              title="Update photo proof or note"
              className="text-[11px] font-medium text-stone-500 hover:text-emerald-700 transition-colors flex items-center gap-1 py-0.5"
            >
              <Camera className="w-3 h-3 text-stone-400" />
              <span>Edit Proof</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
