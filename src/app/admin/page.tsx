'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { AuditLog, Report, MarketplaceSettings } from '@/types';
import { 
  ShieldAlert, 
  Users, 
  Store, 
  Package, 
  DollarSign, 
  Sliders, 
  FileText, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  Lock,
  Search
} from 'lucide-react';

export default function AdminPage() {
  const { lang, currentUser } = useApp();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [savingSettings, setSavingSettings] = useState<boolean>(false);
  const [radius, setRadius] = useState<number>(5);
  const [sellerSubFee, setSellerSubFee] = useState<number>(20);
  const [contactFee, setContactFee] = useState<number>(0);
  const [feeEnabled, setFeeEnabled] = useState<boolean>(false);
  const [searchAudit, setSearchAudit] = useState<string>('');

  useEffect(() => {
    fetchAdminOverview();
  }, [currentUser]);

  const fetchAdminOverview = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/overview?userId=${currentUser.id}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
        if (json.settings) {
          setRadius(json.settings.marketplace_radius_km);
          setSellerSubFee(json.settings.seller_monthly_subscription_fee);
          setContactFee(json.settings.contact_unlock_fee);
          setFeeEnabled(json.settings.contact_unlock_fee_enabled);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUser.id,
          settings: {
            marketplace_radius_km: Number(radius),
            seller_monthly_subscription_fee: Number(sellerSubFee),
            contact_unlock_fee: Number(contactFee),
            contact_unlock_fee_enabled: Boolean(feeEnabled),
          },
        }),
      });
      if (res.ok) {
        alert("Marketplace settings updated successfully!");
        fetchAdminOverview();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save settings");
    } finally {
      setSavingSettings(false);
    }
  };

  const filteredLogs = (data?.auditLogs || []).filter((log: AuditLog) => {
    if (!searchAudit) return true;
    const q = searchAudit.toLowerCase();
    return (
      log.action.toLowerCase().includes(q) ||
      log.actor_name.toLowerCase().includes(q) ||
      log.target_type.toLowerCase().includes(q) ||
      (log.details && log.details.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-7 h-7 text-rose-600" />
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              {lang === 'as' ? 'প্ৰশাসক আৰু নিৰীক্ষণ কেন্দ্ৰ' : 'Admin & Moderation Console'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            OWASP ASVS 5.0.0 Security Posture • Real-time Audit Trail & Controls
          </p>
        </div>

        <button
          onClick={fetchAdminOverview}
          className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs px-3 py-2 rounded-xl shadow-sm flex items-center gap-1.5 self-start"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Metrics Grid */}
      {data?.metrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase">Total Users</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{data.metrics.total_users}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase">Active Listings</div>
            <div className="text-2xl font-black text-emerald-700 mt-1">{data.metrics.total_listings}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase">Total Orders</div>
            <div className="text-2xl font-black text-amber-600 mt-1">{data.metrics.total_orders}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase">Platform GMV</div>
            <div className="text-2xl font-black text-teal-700 mt-1">₹{data.metrics.total_gmv_inr}</div>
          </div>
        </div>
      )}

      {/* Two Column: Settings & Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Marketplace Settings Config */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sliders className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-base text-slate-900">
              Marketplace Economics & Radius Configuration
            </h3>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Default Hyperlocal Radius (km)
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <p className="text-[10px] text-slate-400 mt-0.5">Blueprint recommends starting at ~5km</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Candidate Seller Monthly Subscription Fee (₹ INR)
              </label>
              <input
                type="number"
                value={sellerSubFee}
                onChange={(e) => setSellerSubFee(Number(e.target.value))}
                className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <p className="text-[10px] text-slate-400 mt-0.5">Section 2 Candidate model: ~₹20/month</p>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={feeEnabled}
                  onChange={(e) => setFeeEnabled(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 accent-emerald-600"
                />
                <span>Enable Non-Refundable Contact Unlock Fee</span>
              </label>
            </div>

            {feeEnabled && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contact Unlock Fee (₹ INR)
                </label>
                <input
                  type="number"
                  value={contactFee}
                  onChange={(e) => setContactFee(Number(e.target.value))}
                  className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={savingSettings}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow transition-colors"
            >
              {savingSettings ? "Updating..." : "Save Platform Parameters"}
            </button>
          </form>
        </div>

        {/* User Reports & Moderation Queue */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <h3 className="font-extrabold text-base text-slate-900">
                Moderation Queue & Reports
              </h3>
            </div>
            <span className="text-xs font-bold bg-rose-50 text-rose-700 px-2.5 py-0.5 rounded-full border border-rose-200">
              {data?.reports?.length || 0} Reports
            </span>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {(!data?.reports || data.reports.length === 0) ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No reports flagged. Marketplace running clean!
              </div>
            ) : (
              data.reports.map((rep: Report) => (
                <div key={rep.id} className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-900">{rep.target_title}</span>
                    <span className="text-[10px] uppercase font-bold bg-rose-200 text-rose-900 px-1.5 py-0.5 rounded">
                      {rep.status}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-800">
                    Reason: {rep.reason}
                  </div>
                  <p className="text-[11px] text-slate-600 italic">
                    "{rep.details}"
                  </p>
                  <div className="text-[10px] text-slate-400">
                    Reported by: {rep.reporter_name} • {new Date(rep.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* High-Security Immutable Audit Trail */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-700" />
            <div>
              <h3 className="font-black text-base text-slate-900">
                ASVS Level 2 Security Audit Trail
              </h3>
              <p className="text-[11px] text-slate-500">
                Structured log of privileged actions, contact unlocks, listings & transitions.
              </p>
            </div>
          </div>

          <div className="w-full sm:w-64 relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchAudit}
              onChange={(e) => setSearchAudit(e.target.value)}
              placeholder="Search audit logs..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Actor</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Target</th>
                <th className="py-2.5 px-3">Result</th>
                <th className="py-2.5 px-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {filteredLogs.map((log: AuditLog) => (
                <tr key={log.id} className="hover:bg-slate-50/80">
                  <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">
                    {new Date(log.created_at).toLocaleTimeString()}
                  </td>
                  <td className="py-2.5 px-3 font-sans font-semibold text-slate-800">
                    {log.actor_name} ({log.actor_role})
                  </td>
                  <td className="py-2.5 px-3 font-bold text-emerald-800">
                    {log.action}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">
                    {log.target_type}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      log.result === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {log.result}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-sans text-slate-600 max-w-xs truncate">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
