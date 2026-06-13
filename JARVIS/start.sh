#!/bin/bash

# J.A.R.V.I.S. Desktop Application Launcher

CDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$CDIR"

echo "============================================="
echo "   J.A.R.V.I.S. DESKTOP APP"
echo "============================================="

# 1. Activate virtual environment
if [ -d "../.venv" ]; then
    echo "Activating Scalera environment..."
    source ../.venv/bin/activate
elif [ -d ".venv" ]; then
    echo "Activating local environment..."
    source .venv/bin/activate
else
    echo "Creating virtual environment..."
    python3 -m venv .venv
    source .venv/bin/activate
    pip install --upgrade pip -q
fi

# 2. Install dependencies (quiet, only if missing)
python3 -c "import fastapi, uvicorn, dotenv" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "Installing dependencies..."
    pip install fastapi uvicorn python-dotenv pydantic -q
fi

# 3. Launch the desktop app
echo "Launching J.A.R.V.I.S. ..."
python3 jarvis_app.py
