import React from 'react';
import { Badge, BadgeTier } from '../types';
import {
  X,
  Award,
  Calendar,
  Sparkles,
  Lock,
  CheckCircle2,
  Share2,
  Sprout,
  Bike,
  Salad,
  Droplets,
  ShieldCheck,
  Recycle,
  Flame,
  Zap,
  Trophy,
  Crown,
} from 'lucide-react';

interface BadgeDetailModalProps {
  badge: Badge | null;
  isOpen: boolean;
  onClose: () => void;
  onShare: (badge: Badge) => void;
}

const TIER_COLORS: Record<BadgeTier, { border: string; bg: string; text: string; label: string }> = {
  bronze: {
    border: 'border-amber-700/40',
    bg: 'bg-amber-100/50',
    text: 'text-amber-900',
    label: 'Bronze Tier',
  },
  silver: {
    border: 'border-slate-300',
    bg: 'bg-slate-100',
    text: 'text-slate-800',
    label: 'Silver Tier',
  },
  gold: {
    border: 'border-amber-400',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    label: 'Gold Tier',
  },
  emerald: {
    border: 'border-emerald-500',
    bg: 'bg-emerald-50',
    text: 'text-emerald-900',
    label: 'Emerald Prestige Tier',
  },
};

export const BadgeDetailModal: React.FC<BadgeDetailModalProps> = ({
  badge,
  isOpen,
  onClose,
  onShare,
}) => {
  if (!isOpen || !badge) return null;

  const isUnlocked = !!badge.unlockedAt;
  const tierStyle = TIER_COLORS[badge.tier];

  const renderBadgeIcon = () => {
    const props = { className: 'w-10 h-10' };
    switch (badge.icon) {
      case 'Sprout':
        return <Sprout {...props} />;
      case 'Bike':
        return <Bike {...props} />;
      case 'Salad':
        return <Salad {...props} />;
      case 'Droplets':
        return <Droplets {...props} />;
      case 'ShieldCheck':
        return <ShieldCheck {...props} />;
      case 'Recycle':
        return <Recycle {...props} />;
      case 'Flame':
        return <Flame {...props} />;
      case 'Zap':
        return <Zap {...props} />;
      case 'Trophy':
        return <Trophy {...props} />;
      case 'Crown':
        return <Crown {...props} />;
      default:
        return <Award {...props} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative text-center">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Big Badge Emblem Display */}
        <div className="relative mx-auto my-4 w-28 h-28 flex items-center justify-center">
          <div
            className={`w-28 h-28 rounded-full border-4 flex items-center justify-center shadow-lg transition-transform ${
              isUnlocked
                ? `${tierStyle.border} ${tierStyle.bg} ${tierStyle.text}`
                : 'border-stone-300 bg-stone-100 text-stone-400'
            }`}
          >
            {isUnlocked ? renderBadgeIcon() : <Lock className="w-10 h-10 text-stone-400" />}
          </div>

          {isUnlocked && (
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* Tier badge indicator */}
        <div className="inline-block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
          {tierStyle.label} · {badge.category}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black text-stone-900 font-display">
          {badge.name}
        </h2>

        {/* Description */}
        <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
          {badge.description}
        </p>

        {/* Lore & Ecological Significance */}
        <div className="mt-4 p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-left">
          <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1 mb-1">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>Ecological Lore</span>
          </div>
          <p className="text-xs text-stone-600 italic leading-relaxed">
            "{badge.lore}"
          </p>
        </div>

        {/* Progress or Unlock Timestamp */}
        <div className="mt-5 pt-4 border-t border-stone-200">
          {isUnlocked ? (
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-xl py-2 px-3">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Earned on {new Date(badge.unlockedAt!).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5 font-medium">
                <span>Unlock Progress</span>
                <span className="font-mono-numbers">
                  {badge.currentValue} / {badge.targetValue} {badge.metricUnit} ({badge.progress}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                  style={{ width: `${badge.progress}%` }}
                />
              </div>
              <p className="text-[11px] text-stone-400 mt-2">
                Requirement: {badge.requirementText}
              </p>
            </div>
          )}
        </div>

        {/* Share Action */}
        {isUnlocked && (
          <div className="mt-6 flex items-center gap-2">
            <button
              onClick={() => onShare(badge)}
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Achievement Card</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
