'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ShieldCheck, MapPin, Heart, Sparkles, Lock } from 'lucide-react';

export default function Footer() {
  const { t, lang } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                থ
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                {t('app_title')}
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              {t('app_subtitle')}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-950 text-emerald-300 border border-emerald-800/80 px-2.5 py-1 rounded-full font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                {t('asvs_badge')}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-1 rounded-full">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                Assam Hyperlocal ~5km Loop
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              {lang === 'as' ? 'শীঘ্ৰ সংযোগ' : 'Explore'}
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/browse" className="hover:text-emerald-400 transition-colors">
                  {t('nav_browse')}
                </Link>
              </li>
              <li>
                <Link href="/seller/create" className="hover:text-emerald-400 transition-colors">
                  {t('nav_sell')}
                </Link>
              </li>
              <li>
                <Link href="/buyer/dashboard" className="hover:text-emerald-400 transition-colors">
                  {t('nav_buyer_dashboard')}
                </Link>
              </li>
              <li>
                <Link href="/seller/dashboard" className="hover:text-emerald-400 transition-colors">
                  {t('nav_seller_dashboard')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Security & Safety */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              {lang === 'as' ? 'সুৰক্ষা আৰু নিয়ম' : 'Security & Rules'}
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/safety" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  {t('nav_safety')}
                </Link>
              </li>
              <li>
                <Link href="/safety#privacy" className="hover:text-emerald-400 transition-colors">
                  {lang === 'as' ? 'নম্বৰ গোপনীয়তা নীতি' : 'Contact Privacy Flow'}
                </Link>
              </li>
              <li>
                <Link href="/safety#moderation" className="hover:text-emerald-400 transition-colors">
                  {lang === 'as' ? 'অভিযোগ আৰু নিৰীক্ষণ' : 'Reporting & Moderation'}
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © 2026 Thaluwa Bazar (থলুৱা বজাৰ). All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            Built with care for the local producers of Assam.
          </div>
        </div>
      </div>
    </footer>
  );
}
