'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Product } from '@/types';
import { useApp } from '@/context/AppContext';
import { formatDistance } from '@/lib/geo';
import { 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  ShoppingBag, 
  Phone, 
  Lock,
  Eye, 
  Star,
  Clock
} from 'lucide-react';
import OrderModal from './OrderModal';

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  cat_eggs: { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800/60', glow: 'hover:shadow-amber-500/10' },
  cat_fish: { bg: 'bg-cyan-50 dark:bg-cyan-950/40', text: 'text-cyan-700 dark:text-cyan-400', border: 'border-cyan-200 dark:border-cyan-800/60', glow: 'hover:shadow-cyan-500/10' },
  cat_vegetables: { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800/60', glow: 'hover:shadow-emerald-500/10' },
  cat_milk: { bg: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-700 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-800/60', glow: 'hover:shadow-indigo-500/10' },
  cat_rice: { bg: 'bg-yellow-50 dark:bg-yellow-950/40', text: 'text-yellow-700 dark:text-yellow-400', border: 'border-yellow-200 dark:border-yellow-800/60', glow: 'hover:shadow-yellow-500/10' },
  cat_poultry: { bg: 'bg-orange-50 dark:bg-orange-950/40', text: 'text-orange-700 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800/60', glow: 'hover:shadow-orange-500/10' },
  cat_bamboo: { bg: 'bg-teal-50 dark:bg-teal-950/40', text: 'text-teal-700 dark:text-teal-400', border: 'border-teal-200 dark:border-teal-800/60', glow: 'hover:shadow-teal-500/10' },
  cat_homemade: { bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-800/60', glow: 'hover:shadow-rose-500/10' },
  cat_plants: { bg: 'bg-lime-50 dark:bg-lime-950/40', text: 'text-lime-700 dark:text-lime-400', border: 'border-lime-200 dark:border-lime-800/60', glow: 'hover:shadow-lime-500/10' },
};

export interface ProductCardProps {
  product: Product;
  onAddToCart?: (id: string) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { lang, t, currentUser } = useApp();
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [unlockedPhone, setUnlockedPhone] = useState<string | null>(product.seller_phone || null);
  const [unlocking, setUnlocking] = useState(false);

  const title = lang === 'as' ? product.title_as : product.title_en;
  const secondaryTitle = lang === 'as' ? product.title_en : product.title_as;
  const categoryStyle = CATEGORY_COLORS[product.category_id] || {
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
    glow: 'hover:shadow-slate-500/10'
  };

  const handleUnlockContact = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (unlockedPhone) return;

    setUnlocking(true);
    try {
      const res = await fetch('/api/contact-unlocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyer_id: currentUser.id,
          seller_id: product.seller_id,
          product_id: product.id,
        }),
      });
      const data = await res.json();
      if (data.success && data.seller_phone) {
        setUnlockedPhone(data.seller_phone);
      } else {
        alert(data.error || "Could not unlock contact");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to unlock contact");
    } finally {
      setUnlocking(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -6, transition: { duration: 0.25, ease: 'easeOut' } }}
        className={`group relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-2xl ${categoryStyle.glow} transition-all duration-300 flex flex-col justify-between overflow-hidden`}
      >
        {/* Product Image & Badges */}
        <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <img
            src={product.images[0] || 'https://images.unsplash.com/photo-1540420773420-3366772f4999'}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
            loading="lazy"
          />

          {/* Gradient overlay for contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

          {/* Freshness Badge */}
          {product.is_fresh ? (
            <div className="absolute top-3 left-3 bg-emerald-600/95 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md shadow-emerald-900/30 border border-emerald-400/40">
              <span className="w-2 h-2 rounded-full bg-emerald-200 animate-ping" />
              <span>{product.harvest_time || t('fresh_badge')}</span>
            </div>
          ) : (
            <div className="absolute top-3 left-3 bg-amber-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm border border-amber-400/30 uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-amber-200" />
              <span>{lang === 'as' ? 'ঐতিহ্য শিল্প' : 'Artisan Craft'}</span>
            </div>
          )}

          {/* Distance Badge with Live Geolocation */}
          {product.distance_km !== undefined && (
            <div className="absolute top-3 right-3 bg-slate-950/85 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md border border-white/15">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="tracking-tight">{formatDistance(product.distance_km, lang)}</span>
            </div>
          )}

          {/* Stock Indicator at bottom-left of image */}
          {product.quantity_available !== undefined && (
            <div className="absolute bottom-2.5 left-3 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-slate-100 flex items-center gap-1">
              <Clock className="w-3 h-3 text-emerald-400" />
              <span>{product.quantity_available} {product.unit} {lang === 'as' ? 'মজুত' : 'in stock'}</span>
            </div>
          )}
        </div>

        {/* Card Content Section */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
          <div>
            {/* Category Pill & Seller Verified Row */}
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}>
                {lang === 'as' ? (product.category_name_as || 'থলুৱা') : (product.category_name_en || 'Local')}
              </span>

              {/* Seller Name & Star Rating */}
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs flex items-center gap-1 max-w-[130px] truncate">
                  {product.seller_verified && (
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  )}
                  {product.seller_name}
                </span>
                <span className="inline-flex items-center gap-0.5 text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/50 border border-amber-200/80 dark:border-amber-800/50 px-1.5 py-0.5 rounded text-[10px]">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                  {product.seller_rating?.toFixed(1) || '4.8'}
                </span>
              </div>
            </div>

            {/* Product Title */}
            <Link href={`/product/${product.id}`} className="block group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base leading-snug line-clamp-2">
                {title}
              </h3>
              <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 italic">
                {secondaryTitle}
              </p>
            </Link>

            {/* Locality Tag */}
            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-2 font-medium">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="truncate">{product.location_name}</span>
            </div>
          </div>

          {/* Pricing & Order Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-[10px] text-slate-400 font-medium tracking-wide">
                  {t('per_unit')} {product.unit}
                </div>
                <div className="text-xl font-black text-emerald-700 dark:text-emerald-400 leading-none">
                  ₹{product.price.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/product/${product.id}`}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                  title={t('view_details')}
                >
                  <Eye className="w-4 h-4" />
                </Link>

                <motion.button
                  whileTap={{ scale: 0.94 }}
                  onClick={() => {
                    setShowOrderModal(true);
                    onAddToCart?.(product.id);
                  }}
                  className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-emerald-700/20 hover:shadow-lg flex items-center gap-1.5 transition-all"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{t('order_now')}</span>
                </motion.button>
              </div>
            </div>

            {/* ASVS Level 2 Privacy Protected Contact Button */}
            <div className="pt-1">
              {unlockedPhone ? (
                <motion.a
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  href={`tel:${unlockedPhone}`}
                  className="text-xs font-bold text-emerald-800 dark:text-emerald-200 bg-emerald-100/80 dark:bg-emerald-950/60 hover:bg-emerald-200 border border-emerald-300 dark:border-emerald-700 rounded-xl py-2 px-3 flex items-center justify-center gap-2 transition-all shadow-sm w-full"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600 animate-bounce" />
                  <span>{unlockedPhone} ({lang === 'as' ? 'কল কৰক' : 'Call Seller'})</span>
                </motion.a>
              ) : (
                <button
                  onClick={handleUnlockContact}
                  disabled={unlocking}
                  className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl py-1.5 px-2.5 flex items-center justify-center gap-1.5 transition-all w-full group/btn"
                >
                  <Lock className="w-3 h-3 text-slate-400 group-hover/btn:text-emerald-600 transition-colors" />
                  <span>{unlocking ? (lang === 'as' ? "আনলক হৈ আছে..." : "Unlocking...") : (lang === 'as' ? "🔒 নম্বৰ আনলক কৰক (বিনামূলীয়া)" : "🔒 Unlock Direct Phone (Free)")}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Interactive Order Flow Modal */}
      {showOrderModal && (
        <OrderModal
          product={product}
          onClose={() => setShowOrderModal(false)}
        />
      )}
    </>
  );
}

export { ProductCard };