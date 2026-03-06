"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { EpisodeArcItem } from "@/lib/api"

const defaultEpisodes: EpisodeArcItem[] = [
  { number: 1, title: "The Awakening", beats: ["Introduce protagonist", "Establish world rules", "Inciting incident", "First cliffhanger"], tension: "Low → Medium", type: "Setup" },
  { number: 2, title: "Fractures", beats: ["Deepen conflict", "Introduce antagonist", "Side-plot B begins", "Reveal stakes"], tension: "Medium", type: "Rising" },
  { number: 3, title: "The Descent", beats: ["Protagonist fails", "Alliance breaks", "Twist reveal", "Point of no return"], tension: "Medium → High", type: "Escalation" },
  { number: 4, title: "Crossroads", beats: ["Forced choice", "Backstory reveal", "Betrayal", "New alliance"], tension: "High", type: "Midpoint" },
  { number: 5, title: "Unraveling", beats: ["Plan falls apart", "Emotional low point", "Subplot converges", "Desperate gambit"], tension: "Very High", type: "Escalation" },
  { number: 6, title: "Reckoning", beats: ["Confrontation", "Sacrifice", "Truth revealed", "Rallying cry"], tension: "Peak", type: "Climax Build" },
  { number: 7, title: "The Storm", beats: ["Final battle begins", "Loss and gain", "Protagonist transformed", "Last twist"], tension: "Peak", type: "Climax" },
  { number: 8, title: "New Dawn", beats: ["Resolution", "Aftermath", "Character growth", "Season hook"], tension: "High → Resolved", type: "Resolution" },
]

const typeColors: Record<string, string> = {
  Setup: "bg-chart-3/20 text-chart-3 border-chart-3/30",
  Rising: "bg-chart-2/20 text-chart-2 border-chart-2/30",
  Escalation: "bg-chart-4/20 text-chart-4 border-chart-4/30",
  Midpoint: "bg-chart-1/20 text-chart-1 border-chart-1/30",
  "Climax Build": "bg-chart-5/20 text-chart-5 border-chart-5/30",
  Climax: "bg-chart-1/20 text-chart-1 border-chart-1/30",
  Resolution: "bg-chart-2/20 text-chart-2 border-chart-2/30",
}

interface EpisodeArcPanelProps {
  data?: EpisodeArcItem[] | null
}

export function EpisodeArcPanel({ data }: EpisodeArcPanelProps) {
  const episodes = data?.length ? data : defaultEpisodes
  return (
    <Card className="border-border/50 bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Episode Arc</CardTitle>
        <CardDescription>
          {episodes.length}-episode season structure with beat sheets and pacing overview
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2">
          {episodes.map((ep) => (
            <div
              key={ep.number}
              className="rounded-lg border border-border/50 bg-secondary/30 p-4 transition-colors hover:border-primary/20"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
                    {ep.number}
                  </span>
                  <h4 className="font-semibold text-foreground">{ep.title}</h4>
                </div>
                <span
                  className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
                    typeColors[ep.type] || "bg-muted text-muted-foreground"
                  }`}
                >
                  {ep.type}
                </span>
              </div>
              <div className="mb-2 flex flex-wrap gap-1.5">
                {ep.beats.map((beat) => (
                  <Badge
                    key={beat}
                    variant="outline"
                    className="border-border/50 text-xs text-muted-foreground"
                  >
                    {beat}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Tension: <span className="text-foreground">{ep.tension}</span>
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
