export type HabitCategory = 'energy' | 'transit' | 'diet' | 'water' | 'circular';

export interface Habit {
  id: string;
  title: string;
  description: string;
  category: HabitCategory;
  points: number;
  co2SavedKg: number;
  waterSavedL: number;
  wasteDivertedG: number;
  iconName: string;
  isCustom?: boolean;
}

export interface HabitLogEntry {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  timestamp: number;
  multiplier?: number;
  note?: string;
  photoUrl?: string; // Captured / uploaded photo verification
  impact: {
    co2Kg: number;
    waterL: number;
    wasteG: number;
    points: number;
  };
}

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'emerald';

export interface Badge {
  id: string;
  name: string;
  tier: BadgeTier;
  icon: string;
  description: string;
  requirementText: string;
  category: string;
  unlockedAt: string | null;
  progress: number; // 0 to 100
  currentValue: number;
  targetValue: number;
  metricUnit: string;
  lore: string;
}

export interface CommunityMember {
  id: string;
  name: string;
  avatar: string;
  district: string;
  regionId: string;
  rank: number;
  points: number;
  co2SavedKg: number;
  waterSavedL: number;
  streak: number;
  badgesCount: number;
  recentAction: string;
  recentActionTime: string;
  isCurrentUser?: boolean;
  bio: string;
  coordinates: { x: number; y: number }; // percentage on map (0-100)
  kudosCount: number;
}

export interface Region {
  id: string;
  name: string;
  country: string;
  tagline: string;
  totalActiveMembers: number;
  weeklyGoalKgCO2: number;
  currentWeekKgCO2: number;
  collectiveTreesEquivalent: number;
  districts: string[];
}

export interface UserProfile {
  name: string;
  district: string;
  regionId: string;
  avatar: string;
  joinDate: string;
  bio: string;
  isRegistered?: boolean;
  email?: string;
  ecoFocus?: string[];
}

