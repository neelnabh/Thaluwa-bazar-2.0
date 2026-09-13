'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { 
  ShieldCheck, 
  Lock, 
  PhoneOff, 
  AlertTriangle, 
  FileCheck2, 
  UserCheck, 
  Truck,
  CheckCircle2
} from 'lucide-react';

export default function SafetyPage() {
  const { lang, t } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>OWASP ASVS 5.0.0 Level 2 Security Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          {lang === 'as' ? 'থলুৱা বজাৰ সুৰক্ষা আৰু নীতি-নিয়ম' : 'Marketplace Safety & Security Guidelines'}
        </h1>
        <p className="text-sm text-slate-600">
          {lang === 'as'
            ? 'গ্ৰাহক আৰু স্থানীয় বিক্ৰেতাৰ ব্যক্তিগত গোপনীয়তা আৰু নিৰাপদ লেনদেনৰ বাবে নিৰ্মিত।'
            : 'Built from the ground up with defense-in-depth security, strict contact privacy, and fraud prevention.'}
        </p>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900">
            {lang === 'as' ? 'নম্বৰ গোপনীয়তা (Contact Privacy)' : 'Contact Privacy Gate'}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {lang === 'as'
              ? 'বিক্ৰেতাৰ ব্যক্তিগত ফোন নম্বৰ কেতিয়াও কোনো পাব্লিক কোড বা ডাটাবেচত উন্মুক্ত কৰা নহয়। প্ৰমাণিত গ্ৰাহকে অনুৰোধ কৰিলেহে নম্বৰ প্ৰকাশ পায়।'
              : 'Private seller phone/email numbers are NEVER exposed in public API responses or browser source. Access is authorized per transaction.'}
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900">
            {lang === 'as' ? 'কঠোৰ অৰ্ডাৰ স্থিতি চক্ৰ' : 'Strict Order State Machine'}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {lang === 'as'
              ? 'অৰ্ডাৰসমূহ কেৱল অনুমোদিত ক্ৰমত অগ্ৰগতি লাভ কৰে (REQUESTED → ACCEPTED → READY → COMPLETED)।'
              : 'Server-enforced transition validation prevents client tampering, skipping steps, or forging completed transactions.'}
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900">
            {lang === 'as' ? 'প্ৰমাণিত থলুৱা কৃষক' : 'Verified Local Identity'}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {lang === 'as'
              ? 'কেৱল ৫ কিঃমিঃ ভিতৰৰ প্ৰকৃত কৃষক আৰু শিল্পীৰ সতেজ বস্তু যাতে গ্ৰাহকে বিশ্বাসেৰে ক্ৰয় কৰিব পাৰে।'
              : 'Identity verification, seller ratings, and rapid community abuse reporting protect local market integrity.'}
          </p>
        </div>

      </div>

      {/* Safety Rules for Buyers & Sellers */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <span>{lang === 'as' ? 'ক্ৰয়-বিক্ৰয়ৰ সুৰক্ষা নিয়ম' : 'Hyperlocal Transaction Rules'}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg inline-block">
              {lang === 'as' ? 'গ্ৰাহকৰ বাবে (For Buyers)' : 'Buyer Safety Tips'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Verify fresh produce quality on pickup before completing cash handover.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Use the built-in Order Tracker so the seller prepares fresh harvest at the agreed pickup time.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Never share OTPs, passwords, or personal banking PINs with anyone.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg inline-block">
              {lang === 'as' ? 'বিক্ৰেতাৰ বাবে (For Sellers)' : 'Seller Safety Tips'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>Accurately describe available quantity, harvest freshness, and weight units (kg, dozen, bunch).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>Promptly update order status to "Ready for Pickup" when goods are packed and weighted.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>Report any fraudulent inquiries immediately via the platform moderation button.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}
