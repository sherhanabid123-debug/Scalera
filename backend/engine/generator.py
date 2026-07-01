from groq import Groq
import re
import os
import json
import logging
from dotenv import load_dotenv

# Setup Logger
logger = logging.getLogger("scalera.generator")

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
async def _personalise_template(html: str, data: dict, research_data: dict, chat_history: str) -> str:
    """
    Rewrites the HTML template using Groq for high-fidelity data injection.
    Treats research data as the absolute authoritative source of truth.
    """
    import json

    business_name = data.get("business_name") or research_data.get("business_name") or "Generic Business"
    industry = data.get("site_type") or data.get("detected_niche") or research_data.get("industry") or "Professional Business"
    tone = data.get("tone") or "Premium & Elegant"
    location = data.get("address") or research_data.get("address") or research_data.get("location") or ""
    bio = data.get("bio") or data.get("description") or research_data.get("about") or ""
    rating = data.get("rating") or research_data.get("rating") or ""

    instruction = f"""You are a luxury website content architect. Rewrite the text content of this HTML template to match the user's data and researched information.

PRIME DIRECTIVES:
1. TREAT THE RESEARCH DATA BELOW AS THE ABSOLUTE AUTHORITATIVE SOURCE OF TRUTH.
2. REPLACE ALL generic placeholder content, lorem ipsum, and fake/filler marketing text with real, factual researched business information.
3. NEVER leave generic placeholders like "Lorem ipsum", "Your Business", "Company Name", "Insert Address Here", "000-000-0000", or fake contact info.
4. NEVER invent or hallucinate information. If the research data does not contain a specific detail (like a phone number or reviews), write professional copy or omit the section/field gracefully, but DO NOT invent fake placeholder details.
5. PRESERVE THE HTML STRUCTURE, LAYOUT CLASSES, CSS REFERENCES, AND JS REFERENCES EXACTLY. DO NOT delete, add, or rename any HTML classes, IDs, structural tags, script links, or stylesheet links.
6. Only modify the text content (inner text) of headings, paragraphs, spans, anchor tags, lists, button labels, etc.
7. Treat sections as semantic representations:
   - Populate "Services" cards/grids/lists directly from the "services" or "specialties" array in the research data.
   - Populate "Menu" cards/grids/lists directly from the "menu_items" array in the research data (for restaurants).
   - Populate "Testimonials" or "Reviews" sections directly from the "reviews" array in the research data.
   - Populate "Contact" sections (headers, footers, forms) using the address, location, phone, and website from the research data.
   - Populate "About" or "Bio" sections using the about and description information from the research data.
   - Ensure the business name "{business_name}" appears as the main brand logo and in the hero headline.

USER AND BUSINESS PROFILE:
- Business Name: {business_name}
- Industry/Niche: {industry}
- Tone: {tone}
- Location: {location}
- Rating: {rating}
- Bio/Description: {bio}
- Chat History Context: {chat_history}

AUTHORITATIVE RESEARCHED DATA (JSON):
{json.dumps(research_data, indent=2)}

STRICT TECHNICAL RULES:
- Output ONLY the raw modified HTML code starting with <!DOCTYPE html>. No markdown fences, no explanations, no chat wrap.
- Preserve `<link rel="stylesheet" href="styles.css">` and `<script src="script.js"></script>` exactly.
- Do NOT inject custom `<style>` blocks or inline styles.
- REPEATING ELEMENTS: If the template contains repeating cards/items (e.g., three default services cards) and the research data has more or fewer items, duplicate or prune the repeating elements to match the research data items, preserving their exact layout classes and structure.

TEMPLATE TO PERSONALIZE:
{html}"""

    try:
        print(
            "[Personalise] Customising template text using Groq (llama-3.3-70b-versatile)..."
        )
        client = Groq(api_key=GROQ_API_KEY)
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": instruction}],
            max_tokens=8192,
            temperature=0.3,
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


async def _extract_meta_from_chat(chat_history: str) -> dict:
    """Extracts business name, site type, tone, and details from chat history using LLM."""
    prompt = f"""Analyze the conversation history below between a user and a website building AI.
Extract the key details about the website they want to build.

Return a JSON object with:
{{
  "business_name": "Name of the business (or null if not mentioned/generic)",
  "site_type": "Niche/industry of the site (e.g. restaurant, dental clinic, saas, portfolio) (or null)",
  "tone": "Tone of the design/copy (e.g. premium, minimal, dark) (or null)",
  "address": "Location/address if mentioned (or null)",
  "description": "A brief description/bio of the business based on user info (or null)",
  "services": ["List", "of", "services/specialties", "mentioned", "in", "chat"],
  "cuisine_type": "Type of cuisine (for restaurants) (or null)",
  "doctor_specialty": "Specialty of the doctor/practice (for medical) (or null)",
  "portfolio_profession": "Profession/job title of the individual (for portfolios) (or null)"
}}

Conversation:
{chat_history}

Reply with ONLY the raw JSON object, no explanations or markdown code fences."""

    extracted_data = {}
    try:
        client = Groq(api_key=GROQ_API_KEY)
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.0
        )
        extracted_data = json.loads(response.choices[0].message.content.strip())
        logger.info(f"[Extractor] First extraction pass output: {json.dumps(extracted_data)}")
    except Exception as e:
        logger.error(f"[Extractor] First pass failed: {e}")
        return {}

    # Recovery Pass: Check if critical details are missing but might be inferred
    needs_recovery = False
    missing_fields = []
    
    if not extracted_data.get("business_name") or extracted_data.get("business_name") in ["My Business", "Generic Business", "null", None]:
        needs_recovery = True
        missing_fields.append("business_name")
    if not extracted_data.get("site_type") or extracted_data.get("site_type") in ["null", "other", None]:
        needs_recovery = True
        missing_fields.append("site_type")

    if needs_recovery and GROQ_API_KEY:
        logger.info(f"[Extractor] Initiating recovery pass for fields: {missing_fields}")
        recovery_prompt = f"""We are building a website but the first metadata extraction pass missed critical details: {', '.join(missing_fields)}.
Read the chat history carefully and recover these details.

Conversation:
{chat_history}

Return a JSON object with:
{{
  "business_name": "Recovered business/brand/personal name (or null if absolutely not mentioned)",
  "site_type": "Recovered niche/niche category (e.g. restaurant, dental clinic, corporate, portfolio) (or null)"
}}

Reply with ONLY the raw JSON object."""
        try:
            recovery_response = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[{"role": "user", "content": recovery_prompt}],
                response_format={"type": "json_object"},
                temperature=0.0
            )
            recovered = json.loads(recovery_response.choices[0].message.content.strip())
            logger.info(f"[Extractor] Recovery pass output: {json.dumps(recovered)}")
            if recovered.get("business_name") and recovered.get("business_name") not in ["null", None]:
                extracted_data["business_name"] = recovered["business_name"]
            if recovered.get("site_type") and recovered.get("site_type") not in ["null", None]:
                extracted_data["site_type"] = recovered["site_type"]
        except Exception as recovery_err:
            logger.error(f"[Extractor] Recovery pass failed: {recovery_err}")

    return extracted_data


async def fetch_ddg_results(query: str) -> str:
    """Performs a web search via DuckDuckGo static HTML and returns top results formatted as markdown."""
    query = query.strip()
    if not query:
        return ""
        
    import urllib.parse
    import urllib.request
    import asyncio
    
    url = "https://html.duckduckgo.com/html/"
    data = urllib.parse.urlencode({"q": query}).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"}
    )
    
    try:
        # Run synchronous urlopen in executor to keep it non-blocking
        loop = asyncio.get_event_loop()
        def run_sync():
            with urllib.request.urlopen(req, timeout=5) as response:
                return response.read().decode("utf-8", errors="ignore")
                
        html_content = await loop.run_in_executor(None, run_sync)
        
        titles = re.findall(r'<a[^>]*class="[^"]*result__a[^"]*"[^>]*>(.*?)</a>', html_content, re.DOTALL)
        snippets = re.findall(r'<a[^>]*class="[^"]*result__snippet[^"]*"[^>]*>(.*?)</a>', html_content, re.DOTALL)
        links = re.findall(r'<a[^>]*class="[^"]*result__url[^"]*"[^>]*>(.*?)</a>', html_content, re.DOTALL)
        
        results = []
        for i in range(min(5, len(snippets))):
            t = re.sub(r'<[^>]+>', '', titles[i]).strip() if i < len(titles) else "No Title"
            s = re.sub(r'<[^>]+>', '', snippets[i]).strip() if i < len(snippets) else "No Snippet"
            l = re.sub(r'<[^>]+>', '', links[i]).strip() if i < len(links) else "No Link"
            results.append(f"- **Title:** {t}\n  **Snippet:** {s}\n  **Link:** {l}")
        return "\n".join(results)
    except Exception as e:
        print(f"[Searcher] Failed for query '{query}': {e}")
        return ""


DEFAULT_RESEARCH_PAYLOAD = {
    "business_name": "",
    "industry": "",
    "location": "",
    "address": "",
    "phone": "",
    "website": "",
    "rating": "",
    "review_count": "",
    "services": [],
    "specialties": [],
    "menu_items": [],
    "reviews": [],
    "social_profiles": [],
    "about": "",
    "confidence_score": 0,
    "research_status": "failed"
}


def calculate_research_score(research: dict) -> int:
    score = 0
    if research.get("business_name") and len(str(research["business_name"])) > 1:
        score += 20
    if research.get("location") and len(str(research["location"])) > 1:
        score += 15
    if research.get("phone") and len(str(research["phone"])) > 1:
        score += 15
    if research.get("address") and len(str(research["address"])) > 1:
        score += 15
    
    # Check services, menu_items, or specialties
    has_offerings = False
    if research.get("services") and len(research["services"]) > 0:
        has_offerings = True
    if research.get("menu_items") and len(research["menu_items"]) > 0:
        has_offerings = True
    if research.get("specialties") and len(research["specialties"]) > 0:
        has_offerings = True
        
    if has_offerings:
        score += 15
        
    if research.get("reviews") and len(research["reviews"]) > 0:
        score += 10
    if research.get("website") and len(str(research["website"])) > 1:
        score += 10
    return score


async def parse_search_results_to_json(scraped_text: str, name: str, industry: str) -> dict:
    """Uses LLM to parse and extract normalized facts from raw scraped text snippets."""
    prompt = f"""You are a data extraction bot. Analyze the web search results for the business "{name}" ({industry}) and extract structured facts.

Fill in the fields of the JSON object below. Do NOT hallucinate or make up facts. Only fill in details that are explicitly found or strongly implied in the search results.

JSON Schema:
{{
  "business_name": "Official business/restaurant/clinic name",
  "industry": "Specific industry category",
  "location": "City/region",
  "address": "Physical location address (or null if not found)",
  "phone": "Phone number (or null if not found)",
  "website": "Official domain link (or null if not found)",
  "rating": "Overall rating score (e.g. 4.8) (or null if not found)",
  "review_count": "Total count of reviews (or null if not found)",
  "services": ["Detailed", "list", "of", "services", "provided", "(or empty array)"],
  "specialties": ["Signature", "specialties/expertises", "(or empty array)"],
  "menu_items": [
     {{ "name": "Dish Name", "description": "brief description", "price": "e.g. $15 (or null)" }}
  ],
  "reviews": [
     {{ "author": "Name (or null)", "text": "review quote", "rating": "score (or null)" }}
  ],
  "social_profiles": ["Facebook/Yelp/Instagram links found"],
  "about": "A concise paragraph summarizing their history and brand identity"
}}

Scraped Search Results:
{scraped_text}

Reply with ONLY the raw JSON object, no explanations or markdown fences."""

    try:
        client = Groq(api_key=GROQ_API_KEY)
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.0
        )
        parsed = json.loads(response.choices[0].message.content.strip())
        return parsed
    except Exception as e:
        logger.error(f"[ResearchParser] Failed parsing scraped text: {e}")
        return {}


async def perform_deep_business_research(business_name: str, niche: str) -> dict:
    """Runs parallel searches, parses them into a normalized structure, calculates confidence score, and retries if score is low."""
    # Step 1: Formulate initial queries
    query1 = f"{business_name} {niche} about services description specialties"
    query2 = f"{business_name} {niche} address location contact phone reviews rating"
    
    if "restaurant" in niche.lower() or "food" in niche.lower() or "cafe" in niche.lower():
        query1 = f"{business_name} restaurant menu specialties signature dishes food"
        query2 = f"{business_name} restaurant address location contact hours reviews rating"
    elif "clinic" in niche.lower() or "doctor" in niche.lower() or "medical" in niche.lower() or "dental" in niche.lower():
        query1 = f"{business_name} clinic doctors specialties services medical"
        query2 = f"{business_name} clinic address contact phone hours patient reviews rating"
        
    logger.info(f"[Research] Running primary queries for '{business_name}':\n  1. '{query1}'\n  2. '{query2}'")
    
    # Run concurrent searches
    scraped_parts = await asyncio.gather(
        fetch_ddg_results(query1),
        fetch_ddg_results(query2)
    )
    
    combined_scraped = f"--- Primary Search results for {business_name} ---\n" + \
                       f"SERVICES:\n{scraped_parts[0]}\n\nLOCATION:\n{scraped_parts[1]}"
                       
    # Parse results into normalized payload
    research_payload = await parse_search_results_to_json(combined_scraped, business_name, niche)
    
    # Merge default keys if missing
    for k, v in DEFAULT_RESEARCH_PAYLOAD.items():
        if k not in research_payload:
            research_payload[k] = v

    # Calculate initial score
    score = calculate_research_score(research_payload)
    research_payload["confidence_score"] = score
    logger.info(f"[Research] Primary search confidence score: {score}/100")
    
    # Step 2: Retry with alternate queries if confidence score is low (< 40)
    if score < 40:
        logger.warning(f"[Research] Low confidence score ({score} < 40). Triggering alternate query fallback search...")
        alt_query1 = f"{business_name} reviews ratings reputation feedback"
        alt_query2 = f"{business_name} website address contact telephone number"
        logger.info(f"[Research] Running alternate queries:\n  1. '{alt_query1}'\n  2. '{alt_query2}'")
        
        alt_scraped_parts = await asyncio.gather(
            fetch_ddg_results(alt_query1),
            fetch_ddg_results(alt_query2)
        )
        
        alt_scraped = f"--- Alternate Fallback Search results for {business_name} ---\n" + \
                      f"REVIEWS/REPUTATION:\n{alt_scraped_parts[0]}\n\nCONTACT/WEBSITE:\n{alt_scraped_parts[1]}"
                      
        # Merge raw texts
        total_scraped = combined_scraped + "\n\n" + alt_scraped
        
        # Parse again with total gathered information
        logger.info(f"[Research] Re-parsing combined search payload...")
        new_payload = await parse_search_results_to_json(total_scraped, business_name, niche)
        
        # Merge missing default keys
        for k, v in DEFAULT_RESEARCH_PAYLOAD.items():
            if k not in new_payload:
                new_payload[k] = v
                
        # Recalculate score
        new_score = calculate_research_score(new_payload)
        new_payload["confidence_score"] = new_score
        logger.info(f"[Research] Recalculated search confidence score: {new_score}/100")
        
        # Keep the one with the higher score
        if new_score >= score:
            research_payload = new_payload
            score = new_score

    # Set research status
    if score >= 60:
        research_payload["research_status"] = "verified"
    elif score >= 35:
        research_payload["research_status"] = "low_confidence"
    else:
        research_payload["research_status"] = "failed"
        
    logger.info(f"[Research] Final status: '{research_payload['research_status']}' (Score: {score}/100)")
    
    # Diagnostic Output
    logger.info("Research Output")
    logger.info(json.dumps(research_payload, indent=2))
    
    return research_payload


def verify_personalized_content(html: str, research: dict) -> list:
    """Verifies that the generated HTML contains key facts from the research payload."""
    missing_elements = []
    
    # Check Business Name
    biz_name = research.get("business_name")
    if biz_name and len(str(biz_name)) > 1:
        if biz_name.lower() not in html.lower():
            missing_elements.append(f"Business Name: '{biz_name}'")
            
    # Check Location / City
    loc = research.get("location")
    if loc and len(str(loc)) > 1:
        if loc.lower() not in html.lower():
            missing_elements.append(f"Location/City: '{loc}'")
            
    # Check Address
    addr = research.get("address")
    if addr and len(str(addr)) > 5:
        # Check first 15 characters of the address to account for formatting details
        short_addr = addr[:15]
        if short_addr.lower() not in html.lower():
            missing_elements.append(f"Address: '{addr}'")
            
    # Check Phone
    phone = research.get("phone")
    if phone and len(str(phone)) > 5:
        # Strip common formatting characters
        clean_phone = re.sub(r"[^\d]", "", phone)
        # Check if clean digits appear in sequence or clean phone is in HTML
        if clean_phone not in re.sub(r"[^\d]", "", html) and phone.lower() not in html.lower():
            missing_elements.append(f"Phone: '{phone}'")
            
    # Check Services / Menu Items
    offerings = research.get("services") or []
    if not offerings:
        offerings = [item.get("name") for item in (research.get("menu_items") or []) if item.get("name")]
    if not offerings:
        offerings = research.get("specialties") or []
        
    if offerings:
        # Check if at least 1 offering is mentioned in the HTML
        found_offering = False
        for offering in offerings[:3]:
            if offering.lower() in html.lower():
                found_offering = True
                break
        if not found_offering:
            missing_elements.append(f"Key services or offerings (e.g. '{offerings[0]}')")
            
    return missing_elements


async def run_targeted_correction_pass(html: str, research: dict, missing_elements: list) -> str:
    """Runs a targeted correction pass to inject missing researched facts into the HTML."""
    logger.warning(f"[Verification] HTML failed validation. Missing elements: {missing_elements}. Running correction pass...")
    
    prompt = f"""You are a senior HTML repair bot. The website code generated in the previous pass is missing critical researched details.
Your job is to revise the HTML and inject these missing facts seamlessly into the appropriate sections (header, hero, about, services, or footer) while preserving all other styles, layouts, classes, and structures.

MISSING FACTS TO INJECT:
{chr(10).join(f'- {item}' for item in missing_elements)}

STRUCTURED RESEARCH PAYLOAD:
{json.dumps(research, indent=2)}

ORIGINAL HTML CODE TO REVISE:
{html}

Reply with ONLY the corrected raw HTML code starting with <!DOCTYPE html>. Keep all layout, CSS links, and JS links exactly as they are."""

    try:
        client = Groq(api_key=GROQ_API_KEY)
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=8192,
            temperature=0.2,
        )
        corrected_html = response.choices[0].message.content.strip()
        if corrected_html.startswith("```"):
            corrected_html = re.sub(r"^```[a-z]*\n?", "", corrected_html)
            corrected_html = re.sub(r"\n?```$", "", corrected_html)
        if "<html" in corrected_html.lower() and "<nav" in corrected_html:
            logger.info("[Verification] Targeted correction pass successful!")
            return corrected_html
        else:
            logger.warning("[Verification] Corrected HTML was invalid, falling back to original.")
    except Exception as e:
        logger.error(f"[Verification] Correction pass failed: {e}")
        
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
    # 1. Ensure we have data dictionary and extract metadata if generic
    if not data:
        data = {}

    # If business_name is generic or missing, extract from chat history
    if not data.get("business_name") or data.get("business_name") in ["My Business", "Generic Business"]:
        print("[Generator] 🧠 Extracting brand details from chat history...")
        extracted = await _extract_meta_from_chat(chat_history)
        if extracted:
            print(f"[Generator] Extracted from chat: {extracted}")
            for k, v in extracted.items():
                if v and not data.get(k):
                    data[k] = v
                elif v and data.get(k) in ["My Business", "Generic Business", "agency", "Professional Business"]:
                    data[k] = v

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

    # 4. Perform deep parallel online research about the business name
    business_name = data.get("business_name") or ""
    niche = data.get("site_type") or data.get("detected_niche") or ""
    
    research_payload = DEFAULT_RESEARCH_PAYLOAD.copy()
    research_sources = 0
    
    if business_name and business_name not in ["Generic Business", "My Business"] and len(business_name) > 2:
        research_payload = await perform_deep_business_research(business_name, niche)
        sources_list = []
        if research_payload.get("website"):
            sources_list.append(research_payload["website"])
        for profile in (research_payload.get("social_profiles") or []):
            sources_list.append(profile)
        for review in (research_payload.get("reviews") or []):
            if isinstance(review, dict) and review.get("text"):
                sources_list.append(review.get("author") or "review")
        research_sources = max(3, len(set(sources_list))) if research_payload.get("research_status") != "failed" else 0
        
    diagnostic_payload = {
        "business_name": business_name,
        "industry": niche,
        "location": data.get("address") or research_payload.get("location") or "",
        "description": data.get("description") or data.get("bio") or research_payload.get("about") or "",
        "selected_template": folder_name,
        "research_result_size": len(json.dumps(research_payload)),
        "research_keys": [k for k, v in research_payload.items() if v and v != DEFAULT_RESEARCH_PAYLOAD.get(k)],
    }
    logger.info("Pipeline Generation Request Diagnostics:")
    logger.info(json.dumps(diagnostic_payload, indent=2))

    # 5. Final text rewrite via LLM personalisation
    personalized_html = await _personalise_template(html_content, data, research_payload, chat_history)

    # 6. Verification Layer & Auto-Regeneration
    missing_elements = verify_personalized_content(personalized_html, research_payload)
    personalization_quality = "high"
    if missing_elements:
        personalization_quality = "low (correction pass triggered)"
        personalized_html = await run_targeted_correction_pass(personalized_html, research_payload, missing_elements)
        still_missing = verify_personalized_content(personalized_html, research_payload)
        if still_missing:
            personalization_quality = "failed (retained correction pass)"
        else:
            personalization_quality = "high (after correction)"
            
    debug_data = {
        "template": folder_name,
        "research_score": research_payload.get("confidence_score", 0),
        "research_status": research_payload.get("research_status", "failed"),
        "research_sources": research_sources,
        "services_found": len(research_payload.get("services") or []),
        "reviews_found": len(research_payload.get("reviews") or []),
        "address_found": bool(research_payload.get("address")),
        "personalization_quality": personalization_quality,
        "missing_elements": missing_elements
    }
    
    logger.info("Builder Debug Output:")
    logger.info(json.dumps(debug_data, indent=2))

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
        "js": full_js,
        "debug_data": debug_data
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
            4. If the user wants to build a personal portfolio, resume, or CV website: Proactively ask them: "Do you have a resume file (PDF/Text) or a LinkedIn profile link that you'd like me to refer to? If so, you can upload the resume or paste the link here so I can deeply analyze your career history and projects."
            
        Be conversational but don't waste time. Ask one question at a time.
        - If the user provides a business name (e.g., a restaurant, doctor's clinic, agency, etc.), acknowledge it and enthusiastically mention that you will perform a deep online search to pull their real-world location, reviews, menus, and services to make their landing page highly accurate and customized.
        
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
        import g4f
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
