# J.A.R.V.I.S. (Just A Rather Very Intelligent System)

J.A.R.V.I.S. is a premium, high-performance, real-time voice-activated desktop assistant designed for macOS Monterey (12.7.6) and above. It combines a futuristic, glassmorphic HUD terminal interface with direct hardware integration, native AppleScript automation, and dynamic LLM reasoning powered by the Groq API.

---

## 🚀 Key Features

### 🖥️ Native macOS App Bundle (`JARVIS.app`)
- Double-clickable app located in `/Applications`.
- Runs the FastAPI backend server completely in the background.
- Automatically launches Google Chrome in standalone **App Mode** (borderless HUD view).
- Custom high-resolution futuristic ARC reactor icon.

### 🎙️ Audio Visualizer & Hands-Free Interaction
- Symmetrical, glowing neon-blue microphone visualizer.
- Voice Activity Detection (VAD) with silence threshold trigger.
- Natural Speech Synthesis with instant interruptibility (if you speak over JARVIS, it stops speaking and starts listening immediately).

### 🧠 Dynamic Self-Programming
- JARVIS can read, edit, compile-verify, and save code to its own codebase.
- FastAPI backend features hot-reloading (server restarts automatically in 1-2 seconds after code edits).

### 📊 Real-Time HUD Panels
- Geolocation tracking (City, State, Country, Zip Code).
- Real-time CPU usage, RAM utilization, and System Uptime metrics.
- Persistent conversation history panel.

---

## 🛠️ Command Tag Protocols

JARVIS communicates with the backend and coordinates system actions using structured command tags. These are executed synchronously during conversation loops:

### 1. Application Management
- **Open App/URL**: `[OPEN: TargetName]` (e.g. `[OPEN: Chrome]` or `[OPEN: https://github.com]`)
- **Close App**: `[CLOSE: AppName]` (e.g. `[CLOSE: Spotify]`)
- **Remove from Dock**: `[REMOVE_FROM_DOCK: AppName]` (Removes an application icon from the macOS Dock)

### 2. Communication
- **Draft Email**: `[EMAIL: recipient@email.com | Subject | BodyContent]` (Composes an Apple Mail draft using native AppleScript)
- **Send Outgoing Email**: `[SEND_EMAIL]` (Sends the active frontmost email draft)
- **Send WhatsApp Message**: `[WHATSAPP: Contact Name | Message]` (Orchestrates the WhatsApp Desktop app to send messages)
- **Send SMS/iMessage**: `[MESSAGE: contact_info | MessageContent]` (Sends a message via the native macOS Messages app)

### 3. File System & Development
- **Read File**: `[READ_FILE: filepath]` (Inspects local files)
- **Write File**: `[WRITE_FILE: filepath]content[/WRITE_FILE]` (Creates/overwrites code and documents)
- **Terminal Execution**: `[RUN_COMMAND]command[/RUN_COMMAND]` (Executes shell commands in the background)

### 4. Utilities & Media
- **Desktop Spotify Control**: `[PLAY_MUSIC: song_or_playlist]` (Plays music directly via desktop AppleScript Spotify control)
- **Fetch Spotify Playlists**: `[SPOTIFY_PLAYLISTS]` (Lists your Spotify playlists)
- **Web Search**: `[SEARCH: query]` (Queries the web using Groq/Search API)
- **News Headlines**: `[NEWS: query]` (Fetests latest articles on a topic)
- **Capture Screenshot**: `[SCREENSHOT]` (Takes a desktop screenshot)
- **Save Reminder**: `[SAVE_REMINDER: reminder text]` (Saves a task list entry)
- **Standby Mode**: `[SLEEP]` (Enters standby listening mode)
- **Shutdown Assistant**: `[QUIT]` (Completely exits the backend and Chrome App)

---

## 📁 Directory Structure

```
JARVIS/
├── data/                    # Consolidated user data directory
│   ├── memory.json          # Persistent reminders and user biodata
│   ├── chat_history.json    # Conversation history logs
│   └── spotify_tokens.json  # Spotify API tokens (if configured)
├── scratch/                 # Developer scratch scripts
├── make_icns.sh             # Helper shell script compiling .icns
├── main.py                  # FastAPI Backend Server & prompt logic
├── jarvis_app.py            # Electron-style Python application bootstrapper
├── index.html               # Sleek glassmorphic HUD Frontend (JS/CSS)
├── style.css                # Terminal CSS styling definitions
└── start.sh                 # Parent virtual environment environment launcher
```

---

## 🛠️ Verification & Run

1. Make sure you have your environment keys configured in `.env`:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   NEWS_API_KEY=your_news_api_key_here
   ```
2. Double-click `/Applications/JARVIS.app` or run the launcher via Terminal:
   ```bash
   ./start.sh
   ```
