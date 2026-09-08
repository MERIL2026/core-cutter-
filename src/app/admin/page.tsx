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
  Calendar,
  DollarSign,
  Calculator,
  Tag,
  Share2,
  Printer,
  ChevronRight,
  Bell,
  Wrench,
  Edit3,
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
  quote_amount?: number | null;
  collected_amount?: number | null;
  scheduled_date?: string | null;
  scheduled_time?: string | null;
  assigned_technician?: string | null;
  internal_notes?: string | null;
  followup_date?: string | null;
}

interface Stats {
  total: number;
  new: number;
  contacted: number;
  quoted: number;
  closed: number;
  spam: number;
  today: number;
  totalRevenue: number;
  pipelineValue: number;
  scheduledCount: number;
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
    totalRevenue: 0,
    pipelineValue: 0,
    scheduledCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // 1. Add Lead Modal
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

  // 2. Quotation Generator Modal
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteEnquiry, setQuoteEnquiry] = useState<Enquiry | null>(null);
  const [quoteDetails, setQuoteDetails] = useState({
    holeSize: '3 Inch (75mm)',
    material: 'Brick Wall (₹350/hole)',
    ratePerHole: 350,
    holesCount: 3,
    dustCatchingCharge: 200,
    scaffoldingCharge: 0,
    discountAmount: 0,
    includeGst: false,
    customNote: 'Diamond core cutting with water & dust protection.',
  });

  // 3. WhatsApp Quick Templates Modal
  const [isWaModalOpen, setIsWaModalOpen] = useState(false);
  const [waEnquiry, setWaEnquiry] = useState<Enquiry | null>(null);
  const [waLanguage, setWaLanguage] = useState<'gu' | 'hi' | 'en'>('gu');
  const [customWaMessage, setCustomWaMessage] = useState('');

  // 4. Job Scheduling & Technician Modal
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleEnquiry, setScheduleEnquiry] = useState<Enquiry | null>(null);
  const [scheduleData, setScheduleData] = useState({
    date: new Date().toISOString().split('T')[0],
    timeSlot: 'Morning (09:00 AM - 12:00 PM)',
    technician: 'Raju Team (Lead Cutter)',
    notes: '',
  });

  // 5. Notes & Follow-up Drawer
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [notesEnquiry, setNotesEnquiry] = useState<Enquiry | null>(null);
  const [notesData, setNotesData] = useState({
    notes: '',
    followupDate: '',
    collectedAmount: 0,
  });

  const fetchEnquiries = useCallback(async (isBackground = false) => {
    if (!isBackground) setIsLoading(true);
    try {
      let url = `/api/admin/enquiries?status=${statusFilter}`;
      if (statusFilter === 'scheduled') {
        url = `/api/admin/enquiries?scheduled=true`;
      }
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
      }
    } catch (err) {
      console.error('Failed to fetch enquiries:', err);
    } finally {
      if (!isBackground) setIsLoading(false);
    }
  }, [statusFilter, searchQuery, router]);

  useEffect(() => {
    fetchEnquiries();
    const timer = setInterval(() => {
      fetchEnquiries(true);
    }, 4000);
    return () => clearInterval(timer);
  }, [fetchEnquiries]);

  const handleUpdateField = async (id: string, updates: Partial<Enquiry>) => {
    setIsUpdating(id);
    try {
      const res = await fetch('/api/admin/enquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id, ...updates }),
      });

      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
        );
        fetchEnquiries(true);
      }
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleStatusChange = async (id: string, status: Enquiry['status']) => {
    return handleUpdateField(id, { status });
  };

  const handleExportCSV = (exportAll = false) => {
    if (enquiries.length === 0) return;
    const headers = ['Date', 'Name', 'Phone', 'Service', 'Location', 'Status', 'Quoted', 'Paid'];
    const rows = enquiries.map((e) => [
      new Date(e.created_at).toLocaleString('en-IN'),
      `"${e.name}"`,
      `"${e.phone}"`,
      `"${e.service_name || 'Core Cutting'}"`,
      `"${e.location}"`,
      e.status.toUpperCase(),
      e.quote_amount || 0,
      e.collected_amount || 0,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `CoreCutting_Leads_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      setModalError('Please enter customer name.');
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

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // 1. Calculate Quote Total
  const subtotal = quoteDetails.ratePerHole * quoteDetails.holesCount + quoteDetails.dustCatchingCharge + quoteDetails.scaffoldingCharge;
  const quoteTotal = Math.max(0, subtotal - quoteDetails.discountAmount);

  // Save Quotation to Lead & update status
  const handleSaveQuotation = async () => {
    if (!quoteEnquiry) return;
    await handleUpdateField(quoteEnquiry.id, {
      quote_amount: quoteTotal,
      status: 'quoted',
    });
    setIsQuoteModalOpen(false);
  };

  // Generate Formal PDF Quotation
  const handlePrintQuotationPDF = () => {
    if (!quoteEnquiry) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Quotation_${quoteEnquiry.name.replace(/\s+/g, '_')}</title>
        <style>
          @page { size: A4 portrait; margin: 15mm; }
          body { font-family: -apple-system, sans-serif; color: #0f172a; padding: 20px; font-size: 13px; line-height: 1.5; }
          .header { border-bottom: 3px solid #ea580c; padding-bottom: 15px; display: flex; justify-content: space-between; }
          .title { font-size: 22px; font-weight: 900; color: #0f172a; }
          .badge { background: #ea580c; color: white; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; }
          .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 25px 0; background: #f8fafc; padding: 15px; border-radius: 8px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th { background: #0f172a; color: white; padding: 10px; text-align: left; font-size: 11px; text-transform: uppercase; }
          td { padding: 12px 10px; border-bottom: 1px solid #e2e8f0; }
          .total-box { margin-left: auto; width: 280px; background: #f1f5f9; padding: 15px; border-radius: 8px; margin-top: 15px; }
          .total-row { display: flex; justify-content: space-between; margin-bottom: 5px; font-weight: 600; }
          .grand-total { font-size: 18px; font-weight: 900; color: #ea580c; border-top: 2px solid #cbd5e1; padding-top: 8px; margin-top: 8px; }
          .terms { margin-top: 30px; font-size: 11px; color: #64748b; background: #fff7ed; border: 1px solid #fed7aa; padding: 12px; border-radius: 6px; }
          @media print { .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">${defaultBusinessProfile.business_name}</div>
            <div style="color: #64748b; font-size: 11px;">Professional Diamond Core Cutting & RCC Drilling Services</div>
            <div style="margin-top: 4px; font-size: 11px; font-weight: 600;">Phone: +91 9876543210 • Location: ${defaultBusinessProfile.city}, Gujarat</div>
          </div>
          <div style="text-align: right;">
            <span class="badge">OFFICIAL ESTIMATE</span>
            <div style="font-size: 11px; margin-top: 8px; color: #64748b;">Date: ${new Date().toLocaleDateString('en-IN')}</div>
            <div style="font-size: 11px; font-weight: bold;">Estimate #: EST-${Date.now().toString().slice(-6)}</div>
          </div>
        </div>

        <div class="details-grid">
          <div>
            <strong style="color: #64748b; font-size: 10px; text-transform: uppercase;">Quotation For:</strong>
            <div style="font-size: 15px; font-weight: 800; margin-top: 3px;">${quoteEnquiry.name}</div>
            <div style="font-weight: 600; color: #334155;">📞 ${quoteEnquiry.phone}</div>
            <div style="color: #64748b;">📍 ${quoteEnquiry.location}</div>
          </div>
          <div>
            <strong style="color: #64748b; font-size: 10px; text-transform: uppercase;">Job Specification:</strong>
            <div style="font-weight: 700; margin-top: 3px;">Service: ${quoteEnquiry.service_name || 'AC Core Cutting'}</div>
            <div style="color: #475569;">Hole Diameter: ${quoteDetails.holeSize}</div>
            <div style="color: #475569;">Wall Structure: ${quoteDetails.material}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Rate</th>
              <th style="text-align: right;">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Diamond Core Hole Cutting</strong><br/><span style="font-size: 11px; color: #64748b;">Size: ${quoteDetails.holeSize} in ${quoteDetails.material} (Zero vibration, smooth finish)</span></td>
              <td style="text-align: center; font-weight: bold;">${quoteDetails.holesCount}</td>
              <td style="text-align: right;">₹${quoteDetails.ratePerHole}</td>
              <td style="text-align: right; font-weight: bold;">₹${quoteDetails.ratePerHole * quoteDetails.holesCount}</td>
            </tr>
            ${quoteDetails.dustCatchingCharge > 0 ? `
            <tr>
              <td>Slurry & Dust Collector Protection Attachment</td>
              <td style="text-align: center;">1 Job</td>
              <td style="text-align: right;">₹${quoteDetails.dustCatchingCharge}</td>
              <td style="text-align: right; font-weight: bold;">₹${quoteDetails.dustCatchingCharge}</td>
            </tr>` : ''}
            ${quoteDetails.scaffoldingCharge > 0 ? `
            <tr>
              <td>High-Reach / Scaffolding Setup Charge</td>
              <td style="text-align: center;">1 Site</td>
              <td style="text-align: right;">₹${quoteDetails.scaffoldingCharge}</td>
              <td style="text-align: right; font-weight: bold;">₹${quoteDetails.scaffoldingCharge}</td>
            </tr>` : ''}
          </tbody>
        </table>

        <div class="total-box">
          <div class="total-row"><span>Subtotal:</span> <span>₹${subtotal}</span></div>
          ${quoteDetails.discountAmount > 0 ? `<div class="total-row" style="color: #16a34a;"><span>Discount:</span> <span>-₹${quoteDetails.discountAmount}</span></div>` : ''}
          <div class="total-row grand-total"><span>Total Estimate:</span> <span>₹${quoteTotal}</span></div>
        </div>

        <div class="terms">
          <strong>Terms & Site Prerequisites:</strong>
          <ul style="margin: 5px 0 0 15px; padding: 0;">
            <li>Customer to provide standard single-phase 230V (15A) electric point and regular water tap supply near cutting point.</li>
            <li>No structural beam or rebar cuts will be performed without homeowner/engineer consent.</li>
            <li>Estimate valid for 15 days from date of issue.</li>
          </ul>
        </div>

        <div style="margin-top: 40px; display: flex; justify-content: space-between; font-size: 11px; color: #64748b;">
          <div>Prepared By: <strong>Management Office</strong></div>
          <div style="border-top: 1px solid #94a3b8; padding-top: 5px; width: 180px; text-align: center;">Authorized Signature</div>
        </div>

        <script>window.onload = function() { setTimeout(function() { window.print(); }, 400); };</script>
      </body>
      </html>
    `;
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  // Quick WhatsApp Template Generator
  const openWhatsAppModal = (enquiry: Enquiry) => {
    setWaEnquiry(enquiry);
    updateWaMessage('gu', enquiry);
    setIsWaModalOpen(true);
  };

  const updateWaMessage = (lang: 'gu' | 'hi' | 'en', enq?: Enquiry | null) => {
    const target = enq || waEnquiry;
    if (!target) return;
    setWaLanguage(lang);

    const sName = target.service_name || 'Core Cutting';
    const amount = target.quote_amount ? `₹${target.quote_amount}` : 'ખાસ ડિસ્કાઉન્ટેડ રેટ';

    if (lang === 'gu') {
      setCustomWaMessage(
        `નમસ્તે ${target.name} જી! 🙏\n` +
        `ડાયમંડ કોર કટીંગ સેવાઓ માટે આપનો આભાર.\n` +
        `તમારા સ્થળ (${target.location}) પર ${sName} માટે અંદાજિત કિંમત: ${amount} છે.\n\n` +
        `• ઝીરો વાઇબ્રેશન & સ્મૂથ ફિનિશિંગ\n` +
        `• વોટર અને ડસ્ટ કલેક્ટર સુવિધા\n\n` +
        `શું આપણે ટેકનિશિયનની સાઇટ વિઝિટ શેડ્યૂલ કરીએ?`
      );
    } else if (lang === 'hi') {
      setCustomWaMessage(
        `नमस्ते ${target.name} जी! 🙏\n` +
        `डायमंड कोर कटिंग सर्विस के लिए आपका धन्यवाद।\n` +
        `आपके लोकेशन (${target.location}) पर ${sName} का अनुमानित कोटेशन: ${amount} है।\n\n` +
        `• 0% वाइब्रेशन, बिना किसी दरार के स्मूथ होल\n` +
        `• धूल और पानी प्रोटेक्शन के साथ\n\n` +
        `क्या हम कल के लिए टेक्नीशियन विज़िट बुक करें?`
      );
    } else {
      setCustomWaMessage(
        `Hello ${target.name}! 🙏\n` +
        `Thank you for contacting ${defaultBusinessProfile.business_name}.\n` +
        `Quotation for ${sName} at ${target.location}: ${amount}.\n\n` +
        `• Diamond Core Precision (Zero Vibration)\n` +
        `• Clean slurry & dust containment\n\n` +
        `Would you like us to schedule a technician visit?`
      );
    }
  };

  const handleSendWa = () => {
    if (!waEnquiry) return;
    const cleanPhone = waEnquiry.phone.replace(/\D/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(customWaMessage)}`;
    window.open(url, '_blank');
    setIsWaModalOpen(false);
  };

  // Job Scheduling Save
  const handleSaveSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleEnquiry) return;
    await handleUpdateField(scheduleEnquiry.id, {
      scheduled_date: scheduleData.date,
      scheduled_time: scheduleData.timeSlot,
      assigned_technician: scheduleData.technician,
      internal_notes: scheduleData.notes || scheduleEnquiry.internal_notes,
      status: scheduleEnquiry.status === 'new' ? 'contacted' : scheduleEnquiry.status,
    });
    setIsScheduleModalOpen(false);
  };

  // Notes & Payment Save
  const handleSaveNotes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notesEnquiry) return;
    await handleUpdateField(notesEnquiry.id, {
      internal_notes: notesData.notes,
      followup_date: notesData.followupDate || null,
      collected_amount: Number(notesData.collectedAmount) || null,
    });
    setIsNotesModalOpen(false);
  };

  // Export Full PDF Leads Report
  const handleExportPDF = () => {
    if (enquiries.length === 0) {
      alert('No enquiries to export.');
      return;
    }

    const generatedAt = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const tableRowsHtml = enquiries
      .map((e, index) => {
        const cleanPhone = e.phone || 'N/A';
        const dateFormatted = new Date(e.created_at).toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        const statusColor =
          e.status === 'new'
            ? '#ea580c'
            : e.status === 'contacted'
            ? '#2563eb'
            : e.status === 'quoted'
            ? '#d97706'
            : e.status === 'closed'
            ? '#16a34a'
            : '#dc2626';

        return `
          <tr style="border-bottom: 1px solid #e2e8f0; background: ${index % 2 === 0 ? '#ffffff' : '#f8fafc'};">
            <td style="padding: 10px 8px; font-weight: 700; color: #0f172a; font-size: 11px;">#${index + 1}</td>
            <td style="padding: 10px 8px; font-size: 11px; color: #475569; white-space: nowrap;">${dateFormatted}</td>
            <td style="padding: 10px 8px; font-weight: 700; color: #0f172a; font-size: 12px;">${e.name}</td>
            <td style="padding: 10px 8px; font-size: 12px; font-weight: 600; color: #1e293b; white-space: nowrap;">
              ${cleanPhone}
              ${e.whatsapp_preference ? '<span style="display:inline-block; margin-left:4px; font-size:9px; background:#dcfce7; color:#166534; padding:2px 5px; border-radius:4px; font-weight:700;">WA</span>' : ''}
            </td>
            <td style="padding: 10px 8px; font-size: 11px; color: #334155; font-weight: 600;">${e.service_name || 'General Core Cutting'}</td>
            <td style="padding: 10px 8px; font-size: 11px; color: #475569;">${e.location}</td>
            <td style="padding: 10px 8px; text-align: center;">
              <span style="display: inline-block; padding: 3px 8px; border-radius: 9999px; font-size: 10px; font-weight: 800; text-transform: uppercase; color: #ffffff; background: ${statusColor};">
                ${e.status}
              </span>
            </td>
            <td style="padding: 10px 8px; font-size: 11px; font-weight: bold; color: #0f172a;">
              ${e.collected_amount ? `₹${e.collected_amount} (Paid)` : e.quote_amount ? `₹${e.quote_amount} (Quoted)` : '-'}
            </td>
            <td style="padding: 10px 8px; font-size: 11px; color: #64748b; max-width: 200px;">
              ${e.scheduled_date ? `📅 <strong>${e.scheduled_date} (${e.scheduled_time || ''})</strong><br/>` : ''}
              ${e.message || 'No additional note'}
            </td>
          </tr>
        `;
      })
      .join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <title>Core_Cutting_Leads_Report_${new Date().toISOString().split('T')[0]}</title>
        <style>
          @page { size: A4 landscape; margin: 10mm 12mm 12mm 12mm; }
          * { box-sizing: border-box; print-color-adjust: exact !important; }
          body { font-family: -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 20px; font-size: 12px; }
          .header-card { background: #0f172a; color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
          .kpi-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; margin-bottom: 20px; }
          .kpi-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px; border-radius: 8px; text-align: center; }
          table { width: 100%; border-collapse: collapse; font-size: 11px; }
          th { background: #0f172a; color: white; padding: 10px 8px; text-align: left; font-size: 10px; text-transform: uppercase; }
          @media print { .no-print { display: none !important; } body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="header-card">
          <div>
            <h1 style="font-size: 20px; margin: 0;">${defaultBusinessProfile.business_name} • CRM Report</h1>
            <p style="font-size: 11px; color: #94a3b8; margin: 4px 0 0 0;">Diamond Core Cutting & RCC Drilling Services</p>
          </div>
          <div style="text-align: right; font-size: 11px;">
            <div>Generated: <strong>${generatedAt}</strong></div>
            <div style="color: #94a3b8;">Revenue: <strong>₹${stats.totalRevenue.toLocaleString('en-IN')}</strong> | Records: <strong>${enquiries.length}</strong></div>
          </div>
        </div>

        <div class="kpi-grid">
          <div class="kpi-box"><div style="font-size: 9px; color: #64748b; font-weight: bold;">TOTAL LEADS</div><div style="font-size: 18px; font-weight: 900;">${stats.total}</div></div>
          <div class="kpi-box" style="border-color: #ea580c; background: #fff7ed;"><div style="font-size: 9px; color: #ea580c; font-weight: bold;">NEW LEADS</div><div style="font-size: 18px; font-weight: 900; color: #ea580c;">${stats.new}</div></div>
          <div class="kpi-box"><div style="font-size: 9px; color: #2563eb; font-weight: bold;">SCHEDULED</div><div style="font-size: 18px; font-weight: 900; color: #2563eb;">${stats.scheduledCount}</div></div>
          <div class="kpi-box"><div style="font-size: 9px; color: #d97706; font-weight: bold;">PIPELINE QUOTED</div><div style="font-size: 18px; font-weight: 900; color: #d97706;">₹${stats.pipelineValue.toLocaleString('en-IN')}</div></div>
          <div class="kpi-box" style="border-color: #16a34a; background: #f0fdf4;"><div style="font-size: 9px; color: #16a34a; font-weight: bold;">TOTAL EARNINGS</div><div style="font-size: 18px; font-weight: 900; color: #16a34a;">₹${stats.totalRevenue.toLocaleString('en-IN')}</div></div>
          <div class="kpi-box"><div style="font-size: 9px; color: #7c3aed; font-weight: bold;">TODAY</div><div style="font-size: 18px; font-weight: 900; color: #7c3aed;">${stats.today}</div></div>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Date & Time</th>
              <th>Customer Name</th>
              <th>Phone</th>
              <th>Service</th>
              <th>Location</th>
              <th style="text-align: center;">Status</th>
              <th>Value</th>
              <th>Details & Notes</th>
            </tr>
          </thead>
          <tbody>
            ${tableRowsHtml}
          </tbody>
        </table>
        <script>window.onload = function() { setTimeout(function() { window.print(); }, 400); };</script>
      </body>
      </html>
    `;
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const getStatusBadge = (status: Enquiry['status']) => {
    switch (status) {
      case 'new':
        return 'bg-brand-orange/20 text-brand-orange border-brand-orange/40 font-bold';
      case 'contacted':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40 font-bold';
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
      {/* Top Header Navbar */}
      <header className="bg-[#12151B] border-b border-slate-800 px-4 sm:px-6 py-4 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
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
                  CRM Pro
                </span>
              </div>
              <p className="text-xs text-slate-400">Lead Management, Quotations &amp; Job Dispatch</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-brand-orange to-amber-500 hover:from-brand-orange-hover hover:to-amber-600 text-xs font-black text-white shadow-orange-glow transition-all active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Lead</span>
            </button>

            <button
              onClick={handleExportPDF}
              disabled={enquiries.length === 0}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-xs font-black text-red-300 hover:text-white transition-all disabled:opacity-40 active:scale-95"
              title="Download official PDF report of leads"
            >
              <FileText className="h-4 w-4 text-red-400" />
              <span className="hidden md:inline">Download PDF Report</span>
              <span className="md:hidden">PDF</span>
            </button>

            <button
              onClick={() => fetchEnquiries(false)}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#181E28] hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-all"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin text-brand-orange' : ''}`} />
              <span className="hidden lg:inline">Refresh</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-400 text-xs font-bold transition-all"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex-1 space-y-6">
        {/* KPI Dashboard Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="bg-[#12151B] border border-slate-800 rounded-2xl p-4 shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Inquiries</span>
            <div className="text-2xl font-black text-white mt-1">{stats.total}</div>
          </div>

          <div className="bg-[#12151B] border border-brand-orange/40 rounded-2xl p-4 shadow-orange-glow/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-10 w-10 bg-brand-orange/10 rounded-bl-2xl flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-brand-orange" />
            </div>
            <span className="text-[10px] font-bold text-brand-orange uppercase tracking-wider">New Leads</span>
            <div className="text-2xl font-black text-brand-orange mt-1">{stats.new}</div>
          </div>

          <div className="bg-[#12151B] border border-blue-500/40 rounded-2xl p-4 shadow-sm">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Scheduled Jobs</span>
            <div className="text-2xl font-black text-blue-400 mt-1">{stats.scheduledCount}</div>
          </div>

          <div className="bg-[#12151B] border border-amber-500/40 rounded-2xl p-4 shadow-sm">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Pipeline Quoted</span>
            <div className="text-2xl font-black text-amber-400 mt-1">₹{stats.pipelineValue.toLocaleString('en-IN')}</div>
          </div>

          <div className="bg-[#12151B] border border-emerald-500/40 rounded-2xl p-4 shadow-sm bg-gradient-to-br from-[#12151B] to-emerald-950/20">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Total Revenue</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">₹{stats.totalRevenue.toLocaleString('en-IN')}</div>
          </div>

          <div className="bg-[#12151B] border border-purple-500/40 rounded-2xl p-4 shadow-sm">
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Today (24h)</span>
            <div className="text-2xl font-black text-purple-400 mt-1">{stats.today}</div>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="bg-[#12151B] border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between shadow-sm">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar pb-1 md:pb-0">
            {[
              { key: 'all', label: `All (${stats.total})` },
              { key: 'new', label: `New (${stats.new})` },
              { key: 'scheduled', label: `📅 Scheduled (${stats.scheduledCount})` },
              { key: 'quoted', label: `Quoted (${stats.quoted})` },
              { key: 'closed', label: `Closed (${stats.closed})` },
              { key: 'spam', label: 'Spam' },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setStatusFilter(t.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  statusFilter === t.key
                    ? 'bg-brand-orange text-white shadow-orange-glow'
                    : 'bg-[#181E28] text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="h-4 w-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, phone, area, technician..."
              className="w-full pl-9 pr-4 py-2 bg-[#090C11] border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-orange"
            />
          </div>
        </div>

        {/* Enquiries Cards List */}
        <div className="space-y-4">
          {isLoading && enquiries.length === 0 ? (
            <div className="bg-[#12151B] border border-slate-800 rounded-3xl p-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="h-8 w-8 text-brand-orange animate-spin" />
              <p className="text-sm font-medium">Loading customer records...</p>
            </div>
          ) : enquiries.length === 0 ? (
            <div className="bg-[#12151B] border border-slate-800 rounded-3xl p-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-4">
              <div className="h-14 w-14 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
                <FileText className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-white">No Inquiries Found in &quot;{statusFilter}&quot;</h3>
            </div>
          ) : (
            enquiries.map((enquiry) => {
              const cleanPhone = enquiry.phone.replace(/[^\d+]/g, '');
              const hasFollowupDue =
                enquiry.followup_date &&
                new Date(enquiry.followup_date).getTime() <= Date.now() + 86400000;

              return (
                <div
                  key={enquiry.id}
                  className="bg-[#12151B] border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-md transition-all space-y-4"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Customer Info Block */}
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
                        <span className="font-extrabold text-base text-white">{enquiry.name}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider border ${getStatusBadge(enquiry.status)}`}>
                          {enquiry.status}
                        </span>

                        {enquiry.scheduled_date && (
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/40 text-[10px] font-bold text-blue-300 flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>Scheduled: {enquiry.scheduled_date} ({enquiry.scheduled_time || 'General'})</span>
                          </span>
                        )}

                        {hasFollowupDue && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] font-bold text-amber-300 flex items-center space-x-1 animate-pulse">
                            <Bell className="h-3 w-3" />
                            <span>Follow-up Due</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-4 text-xs text-slate-400 flex-wrap gap-y-1">
                        <span className="font-bold text-slate-200">{enquiry.phone}</span>
                        <span className="flex items-center space-x-1 text-slate-300">
                          <MapPin className="h-3.5 w-3.5 text-brand-orange" />
                          <span>{enquiry.location}</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">
                          {enquiry.service_name || 'AC Core Cutting'}
                        </span>
                        <span className="flex items-center space-x-1 text-slate-500 text-[11px]">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(enquiry.created_at).toLocaleString('en-IN')}</span>
                        </span>
                      </div>

                      {/* Financial Value Tag */}
                      {(enquiry.quote_amount || enquiry.collected_amount) && (
                        <div className="flex items-center space-x-3 pt-1 text-xs">
                          {enquiry.quote_amount && (
                            <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold">
                              Quotation: ₹{Number(enquiry.quote_amount).toLocaleString('en-IN')}
                            </span>
                          )}
                          {enquiry.collected_amount && (
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-black">
                              Paid / Collected: ₹{Number(enquiry.collected_amount).toLocaleString('en-IN')}
                            </span>
                          )}
                          {enquiry.assigned_technician && (
                            <span className="text-slate-400 flex items-center space-x-1 text-[11px]">
                              <Wrench className="h-3 w-3 text-slate-500" />
                              <span>Tech: <strong>{enquiry.assigned_technician}</strong></span>
                            </span>
                          )}
                        </div>
                      )}

                      {/* Customer Note */}
                      {enquiry.message && (
                        <div className="mt-2 p-2.5 rounded-xl bg-[#090C11] border border-slate-800 text-xs text-slate-300">
                          <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Customer Requirement:</span>
                          {enquiry.message}
                        </div>
                      )}

                      {/* Internal Staff Notes */}
                      {enquiry.internal_notes && (
                        <div className="mt-1 p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-amber-300/90 flex items-start space-x-2">
                          <Edit3 className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-400" />
                          <span><strong>Internal Note:</strong> {enquiry.internal_notes}</span>
                        </div>
                      )}
                    </div>

                    {/* Quick CRM Action Bar */}
                    <div className="flex flex-wrap items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                      {/* 1. Quick Quotation Generator */}
                      <button
                        onClick={() => {
                          setQuoteEnquiry(enquiry);
                          setQuoteDetails((prev) => ({
                            ...prev,
                            ratePerHole: enquiry.service_id?.includes('rcc') ? 650 : 350,
                            material: enquiry.service_id?.includes('rcc') ? 'RCC Beam / Column (₹650/hole)' : 'Brick Wall (₹350/hole)',
                          }));
                          setIsQuoteModalOpen(true);
                        }}
                        className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all active:scale-95"
                        title="Create formal quote & PDF"
                      >
                        <Calculator className="h-3.5 w-3.5" />
                        <span>Quote</span>
                      </button>

                      {/* 2. WhatsApp Template Quick Reply */}
                      <button
                        onClick={() => openWhatsAppModal(enquiry)}
                        className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
                        title="Send ready WhatsApp message in Gujarati/Hindi/English"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>WhatsApp</span>
                      </button>

                      {/* 3. Schedule Visit */}
                      <button
                        onClick={() => {
                          setScheduleEnquiry(enquiry);
                          setScheduleData({
                            date: enquiry.scheduled_date || new Date().toISOString().split('T')[0],
                            timeSlot: enquiry.scheduled_time || 'Morning (09:00 AM - 12:00 PM)',
                            technician: enquiry.assigned_technician || 'Raju Team (Lead Cutter)',
                            notes: enquiry.internal_notes || '',
                          });
                          setIsScheduleModalOpen(true);
                        }}
                        className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 text-blue-300 text-xs font-bold transition-all active:scale-95"
                        title="Schedule site visit and technician"
                      >
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Schedule</span>
                      </button>

                      {/* 4. Notes & Follow-up */}
                      <button
                        onClick={() => {
                          setNotesEnquiry(enquiry);
                          setNotesData({
                            notes: enquiry.internal_notes || '',
                            followupDate: enquiry.followup_date || '',
                            collectedAmount: enquiry.collected_amount || enquiry.quote_amount || 0,
                          });
                          setIsNotesModalOpen(true);
                        }}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
                        title="Internal notes & Payment"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>

                      {/* Status Selector */}
                      <select
                        value={enquiry.status}
                        disabled={isUpdating === enquiry.id}
                        onChange={(e) => handleUpdateField(enquiry.id, { status: e.target.value as Enquiry['status'] })}
                        className="px-2.5 py-2 bg-[#090C11] border border-slate-700 rounded-xl text-xs font-bold text-slate-200 focus:outline-none focus:border-brand-orange cursor-pointer"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="quoted">Quoted</option>
                        <option value="closed">Closed / Paid</option>
                        <option value="spam">Spam</option>
                      </select>

                      {/* Direct Phone Call */}
                      <a
                        href={`tel:${cleanPhone}`}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all"
                        title="Call customer"
                      >
                        <Phone className="h-3.5 w-3.5 text-brand-orange" />
                      </a>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(enquiry.id)}
                        disabled={isUpdating === enquiry.id}
                        className="p-2 rounded-xl bg-slate-800/80 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700/60 transition-all"
                        title="Delete record"
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

      {/* ================================================================= */}
      {/* 1. QUOTATION ESTIMATOR & PDF GENERATOR MODAL */}
      {/* ================================================================= */}
      {isQuoteModalOpen && quoteEnquiry && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#12151B] border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  🧾
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Quotation Calculator for {quoteEnquiry.name}</h3>
                  <p className="text-xs text-slate-400">Generate estimate &amp; formal PDF invoice</p>
                </div>
              </div>
              <button
                onClick={() => setIsQuoteModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Hole Diameter Size</label>
                <select
                  value={quoteDetails.holeSize}
                  onChange={(e) => setQuoteDetails({ ...quoteDetails, holeSize: e.target.value })}
                  className="w-full px-3 py-2 bg-[#090C11] border border-slate-700 rounded-xl text-white"
                >
                  <option value="2 Inch (50mm)">2 Inch (50mm)</option>
                  <option value="2.5 Inch (63mm)">2.5 Inch (63mm)</option>
                  <option value="3 Inch (75mm)">3 Inch (75mm - Standard AC)</option>
                  <option value="4 Inch (100mm)">4 Inch (100mm - Drain/Plumbing)</option>
                  <option value="5 Inch (125mm)">5 Inch (125mm)</option>
                  <option value="6 Inch (150mm)">6 Inch (150mm - Chimney/Duct)</option>
                  <option value="8 Inch (200mm)">8 Inch (200mm - Heavy RCC)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Wall / RCC Material</label>
                <select
                  value={quoteDetails.ratePerHole}
                  onChange={(e) => setQuoteDetails({ ...quoteDetails, ratePerHole: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#090C11] border border-slate-700 rounded-xl text-white"
                >
                  <option value={350}>Standard Brick Wall (₹350/hole)</option>
                  <option value={450}>AAC Block / Light Concrete (₹450/hole)</option>
                  <option value={650}>Heavy RCC Beam / Column (₹650/hole)</option>
                  <option value={850}>Slab / Heavy Grade Concrete (₹850/hole)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Number of Holes</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={quoteDetails.holesCount}
                  onChange={(e) => setQuoteDetails({ ...quoteDetails, holesCount: Math.max(1, Number(e.target.value)) })}
                  className="w-full px-3 py-2 bg-[#090C11] border border-slate-700 rounded-xl text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Discount (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={quoteDetails.discountAmount}
                  onChange={(e) => setQuoteDetails({ ...quoteDetails, discountAmount: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#090C11] border border-slate-700 rounded-xl text-white"
                />
              </div>
            </div>

            {/* Total Display Box */}
            <div className="bg-[#090C11] border border-amber-500/30 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase">Estimated Total</span>
                <div className="text-2xl font-black text-amber-400">₹{quoteTotal.toLocaleString('en-IN')}</div>
              </div>
              <div className="text-right text-xs text-slate-400">
                <div>{quoteDetails.holesCount} holes × ₹{quoteDetails.ratePerHole}</div>
                <div>+ ₹{quoteDetails.dustCatchingCharge} dust &amp; water protection</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-end pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={handlePrintQuotationPDF}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center space-x-1.5"
              >
                <Printer className="h-4 w-4" />
                <span>Print / Download PDF Quote</span>
              </button>

              <button
                type="button"
                onClick={handleSaveQuotation}
                className="px-5 py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white font-black text-xs shadow-orange-glow"
              >
                💾 Save Quote (₹{quoteTotal})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 2. MULTILINGUAL WHATSAPP QUICK-REPLY MODAL */}
      {/* ================================================================= */}
      {isWaModalOpen && waEnquiry && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#12151B] border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  💬
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">WhatsApp Reply to {waEnquiry.name}</h3>
                  <p className="text-xs text-slate-400">{waEnquiry.phone} • {waEnquiry.location}</p>
                </div>
              </div>
              <button onClick={() => setIsWaModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Language Selector */}
            <div className="flex gap-2">
              <button
                onClick={() => updateWaMessage('gu')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold ${
                  waLanguage === 'gu' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                ગુજરાતી (Gujarati)
              </button>
              <button
                onClick={() => updateWaMessage('hi')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold ${
                  waLanguage === 'hi' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                हिंदी (Hindi)
              </button>
              <button
                onClick={() => updateWaMessage('en')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold ${
                  waLanguage === 'en' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                English
              </button>
            </div>

            <textarea
              rows={6}
              value={customWaMessage}
              onChange={(e) => setCustomWaMessage(e.target.value)}
              className="w-full p-3 bg-[#090C11] border border-slate-700 rounded-xl text-xs text-white leading-relaxed focus:outline-none focus:border-emerald-500"
            />

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsWaModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleSendWa}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center space-x-1.5 shadow-sm"
              >
                <Send className="h-4 w-4" />
                <span>Open in WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 3. SITE VISIT SCHEDULING & TECHNICIAN MODAL */}
      {/* ================================================================= */}
      {isScheduleModalOpen && scheduleEnquiry && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#12151B] border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                  📅
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Schedule Job: {scheduleEnquiry.name}</h3>
                  <p className="text-xs text-slate-400">Site: {scheduleEnquiry.location}</p>
                </div>
              </div>
              <button onClick={() => setIsScheduleModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSchedule} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Site Visit Date</label>
                <input
                  type="date"
                  required
                  value={scheduleData.date}
                  onChange={(e) => setScheduleData({ ...scheduleData, date: e.target.value })}
                  className="w-full px-3 py-2 bg-[#090C11] border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Time Slot</label>
                <select
                  value={scheduleData.timeSlot}
                  onChange={(e) => setScheduleData({ ...scheduleData, timeSlot: e.target.value })}
                  className="w-full px-3 py-2 bg-[#090C11] border border-slate-700 rounded-xl text-white"
                >
                  <option value="Morning (09:00 AM - 12:00 PM)">Morning (09:00 AM - 12:00 PM)</option>
                  <option value="Afternoon (12:00 PM - 03:00 PM)">Afternoon (12:00 PM - 03:00 PM)</option>
                  <option value="Evening (03:00 PM - 06:00 PM)">Evening (03:00 PM - 06:00 PM)</option>
                  <option value="Emergency Immediate Slot">Emergency Immediate Slot</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Assign Technician / Team</label>
                <select
                  value={scheduleData.technician}
                  onChange={(e) => setScheduleData({ ...scheduleData, technician: e.target.value })}
                  className="w-full px-3 py-2 bg-[#090C11] border border-slate-700 rounded-xl text-white"
                >
                  <option value="Raju Team (Lead Cutter)">Raju Team (Lead Cutter)</option>
                  <option value="Mukesh & Suresh (RCC Specialists)">Mukesh &amp; Suresh (RCC Specialists)</option>
                  <option value="Amit Core Tech">Amit Core Tech</option>
                  <option value="Owner / Self Assigned">Owner / Self Assigned</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Site Access Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. 4th floor without lift, 15A socket in gallery"
                  value={scheduleData.notes}
                  onChange={(e) => setScheduleData({ ...scheduleData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-[#090C11] border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black shadow-sm"
                >
                  Confirm Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 4. INTERNAL NOTES & PAYMENT TRACKER MODAL */}
      {/* ================================================================= */}
      {isNotesModalOpen && notesEnquiry && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#12151B] border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-slate-800 text-slate-200 flex items-center justify-center font-bold">
                  📝
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Staff Notes &amp; Payment</h3>
                  <p className="text-xs text-slate-400">{notesEnquiry.name} • {notesEnquiry.location}</p>
                </div>
              </div>
              <button onClick={() => setIsNotesModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNotes} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Amount Collected / Paid (₹)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 2500"
                  value={notesData.collectedAmount}
                  onChange={(e) => setNotesData({ ...notesData, collectedAmount: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#090C11] border border-slate-700 rounded-xl text-emerald-400 font-black text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Follow-up Reminder Date</label>
                <input
                  type="date"
                  value={notesData.followupDate}
                  onChange={(e) => setNotesData({ ...notesData, followupDate: e.target.value })}
                  className="w-full px-3 py-2 bg-[#090C11] border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Internal Private Notes</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Client agreed on ₹2,500 cash, balance ₹500 on site completion."
                  value={notesData.notes}
                  onChange={(e) => setNotesData({ ...notesData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-[#090C11] border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNotesModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black"
                >
                  Save Notes &amp; Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 5. ADD MANUAL LEAD MODAL */}
      {/* ================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#12151B] border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-brand-orange/20 text-brand-orange flex items-center justify-center font-bold">
                  +
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Add Customer Lead</h3>
                  <p className="text-xs text-slate-400">Log a manual call lead or test quote</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 text-xs">
                {modalError}
              </div>
            )}

            <form onSubmit={handleCreateEnquiry} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Patel"
                  value={newEnquiryData.name}
                  onChange={(e) => setNewEnquiryData({ ...newEnquiryData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#090C11] border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={newEnquiryData.phone}
                  onChange={(e) => setNewEnquiryData({ ...newEnquiryData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-[#090C11] border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Service</label>
                  <select
                    value={newEnquiryData.serviceId}
                    onChange={(e) => setNewEnquiryData({ ...newEnquiryData, serviceId: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090C11] border border-slate-700 rounded-xl text-white"
                  >
                    <option value="ac-core-cutting">AC Core Cutting</option>
                    <option value="rcc-core-cutting">RCC Core Cutting</option>
                    <option value="ac-drain-hole">AC Drain Hole</option>
                    <option value="concrete-wall-drilling">Concrete Wall Drilling</option>
                    <option value="pipe-cable-passage">Pipe &amp; Cable Passage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Area / Location *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gotri, Vadodara"
                    value={newEnquiryData.location}
                    onChange={(e) => setNewEnquiryData({ ...newEnquiryData, location: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090C11] border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Requirement Note</label>
                <textarea
                  rows={2}
                  placeholder="e.g. 3 holes for split AC in bedroom"
                  value={newEnquiryData.message}
                  onChange={(e) => setNewEnquiryData({ ...newEnquiryData, message: e.target.value })}
                  className="w-full px-3 py-2 bg-[#090C11] border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-5 py-2 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white font-black shadow-orange-glow"
                >
                  {modalLoading ? 'Saving...' : 'Save Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
