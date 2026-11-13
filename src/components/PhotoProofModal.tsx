import React, { useState, useRef } from 'react';
import { Habit } from '../types';
import { TASK_SAMPLE_PHOTOS } from '../data/initialData';
import {
  X,
  Camera,
  Upload,
  CheckCircle2,
  Sparkles,
  Leaf,
  Droplets,
  Trash2,
  Image as ImageIcon,
  AlertCircle,
} from 'lucide-react';

interface PhotoProofModalProps {
  habit: Habit;
  isOpen: boolean;
  onClose: () => void;
  onCompleteWithPhoto: (habitId: string, photoUrl: string, multiplier: number, note: string) => void;
  initialMultiplier?: number;
  initialNote?: string;
  initialPhotoUrl?: string;
  isAlreadyCompleted?: boolean;
}

export const PhotoProofModal: React.FC<PhotoProofModalProps> = ({
  habit,
  isOpen,
  onClose,
  onCompleteWithPhoto,
  initialMultiplier = 1,
  initialNote = '',
  initialPhotoUrl = '',
  isAlreadyCompleted = false,
}) => {
  const [photoUrl, setPhotoUrl] = useState<string>(initialPhotoUrl);
  const [multiplier, setMultiplier] = useState(initialMultiplier);
  const [note, setNote] = useState(initialNote);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const samplePhotos = TASK_SAMPLE_PHOTOS[habit.category] || TASK_SAMPLE_PHOTOS.circular;

  const totalPoints = Math.round(habit.points * multiplier);
  const totalCo2 = Number((habit.co2SavedKg * multiplier).toFixed(1));
  const totalWater = Math.round(habit.waterSavedL * multiplier);
  const totalWaste = Math.round(habit.wasteDivertedG * multiplier);

  // File upload reader
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoUrl) return;
    onCompleteWithPhoto(habit.id, photoUrl, multiplier, note.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative max-h-[92vh] overflow-y-auto">
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
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
            <Camera className="w-3.5 h-3.5 text-emerald-600" />
            <span>Task Photo Verification</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">
            Upload Proof for: {habit.title}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
            Upload or select a photo of your sustainable action to verify and complete this task.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Photo Upload & Preview Zone */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-stone-800 mb-1.5">
              <span>Photo Verification Proof *</span>
              {photoUrl && (
                <button
                  type="button"
                  onClick={() => setPhotoUrl('')}
                  className="text-stone-400 hover:text-red-600 font-medium text-[11px]"
                >
                  Clear Photo
                </button>
              )}
            </div>

            {photoUrl ? (
              <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500 bg-stone-100 aspect-video shadow-inner group">
                <img
                  src={photoUrl}
                  alt="Task verification proof"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-white text-stone-900 rounded-lg text-xs font-bold shadow-md hover:bg-stone-100"
                  >
                    Change Photo
                  </button>
                </div>
                <div className="absolute bottom-2 left-2 bg-emerald-600/95 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Photo Proof Attached</span>
                </div>
              </div>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-emerald-600 bg-emerald-50/70 scale-[0.99]'
                    : 'border-stone-300 hover:border-emerald-600 hover:bg-stone-50 bg-stone-50/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-2.5">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-stone-800">
                  Take Photo or Upload Image Proof
                </div>
                <p className="text-[11px] text-stone-500 mt-1 max-w-xs mx-auto">
                  Drag & drop from your phone or desktop, or tap to open camera/gallery.
                </p>
              </div>
            )}
          </div>

          {/* Quick Sample Photos for Task Testing */}
          <div>
            <div className="flex items-center justify-between text-xs text-stone-600 mb-1.5">
              <span className="font-medium flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-stone-400" />
                <span>Or select a sample proof photo:</span>
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {samplePhotos.map((s, idx) => {
                const isSelected = photoUrl === s.url;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPhotoUrl(s.url)}
                    className={`relative rounded-xl overflow-hidden aspect-video border transition-all ${
                      isSelected
                        ? 'ring-2 ring-emerald-600 border-emerald-600 shadow-sm'
                        : 'border-stone-200 hover:border-stone-400 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={s.url}
                      alt={s.label}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end p-1">
                      <span className="text-[9px] text-white font-medium truncate block leading-tight">
                        {s.label}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Impact Readout */}
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 grid grid-cols-4 gap-2 text-center">
            <div className="bg-white p-2 rounded-xl border border-stone-100 shadow-2xs">
              <div className="text-[10px] text-stone-500 font-medium">Points</div>
              <div className="text-base font-bold text-stone-900 font-mono-numbers">
                +{totalPoints}
              </div>
            </div>
            <div className="bg-white p-2 rounded-xl border border-stone-100 shadow-2xs">
              <div className="text-[10px] text-stone-500 font-medium">CO₂ Saved</div>
              <div className="text-base font-bold text-emerald-700 font-mono-numbers">
                {totalCo2}kg
              </div>
            </div>
            <div className="bg-white p-2 rounded-xl border border-stone-100 shadow-2xs">
              <div className="text-[10px] text-stone-500 font-medium">Water</div>
              <div className="text-base font-bold text-cyan-700 font-mono-numbers">
                {totalWater}L
              </div>
            </div>
            <div className="bg-white p-2 rounded-xl border border-stone-100 shadow-2xs">
              <div className="text-[10px] text-stone-500 font-medium">Waste</div>
              <div className="text-base font-bold text-amber-800 font-mono-numbers">
                {totalWaste}g
              </div>
            </div>
          </div>

          {/* Multiplier / Quantity */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Quantity Multiplier
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setMultiplier(val)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-colors border ${
                    multiplier === val
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  {val}×
                </button>
              ))}
            </div>
          </div>

          {/* Optional Note */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Add note or observation (optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g., Pedaled along waterfront path, avoided peak congestion."
              className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 outline-none text-stone-900 bg-stone-50/50"
            />
          </div>

          {/* Required notice if photo not yet selected */}
          {!photoUrl && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Please upload or select a task proof photo to complete this habit.</span>
            </div>
          )}

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
              disabled={!photoUrl}
              className={`flex-1 py-2.5 px-4 text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 ${
                photoUrl
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer active:scale-95'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isAlreadyCompleted ? 'Update Photo Proof' : 'Verify & Complete Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
