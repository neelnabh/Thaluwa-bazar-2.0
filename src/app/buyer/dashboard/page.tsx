'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { Order, ContactUnlock, OrderStatus } from '@/types';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  Package, 
  Phone, 
  MapPin, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  ChevronRight,
  Calendar
} from 'lucide-react';

export default function BuyerDashboardPage() {
  const { lang, t, currentUser } = useApp();
  const [orders, setOrders] = useState<Order[]>([]);
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
      default: return 1;
    }
  };

  const totalSpent = orders.reduce((acc, curr) => acc + (curr.total_price || 0), 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* ============================================================ */}
      {/* 🌟 ELEVATED HERO BANNER WITH METRICS & GRADIENT */}
      {/* ============================================================ */}
      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-8 shadow-elevation-high border border-emerald-700/40"
      >
        {/* Glow ambient spots */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-emerald-800/80 px-3 py-1 rounded-full text-xs font-bold text-emerald-200 border border-emerald-500/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{lang === 'as' ? 'প্ৰত্যক্ষ গ্ৰাহক একাউণ্ট' : 'Verified Hyperlocal Buyer Account'}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              {lang === 'as' ? 'মোৰ অৰ্ডাৰসমূহ ও সুৰক্ষিত ফোনবুক' : 'My Orders & Protected Contacts'}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 flex items-center gap-2 font-medium">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{currentUser.name} • {currentUser.location_name}</span>
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 text-center min-w-[100px]">
              <div className="text-xl font-black text-amber-300">{orders.length}</div>
              <div className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Orders</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 text-center min-w-[110px]">
              <div className="text-xl font-black text-emerald-300">₹{totalSpent}</div>
              <div className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Direct Spent</div>
            </div>
            <Link
              href="/browse"
              className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs sm:text-sm px-5 py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-1.5 active:scale-95"
            >
              <span>{lang === 'as' ? 'বজাৰ কৰক' : 'Explore Haat'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ============================================================ */}
      {/* 📦 ACTIVE ORDERS SECTION WITH 3D SHADOWS & STEPPER */}
      {/* ============================================================ */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {lang === 'as' ? 'চলমান অৰ্ডাৰ আৰু স্থিতি' : 'Live Order Lifecycle Tracking'}
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Enforced by Server State Machine
          </span>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div key={n} className="h-48 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse p-6" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4 max-w-md mx-auto shadow-elevation-medium"
          >
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto text-3xl shadow-inner">
              🛍️
            </div>
            <h3 className="text-lg font-black text-slate-800 dark:text-white">
              {lang === 'as' ? 'আপোনাৰ কোনো সক্ৰিয় অৰ্ডাৰ নাই' : 'No Active Orders Yet'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {lang === 'as' ? 'ওচৰৰ থলুৱা সামগ্ৰী ব্ৰাউজ কৰি পোনপটীয়া অৰ্ডাৰ দিয়ক।' : 'Discover fresh local vegetables, fish, eggs, and crafts within 5km.'}
            </p>
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all"
            >
              <span>{lang === 'as' ? 'এতিয়াই সন্ধান কৰক' : 'Browse Local Haats'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, idx) => {
              const step = getStepIndex(order.status);
              const progressPercentage = ((step - 1) / 3) * 100;

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-elevation-medium hover:shadow-elevation-high hover:border-emerald-500/40 transition-all duration-300 p-6 sm:p-7 space-y-6 overflow-hidden relative group"
                >
                  {/* Subtle top accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400" />

                  {/* Order Meta Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-black text-lg text-slate-900 dark:text-white">
                          Order #{order.id.slice(-6)}
                        </span>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          {order.status}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Seller: <strong className="text-slate-800 dark:text-slate-200 font-bold">{order.seller_name}</strong></span>
                        <span>•</span>
                        <MapPin className="w-3.5 h-3.5 text-amber-500" />
                        <span>{order.pickup_location || 'Local Counter'}</span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right bg-slate-50 dark:bg-slate-800/60 sm:bg-transparent p-3 sm:p-0 rounded-2xl">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Payable</div>
                      <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400 leading-tight">
                        ₹{order.total_price.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  {/* ============================================================ */}
                  {/* 🟢 CONNECTING ANIMATED STEPPER PROGRESS BAR */}
                  {/* ============================================================ */}
                  <div className="py-3 px-2 sm:px-6">
                    <div className="relative">
                      {/* Background connecting bar */}
                      <div className="absolute top-1/2 left-0 right-0 h-1.5 -translate-y-1/2 bg-slate-100 dark:bg-slate-800 rounded-full z-0" />
                      
                      {/* Active gradient fill bar */}
                      <div 
                        className="absolute top-1/2 left-0 h-1.5 -translate-y-1/2 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full z-0 transition-all duration-500 shadow-sm"
                        style={{ width: `${progressPercentage}%` }}
                      />

                      {/* 4 Steps */}
                      <div className="relative z-10 grid grid-cols-4 gap-2 text-center">
                        
                        {/* Step 1 */}
                        <div className="space-y-2 flex flex-col items-center">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs transition-all ${
                            step >= 1 
                              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-105 ring-4 ring-emerald-100 dark:ring-emerald-950' 
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                          }`}>
                            1
                          </div>
                          <div className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200">
                            {t('status_REQUESTED')}
                          </div>
                          <span className="text-[10px] text-slate-400 hidden sm:inline">Buyer Initiated</span>
                        </div>

                        {/* Step 2 */}
                        <div className="space-y-2 flex flex-col items-center">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs transition-all ${
                            step >= 2 
                              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-105 ring-4 ring-emerald-100 dark:ring-emerald-950' 
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                          }`}>
                            2
                          </div>
                          <div className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200">
                            {t('status_ACCEPTED')}
                          </div>
                          <span className="text-[10px] text-slate-400 hidden sm:inline">Seller Accepted</span>
                        </div>

                        {/* Step 3 */}
                        <div className="space-y-2 flex flex-col items-center">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs transition-all ${
                            step >= 3 
                              ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30 scale-105 ring-4 ring-teal-100 dark:ring-teal-950 animate-pulse' 
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                          }`}>
                            3
                          </div>
                          <div className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200">
                            {t('status_READY_FOR_PICKUP')}
                          </div>
                          <span className="text-[10px] text-slate-400 hidden sm:inline">Ready at Shed</span>
                        </div>

                        {/* Step 4 */}
                        <div className="space-y-2 flex flex-col items-center">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs transition-all ${
                            step >= 4 
                              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-105 ring-4 ring-emerald-100 dark:ring-emerald-950' 
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                          }`}>
                            4
                          </div>
                          <div className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200">
                            {t('status_COMPLETED')}
                          </div>
                          <span className="text-[10px] text-slate-400 hidden sm:inline">Handover Done</span>
                        </div>

                      </div>
                    </div>
                  </div>

                  {/* Product Details Row */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                    <div className="flex items-center gap-3.5 w-full sm:w-auto">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-200 shrink-0 border border-slate-300 dark:border-slate-700 shadow-sm">
                        <img
                          src={order.product_image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999'}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-extrabold text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
                          {order.product_title}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                          {order.quantity} {order.unit} • ₹{order.unit_price} / unit
                        </div>
                        {order.notes && (
                          <div className="text-[11px] text-emerald-700 dark:text-emerald-400 italic mt-0.5">
                            "{order.notes}"
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 self-end sm:self-center">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{order.delivery_type === 'pickup' ? 'Self Haat Pickup' : 'Direct Delivery'}</span>
                      </span>

                      <button
                        onClick={() => alert(`Connecting you to seller ${order.seller_name}. Demo Phone: +91 94350 98765`)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call</span>
                      </button>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
