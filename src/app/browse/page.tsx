'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Product, Category } from '@/types';
import ProductCard from '@/components/ProductCard';
import LocationPicker from '@/components/LocationPicker';
import { 
  Search, 
  SlidersHorizontal, 
  Sparkles, 
  ShieldCheck, 
  RotateCcw,
  MapPin,
  ArrowUpDown
} from 'lucide-react';

export default function BrowsePage() {
  const { lang, t, currentLocation, radiusKm, setRadiusKm, currentUser } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [freshOnly, setFreshOnly] = useState<boolean>(false);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'distance' | 'price_low' | 'price_high' | 'newest'>('distance');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchData();
  }, [currentLocation, radiusKm, selectedCat, freshOnly, currentUser]);

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
        fresh: freshOnly ? 'true' : 'false',
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

  // Client filtering & sorting
  const processedProducts = products
    .filter(p => {
      if (verifiedOnly && !p.seller_verified) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        p.title_en.toLowerCase().includes(q) ||
        p.title_as.toLowerCase().includes(q) ||
        p.description_en.toLowerCase().includes(q) ||
        (p.seller_name && p.seller_name.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (sortBy === 'distance') return (a.distance_km ?? 0) - (b.distance_km ?? 0);
      if (sortBy === 'price_low') return a.price - b.price;
      if (sortBy === 'price_high') return b.price - a.price;
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return 0;
    });

  const resetFilters = () => {
    setSelectedCat('all');
    setSearchQuery('');
    setFreshOnly(false);
    setVerifiedOnly(false);
    setSortBy('distance');
    setRadiusKm(5);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <span>{lang === 'as' ? 'থলুৱা সামগ্ৰী ব্ৰাউজ কৰক' : 'Browse Local Products'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {lang === 'as'
              ? 'নিৰ্বাচিত স্থানৰ পৰা ওচৰৰ সতেজ থলুৱা সামগ্ৰী ফিল্টাৰ কৰক'
              : 'Discover fresh produce and handicrafts around your local Assam market.'}
          </p>
        </div>

        {/* Search bar */}
        <div className="w-full sm:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('search_placeholder')}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left: Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                <span>{t('filter_title')}</span>
              </h3>
              <button
                onClick={resetFilters}
                className="text-[11px] text-slate-400 hover:text-emerald-700 flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Location & Radius Control */}
            <LocationPicker inline />

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                {lang === 'as' ? 'শ্ৰেণী নিৰ্বাচন:' : 'Categories:'}
              </label>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                <button
                  onClick={() => setSelectedCat('all')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                    selectedCat === 'all'
                      ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                      : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span>🌟 {lang === 'as' ? 'সকলো' : 'All'}</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCat(cat.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                      selectedCat === cat.id
                        ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                        : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span className="truncate">
                      {cat.icon} {lang === 'as' ? cat.name_as : cat.name_en}
                    </span>
                    {cat.item_count !== undefined && (
                      <span className="text-[10px] text-slate-400">({cat.item_count})</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Checkboxes: Fresh & Verified */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={freshOnly}
                  onChange={(e) => setFreshOnly(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 accent-emerald-600"
                />
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  {t('filter_fresh')}
                </span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 accent-emerald-600"
                />
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {t('filter_verified_only')}
                </span>
              </label>
            </div>

          </div>

        </div>

        {/* Right: Products Grid & Sort Header */}
        <div className="lg:col-span-3 space-y-4">
          
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-500 font-medium">
              {lang === 'as' ? 'মুঠ উপলব্ধ সামগ্ৰী:' : 'Showing:'}{' '}
              <span className="font-bold text-slate-900">{processedProducts.length} items</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" />
                {t('sort_by')}:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label={t('sort_by')}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="distance">{t('sort_nearest')}</option>
                <option value="price_low">{t('sort_price_low')}</option>
                <option value="price_high">{t('sort_price_high')}</option>
                <option value="newest">{t('sort_newest')}</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white rounded-2xl border border-slate-200 h-80 animate-pulse p-4 space-y-3">
                  <div className="bg-slate-200 h-44 rounded-xl" />
                  <div className="bg-slate-200 h-4 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : processedProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <div className="text-3xl">🔍</div>
              <h3 className="font-bold text-slate-800">
                {lang === 'as' ? 'কোনো ফলাফল পোৱা নগ’ল' : 'No Products Match Filters'}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'as' ? 'অনুগ্ৰহ কৰি অন্য ফিল্টাৰ বা দূৰত্ব নিৰ্বাচন কৰক।' : 'Try resetting some filters or expanding your radius.'}
              </p>
              <button
                onClick={resetFilters}
                className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {processedProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
