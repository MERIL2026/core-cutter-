'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Phone,
  MessageSquare,
  Search,
  RefreshCw,
  LogOut,
  Clock,
  MapPin,
  FileText,
  Sparkles,
  Plus,
  Trash2,
  X,
  Send,
  Calendar,
  Calculator,
  Printer,
  Bell,
  Wrench,
  Edit3,
  QrCode,
  Star,
  Map,
  Camera,
  Layers,
  Copy,
  Check,
  Download,
  DollarSign,
  TrendingUp,
  LayoutGrid,
  List as ListIcon,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  User,
  Zap,
  Receipt,
} from 'lucide-react';
import { defaultBusinessProfile } from '@/content/business';
import { BillGenerator, InitialCustomerData } from '@/components/admin/BillGenerator';

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
  site_photos?: string[] | null;
  chat_transcript?: string | null;
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

interface DiamondBit {
  id: string;
  size: string;
  application: string;
  holesCut: number;
  maxLifeHoles: number;
  status: 'optimal' | 'good' | 'warning' | 'replace';
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
  const [activeView, setActiveView] = useState<'list' | 'dispatch' | 'equipment' | 'calculator' | 'billing'>('list');
  const [layoutMode, setLayoutMode] = useState<'cards' | 'table'>('cards');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [selectedBillCustomer, setSelectedBillCustomer] = useState<InitialCustomerData | null>(null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [newEnquiryData, setNewEnquiryData] = useState({
    name: '',
    phone: '',
    whatsappPreference: true,
    serviceId: 'ac-core-cutting',
    location: defaultBusinessProfile.city || 'Vadodara',
    message: '',
  });

  // Quotation Generator Modal
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
  });

  // Job Scheduling Modal
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleEnquiry, setScheduleEnquiry] = useState<Enquiry | null>(null);
  const [scheduleData, setScheduleData] = useState({
    date: new Date().toISOString().split('T')[0],
    timeSlot: 'Morning (09:00 AM - 12:00 PM)',
    technician: 'Raju Team (Lead Cutter)',
    notes: '',
  });

  // Notes & Follow-up Drawer
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [notesEnquiry, setNotesEnquiry] = useState<Enquiry | null>(null);
  const [notesData, setNotesData] = useState({
    notes: '',
    followupDate: '',
    collectedAmount: 0,
  });

  // UPI QR Code Modal
  const [isUpiModalOpen, setIsUpiModalOpen] = useState(false);
  const [upiEnquiry, setUpiEnquiry] = useState<Enquiry | null>(null);
  const [upiAmount, setUpiAmount] = useState<number>(2500);
  const [upiCopied, setUpiCopied] = useState(false);

  // Google Review Modal
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewEnquiry, setReviewEnquiry] = useState<Enquiry | null>(null);

  // Site Photos Modal
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photoEnquiry, setPhotoEnquiry] = useState<Enquiry | null>(null);
  const [photoUrlInput, setPhotoUrlInput] = useState('');

  // AI Voice Transcript Modal
  const [isTranscriptModalOpen, setIsTranscriptModalOpen] = useState(false);
  const [transcriptEnquiry, setTranscriptEnquiry] = useState<Enquiry | null>(null);

  // WhatsApp Quick Templates Modal
  const [isWaModalOpen, setIsWaModalOpen] = useState(false);
  const [waEnquiry, setWaEnquiry] = useState<Enquiry | null>(null);
  const [waLanguage, setWaLanguage] = useState<'gu' | 'hi' | 'en'>('gu');
  const [selectedWaTemplate, setSelectedWaTemplate] = useState<string>('quote');
  const [customWaMessage, setCustomWaMessage] = useState('');

  // Quick Standalone Estimator State
  const [calcHoleSize, setCalcHoleSize] = useState('3 Inch (75mm - Standard AC)');
  const [calcMaterialRate, setCalcMaterialRate] = useState(350);
  const [calcCount, setCalcCount] = useState(2);
  const [calcDust, setCalcDust] = useState(true);
  const [calcDiscount, setCalcDiscount] = useState(0);

  // Diamond Bits State
  const [diamondBits, setDiamondBits] = useState<DiamondBit[]>([
    { id: 'bit-1', size: '2 Inch (50mm)', application: 'Plumbing & Drain Pipes', holesCut: 42, maxLifeHoles: 180, status: 'good' },
    { id: 'bit-2', size: '3 Inch (75mm)', application: 'Split AC Copper & Drain (High Demand)', holesCut: 148, maxLifeHoles: 200, status: 'warning' },
    { id: 'bit-3', size: '4 Inch (100mm)', application: 'Toilet & Waste Soil Lines', holesCut: 88, maxLifeHoles: 160, status: 'good' },
    { id: 'bit-4', size: '5 Inch (125mm)', application: 'Kitchen Hood & Commercial HVAC', holesCut: 26, maxLifeHoles: 140, status: 'optimal' },
    { id: 'bit-5', size: '6 Inch (150mm)', application: 'Heavy Chimney & Ventilation', holesCut: 65, maxLifeHoles: 120, status: 'good' },
    { id: 'bit-6', size: '8 Inch (200mm)', application: 'RCC Bridge & Industrial Core Slabs', holesCut: 14, maxLifeHoles: 100, status: 'optimal' },
  ]);

  // Live IST Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

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

  const handleExportCSV = () => {
    if (enquiries.length === 0) return;
    const headers = ['Date', 'Name', 'Phone', 'Service', 'Location', 'Status', 'Quoted (INR)', 'Paid (INR)', 'Technician', 'Notes'];
    const rows = enquiries.map((e) => [
      new Date(e.created_at).toLocaleString('en-IN'),
      `"${e.name.replace(/"/g, '""')}"`,
      `"${e.phone}"`,
      `"${(e.service_name || 'AC Core Cutting').replace(/"/g, '""')}"`,
      `"${e.location.replace(/"/g, '""')}"`,
      e.status.toUpperCase(),
      e.quote_amount || 0,
      e.collected_amount || 0,
      `"${(e.assigned_technician || '').replace(/"/g, '""')}"`,
      `"${(e.internal_notes || e.message || '').replace(/"/g, '""')}"`,
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
    if (!confirm('Are you sure you want to delete this customer record?')) return;
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

    if (!newEnquiryData.name.trim() || !newEnquiryData.phone.trim()) {
      setModalError('Customer Name and Phone are required.');
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
        setNewEnquiryData({
          name: '',
          phone: '',
          whatsappPreference: true,
          serviceId: 'ac-core-cutting',
          location: defaultBusinessProfile.city || 'Vadodara',
          message: '',
        });
        setIsAddModalOpen(false);
        fetchEnquiries(false);
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

  // Calculate Quote Total
  const subtotal = quoteDetails.ratePerHole * quoteDetails.holesCount + quoteDetails.dustCatchingCharge + quoteDetails.scaffoldingCharge;
  const quoteTotal = Math.max(0, subtotal - quoteDetails.discountAmount);

  const handleSaveQuotation = async () => {
    if (!quoteEnquiry) return;
    await handleUpdateField(quoteEnquiry.id, {
      quote_amount: quoteTotal,
      status: 'quoted',
    });
    setIsQuoteModalOpen(false);
  };

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
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f172a; padding: 20px; font-size: 13px; line-height: 1.5; }
          .header { border-bottom: 3px solid #FA4A14; padding-bottom: 15px; display: flex; justify-content: space-between; align-items: flex-start; }
          .title { font-size: 24px; font-weight: 900; color: #0f172a; letter-spacing: -0.5px; }
          .badge { background: #FA4A14; color: white; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 800; letter-spacing: 0.5px; }
          .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 25px 0; background: #f8fafc; padding: 18px; border-radius: 10px; border: 1px solid #e2e8f0; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th { background: #0f172a; color: white; padding: 10px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
          td { padding: 12px 10px; border-bottom: 1px solid #e2e8f0; }
          .total-box { margin-left: auto; width: 300px; background: #f1f5f9; padding: 16px; border-radius: 8px; margin-top: 15px; border: 1px solid #cbd5e1; }
          .total-row { display: flex; justify-content: space-between; margin-bottom: 6px; font-weight: 600; }
          .grand-total { font-size: 18px; font-weight: 900; color: #FA4A14; border-top: 2px solid #cbd5e1; padding-top: 10px; margin-top: 8px; }
          .terms { margin-top: 30px; font-size: 11px; color: #64748b; background: #fff7ed; border: 1px solid #fed7aa; padding: 14px; border-radius: 8px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">${defaultBusinessProfile.business_name}</div>
            <div style="color: #64748b; font-size: 12px; margin-top: 2px;">Professional Diamond Core Cutting & RCC Drilling Services</div>
            <div style="margin-top: 6px; font-size: 11px; font-weight: 600;">Phone: ${defaultBusinessProfile.phone || '+91 9876543210'} • Location: ${defaultBusinessProfile.city || 'Gujarat'}</div>
          </div>
          <div style="text-align: right;">
            <span class="badge">OFFICIAL ESTIMATE</span>
            <div style="font-size: 11px; margin-top: 8px; color: #64748b;">Date: ${new Date().toLocaleDateString('en-IN')}</div>
            <div style="font-size: 11px; font-weight: bold;">Estimate #: EST-${Date.now().toString().slice(-6)}</div>
          </div>
        </div>

        <div class="details-grid">
          <div>
            <strong style="color: #64748b; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px;">Quotation For:</strong>
            <div style="font-size: 16px; font-weight: 800; margin-top: 4px; color: #0f172a;">${quoteEnquiry.name}</div>
            <div style="font-weight: 600; color: #334155; margin-top: 2px;">📞 ${quoteEnquiry.phone}</div>
            <div style="color: #64748b; margin-top: 2px;">📍 ${quoteEnquiry.location}</div>
          </div>
          <div>
            <strong style="color: #64748b; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px;">Job Specification:</strong>
            <div style="font-weight: 700; margin-top: 4px; color: #0f172a;">Service: ${quoteEnquiry.service_name || 'AC Core Cutting'}</div>
            <div style="color: #475569; margin-top: 2px;">Hole Diameter: ${quoteDetails.holeSize}</div>
            <div style="color: #475569; margin-top: 2px;">Wall Structure: ${quoteDetails.material}</div>
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
              <td><strong>Diamond Core Hole Cutting</strong><br/><span style="font-size: 11px; color: #64748b;">Size: ${quoteDetails.holeSize} in ${quoteDetails.material} (Zero vibration guarantee)</span></td>
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
          </tbody>
        </table>

        <div class="total-box">
          <div class="total-row"><span>Subtotal:</span> <span>₹${subtotal}</span></div>
          ${quoteDetails.discountAmount > 0 ? `<div class="total-row" style="color: #16a34a;"><span>Discount:</span> <span>-₹${quoteDetails.discountAmount}</span></div>` : ''}
          <div class="total-row grand-total"><span>Total Estimate:</span> <span>₹${quoteTotal}</span></div>
        </div>

        <div class="terms">
          <strong>Terms & Conditions:</strong>
          <ul style="margin: 6px 0 0 16px; padding: 0;">
            <li>Customer to provide standard single-phase 230V electric point (15A) and water supply.</li>
            <li>Zero vibration guarantee protects structural integrity of walls and tiles.</li>
            <li>No structural beam cuts performed without owner/engineer consent.</li>
          </ul>
        </div>
        <script>window.onload = function() { setTimeout(function() { window.print(); }, 400); };</script>
      </body>
      </html>
    `;
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const WA_TEMPLATES = [
    { id: 'quote', title: '📋 Initial Quotation & Pricing', desc: 'Price estimate breakdown with zero-vibration guarantee' },
    { id: 'schedule', title: '📅 Site Visit Confirmation', desc: 'Date, time slot, assigned technician & power/water notice' },
    { id: 'ontheway', title: '🚗 Technician On The Way', desc: 'Live dispatch notification that cutting team has left' },
    { id: 'prep', title: '⚡ Site Preparation Checklist', desc: '230V power plug, water tap & space clearing guide' },
    { id: 'payment', title: '💳 Bill & UPI QR Payment Link', desc: 'Instant UPI pay link with exact amount & screenshot request' },
    { id: 'review', title: '⭐ Google 5-Star Review Request', desc: 'Polite review invite with direct Google Maps link' },
    { id: 'followup', title: '🔄 Special Discount Follow-Up', desc: 'Re-engagement offer with free dust collection' },
  ];

  const getTemplateContent = (templateId: string, lang: 'gu' | 'hi' | 'en', target: Enquiry): string => {
    const name = target.name || 'Customer';
    const sName = target.service_name || 'AC Core Cutting';
    const location = target.location || 'Your Site';
    const amount = target.quote_amount ? `₹${target.quote_amount}` : 'ખાસ ડિસ્કાઉન્ટ ભાવ';
    const tech = target.assigned_technician || 'અમારા સિનિયર ટેકનિશિયન (Raju Team)';
    const scheduleTime = target.scheduled_date ? `${target.scheduled_date} (${target.scheduled_time || 'સમયસર'})` : 'આવતીકાલે સવારે 10:00 AM';
    const upiLink = `upi://pay?pa=9876543210@upi&pn=Diamond+Core+Cutting&am=${target.quote_amount || 2500}&cu=INR`;
    const reviewLink = 'https://g.page/r/your-google-business-review/review';

    if (templateId === 'quote') {
      if (lang === 'gu') {
        return `નમસ્તે ${name} જી! 🙏\n${defaultBusinessProfile.business_name} તરફથી આપનું હાર્દિક સ્વાગત છે.\n\n📍 સ્થળ: ${location}\n🛠️ સેવા: ${sName}\n💰 અંદાજિત કિંમત: ${amount}\n\n✨ અમારી વિશેષતા:\n• 0% વાઇબ્રેશન - દીવાલમાં કોઈ ક્રેક નહીં પડે\n• વોટર & ડસ્ટ કલેક્ટરથી 100% ક્લીન કટીંગ\n\nશું આપણે ટેકનિશિયનની સાઇટ વિઝિટ બુક કરીએ?`;
      } else if (lang === 'hi') {
        return `नमस्ते ${name} जी! 🙏\n${defaultBusinessProfile.business_name} में आपका स्वागत है।\n\n📍 लोकेशन: ${location}\n🛠️ सर्विस: ${sName}\n💰 अनुमानित कोटेशन: ${amount}\n\n✨ हमारी खासियत:\n• 0% वाइब्रेशन - दीवार पर कोई दरार नहीं\n• वाटर और डस्ट प्रोटेक्शन के साथ स्मूथ होल\n\nक्या हम कल के लिए टेक्नीशियन विज़िट बुक करें?`;
      } else {
        return `Hello ${name}! 🙏\nThank you for contacting ${defaultBusinessProfile.business_name}.\n\n📍 Location: ${location}\n🛠️ Service: ${sName}\n💰 Estimated Quote: ${amount}\n\n✨ Key Highlights:\n• Diamond Core Precision (Zero Vibration)\n• Clean slurry & dust containment\n\nShall we schedule a technician site visit?`;
      }
    } else if (templateId === 'schedule') {
      if (lang === 'gu') {
        return `નમસ્તે ${name} જી! 📅\nતમારું કોર કટીંગ કામ કન્ફર્મ થઈ ગયું છે.\n\n📅 તારીખ & સમય: ${scheduleTime}\n👨‍🔧 ટેકનિશિયન: ${tech}\n📍 સાઇટ: ${location}\n\nકૃપા કરીને સાઇટ પર 230V સિંગલ ફેઝ પાવર (15A) અને પાણીની વ્યવસ્થા તૈયાર રાખશો. આભાર!`;
      } else if (lang === 'hi') {
        return `नमस्ते ${name} जी! 📅\nआपकी कोर कटिंग विज़िट कन्फर्म हो चुकी है।\n\n📅 समय: ${scheduleTime}\n👨‍🔧 टेक्नीशियन: ${tech}\n📍 साइट: ${location}\n\nकृपया साइट पर 230V बिजली और पानी की व्यवस्था उपलब्ध रखें। धन्यवाद!`;
      } else {
        return `Hello ${name}! 📅\nYour core cutting appointment is confirmed.\n\n📅 Date & Time: ${scheduleTime}\n👨‍🔧 Assigned Team: ${tech}\n📍 Site Location: ${location}\n\nPlease ensure 230V single phase power and water supply are ready. Thank you!`;
      }
    } else if (templateId === 'ontheway') {
      if (lang === 'gu') {
        return `નમસ્તે ${name} જી! 🚗💨\nઅમારા ટેકનિશિયન (${tech}) તમારા સ્થળ (${location}) પર પહોંચવા નીકળી ગયા છે. તેઓ ટૂંક સમયમાં સાઇટ પર પહોંચશે. સંપર્ક: +91 9876543210.`;
      } else if (lang === 'hi') {
        return `नमस्ते ${name} जी! 🚗💨\nहमारे टेक्नीशियन (${tech}) आपकी साइट (${location}) के लिए निकल चुके हैं और जल्द ही पहुंच रहे हैं। संपर्क: +91 9876543210.`;
      } else {
        return `Hello ${name}! 🚗💨\nOur technician (${tech}) is on the way to your site at ${location} and will arrive shortly. Call: +91 9876543210.`;
      }
    } else if (templateId === 'prep') {
      if (lang === 'gu') {
        return `નમસ્તે ${name} જી! ⚡💧\nકોર કટીંગ કામ શરૂ કરતા પહેલા સાઇટ પર નીચેની બાબતો તૈયાર રાખવા વિનંતી:\n\n1. 230V સિંગલ ફેઝ (15A સોકેટ) પાવર પ્લગ\n2. સામાન્ય પાણીનો નળ / બકેટ\n3. કટીંગ પોઈન્ટ આગળથી સામાન હટાવી લેવો\n\nઅમે વોટર અને ડસ્ટ કલેક્ટર સાથે કામ કરીએ છીએ જેથી ટાઇલ્સ/દીવાલ ગંદી ન થાય. આભાર!`;
      } else if (lang === 'hi') {
        return `नमस्ते ${name} जी! ⚡💧\nकोर कटिंग शुरू होने से पहले कृपया साइट पर यह तैयारी रखें:\n\n1. 230V (15A सॉकेट) पावर कनेक्शन\n2. पानी का नल / बाल्टी\n3. कटिंग पॉइंट के सामने से सामान हटा लें\n\nहम वाटर और डस्ट प्रोटेक्शन के साथ काम करते हैं। धन्यवाद!`;
      } else {
        return `Hello ${name}! ⚡💧\nSite checklist for diamond core cutting:\n\n1. 230V (15A) single phase electricity\n2. Running water supply tap / bucket\n3. Clear cutting area from furniture\n\nOur team uses dust & water catchment for 100% cleanliness. Thank you!`;
      }
    } else if (templateId === 'payment') {
      if (lang === 'gu') {
        return `નમસ્તે ${name} જી! 💳\nતમારા સ્થળ (${location}) પર કોર કટીંગ કામ પૂર્ણ થયું છે.\n\n💰 કુલ રકમ: ${amount}\n📲 UPI પેમેન્ટ લિંક (GPay / PhonePe / Paytm):\n${upiLink}\n\nપેમેન્ટ કરી સ્ક્રીનશોટ મોકલવા વિનંતી. આભાર!`;
      } else if (lang === 'hi') {
        return `नमस्ते ${name} जी! 💳\nआपकी साइट (${location}) पर कोर कटिंग का काम पूरा हो चुका है।\n\n💰 कुल बिल: ${amount}\n📲 UPI पेमेंट लिंक (GPay / PhonePe / Paytm):\n${upiLink}\n\nकृपया भुगतान के बाद स्क्रीनशॉट भेजें। धन्यवाद!`;
      } else {
        return `Hello ${name}! 💳\nCore cutting work at ${location} is completed.\n\n💰 Total Amount: ${amount}\n📲 Instant UPI Pay Link (GPay / PhonePe / Paytm):\n${upiLink}\n\nPlease share screenshot after payment. Thank you!`;
      }
    } else if (templateId === 'review') {
      if (lang === 'gu') {
        return `નમસ્તે ${name} જી! ⭐⭐⭐⭐⭐\nઅમારી સેવા પસંદ કરવા બદલ આપનો આભાર!\nજો તમને અમારું ફિનિશિંગ અને ઝીરો-વાઇબ્રેશન કામ ગમ્યું હોય, તો કૃપા કરીને અમને ગૂગલ પર 5-Star રેટિંગ આપી સપોર્ટ કરશો:\n\n👉 ${reviewLink}\n\nઆપનો ખૂબ ખૂબ આભાર! 🙏`;
      } else if (lang === 'hi') {
        return `नमस्ते ${name} जी! ⭐⭐⭐⭐⭐\nहमारी डायमंड कोर कटिंग सर्विस लेने के लिए धन्यवाद!\nयदि आपको हमारी फिनिशिंग पसंद आई हो, तो कृपया गूगल पर 5-Star रिव्यू देकर हमें सपोर्ट करें:\n\n👉 ${reviewLink}\n\nबहुत धन्यवाद! 🙏`;
      } else {
        return `Hello ${name}! ⭐⭐⭐⭐⭐\nThank you for choosing ${defaultBusinessProfile.business_name}!\nIf you loved our clean and zero-vibration workmanship, please give us a 5-Star review on Google:\n\n👉 ${reviewLink}\n\nThank you! 🙏`;
      }
    } else if (templateId === 'followup') {
      if (lang === 'gu') {
        return `નમસ્તે ${name} જી! 🎁\nઅગાઉ તમે ${sName} માટે પૂછપરછ કરી હતી.\nજો તમે આ અઠવાડિયે બુકિંગ કરશો તો અમે તમને **10% સ્પેશિયલ ડિસ્કાઉન્ટ** અને **ફ્રી ડસ્ટ કલેક્ટર પ્રોટેક્શન** આપીશું!\n\nશું આપણે કાલે વિઝિટ શેડ્યૂલ કરીએ?`;
      } else if (lang === 'hi') {
        return `नमस्ते ${name} जी! 🎁\nआपने पहले ${sName} के लिए जानकारी ली थी।\nयदि आप इस सप्ताह काम बुक करते हैं, तो हम आपको **10% स्पेशल डिस्काउंट** देंगे!\n\nक्या हम कल विज़िट बुक करें?`;
      } else {
        return `Hello ${name}! 🎁\nFollowing up regarding your inquiry for ${sName}.\nBook your core cutting this week to get **10% Special Discount** + **Free Dust Collection**!\n\nShall we schedule tomorrow?`;
      }
    }
    return `Hello ${name}!`;
  };

  const openWhatsAppModal = (enquiry: Enquiry) => {
    setWaEnquiry(enquiry);
    setSelectedWaTemplate('quote');
    setWaLanguage('gu');
    setCustomWaMessage(getTemplateContent('quote', 'gu', enquiry));
    setIsWaModalOpen(true);
  };

  const selectTemplateAndLang = (templateId: string, lang: 'gu' | 'hi' | 'en') => {
    if (!waEnquiry) return;
    setSelectedWaTemplate(templateId);
    setWaLanguage(lang);
    setCustomWaMessage(getTemplateContent(templateId, lang, waEnquiry));
  };

  const handleSendWa = () => {
    if (!waEnquiry) return;
    const cleanPhone = waEnquiry.phone.replace(/\D/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(customWaMessage)}`;
    window.open(url, '_blank');
    setIsWaModalOpen(false);
  };

  const openUpiModal = (enquiry: Enquiry) => {
    setUpiEnquiry(enquiry);
    setUpiAmount(enquiry.quote_amount || enquiry.collected_amount || 2500);
    setUpiCopied(false);
    setIsUpiModalOpen(true);
  };

  const upiId = '9876543210@upi';
  const upiPayUrl = `upi://pay?pa=${upiId}&pn=Diamond+Core+Cutting&am=${upiAmount}&cu=INR&tn=CoreCutting_${upiEnquiry?.name.replace(/\s+/g, '_') || 'Job'}`;
  const upiQrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiPayUrl)}`;

  const openReviewModal = (enquiry: Enquiry) => {
    setReviewEnquiry(enquiry);
    setIsReviewModalOpen(true);
  };

  const handleSendGoogleReview = (lang: 'gu' | 'hi' | 'en') => {
    if (!reviewEnquiry) return;
    const cleanPhone = reviewEnquiry.phone.replace(/\D/g, '');
    const reviewLink = 'https://g.page/r/your-google-business-review/review';

    let text = '';
    if (lang === 'gu') {
      text = `નમસ્તે ${reviewEnquiry.name} જી! 🙏\nઅમારી ડાયમંડ કોર કટીંગ સેવા પસંદ કરવા બદલ આભાર.\nજો તમને અમારું કામ અને સફાઈ ગમી હોય, તો કૃપા કરીને અમને ગૂગલ પર 5-Star રેટિંગ આપી સપોર્ટ કરો:\n⭐ ${reviewLink}\n\nઆપનો ખૂબ ખૂબ આભાર!`;
    } else if (lang === 'hi') {
      text = `नमस्ते ${reviewEnquiry.name} जी! 🙏\nडायमंड कोर कटिंग सर्विस लेने के लिए धन्यवाद।\nयदि आपको हमारा काम और फिनिशिंग पसंद आई हो, तो कृपया हमें गूगल पर 5-Star रेटिंग देकर सपोर्ट करें:\n⭐ ${reviewLink}\n\nआपका बहुत धन्यवाद!`;
    } else {
      text = `Hello ${reviewEnquiry.name}! 🙏\nThank you for choosing ${defaultBusinessProfile.business_name}.\nIf you liked our zero-vibration core cutting work, please take 10 seconds to give us a 5-Star review on Google:\n⭐ ${reviewLink}\n\nThank you!`;
    }

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
    setIsReviewModalOpen(false);
  };

  const handleAddPhoto = async () => {
    if (!photoEnquiry || !photoUrlInput.trim()) return;
    const currentPhotos = photoEnquiry.site_photos || [];
    const updated = [...currentPhotos, photoUrlInput.trim()];
    await handleUpdateField(photoEnquiry.id, { site_photos: updated });
    setPhotoUrlInput('');
    setPhotoEnquiry({ ...photoEnquiry, site_photos: updated });
  };

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
        const dateFormatted = new Date(e.created_at).toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          day: '2-digit',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        });

        return `
          <tr style="border-bottom: 1px solid #e2e8f0; background: ${index % 2 === 0 ? '#ffffff' : '#f8fafc'};">
            <td style="padding: 10px 8px; font-weight: bold;">#${index + 1}</td>
            <td style="padding: 10px 8px;">${dateFormatted}</td>
            <td style="padding: 10px 8px; font-weight: bold; color: #0f172a;">${e.name}</td>
            <td style="padding: 10px 8px;">${e.phone}</td>
            <td style="padding: 10px 8px;">${e.service_name || 'Core Cutting'}</td>
            <td style="padding: 10px 8px;">${e.location}</td>
            <td style="padding: 10px 8px; font-weight: bold; text-transform: uppercase;">${e.status}</td>
            <td style="padding: 10px 8px; font-weight: bold;">${e.collected_amount ? `₹${e.collected_amount} (Paid)` : e.quote_amount ? `₹${e.quote_amount}` : '-'}</td>
          </tr>
        `;
      })
      .join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Core_Cutting_CRM_Audit_Report</title>
        <style>
          @page { size: A4 landscape; margin: 12mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f172a; margin: 0; padding: 20px; font-size: 12px; }
          .header { background: #0D1117; color: white; padding: 18px 24px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; border-left: 6px solid #FA4A14; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 11px; }
          th { background: #161B22; color: white; padding: 10px 8px; text-align: left; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h2 style="margin:0; font-size: 20px; letter-spacing: -0.5px;">${defaultBusinessProfile.business_name} • CRM Audit Report</h2>
            <div style="color: #94a3b8; font-size: 11px; margin-top: 3px;">Total Customer Records: ${enquiries.length} | Operational Region: ${defaultBusinessProfile.city || 'Gujarat'}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 16px; font-weight: 800; color: #4ade80;">Revenue: ₹${stats.totalRevenue.toLocaleString('en-IN')}</div>
            <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">Generated: ${generatedAt}</div>
          </div>
        </div>
        <table>
          <thead>
            <tr><th>#</th><th>Date</th><th>Customer Name</th><th>Phone</th><th>Service</th><th>Location</th><th>Status</th><th>Value</th></tr>
          </thead>
          <tbody>${tableRowsHtml}</tbody>
        </table>
        <script>window.onload = function() { setTimeout(function() { window.print(); }, 400); };</script>
      </body>
      </html>
    `;
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // Grouping enquiries by Location for Area Dispatch Map
  const locationClusters: Record<string, Enquiry[]> = {};
  enquiries.forEach((e) => {
    const loc = e.location.split(',')[0].trim() || 'Vadodara Central';
    if (!locationClusters[loc]) locationClusters[loc] = [];
    locationClusters[loc].push(e);
  });

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col font-sans selection:bg-brand-orange selection:text-white">
      {/* ================================================================= */}
      {/* 1. TOP COMMAND BAR */}
      {/* ================================================================= */}
      <header className="bg-[#0F1420]/95 backdrop-blur-xl border-b border-white/[0.08] sticky top-0 z-40 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex items-center justify-between gap-2 sm:gap-4">
          {/* Business Info & Live Operational Pulse */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-gradient-to-tr from-brand-orange via-amber-500 to-orange-400 flex items-center justify-center text-white font-black text-lg shadow-orange-glow shrink-0">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="font-black text-sm sm:text-base tracking-tight text-white leading-tight">
                  {defaultBusinessProfile.business_name}
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Hub
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                <span className="hidden md:inline">Owner Command Suite</span>
                {currentTime && (
                  <span className="text-slate-400 font-mono text-[10px] sm:text-[11px] flex items-center gap-1 bg-white/[0.04] px-1.5 py-0.5 rounded">
                    <Clock className="h-3 w-3 text-brand-orange" />
                    <span>{currentTime} IST</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Center Navigation Tabs (Desktop) */}
          <div className="hidden lg:flex bg-[#070A10] p-1 rounded-2xl border border-white/[0.08] space-x-1">
            <button
              onClick={() => setActiveView('list')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeView === 'list' ? 'bg-brand-orange text-white shadow-orange-glow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>CRM Leads</span>
            </button>
            <button
              onClick={() => {
                setSelectedBillCustomer(null);
                setActiveView('billing');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeView === 'billing' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Receipt className="h-3.5 w-3.5" />
              <span>Bill Generator</span>
            </button>
            <button
              onClick={() => setActiveView('dispatch')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeView === 'dispatch' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Map className="h-3.5 w-3.5" />
              <span>Area Routes</span>
            </button>
            <button
              onClick={() => setActiveView('equipment')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeView === 'equipment' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Wrench className="h-3.5 w-3.5" />
              <span>Bit Life</span>
            </button>
            <button
              onClick={() => setActiveView('calculator')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeView === 'calculator' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calculator className="h-3.5 w-3.5" />
              <span>Spot Estimator</span>
            </button>
          </div>

          {/* Quick Actions & Logout */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl bg-gradient-to-r from-brand-orange to-amber-500 hover:from-brand-orange-hover hover:to-amber-600 text-xs font-black text-white shadow-orange-glow transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Lead</span>
            </button>

            <button
              onClick={handleExportPDF}
              disabled={enquiries.length === 0}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-slate-300 hover:text-white transition-all disabled:opacity-40"
              title="Download official PDF audit report"
            >
              <Download className="h-3.5 w-3.5 text-rose-400" />
              <span className="hidden md:inline">PDF</span>
            </button>

            <button
              onClick={handleExportCSV}
              disabled={enquiries.length === 0}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-slate-300 hover:text-white transition-all disabled:opacity-40"
              title="Export leads to CSV spreadsheet"
            >
              <FileText className="h-3.5 w-3.5 text-emerald-400" />
              <span className="hidden md:inline">CSV</span>
            </button>

            <button
              onClick={() => fetchEnquiries(false)}
              className="p-2 sm:px-2.5 sm:py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Refresh leads"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin text-brand-orange' : ''}`} />
            </button>

            <button
              onClick={handleLogout}
              className="p-2 sm:px-2.5 sm:py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:text-rose-300 transition-all cursor-pointer"
              title="Secure Logout"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Mobile View Switcher Tab Bar */}
        <div className="lg:hidden px-3 pb-2.5 pt-1 overflow-x-auto no-scrollbar">
          <div className="flex bg-[#070A10] p-1 rounded-xl border border-white/[0.08] gap-1 min-w-max">
            <button
              onClick={() => setActiveView('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                activeView === 'list' ? 'bg-brand-orange text-white shadow-xs' : 'text-slate-400'
              }`}
            >
              <FileText className="h-3 w-3" />
              <span>Leads</span>
            </button>
            <button
              onClick={() => {
                setSelectedBillCustomer(null);
                setActiveView('billing');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                activeView === 'billing' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400'
              }`}
            >
              <Receipt className="h-3 w-3" />
              <span>Bill</span>
            </button>
            <button
              onClick={() => setActiveView('dispatch')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                activeView === 'dispatch' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400'
              }`}
            >
              <Map className="h-3 w-3" />
              <span>Routes</span>
            </button>
            <button
              onClick={() => setActiveView('equipment')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                activeView === 'equipment' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-400'
              }`}
            >
              <Wrench className="h-3 w-3" />
              <span>Bit Tracker</span>
            </button>
            <button
              onClick={() => setActiveView('calculator')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                activeView === 'calculator' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400'
              }`}
            >
              <Calculator className="h-3 w-3" />
              <span>Estimator</span>
            </button>
          </div>
        </div>
      </header>

      {/* ================================================================= */}
      {/* 2. MAIN OWNER DASHBOARD CONTENT */}
      {/* ================================================================= */}
      <main className="max-w-7xl mx-auto w-full p-3 sm:p-6 lg:p-8 flex-1 space-y-5 sm:space-y-6">
        {/* KPI Performance Pulse Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4">
          {/* Total Enquiries */}
          <div className="bg-[#0F1420]/80 border border-white/[0.08] hover:border-white/[0.15] rounded-2xl p-3.5 sm:p-4 transition-all">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Inquiries</span>
            <div className="text-xl sm:text-2xl font-black text-white mt-1">{stats.total}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">All-time customer base</div>
          </div>

          {/* New Active Leads */}
          <div className="bg-gradient-to-br from-[#0F1420] to-orange-950/20 border border-brand-orange/40 rounded-2xl p-3.5 sm:p-4 shadow-orange-glow/10 relative overflow-hidden">
            <div className="absolute top-1 right-1 h-6 w-6 rounded-full bg-brand-orange/10 flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-brand-orange" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-brand-orange uppercase tracking-wider block">Action Required</span>
            <div className="text-xl sm:text-2xl font-black text-brand-orange mt-1">{stats.new}</div>
            <div className="text-[10px] text-brand-orange/80 mt-0.5">Awaiting first contact</div>
          </div>

          {/* Scheduled Site Visits */}
          <div className="bg-gradient-to-br from-[#0F1420] to-blue-950/20 border border-blue-500/30 rounded-2xl p-3.5 sm:p-4">
            <span className="text-[10px] sm:text-[11px] font-bold text-blue-400 uppercase tracking-wider block">Scheduled Visits</span>
            <div className="text-xl sm:text-2xl font-black text-blue-400 mt-1">{stats.scheduledCount}</div>
            <div className="text-[10px] text-blue-400/80 mt-0.5">Assigned to field cutters</div>
          </div>

          {/* Active Quoted Pipeline */}
          <div className="bg-gradient-to-br from-[#0F1420] to-amber-950/20 border border-amber-500/30 rounded-2xl p-3.5 sm:p-4">
            <span className="text-[10px] sm:text-[11px] font-bold text-amber-400 uppercase tracking-wider block">Quoted Pipeline</span>
            <div className="text-xl sm:text-2xl font-black text-amber-400 mt-1">₹{stats.pipelineValue.toLocaleString('en-IN')}</div>
            <div className="text-[10px] text-amber-400/80 mt-0.5">Pending approval</div>
          </div>

          {/* Collected Revenue */}
          <div className="bg-gradient-to-br from-[#0F1420] to-emerald-950/30 border border-emerald-500/40 rounded-2xl p-3.5 sm:p-4 shadow-emerald-500/5">
            <span className="text-[10px] sm:text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">Collected Earnings</span>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">₹{stats.totalRevenue.toLocaleString('en-IN')}</div>
            <div className="text-[10px] text-emerald-400/80 mt-0.5">Confirmed payments</div>
          </div>

          {/* Today / Velocity */}
          <div className="bg-gradient-to-br from-[#0F1420] to-purple-950/20 border border-purple-500/30 rounded-2xl p-3.5 sm:p-4">
            <span className="text-[10px] sm:text-[11px] font-bold text-purple-400 uppercase tracking-wider block">Today (24h)</span>
            <div className="text-xl sm:text-2xl font-black text-purple-400 mt-1">{stats.today}</div>
            <div className="text-[10px] text-purple-400/80 mt-0.5">New incoming queries</div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* VIEW 1: CRM LEADS LIST & CARDS */}
        {/* ================================================================= */}
        {activeView === 'list' && (
          <div className="space-y-4">
            {/* Filter Chips & Search Bar */}
            <div className="bg-[#0F1420]/90 border border-white/[0.08] rounded-2xl p-3 sm:p-4 flex flex-col md:flex-row gap-3 items-center justify-between shadow-sm">
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar pb-1 md:pb-0">
                {[
                  { key: 'all', label: 'All', count: stats.total },
                  { key: 'new', label: 'New', count: stats.new },
                  { key: 'scheduled', label: 'Scheduled', count: stats.scheduledCount },
                  { key: 'quoted', label: 'Quoted', count: stats.quoted },
                  { key: 'closed', label: 'Closed', count: stats.closed },
                  { key: 'spam', label: 'Spam', count: stats.spam },
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setStatusFilter(t.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                      statusFilter === t.key
                        ? 'bg-brand-orange text-white shadow-orange-glow'
                        : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08]'
                    }`}
                  >
                    <span>{t.label}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                      statusFilter === t.key ? 'bg-black/20 text-white' : 'bg-white/10 text-slate-400'
                    }`}>
                      {t.count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-72">
                  <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name, phone, area, service..."
                    className="w-full pl-9 pr-8 py-2 bg-[#080C14] border border-white/[0.08] focus:border-brand-orange rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-orange/30 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* View Mode Switcher (Desktop only) */}
                <div className="hidden sm:flex bg-[#080C14] p-1 rounded-xl border border-white/[0.08]">
                  <button
                    onClick={() => setLayoutMode('cards')}
                    className={`p-1.5 rounded-lg transition-all ${
                      layoutMode === 'cards' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Card View"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setLayoutMode('table')}
                    className={`p-1.5 rounded-lg transition-all ${
                      layoutMode === 'table' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Table View"
                  >
                    <ListIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Enquiries Rendering */}
            {isLoading && enquiries.length === 0 ? (
              <div className="bg-[#0F1420]/80 border border-white/[0.08] rounded-3xl p-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
                <RefreshCw className="h-8 w-8 text-brand-orange animate-spin" />
                <p className="text-sm font-medium">Fetching real-time customer inquiries...</p>
              </div>
            ) : enquiries.length === 0 ? (
              <div className="bg-[#0F1420]/80 border border-white/[0.08] rounded-3xl p-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-4">
                <FileText className="h-8 w-8 text-slate-600" />
                <h3 className="text-lg font-bold text-white">No customer leads found in &quot;{statusFilter}&quot;</h3>
                <p className="text-xs text-slate-400 max-w-sm">
                  {searchQuery ? `No results match your query "${searchQuery}".` : 'Customer inquiries from your website and direct calls will populate here in real-time.'}
                </p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-brand-orange text-white text-xs font-bold shadow-orange-glow"
                >
                  + Add Manual Customer Record
                </button>
              </div>
            ) : layoutMode === 'table' ? (
              /* DENSE TABLE VIEW */
              <div className="bg-[#0F1420]/90 border border-white/[0.08] rounded-2xl overflow-hidden shadow-sm hidden sm:block">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/[0.08] bg-[#070A10] text-slate-400 uppercase text-[10px] tracking-wider">
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Contact</th>
                        <th className="py-3 px-4">Location</th>
                        <th className="py-3 px-4">Service</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Quote / Paid</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05]">
                      {enquiries.map((enquiry) => {
                        const cleanPhone = enquiry.phone.replace(/[^\d+]/g, '');
                        return (
                          <tr key={enquiry.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-3.5 px-4 font-bold text-white">
                              <div>{enquiry.name}</div>
                              <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                                {new Date(enquiry.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-slate-300">
                              <a href={`tel:${cleanPhone}`} className="hover:text-brand-orange underline-offset-2 hover:underline">
                                {enquiry.phone}
                              </a>
                            </td>
                            <td className="py-3.5 px-4 text-slate-300">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-brand-orange shrink-0" />
                                <span className="truncate max-w-[140px]">{enquiry.location}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-slate-300">
                              <span className="px-2 py-0.5 rounded-md bg-white/[0.04] text-[11px]">
                                {enquiry.service_name || 'AC Core Cutting'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold border ${
                                enquiry.status === 'new' ? 'bg-brand-orange/15 text-brand-orange border-brand-orange/30' :
                                enquiry.status === 'contacted' ? 'bg-blue-500/15 text-blue-400 border-blue-500/30' :
                                enquiry.status === 'quoted' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
                                enquiry.status === 'closed' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                                'bg-slate-800 text-slate-400 border-slate-700'
                              }`}>
                                {enquiry.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-bold">
                              {enquiry.collected_amount ? (
                                <span className="text-emerald-400">₹{Number(enquiry.collected_amount).toLocaleString('en-IN')}</span>
                              ) : enquiry.quote_amount ? (
                                <span className="text-amber-400">₹{Number(enquiry.quote_amount).toLocaleString('en-IN')}</span>
                              ) : (
                                <span className="text-slate-400">-</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    setSelectedBillCustomer({
                                      name: enquiry.name,
                                      phone: enquiry.phone,
                                      location: enquiry.location,
                                      serviceName: enquiry.service_name || 'AC Core Cutting',
                                      quoteAmount: enquiry.quote_amount || undefined,
                                    });
                                    setActiveView('billing');
                                  }}
                                  className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
                                  title="Generate Official Bill / Estimate"
                                >
                                  <Receipt className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => openWhatsAppModal(enquiry)}
                                  className="p-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors"
                                  title="WhatsApp"
                                >
                                  <MessageSquare className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => openUpiModal(enquiry)}
                                  className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-600 hover:text-white transition-colors"
                                  title="UPI QR"
                                >
                                  <QrCode className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    setQuoteEnquiry(enquiry);
                                    setIsQuoteModalOpen(true);
                                  }}
                                  className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-600 hover:text-white transition-colors"
                                  title="Quote"
                                >
                                  <Calculator className="h-3.5 w-3.5" />
                                </button>
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
                                  className="p-1.5 rounded-lg bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]"
                                  title="Edit notes / payment"
                                >
                                  <Edit3 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* INTERACTIVE CARD VIEW (Default & Mobile-Friendly) */
              <div className="grid grid-cols-1 gap-3.5">
                {enquiries.map((enquiry) => {
                  const cleanPhone = enquiry.phone.replace(/[^\d+]/g, '');
                  const hasFollowupDue =
                    enquiry.followup_date &&
                    new Date(enquiry.followup_date).getTime() <= Date.now() + 86400000;

                  return (
                    <div
                      key={enquiry.id}
                      className="bg-[#0F1420]/90 border border-white/[0.08] hover:border-white/[0.16] rounded-2xl p-4 sm:p-5 shadow-sm transition-all space-y-3.5"
                    >
                      {/* Top Header of Card */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-base text-white">{enquiry.name}</span>

                          {/* Status Pill */}
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold border ${
                            enquiry.status === 'new' ? 'bg-brand-orange/15 text-brand-orange border-brand-orange/30' :
                            enquiry.status === 'contacted' ? 'bg-blue-500/15 text-blue-400 border-blue-500/30' :
                            enquiry.status === 'quoted' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
                            enquiry.status === 'closed' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                            'bg-slate-800 text-slate-400 border-slate-700'
                          }`}>
                            {enquiry.status}
                          </span>

                          {/* Scheduled Date Pill */}
                          {enquiry.scheduled_date && (
                            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-[10px] font-bold text-blue-300 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{enquiry.scheduled_date} ({enquiry.scheduled_time || 'General'})</span>
                            </span>
                          )}

                          {/* Follow-up Due Alert */}
                          {hasFollowupDue && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-bold text-amber-300 flex items-center gap-1 animate-pulse">
                              <Bell className="h-3 w-3" />
                              <span>Follow-up Due</span>
                            </span>
                          )}

                          {/* Priya AI Voice Lead */}
                          {enquiry.source === 'ai_assistant' && (
                            <button
                              onClick={() => {
                                setTranscriptEnquiry(enquiry);
                                setIsTranscriptModalOpen(true);
                              }}
                              className="px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-[10px] font-bold text-purple-300 flex items-center gap-1 hover:bg-purple-500/25 transition-colors cursor-pointer"
                            >
                              <span>🎙️ Priya AI Voice Lead</span>
                            </button>
                          )}
                        </div>

                        {/* Relative Timestamp & Source */}
                        <div className="flex items-center gap-2 text-slate-400 text-xs">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(enquiry.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                          </span>
                        </div>
                      </div>

                      {/* Customer Info Metadata */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-slate-400" />
                          <a href={`tel:${cleanPhone}`} className="font-bold text-white hover:text-brand-orange underline-offset-2 hover:underline">
                            {enquiry.phone}
                          </a>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-brand-orange shrink-0" />
                          <span className="truncate">{enquiry.location}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Zap className="h-3.5 w-3.5 text-amber-400" />
                          <span>{enquiry.service_name || 'AC Core Cutting'}</span>
                        </div>

                        {enquiry.assigned_technician && (
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Wrench className="h-3.5 w-3.5 text-blue-400" />
                            <span>Tech: <strong className="text-white">{enquiry.assigned_technician}</strong></span>
                          </div>
                        )}
                      </div>

                      {/* Financial Value Tags */}
                      {(enquiry.quote_amount || enquiry.collected_amount) && (
                        <div className="flex items-center gap-2.5 pt-1 text-xs flex-wrap">
                          {enquiry.quote_amount && (
                            <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold">
                              Quoted: ₹{Number(enquiry.quote_amount).toLocaleString('en-IN')}
                            </span>
                          )}
                          {enquiry.collected_amount && (
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-black">
                              Collected: ₹{Number(enquiry.collected_amount).toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Customer Note / Special Instructions */}
                      {enquiry.message && (
                        <div className="p-2.5 rounded-xl bg-[#080C14] border border-white/[0.06] text-xs text-slate-300">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Requirement Details:</span>
                          {enquiry.message}
                        </div>
                      )}

                      {/* Site Photos Count */}
                      {enquiry.site_photos && enquiry.site_photos.length > 0 && (
                        <button
                          onClick={() => {
                            setPhotoEnquiry(enquiry);
                            setIsPhotoModalOpen(true);
                          }}
                          className="text-xs text-brand-orange hover:underline font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Camera className="h-3.5 w-3.5" />
                          <span>{enquiry.site_photos.length} Site Photo(s) Attached</span>
                        </button>
                      )}

                      {/* Quick CRM Action Bar (Fully touch-optimized for mobile) */}
                      <div className="pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          {/* Official Bill / Estimate */}
                          <button
                            onClick={() => {
                              setSelectedBillCustomer({
                                name: enquiry.name,
                                phone: enquiry.phone,
                                location: enquiry.location,
                                serviceName: enquiry.service_name || 'AC Core Cutting',
                                quoteAmount: enquiry.quote_amount || undefined,
                              });
                              setActiveView('billing');
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all active:scale-95 cursor-pointer"
                            title="Open Official Bill / Estimate Generator"
                          >
                            <Receipt className="h-3.5 w-3.5 text-emerald-400" />
                            <span>Bill</span>
                          </button>

                          {/* WhatsApp Ready-Message */}
                          <button
                            onClick={() => openWhatsAppModal(enquiry)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                            <span>WhatsApp</span>
                          </button>

                          {/* Instant UPI QR */}
                          <button
                            onClick={() => openUpiModal(enquiry)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-xs font-bold transition-all active:scale-95 cursor-pointer"
                            title="Generate Instant UPI QR Code"
                          >
                            <QrCode className="h-3.5 w-3.5 text-purple-400" />
                            <span>UPI QR</span>
                          </button>

                          {/* Spot Quotation Generator */}
                          <button
                            onClick={() => {
                              setQuoteEnquiry(enquiry);
                              setIsQuoteModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all active:scale-95 cursor-pointer"
                            title="Estimate & Print PDF Quotation"
                          >
                            <Calculator className="h-3.5 w-3.5 text-amber-400" />
                            <span>Quote</span>
                          </button>

                          {/* Google Review Invite (Closed jobs) */}
                          {enquiry.status === 'closed' && (
                            <button
                              onClick={() => openReviewModal(enquiry)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-xs transition-all active:scale-95 cursor-pointer"
                            >
                              <Star className="h-3.5 w-3.5 fill-slate-950" />
                              <span>Review</span>
                            </button>
                          )}

                          {/* Schedule Visit */}
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
                            className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-300 text-xs font-bold transition-all active:scale-95 cursor-pointer"
                          >
                            <Calendar className="h-3.5 w-3.5" />
                            <span>Schedule</span>
                          </button>

                          {/* Photos */}
                          <button
                            onClick={() => {
                              setPhotoEnquiry(enquiry);
                              setIsPhotoModalOpen(true);
                            }}
                            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.08] transition-all cursor-pointer"
                            title="Site Photos"
                          >
                            <Camera className="h-3.5 w-3.5" />
                          </button>

                          {/* Edit Notes / Payment */}
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
                            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.08] transition-all cursor-pointer"
                            title="Private Notes & Cash Payment"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Status Dropdown + Call + Delete */}
                        <div className="flex items-center gap-1.5">
                          <select
                            value={enquiry.status}
                            disabled={isUpdating === enquiry.id}
                            onChange={(e) => handleStatusChange(enquiry.id, e.target.value as Enquiry['status'])}
                            className="px-2.5 py-2 bg-[#080C14] border border-white/[0.08] rounded-xl text-xs font-bold text-white focus:outline-none focus:border-brand-orange cursor-pointer"
                          >
                            <option value="new">Status: New</option>
                            <option value="contacted">Status: Contacted</option>
                            <option value="quoted">Status: Quoted</option>
                            <option value="closed">Status: Closed</option>
                            <option value="spam">Status: Spam</option>
                          </select>

                          <a
                            href={`tel:${cleanPhone}`}
                            className="p-2 rounded-xl bg-white/[0.04] hover:bg-brand-orange text-white border border-white/[0.08] transition-colors"
                            title="Call customer directly"
                          >
                            <Phone className="h-3.5 w-3.5" />
                          </a>

                          <button
                            onClick={() => handleDelete(enquiry.id)}
                            disabled={isUpdating === enquiry.id}
                            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors cursor-pointer"
                            title="Delete customer record"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW 2: AREA DISPATCH & ROUTE PLANNER */}
        {/* ================================================================= */}
        {activeView === 'dispatch' && (
          <div className="space-y-4">
            <div className="bg-[#0F1420]/90 border border-white/[0.08] rounded-3xl p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <Map className="h-5 w-5 text-blue-400" />
                    <span>Area Route &amp; Territory Dispatch</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Customer sites grouped by neighborhood for streamlined cutting team dispatches
                  </p>
                </div>
                <button
                  onClick={() => setActiveView('list')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-bold text-slate-300 w-fit"
                >
                  <span>← Back to CRM Leads</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(locationClusters).map(([area, areaLeads]) => (
                  <div key={area} className="bg-[#080C14] border border-white/[0.08] rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-brand-orange shrink-0" />
                        <span className="font-extrabold text-sm text-white">{area}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-bold">
                        {areaLeads.length} Lead(s)
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {areaLeads.map((lead, idx) => (
                        <div key={lead.id} className="p-3 rounded-xl bg-[#0F1420] border border-white/[0.06] text-xs space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-white">Stop #{idx + 1}: {lead.name}</span>
                            <span className="text-[10px] text-amber-400 font-bold">{lead.service_name || 'AC Core Cutting'}</span>
                          </div>
                          <div className="text-slate-400 text-[11px] flex justify-between">
                            <span>📞 {lead.phone}</span>
                            <span>{lead.scheduled_time || 'Pending Schedule'}</span>
                          </div>
                          <div className="pt-1.5 flex justify-end">
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lead.location + ' ' + (defaultBusinessProfile.city || 'Gujarat'))}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 hover:underline"
                            >
                              <span>Open Google Maps Route</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW 3: DIAMOND BITS & MACHINE WEAR TRACKER */}
        {/* ================================================================= */}
        {activeView === 'equipment' && (
          <div className="space-y-4">
            <div className="bg-[#0F1420]/90 border border-white/[0.08] rounded-3xl p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-amber-400" />
                    <span>Diamond Segment Core Bit &amp; Tool Health</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Monitor diamond segment wear, hole counts, and timely replacement schedules to avoid site delays
                  </p>
                </div>
                <button
                  onClick={() => setActiveView('list')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-bold text-slate-300 w-fit"
                >
                  <span>← Back to CRM Leads</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {diamondBits.map((bit) => {
                  const lifePercent = Math.max(0, Math.round(((bit.maxLifeHoles - bit.holesCut) / bit.maxLifeHoles) * 100));
                  const isLow = lifePercent < 30;

                  return (
                    <div key={bit.id} className="bg-[#080C14] border border-white/[0.08] rounded-2xl p-4 space-y-3.5">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-black text-sm text-white">{bit.size}</div>
                          <div className="text-[11px] text-slate-400">{bit.application}</div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          isLow ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        }`}>
                          {lifePercent}% Life Left
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-white/[0.06] h-2.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isLow ? 'bg-rose-500' : lifePercent < 60 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${lifePercent}%` }}
                        />
                      </div>

                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Executed: <strong className="text-white">{bit.holesCut} cuts</strong></span>
                        <span>Rating: <strong className="text-white">{bit.maxLifeHoles} holes</strong></span>
                      </div>

                      <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => {
                              setDiamondBits((prev) =>
                                prev.map((b) => (b.id === bit.id ? { ...b, holesCut: b.holesCut + 1 } : b))
                              );
                            }}
                            className="px-2.5 py-1 bg-white/[0.06] hover:bg-white/[0.12] text-[11px] font-bold text-white rounded-lg transition-colors cursor-pointer"
                          >
                            +1 Hole
                          </button>
                          <button
                            onClick={() => {
                              setDiamondBits((prev) =>
                                prev.map((b) => (b.id === bit.id ? { ...b, holesCut: b.holesCut + 5 } : b))
                              );
                            }}
                            className="px-2.5 py-1 bg-white/[0.06] hover:bg-white/[0.12] text-[11px] font-bold text-white rounded-lg transition-colors cursor-pointer"
                          >
                            +5 Holes
                          </button>
                        </div>
                        <button
                          onClick={() => {
                            if (confirm(`Reset ${bit.size} bit wear to 0 for a brand new core drill bit?`)) {
                              setDiamondBits((prev) =>
                                prev.map((b) => (b.id === bit.id ? { ...b, holesCut: 0 } : b))
                              );
                            }
                          }}
                          className="text-[10px] text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                        >
                          New Bit Reset
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW 4: INSTANT SPOT ESTIMATOR TOOL */}
        {/* ================================================================= */}
        {activeView === 'calculator' && (
          <div className="space-y-4">
            <div className="bg-[#0F1420]/90 border border-white/[0.08] rounded-3xl p-5 sm:p-6 space-y-5 max-w-2xl mx-auto">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-purple-400" />
                    <span>Quick Spot Price Calculator</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Fast estimation tool for instant client quotes over phone calls
                  </p>
                </div>
                <button
                  onClick={() => setActiveView('list')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-bold text-slate-300"
                >
                  <span>← CRM</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">Hole Diameter</label>
                  <select
                    value={calcHoleSize}
                    onChange={(e) => setCalcHoleSize(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#080C14] border border-white/[0.08] rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-brand-orange"
                  >
                    <option value="2 Inch (50mm - Drain)">2 Inch (50mm - Drain)</option>
                    <option value="3 Inch (75mm - Standard AC)">3 Inch (75mm - Standard AC)</option>
                    <option value="4 Inch (100mm - Soil Pipe)">4 Inch (100mm - Soil Pipe)</option>
                    <option value="5 Inch (125mm - Chimney)">5 Inch (125mm - Chimney)</option>
                    <option value="6 Inch (150mm - Heavy HVAC)">6 Inch (150mm - Heavy HVAC)</option>
                    <option value="8 Inch (200mm - RCC Bridge)">8 Inch (200mm - RCC Bridge)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">Wall / Structure Material</label>
                  <select
                    value={calcMaterialRate}
                    onChange={(e) => setCalcMaterialRate(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#080C14] border border-white/[0.08] rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-brand-orange"
                  >
                    <option value={350}>Standard Brick Wall (₹350/hole)</option>
                    <option value={450}>AAC Lightweight Block (₹450/hole)</option>
                    <option value={650}>Heavy RCC Beam &amp; Column (₹650/hole)</option>
                    <option value={850}>Reinforced Concrete Slab (₹850/hole)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">Number of Holes: {calcCount}</label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={calcCount}
                    onChange={(e) => setCalcCount(Number(e.target.value))}
                    className="w-full accent-brand-orange cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>1 Hole</span>
                    <span>10 Holes</span>
                    <span>20 Holes</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">Discount Amount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={calcDiscount}
                    onChange={(e) => setCalcDiscount(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3.5 py-2.5 bg-[#080C14] border border-white/[0.08] rounded-xl text-white text-xs font-bold focus:outline-none focus:border-brand-orange"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="calcDust"
                  checked={calcDust}
                  onChange={(e) => setCalcDust(e.target.checked)}
                  className="rounded border-slate-700 text-brand-orange focus:ring-0 accent-brand-orange h-4 w-4"
                />
                <label htmlFor="calcDust" className="text-xs text-slate-300 font-medium cursor-pointer">
                  Include Water &amp; Slurry Dust Catchment Attachment (+₹200)
                </label>
              </div>

              {/* Live Calculation Output Card */}
              {(() => {
                const totalHolesCost = calcMaterialRate * calcCount;
                const dustCost = calcDust ? 200 : 0;
                const calculatedSubtotal = totalHolesCost + dustCost;
                const calculatedFinal = Math.max(0, calculatedSubtotal - calcDiscount);
                const estTimeMin = calcCount * (calcMaterialRate >= 650 ? 25 : 15);

                return (
                  <div className="bg-gradient-to-br from-[#080C14] to-purple-950/20 border border-purple-500/30 p-5 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-purple-300 uppercase tracking-wider font-bold">Estimated Job Total</span>
                        <div className="text-3xl font-black text-purple-300 mt-0.5">
                          ₹{calculatedFinal.toLocaleString('en-IN')}
                        </div>
                      </div>
                      <div className="text-right text-xs text-slate-300 space-y-0.5">
                        <div>{calcCount} holes × ₹{calcMaterialRate} = ₹{totalHolesCost}</div>
                        {calcDust && <div className="text-emerald-400">+ ₹200 Clean Dust Setup</div>}
                        {calcDiscount > 0 && <div className="text-rose-400">- ₹{calcDiscount} Special Off</div>}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400">
                      <span>⏱️ Est. Drilling Duration: <strong>~{estTimeMin} mins</strong></span>
                      <button
                        onClick={() => {
                          const quoteMsg = `Job Estimate:\nService: Core Cutting (${calcHoleSize})\nHoles: ${calcCount}\nTotal: ₹${calculatedFinal}\nFeatures: Zero Vibration, Slurry Containment`;
                          navigator.clipboard.writeText(quoteMsg);
                          alert('Quotation summary copied to clipboard!');
                        }}
                        className="text-xs text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1 hover:underline"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Quote Text</span>
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW 5: OFFLINE & OFFICIAL BILL GENERATOR */}
        {/* ================================================================= */}
        {activeView === 'billing' && (
          <BillGenerator
            initialData={selectedBillCustomer}
            onSavedToCrm={() => fetchEnquiries(false)}
            onClose={() => setActiveView('list')}
          />
        )}
      </main>

      {/* ================================================================= */}
      {/* 3. RESPONSIVE MODALS & DRAWERS */}
      {/* ================================================================= */}

      {/* MODAL 1: DYNAMIC UPI QR CODE */}
      {isUpiModalOpen && upiEnquiry && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-fade-in">
          <div className="bg-[#121622] border border-white/[0.12] rounded-3xl max-w-sm w-full p-5 sm:p-6 space-y-4 shadow-2xl text-center">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <span className="font-extrabold text-sm text-white flex items-center gap-1.5">
                <QrCode className="h-4 w-4 text-purple-400" />
                <span>Instant UPI Payment QR</span>
              </span>
              <button onClick={() => setIsUpiModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400">Bill Amount (₹)</label>
              <input
                type="number"
                value={upiAmount}
                onChange={(e) => setUpiAmount(Number(e.target.value))}
                className="w-full text-center text-2xl font-black text-emerald-400 bg-[#080C14] border border-white/[0.08] focus:border-emerald-500 rounded-xl py-2 mt-1 focus:outline-none"
              />
            </div>

            {/* QR Code Container */}
            <div className="bg-white p-4 rounded-2xl inline-block shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={upiQrImageUrl}
                alt="UPI Payment QR Code"
                className="w-48 h-48 mx-auto"
                width={192}
                height={192}
              />
            </div>

            <p className="text-xs text-slate-400">
              Customer can scan with <strong>GPay, PhonePe, Paytm or BHIM</strong>
            </p>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(upiPayUrl);
                  setUpiCopied(true);
                  setTimeout(() => setUpiCopied(false), 2000);
                }}
                className="w-full py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-bold text-white flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                {upiCopied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                <span>{upiCopied ? 'UPI Link Copied!' : 'Copy Payment Link'}</span>
              </button>

              <button
                onClick={() => {
                  const cleanPhone = upiEnquiry.phone.replace(/\D/g, '');
                  const waMsg = `Namaste ${upiEnquiry.name} ji! 🙏\nHere is your UPI payment link of ₹${upiAmount} for Diamond Core Cutting service:\n${upiPayUrl}\n\nThank you!`;
                  window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMsg)}`, '_blank');
                  setIsUpiModalOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-black text-white flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Send className="h-4 w-4" />
                <span>Send Payment Link on WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: WHATSAPP READY-MESSAGE CENTER */}
      {isWaModalOpen && waEnquiry && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-fade-in">
          <div className="bg-[#121622] border border-white/[0.12] rounded-3xl max-w-3xl w-full p-5 sm:p-6 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
                  💬
                </div>
                <div>
                  <h3 className="text-base font-black text-white">WhatsApp Ready-Message Hub</h3>
                  <p className="text-xs text-slate-400">Select template $\rightarrow$ Send immediately to <strong>{waEnquiry.name}</strong> ({waEnquiry.phone})</p>
                </div>
              </div>
              <button onClick={() => setIsWaModalOpen(false)} className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Left: Template Selector */}
              <div className="md:col-span-5 space-y-2 max-h-80 overflow-y-auto pr-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                  1. Choose Template Format:
                </span>
                {WA_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => selectTemplateAndLang(tmpl.id, waLanguage)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                      selectedWaTemplate === tmpl.id
                        ? 'bg-emerald-500/15 border-emerald-500/60 shadow-xs'
                        : 'bg-[#080C14] border-white/[0.08] hover:border-white/[0.16]'
                    }`}
                  >
                    <div className={`font-bold text-xs ${selectedWaTemplate === tmpl.id ? 'text-emerald-400' : 'text-white'}`}>
                      {tmpl.title}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                      {tmpl.desc}
                    </div>
                  </button>
                ))}
              </div>

              {/* Right: Language & Editable Preview */}
              <div className="md:col-span-7 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      2. Language:
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold">
                      Personalized for {waEnquiry.name}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {(['gu', 'hi', 'en'] as const).map((l) => (
                      <button
                        key={l}
                        onClick={() => selectTemplateAndLang(selectedWaTemplate, l)}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          waLanguage === l
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-[#080C14] border border-white/[0.08] text-slate-400 hover:text-white'
                        }`}
                      >
                        {l === 'gu' ? 'ગુજરાતી' : l === 'hi' ? 'हिंदी' : 'English'}
                      </button>
                    ))}
                  </div>

                  <div className="mt-3">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                      3. Live Message Preview (Editable):
                    </span>
                    <textarea
                      rows={8}
                      value={customWaMessage}
                      onChange={(e) => setCustomWaMessage(e.target.value)}
                      className="w-full p-3.5 bg-[#080C14] border border-white/[0.08] rounded-2xl text-xs text-white leading-relaxed focus:outline-none focus:border-emerald-500 font-normal"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/[0.08]">
                  <button
                    onClick={() => setIsWaModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSendWa}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center space-x-2 shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send Message on WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: SPOT ESTIMATOR & PRINTABLE PDF QUOTE */}
      {isQuoteModalOpen && quoteEnquiry && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-fade-in">
          <div className="bg-[#121622] border border-white/[0.12] rounded-3xl max-w-xl w-full p-5 sm:p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center space-x-2">
                <Calculator className="h-5 w-5 text-amber-400" />
                <h3 className="text-base font-black text-white">Quotation: {quoteEnquiry.name}</h3>
              </div>
              <button onClick={() => setIsQuoteModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Hole Diameter</label>
                <select
                  value={quoteDetails.holeSize}
                  onChange={(e) => setQuoteDetails({ ...quoteDetails, holeSize: e.target.value })}
                  className="w-full px-3 py-2 bg-[#080C14] border border-white/[0.08] rounded-xl text-white"
                >
                  <option value="2 Inch (50mm)">2 Inch (50mm)</option>
                  <option value="3 Inch (75mm)">3 Inch (75mm - Standard AC)</option>
                  <option value="4 Inch (100mm)">4 Inch (100mm)</option>
                  <option value="5 Inch (125mm)">5 Inch (125mm)</option>
                  <option value="6 Inch (150mm)">6 Inch (150mm)</option>
                  <option value="8 Inch (200mm)">8 Inch (200mm)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Wall Structure</label>
                <select
                  value={quoteDetails.ratePerHole}
                  onChange={(e) => setQuoteDetails({ ...quoteDetails, ratePerHole: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#080C14] border border-white/[0.08] rounded-xl text-white"
                >
                  <option value={350}>Brick Wall (₹350/hole)</option>
                  <option value={450}>AAC Block (₹450/hole)</option>
                  <option value={650}>Heavy RCC Beam (₹650/hole)</option>
                  <option value={850}>Slab (₹850/hole)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Holes Count</label>
                <input
                  type="number"
                  min="1"
                  value={quoteDetails.holesCount}
                  onChange={(e) => setQuoteDetails({ ...quoteDetails, holesCount: Math.max(1, Number(e.target.value)) })}
                  className="w-full px-3 py-2 bg-[#080C14] border border-white/[0.08] rounded-xl text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Discount (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={quoteDetails.discountAmount}
                  onChange={(e) => setQuoteDetails({ ...quoteDetails, discountAmount: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#080C14] border border-white/[0.08] rounded-xl text-white"
                />
              </div>
            </div>

            <div className="bg-[#080C14] border border-amber-500/30 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Estimated Total</span>
                <div className="text-2xl font-black text-amber-400">₹{quoteTotal.toLocaleString('en-IN')}</div>
              </div>
              <div className="text-right text-xs text-slate-400">
                {quoteDetails.holesCount} holes × ₹{quoteDetails.ratePerHole}
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2 border-t border-white/[0.08]">
              <button
                onClick={handlePrintQuotationPDF}
                className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white font-bold text-xs flex items-center space-x-1 cursor-pointer"
              >
                <Printer className="h-4 w-4" />
                <span>Print PDF Estimate</span>
              </button>
              <button
                onClick={handleSaveQuotation}
                className="px-5 py-2 rounded-xl bg-brand-orange text-white font-black text-xs shadow-orange-glow cursor-pointer"
              >
                Save Quote (₹{quoteTotal})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: SCHEDULE VISIT */}
      {isScheduleModalOpen && scheduleEnquiry && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-fade-in">
          <div className="bg-[#121622] border border-white/[0.12] rounded-3xl max-w-md w-full p-5 sm:p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-base font-black text-white">Schedule: {scheduleEnquiry.name}</h3>
              <button onClick={() => setIsScheduleModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSchedule} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Visit Date</label>
                <input
                  type="date"
                  required
                  value={scheduleData.date}
                  onChange={(e) => setScheduleData({ ...scheduleData, date: e.target.value })}
                  className="w-full px-3 py-2 bg-[#080C14] border border-white/[0.08] rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Time Slot</label>
                <select
                  value={scheduleData.timeSlot}
                  onChange={(e) => setScheduleData({ ...scheduleData, timeSlot: e.target.value })}
                  className="w-full px-3 py-2 bg-[#080C14] border border-white/[0.08] rounded-xl text-white"
                >
                  <option value="Morning (09:00 AM - 12:00 PM)">Morning (09:00 AM - 12:00 PM)</option>
                  <option value="Afternoon (12:00 PM - 03:00 PM)">Afternoon (12:00 PM - 03:00 PM)</option>
                  <option value="Evening (03:00 PM - 06:00 PM)">Evening (03:00 PM - 06:00 PM)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Assign Cutting Technician</label>
                <select
                  value={scheduleData.technician}
                  onChange={(e) => setScheduleData({ ...scheduleData, technician: e.target.value })}
                  className="w-full px-3 py-2 bg-[#080C14] border border-white/[0.08] rounded-xl text-white"
                >
                  <option value="Raju Team (Lead Cutter)">Raju Team (Lead Cutter)</option>
                  <option value="Mukesh & Suresh (RCC Specialists)">Mukesh &amp; Suresh (RCC Specialists)</option>
                  <option value="Amit Core Tech">Amit Core Tech</option>
                  <option value="Owner / Self Assigned">Owner / Self Assigned</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-white/[0.08]">
                <button type="button" onClick={() => setIsScheduleModalOpen(false)} className="px-4 py-2 bg-white/[0.06] text-slate-300 font-bold rounded-xl cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl cursor-pointer">
                  Confirm Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: NOTES & CASH PAYMENT RECONCILIATION */}
      {isNotesModalOpen && notesEnquiry && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-fade-in">
          <div className="bg-[#121622] border border-white/[0.12] rounded-3xl max-w-md w-full p-5 sm:p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-base font-black text-white">Private Notes &amp; Payment</h3>
              <button onClick={() => setIsNotesModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNotes} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Amount Collected / Paid (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={notesData.collectedAmount}
                  onChange={(e) => setNotesData({ ...notesData, collectedAmount: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#080C14] border border-white/[0.08] rounded-xl text-emerald-400 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Follow-up Reminder Date</label>
                <input
                  type="date"
                  value={notesData.followupDate}
                  onChange={(e) => setNotesData({ ...notesData, followupDate: e.target.value })}
                  className="w-full px-3 py-2 bg-[#080C14] border border-white/[0.08] rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Internal Note</label>
                <textarea
                  rows={3}
                  value={notesData.notes}
                  onChange={(e) => setNotesData({ ...notesData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-[#080C14] border border-white/[0.08] rounded-xl text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-white/[0.08]">
                <button type="button" onClick={() => setIsNotesModalOpen(false)} className="px-4 py-2 bg-white/[0.06] text-slate-300 font-bold rounded-xl cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl cursor-pointer">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: ADD MANUAL CUSTOMER LEAD */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-fade-in">
          <div className="bg-[#121622] border border-white/[0.12] rounded-3xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-base font-black text-white">Add New Customer Lead</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400 text-xs">{modalError}</div>
            )}

            <form onSubmit={handleCreateEnquiry} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Customer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Patel"
                  value={newEnquiryData.name}
                  onChange={(e) => setNewEnquiryData({ ...newEnquiryData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#080C14] border border-white/[0.08] rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={newEnquiryData.phone}
                  onChange={(e) => setNewEnquiryData({ ...newEnquiryData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-[#080C14] border border-white/[0.08] rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Service</label>
                  <select
                    value={newEnquiryData.serviceId}
                    onChange={(e) => setNewEnquiryData({ ...newEnquiryData, serviceId: e.target.value })}
                    className="w-full px-3 py-2 bg-[#080C14] border border-white/[0.08] rounded-xl text-white"
                  >
                    <option value="ac-core-cutting">AC Core Cutting</option>
                    <option value="rcc-core-cutting">RCC Core Cutting</option>
                    <option value="ac-drain-hole">AC Drain Hole</option>
                    <option value="concrete-wall-drilling">Concrete Wall Drilling</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Area / Locality *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gotri, Vadodara"
                    value={newEnquiryData.location}
                    onChange={(e) => setNewEnquiryData({ ...newEnquiryData, location: e.target.value })}
                    className="w-full px-3 py-2 bg-[#080C14] border border-white/[0.08] rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Job Requirement Note</label>
                <textarea
                  rows={2}
                  placeholder="e.g. 3 holes for split AC in 2nd floor bedroom"
                  value={newEnquiryData.message}
                  onChange={(e) => setNewEnquiryData({ ...newEnquiryData, message: e.target.value })}
                  className="w-full px-3 py-2 bg-[#080C14] border border-white/[0.08] rounded-xl text-white"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-white/[0.08]">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 bg-white/[0.06] text-slate-300 font-bold rounded-xl cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={modalLoading} className="px-5 py-2 bg-brand-orange text-white font-black rounded-xl shadow-orange-glow cursor-pointer">
                  {modalLoading ? 'Saving...' : 'Save Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 7: GOOGLE 5-STAR REVIEW */}
      {isReviewModalOpen && reviewEnquiry && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-fade-in">
          <div className="bg-[#121622] border border-white/[0.12] rounded-3xl max-w-md w-full p-5 sm:p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                <h3 className="text-base font-black text-white">Send Google Review Invite</h3>
              </div>
              <button onClick={() => setIsReviewModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Send a 1-click review link to <strong>{reviewEnquiry.name}</strong> ({reviewEnquiry.phone}):
            </p>

            <div className="space-y-2">
              <button
                onClick={() => handleSendGoogleReview('gu')}
                className="w-full p-3 rounded-xl bg-[#080C14] border border-white/[0.08] hover:border-emerald-500 text-left text-xs font-bold text-white transition flex justify-between items-center cursor-pointer"
              >
                <span>ગુજરાતી મેસેજ (Gujarati)</span>
                <Send className="h-4 w-4 text-emerald-400" />
              </button>

              <button
                onClick={() => handleSendGoogleReview('hi')}
                className="w-full p-3 rounded-xl bg-[#080C14] border border-white/[0.08] hover:border-emerald-500 text-left text-xs font-bold text-white transition flex justify-between items-center cursor-pointer"
              >
                <span>हिंदी संदेश (Hindi)</span>
                <Send className="h-4 w-4 text-emerald-400" />
              </button>

              <button
                onClick={() => handleSendGoogleReview('en')}
                className="w-full p-3 rounded-xl bg-[#080C14] border border-white/[0.08] hover:border-emerald-500 text-left text-xs font-bold text-white transition flex justify-between items-center cursor-pointer"
              >
                <span>English Review Message</span>
                <Send className="h-4 w-4 text-emerald-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 8: SITE PHOTOS */}
      {isPhotoModalOpen && photoEnquiry && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-fade-in">
          <div className="bg-[#121622] border border-white/[0.12] rounded-3xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center space-x-2">
                <Camera className="h-5 w-5 text-brand-orange" />
                <h3 className="text-base font-black text-white">Site Photos: {photoEnquiry.name}</h3>
              </div>
              <button onClick={() => setIsPhotoModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Paste Image URL / Link..."
                  value={photoUrlInput}
                  onChange={(e) => setPhotoUrlInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#080C14] border border-white/[0.08] rounded-xl text-xs text-white"
                />
                <button
                  onClick={handleAddPhoto}
                  className="px-4 py-2 bg-brand-orange text-white text-xs font-bold rounded-xl shadow-orange-glow cursor-pointer"
                >
                  Add
                </button>
              </div>

              {photoEnquiry.site_photos && photoEnquiry.site_photos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                  {photoEnquiry.site_photos.map((src, i) => (
                    <div key={i} className="relative rounded-xl overflow-hidden border border-white/[0.08] bg-black">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="Site Photo" className="w-full h-24 object-cover" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-slate-500">
                  No site photos attached yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 9: PRIYA AI VOICE TRANSCRIPT */}
      {isTranscriptModalOpen && transcriptEnquiry && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-fade-in">
          <div className="bg-[#121622] border border-white/[0.12] rounded-3xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🎙️</span>
                <h3 className="text-base font-black text-white">Priya AI Conversation Record</h3>
              </div>
              <button onClick={() => setIsTranscriptModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 bg-[#080C14] border border-white/[0.08] rounded-2xl text-xs space-y-2 max-h-64 overflow-y-auto">
              <div className="text-slate-400"><strong>Customer Name:</strong> {transcriptEnquiry.name}</div>
              <div className="text-slate-400"><strong>Phone:</strong> {transcriptEnquiry.phone}</div>
              <div className="text-slate-400"><strong>Location:</strong> {transcriptEnquiry.location}</div>
              <div className="pt-2 border-t border-white/[0.08] text-slate-200 leading-relaxed">
                <strong>Customer Audio Transcript:</strong>
                <p className="mt-1 p-2 bg-slate-900 rounded-lg text-slate-300 font-mono text-[11px]">
                  {transcriptEnquiry.message || 'Customer interacted via Priya Multilingual Voice Assistant.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
