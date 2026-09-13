'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types';
import { ShieldCheck, UserCheck, Store, RefreshCw, Globe, ChevronDown } from 'lucide-react';

export default function DemoSwitcher() {
  const { lang, setLang, currentUser, switchUserRole, t } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  const roles: { role: UserRole; label: string; icon: React.ReactNode; desc: string }[] = [
    { role: 'buyer', label: 'Buyer (অনুপম দাস)', icon: <UserCheck className="w-4 h-4 text-emerald-600" />, desc: 'Browse nearby, unlock contact, order local produce' },
    { role: 'seller', label: 'Seller (ৰমেন বৰা - ফাৰ্ম)', icon: <Store className="w-4 h-4 text-amber-600" />, desc: 'Manage listings, process orders, availability' },
    { role: 'moderator', label: 'Moderator (নিয়ন্ত্ৰক)', icon: <ShieldCheck className="w-4 h-4 text-blue-600" />, desc: 'Review user reports & flagged listings' },
    { role: 'admin', label: 'Super Admin (প্ৰশাসক)', icon: <ShieldCheck className="w-4 h-4 text-rose-600" />, desc: 'Audit logs, fee configurations, user management' },
  ];

  const handleReset = async () => {
    if (!confirm("Reset demo database back to fresh default state?")) return;
    setResetting(true);
    try {
      await fetch('/api/demo/reset', { method: 'POST' });
      window.location.reload();
    } catch (e) {
      console.error(e);
      alert("Failed to reset database");
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="bg-slate-900 text-slate-100 text-xs py-1.5 px-4 sticky top-0 z-50 shadow-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        
        {/* Left: Interactive Role Switcher */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-emerald-400 flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {t('demo_role_switcher')}
          </span>
          
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-slate-800 hover:bg-slate-700 text-white font-medium px-2.5 py-1 rounded-md border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <span className="capitalize font-bold text-emerald-300">{currentUser.role}</span>: {currentUser.name}
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {isOpen && (
              <div className="absolute left-0 mt-1 w-72 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl py-1 z-50 text-slate-200">
                <div className="px-3 py-1.5 border-b border-slate-800 text-[11px] text-slate-400 font-semibold">
                  Switch Active Role (Instant Demo Mode):
                </div>
                {roles.map(r => (
                  <button
                    key={r.role}
                    onClick={() => {
                      switchUserRole(r.role);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-start gap-2.5 hover:bg-slate-800 transition-colors ${
                      currentUser.role === r.role ? 'bg-slate-800/80 border-l-2 border-emerald-500 font-semibold text-white' : ''
                    }`}
                  >
                    <div className="mt-0.5">{r.icon}</div>
                    <div>
                      <div className="text-xs">{r.label}</div>
                      <div className="text-[10px] text-slate-400 leading-tight">{r.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Language switch & Reset */}
        <div className="flex items-center gap-3">
          {/* Dual Language Switcher */}
          <div className="flex items-center bg-slate-800 rounded-md p-0.5 border border-slate-700">
            <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
            <button
              onClick={() => setLang('as')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors ${
                lang === 'as' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              অসমীয়া
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors ${
                lang === 'en' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              English
            </button>
          </div>

          {/* Reset Demo DB */}
          <button
            onClick={handleReset}
            disabled={resetting}
            title="Reset DB to fresh seed data"
            className="flex items-center gap-1 text-slate-400 hover:text-rose-400 bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3 h-3 ${resetting ? 'animate-spin' : ''}`} />
            <span>Reset Demo DB</span>
          </button>
        </div>

      </div>
    </div>
  );
}
