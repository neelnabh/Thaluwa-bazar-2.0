'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Order, ContactUnlock, OrderStatus } from '@/types';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  Package, 
  Phone, 
  Truck, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export default function BuyerDashboardPage() {
  const { lang, t, currentUser } = useApp();
  const [orders, setOrders] = useState<Order[]>([]);
  const [unlocks, setUnlocks] = useState<ContactUnlock[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchBuyerData();
  }, [currentUser]);

  const fetchBuyerData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders?userId=${currentUser.id}&role=buyer`);
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'REQUESTED': return 1;
      case 'ACCEPTED': return 2;
      case 'READY_FOR_PICKUP': return 3;
      case 'COMPLETED': return 4;
      default: return 0;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-7 h-7 text-emerald-600" />
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              {lang === 'as' ? 'মোৰ অৰ্ডাৰসমূহ ও সুৰক্ষিত ফোনবুক' : 'My Orders & Protected Contacts'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {currentUser.name} • {currentUser.location_name}
          </p>
        </div>

        <Link
          href="/browse"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 transition-all self-start"
        >
          <span>{lang === 'as' ? 'সামগ্ৰী সন্ধান কৰক' : 'Explore More'}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Active Orders List with Visual State Stepper */}
      <div className="space-y-6">
        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <span>{lang === 'as' ? 'চলমান অৰ্ডাৰ আৰু স্থিতি' : 'Live Order Lifecycle Tracking'}</span>
        </h2>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(n => (
              <div key={n} className="h-44 bg-white rounded-3xl border border-slate-200 animate-pulse p-6" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl">
              🛍️
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              {lang === 'as' ? 'আপোনাৰ কোনো সক্ৰিয় অৰ্ডাৰ নাই' : 'No Active Orders'}
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'as' ? 'আপোনাৰ ওচৰৰ থলুৱা সামগ্ৰী ব্ৰাউজ কৰি অৰ্ডাৰ কৰক।' : 'Browse fresh nearby produce from local producers.'}
            </p>
            <Link
              href="/browse"
              className="inline-block bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl"
            >
              Browse Now
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const step = getStepIndex(order.status);
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6 overflow-hidden"
                >
                  
                  {/* Order meta bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-base text-slate-900">
                          Order #{order.id.slice(-6)}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          • {new Date(order.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Seller: <strong className="text-slate-800">{order.seller_name}</strong> ({order.pickup_location})
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-xs text-slate-400">Total</div>
                      <div className="text-xl font-black text-emerald-800">
                        ₹{order.total_price}
                      </div>
                    </div>
                  </div>

                  {/* Visual Stepper */}
                  <div className="py-2">
                    <div className="grid grid-cols-4 gap-2 text-center">
                      
                      {/* Step 1 */}
                      <div className="space-y-1.5">
                        <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center font-bold text-xs ${
                          step >= 1 ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 text-slate-400'
                        }`}>
                          1
                        </div>
                        <div className="text-[11px] font-bold text-slate-700">
                          {t('status_REQUESTED')}
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div className="space-y-1.5">
                        <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center font-bold text-xs ${
                          step >= 2 ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 text-slate-400'
                        }`}>
                          2
                        </div>
                        <div className="text-[11px] font-bold text-slate-700">
                          {t('status_ACCEPTED')}
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div className="space-y-1.5">
                        <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center font-bold text-xs ${
                          step >= 3 ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 text-slate-400'
                        }`}>
                          3
                        </div>
                        <div className="text-[11px] font-bold text-slate-700">
                          {t('status_READY_FOR_PICKUP')}
                        </div>
                      </div>

                      {/* Step 4 */}
                      <div className="space-y-1.5">
                        <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center font-bold text-xs ${
                          step >= 4 ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 text-slate-400'
                        }`}>
                          4
                        </div>
                        <div className="text-[11px] font-bold text-slate-700">
                          {t('status_COMPLETED')}
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Item Details */}
                  <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                    <img
                      src={order.product_image}
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-xs text-slate-900 truncate">
                        {order.product_title}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {order.quantity} {order.unit} x ₹{order.unit_price}
                      </div>
                    </div>
                    <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
                      {order.delivery_type === 'pickup' ? 'Self Pickup' : 'Seller Delivery'}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
