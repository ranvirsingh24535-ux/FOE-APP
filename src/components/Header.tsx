import React from 'react';
import { UserProfile, Region } from '../types';
import { MapPin, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: 'habits' | 'scoreboard' | 'badges' | 'impact';
  setActiveTab: (tab: 'habits' | 'scoreboard' | 'badges' | 'impact') => void;
  userProfile: UserProfile;
  currentRegion: Region;
  totalPoints: number;
  onOpenRegionModal: () => void;
  onOpenCustomHabitModal: () => void;
  onOpenRegistration: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  currentRegion,
  totalPoints,
  onOpenRegionModal,
  onOpenCustomHabitModal,
  onOpenRegistration,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('habits')}
              className="flex items-center gap-2 text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-emerald-700/20 group-hover:bg-emerald-700 transition-colors">
                🌱
              </div>
              <div>
                <span className="text-base sm:text-lg font-extrabold tracking-tight text-stone-900 font-display block leading-tight">
                  F.O.E(FRIENDS OF ENVIROMENT)
                </span>
                <span className="text-[11px] font-medium text-emerald-700 tracking-wide block">
                  Habits & Community League
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: 4 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <button
              onClick={() => setActiveTab('habits')}
              className={`whitespace-nowrap transition-colors relative py-1 ${
                activeTab === 'habits'
                  ? 'text-emerald-700 font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Daily Tracker
              {activeTab === 'habits' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('scoreboard')}
              className={`whitespace-nowrap transition-colors relative py-1 ${
                activeTab === 'scoreboard'
                  ? 'text-emerald-700 font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Regional Scoreboard
              {activeTab === 'scoreboard' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('badges')}
              className={`whitespace-nowrap transition-colors relative py-1 ${
                activeTab === 'badges'
                  ? 'text-emerald-700 font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Reward Badges
              {activeTab === 'badges' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('impact')}
              className={`whitespace-nowrap transition-colors relative py-1 ${
                activeTab === 'impact'
                  ? 'text-emerald-700 font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Impact Analytics
              {activeTab === 'impact' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
              )}
            </button>
          </nav>

          {/* Zone 3: 1 primary action area */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick Region Indicator */}
            <button
              onClick={onOpenRegionModal}
              title="Change your community district"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-100 text-stone-700 text-xs font-medium transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="max-w-[120px] truncate">{userProfile.district}</span>
            </button>

            {/* Total Points Pill-less Score display */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-900 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="font-mono-numbers">{totalPoints.toLocaleString()}</span>
              <span className="text-[10px] text-emerald-700 font-medium">PTS</span>
            </div>

            {/* User Profile / Registration Trigger */}
            {userProfile.isRegistered ? (
              <button
                onClick={onOpenRegistration}
                title="View / Edit your profile"
                className="flex items-center gap-2 p-1 pl-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 transition-colors"
              >
                <span className="text-xs font-semibold text-stone-800 max-w-[90px] truncate hidden sm:inline">
                  {userProfile.name}
                </span>
                <img
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-emerald-500"
                  referrerPolicy="no-referrer"
                />
              </button>
            ) : (
              <button
                onClick={onOpenRegistration}
                className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors whitespace-nowrap animate-pulse"
              >
                Register
              </button>
            )}

            {/* Primary Action Button */}
            <button
              onClick={onOpenCustomHabitModal}
              className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors whitespace-nowrap"
            >
              + Custom
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-stone-200 bg-white px-2 py-2">
        <button
          onClick={() => setActiveTab('habits')}
          className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
            activeTab === 'habits'
              ? 'bg-emerald-100 text-emerald-900 font-semibold'
              : 'text-stone-600'
          }`}
        >
          Daily Habits
        </button>
        <button
          onClick={() => setActiveTab('scoreboard')}
          className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
            activeTab === 'scoreboard'
              ? 'bg-emerald-100 text-emerald-900 font-semibold'
              : 'text-stone-600'
          }`}
        >
          Scoreboard
        </button>
        <button
          onClick={() => setActiveTab('badges')}
          className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
            activeTab === 'badges'
              ? 'bg-emerald-100 text-emerald-900 font-semibold'
              : 'text-stone-600'
          }`}
        >
          Badges
        </button>
        <button
          onClick={() => setActiveTab('impact')}
          className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
            activeTab === 'impact'
              ? 'bg-emerald-100 text-emerald-900 font-semibold'
              : 'text-stone-600'
          }`}
        >
          Impact
        </button>
      </div>
    </header>
  );
};
