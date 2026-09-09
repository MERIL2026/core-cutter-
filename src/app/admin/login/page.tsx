'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, ShieldCheck, AlertCircle, Loader2, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { defaultBusinessProfile } from '@/content/business';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
        throw new Error(data.error || 'Authentication failed. Please check your credentials.');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Incorrect master password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-white flex flex-col justify-center items-center px-4 py-8 sm:py-12 relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[32rem] h-[32rem] bg-brand-orange/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Navigation */}
      <div className="w-full max-w-md mb-6 flex justify-between items-center z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors py-1.5 px-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.08]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Website</span>
        </Link>
        <span className="text-[11px] font-medium tracking-wide text-slate-400">
          Owner Portal
        </span>
      </div>

      <div className="w-full max-w-md bg-[#121622]/95 border border-white/[0.08] backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-[0_24px_64px_rgba(0,0,0,0.85)] relative z-10">
        <div className="flex flex-col items-center text-center mb-7">
          <div className="h-13 w-13 rounded-2xl bg-gradient-to-br from-brand-orange to-amber-500 p-0.5 mb-4 shadow-orange-glow/40">
            <div className="w-full h-full bg-[#121622] rounded-[14px] flex items-center justify-center text-brand-orange">
              <Lock className="h-6 w-6" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-orange/10 border border-brand-orange/30 text-[10px] font-bold tracking-wider text-brand-orange uppercase mb-2">
            Authorized Personnel Only
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Owner Command Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {defaultBusinessProfile.business_name}
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center space-x-2.5 text-rose-300 text-xs animate-fade-in">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Master Admin Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full pl-4 pr-11 py-3 bg-[#0A0E17] border border-white/[0.08] focus:border-brand-orange rounded-xl text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !password.trim()}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-brand-orange to-amber-500 hover:from-brand-orange-hover hover:to-amber-600 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-orange-glow flex items-center justify-center space-x-2 transition-all duration-200 active:scale-[0.99] cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <span>Enter Admin Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-white/[0.06] flex items-center justify-center space-x-2 text-[11px] text-slate-400">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Secured Session • Real-time Operations</span>
        </div>
      </div>
    </div>
  );
}
