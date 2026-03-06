from __future__ import annotations

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.models import StoryAnalysis, RunAnalysisResponse
from app.services.analysis import run_analysis
from app.services.storage import save_analysis, get_analysis_by_id, get_analysis_by_share_token
from dotenv import load_dotenv
load_dotenv()

app = FastAPI(
    title="NarrativeIQ API",
    description="AI Storytelling Intelligence Platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", settings.app_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/analyze", response_model=RunAnalysisResponse)
async def analyze_story(body: dict):
    """Run full analysis pipeline on a story idea and optionally persist to Supabase."""
    story_idea = body.get("story_idea") or body.get("storyIdea")
    if not story_idea or not isinstance(story_idea, str):
        raise HTTPException(status_code=400, detail="story_idea is required")
    story_idea = story_idea.strip()
    if not story_idea:
        raise HTTPException(status_code=400, detail="story_idea cannot be empty")

    analysis = await run_analysis(story_idea)
    analysis = save_analysis(analysis)

    share_url = None
    if analysis.share_token and settings.app_url:
        share_url = f"{settings.app_url.rstrip('/')}/share/{analysis.share_token}"

    return RunAnalysisResponse(analysis=analysis, share_url=share_url)


@app.get("/api/analysis/{analysis_id}", response_model=StoryAnalysis)
def get_analysis(analysis_id: str):
    """Get analysis by ID."""
    analysis = get_analysis_by_id(analysis_id)
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return analysis


@app.get("/api/share/{share_token}", response_model=StoryAnalysis)
def get_shared_analysis(share_token: str):
    """Get analysis by share token (for shareable links)."""
    analysis = get_analysis_by_share_token(share_token)
    if not analysis:
        raise HTTPException(status_code=404, detail="Shared analysis not found")
    return analysis

