'use client';

import React, { useState, useEffect } from 'react';
import {
  Printer,
  Share2,
  Download,
  Plus,
  Trash2,
  RefreshCw,
  Check,
  Copy,
  FileText,
  Sparkles,
  Send,
  Save,
  MessageSquare,
  QrCode,
  DollarSign,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { defaultBusinessProfile } from '@/content/business';

export interface BillItem {
  id: string;
  name: string;
  description: string;
  qty: number | string;
  rate: number;
  amount: number;
}

export interface InitialCustomerData {
  name?: string;
  phone?: string;
  location?: string;
  serviceName?: string;
  quoteAmount?: number;
  message?: string;
}

interface BillGeneratorProps {
  initialData?: InitialCustomerData | null;
  onSavedToCrm?: () => void;
  onClose?: () => void;
}

export const BillGenerator: React.FC<BillGeneratorProps> = ({
  initialData,
  onSavedToCrm,
  onClose,
}) => {
  // Document meta
  const [docType, setDocType] = useState<'OFFICIAL ESTIMATE' | 'TAX INVOICE' | 'CASH RECEIPT'>('OFFICIAL ESTIMATE');
  const [billNumber, setBillNumber] = useState(`EST-${Math.floor(100000 + Math.random() * 900000)}`);
  const [billDate, setBillDate] = useState(() => {
    const d = new Date();
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  });

  // Customer Information
  const [customerName, setCustomerName] = useState(initialData?.name || 'MERIL PARMAR');
  const [customerPhone, setCustomerPhone] = useState(initialData?.phone || '9558733785');
  const [customerLocation, setCustomerLocation] = useState(initialData?.location || 'newsama');

  // Job Specification
  const [serviceName, setServiceName] = useState(initialData?.serviceName || 'AC CORE CUTTING');
  const [holeDiameter, setHoleDiameter] = useState('3 Inch (75mm)');
  const [wallStructure, setWallStructure] = useState('Brick Wall (₹350/hole)');

  // Items in the bill
  const [ratePerHole, setRatePerHole] = useState(350);
  const [holesCount, setHolesCount] = useState(3);
  const [includeDustCollector, setIncludeDustCollector] = useState(true);
  const [dustRate, setDustRate] = useState(200);

  // Additional custom items
  const [customItems, setCustomItems] = useState<BillItem[]>([]);
  const [newCustomTitle, setNewCustomTitle] = useState('');
  const [newCustomSub, setNewCustomSub] = useState('');
  const [newCustomQty, setNewCustomQty] = useState('1');
  const [newCustomRate, setNewCustomRate] = useState<number>(0);

  // Financials
  const [discountAmount, setDiscountAmount] = useState(0);

  // State flags
  const [copied, setCopied] = useState(false);
  const [isSavingToCrm, setIsSavingToCrm] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Auto update from initial data if passed
  useEffect(() => {
    if (initialData) {
      if (initialData.name) setCustomerName(initialData.name);
      if (initialData.phone) setCustomerPhone(initialData.phone);
      if (initialData.location) setCustomerLocation(initialData.location);
      if (initialData.serviceName) setServiceName(initialData.serviceName);
    }
  }, [initialData]);

  // Main primary cutting item
  const mainCuttingAmount = ratePerHole * holesCount;
  const dustAmount = includeDustCollector ? dustRate : 0;
  const customItemsTotal = customItems.reduce((acc, item) => acc + item.amount, 0);

  const subtotal = mainCuttingAmount + dustAmount + customItemsTotal;
  const grandTotal = Math.max(0, subtotal - discountAmount);

  // Add custom item handler
  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomTitle.trim() || newCustomRate <= 0) return;

    const qtyNum = Number(newCustomQty) || 1;
    const itemAmount = qtyNum * newCustomRate;

    const newItem: BillItem = {
      id: `custom-${Date.now()}`,
      name: newCustomTitle.trim(),
      description: newCustomSub.trim(),
      qty: newCustomQty.trim() || '1',
      rate: newCustomRate,
      amount: itemAmount,
    };

    setCustomItems([...customItems, newItem]);
    setNewCustomTitle('');
    setNewCustomSub('');
    setNewCustomQty('1');
    setNewCustomRate(0);
  };

  const handleRemoveCustomItem = (id: string) => {
    setCustomItems(customItems.filter((item) => item.id !== id));
  };

  const generateNewBillNumber = () => {
    const prefix = docType === 'TAX INVOICE' ? 'INV' : docType === 'CASH RECEIPT' ? 'REC' : 'EST';
    setBillNumber(`${prefix}-${Math.floor(100000 + Math.random() * 900000)}`);
  };

  // 1. PRINT & PDF DOWNLOAD
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const customItemsHtml = customItems
      .map(
        (item) => `
        <tr>
          <td>
            <strong>${item.name}</strong>
            ${item.description ? `<br/><span style="font-size: 11px; color: #64748b;">${item.description}</span>` : ''}
          </td>
          <td style="text-align: center; font-weight: bold;">${item.qty}</td>
          <td style="text-align: right;">₹${item.rate}</td>
          <td style="text-align: right; font-weight: bold;">₹${item.amount}</td>
        </tr>
      `
      )
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>${docType.replace(/\s+/g, '_')}_${customerName.replace(/\s+/g, '_')}_${billNumber}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 12mm 15mm;
          }
          * {
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #0f172a;
            margin: 0;
            padding: 24px;
            font-size: 13px;
            line-height: 1.5;
            background: #ffffff;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding-bottom: 14px;
            border-bottom: 2px solid #0f172a;
          }
          .brand-title {
            font-size: 22px;
            font-weight: 900;
            color: #0f172a;
            letter-spacing: -0.5px;
            margin: 0;
          }
          .brand-subtitle {
            color: #64748b;
            font-size: 11.5px;
            margin-top: 2px;
          }
          .brand-meta {
            margin-top: 5px;
            font-size: 11px;
            font-weight: 600;
            color: #334155;
          }
          .badge-container {
            text-align: right;
          }
          .badge {
            display: inline-block;
            background: #FA4A14;
            color: #ffffff;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 900;
            letter-spacing: 0.5px;
            text-transform: uppercase;
          }
          .meta-info {
            font-size: 11px;
            color: #475569;
            margin-top: 6px;
          }
          .meta-info strong {
            color: #0f172a;
          }
          .details-card {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
            margin: 20px 0;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 16px 20px;
            border-radius: 8px;
          }
          .section-label {
            color: #64748b;
            font-size: 9.5px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.6px;
            margin-bottom: 4px;
          }
          .customer-name {
            font-size: 15px;
            font-weight: 900;
            color: #0f172a;
            text-transform: uppercase;
          }
          .customer-detail {
            color: #334155;
            font-weight: 600;
            font-size: 12px;
            margin-top: 3px;
          }
          .service-name {
            font-size: 13px;
            font-weight: 800;
            color: #0f172a;
            text-transform: uppercase;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 16px 0 20px 0;
          }
          th {
            background: #0D1117;
            color: #ffffff;
            padding: 10px 12px;
            text-align: left;
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.6px;
          }
          td {
            padding: 12px 12px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 12.5px;
          }
          .total-box {
            margin-left: auto;
            width: 280px;
            background: #f1f5f9;
            border: 1px solid #cbd5e1;
            padding: 14px 16px;
            border-radius: 8px;
            margin-top: 10px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 6px;
            font-weight: 600;
            color: #334155;
            font-size: 12px;
          }
          .grand-total {
            font-size: 18px;
            font-weight: 900;
            color: #FA4A14;
            border-top: 2px solid #cbd5e1;
            padding-top: 8px;
            margin-top: 8px;
          }
          .terms-box {
            margin-top: 28px;
            font-size: 11px;
            color: #78350f;
            background: #fff7ed;
            border: 1px solid #fed7aa;
            padding: 14px 18px;
            border-radius: 8px;
          }
          .terms-title {
            font-weight: 800;
            font-size: 11px;
            color: #9a3412;
            margin-bottom: 4px;
          }
          .terms-box ul {
            margin: 4px 0 0 16px;
            padding: 0;
          }
          .terms-box li {
            margin-bottom: 3px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="brand-title">${defaultBusinessProfile.business_name}</h1>
            <div class="brand-subtitle">Professional Diamond Core Cutting & RCC Drilling Services</div>
            <div class="brand-meta">
              Phone: ${defaultBusinessProfile.phone || '+919876543210'} • Location: ${defaultBusinessProfile.city || 'Local Service Region'}
            </div>
          </div>
          <div class="badge-container">
            <span class="badge">${docType}</span>
            <div class="meta-info">Date: <strong>${billDate}</strong></div>
            <div class="meta-info">Estimate #: <strong>${billNumber}</strong></div>
          </div>
        </div>

        <div class="details-card">
          <div>
            <div class="section-label">Quotation For:</div>
            <div class="customer-name">${customerName}</div>
            <div class="customer-detail">📞 ${customerPhone}</div>
            <div class="customer-detail">📍 ${customerLocation}</div>
          </div>
          <div>
            <div class="section-label">Job Specification:</div>
            <div class="service-name">Service: ${serviceName}</div>
            <div class="customer-detail">Hole Diameter: ${holeDiameter}</div>
            <div class="customer-detail">Wall Structure: ${wallStructure}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 55%;">Description</th>
              <th style="width: 15%; text-align: center;">Qty</th>
              <th style="width: 15%; text-align: right;">Rate</th>
              <th style="width: 15%; text-align: right;">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Diamond Core Hole Cutting</strong><br/>
                <span style="font-size: 11px; color: #64748b;">Size: ${holeDiameter} in ${wallStructure} (Zero vibration guarantee)</span>
              </td>
              <td style="text-align: center; font-weight: bold;">${holesCount}</td>
              <td style="text-align: right;">₹${ratePerHole}</td>
              <td style="text-align: right; font-weight: bold;">₹${mainCuttingAmount}</td>
            </tr>
            ${
              includeDustCollector
                ? `
            <tr>
              <td>
                <strong>Slurry & Dust Collector Protection Attachment</strong><br/>
                <span style="font-size: 11px; color: #64748b;">Industrial clean water catchment ring & vacuum seal</span>
              </td>
              <td style="text-align: center; font-weight: bold;">1 Job</td>
              <td style="text-align: right;">₹${dustRate}</td>
              <td style="text-align: right; font-weight: bold;">₹${dustRate}</td>
            </tr>`
                : ''
            }
            ${customItemsHtml}
          </tbody>
        </table>

        <div class="total-box">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>₹${subtotal}</span>
          </div>
          ${
            discountAmount > 0
              ? `
          <div class="total-row" style="color: #16a34a;">
            <span>Discount:</span>
            <span>-₹${discountAmount}</span>
          </div>`
              : ''
          }
          <div class="total-row grand-total">
            <span>Total Estimate:</span>
            <span>₹${grandTotal}</span>
          </div>
        </div>

        <div class="terms-box">
          <div class="terms-title">Terms & Conditions:</div>
          <ul>
            <li>Customer to provide standard single-phase 230V electric point (15A) and water supply.</li>
            <li>Zero vibration guarantee protects structural integrity of walls and tiles.</li>
            <li>No structural beam cuts performed without owner/engineer consent.</li>
          </ul>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  // 2. SHARE ON WHATSAPP
  const handleShareWhatsApp = () => {
    const cleanPhone = customerPhone.replace(/\D/g, '');
    const upiPayLink = `upi://pay?pa=9876543210@upi&pn=Diamond+Core+Cutting&am=${grandTotal}&cu=INR`;

    const message = `*${defaultBusinessProfile.business_name}*\n📄 *${docType} #${billNumber}*\nDate: ${billDate}\n\n👤 *Customer:* ${customerName}\n📍 *Site:* ${customerLocation}\n🛠️ *Job:* ${serviceName} (${holeDiameter})\n🧱 *Structure:* ${wallStructure}\n\n*Breakdown:*\n• ${holesCount} Holes × ₹${ratePerHole} = ₹${mainCuttingAmount}\n${includeDustCollector ? `• Clean Dust Catchment: ₹${dustRate}\n` : ''}${customItems.map((c) => `• ${c.name}: ₹${c.amount}\n`).join('')}${discountAmount > 0 ? `• Discount: -₹${discountAmount}\n` : ''}\n💰 *GRAND TOTAL: ₹${grandTotal}*\n\n📲 *Direct UPI Payment Link:*\n${upiPayLink}\n\n✨ *Zero-Vibration Precision Diamond Cutting Guarantee.*\nThank you for choosing ${defaultBusinessProfile.business_name}! 🙏`;

    if (cleanPhone) {
      window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  // 3. COPY TEXT SUMMARY
  const handleCopyText = () => {
    const summary = `${defaultBusinessProfile.business_name}\n${docType} #${billNumber}\nCustomer: ${customerName} (${customerPhone})\nLocation: ${customerLocation}\nService: ${serviceName} - ${holesCount} holes (${holeDiameter})\nTotal: ₹${grandTotal}`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 4. SAVE TO CRM AS LEAD RECORD
  const handleSaveToCrm = async () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Customer Name and Phone are required to save.');
      return;
    }

    setIsSavingToCrm(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/admin/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: customerName.trim(),
          phone: customerPhone.trim(),
          location: customerLocation.trim() || defaultBusinessProfile.city,
          serviceId: 'ac-core-cutting',
          serviceName: serviceName,
          status: 'quoted',
          quote_amount: grandTotal,
          message: `Bill Generated (${docType} #${billNumber}): ${holesCount} holes (${holeDiameter}) in ${wallStructure}.`,
          whatsappPreference: true,
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        if (onSavedToCrm) onSavedToCrm();
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save bill to CRM:', err);
    } finally {
      setIsSavingToCrm(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions Bar */}
      <div className="bg-[#0F1420]/90 border border-white/[0.08] rounded-3xl p-4 sm:p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-9 w-9 rounded-xl bg-gradient-to-tr from-brand-orange to-amber-500 flex items-center justify-center text-white font-bold text-base shadow-orange-glow">
              🧾
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                Offline Bill &amp; Official Estimate Generator
              </h2>
              <p className="text-xs text-slate-400">
                Generate, customize, print, share on WhatsApp, and download A4 invoices for offline or on-site customers.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-black shadow-orange-glow transition-all active:scale-95 cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>Print / Save PDF</span>
          </button>

          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all active:scale-95 cursor-pointer"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Send on WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={handleCopyText}
            className="inline-flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-slate-300 transition-all cursor-pointer"
            title="Copy text summary"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            type="button"
            onClick={handleSaveToCrm}
            disabled={isSavingToCrm}
            className="inline-flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-xs font-bold text-blue-300 transition-all cursor-pointer disabled:opacity-50"
            title="Save customer and amount to CRM database"
          >
            <Save className="h-4 w-4" />
            <span className="hidden sm:inline">{saveSuccess ? 'Saved to CRM!' : isSavingToCrm ? 'Saving...' : 'Save Record'}</span>
          </button>

          <button
            type="button"
            onClick={generateNewBillNumber}
            className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 transition-all cursor-pointer"
            title="Generate new Bill Number"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl bg-white/[0.04] text-slate-400 text-xs font-bold"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Form Editor (Left) & Real-time Live Bill Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ============================================================= */}
        {/* 1. BILL CONFIGURATION & FORM (5 Cols on Desktop) */}
        {/* ============================================================= */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0F1420]/90 border border-white/[0.08] rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                <span>⚙️ Bill Setup &amp; Customer Form</span>
              </h3>
              <span className="text-[10px] text-brand-orange font-bold font-mono uppercase">
                {billNumber}
              </span>
            </div>

            {/* Document Type Selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Document Type
              </label>
              <div className="grid grid-cols-3 gap-1.5 bg-[#080C14] p-1 rounded-xl border border-white/[0.08]">
                {(['OFFICIAL ESTIMATE', 'TAX INVOICE', 'CASH RECEIPT'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setDocType(t);
                      const prefix = t === 'TAX INVOICE' ? 'INV' : t === 'CASH RECEIPT' ? 'REC' : 'EST';
                      setBillNumber(`${prefix}-${Math.floor(100000 + Math.random() * 900000)}`);
                    }}
                    className={`py-1.5 px-1 rounded-lg text-[10px] font-extrabold transition-all truncate cursor-pointer ${
                      docType === t ? 'bg-brand-orange text-white shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t === 'OFFICIAL ESTIMATE' ? 'Estimate' : t === 'TAX INVOICE' ? 'Invoice' : 'Receipt'}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. MERIL PARMAR"
                  className="w-full px-3.5 py-2 bg-[#080C14] border border-white/[0.08] focus:border-brand-orange rounded-xl text-xs font-bold text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. 9558733785"
                    className="w-full px-3.5 py-2 bg-[#080C14] border border-white/[0.08] focus:border-brand-orange rounded-xl text-xs font-bold text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Site Location / Area
                  </label>
                  <input
                    type="text"
                    value={customerLocation}
                    onChange={(e) => setCustomerLocation(e.target.value)}
                    placeholder="e.g. newsama, Vadodara"
                    className="w-full px-3.5 py-2 bg-[#080C14] border border-white/[0.08] focus:border-brand-orange rounded-xl text-xs font-bold text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Bill Date
                  </label>
                  <input
                    type="text"
                    value={billDate}
                    onChange={(e) => setBillDate(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#080C14] border border-white/[0.08] rounded-xl text-xs font-medium text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Doc / Estimate #
                  </label>
                  <input
                    type="text"
                    value={billNumber}
                    onChange={(e) => setBillNumber(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#080C14] border border-white/[0.08] rounded-xl text-xs font-mono font-bold text-brand-orange focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Core Cutting Specifications */}
            <div className="pt-2 border-t border-white/[0.08] space-y-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-orange block">
                Job &amp; Hole Parameters
              </span>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Service Title
                </label>
                <input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="e.g. AC CORE CUTTING"
                  className="w-full px-3.5 py-2 bg-[#080C14] border border-white/[0.08] rounded-xl text-xs font-bold text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Hole Diameter
                  </label>
                  <select
                    value={holeDiameter}
                    onChange={(e) => setHoleDiameter(e.target.value)}
                    className="w-full px-3 py-2 bg-[#080C14] border border-white/[0.08] rounded-xl text-xs text-white focus:outline-none"
                  >
                    <option value="2 Inch (50mm)">2 Inch (50mm - Drain)</option>
                    <option value="3 Inch (75mm)">3 Inch (75mm - Split AC)</option>
                    <option value="4 Inch (100mm)">4 Inch (100mm - Soil)</option>
                    <option value="5 Inch (125mm)">5 Inch (125mm - Hood)</option>
                    <option value="6 Inch (150mm)">6 Inch (150mm - Chimney)</option>
                    <option value="8 Inch (200mm)">8 Inch (200mm - Bridge)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Wall Structure &amp; Rate
                  </label>
                  <select
                    value={ratePerHole}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setRatePerHole(val);
                      if (val === 350) setWallStructure('Brick Wall (₹350/hole)');
                      else if (val === 450) setWallStructure('AAC Block (₹450/hole)');
                      else if (val === 650) setWallStructure('Heavy RCC Beam (₹650/hole)');
                      else if (val === 850) setWallStructure('RCC Slab (₹850/hole)');
                    }}
                    className="w-full px-3 py-2 bg-[#080C14] border border-white/[0.08] rounded-xl text-xs text-white focus:outline-none"
                  >
                    <option value={350}>Brick Wall (₹350/hole)</option>
                    <option value={450}>AAC Block (₹450/hole)</option>
                    <option value={650}>Heavy RCC Beam (₹650/hole)</option>
                    <option value={850}>RCC Slab (₹850/hole)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Holes Count: {holesCount}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={holesCount}
                    onChange={(e) => setHolesCount(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3.5 py-2 bg-[#080C14] border border-white/[0.08] rounded-xl text-xs font-black text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Discount (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3.5 py-2 bg-[#080C14] border border-white/[0.08] rounded-xl text-xs font-bold text-rose-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Dust collector checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="billDust"
                  checked={includeDustCollector}
                  onChange={(e) => setIncludeDustCollector(e.target.checked)}
                  className="rounded border-slate-700 text-brand-orange focus:ring-0 accent-brand-orange h-4 w-4"
                />
                <label htmlFor="billDust" className="text-xs text-slate-300 font-medium cursor-pointer">
                  Include Slurry &amp; Dust Collector Attachment (+₹200)
                </label>
              </div>
            </div>

            {/* Custom Extra Line Item Adder */}
            <div className="pt-2 border-t border-white/[0.08] space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                + Add Custom Service / Item
              </span>

              <form onSubmit={handleAddCustomItem} className="space-y-2">
                <input
                  type="text"
                  placeholder="Item Name (e.g. Scaffolding / Extra Depth)"
                  value={newCustomTitle}
                  onChange={(e) => setNewCustomTitle(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#080C14] border border-white/[0.08] rounded-xl text-xs text-white"
                />

                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Qty (e.g. 1 Job)"
                    value={newCustomQty}
                    onChange={(e) => setNewCustomQty(e.target.value)}
                    className="px-2.5 py-1.5 bg-[#080C14] border border-white/[0.08] rounded-xl text-xs text-white"
                  />
                  <input
                    type="number"
                    placeholder="Rate (₹)"
                    value={newCustomRate || ''}
                    onChange={(e) => setNewCustomRate(Number(e.target.value))}
                    className="px-2.5 py-1.5 bg-[#080C14] border border-white/[0.08] rounded-xl text-xs text-white"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-white/[0.08] hover:bg-white/[0.14] text-xs font-bold text-white rounded-xl transition-colors cursor-pointer"
                  >
                    + Add Item
                  </button>
                </div>
              </form>

              {customItems.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  {customItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-2 rounded-xl bg-[#080C14] border border-white/[0.06] flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-white">{item.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {item.qty} × ₹{item.rate} = ₹{item.amount}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveCustomItem(item.id)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================= */}
        {/* 2. REAL-TIME LIVE BILL PREVIEW (7 Cols on Desktop) */}
        {/* Exact visual layout as shown in the screenshot */}
        {/* ============================================================= */}
        <div className="lg:col-span-7">
          <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-slate-200 overflow-hidden font-sans">
            {/* Header: Business & Title */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b-2 border-slate-900">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight leading-tight">
                  {defaultBusinessProfile.business_name}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Professional Diamond Core Cutting &amp; RCC Drilling Services
                </p>
                <div className="text-[11px] font-semibold text-slate-700 mt-1">
                  Phone: {defaultBusinessProfile.phone || '+919876543210'} • Location: {defaultBusinessProfile.city || 'Local Service Region'}
                </div>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className="inline-block bg-[#FA4A14] text-white text-[11px] font-black px-3 py-1 rounded-md uppercase tracking-wider shadow-xs">
                  {docType}
                </span>
                <div className="text-[11px] text-slate-500 mt-2">
                  Date: <strong className="text-slate-900">{billDate}</strong>
                </div>
                <div className="text-[11px] text-slate-500">
                  Estimate #: <strong className="text-slate-900">{billNumber}</strong>
                </div>
              </div>
            </div>

            {/* Details Card (2 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-5 bg-[#f8fafc] border border-slate-200 rounded-xl p-4 sm:p-5">
              <div>
                <div className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                  Quotation For:
                </div>
                <div className="text-sm font-black text-slate-950 uppercase">
                  {customerName || 'CUSTOMER NAME'}
                </div>
                <div className="text-xs font-semibold text-slate-700 mt-1 flex items-center gap-1">
                  <span>📞</span>
                  <span>{customerPhone || '9876543210'}</span>
                </div>
                <div className="text-xs text-slate-600 mt-0.5 flex items-center gap-1">
                  <span>📍</span>
                  <span>{customerLocation || 'Site Location'}</span>
                </div>
              </div>

              <div>
                <div className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                  Job Specification:
                </div>
                <div className="text-xs font-bold text-slate-950 uppercase">
                  Service: {serviceName}
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Hole Diameter: <strong className="text-slate-800">{holeDiameter}</strong>
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  Wall Structure: <strong className="text-slate-800">{wallStructure}</strong>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#0D1117] text-white text-[10px] font-extrabold uppercase tracking-wider">
                    <th className="py-2.5 px-3 rounded-l-md">Description</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Rate</th>
                    <th className="py-2.5 px-3 text-right rounded-r-md">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  <tr>
                    <td className="py-3.5 px-3">
                      <strong className="text-slate-950 text-xs block">Diamond Core Hole Cutting</strong>
                      <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                        Size: {holeDiameter} in {wallStructure} (Zero vibration guarantee)
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold">{holesCount}</td>
                    <td className="py-3.5 px-3 text-right font-medium">₹{ratePerHole}</td>
                    <td className="py-3.5 px-3 text-right font-black text-slate-950">₹{mainCuttingAmount}</td>
                  </tr>

                  {includeDustCollector && (
                    <tr>
                      <td className="py-3 px-3">
                        <strong className="text-slate-950 text-xs block">
                          Slurry &amp; Dust Collector Protection Attachment
                        </strong>
                        <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                          Industrial vacuum slurry ring for clean wall &amp; tile protection
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-bold">1 Job</td>
                      <td className="py-3 px-3 text-right font-medium">₹{dustRate}</td>
                      <td className="py-3 px-3 text-right font-black text-slate-950">₹{dustRate}</td>
                    </tr>
                  )}

                  {customItems.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 px-3">
                        <strong className="text-slate-950 text-xs block">{item.name}</strong>
                        {item.description && (
                          <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                            {item.description}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center font-bold">{item.qty}</td>
                      <td className="py-3 px-3 text-right font-medium">₹{item.rate}</td>
                      <td className="py-3 px-3 text-right font-black text-slate-950">₹{item.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Box (Aligned Right) */}
            <div className="flex justify-end mt-4">
              <div className="w-64 bg-[#f1f5f9] border border-slate-300 rounded-xl p-3.5 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600 font-semibold">
                  <span>Subtotal:</span>
                  <span className="font-bold text-slate-900">₹{subtotal}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount:</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t-2 border-slate-300 text-sm font-black">
                  <span className="text-slate-900">Total Estimate:</span>
                  <span className="text-xl font-black text-[#FA4A14]">₹{grandTotal}</span>
                </div>
              </div>
            </div>

            {/* Terms & Conditions Box (Soft light orange background) */}
            <div className="mt-6 bg-[#fff7ed] border border-[#fed7aa] rounded-xl p-3.5 sm:p-4 text-[11px] text-[#78350f]">
              <div className="font-extrabold text-[#9a3412] uppercase tracking-wider text-[10px] mb-1">
                Terms &amp; Conditions:
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-slate-700 text-[11px]">
                <li>Customer to provide standard single-phase 230V electric point (15A) and water supply.</li>
                <li>Zero vibration guarantee protects structural integrity of walls and tiles.</li>
                <li>No structural beam cuts performed without owner/engineer consent.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
