from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
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

@app.post("/api/chat")
async def chat(request: ChatRequest):
    from .engine.generator import chat_with_ai
    response = await chat_with_ai(request.messages)
    return {"status": "success", "reply": response}

@app.post("/api/generate")
async def generate(request: GenerateRequest):
    result = await generate_website(
        chat_history=request.chat_history
    )
    return {
        "status": "success",
        "html": result["html"],
        "css": result["css"],
        "js": result["js"],
    }

@app.get("/")
def root():
    return {"message": "Scalera AI Backend is running"}
