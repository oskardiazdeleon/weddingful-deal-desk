/**
 * Simple file-based JSON store for MVP.
 * Replace with a real database (Postgres, Supabase, etc.) before scaling.
 */
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

function ensureFile(filePath: string, init: unknown[] = []) {
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(init, null, 2));
  }
}

function readJSON<T>(filePath: string): T[] {
  ensureFile(filePath);
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw) as T[];
}

function writeJSON<T>(filePath: string, data: T[]) {
  ensureFile(filePath);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// ── Couple Leads ────────────────────────────────────────────────────────────

export interface CoupleLead {
  id: string;
  createdAt: string;
  email: string;
  weddingDateStart: string;
  weddingDateEnd: string;
  destination: string;
  budget: number;
  guestCount: number;
}

const LEADS_FILE = path.join(DATA_DIR, "couple-leads.json");

export function getCoupleLeads(): CoupleLead[] {
  return readJSON<CoupleLead>(LEADS_FILE);
}

export function saveCoupleLeadToDB(lead: Omit<CoupleLead, "id" | "createdAt">): CoupleLead {
  const leads = getCoupleLeads();
  const newLead: CoupleLead = {
    ...lead,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  leads.push(newLead);
  writeJSON(LEADS_FILE, leads);
  return newLead;
}

// ── Vendor Inquiries ─────────────────────────────────────────────────────────

export interface VendorInquiry {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  company: string;
  vendorType: string;
  message: string;
  status?: "new" | "contacted" | "demo_booked" | "pilot";
  nextFollowupAt?: string;
}

const VENDOR_FILE = path.join(DATA_DIR, "vendor-inquiries.json");
const VENDOR_FOLLOWUPS_FILE = path.join(DATA_DIR, "vendor-followups.json");
const TRAINING_EVENTS_FILE = path.join(DATA_DIR, "vendor-training-events.json");

export function getVendorInquiries(): VendorInquiry[] {
  return readJSON<VendorInquiry>(VENDOR_FILE);
}

export function getVendorInquiryById(id: string): VendorInquiry | null {
  const inquiries = getVendorInquiries();
  return inquiries.find((i) => i.id === id) ?? null;
}

export function saveVendorInquiryToDB(
  inquiry: Omit<VendorInquiry, "id" | "createdAt">
): VendorInquiry {
  const inquiries = getVendorInquiries();
  const newInquiry: VendorInquiry = {
    ...inquiry,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: "new",
  };
  inquiries.push(newInquiry);
  writeJSON(VENDOR_FILE, inquiries);
  return newInquiry;
}

// ── Vendor Training Events ───────────────────────────────────────────────────
export interface VendorTrainingEvent {
  id: string;
  createdAt: string;
  leadId: string;
  event: "sample_started" | "sample_completed";
  score?: number;
  durationSec?: number;
}

export function getVendorTrainingEvents(): VendorTrainingEvent[] {
  return readJSON<VendorTrainingEvent>(TRAINING_EVENTS_FILE);
}

export function saveVendorTrainingEvent(
  e: Omit<VendorTrainingEvent, "id" | "createdAt">
): VendorTrainingEvent {
  const events = getVendorTrainingEvents();
  const item: VendorTrainingEvent = {
    ...e,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  events.push(item);
  writeJSON(TRAINING_EVENTS_FILE, events);
  return item;
}

// ── Vendor Follow-up Queue ──────────────────────────────────────────────────
export interface VendorFollowup {
  id: string;
  createdAt: string;
  leadId: string;
  email: string;
  company: string;
  step: "day0" | "day2" | "day5";
  scheduledFor: string;
  status: "pending" | "sent" | "skipped";
  subject: string;
}

export function getVendorFollowups(): VendorFollowup[] {
  return readJSON<VendorFollowup>(VENDOR_FOLLOWUPS_FILE);
}

export function saveVendorFollowups(
  items: Omit<VendorFollowup, "id" | "createdAt">[]
): VendorFollowup[] {
  const all = getVendorFollowups();
  const created = items.map((i) => ({
    ...i,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }));
  all.push(...created);
  writeJSON(VENDOR_FOLLOWUPS_FILE, all);
  return created;
}
