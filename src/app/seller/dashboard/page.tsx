'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Order, Product, OrderStatus } from '@/types';
import { 
  Store, 
  PlusCircle, 
  Package, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp, 
  Truck, 
  AlertCircle,
  Eye,
  Trash2,
  Phone,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function SellerDashboardPage() {
  const { lang, t, currentUser } = useApp();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchSellerData();
  }, [currentUser]);

  const fetchSellerData = async () => {
    setLoading(true);
    try {
      // Fetch orders for this seller
      const ordersRes = await fetch(`/api/orders?userId=${currentUser.id}&role=seller`);
      const ordersData = await ordersRes.json();
      setOrders(ordersData.orders || []);

      // Fetch products listed by this seller
      const prodRes = await fetch(`/api/products?userId=${currentUser.id}`);
      const prodData = await prodRes.json();
      const myProducts = (prodData.products || []).filter(
        (p: Product) => p.seller_id === currentUser.id
      );
      setProducts(myProducts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusTransition = async (orderId: string, nextStatus: OrderStatus) => {
    setActionLoading(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: nextStatus,
          user_id: currentUser.id,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Refresh orders
        fetchSellerData();
      } else {
        alert(data.error || "Could not update status");
      }
    } catch (e) {
      console.error(e);
      alert("Error updating order state");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteListing = async (productId: string) => {
    if (!confirm("Are you sure you want to remove this product listing?")) return;
    try {
      const res = await fetch(`/api/products/${productId}?userId=${currentUser.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== productId));
      } else {
        alert("Failed to delete listing");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Stats calculation
  const activeOrders = orders.filter(o => ['REQUESTED', 'ACCEPTED', 'READY_FOR_PICKUP'].includes(o.status));
  const completedOrders = orders.filter(o => o.status === 'COMPLETED');
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total_price, 0);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'REQUESTED':
        return <span className="bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{t('status_REQUESTED')}</span>;
      case 'ACCEPTED':
        return <span className="bg-blue-100 text-blue-800 border border-blue-300 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" />{t('status_ACCEPTED')}</span>;
      case 'READY_FOR_PICKUP':
        return <span className="bg-purple-100 text-purple-800 border border-purple-300 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Package className="w-3.5 h-3.5" />{t('status_READY_FOR_PICKUP')}</span>;
      case 'COMPLETED':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" />{t('status_COMPLETED')}</span>;
      case 'REJECTED':
      case 'CANCELLED':
        return <span className="bg-rose-100 text-rose-800 border border-rose-300 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1"><XCircle className="w-3.5 h-3.5" />{status}</span>;
      case 'DISPUTED':
        return <span className="bg-red-200 text-red-900 border border-red-400 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{t('status_DISPUTED')}</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Store className="w-7 h-7 text-amber-600" />
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              {lang === 'as' ? 'বিক্ৰেতা কেন্দ্ৰ ও ডেশ্বব’ৰ্ড' : 'Seller Hub & Order Management'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {currentUser.name} • {currentUser.location_name}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/seller/create"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('add_listing_title')}</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {lang === 'as' ? 'চলমান অৰ্ডাৰ' : 'Pending Action Orders'}
            </div>
            <div className="text-3xl font-black text-amber-600 mt-1">
              {activeOrders.length}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {lang === 'as' ? 'সক্ৰিয় সামগ্ৰী' : 'Active Listings'}
            </div>
            <div className="text-3xl font-black text-emerald-700 mt-1">
              {products.length}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {lang === 'as' ? 'মুঠ বিক্ৰী ৰাজহ' : 'Completed Sales (GMV)'}
            </div>
            <div className="text-3xl font-black text-slate-900 mt-1">
              ₹{totalRevenue}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Order State Machine Processing Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-600" />
              <span>{lang === 'as' ? 'অহা অৰ্ডাৰসমূহ পৰিচালনা কৰক' : 'Incoming Hyperlocal Orders'}</span>
            </h2>
            <p className="text-xs text-slate-500">
              {lang === 'as' ? 'ৰাজ্যিক নিৰাপদ অৰ্ডাৰ ট্ৰানজিছন প্ৰণালী (State Machine)' : 'Server-enforced lifecycle transitions'}
            </p>
          </div>
          <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
            {orders.length} Total Orders
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-400">
            {lang === 'as' ? 'কোনো অৰ্ডাৰ পোৱা নগ’ল।' : 'No orders received yet.'}
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-slate-50/70 rounded-2xl border border-slate-200 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Order meta */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900">
                      Order #{order.id.slice(-6)}
                    </span>
                    {getStatusBadge(order.status)}
                    <span className="text-xs text-slate-400 font-medium">
                      {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-slate-700">
                    {order.quantity} {order.unit} • {order.product_title}
                  </div>

                  <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                    <span>Buyer: <strong className="text-slate-800">{order.buyer_name}</strong></span>
                    {order.buyer_phone && (
                      <a href={`tel:${order.buyer_phone}`} className="text-emerald-700 font-bold hover:underline flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {order.buyer_phone}
                      </a>
                    )}
                    <span>• Method: <strong className="capitalize">{order.delivery_type.replace('_', ' ')}</strong></span>
                  </div>

                  {order.notes && (
                    <div className="text-[11px] bg-amber-50/80 border border-amber-200 text-amber-900 p-2 rounded-lg italic">
                      Note from buyer: "{order.notes}"
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="text-right sm:px-4">
                  <div className="text-xs text-slate-400 font-medium">Total Amount</div>
                  <div className="text-xl font-black text-emerald-800">₹{order.total_price}</div>
                </div>

                {/* State Machine Action Controls */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  
                  {order.status === 'REQUESTED' && (
                    <>
                      <button
                        onClick={() => handleStatusTransition(order.id, 'ACCEPTED')}
                        disabled={actionLoading === order.id}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-sm transition-colors"
                      >
                        {t('action_accept')}
                      </button>
                      <button
                        onClick={() => handleStatusTransition(order.id, 'REJECTED')}
                        disabled={actionLoading === order.id}
                        className="bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs px-3 py-2 rounded-xl transition-colors"
                      >
                        {t('action_reject')}
                      </button>
                    </>
                  )}

                  {order.status === 'ACCEPTED' && (
                    <>
                      <button
                        onClick={() => handleStatusTransition(order.id, 'READY_FOR_PICKUP')}
                        disabled={actionLoading === order.id}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-sm transition-colors"
                      >
                        {t('action_ready')}
                      </button>
                    </>
                  )}

                  {order.status === 'READY_FOR_PICKUP' && (
                    <button
                      onClick={() => handleStatusTransition(order.id, 'COMPLETED')}
                      disabled={actionLoading === order.id}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-sm transition-colors flex items-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{t('action_complete')}</span>
                    </button>
                  )}

                  {order.status === 'COMPLETED' && (
                    <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      Handover Complete
                    </span>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Seller's Products Listing Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-lg font-black text-slate-900">
            {lang === 'as' ? 'মোৰ সামগ্ৰীৰ তালিকা' : 'My Active Listings'}
          </h2>
          <Link
            href="/seller/create"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add New</span>
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No products listed yet. Click "Add New" to list your local goods.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-slate-50 rounded-2xl border border-slate-200 p-3.5 flex items-center gap-3"
              >
                <img
                  src={p.images[0]}
                  alt=""
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-slate-900 truncate">
                    {lang === 'as' ? p.title_as : p.title_en}
                  </h4>
                  <div className="text-xs font-extrabold text-emerald-700 mt-0.5">
                    ₹{p.price} / {p.unit}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Stock: {p.quantity_available} {p.unit}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Link
                    href={`/product/${p.id}`}
                    className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-600"
                    title="View"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={() => handleDeleteListing(p.id)}
                    className="p-1.5 rounded-lg bg-white hover:bg-rose-50 text-rose-600"
                    title="Delete listing"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
