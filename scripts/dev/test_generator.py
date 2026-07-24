import urllib.request
import json

def test_generation():
    url = "http://localhost:8000/api/generate"
    payload = {
        "chat_history": "I want to build a dental clinic website. It should be called SmileCraft. Modern dental clinic in Copenhagen.",
        "data": {
            "business_name": "SmileCraft Dental",
            "site_type": "dental-clinic",
            "bio": "Premium dental treatments and cosmetic dentistry in Copenhagen."
        }
    }
    
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            if res_data.get("status") == "success":
                print("✅ API Request successful!")
                html = res_data.get("html", "")
                css = res_data.get("css", "")
                js = res_data.get("js", "")
                
                print(f"HTML size: {len(html)} bytes")
                print(f"CSS size: {len(css)} bytes")
                print(f"JS size: {len(js)} bytes")
                
                # Print title and snippet of HTML
                import re
                title_match = re.search(r"<title>(.*?)</title>", html, re.IGNORECASE)
                if title_match:
                    print(f"HTML Title: {title_match.group(1)}")
                
                body_match = re.search(r"<body>(.*?)</body>", html, re.DOTALL | re.IGNORECASE)
                if body_match:
                    print("Body snippet:\n", body_match.group(1)[:500])
                
                # Check for template elements
                if "SmileCraft Dental" in html or "Copenhagen" in html or "smilecraft" in html.lower():
                    print("✅ Personalization was successful! User data found in HTML.")
                else:
                    print("⚠️ Personalization content not found in HTML.")
                    
                # Check for link/script preservation or css/js contents
                if css and js:
                    print("✅ CSS and JS payloads returned successfully!")
                else:
                    print("❌ CSS or JS payload is empty!")
                    
                if "styles.css" in html:
                    print("✅ Link to styles.css preserved in HTML!")
                else:
                    print("❌ Link to styles.css missing from HTML!")
                    
                if "script.js" in html:
                    print("✅ Script tag for script.js preserved in HTML!")
                else:
                    print("❌ Script tag for script.js missing from HTML!")
            else:
                print("❌ API failed:", res_data)
    except Exception as e:
        print("❌ Request failed:", e)

if __name__ == "__main__":
    test_generation()
