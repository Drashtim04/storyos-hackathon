"""
AI storytelling analysis pipeline.
Generates episodic arc (5-8 episodes), emotional progression, cliffhanger scores,
retention risk heatmap, and optimization suggestions from a story idea.
Uses LLM when GROQ_API_KEY is set; falls back to deterministic logic otherwise.
"""
from __future__ import annotations

import hashlib
import logging
import statistics
from app.config import settings
from app.models import (
    StoryAnalysis,
    StoryScore,
    StoryScoreBreakdown,
    EpisodeArcItem,
    EmotionalDataPoint,
    CliffhangerItem,
    RetentionRow,
    HeatmapSegment,
    OptimizationSuggestion,
)

logger = logging.getLogger(__name__)


def calculate_story_score(analysis_data: dict) -> StoryScore:
    """
    Calculate overall story quality score from analysis components.
    
    Considers:
    - Cliffhanger Strength: Average of all cliffhanger scores (0-100)
    - Emotional Progression: Consistency of emotional arc across episodes
    - Retention Stability: Stability of retention risk across episodes
    
    Returns StoryScore with overall score and breakdown.
    """
    # 1. Cliffhanger Strength: average of all cliffhanger scores
    cliffhanger_scores = analysis_data.get("cliffhanger_scores", [])
    if cliffhanger_scores:
        cliffhanger_strength = sum(c["score"] for c in cliffhanger_scores) / len(cliffhanger_scores)
    else:
        cliffhanger_strength = 50.0
    
    # 2. Emotional Progression: consistency of emotional arcs
    emotional_arc = analysis_data.get("emotional_arc", [])
    if len(emotional_arc) > 1:
        # Get all emotional dimensions
        tensions = [e["tension"] for e in emotional_arc]
        joys = [e["joy"] for e in emotional_arc]
        surprises = [e["surprise"] for e in emotional_arc]
        conflicts = [e["conflict"] for e in emotional_arc]
        
        # Calculate standard deviations to measure consistency
        std_tension = statistics.stdev(tensions) if len(tensions) > 1 else 0
        std_joy = statistics.stdev(joys) if len(joys) > 1 else 0
        std_surprise = statistics.stdev(surprises) if len(surprises) > 1 else 0
        std_conflict = statistics.stdev(conflicts) if len(conflicts) > 1 else 0
        
        # Average std dev across all dimensions
        avg_std = (std_tension + std_joy + std_surprise + std_conflict) / 4
        
        # Convert to score: lower variance = more consistent = higher score
        # Normalize: if std is 0-30, map to 80-100. If > 30, decrease linearly.
        emotional_progression = max(0, min(100, 100 - (avg_std * 1.5)))
    else:
        emotional_progression = 50.0
    
    # 3. Retention Stability: stability of retention risk across episodes
    retention_heatmap = analysis_data.get("retention_heatmap", [])
    retention_risks = []
    for row in retention_heatmap:
        for segment in row.get("segments", []):
            retention_risks.append(segment.get("risk", 0))
    
    if retention_risks:
        avg_risk = sum(retention_risks) / len(retention_risks)
        # Lower average risk = better stability (score inversely proportional to risk)
        # 0 risk = 100 score, 100 risk = 0 score
        retention_stability = max(0, min(100, 100 - avg_risk))
    else:
        retention_stability = 50.0
    
    # Calculate Binge Potential Score: how addictive is this story?
    # Combines: cliffhanger escalation + emotional intensity + retention resistance
    
    # 1. Cliffhanger Escalation: do cliffhangers improve through the season?
    cliffhanger_escalation = 50.0
    if cliffhanger_scores and len(cliffhanger_scores) > 2:
        first_half_avg = sum(c["score"] for c in cliffhanger_scores[:len(cliffhanger_scores)//2]) / max(1, len(cliffhanger_scores)//2)
        second_half_avg = sum(c["score"] for c in cliffhanger_scores[len(cliffhanger_scores)//2:]) / max(1, len(cliffhanger_scores)//2 + 1)
        escalation = second_half_avg - first_half_avg
        # Normalize escalation: +50 points = +100 score, -50 points = -100 score (but clamped)
        cliffhanger_escalation = max(0, min(100, 50 + escalation))
    
    # 2. Emotional Intensity: peak emotional values indicate compelling moments
    emotional_intensity = 50.0
    if emotional_arc:
        all_emotion_values = []
        for e in emotional_arc:
            all_emotion_values.extend([e["tension"], e["conflict"], e["surprise"]])
        if all_emotion_values:
            peak_emotional = max(all_emotion_values)
            mean_emotional = sum(all_emotion_values) / len(all_emotion_values)
            # Higher peaks and higher average = more compelling
            # Score = (peak_emotional * 0.6 + mean_emotional * 0.4)
            emotional_intensity = (peak_emotional * 0.6 + mean_emotional * 0.4)
    
    # 3. Retention Resistance: how well does it keep viewers watching?
    # Inverse of retention risk - lower risk = better
    retention_resistance = retention_stability  # Already calculated above
    
    # Binge Potential = weighted average of three factors
    # Cliffhanger escalation: 40% (building momentum is key)
    # Emotional intensity: 35% (compelling moments keep you watching)
    # Retention resistance: 25% (overall flow)
    binge_potential = round(
        (cliffhanger_escalation * 0.40) + 
        (emotional_intensity * 0.35) + 
        (retention_resistance * 0.25)
    )
    
    # Calculate overall score as average of three components
    overall_score = round((cliffhanger_strength + emotional_progression + retention_stability) / 3)
    
    return StoryScore(
        score=overall_score,
        breakdown=StoryScoreBreakdown(
            cliffhanger_strength=round(cliffhanger_strength),
            emotional_progression=round(emotional_progression),
            retention_stability=round(retention_stability),
        ),
        binge_potential_score=binge_potential,
    )


async def run_analysis(story_idea: str) -> StoryAnalysis:
    """
    Run the full analysis pipeline. Uses LLM-powered analysis when GROQ_API_KEY
    is set; otherwise uses deterministic logic. Keeps API output format unchanged.
    """
    if settings.groq_api_key:
        try:
            return await _run_llm_analysis(story_idea)
        except Exception as e:
            logger.warning("LLM analysis failed, falling back to deterministic: %s", e)
    return _run_deterministic_analysis(story_idea)


async def _run_llm_analysis(story_idea: str) -> StoryAnalysis:
    """Modular LLM-powered pipeline: episode arc → emotional, cliffhanger, retention, optimization."""
    from app.services import llm_service

    episode_arc = await llm_service.generate_episode_arc(story_idea)
    n = len(episode_arc)

    emotional_arc = await llm_service.analyze_emotional_arc(episode_arc)
    cliffhanger_scores = await llm_service.score_cliffhangers(episode_arc)
    retention_heatmap = await llm_service.predict_retention(episode_arc)
    optimization_suggestions = await llm_service.generate_optimization_suggestions(episode_arc)

    # Ensure one entry per episode so frontend stays consistent
    emotional_arc = emotional_arc[:n]
    cliffhanger_scores = cliffhanger_scores[:n]
    retention_heatmap = retention_heatmap[:n]

    # Calculate story score from all components
    analysis_dict = {
        "cliffhanger_scores": [c.model_dump() for c in cliffhanger_scores],
        "emotional_arc": [e.model_dump() for e in emotional_arc],
        "retention_heatmap": [r.model_dump() for r in retention_heatmap],
    }
    story_score = calculate_story_score(analysis_dict)

    return StoryAnalysis(
        story_idea=story_idea,
        episode_arc=episode_arc,
        emotional_arc=emotional_arc,
        cliffhanger_scores=cliffhanger_scores,
        retention_heatmap=retention_heatmap,
        optimization_suggestions=optimization_suggestions,
        story_score=story_score,
    )


# --- Deterministic fallback (unchanged output shape) ---


def _seed_from_idea(story_idea: str) -> int:
    h = hashlib.sha256(story_idea.encode()).hexdigest()
    return int(h[:8], 16)


def _episode_count(seed: int) -> int:
    return 5 + (seed % 4)


def _run_deterministic_analysis(story_idea: str) -> StoryAnalysis:
    seed = _seed_from_idea(story_idea)
    n_ep = _episode_count(seed)

    episode_arc = _generate_episode_arc(story_idea, n_ep, seed)
    emotional_arc = _generate_emotional_arc(n_ep, seed)
    cliffhanger_scores = _generate_cliffhanger_scores(n_ep, seed)
    retention_heatmap = _generate_retention_heatmap(n_ep, seed)
    optimization_suggestions = _generate_optimization_suggestions(
        n_ep, seed, retention_heatmap
    )

    # Calculate story score from all components
    analysis_dict = {
        "cliffhanger_scores": [c.model_dump() for c in cliffhanger_scores],
        "emotional_arc": [e.model_dump() for e in emotional_arc],
        "retention_heatmap": [r.model_dump() for r in retention_heatmap],
    }
    story_score = calculate_story_score(analysis_dict)

    return StoryAnalysis(
        story_idea=story_idea,
        episode_arc=episode_arc,
        emotional_arc=emotional_arc,
        cliffhanger_scores=cliffhanger_scores,
        retention_heatmap=retention_heatmap,
        optimization_suggestions=optimization_suggestions,
        story_score=story_score,
    )


EPISODE_TYPES = [
    "Setup",
    "Rising",
    "Escalation",
    "Midpoint",
    "Escalation",
    "Climax Build",
    "Climax",
    "Resolution",
]

TENSION_RANGES = [
    "Low → Medium",
    "Medium",
    "Medium → High",
    "High",
    "Very High",
    "Peak",
    "Peak",
    "High → Resolved",
]

BEAT_TEMPLATES = [
    ["Introduce protagonist", "Establish world rules", "Inciting incident", "First cliffhanger"],
    ["Deepen conflict", "Introduce antagonist", "Side-plot B begins", "Reveal stakes"],
    ["Protagonist fails", "Alliance breaks", "Twist reveal", "Point of no return"],
    ["Forced choice", "Backstory reveal", "Betrayal", "New alliance"],
    ["Plan falls apart", "Emotional low point", "Subplot converges", "Desperate gambit"],
    ["Confrontation", "Sacrifice", "Truth revealed", "Rallying cry"],
    ["Final battle begins", "Loss and gain", "Protagonist transformed", "Last twist"],
    ["Resolution", "Aftermath", "Character growth", "Season hook"],
]

TITLES = [
    "The Awakening", "Fractures", "The Descent", "Crossroads",
    "Unraveling", "Reckoning", "The Storm", "New Dawn",
]


def _generate_episode_arc(story_idea: str, n_ep: int, seed: int) -> list[EpisodeArcItem]:
    items = []
    for i in range(n_ep):
        j = i % len(EPISODE_TYPES)
        title = TITLES[j] if j < len(TITLES) else f"Episode {i + 1}"
        beats = BEAT_TEMPLATES[j] if j < len(BEAT_TEMPLATES) else BEAT_TEMPLATES[0]
        tension = TENSION_RANGES[j] if j < len(TENSION_RANGES) else "Medium"
        items.append(
            EpisodeArcItem(
                number=i + 1,
                title=title,
                beats=beats,
                tension=tension,
                type=EPISODE_TYPES[j],
            )
        )
    return items


def _generate_emotional_arc(n_ep: int, seed: int) -> list[EmotionalDataPoint]:
    data = []
    for i in range(n_ep):
        t = (i + 1) / max(n_ep, 1)
        tension = min(100, int(25 + 70 * t + (seed % 10) - 5))
        joy = max(0, min(100, 60 - 50 * t + (seed % 7)))
        surprise = min(100, int(40 + 55 * t + (seed % 5)))
        conflict = min(100, int(15 + 75 * t + (seed % 8)))
        if i == n_ep - 1:
            tension = max(40, tension - 40)
            joy = min(80, joy + 30)
        data.append(
            EmotionalDataPoint(
                episode=f"Ep {i + 1}",
                tension=int(max(0, min(100, tension))),
                joy=int(max(0, min(100, joy))),
                surprise=int(max(0, min(100, surprise))),
                conflict=int(max(0, min(100, conflict))),
)
        )
    return data


def _generate_cliffhanger_scores(n_ep: int, seed: int) -> list[CliffhangerItem]:
    data = []
    for i in range(n_ep):
        base = [72, 58, 89, 94, 81, 97, 91, 45][i % 8]
        score = max(0, min(100, base + (seed % 11) - 5))
        if i == n_ep - 1:
            score = max(35, min(55, score))
        label = "Exceptional" if score >= 90 else "Strong" if score >= 75 else "Moderate" if score >= 60 else "Needs Work"
        if i == n_ep - 1:
            label = "Season Hook"
        data.append(CliffhangerItem(episode=f"Ep {i + 1}", score=score, label=label))
    return data


def _generate_retention_heatmap(n_ep: int, seed: int) -> list[RetentionRow]:
    segments = ["Opening", "Act 1", "Mid", "Act 2", "Ending"]
    rows = []
    for i in range(n_ep):
        segs = []
        for k, label in enumerate(segments):
            risk = (seed + i * 7 + k * 3) % 45
            if k == 2 and i in (1, 4):
                risk = min(100, risk + 25)
            if i == n_ep - 1 and k == 4:
                risk = min(100, 35 + (seed % 15))
            segs.append(HeatmapSegment(label=label, risk=max(2, min(100, risk))))
        rows.append(RetentionRow(episode=f"Ep {i + 1}", segments=segs))
    return rows


def _generate_optimization_suggestions(
    n_ep: int, seed: int, retention_heatmap: list[RetentionRow]
) -> list[OptimizationSuggestion]:
    high_risk_ep = 1
    high_risk_val = 0
    for row in retention_heatmap:
        for s in row.segments:
            if s.risk > high_risk_val:
                high_risk_val = s.risk
                high_risk_ep = int(row.episode.split()[1])
    suggestions = [
        OptimizationSuggestion(
            type="critical",
            title=f"Episode {high_risk_ep} mid-section pacing drop",
            description=f"The middle of Episode {high_risk_ep} shows a {high_risk_val}% retention risk. Consider adding a revelation or action beat.",
            impact="High",
            episodes=[f"Ep {high_risk_ep}"],
        ),
        OptimizationSuggestion(
            type="improvement",
            title="Strengthen mid-season cliffhanger approach",
            description="Move the desperate gambit beat earlier and add a false resolution before the true cliffhanger.",
            impact="High",
            episodes=[f"Ep {min(5, n_ep)}"],
        ),
        OptimizationSuggestion(
            type="suggestion",
            title="Add emotional contrast before climax",
            description="A moment of unexpected levity or warmth before the climax would improve emotional range.",
            impact="Medium",
            episodes=[f"Ep {min(6, n_ep)}"],
        ),
        OptimizationSuggestion(
            type="improvement",
            title="Season finale opening needs stronger hook",
            description="Start with the consequence of the previous twist instead of a flashback or recap.",
            impact="Medium",
            episodes=[f"Ep {n_ep}"],
        ),
        OptimizationSuggestion(
            type="suggestion",
            title="Consider earlier B-plot payoff",
            description="An earlier subplot payoff would improve narrative momentum.",
            impact="Low",
            episodes=["Ep 2", "Ep 4"],
        ),
    ]
    return suggestions[:5]
