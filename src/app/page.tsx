'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
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
  Package, 
  PhoneCall, 
  CheckCircle2,
  TrendingUp,
  SlidersHorizontal,
  Flame
} from 'lucide-react';

export default function HomePage() {
  const { lang, t, currentLocation, radiusKm, currentUser } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchData();
  }, [currentLocation, radiusKm, selectedCat, currentUser]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch categories
      const catRes = await fetch('/api/categories');
      const catData = await catRes.json();
      setCategories(catData.categories || []);

      // Fetch products near current location
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

  const filteredProducts = products.filter(p => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title_en.toLowerCase().includes(q) ||
      p.title_as.toLowerCase().includes(q) ||
      (p.seller_name && p.seller_name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Section with Warm Assam Aesthetic */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-teal-900 text-white py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        {/* Background glow & subtle motif */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#86efac_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          
          <div className="inline-flex items-center gap-2 bg-emerald-700/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-emerald-500/50 text-xs font-semibold text-emerald-100 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>অসমৰ প্ৰথম হাইপাৰ-লোকেল বজাৰ • 5km Local Discovery</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white drop-shadow-sm">
            {t('hero_heading')}
          </h1>

          <p className="text-sm sm:text-lg text-emerald-100/90 max-w-2xl mx-auto font-normal leading-relaxed">
            {t('hero_subheading')}
          </p>

          {/* Search & Location Bar */}
          <div className="bg-white p-2.5 sm:p-3 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 max-w-2xl mx-auto text-slate-800 flex flex-col sm:flex-row items-center gap-2">
            
            {/* Search Input */}
            <div className="flex-1 flex items-center gap-2.5 px-3 w-full">
              <Search className="w-5 h-5 text-emerald-600 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search_placeholder')}
                className="w-full text-xs sm:text-sm bg-transparent placeholder-slate-400 focus:outline-none py-2"
              />
            </div>

            {/* Location selector */}
            <div className="w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0 sm:pl-2 flex items-center justify-between sm:justify-start gap-2">
              <LocationPicker />
              <Link
                href="/browse"
                className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl transition-transform active:scale-95 shadow-md flex items-center justify-center shrink-0"
              >
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

          {/* Micro badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-emerald-200 pt-2">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {lang === 'as' ? 'প্ৰত্যক্ষ কৃষক আৰু খিলঞ্জীয়া শিল্পী' : 'Direct Local Farmers & Artisans'}
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {lang === 'as' ? 'কোনো মধ্যভোগী নাই' : 'Zero Middlemen Markup'}
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {lang === 'as' ? 'সুৰক্ষিত যোগাযোগ আনলক' : 'Protected Seller Contact'}
            </span>
          </div>

        </div>
      </section>

      {/* Hyperlocal Stats Ribbon */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-x divide-slate-100">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-700">5 km</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">
              {lang === 'as' ? 'অপাৰেটিং ব্যাসাৰ্ধ' : 'Operating Radius'}
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-amber-600">100%</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">
              {lang === 'as' ? 'খাঁটি অসমীয়া উৎপাদিত' : 'Authentic Assam Produce'}
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-teal-600">₹0</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">
              {lang === 'as' ? 'প্ৰাৰম্ভিক মধ্যভোগী মাচুল' : 'Zero Hidden Fees'}
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-rose-600">ASVS L2</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">
              {lang === 'as' ? 'উচ্চ নিৰাপত্তা মানদণ্ড' : 'High-Security Baseline'}
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills & Filter Carousel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <span>{lang === 'as' ? 'মুখ্য শ্ৰেণীসমূহ' : 'Popular Categories'}</span>
            </h2>
            <p className="text-xs text-slate-500">
              {lang === 'as' ? 'প্ৰয়োজনীয় স্থানীয় সামগ্ৰী বাছক' : 'Explore fresh harvest and artisanal crafts'}
            </p>
          </div>
          <Link
            href="/browse"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
          >
            <span>{t('all_categories')}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Categories scrollable pill bar */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCat('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all shadow-sm ${
              selectedCat === 'all'
                ? 'bg-emerald-700 text-white shadow-emerald-700/20'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            🌟 {lang === 'as' ? 'সকলো সামগ্ৰী' : 'All Items'}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all shadow-sm ${
                selectedCat === cat.id
                  ? 'bg-emerald-700 text-white shadow-emerald-700/20'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{lang === 'as' ? cat.name_as : cat.name_en}</span>
              {cat.item_count !== undefined && cat.item_count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedCat === cat.id ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {cat.item_count}
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Main Nearby Listings Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {lang === 'as' ? 'ওচৰৰ সতেজ সামগ্ৰী' : 'Nearby Fresh Products'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('within_radius', { radius: radiusKm })}: <span className="font-semibold text-emerald-800">{lang === 'as' ? currentLocation.name_as : currentLocation.name}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/browse"
              className="text-xs font-bold text-slate-700 hover:text-emerald-700 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{t('filter_title')}</span>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-slate-200 h-80 animate-pulse p-4 space-y-3">
                <div className="bg-slate-200 h-44 rounded-xl" />
                <div className="bg-slate-200 h-4 rounded w-3/4" />
                <div className="bg-slate-200 h-4 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto text-2xl">
              🌾
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              {lang === 'as' ? 'এই ব্যাসাৰ্ধত কোনো সামগ্ৰী পোৱা নগ’ল' : 'No Listings Found in This Radius'}
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'as'
                ? 'অনুগ্ৰহ কৰি ব্যাসাৰ্ধ বৃদ্ধি কৰক বা ওচৰৰ অন্য এখন বজাৰ নিৰ্বাচন কৰক।'
                : 'Try expanding your search radius or selecting a neighboring Assam locality.'}
            </p>
            <div className="pt-2">
              <Link
                href="/seller/create"
                className="inline-flex items-center gap-2 bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md"
              >
                <Store className="w-4 h-4" />
                <span>{lang === 'as' ? 'আপোনাৰ সামগ্ৰী যোগ কৰক' : 'List Your Products First'}</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* How It Works - Hyperlocal Loop (Section 1 of Blueprint) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-8 sm:p-12 text-white border border-slate-800 shadow-xl space-y-8">
          
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              {lang === 'as' ? 'সহজ কাৰ্যপদ্ধতি' : 'Hyperlocal Marketplace Loop'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">
              {lang === 'as' ? 'থলুৱা বজাৰ কেনেদৰে কাম কৰে?' : 'How Thaluwa Bazar Works'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              {lang === 'as'
                ? 'স্থানীয় বিক্ৰেতা → ওচৰৰ নিৰীক্ষণ → সুৰক্ষিত অৰ্ডাৰ → পোনে পোনে গ্ৰহণ'
                : 'Local seller → Local listing → 5km Discovery → Contact & Order → Handover'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-lg">
                ১
              </div>
              <h3 className="font-bold text-sm">
                {lang === 'as' ? '১. স্থানীয় উৎপাদকৰ পঞ্জীয়ন' : '1. Local Seller Lists'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {lang === 'as'
                  ? 'কৃষক বা ঘৰুৱা উৎপাদকে তেওঁলোকৰ সতেজ সামগ্ৰী, কণী, মাছ বা শিল্পৰ ফটো তুলি মূল্য নিৰ্ধাৰণ কৰে।'
                  : 'Sellers snap a photo of their morning catch, eggs, or vegetables with fair local pricing.'}
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-lg">
                ২
              </div>
              <h3 className="font-bold text-sm">
                {lang === 'as' ? '২. ৫ কিঃমিঃ ভিতৰত সন্ধান' : '2. Nearby Discovery'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {lang === 'as'
                  ? 'গ্ৰাহকে নিজৰ এলেকাৰ ওচৰৰ সতেজ বস্তু সহজে বিচাৰি পায় আৰু দূৰত্ব পৰীক্ষা কৰে।'
                  : 'Buyers locate hyper-fresh produce available in their exact neighborhood or village market.'}
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 font-bold flex items-center justify-center text-lg">
                ৩
              </div>
              <h3 className="font-bold text-sm">
                {lang === 'as' ? '৩. সুৰক্ষিত যোগাযোগ বা অৰ্ডাৰ' : '3. Protected Contact & Order'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {lang === 'as'
                  ? 'স্পাম প্ৰতিৰোধ কৰিবলৈ নম্বৰ আনলক কৰি পোনে পোনে কথা পাতক বা অৰ্ডাৰ প্ৰেৰণ কৰক।'
                  : 'Privacy-guarded contact unlocks and server-verified order requests.'}
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 font-bold flex items-center justify-center text-lg">
                ৪
              </div>
              <h3 className="font-bold text-sm">
                {lang === 'as' ? '৪. পিক-আপ বা ডেলিভাৰী' : '4. Easy Handover'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {lang === 'as'
                  ? 'নিজেই বজাৰৰ পৰা সংগ্ৰহ কৰক বা বিক্ৰেতাৰ সৈতে কথা পাতি সহজ হস্তান্তৰ সম্পূৰ্ণ কৰক।'
                  : 'Pick up at the local haat or arrange direct seller delivery without middleman markups.'}
              </p>
            </div>

          </div>

          <div className="text-center pt-4">
            <Link
              href="/seller/create"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm px-6 py-3 rounded-2xl shadow-lg transition-transform active:scale-95"
            >
              <Store className="w-4 h-4" />
              <span>{lang === 'as' ? 'এতিয়াই বিক্ৰী আৰম্ভ কৰক' : 'Start Selling Locally Today'}</span>
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
