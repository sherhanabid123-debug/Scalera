import sys
import traceback
from fastapi import FastAPI

try:
    from backend.main import app
except Exception as e:
    tb = traceback.format_exc()
    app = FastAPI()
    
    @app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
    async def fallback(path: str):
        return {
            "status": "error",
            "message": "Initialization failed",
            "traceback": tb,
            "sys_path": sys.path
        }
