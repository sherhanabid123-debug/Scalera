from groq import Groq
import re
import os
import json
from dotenv import load_dotenv
import g4f

load_dotenv()

# ──────────────────────────────────────────────
# API Keys
# ──────────────────────────────────────────────
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()

if not GROQ_API_KEY:
    print("[Scalera AI] ⚠️ WARNING: GROQ_API_KEY not found.")
else:
    print(f"[Scalera AI] ✅ GROQ_API_KEY loaded (Starts with: {GROQ_API_KEY[:4]}...)")

# ──────────────────────────────────────────────
# Clients
# ──────────────────────────────────────────────
# groq_client removed to avoid event loop issues


# ──────────────────────────────────────────────
# Template Router — picks the best template folder
# ──────────────────────────────────────────────
async def _route_template(chat_history: str) -> str:
    """Uses Groq to pick the best matching template folder for the user's request."""
    templates_dir = os.path.join(os.path.dirname(__file__), "..", "templates")
    if not os.path.exists(templates_dir):
        os.makedirs(templates_dir, exist_ok=True)

    subfolders = [
        f.name
        for f in os.scandir(templates_dir)
        if f.is_dir()
        and os.path.exists(os.path.join(templates_dir, f.name, "index.html"))
    ]

    if not subfolders:
        print("[Router] No template folders found!")
        return ""

    print(f"[Router] Available templates: {subfolders}")

    all_templates = [
        'agency', 'construction', 'corporate', 'dental-clinic', 'ecommerce',
        'education', 'event-planner', 'fitness', 'healthcare', 'hotel',
        'law-firm', 'mobile-app', 'non-profit', 'photography', 'portfolio',
        'real-estate', 'restaurant', 'saas', 'sherhan_portfolio', 'spa', 'startup'
    ]
    # Use the union of discovered subfolders and the known full list
    combined = sorted(set(subfolders) | set(all_templates))

    prompt = f"""You are a template router. Based on the conversation below, pick the SINGLE BEST template folder. 
Available: {', '.join(combined)}

GUIDANCE: 
- For premium, dark, or minimalist personal portfolios, prefer 'sherhan_portfolio'.
- For standard portfolios, use 'portfolio' or 'photography'.
- For business/corporate sites, use 'corporate' or 'agency'.
- For SaaS or tech startups, use 'saas' or 'startup'.
- For restaurants or cafes, use 'restaurant'.
- For fitness or gyms, use 'fitness'.
- For medical or dental, use 'healthcare' or 'dental-clinic'.
- For legal services, use 'law-firm'.
- For hotels or hospitality, use 'hotel' or 'spa'.
- For online stores, use 'ecommerce'.
- For schools or courses, use 'education'.
- For events or weddings, use 'event-planner'.
- For charities, use 'non-profit'.
- For construction or contractors, use 'construction'.
- For real estate or property, use 'real-estate'.
- For mobile app landing pages, use 'mobile-app'.

Conversation:
{chat_history}

Reply with ONLY the folder name, nothing else. Example: sherhan_portfolio"""

    try:
        client = Groq(api_key=GROQ_API_KEY)
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=20,
            temperature=0.0,
        )
        choice = response.choices[0].message.content.strip().lower()
        # Clean any extra text — just take the first word that matches
        for folder in subfolders:
            if folder in choice:
                print(f"[Router] Matched: {folder}")
                return folder

        # If no exact match, try partial match
        for folder in subfolders:
            if folder.replace("-", "") in choice.replace("-", ""):
                print(f"[Router] Partial match: {folder}")
                return folder

        print(f"[Router] No match found in '{choice}', defaulting to {subfolders[0]}")
        return subfolders[0]

    except Exception as e:
        print(f"[Router] Error: {e} — defaulting to {subfolders[0]}")
        return subfolders[0]


# ──────────────────────────────────────────────
# Template Loader — reads the actual files
# ──────────────────────────────────────────────
def _read_template(folder_name: str) -> dict:
    """Reads index.html, styles.css, and script.js from the given template folder."""
    templates_dir = os.path.join(os.path.dirname(__file__), "..", "templates")
    folder_path = os.path.join(templates_dir, folder_name)

    result = {"html": "", "css": "", "js": ""}
    for filename, key in [
        ("index.html", "html"),
        ("styles.css", "css"),
        ("script.js", "js"),
    ]:
        filepath = os.path.join(folder_path, filename)
        if os.path.exists(filepath):
            try:
                with open(filepath, "r", encoding="utf-8") as f:
                    result[key] = f.read()
            except Exception as e:
                print(f"[Loader] Error reading {filepath}: {e}")

    return result


# ──────────────────────────────────────────────
# Personalisation — Full deep text rewrite via Groq
# ──────────────────────────────────────────────
async def _personalise_template(html: str, chat_history: str) -> str:
    """
    Rewrites the HTML template using Groq for high-fidelity data injection.
    """
    # Construct the instruction
    instruction = f"""You are a luxury website content architect. Rewrite the text content of this HTML template to match the user's data.

PRIME DIRECTIVE:
Your priority #1 is to actively ALTER ALL TEXT on the website. Based on the chat history performed by the user, you MUST ADD CONTENT ON YOUR OWN as a premium AI. Even if the user provided minimal data, you must infer their niche, tone, and generate persuasive, high-end copywriting for EVERY section (Hero, About, Services, Features, Testimonials, Footer, etc.). Do not leave any original generic placeholder text (e.g. "Lorem ipsum", "Your Business", "Company Name").

CRITICAL: You MUST use the existing template layout and structure. ONLY change text features, content, and very few minor UI features (like duplicating existing cards/lists). Do NOT invent new sections or alter the core design architecture.
ONLY the text on the website is supposed to be changed by you. You must NOT change HTML tags, class attributes, id attributes, or structural styling.
The 'business_name' in the data is your BRAND ANCHOR. Use it for the Logo, Hero Headline, and Footer.

USER DATA & REQUIREMENTS:
{chat_history}

MAPPING RULES:
1. HERO: Headline = 'full_name' or 'business_name', Subtitle = 'professional_title' (or 'business_type'). Add a persuasive 2-sentence hook based on their niche.
2. ABOUT/BIO: Use 'bio' or 'description'. If short, expand it into professional, high-end copy spanning multiple paragraphs.
3. EXPERIENCE/SERVICES/FEATURES: Map each item to a card or list item. Invent premium service descriptions if they only provided basic bullet points.
4. SOCIAL PROOF: If 'rating' exists, mention it (e.g., "Top Rated Business"). Invent realistic, niche-appropriate testimonial quotes if the template has a testimonial section.
5. CONTACT: Use the provided address/email in the footer and contact sections. 

STRICT TECHNICAL RULES:
- Output ONLY the raw HTML starting with <!DOCTYPE html>.
- PRESERVE all classes, IDs, structural tags, script links, stylesheet links, and existing structure exactly. Do NOT change them.
- You MUST preserve the <link rel="stylesheet" href="styles.css"> and <script src="script.js"></script> tags exactly. Do not alter their attributes or remove them.
- Do NOT inject any custom styles, <style> blocks, or inline styles.
- Do NOT use any external CSS frameworks. Rely entirely on the pre-existing stylesheet referenced by the template.
- REPEATING ELEMENTS: If the template has repeating elements (like 'Experience cards' or 'Service blocks'), you MUST duplicate or remove them to match the number of items in the user's data, without changing the underlying UI structure.
- If data is provided, the original template text MUST be completely replaced.

TEMPLATE TO REWRITE:
{html}"""

    # Use Groq llama-3.1-8b-instant to avoid TPM rate limits
    try:
        print(
            "[Personalise] Customising template text using Groq (llama-3.1-8b-instant)..."
        )
        client = Groq(api_key=GROQ_API_KEY)
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": instruction}],
            max_tokens=8192,
            temperature=0.5,
        )
        result_html = response.choices[0].message.content.strip()

        if result_html.startswith("```"):
            result_html = re.sub(r"^```[a-z]*\n?", "", result_html)
            result_html = re.sub(r"\n?```$", "", result_html)

        if "<html" in result_html.lower() and "<nav" in result_html:
            print(
                f"[Personalise] ✅ Personalisation successful ({len(result_html)} bytes)"
            )
            return result_html
        else:
            print(
                "[Personalise] ⚠️ Personalised output invalid, returning template as-is"
            )

    except Exception as e:
        print(f"[Personalise] Groq personalisation failed: {e}")

    # ── Last resort: return the template with no personalisation ──
    print("[Personalise] Returning raw template (no text changes)")
    return html


# ──────────────────────────────────────────────
# Main Generation Entry Point
# ──────────────────────────────────────────────
async def generate_website(chat_history: str, data: dict = None) -> dict:
    """
    Generates a premium website from niche-specific templates:
    1. Routes to the best matching premium template folder based on user niche.
    2. Loads index.html, styles.css, and script.js from the selected template.
    3. Personalises the copy in index.html based on the conversation log using Groq.
    4. Appends glassmorphic in-context AI editing styles to the CSS, and reveal/message handlers to the JS.
    5. Returns the personalized HTML, updated CSS, and updated JS.
    """
    # 1. Ensure we have data dictionary
    if not data:
        data = {}

    # 2. Route to the best premium template folder based on user niche
    folder_name = await _route_template(chat_history)
    print(f"[Generator] 🛠️ Routed to premium template: {folder_name}")

    # 3. Read template files
    template_data = _read_template(folder_name)
    html_content = template_data.get("html", "")
    css_content = template_data.get("css", "")
    js_content = template_data.get("js", "")

    if not html_content:
        # Fallback to corporate if directory is empty or read failed
        print(
            f"[Generator] ⚠️ Template {folder_name} empty or missing, falling back to corporate."
        )
        template_data = _read_template("corporate")
        html_content = template_data.get("html", "")
        css_content = template_data.get("css", "")
        js_content = template_data.get("js", "")

    # 4. Final text rewrite via LLM personalisation (done on clean HTML)
    personalisation_prompt = f"""
    BUSINESS_NAME: {data.get('business_name') or 'Generic Business'}
    SITE_TYPE: {data.get('site_type') or 'Professional Business'}
    BIO: {data.get('bio') or data.get('description') or ''}
    TONE: {data.get('tone') or 'Premium & Elegant'}
    LOCATION: {data.get('address') or ''}
    RATING: {data.get('rating') or ''}
    
    ORIGINAL CONTEXT:
    {chat_history}
    """

    personalized_html = await _personalise_template(html_content, personalisation_prompt)

    # 5. Build full CSS (template CSS + standard CSS for the in-context editing hooks)
    full_css = css_content + "\n" + """
    /* In-Context Editor Styles */
    .editable-section { position: relative; transition: all 0.3s ease; }
    .editable-section:hover { box-shadow: inset 0 0 50px rgba(220, 180, 128, 0.05); }
    .editable-section::after { 
        content: ''; position: absolute; inset: 0; 
        border: 1px solid transparent; border-radius: 12px; 
        pointer-events: none; transition: border-color 0.3s ease; 
    }
    .editable-section:hover::after { border-color: rgba(220, 180, 128, 0.2); }
    
    .ai-edit-trigger {
        position: absolute; top: 20px; right: 20px;
        z-index: 1000; padding: 8px 16px;
        background: rgba(220, 180, 128, 0.15);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(220, 180, 128, 0.3);
        border-radius: 100px; color: #fff;
        font-size: 0.75rem; font-weight: 600;
        cursor: pointer; opacity: 0; transform: translateY(-10px);
        transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
        display: flex; align-items: center; gap: 6px;
    }
    .editable-section:hover .ai-edit-trigger { opacity: 1; transform: translateY(0); }
    .ai-edit-trigger:hover { background: #dcb480; color: #000; box-shadow: 0 0 20px rgba(220, 180, 128, 0.4); }
    """

    # 6. Build full JS (template JS + JS scripts for scrolling reveal animations & postMessage event handlers)
    full_js = js_content + "\n" + """
    document.addEventListener('DOMContentLoaded', () => {
        // Reveal Animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

        // Inject Edit Buttons into major block-level containers or sections
        const blockElements = document.querySelectorAll('header, section, footer, .hero, .features, .pricing, .about, .contact, .services');
        blockElements.forEach((section, idx) => {
            if (section.id || section.className) {
                section.classList.add('editable-section');
                if (!section.id) {
                    section.id = `section-block-${idx}`;
                }
                section.setAttribute('data-type', section.tagName.toLowerCase());
                
                const btn = document.createElement('button');
                btn.className = 'ai-edit-trigger';
                btn.type = 'button';
                btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg> Edit with AI`;
                btn.onclick = (e) => {
                    e.stopPropagation();
                    window.parent.postMessage({
                        type: 'OPEN_AI_EDITOR',
                        sectionId: section.id,
                        sectionType: section.tagName.toLowerCase(),
                        content: section.innerHTML
                    }, '*');
                };
                section.appendChild(btn);
            }
        });

        // Listen for section updates from Parent (Scalera AI)
        window.addEventListener('message', (event) => {
            if (event.data.type === 'UPDATE_SECTION_HTML') {
                const section = document.getElementById(event.data.sectionId);
                if (section) {
                    section.style.opacity = '0';
                    setTimeout(() => {
                        section.innerHTML = event.data.newHtml;
                        // Re-inject edit button
                        const btn = document.createElement('button');
                        btn.className = 'ai-edit-trigger';
                        btn.type = 'button';
                        btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg> Edit with AI`;
                        btn.onclick = (e) => {
                            e.stopPropagation();
                            window.parent.postMessage({
                                type: 'OPEN_AI_EDITOR',
                                sectionId: section.id,
                                sectionType: section.tagName.toLowerCase(),
                                content: section.innerHTML
                            }, '*');
                        };
                        section.appendChild(btn);
                        section.style.opacity = '1';
                    }, 300);
                }
            }
        });
    });
    """

    print(
        f"[Generator] ✅ Premium Website generated successfully from template '{folder_name}'."
    )
    return {
        "html": personalized_html,
        "css": full_css,
        "js": full_js
    }


# ──────────────────────────────────────────────
# Chat function (Refactored to use Groq Client)
# ──────────────────────────────────────────────
async def chat_with_ai(messages: list) -> dict:
    """
    Converses with the user to figure out what kind of website they want to build.
    Returns a dict with 'reply' and 'ready_to_generate' flag.
    """
    system_prompt = {
        "role": "system",
        "content": """You are Scalera AI, a premium and friendly conversational assistant for a high-end website builder. 
        
        Your tone should be expert, welcoming, and intuitive. 
        - Acknowledge greetings! If the user says "hi", "hello", or "hey", respond with a warm greeting before diving into questions.
        - Your ultimate goal is to identify:
            1. Business Name
            2. Industry/Niche
            3. Design Style (e.g., minimalist, bold, dark, elegant)
            
        Be conversational but don't waste time. Ask one question at a time.
        
        CRITICAL: You must return your response in a JSON format like this:
        {
          "reply": "Your conversational response here",
          "ready_to_generate": true/false,
          "website_type": "portfolio" | "business" | "restaurant" | "other",
          "detected_niche": "string or null",
          "suggested_template": "string or null"
        }
        
        Set "ready_to_generate" to true ONLY if you have identified all key pieces of information. 
        Set "website_type" based on the user's niche. If they want a portfolio or personal site, set it to "portfolio".
        
        When you have enough context to determine the user's business niche/industry, set "detected_niche" to a short label (e.g. "dental clinic", "SaaS", "restaurant").
        When you can map the niche to one of the available templates, set "suggested_template" to the closest template name from this list:
        agency, construction, corporate, dental-clinic, ecommerce, education, event-planner, fitness, healthcare, hotel, law-firm, mobile-app, non-profit, photography, portfolio, real-estate, restaurant, saas, spa, startup.
        If you don't have enough information yet, set both fields to null.""",
    }

    formatted_messages = [system_prompt] + messages

    try:
        from g4f.Provider import PollinationsAI
        print("[Scalera AI] Querying keyless assistant (g4f PollinationsAI)...")
        response = await g4f.ChatCompletion.create_async(
            model="openai",
            provider=PollinationsAI,
            messages=formatted_messages,
        )
        
        # Clean markdown code blocks from response
        clean_content = response.strip()
        if clean_content.startswith("```"):
            clean_content = re.sub(r"^```[a-z]*\n?", "", clean_content)
            clean_content = re.sub(r"\n?```$", "", clean_content)
        return json.loads(clean_content)
        
    except Exception as e:
        print(f"[Scalera AI] Keyless assistant error: {e}. Falling back to Groq...")
        if not GROQ_API_KEY or GROQ_API_KEY == "PASTE_YOUR_GROQ_KEY_HERE":
            return {
                "reply": f"Assistant Error: {str(e)}. (Also GROQ_API_KEY is missing, please configure it in .env for fallback).",
                "ready_to_generate": False,
            }
        
        try:
            client = Groq(api_key=GROQ_API_KEY)
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=formatted_messages,
                max_tokens=512,
                temperature=0.7,
                response_format={"type": "json_object"},
            )
            raw_content = response.choices[0].message.content
            return json.loads(raw_content)
        except Exception as groq_err:
            return {
                "reply": f"API Errors: Free Assistant: {str(e)} | Groq: {str(groq_err)}",
                "ready_to_generate": False,
            }


# ──────────────────────────────────────────────
# AI Editor — Targeted updates
# ──────────────────────────────────────────────
async def edit_website(html: str, css: str, prompt: str) -> dict:
    """
    Takes the current HTML/CSS and a user's natural language edit prompt,
    and returns the modified HTML (text only changed) and unchanged CSS.
    """
    system_msg = """You are Scalera AI, a surgical text editor.
Your task is to modify the text content in the provided HTML based on the user's prompt.

SURGICAL RULES:
1. ONLY change the specific text content (e.g. text inside tags, headings, paragraphs, button labels, list items) mentioned by the user.
2. DO NOT change, add, or remove any HTML tags, structures, class names, or IDs.
3. DO NOT change the CSS rules or layout.
4. KEEP all existing classes, IDs, structure, scripts, and styling links perfectly intact.
5. Return the FULL updated HTML code. The CSS value in your JSON reply should just be an empty string, as you are not allowed to edit CSS."""

    user_msg = f"""
[HTML]
{html}
[/HTML]

[USER REQUEST]
{prompt}

Return a JSON object: {{"html": "...", "css": ""}}
"""

    if not GROQ_API_KEY or GROQ_API_KEY == "PASTE_YOUR_GROQ_KEY_HERE":
        return {"html": html, "css": css}

    try:
        print("[AI Editor] Surgical text edit using Groq (llama-3.3-70b-versatile)...")
        client = Groq(api_key=GROQ_API_KEY)
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_msg},
                {"role": "user", "content": user_msg},
            ],
            response_format={"type": "json_object"},
            temperature=0.2,
        )
        raw_content = response.choices[0].message.content
        parsed = json.loads(raw_content)
        return {
            "html": parsed.get("html", html),
            "css": css,  # Keep original CSS completely intact
        }
    except Exception as e:
        print(f"[AI Editor] Error: {e}")
        return {"html": html, "css": css}


# ──────────────────────────────────────────────
# Data Extraction — Resume & Links
# ──────────────────────────────────────────────
async def extract_data_from_resume(content: bytes, filename: str) -> dict:
    """Extracts text from PDF/DOCX and uses Groq to structure it."""
    print(f"[Extractor] Processing file: {filename} ({len(content)} bytes)")
    text = ""
    ext = filename.lower().split(".")[-1]

    import io

    try:
        if ext == "pdf":
            from pypdf import PdfReader

            reader = PdfReader(io.BytesIO(content))
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"

        elif ext in ["docx", "doc"]:
            import mammoth

            result = mammoth.extract_raw_text(io.BytesIO(content))
            text = result.value

        else:
            text = content.decode("utf-8", errors="ignore")

    except Exception as e:
        print(f"[Extractor] Parsing Error: {e}")
        return {"error": f"Failed to parse {ext} file: {str(e)}"}

    if not text.strip():
        return {"error": "The file appears to be empty."}

    # Route to Groq-powered parser
    return await _parse_raw_text_to_json(text)


async def extract_data_from_link(link: str) -> dict:
    """Best-effort scraper for public links (LinkedIn/Portfolios) using Groq."""
    try:
        import urllib.request
        from bs4 import BeautifulSoup

        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
        }
        req = urllib.request.Request(link, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as response:
            html = response.read().decode("utf-8", errors="ignore")
            soup = BeautifulSoup(html, "html.parser")

            meta_title = soup.find("meta", property="og:title")
            meta_desc = soup.find("meta", property="og:description")

            title_text = (
                meta_title["content"]
                if meta_title
                else soup.title.string if soup.title else ""
            )
            desc_text = meta_desc["content"] if meta_desc else ""

            raw_blob = (
                f"Title: {title_text}\nDescription: {desc_text}\nSnippet: {html[:2000]}"
            )

            # Route to Groq-powered parser
            return await _parse_raw_text_to_json(raw_blob)

    except Exception as e:
        return {
            "error": "LinkedIn blocked the request. Try uploading a PDF resume instead."
        }


async def _parse_raw_text_to_json(raw_text: str, system_msg: str = None) -> dict:
    """Uses Groq to turn raw text into a structured JSON schema."""
    if not system_msg:
        system_msg = """Extract information into JSON: full_name, professional_title, bio, skills, experience, projects, education."""

    if not GROQ_API_KEY or GROQ_API_KEY == "PASTE_YOUR_GROQ_KEY_HERE":
        return {"raw_text": raw_text[:500]}

    try:
        client = Groq(api_key=GROQ_API_KEY)
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": system_msg},
                {"role": "user", "content": f"Text:\n{raw_text[:8000]}"},
            ],
            response_format={"type": "json_object"},
            temperature=0.0,
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        return {"error": str(e)}


async def extract_business_data(link: str) -> dict:
    """Robust extraction from a Google Maps link using Groq parser."""
    try:
        import urllib.request
        from bs4 import BeautifulSoup

        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
        }
        req = urllib.request.Request(link, headers=headers)

        with urllib.request.urlopen(req, timeout=10) as response:
            html = response.read().decode("utf-8", errors="ignore")
            soup = BeautifulSoup(html, "html.parser")
            meta_title = soup.find("meta", property="og:title")
            title_text = meta_title["content"] if meta_title else ""

            biz_prompt = (
                "Extract business JSON: name, type, address, rating, description."
            )
            # Route to Groq-powered parser
            return await _parse_raw_text_to_json(html[:4000], system_msg=biz_prompt)
    except Exception as e:
        return {"error": str(e)}


# ──────────────────────────────────────────────
# Vision Interpretation — Natural Language to Blueprint
# ──────────────────────────────────────────────
async def interpret_vision(description: str) -> dict:
    """Converts natural language description into a structured JSON blueprint using Groq."""
    prompt = f"""You are a website blueprint architect. Convert the user's website vision/description into a structured JSON object.

Required fields in the JSON object:
1. "business_name": A clean name for the business (infer it from the text or use "My Business" if not mentioned).
2. "site_type": The type/niche of the website (e.g., portfolio, agency, restaurant, saas, dental clinic, law-firm, etc.).
3. "tone": The design tone (e.g., luxury, modern, clean, bold, dark, minimalist).
4. "sections": A list of sections to generate (e.g., ["Hero", "About", "Services", "Testimonials", "Contact"]).

User description:
{description}

JSON:"""

    if GROQ_API_KEY and GROQ_API_KEY != "PASTE_YOUR_GROQ_KEY_HERE":
        try:
            client = Groq(api_key=GROQ_API_KEY)
            response = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful assistant that returns only a JSON object matching the requested schema.",
                    },
                    {"role": "user", "content": prompt},
                ],
                response_format={"type": "json_object"},
                temperature=0.0,
            )
            data = json.loads(response.choices[0].message.content.strip())
            if not data.get("business_name"):
                data["business_name"] = "My Business"
            if not data.get("site_type"):
                data["site_type"] = "agency"
            if not data.get("tone"):
                data["tone"] = "modern"
            if not data.get("sections"):
                data["sections"] = ["Hero", "About", "Services", "Contact"]
            return data
        except Exception as e:
            print(f"[interpret_vision] Groq failed: {e}")

    return {
        "business_name": "My Business",
        "site_type": "agency",
        "tone": "modern",
        "sections": ["Hero", "About", "Services", "Contact"],
    }


# ──────────────────────────────────────────────
# Contextual Section Editing
# ──────────────────────────────────────────────
async def edit_section_content(
    section_html: str, instruction: str, section_type: str
) -> str:
    """Rewrites the text content of a specific section of the website using Groq."""
    prompt = f"""You are a professional web developer and strict text-content editor.
Edit the text content of the following HTML section ({section_type}) based on the instruction: "{instruction}".

STRICT RULES:
1. ONLY change the text content (e.g. headings, paragraph text, buttons text, links text) to satisfy the instruction.
2. Do NOT add, remove, or modify any HTML tags, layout wrappers, CSS class names, styles, or ID attributes.
3. Keep all dynamic scripts, classes, structure, animations, and onClick/postMessage triggers exactly as they are.
4. Return ONLY the raw updated HTML without any explanation, markdown code blocks, or comments.

HTML section to edit:
{section_html}"""

    if GROQ_API_KEY and GROQ_API_KEY != "PASTE_YOUR_GROQ_KEY_HERE":
        try:
            print(
                f"[EditSection] Using Groq (llama-3.3-70b-versatile) for editing section ({section_type})..."
            )
            client = Groq(api_key=GROQ_API_KEY)
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a strict code editing assistant. You only output raw updated code without comments, Markdown code fences, or explanations.",
                    },
                    {"role": "user", "content": prompt},
                ],
                max_tokens=8192,
                temperature=0.2,
            )
            result_html = response.choices[0].message.content.strip()

            # Clean markdown code blocks if present
            if result_html.startswith("```"):
                result_html = re.sub(r"^```[a-z]*\n?", "", result_html)
                result_html = re.sub(r"\n?```$", "", result_html)

            if result_html:
                print(
                    f"[EditSection] ✅ Groq edit successful ({len(result_html)} bytes)"
                )
                return result_html
        except Exception as e:
            print(f"[EditSection] Groq failed: {e}")

    return section_html
