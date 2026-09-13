'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { useApp } from '@/context/AppContext';
import { ShoppingBag, CheckCircle, Truck, Package, X, MapPin } from 'lucide-react';

export default function OrderModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const router = useRouter();
  const { lang, t, currentUser } = useApp();
  const [quantity, setQuantity] = useState<number>(1);
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'seller_delivery'>('pickup');
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const title = lang === 'as' ? product.title_as : product.title_en;
  const totalPrice = product.price * quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyer_id: currentUser.id,
          product_id: product.id,
          quantity,
          delivery_type: deliveryType,
          notes,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          router.push('/buyer/dashboard');
        }, 1500);
      } else {
        setError(data.error || 'Failed to place order');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-300" />
            <h3 className="font-bold text-base">{t('order_modal_title')}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {success ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-slate-800">
              {lang === 'as' ? 'অৰ্ডাৰ প্ৰেৰণ কৰা হ’ল!' : 'Order Placed!'}
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t('order_success_msg')}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            
            {/* Summary */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
              <img
                src={product.images[0]}
                alt={title}
                className="w-14 h-14 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-900 text-sm truncate">{title}</h4>
                <div className="text-xs text-slate-500">
                  ₹{product.price} / {product.unit}
                </div>
                <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-emerald-600" />
                  {product.location_name}
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('order_quantity')}
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-lg flex items-center justify-center"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.quantity_available}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-20 text-center font-extrabold text-base border border-slate-300 rounded-xl py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.quantity_available, quantity + 1))}
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-lg flex items-center justify-center"
                >
                  +
                </button>
                <span className="text-xs text-slate-500">
                  {product.unit} (Max: {product.quantity_available})
                </span>
              </div>
            </div>

            {/* Delivery Method */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('order_delivery_method')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryType('pickup')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all flex flex-col gap-1 ${
                    deliveryType === 'pickup'
                      ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 font-bold ring-1 ring-emerald-600'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <Package className="w-4 h-4 text-emerald-600" />
                  <span>{t('pickup_myself')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryType('seller_delivery')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all flex flex-col gap-1 ${
                    deliveryType === 'seller_delivery'
                      ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 font-bold ring-1 ring-emerald-600'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>{t('seller_delivers')}</span>
                </button>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {lang === 'as' ? 'বিশেষ নিৰ্দেশনা / সময়' : 'Order Notes / Preferred Pickup Time'}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('order_notes_placeholder')}
                rows={2}
                className="w-full text-xs border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Total breakdown */}
            <div className="p-3 bg-emerald-50 rounded-2xl flex items-center justify-between border border-emerald-200">
              <span className="text-xs font-semibold text-emerald-900">
                {lang === 'as' ? 'মুঠ পৰিমাণ (টকাত):' : 'Total Amount:'}
              </span>
              <span className="text-xl font-extrabold text-emerald-800">
                ₹{totalPrice}
              </span>
            </div>

            {error && (
              <div className="text-xs text-rose-600 font-semibold bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{submitting ? "Placing..." : t('order_submit_btn')}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
