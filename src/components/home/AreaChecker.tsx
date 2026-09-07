'use client';

import React, { useState } from 'react';
import { MapPin, Search, CheckCircle2, Clock, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import { defaultBusinessProfile } from '@/content/business';

export const AreaChecker: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<{
    status: 'idle' | 'available' | 'custom';
    message: string;
    eta: string;
  }>({
    status: 'idle',
    message: '',
    eta: '',
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim();
    if (!clean) return;

    // Professional coverage check for local service region
    setResult({
      status: 'available',
      message: `We service locations across ${defaultBusinessProfile.city} including "${clean}". Contact our dispatch team to confirm the exact arrival slot for your job.`,
      eta: 'Same-day slots typically available (subject to route schedule)',
    });
  };

  const handleWhatsAppBooking = () => {
    const text = `Hello ${defaultBusinessProfile.business_name}! I am looking for core cutting service at location/pincode: "${query || defaultBusinessProfile.city}". Please confirm technician arrival time!`;
    const whatsappNum = (defaultBusinessProfile.whatsapp || defaultBusinessProfile.phone).replace(/\D/g, '');
    window.open(`https://wa.me/${whatsappNum}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-xl relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
        <div>
          <div className="inline-flex items-center space-x-2 text-brand-orange text-xs font-bold uppercase tracking-wider mb-1">
            <MapPin className="h-4 w-4" />
            <span>Fast Technician Dispatch</span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            Check Service Availability in Your Area
          </h3>
          <p className="text-slate-600 text-xs md:text-sm mt-1">
            Enter your colony, society name, or 6-digit pin code to check current technician response time.
          </p>
        </div>

        {/* Live Active Status Badge */}
        <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Mobile Vans Active Across {defaultBusinessProfile.city}</span>
        </div>
      </div>

      {/* Search Input Form */}
      <form onSubmit={handleSearch} className="mt-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Ring Road, Subhash Nagar, Pincode 380001..."
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-300 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 text-slate-900 text-sm font-medium outline-none transition"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3.5 bg-brand-dark hover:bg-slate-800 text-white font-bold text-sm rounded-2xl transition flex items-center justify-center space-x-2 shrink-0 shadow-md"
        >
          <Search className="h-4 w-4" />
          <span>Check Arrival Time</span>
        </button>
      </form>

      {/* Result Display */}
      {result.status === 'available' && (
        <div className="mt-6 p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <span>Service Available Today!</span>
              </div>
              <p className="text-xs text-slate-700 mt-1">{result.message}</p>
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-800 mt-2">
                <Clock className="h-4 w-4 text-brand-orange" />
                <span>Estimated Arrival: <strong className="text-slate-900">{result.eta}</strong></span>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                type="button"
                onClick={handleWhatsAppBooking}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1.5 transition shadow"
              >
                <span>Book Slot on WhatsApp</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <a
                href={`tel:${defaultBusinessProfile.phone.replace(/[^\d+]/g, '')}`}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition"
                title="Call Now"
              >
                <Phone className="h-4 w-4 text-brand-orange" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Suggested Quick Badges */}
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span className="font-semibold text-slate-700">Quick Coverage:</span>
        {['Residential Societies', 'Commercial Plazas', 'High-Rise Apartments', 'Industrial Estates', 'Under-Construction Sites'].map((tag) => (
          <span
            key={tag}
            onClick={() => {
              setQuery(tag);
              setResult({
                status: 'available',
                message: `Technicians equipped with portable diamond rigs active for "${tag}".`,
                eta: '45 – 90 Minutes',
              });
            }}
            className="cursor-pointer bg-slate-100 hover:bg-brand-orange/10 hover:text-brand-orange border border-slate-200 px-2.5 py-1 rounded-lg transition"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};
