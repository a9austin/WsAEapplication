# The QSR Sales Challenge

A single-page web application for assessing Account Executive candidates. Candidates record a 30-second sales pitch video, then make one key decision in a sales scenario. Total time: 5 minutes max.

## Features

- **Landing Page**: Clean introduction with "Start Challenge" CTA
- **Video Recording**: 30-second pitch with auto-stop, preview, and 2 retakes
- **Sales Scenario**: Multiple-choice decision point with 5 options
- **Results Page**: Archetype reveal with shareable card
- **Admin Panel**: Review submissions, watch videos, export to CSV

## Tech Stack

- React 18 with Vite
- Tailwind CSS for styling
- MediaRecorder API for video capture
- IndexedDB (via `idb` library) for local storage
- html2canvas for share card generation
- React Router for navigation

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development

The app runs at `http://localhost:5173` by default.

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/challenge` | Video recording and scenario question |
| `/complete` | Results and share page |
| `/admin` | Admin panel (password protected) |

## Admin Panel

Access the admin panel at `/admin`

**Password**: `qsrhire2024`

Features:
- View all candidate submissions
- Filter by archetype
- Watch recorded videos inline
- Download individual videos
- Export all data to CSV

## Sales Archetypes

Based on their scenario choice, candidates are assigned one of five archetypes:

| Choice | Archetype | Description |
|--------|-----------|-------------|
| A | The Closer | You prioritize getting the deal done |
| B | The Relationship Builder | You dig deeper before reacting |
| C | The Patient Strategist | You trust the process and provide value |
| D | The Creative Escalator | You find new angles to move deals forward |
| E | The Qualifier | You protect your time and focus on the right deals |

## Data Structure

```javascript
{
  candidateId: 'timestamp-randomstring',
  videoBlob: Blob,
  scenarioChoice: 'B',
  archetype: 'The Relationship Builder',
  timestamp: '2025-01-26T10:30:00Z',
  videoFileName: 'candidate-timestamp.webm'
}
```

## Backend Integration TODOs

The app currently uses IndexedDB for demo purposes. For production deployment:

### Video Upload

In `src/utils/db.js`, replace the IndexedDB storage with cloud storage:

```javascript
// TODO: Upload to S3/Cloudinary
// Example implementation:
async function uploadVideo(blob, candidateId) {
  const formData = new FormData();
  formData.append('video', blob, `${candidateId}.webm`);
  formData.append('candidateId', candidateId);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  return response.json();
}
```

### Database Storage

Replace IndexedDB with a real database:

```javascript
// Example: Save to your backend
async function saveCandidateToBackend(candidateData) {
  const response = await fetch('/api/candidates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      candidateId: candidateData.candidateId,
      scenarioChoice: candidateData.scenarioChoice,
      archetype: candidateData.archetype,
      timestamp: candidateData.timestamp,
      videoUrl: candidateData.videoUrl, // URL from S3/Cloudinary
    }),
  });

  return response.json();
}
```

### Recommended Backend Services

- **Video Storage**: AWS S3, Cloudinary, or Mux
- **Database**: PostgreSQL, MongoDB, or Firebase Firestore
- **Authentication**: Add real authentication for admin panel

## Customizing Branding

### Logo

Replace the SVG icon in these files:
- `src/pages/LandingPage.jsx` - Main logo on landing page
- `src/components/ShareCard.jsx` - Logo on share card
- `src/pages/AdminPage.jsx` - Admin header logo

### Colors

Edit `tailwind.config.js` to customize the brand colors:

```javascript
theme: {
  extend: {
    colors: {
      brand: {
        primary: '#2563eb',    // Your primary color
        secondary: '#1e40af',  // Your secondary color
        accent: '#3b82f6',     // Your accent color
      }
    }
  }
}
```

### Content

- **Pitch Prompt**: Edit in `src/components/VideoRecorder.jsx`
- **Scenario Text**: Edit in `src/components/ScenarioQuestion.jsx`
- **Scenario Options**: Edit in `src/utils/archetypes.js`
- **Archetype Descriptions**: Edit in `src/utils/archetypes.js`

## Mock Data

The admin panel automatically loads 5 mock candidates for testing. This happens on first load if the database is empty.

Mock candidates include:
- One of each archetype (A-E)
- No video blobs (recorded videos only available from actual submissions)
- Sample timestamps from the past week

To reset mock data, clear your browser's IndexedDB storage.

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (iOS 14.3+)
- Mobile: Responsive design, camera access works on mobile browsers

## License

MIT
