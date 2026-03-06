"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { CliffhangerItem } from "@/lib/api"

const defaultCliffhangerData: CliffhangerItem[] = [
  { episode: "Ep 1", score: 72, label: "Solid" },
  { episode: "Ep 2", score: 58, label: "Moderate" },
  { episode: "Ep 3", score: 89, label: "Excellent" },
  { episode: "Ep 4", score: 94, label: "Exceptional" },
  { episode: "Ep 5", score: 81, label: "Strong" },
  { episode: "Ep 6", score: 97, label: "Exceptional" },
  { episode: "Ep 7", score: 91, label: "Excellent" },
  { episode: "Ep 8", score: 45, label: "Season Hook" },
]

function getBarColor(score: number) {
  if (score >= 90) return "#30a46c"
  if (score >= 75) return "#e5a100"
  if (score >= 60) return "#6e56cf"
  return "#e5484d"
}

interface CliffhangerScorePanelProps {
  data?: CliffhangerItem[] | null
}

export function CliffhangerScorePanel({ data }: CliffhangerScorePanelProps) {
  const cliffhangerData = data?.length ? data : defaultCliffhangerData
  return (
    <Card className="border-border/50 bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Cliffhanger Score</CardTitle>
        <CardDescription>
          Each episode ending scored for audience hook strength (0-100)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            score: { label: "Cliffhanger Score", color: "#e5484d" },
          }}
          className="h-[300px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cliffhangerData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 20%)" vertical={false} />
              <XAxis dataKey="episode" tick={{ fill: "hsl(0 0% 60%)", fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: "hsl(0 0% 60%)", fontSize: 12 }} tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="score" radius={[6, 6, 0, 0]} name="Score">
                {cliffhangerData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Score legend */}
        <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#30a46c" }} />
            <span>{"90-100 Exceptional"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#e5a100" }} />
            <span>{"75-89 Strong"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#6e56cf" }} />
            <span>{"60-74 Moderate"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#e5484d" }} />
            <span>{"< 60 Needs Work"}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
