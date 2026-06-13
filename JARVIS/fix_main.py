import sys

with open("main.py", "r") as f:
    lines = f.readlines()

new_lines = []
skip = False
for i, line in enumerate(lines):
    if i == 611: # Line 612: # 11. WHATSAPP
        skip = True
        new_lines.append("        # 11. WHATSAPP\n")
        new_lines.append("        wa_match = re.search(r'\\[[A-Z]*WHATSAPP:\\s*([^|]+)\\|([^\\]]+)\\]', reply, re.IGNORECASE)\n")
        new_lines.append("        if wa_match and not has_tool:\n")
        new_lines.append("            contact_name = wa_match.group(1).strip()\n")
        new_lines.append("            message = wa_match.group(2).strip()\n")
        new_lines.append("            try:\n")
        new_lines.append("                applescript = f'''\n")
        new_lines.append("                tell application \"WhatsApp\" to activate\n")
        new_lines.append("                delay 1.5\n")
        new_lines.append("                tell application \"System Events\"\n")
        new_lines.append("                    tell process \"WhatsApp\"\n")
        new_lines.append("                        keystroke \"f\" using command down\n")
        new_lines.append("                        delay 1\n")
        new_lines.append("                        keystroke \"{contact_name}\"\n")
        new_lines.append("                        delay 2\n")
        new_lines.append("                        key code 36\n")
        new_lines.append("                        delay 1\n")
        new_lines.append("                        keystroke \"{message}\"\n")
        new_lines.append("                        delay 0.5\n")
        new_lines.append("                        key code 36\n")
        new_lines.append("                    end tell\n")
        new_lines.append("                end tell\n")
        new_lines.append("                '''\n")
        new_lines.append("                import subprocess\n")
        new_lines.append("                subprocess.run([\"osascript\", \"-e\", applescript])\n")
        new_lines.append("                tool_content = f\"WhatsApp message successfully sent to {contact_name}.\"\n")
        new_lines.append("                has_tool = True\n")
        new_lines.append("            except Exception as e:\n")
        new_lines.append("                tool_content = f\"WhatsApp delivery failed: {e}\"\n")
        new_lines.append("                has_tool = True\n")
    elif i == 833: # Line 834:         if has_tool:
        skip = False
    
    if not skip:
        new_lines.append(line)

with open("main.py", "w") as f:
    f.writelines(new_lines)
