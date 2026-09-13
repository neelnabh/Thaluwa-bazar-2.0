'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { useApp } from '@/context/AppContext';
import { formatDistance } from '@/lib/geo';
import { 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  ShoppingBag, 
  Phone, 
  Check, 
  ArrowRight,
  Eye
} from 'lucide-react';
import OrderModal from './OrderModal';

export default function ProductCard({ product }: { product: Product }) {
  const { lang, t, currentUser } = useApp();
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [unlockedPhone, setUnlockedPhone] = useState<string | null>(product.seller_phone || null);
  const [unlocking, setUnlocking] = useState(false);

  const title = lang === 'as' ? product.title_as : product.title_en;
  const description = lang === 'as' ? product.description_as : product.description_en;

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
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group">
        
        {/* Product Image & Badges */}
        <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
          <img
            src={product.images[0] || 'https://images.unsplash.com/photo-1540420773420-3366772f4999'}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Fresh badge */}
          {product.is_fresh && (
            <div className="absolute top-2.5 left-2.5 bg-emerald-600/90 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3" />
              <span>{t('fresh_badge')}</span>
            </div>
          )}

          {/* Distance Badge */}
          {product.distance_km !== undefined && (
            <div className="absolute top-2.5 right-2.5 bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <MapPin className="w-3 h-3 text-amber-400" />
              <span>{formatDistance(product.distance_km, lang)}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
          
          <div>
            {/* Seller info header */}
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-medium truncate max-w-[170px] flex items-center gap-1 text-slate-700">
                {product.seller_verified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                {product.seller_name}
              </span>
              <span className="text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded text-[11px]">
                ★ {product.seller_rating?.toFixed(1) || '4.8'}
              </span>
            </div>

            {/* Title */}
            <Link href={`/product/${product.id}`} className="block group-hover:text-emerald-700 transition-colors">
              <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2">
                {title}
              </h3>
            </Link>

            {/* Location */}
            <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{product.location_name}</span>
            </div>
          </div>

          {/* Price & Actions */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
            <div>
              <div className="text-[11px] text-slate-400 font-medium">
                {t('per_unit')} {product.unit}
              </div>
              <div className="text-lg font-extrabold text-emerald-800 leading-tight">
                ₹{product.price}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <Link
                href={`/product/${product.id}`}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                title={t('view_details')}
              >
                <Eye className="w-4 h-4" />
              </Link>

              <button
                onClick={() => setShowOrderModal(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-sm hover:shadow flex items-center gap-1 transition-all"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{t('order_now')}</span>
              </button>
            </div>
          </div>

          {/* Privacy Protected Contact Bar */}
          <div className="pt-1 text-center">
            {unlockedPhone ? (
              <a
                href={`tel:${unlockedPhone}`}
                className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg py-1.5 px-2.5 flex items-center justify-center gap-1.5 transition-colors w-full"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>{unlockedPhone}</span>
              </a>
            ) : (
              <button
                onClick={handleUnlockContact}
                disabled={unlocking}
                className="text-[11px] font-medium text-slate-600 hover:text-emerald-700 hover:bg-slate-50 border border-dashed border-slate-300 rounded-lg py-1 px-2 flex items-center justify-center gap-1 transition-colors w-full"
              >
                <Phone className="w-3 h-3 text-slate-400" />
                <span>{unlocking ? "Unlocking..." : t('unlock_contact_btn')}</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {showOrderModal && (
        <OrderModal
          product={product}
          onClose={() => setShowOrderModal(false)}
        />
      )}
    </>
  );
}
