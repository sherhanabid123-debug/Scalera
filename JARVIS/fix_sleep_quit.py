import re

with open("index.html", "r") as f:
    idx_code = f.read()

# Modify speak() to use nextState
speak_old = """        u.onend = () => { 
            this.utt = null; 
            this.set('listening'); 
            this.startSpeechFlow(); 
        };"""

speak_new = """        u.onend = () => { 
            this.utt = null; 
            this.set(this.nextState || 'listening'); 
            this.nextState = null;
            this.startSpeechFlow(); 
        };"""
idx_code = idx_code.replace(speak_old, speak_new)

# Add QUIT and SLEEP handlers to exec()
exec_addition = """
        // 9. QUIT
        if (/\\[QUIT\\]/i.test(reply)) {
            t = t.replace(/\\[QUIT\\]/gi, '').trim();
            if (!t) t = "Goodbye, sir. Shutting down systems.";
            this.log('rs', t);
            this.speak(t);
            setTimeout(() => {
                window.close();
            }, 4000);
            return;
        }

        // 10. SLEEP
        if (/\\[SLEEP\\]/i.test(reply)) {
            t = t.replace(/\\[SLEEP\\]/gi, '').trim();
            if (!t) t = "Entering standby mode, sir.";
            this.nextState = 'standby';
            this.log('rs', t);
            this.speak(t);
            return;
        }
"""

idx_code = idx_code.replace(
    "// Strip remaining command tags from final spoken text",
    exec_addition + "\n        // Strip remaining command tags from final spoken text"
)

with open("index.html", "w") as f:
    f.write(idx_code)

print("Index fixed.")
