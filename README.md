# LangGenie

LangGenie is an interactive, real-time language learning platform that leverages the power of Generative AI and advanced Speech-to-Text technology to turn any video into a dynamic language lesson. Built for the Samsung Hackathon, it demonstrates a seamless integration between real-time multimedia consumption and personalized language education.

## ✨ Key Features

- **Live AI Subtitles**: Real-time speech transcription using Google Cloud Speech-to-Text V2 (Chirp-3 Model). Achieves high-accuracy, low-latency subtitles directly from the user's microphone or system audio.
- **Study Mode**: A finely-tuned demonstration mode that perfectly synchronizes YouTube video playback with pre-analyzed subtitles, live vocabulary extraction, and grammar points.
- **Live Vocabulary & Grammar Extraction**: Powered by Google Gemini, the platform dynamically extracts key vocabulary and grammar rules from the ongoing conversation.
- **Mobile Sync Simulation**: Save difficult words to a "mobile app" ecosystem with a single click, allowing cross-device review.
- **AI-Powered Quizzes**: Automatically generates personalized quizzes based on your saved vocabulary list to reinforce learning.

## 📁 Project Structure

The project is divided into two main components: a modern React frontend and a Node.js WebSocket backend.

```
langgenie-prototype/
├── frontend/                 # React + Vite application
│   ├── components/           # UI Components
│   │   ├── VideoPlayer.tsx   # YouTube iframe wrapper & Study Mode controls
│   │   ├── MobileSync.tsx    # Saved words sidebar (Mobile App simulation)
│   │   └── QuizModal.tsx     # Gemini-powered quiz generation UI
│   ├── services/
│   │   └── geminiService.ts  # Integration with @google/genai for vocab/quiz extraction
│   ├── mockSubtitles.ts      # Pre-analyzed demo data for Study Mode syncing
│   ├── App.tsx               # Main application layout and state management
│   ├── types.ts              # TypeScript interfaces
│   └── vite.config.ts        # Vite configuration and proxy rules
│
└── backend/                  # Node.js + Express WebSocket Server
    ├── server.js             # WebSocket server handling GCP Speech-to-Text V2 API
    ├── package.json          # Backend dependencies (@google-cloud/speech)
    └── .env.local            # Backend environment variables
```

## 🚀 Tech Stack

- **Frontend**: React, TypeScript, Vite, TailwindCSS, Lucide React
- **Backend**: Node.js, Express, `ws` (WebSockets)
- **AI & Cloud Services**: 
  - Google Cloud Speech-to-Text V2 (`chirp-3` model) for parallel, low-latency audio processing.
  - Google Vertex AI (Gemini 2.0 Flash) for contextual vocabulary extraction, grammar explanations, and quiz generation.

## ⚙️ How It Works (Technical Highlights)

1. **Concurrent STT Pipelining**: To combat typical synchronous API bottlenecks, the backend utilizes an asynchronous parallel request pipeline. Audio chunks are assigned sequence numbers, processed concurrently via the Chirp-3 model, and re-ordered on the frontend to ensure the display updates flawlessly without jitter.
2. **Synchronized Study Mode**: Instead of dealing with live STT latencies during demos, Study Mode utilizes an intelligent `setInterval` timer synchronized to the exact timestamp of an embedded YouTube video, dynamically mounting Vocabulary and Grammar panels at precisely the right moments.

## 🛠 Setup & Installation

### Prerequisites
- Node.js (v18+)
- A Google Cloud Project with Speech-to-Text V2 enabled.
- A Google Cloud Service Account JSON Key (`key.json`).
- A Google Gemini API Key.

### Backend Setup
1. Navigate to the `backend/` directory.
2. Run `npm install` to install dependencies.
3. Ensure your `.env.local` file is properly configured with your Google Cloud credentials and Project ID.
4. Start the server using your preferred script (typically `node server.js`).

### Frontend Setup
1. Navigate to the `frontend/` directory.
2. Run `npm install` to install dependencies.
3. Configure any necessary proxy rules or `.env` files for the Vertex AI endpoint.
4. Run `npm run dev` to start the Vite development server.

## 🎮 Usage

1. **Select a Video / Level**: Use the integrated selector to choose your target learning language difficulty.
2. **Study Mode**: Play the video and instantly click the **"Study Mode"** button. Watch as perfectly synced subtitles, vocabulary, and grammar points populate the Learning Dashboard.
3. **Save & Quiz**: Click the bookmark icon next to any vocabulary word to save it. Once saved, click **"Generate Custom Quiz"** in the sidebar to test your knowledge!
