import React, { useState } from 'react';
import { Region, UserProfile } from '../types';
import { X, MapPin, Check, Globe, Sparkles } from 'lucide-react';

interface ChangeRegionModalProps {
  isOpen: boolean;
  onClose: () => void;
  regions: Region[];
  currentRegion: Region;
  userProfile: UserProfile;
  onSelectRegionAndDistrict: (regionId: string, district: string) => void;
}

export const ChangeRegionModal: React.FC<ChangeRegionModalProps> = ({
  isOpen,
  onClose,
  regions,
  currentRegion,
  userProfile,
  onSelectRegionAndDistrict,
}) => {
  const [selectedRegionId, setSelectedRegionId] = useState(currentRegion.id);
  const [selectedDistrict, setSelectedDistrict] = useState(userProfile.district);
  const [customDistrictInput, setCustomDistrictInput] = useState('');

  if (!isOpen) return null;

  const targetRegion = regions.find((r) => r.id === selectedRegionId) || currentRegion;

  const handleSave = () => {
    const finalDistrict = customDistrictInput.trim() || selectedDistrict;
    onSelectRegionAndDistrict(selectedRegionId, finalDistrict);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-xl border border-stone-200 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="pr-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>Community Location</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">
            Select Your Regional League
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Compare your sustainable habits and earn badges with your local neighborhood and climate district.
          </p>
        </div>

        {/* Regions Selection Cards */}
        <div className="mt-6 space-y-2.5">
          <label className="block text-xs font-semibold text-stone-700">
            Available Regions
          </label>
          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {regions.map((reg) => {
              const isSelected = reg.id === selectedRegionId;
              return (
                <button
                  key={reg.id}
                  onClick={() => {
                    setSelectedRegionId(reg.id);
                    setSelectedDistrict(reg.districts[0]);
                  }}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-emerald-50/70 border-emerald-600 ring-2 ring-emerald-200 shadow-xs'
                      : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-stone-900">
                        {reg.name}
                      </span>
                      <span className="text-[11px] text-stone-500 font-normal">
                        · {reg.country}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 mt-0.5 line-clamp-1">
                      {reg.tagline}
                    </p>
                    <div className="text-[11px] text-emerald-800 font-medium mt-1">
                      {reg.totalActiveMembers.toLocaleString()} active neighbors ·{' '}
                      {reg.districts.length} districts
                    </div>
                  </div>

                  <div className="pt-0.5">
                    {isSelected ? (
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-stone-300" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Districts for Selected Region */}
        <div className="mt-5 space-y-2.5">
          <label className="block text-xs font-semibold text-stone-700">
            Select District in {targetRegion.name}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {targetRegion.districts.map((dist) => {
              const isSelected = selectedDistrict === dist && !customDistrictInput;
              return (
                <button
                  key={dist}
                  onClick={() => {
                    setSelectedDistrict(dist);
                    setCustomDistrictInput('');
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-medium transition-all text-left truncate ${
                    isSelected
                      ? 'bg-stone-900 text-white border-stone-900 font-semibold shadow-xs'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-stone-300'
                  }`}
                >
                  {dist}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom District Option */}
        <div className="mt-4 pt-3 border-t border-stone-200">
          <label className="block text-xs font-medium text-stone-700 mb-1">
            Or type your exact local neighborhood / street:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={customDistrictInput}
              onChange={(e) => setCustomDistrictInput(e.target.value)}
              placeholder="e.g., South Oak Greenway"
              className="flex-1 text-xs sm:text-sm p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 outline-none text-stone-900"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-3 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-2.5 px-4 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Join Regional League</span>
          </button>
        </div>
      </div>
    </div>
  );
};
