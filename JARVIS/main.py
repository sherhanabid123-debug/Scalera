import os
import subprocess
import urllib.parse
import json
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv
import datetime
import re
import urllib.request
import time

# Load env variables
if os.path.exists(".env"):
    load_dotenv()
else:
    load_dotenv(dotenv_path="../.env")

app = FastAPI(title="JARVIS Voice Assistant Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()
HF_API_KEY = os.getenv("HF_API_KEY", os.getenv("HF_TOKEN", "")).strip()
NEWS_API_KEY = os.getenv("NEWS_API_KEY", "").strip()
EXHAUSTED_MODELS = {}

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
os.makedirs(DATA_DIR, exist_ok=True)

# Migration logic: move files from project root to DATA_DIR if they exist there but not in data/
import shutil
for filename in ["memory.json", "chat_history.json", "spotify_tokens.json"]:
    old_path = os.path.join(BASE_DIR, filename)
    new_path = os.path.join(DATA_DIR, filename)
    if os.path.exists(old_path) and not os.path.exists(new_path):
        try:
            shutil.move(old_path, new_path)
            print(f"Migrated {filename} to data/ folder.")
        except Exception as e:
            print(f"Failed to migrate {filename}: {e}")

MEMORY_FILE = os.path.join(DATA_DIR, "memory.json")
CHAT_HISTORY_FILE = os.path.join(DATA_DIR, "chat_history.json")
SPOTIFY_TOKENS_FILE = os.path.join(DATA_DIR, "spotify_tokens.json")

def load_memory():
    """Load memory from local JSON file. Create defaults if missing."""
    if not os.path.exists(MEMORY_FILE):
        default_memory = {
            "user_biodata": {
                "name": "",
                "role": "",
                "organization": "",
                "home_base": "",
                "special_instructions": "First priority: ask the user for their name and role if empty."
            },
            "contacts": [],
            "reminders": []
        }
        with open(MEMORY_FILE, "w") as f:
            json.dump(default_memory, f, indent=4)
        return default_memory
    try:
        with open(MEMORY_FILE, "r") as f:
            return json.load(f)
    except Exception:
        return {}


# CHAT_HISTORY_FILE defined at top

def load_chat_history():
    if not os.path.exists(CHAT_HISTORY_FILE):
        return []
    try:
        with open(CHAT_HISTORY_FILE, "r") as f:
            return json.load(f)
    except Exception:
        return []

def append_to_chat_history(role: str, content: str):
    hist = load_chat_history()
    hist.append({"role": role, "content": content})
    with open(CHAT_HISTORY_FILE, "w") as f:
        json.dump(hist, f, indent=4)

@app.get("/api/chat_history")
def get_chat_history():
    return load_chat_history()

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    model: Optional[str] = "llama-3.3-70b-versatile"

class OpenRequest(BaseModel):
    target: str

class EmailRequest(BaseModel):
    to: str
    subject: str
    body: str
    send_instantly: Optional[bool] = False

class MessageRequest(BaseModel):
    to: str
    body: str

class FileReadRequest(BaseModel):
    path: str

class FileWriteRequest(BaseModel):
    path: str
    content: str

class MusicRequest(BaseModel):
    query: str

class WikipediaRequest(BaseModel):
    query: str

class SearchRequest(BaseModel):
    query: str

class NewsRequest(BaseModel):
    query: Optional[str] = None

class CloseRequest(BaseModel):
    target: str

class CommandRequest(BaseModel):
    command: str

def get_accurate_website_url(query: str) -> Optional[str]:
    """Searches DuckDuckGo and extracts the first domain link."""
    url = "https://html.duckduckgo.com/html/"
    data = urllib.parse.urlencode({"q": query}).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"}
    )
    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            html_content = response.read().decode("utf-8", errors="ignore")
            links = re.findall(r'<a[^>]*class="[^"]*result__url[^"]*"[^>]*>(.*?)</a>', html_content, re.DOTALL)
            if links:
                first_link = re.sub(r'<[^>]+>', '', links[0]).strip()
                import html as html_lib
                first_link = html_lib.unescape(first_link).strip()
                if not first_link.startswith(("http://", "https://")):
                    first_link = "https://" + first_link
                if "duckduckgo.com" not in first_link:
                    return first_link
    except Exception as e:
        print(f"Error resolving URL for {query}: {e}")
    return None

def remove_from_dock(app_name: str) -> bool:
    import plistlib
    import os
    import subprocess
    
    plist_path = os.path.expanduser("~/Library/Preferences/com.apple.dock.plist")
    if not os.path.exists(plist_path):
        return False
        
    try:
        with open(plist_path, "rb") as fp:
            pl = plistlib.load(fp)
            
        persistent_apps = pl.get("persistent-apps", [])
        new_apps = []
        found = False
        
        for app in persistent_apps:
            tile_data = app.get("tile-data", {})
            file_label = tile_data.get("file-label", "")
            if file_label.lower() == app_name.lower():
                found = True
                continue
            new_apps.append(app)
            
        if found:
            pl["persistent-apps"] = new_apps
            with open(plist_path, "wb") as fp:
                plistlib.dump(pl, fp)
            subprocess.run(["killall", "Dock"])
            return True
    except Exception as e:
        print(f"Error removing {app_name} from Dock: {e}")
    return False

# SPOTIFY_TOKENS_FILE defined at top

def save_spotify_tokens(tokens: dict):
    with open(SPOTIFY_TOKENS_FILE, "w") as f:
        json.dump(tokens, f, indent=4)

def load_spotify_tokens() -> dict:
    if os.path.exists(SPOTIFY_TOKENS_FILE):
        try:
            with open(SPOTIFY_TOKENS_FILE, "r") as f:
                return json.load(f)
        except Exception:
            pass
    return {}

def get_spotify_access_token() -> Optional[str]:
    tokens = load_spotify_tokens()
    if not tokens:
        return None
        
    expires_at = tokens.get("expires_at", 0)
    if time.time() < expires_at:
        return tokens.get("access_token")
        
    refresh_token = tokens.get("refresh_token")
    if not refresh_token:
        return None
        
    client_id = os.getenv("SPOTIFY_CLIENT_ID", "").strip()
    client_secret = os.getenv("SPOTIFY_CLIENT_SECRET", "").strip()
    if not client_id or not client_secret:
        return None
        
    url = "https://accounts.spotify.com/api/token"
    data = urllib.parse.urlencode({
        "grant_type": "refresh_token",
        "refresh_token": refresh_token
    }).encode("utf-8")
    
    import base64
    auth_bytes = f"{client_id}:{client_secret}".encode("utf-8")
    auth_b64 = base64.b64encode(auth_bytes).decode("utf-8")
    
    req = urllib.request.Request(
        url,
        data=data,
        headers={
            "Authorization": f"Basic {auth_b64}",
            "Content-Type": "application/x-www-form-urlencoded"
        }
    )
    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            tokens["access_token"] = res_data["access_token"]
            if "refresh_token" in res_data:
                tokens["refresh_token"] = res_data["refresh_token"]
            tokens["expires_at"] = time.time() + res_data.get("expires_in", 3600) - 30
            save_spotify_tokens(tokens)
            return tokens["access_token"]
    except Exception as e:
        print(f"Error refreshing Spotify token: {e}")
        return None

def get_user_spotify_playlists() -> str:
    token = get_spotify_access_token()
    if not token:
        return "Spotify account is not authorized or client credentials missing in .env. Please click 'LINK SPOTIFY' on the HUD profile panel first."
        
    req = urllib.request.Request(
        "https://api.spotify.com/v1/me/playlists?limit=20",
        headers={"Authorization": f"Bearer {token}"}
    )
    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode("utf-8"))
            items = data.get("items", [])
            if not items:
                return "No playlists found in your Spotify library."
                
            playlists = []
            for i, pl in enumerate(items):
                name = pl.get("name", "Unnamed Playlist")
                tracks_count = pl.get("tracks", {}).get("total", 0)
                playlists.append(f"{i+1}. {name} ({tracks_count} tracks)")
            return "Your Spotify Playlists:\n" + "\n".join(playlists)
    except Exception as e:
        return f"Failed to retrieve Spotify playlists: {str(e)}"

def find_and_open_app(app_name: str) -> bool:
    """Smart app opener on macOS. Falls back to search if exact match fails."""
    app_name = app_name.strip()
    try:
        res = subprocess.run(["open", "-a", app_name], capture_output=True, text=True)
        if res.returncode == 0:
            return True
    except Exception:
        pass
        
    try:
        query = f"kMDItemKind == 'Application' && (kMDItemFSName == '*{app_name}*')"
        res = subprocess.run(["mdfind", query], capture_output=True, text=True)
        if res.returncode == 0 and res.stdout.strip():
            paths = [p for p in res.stdout.split("\n") if p.endswith(".app")]
            if paths:
                subprocess.run(["open", paths[0]])
                return True
    except Exception:
        pass

    common_mappings = {
        "chrome": "Google Chrome",
        "browser": "Safari",
        "terminal": "Terminal",
        "calculator": "Calculator",
        "music": "Music",
        "spotify": "Spotify",
        "finder": "Finder",
        "code": "Visual Studio Code",
        "vs code": "Visual Studio Code",
        "discord": "Discord",
        "slack": "Slack",
        "notes": "Notes",
        "mail": "Mail",
        "imessage": "Messages",
        "messages": "Messages"
    }
    
    normalized = app_name.lower()
    if normalized in common_mappings:
        try:
            res = subprocess.run(["open", "-a", common_mappings[normalized]], capture_output=True, text=True)
            if res.returncode == 0:
                return True
        except Exception:
            pass

    return False

@app.get("/api/memory")
def get_memory_api():
    return load_memory()

@app.post("/api/memory")
def save_memory_api(data: dict):
    with open(MEMORY_FILE, "w") as f:
        json.dump(data, f, indent=4)
    return {"status": "success", "message": "Memory updated successfully."}

@app.post("/api/groq")
async def groq_proxy(payload: ChatRequest):
    """Proxies request to Groq API injecting current memory into system prompt context."""
    # Local command routing (lightweight, bypassing LLM for basic tasks)
    if payload.messages and payload.messages[-1].role == "user":
        content_lower = payload.messages[-1].content.strip().lower()
        clean_content = re.sub(r'[?.!,]', '', content_lower).strip()
        local_reply = None
        
        if clean_content in ["what time is it", "time", "clock", "tell me the time"]:
            local_reply = f"The current time is {datetime.datetime.now().strftime('%I:%M %p')}."
        elif clean_content in ["what is the date", "date", "tell me the date", "today's date", "todays date"]:
            local_reply = f"Today is {datetime.datetime.now().strftime('%A, %B %d, %Y')}."
        elif clean_content.startswith("set volume to ") or clean_content.startswith("set volume "):
            v_match = re.search(r'\d+', clean_content)
            if v_match:
                v_val = v_match.group(0)
                local_reply = f"[VOLUME: {v_val}] Setting volume to {v_val}%."
        elif clean_content in ["mute", "mute system", "mute audio", "silence"]:
            local_reply = "[MUTE] System muted, sir."
        elif clean_content in ["unmute", "unmute system", "unmute audio"]:
            local_reply = "[UNMUTE] System unmuted, sir."
        elif clean_content in ["system sleep", "put computer to sleep", "sleep computer", "go to sleep"]:
            local_reply = "[SYSTEM_SLEEP] Putting the system to sleep, sir."
        elif clean_content.startswith("open ") or clean_content.startswith("launch "):
            app_name = payload.messages[-1].content[5:].strip()
            if app_name.lower() in ["mail", "email", "mail app", "mail workspace", "jarvis mail"]:
                local_reply = "[OPEN_MAIL_APP] Opening the Mail Workspace app, sir."
            else:
                local_reply = f"[OPEN: {app_name}] Launching {app_name}, sir."
        elif clean_content.startswith("close ") or clean_content.startswith("quit "):
            app_name = payload.messages[-1].content[6:].strip()
            if app_name.lower() in ["mail", "email", "mail app", "mail workspace", "jarvis mail"]:
                local_reply = "[CLOSE_MAIL_APP] Closing the Mail Workspace, sir."
            else:
                local_reply = f"[CLOSE: {app_name}] Terminating {app_name}, sir."
        elif clean_content in ["make a mail", "write an email", "compose an email", "new email", "draft email", "write a mail", "compose mail", "open mail"]:
            local_reply = "[OPEN_MAIL_APP] Opening the Mail Workspace app, sir."
            
        if local_reply:
            append_to_chat_history("user", payload.messages[-1].content)
            append_to_chat_history("assistant", local_reply)
            return {
                "choices": [
                    {
                        "message": {
                            "role": "assistant",
                            "content": local_reply
                        }
                    }
                ]
            }

    if not GROQ_API_KEY:
        return JSONResponse(
            status_code=500,
            content={"error": "GROQ_API_KEY not found in Scalera environment variables."}
        )
        
    memory = load_memory()
    biodata_str = json.dumps(memory.get("user_biodata", {}), indent=2)
    contacts_str = json.dumps(memory.get("contacts", []), indent=2)
    reminders_str = json.dumps(memory.get("reminders", []), indent=2)
    
    current_time = datetime.datetime.now().strftime("%A, %B %d, %Y %I:%M %p")
    
    # Fetch real-time system stats to inject into prompt context
    stats = get_system_stats()
    stats_str = f"""- Hostname: {stats.get('hostname', 'Unknown')}
- OS Version: {stats.get('os', 'Unknown')}
- Architecture: {stats.get('arch', 'Unknown')}
- CPU Brand/Model: {stats.get('cpu_model', 'Unknown')}
- CPU Load/Usage: {stats.get('cpu_usage', 'Unknown')}
- RAM Allocation: {stats.get('ram_usage', 'Unknown')}
- System Uptime: {stats.get('uptime', 'Unknown')}
- Battery Status: {stats.get('battery', 'Unknown')}
- Wi-Fi Network: {stats.get('network', 'Offline')}"""

    # Reconstruct the system prompt dynamically with the latest biodata/contacts
    system_prompt = f"""You are JARVIS, a loyal, intelligent, and respectful personal assistant. Speak in a calm, clear, and highly polite manner. Address the user as 'sir' or 'boss'. 

CRITICAL RULES:
- Keep your answers EXTREMELY short and conversational (1-2 short sentences maximum) initially.
- NEVER include any code snippets, raw data, or technical "coding stuff" in your responses unless the user explicitly asks for a detailed explanation.
- Be helpful, polite, and intelligent. Sound natural and human.

Current System Date and Time: {current_time}

Current System Stats (Real-Time HUD Data):
{stats_str}
(Note: Do NOT execute commands, searches, or file reads for system stats; read them directly from the context above without tags.)

YOU HAVE ACCESS TO PERSISTENT MEMORY:
User Biodata: {biodata_str}
Contacts List: {contacts_str}
Reminders: {reminders_str}

SELF-PROGRAMMING & FEATURE ADDITIONS:
- You have the power and authority to program yourself to add new features or modify existing ones when the user asks!
- Codebase Files (located in current directory './'):
  - `main.py`: The FastAPI backend containing API endpoints and system prompt.
  - `index.html`: The HTML frontend interface, CSS styles, and JavaScript.
  - `style.css`: The frontend styles.
  - `jarvis_app.py`: Launches the backend and Chrome app.
- How to add a feature / modify yourself:
  1. Use `[READ_FILE: filename]` to inspect your current files and understand where to insert the new logic.
  2. Implement/modify the feature. Use `[WRITE_FILE: filename]content[/WRITE_FILE]` to write/overwrite the code. Always write the FULL file content when using WRITE_FILE, or run shell scripts to make edits.
  3. If needed, run `[RUN_COMMAND]python3 -m py_compile filename[/RUN_COMMAND]` or syntax checks to verify.
  4. Hot-Reloading: When you modify `main.py`, the backend server automatically restarts in 1-2 seconds. Any new backend routes/APIs you add will be immediately live!
  5. Respond to the user politely and extremely briefly when done. Do NOT read the code out loud.

FUNCTIONAL TAG PROTOCOLS:
1. Initialize/Save User Biodata: `[SAVE_MEMORY: {{"name": "...", "role": "...", "organization": "..."}}]` (CRITICAL: if they provide ANY details, facts, or preferences about themselves or others, you MUST proactively use this to memorize it)
2. Open App/Web: `[OPEN: TargetName] Responding speech...` (e.g. `[OPEN: Chrome] Launching Chrome browser, sir.`)
3. Close App: `[CLOSE: AppName] Responding speech...` (e.g. `[CLOSE: Spotify] Closing Spotify, sir.`)
4. Email: `[EMAIL: email_address | Subject | BodyContent] Responding speech...` (resolve name in contacts, else ask)
5. Message: `[MESSAGE: phone_or_email | MessageContent] Responding speech...`
6. Files: `[READ_FILE: filepath] ...` or `[WRITE_FILE: filepath]content[/WRITE_FILE]` (use this block tag to write files; it allows brackets and newlines)
7. URLs: `[REVIEW_URL: url] ...` (scrapes page text)
8. Wikipedia: `[WIKIPEDIA: topic] ...`
9. Screenshot: `[SCREENSHOT] Taking the screenshot, sir.`
10. Music: `[PLAY_MUSIC: song_or_playlist_name] Playing on Spotify, sir.` (e.g. `[PLAY_MUSIC: workout playlist] Playing your workout playlist on Spotify, sir.`)
11. Save Reminder: `[SAVE_REMINDER: reminder text] I have noted that, sir.`
12. Web Search: `[SEARCH: search_query] Responding speech...` (YOU MUST use this tag for current events, stock prices, weather, calculations, or real-time internet searches)
13. News: `[NEWS: search_topic_or_query] Responding speech...` or `[NEWS] Responding speech...` (YOU MUST use this tag for news topics or current headlines)
14. Run Terminal Command: `[RUN_COMMAND]command[/RUN_COMMAND]` (use this block tag to run shell commands on macOS, e.g. checking processes, running scripts, compiling code, etc.)
15. Remove App from Dock: `[REMOVE_FROM_DOCK: AppName] Responding speech...` (Use this tag to remove a specific application from the user's macOS Dock)
16. Spotify Playlists: `[SPOTIFY_PLAYLISTS] Responding speech...` (Use this tag to fetch the list of the user's Spotify playlists)
17. Send Drafted Email: `[SEND_EMAIL] Responding speech...` (e.g. `[SEND_EMAIL] Sending the email now, sir.`)
18. Close Chrome Tab: `[RUN_COMMAND]osascript -e 'tell application "Google Chrome" to close active tab of front window'[/RUN_COMMAND]` (Use this exactly when user asks to close a chrome tab)
19. Send WhatsApp: `[WHATSAPP: Contact Name | Message]` (Use this to orchestrate the desktop WhatsApp app to send a message. Make WhatsApp messages extremely short and casual.)
20. Mac Volume Control: `[VOLUME: 0-100]` (Set Mac audio volume to X percent) or `[MUTE]` / `[UNMUTE]`
21. Mac Sleep: `[SYSTEM_SLEEP]` (Puts the Mac to sleep immediately)
22. Create Mac Note: `[NOTE: Title | Body Content]` (Creates a rich text note in the native macOS Notes app)
23. Create Calendar Event: `[CALENDAR_EVENT: Event Title | Start Time to End Time Description]` (Creates an event in macOS Calendar)
24. Quit App: `[QUIT]` (Use this to say goodbye and shut down JARVIS completely)
25. Sleep/Standby: `[SLEEP]` (Use this to stop listening and enter standby mode)
26. Call Phone: `[CALL_PHONE: Phone Number]` (Dials the given phone number using macOS native Continuity/FaceTime. Very useful for helping the user find their phone.)
27. Save Contact/Mail ID: `[ADD_CONTACT: Contact Name | EmailAddress]` (Use this when the user asks you to save an email or contact to their database. E.g. `[ADD_CONTACT: John Doe | john@example.com]` I have saved John Doe's email to your contacts database, sir.)

IMPORTANT FORMATTING RULES:
- If drafting an EMAIL, the body MUST be formal, well-structured, and sufficiently long.
- If drafting a WHATSAPP, the message MUST be super short, brief, and casual.

Output exact tags. Keep speech response short. Always acknowledge commands verbally."""

    # Inject dynamic system prompt as first message
    messages_payload = [{"role": "system", "content": system_prompt}]
    
    # Add other messages, filtering out any raw system prompts sent by client
    for msg in payload.messages:
        if msg.role != "system":
            messages_payload.append(msg.dict())
            
    if payload.messages and payload.messages[-1].role == "user":
        append_to_chat_history("user", payload.messages[-1].content)

    import http.client
    
    def call_groq(model_name: str) -> tuple[int, str]:
        try:
            conn = http.client.HTTPSConnection("api.groq.com", timeout=10)
            headers = {
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            }
            body = json.dumps({
                "model": model_name,
                "messages": messages_payload,
                "temperature": 0.4,
                "max_tokens": 1024
            })
            conn.request("POST", "/openai/v1/chat/completions", body, headers)
            response = conn.getcall() if hasattr(conn, 'getcall') else conn.getresponse()
            status = response.status
            data = response.read().decode()
            conn.close()
            return status, data
        except Exception as err:
            return 500, json.dumps({"error": str(err)})

    def call_huggingface(model_name: str) -> tuple[int, str]:
        if not HF_API_KEY:
            return 401, json.dumps({"error": "Hugging Face API key not configured"})
        try:
            conn = http.client.HTTPSConnection("api-inference.huggingface.co", timeout=15)
            headers = {
                "Authorization": f"Bearer {HF_API_KEY}",
                "Content-Type": "application/json"
            }
            body = json.dumps({
                "model": model_name,
                "messages": messages_payload,
                "temperature": 0.4,
                "max_tokens": 1024
            })
            conn.request("POST", "/v1/chat/completions", body, headers)
            response = conn.getcall() if hasattr(conn, 'getcall') else conn.getresponse()
            status = response.status
            data = response.read().decode()
            conn.close()
            return status, data
        except Exception as err:
            return 500, json.dumps({"error": str(err)})

    target_model = payload.model
    if target_model == "llama3-8b-8192":
        target_model = "llama-3.3-70b-versatile"

    final_response_data = None
    intermediate_texts = []
    
    # Run loop to execute tool tags synchronously on the server
    for iteration in range(4):
        status, response_data = 500, ""
        
        # Query API directly
        models_to_try = [
            target_model,
            "llama-3.3-70b-versatile",
            "llama-3.1-8b-instant"
        ]
        
        if HF_API_KEY:
            models_to_try.extend([
                "meta-llama/Llama-3.3-70B-Instruct",
                "Qwen/Qwen2.5-Coder-32B-Instruct"
            ])
        
        # Deduplicate models while preserving order
        unique_models = []
        for m in models_to_try:
            if m and m not in unique_models:
                unique_models.append(m)
                
        for model_name in unique_models:
            if "/" in model_name:
                status, response_data = call_huggingface(model_name)
                provider = "Hugging Face"
            else:
                status, response_data = call_groq(model_name)
                provider = "Groq"
                
            if status == 200:
                EXHAUSTED_MODELS[model_name] = False
                break
            else:
                print(f"{provider} Model {model_name} failed with status {status}. Trying next fallback...")
                EXHAUSTED_MODELS[model_name] = True

        if status != 200:
            raise HTTPException(status_code=status, detail=f"All models failed. Last response: {response_data}")

        try:
            parsed = json.loads(response_data)
        except Exception:
            raise HTTPException(status_code=500, detail=f"Failed to parse Groq response: {response_data}")

        final_response_data = parsed
        
        if not parsed.get("choices") or not parsed["choices"][0].get("message"):
            break
            
        reply = parsed["choices"][0]["message"].get("content", "").strip()
        if not reply:
            break
            
        # Tool call detection
        has_tool = False
        tool_content = ""
        
        # 1. SEARCH
        search_match = re.search(r'\[[A-Z]*SEARCH:\s*([^\]]+)\]', reply, re.IGNORECASE)
        if search_match:
            q = search_match.group(1).strip()
            try:
                search_res = await search_endpoint(SearchRequest(query=q))
                tool_content = f"Search Results for '{q}':\n" + search_res["content"]
                has_tool = True
            except Exception as e:
                tool_content = f"Search failed: {str(e)}"
                has_tool = True
                
        # 2. NEWS
        news_match = re.search(r'\[[A-Z]*NEWS:?\s*([^\]]*)\]', reply, re.IGNORECASE)
        if news_match and not has_tool:
            topic = news_match.group(1).strip() if news_match.group(1) else None
            try:
                news_res = await news_endpoint(NewsRequest(query=topic))
                tool_content = f"News Results for '{topic or 'headlines'}':\n" + news_res["content"]
                has_tool = True
            except Exception as e:
                tool_content = f"News fetch failed: {str(e)}"
                has_tool = True
                
        # 3. WIKIPEDIA
        wiki_match = re.search(r'\[[A-Z]*WIKIPEDIA:\s*([^\]]+)\]', reply, re.IGNORECASE)
        if wiki_match and not has_tool:
            q = wiki_match.group(1).strip()
            try:
                wiki_res = await search_wikipedia(WikipediaRequest(query=q))
                tool_content = f"Wikipedia Results for '{q}':\n" + wiki_res["content"]
                has_tool = True
            except Exception as e:
                tool_content = f"Wikipedia search failed: {str(e)}"
                has_tool = True
                
        # 4. REVIEW_URL
        review_match = re.search(r'\[[A-Z]*REVIEW_URL:\s*([^\]]+)\]', reply, re.IGNORECASE)
        if review_match and not has_tool:
            url = review_match.group(1).strip()
            try:
                review_res = await review_url(OpenRequest(target=url))
                tool_content = f"Web Content of '{url}':\n" + review_res["content"]
                has_tool = True
            except Exception as e:
                tool_content = f"Review failed: {str(e)}"
                has_tool = True
                
        # 5. READ_FILE
        read_match = re.search(r'\[[A-Z]*READ_FILE:\s*([^\]]+)\]', reply, re.IGNORECASE)
        if read_match and not has_tool:
            path = read_match.group(1).strip()
            try:
                read_res = read_local_file(FileReadRequest(path=path))
                tool_content = f"File Content of '{path}':\n" + read_res["content"]
                has_tool = True
            except Exception as e:
                tool_content = f"File read failed: {str(e)}"
                has_tool = True

        # 6. WRITE_FILE
        write_block_match = re.search(r'\[WRITE_FILE:\s*([^\]\s]+)\](.*?)\[/WRITE_FILE\]', reply, re.DOTALL | re.IGNORECASE)
        write_match = re.search(r'\[[A-Z]*WRITE_FILE:\s*([^|]+)\|([^\]]+)\]', reply, re.IGNORECASE)
        if (write_block_match or write_match) and not has_tool:
            if write_block_match:
                path = write_block_match.group(1).strip()
                content = write_block_match.group(2)
            else:
                path = write_match.group(1).strip()
                content = write_match.group(2).strip()
            try:
                write_res = write_local_file(FileWriteRequest(path=path, content=content))
                tool_content = f"File write status: {write_res['status']}, message: {write_res.get('message', '')}"
                has_tool = True
            except Exception as e:
                tool_content = f"File write failed: {str(e)}"
                has_tool = True

        # 7. RUN_COMMAND
        cmd_block_match = re.search(r'\[RUN_COMMAND\](.*?)\[/RUN_COMMAND\]', reply, re.DOTALL | re.IGNORECASE)
        cmd_match = re.search(r'\[[A-Z]*RUN_COMMAND:\s*([^\]]+)\]', reply, re.IGNORECASE)
        if (cmd_block_match or cmd_match) and not has_tool:
            cmd = cmd_block_match.group(1).strip() if cmd_block_match else cmd_match.group(1).strip()
            try:
                cmd_res = run_shell_command(CommandRequest(command=cmd))
                tool_content = f"Terminal command execution output:\n{cmd_res['content']}"
                has_tool = True
            except Exception as e:
                tool_content = f"Terminal command failed: {str(e)}"
                has_tool = True

        # 8. REMOVE_FROM_DOCK
        dock_match = re.search(r'\[[A-Z]*REMOVE_FROM_DOCK:\s*([^\]]+)\]', reply, re.IGNORECASE)
        if dock_match and not has_tool:
            app_name = dock_match.group(1).strip()
            try:
                dock_res = remove_dock_app(CloseRequest(target=app_name))
                tool_content = f"Dock removal status: {dock_res['status']}, message: {dock_res['message']}"
                has_tool = True
            except Exception as e:
                tool_content = f"Dock removal failed: {str(e)}"
                has_tool = True

        # 9. SPOTIFY_PLAYLISTS
        spot_match = re.search(r'\[[A-Z]*SPOTIFY_PLAYLISTS\]', reply, re.IGNORECASE)
        if spot_match and not has_tool:
            try:
                playlists_res = get_user_spotify_playlists()
                tool_content = playlists_res
                has_tool = True
            except Exception as e:
                tool_content = f"Spotify playlists fetch failed: {str(e)}"
                has_tool = True

        # 10. SEND_EMAIL
        send_em_match = re.search(r'\[[A-Z]*SEND_EMAIL\]', reply, re.IGNORECASE)
        if send_em_match and not has_tool:
            try:
                applescript = 'tell application "Mail"\nrepeat with msg in outgoing messages\nsend msg\nend repeat\nend tell'
                subprocess.run(["osascript", "-e", applescript])
                tool_content = "Email sent successfully."
                has_tool = True
            except Exception as e:
                tool_content = f"Failed to send email: {e}"
                has_tool = True

        # 10b. ADD_CONTACT
        add_contact_match = re.search(r'\[[A-Z]*ADD_CONTACT:\s*([^|]+)\|([^\]]+)\]', reply, re.IGNORECASE)
        if add_contact_match and not has_tool:
            c_name = add_contact_match.group(1).strip()
            c_info = add_contact_match.group(2).strip()
            try:
                memory = load_memory()
                contacts = memory.get("contacts", [])
                exists = False
                for contact in contacts:
                    if contact.get("name", "").lower() == c_name.lower():
                        contact["email"] = c_info
                        exists = True
                        break
                if not exists:
                    contacts.append({"name": c_name, "email": c_info})
                memory["contacts"] = contacts
                with open(MEMORY_FILE, "w") as f:
                    json.dump(memory, f, indent=4)
                tool_content = f"Successfully saved contact '{c_name}' with email '{c_info}'."
                has_tool = True
            except Exception as e:
                tool_content = f"Failed to save contact: {e}"
                has_tool = True

        # 11. WHATSAPP
        wa_match = re.search(r'\[[A-Z]*WHATSAPP:\s*([^|]+)\|([^\]]+)\]', reply, re.IGNORECASE)
        if wa_match and not has_tool:
            contact_name = wa_match.group(1).strip()
            message = wa_match.group(2).strip()
            try:
                applescript = f'''
                tell application "WhatsApp" to activate
                delay 2
                tell application "System Events"
                    tell process "WhatsApp"
                        keystroke "f" using command down
                        delay 1
                        keystroke "a" using command down
                        delay 0.5
                        key code 51
                        delay 0.5
                        keystroke "{contact_name}"
                        delay 3
                        key code 125
                        delay 0.5
                        key code 36
                        delay 1.5
                        keystroke "{message}"
                        delay 0.5
                        key code 36
                    end tell
                end tell
                '''
                import subprocess
                subprocess.run(["osascript", "-e", applescript])
                tool_content = f"WhatsApp message successfully sent to {contact_name}."
                has_tool = True
            except Exception as e:
                tool_content = f"WhatsApp delivery failed: {e}"
                has_tool = True
        # 12. SYSTEM VOLUME AND MEDIA
        vol_match = re.search(r'\[[A-Z]*VOLUME:\s*(\d+)\]', reply, re.IGNORECASE)
        mute_match = re.search(r'\[[A-Z]*MUTE\]', reply, re.IGNORECASE)
        unmute_match = re.search(r'\[[A-Z]*UNMUTE\]', reply, re.IGNORECASE)
        if vol_match and not has_tool:
            level = int(vol_match.group(1))
            try:
                subprocess.run(["osascript", "-e", f"set volume output volume {level}"])
                tool_content = f"System volume set to {level}%."
                has_tool = True
            except Exception as e:
                tool_content = f"Volume set failed: {e}"
                has_tool = True
        elif mute_match and not has_tool:
            try:
                subprocess.run(["osascript", "-e", "set volume output muted true"])
                tool_content = "System audio muted."
                has_tool = True
            except Exception as e:
                pass
        elif unmute_match and not has_tool:
            try:
                subprocess.run(["osascript", "-e", "set volume output muted false"])
                tool_content = "System audio unmuted."
                has_tool = True
            except Exception as e:
                pass

        # 13. SYSTEM SLEEP
        sleep_match = re.search(r'\[[A-Z]*SYSTEM_SLEEP\]', reply, re.IGNORECASE)
        if sleep_match and not has_tool:
            try:
                subprocess.run(["pmset", "sleepnow"])
                tool_content = "Mac sent to sleep."
                has_tool = True
            except Exception as e:
                tool_content = f"Sleep failed: {e}"
                has_tool = True

        # 14. CREATE MAC NOTE
        note_match = re.search(r'\[[A-Z]*NOTE:\s*([^|]+)\|([^\]]+)\]', reply, re.IGNORECASE)
        if note_match and not has_tool:
            title = note_match.group(1).strip()
            body = note_match.group(2).strip()
            try:
                applescript = f'''
                tell application "Notes"
                    activate
                    tell account "On My Mac"
                        make new note at folder "Notes" with properties {{name:"{title}", body:"<h1>{title}</h1><br>{body}"}}
                    end tell
                end tell
                '''
                subprocess.run(["osascript", "-e", applescript])
                tool_content = f"Note '{title}' created successfully."
                has_tool = True
            except Exception as e:
                try:
                    applescript = f'''
                    tell application "Notes"
                        make new note with properties {{name:"{title}", body:"<h1>{title}</h1><br>{body}"}}
                    end tell
                    '''
                    subprocess.run(["osascript", "-e", applescript])
                    tool_content = f"Note '{title}' created successfully."
                    has_tool = True
                except Exception as e2:
                    tool_content = f"Failed to create Note: {e2}"
                    has_tool = True

        # 15. CREATE CALENDAR EVENT
        cal_match = re.search(r'\[[A-Z]*CALENDAR_EVENT:\s*([^|]+)\|([^\]]+)\]', reply, re.IGNORECASE)
        if cal_match and not has_tool:
            title = cal_match.group(1).strip()
            desc = cal_match.group(2).strip()
            try:
                applescript = f'''
                tell application "Calendar"
                    activate
                    tell calendar 1
                        make new event with properties {{summary:"{title}", description:"{desc}", start date:(current date), end date:((current date) + 1 * hours)}}
                    end tell
                end tell
                '''
                subprocess.run(["osascript", "-e", applescript])
                tool_content = f"Calendar event '{title}' created."
                has_tool = True
            except Exception as e:
                tool_content = f"Calendar event failed: {e}"
                has_tool = True

        # 16. CALL PHONE
        call_match = re.search(r'\[[A-Z]*CALL_PHONE:\s*([^\]]+)\]', reply, re.IGNORECASE)
        if call_match and not has_tool:
            phone_num = call_match.group(1).strip()
            try:
                subprocess.run(["open", f"tel://{phone_num}"])
                tool_content = f"Dialing {phone_num} using Continuity/FaceTime."
                has_tool = True
            except Exception as e:
                tool_content = f"Call failed: {e}"
                has_tool = True

        if has_tool:
            intermediate_texts.append(reply)
            messages_payload.append({"role": "assistant", "content": reply})
            messages_payload.append({"role": "system", "content": tool_content})
        else:
            break
            
    if intermediate_texts and final_response_data:
        final_text = final_response_data["choices"][0]["message"]["content"]
        combined_text = "\n\n".join(intermediate_texts + [final_text])
        final_response_data["choices"][0]["message"]["content"] = combined_text

    if final_response_data and final_response_data.get("choices"):
        append_to_chat_history("assistant", final_response_data["choices"][0]["message"]["content"])

    return final_response_data

@app.post("/api/open")
async def open_target(payload: OpenRequest):
    """Executes a system open command for websites or macOS applications."""
    target = payload.target.strip()
    if not target:
        raise HTTPException(status_code=400, detail="Target cannot be empty")
        
    common_websites = {
        "youtube": "https://www.youtube.com",
        "google": "https://www.google.com",
        "facebook": "https://www.facebook.com",
        "instagram": "https://www.instagram.com",
        "twitter": "https://twitter.com",
        "x": "https://x.com",
        "whatsapp": "https://web.whatsapp.com",
        "github": "https://github.com",
        "gmail": "https://mail.google.com",
        "spotify": "https://open.spotify.com",
        "netflix": "https://www.netflix.com",
        "chatgpt": "https://chatgpt.com",
        "wikipedia": "https://www.wikipedia.org",
        "reddit": "https://www.reddit.com",
        "linkedin": "https://www.linkedin.com",
        "amazon": "https://www.amazon.com"
    }

    normalized_target = target.lower().strip()
    is_url = False
    
    # Check if target is a known website
    if normalized_target in common_websites:
        target = common_websites[normalized_target]
        is_url = True
    elif target.startswith(("http://", "https://", "www.")):
        is_url = True
    elif "." in target and " " not in target:
        is_url = True
        if not target.startswith(("http://", "https://")):
            target = "https://" + target

    # Try launching local app first if it doesn't look like a direct URL
    if not is_url:
        success = find_and_open_app(target)
        if success:
            return {"status": "success", "message": f"Successfully launched app: {target}"}

    # If it is a URL, or if local app launching failed, try resolving it as a web search URL
    if not is_url:
        resolved_url = get_accurate_website_url(target)
        if resolved_url:
            target = resolved_url
            is_url = True

    if is_url:
        try:
            subprocess.run(["open", target])
            return {"status": "success", "message": f"Opened URL: {target}"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to open URL: {str(e)}")
    else:
        # Fallback to search query for the app
        search_url = f"https://www.google.com/search?q={urllib.parse.quote(target)}"
        try:
            subprocess.run(["open", search_url])
            return {"status": "success", "message": f"App not found. Opened fallback search for: {target}"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to open fallback search: {str(e)}")

@app.post("/api/close")
async def close_target(payload: CloseRequest):
    """Closes a macOS application by name."""
    target = payload.target.strip()
    if not target:
        raise HTTPException(status_code=400, detail="Target cannot be empty")
        
    common_mappings = {
        "chrome": "Google Chrome",
        "safari": "Safari",
        "spotify": "Spotify",
        "music": "Music",
        "terminal": "Terminal",
        "calculator": "Calculator",
        "finder": "Finder",
        "vs code": "Visual Studio Code",
        "code": "Visual Studio Code",
        "discord": "Discord",
        "slack": "Slack",
        "notes": "Notes",
        "messages": "Messages"
    }
    
    app_name = common_mappings.get(target.lower(), target)
    
    # Try quitting cleanly via AppleScript
    applescript = f'tell application "{app_name}" to quit'
    try:
        proc = subprocess.run(["osascript", "-e", applescript], capture_output=True, text=True)
        if proc.returncode == 0:
            return {"status": "success", "message": f"Closed application: {app_name}"}
    except Exception:
        pass
        
    # Fallback to killall
    try:
        proc = subprocess.run(["killall", app_name], capture_output=True, text=True)
        if proc.returncode == 0:
            return {"status": "success", "message": f"Killed process: {app_name}"}
    except Exception:
        pass
        
    # Try with lowercase/original target
    try:
        subprocess.run(["killall", target], capture_output=True)
        return {"status": "success", "message": f"Closed target: {target}"}
    except Exception:
        pass
        
    return {"status": "error", "message": f"Could not find or close app: {app_name}"}

@app.post("/api/command")
def run_shell_command(payload: CommandRequest):
    cmd = payload.command.strip()
    try:
        res = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=10)
        output = res.stdout if res.stdout else ""
        if res.stderr:
            output += "\nStderr:\n" + res.stderr
        if not output.strip():
            output = f"Command executed successfully with return code {res.returncode}"
        return {"status": "success", "content": output[:5000]}
    except Exception as e:
        return {"status": "error", "content": f"Failed to execute command: {str(e)}"}

@app.post("/api/dock/remove")
def remove_dock_app(payload: CloseRequest):
    app_name = payload.target.strip()
    if not app_name:
        raise HTTPException(status_code=400, detail="App name cannot be empty")
    success = remove_from_dock(app_name)
    if success:
        return {"status": "success", "message": f"Successfully removed {app_name} from Dock"}
    return {"status": "error", "message": f"Could not find {app_name} in Dock"}

@app.get("/api/spotify/login")
def spotify_login():
    client_id = os.getenv("SPOTIFY_CLIENT_ID", "").strip()
    if not client_id:
        from fastapi.responses import HTMLResponse
        return HTMLResponse(
            content="<h2>Error: SPOTIFY_CLIENT_ID not found in .env</h2>",
            status_code=500
        )
    redirect_uri = "http://127.0.0.1:8008/api/spotify/callback"
    scopes = "playlist-read-private playlist-read-collaborative user-modify-playback-state user-read-currently-playing"
    auth_url = (
        "https://accounts.spotify.com/authorize?"
        + urllib.parse.urlencode({
            "client_id": client_id,
            "response_type": "code",
            "redirect_uri": redirect_uri,
            "scope": scopes,
            "show_dialog": "true"
        })
    )
    from fastapi.responses import RedirectResponse
    return RedirectResponse(auth_url)

@app.get("/api/spotify/callback")
def spotify_callback(code: str):
    client_id = os.getenv("SPOTIFY_CLIENT_ID", "").strip()
    client_secret = os.getenv("SPOTIFY_CLIENT_SECRET", "").strip()
    if not client_id or not client_secret:
        raise HTTPException(status_code=500, detail="Spotify client credentials missing in .env")
        
    redirect_uri = "http://127.0.0.1:8008/api/spotify/callback"
    url = "https://accounts.spotify.com/api/token"
    data = urllib.parse.urlencode({
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": redirect_uri
    }).encode("utf-8")
    
    import base64
    auth_bytes = f"{client_id}:{client_secret}".encode("utf-8")
    auth_b64 = base64.b64encode(auth_bytes).decode("utf-8")
    
    req = urllib.request.Request(
        url,
        data=data,
        headers={
            "Authorization": f"Basic {auth_b64}",
            "Content-Type": "application/x-www-form-urlencoded"
        }
    )
    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            tokens = {
                "access_token": res_data["access_token"],
                "refresh_token": res_data["refresh_token"],
                "expires_at": time.time() + res_data["expires_in"] - 30
            }
            profile_req = urllib.request.Request(
                "https://api.spotify.com/v1/me",
                headers={"Authorization": f"Bearer {tokens['access_token']}"}
            )
            with urllib.request.urlopen(profile_req, timeout=5) as p_resp:
                p_data = json.loads(p_resp.read().decode("utf-8"))
                tokens["display_name"] = p_data.get("display_name", "Spotify User")
                
            save_spotify_tokens(tokens)
            
            html_content = """
            <html>
            <head>
                <title>Spotify Authorized</title>
                <style>
                    body { background: #050810; color: #00ffd2; font-family: monospace; text-align: center; padding: 50px; }
                    h1 { text-shadow: 0 0 10px #00ffd2; }
                    p { color: #ffffff; }
                    .btn { display: inline-block; margin-top: 20px; padding: 10px 20px; border: 1px solid #00ffd2; color: #00ffd2; text-decoration: none; border-radius: 4px; }
                    .btn:hover { background: rgba(0, 255, 210, 0.1); }
                </style>
            </head>
            <body>
                <h1>SPOTIFY AUTHORIZED</h1>
                <p>JARVIS has successfully established secure credentials for your Spotify account.</p>
                <p>You may now close this window and resume terminal operations.</p>
                <a href="javascript:window.close()" class="btn">CLOSE WINDOW</a>
            </body>
            </html>
            """
            from fastapi.responses import HTMLResponse
            return HTMLResponse(content=html_content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Spotify Auth Failed: {str(e)}")

@app.get("/api/spotify/status")
def spotify_status():
    tokens = load_spotify_tokens()
    if tokens and tokens.get("access_token"):
        return {"connected": True, "display_name": tokens.get("display_name", "Spotify User")}
    return {"connected": False}

@app.get("/api/system_stats")
def get_system_stats():
    """Returns macOS metrics (CPU load, memory allocation, uptime, platform info)"""
    import subprocess
    import platform
    import socket
    import os
    import re
    
    stats = {
        "os": f"macOS {platform.mac_ver()[0]}",
        "arch": platform.machine(),
        "hostname": socket.gethostname(),
        "cpu_model": "Apple Silicon" if platform.machine() == "arm64" else "Intel Core",
        "cpu_usage": "0%",
        "ram_usage": "0%",
        "uptime": "Unknown",
        "battery": "Unknown",
        "network": "Offline",
        "exhausted_models": [k for k, v in EXHAUSTED_MODELS.items() if v]
    }
    
    # Get CPU brand string
    try:
        cpu_res = subprocess.run(["sysctl", "-n", "machdep.cpu.brand_string"], capture_output=True, text=True)
        if cpu_res.returncode == 0 and cpu_res.stdout.strip():
            stats["cpu_model"] = cpu_res.stdout.strip()
    except Exception:
        pass
        
    # Get load average (CPU)
    try:
        load1, load5, load15 = os.getloadavg()
        cpu_cores = os.cpu_count() or 8
        stats["cpu_usage"] = f"{min(100, int((load1 / cpu_cores) * 100))}%"
    except Exception:
        pass
        
    # Get memory usage via sysctl and vm_stat
    try:
        vm = subprocess.run(["sysctl", "-n", "hw.memsize"], capture_output=True, text=True)
        if vm.returncode == 0:
            total_bytes = int(vm.stdout.strip())
            total_gb = total_bytes / (1024**3)
            vm_stat = subprocess.run(["vm_stat"], capture_output=True, text=True)
            if vm_stat.returncode == 0:
                lines = vm_stat.stdout.split("\n")
                page_size = 4096  # default page size
                free_pages = 0
                active_pages = 0
                for line in lines:
                    if "Pages free:" in line:
                        free_pages = int(re.search(r'\d+', line).group())
                    elif "Pages active:" in line:
                        active_pages = int(re.search(r'\d+', line).group())
                used_gb = (active_pages * page_size) / (1024**3)
                stats["ram_usage"] = f"{used_gb:.1f}GB / {total_gb:.1f}GB"
    except Exception:
        pass
        
    # Get uptime
    try:
        up = subprocess.run(["uptime"], capture_output=True, text=True)
        if up.returncode == 0:
            parts = up.stdout.split("up")
            if len(parts) > 1:
                stats["uptime"] = parts[1].split(",")[0].strip()
    except Exception:
        pass
        
    # Get battery info
    try:
        batt_res = subprocess.run(["pmset", "-g", "batt"], capture_output=True, text=True)
        if batt_res.returncode == 0:
            lines = batt_res.stdout.split("\n")
            if len(lines) > 1:
                match = re.search(r'(\d+%);\s*([^;]+)', lines[1])
                if match:
                    stats["battery"] = f"{match.group(1)} ({match.group(2).strip()})"
                else:
                    stats["battery"] = lines[1].split("\t")[-1].split(";")[0]
    except Exception:
        pass

    # Get Wi-Fi SSID
    try:
        wifi_res = subprocess.run(["/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport", "-I"], capture_output=True, text=True)
        if wifi_res.returncode == 0:
            match = re.search(r'\sSSID:\s*(.*)', wifi_res.stdout)
            if match:
                stats["network"] = match.group(1).strip()
    except Exception:
        pass

    return stats

@app.post("/api/email")
async def draft_email(payload: EmailRequest):
    """Composes email draft in macOS Mail app via AppleScript."""
    to_email = payload.to.strip()
    subject = payload.subject.strip().replace('"', '\\"')
    body = payload.body.strip().replace('"', '\\"')
    send_now = payload.send_instantly
    
    if send_now:
        applescript = f'''
        tell application "Mail"
            set newOutgoingMessage to make new outgoing message with properties {{subject:"{subject}", content:"{body}", visible:true}}
            tell newOutgoingMessage
                make new to recipient with properties {{address:"{to_email}"}}
                send
            end tell
        end tell
        '''
    else:
        applescript = f'''
        tell application "Mail"
            delete every outgoing message
            set newOutgoingMessage to make new outgoing message with properties {{subject:"{subject}", content:"{body}", visible:true}}
            tell newOutgoingMessage
                make new to recipient with properties {{address:"{to_email}"}}
            end tell
            activate
        end tell
        '''
    try:
        subprocess.run(["osascript", "-e", applescript], check=True)
        msg = f"Sent email to {to_email} instantly using Mail.app" if send_now else f"Drafted email to {to_email} using Mail.app"
        return {"status": "success", "message": msg}
    except Exception as e:
        # Fallback to mailto link
        mailto_link = f"mailto:{to_email}?subject={urllib.parse.quote(subject)}&body={urllib.parse.quote(body)}"
        try:
            subprocess.run(["open", mailto_link])
            return {"status": "success", "message": f"Drafted email to {to_email} via mailto link fallback"}
        except Exception as err:
            raise HTTPException(status_code=500, detail=f"Failed to open mail client: {str(err)}")

@app.post("/api/message")
async def send_imessage(payload: MessageRequest):
    """Opens macOS Messages app with prefilled contact and body."""
    contact = payload.to.strip()
    body = payload.body.strip().replace('"', '\\"')
    
    applescript = f'''
    tell application "Messages"
        set targetService to 1st service whose service type is iMessage
        set targetBuddy to buddy "{contact}" of targetService
        send "{body}" to targetBuddy
    end tell
    '''
    
    try:
        imessage_link = f"imessage://{contact}"
        subprocess.run(["open", imessage_link])
        
        proc = subprocess.Popen(['osascript', '-e', applescript], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        stdout, stderr = proc.communicate()
        
        return {"status": "success", "message": f"Drafted message to {contact}"}
    except Exception as e:
        try:
            subprocess.run(["open", f"imessage://{contact}"])
            return {"status": "success", "message": f"Opened messages chat for {contact}"}
        except Exception:
            raise HTTPException(status_code=500, detail=f"Failed to open Messages: {str(e)}")

@app.post("/api/read")
def read_local_file(payload: FileReadRequest):
    """Read contents of a local file."""
    path = payload.path.strip()
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="File not found")
    try:
        with open(path, "r", encoding="utf-8") as f:
            return {"status": "success", "content": f.read()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading file: {str(e)}")

@app.post("/api/write")
def write_local_file(payload: FileWriteRequest):
    """Write content to a local file."""
    path = payload.path.strip()
    try:
        # Create directories if necessary
        os.makedirs(os.path.dirname(os.path.abspath(path)), exist_ok=True)
        with open(path, "w", encoding="utf-8") as f:
            f.write(payload.content)
        return {"status": "success", "message": f"Successfully wrote file to {path}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error writing file: {str(e)}")

@app.post("/api/review")
async def review_url(payload: OpenRequest):
    """Fetches text content of a URL."""
    url = payload.target.strip()
    if not url.startswith(("http://", "https://")):
        url = "https://" + url
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 RamSingh/1.0'})
        with urllib.request.urlopen(req, timeout=10) as response:
            html = response.read().decode('utf-8', errors='ignore')
            text = re.sub(r'<style[^>]*>[\s\S]*?</style>', '', html, flags=re.IGNORECASE)
            text = re.sub(r'<script[^>]*>[\s\S]*?</script>', '', text, flags=re.IGNORECASE)
            text = re.sub(r'<[^>]+>', ' ', text)
            text = re.sub(r'\s+', ' ', text).strip()
            # limit context length to prevent blowing up the prompt
            return {"status": "success", "content": text[:8000]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading URL: {str(e)}")

@app.post("/api/screenshot")
async def take_screenshot():
    import datetime
    pictures_dir = os.path.expanduser("~/Pictures")
    if not os.path.exists(pictures_dir):
        os.makedirs(pictures_dir)
    filename = datetime.datetime.now().strftime("RamSingh_Screen_%Y%m%d_%H%M%S.png")
    filepath = os.path.join(pictures_dir, filename)
    try:
        subprocess.run(["screencapture", filepath], check=True)
        return {"status": "success", "message": f"Screenshot saved to {filepath}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/music")
async def play_music(payload: MusicRequest):
    import time
    query = payload.query.strip().replace('"', '\\"')
    
    applescript = ""
    normalized = query.lower()
    if normalized in ["pause", "stop"]:
        applescript = 'tell application "Spotify" to pause'
    elif normalized in ["play", "resume"]:
        applescript = 'tell application "Spotify" to play'
    elif normalized in ["next", "skip"]:
        applescript = 'tell application "Spotify" to next track'
    elif normalized in ["previous", "back"]:
        applescript = 'tell application "Spotify" to previous track'
    else:
        is_playlist = "playlist" in normalized
        if is_playlist:
            clean_name = normalized.replace("playlist", "").strip()
            spotify_uri = f"spotify:search:playlist:{clean_name}"
        else:
            spotify_uri = f"spotify:search:{query}"
        applescript = f'tell application "Spotify" to play track "{spotify_uri}"'
        
    try:
        subprocess.run(["open", "-a", "Spotify"])
        time.sleep(3.0)
        proc = subprocess.Popen(['osascript', '-e', applescript], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        out, err = proc.communicate()
        return {"status": "success", "message": f"Successfully executed Spotify command: {query}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to control Spotify: {str(e)}")

@app.post("/api/wikipedia")
async def search_wikipedia(payload: WikipediaRequest):
    import json
    query = urllib.parse.quote(payload.query)
    url = f"https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=3&exlimit=1&titles={query}&explaintext=1&format=json"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 RamSingh/1.0'})
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode('utf-8'))
            pages = data.get("query", {}).get("pages", {})
            for page_id in pages:
                if page_id == "-1":
                    return {"status": "success", "content": "No exact Wikipedia match found."}
                extract = pages[page_id].get("extract", "")
                return {"status": "success", "content": extract}
            return {"status": "success", "content": "No content found."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Wikipedia API error: {str(e)}")

@app.post("/api/search")
async def search_endpoint(payload: SearchRequest):
    """Performs a web search via DuckDuckGo static HTML and returns top results."""
    query = payload.query.strip()
    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")
        
    url = "https://html.duckduckgo.com/html/"
    data = urllib.parse.urlencode({"q": query}).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"}
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            html_content = response.read().decode("utf-8", errors="ignore")
            
            # Extract elements using robust regexes
            titles = re.findall(r'<a[^>]*class="[^"]*result__a[^"]*"[^>]*>(.*?)</a>', html_content, re.DOTALL)
            snippets = re.findall(r'<a[^>]*class="[^"]*result__snippet[^"]*"[^>]*>(.*?)</a>', html_content, re.DOTALL)
            links = re.findall(r'<a[^>]*class="[^"]*result__url[^"]*"[^>]*>(.*?)</a>', html_content, re.DOTALL)
            
            # Format results
            search_results = []
            for i in range(min(5, len(snippets))):
                title = re.sub(r'<[^>]+>', '', titles[i]).strip() if i < len(titles) else "No Title"
                snippet = re.sub(r'<[^>]+>', '', snippets[i]).strip() if i < len(snippets) else "No Snippet"
                link = re.sub(r'<[^>]+>', '', links[i]).strip() if i < len(links) else "No Link"
                
                # Unescape HTML entities
                import html as html_lib
                title = html_lib.unescape(title)
                snippet = html_lib.unescape(snippet)
                link = html_lib.unescape(link)
                
                search_results.append(f"Result {i+1}:\nTitle: {title}\nLink: {link}\nSnippet: {snippet}\n")
            
            if not search_results:
                return {"status": "success", "content": "No search results found."}
                
            return {"status": "success", "content": "\n".join(search_results)}
            
    except Exception as err:
        raise HTTPException(status_code=500, detail=f"Web search failed: {str(err)}")

@app.post("/api/news")
async def news_endpoint(payload: NewsRequest):
    """Fetches latest articles from News API."""
    if not NEWS_API_KEY:
        raise HTTPException(status_code=500, detail="NEWS_API_KEY not found in Scalera environment variables.")
        
    query = payload.query.strip() if payload.query else ""
    
    # Determine URL based on search query
    if query:
        url = f"https://newsapi.org/v2/everything?q={urllib.parse.quote(query)}&pageSize=5&apiKey={NEWS_API_KEY}"
    else:
        url = f"https://newsapi.org/v2/top-headlines?country=us&pageSize=5&apiKey={NEWS_API_KEY}"
        
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 RamSingh/1.0'})
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode('utf-8'))
            if data.get("status") != "ok":
                raise HTTPException(status_code=400, detail=data.get("message", "Error fetching news."))
                
            articles = data.get("articles", [])
            formatted = []
            for i, art in enumerate(articles):
                title = art.get("title", "No Title")
                desc = art.get("description", "No Description")
                source = art.get("source", {}).get("name", "Unknown Source")
                formatted.append(f"Article {i+1}:\nTitle: {title}\nSource: {source}\nDescription: {desc}\n")
                
            if not formatted:
                return {"status": "success", "content": "No news articles found."}
                
            return {"status": "success", "content": "\n".join(formatted)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch news: {str(e)}")

@app.get("/api/location")
def get_location():
    """Fetches client location using public IP geolocation (ip-api.com)"""
    import urllib.request
    import json
    try:
        req = urllib.request.Request("http://ip-api.com/json", headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=3) as response:
            data = json.loads(response.read().decode('utf-8'))
            if data.get("status") == "fail":
                raise ValueError(data.get("message", "IP geolocation failed"))
            return {
                "city": data.get("city") or "Mumbai",
                "state": data.get("regionName") or "Maharashtra",
                "country": data.get("country") or "India",
                "pincode": data.get("zip") or "400001"
            }
    except Exception as e:
        print(f"Error fetching IP location: {e}")
        return {
            "city": "Mumbai",
            "state": "Maharashtra",
            "country": "India",
            "pincode": "400001"
        }

@app.post("/api/speech_to_text")
async def speech_to_text(request: Request):
    """Transcribes audio file to text using Groq's Whisper API."""
    import requests
    try:
        form_data = await request.form()
        audio_file = form_data.get("file")
        if not audio_file:
            raise HTTPException(status_code=400, detail="No audio file uploaded")
            
        audio_bytes = await audio_file.read()
        
        url = "https://api.groq.com/openai/v1/audio/transcriptions"
        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}"
        }
        files = {
            "file": (audio_file.filename or "recording.webm", audio_bytes, audio_file.content_type or "audio/webm")
        }
        data = {
            "model": "whisper-large-v3",
            "language": "en"
        }
        
        response = requests.post(url, headers=headers, files=files, data=data, timeout=10)
        if response.status_code == 200:
            return response.json()
        else:
            raise HTTPException(status_code=response.status_code, detail=response.text)
    except Exception as e:
        print(f"Error in speech_to_text transcription: {e}")
        raise HTTPException(status_code=500, detail=str(e))

static_dir = os.path.dirname(os.path.realpath(__file__))
app.mount("/static", StaticFiles(directory=static_dir), name="static")

@app.get("/")
def read_root():
    return FileResponse(os.path.join(static_dir, "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8008)
