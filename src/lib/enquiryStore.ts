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
}

export interface EnquiryStats {
  total: number;
  new: number;
  contacted: number;
  quoted: number;
  closed: number;
  spam: number;
  today: number;
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
  };

  // Always write to local fallback so data is never lost
  try {
    const records = readFallbackFile();
    records.unshift(newRecord);
    writeFallbackFile(records);
  } catch (err) {
    console.error('Fallback write error:', err);
  }

  // 1. Try Supabase JS client
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
        })
        .select('id')
        .single();

      if (!error && inserted?.id) {
        return { success: true, id: inserted.id, storage: 'supabase' };
      }
      if (error) {
        console.warn('Supabase insert warning:', error.message);
      }
    } catch (err) {
      console.warn('Supabase SDK write error:', err);
    }
  }

  // 2. Try direct Postgres Pool
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
    // Postgres pool optional
  }

  return { success: true, id: recordId, storage: 'fallback' };
}

export async function getAllEnquiries(options: {
  status?: string | null;
  search?: string | null;
}): Promise<{ enquiries: EnquiryRecord[]; stats: EnquiryStats }> {
  let primaryEnquiries: EnquiryRecord[] = [];
  let fetchedFromCloud = false;

  // 1. Try Supabase SDK
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
      console.warn('Supabase SDK read error:', err);
    }
  }

  // 2. Try Postgres Pool if Supabase SDK wasn't used or failed
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

  // Add fallback records
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

  // Add cloud/DB records (overwrite or add)
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

  // Compute total stats
  const now = Date.now();
  const last24h = 24 * 60 * 60 * 1000;

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
  };

  // Filter by status
  if (options.status && options.status !== 'all') {
    allList = allList.filter((r) => r.status === options.status);
  }

  // Filter by search query
  if (options.search && options.search.trim()) {
    const q = options.search.trim().toLowerCase();
    allList = allList.filter(
      (r) =>
        r.name?.toLowerCase().includes(q) ||
        r.phone?.toLowerCase().includes(q) ||
        r.location?.toLowerCase().includes(q) ||
        r.message?.toLowerCase().includes(q) ||
        r.service_name?.toLowerCase().includes(q)
    );
  }

  return { enquiries: allList, stats };
}

export async function updateEnquiryStatus(
  id: string,
  status: 'new' | 'contacted' | 'quoted' | 'closed' | 'spam'
): Promise<boolean> {
  let updatedInCloud = false;

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase
        .from('enquiries')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (!error) updatedInCloud = true;
    } catch {
      // ignore
    }
  }

  if (!updatedInCloud) {
    try {
      await query(
        `UPDATE enquiries SET status = $1, updated_at = NOW() WHERE id = $2;`,
        [status, id]
      );
      updatedInCloud = true;
    } catch {
      // ignore
    }
  }

  // Update in fallback file
  const fallbackRecords = readFallbackFile();
  let updatedInFile = false;
  for (const r of fallbackRecords) {
    if (r.id === id || (r as any).phone === id) {
      r.status = status;
      r.updated_at = new Date().toISOString();
      updatedInFile = true;
    }
  }

  if (updatedInFile) {
    writeFallbackFile(fallbackRecords);
  }

  return updatedInCloud || updatedInFile;
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
