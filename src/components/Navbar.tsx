'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import LocationPicker from './LocationPicker';
import { 
  ShoppingBag, 
  Store, 
  PlusCircle, 
  ShieldAlert, 
  FileText, 
  CheckCircle, 
  Search,
  Sparkles,
  Lock
} from 'lucide-react';

export default function Navbar() {
  const { lang, t, currentUser } = useApp();
  const pathname = usePathname();

  const isSeller = currentUser.role === 'seller';
  const isAdmin = currentUser.role === 'admin' || currentUser.role === 'moderator';

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-[33px] z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <span className="text-xl">থ</span>
            </div>
            <div>
              <div className="font-extrabold text-lg text-slate-900 leading-none tracking-tight flex items-center gap-1.5">
                {t('app_title')}
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                  অসম
                </span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">
                {t('app_tagline')}
              </div>
            </div>
          </Link>

          {/* Center: Location Filter */}
          <div className="hidden md:flex items-center gap-2">
            <LocationPicker />
          </div>

          {/* Right Navigation */}
          <nav className="flex items-center gap-1.5 sm:gap-3">
            <Link
              href="/browse"
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                pathname === '/browse'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Search className="w-4 h-4 text-emerald-600" />
              <span>{t('nav_browse')}</span>
            </Link>

            {/* Buyer Dashboard */}
            <Link
              href="/buyer/dashboard"
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                pathname === '/buyer/dashboard'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">{t('nav_buyer_dashboard')}</span>
            </Link>

            {/* Seller Hub */}
            <Link
              href="/seller/dashboard"
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                pathname.startsWith('/seller/dashboard')
                  ? 'bg-amber-50 text-amber-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Store className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline">{t('nav_seller_dashboard')}</span>
            </Link>

            {/* Sell Button */}
            <Link
              href="/seller/create"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-sm shadow-emerald-600/30 flex items-center gap-1.5 transition-all hover:shadow"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('nav_sell')}</span>
            </Link>

            {/* Admin / Moderation Tab if Admin role */}
            {isAdmin && (
              <Link
                href="/admin"
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 border ${
                  pathname === '/admin'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                <span className="hidden md:inline">{t('nav_admin')}</span>
              </Link>
            )}

            {/* Safety & Guidelines */}
            <Link
              href="/safety"
              title={t('nav_safety')}
              className="text-slate-400 hover:text-emerald-700 p-2 rounded-lg hover:bg-slate-50"
            >
              <Lock className="w-4 h-4" />
            </Link>
          </nav>
        </div>
      </div>
      <div className="h-0.5 bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500" />
    </header>
  );
}
