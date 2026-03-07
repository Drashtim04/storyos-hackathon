# NarrativeIQ – AI Storytelling Intelligence Platform

NarrativeIQ is a full‑stack AI storytelling intelligence platform that analyzes story ideas before production.

Creators describe a story idea through a chat interface. The system runs an AI narrative analysis pipeline and produces insights such as episodic structure, emotional progression, cliffhanger strength, retention risk, and optimization suggestions.

The platform helps writers design binge‑worthy episodic stories using data‑driven narrative insights.

---

## Product Workflow

Story Idea → AI Analysis Plan → User Approval → Narrative Intelligence Pipeline → Dashboard Insights

1. User enters a story idea in a chat interface  
2. The system generates an AI analysis plan  
3. User approves the pipeline  
4. Backend runs narrative intelligence analysis  
5. Results appear in a multi‑panel analytics dashboard  
6. Results can be exported as a PDF or shared via link  

---

## Key Features

### Chat‑Based Story Input
Creators describe story ideas naturally through a conversational interface.

### AI Pipeline Approval
Users review the analysis steps before execution.

### Episodic Arc Generation
AI generates a structured **5–8 episode narrative arc**.

### Emotional Progression Analysis
Tracks emotional signals across episodes:

- tension  
- joy  
- surprise  
- conflict  

Visualized as an emotional arc chart.

### Cliffhanger Scoring
Each episode ending receives a **hook strength score (0–100)**.

### Retention Risk Prediction
A heatmap predicts viewer drop‑off across story segments:

Opening → Act 1 → Midpoint → Act 2 → Ending

### Optimization Suggestions
AI recommends improvements for:

- pacing  
- emotional peaks  
- engagement  
- narrative tension  

### Story Quality Score
Composite story quality score derived from narrative metrics.

### Binge Potential Score
A metric estimating how addictive a story is based on:

- cliffhanger escalation  
- emotional intensity  
- retention resistance  

Score range: **0–100**

### Export & Sharing
- Download analysis as **PDF report**
- Generate **shareable analysis links**

---

## Tech Stack

### Frontend
- Next.js 16  
- React 19  
- Tailwind CSS  

### Backend
- FastAPI  

### Database
- Supabase (optional)

### AI
- Groq LLM

---

## System Architecture

Frontend (Next.js)  
↓  
API Requests  
↓  
FastAPI Backend  
↓  
Narrative Analysis Pipeline  
↓  
Groq LLM  
↓  
Supabase Storage (optional)

---

## Quick Start

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate

pip install -r requirements.txt
cp .env.example .env

uvicorn app.main:app --reload --port 8000
```

Backend runs at:

```
http://localhost:8000
```

---

### Frontend

```bash
cd frontend
pnpm install
cp .env.example .env.local
pnpm dev
```

Open:

```
http://localhost:3000/app
```

---

## Supabase Setup (Optional)

1. Create a project at https://supabase.com  
2. Run the migration:

```
supabase/migrations/001_story_analyses.sql
```

3. In Settings → API copy:

```
SUPABASE_URL
SUPABASE_SERVICE_KEY
```

4. Add to:

```
backend/.env
```

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
```

---

## API

### Run Analysis

```
POST /api/analyze
```

Request:

```
{
 "story_idea": "A college student discovers his roommate runs a secret crime network."
}
```

---

### Get Analysis

```
GET /api/analysis/{id}
```

---

### Share Analysis

```
GET /api/share/{token}
```

---

## Project Structure

```
frontend/
   Next.js application
   pages: / , /app , /share/[token]

backend/
   FastAPI server
   app/main.py
   services/
       analysis.py
       storage.py

supabase/
   migrations/
       001_story_analyses.sql
```

---

## Running Without Supabase

If Supabase is not configured:

- analysis pipeline still runs  
- dashboard works normally  
- PDF export works  
- share links return 404  

---

## License

MIT License
