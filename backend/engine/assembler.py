import json
import re
import datetime
from .components.library import COMPONENTS, GLOBAL_STYLES, GLOBAL_JS

async def assemble_modular_site(blueprint: dict, data: dict) -> dict:
    """
    Stitches together a website from components based on a blueprint.
    """
    html_sections = []
    css_sections = [GLOBAL_STYLES]
    
    # Iterate through requested sections
    sections_to_build = blueprint.get("sections", ["Hero", "About", "Services", "Contact"])
    
    for section_name in sections_to_build:
        section_key = section_name.lower().split("/")[0] # handle "Portfolio/Work"
        
        if section_key in COMPONENTS:
            # Pick a variant (default to first one if not specified)
            variant_name = blueprint.get("variants", {}).get(section_key, list(COMPONENTS[section_key].keys())[0])
            component = COMPONENTS[section_key][variant_name]
            
            section_html = component["html"]
            section_css = component["css"]
            
            # ──────────────────────────────────────────────
            # Data Injection logic
            # ──────────────────────────────────────────────
            
            # 1. Map Data to Hero
            if section_key == "hero":
                section_html = section_html.replace("[HERO_TITLE]", data.get("full_name") or data.get("business_name") or "Your Vision")
                section_html = section_html.replace("[HERO_SUBTITLE]", data.get("bio") or data.get("professional_title") or data.get("description") or "Building the future.")
                section_html = section_html.replace("[CTA_TEXT]", "Get Started")
                section_html = section_html.replace("[TAGLINE]", data.get("site_type", "Portfolio").upper())
                section_html = section_html.replace("[HERO_IMAGE]", "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80")
            
            # 2. Map Data to About
            elif section_key == "about":
                bio_text = data.get("bio") or data.get("description") or "We believe in creating digital excellence."
                section_html = section_html.replace("[ABOUT_TEXT]", f"<p>{bio_text}</p>")
            
            # 3. Map Data to Services
            elif section_key == "services":
                items = data.get("services") or data.get("skills") or ["Design", "Development", "Strategy"]
                items_html = ""
                item_template = COMPONENTS["services"]["grid"]["item_html"]
                
                for i, item in enumerate(items):
                    title = ""
                    desc = ""
                    if isinstance(item, dict):
                        title = item.get("title") or item.get("role") or "Expertise"
                        desc = item.get("description") or item.get("company") or "Professional service delivery."
                    else:
                        title = item
                        desc = "Expert professional services tailored to your needs."
                    
                    # Cycle icons
                    icons = ["⚡", "🎨", "🚀", "🛠️", "💎"]
                    icon = icons[i % len(icons)]
                    
                    item_chunk = item_template.replace("[TITLE]", str(title))
                    item_chunk = item_chunk.replace("[DESC]", str(desc))
                    item_chunk = item_chunk.replace("[ICON]", icon)
                    items_html += item_chunk
                
                section_html = section_html.replace("[SERVICES_ITEMS]", items_html)
            
            # 4. Map Data to Contact
            elif section_key == "contact":
                biz_name = data.get("business_name") or data.get("full_name") or "Us"
                section_html = section_html.replace("Let's Collaborate", f"Work with {biz_name}")
                
            html_sections.append(section_html)
            css_sections.append(section_css)

    # Wrap in standard HTML shell
    biz_display_name = data.get('business_name') or data.get('full_name') or 'Scalera Site'
    logo_text = biz_display_name.split()[0] if ' ' in biz_display_name else biz_display_name
    
    full_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{biz_display_name}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
    {' '.join(css_sections)}
    </style>
</head>
<body>
    <nav class="container" style="padding: 30px 40px; display: flex; justify-content: space-between; align-items: center; position: absolute; top: 0; left: 0; right: 0; z-index: 100;">
        <div class="logo" style="font-size: 1.5rem; font-weight: 800; color: var(--accent-color);">{logo_text}.</div>
        <div class="links" style="display: flex; gap: 30px; font-size: 0.9rem; font-weight: 500; opacity: 0.8;">
            <a href="#about" style="color: #fff; text-decoration: none;">About</a>
            <a href="#services" style="color: #fff; text-decoration: none;">Services</a>
            <a href="#contact" style="color: #fff; text-decoration: none;">Contact</a>
        </div>
    </nav>

    {' '.join(html_sections)}

    <footer style="padding: 60px 0; border-top: 1px solid var(--glass-border); text-align: center; opacity: 0.6; font-size: 0.8rem;">
        <div class="container">
            <p>&copy; {datetime.datetime.now().year} {biz_display_name}. All rights reserved.</p>
        </div>
    </footer>

    <script>
    {GLOBAL_JS}
    </script>
</body>
</html>"""

    return {
        "html": full_html,
        "css": "", # Integrated into HTML for modular simplicity
        "js": ""
    }
