from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import routes
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(
    title="CodeSentry - AI Code Review Assistant",
    description="Automated code review using AI to analyze GitHub pull requests",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(routes.router, prefix="/api/v1", tags=["reviews"])

@app.get("/")
async def root():
    return {
        "message": "CodeSentry API",
        "version": "1.0.0",
        "docs": "/docs"
    }