import React, { useState } from 'react';
import { UserProfile, Region, HabitCategory } from '../types';
import { AVATAR_PRESETS } from '../data/initialData';
import {
  Sparkles,
  MapPin,
  Check,
  User,
  Shield,
  Leaf,
  Bike,
  Salad,
  PowerOff,
  Droplets,
  Recycle,
  Upload,
} from 'lucide-react';

interface RegistrationModalProps {
  isOpen: boolean;
  regions: Region[];
  onRegister: (profile: UserProfile, bonusPoints: number) => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  regions,
  onRegister,
}) => {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PRESETS[0]);
  const [selectedRegionId, setSelectedRegionId] = useState(regions[0].id);
  const [selectedDistrict, setSelectedDistrict] = useState(regions[0].districts[0]);
  const [customDistrict, setCustomDistrict] = useState('');
  const [bio, setBio] = useState('Committed to daily sustainable living and neighborhood regeneration.');
  const [selectedFocus, setSelectedFocus] = useState<HabitCategory[]>(['transit', 'diet', 'circular']);
  const [customAvatarPreview, setCustomAvatarPreview] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentRegion = regions.find((r) => r.id === selectedRegionId) || regions[0];

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCustomAvatarPreview(result);
        setSelectedAvatar(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleFocus = (cat: HabitCategory) => {
    if (selectedFocus.includes(cat)) {
      if (selectedFocus.length > 1) {
        setSelectedFocus(selectedFocus.filter((c) => c !== cat));
      }
    } else {
      setSelectedFocus([...selectedFocus, cat]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalDistrict = customDistrict.trim() || selectedDistrict;

    const newProfile: UserProfile = {
      name: name.trim(),
      district: finalDistrict,
      regionId: selectedRegionId,
      avatar: selectedAvatar,
      joinDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      bio: bio.trim(),
      isRegistered: true,
      ecoFocus: selectedFocus,
    };

    onRegister(newProfile, 50); // 50 Welcome bonus points!
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative max-h-[92vh] overflow-y-auto">
        {/* Welcome Banner */}
        <div className="text-center pb-5 border-b border-stone-100">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center text-2xl shadow-md mb-3">
            🌱
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Welcome to F.O.E(FRIENDS OF ENVIROMENT)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display">
            Create Your Eco-Citizen Profile
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-md mx-auto leading-relaxed">
            Register your sustainability passport, connect with nearby neighbors, upload task proofs, and earn community badges.
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1 text-xs font-semibold text-emerald-900">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>+50 Welcome Points Awarded on Registration</span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1">
              Your Name / Eco-Handle *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Sunita Devi, Maya P., or EcoNeighbor"
                className="w-full text-sm p-3 pl-10 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-stone-900 bg-stone-50/50"
              />
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1.5">
              Choose Profile Avatar
            </label>
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
              {AVATAR_PRESETS.map((av, idx) => {
                const isSelected = selectedAvatar === av;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedAvatar(av);
                      setCustomAvatarPreview(null);
                    }}
                    className={`relative rounded-full p-0.5 transition-all shrink-0 ${
                      isSelected
                        ? 'ring-4 ring-emerald-500 scale-105'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={av}
                      alt={`Avatar option ${idx + 1}`}
                      className="w-12 h-12 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {isSelected && (
                      <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-600 text-white rounded-full flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Upload custom photo option */}
              <label
                className="w-12 h-12 rounded-full border-2 border-dashed border-stone-300 hover:border-emerald-600 flex flex-col items-center justify-center cursor-pointer text-stone-400 hover:text-emerald-700 bg-stone-50 shrink-0 transition-colors"
                title="Upload custom profile photo"
              >
                <Upload className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Regional League & District */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Regional Community
              </label>
              <select
                value={selectedRegionId}
                onChange={(e) => {
                  const regId = e.target.value;
                  setSelectedRegionId(regId);
                  const reg = regions.find((r) => r.id === regId) || regions[0];
                  setSelectedDistrict(reg.districts[0]);
                }}
                className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 outline-none text-stone-900 bg-stone-50"
              >
                {regions.map((reg) => (
                  <option key={reg.id} value={reg.id}>
                    {reg.name} ({reg.country})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Local District / Neighborhood
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => {
                  setSelectedDistrict(e.target.value);
                  setCustomDistrict('');
                }}
                className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 outline-none text-stone-900 bg-stone-50"
              >
                {currentRegion.districts.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Custom District Input */}
          <div>
            <label className="block text-[11px] font-medium text-stone-500 mb-1">
              Or write your specific neighborhood / avenue:
            </label>
            <input
              type="text"
              value={customDistrict}
              onChange={(e) => setCustomDistrict(e.target.value)}
              placeholder="e.g., Maplewood Greenways"
              className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 outline-none text-stone-900 bg-stone-50/50"
            />
          </div>

          {/* Primary Eco Focus Areas */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1.5">
              Primary Sustainable Priorities
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'transit', label: 'Clean Mobility', icon: Bike },
                { id: 'diet', label: 'Plant-Based Diet', icon: Salad },
                { id: 'energy', label: 'Energy Thrift', icon: PowerOff },
                { id: 'water', label: 'Water Conservation', icon: Droplets },
                { id: 'circular', label: 'Zero Waste & Circular', icon: Recycle },
              ].map((item) => {
                const isSelected = selectedFocus.includes(item.id as HabitCategory);
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleFocus(item.id as HabitCategory)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-semibold'
                        : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Green Pledge / Bio */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1">
              Personal Green Pledge / Bio (optional)
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={2}
              maxLength={150}
              className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 outline-none text-stone-900 bg-stone-50/50 resize-none"
            />
          </div>

          {/* Submit Registration */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-5 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5 stroke-[2.5]" />
              <span>Join Regional League & Claim +50 Pts</span>
            </button>
            <p className="text-[11px] text-stone-400 text-center mt-2">
              Your profile is stored locally on this device. No account credentials required.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
