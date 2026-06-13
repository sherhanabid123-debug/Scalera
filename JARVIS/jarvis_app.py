"""
JARVIS — Desktop Application Launcher
Starts FastAPI backend in a background thread.
Opens Google Chrome in app mode pointing to JARVIS.
"""

import threading
import time
import sys
import os
import subprocess
import webbrowser

def main():
    url = 'http://127.0.0.1:8008'

    # Try opening Google Chrome in app mode (app mode hides browser controls)
    opened = False
    if sys.platform == 'darwin':
        chrome_bin = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
        if os.path.exists(chrome_bin):
            try:
                subprocess.Popen([chrome_bin, f"--app={url}"])
                opened = True
                print("Launched JARVIS directly via Google Chrome binary.")
            except Exception:
                pass
        
        if not opened:
            try:
                res = subprocess.run(["open", "-a", "Google Chrome", "--args", f"--app={url}"], capture_output=True)
                if res.returncode == 0:
                    opened = True
                    print("Launched JARVIS in Chrome App mode fallback.")
            except Exception:
                pass

    if not opened:
        # Fallback to default browser
        print("Falling back to default web browser...")
        webbrowser.open(url)

    # Start the server in the main thread with reload=True
    import uvicorn
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8008,
        log_level="warning",
        reload=True
    )

if __name__ == '__main__':
    main()
