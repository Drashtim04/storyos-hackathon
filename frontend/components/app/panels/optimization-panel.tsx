"use client"

import type React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, ArrowRight, Zap, AlertTriangle, Lightbulb } from "lucide-react"
import type { OptimizationSuggestion } from "@/lib/api"

const typeToIcon: Record<string, React.ComponentType<{ className?: string }>> = {
  critical: AlertTriangle,
  improvement: ArrowUp,
  suggestion: Lightbulb,
}

const defaultSuggestions: (OptimizationSuggestion & { icon?: React.ComponentType<{ className?: string }> })[] = [
  {
    type: "critical",
    icon: AlertTriangle,
    title: "Episode 2 mid-section pacing drop",
    description:
      "The middle of Episode 2 shows a 35% retention risk. Consider adding a revelation or action beat between the subplot introduction and the antagonist reveal.",
    impact: "High",
    episodes: ["Ep 2"],
  },
  {
    type: "improvement",
    icon: ArrowUp,
    title: "Strengthen Episode 5 cliffhanger approach",
    description:
      "Episode 5 has the highest mid-episode drop-off risk (45%). Move the \"desperate gambit\" beat earlier and add a false resolution before the true cliffhanger.",
    impact: "High",
    episodes: ["Ep 5"],
  },
  {
    type: "suggestion",
    icon: Lightbulb,
    title: "Add emotional contrast in Episode 6",
    description:
      "Joy metrics are consistently low in episodes 4-6. A moment of unexpected levity or warmth in Episode 6 before the climax would improve emotional range.",
    impact: "Medium",
    episodes: ["Ep 6"],
  },
  {
    type: "improvement",
    icon: Zap,
    title: "Episode 8 opening needs stronger hook",
    description:
      "Season finales with slow openings see 18% retention risk. Start with the consequence of Episode 7's twist instead of a flashback or recap.",
    impact: "Medium",
    episodes: ["Ep 8"],
  },
  {
    type: "suggestion",
    icon: ArrowRight,
    title: "Consider a B-plot payoff in Episode 4",
    description:
      "Subplot B introduced in Episode 2 does not converge until Episode 5. An earlier payoff in Episode 4 would improve narrative momentum.",
    impact: "Low",
    episodes: ["Ep 2", "Ep 4"],
  },
]

interface OptimizationPanelProps {
  data?: OptimizationSuggestion[] | null
}

const typeStyles: Record<string, string> = {
  critical: "border-[#e5484d]/30 bg-[#e5484d]/5",
  improvement: "border-[#e5a100]/30 bg-[#e5a100]/5",
  suggestion: "border-chart-3/30 bg-chart-3/5",
}

const impactColors: Record<string, string> = {
  High: "bg-[#e5484d]/20 text-[#e5484d] border-[#e5484d]/30",
  Medium: "bg-[#e5a100]/20 text-[#e5a100] border-[#e5a100]/30",
  Low: "bg-[#30a46c]/20 text-[#30a46c] border-[#30a46c]/30",
}

export function OptimizationPanel({ data }: OptimizationPanelProps) {
  const suggestions = data?.length ? data : defaultSuggestions
  return (
    <Card className="border-border/50 bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Optimization Suggestions</CardTitle>
        <CardDescription>
          AI-powered recommendations to improve pacing, emotional arcs, and retention
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {suggestions.map((item, index) => (
            <div
              key={index}
              className={`rounded-xl border p-5 transition-colors hover:border-primary/20 ${
                typeStyles[item.type] || ""
              }`}
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                {(() => {
                  const Icon = "icon" in item ? item.icon : typeToIcon[item.type] ?? Lightbulb
                  return Icon ? <Icon className="h-4 w-4 text-foreground" /> : null
                })()}
                <h4 className="font-semibold text-foreground">{item.title}</h4>
                <span
                  className={`ml-auto rounded-full border px-2 py-0.5 text-xs font-medium ${
                    impactColors[item.impact] || ""
                  }`}
                >
                  {item.impact} Impact
                </span>
              </div>
              <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {item.episodes.map((ep) => (
                  <Badge
                    key={ep}
                    variant="outline"
                    className="border-border/50 text-xs text-muted-foreground"
                  >
                    {ep}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
