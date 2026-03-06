-- Story analyses table for NarrativeIQ
create table if not exists story_analyses (
  id uuid primary key default gen_random_uuid(),
  story_idea text not null,
  episode_arc jsonb not null default '[]',
  emotional_arc jsonb not null default '[]',
  cliffhanger_scores jsonb not null default '[]',
  retention_heatmap jsonb not null default '[]',
  optimization_suggestions jsonb not null default '[]',
  share_token text unique,
  created_at timestamptz default now()
);

create index if not exists idx_story_analyses_share_token on story_analyses(share_token);
create index if not exists idx_story_analyses_created_at on story_analyses(created_at desc);

-- Allow anon/authenticated read for share_token lookup (optional, if you want public share links)
-- alter table story_analyses enable row level security;
-- create policy "Allow read by share token" on story_analyses for select using (true);
