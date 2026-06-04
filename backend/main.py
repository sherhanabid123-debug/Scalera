import os
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, UploadFile, File, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional
import json

from .engine.generator import generate_website

app = FastAPI()

class VercelPathMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            path = scope.get("path", "")
            if path.startswith("/api/index.py"):
                new_path = path.replace("/api/index.py", "", 1)
                if not new_path.startswith("/"):
                    new_path = "/" + new_path
                scope["path"] = new_path
        await self.app(scope, receive, send)

app.add_middleware(VercelPathMiddleware)

# Allow frontend to access the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    messages: list

class GenerateRequest(BaseModel):
    chat_history: str
    data: Optional[dict] = None

class EditRequest(BaseModel):
    html: str
    css: str
    prompt: str

@app.post("/api/chat")
async def chat(request: ChatRequest):
    from .engine.generator import chat_with_ai
    response = await chat_with_ai(request.messages)
    return {"status": "success", "reply": response}

@app.post("/api/generate")
async def generate(request: GenerateRequest):
    result = await generate_website(
        chat_history=request.chat_history,
        data=request.data
    )
    return {
        "status": "success",
        "html": result["html"],
        "css": result["css"],
        "js": result["js"],
    }

@app.post("/api/import/linkedin")
async def import_linkedin(request: dict):
    from .engine.generator import extract_data_from_link
    link = request.get("link")
    data = await extract_data_from_link(link)
    return {"status": "success", "data": data}

@app.post("/api/import/google")
async def import_google(request: dict):
    from .engine.generator import extract_business_data
    link = request.get("link")
    data = await extract_business_data(link)
    return {"status": "success", "data": data}

@app.post("/api/edit")
async def edit(request: EditRequest):
    from .engine.generator import edit_website
    result = await edit_website(
        html=request.html,
        css=request.css,
        prompt=request.prompt
    )
    return {
        "status": "success",
        "html": result["html"],
        "css": result["css"]
    }

@app.post("/api/extract")
async def extract(
    file: Optional[UploadFile] = File(None),
    link: Optional[str] = Form(None)
):
    from .engine.generator import extract_data_from_resume, extract_data_from_link
    
    resume_data = {}
    if file:
        content = await file.read()
        resume_data = await extract_data_from_resume(content, file.filename)
    
    link_data = {}
    if link:
        link_data = await extract_data_from_link(link)
        
    merged = {**resume_data, **link_data}
    
    return {
        "status": "success",
        "data": merged
    }

@app.post("/api/interpret")
async def interpret(request: dict):
    from .engine.generator import interpret_vision
    description = request.get("description")
    blueprint = await interpret_vision(description)
    return {"status": "success", "data": blueprint}

@app.post("/api/edit-section")
async def edit_section(request: dict):
    from .engine.generator import edit_section_content
    section_html = request.get("html")
    instruction = request.get("prompt")
    section_type = request.get("type")
    
    new_html = await edit_section_content(section_html, instruction, section_type)
    return {"status": "success", "data": new_html}

@app.get("/scalera-ai")
async def serve_dashboard():
    return FileResponse("public/scalera-ai.html")

if os.path.exists("public"):
    app.mount("/", StaticFiles(directory="public", html=True), name="public")

@app.get("/")
def root():
    return FileResponse("public/index.html")

class RevampRequest(BaseModel):
    url: str

@app.post("/api/revamp-audit")
async def revamp_audit(request: RevampRequest):
    from .engine.generator import audit_website
    result = await audit_website(request.url)
    return {"status": "success", "data": result}
