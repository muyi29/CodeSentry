from fastapi import FastAPI
from app.api.v1 import routes

app = FastAPI(title="CodeSentry - AI Code Review Assistant")

app.include_router(routes.router, prefix="/api/v1")
