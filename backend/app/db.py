from __future__ import annotations

import os
from supabase import create_client, Client
from app.config import settings


def get_supabase() -> Client | None:
    if not settings.supabase_url or not settings.supabase_service_key:
        return None
    return create_client(settings.supabase_url, settings.supabase_service_key)


def ensure_table(supabase: Client) -> None:
    """Create story_analyses table if not exists. Run via SQL in Supabase dashboard for production."""
    # Table creation is typically done via Supabase migrations or dashboard.
    # Schema expected:
    # create table story_analyses (
    #   id uuid primary key default gen_random_uuid(),
    #   story_idea text not null,
    #   episode_arc jsonb not null,
    #   emotional_arc jsonb not null,
    #   cliffhanger_scores jsonb not null,
    #   retention_heatmap jsonb not null,
    #   optimization_suggestions jsonb not null,
    #   share_token text unique,
    #   created_at timestamptz default now()
    # );
    pass
