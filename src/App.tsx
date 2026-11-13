import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { HabitsTracker } from './components/HabitsTracker';
import { RegionalScoreboard } from './components/RegionalScoreboard';
import { BadgeShowcase } from './components/BadgeShowcase';
import { ImpactAnalytics } from './components/ImpactAnalytics';
import { ChangeRegionModal } from './components/ChangeRegionModal';
import { AddCustomHabitModal } from './components/AddCustomHabitModal';
import { RegistrationModal } from './components/RegistrationModal';
import {
  INITIAL_HABITS,
  INITIAL_BADGES,
  INITIAL_REGIONS,
  INITIAL_COMMUNITY_MEMBERS,
  DEFAULT_USER_PROFILE,
} from './data/initialData';
import { Habit, Badge, HabitLogEntry, Region, CommunityMember, UserProfile } from './types';
import { playCheckSound, playUncheckSound, playBadgeFanfare } from './utils/audio';
import { Sparkles, CheckCircle2, Award, X, Camera } from 'lucide-react';

const STORAGE_KEY_PREFIX = 'ecopulse_v1_';

export default function App() {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<'habits' | 'scoreboard' | 'badges' | 'impact'>('habits');

  // Selected date for tracker (YYYY-MM-DD)
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}profile`);
    return saved ? JSON.parse(saved) : DEFAULT_USER_PROFILE;
  });

  // Regions & Selected Region
  const [regions] = useState<Region[]>(INITIAL_REGIONS);
  const [currentRegionId, setCurrentRegionId] = useState<string>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}regionId`);
    return saved || 'cascadia';
  });

  // Community Members
  const [members, setMembers] = useState<CommunityMember[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}members`);
    return saved ? JSON.parse(saved) : INITIAL_COMMUNITY_MEMBERS;
  });

  // Habits Catalog
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}habits`);
    return saved ? JSON.parse(saved) : INITIAL_HABITS;
  });

  // Habit Logs (Seed initial realistic logs if first visit so user has baseline streak & standing)
  const [logs, setLogs] = useState<HabitLogEntry[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}logs`);
    if (saved) return JSON.parse(saved);

    // Initial baseline seeds for the past 2 days with real verified photo proof
    const d1 = new Date();
    d1.setDate(d1.getDate() - 1);
    const yesterdayStr = d1.toISOString().split('T')[0];

    const d2 = new Date();
    d2.setDate(d2.getDate() - 2);
    const dayBeforeYesterdayStr = d2.toISOString().split('T')[0];

    return [
      {
        id: 'seed-log-1',
        habitId: 'bike-commute',
        date: yesterdayStr,
        timestamp: Date.now() - 86400000,
        multiplier: 1,
        note: 'Cycled to work along the river path',
        photoUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80',
        impact: { co2Kg: 2.1, waterL: 0, wasteG: 0, points: 40 },
      },
      {
        id: 'seed-log-2',
        habitId: 'plant-meal',
        date: yesterdayStr,
        timestamp: Date.now() - 82000000,
        multiplier: 1,
        note: 'Roasted sweet potato and black bean grain bowl',
        photoUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80',
        impact: { co2Kg: 1.6, waterL: 650, wasteG: 40, points: 35 },
      },
      {
        id: 'seed-log-3',
        habitId: 'cold-wash-air-dry',
        date: dayBeforeYesterdayStr,
        timestamp: Date.now() - 172800000,
        multiplier: 1,
        note: 'Line dried laundry in the sun',
        photoUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
        impact: { co2Kg: 1.9, waterL: 30, wasteG: 0, points: 30 },
      },
    ];
  });

  // Badges
  const [badges, setBadges] = useState<Badge[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}badges`);
    return saved ? JSON.parse(saved) : INITIAL_BADGES;
  });

  // Modals state
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
  const [isCustomHabitModalOpen, setIsCustomHabitModalOpen] = useState(false);
  // Auto-open registration for first-time users if not yet registered
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState<boolean>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}profile`);
    if (!saved) return true;
    const parsed = JSON.parse(saved);
    return !parsed.isRegistered;
  });

  // Toast celebration state
  const [unlockToast, setUnlockToast] = useState<{ title: string; badgeName: string; isPhoto?: boolean } | null>(null);

  // Persist State to LocalStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}habits`, JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}logs`, JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}badges`, JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}profile`, JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}regionId`, currentRegionId);
  }, [currentRegionId]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}members`, JSON.stringify(members));
  }, [members]);

  // Derived user statistics
  const totalUserPoints = logs.reduce((acc, log) => acc + log.impact.points, 0);
  const totalUserCo2 = Number(logs.reduce((acc, log) => acc + log.impact.co2Kg, 0).toFixed(1));
  const totalUserWater = logs.reduce((acc, log) => acc + log.impact.waterL, 0);
  const totalUserWaste = logs.reduce((acc, log) => acc + log.impact.wasteG, 0);

  // Compute active streak (consecutive days with at least 1 log)
  const uniqueLoggedDates = Array.from(new Set(logs.map((l) => l.date))).sort().reverse();
  let calculatedStreak = 0;
  if (uniqueLoggedDates.length > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let checkDate = new Date(today);
    // If today hasn't been logged yet, start checking from yesterday to see if streak is preserved
    if (!uniqueLoggedDates.includes(todayStr)) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    for (let i = 0; i < 30; i++) {
      const dateString = checkDate.toISOString().split('T')[0];
      if (uniqueLoggedDates.includes(dateString)) {
        calculatedStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Current Region Object
  const currentRegion = regions.find((r) => r.id === currentRegionId) || regions[0];

  // Evaluate & recalculate badges
  const evaluateBadges = (currentLogs: HabitLogEntry[], streak: number, points: number, co2: number, water: number, waste: number) => {
    const habitCounts: Record<string, number> = {};
    const categoryCounts: Record<string, number> = {
      transit: 0,
      diet: 0,
      energy: 0,
      water: 0,
      circular: 0,
    };

    currentLogs.forEach((log) => {
      habitCounts[log.habitId] = (habitCounts[log.habitId] || 0) + 1;
      const h = habits.find((item) => item.id === log.habitId);
      if (h && categoryCounts[h.category] !== undefined) {
        categoryCounts[h.category] += 1;
      }
    });

    let newlyUnlockedBadge: Badge | null = null;

    setBadges((prevBadges) => {
      const updated = prevBadges.map((badge) => {
        let currentValue = badge.currentValue;
        let progress = 0;

        switch (badge.id) {
          case 'first-leaf':
            currentValue = currentLogs.length;
            break;
          case 'pedal-pioneer':
            currentValue = categoryCounts.transit;
            break;
          case 'plant-alchemist':
            currentValue = categoryCounts.diet;
            break;
          case 'hydro-sentinel':
            currentValue = water;
            break;
          case 'carbon-cutter':
            currentValue = Math.floor(co2);
            break;
          case 'zero-waste-champion':
            currentValue = waste;
            break;
          case 'evergreen-streak':
            currentValue = streak;
            break;
          case 'district-catalyst':
            currentValue = points;
            break;
          case 'energy-guardian':
            currentValue = categoryCounts.energy;
            break;
          case 'podium-climber':
            currentValue = points >= 300 ? 10 : 0;
            break;
          case 'grand-earth-steward':
            currentValue = prevBadges.filter((b) => b.unlockedAt && b.id !== 'grand-earth-steward').length;
            break;
          case 'cascadia-luminary':
            currentValue = points >= 1000 && co2 >= 50 ? 1000 : Math.min(points, 999);
            break;
          default:
            break;
        }

        progress = Math.min(100, Math.round((currentValue / badge.targetValue) * 100));

        // Check if just unlocked
        const shouldUnlock = currentValue >= badge.targetValue;
        if (shouldUnlock && !badge.unlockedAt) {
          newlyUnlockedBadge = {
            ...badge,
            unlockedAt: new Date().toISOString(),
            currentValue,
            progress: 100,
          };
          return newlyUnlockedBadge;
        }

        return {
          ...badge,
          currentValue,
          progress,
        };
      });

      return updated;
    });

    if (newlyUnlockedBadge) {
      triggerBadgeCelebration(newlyUnlockedBadge);
    }
  };

  const triggerBadgeCelebration = (badge: Badge) => {
    playBadgeFanfare();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#059669', '#10b981', '#34d399', '#f59e0b', '#38bdf8'],
    });
    setUnlockToast({
      title: 'New Badge Unlocked!',
      badgeName: badge.name,
    });
    setTimeout(() => {
      setUnlockToast(null);
    }, 5000);
  };

  // Toggle habit on/off for a date (uncheck if already completed)
  const handleToggleHabit = (habitId: string, date: string) => {
    const existingIndex = logs.findIndex((l) => l.habitId === habitId && l.date === date);

    if (existingIndex >= 0) {
      // Uncheck
      const updatedLogs = logs.filter((_, idx) => idx !== existingIndex);
      setLogs(updatedLogs);
      playUncheckSound();
    }
  };

  // Photo verification and completion handler
  const handleSaveHabitWithPhoto = (
    habitId: string,
    date: string,
    photoUrl: string,
    multiplier: number,
    note: string
  ) => {
    const targetHabit = habits.find((h) => h.id === habitId);
    if (!targetHabit) return;

    const existingIndex = logs.findIndex((l) => l.habitId === habitId && l.date === date);

    const calculatedImpact = {
      co2Kg: Number((targetHabit.co2SavedKg * multiplier).toFixed(1)),
      waterL: Math.round(targetHabit.waterSavedL * multiplier),
      wasteG: Math.round(targetHabit.wasteDivertedG * multiplier),
      points: Math.round(targetHabit.points * multiplier),
    };

    let updatedLogs: HabitLogEntry[];

    if (existingIndex >= 0) {
      updatedLogs = logs.map((item, idx) => {
        if (idx === existingIndex) {
          return {
            ...item,
            photoUrl,
            multiplier,
            note,
            impact: calculatedImpact,
          };
        }
        return item;
      });
    } else {
      const newLog: HabitLogEntry = {
        id: `log-${Date.now()}`,
        habitId,
        date,
        timestamp: Date.now(),
        multiplier,
        note,
        photoUrl,
        impact: calculatedImpact,
      };
      updatedLogs = [newLog, ...logs];
    }

    setLogs(updatedLogs);
    playCheckSound();

    // Confetti celebration for photo verified completion!
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#10b981', '#059669', '#38bdf8', '#34d399'],
    });

    setUnlockToast({
      title: 'Task Verified with Photo!',
      badgeName: `${targetHabit.title} (+${calculatedImpact.points} pts)`,
      isPhoto: true,
    });
    setTimeout(() => {
      setUnlockToast(null);
    }, 4500);

    const newPoints = updatedLogs.reduce((acc, l) => acc + l.impact.points, 0);
    const newCo2 = Number(updatedLogs.reduce((acc, l) => acc + l.impact.co2Kg, 0).toFixed(1));
    const newWater = updatedLogs.reduce((acc, l) => acc + l.impact.waterL, 0);
    const newWaste = updatedLogs.reduce((acc, l) => acc + l.impact.wasteG, 0);

    evaluateBadges(updatedLogs, calculatedStreak + 1, newPoints, newCo2, newWater, newWaste);
  };

  // Add Custom Habit
  const handleAddCustomHabit = (newHabit: Habit) => {
    setHabits((prev) => [newHabit, ...prev]);
    playCheckSound();
  };

  // Registration handler for first-time users
  const handleRegisterUser = (newProfile: UserProfile, bonusPoints: number) => {
    setUserProfile(newProfile);
    setCurrentRegionId(newProfile.regionId);
    setIsRegistrationModalOpen(false);

    // Add induction bonus log entry
    const bonusLog: HabitLogEntry = {
      id: `induction-${Date.now()}`,
      habitId: 'first-leaf-induction',
      date: todayStr,
      timestamp: Date.now(),
      multiplier: 1,
      note: 'F.O.E(FRIENDS OF ENVIROMENT) Citizen Registration induction bonus',
      impact: {
        co2Kg: 2.0,
        waterL: 50,
        wasteG: 100,
        points: bonusPoints,
      },
    };

    const updatedLogs = [bonusLog, ...logs];
    setLogs(updatedLogs);

    playBadgeFanfare();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#059669', '#10b981', '#f59e0b', '#38bdf8', '#a855f7'],
    });

    setUnlockToast({
      title: 'Welcome Eco-Citizen!',
      badgeName: `Profile Created (+${bonusPoints} Welcome Pts)`,
    });
    setTimeout(() => {
      setUnlockToast(null);
    }, 5000);
  };

  // Give Kudos to Community Member
  const handleGiveKudos = (memberId: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, kudosCount: m.kudosCount + 1 } : m))
    );
    playCheckSound();
  };

  // Change Region & District
  const handleSelectRegionAndDistrict = (regionId: string, district: string) => {
    setCurrentRegionId(regionId);
    setUserProfile((prev) => ({
      ...prev,
      regionId,
      district,
    }));
  };

  const unlockedBadgesCount = badges.filter((b) => b.unlockedAt !== null).length;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={userProfile}
        currentRegion={currentRegion}
        totalPoints={totalUserPoints}
        onOpenRegionModal={() => setIsRegionModalOpen(true)}
        onOpenCustomHabitModal={() => setIsCustomHabitModalOpen(true)}
        onOpenRegistration={() => setIsRegistrationModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'habits' && (
          <HabitsTracker
            habits={habits}
            logs={logs}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onToggleHabit={handleToggleHabit}
            onSaveHabitWithPhoto={handleSaveHabitWithPhoto}
            onOpenCustomHabitModal={() => setIsCustomHabitModalOpen(true)}
            streakDays={calculatedStreak}
            onNavigateToScoreboard={() => setActiveTab('scoreboard')}
          />
        )}

        {activeTab === 'scoreboard' && (
          <RegionalScoreboard
            region={currentRegion}
            members={members}
            userProfile={userProfile}
            userPoints={totalUserPoints}
            userCo2Kg={totalUserCo2}
            userWaterL={totalUserWater}
            userStreak={calculatedStreak}
            userBadgesCount={unlockedBadgesCount}
            onOpenRegionModal={() => setIsRegionModalOpen(true)}
            onNavigateToHabits={() => setActiveTab('habits')}
            onGiveKudos={handleGiveKudos}
          />
        )}

        {activeTab === 'badges' && (
          <BadgeShowcase
            badges={badges}
            userProfile={userProfile}
            region={currentRegion}
            totalPoints={totalUserPoints}
            totalCo2Kg={totalUserCo2}
          />
        )}

        {activeTab === 'impact' && (
          <ImpactAnalytics
            logs={logs}
            habits={habits}
            totalPoints={totalUserPoints}
            totalCo2Kg={totalUserCo2}
            totalWaterL={totalUserWater}
            totalWasteG={totalUserWaste}
            streakDays={calculatedStreak}
            userProfile={userProfile}
            region={currentRegion}
          />
        )}
      </main>

      {/* Unlock / Action Toast Notification */}
      {unlockToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-950 text-white rounded-2xl p-4 shadow-2xl border border-emerald-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-md">
            {unlockToast.isPhoto ? <Camera className="w-5 h-5" /> : <Award className="w-5 h-5" />}
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              {unlockToast.title}
            </div>
            <div className="text-sm font-extrabold text-white font-display">
              {unlockToast.badgeName}
            </div>
          </div>
          <button
            onClick={() => setUnlockToast(null)}
            className="ml-2 text-stone-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* First-Time User Registration Modal */}
      <RegistrationModal
        isOpen={isRegistrationModalOpen}
        regions={regions}
        onRegister={handleRegisterUser}
      />

      {/* Change Region Modal */}
      <ChangeRegionModal
        isOpen={isRegionModalOpen}
        onClose={() => setIsRegionModalOpen(false)}
        regions={regions}
        currentRegion={currentRegion}
        userProfile={userProfile}
        onSelectRegionAndDistrict={handleSelectRegionAndDistrict}
      />

      {/* Add Custom Habit Modal */}
      <AddCustomHabitModal
        isOpen={isCustomHabitModalOpen}
        onClose={() => setIsCustomHabitModalOpen(false)}
        onAddHabit={handleAddCustomHabit}
      />

      {/* Compliant Footer */}
      <footer className="border-t border-stone-200 bg-white py-6 mt-12 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-stone-900 font-display">F.O.E(FRIENDS OF ENVIROMENT)</span>
            <span>·</span>
            <span>Sustainable habits & community scoreboard</span>
          </div>

          <div className="flex items-center gap-6">
            <span>District: {userProfile.district}</span>
            <span>·</span>
            <span>Region: {currentRegion.name}</span>
            <span>·</span>
            <span>© 2026 F.O.E(FRIENDS OF ENVIROMENT)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
