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
Your priority #1 is to replace all generic placeholders with the REAL USER DATA provided below.
The 'business_name' in the data is your BRAND ANCHOR. Use it for the Logo, Hero Headline, and Footer.
Keeping generic text like "Your Business" or "Company Name" is a total failure.

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
            print(f"[Personalise] Gemini failed: {e}, trying Groq fallback...")

    # Fallback to Groq Llama 3.3 70b or 3.1 8b
    try:
        print("[Personalise] Using Groq fallback (llama-3.3-70b-versatile)...")
        client = Groq(api_key=GROQ_API_KEY)
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
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
    1. Extracting/Refining blueprint from chat if needed
    2. Building a custom modular site using the Atomic Engine
    3. Personalising content for deep flow
    """
    def error_result(msg: str) -> dict:
        return {
            "html": f"<h3 style='font-family:sans-serif;padding:2rem;color:#ff6b6b'>{msg}</h3>",
            "css": "body { font-family: sans-serif; background: #0a0a0a; color: #fff; }",
            "js": "",
        }

    # 1. If data is missing sections, we MUST extract them from chat history first
    if not data or not data.get("sections"):
        print("[Generator] 🧠 No blueprint found. Extracting from chat history...")
        interpretation = await interpret_vision(chat_history)
        if interpretation.get("status") == "success":
            data = interpretation.get("data")
            print(f"[Generator] ✨ Extracted Vision: {data.get('business_name')} ({data.get('site_type')})")
        else:
            data = {
                "business_name": "Scalera Site",
                "site_type": "Modern Business",
                "sections": ["Hero", "About", "Services", "Contact"],
                "tone": "Premium"
            }

    # 2. Build the site using the Modular Assembler (The Atomic System)
    from .assembler import assemble_modular_site
    print(f"[Generator] 🛠️ Building CUSTOM MODULAR site for: {data.get('business_name')}")
    
    result = await assemble_modular_site(data, data)
    
    # 3. Final Personalisation
    personalisation_prompt = f"""
    BUSINESS: {data.get('business_name')}
    TYPE: {data.get('site_type')}
    STYLE ARCHETYPE: {data.get('style_archetype', 'Modern')}
    STRATEGIC IMPROVEMENTS TO APPLY: {", ".join(data.get('improvements', []))}
    
    ORIGINAL CONTEXT: {chat_history}
    """
    
    result = await _personalise_template(result, personalisation_prompt)
    
    print(f"[Generator] ✅ Custom Website generated successfully.")
    return result


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
          "website_type": "portfolio" | "business" | "restaurant" | "other"
        }
        
        Set "ready_to_generate" to true ONLY if you have identified all key pieces of information. 
        Set "website_type" based on the user's niche. If they want a portfolio or personal site, set it to "portfolio"."""
    }

    formatted_messages = [system_prompt] + messages

    if not GROQ_API_KEY or GROQ_API_KEY == "PASTE_YOUR_GROQ_KEY_HERE":
        return {
            "reply": "Error: GROQ_API_KEY is missing. Please add it to your .env file in the root directory.",
            "ready_to_generate": False
        }

    try:
        client = Groq(api_key=GROQ_API_KEY)
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=formatted_messages,
            max_tokens=512,
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        raw_content = response.choices[0].message.content
        return json.loads(raw_content)
    except Exception as e:
        error_msg = str(e)
        return {
            "reply": f"Groq API Error: {error_msg}. Please check if your API key is valid and has sufficient quota.",
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
6. Return the FULL updated code as JSON."""

    user_msg = f"""
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
    try:
        client = Groq(api_key=GROQ_API_KEY)
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": system_msg},
                {"role": "user", "content": user_msg}
            ],
            response_format={"type": "json_object"},
            temperature=0.2
        )
        raw_content = response.choices[0].message.content
        parsed = json.loads(raw_content)
        return {
            "html": parsed.get("html", html),
            "css": parsed.get("css", css)
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

    if GEMINI_API_KEY:
        res = await _try_gemini(text, 'gemini-2.0-flash')
        if "error" not in res: return res

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
        return {"error": str(e)}


async def extract_data_from_link(link: str) -> dict:
    """Best-effort scraper for public links (LinkedIn/Portfolios)."""
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
            
            title_text = meta_title['content'] if meta_title else soup.title.string if soup.title else ""
            desc_text = meta_desc['content'] if meta_desc else ""
            
            raw_blob = f"Title: {title_text}\nDescription: {desc_text}\nSnippet: {html[:2000]}"
            
            if GEMINI_API_KEY:
                return await _try_gemini(raw_blob, 'gemini-2.0-flash')
            
            return {"full_name": title_text, "bio": desc_text}

    except Exception as e:
        return {"error": "LinkedIn blocked the request. Try uploading a PDF resume instead."}

async def _parse_raw_text_to_json(raw_text: str, system_msg: str = None) -> dict:
    """Uses Groq to turn raw text into a structured JSON schema."""
    if not GROQ_API_KEY or GROQ_API_KEY == "PASTE_YOUR_GROQ_KEY_HERE":
        return {"raw_text": raw_text[:500]}

    if not system_msg:
        system_msg = """Extract information into JSON: full_name, professional_title, bio, skills, experience, projects, education."""

    try:
        client = Groq(api_key=GROQ_API_KEY)
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": system_msg},
                {"role": "user", "content": f"Text:\n{raw_text[:8000]}"}
            ],
            response_format={"type": "json_object"},
            temperature=0.0
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        return {"error": str(e)}

async def extract_business_data(link: str) -> dict:
    """Robust extraction from a Google Maps link."""
    try:
        import urllib.request
        from bs4 import BeautifulSoup
        
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'}
        req = urllib.request.Request(link, headers=headers)
        
        with urllib.request.urlopen(req, timeout=10) as response:
            html = response.read().decode('utf-8', errors='ignore')
            soup = BeautifulSoup(html, 'html.parser')
            meta_title = soup.find('meta', property='og:title')
            title_text = meta_title['content'] if meta_title else ""
            
            biz_prompt = "Extract business JSON: name, type, address, rating, description."
            if GEMINI_API_KEY:
                return await _try_gemini(html[:4000], 'gemini-2.0-flash', biz_prompt)
            return await _parse_raw_text_to_json(html[:4000], system_msg=biz_prompt)
    except Exception as e:
        return {"error": str(e)}

# ──────────────────────────────────────────────
# Vision Interpretation — Natural Language to Blueprint
# ──────────────────────────────────────────────
async def interpret_vision(description: str) -> dict:
    """Converts natural language description into a structured JSON blueprint."""
    instruction = f"Convert this website vision into JSON: {description}"
    try:
        import google.generativeai as genai
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(instruction)
        return json.loads(response.text.strip())
    except:
        return {"site_type": "agency", "tone": "modern", "sections": ["Hero", "About", "Services", "Contact"]}

# ──────────────────────────────────────────────
# Contextual Section Editing
# ──────────────────────────────────────────────
async def edit_section_content(section_html: str, instruction: str, section_type: str) -> str:
    """Rewrites a specific section of the website."""
    system_prompt = f"Edit this HTML section ({section_type}) based on: {instruction}\n\nHTML:\n{section_html}"
    try:
        import google.generativeai as genai
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(system_prompt)
        return response.text.strip()
    except:
        return section_html
