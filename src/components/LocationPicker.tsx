'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { ASSAM_LOCATIONS, GeoLocation } from '@/lib/geo';
import { MapPin, Navigation, Check, Search, X, Compass, CheckCircle2, Sliders } from 'lucide-react';

export default function LocationPicker({ inline = false }: { inline?: boolean }) {
  const { lang, currentLocation, setCurrentLocation, radiusKm, setRadiusKm, t } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSelect = (loc: GeoLocation) => {
    setCurrentLocation(loc);
    setIsOpen(false);
  };

  const filteredLocations = ASSAM_LOCATIONS.filter((loc) => {
    const q = searchTerm.toLowerCase();
    return (
      loc.name.toLowerCase().includes(q) ||
      loc.name_as.toLowerCase().includes(q) ||
      loc.district.toLowerCase().includes(q)
    );
  });

  if (inline) {
    return (
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-elevation-medium space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-600" />
            {t('select_location')}
          </label>
          <span className="text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-3 py-1 rounded-full font-black border border-emerald-300 dark:border-emerald-800">
            {lang === 'as' ? currentLocation.name_as : currentLocation.name}
          </span>
        </div>

        <select
          value={currentLocation.name}
          onChange={(e) => {
            const found = ASSAM_LOCATIONS.find((l) => l.name === e.target.value);
            if (found) setCurrentLocation(found);
          }}
          aria-label={t('select_location')}
          className="w-full text-xs font-bold bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        >
          {ASSAM_LOCATIONS.map((loc) => (
            <option key={loc.name} value={loc.name}>
              {lang === 'as' ? loc.name_as : loc.name} ({loc.district})
            </option>
          ))}
        </select>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>{t('search_radius')}:</span>
            <span className="font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
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
            className="w-full accent-emerald-600 cursor-pointer h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-bold">
            <span>1 km (Chuburi)</span>
            <span>5 km (Standard Haat)</span>
            <span>25 km (District)</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 dark:from-emerald-950/80 dark:to-teal-950/80 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700/60 px-4 py-2.5 rounded-2xl text-xs font-black transition-all shadow-sm group"
      >
        <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 group-hover:animate-bounce" />
        <span className="truncate max-w-[140px] sm:max-w-[200px]">
          {lang === 'as' ? currentLocation.name_as : currentLocation.name}
        </span>
        <span className="bg-emerald-600 text-white text-[10px] px-2.5 py-0.5 rounded-full font-black shadow-sm">
          {radiusKm}km
        </span>
      </motion.button>

      {/* Fullscreen Portal Modal - Completely Immune to Stacking Contexts */}
      {mounted && isOpen && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Frosted Dark Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative z-10 w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.5)] border border-slate-200 dark:border-slate-800 p-6 sm:p-7 text-slate-900 dark:text-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/30">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900 dark:text-white leading-tight">
                    {t('select_location')}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Select your nearest Assam market to calculate live distances
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-9 h-9 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition-colors text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Quick Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Assam haats (e.g. Beltola, Jorhat, Uzanbazar, Tezpur...)"
                className="w-full text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl pl-10 pr-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold placeholder-slate-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 px-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Radius Slider Card */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-emerald-950/40 dark:to-slate-800/60 p-4 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-black text-emerald-900 dark:text-emerald-200">
                  <Compass className="w-4 h-4 text-amber-500" />
                  <span>Discovery Radius:</span>
                </span>
                <span className="bg-emerald-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-sm">
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
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-emerald-200 dark:bg-emerald-950 rounded-lg appearance-none"
              />

              <div className="flex items-center justify-between gap-1 text-[10px] font-extrabold text-emerald-800 dark:text-emerald-300">
                <button
                  type="button"
                  onClick={() => setRadiusKm(3)}
                  className={`px-2 py-0.5 rounded-md ${radiusKm === 3 ? 'bg-emerald-700 text-white' : 'bg-emerald-100 dark:bg-emerald-900/60'}`}
                >
                  3 km (Chuburi)
                </button>
                <button
                  type="button"
                  onClick={() => setRadiusKm(5)}
                  className={`px-2 py-0.5 rounded-md ${radiusKm === 5 ? 'bg-emerald-700 text-white' : 'bg-emerald-100 dark:bg-emerald-900/60'}`}
                >
                  5 km (Standard Haat)
                </button>
                <button
                  type="button"
                  onClick={() => setRadiusKm(10)}
                  className={`px-2 py-0.5 rounded-md ${radiusKm === 10 ? 'bg-emerald-700 text-white' : 'bg-emerald-100 dark:bg-emerald-900/60'}`}
                >
                  10 km (Town)
                </button>
                <button
                  type="button"
                  onClick={() => setRadiusKm(20)}
                  className={`px-2 py-0.5 rounded-md ${radiusKm === 20 ? 'bg-emerald-700 text-white' : 'bg-emerald-100 dark:bg-emerald-900/60'}`}
                >
                  20 km (District)
                </button>
              </div>
            </div>

            {/* List of Assam Haats */}
            <div className="space-y-2">
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Assam Haats & Localities ({filteredLocations.length}):</span>
                <span className="text-emerald-600 dark:text-emerald-400 lowercase font-medium">click to activate</span>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                {filteredLocations.map((loc) => {
                  const isSelected = currentLocation.name === loc.name;
                  return (
                    <button
                      key={loc.name}
                      type="button"
                      onClick={() => handleSelect(loc)}
                      className={`w-full text-left px-4 py-3 rounded-2xl text-xs flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-emerald-600 text-white font-black shadow-lg shadow-emerald-600/30 scale-[1.01]'
                          : 'bg-slate-50 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/60'
                      }`}
                    >
                      <div>
                        <div className="font-black text-sm flex items-center gap-1.5">
                          <span>{lang === 'as' ? loc.name_as : loc.name}</span>
                          {isSelected && (
                            <span className="bg-emerald-700 text-white text-[9px] uppercase px-1.5 py-0.2 rounded font-bold">
                              active
                            </span>
                          )}
                        </div>
                        <div className={`text-[11px] mt-0.5 ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                          {loc.district} • GPS: {loc.lat.toFixed(3)}°N, {loc.lng.toFixed(3)}°E
                        </div>
                      </div>
                      {isSelected ? (
                        <CheckCircle2 className="w-5 h-5 shrink-0 text-white" />
                      ) : (
                        <MapPin className="w-4 h-4 shrink-0 text-slate-300 dark:text-slate-600" />
                      )}
                    </button>
                  );
                })}

                {filteredLocations.length === 0 && (
                  <div className="text-center py-8 text-xs text-slate-400 font-medium">
                    No Assam markets found matching "{searchTerm}".
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}
    </>
  );
}
