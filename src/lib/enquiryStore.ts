import fs from 'fs';
import path from 'path';
import { query, ensureEnquiriesTable } from './db';

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
  } catch (err) {
    return memoryEnquiries;
  }
}

function writeFallbackFile(records: EnquiryRecord[]) {
  try {
    const filePath = getFallbackFilePath();
    ensureFallbackDir(filePath);
    fs.writeFileSync(filePath, JSON.stringify(records, null, 2), 'utf-8');
    memoryEnquiries = records;
  } catch (err) {
    memoryEnquiries = records;
  }
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
  status?: 'new';
}): Promise<{ success: boolean; id: string; storage: 'db' | 'fallback' }> {
  const fallbackId = `enq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const nowIso = new Date().toISOString();
  const formattedServiceName =
    SERVICE_NAME_MAP[data.serviceId] ||
    data.serviceId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  const newRecord: EnquiryRecord = {
    id: fallbackId,
    name: data.name,
    phone: data.phone,
    whatsapp_preference: data.whatsappPreference,
    service_id: data.serviceId,
    service_name: formattedServiceName,
    service_slug: data.serviceId,
    location: data.location,
    message: data.message ? data.message.trim() : null,
    status: 'new',
    source_page: data.sourcePage ? data.sourcePage.trim() : null,
    created_at: nowIso,
    updated_at: nowIso,
    source: data.source || 'web_form',
  };

  // Always persist immediately to local fallback file so data is NEVER lost
  try {
    const records = readFallbackFile();
    records.unshift(newRecord);
    writeFallbackFile(records);
  } catch (err) {
    console.error('Fallback write error:', err);
  }

  // Attempt Postgres DB storage in background if available
  try {
    await ensureEnquiriesTable();

    const insertQuery = `
      INSERT INTO enquiries (
        id,
        name,
        phone,
        whatsapp_preference,
        service_id,
        service_name,
        location,
        message,
        status,
        source,
        source_page,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET updated_at = NOW()
      RETURNING id, created_at;
    `;

    const res = await query<{ id: string }>(insertQuery, [
      fallbackId,
      data.name,
      data.phone,
      data.whatsappPreference,
      data.serviceId,
      formattedServiceName,
      data.location,
      data.message ? data.message.trim() : null,
      'new',
      data.source || 'web_form',
      data.sourcePage ? data.sourcePage.trim() : null,
    ]);

    if (res.rows?.[0]?.id) {
      return { success: true, id: res.rows[0].id, storage: 'db' };
    }
  } catch {
    // DB offline/optional
  }

  return { success: true, id: fallbackId, storage: 'fallback' };
}

export async function getAllEnquiries(options: {
  status?: string | null;
  search?: string | null;
}): Promise<{ enquiries: EnquiryRecord[]; stats: EnquiryStats }> {
  let dbEnquiries: EnquiryRecord[] = [];

  try {
    await ensureEnquiriesTable();
    const sql = `
      SELECT 
        e.id,
        e.name,
        e.phone,
        e.whatsapp_preference,
        e.service_id,
        COALESCE(e.service_name, e.service_id) as service_name,
        e.location,
        e.message,
        e.status,
        e.source,
        e.source_page,
        e.created_at,
        e.updated_at
      FROM enquiries e
      ORDER BY e.created_at DESC LIMIT 200;
    `;
    const res = await query<EnquiryRecord>(sql);
    dbEnquiries = res.rows || [];
  } catch (err) {
    // Expected when Postgres is not running or not configured
  }

  const fallbackRecords = readFallbackFile();

  // Merge DB and fallback records, deduplicating by ID
  const combinedMap = new Map<string, EnquiryRecord>();

  // Add fallback records first
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

  // Add DB records (will overwrite or add)
  for (const r of dbEnquiries) {
    combinedMap.set(r.id, {
      ...r,
      service_name: r.service_name || SERVICE_NAME_MAP[r.service_id || ''] || 'AC Core Cutting',
      status: r.status || 'new',
    });
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
