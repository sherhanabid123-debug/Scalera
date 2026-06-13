with open("ram_singh_app.py", "r") as f:
    code = f.read()

# Disable pywebview by adding a return immediately after try or just removing it.
import re
new_code = re.sub(
    r'(    # Try opening using pywebview for a native app experience\n    try:\n        import webview).*?(    # Try opening Google Chrome in app mode \(app mode hides browser controls\))',
    r'\2',
    code,
    flags=re.DOTALL
)

with open("ram_singh_app.py", "w") as f:
    f.write(new_code)
