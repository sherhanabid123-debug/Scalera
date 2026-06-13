import os
import re

with open("main.py", "r") as f:
    main_code = f.read()

with open("index.html", "r") as f:
    idx_code = f.read()

# 1. Add Chat History file and endpoints
chat_history_funcs = """
CHAT_HISTORY_FILE = os.path.join(BASE_DIR, "chat_history.json")

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
"""

# Insert after load_memory()
main_code = main_code.replace(
    "class Message(BaseModel):",
    chat_history_funcs + "\nclass Message(BaseModel):"
)

# 2. Modify groq_proxy to append to history
# Find groq_proxy where it constructs messages_payload
# Wait, let's just append at the start and end of groq_proxy
groq_proxy_start = """    # Add other messages, filtering out any raw system prompts sent by client
    for msg in payload.messages:
        if msg.role != "system":
            messages_payload.append(msg.dict())"""

# Replace it with appending only the last user message to history, since index.html sends all.
# Better: index.html shouldn't maintain history. Let's make main.py maintain it, but index.html sends everything.
# Let's just append the latest user message.
groq_proxy_new_start = """    # Add other messages, filtering out any raw system prompts sent by client
    for msg in payload.messages:
        if msg.role != "system":
            messages_payload.append(msg.dict())
            
    if payload.messages and payload.messages[-1].role == "user":
        append_to_chat_history("user", payload.messages[-1].content)"""

main_code = main_code.replace(groq_proxy_start, groq_proxy_new_start)

# At the end of groq_proxy, append the final assistant response
groq_proxy_end = """    if intermediate_texts and final_response_data:
        final_text = final_response_data["choices"][0]["message"]["content"]
        combined_text = "\\n\\n".join(intermediate_texts + [final_text])
        final_response_data["choices"][0]["message"]["content"] = combined_text

    return final_response_data"""

groq_proxy_new_end = """    if intermediate_texts and final_response_data:
        final_text = final_response_data["choices"][0]["message"]["content"]
        combined_text = "\\n\\n".join(intermediate_texts + [final_text])
        final_response_data["choices"][0]["message"]["content"] = combined_text

    if final_response_data and final_response_data.get("choices"):
        append_to_chat_history("assistant", final_response_data["choices"][0]["message"]["content"])

    return final_response_data"""

main_code = main_code.replace(groq_proxy_end, groq_proxy_new_end)

# 3. WhatsApp Integration
whatsapp_prompt = """19. Send WhatsApp: `[WHATSAPP: Contact Name | Message]` (Use this to orchestrate the desktop WhatsApp app to send a message)"""

main_code = main_code.replace(
    "18. Close Chrome Tab: `[RUN_COMMAND: osascript -e 'tell application \"Google Chrome\" to close active tab of front window']` (Use this exactly when user asks to close a chrome tab)",
    "18. Close Chrome Tab: `[RUN_COMMAND: osascript -e 'tell application \"Google Chrome\" to close active tab of front window']` (Use this exactly when user asks to close a chrome tab)\n" + whatsapp_prompt
)

whatsapp_handler = """        # 11. WHATSAPP
        wa_match = re.search(r'\\[[A-Z]*WHATSAPP:\\s*([^|]+)\\|([^\\]]+)\\]', reply, re.IGNORECASE)
        if wa_match and not has_tool:
            contact = wa_match.group(1).strip()
            msg_text = wa_match.group(2).strip()
            try:
                # Desktop AppleScript for WhatsApp
                import urllib.parse
                safemsg = urllib.parse.quote(msg_text)
                applescript = f'''
                tell application "WhatsApp" to activate
                delay 1.0
                tell application "System Events"
                    keystroke "f" using {{command down}}
                    delay 0.5
                    keystroke "{contact}"
                    delay 1.5
                    keystroke return
                    delay 0.5
                    keystroke "{msg_text}"
                    delay 0.5
                    keystroke return
                end tell
                '''
                subprocess.run(["osascript", "-e", applescript])
                tool_content = f"WhatsApp message successfully sent to {contact}."
                has_tool = True
            except Exception as e:
                tool_content = f"WhatsApp delivery failed: {e}"
                has_tool = True
"""

main_code = main_code.replace(
    "        if has_tool:",
    whatsapp_handler + "\n        if has_tool:"
)

# 4. Desktop Spotify Control Update
music_handler_old = """@app.post("/api/music")
async def play_music(payload: MusicRequest):
    import time
    query = payload.query.strip().replace('"', '\\\\"')
    
    # Check if they are asking for a playlist
    normalized = query.lower()
    is_playlist = "playlist" in normalized
    
    if is_playlist:
        clean_name = normalized.replace("playlist", "").strip()
        spotify_uri = f"spotify:search:playlist:{clean_name}"
    else:
        spotify_uri = f"spotify:search:{query}"
        
    applescript = f'''
    tell application "Spotify"
        play track "{spotify_uri}"
    end tell
    '''
    try:
        subprocess.run(["open", "-a", "Spotify"])
        time.sleep(1.5)
        proc = subprocess.Popen(['osascript', '-e', applescript], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        out, err = proc.communicate()
        return {"status": "success", "message": f"Successfully playing on Spotify: {query}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to play music on Spotify: {str(e)}")"""

music_handler_new = """@app.post("/api/music")
async def play_music(payload: MusicRequest):
    import time
    query = payload.query.strip().replace('"', '\\\\"')
    
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
        time.sleep(1.0)
        proc = subprocess.Popen(['osascript', '-e', applescript], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        out, err = proc.communicate()
        return {"status": "success", "message": f"Successfully executed Spotify command: {query}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to control Spotify: {str(e)}")"""

main_code = main_code.replace(music_handler_old, music_handler_new)

# 5. Fix index.html History and UI
# Remove Spotify UI from index.html
spotify_widget_regex = re.compile(r'<!-- Spotify Connection Widget -->.*?<div style="border-bottom:1px solid rgba\(0,187,255,0\.1\); margin: 6px 0;"></div>', re.DOTALL)
idx_code = spotify_widget_regex.sub('', idx_code)

# Add load history to index.html
load_history_func = """    async loadChatHistory() {
        try {
            const res = await fetch('/api/chat_history');
            if (res.ok) {
                const history = await res.json();
                history.forEach(msg => {
                    this.log(msg.role === 'user' ? 'you' : 'rs', msg.content);
                    this.hist.push({ role: msg.role, content: msg.content });
                });
                if (this.hist.length > 50) {
                    this.hist = this.hist.slice(this.hist.length - 50);
                }
            }
        } catch(e) {}
    }"""

# Insert inside class J
idx_code = idx_code.replace(
    "async updateSystemStats() {",
    load_history_func + "\n\n    async updateSystemStats() {"
)

# Call loadChatHistory in constructor
idx_code = idx_code.replace(
    "this.updateBiodata();",
    "this.updateBiodata();\n        this.loadChatHistory();"
)

# Fix exec log for WHATSAPP
wa_log = """        const wa = reply.match(/\\[WHATSAPP:\\s*([^|]+)\\|/i);
        if (wa) this.log('sys', `INJECTING DESKTOP WHATSAPP PAYLOAD FOR: ${wa[1].toUpperCase()}`);"""

idx_code = idx_code.replace(
    "const rd = reply.match(/\\[REMOVE_FROM_DOCK:\\s*([^\\]]+)\\]/i);\n        if (rd) this.log('sys', `MODIFYING DOCK LAYOUT, REMOVING: ${rd[1].toUpperCase()}`);",
    "const rd = reply.match(/\\[REMOVE_FROM_DOCK:\\s*([^\\]]+)\\]/i);\n        if (rd) this.log('sys', `MODIFYING DOCK LAYOUT, REMOVING: ${rd[1].toUpperCase()}`);\n\n" + wa_log
)

with open("main.py", "w") as f:
    f.write(main_code)

with open("index.html", "w") as f:
    f.write(idx_code)

print("Changes applied successfully.")
