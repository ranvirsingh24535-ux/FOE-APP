import React, { useState } from 'react';
import { Region, CommunityMember } from '../types';
import { MapPin, Sun, TreePine, Bike, Recycle, Users, Sparkles, Navigation } from 'lucide-react';

interface RegionalMapViewProps {
  region: Region;
  members: CommunityMember[];
  userDistrict: string;
}

interface MapHotspot {
  id: string;
  name: string;
  category: 'solar' | 'park' | 'cycle' | 'depot';
  coords: { x: number; y: number }; // percentage
  district: string;
  metric: string;
  details: string;
}

export const RegionalMapView: React.FC<RegionalMapViewProps> = ({
  region,
  members,
  userDistrict,
}) => {
  const [selectedHotspot, setSelectedHotspot] = useState<MapHotspot | null>(null);
  const [selectedMember, setSelectedMember] = useState<CommunityMember | null>(null);

  const hotspots: MapHotspot[] = [
    {
      id: 'hotspot-1',
      name: 'Cascadia Central Eco-Park',
      category: 'park',
      coords: { x: 50, y: 50 },
      district: 'Evergreen Heights',
      metric: '450 native trees & bioswales',
      details: 'Restored community urban wetland absorbing stormwater runoff and providing shaded bird habitats.',
    },
    {
      id: 'hotspot-2',
      name: 'Greenway Protected Cycle Highway',
      category: 'cycle',
      coords: { x: 70, y: 24 },
      district: 'Stumptown Greenways',
      metric: '18,400 zero-emission trips this month',
      details: 'Dedicated two-way solar-lit cycling and e-bike path connecting neighborhoods to transit centers.',
    },
    {
      id: 'hotspot-3',
      name: 'Community Solar Rooftop Co-op',
      category: 'solar',
      coords: { x: 26, y: 32 },
      district: 'Rainier Basin',
      metric: '142 kW clean peak generation',
      details: 'Shared microgrid solar array powering 45 adjacent low-emission households with zero grid reliance.',
    },
    {
      id: 'hotspot-4',
      name: 'District Circular Depot & Tool Library',
      category: 'depot',
      coords: { x: 86, y: 48 },
      district: 'Puget Eco-Corridor',
      metric: '3,800 kg goods diverted from landfills',
      details: 'Neighborhood tool lending library, packaging drop-off, and electronic repair cafe open weekends.',
    },
    {
      id: 'hotspot-5',
      name: 'Riverside Permaculture Greenhouse',
      category: 'park',
      coords: { x: 44, y: 84 },
      district: 'Cedar Valley',
      metric: '850 kg seasonal food harvested',
      details: 'Rainwater-fed community greenhouse distributing free herbs and leafy greens to neighbors.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-stone-900 font-display flex items-center gap-2">
            <Navigation className="w-5 h-5 text-emerald-600" />
            <span>Interactive Eco-District Map</span>
          </h3>
          <p className="text-xs text-stone-500">
            Explore community green assets, solar rooftops, cycling routes, and nearby members across {region.name}.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-stone-600">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Active Green Infrastructure</span>
        </div>
      </div>

      {/* Map Canvas Container */}
      <div className="relative rounded-3xl overflow-hidden border border-stone-200 bg-stone-100 shadow-sm aspect-[4/3] sm:aspect-[16/9]">
        {/* Stylized Generated Map Image */}
        <img
          src="/src/assets/images/eco_community_map_1793848389256.jpg"
          alt="Stylized isometric sustainable eco-district cartography"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />

        {/* Overlay Hotspot Pins */}
        {hotspots.map((h) => {
          const isSelected = selectedHotspot?.id === h.id;
          return (
            <button
              key={h.id}
              onClick={() => {
                setSelectedHotspot(h);
                setSelectedMember(null);
              }}
              style={{ left: `${h.coords.x}%`, top: `${h.coords.y}%` }}
              title={h.name}
              className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full transition-all group z-20 ${
                isSelected
                  ? 'bg-emerald-600 text-white scale-125 shadow-lg ring-4 ring-emerald-300'
                  : 'bg-white/95 text-stone-800 shadow-md hover:scale-110 hover:bg-emerald-50'
              }`}
            >
              {h.category === 'solar' && <Sun className="w-4 h-4 text-amber-500" />}
              {h.category === 'park' && <TreePine className="w-4 h-4 text-emerald-600" />}
              {h.category === 'cycle' && <Bike className="w-4 h-4 text-sky-600" />}
              {h.category === 'depot' && <Recycle className="w-4 h-4 text-teal-600" />}
            </button>
          );
        })}

        {/* Overlay Neighbor Pins */}
        {members.slice(0, 8).map((mem) => {
          const isSelected = selectedMember?.id === mem.id;
          return (
            <button
              key={mem.id}
              onClick={() => {
                setSelectedMember(mem);
                setSelectedHotspot(null);
              }}
              style={{ left: `${mem.coordinates.x}%`, top: `${mem.coordinates.y}%` }}
              title={`${mem.name} (${mem.district})`}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-all z-20 ${
                isSelected
                  ? 'border-emerald-500 ring-4 ring-emerald-200 scale-125 shadow-lg'
                  : 'border-white shadow-md hover:scale-115'
              }`}
            >
              <img
                src={mem.avatar}
                alt={mem.name}
                className="w-7 h-7 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center font-mono-numbers">
                #{mem.rank}
              </span>
            </button>
          );
        })}

        {/* Bottom Floating Info Drawer */}
        {(selectedHotspot || selectedMember) && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-stone-200 shadow-xl z-30 animate-in fade-in slide-in-from-bottom-2 duration-200">
            {selectedHotspot && (
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                    {selectedHotspot.district}
                  </span>
                  <button
                    onClick={() => setSelectedHotspot(null)}
                    className="text-stone-400 hover:text-stone-700 text-xs font-semibold px-1"
                  >
                    Close
                  </button>
                </div>
                <h4 className="text-sm font-bold text-stone-900 font-display">
                  {selectedHotspot.name}
                </h4>
                <div className="text-xs font-medium text-emerald-800 mt-1 font-mono-numbers bg-emerald-50 rounded-lg px-2 py-1 inline-block">
                  {selectedHotspot.metric}
                </div>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  {selectedHotspot.details}
                </p>
              </div>
            )}

            {selectedMember && (
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={selectedMember.avatar}
                      alt={selectedMember.name}
                      className="w-8 h-8 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="text-xs font-bold text-stone-900">{selectedMember.name}</div>
                      <div className="text-[10px] text-stone-500">{selectedMember.district}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedMember(null)}
                    className="text-stone-400 hover:text-stone-700 text-xs font-semibold px-1"
                  >
                    Close
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center text-xs p-2 rounded-xl bg-stone-50 border border-stone-100">
                  <div>
                    <span className="text-[10px] text-stone-400 block">Rank</span>
                    <span className="font-bold text-stone-800 font-mono-numbers">
                      #{selectedMember.rank}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block">Points</span>
                    <span className="font-bold text-emerald-700 font-mono-numbers">
                      {selectedMember.points} pts
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-[11px] text-stone-600 italic">
                  "{selectedMember.recentAction}"
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Map Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 p-3 bg-stone-50 rounded-2xl border border-stone-200">
        <span className="font-semibold text-stone-700">Map Legend:</span>
        <div className="flex items-center gap-1.5">
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <span>Solar Rooftops</span>
        </div>
        <div className="flex items-center gap-1.5">
          <TreePine className="w-3.5 h-3.5 text-emerald-600" />
          <span>Eco-Parks & Gardens</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Bike className="w-3.5 h-3.5 text-sky-600" />
          <span>Protected Cycle Ways</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Recycle className="w-3.5 h-3.5 text-teal-600" />
          <span>Recycling & Repair Depots</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-purple-600" />
          <span>Community Members</span>
        </div>
      </div>
    </div>
  );
};
