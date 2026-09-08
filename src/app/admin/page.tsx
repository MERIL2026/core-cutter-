'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Plus,
  Trash2,
  X,
  Send,
  Check,
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
  source?: string;
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
  
  // Modal state for adding a manual / test enquiry
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [modalSuccess, setModalSuccess] = useState<string | null>(null);
  const [newEnquiryData, setNewEnquiryData] = useState({
    name: '',
    phone: '',
    whatsappPreference: true,
    serviceId: 'ac-core-cutting',
    location: defaultBusinessProfile.city,
    message: '',
  });

  const previousCountRef = useRef<number>(0);

  const fetchEnquiries = useCallback(async (isBackground = false) => {
    if (!isBackground) setIsLoading(true);
    try {
      let url = `/api/admin/enquiries?status=${statusFilter}`;
      if (searchQuery.trim()) {
        url += `&search=${encodeURIComponent(searchQuery.trim())}`;
      }

      const res = await fetch(url, {
        cache: 'no-store',
        credentials: 'include',
      });
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
    // Auto-poll every 3 seconds for real-time customer enquiry updates
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
        credentials: 'include',
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
        );
        fetchEnquiries(true);
      }
    } catch (err) {
      console.error('Status update failed:', err);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry record?')) return;
    setIsUpdating(id);
    try {
      const res = await fetch(`/api/admin/enquiries?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        setEnquiries((prev) => prev.filter((e) => e.id !== id));
        fetchEnquiries(true);
      }
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleCreateEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    setModalSuccess(null);

    if (!newEnquiryData.name.trim()) {
      setModalError('Please enter a customer name.');
      return;
    }
    if (!newEnquiryData.phone.trim() || newEnquiryData.phone.replace(/\D/g, '').length < 7) {
      setModalError('Please enter a valid phone number (at least 7 digits).');
      return;
    }
    if (!newEnquiryData.location.trim()) {
      setModalError('Please enter a location / area.');
      return;
    }

    setModalLoading(true);
    try {
      const res = await fetch('/api/admin/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newEnquiryData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setModalSuccess('Enquiry logged successfully!');
        setNewEnquiryData({
          name: '',
          phone: '',
          whatsappPreference: true,
          serviceId: 'ac-core-cutting',
          location: defaultBusinessProfile.city,
          message: '',
        });
        fetchEnquiries(false);
        setTimeout(() => {
          setIsAddModalOpen(false);
          setModalSuccess(null);
        }, 800);
      } else {
        setModalError(data.error || 'Failed to create enquiry');
      }
    } catch (err: any) {
      setModalError(err.message || 'Network error');
    } finally {
      setModalLoading(false);
    }
  };

  const handleQuickTestEnquiry = async () => {
    const testNames = ['Rajesh Patel', 'Amit Shah', 'Priya Desai', 'Vikram Singh', 'Kiran Mehta'];
    const randomName = testNames[Math.floor(Math.random() * testNames.length)];
    const randomPhone = `98${Math.floor(10000000 + Math.random() * 90000000)}`;
    const randomLocations = ['Alkapuri', 'Gotri', 'Vasna', 'Manjalpur', 'Karelibaug', 'Sama'];
    const randomLoc = randomLocations[Math.floor(Math.random() * randomLocations.length)];

    try {
      const res = await fetch('/api/admin/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: randomName,
          phone: randomPhone,
          whatsappPreference: true,
          serviceId: 'ac-core-cutting',
          location: randomLoc,
          message: 'Need 3 holes for 1.5 ton split AC installation with dust catcher.',
          status: 'new',
        }),
      });
      if (res.ok) {
        fetchEnquiries(false);
      }
    } catch (err) {
      console.error('Quick test failed:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleExportCSV = (exportAll = false) => {
    const recordsToExport = exportAll ? enquiries : enquiries;
    if (recordsToExport.length === 0) {
      alert('No enquiries to export.');
      return;
    }

    const generatedAt = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    const fileTimestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

    const escapeCell = (val: unknown) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""').replace(/\r\n/g, ' ').replace(/[\r\n]/g, ' ');
      return `"${str}"`;
    };

    const lines: string[] = [];
    const BOM = '\uFEFF'; // UTF-8 Byte Order Mark for Excel & CSV compatibility

    // Professional Business Metadata Header
    lines.push(escapeCell(`${defaultBusinessProfile.business_name} - Official Customer Lead Report`));
    lines.push(escapeCell(`Generated on: ${generatedAt} (IST)`));
    lines.push(escapeCell(`Active Filter: ${statusFilter.toUpperCase()} | Total Exported Records: ${recordsToExport.length}`));
    lines.push(escapeCell(`Summary Statistics: Total: ${stats.total} | New: ${stats.new} | Contacted: ${stats.contacted} | Quoted: ${stats.quoted} | Closed: ${stats.closed}`));
    lines.push(''); // Blank spacer row

    // Table Column Headers
    const headers = [
      'Lead ID',
      'Date & Time (IST)',
      'Customer Name',
      'Phone Number',
      'WhatsApp Preferred',
      'Direct WhatsApp Link',
      'Service Required',
      'Location / City Area',
      'Lead Status',
      'Lead Source',
      'Customer Note / Requirements',
    ];
    lines.push(headers.map(escapeCell).join(','));

    // Data Rows
    for (const e of recordsToExport) {
      const cleanDigits = (e.phone || '').replace(/\D/g, '');
      const cleanPhoneWithPlus = (e.phone || '').startsWith('+')
        ? e.phone
        : `+91${cleanDigits.slice(-10)}`;
      const waLink = cleanDigits ? `https://wa.me/${cleanDigits}` : 'N/A';

      const dateFormatted = new Date(e.created_at).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      const row = [
        e.id,
        dateFormatted,
        e.name,
        `="${cleanPhoneWithPlus}"`, // Enforces text formatting to keep + and leading zeros
        e.whatsapp_preference ? 'YES' : 'NO',
        waLink,
        e.service_name || 'General Core Cutting',
        e.location,
        e.status.toUpperCase(),
        e.source === 'ai_assistant'
          ? 'Priya AI Voice/Chat'
          : e.source === 'admin_manual'
          ? 'Manual Phone Lead'
          : 'Website Quote Form',
        e.message || 'No additional note provided',
      ];

      lines.push(row.map(escapeCell).join(','));
    }

    const csvContent = BOM + lines.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CoreCutting_Leads_Report_${fileTimestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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

  const getSourceBadge = (source?: string) => {
    switch (source) {
      case 'ai_assistant':
        return { label: 'Priya AI Voice/Chat', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' };
      case 'admin_manual':
        return { label: 'Phone/Manual Entry', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' };
      default:
        return { label: 'Website Quote Form', color: 'bg-slate-800 text-slate-300 border-slate-700' };
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
              <p className="text-xs text-slate-400">Owner Lead Management &amp; Customer CRM</p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <div className="hidden md:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-bold text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Auto-Sync Active</span>
            </div>

            {/* Quick Add Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-brand-orange to-amber-500 hover:from-brand-orange-hover hover:to-amber-600 text-xs font-black text-white shadow-orange-glow transition-all active:scale-95"
              title="Add manual enquiry or booking"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Enquiry</span>
            </button>

            <button
              onClick={() => handleExportCSV(false)}
              disabled={enquiries.length === 0}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-100 hover:text-white transition-all disabled:opacity-40 active:scale-95 shadow-xs"
              title="Download professional CSV report of leads"
            >
              <Download className="h-4 w-4 text-brand-orange" />
              <span className="hidden sm:inline">Download CSV</span>
              <span className="sm:hidden">CSV</span>
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
              <p className="text-sm font-medium">Loading customer messages &amp; quote requests...</p>
            </div>
          ) : enquiries.length === 0 ? (
            <div className="bg-[#12151B] border border-slate-800 rounded-3xl p-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-4">
              <div className="h-14 w-14 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
                <FileText className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">No Customer Enquiries in &quot;{statusFilter}&quot;</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  New submissions from the website quote form, contact page, and Priya AI Assistant will appear here in real-time.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleQuickTestEnquiry}
                  className="px-4 py-2 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold shadow-orange-glow transition-all active:scale-95"
                >
                  ⚡ Send Test Enquiry
                </button>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#181E28] hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-all"
                >
                  + Add Manual Lead
                </button>
              </div>
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
              const sourceInfo = getSourceBadge(enquiry.source);

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
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] border ${sourceInfo.color}`}
                        >
                          {sourceInfo.label}
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

                    {/* Right: Quick Action Buttons, Status Selector & Delete */}
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

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(enquiry.id)}
                        disabled={isUpdating === enquiry.id}
                        className="p-2 rounded-xl bg-slate-800/80 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700/60 transition-all"
                        title="Delete Enquiry"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Manual Add / Test Enquiry Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#12151B] border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-brand-orange/20 text-brand-orange flex items-center justify-center font-bold">
                  +
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Add Customer Enquiry</h3>
                  <p className="text-xs text-slate-400">Log a manual call lead or test quote</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 text-xs flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            {modalSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs flex items-center space-x-2">
                <Check className="h-4 w-4 shrink-0" />
                <span>{modalSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateEnquiry} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Bhai"
                  value={newEnquiryData.name}
                  onChange={(e) => setNewEnquiryData({ ...newEnquiryData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#090C11] border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={newEnquiryData.phone}
                  onChange={(e) => setNewEnquiryData({ ...newEnquiryData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#090C11] border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">
                    Service Required
                  </label>
                  <select
                    value={newEnquiryData.serviceId}
                    onChange={(e) => setNewEnquiryData({ ...newEnquiryData, serviceId: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#090C11] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-brand-orange"
                  >
                    <option value="ac-core-cutting">AC Core Cutting</option>
                    <option value="rcc-core-cutting">RCC Core Cutting</option>
                    <option value="ac-drain-hole">AC Drain Hole</option>
                    <option value="concrete-wall-drilling">Concrete Wall Drilling</option>
                    <option value="pipe-cable-passage">Pipe &amp; Cable Passage</option>
                    <option value="other">Other Services</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">
                    Area / Location *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alkapuri, Vadodara"
                    value={newEnquiryData.location}
                    onChange={(e) => setNewEnquiryData({ ...newEnquiryData, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#090C11] border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-orange"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">
                  Job Requirement / Message
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. 2 holes required on 2nd floor balcony wall"
                  value={newEnquiryData.message}
                  onChange={(e) => setNewEnquiryData({ ...newEnquiryData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#090C11] border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="modalWaPref"
                  checked={newEnquiryData.whatsappPreference}
                  onChange={(e) => setNewEnquiryData({ ...newEnquiryData, whatsappPreference: e.target.checked })}
                  className="h-4 w-4 rounded bg-slate-800 border-slate-700 text-brand-orange accent-[#FA4A14]"
                />
                <label htmlFor="modalWaPref" className="text-slate-300 font-medium">
                  Customer prefers WhatsApp communication
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-5 py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white font-extrabold shadow-orange-glow disabled:opacity-50"
                >
                  {modalLoading ? 'Saving...' : 'Save Enquiry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
