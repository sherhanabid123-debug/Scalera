import re

path = "/Users/yogiraj/.gemini/antigravity/brain/ada30ad1-7e4e-41a2-b63d-4f8903148c05/task.md"

with open(path, "r") as f:
    task_content = f.read()

task_content = task_content.replace("- [ ] **Persistent Chat History Database**", "- [x] **Persistent Chat History Database**")
task_content = task_content.replace("- [ ] Initialize `chat_history.json` and a rolling memory loader in `main.py`.", "- [x] Initialize `chat_history.json` and a rolling memory loader in `main.py`.")
task_content = task_content.replace("- [ ] Add `/api/chat_history` endpoint.", "- [x] Add `/api/chat_history` endpoint.")
task_content = task_content.replace("- [ ] Modify `/api/groq` to append conversation turns directly to the file.", "- [x] Modify `/api/groq` to append conversation turns directly to the file.")

task_content = task_content.replace("- [ ] **History UI Restoration**", "- [x] **History UI Restoration**")
task_content = task_content.replace("- [ ] Modify `index.html` to fetch `/api/chat_history` on boot.", "- [x] Modify `index.html` to fetch `/api/chat_history` on boot.")
task_content = task_content.replace("- [ ] Populate `this.hist` with previous turns and render in `#console`.", "- [x] Populate `this.hist` with previous turns and render in `#console`.")

task_content = task_content.replace("- [ ] **Desktop Spotify AppleScript Control**", "- [x] **Desktop Spotify AppleScript Control**")
task_content = task_content.replace("- [ ] Rewrite `/api/music` logic in `main.py` to use `osascript` instead of Web OAuth.", "- [x] Rewrite `/api/music` logic in `main.py` to use `osascript` instead of Web OAuth.")
task_content = task_content.replace("- [ ] Support \"play\", \"pause\", \"next\", \"previous\" explicitly.", "- [x] Support \"play\", \"pause\", \"next\", \"previous\" explicitly.")
task_content = task_content.replace("- [ ] Remove Spotify widget from `index.html`.", "- [x] Remove Spotify widget from `index.html`.")

task_content = task_content.replace("- [ ] **Desktop WhatsApp Automation**", "- [x] **Desktop WhatsApp Automation**")
task_content = task_content.replace("- [ ] Add `[WHATSAPP: Contact | Message]` instruction to the system prompt.", "- [x] Add `[WHATSAPP: Contact | Message]` instruction to the system prompt.")
task_content = task_content.replace("- [ ] Add `[WHATSAPP: Contact | Message]` execution logic to `/api/groq` using AppleScript GUI control.", "- [x] Add `[WHATSAPP: Contact | Message]` execution logic to `/api/groq` using AppleScript GUI control.")
task_content = task_content.replace("- [ ] Add visual HUD log handler for WhatsApp in `index.html`.", "- [x] Add visual HUD log handler for WhatsApp in `index.html`.")

with open(path, "w") as f:
    f.write(task_content)
