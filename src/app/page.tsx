'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { Product, Category } from '@/types';
import ProductCard from '@/components/ProductCard';
import LocationPicker from '@/components/LocationPicker';
import { 
  Search, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Store, 
  SlidersHorizontal,
  Compass,
  Zap,
  Users,
  Coins,
  Flame,
  Star,
  Quote,
  Clock,
  CheckCircle2,
  HeartHandshake
} from 'lucide-react';

export default function HomePage() {
  const { lang, t, currentLocation, radiusKm, setRadiusKm, currentUser } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [cartCount, setCartCount] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'distance' | 'price_low' | 'fresh'>('distance');

  useEffect(() => {
    fetchData();
  }, [currentLocation, radiusKm, selectedCat, currentUser]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const catRes = await fetch('/api/categories');
      const catData = await catRes.json();
      setCategories(catData.categories || []);

      const queryParams = new URLSearchParams({
        lat: currentLocation.lat.toString(),
        lng: currentLocation.lng.toString(),
        radius: radiusKm.toString(),
        category: selectedCat,
        userId: currentUser.id,
      });
      const prodRes = await fetch(`/api/products?${queryParams.toString()}`);
      const prodData = await prodRes.json();
      setProducts(prodData.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products
    .filter((p) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        p.title_en.toLowerCase().includes(q) ||
        p.title_as.toLowerCase().includes(q) ||
        (p.seller_name && p.seller_name.toLowerCase().includes(q)) ||
        (p.location_name && p.location_name.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (sortBy === 'distance') {
        return (a.distance_km ?? 999) - (b.distance_km ?? 999);
      }
      if (sortBy === 'price_low') {
        return a.price - b.price;
      }
      if (sortBy === 'fresh') {
        return (b.is_fresh ? 1 : 0) - (a.is_fresh ? 1 : 0);
      }
      return 0;
    });

  const handleAddToCart = () => {
    setCartCount((prev) => prev + 1);
  };

  return (
    <div className="space-y-16 pb-24 relative overflow-x-hidden">
      
      {/* ============================================================ */}
      {/* 🌈 VIBRANT AMBIENT BACKGROUND GLOW SPHERES (Plus Ultra Atmosphere) */}
      {/* ============================================================ */}
      <div className="absolute top-[450px] -left-20 w-96 h-96 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none animate-float-slow" />
      <div className="absolute top-[1100px] -right-20 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none animate-float-reverse" />
      <div className="absolute top-[1800px] left-10 w-96 h-96 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none animate-float-slow" />
      <div className="absolute top-[2500px] right-20 w-96 h-96 bg-rose-400/10 rounded-full blur-3xl pointer-events-none animate-float-reverse" />

      {/* Floating harvest motifs along the margins */}
      <motion.div
        animate={{ y: [0, -18, 0], rotate: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        className="absolute top-28 right-8 text-4xl opacity-30 pointer-events-none hidden lg:block select-none z-10"
      >
        🌾
      </motion.div>
      <motion.div
        animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
        className="absolute top-96 left-6 text-4xl opacity-30 pointer-events-none hidden lg:block select-none z-10"
      >
        🐟
      </motion.div>
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 2 }}
        className="absolute top-[800px] right-10 text-4xl opacity-30 pointer-events-none hidden lg:block select-none z-10"
      >
        🍯
      </motion.div>

      {/* ============================================================ */}
      {/* 🌟 HERO SECTION WITH RADAR & ANIMATED FLOATING BADGES */}
      {/* ============================================================ */}
      <section className="relative bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white pt-14 pb-20 px-4 sm:px-6 lg:px-8 border-b border-emerald-800/40 shadow-2xl">
        
        {/* Glow ambient light orbs inside overflow-hidden wrapper */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(#a7f3d0_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10 space-y-8">
          
          {/* Floating Pill Row */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-emerald-800/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-emerald-400/40 text-xs font-bold text-emerald-200 shadow-lg shadow-emerald-950/50"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span>অসমৰ প্ৰথম হাইপাৰ-লোকেল বজাৰ • 5km Discovery</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-1.5 bg-amber-500/25 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-400/40 text-xs font-bold text-amber-200"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>OWASP ASVS L2 Privacy</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-1.5 bg-teal-500/25 backdrop-blur-md px-3 py-1.5 rounded-full border border-teal-400/40 text-xs font-bold text-teal-200"
            >
              <Zap className="w-3.5 h-3.5 text-teal-300" />
              <span>Zero Middleman Fees</span>
            </motion.div>
          </div>

          {/* Headline */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] text-white drop-shadow-md"
            >
              {lang === 'as' ? (
                <>
                  ওচৰৰ খেতিয়কৰ পৰা <span className="bg-gradient-to-r from-amber-300 via-emerald-300 to-teal-200 bg-clip-text text-transparent">পোনপটীয়া সতেজ বস্তু</span>
                </>
              ) : (
                <>
                  Hyperlocal Fresh Produce <br className="hidden sm:inline" />
                  <span className="bg-gradient-to-r from-amber-300 via-emerald-300 to-teal-200 bg-clip-text text-transparent">Direct from Assam Producers</span>
                </>
              )}
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-sm sm:text-lg text-emerald-100/95 font-medium max-w-2xl mx-auto leading-relaxed"
            >
              {lang === 'as'
                ? 'ব্ৰহ্মপুত্ৰৰ সতেজ মাছ, হাঁহৰ কণী, সুগন্ধি জহা চাউল, কাজী নেমু আৰু খাঁটি অসমীয়া পিঠা মাত্ৰ ৫ কিলোমিটাৰৰ ভিতৰত।'
                : 'Fresh river fish, organic duck eggs, aromatic Kola Joha rice, Kaji Nemu & GI-heritage crafts harvested within 5 km of your home.'}
            </motion.p>
          </div>

          {/* Search Bar & Location Component */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-3 sm:p-3.5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/40 dark:border-slate-700 max-w-3xl mx-auto text-slate-800 dark:text-slate-100 flex flex-col sm:flex-row items-center gap-3"
          >
            {/* Search Input */}
            <div className="flex-1 flex items-center gap-3 px-3 w-full">
              <Search className="w-5 h-5 text-emerald-600 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search_placeholder')}
                className="w-full text-xs sm:text-sm bg-transparent placeholder-slate-400 focus:outline-none py-1 text-slate-900 dark:text-slate-100 font-bold"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-400 hover:text-slate-600 px-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Location Selector (Portal Modal) */}
            <div className="w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-800 pt-2 sm:pt-0 sm:pl-3 flex items-center justify-between sm:justify-start gap-2">
              <LocationPicker />
              <Link
                href="/browse"
                className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white p-3 rounded-2xl transition-transform active:scale-95 shadow-md shadow-emerald-700/30 flex items-center justify-center shrink-0"
                title="Browse all listings"
              >
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* ============================================================ */}
          {/* 📡 INTERACTIVE RADAR RADIUS ENGINE SLIDER */}
          {/* ============================================================ */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="max-w-2xl mx-auto bg-emerald-900/70 backdrop-blur-md rounded-2xl p-4 border border-emerald-700/60 shadow-xl text-center space-y-3"
          >
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="flex items-center gap-2 font-bold text-emerald-200">
                <Compass className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
                <span>{lang === 'as' ? 'হাইপাৰ-লোকেল ব্যাসাৰ্ধ ৰাডাৰ:' : 'Hyperlocal Discovery Radar:'}</span>
              </span>
              <span className="bg-amber-400/20 text-amber-300 font-black px-2.5 py-0.5 rounded-full border border-amber-400/40 text-xs">
                {radiusKm} km {lang === 'as' ? 'ব্যাসাৰ্ধ' : 'Radius'}
              </span>
            </div>

            {/* Slider */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-emerald-300/80 font-bold">1 km</span>
              <input
                type="range"
                min="1"
                max="25"
                step="1"
                value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer h-2.5 bg-emerald-950/80 rounded-lg appearance-none"
              />
              <span className="text-[11px] text-emerald-300/80 font-bold">25 km</span>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              {[
                { r: 3, label: lang === 'as' ? '৩ কিঃমিঃ (চুবুৰী)' : '3 km (Neighborhood)' },
                { r: 5, label: lang === 'as' ? '৫ কিঃমিঃ (মান্য বজাৰ)' : '5 km (Standard Haat)' },
                { r: 10, label: lang === 'as' ? '১০ কিঃমিঃ (নগৰ এলেকা)' : '10 km (Town)' },
                { r: 20, label: lang === 'as' ? '২০ কিঃমিঃ (জিলা)' : '20 km (District)' },
              ].map((p) => (
                <button
                  key={p.r}
                  onClick={() => setRadiusKm(p.r)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all ${
                    radiusKm === p.r
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                      : 'bg-emerald-800/70 hover:bg-emerald-700/80 text-emerald-200 border border-emerald-600/40'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </motion.div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 📊 LIVE IMPACT STATS RIBBON (Elevated 3D Shadow) */}
      {/* ============================================================ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-elevation-high grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800"
        >
          <div className="text-center sm:text-left sm:pl-4 space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-emerald-600 dark:text-emerald-400">
              <Users className="w-5 h-5" />
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">500+</span>
            </div>
            <div className="text-xs font-black text-slate-800 dark:text-slate-200">
              {lang === 'as' ? 'পঞ্জীভুক্ত থলুৱা উৎপাদক' : 'Local Producers & SHGs'}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Direct village farmers & artisans</p>
          </div>

          <div className="text-center sm:text-left sm:pl-6 pt-3 sm:pt-0 space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-amber-600 dark:text-amber-400">
              <Coins className="w-5 h-5" />
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">₹2.8L+</span>
            </div>
            <div className="text-xs font-black text-slate-800 dark:text-slate-200">
              {lang === 'as' ? 'মধ্যভোগীৰ ৰাহি ধন' : 'Middleman Markup Saved'}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Kept directly by local producers</p>
          </div>

          <div className="text-center sm:text-left sm:pl-6 pt-3 sm:pt-0 space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-teal-600 dark:text-teal-400">
              <MapPin className="w-5 h-5" />
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">15 Haats</span>
            </div>
            <div className="text-xs font-black text-slate-800 dark:text-slate-200">
              {lang === 'as' ? 'সক্ৰিয় অসমীয়া বজাৰ' : 'Active Assam Haats'}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Beltola, Uzanbazar, Jorhat...</p>
          </div>

          <div className="text-center sm:text-left sm:pl-6 pt-3 sm:pt-0 space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-rose-600 dark:text-rose-400">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">ASVS L2</span>
            </div>
            <div className="text-xs font-black text-slate-800 dark:text-slate-200">
              {lang === 'as' ? 'উচ্চ নিৰাপত্তা সুৰক্ষা' : 'OWASP Contact Privacy'}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Zero phone scraping or spam</p>
          </div>
        </motion.div>
      </div>

      {/* ============================================================ */}
      {/* 🔥 FEATURED LIVE HAAT FLASH TICKER (High-Contrast Colors) */}
      {/* ============================================================ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-teal-500/20 border-2 border-amber-400/50 p-5 shadow-elevation-medium flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black shadow-lg shadow-amber-500/40 shrink-0">
              <Flame className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                <span>{lang === 'as' ? 'বেলতলা ৰাতিপুৱাৰ বজাৰ এতিয়া সক্ৰিয়!' : 'Beltola Morning Haat is Live Right Now!'}</span>
                <span className="bg-emerald-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full animate-pulse shadow-sm">
                  34 Sellers Live
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold mt-0.5">
                {lang === 'as' ? 'ব্ৰহ্মপুত্ৰৰ সতেজ মাছ আৰু থলুৱা হাঁহৰ কণীৰ ষ্টক এতিয়াই সংগ্ৰহ কৰক।' : 'Fresh river fish and duck eggs just reached the haat shed. Handover within 15 minutes.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <div className="text-xs font-black text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 px-3.5 py-2 rounded-xl border border-amber-300 dark:border-amber-700 flex items-center gap-1.5 shadow-sm">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Closes at 1:30 PM</span>
            </div>
            <Link
              href="/browse"
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl shadow transition-colors"
            >
              View Haat
            </Link>
          </div>
        </motion.div>
      </div>

      {/* ============================================================ */}
      {/* 🏷️ CATEGORY PILLS BAR WITH HIGH-CONTRAST HEADINGS */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
              <Sparkles className="w-6 h-6 text-amber-500" />
              <span>{lang === 'as' ? 'মুখ্য শ্ৰেণীসমূহ' : 'Featured Assam Categories'}</span>
              <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 hidden sm:inline-block">
                18 Fresh Items
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold mt-0.5">
              {lang === 'as' ? 'সতেজ কৃষি, মীন, দুগ্ধ আৰু হস্তশিল্পৰ সন্ধান কৰক' : 'Explore fresh harvest, river catch, and indigenous craft'}
            </p>
          </div>
          <Link
            href="/browse"
            className="text-xs sm:text-sm font-black text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 group"
          >
            <span>{t('all_categories')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Scrollable pill container */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCat('all')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black shrink-0 transition-all shadow-elevation-low flex items-center gap-1.5 ${
              selectedCat === 'all'
                ? 'bg-emerald-700 text-white shadow-glow-emerald scale-105 ring-2 ring-emerald-400'
                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>🌟</span>
            <span>{lang === 'as' ? 'সকলো সামগ্ৰী' : 'All Items'}</span>
            <span className="text-[10px] bg-emerald-800 text-emerald-100 px-2 py-0.5 rounded-full ml-1 font-black">
              {products.length}
            </span>
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCat === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold shrink-0 flex items-center gap-2 transition-all shadow-elevation-low ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-glow-emerald scale-105 ring-2 ring-emerald-400'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="text-sm">{cat.icon}</span>
                <span>{lang === 'as' ? cat.name_as : cat.name_en}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 📦 PRODUCT GRID WITH 18 ITEMS & HIGH CONTRAST */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header & Sort Bar with Elevated Shadow */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-elevation-low">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {lang === 'as' ? 'ওচৰৰ সতেজ সামগ্ৰী' : 'Nearby Fresh Listings'}
              </h2>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-semibold">
              {t('within_radius', { radius: radiusKm })}: <span className="font-black text-emerald-700 dark:text-emerald-400">{lang === 'as' ? currentLocation.name_as : currentLocation.name}</span> • <span className="font-bold">{filteredProducts.length} authentic items</span>
            </p>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-bold hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="distance">📍 Distance (Closest first)</option>
              <option value="price_low">💰 Price (Lowest first)</option>
              <option value="fresh">🌱 Fresh Harvest First</option>
            </select>

            <Link
              href="/browse"
              className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-700 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('filter_title')}</span>
            </Link>
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 space-y-4 animate-pulse shadow-elevation-low">
                <div className="aspect-[4/3] bg-slate-200 dark:bg-slate-800 rounded-2xl" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Empty State */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-5 max-w-lg mx-auto shadow-elevation-medium"
          >
            <div className="w-20 h-20 bg-amber-50 dark:bg-amber-950/50 text-amber-600 rounded-3xl flex items-center justify-center mx-auto text-3xl shadow-inner border border-amber-200/50">
              🌾
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {lang === 'as' ? 'এই ব্যাসাৰ্ধত কোনো সামগ্ৰী পোৱা নগ’ল' : 'No Listings in this Radius'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold max-w-sm mx-auto">
                {lang === 'as'
                  ? 'অনুগ্ৰহ কৰি ওপৰৰ ৰাডাৰ ব্যৱহাৰ কৰি ব্যাসাৰ্ধ বৃদ্ধি কৰক বা ওচৰৰ অন্য এখন বজাৰ নিৰ্বাচন কৰক।'
                  : 'Try expanding your radar radius or selecting a neighboring market like Beltola, Uzanbazar or Dispur.'}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setRadiusKm(15)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all"
              >
                <Compass className="w-4 h-4" />
                <span>Expand to 15 km</span>
              </button>
              <Link
                href="/seller/create"
                className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-slate-200 transition-all flex items-center gap-1.5"
              >
                <Store className="w-4 h-4 text-emerald-600" />
                <span>{lang === 'as' ? 'প্ৰথম বিক্ৰেতা হওক' : 'List First Product'}</span>
              </Link>
            </div>
          </motion.div>
        ) : (
          /* Staggered Animated Grid with 18 Items */
          <motion.div 
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.05
                }
              }
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredProducts.map((prod) => (
              <ProductCard 
                key={prod.id} 
                product={prod} 
                onAddToCart={handleAddToCart}
              />
            ))}
          </motion.div>
        )}
      </section>

      {/* ============================================================ */}
      {/* 🧑‍🌾 PRODUCER SPOTLIGHT - CRISP HIGH-CONTRAST HEADINGS & CARDS */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 px-3.5 py-1.5 rounded-full border border-amber-300 dark:border-amber-700 mb-2">
              <Star className="w-4 h-4 fill-amber-500 text-amber-600" />
              <span>{lang === 'as' ? 'থলুৱা উৎপাদকৰ পৰিচয়' : 'Local Producer Spotlight'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              <span>{lang === 'as' ? 'আমাৰ গাঁৱলীয়া কৃষক আৰু শিপিনী: ' : 'Real People, '}</span>
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 bg-clip-text text-transparent">
                {lang === 'as' ? 'সঁচা পৰিশ্ৰম' : 'Honest Harvest'}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold mt-1">
              Every purchase goes 100% directly to indigenous farmers and artisans with zero broker commissions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Spotlight 1 - Ramen Borah */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 border-2 border-emerald-500/30 shadow-elevation-medium hover:shadow-elevation-high hover:-translate-y-1.5 transition-all space-y-4">
              <div className="flex items-center gap-3.5">
                <img
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=200&q=80"
                  alt="Ramen Borah"
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
                />
                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>Ramen Borah</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Borah Organic Farm • Beltola</p>
                  <div className="flex items-center gap-1 text-xs text-amber-500 font-black">
                    ★ 4.9 (28 orders)
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 italic font-medium leading-relaxed">
                "Thaluwa Bazar allows me to sell all 200 free-range duck eggs directly to neighborhood families within 2 hours of morning collection."
              </p>
              <div className="text-[11px] font-black text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1 rounded-xl w-fit border border-emerald-200 dark:border-emerald-800">
                Duck Eggs • Joha Rice
              </div>
            </div>

            {/* Spotlight 2 - Bonti Saikia */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 border-2 border-cyan-500/30 shadow-elevation-medium hover:shadow-elevation-high hover:-translate-y-1.5 transition-all space-y-4">
              <div className="flex items-center gap-3.5">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
                  alt="Bonti Saikia"
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-500 shadow-md"
                />
                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>Bonti Saikia</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Brahmaputra Fisheries • Uzanbazar</p>
                  <div className="flex items-center gap-1 text-xs text-amber-500 font-black">
                    ★ 4.8 (42 orders)
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 italic font-medium leading-relaxed">
                "No more fish dying at wholesale stalls. Buyers book morning Chitol and Rou fish before 7 AM and pick up cleaned cuts directly."
              </p>
              <div className="text-[11px] font-black text-cyan-800 dark:text-cyan-300 bg-cyan-100 dark:bg-cyan-950/60 px-3 py-1 rounded-xl w-fit border border-cyan-200 dark:border-cyan-800">
                River Rou • Chitol Fish
              </div>
            </div>

            {/* Spotlight 3 - Pranab Kalita */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 border-2 border-amber-500/30 shadow-elevation-medium hover:shadow-elevation-high hover:-translate-y-1.5 transition-all space-y-4">
              <div className="flex items-center gap-3.5">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                  alt="Pranab Kalita"
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-500 shadow-md"
                />
                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>Pranab Kalita</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Kalita Crafts & Dairy • Dispur</p>
                  <div className="flex items-center gap-1 text-xs text-amber-500 font-black">
                    ★ 4.7 (19 orders)
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 italic font-medium leading-relaxed">
                "Our handwoven Gamosa, cane baskets, and pure raw Desi cow milk get fair value without commercial middlemen taking our livelihood."
              </p>
              <div className="text-[11px] font-black text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-3 py-1 rounded-xl w-fit border border-amber-200 dark:border-amber-800">
                Desi Milk • Eri Silk
              </div>
            </div>

          </div>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/* 🔄 HOW IT WORKS - HYPERLOCAL LOOP */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-8 sm:p-12 text-white border border-slate-800 shadow-2xl space-y-10 relative overflow-hidden"
        >
          <div className="text-center max-w-xl mx-auto space-y-2 relative z-10">
            <span className="text-xs font-black text-amber-400 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              {lang === 'as' ? 'সহজ আৰু সুৰক্ষিত কাৰ্যপদ্ধতি' : 'The Hyperlocal Marketplace Loop'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black">
              {lang === 'as' ? 'থলুৱা বজাৰ কেনেদৰে কাম কৰে?' : 'How Thaluwa Bazar Works'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-normal">
              {lang === 'as'
                ? 'স্থানীয় বিক্ৰেতা → ৫ কিঃমিঃ সন্ধান → সুৰক্ষিত অৰ্ডাৰ → পোনে পোনে গ্ৰহণ'
                : 'Local Producer → 5km Discovery → ASVS L2 Protected Contact → Zero-Markup Handover'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
            
            <div className="bg-white/5 border border-white/10 hover:border-emerald-500/50 rounded-2xl p-6 space-y-3 backdrop-blur-sm transition-all hover:-translate-y-1.5 shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 font-black flex items-center justify-center text-xl shadow-inner border border-amber-400/30">
                ১
              </div>
              <h3 className="font-extrabold text-base">
                {lang === 'as' ? '১. স্থানীয় উৎপাদকৰ পঞ্জীয়ন' : '1. Local Seller Lists'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {lang === 'as'
                  ? 'কৃষক বা ঘৰুৱা উৎপাদকে পুৱাৰ সতেজ শাক, কণী, মাছ বা এৰী কাপোৰৰ ফটো তুলি পোনপটীয়া মূল্য নিৰ্ধাৰণ কৰে।'
                  : 'Producers photograph morning catch, free-range eggs, or woven craft with fair indigenous pricing.'}
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 hover:border-emerald-500/50 rounded-2xl p-6 space-y-3 backdrop-blur-sm transition-all hover:-translate-y-1.5 shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 font-black flex items-center justify-center text-xl shadow-inner border border-emerald-400/30">
                ২
              </div>
              <h3 className="font-extrabold text-base">
                {lang === 'as' ? '২. ৫ কিঃমিঃ ভিতৰত সন্ধান' : '2. 5km Discovery'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {lang === 'as'
                  ? 'গ্ৰাহকে নিজৰ চুবুৰী বা ওচৰৰ বজাৰৰ সামগ্ৰী দূৰত্ব অনুসৰি বিচাৰি পায় আৰু ৰাডাৰ সলনি কৰে।'
                  : 'Buyers locate hyper-fresh produce nearby via Haversine distance engine in Beltola, Uzanbazar, etc.'}
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 hover:border-teal-500/50 rounded-2xl p-6 space-y-3 backdrop-blur-sm transition-all hover:-translate-y-1.5 shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-300 font-black flex items-center justify-center text-xl shadow-inner border border-teal-400/30">
                ৩
              </div>
              <h3 className="font-extrabold text-base">
                {lang === 'as' ? '৩. সুৰক্ষিত যোগাযোগ বা অৰ্ডাৰ' : '3. Privacy & Order'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {lang === 'as'
                  ? 'স্পাম প্ৰতিৰোধ কৰিবলৈ নম্বৰ আনলক কৰি পোনে পোনে কথা পাতক বা ছাৰ্ভাৰ-যাচাই অৰ্ডাৰ দিয়ক।'
                  : 'Phone privacy masked under ASVS L2. Instant one-click contact unlocks and state-machine order flow.'}
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 hover:border-rose-500/50 rounded-2xl p-6 space-y-3 backdrop-blur-sm transition-all hover:-translate-y-1.5 shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-300 font-black flex items-center justify-center text-xl shadow-inner border border-rose-400/30">
                ৪
              </div>
              <h3 className="font-extrabold text-base">
                {lang === 'as' ? '৪. পিক-আপ বা ডেলিভাৰী' : '4. Easy Handover'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {lang === 'as'
                  ? 'স্থানীয় বজাৰত কাউণ্টাৰৰ পৰা সংগ্ৰহ কৰক বা বিক্ৰেতাৰ পৰা পোনে পোনে ডেলিভাৰী গ্ৰহণ কৰক।'
                  : 'Pick up at the local haat shed or receive direct doorstep delivery without commission cuts.'}
              </p>
            </div>

          </div>

          <div className="text-center pt-2 relative z-10">
            <Link
              href="/seller/create"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm px-8 py-3.5 rounded-2xl shadow-xl hover:shadow-2xl transition-all active:scale-95"
            >
              <Store className="w-4 h-4" />
              <span>{lang === 'as' ? 'এতিয়াই থলুৱা বিক্ৰী আৰম্ভ কৰক' : 'Start Selling Locally in 60 Seconds'}</span>
            </Link>
          </div>

        </motion.div>
      </section>

    </div>
  );
}