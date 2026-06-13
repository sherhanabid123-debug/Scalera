import os

def main():
    filepath = "/Users/yogiraj/.gemini/antigravity-ide/scratch/Scalera/JARVIS/index.html"
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return

    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Replacements
    # 1. Colors
    content = content.replace("rgba(0, 255, 210", "rgba(0, 255, 102")
    content = content.replace("rgba(0,255,210", "rgba(0,255,102")
    content = content.replace("#00ffd2", "#00ff66")
    content = content.replace("#00e676", "#00ff66")
    
    # 2. Voice prioritization (Prefer Siri, Alex, Samantha, Daniel, Oliver)
    old_voice_logic = "v.name.includes('Daniel') || v.name.includes('Oliver') || v.name.includes('Google UK English Male')"
    new_voice_logic = "v.name.includes('Siri') || v.name.includes('Alex') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Oliver')"
    content = content.replace(old_voice_logic, new_voice_logic)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
        
    print("Theme and voice logic updated successfully in index.html.")

if __name__ == "__main__":
    main()
