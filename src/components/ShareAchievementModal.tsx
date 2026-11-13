import React, { useState } from 'react';
import { Badge, UserProfile, Region } from '../types';
import { X, Check, Copy, Sparkles, Award, Globe, Leaf } from 'lucide-react';

interface ShareAchievementModalProps {
  badge: Badge | null;
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  region: Region;
  totalPoints: number;
  totalCo2Kg: number;
}

export const ShareAchievementModal: React.FC<ShareAchievementModalProps> = ({
  badge,
  isOpen,
  onClose,
  userProfile,
  region,
  totalPoints,
  totalCo2Kg,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !badge) return null;

  const handleCopy = () => {
    const textToCopy = `🌱 I just unlocked the "${badge.name}" Badge on F.O.E(FRIENDS OF ENVIROMENT)! 
I've averted ${totalCo2Kg}kg of CO2e and accumulated ${totalPoints} points in ${userProfile.district}, ${region.name}!
Track your daily sustainable habits and join our regional community scoreboard at F.O.E(FRIENDS OF ENVIROMENT).`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sustainability Achievement</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">
            Share Your Green Milestone
          </h2>
        </div>

        {/* Digital Passport Card Preview */}
        <div className="mt-6 p-6 rounded-3xl bg-gradient-to-br from-emerald-950 via-stone-900 to-teal-950 text-white border border-emerald-800/40 shadow-xl relative overflow-hidden">
          {/* Subtle Decorative Emblem */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

          {/* Top Header of Card */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-lg">🌱</span>
              <span className="font-extrabold tracking-tight font-display text-emerald-400">
                F.O.E(FRIENDS OF ENVIROMENT) Passport
              </span>
            </div>
            <span className="text-[11px] text-stone-400 uppercase font-mono-numbers">
              ID: {userProfile.name.slice(0, 3).toUpperCase()}-2026
            </span>
          </div>

          {/* Badge Display */}
          <div className="py-6 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-emerald-600 to-amber-400 p-1 shadow-lg">
              <div className="w-full h-full rounded-full bg-stone-950 flex items-center justify-center text-3xl">
                🏆
              </div>
            </div>

            <div className="mt-3 text-[11px] uppercase tracking-widest text-emerald-400 font-bold">
              {badge.tier.toUpperCase()} MEDALLION
            </div>
            <h3 className="text-xl font-black font-display text-white mt-1">
              {badge.name}
            </h3>
            <p className="text-xs text-stone-300 mt-1 max-w-sm mx-auto leading-relaxed">
              "{badge.lore}"
            </p>
          </div>

          {/* Citizen Details Footer */}
          <div className="pt-4 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <div className="text-[10px] text-stone-400 uppercase">Eco Citizen</div>
              <div className="font-bold text-white truncate mt-0.5">{userProfile.name}</div>
            </div>
            <div>
              <div className="text-[10px] text-stone-400 uppercase">District</div>
              <div className="font-bold text-emerald-300 truncate mt-0.5">{userProfile.district}</div>
            </div>
            <div>
              <div className="text-[10px] text-stone-400 uppercase">CO₂ Offset</div>
              <div className="font-bold text-white font-mono-numbers mt-0.5">
                {totalCo2Kg} kg
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 py-3 px-4 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Shareable Story Snippet</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
