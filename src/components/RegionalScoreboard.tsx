import React, { useState } from 'react';
import { Region, CommunityMember, UserProfile } from '../types';
import { RegionalMapView } from './RegionalMapView';
import {
  Trophy,
  Medal,
  Flame,
  Leaf,
  Droplets,
  Heart,
  MapPin,
  Sparkles,
  Users,
  Compass,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Award,
} from 'lucide-react';

interface RegionalScoreboardProps {
  region: Region;
  members: CommunityMember[];
  userProfile: UserProfile;
  userPoints: number;
  userCo2Kg: number;
  userWaterL: number;
  userStreak: number;
  userBadgesCount: number;
  onOpenRegionModal: () => void;
  onNavigateToHabits: () => void;
  onGiveKudos: (memberId: string) => void;
}

export const RegionalScoreboard: React.FC<RegionalScoreboardProps> = ({
  region,
  members,
  userProfile,
  userPoints,
  userCo2Kg,
  userWaterL,
  userStreak,
  userBadgesCount,
  onOpenRegionModal,
  onNavigateToHabits,
  onGiveKudos,
}) => {
  const [subView, setSubView] = useState<'leaderboard' | 'map' | 'activity'>('leaderboard');
  const [districtFilter, setDistrictFilter] = useState<'all' | 'district'>('all');
  const [timeframe, setTimeframe] = useState<'week' | 'all'>('week');

  // Inject current user into member rankings accurately
  const currentUserMember: CommunityMember = {
    id: 'current-user',
    name: `${userProfile.name} (You)`,
    avatar: userProfile.avatar,
    district: userProfile.district,
    regionId: region.id,
    rank: 0,
    points: userPoints,
    co2SavedKg: userCo2Kg,
    waterSavedL: userWaterL,
    streak: userStreak,
    badgesCount: userBadgesCount,
    recentAction: 'Active today on F.O.E(FRIENDS OF ENVIROMENT)',
    recentActionTime: 'Just now',
    isCurrentUser: true,
    bio: userProfile.bio,
    coordinates: { x: 42, y: 48 },
    kudosCount: 15,
  };

  // Combine and sort by points descending
  const allCommunityWithUser = [...members.filter((m) => !m.isCurrentUser), currentUserMember].sort(
    (a, b) => b.points - a.points
  );

  // Re-assign ranks
  const rankedList = allCommunityWithUser.map((member, idx) => ({
    ...member,
    rank: idx + 1,
  }));

  const userRankData = rankedList.find((m) => m.isCurrentUser);
  const nextMemberAhead = userRankData && userRankData.rank > 1 ? rankedList[userRankData.rank - 2] : null;
  const pointsGap = nextMemberAhead ? nextMemberAhead.points - (userRankData?.points || 0) : 0;

  // Filter for display
  const displayedMembers = rankedList.filter((m) => {
    if (districtFilter === 'district') {
      return m.district === userProfile.district;
    }
    return true;
  });

  const top3 = displayedMembers.slice(0, 3);

  // Collective district progress
  const weeklyTarget = region.weeklyGoalKgCO2;
  const currentWeeklySaved = region.currentWeekKgCO2 + userCo2Kg;
  const progressPercent = Math.min(100, Math.round((currentWeeklySaved / weeklyTarget) * 100));

  return (
    <div className="space-y-8">
      {/* District Challenge & Region Header Banner */}
      <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Regional League</span>
              <span aria-hidden="true">·</span>
              <span className="text-stone-500 font-normal">{region.country}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display">
              {region.name}
            </h1>

            <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
              {region.tagline}
            </p>

            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs font-medium text-stone-600 bg-stone-100 rounded-lg px-2.5 py-1">
                Your District: <strong className="text-stone-900 font-semibold">{userProfile.district}</strong>
              </span>
              <button
                onClick={onOpenRegionModal}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 hover:underline transition-all"
              >
                Change League / District
              </button>
            </div>
          </div>

          {/* Collective Goal Progress Card */}
          <div className="w-full lg:max-w-md bg-stone-50 rounded-2xl p-5 border border-stone-200">
            <div className="flex items-center justify-between gap-2 text-xs mb-2">
              <span className="font-semibold text-stone-900 flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-emerald-600" />
                <span>District Weekly Goal</span>
              </span>
              <span className="font-mono-numbers font-bold text-emerald-700 text-sm">
                {progressPercent}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-500 mt-2 font-mono-numbers">
              <span>{currentWeeklySaved.toLocaleString()} kg CO₂ averted</span>
              <span>Goal: {weeklyTarget.toLocaleString()} kg</span>
            </div>

            <div className="mt-3 pt-2.5 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600">
              <span>🌳 Impact Equivalent:</span>
              <span className="font-bold text-stone-900 font-mono-numbers">
                {Math.round(currentWeeklySaved / 20)} mature trees offset
              </span>
            </div>
          </div>
        </div>

        {/* Sub-view Navigation Tabs */}
        <div className="mt-8 pt-6 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
            <button
              onClick={() => setSubView('leaderboard')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                subView === 'leaderboard'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Neighbor Standings
            </button>
            <button
              onClick={() => setSubView('map')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                subView === 'map'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Regional Map
            </button>
            <button
              onClick={() => setSubView('activity')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                subView === 'activity'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Live Community Feed
            </button>
          </div>

          {/* Quick Filters for Leaderboard */}
          {subView === 'leaderboard' && (
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-stone-100 p-1 rounded-xl text-xs">
                <button
                  onClick={() => setDistrictFilter('all')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    districtFilter === 'all'
                      ? 'bg-white text-stone-900 font-semibold shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  All {region.districts.length} Districts
                </button>
                <button
                  onClick={() => setDistrictFilter('district')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    districtFilter === 'district'
                      ? 'bg-white text-stone-900 font-semibold shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  My District Only
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sub-View: Leaderboard */}
      {subView === 'leaderboard' && (
        <div className="space-y-6">
          {/* User's Current Scoreboard Pin Notice */}
          {userRankData && (
            <div className="rounded-2xl bg-emerald-950 text-white p-5 border border-emerald-900 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center font-bold text-xl font-mono-numbers shrink-0 shadow-inner">
                  #{userRankData.rank}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
                      Your Standing in {region.name}
                    </span>
                    <span className="text-xs text-emerald-200">· {userProfile.district}</span>
                  </div>
                  <h3 className="text-base font-bold text-white font-display">
                    {userPoints} Eco-Points Earned
                  </h3>
                  <p className="text-xs text-stone-300 mt-0.5">
                    {nextMemberAhead
                      ? `You are only ${pointsGap} points away from taking rank #${nextMemberAhead.rank} (${nextMemberAhead.name})!`
                      : 'You are currently leading the entire regional leaderboard! Keep the streak burning!'}
                  </p>
                </div>
              </div>

              <button
                onClick={onNavigateToHabits}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <span>Log Tasks to Climb</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Top 3 Podium Cards */}
          {top3.length >= 3 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Silver - 2nd place */}
              <div className="rounded-2xl border border-stone-200 bg-white p-5 text-center relative shadow-xs flex flex-col justify-between order-2 md:order-1">
                <div className="absolute top-4 left-4 flex items-center gap-1 text-stone-500 font-mono-numbers font-bold text-xs">
                  <Medal className="w-4 h-4 text-stone-400" />
                  <span>2nd Place</span>
                </div>
                <div className="pt-6">
                  <img
                    src={top3[1].avatar}
                    alt={top3[1].name}
                    className="w-16 h-16 rounded-full mx-auto object-cover ring-4 ring-stone-200"
                    referrerPolicy="no-referrer"
                  />
                  <h4 className="text-base font-bold text-stone-900 mt-3 font-display">
                    {top3[1].name}
                  </h4>
                  <div className="text-xs text-stone-500">{top3[1].district}</div>
                  <div className="text-xl font-extrabold text-stone-900 font-mono-numbers mt-2">
                    {top3[1].points} <span className="text-xs font-medium text-stone-500">pts</span>
                  </div>
                  <div className="text-xs text-emerald-700 font-mono-numbers mt-0.5">
                    -{top3[1].co2SavedKg}kg CO₂ · {top3[1].streak}d streak
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-500 italic">
                  "{top3[1].recentAction}"
                </div>
              </div>

              {/* Gold - 1st place */}
              <div className="rounded-2xl border-2 border-amber-300 bg-gradient-to-b from-amber-50/50 to-white p-6 text-center relative shadow-md flex flex-col justify-between order-1 md:order-2 md:-translate-y-2">
                <div className="absolute top-4 left-4 flex items-center gap-1 text-amber-700 font-mono-numbers font-bold text-xs bg-amber-100 rounded-full px-2 py-0.5">
                  <Trophy className="w-4 h-4 text-amber-600" />
                  <span>Champion #1</span>
                </div>
                <div className="pt-6">
                  <img
                    src={top3[0].avatar}
                    alt={top3[0].name}
                    className="w-20 h-20 rounded-full mx-auto object-cover ring-4 ring-amber-400 shadow-md"
                    referrerPolicy="no-referrer"
                  />
                  <h4 className="text-lg font-extrabold text-stone-900 mt-3 font-display">
                    {top3[0].name}
                  </h4>
                  <div className="text-xs text-stone-500">{top3[0].district}</div>
                  <div className="text-2xl font-black text-amber-900 font-mono-numbers mt-2">
                    {top3[0].points} <span className="text-xs font-semibold text-stone-600">pts</span>
                  </div>
                  <div className="text-xs text-emerald-700 font-mono-numbers mt-0.5">
                    -{top3[0].co2SavedKg}kg CO₂ · {top3[0].streak}d streak
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-amber-100 text-[11px] text-stone-600 italic">
                  "{top3[0].recentAction}"
                </div>
              </div>

              {/* Bronze - 3rd place */}
              <div className="rounded-2xl border border-stone-200 bg-white p-5 text-center relative shadow-xs flex flex-col justify-between order-3 md:order-3">
                <div className="absolute top-4 left-4 flex items-center gap-1 text-amber-900 font-mono-numbers font-bold text-xs">
                  <Medal className="w-4 h-4 text-amber-700" />
                  <span>3rd Place</span>
                </div>
                <div className="pt-6">
                  <img
                    src={top3[2].avatar}
                    alt={top3[2].name}
                    className="w-16 h-16 rounded-full mx-auto object-cover ring-4 ring-amber-200"
                    referrerPolicy="no-referrer"
                  />
                  <h4 className="text-base font-bold text-stone-900 mt-3 font-display">
                    {top3[2].name}
                  </h4>
                  <div className="text-xs text-stone-500">{top3[2].district}</div>
                  <div className="text-xl font-extrabold text-stone-900 font-mono-numbers mt-2">
                    {top3[2].points} <span className="text-xs font-medium text-stone-500">pts</span>
                  </div>
                  <div className="text-xs text-emerald-700 font-mono-numbers mt-0.5">
                    -{top3[2].co2SavedKg}kg CO₂ · {top3[2].streak}d streak
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-500 italic">
                  "{top3[2].recentAction}"
                </div>
              </div>
            </div>
          )}

          {/* Full Ranked Table */}
          <div className="rounded-3xl border border-stone-200 bg-white shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-50/70 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  Neighbor Standings & Environmental Impact
                </h3>
                <p className="text-xs text-stone-500">
                  Showing {displayedMembers.length} community members
                </p>
              </div>
            </div>

            <div className="divide-y divide-stone-100 overflow-x-auto">
              {displayedMembers.map((member) => {
                const isUser = member.isCurrentUser;
                return (
                  <div
                    key={member.id}
                    className={`p-4 sm:px-6 flex items-center justify-between gap-4 transition-colors ${
                      isUser
                        ? 'bg-emerald-50/80 hover:bg-emerald-50'
                        : 'hover:bg-stone-50/80'
                    }`}
                  >
                    {/* Rank & User Info */}
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                      <div className="w-8 text-center font-mono-numbers font-bold text-sm text-stone-600 shrink-0">
                        #{member.rank}
                      </div>

                      <div className="relative shrink-0">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover border border-stone-200"
                          referrerPolicy="no-referrer"
                        />
                        {member.rank <= 3 && (
                          <span className="absolute -top-1 -right-1 text-xs">
                            {member.rank === 1 ? '🥇' : member.rank === 2 ? '🥈' : '🥉'}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-semibold truncate ${
                              isUser ? 'text-emerald-950 font-bold' : 'text-stone-900'
                            }`}
                          >
                            {member.name}
                          </span>
                          {isUser && (
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-200/70 px-1.5 py-0.2 rounded">
                              YOU
                            </span>
                          )}
                        </div>

                        {/* Unboxed metadata line with typographic bullets */}
                        <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-500 mt-0.5">
                          <span>{member.district}</span>
                          <span aria-hidden="true">·</span>
                          <span className="flex items-center gap-0.5 text-orange-600 font-mono-numbers">
                            <Flame className="w-3 h-3" />
                            {member.streak}d
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="flex items-center gap-0.5 text-stone-600">
                            <Award className="w-3 h-3 text-amber-600" />
                            {member.badgesCount} badges
                          </span>
                        </div>

                        {/* Recent action snippet */}
                        <div className="text-[11px] text-stone-500 truncate mt-1">
                          Action: {member.recentAction}
                        </div>
                      </div>
                    </div>

                    {/* Stats & Kudos */}
                    <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                      <div className="text-right hidden sm:block">
                        <div className="text-xs text-stone-500">CO₂ Avoided</div>
                        <div className="text-sm font-bold text-emerald-700 font-mono-numbers">
                          -{member.co2SavedKg} kg
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs text-stone-500">Score</div>
                        <div className="text-base sm:text-lg font-extrabold text-stone-900 font-mono-numbers">
                          {member.points}
                        </div>
                      </div>

                      {/* Kudos Interaction */}
                      {!isUser ? (
                        <button
                          onClick={() => onGiveKudos(member.id)}
                          title="Send kudos to this neighbor"
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-stone-200 hover:border-emerald-300 hover:bg-emerald-50 text-stone-600 hover:text-emerald-700 text-xs font-medium transition-colors"
                        >
                          <Heart className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="font-mono-numbers">{member.kudosCount}</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-100/60 text-emerald-800 text-xs font-semibold">
                          <Heart className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                          <span className="font-mono-numbers">{member.kudosCount}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Sub-View: Map */}
      {subView === 'map' && (
        <RegionalMapView
          region={region}
          members={rankedList}
          userDistrict={userProfile.district}
        />
      )}

      {/* Sub-View: Live Activity Feed */}
      {subView === 'activity' && (
        <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-stone-200">
            <div>
              <h3 className="text-base font-bold text-stone-900 font-display flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>Live Community Actions</span>
              </h3>
              <p className="text-xs text-stone-500">
                Recent sustainable habits logged across {region.name}
              </p>
            </div>
            <span className="text-xs text-emerald-700 font-medium">
              Updating dynamically
            </span>
          </div>

          <div className="space-y-3">
            {rankedList.map((m, i) => (
              <div
                key={m.id}
                className="flex items-start justify-between gap-4 p-3.5 rounded-2xl bg-stone-50/70 border border-stone-100 hover:bg-stone-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={m.avatar}
                    alt={m.name}
                    className="w-9 h-9 rounded-full object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="text-xs text-stone-900">
                      <strong className="font-semibold">{m.name}</strong> ({m.district})
                    </div>
                    <div className="text-xs font-medium text-emerald-800 mt-0.5">
                      Completed: "{m.recentAction}"
                    </div>
                    <div className="text-[11px] text-stone-400 mt-1">
                      {m.recentActionTime || `${i * 15 + 8}m ago`}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-emerald-700 font-mono-numbers bg-emerald-100/60 px-2 py-0.5 rounded-md">
                    +{Math.floor(m.points / 10)} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
