"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { StoryScore } from "@/lib/api"

interface StoryScorePanelProps {
  data?: StoryScore | null
}

function getScoreTier(score: number): { label: string; color: string } {
  if (score >= 90) return { label: "Outstanding", color: "bg-green-500/20 text-green-600 border-green-500/30" }
  if (score >= 80) return { label: "Excellent", color: "bg-emerald-500/20 text-emerald-600 border-emerald-500/30" }
  if (score >= 70) return { label: "Strong", color: "bg-blue-500/20 text-blue-600 border-blue-500/30" }
  if (score >= 60) return { label: "Good", color: "bg-amber-500/20 text-amber-600 border-amber-500/30" }
  if (score >= 50) return { label: "Fair", color: "bg-orange-500/20 text-orange-600 border-orange-500/30" }
  return { label: "Needs Work", color: "bg-red-500/20 text-red-600 border-red-500/30" }
}

function ScoreGauge({ value }: { value: number }) {
  const percentage = (value / 100) * 100
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-20 w-20">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          {/* Background circle */}
          <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(0 0% 20%)" strokeWidth="8" />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="hsl(0 0% 60%)"
            strokeWidth="8"
            strokeDasharray={`${(percentage / 100) * 283} 283`}
            strokeLinecap="round"
            style={{ transform: "rotate(-90deg)", transformOrigin: "50px 50px" }}
          />
          {/* Center text */}
          <text x="50" y="55" textAnchor="middle" fontSize="24" fontWeight="bold" fill="hsl(0 0% 100%)">
            {value}
          </text>
        </svg>
      </div>
      <div className="text-center text-xs text-muted-foreground">Overall Score</div>
    </div>
  )
}

export function StoryScorePanel({ data }: StoryScorePanelProps) {
  const defaultScore: StoryScore = {
    score: 78,
    breakdown: {
      cliffhanger_strength: 85,
      emotional_progression: 72,
      retention_stability: 77,
    },
    binge_potential_score: 91,
  }

  const score = data || defaultScore
  const tier = getScoreTier(score.score)
  const bingePotential = score.binge_potential_score ?? 91

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Story Quality Score</CardTitle>
        <CardDescription>
          Overall narrative quality assessment based on key story metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-8">
          {/* Binge Potential Banner - HERO METRIC */}
          <div className="rounded-xl bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-red-600/10 border border-purple-500/30 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-purple-400 mb-1">🔥 Binge Potential</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    {bingePotential}
                  </span>
                  <span className="text-lg text-muted-foreground">/100</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">How addictive is your story?</p>
              </div>
              <div className="text-right">
                <div className="relative h-24 w-24">
                  <svg viewBox="0 0 100 100" className="h-full w-full">
                    <defs>
                      <linearGradient id="bingeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(0 0% 20%)" strokeWidth="6" />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="url(#bingeGradient)"
                      strokeWidth="6"
                      strokeDasharray={`${(bingePotential / 100) * 283} 283`}
                      strokeLinecap="round"
                      style={{ transform: "rotate(-90deg)", transformOrigin: "50px 50px" }}
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="mt-3 flex gap-2 text-xs">
              <span className="inline-block px-2 py-1 rounded bg-purple-500/20 text-purple-300">Cliffhanger Escalation</span>
              <span className="inline-block px-2 py-1 rounded bg-pink-500/20 text-pink-300">Emotional Intensity</span>
              <span className="inline-block px-2 py-1 rounded bg-red-500/20 text-red-300">Retention Resistance</span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-8">
            <ScoreGauge value={score.score} />
            <div className="flex-1">
              <Badge variant="outline" className={`border ${tier.color} mb-4`}>
                {tier.label}
              </Badge>
              <p className="text-sm text-muted-foreground">
                This story demonstrates strong narrative structure with compelling episode design and good viewer retention potential. Focus on improving emotional consistency for even greater impact.
              </p>
            </div>
          </div>

          {/* Breakdown metrics */}
          <div className="grid gap-4 md:grid-cols-3">
            {/* Cliffhanger Strength */}
            <div className="rounded-lg border border-border/50 bg-secondary/30 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground">Cliffhanger Strength</h4>
                <span className="text-lg font-bold text-primary">{score.breakdown.cliffhanger_strength}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-gradient-to-r from-primary/50 to-primary transition-all"
                  style={{ width: `${score.breakdown.cliffhanger_strength}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Episode endings keep audiences engaged with compelling hooks and unresolved tensions.
              </p>
            </div>

            {/* Emotional Progression */}
            <div className="rounded-lg border border-border/50 bg-secondary/30 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground">Emotional Progression</h4>
                <span className="text-lg font-bold text-amber-500">{score.breakdown.emotional_progression}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-gradient-to-r from-amber-500/50 to-amber-500 transition-all"
                  style={{ width: `${score.breakdown.emotional_progression}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Consistent emotional arcs create a satisfying rhythm of tension and relief.
              </p>
            </div>

            {/* Retention Stability */}
            <div className="rounded-lg border border-border/50 bg-secondary/30 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground">Retention Stability</h4>
                <span className="text-lg font-bold text-green-500">{score.breakdown.retention_stability}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-gradient-to-r from-green-500/50 to-green-500 transition-all"
                  style={{ width: `${score.breakdown.retention_stability}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Low dropout risk indicates pacing that maintains viewer engagement throughout.
              </p>
            </div>
          </div>

          {/* Interpretation */}
          <div className="rounded-lg bg-secondary/20 p-4">
            <h4 className="mb-2 text-sm font-semibold text-foreground">Score Interpretation</h4>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• <span className="text-green-500 font-medium">90+</span> – Outstanding narrative with exceptional commercial potential</li>
              <li>• <span className="text-emerald-500 font-medium">80-89</span> – Excellent story structure ready for production</li>
              <li>• <span className="text-blue-500 font-medium">70-79</span> – Strong foundation with solid engagement metrics</li>
              <li>• <span className="text-amber-500 font-medium">60-69</span> – Good potential with specific areas for improvement</li>
              <li>• <span className="text-orange-500 font-medium">50-59</span> – Fair structure requiring focused revisions</li>
              <li>• <span className="text-red-500 font-medium">Below 50</span> – Needs significant reworking of core narrative elements</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
