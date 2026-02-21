from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.routers import drinks

app = FastAPI(
    title="DrinksDB API",
    description="API for managing and discovering cocktail recipes",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(drinks.router)

frontend_path = Path(__file__).parent.parent / "frontend"
images_path = Path(__file__).parent.parent / "images"

if images_path.exists():
    app.mount("/images", StaticFiles(directory=str(images_path)), name="images")

if frontend_path.exists():
    app.mount(
        "/", StaticFiles(directory=str(frontend_path), html=True), name="frontend"
    )


@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "DrinksDB"}
