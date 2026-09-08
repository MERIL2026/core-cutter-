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
  AlertCircle,
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
  Share2,
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
  const [activeView, setActiveView] = useState<'list' | 'dispatch' | 'equipment'>('list');

  // 1. Add Lead Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
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

  // 6. UPI QR Code Modal
  const [isUpiModalOpen, setIsUpiModalOpen] = useState(false);
  const [upiEnquiry, setUpiEnquiry] = useState<Enquiry | null>(null);
  const [upiAmount, setUpiAmount] = useState<number>(2500);
  const [upiCopied, setUpiCopied] = useState(false);

  // 7. Google 5-Star Review Request Modal
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewEnquiry, setReviewEnquiry] = useState<Enquiry | null>(null);

  // 8. Site Photos Modal
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photoEnquiry, setPhotoEnquiry] = useState<Enquiry | null>(null);
  const [photoUrlInput, setPhotoUrlInput] = useState('');

  // 9. AI Transcript Modal
  const [isTranscriptModalOpen, setIsTranscriptModalOpen] = useState(false);
  const [transcriptEnquiry, setTranscriptEnquiry] = useState<Enquiry | null>(null);

  // 10. Diamond Bits State
  const [diamondBits, setDiamondBits] = useState<DiamondBit[]>([
    { id: 'bit-1', size: '2 Inch (50mm)', application: 'Plumbing / Drain pipe', holesCut: 42, maxLifeHoles: 180, status: 'good' },
    { id: 'bit-2', size: '3 Inch (75mm)', application: 'Split AC Copper & Drain (Most Used)', holesCut: 148, maxLifeHoles: 200, status: 'warning' },
    { id: 'bit-3', size: '4 Inch (100mm)', application: 'Toilet / Waste Soil Pipe', holesCut: 88, maxLifeHoles: 160, status: 'good' },
    { id: 'bit-4', size: '5 Inch (125mm)', application: 'Kitchen Hood / Commercial HVAC', holesCut: 26, maxLifeHoles: 140, status: 'optimal' },
    { id: 'bit-5', size: '6 Inch (150mm)', application: 'Heavy Chimney & Ventilation', holesCut: 65, maxLifeHoles: 120, status: 'good' },
    { id: 'bit-6', size: '8 Inch (200mm)', application: 'RCC Bridge & Industrial Slabs', holesCut: 14, maxLifeHoles: 100, status: 'optimal' },
  ]);

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

    if (!newEnquiryData.name.trim() || !newEnquiryData.phone.trim()) {
      setModalError('Name and Phone are required.');
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
          location: defaultBusinessProfile.city,
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

  // 1. Calculate Quote Total
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
              <td><strong>Diamond Core Hole Cutting</strong><br/><span style="font-size: 11px; color: #64748b;">Size: ${quoteDetails.holeSize} in ${quoteDetails.material} (Zero vibration)</span></td>
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
          <strong>Terms:</strong>
          <ul style="margin: 5px 0 0 15px; padding: 0;">
            <li>Customer to provide standard single-phase 230V electric point and water tap connection.</li>
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

  // WhatsApp Quick Reply Modal
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

  // UPI QR Generator
  const openUpiModal = (enquiry: Enquiry) => {
    setUpiEnquiry(enquiry);
    setUpiAmount(enquiry.quote_amount || enquiry.collected_amount || 2500);
    setUpiCopied(false);
    setIsUpiModalOpen(true);
  };

  const upiId = '9876543210@upi'; // Default business UPI ID
  const upiPayUrl = `upi://pay?pa=${upiId}&pn=Diamond+Core+Cutting&am=${upiAmount}&cu=INR&tn=CoreCutting_${upiEnquiry?.name.replace(/\s+/g, '_') || 'Job'}`;
  const upiQrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiPayUrl)}`;

  // Google 5-Star Review
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

  // Photo Attachment Save
  const handleAddPhoto = async () => {
    if (!photoEnquiry || !photoUrlInput.trim()) return;
    const currentPhotos = photoEnquiry.site_photos || [];
    const updated = [...currentPhotos, photoUrlInput.trim()];
    await handleUpdateField(photoEnquiry.id, { site_photos: updated });
    setPhotoUrlInput('');
    setPhotoEnquiry({ ...photoEnquiry, site_photos: updated });
  };

  // Schedule Save
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

  // Notes Save
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
        const dateFormatted = new Date(e.created_at).toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          day: '2-digit',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        });

        return `
          <tr style="border-bottom: 1px solid #e2e8f0; background: ${index % 2 === 0 ? '#ffffff' : '#f8fafc'};">
            <td style="padding: 8px; font-weight: bold;">#${index + 1}</td>
            <td style="padding: 8px;">${dateFormatted}</td>
            <td style="padding: 8px; font-weight: bold;">${e.name}</td>
            <td style="padding: 8px;">${e.phone}</td>
            <td style="padding: 8px;">${e.service_name || 'Core Cutting'}</td>
            <td style="padding: 8px;">${e.location}</td>
            <td style="padding: 8px; font-weight: bold; text-transform: uppercase;">${e.status}</td>
            <td style="padding: 8px; font-weight: bold;">${e.collected_amount ? `₹${e.collected_amount} (Paid)` : e.quote_amount ? `₹${e.quote_amount}` : '-'}</td>
          </tr>
        `;
      })
      .join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Core_Cutting_Leads_Report</title>
        <style>
          @page { size: A4 landscape; margin: 12mm; }
          body { font-family: -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 20px; font-size: 12px; }
          .header { background: #0f172a; color: white; padding: 15px 20px; border-radius: 8px; display: flex; justify-content: space-between; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 11px; }
          th { background: #0f172a; color: white; padding: 8px; text-align: left; }
        </style>
      </head>
      <body>
        <div class="header">
          <div><h2 style="margin:0;">${defaultBusinessProfile.business_name} • CRM Report</h2></div>
          <div>Revenue: <strong>₹${stats.totalRevenue.toLocaleString('en-IN')}</strong> | Generated: ${generatedAt}</div>
        </div>
        <table>
          <thead>
            <tr><th>#</th><th>Date</th><th>Name</th><th>Phone</th><th>Service</th><th>Location</th><th>Status</th><th>Value</th></tr>
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
    const loc = e.location.split(',')[0].trim() || 'General Area';
    if (!locationClusters[loc]) locationClusters[loc] = [];
    locationClusters[loc].push(e);
  });

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col">
      {/* Header */}
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
                  CRM Pro Suite
                </span>
              </div>
              <p className="text-xs text-slate-400">Quotes, UPI Payments, Area Dispatch &amp; Bit Health</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* View Switcher Tabs */}
            <div className="hidden lg:flex bg-[#090C11] p-1 rounded-xl border border-slate-800 space-x-1">
              <button
                onClick={() => setActiveView('list')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeView === 'list' ? 'bg-brand-orange text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                📋 Leads List
              </button>
              <button
                onClick={() => setActiveView('dispatch')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                  activeView === 'dispatch' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Map className="h-3.5 w-3.5" />
                <span>🗺️ Area Dispatch</span>
              </button>
              <button
                onClick={() => setActiveView('equipment')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                  activeView === 'equipment' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Wrench className="h-3.5 w-3.5" />
                <span>🛠️ Bit Tracker</span>
              </button>
            </div>

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
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-xs font-black text-red-300 hover:text-white transition-all disabled:opacity-40"
              title="Download official PDF report"
            >
              <FileText className="h-4 w-4 text-red-400" />
              <span className="hidden md:inline">PDF Report</span>
            </button>

            <button
              onClick={() => fetchEnquiries(false)}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#181E28] hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin text-brand-orange' : ''}`} />
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-400"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex-1 space-y-6">
        {/* KPI Summary Grid */}
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
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Scheduled Sites</span>
            <div className="text-2xl font-black text-blue-400 mt-1">{stats.scheduledCount}</div>
          </div>

          <div className="bg-[#12151B] border border-amber-500/40 rounded-2xl p-4 shadow-sm">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Pipeline Quoted</span>
            <div className="text-2xl font-black text-amber-400 mt-1">₹{stats.pipelineValue.toLocaleString('en-IN')}</div>
          </div>

          <div className="bg-[#12151B] border border-emerald-500/40 rounded-2xl p-4 shadow-sm bg-gradient-to-br from-[#12151B] to-emerald-950/20">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Collected Revenue</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">₹{stats.totalRevenue.toLocaleString('en-IN')}</div>
          </div>

          <div className="bg-[#12151B] border border-purple-500/40 rounded-2xl p-4 shadow-sm">
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Today (24h)</span>
            <div className="text-2xl font-black text-purple-400 mt-1">{stats.today}</div>
          </div>
        </div>

        {/* Mobile View Switcher */}
        <div className="flex lg:hidden bg-[#12151B] p-1.5 rounded-2xl border border-slate-800 space-x-1">
          <button
            onClick={() => setActiveView('list')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold ${
              activeView === 'list' ? 'bg-brand-orange text-white' : 'text-slate-400'
            }`}
          >
            📋 Leads
          </button>
          <button
            onClick={() => setActiveView('dispatch')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold ${
              activeView === 'dispatch' ? 'bg-blue-600 text-white' : 'text-slate-400'
            }`}
          >
            🗺️ Dispatch
          </button>
          <button
            onClick={() => setActiveView('equipment')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold ${
              activeView === 'equipment' ? 'bg-amber-600 text-white' : 'text-slate-400'
            }`}
          >
            🛠️ Bit Life
          </button>
        </div>

        {/* ================================================================= */}
        {/* VIEW 1: LEADS LIST VIEW */}
        {/* ================================================================= */}
        {activeView === 'list' && (
          <div className="space-y-4">
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

            {/* Enquiries Cards */}
            {isLoading && enquiries.length === 0 ? (
              <div className="bg-[#12151B] border border-slate-800 rounded-3xl p-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
                <RefreshCw className="h-8 w-8 text-brand-orange animate-spin" />
                <p className="text-sm font-medium">Loading customer records...</p>
              </div>
            ) : enquiries.length === 0 ? (
              <div className="bg-[#12151B] border border-slate-800 rounded-3xl p-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-4">
                <FileText className="h-8 w-8 text-slate-500" />
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
                      {/* Customer Info */}
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
                          <span className="font-extrabold text-base text-white">{enquiry.name}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold border ${
                            enquiry.status === 'new' ? 'bg-brand-orange/20 text-brand-orange border-brand-orange/40' :
                            enquiry.status === 'contacted' ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' :
                            enquiry.status === 'quoted' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
                            enquiry.status === 'closed' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' :
                            'bg-slate-800 text-slate-300'
                          }`}>
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

                          {enquiry.source === 'ai_assistant' && (
                            <button
                              onClick={() => {
                                setTranscriptEnquiry(enquiry);
                                setIsTranscriptModalOpen(true);
                              }}
                              className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-[10px] font-bold text-purple-300 flex items-center space-x-1 hover:bg-purple-500/30"
                            >
                              <span>🎙️ Priya AI Voice Lead</span>
                            </button>
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

                        {/* Value Tags */}
                        {(enquiry.quote_amount || enquiry.collected_amount) && (
                          <div className="flex items-center space-x-3 pt-1 text-xs flex-wrap gap-y-1">
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
                            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Note:</span>
                            {enquiry.message}
                          </div>
                        )}

                        {/* Site Photos Count */}
                        {enquiry.site_photos && enquiry.site_photos.length > 0 && (
                          <div className="flex items-center space-x-2 pt-1">
                            <button
                              onClick={() => {
                                setPhotoEnquiry(enquiry);
                                setIsPhotoModalOpen(true);
                              }}
                              className="text-xs text-brand-orange hover:underline font-bold flex items-center space-x-1"
                            >
                              <Camera className="h-3.5 w-3.5" />
                              <span>{enquiry.site_photos.length} Site Photo(s) Attached</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Quick CRM Action Bar */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                        {/* 1. UPI QR Code */}
                        <button
                          onClick={() => openUpiModal(enquiry)}
                          className="inline-flex items-center space-x-1 px-2.5 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 text-xs font-bold transition-all active:scale-95"
                          title="Generate UPI QR code for on-site payment"
                        >
                          <QrCode className="h-3.5 w-3.5 text-purple-400" />
                          <span>UPI QR</span>
                        </button>

                        {/* 2. Quotation */}
                        <button
                          onClick={() => {
                            setQuoteEnquiry(enquiry);
                            setIsQuoteModalOpen(true);
                          }}
                          className="inline-flex items-center space-x-1 px-2.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all active:scale-95"
                          title="Create estimate & PDF quote"
                        >
                          <Calculator className="h-3.5 w-3.5" />
                          <span>Quote</span>
                        </button>

                        {/* 3. WhatsApp Templates */}
                        <button
                          onClick={() => openWhatsAppModal(enquiry)}
                          className="inline-flex items-center space-x-1 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>WhatsApp</span>
                        </button>

                        {/* 4. Google Review */}
                        {enquiry.status === 'closed' && (
                          <button
                            onClick={() => openReviewModal(enquiry)}
                            className="inline-flex items-center space-x-1 px-2.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-black shadow-sm transition-all active:scale-95"
                            title="Request 5-Star Google Review"
                          >
                            <Star className="h-3.5 w-3.5 fill-slate-900" />
                            <span>Review</span>
                          </button>
                        )}

                        {/* 5. Schedule */}
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
                          className="inline-flex items-center space-x-1 px-2.5 py-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 text-blue-300 text-xs font-bold transition-all active:scale-95"
                        >
                          <Calendar className="h-3.5 w-3.5" />
                          <span>Schedule</span>
                        </button>

                        {/* 6. Photos */}
                        <button
                          onClick={() => {
                            setPhotoEnquiry(enquiry);
                            setIsPhotoModalOpen(true);
                          }}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
                          title="Attach site photos"
                        >
                          <Camera className="h-3.5 w-3.5" />
                        </button>

                        {/* 7. Notes */}
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
                          title="Edit private notes & payment"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>

                        {/* Status Dropdown */}
                        <select
                          value={enquiry.status}
                          disabled={isUpdating === enquiry.id}
                          onChange={(e) => handleStatusChange(enquiry.id, e.target.value as Enquiry['status'])}
                          className="px-2 py-2 bg-[#090C11] border border-slate-700 rounded-xl text-xs font-bold text-slate-200 cursor-pointer"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="quoted">Quoted</option>
                          <option value="closed">Closed</option>
                          <option value="spam">Spam</option>
                        </select>

                        {/* Call */}
                        <a
                          href={`tel:${cleanPhone}`}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                          title="Call customer"
                        >
                          <Phone className="h-3.5 w-3.5 text-brand-orange" />
                        </a>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(enquiry.id)}
                          disabled={isUpdating === enquiry.id}
                          className="p-2 rounded-xl bg-slate-800/80 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700/60"
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
        )}

        {/* ================================================================= */}
        {/* VIEW 2: AREA ROUTE & TERRITORY DISPATCH MAP */}
        {/* ================================================================= */}
        {activeView === 'dispatch' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-[#12151B] border border-slate-800 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-extrabold text-white flex items-center space-x-2">
                    <Map className="h-5 w-5 text-blue-400" />
                    <span>Area Route &amp; Technician Territory Dispatch</span>
                  </h2>
                  <p className="text-xs text-slate-400">Jobs clustered by neighborhood for efficient cutting routes</p>
                </div>
                <button
                  onClick={() => setActiveView('list')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-200"
                >
                  ← Back to List
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(locationClusters).map(([area, areaLeads]) => (
                  <div key={area} className="bg-[#090C11] border border-slate-800 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-brand-orange" />
                        <span className="font-extrabold text-sm text-white">{area}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">
                        {areaLeads.length} Lead(s)
                      </span>
                    </div>

                    <div className="space-y-2">
                      {areaLeads.map((lead, idx) => (
                        <div key={lead.id} className="p-2.5 rounded-xl bg-[#12151B] border border-slate-800 text-xs space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-white">Stop #{idx + 1}: {lead.name}</span>
                            <span className="text-[10px] text-amber-400">{lead.service_name || 'Core Cutting'}</span>
                          </div>
                          <div className="text-slate-400 text-[11px] flex justify-between">
                            <span>📞 {lead.phone}</span>
                            <span>{lead.scheduled_time || 'Pending Schedule'}</span>
                          </div>
                          <div className="pt-1 flex justify-end space-x-1.5">
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lead.location + ' ' + defaultBusinessProfile.city)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-blue-400 hover:underline flex items-center space-x-0.5"
                            >
                              <span>Open Map Route ↗</span>
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
          <div className="space-y-6 animate-fade-in">
            <div className="bg-[#12151B] border border-slate-800 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-extrabold text-white flex items-center space-x-2">
                    <Wrench className="h-5 w-5 text-amber-400" />
                    <span>Diamond Segment Core Bits &amp; Tool Health</span>
                  </h2>
                  <p className="text-xs text-slate-400">Track drill bit wear, hole counts, and replacement schedules</p>
                </div>
                <button
                  onClick={() => setActiveView('list')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-200"
                >
                  ← Back to List
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {diamondBits.map((bit) => {
                  const lifePercent = Math.max(0, Math.round(((bit.maxLifeHoles - bit.holesCut) / bit.maxLifeHoles) * 100));
                  const isLow = lifePercent < 30;

                  return (
                    <div key={bit.id} className="bg-[#090C11] border border-slate-800 rounded-2xl p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-extrabold text-sm text-white">{bit.size}</div>
                          <div className="text-[11px] text-slate-400">{bit.application}</div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          isLow ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {lifePercent}% Life Left
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isLow ? 'bg-red-500' : lifePercent < 60 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${lifePercent}%` }}
                        />
                      </div>

                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Cut: <strong>{bit.holesCut} holes</strong></span>
                        <span>Max: <strong>{bit.maxLifeHoles} holes</strong></span>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex justify-between">
                        <button
                          onClick={() => {
                            setDiamondBits((prev) =>
                              prev.map((b) => (b.id === bit.id ? { ...b, holesCut: b.holesCut + 1 } : b))
                            );
                          }}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-white rounded-lg"
                        >
                          + Log 1 Hole
                        </button>
                        <button
                          onClick={() => {
                            setDiamondBits((prev) =>
                              prev.map((b) => (b.id === bit.id ? { ...b, holesCut: 0 } : b))
                            );
                          }}
                          className="text-[10px] text-slate-500 hover:text-slate-300"
                        >
                          Reset New Bit
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================================================================= */}
      {/* MODAL 1: UPI QR CODE MODAL */}
      {/* ================================================================= */}
      {isUpiModalOpen && upiEnquiry && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#12151B] border border-slate-800 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-center">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-extrabold text-sm text-white">Instant UPI QR Code</span>
              <button onClick={() => setIsUpiModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400">Payment Amount (₹)</label>
              <input
                type="number"
                value={upiAmount}
                onChange={(e) => setUpiAmount(Number(e.target.value))}
                className="w-full text-center text-2xl font-black text-emerald-400 bg-[#090C11] border border-slate-700 rounded-xl py-2 mt-1"
              />
            </div>

            {/* QR Code Container */}
            <div className="bg-white p-4 rounded-2xl inline-block shadow-inner">
              <img
                src={upiQrImageUrl}
                alt="UPI Payment QR Code"
                className="w-48 h-48 mx-auto"
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
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white flex items-center justify-center space-x-1.5"
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
                className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-black text-white flex items-center justify-center space-x-1.5"
              >
                <Send className="h-4 w-4" />
                <span>Send Payment Link on WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 2: GOOGLE 5-STAR REVIEW REQUEST MODAL */}
      {/* ================================================================= */}
      {isReviewModalOpen && reviewEnquiry && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#12151B] border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                <h3 className="text-base font-extrabold text-white">Request Google Review</h3>
              </div>
              <button onClick={() => setIsReviewModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Send a 1-click review invite to <strong>{reviewEnquiry.name}</strong> ({reviewEnquiry.phone}) in their preferred language:
            </p>

            <div className="space-y-2.5">
              <button
                onClick={() => handleSendGoogleReview('gu')}
                className="w-full p-3 rounded-xl bg-[#090C11] border border-slate-700 hover:border-emerald-500 text-left text-xs font-bold text-white transition flex justify-between items-center"
              >
                <span>ગુજરાતી મેસેજ (Gujarati)</span>
                <Send className="h-4 w-4 text-emerald-400" />
              </button>

              <button
                onClick={() => handleSendGoogleReview('hi')}
                className="w-full p-3 rounded-xl bg-[#090C11] border border-slate-700 hover:border-emerald-500 text-left text-xs font-bold text-white transition flex justify-between items-center"
              >
                <span>हिंदी संदेश (Hindi)</span>
                <Send className="h-4 w-4 text-emerald-400" />
              </button>

              <button
                onClick={() => handleSendGoogleReview('en')}
                className="w-full p-3 rounded-xl bg-[#090C11] border border-slate-700 hover:border-emerald-500 text-left text-xs font-bold text-white transition flex justify-between items-center"
              >
                <span>English Review Message</span>
                <Send className="h-4 w-4 text-emerald-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 3: SITE PHOTOS UPLOADER / VIEWER */}
      {/* ================================================================= */}
      {isPhotoModalOpen && photoEnquiry && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#12151B] border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Camera className="h-5 w-5 text-brand-orange" />
                <h3 className="text-base font-extrabold text-white">Site Photos: {photoEnquiry.name}</h3>
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
                  className="flex-1 px-3 py-2 bg-[#090C11] border border-slate-700 rounded-xl text-xs text-white"
                />
                <button
                  onClick={handleAddPhoto}
                  className="px-4 py-2 bg-brand-orange text-white text-xs font-bold rounded-xl shadow-orange-glow"
                >
                  Add Photo
                </button>
              </div>

              {photoEnquiry.site_photos && photoEnquiry.site_photos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                  {photoEnquiry.site_photos.map((src, i) => (
                    <div key={i} className="relative rounded-xl overflow-hidden border border-slate-700 bg-black">
                      <img src={src} alt="Site Photo" className="w-full h-24 object-cover" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-slate-500">
                  No site photos attached yet. Paste an image URL above to attach.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 4: AI CHAT TRANSCRIPT MODAL */}
      {/* ================================================================= */}
      {isTranscriptModalOpen && transcriptEnquiry && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#12151B] border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🎙️</span>
                <h3 className="text-base font-extrabold text-white">Priya AI Conversation Record</h3>
              </div>
              <button onClick={() => setIsTranscriptModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 bg-[#090C11] border border-slate-800 rounded-2xl text-xs space-y-2 max-h-64 overflow-y-auto">
              <div className="text-slate-400"><strong>Customer Name:</strong> {transcriptEnquiry.name}</div>
              <div className="text-slate-400"><strong>Phone:</strong> {transcriptEnquiry.phone}</div>
              <div className="text-slate-400"><strong>Location:</strong> {transcriptEnquiry.location}</div>
              <div className="pt-2 border-t border-slate-800 text-slate-200 leading-relaxed">
                <strong>Customer Audio Transcript:</strong>
                <p className="mt-1 p-2 bg-slate-900 rounded-lg text-slate-300 font-mono text-[11px]">
                  {transcriptEnquiry.message || 'Customer interacted via Priya Multilingual Voice Assistant.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 5: QUOTATION ESTIMATOR */}
      {/* ================================================================= */}
      {isQuoteModalOpen && quoteEnquiry && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#12151B] border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Calculator className="h-5 w-5 text-amber-400" />
                <h3 className="text-base font-extrabold text-white">Estimate: {quoteEnquiry.name}</h3>
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
                  className="w-full px-3 py-2 bg-[#090C11] border border-slate-700 rounded-xl text-white"
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
                  className="w-full px-3 py-2 bg-[#090C11] border border-slate-700 rounded-xl text-white"
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
                  className="w-full px-3 py-2 bg-[#090C11] border border-slate-700 rounded-xl text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Discount (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={quoteDetails.discountAmount}
                  onChange={(e) => setQuoteDetails({ ...quoteDetails, discountAmount: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#090C11] border border-slate-700 rounded-xl text-white"
                />
              </div>
            </div>

            <div className="bg-[#090C11] border border-amber-500/30 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Estimated Total</span>
                <div className="text-2xl font-black text-amber-400">₹{quoteTotal.toLocaleString('en-IN')}</div>
              </div>
              <div className="text-right text-xs text-slate-400">
                {quoteDetails.holesCount} holes × ₹{quoteDetails.ratePerHole}
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2 border-t border-slate-800">
              <button
                onClick={handlePrintQuotationPDF}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs flex items-center space-x-1"
              >
                <Printer className="h-4 w-4" />
                <span>PDF Quote</span>
              </button>
              <button
                onClick={handleSaveQuotation}
                className="px-5 py-2 rounded-xl bg-brand-orange text-white font-black text-xs shadow-orange-glow"
              >
                Save Quote (₹{quoteTotal})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 6: WHATSAPP QUICK TEMPLATES */}
      {/* ================================================================= */}
      {isWaModalOpen && waEnquiry && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#12151B] border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white">WhatsApp to {waEnquiry.name}</h3>
              <button onClick={() => setIsWaModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex gap-2">
              {(['gu', 'hi', 'en'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => updateWaMessage(l)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold ${
                    waLanguage === l ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {l === 'gu' ? 'ગુજરાતી' : l === 'hi' ? 'हिंदी' : 'English'}
                </button>
              ))}
            </div>

            <textarea
              rows={5}
              value={customWaMessage}
              onChange={(e) => setCustomWaMessage(e.target.value)}
              className="w-full p-3 bg-[#090C11] border border-slate-700 rounded-xl text-xs text-white"
            />

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
              <button onClick={() => setIsWaModalOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl">
                Cancel
              </button>
              <button onClick={handleSendWa} className="px-5 py-2 bg-emerald-600 text-white text-xs font-black rounded-xl flex items-center space-x-1">
                <Send className="h-4 w-4" />
                <span>Open in WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 7: SCHEDULE VISIT */}
      {/* ================================================================= */}
      {isScheduleModalOpen && scheduleEnquiry && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#12151B] border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white">Schedule: {scheduleEnquiry.name}</h3>
              <button onClick={() => setIsScheduleModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSchedule} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={scheduleData.date}
                  onChange={(e) => setScheduleData({ ...scheduleData, date: e.target.value })}
                  className="w-full px-3 py-2 bg-[#090C11] border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Time Slot</label>
                <select
                  value={scheduleData.timeSlot}
                  onChange={(e) => setScheduleData({ ...scheduleData, timeSlot: e.target.value })}
                  className="w-full px-3 py-2 bg-[#090C11] border border-slate-700 rounded-xl text-white"
                >
                  <option value="Morning (09:00 AM - 12:00 PM)">Morning (09:00 AM - 12:00 PM)</option>
                  <option value="Afternoon (12:00 PM - 03:00 PM)">Afternoon (12:00 PM - 03:00 PM)</option>
                  <option value="Evening (03:00 PM - 06:00 PM)">Evening (03:00 PM - 06:00 PM)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Assign Technician</label>
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

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsScheduleModalOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-black rounded-xl">
                  Confirm Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 8: NOTES & PAYMENT */}
      {/* ================================================================= */}
      {isNotesModalOpen && notesEnquiry && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#12151B] border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white">Staff Notes &amp; Payment</h3>
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
                  className="w-full px-3 py-2 bg-[#090C11] border border-slate-700 rounded-xl text-emerald-400 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Follow-up Reminder Date</label>
                <input
                  type="date"
                  value={notesData.followupDate}
                  onChange={(e) => setNotesData({ ...notesData, followupDate: e.target.value })}
                  className="w-full px-3 py-2 bg-[#090C11] border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Internal Note</label>
                <textarea
                  rows={3}
                  value={notesData.notes}
                  onChange={(e) => setNotesData({ ...notesData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-[#090C11] border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsNotesModalOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-emerald-600 text-white font-black rounded-xl">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 9: ADD LEAD */}
      {/* ================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#12151B] border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white">Add Customer Lead</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 rounded-xl bg-red-500/20 text-red-400 text-xs">{modalError}</div>
            )}

            <form onSubmit={handleCreateEnquiry} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Customer Name *</label>
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
                <label className="block text-slate-400 mb-1">Phone Number *</label>
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
                  <label className="block text-slate-400 mb-1">Service</label>
                  <select
                    value={newEnquiryData.serviceId}
                    onChange={(e) => setNewEnquiryData({ ...newEnquiryData, serviceId: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090C11] border border-slate-700 rounded-xl text-white"
                  >
                    <option value="ac-core-cutting">AC Core Cutting</option>
                    <option value="rcc-core-cutting">RCC Core Cutting</option>
                    <option value="ac-drain-hole">AC Drain Hole</option>
                    <option value="concrete-wall-drilling">Concrete Wall Drilling</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Area / Location *</label>
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
                <label className="block text-slate-400 mb-1">Requirement Note</label>
                <textarea
                  rows={2}
                  placeholder="e.g. 3 holes for split AC in bedroom"
                  value={newEnquiryData.message}
                  onChange={(e) => setNewEnquiryData({ ...newEnquiryData, message: e.target.value })}
                  className="w-full px-3 py-2 bg-[#090C11] border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-slate-800">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl">
                  Cancel
                </button>
                <button type="submit" disabled={modalLoading} className="px-5 py-2 bg-brand-orange text-white font-black rounded-xl shadow-orange-glow">
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
