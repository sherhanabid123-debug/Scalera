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
            const websiteType = typeof data.reply === 'object' ? data.reply.website_type : 'other';

            const magicImportOptions = document.getElementById('magic-import-options');
            const resumeBtn = document.getElementById('magic-import-btn');
            const linkedinBtn = document.getElementById('linkedin-import-btn');
            const googleBtn = document.getElementById('google-business-btn');

            if (magicImportOptions) {
                if (websiteType === 'portfolio') {
                    magicImportOptions.style.display = 'flex';
                    resumeBtn.style.display = 'inline-flex';
                    linkedinBtn.style.display = 'inline-flex';
                    googleBtn.style.display = 'none';
                    
                    magicImportOptions.classList.remove('magic-options-appear');
                    void magicImportOptions.offsetWidth;
                    magicImportOptions.classList.add('magic-options-appear');
                } else if (['business', 'restaurant', 'service'].includes(websiteType)) {
                    magicImportOptions.style.display = 'flex';
                    resumeBtn.style.display = 'none';
                    linkedinBtn.style.display = 'none';
                    googleBtn.style.display = 'inline-flex';
                    
                    // Lock the generate button until data is fetched
                    const genBtn = document.getElementById('generate-trigger-btn');
                    if (genBtn && !extractedData) {
                        genBtn.disabled = true;
                        genBtn.style.opacity = '0.5';
                        genBtn.style.cursor = 'not-allowed';
                        genBtn.title = "Please import your Google Business details first.";
                    }

                    magicImportOptions.classList.remove('magic-options-appear');
                    void magicImportOptions.offsetWidth;
                    magicImportOptions.classList.add('magic-options-appear');
                } else {
                    magicImportOptions.style.display = 'none';
                }
            }

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
    // Allow generation if we have enough messages OR if we have extracted data (Blueprint/Resume)
    if (messages.length < 3 && !extractedData) {
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
    
    const tracker = document.querySelector('.process-tracker');
    if (tracker) tracker.classList.add('animating');

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
        console.log("[Generator] Triggering generation with Data:", extractedData);
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_history: chatHistoryStr,
                data: extractedData
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
    
    const tracker = document.querySelector('.process-tracker');
    if (tracker) tracker.classList.remove('animating');

    // Domain inference
    let inferredName = extractedData?.business_name || 'yourbrand';
    const domainEl = document.querySelector('.preview-url');
    if (domainEl) domainEl.textContent = inferredName.toLowerCase().replace(/[^a-z0-9]/g, '') + '.scalera.ai';

    compositeHTML = buildCompositeHTML(html, css, js);

    // Show in Dashboard Iframe
    const previewContainer = document.getElementById('live-preview-container');
    const previewIframe = document.getElementById('preview-iframe');
    
    if (previewContainer && previewIframe) {
        previewContainer.style.display = 'block';
        previewIframe.contentWindow.document.open();
        previewIframe.contentWindow.document.write(compositeHTML);
        previewIframe.contentWindow.document.close();
    }

    appendAIMessage("Your premium digital presence is ready! You can now edit any section directly by hovering over it in the preview. ✨");
}

// ─────────────────────────────────────────────────
// Open in New Tab
// ─────────────────────────────────────────────────
function openInNewTab() {
    if (!generatedHTML) { alert("No website generated yet."); return; }
    
    // Store in localStorage so preview.html can read it
    localStorage.setItem('scalera-preview-html', generatedHTML);
    localStorage.setItem('scalera-preview-css', generatedCSS);
    localStorage.setItem('scalera-preview-js', generatedJS);
    
    // Open the new intelligent preview page
    window.open('/preview.html', '_blank');
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
let editorHistory = []; 
let pendingEdit = null; 
let stableState = null; // To store the state before any "draft" changes are made

function openAIEditor() {
    console.log("[AI Editor] Opening Panel");
    document.getElementById('ai-editor-panel').style.display = 'flex';
    // Capture the state as "stable" before starting an edit session
    stableState = { 
        html: generatedHTML, 
        css: generatedCSS, 
        js: generatedJS 
    };
    console.log("[AI Editor] Stable state captured");
}

function closeAIEditor() {
    console.log("[AI Editor] Closing Panel");
    document.getElementById('ai-editor-panel').style.display = 'none';
    pendingEdit = null;
    document.getElementById('ai-editor-confirm').style.display = 'none';
}

function submitAIEdit(prompt) {
    document.getElementById('ai-editor-input').value = prompt;
    handleAIEditSubmit();
}

async function handleAIEditSubmit() {
    const inputEl = document.getElementById('ai-editor-input');
    const prompt = inputEl.value.trim();
    if (!prompt) return;
    
    appendEditorMessage(prompt, 'user');
    inputEl.value = '';
    appendEditorMessage("Analyzing your request and generating updates...", 'assistant', true);
    document.getElementById('ai-editor-suggestions').style.display = 'none';
    
    console.log("[AI Editor] Submitting prompt:", prompt);
    console.log("[AI Editor] Current State (pre-edit):", { htmlLen: generatedHTML.length, cssLen: generatedCSS.length });

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
        removeLoadingEditorMessage();
        
        console.log("[AI Editor] API Response received:", data.status);

        if (data.status === 'success' && data.html) {
            console.log("[AI Editor] New HTML/CSS generated successfully");
            appendEditorMessage("I've made the changes! You can preview them now.", 'assistant');
            
            // Save current state to history (for multi-step undo)
            editorHistory.push({ html: generatedHTML, css: generatedCSS, js: generatedJS });
            
            // Store pending edit
            pendingEdit = { html: data.html, css: data.css };
            
            // Show preview instantly
            updateIframePreview(data.html, data.css, generatedJS);
            
            // Show confirm dialog
            document.getElementById('ai-editor-confirm').style.display = 'block';
            
        } else {
            console.error("[AI Editor] API returned error or empty content", data);
            appendEditorMessage("Sorry, I couldn't process that edit right now. Please try a different prompt.", 'assistant');
        }
    } catch (e) {
        removeLoadingEditorMessage();
        console.error("[AI Editor] Connection Error:", e);
        appendEditorMessage("Connection error while trying to edit. Is the server running?", 'assistant');
    }
}

function updateIframePreview(html, css, js) {
    // SAFEGUARD: If html is somehow empty, fallback to stableState to prevent blank screen
    if (!html || html.length < 10) {
        console.error("[AI Editor] updateIframePreview called with invalid content, falling back.");
        if (stableState) {
            html = stableState.html;
            css = stableState.css;
            js = stableState.js;
        } else {
            return; // Nowhere to go
        }
    }

    const tempComposite = buildCompositeHTML(html, css, js);
    const iframe = document.getElementById('preview-iframe');
    if (iframe) {
        iframe.contentWindow.document.open();
        iframe.contentWindow.document.write(tempComposite);
        iframe.contentWindow.document.close();
        console.log("[AI Editor] Iframe preview updated");
    }
}

function applyAIEdit() {
    if (!pendingEdit) return;
    
    console.log("[AI Editor] Applying changes permanently");
    
    // Make changes permanent in global state
    generatedHTML = pendingEdit.html;
    generatedCSS = pendingEdit.css;
    compositeHTML = buildCompositeHTML(generatedHTML, generatedCSS, generatedJS);
    
    // After apply, the new state becomes the stable base
    stableState = { 
        html: generatedHTML, 
        css: generatedCSS, 
        js: generatedJS 
    };

    pendingEdit = null;
    document.getElementById('ai-editor-confirm').style.display = 'none';
    appendEditorMessage("Changes applied successfully!", 'assistant');
    console.log("[AI Editor] Apply complete");
}

function discardAIEdit() {
    console.log("[AI Editor] Discarding changes");
    
    // ALWAYS revert to the last stable state
    if (stableState) {
        generatedHTML = stableState.html;
        generatedCSS = stableState.css;
        generatedJS = stableState.js;
        
        updateIframePreview(generatedHTML, generatedCSS, generatedJS);
        console.log("[AI Editor] Reverted to stable state");
    } else {
        console.warn("[AI Editor] No stable state found to discard to!");
    }
    
    pendingEdit = null;
    document.getElementById('ai-editor-confirm').style.display = 'none';
    appendEditorMessage("Changes discarded. Reverted to previous version.", 'assistant');
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

// ─────────────────────────────────────────────────
// Magic Import Logic (Resume & LinkedIn)
// ─────────────────────────────────────────────────
const magicImportBtn = document.getElementById('magic-import-btn');
const resumeUpload = document.getElementById('resume-upload');
const dataReviewModal = document.getElementById('data-review-modal');
let extractedData = null;
let currentUploadedFile = null;

if (magicImportBtn) {
    magicImportBtn.addEventListener('click', () => {
        console.log("[Magic Import] Triggering file selection...");
        resumeUpload.click();
    });
}

if (resumeUpload) {
    resumeUpload.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) {
            console.warn("[Magic Import] No file selected.");
            return;
        }

        currentUploadedFile = file;
        console.log("[Magic Import] File object detected:", file);
        console.log("[Magic Import] File details:", {
            name: file.name,
            size: file.size,
            type: file.type
        });
        
        // UI Feedback: Show user what they uploaded
        appendUserMessage(`Uploaded resume: ${file.name}`);
        
        // Show Typing/Processing state
        showTypingIndicator();
        appendAIMessage(`Analyzing <strong>${file.name}</strong>. This usually takes 5-10 seconds...`);
        
        const formData = new FormData();
        formData.append('file', file);

        console.log("[Magic Import] Triggering /api/extract analysis...");
        try {
            const response = await fetch('/api/extract', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            
            console.log("[Magic Import] API Response received:", data);
            hideTypingIndicator();

            if (data.status === 'success' && data.data) {
                if (data.data.error) {
                    console.error("[Magic Import] Extraction Error:", data.data.error);
                    appendAIMessage(`<strong>Analysis Issue:</strong> ${data.data.error}. Please try another file or enter your details manually.`);
                    return;
                }
                
                extractedData = data.data;
                console.log("[Magic Import] Data extraction successful:", extractedData);
                appendAIMessage("Analysis complete! I've structured your profile data. Please review and edit it below to ensure everything looks perfect.");
                showResumeModal(extractedData);
            } else {
                console.error("[Magic Import] Analysis failed or returned invalid structure:", data);
                appendAIMessage("I'm sorry, I couldn't extract data from that file. Could you try a different format (PDF or DOCX are best)?");
            }
        } catch (err) {
            console.error("[Magic Import] Connection Error during analysis:", err);
            hideTypingIndicator();
            appendAIMessage("Connection error. Please check if the Scalera AI backend is running on port 8000.");
        }
    });
}

const linkedinBtn = document.getElementById('linkedin-import-btn');
if (linkedinBtn) {
    linkedinBtn.addEventListener('click', async () => {
        const url = prompt("Please enter your LinkedIn Profile URL:");
        if (!url) return;
        
        appendUserMessage(`Analyze LinkedIn: ${url}`);
        showTypingIndicator();
        appendAIMessage("Connecting to LinkedIn... Please note that automated extraction might be limited by profile privacy settings.");
        
        const formData = new FormData();
        formData.append('link', url);
        
        try {
            const response = await fetch('/api/extract', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            hideTypingIndicator();
            
            if (data.status === 'success' && data.data) {
                appendAIMessage("LinkedIn data detected. Since LinkedIn is protected, please ensure you paste your bio and experience in the review modal if they are missing.");
                showReviewModal(data.data);
            }
        } catch (err) {
            console.error("[LinkedIn Import] Error:", err);
            hideTypingIndicator();
            appendAIMessage("Failed to process LinkedIn URL. Please check your connection.");
        }
    });
}

// ─────────────────────────────────────────────────
// Google Business Import Logic
// ─────────────────────────────────────────────────
const googleBusinessBtn = document.getElementById('google-business-btn');
if (googleBusinessBtn) {
    googleBusinessBtn.addEventListener('click', async () => {
        const link = prompt("Please paste your Google Business / Maps link:");
        if (!link) return;
        
        appendAIMessage("Fetching your business details from Google Maps... 📍");
        
        try {
            const response = await fetch('/api/import/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ link })
            });
            const result = await response.json();
            
            if (result.status === 'success' && !result.data.error) {
                showBusinessModalExtended(result.data);
            } else {
                appendAIMessage("I couldn't fetch details for that link. You can still type your business details and I'll generate the site! 🛠️");
            }
        } catch (e) {
            console.error(e);
            appendAIMessage("Connection error. Please check your link or try again later.");
        }
    });
}


// ─────────────────────────────────────────────────
// Business & Resume Review Logic (Unified)
// ─────────────────────────────────────────────────

function showBusinessModalExtended(data) {
    const modal = document.getElementById('business-review-modal');
    if (!modal) return;
    modal.style.display = 'flex';
    document.getElementById('review-biz-name').value = data.business_name || '';
    document.getElementById('review-biz-type').value = data.business_type || '';
    document.getElementById('review-biz-desc').value = data.description || '';
    document.getElementById('review-biz-address').value = data.address || '';
    document.getElementById('review-biz-rating').value = data.rating || '';
    document.getElementById('review-biz-highlight').value = data.highlight_review || '';
}

function confirmBusinessDataAndUnlock() {
    const data = {
        business_name: document.getElementById('review-biz-name').value,
        business_type: document.getElementById('review-biz-type').value,
        description: document.getElementById('review-biz-desc').value,
        address: document.getElementById('review-biz-address').value,
        rating: document.getElementById('review-biz-rating').value,
        highlight_review: document.getElementById('review-biz-highlight').value,
        source: 'google_business'
    };
    
    extractedData = data; 
    document.getElementById('business-review-modal').style.display = 'none';

    // Unlock button
    const genBtn = document.getElementById('generate-trigger-btn');
    if (genBtn) {
        genBtn.disabled = false;
        genBtn.style.opacity = '1';
        genBtn.style.cursor = 'pointer';
        genBtn.style.boxShadow = "0 0 30px rgba(220, 180, 128, 0.6)";
    }
    appendAIMessage(`Great! I've loaded your business data for **${data.business_name}**. Click "Generate Website" to build your site with this data! 🚀`);
}

function closeBusinessModal() {
    document.getElementById('business-review-modal').style.display = 'none';
}

function showResumeModal(data) {
    const modal = document.getElementById('resume-review-modal');
    if (!modal) return;
    modal.style.display = 'flex';
    document.getElementById('review-resume-name').value = data.full_name || '';
    document.getElementById('review-resume-title').value = data.professional_title || '';
    document.getElementById('review-resume-bio').value = data.bio || '';
    document.getElementById('review-resume-skills').value = Array.isArray(data.skills) ? data.skills.join(', ') : (data.skills || '');
    
    if (Array.isArray(data.experience)) {
        const expStr = data.experience.map(e => `${e.role} at ${e.company} (${e.duration || ''}) - ${e.description || ''}`).join('\n\n');
        document.getElementById('review-resume-exp').value = expStr;
    } else {
        document.getElementById('review-resume-exp').value = data.experience || '';
    }
}

function confirmResumeData() {
    const skillsText = document.getElementById('review-resume-skills').value;
    const expText = document.getElementById('review-resume-exp').value;
    
    const data = {
        full_name: document.getElementById('review-resume-name').value,
        professional_title: document.getElementById('review-resume-title').value,
        bio: document.getElementById('review-resume-bio').value,
        skills: skillsText.split(',').map(s => s.trim()).filter(s => s),
        experience: expText,
        source: 'resume_upload'
    };
    
    extractedData = data;
    document.getElementById('resume-review-modal').style.display = 'none';
    
    const genBtn = document.getElementById('generate-trigger-btn');
    if (genBtn) {
        genBtn.disabled = false;
        genBtn.style.opacity = '1';
        genBtn.style.cursor = 'pointer';
        genBtn.style.boxShadow = "0 0 30px rgba(220, 180, 128, 0.6)";
    }
    
    appendAIMessage(`Excellent! Your profile for **${data.full_name}** is ready. Click "Generate Website" to see your professional portfolio! 🚀`);
}

function closeResumeModal() {
    document.getElementById('resume-review-modal').style.display = 'none';
}

// ─────────────────────────────────────────────────
// Vision (Natural Language) Logic
// ─────────────────────────────────────────────────
let currentVisionBlueprint = null;

function showVisionModal() {
    document.getElementById('vision-modal').style.display = 'flex';
    document.getElementById('vision-interpretation').style.display = 'none';
    document.getElementById('vision-analyze-btn').style.display = 'inline-block';
    document.getElementById('vision-confirm-btn').style.display = 'none';
    document.getElementById('vision-description').value = '';
}

function closeVisionModal() {
    document.getElementById('vision-modal').style.display = 'none';
}

async function analyzeVision() {
    const description = document.getElementById('vision-description').value;
    if (!description) {
        alert("Please describe your website first!");
        return;
    }

    const analyzeBtn = document.getElementById('vision-analyze-btn');
    analyzeBtn.innerText = "Analyzing Vision...";
    analyzeBtn.disabled = true;

    try {
        const response = await fetch('/api/interpret', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description })
        });
        const result = await response.json();

        if (result.status === 'success') {
            currentVisionBlueprint = result.data;
            
            // Show interpretation
            document.getElementById('vision-name').value = currentVisionBlueprint.business_name || '';
            document.getElementById('vision-type').value = currentVisionBlueprint.site_type || 'General';
            document.getElementById('vision-tone').value = currentVisionBlueprint.tone || 'Modern';
            
            const sectionsList = document.getElementById('vision-sections-list');
            sectionsList.innerHTML = '';
            (currentVisionBlueprint.sections || []).forEach(section => {
                const chip = document.createElement('div');
                chip.className = 'section-chip';
                chip.style = 'padding: 6px 12px; background: rgba(var(--accent-rgb), 0.1); border: 1px solid rgba(var(--accent-rgb), 0.3); border-radius: 100px; font-size: 0.8rem; color: #fff;';
                chip.innerText = section;
                sectionsList.appendChild(chip);
            });

            document.getElementById('vision-interpretation').style.display = 'block';
            
            // Toggle buttons
            analyzeBtn.style.display = 'none';
            document.getElementById('vision-confirm-btn').style.display = 'inline-block';
        }
    } catch (err) {
        console.error("Vision Analysis Error:", err);
        alert("Couldn't analyze vision. Please try again.");
    } finally {
        analyzeBtn.innerText = "Analyze & Prepare ✨";
        analyzeBtn.disabled = false;
    }
}

function confirmVision() {
    if (!currentVisionBlueprint) return;

    const bizName = document.getElementById('vision-name').value.trim();
    if (!bizName) {
        alert("Please enter a Business / Website Name to continue.");
        return;
    }

    // Capture any manual edits
    currentVisionBlueprint.business_name = bizName;
    currentVisionBlueprint.site_type = document.getElementById('vision-type').value;
    currentVisionBlueprint.tone = document.getElementById('vision-tone').value;

    // Use the blueprint as the primary data
    extractedData = {
        ...currentVisionBlueprint,
        business_name: currentVisionBlueprint.business_name,
        source: 'vision_description'
    };

    closeVisionModal();

    // Unlock button
    const genBtn = document.getElementById('generate-trigger-btn');
    if (genBtn) {
        genBtn.disabled = false;
        genBtn.style.opacity = '1';
        genBtn.style.cursor = 'pointer';
        genBtn.style.boxShadow = "0 0 30px rgba(220, 180, 128, 0.6)";
    }

    appendAIMessage(`Vision captured! I've planned a **${extractedData.tone} ${extractedData.site_type}** website for you. Click "Generate Website" to bring it to life! 🚀`);
}

// Add event listener for the vision button
document.addEventListener('DOMContentLoaded', () => {
    const visionBtn = document.getElementById('vision-import-btn');
    if (visionBtn) {
        visionBtn.addEventListener('click', showVisionModal);
    }
});

// ─────────────────────────────────────────────────
// In-Context Section Editor Logic
// ─────────────────────────────────────────────────
let currentEditingSection = null;
let originalSectionHTML = '';

// Listen for messages from the preview iframe
window.addEventListener('message', (event) => {
    if (event.data.type === 'OPEN_AI_EDITOR') {
        openSectionEditor(event.data);
    }
});

function openSectionEditor(data) {
    currentEditingSection = data;
    originalSectionHTML = data.content;
    
    document.getElementById('editing-section-type').innerText = data.sectionType.toUpperCase();
    document.getElementById('section-editor').style.display = 'block';
    document.getElementById('section-edit-prompt').value = '';
    document.getElementById('section-confirm-actions').style.display = 'none';
    document.getElementById('btn-apply-section').style.display = 'block';
}

function closeSectionEditor() {
    document.getElementById('section-editor').style.display = 'none';
}

async function applySectionEdit() {
    const prompt = document.getElementById('section-edit-prompt').value;
    if (!prompt) return;

    const loading = document.getElementById('section-edit-loading');
    const applyBtn = document.getElementById('btn-apply-section');
    
    loading.style.display = 'block';
    applyBtn.disabled = true;

    try {
        const response = await fetch('/api/edit-section', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                html: currentEditingSection.content,
                prompt: prompt,
                type: currentEditingSection.sectionType
            })
        });
        const result = await response.json();

        if (result.status === 'success') {
            // Update the iframe content dynamically
            const iframe = document.getElementById('preview-iframe');
            const sectionId = currentEditingSection.sectionId;
            
            // Execute script inside iframe to replace section
            iframe.contentWindow.postMessage({
                type: 'UPDATE_SECTION_HTML',
                sectionId: sectionId,
                newHtml: result.data
            }, '*');

            document.getElementById('section-confirm-actions').style.display = 'flex';
            applyBtn.style.display = 'none';
        }
    } catch (err) {
        console.error("Section Edit Error:", err);
        alert("Couldn't update section. Please try again.");
    } finally {
        loading.style.display = 'none';
        applyBtn.disabled = false;
    }
}

function keepSectionEdit() {
    closeSectionEditor();
    appendAIMessage(`Section updated! The changes have been applied to your live preview. 🪄`);
}

function discardSectionEdit() {
    // Tell iframe to revert
    const iframe = document.getElementById('preview-iframe');
    iframe.contentWindow.postMessage({
        type: 'UPDATE_SECTION_HTML',
        sectionId: currentEditingSection.sectionId,
        newHtml: originalSectionHTML
    }, '*');
    
    closeSectionEditor();
}

function closePreview() {
    document.getElementById('live-preview-container').style.display = 'none';
    aiChatBox.style.display = 'flex';
}
