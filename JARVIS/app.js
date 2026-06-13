// J.A.R.V.I.S. — Lightweight Terminal Client
// Canvas spectrum + Speech Recognition + Groq API

class Jarvis {
    constructor() {
        // DOM
        this.clock = document.getElementById('clock');
        this.dateLine = document.getElementById('dateLine');
        this.stateLabel = document.getElementById('stateLabel');
        this.statusDot = document.getElementById('statusDot');
        this.settingsBtn = document.getElementById('settingsBtn');
        this.settingsDrawer = document.getElementById('settingsDrawer');
        this.voiceSelect = document.getElementById('voiceSelect');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.bioName = document.getElementById('bioName');
        this.bioRole = document.getElementById('bioRole');
        this.canvas = document.getElementById('spectrum');
        this.transcript = document.getElementById('transcript');
        this.micBtn = document.getElementById('micBtn');
        this.micLabel = document.getElementById('micLabel');
        this.body = document.getElementById('app');

        // State
        this.state = 'off'; // off | standby | listening | thinking | speaking
        this.synth = window.speechSynthesis;
        this.recognition = null;
        this.voices = [];
        this.selectedVoice = null;
        this.currentUtterance = null;
        this.isSpeaking = false;
        this.chatHistory = [];
        this.listenTimer = null;

        // Audio / Visualizer
        this.audioCtx = null;
        this.analyser = null;
        this.micStream = null;
        this.ctx2d = this.canvas.getContext('2d');
        this.rafId = null;

        this.boot();
    }

    // ─── Boot ──────────────────────────────
    async boot() {
        this.tick();
        setInterval(() => this.tick(), 1000);
        await this.loadMemory();

        this.settingsBtn.onclick = () => this.settingsDrawer.classList.toggle('open');
        document.addEventListener('click', e => {
            if (!this.settingsDrawer.contains(e.target) && e.target !== this.settingsBtn) {
                this.settingsDrawer.classList.remove('open');
            }
        });

        this.loadVoices();
        if (this.synth.onvoiceschanged !== undefined) this.synth.onvoiceschanged = () => this.loadVoices();
        this.micBtn.onclick = () => this.toggle();
        this.setupRecognition();
        this.sizeCanvas();
        window.addEventListener('resize', () => this.sizeCanvas());
        this.drawIdle();
    }

    tick() {
        const now = new Date();
        this.clock.textContent = now.toLocaleTimeString('en-GB', { hour12: false });
        this.dateLine.textContent = now.toLocaleDateString('en-GB', {
            weekday: 'short', day: '2-digit', month: 'short', year: 'numeric'
        }).toUpperCase();
    }

    async loadMemory() {
        try {
            const r = await fetch('/api/memory');
            const d = await r.json();
            if (d.user_biodata) {
                this.bioName.textContent = d.user_biodata.name || '—';
                this.bioRole.textContent = d.user_biodata.role || '—';
            }
        } catch (e) { /* ignore */ }
    }

    // ─── State Machine ─────────────────────
    setState(s) {
        this.state = s;
        this.body.className = s === 'off' ? '' : `s-${s}`;
        const labels = { off: 'OFFLINE', standby: 'STANDBY', listening: 'LISTENING', thinking: 'PROCESSING', speaking: 'SPEAKING' };
        this.stateLabel.textContent = labels[s] || s.toUpperCase();

        clearTimeout(this.listenTimer);
        if (s === 'listening') {
            this.listenTimer = setTimeout(() => {
                if (this.state === 'listening') {
                    this.setState('standby');
                    this.log('sys', 'Idle timeout. Say "Jarvis" to wake.');
                }
            }, 15000);
        }
    }

    log(tag, text) {
        const cls = { you: 'tag-you', jarvis: 'tag-jarvis', sys: 'tag-sys' };
        const prefix = tag.toUpperCase();
        const line = document.createElement('div');
        line.className = 'line';
        line.innerHTML = `<span class="tag ${cls[tag] || ''}">[${prefix}]</span>${this.escHtml(text)}`;
        this.transcript.appendChild(line);
        this.transcript.scrollTop = this.transcript.scrollHeight;
    }

    escHtml(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

    // ─── Canvas Spectrum ───────────────────
    sizeCanvas() {
        const r = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = r.width;
        this.canvas.height = r.height - 100; // leave room for transcript
        if (this.canvas.height < 80) this.canvas.height = 80;
    }

    drawIdle() {
        const c = this.ctx2d;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const draw = () => {
            c.clearRect(0, 0, w, h);
            const bars = 64;
            const bw = w / bars;
            const t = Date.now() * 0.001;
            for (let i = 0; i < bars; i++) {
                let v = 0;
                if (this.state === 'off') {
                    v = (Math.sin(t * 0.5 + i * 0.15) * 0.5 + 0.5) * 0.05;
                } else if (this.state === 'standby') {
                    v = (Math.sin(t + i * 0.2) * 0.5 + 0.5) * 0.08;
                }
                const bh = Math.max(2, v * h);
                c.fillStyle = this.barColor(0.15);
                c.fillRect(i * bw + 1, h - bh, bw - 2, bh);
            }
            if (!this.analyser || this.state === 'off' || this.state === 'standby') {
                this.rafId = requestAnimationFrame(draw);
            }
        };
        draw();
    }

    drawLive() {
        if (!this.analyser) return;
        const c = this.ctx2d;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const bufLen = this.analyser.frequencyBinCount;
        const data = new Uint8Array(bufLen);
        const bars = 64;

        const draw = () => {
            if (this.state === 'off') { this.drawIdle(); return; }
            this.analyser.getByteFrequencyData(data);
            c.clearRect(0, 0, w, h);

            const bw = w / bars;
            for (let i = 0; i < bars; i++) {
                const idx = Math.floor(i * bufLen / bars);
                let v = data[idx] / 255;

                // Boost based on state
                if (this.state === 'speaking') {
                    v = Math.max(v, (Math.sin(Date.now() * 0.008 + i * 0.3) * 0.5 + 0.5) * 0.6);
                } else if (this.state === 'thinking') {
                    v = Math.max(v * 0.3, (Math.cos(Date.now() * 0.004 + i * 0.15) * 0.5 + 0.5) * 0.25);
                } else if (this.state === 'standby') {
                    v = Math.max(v * 0.15, (Math.sin(Date.now() * 0.001 + i * 0.2) * 0.5 + 0.5) * 0.08);
                }

                const bh = Math.max(2, v * h * 0.85);
                const alpha = 0.3 + v * 0.7;
                c.fillStyle = this.barColor(alpha);
                c.fillRect(i * bw + 1, h - bh, bw - 2, bh);

                // Mirror reflection
                c.fillStyle = this.barColor(alpha * 0.15);
                c.fillRect(i * bw + 1, h, bw - 2, bh * 0.2);
            }
            this.rafId = requestAnimationFrame(draw);
        };
        draw();
    }

    barColor(a) {
        if (this.state === 'listening') return `rgba(0,230,118,${a})`;
        if (this.state === 'thinking') return `rgba(253,216,53,${a})`;
        if (this.state === 'speaking') return `rgba(255,145,0,${a})`;
        return `rgba(64,224,208,${a})`;
    }

    // ─── Audio ─────────────────────────────
    initAudio() {
        if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
    }

    chime() {
        this.initAudio();
        const c = this.audioCtx, t = c.currentTime;
        const o = c.createOscillator(), g = c.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(400, t);
        o.frequency.exponentialRampToValueAtTime(1200, t + 0.15);
        g.gain.setValueAtTime(0.06, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        o.connect(g); g.connect(c.destination);
        o.start(t); o.stop(t + 0.2);
    }

    async startMic() {
        try {
            this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.initAudio();
            const src = this.audioCtx.createMediaStreamSource(this.micStream);
            this.analyser = this.audioCtx.createAnalyser();
            this.analyser.fftSize = 256;
            src.connect(this.analyser);
            if (this.rafId) cancelAnimationFrame(this.rafId);
            this.drawLive();
        } catch (e) {
            // Mic not available — keep idle draw
        }
    }

    stopMic() {
        if (this.micStream) { this.micStream.getTracks().forEach(t => t.stop()); this.micStream = null; }
        if (this.rafId) cancelAnimationFrame(this.rafId);
        this.analyser = null;
        this.drawIdle();
    }

    // ─── Voices ────────────────────────────
    loadVoices() {
        this.voices = this.synth.getVoices();
        this.voiceSelect.innerHTML = '';
        const en = this.voices.filter(v => v.lang.startsWith('en'));
        const gb = en.filter(v => v.lang.startsWith('en-GB'));
        const sorted = [...gb, ...en.filter(v => !v.lang.startsWith('en-GB'))];

        sorted.forEach(v => {
            const o = document.createElement('option');
            o.value = v.name;
            o.textContent = `${v.name} (${v.lang})`;
            if (!this.selectedVoice && (v.name.includes('Daniel') || v.name.includes('Oliver') || v.name.includes('Arthur') || v.name.includes('Google UK English Male'))) {
                o.selected = true;
                this.selectedVoice = v;
            }
            this.voiceSelect.appendChild(o);
        });
        if (!this.selectedVoice && sorted.length) this.selectedVoice = sorted[0];
        this.voiceSelect.onchange = () => { this.selectedVoice = this.voices.find(v => v.name === this.voiceSelect.value); };
    }

    speak(text) {
        if (!text) return;
        this.synth.cancel();
        const u = new SpeechSynthesisUtterance(text);
        if (this.selectedVoice) u.voice = this.selectedVoice;
        u.rate = 1.0;
        u.pitch = 1.0;
        u.volume = parseFloat(this.volumeSlider.value);
        this.currentUtterance = u;

        u.onstart = () => {
            this.isSpeaking = true;
            this.setState('speaking');
            try { this.recognition.stop(); } catch (e) {}
        };
        u.onend = () => {
            this.isSpeaking = false;
            this.currentUtterance = null;
            this.setState('listening');
            this.restartRec();
        };
        u.onerror = () => {
            this.isSpeaking = false;
            this.currentUtterance = null;
            this.setState('standby');
            this.restartRec();
        };
        this.synth.speak(u);
    }

    // ─── Recognition ───────────────────────
    setupRecognition() {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) { this.log('sys', 'Speech recognition not supported. Use Chrome.'); return; }
        this.recognition = new SR();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.recognition.onresult = (e) => {
            if (this.isSpeaking || this.state === 'thinking') return;
            let fin = '', interim = '';
            for (let i = e.resultIndex; i < e.results.length; i++) {
                if (e.results[i].isFinal) fin += e.results[i][0].transcript;
                else interim += e.results[i][0].transcript;
            }
            const active = (fin || interim).toLowerCase().trim();

            if (this.state === 'standby') {
                if (active.includes('jarvis')) this.wake(active);
            } else if (this.state === 'listening') {
                if (fin) this.process(fin.trim());
            }
        };
        this.recognition.onerror = (e) => { if (e.error === 'not-allowed') this.toggle(false); };
        this.recognition.onend = () => {
            if (this.state !== 'off' && this.state !== 'speaking') this.restartRec();
        };
    }

    restartRec() { try { this.recognition.start(); } catch (e) {} }

    // ─── Toggle ────────────────────────────
    toggle(force) {
        const on = force !== undefined ? force : (this.state === 'off');
        if (on) {
            this.initAudio();
            this.chime();
            this.micBtn.classList.remove('off'); this.micBtn.classList.add('on');
            this.micLabel.textContent = 'JARVIS ACTIVE';
            this.setState('standby');
            this.restartRec();
            this.startMic();
            this.log('sys', 'System online. Say "Jarvis" to begin.');
        } else {
            this.synth.cancel();
            this.currentUtterance = null;
            try { this.recognition.stop(); } catch (e) {}
            this.stopMic();
            this.setState('off');
            this.micBtn.classList.add('off'); this.micBtn.classList.remove('on');
            this.micLabel.textContent = 'PRESS TO ACTIVATE';
            this.log('sys', 'System offline.');
        }
    }

    // ─── Wake ──────────────────────────────
    wake(transcript) {
        this.chime();
        this.synth.cancel();
        this.currentUtterance = null;
        this.setState('listening');

        const q = transcript.replace(/.*jarvis\s*/i, '').trim();
        if (q.length > 2) {
            this.log('you', q);
            this.process(q);
        } else {
            const needsSetup = !this.bioName.textContent || this.bioName.textContent === '—';
            let g;
            if (needsSetup) {
                g = "Good day. I am J.A.R.V.I.S. I don't seem to have your details on file yet. May I have your name, sir?";
            } else {
                const name = this.bioName.textContent;
                const hr = new Date().getHours();
                const td = hr < 12 ? 'morning' : hr < 17 ? 'afternoon' : 'evening';
                const gs = [`Good ${td}, ${name}. How can I assist you?`, `Yes, ${name}?`, `At your service, ${name}. What do you need?`, `Online and ready, ${name}.`];
                g = gs[Math.floor(Math.random() * gs.length)];
            }
            this.log('jarvis', g);
            this.speak(g);
        }
    }

    // ─── Process Query ─────────────────────
    async process(query) {
        if (!query) return;
        this.log('you', query);
        this.setState('thinking');

        this.chatHistory.push({ role: 'user', content: query });
        if (this.chatHistory.length > 20) this.chatHistory.splice(0, 2);

        try {
            const r = await fetch('/api/groq', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: this.chatHistory })
            });
            const d = await r.json();
            if (d.error) throw new Error(typeof d.error === 'object' ? JSON.stringify(d.error) : d.error);
            if (!d.choices || !d.choices[0]) throw new Error('Empty AI response');

            const reply = d.choices[0].message.content.trim();
            this.chatHistory.push({ role: 'assistant', content: reply });
            await this.exec(reply);
        } catch (e) {
            this.log('sys', 'Error: ' + e.message);
            this.speak("My apologies, sir. I encountered a connection issue.");
        }
    }

    // ─── Execute Response Tags ─────────────
    async exec(reply) {
        let text = reply;

        // [SAVE_MEMORY: {json}]
        const mem = reply.match(/\[SAVE_MEMORY:\s*(\{[^}]+\})\]/i);
        if (mem) {
            text = text.replace(/\[SAVE_MEMORY:\s*\{[^}]+\}\]/gi, '').trim();
            try {
                const f = JSON.parse(mem[1]);
                const r = await fetch('/api/memory'); const m = await r.json();
                m.user_biodata = { ...m.user_biodata, ...f };
                await fetch('/api/memory', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(m) });
                await this.loadMemory();
                this.chime();
            } catch (e) {}
        }

        // [OPEN: target]
        const op = reply.match(/\[OPEN:\s*([^\]]+)\]/i);
        if (op) {
            text = text.replace(/\[OPEN:\s*[^\]]+\]/gi, '').trim();
            fetch('/api/open', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ target: op[1].trim() }) });
            this.chime();
        }

        // [EMAIL: to | subj | body]
        const em = reply.match(/\[EMAIL:\s*([^|]+)\|([^|]+)\|([^\]]+)\]/i);
        if (em) {
            text = text.replace(/\[EMAIL:\s*[^\]]+\]/gi, '').trim();
            fetch('/api/email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ to: em[1].trim(), subject: em[2].trim(), body: em[3].trim() }) });
            this.chime();
        }

        // [MESSAGE: to | body]
        const ms = reply.match(/\[MESSAGE:\s*([^|]+)\|([^\]]+)\]/i);
        if (ms) {
            text = text.replace(/\[MESSAGE:\s*[^\]]+\]/gi, '').trim();
            fetch('/api/message', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ to: ms[1].trim(), body: ms[2].trim() }) });
            this.chime();
        }

        // [READ_FILE: path]
        const rf = reply.match(/\[READ_FILE:\s*([^\]]+)\]/i);
        if (rf) {
            text = text.replace(/\[READ_FILE:\s*[^\]]+\]/gi, '').trim();
            try {
                const r = await fetch('/api/read', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path: rf[1].trim() }) });
                const d = await r.json();
                if (r.ok) {
                    this.chatHistory.push({ role: 'system', content: `File:\n${d.content}` });
                    const n = await fetch('/api/groq', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: this.chatHistory }) });
                    const nd = await n.json();
                    if (nd.choices?.[0]) text = nd.choices[0].message.content.trim();
                }
            } catch (e) {}
        }

        // [WRITE_FILE: path | content]
        const wf = reply.match(/\[WRITE_FILE:\s*([^|]+)\|([^\]]+)\]/i);
        if (wf) {
            text = text.replace(/\[WRITE_FILE:\s*[^\]]+\]/gi, '').trim();
            fetch('/api/write', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path: wf[1].trim(), content: wf[2].trim() }) });
            this.chime();
        }

        // [REVIEW_URL: url]
        const rv = reply.match(/\[REVIEW_URL:\s*([^\]]+)\]/i);
        if (rv) {
            text = text.replace(/\[REVIEW_URL:\s*[^\]]+\]/gi, '').trim();
            try {
                const r = await fetch('/api/review', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ target: rv[1].trim() }) });
                const d = await r.json();
                if (r.ok) {
                    this.chatHistory.push({ role: 'system', content: `Page:\n${d.content}` });
                    const n = await fetch('/api/groq', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: this.chatHistory }) });
                    const nd = await n.json();
                    if (nd.choices?.[0]) text = nd.choices[0].message.content.trim();
                }
                this.chime();
            } catch (e) {}
        }

        // [WIKIPEDIA: topic]
        const wk = reply.match(/\[WIKIPEDIA:\s*([^\]]+)\]/i);
        if (wk) {
            text = text.replace(/\[WIKIPEDIA:\s*[^\]]+\]/gi, '').trim();
            try {
                const r = await fetch('/api/wikipedia', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: wk[1].trim() }) });
                const d = await r.json();
                if (r.ok) {
                    this.chatHistory.push({ role: 'system', content: `Wikipedia:\n${d.content}` });
                    const n = await fetch('/api/groq', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: this.chatHistory }) });
                    const nd = await n.json();
                    if (nd.choices?.[0]) text = nd.choices[0].message.content.trim();
                }
                this.chime();
            } catch (e) {}
        }

        // [SCREENSHOT]
        if (/\[SCREENSHOT\]/i.test(reply)) {
            text = text.replace(/\[SCREENSHOT\]/gi, '').trim();
            fetch('/api/screenshot', { method: 'POST' });
            this.chime();
        }

        // [PLAY_MUSIC: song]
        const pm = reply.match(/\[PLAY_MUSIC:\s*([^\]]+)\]/i);
        if (pm) {
            text = text.replace(/\[PLAY_MUSIC:\s*[^\]]+\]/gi, '').trim();
            fetch('/api/music', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: pm[1].trim() }) });
            this.chime();
        }

        // [SAVE_REMINDER: text]
        const sr = reply.match(/\[SAVE_REMINDER:\s*([^\]]+)\]/i);
        if (sr) {
            text = text.replace(/\[SAVE_REMINDER:\s*[^\]]+\]/gi, '').trim();
            try {
                const r = await fetch('/api/memory'); const m = await r.json();
                m.reminders = m.reminders || [];
                m.reminders.push(sr[1].trim());
                await fetch('/api/memory', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(m) });
                this.chime();
            } catch (e) {}
        }

        // Strip leftover tags
        text = text.replace(/\[[A-Z_]+:?\s*[^\]]*\]/gi, '').trim();
        if (!text) text = 'Right away, sir.';

        this.log('jarvis', text);
        this.speak(text);
    }
}

window.addEventListener('DOMContentLoaded', () => { window.jarvis = new Jarvis(); });
