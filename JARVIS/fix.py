import json
import re

# Fix main.py prompt
with open("main.py", "r") as f:
    main_code = f.read()

prompt_addition = """17. Send Drafted Email: `[RUN_COMMAND: osascript -e 'tell application "Mail" to send the front outgoing message']` (Use this exactly when the user tells you to SEND the drafted email)
18. Close Chrome Tab: `[RUN_COMMAND: osascript -e 'tell application "Google Chrome" to close active tab of front window']` (Use this exactly when user asks to close a chrome tab)
"""

# Find the spot to insert the new protocols
if "16. Spotify Playlists:" in main_code:
    main_code = main_code.replace(
        "16. Spotify Playlists: `[SPOTIFY_PLAYLISTS] Responding speech...` (Use this tag to fetch the list of the user's Spotify playlists)",
        "16. Spotify Playlists: `[SPOTIFY_PLAYLISTS] Responding speech...` (Use this tag to fetch the list of the user's Spotify playlists)\n" + prompt_addition
    )

with open("main.py", "w") as f:
    f.write(main_code)

# Fix index.html colors and VAD logic
with open("index.html", "r") as f:
    idx_code = f.read()

idx_code = idx_code.replace("#00ff66", "#00bbff")
idx_code = idx_code.replace("rgba(0, 255, 102", "rgba(0, 187, 255")

# Now fix the VAD logic in index.html to allow interruption
# 1. Update getUserMedia
idx_code = idx_code.replace(
    "this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });",
    "this.stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });"
)

# 2. Update animate() VAD
vad_old = """            // Voice Activity Silence Detection (VAD) fallback when native SpeechRecognition is absent
            const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SR && this.s === 'listening' && data && this.mediaRecorder && this.mediaRecorder.state === 'recording') {
                let sum = 0;
                for (let i = 0; i < data.length; i++) {
                    sum += data[i];
                }
                let avg = sum / data.length;
                if (avg > 12) {
                    this.hasSpoken = true;
                    this.lastSpeechTime = Date.now();
                } else if (this.hasSpoken && (Date.now() - this.lastSpeechTime > 1500)) {
                    this.stopRecording();
                } else if (!this.hasSpoken && (Date.now() - this.lastSpeechTime > 8000)) {
                    this.stopRecording();
                }
            }"""

vad_new = """            // Voice Activity Silence Detection (VAD) fallback when native SpeechRecognition is absent
            const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SR && data) {
                let sum = 0;
                for (let i = 0; i < data.length; i++) {
                    sum += data[i];
                }
                let avg = sum / data.length;

                // Interruption during speaking
                if (this.s === 'speaking' && avg > 18) {
                    this.synth.cancel();
                    this.log('sys', 'USER INTERRUPTION DETECTED. LISTENING...');
                    this.set('listening');
                    this.startRecording();
                    this.hasSpoken = true;
                    this.lastSpeechTime = Date.now();
                } 
                // Normal listening
                else if (this.s === 'listening' && this.mediaRecorder && this.mediaRecorder.state === 'recording') {
                    if (avg > 12) {
                        this.hasSpoken = true;
                        this.lastSpeechTime = Date.now();
                    } else if (this.hasSpoken && (Date.now() - this.lastSpeechTime > 1500)) {
                        this.stopRecording();
                    } else if (!this.hasSpoken && (Date.now() - this.lastSpeechTime > 8000)) {
                        this.stopRecording();
                    }
                }
            }"""

idx_code = idx_code.replace(vad_old, vad_new)

with open("index.html", "w") as f:
    f.write(idx_code)

print("Done applying fixes.")
