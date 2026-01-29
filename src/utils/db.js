import { openDB } from 'idb';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const DB_NAME = 'qsr-challenge-db';
const DB_VERSION = 1;
const CANDIDATES_STORE = 'candidates';

// ── IndexedDB (local fallback) ──────────────────────────────────────────────

async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(CANDIDATES_STORE)) {
        const store = db.createObjectStore(CANDIDATES_STORE, { keyPath: 'candidateId' });
        store.createIndex('timestamp', 'timestamp');
        store.createIndex('archetype', 'archetype');
      }
    },
  });
}

// ── Public API ──────────────────────────────────────────────────────────────

// Generate a unique candidate ID
export function generateCandidateId() {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomStr}`;
}

// Save candidate submission (Supabase if configured, else IndexedDB)
export async function saveCandidate(candidateData) {
  if (isSupabaseConfigured()) {
    return saveCandidateToSupabase(candidateData);
  }
  // Fallback: local IndexedDB
  const db = await initDB();
  await db.put(CANDIDATES_STORE, candidateData);
  return candidateData;
}

// Get all candidates
export async function getAllCandidates() {
  if (isSupabaseConfigured()) {
    return getAllCandidatesFromSupabase();
  }
  const db = await initDB();
  const candidates = await db.getAll(CANDIDATES_STORE);
  return candidates.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

// Get candidate by ID
export async function getCandidateById(candidateId) {
  if (isSupabaseConfigured()) {
    return getCandidateByIdFromSupabase(candidateId);
  }
  const db = await initDB();
  return db.get(CANDIDATES_STORE, candidateId);
}

// Delete candidate
export async function deleteCandidate(candidateId) {
  if (isSupabaseConfigured()) {
    return deleteCandidateFromSupabase(candidateId);
  }
  const db = await initDB();
  await db.delete(CANDIDATES_STORE, candidateId);
}

// Export candidates to CSV format
export function exportToCSV(candidates) {
  const headers = ['Candidate ID', 'Name', 'Email', 'LinkedIn', 'Phone', 'Timestamp', 'Scenario Choice', 'Archetype', 'Video URL'];
  const rows = candidates.map(c => [
    c.candidateId,
    c.name,
    c.email,
    c.linkedin,
    c.phone,
    c.timestamp,
    c.scenarioChoice,
    c.archetype,
    c.videoUrl || c.videoFileName || '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell || ''}"`).join(','))
  ].join('\n');

  return csvContent;
}

// ── Supabase implementation ─────────────────────────────────────────────────

async function uploadVideoToSupabase(blob, candidateId) {
  const fileName = `${candidateId}.webm`;

  const { data, error } = await supabase.storage
    .from('videos')
    .upload(fileName, blob, {
      contentType: 'video/webm',
      upsert: true,
    });

  if (error) throw error;

  // Get public URL for the video
  const { data: urlData } = supabase.storage
    .from('videos')
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}

async function saveCandidateToSupabase(candidateData) {
  let videoUrl = null;

  // Upload video blob to Supabase Storage
  if (candidateData.videoBlob) {
    videoUrl = await uploadVideoToSupabase(
      candidateData.videoBlob,
      candidateData.candidateId
    );
  }

  // Save candidate record to Supabase table
  const record = {
    candidate_id: candidateData.candidateId,
    name: candidateData.name || null,
    email: candidateData.email || null,
    linkedin: candidateData.linkedin || null,
    phone: candidateData.phone || null,
    scenario_choice: candidateData.scenarioChoice,
    archetype: candidateData.archetype,
    video_url: videoUrl,
    video_file_name: candidateData.videoFileName,
  };

  const { data, error } = await supabase
    .from('candidates')
    .insert(record)
    .select()
    .single();

  if (error) throw error;

  return { ...candidateData, videoUrl };
}

async function getAllCandidatesFromSupabase() {
  const { data, error } = await supabase
    .from('candidates')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Map Supabase columns back to our app's field names
  return (data || []).map(mapSupabaseRecord);
}

async function getCandidateByIdFromSupabase(candidateId) {
  const { data, error } = await supabase
    .from('candidates')
    .select('*')
    .eq('candidate_id', candidateId)
    .single();

  if (error) throw error;

  return mapSupabaseRecord(data);
}

async function deleteCandidateFromSupabase(candidateId) {
  // Delete video from storage
  await supabase.storage
    .from('videos')
    .remove([`${candidateId}.webm`]);

  // Delete database record
  const { error } = await supabase
    .from('candidates')
    .delete()
    .eq('candidate_id', candidateId);

  if (error) throw error;
}

// Map Supabase snake_case → app camelCase
function mapSupabaseRecord(record) {
  return {
    candidateId: record.candidate_id,
    name: record.name,
    email: record.email,
    linkedin: record.linkedin,
    phone: record.phone,
    scenarioChoice: record.scenario_choice,
    archetype: record.archetype,
    videoUrl: record.video_url,
    videoFileName: record.video_file_name,
    timestamp: record.created_at,
    // No videoBlob when using Supabase — we use videoUrl instead
    videoBlob: null,
  };
}

// ── Mock data (IndexedDB only) ──────────────────────────────────────────────

export async function initMockData() {
  // Skip mock data when Supabase is configured — real data lives there
  if (isSupabaseConfigured()) return false;

  const db = await initDB();
  const existingCandidates = await db.getAll(CANDIDATES_STORE);

  if (existingCandidates.length === 0) {
    const archetypes = {
      'A': { name: 'The Closer', description: 'You prioritize getting the deal done' },
      'B': { name: 'The Relationship Builder', description: 'You dig deeper before reacting' },
      'C': { name: 'The Patient Strategist', description: 'You trust the process and provide value' },
      'D': { name: 'The Creative Escalator', description: 'You find new angles to move deals forward' },
      'E': { name: 'The Qualifier', description: 'You protect your time and focus on the right deals' },
    };

    const mockCandidates = [
      {
        candidateId: '1706300000000-abc123',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        linkedin: 'https://linkedin.com/in/sarahjohnson',
        phone: '+1 (555) 123-4567',
        scenarioChoice: 'B',
        archetype: archetypes['B'].name,
        timestamp: '2025-01-26T10:30:00Z',
        videoFileName: 'candidate-1706300000000-abc123.webm',
        videoBlob: null,
      },
      {
        candidateId: '1706290000000-def456',
        name: 'Michael Chen',
        email: 'mchen@gmail.com',
        linkedin: 'https://linkedin.com/in/michaelchen',
        phone: null,
        scenarioChoice: 'A',
        archetype: archetypes['A'].name,
        timestamp: '2025-01-25T14:15:00Z',
        videoFileName: 'candidate-1706290000000-def456.webm',
        videoBlob: null,
      },
      {
        candidateId: '1706280000000-ghi789',
        name: 'Emily Rodriguez',
        email: 'emily.r@company.com',
        linkedin: 'https://linkedin.com/in/emilyrodriguez',
        phone: '+1 (555) 987-6543',
        scenarioChoice: 'D',
        archetype: archetypes['D'].name,
        timestamp: '2025-01-24T09:45:00Z',
        videoFileName: 'candidate-1706280000000-ghi789.webm',
        videoBlob: null,
      },
      {
        candidateId: '1706270000000-jkl012',
        name: 'David Kim',
        email: 'dkim@outlook.com',
        linkedin: 'https://linkedin.com/in/davidkim',
        phone: '+1 (555) 456-7890',
        scenarioChoice: 'C',
        archetype: archetypes['C'].name,
        timestamp: '2025-01-23T16:20:00Z',
        videoFileName: 'candidate-1706270000000-jkl012.webm',
        videoBlob: null,
      },
      {
        candidateId: '1706260000000-mno345',
        name: 'Amanda Foster',
        email: 'amanda.foster@sales.io',
        linkedin: 'https://linkedin.com/in/amandafoster',
        phone: null,
        scenarioChoice: 'E',
        archetype: archetypes['E'].name,
        timestamp: '2025-01-22T11:00:00Z',
        videoFileName: 'candidate-1706260000000-mno345.webm',
        videoBlob: null,
      },
    ];

    for (const candidate of mockCandidates) {
      await db.put(CANDIDATES_STORE, candidate);
    }

    return true;
  }

  return false;
}
