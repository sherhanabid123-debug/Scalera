const chatHistory = document.getElementById('chat-history');
const aiForm = document.getElementById('ai-form');
const aiInput = document.getElementById('ai-input');
const quickReplies = document.getElementById('quick-replies');
const aiChatBox = document.getElementById('ai-chat');
const aiGeneratingBox = document.getElementById('ai-generating');
const aiResultBox = document.getElementById('ai-result');
const generateTriggerBtn = document.getElementById('generate-trigger-btn');

// Conversation State
let messages = [];

// Stores the three generated file contents
let generatedHTML = '';
let generatedCSS  = '';
let generatedJS   = '';

// The composed full inline HTML used for the iframe preview and "Open in New Tab"
let compositeHTML = '';

// ─────────────────────────────────────────────────
// Chat helpers
// ─────────────────────────────────────────────────
function appendUserMessage(text) {
    const msgHTML = `
        <div class="chat-message user-message animate-message">
            <div class="message-content"><p>${text}</p></div>
        </div>`;
    chatHistory.insertAdjacentHTML('beforeend', msgHTML);
    scrollToBottom();
}

function appendAIMessage(text) {
    // Basic Markdown to HTML (bold)
    const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
    const msgHTML = `
        <div class="chat-message ai-message animate-message">
            <div class="message-avatar">S.</div>
            <div class="message-content"><p>${formattedText}</p></div>
        </div>`;
    chatHistory.insertAdjacentHTML('beforeend', msgHTML);
    scrollToBottom();
}

function scrollToBottom() {
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function showTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.style.display = 'flex';
        chatHistory.appendChild(indicator);
        scrollToBottom();
    }
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.style.display = 'none';
}

function showQuickReplies(replies) {
    quickReplies.innerHTML = '';
    if (!replies || replies.length === 0) { 
        quickReplies.style.display = 'none'; 
        return; 
    }
    replies.forEach(reply => {
        const btn = document.createElement('button');
        btn.className = 'quick-reply-btn';
        btn.textContent = reply;
        btn.onclick = () => {
            aiInput.value = reply;
            aiForm.dispatchEvent(new Event('submit'));
        };
        quickReplies.appendChild(btn);
    });
    quickReplies.style.display = 'flex';
}

// ─────────────────────────────────────────────────
// Interactive Chat with Groq API
// ─────────────────────────────────────────────────
let modalShown = false;

async function sendToAI(userText) {
    showTypingIndicator();
    aiInput.disabled = true;
    
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: messages })
        });
        
        const data = await response.json();
        hideTypingIndicator();
        aiInput.disabled = false;
        aiInput.focus();
        
        if (data.status === 'success' && data.reply) {
            const aiReply = typeof data.reply === 'string' ? data.reply : data.reply.reply;
            const isReady = typeof data.reply === 'object' && data.reply.ready_to_generate;

            messages.push({ role: "assistant", content: aiReply });
            appendAIMessage(aiReply);

            if (isReady && !modalShown) {
                showReadyModal();
            }
        } else {
            appendAIMessage("I'm having trouble connecting to my servers right now.");
        }
    } catch (e) {
        console.error(e);
        hideTypingIndicator();
        aiInput.disabled = false;
        appendAIMessage("Error connecting to Scalera AI engine. Is the backend running?");
    }
}

function showReadyModal() {
    const modal = document.getElementById('ready-modal');
    if (modal) {
        modal.style.display = 'flex';
        modalShown = true;
    }
}

function hideReadyModal() {
    const modal = document.getElementById('ready-modal');
    if (modal) modal.style.display = 'none';
}

document.getElementById('modal-generate-btn')?.addEventListener('click', () => {
    hideReadyModal();
    const chatHistoryStr = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join("\n\n");
    startGeneration(chatHistoryStr);
});

document.getElementById('modal-continue-btn')?.addEventListener('click', () => {
    hideReadyModal();
    aiInput.focus();
});

aiForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = aiInput.value.trim();
    if (!val) return;

    appendUserMessage(val);
    messages.push({ role: "user", content: val });
    aiInput.value = '';
    quickReplies.style.display = 'none';

    sendToAI(val);
});

// Initialize first message and entrance animations
window.addEventListener('DOMContentLoaded', () => {
    // We already have a hardcoded welcome message in the HTML, 
    // so we just add it to our messages array as an assistant message.
    messages.push({ 
        role: "assistant", 
        content: "Hello! I am Scalera AI. I'll help you build a premium digital presence in minutes. First, what is the name of your business or project?" 
    });

    // --- Entrance Animation ---
    if (typeof gsap !== 'undefined') {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        
        // 1. Reveal ambient background blobs
        tl.to(".ambient-bg .blob", {
            opacity: 0.5,
            scale: 1,
            duration: 0.8,
            stagger: 0.1
        });
        
        // 2. Reveal navbar and main chat box
        tl.to(".glass-nav, .ai-chat-box", {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.05
        }, "-=0.7");
        
        // 3. Reveal Logo and Nav links
        tl.to(".logo, .nav-link", {
            opacity: 1,
            duration: 0.4,
            stagger: 0.03
        }, "-=0.4");
        
        // 4. Stagger reveal the initial message content
        tl.from(".ai-message .message-avatar, .ai-message .message-content", {
            opacity: 0,
            y: 5,
            stagger: 0.05,
            duration: 0.4
        }, "-=0.3");

        // 5. Reveal the input area
        tl.from(".chat-input-area", {
            opacity: 0,
            y: 3,
            duration: 0.4
        }, "-=0.2");
    } else {
        // Fallback if GSAP is not loaded
        document.querySelectorAll('.reveal-init').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }
});

// ─────────────────────────────────────────────────
// Trigger Generation
// ─────────────────────────────────────────────────
generateTriggerBtn.addEventListener('click', () => {
    if (messages.length < 3) {
        alert("Please chat with me a bit more first so I know what to build!");
        return;
    }
    
    // Format conversation history to a string block
    let chatHistoryStr = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join("\n\n");
    
    startGeneration(chatHistoryStr);
});

// ─────────────────────────────────────────────────
// Generation phase
// ─────────────────────────────────────────────────
function startGeneration(chatHistoryStr) {
    aiChatBox.style.display = 'none';
    aiGeneratingBox.style.display = 'flex';

    const steps = [
        { id: 'step-1', status: "Analyzing brand identity..." },
        { id: 'step-2', status: "Crafting layout & styles..." },
        { id: 'step-3', status: "Generating source code..." },
        { id: 'step-4', status: "Optimizing for launch..." }
    ];

    let currentIdx = 0;
    const statusEl = document.getElementById('generation-status');

    const interval = setInterval(() => {
        if (currentIdx < steps.length) {
            const step = steps[currentIdx];
            
            // Mark previous as completed
            if (currentIdx > 0) {
                const prev = document.getElementById(steps[currentIdx-1].id);
                prev.classList.remove('active');
                prev.classList.add('completed');
            }

            // Mark current as active
            const current = document.getElementById(step.id);
            current.classList.add('active');
            statusEl.textContent = step.status;

            currentIdx++;
        } else {
            clearInterval(interval);
            // Final step active
            const last = document.getElementById(steps[steps.length-1].id);
            last.classList.remove('active');
            last.classList.add('completed');
            
            statusEl.textContent = "Awaiting final response from Scalera AI...";
            generateFromBackend(chatHistoryStr);
        }
    }, 2500); // Slower for better visual impact
}

// ─────────────────────────────────────────────────
// Backend API call (Generate)
// ─────────────────────────────────────────────────
async function generateFromBackend(chatHistoryStr) {
    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_history: chatHistoryStr
            })
        });
        const data = await response.json();
        if (data.status === 'success') {
            generatedHTML = data.html || '';
            generatedCSS  = data.css  || '';
            generatedJS   = data.js   || '';
            showResult();
        } else {
            showResult('<h3 style="padding:2rem;color:red">Generation failed. Please try again.</h3>', '', '');
        }
    } catch (e) {
        console.error(e);
        showResult("<h3 style='padding: 2rem; color: red;'>Error generating website. Is the Python backend running?</h3>", '', '');
    }
}

// ─────────────────────────────────────────────────
// Build composite HTML for preview / new tab
// ─────────────────────────────────────────────────
function buildCompositeHTML(html, css, js) {
    if (html.trim().toLowerCase().startsWith('<!doctype') || html.trim().startsWith('<html')) {
        let composite = html
            .replace(/<link[^>]+href=["']styles\.css["'][^>]*>/gi, `<style>\n${css}\n</style>`)
            .replace(/<script[^>]+src=["']script\.js["'][^>]*><\/script>/gi, `<script>\n${js}\n</script>`);
        return composite;
    }
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Scalera Generated Site</title>
<style>
${css}
</style>
</head>
<body>
${html}
<script>
${js}
</script>
</body>
</html>`;
}

// ─────────────────────────────────────────────────
// Show result in iframe
// ─────────────────────────────────────────────────
function showResult(htmlOverride, cssOverride, jsOverride) {
    const html = htmlOverride !== undefined ? htmlOverride : generatedHTML;
    const css  = cssOverride  !== undefined ? cssOverride  : generatedCSS;
    const js   = jsOverride   !== undefined ? jsOverride   : generatedJS;

    aiGeneratingBox.style.display = 'none';
    aiResultBox.style.display = 'flex';

    // Try to extract a name from conversation if possible, else generic
    let inferredName = 'yourbrand';
    const nameMatch = messages.find(m => m.role === 'user');
    if (nameMatch && nameMatch.content.length < 20) inferredName = nameMatch.content;
    
    const domainEl = document.getElementById('mockup-domain');
    domainEl.textContent = inferredName.toLowerCase().replace(/[^a-z0-9]/g, '');

    compositeHTML = buildCompositeHTML(html, css, js);

    const mockupContent = document.getElementById('mockup-content');
    mockupContent.innerHTML = '';

    const iframe = document.createElement('iframe');
    iframe.id = 'preview-iframe';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    mockupContent.appendChild(iframe);

    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(compositeHTML);
    iframe.contentWindow.document.close();
}

// ─────────────────────────────────────────────────
// Open in New Tab
// ─────────────────────────────────────────────────
function openInNewTab() {
    if (!compositeHTML) { alert("No website generated yet."); return; }
    const blob = new Blob([compositeHTML], { type: 'text/html' });
    const url  = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 10000);
}

// ─────────────────────────────────────────────────
// Toggle Fullscreen on the iframe
// ─────────────────────────────────────────────────
function toggleFullscreen() {
    const iframe = document.getElementById('preview-iframe');
    if (!iframe) { alert("No preview available yet."); return; }

    const el = iframe.closest('#mockup-window') || iframe;
    if (!document.fullscreenElement) {
        (el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen).call(el);
    } else {
        (document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen).call(document);
    }
}

// ─────────────────────────────────────────────────
// Download — 3-file ZIP
// ─────────────────────────────────────────────────
async function downloadWebsitePackage() {
    if (!window.JSZip) {
        alert("JSZip library is still loading. Please try again in a moment.");
        return;
    }
    if (!generatedHTML) {
        alert("No website generated yet.");
        return;
    }

    const zip = new JSZip();
    let inferredName = 'website';
    const nameMatch = messages.find(m => m.role === 'user');
    if (nameMatch && nameMatch.content.length < 20) inferredName = nameMatch.content;
    const safeName = inferredName.toLowerCase().replace(/[^a-z0-9]/g, '-');

    let htmlFile = generatedHTML;
    if (!htmlFile.includes('styles.css')) {
        htmlFile = htmlFile.replace('</head>', '  <link rel="stylesheet" href="styles.css">\n</head>');
    }
    if (!htmlFile.includes('script.js')) {
        htmlFile = htmlFile.replace('</body>', '  <script src="script.js"></script>\n</body>');
    }

    zip.file("index.html", htmlFile);
    zip.file("styles.css", generatedCSS || '/* No CSS was generated */');
    zip.file("script.js",  generatedJS  || '// No JavaScript was generated');
    zip.file("README.md",
`# ${inferredName}
Generated by Scalera AI.

## Project Structure
- \`index.html\` — Main HTML structure
- \`styles.css\` — All CSS styles, animations, and responsive layout
- \`script.js\`  — All JavaScript: scroll effects, animations, interactions

## Getting Started
Open \`index.html\` in your browser to view your website.

For a live server, run:
\`\`\`
npx serve .
\`\`\`
`);

    try {
        const content = await zip.generateAsync({ type: "blob" });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = `${safeName}-scalera-ai.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(link.href), 5000);
    } catch (e) {
        console.error("Error generating zip:", e);
        alert("Failed to create zip package.");
    }
}

// ─────────────────────────────────────────────────
// Desktop / Mobile preview toggle
// ─────────────────────────────────────────────────
function setPreviewMode(mode) {
    const windowEl  = document.getElementById('mockup-window');
    const btnDesktop = document.getElementById('btn-desktop');
    const btnMobile  = document.getElementById('btn-mobile');

    if (mode === 'desktop') {
        windowEl.style.width = '100%';
        btnDesktop.style.opacity = '1';
        btnDesktop.style.borderColor = 'var(--accent-color)';
        btnDesktop.style.color = 'var(--accent-color)';
        btnMobile.style.opacity = '0.6';
        btnMobile.style.borderColor = 'transparent';
        btnMobile.style.color = 'inherit';
    } else {
        windowEl.style.width = '375px';
        btnMobile.style.opacity = '1';
        btnMobile.style.borderColor = 'var(--accent-color)';
        btnMobile.style.color = 'var(--accent-color)';
        btnDesktop.style.opacity = '0.6';
        btnDesktop.style.borderColor = 'transparent';
        btnDesktop.style.color = 'inherit';
    }
}

// ─────────────────────────────────────────────────
// Image Manager Logic
// ─────────────────────────────────────────────────
let scannedImages = [];

function openImageManager() {
    const modal = document.getElementById('image-manager-modal');
    modal.style.display = 'flex';
    scanImages();
}

function closeImageManager() {
    const modal = document.getElementById('image-manager-modal');
    modal.style.display = 'none';
}

function scanImages() {
    const listContainer = document.getElementById('image-manager-list');
    listContainer.innerHTML = '';
    
    const iframe = document.getElementById('preview-iframe');
    if (!iframe || !iframe.contentWindow) {
        listContainer.innerHTML = '<div class="text-center" style="padding: 2rem; color: var(--text-muted);">Website preview not found.</div>';
        return;
    }
    
    const doc = iframe.contentWindow.document;
    const images = doc.querySelectorAll('img');
    
    if (images.length === 0) {
        listContainer.innerHTML = '<div class="text-center" style="padding: 2rem; color: var(--text-muted);">No images found in this layout.</div>';
        return;
    }
    
    scannedImages = Array.from(images);
    
    scannedImages.forEach((img, index) => {
        // Try to guess context based on alt tag or parent classes
        let sectionName = "General Section";
        const altText = img.alt || "";
        const parentId = img.closest('section, header, div[id]')?.id || "";
        
        if (altText) {
            sectionName = altText;
        } else if (parentId) {
            sectionName = parentId.charAt(0).toUpperCase() + parentId.slice(1) + " Image";
        } else if (index === 0) {
            sectionName = "Hero Image";
        }
        
        const item = document.createElement('div');
        item.className = 'image-item';
        item.innerHTML = `
            <img src="${img.src}" class="image-preview-thumb" id="thumb-${index}">
            <div class="image-info">
                <h4>${sectionName}</h4>
                <p>Suggested format: JPG/PNG/WebP</p>
            </div>
            <div class="image-upload-wrapper">
                <button class="btn-upload-small">Replace</button>
                <input type="file" class="image-upload-input" accept="image/png, image/jpeg, image/webp" data-index="${index}" onchange="handleImageUpload(event)">
            </div>
        `;
        listContainer.appendChild(item);
    });
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    const index = event.target.getAttribute('data-index');
    
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const dataUrl = e.target.result;
        
        // Update the thumbnail in the modal
        document.getElementById(`thumb-${index}`).src = dataUrl;
        
        // Update the actual image inside the iframe!
        const targetImg = scannedImages[index];
        if (targetImg) {
            targetImg.src = dataUrl;
            
            // Re-render compositeHTML if they download source code later
            // We need to fetch the updated HTML from the iframe
            const iframe = document.getElementById('preview-iframe');
            if (iframe && iframe.contentWindow) {
                const doc = iframe.contentWindow.document;
                // Just update the src attribute in the raw DOM
                // When we download the source code, we use `compositeHTML` variable,
                // so we should ideally update it, but `compositeHTML` includes CSS and JS inline.
                // For simplicity, we can serialize the current iframe DOM body and update compositeHTML.
                // A better approach is fetching the updated outerHTML of the html tag.
                compositeHTML = "<!DOCTYPE html>\n" + doc.documentElement.outerHTML;
            }
        }
    };
    reader.readAsDataURL(file);
}

// ─────────────────────────────────────────────────
// AI Editor Logic
// ─────────────────────────────────────────────────
let editorHistory = []; // to store undo states
let pendingEdit = null; // {html, css}

function openAIEditor() {
    document.getElementById('ai-editor-panel').style.display = 'flex';
}

function closeAIEditor() {
    document.getElementById('ai-editor-panel').style.display = 'none';
}

function submitAIEdit(prompt) {
    document.getElementById('ai-editor-input').value = prompt;
    handleAIEditSubmit();
}

async function handleAIEditSubmit() {
    const inputEl = document.getElementById('ai-editor-input');
    const prompt = inputEl.value.trim();
    if (!prompt) return;
    
    // Add user message to chat
    appendEditorMessage(prompt, 'user');
    inputEl.value = '';
    
    // Show loading state
    appendEditorMessage("Analyzing your request and generating updates...", 'assistant', true);
    
    // Hide suggestions
    document.getElementById('ai-editor-suggestions').style.display = 'none';
    
    try {
        const response = await fetch('/api/edit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                html: generatedHTML,
                css: generatedCSS,
                prompt: prompt
            })
        });
        
        const data = await response.json();
        
        // Remove loading message
        removeLoadingEditorMessage();
        
        if (data.status === 'success' && data.html) {
            appendEditorMessage("I've made the changes! You can preview them now.", 'assistant');
            
            // Save current state to history
            editorHistory.push({ html: generatedHTML, css: generatedCSS, js: generatedJS });
            
            // Store pending edit
            pendingEdit = { html: data.html, css: data.css };
            
            // Show preview
            updateIframePreview(data.html, data.css, generatedJS);
            
            // Show confirm dialog
            document.getElementById('ai-editor-confirm').style.display = 'block';
            
        } else {
            appendEditorMessage("Sorry, I couldn't process that edit right now.", 'assistant');
        }
    } catch (e) {
        removeLoadingEditorMessage();
        appendEditorMessage("Connection error while trying to edit.", 'assistant');
        console.error(e);
    }
}

function updateIframePreview(html, css, js) {
    const tempComposite = buildCompositeHTML(html, css, js);
    const iframe = document.getElementById('preview-iframe');
    if (iframe) {
        iframe.contentWindow.document.open();
        iframe.contentWindow.document.write(tempComposite);
        iframe.contentWindow.document.close();
    }
}

function applyAIEdit() {
    if (!pendingEdit) return;
    
    // Make changes permanent
    generatedHTML = pendingEdit.html;
    generatedCSS = pendingEdit.css;
    compositeHTML = buildCompositeHTML(generatedHTML, generatedCSS, generatedJS);
    
    pendingEdit = null;
    document.getElementById('ai-editor-confirm').style.display = 'none';
    appendEditorMessage("Changes applied successfully!", 'assistant');
}

function discardAIEdit() {
    if (editorHistory.length === 0) return;
    
    // Revert to last state
    const lastState = editorHistory.pop();
    generatedHTML = lastState.html;
    generatedCSS = lastState.css;
    
    updateIframePreview(generatedHTML, generatedCSS, generatedJS);
    
    pendingEdit = null;
    document.getElementById('ai-editor-confirm').style.display = 'none';
    appendEditorMessage("Changes discarded. We're back to the previous version.", 'assistant');
}

function appendEditorMessage(text, role, isLoading = false) {
    const chat = document.getElementById('ai-editor-chat');
    const msg = document.createElement('div');
    msg.className = `editor-message ${role}`;
    if (isLoading) msg.id = 'editor-loading-msg';
    
    msg.innerHTML = `<p>${text}</p>`;
    chat.appendChild(msg);
    chat.scrollTop = chat.scrollHeight;
}

function removeLoadingEditorMessage() {
    const loadingMsg = document.getElementById('editor-loading-msg');
    if (loadingMsg) loadingMsg.remove();
}
