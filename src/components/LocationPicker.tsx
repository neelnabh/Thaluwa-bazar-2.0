'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ASSAM_LOCATIONS, GeoLocation } from '@/lib/geo';
import { MapPin, Navigation, Sliders, Check } from 'lucide-react';

export default function LocationPicker({ inline = false }: { inline?: boolean }) {
  const { lang, currentLocation, setCurrentLocation, radiusKm, setRadiusKm, t } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (loc: GeoLocation) => {
    setCurrentLocation(loc);
    setIsOpen(false);
  };

  if (inline) {
    return (
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-600" />
            {t('select_location')}
          </label>
          <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
            {lang === 'as' ? currentLocation.name_as : currentLocation.name}
          </span>
        </div>

        <select
          value={currentLocation.name}
          onChange={(e) => {
            const found = ASSAM_LOCATIONS.find(l => l.name === e.target.value);
            if (found) setCurrentLocation(found);
          }}
          aria-label={t('select_location')}
          className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        >
          {ASSAM_LOCATIONS.map((loc) => (
            <option key={loc.name} value={loc.name}>
              {lang === 'as' ? loc.name_as : loc.name} ({loc.district})
            </option>
          ))}
        </select>

        <div>
          <div className="flex justify-between text-xs font-medium text-slate-600 mb-1.5">
            <span>{t('search_radius')}:</span>
            <span className="font-bold text-emerald-600">{radiusKm} km</span>
          </div>
          <input
            type="range"
            min="1"
            max="25"
            step="1"
            value={radiusKm}
            onChange={(e) => setRadiusKm(Number(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>1 km (Local Basti)</span>
            <span>5 km (MVP Default)</span>
            <span>25 km (District)</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shadow-sm"
      >
        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span className="truncate max-w-[130px] sm:max-w-[180px]">
          {lang === 'as' ? currentLocation.name_as : currentLocation.name}
        </span>
        <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
          {radiusKm}km
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 sm:left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
              <Navigation className="w-4 h-4 text-emerald-600" />
              {t('select_location')}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 text-xs font-bold px-1"
            >
              ✕
            </button>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>{t('search_radius')}:</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                {radiusKm} km
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="25"
              step="1"
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              {t('within_radius', { radius: radiusKm })}
            </p>
          </div>

          <div className="text-xs font-semibold text-slate-500 mb-2">
            Assam Localities & Markets:
          </div>

          <div className="max-h-56 overflow-y-auto space-y-1 pr-1">
            {ASSAM_LOCATIONS.map((loc) => {
              const isSelected = currentLocation.name === loc.name;
              return (
                <button
                  key={loc.name}
                  onClick={() => handleSelect(loc)}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-emerald-600 text-white font-medium shadow-sm'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-semibold">{lang === 'as' ? loc.name_as : loc.name}</div>
                    <div className={`text-[10px] ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                      {loc.district}
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
