const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface EpisodeArcItem {
  number: number;
  title: string;
  beats: string[];
  tension: string;
  type: string;
}

export interface EmotionalDataPoint {
  episode: string;
  tension: number;
  joy: number;
  surprise: number;
  conflict: number;
}

export interface CliffhangerItem {
  episode: string;
  score: number;
  label: string;
}

export interface HeatmapSegment {
  label: string;
  risk: number;
}

export interface RetentionRow {
  episode: string;
  segments: HeatmapSegment[];
}

export interface OptimizationSuggestion {
  type: string;
  title: string;
  description: string;
  impact: string;
  episodes: string[];
}

export interface StoryAnalysis {
  id?: string;
  story_idea: string;
  episode_arc: EpisodeArcItem[];
  emotional_arc: EmotionalDataPoint[];
  cliffhanger_scores: CliffhangerItem[];
  retention_heatmap: RetentionRow[];
  optimization_suggestions: OptimizationSuggestion[];
  share_token?: string;
  created_at?: string;
}

export interface RunAnalysisResponse {
  analysis: StoryAnalysis;
  share_url: string | null;
}

export async function runAnalysis(storyIdea: string): Promise<RunAnalysisResponse> {
  const res = await fetch(`${API_BASE}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ story_idea: storyIdea }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Analysis failed");
  }
  return res.json();
}

export async function getAnalysisById(id: string): Promise<StoryAnalysis> {
  const res = await fetch(`${API_BASE}/api/analysis/${id}`);
  if (!res.ok) throw new Error("Analysis not found");
  return res.json();
}

export async function getAnalysisByShareToken(token: string): Promise<StoryAnalysis> {
  const res = await fetch(`${API_BASE}/api/share/${token}`);
  if (!res.ok) throw new Error("Shared analysis not found");
  return res.json();
}
