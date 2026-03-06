"""backend.app.services.llm_service

Groq LLM integration for the analysis pipeline.

Required public API:
- call_llm(prompt: str) -> str   (async): calls Groq model llama3-70b-8192 and returns text

This module also provides structured helper functions used by the analysis pipeline:
- generate_episode_arc(story_idea)
- analyze_emotional_arc(episodes)
- score_cliffhangers(episodes)
- predict_retention(episodes)
- generate_optimization_suggestions(episodes)

Each structured function prompts the LLM to return JSON and validates it against existing
Pydantic models, preserving the API output format expected by the frontend.
"""

from __future__ import annotations

import json
import logging
import re
from typing import Any

from groq import AsyncGroq

from app.config import settings
from app.models import (
    EpisodeArcItem,
    EmotionalDataPoint,
    CliffhangerItem,
    RetentionRow,
    HeatmapSegment,
    OptimizationSuggestion,
)

logger = logging.getLogger(__name__)

DEFAULT_GROQ_MODEL = "llama3-70b-8192"


def _groq_api_key() -> str:
    # settings.groq_api_key is populated from env (and config.py calls load_dotenv()).
    return (settings.groq_api_key or "").strip()


def _groq_model() -> str:
    # Support optional GROQ_MODEL override, but default to required model.
    # We keep the required default model per requirements.
    return DEFAULT_GROQ_MODEL


def _groq_client() -> AsyncGroq:
    api_key = _groq_api_key()
    if not api_key:
        raise RuntimeError(
            "Missing GROQ_API_KEY. Add it to backend/.env (loaded via python-dotenv) or your environment."
        )
    return AsyncGroq(api_key=api_key)


async def call_llm(prompt: str) -> str:
    """Send `prompt` to Groq and return the text response."""
    if not prompt or not prompt.strip():
        raise ValueError("prompt cannot be empty")

    try:
        resp = await _groq_client().chat.completions.create(
            model=_groq_model(),
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
        )
        content = resp.choices[0].message.content if resp.choices else None
        if not content:
            raise RuntimeError("Empty LLM response")
        return content
    except (RuntimeError, ValueError):
        raise
    except Exception as e:
        logger.exception("Groq request failed")
        raise RuntimeError("LLM request failed") from e


def _extract_json_object(text: str) -> dict[str, Any]:
    """Best-effort extraction of a single JSON object from model text."""
    text = (text or "").strip()
    try:
        parsed = json.loads(text)
        if isinstance(parsed, dict):
            return parsed
    except Exception:
        pass

    m = re.search(r"\{[\s\S]*\}", text)
    if not m:
        raise ValueError("LLM did not return JSON")
    return json.loads(m.group(0))


async def generate_episode_arc(story_idea: str) -> list[EpisodeArcItem]:
    prompt = f"""You are a TV series story analyst.

Given the story idea below, output ONLY valid JSON.

Story idea:
{story_idea}

Return a single JSON object with key "episodes", which is an array of 5 to 8 episode objects.
Each episode object must have:
- number (integer, 1-based)
- title (string)
- beats (array of 3-5 strings)
- tension (string)
- type (one of: Setup, Rising, Escalation, Midpoint, Climax Build, Climax, Resolution)

JSON ONLY."""

    text = await call_llm(prompt)
    data = _extract_json_object(text)
    raw = data.get("episodes", [])
    items: list[EpisodeArcItem] = []
    for i, obj in enumerate(raw):
        if isinstance(obj, dict):
            obj["number"] = i + 1
        items.append(EpisodeArcItem.model_validate(obj))
    return items


async def analyze_emotional_arc(episodes: list[EpisodeArcItem]) -> list[EmotionalDataPoint]:
    episodes_json = json.dumps([e.model_dump() for e in episodes], ensure_ascii=False)
    prompt = f"""You are an emotional arc analyst for TV series.

Given the episode list below, output ONLY valid JSON.

Episodes:
{episodes_json}

Return a single JSON object with key "emotional_arc" that is an array of one object per episode.
Each object must have:
- episode (string exactly "Ep 1" .. "Ep N")
- tension (int 0-100)
- joy (int 0-100)
- surprise (int 0-100)
- conflict (int 0-100)

JSON ONLY."""

    text = await call_llm(prompt)
    data = _extract_json_object(text)
    raw = data.get("emotional_arc", [])
    out: list[EmotionalDataPoint] = []
    for i, obj in enumerate(raw):
        if isinstance(obj, dict):
            obj["episode"] = obj.get("episode") or f"Ep {i + 1}"
        out.append(EmotionalDataPoint.model_validate(obj))
    return out


async def score_cliffhangers(episodes: list[EpisodeArcItem]) -> list[CliffhangerItem]:
    episodes_json = json.dumps([e.model_dump() for e in episodes], ensure_ascii=False)
    prompt = f"""You are a cliffhanger analyst for TV series.

Given the episode list below, output ONLY valid JSON.

Episodes:
{episodes_json}

Return a single JSON object with key "cliffhanger_scores", one object per episode.
Each object must have:
- episode ("Ep 1" .. "Ep N")
- score (int 0-100)
- label (one of: Solid, Moderate, Excellent, Exceptional, Strong, Needs Work; for final episode use Season Hook)

JSON ONLY."""

    text = await call_llm(prompt)
    data = _extract_json_object(text)
    raw = data.get("cliffhanger_scores", [])
    out: list[CliffhangerItem] = []
    for i, obj in enumerate(raw):
        if isinstance(obj, dict):
            obj["episode"] = obj.get("episode") or f"Ep {i + 1}"
        out.append(CliffhangerItem.model_validate(obj))
    return out


async def predict_retention(episodes: list[EpisodeArcItem]) -> list[RetentionRow]:
    episodes_json = json.dumps([e.model_dump() for e in episodes], ensure_ascii=False)
    prompt = f"""You are a retention risk analyst for TV series.

Given the episode list below, output ONLY valid JSON.

Episodes:
{episodes_json}

Return a single JSON object with key "retention_heatmap".
It must be an array of one object per episode.
Each episode object must have:
- episode ("Ep 1" .. "Ep N")
- segments: exactly 5 objects IN THIS ORDER: Opening, Act 1, Mid, Act 2, Ending
Each segment object must have:
- label (Opening | Act 1 | Mid | Act 2 | Ending)
- risk (int 0-100)

JSON ONLY."""

    text = await call_llm(prompt)
    data = _extract_json_object(text)
    raw = data.get("retention_heatmap", [])
    segment_labels = ["Opening", "Act 1", "Mid", "Act 2", "Ending"]

    out: list[RetentionRow] = []
    for i, obj in enumerate(raw):
        if not isinstance(obj, dict):
            continue
        episode_label = obj.get("episode") or f"Ep {i + 1}"
        segs = obj.get("segments", []) or []
        by_label = {s.get("label"): s for s in segs if isinstance(s, dict)}
        segments = [
            HeatmapSegment(
                label=label,
                risk=max(0, min(100, int(by_label.get(label, {}).get("risk", 10)))),
            )
            for label in segment_labels
        ]
        out.append(RetentionRow(episode=episode_label, segments=segments))
    return out


async def generate_optimization_suggestions(
    episodes: list[EpisodeArcItem],
) -> list[OptimizationSuggestion]:
    episodes_json = json.dumps([e.model_dump() for e in episodes], ensure_ascii=False)
    prompt = f"""You are a story optimization analyst for TV series.

Given the episode list below, output ONLY valid JSON.

Episodes:
{episodes_json}

Return a single JSON object with key "optimization_suggestions" which is an array of 3 to 6 objects.
Each object must have:
- type (critical | improvement | suggestion)
- title (string)
- description (string)
- impact (High | Medium | Low)
- episodes (array of strings like ["Ep 2", "Ep 5"])

JSON ONLY."""

    text = await call_llm(prompt)
    data = _extract_json_object(text)
    raw = data.get("optimization_suggestions", [])
    return [OptimizationSuggestion.model_validate(obj) for obj in raw]

