import React, { useState } from 'react';
import { Badge, BadgeTier, UserProfile, Region } from '../types';
import { BadgeDetailModal } from './BadgeDetailModal';
import { ShareAchievementModal } from './ShareAchievementModal';
import {
  Award,
  Sparkles,
  Lock,
  CheckCircle2,
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
  ChevronRight,
} from 'lucide-react';

interface BadgeShowcaseProps {
  badges: Badge[];
  userProfile: UserProfile;
  region: Region;
  totalPoints: number;
  totalCo2Kg: number;
}

export const BadgeShowcase: React.FC<BadgeShowcaseProps> = ({
  badges,
  userProfile,
  region,
  totalPoints,
  totalCo2Kg,
}) => {
  const [selectedTier, setSelectedTier] = useState<'all' | BadgeTier>('all');
  const [activeModalBadge, setActiveModalBadge] = useState<Badge | null>(null);
  const [shareBadge, setShareBadge] = useState<Badge | null>(null);

  const unlockedCount = badges.filter((b) => b.unlockedAt !== null).length;
  const filteredBadges = badges.filter((b) => {
    if (selectedTier === 'all') return true;
    return b.tier === selectedTier;
  });

  const nextBadge = badges
    .filter((b) => !b.unlockedAt)
    .sort((a, b) => b.progress - a.progress)[0];

  const renderBadgeIcon = (iconName: string) => {
    const props = { className: 'w-6 h-6' };
    switch (iconName) {
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

  const getTierPill = (tier: BadgeTier) => {
    switch (tier) {
      case 'bronze':
        return 'text-amber-800 bg-amber-100/70 border-amber-300';
      case 'silver':
        return 'text-slate-700 bg-slate-100 border-slate-300';
      case 'gold':
        return 'text-amber-900 bg-amber-50 border-amber-300';
      case 'emerald':
        return 'text-emerald-950 bg-emerald-100 border-emerald-300 font-bold';
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Showcase with Generated Prestige Medallion */}
      <div className="rounded-3xl border border-stone-200 bg-stone-900 text-white overflow-hidden shadow-md">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Left Hero Text & Progress */}
          <div className="p-6 sm:p-8 lg:p-10 lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sustainability Hall of Honor</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight text-white">
              Reward your commitment to a regenerative future.
            </h1>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl">
              Badges represent permanent verification of real-world impact. Unlock bronze, silver, gold, and emerald medallions by consistently logging sustainable habits.
            </p>

            {/* Quick Unlocked Stats Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-6">
              <div>
                <span className="text-xs text-stone-400 block">Total Badges</span>
                <span className="text-2xl font-bold font-mono-numbers text-white">
                  {unlockedCount} / {badges.length}
                </span>
              </div>
              <div className="h-8 w-px bg-white/10 hidden sm:block" />
              <div>
                <span className="text-xs text-stone-400 block">Prestige Standing</span>
                <span className="text-base font-semibold text-emerald-400">
                  {unlockedCount >= 6 ? 'Emerald Laureate' : unlockedCount >= 3 ? 'Gold Guardian' : 'Green Scout'}
                </span>
              </div>
              {nextBadge && (
                <>
                  <div className="h-8 w-px bg-white/10 hidden sm:block" />
                  <div>
                    <span className="text-xs text-stone-400 block">Next Milestone</span>
                    <span className="text-xs font-medium text-stone-200">
                      {nextBadge.name} ({nextBadge.progress}%)
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Image Medallion Presentation */}
          <div className="lg:col-span-4 p-6 sm:p-8 flex items-center justify-center bg-stone-950/50 border-t lg:border-t-0 lg:border-l border-white/10">
            <div className="relative group text-center">
              <img
                src="/src/assets/images/eco_badge_champion_1793848389068.jpg"
                alt="Intricate prestige emerald and golden eco award badge medallion"
                className="w-44 h-44 sm:w-52 sm:h-52 object-contain rounded-2xl mx-auto shadow-2xl transition-transform duration-300 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="mt-2 text-[11px] text-stone-400 uppercase tracking-widest font-mono-numbers">
                Emerald Medallion of Earth
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tier Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Badges' },
            { id: 'bronze', label: 'Bronze' },
            { id: 'silver', label: 'Silver' },
            { id: 'gold', label: 'Gold' },
            { id: 'emerald', label: 'Emerald Prestige' },
          ].map((t) => {
            const isSelected = selectedTier === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedTier(t.id as 'all' | BadgeTier)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <span className="text-xs text-stone-500 font-medium">
          Showing {filteredBadges.length} badges ({unlockedCount} unlocked)
        </span>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBadges.map((badge) => {
          const isUnlocked = !!badge.unlockedAt;

          return (
            <button
              key={badge.id}
              onClick={() => setActiveModalBadge(badge)}
              className={`rounded-3xl border p-5 text-left transition-all relative group flex flex-col justify-between ${
                isUnlocked
                  ? 'bg-white border-stone-200 hover:border-emerald-500 hover:shadow-md'
                  : 'bg-stone-50/70 border-stone-200 hover:border-stone-300 opacity-80 hover:opacity-100'
              }`}
            >
              <div>
                {/* Header: Icon & Tier Tag */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                      isUnlocked
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-200 text-stone-400'
                    }`}
                  >
                    {isUnlocked ? renderBadgeIcon(badge.icon) : <Lock className="w-5 h-5" />}
                  </div>

                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getTierPill(
                      badge.tier
                    )}`}
                  >
                    {badge.tier}
                  </span>
                </div>

                {/* Badge Name & Category */}
                <h3 className="text-base font-bold text-stone-900 font-display">
                  {badge.name}
                </h3>
                <div className="text-[11px] text-stone-500 font-medium mt-0.5">
                  {badge.category}
                </div>

                <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                  {badge.description}
                </p>
              </div>

              {/* Progress or Unlocked Timestamp footer */}
              <div className="mt-5 pt-3.5 border-t border-stone-100">
                {isUnlocked ? (
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 font-semibold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Unlocked</span>
                    </span>
                    <span className="text-[11px] text-stone-400">
                      {new Date(badge.unlockedAt!).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
                      <span>Progress</span>
                      <span className="font-mono-numbers">
                        {badge.currentValue}/{badge.targetValue} {badge.metricUnit}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full"
                        style={{ width: `${badge.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Badge Detail Modal */}
      {activeModalBadge && (
        <BadgeDetailModal
          badge={activeModalBadge}
          isOpen={!!activeModalBadge}
          onClose={() => setActiveModalBadge(null)}
          onShare={(b) => {
            setActiveModalBadge(null);
            setShareBadge(b);
          }}
        />
      )}

      {/* Share Passport Modal */}
      {shareBadge && (
        <ShareAchievementModal
          badge={shareBadge}
          isOpen={!!shareBadge}
          onClose={() => setShareBadge(null)}
          userProfile={userProfile}
          region={region}
          totalPoints={totalPoints}
          totalCo2Kg={totalCo2Kg}
        />
      )}
    </div>
  );
};
