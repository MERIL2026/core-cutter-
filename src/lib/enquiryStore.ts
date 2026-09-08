import fs from 'fs';
import path from 'path';
import { query, ensureEnquiriesTable } from './db';
import { getSupabaseClient } from './supabase';

export interface EnquiryRecord {
  id: string;
  name: string;
  phone: string;
  whatsapp_preference: boolean;
  service_id: string | null;
  service_name?: string;
  service_slug?: string;
  location: string;
  message: string | null;
  status: 'new' | 'contacted' | 'quoted' | 'closed' | 'spam';
  source_page: string | null;
  created_at: string;
  updated_at?: string;
  source?: string;
  quote_amount?: number | null;
  collected_amount?: number | null;
  scheduled_date?: string | null;
  scheduled_time?: string | null;
  assigned_technician?: string | null;
  internal_notes?: string | null;
  followup_date?: string | null;
}

export interface EnquiryStats {
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

function getFallbackFilePath(): string {
  const candidates = [
    path.join(process.cwd(), 'db', 'enquiries_fallback.json'),
    path.join(process.cwd(), 'core cutting website', 'db', 'enquiries_fallback.json'),
    path.resolve(__dirname, '../../db/enquiries_fallback.json'),
    path.resolve(__dirname, '../../../db/enquiries_fallback.json'),
  ];

  for (const p of candidates) {
    if (fs.existsSync(p)) {
      return p;
    }
  }

  const parentDb = path.join(process.cwd(), 'core cutting website', 'db');
  if (fs.existsSync(path.join(process.cwd(), 'core cutting website'))) {
    return path.join(parentDb, 'enquiries_fallback.json');
  }
  return path.join(process.cwd(), 'db', 'enquiries_fallback.json');
}

let memoryEnquiries: EnquiryRecord[] = [];

function ensureFallbackDir(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readFallbackFile(): EnquiryRecord[] {
  try {
    const filePath = getFallbackFilePath();
    ensureFallbackDir(filePath);
    if (!fs.existsSync(filePath)) {
      return memoryEnquiries;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) {
      memoryEnquiries = parsed;
      return parsed;
    }
    return memoryEnquiries;
  } catch {
    return memoryEnquiries;
  }
}

function writeFallbackFile(records: EnquiryRecord[]) {
  const filePaths = [
    path.join(process.cwd(), 'db', 'enquiries_fallback.json'),
    path.join(process.cwd(), 'core cutting website', 'db', 'enquiries_fallback.json'),
  ];

  for (const fp of filePaths) {
    try {
      ensureFallbackDir(fp);
      fs.writeFileSync(fp, JSON.stringify(records, null, 2), 'utf-8');
    } catch {
      // ignore path errors
    }
  }
  memoryEnquiries = records;
}

const SERVICE_NAME_MAP: Record<string, string> = {
  'ac-core-cutting': 'AC Core Cutting',
  'rcc-core-cutting': 'RCC Core Cutting',
  'ac-drain-hole': 'AC Drain Hole',
  'concrete-wall-drilling': 'Concrete Wall Drilling',
  'pipe-cable-passage': 'Pipe & Cable Passage',
  'other': 'Other Services',
};

export async function saveEnquiry(data: {
  name: string;
  phone: string;
  whatsappPreference: boolean;
  serviceId: string;
  location: string;
  message?: string;
  sourcePage?: string;
  source?: string;
  status?: 'new' | 'spam';
  quote_amount?: number | null;
  collected_amount?: number | null;
  scheduled_date?: string | null;
  scheduled_time?: string | null;
  assigned_technician?: string | null;
  internal_notes?: string | null;
  followup_date?: string | null;
}): Promise<{ success: boolean; id: string; storage: 'supabase' | 'db' | 'fallback' }> {
  const recordId = `enq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const nowIso = new Date().toISOString();
  const formattedServiceName =
    SERVICE_NAME_MAP[data.serviceId] ||
    data.serviceId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  const newRecord: EnquiryRecord = {
    id: recordId,
    name: data.name,
    phone: data.phone,
    whatsapp_preference: data.whatsappPreference,
    service_id: data.serviceId,
    service_name: formattedServiceName,
    service_slug: data.serviceId,
    location: data.location,
    message: data.message ? data.message.trim() : null,
    status: data.status || 'new',
    source_page: data.sourcePage ? data.sourcePage.trim() : null,
    created_at: nowIso,
    updated_at: nowIso,
    source: data.source || 'web_form',
    quote_amount: data.quote_amount ?? null,
    collected_amount: data.collected_amount ?? null,
    scheduled_date: data.scheduled_date ?? null,
    scheduled_time: data.scheduled_time ?? null,
    assigned_technician: data.assigned_technician ?? null,
    internal_notes: data.internal_notes ?? null,
    followup_date: data.followup_date ?? null,
  };

  // 1. Persist immediately to local fallback
  try {
    const records = readFallbackFile();
    records.unshift(newRecord);
    writeFallbackFile(records);
  } catch (err) {
    console.error('Fallback write error:', err);
  }

  // 2. Supabase SDK
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data: inserted, error } = await supabase
        .from('enquiries')
        .insert({
          id: recordId,
          name: data.name,
          phone: data.phone,
          whatsapp_preference: data.whatsappPreference,
          service_id: data.serviceId,
          service_name: formattedServiceName,
          location: data.location,
          message: data.message ? data.message.trim() : null,
          status: data.status || 'new',
          source: data.source || 'web_form',
          source_page: data.sourcePage ? data.sourcePage.trim() : null,
          created_at: nowIso,
          updated_at: nowIso,
          quote_amount: data.quote_amount ?? null,
          collected_amount: data.collected_amount ?? null,
          scheduled_date: data.scheduled_date ?? null,
          scheduled_time: data.scheduled_time ?? null,
          assigned_technician: data.assigned_technician ?? null,
          internal_notes: data.internal_notes ?? null,
          followup_date: data.followup_date ?? null,
        })
        .select('id')
        .single();

      if (!error && inserted?.id) {
        return { success: true, id: inserted.id, storage: 'supabase' };
      }
    } catch (err) {
      console.warn('Supabase SDK write error:', err);
    }
  }

  // 3. Postgres Pool Fallback
  try {
    await ensureEnquiriesTable();
    const insertQuery = `
      INSERT INTO enquiries (
        id, name, phone, whatsapp_preference, service_id, service_name,
        location, message, status, source, source_page, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET updated_at = NOW()
      RETURNING id;
    `;
    const res = await query<{ id: string }>(insertQuery, [
      recordId,
      data.name,
      data.phone,
      data.whatsappPreference,
      data.serviceId,
      formattedServiceName,
      data.location,
      data.message ? data.message.trim() : null,
      data.status || 'new',
      data.source || 'web_form',
      data.sourcePage ? data.sourcePage.trim() : null,
    ]);
    if (res.rows?.[0]?.id) {
      return { success: true, id: res.rows[0].id, storage: 'db' };
    }
  } catch {
    // optional
  }

  return { success: true, id: recordId, storage: 'fallback' };
}

export async function getAllEnquiries(options: {
  status?: string | null;
  search?: string | null;
  scheduledOnly?: boolean;
}): Promise<{ enquiries: EnquiryRecord[]; stats: EnquiryStats }> {
  let primaryEnquiries: EnquiryRecord[] = [];
  let fetchedFromCloud = false;

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(300);

      if (!error && data) {
        primaryEnquiries = data as EnquiryRecord[];
        fetchedFromCloud = true;
      }
    } catch (err) {
      console.warn('Supabase read error:', err);
    }
  }

  if (!fetchedFromCloud) {
    try {
      await ensureEnquiriesTable();
      const sql = `
        SELECT 
          e.id, e.name, e.phone, e.whatsapp_preference, e.service_id,
          COALESCE(e.service_name, e.service_id) as service_name,
          e.location, e.message, e.status, e.source, e.source_page,
          e.created_at, e.updated_at
        FROM enquiries e
        ORDER BY e.created_at DESC LIMIT 200;
      `;
      const res = await query<EnquiryRecord>(sql);
      if (res.rows) {
        primaryEnquiries = res.rows;
      }
    } catch {
      // Postgres pool offline
    }
  }

  const fallbackRecords = readFallbackFile();
  const combinedMap = new Map<string, EnquiryRecord>();

  // Fallback records
  for (const r of fallbackRecords) {
    const recordId = r.id || `fb_${Math.random().toString(36).substring(2, 8)}`;
    combinedMap.set(recordId, {
      ...r,
      id: recordId,
      whatsapp_preference: r.whatsapp_preference ?? (r as any).whatsappPreference ?? true,
      service_id: r.service_id || (r as any).serviceId || 'ac-core-cutting',
      service_name: r.service_name || SERVICE_NAME_MAP[r.service_id || ''] || 'AC Core Cutting',
      status: r.status || 'new',
    });
  }

  // Cloud records
  for (const r of primaryEnquiries) {
    combinedMap.set(r.id, {
      ...r,
      service_name: r.service_name || SERVICE_NAME_MAP[r.service_id || ''] || 'AC Core Cutting',
      status: r.status || 'new',
    });
  }

  let allList = Array.from(combinedMap.values()).sort((a, b) => {
    const timeA = new Date(a.created_at).getTime() || 0;
    const timeB = new Date(b.created_at).getTime() || 0;
    return timeB - timeA;
  });

  const now = Date.now();
  const last24h = 24 * 60 * 60 * 1000;

  // Calculate metrics
  let totalRevenue = 0;
  let pipelineValue = 0;
  let scheduledCount = 0;

  for (const r of allList) {
    if (r.collected_amount && r.collected_amount > 0) {
      totalRevenue += Number(r.collected_amount);
    } else if (r.status === 'closed' && r.quote_amount && r.quote_amount > 0) {
      totalRevenue += Number(r.quote_amount);
    }

    if (r.quote_amount && r.quote_amount > 0 && r.status !== 'closed' && r.status !== 'spam') {
      pipelineValue += Number(r.quote_amount);
    }

    if (r.scheduled_date) {
      scheduledCount++;
    }
  }

  const stats: EnquiryStats = {
    total: allList.length,
    new: allList.filter((r) => r.status === 'new').length,
    contacted: allList.filter((r) => r.status === 'contacted').length,
    quoted: allList.filter((r) => r.status === 'quoted').length,
    closed: allList.filter((r) => r.status === 'closed').length,
    spam: allList.filter((r) => r.status === 'spam').length,
    today: allList.filter((r) => {
      const t = new Date(r.created_at).getTime();
      return !isNaN(t) && now - t < last24h;
    }).length,
    totalRevenue,
    pipelineValue,
    scheduledCount,
  };

  if (options.scheduledOnly) {
    allList = allList.filter((r) => Boolean(r.scheduled_date));
  }

  if (options.status && options.status !== 'all') {
    allList = allList.filter((r) => r.status === options.status);
  }

  if (options.search && options.search.trim()) {
    const q = options.search.trim().toLowerCase();
    allList = allList.filter(
      (r) =>
        r.name?.toLowerCase().includes(q) ||
        r.phone?.toLowerCase().includes(q) ||
        r.location?.toLowerCase().includes(q) ||
        r.message?.toLowerCase().includes(q) ||
        r.service_name?.toLowerCase().includes(q) ||
        r.assigned_technician?.toLowerCase().includes(q) ||
        r.internal_notes?.toLowerCase().includes(q)
    );
  }

  return { enquiries: allList, stats };
}

export async function updateEnquiryDetails(
  id: string,
  updates: Partial<EnquiryRecord>
): Promise<boolean> {
  let updatedInCloud = false;
  const nowIso = new Date().toISOString();

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase
        .from('enquiries')
        .update({
          ...updates,
          updated_at: nowIso,
        })
        .eq('id', id);

      if (!error) updatedInCloud = true;
    } catch {
      // ignore
    }
  }

  // Update in fallback file
  const fallbackRecords = readFallbackFile();
  let updatedInFile = false;
  for (const r of fallbackRecords) {
    if (r.id === id || (r as any).phone === id) {
      Object.assign(r, updates, { updated_at: nowIso });
      updatedInFile = true;
    }
  }

  if (updatedInFile) {
    writeFallbackFile(fallbackRecords);
  }

  return updatedInCloud || updatedInFile;
}

export async function updateEnquiryStatus(
  id: string,
  status: 'new' | 'contacted' | 'quoted' | 'closed' | 'spam'
): Promise<boolean> {
  return updateEnquiryDetails(id, { status });
}

export async function deleteEnquiry(id: string): Promise<boolean> {
  let deletedFromCloud = false;

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('enquiries').delete().eq('id', id);
      if (!error) deletedFromCloud = true;
    } catch {
      // ignore
    }
  }

  if (!deletedFromCloud) {
    try {
      await query(`DELETE FROM enquiries WHERE id = $1;`, [id]);
      deletedFromCloud = true;
    } catch {
      // ignore
    }
  }

  const fallbackRecords = readFallbackFile();
  const initialLength = fallbackRecords.length;
  const filtered = fallbackRecords.filter((r) => r.id !== id && (r as any).phone !== id);

  if (filtered.length !== initialLength) {
    writeFallbackFile(filtered);
    return true;
  }

  return deletedFromCloud;
}
