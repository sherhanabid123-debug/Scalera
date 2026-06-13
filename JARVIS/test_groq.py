import json
import urllib.request
import urllib.error

with open("chat_history.json") as f:
    hist = json.load(f)

payload = json.dumps({"messages": hist})
req = urllib.request.Request("http://127.0.0.1:8008/api/groq", data=payload.encode(), headers={"Content-Type": "application/json"})
try:
    with urllib.request.urlopen(req) as response:
        print("STATUS:", response.status)
        print(response.read().decode())
except urllib.error.HTTPError as e:
    print("HTTP ERROR:", e.code)
    print(e.read().decode())
