import os
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from .engine.generator import generate_website

app = FastAPI()

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

from fastapi import UploadFile, File, Form
from typing import Optional

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
        
    # Merge data (basic merge for now)
    merged = {**resume_data, **link_data}
    
    return {
        "status": "success",
        "data": merged
    }

@app.get("/")
def root():
    return {"message": "Scalera AI Backend is running"}
@app.get("/api/status")
async def status():
    from .engine.generator import GROQ_API_KEY, GEMINI_API_KEY
    return {
        "groq_loaded": bool(GROQ_API_KEY),
        "gemini_loaded": bool(GEMINI_API_KEY),
        "groq_prefix": GROQ_API_KEY[:4] if GROQ_API_KEY else None,
        "gemini_prefix": GEMINI_API_KEY[:4] if GEMINI_API_KEY else None
    }
