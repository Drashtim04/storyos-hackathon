# NarrativeIQ – AI Storytelling Intelligence Platform

Full-stack application for analyzing story ideas: chat-based input → AI pipeline approval → episodic arc (5–8 episodes), emotional progression, cliffhanger scoring, retention risk, and optimization suggestions. Each result appears in its own dashboard panel with PDF export and shareable links.

## Stack

- **Frontend:** Next.js 16, Tailwind CSS, React 19
- **Backend:** FastAPI
- **Database:** Supabase (optional; app works without it for local dev)

## Features

1. **Chat-based story idea input** – Describe your idea; example prompts provided
2. **AI pipeline approval step** – Review planned analyses before running
3. **Episodic arc** – 5–8 episodes with beat sheets and pacing
4. **Emotional progression** – Tension, joy, surprise, conflict across episodes
5. **Cliffhanger scoring** – Per-episode hook strength (0–100)
6. **Retention risk prediction** – Heatmap by episode segment
7. **Optimization suggestions** – Pacing, emotional peaks, retention tips

**Export:** PDF report and shareable link (when Supabase is configured).

## Quick start

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate   # Windows
# source .venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
cp .env.example .env     # Edit with SUPABASE_URL, SUPABASE_SERVICE_KEY if using Supabase
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
pnpm install
cp .env.example .env.local   # Optional: set NEXT_PUBLIC_API_URL if backend is not on :8000
pnpm dev
```

Open [http://localhost:3000/app](http://localhost:3000/app).

### Supabase (optional)

1. Create a project at [supabase.com](https://supabase.com).
2. Run the migration: **SQL Editor** → paste and run `supabase/migrations/001_story_analyses.sql`.
3. In **Settings → API** copy the project URL and the `service_role` key (keep it secret).
4. Set in `backend/.env`:
   - `SUPABASE_URL=https://your-project.supabase.co`
   - `SUPABASE_SERVICE_KEY=your-service-role-key`
5. Set `NEXT_PUBLIC_APP_URL` (e.g. `http://localhost:3000`) so share URLs are correct.

Without Supabase, analysis still runs and the dashboard works; share links will not load (API returns 404 for share token lookup).

## API

- `POST /api/analyze` – Body: `{ "story_idea": "..." }`. Returns full analysis and `share_url` when applicable.
- `GET /api/analysis/{id}` – Get analysis by ID.
- `GET /api/share/{token}` – Get analysis by share token (for shareable links).

## Project layout

- `frontend/` – Next.js app (pages: `/`, `/app`, `/share/[token]`)
- `backend/` – FastAPI app (`app/main.py`, `app/services/analysis.py`, `app/services/storage.py`)
- `supabase/migrations/` – SQL for `story_analyses` table
