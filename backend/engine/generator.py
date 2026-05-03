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
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()

if not GROQ_API_KEY:
    print("[Scalera AI] ⚠️ WARNING: GROQ_API_KEY not found.")
else:
    print(f"[Scalera AI] ✅ GROQ_API_KEY loaded (Starts with: {GROQ_API_KEY[:4]}...)")

if GEMINI_API_KEY:
    print(f"[Scalera AI] ✅ GEMINI_API_KEY loaded (Starts with: {GEMINI_API_KEY[:4]}...)")
    import google.generativeai as genai
    genai.configure(api_key=GEMINI_API_KEY)

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

GUIDANCE: 
- For premium, dark, or minimalist personal portfolios, prefer 'sherhan_portfolio'.
- For standard portfolios, use 'spa' or 'photography'.
- For business sites, use 'corporate' or 'saas'.

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
# Personalisation — Full deep text rewrite via Gemini/Groq
# ──────────────────────────────────────────────
async def _personalise_template(template: dict, chat_history: str) -> dict:
    """
    Rewrites the HTML template using Gemini 2.0 for high-fidelity data injection.
    """
    html = template["html"]
    
    # Construct the instruction
    instruction = f"""You are a luxury website content architect. Rewrite the text content of this HTML template to match the user's data.

PRIME DIRECTIVE:
Your priority #1 is to replace all generic placeholders with the REAL USER DATA provided below. Keeping generic text is a failure.

USER DATA & REQUIREMENTS:
{chat_history}

MAPPING RULES:
1. HERO: Headline = 'full_name', Subtitle = 'professional_title' (or 'business_type').
2. ABOUT/BIO: Use 'bio' or 'description'. If short, expand into professional, high-end copy.
3. EXPERIENCE/SERVICES: Map each item to a card or list item.
4. SOCIAL PROOF: If 'rating' exists, mention it (e.g., "Top Rated Business").
5. CONTACT: Use the provided address/email in the footer and contact sections.

STRICT TECHNICAL RULES:
- Output ONLY the raw HTML starting with <!DOCTYPE html>.
- PRESERVE all classes and IDs.
- REPEATING ELEMENTS: If the template has repeating elements (like 'Experience cards' or 'Service blocks'), you MUST duplicate or remove them to match the number of items in the user's data.
- If data is provided, the original template text MUST be gone.

TEMPLATE TO REWRITE:
{html}"""

    # Try Gemini 2.0 first for best quality
    if GEMINI_API_KEY:
        try:
            print("[Personalise] Sending HTML to Gemini 2.0 for deep injection...")
            import google.generativeai as genai
            model = genai.GenerativeModel('gemini-2.0-flash')
            response = model.generate_content(instruction)
            result_html = response.text.strip()
            
            # Clean markdown code blocks if present
            if result_html.startswith("```"):
                result_html = re.sub(r'^```[a-z]*\n?', '', result_html)
                result_html = re.sub(r'\n?```$', '', result_html)
                
            if "<!DOCTYPE" in result_html.upper() and "</html>" in result_html.lower():
                print(f"[Personalise] ✅ Gemini rewrite successful ({len(result_html)} bytes)")
                return {
                    "html": result_html,
                    "css": template["css"],
                    "js": template["js"],
                }
        except Exception as e:
            err = str(e)
            if "429" in err or "rate_limit" in err.lower():
                print(f"[Personalise] Rate limited on 70b, trying 8b instant fallback...")
            else:
                print(f"[Personalise] Error with 70b: {e}, trying 8b fallback...")

    # Fallback to Groq Llama 3.1 8b
    try:
        print("[Personalise] Using Groq fallback...")
        client = Groq(api_key=GROQ_API_KEY)
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": instruction}],
            max_tokens=16384,
            temperature=0.5,
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

    # 3. Pre-process template (optional but helpful for AI)
    # We can inject a small hint into the HTML to help the AI identify placeholders
    processed_html = template['html'].replace("hello@example.com", "[USER_EMAIL_HERE]")
    template['html'] = processed_html

    # 4. Personalise the template with user's business details
    if data:
        tone_instruction = f"TONE: {data.get('tone', 'modern')}. " if data.get('tone') else ""
        type_instruction = f"SITE TYPE: {data.get('site_type', 'website')}. " if data.get('site_type') else ""
        personalisation_prompt = f"{tone_instruction}{type_instruction}User Data: {json.dumps(data)}\n\nAdditional Instructions: {chat_history}"
    else:
        personalisation_prompt = chat_history

    result = await _personalise_template(template, personalisation_prompt)
    print(f"[Generator] ✅ Website generated using '{folder}' template with deep injection.")
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
            "model": "llama-3.1-8b-instant",
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
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        return {
            "reply": f"Groq API 400 Error: {error_body}",
            "ready_to_generate": False
        }
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
        "model": "llama-3.1-8b-instant",
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

    if GEMINI_API_KEY:
        print("[Extractor] Attempting Gemini 2.0 Flash...")
        res = await _try_gemini(text, 'gemini-2.0-flash')
        if "error" not in res: return res
        
        print("[Extractor] Gemini 2.0 failed/quota, trying Gemini Flash Latest...")
        res = await _try_gemini(text, 'gemini-flash-latest')
        if "error" not in res: return res

    print("[Extractor] Gemini failed or key missing, falling back to Groq...")
    return await _parse_raw_text_to_json(text)

async def _try_gemini(raw_text: str, model_name: str, custom_prompt: str = None) -> dict:
    """Helper to try a specific Gemini model."""
    try:
        import google.generativeai as genai
        model = genai.GenerativeModel(model_name, generation_config={"response_mime_type": "application/json"})
        
        if custom_prompt:
            prompt = f"{custom_prompt}\n\nData:\n{raw_text[:15000]}"
        else:
            prompt = f"Extract profile data from this text into structured JSON. Include: full_name, professional_title, bio, skills[], experience[], projects[], education[].\n\nText:\n{raw_text[:15000]}"
            
        response = model.generate_content(prompt)
        return json.loads(response.text)
    except Exception as e:
        print(f"[Extractor] {model_name} failed: {e}")
        return {"error": str(e)}


async def extract_data_from_link(link: str) -> dict:
    """Best-effort scraper for public links (LinkedIn/Portfolios)."""
    print(f"[Extractor] Attempting to scrape link: {link}")
    
    try:
        import urllib.request
        from bs4 import BeautifulSoup
        
        # Stealth headers
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
        }
        
        req = urllib.request.Request(link, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as response:
            html = response.read().decode('utf-8', errors='ignore')
            soup = BeautifulSoup(html, 'html.parser')
            
            # Extract Meta Tags (LinkedIn uses OpenGraph for public views)
            meta_title = soup.find('meta', property='og:title')
            meta_desc = soup.find('meta', property='og:description')
            
            title_text = meta_title['content'] if meta_title else soup.title.string if soup.title else ""
            desc_text = meta_desc['content'] if meta_desc else ""
            
            # Use Gemini to clean this up
            raw_blob = f"Title: {title_text}\nDescription: {desc_text}\nFull Text Snippet: {html[:2000]}"
            
            if GEMINI_API_KEY:
                print("[Extractor] Passing link metadata to Gemini...")
                return await _try_gemini(raw_blob, 'gemini-2.0-flash')
            
            return {"full_name": title_text, "bio": desc_text, "note": "Data extracted from public meta tags."}

    except Exception as e:
        print(f"[Extractor] Link Scrape Failed: {e}")
        return {"error": "LinkedIn blocked the automated request. Tip: Save your LinkedIn profile as PDF and upload it for better results!"}

async def _parse_raw_text_to_json(raw_text: str, system_msg: str = None) -> dict:
    """Uses Groq to turn raw text into a structured JSON schema."""
    if not GROQ_API_KEY or GROQ_API_KEY == "PASTE_YOUR_GROQ_KEY_HERE":
        return {"raw_text": raw_text[:500]}

    if not system_msg:
        system_msg = """You are a precision profile data extractor. Extract information from the provided text into a clean JSON object. 
        STRICT RULES:
        1. Use 'full_name' for the person's name.
        2. Use 'professional_title' for their current role or headline.
        3. Use 'bio' for a short, professional summary.
        4. Use 'skills' (list of tags).
        5. Use 'experience' (list of: company, role, duration, description).
        6. Use 'projects' (list of: title, description).
        7. Use 'education' (list of: institution, degree, year).
        8. CLEANING: Fix capitalization, remove redundant text, and ensure professional tone.
        
        Output ONLY valid JSON."""

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
        error_body = e.read().decode("utf-8")
        print(f"[Extractor] API Error {e.code}: {error_body}")
        try:
            err_json = json.loads(error_body)
            err_msg = err_json.get("error", {}).get("message", e.reason)
        except:
            err_msg = e.reason
            
        if e.code in [401, 403]:
            return {"error": f"Groq Authentication Failed: {err_msg}"}
        return {"error": f"Groq API Error {e.code}: {err_msg}"}
    except Exception as e:
        print(f"[Extractor] General Error: {e}")
        return {"error": f"System Error: {str(e)}"}

async def extract_business_data(link: str) -> dict:
    """Robust extraction from a Google Maps link with multi-model waterfall."""
    print(f"[Business Extractor] Analyzing: {link}")
    
    try:
        import urllib.request
        from bs4 import BeautifulSoup
        
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'}
        req = urllib.request.Request(link, headers=headers)
        
        with urllib.request.urlopen(req, timeout=10) as response:
            html = response.read().decode('utf-8', errors='ignore')
            soup = BeautifulSoup(html, 'html.parser')
            
            meta_title = soup.find('meta', property='og:title')
            meta_desc = soup.find('meta', property='og:description')
            
            title_text = meta_title['content'] if meta_title else ""
            desc_text = meta_desc['content'] if meta_desc else ""
            raw_blob = f"Business: {title_text}\nInfo: {desc_text}\nSnippet: {html[:4000]}"
            
            biz_prompt = """Extract these fields into JSON: business_name, business_type, address, rating, description, highlight_review. 
            Ensure 'rating' is a number."""

            # 1. Try Gemini 2.0
            if GEMINI_API_KEY:
                res = await _try_gemini(raw_blob, 'gemini-2.0-flash', biz_prompt)
                if "error" not in res: return res
                
                # 2. Try Gemini Flash Latest
                res = await _try_gemini(raw_blob, 'gemini-flash-latest', biz_prompt)
                if "error" not in res: return res

            # 3. Final Fallback: Groq
            if GROQ_API_KEY:
                print("[Business Extractor] Gemini failed/limited. Falling back to Groq...")
                return await _parse_raw_text_to_json(raw_blob, system_msg=f"System: Business Expert. {biz_prompt}")

            return {"business_name": title_text, "description": desc_text}

    except Exception as e:
        print(f"[Business Extractor] Fatal: {e}")
        return {"error": str(e)}

# ──────────────────────────────────────────────
# Vision Interpretation — Natural Language to Blueprint
# ──────────────────────────────────────────────
async def interpret_vision(description: str) -> dict:
    """
    Converts a natural language website description into a structured blueprint.
    """
    if not description:
        return {}

    instruction = f"""You are a senior website architect. Convert the user's natural language description into a structured JSON blueprint for a website.

USER DESCRIPTION:
{description}

JSON STRUCTURE:
{{
  "site_type": "portfolio | restaurant | agency | saas | startup | corporate | dental-clinic | event-planner | photography | fitness | healthcare | hotel | law-firm | mobile-app | non-profit | real-estate | spa | startup | ecommerce | education",
  "tone": "modern | luxurious | bold | minimal | professional | playful",
  "business_name": "Name if mentioned, else empty",
  "sections": ["Hero", "About", "Services", "Portfolio/Work", "Testimonials", "Contact", "FAQ", "Pricing"],
  "primary_colors": ["color1", "color2"],
  "key_features": ["feature1", "feature2"]
}}

RULES:
1. Be decisive. Pick the best matching 'site_type' from the list provided.
2. If the user mentiones a specific business name, extract it.
3. Determine the 'tone' based on keywords (e.g., 'high-end' -> luxurious, 'clean' -> minimal).
4. List the sections that would make sense for this vision.
5. Return ONLY raw JSON.
"""

    try:
        import google.generativeai as genai
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(instruction)
        text = response.text.strip()
        
        # Clean markdown
        if text.startswith("```"):
            text = re.sub(r'^```[a-z]*\n?', '', text)
            text = re.sub(r'\n?```$', '', text)
            
        blueprint = json.loads(text)
        print(f"[Vision] Blueprint extracted: {blueprint.get('site_type')} | {blueprint.get('tone')}")
        return blueprint
    except Exception as e:
        print(f"[Vision] Error interpreting vision: {e}")
        return {
            "site_type": "agency",
            "tone": "modern",
            "sections": ["Hero", "About", "Services", "Contact"]
        }
