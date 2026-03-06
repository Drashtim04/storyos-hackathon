from __future__ import annotations

from typing import Any
from pydantic import BaseModel, Field


class EpisodeArcItem(BaseModel):
    number: int
    title: str
    beats: list[str]
    tension: str
    type: str


class EmotionalDataPoint(BaseModel):
    episode: str
    tension: int
    joy: int
    surprise: int
    conflict: int


class CliffhangerItem(BaseModel):
    episode: str
    score: int
    label: str


class HeatmapSegment(BaseModel):
    label: str
    risk: int


class RetentionRow(BaseModel):
    episode: str
    segments: list[HeatmapSegment]


class OptimizationSuggestion(BaseModel):
    type: str  # critical | improvement | suggestion
    title: str
    description: str
    impact: str  # High | Medium | Low
    episodes: list[str]


class StoryAnalysis(BaseModel):
    id: str | None = None
    story_idea: str
    episode_arc: list[EpisodeArcItem]
    emotional_arc: list[EmotionalDataPoint]
    cliffhanger_scores: list[CliffhangerItem]
    retention_heatmap: list[RetentionRow]
    optimization_suggestions: list[OptimizationSuggestion]
    share_token: str | None = None
    created_at: str | None = None


class RunAnalysisResponse(BaseModel):
    analysis: StoryAnalysis
    share_url: str | None = None
