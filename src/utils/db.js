import { openDB } from 'idb';

const DB_NAME = 'qsr-challenge-db';
const DB_VERSION = 1;
const CANDIDATES_STORE = 'candidates';

// Initialize the database
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

// Generate a unique candidate ID
export function generateCandidateId() {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomStr}`;
}

// Save candidate submission
export async function saveCandidate(candidateData) {
  const db = await initDB();

  // TODO: Upload to S3/Cloudinary - await uploadVideo(candidateData.videoBlob, candidateData.candidateId)
  // For demo purposes, we store the video blob in IndexedDB

  await db.put(CANDIDATES_STORE, candidateData);
  return candidateData;
}

// Get all candidates
export async function getAllCandidates() {
  const db = await initDB();
  const candidates = await db.getAll(CANDIDATES_STORE);
  // Sort by timestamp, newest first
  return candidates.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

// Get candidate by ID
export async function getCandidateById(candidateId) {
  const db = await initDB();
  return db.get(CANDIDATES_STORE, candidateId);
}

// Get candidates filtered by archetype
export async function getCandidatesByArchetype(archetype) {
  const db = await initDB();
  const allCandidates = await db.getAll(CANDIDATES_STORE);
  return allCandidates
    .filter(c => c.archetype === archetype)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

// Delete candidate (for admin purposes)
export async function deleteCandidate(candidateId) {
  const db = await initDB();
  await db.delete(CANDIDATES_STORE, candidateId);
}

// Export candidates to CSV format
export function exportToCSV(candidates) {
  const headers = ['Candidate ID', 'Timestamp', 'Scenario Choice', 'Archetype', 'Video Filename'];
  const rows = candidates.map(c => [
    c.candidateId,
    c.timestamp,
    c.scenarioChoice,
    c.archetype,
    c.videoFileName
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell || ''}"`).join(','))
  ].join('\n');

  return csvContent;
}

// Initialize with mock data for testing
export async function initMockData() {
  const db = await initDB();
  const existingCandidates = await db.getAll(CANDIDATES_STORE);

  // Only add mock data if database is empty
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
        scenarioChoice: 'B',
        archetype: archetypes['B'].name,
        timestamp: '2025-01-26T10:30:00Z',
        videoFileName: 'candidate-1706300000000-abc123.webm',
        videoBlob: null, // No actual video for mock data
      },
      {
        candidateId: '1706290000000-def456',
        scenarioChoice: 'A',
        archetype: archetypes['A'].name,
        timestamp: '2025-01-25T14:15:00Z',
        videoFileName: 'candidate-1706290000000-def456.webm',
        videoBlob: null,
      },
      {
        candidateId: '1706280000000-ghi789',
        scenarioChoice: 'D',
        archetype: archetypes['D'].name,
        timestamp: '2025-01-24T09:45:00Z',
        videoFileName: 'candidate-1706280000000-ghi789.webm',
        videoBlob: null,
      },
      {
        candidateId: '1706270000000-jkl012',
        scenarioChoice: 'C',
        archetype: archetypes['C'].name,
        timestamp: '2025-01-23T16:20:00Z',
        videoFileName: 'candidate-1706270000000-jkl012.webm',
        videoBlob: null,
      },
      {
        candidateId: '1706260000000-mno345',
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
