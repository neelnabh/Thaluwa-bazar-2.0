'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Category } from '@/types';
import { ASSAM_LOCATIONS } from '@/lib/geo';
import { 
  Store, 
  Sparkles, 
  Upload, 
  CheckCircle, 
  ArrowLeft,
  DollarSign,
  Tag,
  MapPin,
  Image as ImageIcon
} from 'lucide-react';

const PRESET_SAMPLE_IMAGES = [
  { label: 'Duck / Local Eggs', url: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=800&q=80' },
  { label: 'River Rohu / Fish', url: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=800&q=80' },
  { label: 'Green Veggies / Lemon', url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80' },
  { label: 'Pure Cow Milk', url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80' },
  { label: 'Assam Joha Rice', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80' },
  { label: 'Country Duck & Poultry', url: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80' },
  { label: 'Bamboo Crafts & Japi', url: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=800&q=80' },
  { label: 'Assamese Pitha & Food', url: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80' },
];

export default function CreateListingPage() {
  const router = useRouter();
  const { lang, t, currentUser } = useApp();

  const [categories, setCategories] = useState<Category[]>([]);
  const [titleEn, setTitleEn] = useState('');
  const [titleAs, setTitleAs] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('kg');
  const [quantity, setQuantity] = useState('10');
  const [locationName, setLocationName] = useState(currentUser.location_name);
  const [lat, setLat] = useState(currentUser.lat);
  const [lng, setLng] = useState(currentUser.lng);
  const [isFresh, setIsFresh] = useState(true);
  const [descriptionEn, setDescriptionEn] = useState('');
  const [imageUrl, setImageUrl] = useState(PRESET_SAMPLE_IMAGES[0].url);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.categories?.length > 0) {
          setCategories(data.categories);
          setCategoryId(data.categories[0].id);
        }
      });
  }, []);

  const handleLocationChange = (locName: string) => {
    setLocationName(locName);
    const found = ASSAM_LOCATIONS.find(l => l.name === locName);
    if (found) {
      setLat(found.lat);
      setLng(found.lng);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seller_id: currentUser.id,
          category_id: categoryId,
          title_en: titleEn,
          title_as: titleAs || titleEn,
          description_en: descriptionEn,
          description_as: descriptionEn,
          price: Number(price),
          unit,
          quantity_available: Number(quantity),
          location_name: locationName,
          lat,
          lng,
          is_fresh: isFresh,
          images: [imageUrl],
        }),
      });

      const data = await res.json();
      if (res.ok && data.product) {
        router.push('/seller/dashboard');
      } else {
        setError(data.error || "Failed to create listing");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while creating listing");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>{lang === 'as' ? 'ঘূৰি যাওক' : 'Back'}</span>
      </button>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        
        <div>
          <div className="flex items-center gap-2">
            <Store className="w-6 h-6 text-emerald-600" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              {t('add_listing_title')}
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'as'
              ? 'আপোনাৰ নিজৰ উৎপাদিত বস্তু বা শিল্প ওচৰৰ গ্ৰাহকৰ বাবে প্ৰকাশ কৰক'
              : 'Post fresh homegrown items directly to nearby buyers within 5 km.'}
          </p>
        </div>

        {error && (
          <div className="text-xs text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200 font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Title EN & AS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Product Title (English) *
              </label>
              <input
                type="text"
                required
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="e.g. Fresh Free-Range Duck Eggs"
                className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                সামগ্ৰীৰ নাম (অসমীয়াত)
              </label>
              <input
                type="text"
                value={titleAs}
                onChange={(e) => setTitleAs(e.target.value)}
                placeholder="যেনে: সতেজ থলুৱা হাঁহৰ কণী"
                className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Category & Freshness */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('listing_cat_label')} *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl p-3 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {lang === 'as' ? c.name_as : c.name_en}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 w-full">
                <input
                  type="checkbox"
                  checked={isFresh}
                  onChange={(e) => setIsFresh(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 accent-emerald-600"
                />
                <span className="flex items-center gap-1 text-emerald-900">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  {t('listing_fresh_checkbox')}
                </span>
              </label>
            </div>
          </div>

          {/* Pricing, Unit, Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('listing_price_label')} *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                <input
                  type="number"
                  required
                  min="1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="120"
                  className="w-full pl-8 pr-3 py-3 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('listing_unit_label')}
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl p-3 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="kg">kg (কেজি)</option>
                <option value="dozen (১২ টা)">dozen (১২ টা কণী)</option>
                <option value="piece (টা)">piece (টা / পেকেট)</option>
                <option value="litre (লিটাৰ)">litre (লিটাৰ)</option>
                <option value="bunch (মুঠি)">bunch (শাকৰ মুঠি)</option>
                <option value="5 kg bag">5 kg bag (বেগ)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('listing_qty_label')}
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold"
              />
            </div>
          </div>

          {/* Location Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('listing_location_label')} *
            </label>
            <select
              value={locationName}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl p-3 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {ASSAM_LOCATIONS.map((loc) => (
                <option key={loc.name} value={loc.name}>
                  {lang === 'as' ? loc.name_as : loc.name} ({loc.district})
                </option>
              ))}
            </select>
          </div>

          {/* Sample Photo Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Select Product Photo Sample:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {PRESET_SAMPLE_IMAGES.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImageUrl(item.url)}
                  className={`p-1 rounded-2xl border-2 transition-all text-left overflow-hidden ${
                    imageUrl === item.url
                      ? 'border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={item.url} alt="" className="w-full h-20 object-cover rounded-xl" />
                  <div className="text-[10px] font-bold text-slate-700 p-1 truncate">
                    {item.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Description / Sourcing Details
            </label>
            <textarea
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              rows={3}
              placeholder="Tell buyers about your produce freshness, harvesting time, or pickup details..."
              className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            <Store className="w-4 h-4" />
            <span>{submitting ? "Publishing..." : t('listing_submit_btn')}</span>
          </button>

        </form>

      </div>
    </div>
  );
}
