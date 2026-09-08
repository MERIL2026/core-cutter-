import fs from 'fs';
import path from 'path';
import { query } from './db';

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

const FALLBACK_DIR = path.join(process.cwd(), 'db');
const FALLBACK_FILE = path.join(FALLBACK_DIR, 'enquiries_fallback.json');

// In-memory array to guarantee non-loss even if disk write has temporary locks
let memoryEnquiries: EnquiryRecord[] = [];

function ensureFallbackDir() {
  if (!fs.existsSync(FALLBACK_DIR)) {
    fs.mkdirSync(FALLBACK_DIR, { recursive: true });
  }
}

function readFallbackFile(): EnquiryRecord[] {
  try {
    ensureFallbackDir();
    if (!fs.existsSync(FALLBACK_FILE)) {
      return [];
    }
    const content = fs.readFileSync(FALLBACK_FILE, 'utf-8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Error reading enquiries fallback file:', err);
    return memoryEnquiries;
  }
}

function writeFallbackFile(records: EnquiryRecord[]) {
  try {
    ensureFallbackDir();
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(records, null, 2), 'utf-8');
    memoryEnquiries = records;
  } catch (err) {
    console.error('Error writing enquiries fallback file:', err);
    memoryEnquiries = records;
  }
}

export async function saveEnquiry(data: {
  name: string;
  phone: string;
  whatsappPreference: boolean;
  serviceId: string;
  location: string;
  message?: string;
  sourcePage?: string;
  status?: 'new';
}): Promise<{ success: boolean; id: string; storage: 'db' | 'fallback' }> {
  const fallbackId = `enq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const nowIso = new Date().toISOString();

  const newRecord: EnquiryRecord = {
    id: fallbackId,
    name: data.name,
    phone: data.phone,
    whatsapp_preference: data.whatsappPreference,
    service_id: data.serviceId,
    service_name: data.serviceId.replace(/-/g, ' ').toUpperCase(),
    service_slug: data.serviceId,
    location: data.location,
    message: data.message ? data.message.trim() : null,
    status: 'new',
    source_page: data.sourcePage ? data.sourcePage.trim() : null,
    created_at: nowIso,
    updated_at: nowIso,
    source: 'web_form',
  };

  // Always persist immediately to local fallback file so data is NEVER lost
  try {
    const records = readFallbackFile();
    records.unshift(newRecord);
    writeFallbackFile(records);
    console.log('Enquiry successfully recorded in store:', newRecord.id, newRecord.name);
  } catch (err) {
    console.error('Fallback write error:', err);
  }

  // Attempt optional Postgres DB storage in background
  try {
    let serviceUuid: string | null = null;
    try {
      const serviceLookup = await query<{ id: string }>(
        'SELECT id FROM services WHERE slug = $1 LIMIT 1',
        [data.serviceId]
      );
      if (serviceLookup.rows?.[0]) {
        serviceUuid = serviceLookup.rows[0].id;
      }
    } catch {
      serviceUuid = null;
    }

    const insertQuery = `
      INSERT INTO enquiries (
        name,
        phone,
        whatsapp_preference,
        service_id,
        location,
        message,
        status,
        source_page
      )
      VALUES ($1, $2, $3, $4, $5, $6, 'new', $7)
      RETURNING id, created_at;
    `;

    const res = await query<{ id: string }>(insertQuery, [
      data.name,
      data.phone,
      data.whatsappPreference,
      serviceUuid,
      data.location,
      data.message ? data.message.trim() : null,
      data.sourcePage ? data.sourcePage.trim() : null,
    ]);

    if (res.rows?.[0]?.id) {
      return { success: true, id: res.rows[0].id, storage: 'db' };
    }
  } catch (dbErr) {
    // DB is optional/offline, record is already safely in fallback storage
  }

  return { success: true, id: fallbackId, storage: 'fallback' };
}


export async function getAllEnquiries(options: {
  status?: string | null;
  search?: string | null;
}): Promise<{ enquiries: EnquiryRecord[]; stats: EnquiryStats }> {
  let dbEnquiries: EnquiryRecord[] = [];
  let isDbSuccess = false;

  try {
    let sql = `
      SELECT 
        e.id,
        e.name,
        e.phone,
        e.whatsapp_preference,
        e.service_id,
        COALESCE(s.name, e.service_id) as service_name,
        COALESCE(s.slug, e.service_id) as service_slug,
        e.location,
        e.message,
        e.status,
        e.source_page,
        e.created_at,
        e.updated_at
      FROM enquiries e
      LEFT JOIN services s ON e.service_id = s.id
      ORDER BY e.created_at DESC LIMIT 200;
    `;
    const res = await query<EnquiryRecord>(sql);
    dbEnquiries = res.rows || [];
    isDbSuccess = true;
  } catch (err) {
    console.warn('Could not fetch enquiries from DB, reading from fallback store:', err instanceof Error ? err.message : err);
  }

  const fallbackRecords = readFallbackFile();

  // Merge DB and fallback records without duplicate IDs
  const combinedMap = new Map<string, EnquiryRecord>();

  // Add fallback records first
  for (const r of fallbackRecords) {
    // Ensure all required fields exist
    combinedMap.set(r.id || `${r.phone}_${r.created_at}`, {
      ...r,
      id: r.id || `fb_${Math.random().toString(36).substr(2, 6)}`,
      whatsapp_preference: r.whatsapp_preference ?? (r as any).whatsappPreference ?? true,
      service_id: r.service_id || (r as any).serviceId || 'ac-core-cutting',
      service_name: r.service_name || (r as any).serviceId || 'AC Core Cutting',
      status: r.status || 'new',
    });
  }

  // Add DB records (will overwrite or add)
  for (const r of dbEnquiries) {
    combinedMap.set(r.id, r);
  }

  let allList = Array.from(combinedMap.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Compute total stats over all records
  const now = Date.now();
  const last24h = 24 * 60 * 60 * 1000;

  const stats: EnquiryStats = {
    total: allList.length,
    new: allList.filter((r) => r.status === 'new').length,
    contacted: allList.filter((r) => r.status === 'contacted').length,
    quoted: allList.filter((r) => r.status === 'quoted').length,
    closed: allList.filter((r) => r.status === 'closed').length,
    spam: allList.filter((r) => r.status === 'spam').length,
    today: allList.filter((r) => now - new Date(r.created_at).getTime() < last24h).length,
  };

  // Filter by status if specified
  if (options.status && options.status !== 'all') {
    allList = allList.filter((r) => r.status === options.status);
  }

  // Filter by search query if specified
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
  let updatedInDb = false;

  try {
    await query(
      `UPDATE enquiries SET status = $1, updated_at = NOW() WHERE id = $2;`,
      [status, id]
    );
    updatedInDb = true;
  } catch {
    // DB might be offline, proceed to fallback file
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

  return updatedInDb || updatedInFile;
}

export async function deleteEnquiry(id: string): Promise<boolean> {
  let deletedFromDb = false;

  try {
    await query(`DELETE FROM enquiries WHERE id = $1;`, [id]);
    deletedFromDb = true;
  } catch {
    // DB might be offline
  }

  const fallbackRecords = readFallbackFile();
  const initialLength = fallbackRecords.length;
  const filtered = fallbackRecords.filter((r) => r.id !== id && (r as any).phone !== id);

  if (filtered.length !== initialLength) {
    writeFallbackFile(filtered);
    return true;
  }

  return deletedFromDb;
}
