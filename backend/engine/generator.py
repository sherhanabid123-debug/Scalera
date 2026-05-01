from groq import Groq
import re
import os
import json

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

    prompt = f"""You are an expert website content writer. Your job is to take an existing HTML template and rewrite ALL the visible text content so it perfectly matches the user's business described below.

═══════════════════════════════════════════
USER'S BUSINESS REQUIREMENTS:
═══════════════════════════════════════════
{chat_history}

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

2. DO NOT CHANGE any of these — they must stay exactly as-is:
   - HTML tags (do not add, remove, or modify any tags)
   - CSS classes, IDs, or any HTML attributes
   - The tag structure and nesting order
   - <link>, <script>, <meta charset>, <meta viewport> tags
   - Image src URLs and alt text structure (update alt text to match new content)
   - href="#section-id" anchor links
   - Any inline styles
   - The number of elements (e.g., if there are 4 service cards, keep 4)

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
async def generate_website(chat_history: str) -> dict:
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
    folder = await _route_template(chat_history)
    if not folder:
        return error_result("⚠️ No templates found. Please add templates to the /templates directory.")

    # 2. Read the actual template files
    template = _read_template(folder)
    if not template["html"]:
        return error_result(f"⚠️ Template '{folder}' is missing index.html.")

    print(f"[Generator] Loaded template: {folder} (HTML: {len(template['html'])} bytes, CSS: {len(template['css'])} bytes, JS: {len(template['js'])} bytes)")

    # 3. Personalise the template with user's business details
    result = await _personalise_template(template, chat_history)
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
        "content": """You are Scalera AI, a brilliant and brief conversational assistant for a premium website builder. 
        Your goal is to figure out:
        1. Business Name
        2. Industry/Niche
        3. Design Style (e.g., minimalist, bold, dark, elegant)

        Be friendly but extremely concise. Ask one question at a time.
        
        CRITICAL: You must return your response in a JSON format like this:
        {
          "reply": "Your conversational response here",
          "ready_to_generate": true/false
        }
        
        Set "ready_to_generate" to true ONLY if you have identified all three key pieces of information (Name, Industry, Style). Otherwise, set it to false."""
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
            "Content-Type": "application/json"
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
