"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { EmotionalDataPoint } from "@/lib/api"

const defaultEmotionalData: EmotionalDataPoint[] = [
  { episode: "Ep 1", tension: 25, joy: 60, surprise: 40, conflict: 15 },
  { episode: "Ep 2", tension: 45, joy: 40, surprise: 55, conflict: 35 },
  { episode: "Ep 3", tension: 60, joy: 25, surprise: 70, conflict: 55 },
  { episode: "Ep 4", tension: 75, joy: 30, surprise: 50, conflict: 70 },
  { episode: "Ep 5", tension: 85, joy: 15, surprise: 60, conflict: 80 },
  { episode: "Ep 6", tension: 95, joy: 20, surprise: 80, conflict: 90 },
  { episode: "Ep 7", tension: 90, joy: 35, surprise: 95, conflict: 85 },
  { episode: "Ep 8", tension: 50, joy: 75, surprise: 45, conflict: 40 },
]

// Compute colors in JS since CSS vars don't work in Recharts
const COLORS = {
  tension: "#e5484d",
  joy: "#30a46c",
  surprise: "#6e56cf",
  conflict: "#e5a100",
}

interface EmotionalArcPanelProps {
  data?: EmotionalDataPoint[] | null
}

export function EmotionalArcPanel({ data }: EmotionalArcPanelProps) {
  const emotionalData = data?.length ? data : defaultEmotionalData
  return (
    <Card className="border-border/50 bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Emotional Arc Visualization</CardTitle>
        <CardDescription>
          Emotional intensity mapped across the season
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            tension: { label: "Tension", color: COLORS.tension },
            joy: { label: "Joy", color: COLORS.joy },
            surprise: { label: "Surprise", color: COLORS.surprise },
            conflict: { label: "Conflict", color: COLORS.conflict },
          }}
          className="h-[350px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={emotionalData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="tensionGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.tension} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS.tension} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="joyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.joy} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS.joy} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="surpriseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.surprise} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS.surprise} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="conflictGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.conflict} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS.conflict} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 20%)" />
              <XAxis dataKey="episode" tick={{ fill: "hsl(0 0% 60%)", fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "hsl(0 0% 60%)", fontSize: 12 }} tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="tension" stroke={COLORS.tension} fill="url(#tensionGrad)" strokeWidth={2} name="Tension" />
              <Area type="monotone" dataKey="joy" stroke={COLORS.joy} fill="url(#joyGrad)" strokeWidth={2} name="Joy" />
              <Area type="monotone" dataKey="surprise" stroke={COLORS.surprise} fill="url(#surpriseGrad)" strokeWidth={2} name="Surprise" />
              <Area type="monotone" dataKey="conflict" stroke={COLORS.conflict} fill="url(#conflictGrad)" strokeWidth={2} name="Conflict" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
