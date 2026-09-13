'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '@/context/AppContext';
import { ShieldAlert, CheckCircle, X } from 'lucide-react';

export default function ReportModal({
  targetType,
  targetId,
  targetTitle,
  onClose,
}: {
  targetType: 'product' | 'seller' | 'buyer';
  targetId: string;
  targetTitle: string;
  onClose: () => void;
}) {
  const { lang, currentUser } = useApp();
  const [mounted, setMounted] = useState(false);
  const [reason, setReason] = useState('Misleading product information or fake price');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const reasons = [
    "Misleading product description or fake price",
    "Seller contact abuse or spam",
    "Prohibited goods (industrial chemical, non-local reseller)",
    "Expired or substandard perishable food",
    "Harassment or rude behavior",
    "Other violation",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reporter_id: currentUser.id,
          target_type: targetType,
          target_id: targetId,
          target_title: targetTitle,
          reason,
          details,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => onClose(), 1500);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to submit report");
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-3xl max-w-md w-full shadow-[0_25px_70px_rgba(0,0,0,0.5)] overflow-hidden border border-slate-200 dark:border-slate-800">
        
        <div className="bg-rose-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-sm">
            <ShieldAlert className="w-5 h-5 text-rose-200" />
            <span>{lang === 'as' ? 'অভিযোগ দাখিল কৰক' : 'Report Policy Violation'}</span>
          </div>
          <button onClick={onClose} className="text-rose-200 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-slate-900">
              {lang === 'as' ? 'অভিযোগ সফলতাৰে দাখিল হ’ল' : 'Report Submitted'}
            </h4>
            <p className="text-xs text-slate-500">
              {lang === 'as' ? 'আমাৰ নিৰীক্ষক দলে অতি সোনকালে পৰ্যবেক্ষণ কৰিব।' : 'Our moderation team will review this shortly.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-800">Target: </span>
              {targetTitle} ({targetType})
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {lang === 'as' ? 'অভিযোগৰ কাৰণ:' : 'Violation Reason:'}
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-none"
              >
                {reasons.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {lang === 'as' ? 'অতিৰিক্ত তথ্য (ঐচ্ছিক):' : 'Additional details:'}
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                placeholder="Describe what went wrong..."
                className="w-full text-xs border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-sm"
            >
              {submitting ? 'Submitting...' : (lang === 'as' ? 'অভিযোগ প্ৰেৰণ কৰক' : 'Submit Report')}
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
