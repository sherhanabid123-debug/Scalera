from groq import Groq
import re
import os
import json
from dotenv import load_dotenv
load_dotenv()

# ──────────────────────────────────────────────
# API Keys
# ──────────────────────────────────────────────
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()

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
        f.name for f in os.scandir(templates_dir)
        if f.is_dir() and os.path.exists(os.path.join(templates_dir, f.name, "index.html"))
    ]

    if not subfolders:
        print("[Router] No template folders found!")
        return ""

    print(f"[Router] Available templates: {subfolders}")

    prompt = f"""You are a template router. Based on the conversation below, pick the SINGLE BEST template folder. 
Available: {', '.join(subfolders)}

Conversation:
{chat_history}

Reply with ONLY the folder name, nothing else. Example: corporate"""

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
    for filename, key in [("index.html", "html"), ("styles.css", "css"), ("script.js", "js")]:
        filepath = os.path.join(folder_path, filename)
        if os.path.exists(filepath):
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    result[key] = f.read()
            except Exception as e:
                print(f"[Loader] Error reading {filepath}: {e}")

    return result


# ──────────────────────────────────────────────
# Personalisation — Full deep text rewrite via Groq
# ──────────────────────────────────────────────
async def _personalise_template(template: dict, chat_history: str) -> dict:
    """
    Sends the full HTML to Groq and asks it to rewrite ALL visible text content
    to match the user's business. Structure, tags, classes, IDs, CSS, and JS
    are strictly preserved — only the human-readable text changes.
    """

    html = template["html"]

    prompt = f"""You are an expert website content writer. Your job is to take an existing HTML template and rewrite ALL the visible text content so it perfectly matches the user's requirements and personal data described below.

═══════════════════════════════════════════
USER'S BUSINESS & PERSONAL DATA:
═══════════════════════════════════════════
{chat_history}

═══════════════════════════════════════════
MAPPING INSTRUCTIONS (PRIORITY):
═══════════════════════════════════════════
If structured "User Data" (JSON) is provided in the requirements above:
1. BRANDING: Use 'full_name' for EVERY instance of the company name, logo text, or personal brand.
2. HERO SECTION: 
   - Headline <h1>: Use 'full_name'.
   - Sub-headline/Intro: Use 'professional_title' and a snippet of 'bio'.
3. ABOUT SECTION: 
   - Description: Use the 'bio' or 'summary'. If short, expand it slightly but keep the core facts.
4. SERVICES/SKILLS SECTION: 
   - Replace generic service names with items from the 'skills' list.
   - Match the number of skills to the number of service blocks available.
5. EXPERIENCE/PORTFOLIO SECTION: 
   - Map 'experience' items (company, title, description) to the template's project or work sections.
   - If the template has a "Testimonials" section, you can repurpose it to show career highlights or roles if appropriate.
6. CONTACT: Use the provided email, phone, or location.

STRICT RULE: Priority 1 is ACCURACY to the User Data. Priority 2 is the Creative Tone. Do NOT invent a fake business name like "Creative Agency" if 'full_name' is available.

═══════════════════════════════════════════
RULES — READ CAREFULLY:
═══════════════════════════════════════════

1. REWRITE ALL VISIBLE TEXT to match the user's business. This includes:
   - Page <title> and <meta description>
   - Logo / brand name text
   - ALL headings (h1, h2, h3, h4)
   - ALL paragraphs, descriptions, and body text
   - ALL button and link text (e.g. "Get a Quote →", "Learn More →")
   - ALL service/feature names and descriptions
   - ALL testimonial quotes, author names, and titles
   - ALL stats/numbers and their labels
   - ALL form labels and placeholder text
   - ALL footer text, addresses, phone numbers, emails
   - Navigation link text if appropriate for the business

2. STRUCTURE IS SACRED — DO NOT CHANGE any of these:
   - HTML tags (do not add, remove, or modify any tags)
   - CSS classes, IDs, or any HTML attributes (these are the "hooks" for the design)
   - The tag structure, hierarchy, and nesting order
   - <link>, <script>, <meta charset>, <meta viewport> tags
   - Image src URLs (keep them exactly as they are)
   - href="#section-id" anchor links
   - Any inline styles
   - The number of elements (e.g., if there are exactly 4 <li> items in a list, there must be exactly 4 in your output)
   - DO NOT add any <style> tags or new CSS code inside the HTML.

3. YOU ARE A TEXT-ONLY SURGEON:
   - You are only swapping the text *inside* the tags.
   - Example: <h1>Dental Excellence</h1> becomes <h1>Scalera Innovations</h1>.
   - The <h1> tag itself and its classes must not change.
   - If a tag is empty or contains only an icon, leave it alone.

3. CONTENT QUALITY:
   - Write professional, persuasive, industry-specific copy
   - Use real-sounding business details (address, phone, email) relevant to the industry
   - Make testimonials sound authentic with realistic names and roles
   - Stats/numbers should be realistic for the business type
   - CTAs should be action-oriented and relevant

4. OUTPUT: Return the COMPLETE modified HTML document. Nothing before or after it.
   Do NOT wrap it in markdown code fences. Just output raw HTML starting with <!DOCTYPE html>.

═══════════════════════════════════════════
TEMPLATE HTML TO REWRITE:
═══════════════════════════════════════════

{html}"""

    try:
        print("[Personalise] Sending full HTML to Groq for deep text rewrite...")
        client = Groq(api_key=GROQ_API_KEY)
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=16384,
            temperature=0.6,
        )
        result_html = response.choices[0].message.content.strip()

        # Strip markdown code fences if the model wrapped the output
        if result_html.startswith("```"):
            result_html = re.sub(r'^```[a-z]*\n?', '', result_html)
            result_html = re.sub(r'\n?```$', '', result_html)

        # Validate: the result should still look like HTML
        if "<!DOCTYPE" in result_html.upper() or "<html" in result_html.lower():
            # Quick sanity check — make sure key structural elements survived
            if "<nav" in result_html and "</footer>" in result_html:
                print(f"[Personalise] ✅ Deep rewrite successful ({len(result_html)} bytes)")
                return {
                    "html": result_html,
                    "css": template["css"],
                    "js": template["js"],
                }
            else:
                print("[Personalise] ⚠️ Output missing structural elements, trying fallback...")
        else:
            print("[Personalise] ⚠️ Output doesn't look like HTML, trying fallback...")

    except Exception as e:
        err = str(e)
        if "429" in err or "rate_limit" in err.lower():
            print(f"[Personalise] Rate limited on 70b, trying 8b instant fallback...")
        else:
            print(f"[Personalise] Error with 70b: {e}, trying 8b fallback...")

    # ── Fallback: try with the lighter 8b model ──
    try:
        print("[Personalise] Attempting fallback with llama-3.1-8b-instant...")
        client = Groq(api_key=GROQ_API_KEY)
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=16384,
            temperature=0.6,
        )
        result_html = response.choices[0].message.content.strip()

        if result_html.startswith("```"):
            result_html = re.sub(r'^```[a-z]*\n?', '', result_html)
            result_html = re.sub(r'\n?```$', '', result_html)

        if "<html" in result_html.lower() and "<nav" in result_html:
            print(f"[Personalise] ✅ Fallback rewrite successful ({len(result_html)} bytes)")
            return {
                "html": result_html,
                "css": template["css"],
                "js": template["js"],
            }
        else:
            print("[Personalise] ⚠️ Fallback output invalid, returning template as-is")

    except Exception as e2:
        print(f"[Personalise] Fallback also failed: {e2}")

    # ── Last resort: return the template with no personalisation ──
    print("[Personalise] Returning raw template (no text changes)")
    return template


# ──────────────────────────────────────────────
# Main Generation Entry Point
# ──────────────────────────────────────────────
async def generate_website(chat_history: str, data: dict = None) -> dict:
    """
    Generates a website by:
    1. Routing to the best matching template
    2. Reading the actual template files (HTML/CSS/JS)
    3. Personalising text content via lightweight Groq call
    
    Returns a dict: {"html": str, "css": str, "js": str}
    """
    def error_result(msg: str) -> dict:
        return {
            "html": f"<h3 style='font-family:sans-serif;padding:2rem;color:#ff6b6b'>{msg}</h3>",
            "css": "body { font-family: sans-serif; background: #0a0a0a; color: #fff; }",
            "js": "",
        }

    # 1. Route to the best template
    # If we have structured data, we can use the 'professional_title' to help routing
    routing_context = chat_history
    if data and data.get("professional_title"):
        routing_context += f"\nProfessional Title: {data['professional_title']}"
        if data.get("bio"):
            routing_context += f"\nBio: {data['bio']}"

    folder = await _route_template(routing_context)
    if not folder:
        return error_result("⚠️ No templates found. Please add templates to the /templates directory.")

    # 2. Read the actual template files
    template = _read_template(folder)
    if not template["html"]:
        return error_result(f"⚠️ Template '{folder}' is missing index.html.")

    print(f"[Generator] Loaded template: {folder} (HTML: {len(template['html'])} bytes, CSS: {len(template['css'])} bytes, JS: {len(template['js'])} bytes)")

    # 3. Personalise the template with user's business details
    # Construct a rich prompt if we have structured data
    if data:
        personalisation_prompt = f"User Data: {json.dumps(data)}\n\nAdditional Instructions: {chat_history}"
    else:
        personalisation_prompt = chat_history

    result = await _personalise_template(template, personalisation_prompt)
    print(f"[Generator] Full Prompt sent to Groq:\n{personalisation_prompt[:500]}...")
    print(f"[Generator] ✅ Website generated using '{folder}' template")
    return result


# ──────────────────────────────────────────────
# Chat function (unchanged)
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
          "website_type": "portfolio" | "business" | "restaurant" | "other"
        }
        
        Set "ready_to_generate" to true ONLY if you have identified all key pieces of information. 
        Set "website_type" based on the user's niche. If they want a portfolio or personal site, set it to "portfolio"."""
    }

    formatted_messages = [system_prompt] + messages

    if GROQ_API_KEY and GROQ_API_KEY != "PASTE_YOUR_GROQ_KEY_HERE":
        import urllib.request
        import urllib.error
        import json
        
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }
        data = {
            "model": "llama-3.3-70b-versatile",
            "messages": formatted_messages,
            "max_tokens": 512,
            "temperature": 0.7,
            "response_format": {"type": "json_object"}
        }
        
    if not GROQ_API_KEY or GROQ_API_KEY == "PASTE_YOUR_GROQ_KEY_HERE":
        return {
            "reply": "Debugging: I cannot see the GROQ_API_KEY in Vercel. Please make sure you added it to the *Scalera* project in Vercel, and that it is applied to the Production environment.",
            "ready_to_generate": False
        }

    try:
        # Scrub any literal backslash-n or actual newlines just in case
        clean_key = GROQ_API_KEY.replace('\\n', '').replace('\n', '').strip()
        
        headers = {
            "Authorization": f"Bearer {clean_key}",
            "Content-Type": "application/json",
            "User-Agent": "ScaleraAI/1.0 (Mozilla/5.0; Vercel)"
        }
        req = urllib.request.Request(url, data=json.dumps(data).encode("utf-8"), headers=headers, method="POST")
        
        with urllib.request.urlopen(req, timeout=15) as response:
            result = json.loads(response.read().decode("utf-8"))
            raw_content = result["choices"][0]["message"]["content"]
            return json.loads(raw_content)
    except Exception as e:
        return {
            "reply": f"Debugging: API Key is present (starts with {GROQ_API_KEY[:4]}), but the Groq API call failed: {str(e)}",
            "ready_to_generate": False
        }

# ──────────────────────────────────────────────
# AI Editor — Targeted updates
# ──────────────────────────────────────────────
async def edit_website(html: str, css: str, prompt: str) -> dict:
    """
    Takes the current HTML/CSS and a user's natural language edit prompt,
    and returns the modified HTML and CSS.
    """
    if not GROQ_API_KEY or GROQ_API_KEY == "PASTE_YOUR_GROQ_KEY_HERE":
        return {"html": html, "css": css} # Fallback

    system_msg = """You are Scalera AI, a surgical front-end developer.
Your task is to modify the provided HTML and CSS based on the user's prompt.

SURGICAL RULES:
1. ONLY change the specific sections or text mentioned by the user.
2. DO NOT rewrite the entire page structure.
3. If the user asks for a text change, DO NOT touch the CSS.
4. If the user asks for a design change (colors, etc.), ONLY touch the relevant CSS rules.
5. KEEP all existing classes, IDs, and structure perfectly intact.
6. Return the FULL updated code as JSON (the frontend needs the full string to re-render), but ensure only the target content has changed."""

    user_msg = f"""
[CONTEXT]
We are editing a generated website. You must be non-destructive.

[HTML]
{html}
[/HTML]

[CSS]
{css}
[/CSS]

[USER REQUEST]
{prompt}

Return a JSON object: {{"html": "...", "css": "..."}}
"""

    import urllib.request
    import urllib.error
    import json
    
    url = "https://api.groq.com/openai/v1/chat/completions"
    clean_key = GROQ_API_KEY.replace('\\n', '').replace('\n', '').strip()
    headers = {
        "Authorization": f"Bearer {clean_key}",
        "Content-Type": "application/json",
        "User-Agent": "ScaleraAI/1.0"
    }
    
    data = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {"role": "system", "content": system_msg},
            {"role": "user", "content": user_msg}
        ],
        "response_format": {"type": "json_object"},
        "temperature": 0.2
    }
    
    try:
        req = urllib.request.Request(url, data=json.dumps(data).encode("utf-8"), headers=headers, method="POST")
        with urllib.request.urlopen(req, timeout=30) as response:
            result = json.loads(response.read().decode("utf-8"))
            raw_content = result["choices"][0]["message"]["content"]
            parsed = json.loads(raw_content)
            
            # Ensure keys exist
            final_html = parsed.get("html", html)
            final_css = parsed.get("css", css)
            
            return {
                "html": final_html,
                "css": final_css
            }
    except Exception as e:
        print(f"[AI Editor] Error: {e}")
        return {"html": html, "css": css} # Return original on failure

# ──────────────────────────────────────────────
# Data Extraction — Resume & Links
# ──────────────────────────────────────────────
async def extract_data_from_resume(content: bytes, filename: str) -> dict:
    """Extracts text from PDF/DOCX and uses Groq to structure it."""
    print(f"[Extractor] Processing file: {filename} ({len(content)} bytes)")
    text = ""
    ext = filename.lower().split('.')[-1]
    
    import io

    try:
        if ext == "pdf":
            from pypdf import PdfReader
            reader = PdfReader(io.BytesIO(content))
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
            print(f"[Extractor] PDF parsed. Extracted {len(text)} characters.")
            
        elif ext in ["docx", "doc"]:
            import mammoth
            result = mammoth.extract_raw_text(io.BytesIO(content))
            text = result.value
            print(f"[Extractor] DOCX parsed. Extracted {len(text)} characters.")
            
        else:
            # Fallback for plain text
            text = content.decode("utf-8", errors="ignore")
            print(f"[Extractor] Plain text/fallback used. Extracted {len(text)} characters.")

    except Exception as e:
        print(f"[Extractor] Critical Parsing Error: {e}")
        return {"error": f"Failed to parse {ext} file: {str(e)}"}

    # Validation: Is the text empty?
    if not text.strip():
        print("[Extractor] ❌ Parsing failed: No text content found.")
        return {"error": "The file appears to be a scanned image or empty. Please use a text-based PDF or DOCX file."}

    # Debug Log: Sample of extracted text
    print(f"[Extractor] Raw text sample (first 300 chars):\n{text[:300]}...")

    # Cleaning text
    import re
    text = re.sub(r'\n+', '\n', text) # Remove excessive newlines
    text = re.sub(r' +', ' ', text)   # Remove excessive spaces

    return await _parse_raw_text_to_json(text)

async def extract_data_from_link(link: str) -> dict:
    """Processes a link (LinkedIn etc). For now, it just returns the link for future scraping."""
    # Real LinkedIn scraping is complex, so we'll just return a note to the user
    # in the structured data for now.
    return {"linkedin_url": link, "note": "LinkedIn URL detected. Please ensure your profile text is added below if missing."}

async def _parse_raw_text_to_json(raw_text: str) -> dict:
    """Uses Groq to turn raw resume text into a structured JSON schema."""
    if not GROQ_API_KEY or GROQ_API_KEY == "PASTE_YOUR_GROQ_KEY_HERE":
        return {"raw_text": raw_text[:500]}

    system_msg = """You are a profile data extractor. Extract the following information from the provided text into a clean JSON object:
    - full_name
    - professional_title
    - bio (short summary)
    - skills (list of strings)
    - experience (list of objects: title, company, duration, description)
    - projects (list of objects: name, description, link)
    - education (list of objects: degree, school, year)
    - contact (email, phone, location)
    
    Return ONLY valid JSON. If a field is missing, use null or an empty list."""

    import urllib.request
    import json
    
    url = "https://api.groq.com/openai/v1/chat/completions"
    clean_key = GROQ_API_KEY.replace('\\n', '').replace('\n', '').strip()
    headers = {
        "Authorization": f"Bearer {clean_key}",
        "Content-Type": "application/json"
    }
    
    data = {
        "model": "llama-3.1-8b-instant",
        "messages": [
            {"role": "system", "content": system_msg},
            {"role": "user", "content": f"Text to extract:\n{raw_text[:8000]}"}
        ],
        "response_format": {"type": "json_object"},
        "temperature": 0.0
    }
    
    try:
        req = urllib.request.Request(url, data=json.dumps(data).encode("utf-8"), headers=headers, method="POST")
        with urllib.request.urlopen(req, timeout=45) as response:
            result = json.loads(response.read().decode("utf-8"))
            content = result["choices"][0]["message"]["content"]
            print(f"[Extractor] Groq extraction complete. Structured {len(content)} bytes of JSON.")
            return json.loads(content)
    except urllib.error.HTTPError as e:
        status_code = e.code
        print(f"[Extractor] HTTP Error {status_code}: {e.reason}")
        if status_code in [401, 403]:
            return {"error": "Invalid Groq API Key. Please check your .env or environment variables."}
        return {"error": f"Groq API returned error {status_code}. The service might be busy."}
    except Exception as e:
        print(f"[Extractor] General Error: {e}")
        return {"error": "AI extraction failed. The file text was too complex or the engine is busy."}
