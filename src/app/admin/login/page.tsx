'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { defaultBusinessProfile } from '@/content/business';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed. Please try again.');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Incorrect password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-orange/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#12151B] border border-slate-800 rounded-3xl p-8 shadow-[0_24px_64px_rgba(0,0,0,0.85)] relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="h-14 w-14 rounded-2xl bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center text-brand-orange mb-4 shadow-orange-glow/30">
            <Lock className="h-7 w-7" />
          </div>

          <span className="text-xs font-black uppercase tracking-widest text-brand-orange mb-1">
            Owner Access
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Staff & Admin Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {defaultBusinessProfile.business_name} Lead Management
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-red-500/15 border border-red-500/40 rounded-2xl flex items-center space-x-2.5 text-red-300 text-xs animate-fade-in-up">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Admin Master Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full px-4 py-3 bg-[#090C11] border border-slate-700 rounded-2xl text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-brand-orange transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !password.trim()}
            className="w-full py-3.5 bg-gradient-to-r from-brand-orange to-amber-500 hover:from-brand-orange-hover hover:to-amber-600 disabled:opacity-50 text-white font-bold text-sm rounded-2xl shadow-orange-glow flex items-center justify-center space-x-2 transition-all duration-200 active:scale-95"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <span>Access Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-center space-x-2 text-xs text-slate-500">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>Encrypted Session & Rate-Limit Protected</span>
        </div>
      </div>
    </div>
  );
}
