'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Product, SellerProfile, Review } from '@/types';
import { formatDistance } from '@/lib/geo';
import OrderModal from '@/components/OrderModal';
import ReportModal from '@/components/ReportModal';
import { 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  Phone, 
  ShoppingBag, 
  Flag, 
  ArrowLeft,
  Calendar,
  Package,
  Star,
  CheckCircle2,
  Lock,
  Eye,
  Info
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;
  const { lang, t, currentLocation, currentUser } = useApp();

  const [product, setProduct] = useState<Product | null>(null);
  const [sellerProfile, setSellerProfile] = useState<SellerProfile | null>(null);
  const [isContactUnlocked, setIsContactUnlocked] = useState<boolean>(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showOrderModal, setShowOrderModal] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [unlocking, setUnlocking] = useState<boolean>(false);
  const [selectedImg, setSelectedImg] = useState<string>('');

  useEffect(() => {
    if (productId) fetchProduct();
  }, [productId, currentUser, currentLocation]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        userId: currentUser.id,
        lat: currentLocation.lat.toString(),
        lng: currentLocation.lng.toString(),
      });
      const res = await fetch(`/api/products/${productId}?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProduct(data.product);
        setSellerProfile(data.seller_profile);
        setIsContactUnlocked(data.is_contact_unlocked);
        setReviews(data.reviews || []);
        if (data.product?.images?.[0]) {
          setSelectedImg(data.product.images[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlockContact = async () => {
    if (!product) return;
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
      if (data.success) {
        setIsContactUnlocked(true);
        setProduct(prev => prev ? { ...prev, seller_phone: data.seller_phone } : null);
      } else {
        alert(data.error || "Failed to unlock contact");
      }
    } catch (e) {
      console.error(e);
      alert("Error unlocking contact");
    } finally {
      setUnlocking(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 animate-pulse space-y-6">
          <div className="h-80 bg-slate-200 rounded-2xl" />
          <div className="h-6 bg-slate-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Product Not Found</h2>
        <button
          onClick={() => router.push('/browse')}
          className="inline-flex items-center gap-2 bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Browse</span>
        </button>
      </div>
    );
  }

  const title = lang === 'as' ? product.title_as : product.title_en;
  const description = lang === 'as' ? product.description_as : product.description_en;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>{lang === 'as' ? 'ঘূৰি যাওক' : 'Back'}</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Gallery (5 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[4/3] rounded-3xl bg-slate-100 overflow-hidden border border-slate-200 shadow-md">
            <img
              src={selectedImg || product.images[0]}
              alt={title}
              className="w-full h-full object-cover"
            />
            {product.is_fresh && (
              <div className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('fresh_badge')}</span>
              </div>
            )}
            {product.distance_km !== undefined && (
              <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{formatDistance(product.distance_km, lang)}</span>
              </div>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImg(img)}
                  className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImg === img ? 'border-emerald-600 ring-2 ring-emerald-500/20' : 'border-slate-200 opacity-70'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info, Price, Ordering, Contact Unlock (7 cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  {lang === 'as' ? product.category_name_as : product.category_name_en}
                </span>
                <button
                  onClick={() => setShowReportModal(true)}
                  className="text-slate-400 hover:text-rose-600 flex items-center gap-1 text-[11px] font-medium"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>{t('report_listing')}</span>
                </button>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
                {title}
              </h1>

              <div className="flex items-center gap-2 text-xs text-slate-600 mt-2">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">{product.location_name}</span>
                {product.harvest_time && (
                  <>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold">{product.harvest_time}</span>
                  </>
                )}
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500 font-medium">
                  {lang === 'as' ? 'নিৰ্ধাৰিত মূল্য:' : 'Price:'}
                </div>
                <div className="text-3xl font-black text-emerald-800">
                  ₹{product.price}{' '}
                  <span className="text-xs font-normal text-slate-500">
                    / {product.unit}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500 font-medium">{t('available_qty')}</div>
                <div className="text-sm font-bold text-slate-800">
                  {product.quantity_available} {product.unit}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                {lang === 'as' ? 'বিৱৰণ' : 'Description'}
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowOrderModal(true)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-base"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>{t('order_now')}</span>
              </button>

              {/* Protected Seller Contact Unlock Box */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                  <Lock className="w-4 h-4 text-emerald-700" />
                  <span>{lang === 'as' ? 'সুৰক্ষিত বিক্ৰেতা যোগাযোগ' : 'OWASP ASVS Contact Privacy'}</span>
                </div>
                
                {isContactUnlocked && product.seller_phone ? (
                  <div className="bg-white p-3 rounded-xl border border-emerald-300 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">{t('unlocked_phone')}</div>
                      <div className="text-sm font-bold text-slate-900">{product.seller_phone}</div>
                    </div>
                    <a
                      href={`tel:${product.seller_phone}`}
                      className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Now</span>
                    </a>
                  </div>
                ) : (
                  <div>
                    <p className="text-[11px] text-slate-600 mb-2">
                      {t('privacy_notice')}
                    </p>
                    <button
                      onClick={handleUnlockContact}
                      disabled={unlocking}
                      className="w-full bg-white hover:bg-emerald-100/50 text-emerald-800 font-bold text-xs py-2.5 px-4 rounded-xl border border-emerald-300 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{unlocking ? "Authorizing..." : t('unlock_contact_btn')}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Seller Storefront Card */}
          {sellerProfile && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    {lang === 'as' ? 'থলুৱা উৎপাদকৰ পৰিচিতি' : 'Verified Producer Profile'}
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-1.5">
                    {product.seller_name}
                    {product.seller_verified && (
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-amber-600 flex items-center gap-1">
                    ★ {sellerProfile.rating_aggregate}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    ({sellerProfile.review_count} {lang === 'as' ? 'মতামত' : 'reviews'})
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {sellerProfile.bio}
              </p>

              <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-1 border-t border-slate-100">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{sellerProfile.service_area}</span>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              {lang === 'as' ? 'গ্ৰাহকৰ মতামত আৰু ৰেটিং' : 'Verified Customer Reviews'}
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'as' ? 'কেৱল সঁচা ক্ৰয় সম্পন্ন কৰা গ্ৰাহকৰ প্ৰমাণিত মতামত' : 'Only verified buyers can submit reviews.'}
            </p>
          </div>
          <div className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>100% Verified Transactions</span>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400">
            {lang === 'as' ? 'এই সামগ্ৰীৰ বাবে এতিয়ালৈকে কোনো মতামত নাই।' : 'No reviews for this listing yet.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{rev.buyer_name}</span>
                  <div className="text-amber-500 text-xs font-bold">
                    {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{rev.comment}"
                </p>
                <div className="text-[10px] text-slate-400">
                  {new Date(rev.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showOrderModal && (
        <OrderModal
          product={product}
          onClose={() => setShowOrderModal(false)}
        />
      )}

      {showReportModal && (
        <ReportModal
          targetType="product"
          targetId={product.id}
          targetTitle={product.title_en}
          onClose={() => setShowReportModal(false)}
        />
      )}

    </div>
  );
}
