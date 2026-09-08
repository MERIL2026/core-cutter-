'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldAlert,
  Phone,
  MessageSquare,
  Search,
  Filter,
  RefreshCw,
  LogOut,
  CheckCircle,
  Clock,
  MapPin,
  FileText,
  User,
  Download,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { defaultBusinessProfile } from '@/content/business';

interface Enquiry {
  id: string;
  name: string;
  phone: string;
  whatsapp_preference: boolean;
  service_id: string | null;
  service_name: string | null;
  service_slug: string | null;
  location: string;
  message: string | null;
  status: 'new' | 'contacted' | 'quoted' | 'closed' | 'spam';
  source_page: string | null;
  created_at: string;
  updated_at: string;
}

interface Stats {
  total: number;
  new: number;
  contacted: number;
  quoted: number;
  closed: number;
  spam: number;
  today: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    new: 0,
    contacted: 0,
    quoted: 0,
    closed: 0,
    spam: 0,
    today: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const fetchEnquiries = useCallback(async (isBackground = false) => {
    if (!isBackground) setIsLoading(true);
    try {
      let url = `/api/admin/enquiries?status=${statusFilter}`;
      if (searchQuery.trim()) {
        url += `&search=${encodeURIComponent(searchQuery.trim())}`;
      }

      const res = await fetch(url, { cache: 'no-store' });
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }

      const data = await res.json();
      if (data.success) {
        setEnquiries(data.enquiries || []);
        if (data.stats) {
          setStats(data.stats);
        }
        setLastRefreshed(new Date());
      }
    } catch (err) {
      console.error('Failed to fetch enquiries:', err);
    } finally {
      if (!isBackground) setIsLoading(false);
    }
  }, [statusFilter, searchQuery, router]);

  useEffect(() => {
    fetchEnquiries();
    // Auto-poll every 3 seconds for live real-time enquiry updates
    const timer = setInterval(() => {
      fetchEnquiries(true);
    }, 3000);
    return () => clearInterval(timer);
  }, [fetchEnquiries]);

  const handleStatusChange = async (id: string, newStatus: Enquiry['status']) => {
    setIsUpdating(id);
    try {
      const res = await fetch('/api/admin/enquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
        );
        // Refresh counts
        fetchEnquiries();
      }
    } catch (err) {
      console.error('Status update failed:', err);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleExportCSV = () => {
    if (enquiries.length === 0) return;

    const headers = ['Date', 'Name', 'Phone', 'WhatsApp Preferred', 'Service', 'Location', 'Status', 'Message'];
    const rows = enquiries.map((e) => [
      new Date(e.created_at).toLocaleString('en-IN'),
      `"${e.name.replace(/"/g, '""')}"`,
      `"${e.phone}"`,
      e.whatsapp_preference ? 'Yes' : 'No',
      `"${(e.service_name || 'General Core Cutting').replace(/"/g, '""')}"`,
      `"${e.location.replace(/"/g, '""')}"`,
      e.status.toUpperCase(),
      `"${(e.message || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `core_cutting_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: Enquiry['status']) => {
    switch (status) {
      case 'new':
        return 'bg-brand-orange/20 text-brand-orange border-brand-orange/40 font-bold';
      case 'contacted':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      case 'quoted':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40 font-bold';
      case 'closed':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-bold';
      case 'spam':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col">
      {/* Top Navbar */}
      <header className="bg-[#12151B] border-b border-slate-800 px-6 py-4 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-orange to-amber-500 flex items-center justify-center text-white font-black text-lg shadow-orange-glow">
              C
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-extrabold text-base tracking-tight text-white">
                  {defaultBusinessProfile.business_name}
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-brand-orange/20 border border-brand-orange/40 text-[10px] font-black text-brand-orange uppercase">
                  Admin Portal
                </span>
              </div>
              <p className="text-xs text-slate-400">Owner Lead Management & Customer CRM</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-bold text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Auto-Sync Active</span>
            </div>

            <button
              onClick={handleExportCSV}
              disabled={enquiries.length === 0}
              className="hidden sm:inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-[#181E28] hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 transition-all disabled:opacity-40"
              title="Export leads to CSV"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => fetchEnquiries(false)}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#181E28] hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-all"
              title="Refresh leads"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin text-brand-orange' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-400 hover:text-red-300 text-xs font-bold transition-all"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex-1 space-y-6">
        {/* KPI Counter Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="bg-[#12151B] border border-slate-800 rounded-2xl p-4 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Leads</span>
            <div className="text-2xl font-black text-white mt-1">{stats.total}</div>
          </div>

          <div className="bg-[#12151B] border border-brand-orange/40 rounded-2xl p-4 shadow-orange-glow/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-10 w-10 bg-brand-orange/10 rounded-bl-2xl flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-brand-orange" />
            </div>
            <span className="text-[11px] font-bold text-brand-orange uppercase tracking-wider">New Leads</span>
            <div className="text-2xl font-black text-brand-orange mt-1">{stats.new}</div>
          </div>

          <div className="bg-[#12151B] border border-slate-800 rounded-2xl p-4 shadow-sm">
            <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">Contacted</span>
            <div className="text-2xl font-black text-blue-400 mt-1">{stats.contacted}</div>
          </div>

          <div className="bg-[#12151B] border border-slate-800 rounded-2xl p-4 shadow-sm">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Quoted</span>
            <div className="text-2xl font-black text-amber-400 mt-1">{stats.quoted}</div>
          </div>

          <div className="bg-[#12151B] border border-slate-800 rounded-2xl p-4 shadow-sm">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Closed</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">{stats.closed}</div>
          </div>

          <div className="bg-[#12151B] border border-slate-800 rounded-2xl p-4 shadow-sm">
            <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">Today (24h)</span>
            <div className="text-2xl font-black text-purple-400 mt-1">{stats.today}</div>
          </div>
        </div>

        {/* Filters & Search Control Bar */}
        <div className="bg-[#12151B] border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between shadow-sm">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar pb-1 md:pb-0">
            {['all', 'new', 'contacted', 'quoted', 'closed', 'spam'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-brand-orange text-white shadow-orange-glow'
                    : 'bg-[#181E28] text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {st} {st !== 'all' && stats[st as keyof Stats] !== undefined ? `(${stats[st as keyof Stats]})` : ''}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="h-4 w-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, phone, city..."
              className="w-full pl-9 pr-4 py-2 bg-[#090C11] border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-orange"
            />
          </div>
        </div>

        {/* Enquiries List / Table */}
        <div className="space-y-4">
          {isLoading && enquiries.length === 0 ? (
            <div className="bg-[#12151B] border border-slate-800 rounded-3xl p-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="h-8 w-8 text-brand-orange animate-spin" />
              <p className="text-sm font-medium">Loading customer messages & quote requests...</p>
            </div>
          ) : enquiries.length === 0 ? (
            <div className="bg-[#12151B] border border-slate-800 rounded-3xl p-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white">No Customer Enquiries Found</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                No quote requests or messages matching the current filter. New submissions from the website and AI assistant will appear here instantly.
              </p>
            </div>
          ) : (
            enquiries.map((enquiry) => {
              const cleanPhone = enquiry.phone.replace(/[^\d+]/g, '');
              const cleanWaPhone = enquiry.phone.replace(/\D/g, '');
              const waText = encodeURIComponent(
                `Hello ${enquiry.name}! Thank you for contacting ${defaultBusinessProfile.business_name} regarding ${
                  enquiry.service_name || 'core cutting'
                }. We are ready to assist you with quotation and scheduling.`
              );

              return (
                <div
                  key={enquiry.id}
                  className="bg-[#12151B] border border-slate-800 hover:border-slate-700/90 rounded-2xl p-5 shadow-md transition-all duration-200"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: Customer & Service info */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
                        <span className="font-extrabold text-base text-white">{enquiry.name}</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider border ${getStatusBadge(
                            enquiry.status
                          )}`}
                        >
                          {enquiry.status}
                        </span>
                        {enquiry.whatsapp_preference && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-[10px] font-bold text-emerald-400 flex items-center space-x-1">
                            <MessageSquare className="h-3 w-3" />
                            <span>WhatsApp Preferred</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-4 text-xs text-slate-400 flex-wrap gap-y-1">
                        <span className="font-semibold text-slate-200">{enquiry.phone}</span>
                        <span className="flex items-center space-x-1 text-slate-300">
                          <MapPin className="h-3.5 w-3.5 text-brand-orange" />
                          <span>{enquiry.location}</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">
                          {enquiry.service_name || 'General Core Cutting'}
                        </span>
                        <span className="flex items-center space-x-1 text-slate-500 text-[11px]">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(enquiry.created_at).toLocaleString('en-IN')}</span>
                        </span>
                      </div>

                      {enquiry.message && (
                        <div className="mt-2.5 p-3 rounded-xl bg-[#090C11] border border-slate-800 text-xs text-slate-300 leading-relaxed font-normal">
                          <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Customer Note:</span>
                          {enquiry.message}
                        </div>
                      )}
                    </div>

                    {/* Right: Quick Action Buttons & Status Selector */}
                    <div className="flex items-center space-x-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                      {/* Direct Call Button */}
                      <a
                        href={`tel:${cleanPhone}`}
                        className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white transition-all active:scale-95"
                        title="Call customer"
                      >
                        <Phone className="h-3.5 w-3.5 text-brand-orange" />
                        <span>Call</span>
                      </a>

                      {/* Direct WhatsApp Reply */}
                      <a
                        href={`https://wa.me/${cleanWaPhone}?text=${waText}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-sm transition-all active:scale-95"
                        title="Reply on WhatsApp"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>WhatsApp Reply</span>
                      </a>

                      {/* Status Dropdown */}
                      <select
                        value={enquiry.status}
                        disabled={isUpdating === enquiry.id}
                        onChange={(e) => handleStatusChange(enquiry.id, e.target.value as Enquiry['status'])}
                        className="px-3 py-2 bg-[#090C11] border border-slate-700 rounded-xl text-xs font-bold text-slate-200 focus:outline-none focus:border-brand-orange cursor-pointer"
                      >
                        <option value="new">Mark New</option>
                        <option value="contacted">Mark Contacted</option>
                        <option value="quoted">Mark Quoted</option>
                        <option value="closed">Mark Closed</option>
                        <option value="spam">Mark Spam</option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
