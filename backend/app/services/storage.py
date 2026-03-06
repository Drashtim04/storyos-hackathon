from __future__ import annotations

import secrets
from app.db import get_supabase
from app.models import StoryAnalysis


def save_analysis(analysis: StoryAnalysis) -> StoryAnalysis:
    supabase = get_supabase()
    share_token = secrets.token_urlsafe(16)
    payload = {
        "story_idea": analysis.story_idea,
        "episode_arc": [e.model_dump() for e in analysis.episode_arc],
        "emotional_arc": [e.model_dump() for e in analysis.emotional_arc],
        "cliffhanger_scores": [c.model_dump() for c in analysis.cliffhanger_scores],
        "retention_heatmap": [
            {"episode": r.episode, "segments": [s.model_dump() for s in r.segments]}
            for r in analysis.retention_heatmap
        ],
        "optimization_suggestions": [o.model_dump() for o in analysis.optimization_suggestions],
        "share_token": share_token,
    }
    if supabase:
        row = supabase.table("story_analyses").insert(payload).execute()
        if row.data and len(row.data) > 0:
            d = row.data[0]
            analysis.id = d.get("id")
            analysis.share_token = d.get("share_token", share_token)
            analysis.created_at = d.get("created_at")
            return analysis
    analysis.share_token = share_token
    return analysis


def get_analysis_by_id(analysis_id: str) -> StoryAnalysis | None:
    supabase = get_supabase()
    if not supabase:
        return None
    row = supabase.table("story_analyses").select("*").eq("id", analysis_id).execute()
    if not row.data or len(row.data) == 0:
        return None
    return _row_to_analysis(row.data[0])


def get_analysis_by_share_token(token: str) -> StoryAnalysis | None:
    supabase = get_supabase()
    if not supabase:
        return None
    row = supabase.table("story_analyses").select("*").eq("share_token", token).execute()
    if not row.data or len(row.data) == 0:
        return None
    return _row_to_analysis(row.data[0])


def _row_to_analysis(d: dict) -> StoryAnalysis:
    from app.models import (
        EpisodeArcItem,
        EmotionalDataPoint,
        CliffhangerItem,
        RetentionRow,
        HeatmapSegment,
        OptimizationSuggestion,
    )
    return StoryAnalysis(
        id=str(d["id"]),
        story_idea=d["story_idea"],
        episode_arc=[EpisodeArcItem(**x) for x in d["episode_arc"]],
        emotional_arc=[EmotionalDataPoint(**x) for x in d["emotional_arc"]],
        cliffhanger_scores=[CliffhangerItem(**x) for x in d["cliffhanger_scores"]],
        retention_heatmap=[
            RetentionRow(
                episode=r["episode"],
                segments=[HeatmapSegment(**s) for s in r["segments"]],
            )
            for r in d["retention_heatmap"]
        ],
        optimization_suggestions=[
            OptimizationSuggestion(**x) for x in d["optimization_suggestions"]
        ],
        share_token=d.get("share_token"),
        created_at=d.get("created_at"),
    )
