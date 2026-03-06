"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { RetentionRow } from "@/lib/api"

const defaultHeatmapData: RetentionRow[] = [
  {
    episode: "Ep 1",
    segments: [
      { label: "Opening", risk: 15 },
      { label: "Act 1", risk: 8 },
      { label: "Mid", risk: 22 },
      { label: "Act 2", risk: 12 },
      { label: "Ending", risk: 5 },
    ],
  },
  {
    episode: "Ep 2",
    segments: [
      { label: "Opening", risk: 10 },
      { label: "Act 1", risk: 25 },
      { label: "Mid", risk: 35 },
      { label: "Act 2", risk: 18 },
      { label: "Ending", risk: 8 },
    ],
  },
  {
    episode: "Ep 3",
    segments: [
      { label: "Opening", risk: 5 },
      { label: "Act 1", risk: 12 },
      { label: "Mid", risk: 15 },
      { label: "Act 2", risk: 10 },
      { label: "Ending", risk: 3 },
    ],
  },
  {
    episode: "Ep 4",
    segments: [
      { label: "Opening", risk: 8 },
      { label: "Act 1", risk: 10 },
      { label: "Mid", risk: 18 },
      { label: "Act 2", risk: 8 },
      { label: "Ending", risk: 2 },
    ],
  },
  {
    episode: "Ep 5",
    segments: [
      { label: "Opening", risk: 12 },
      { label: "Act 1", risk: 20 },
      { label: "Mid", risk: 45 },
      { label: "Act 2", risk: 30 },
      { label: "Ending", risk: 10 },
    ],
  },
  {
    episode: "Ep 6",
    segments: [
      { label: "Opening", risk: 3 },
      { label: "Act 1", risk: 8 },
      { label: "Mid", risk: 12 },
      { label: "Act 2", risk: 5 },
      { label: "Ending", risk: 2 },
    ],
  },
  {
    episode: "Ep 7",
    segments: [
      { label: "Opening", risk: 5 },
      { label: "Act 1", risk: 10 },
      { label: "Mid", risk: 8 },
      { label: "Act 2", risk: 15 },
      { label: "Ending", risk: 4 },
    ],
  },
  {
    episode: "Ep 8",
    segments: [
      { label: "Opening", risk: 18 },
      { label: "Act 1", risk: 22 },
      { label: "Mid", risk: 28 },
      { label: "Act 2", risk: 15 },
      { label: "Ending", risk: 40 },
    ],
  },
]

interface RetentionHeatmapPanelProps {
  data?: RetentionRow[] | null
}

function getRiskColor(risk: number) {
  if (risk >= 40) return "bg-[#e5484d]"
  if (risk >= 25) return "bg-[#e5a100]"
  if (risk >= 15) return "bg-[#e5a100]/60"
  if (risk >= 8) return "bg-[#30a46c]/60"
  return "bg-[#30a46c]/30"
}

function getRiskOpacity(risk: number) {
  const base = 0.3
  const max = 1
  return base + (risk / 100) * (max - base)
}

export function RetentionHeatmapPanel({ data }: RetentionHeatmapPanelProps) {
  const heatmapData = data?.length ? data : defaultHeatmapData
  const segmentLabels = heatmapData[0].segments.map((s) => s.label)

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Retention Risk Heatmap</CardTitle>
        <CardDescription>
          Predicted audience drop-off risk by episode segment. Darker cells indicate higher risk.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Header */}
        <div className="mb-2 grid gap-1" style={{ gridTemplateColumns: `80px repeat(${segmentLabels.length}, 1fr)` }}>
          <div />
          {segmentLabels.map((label) => (
            <div key={label} className="text-center text-xs font-medium text-muted-foreground">
              {label}
            </div>
          ))}
        </div>

        {/* Rows */}
        <div className="flex flex-col gap-1">
          {heatmapData.map((row) => (
            <div
              key={row.episode}
              className="grid items-center gap-1"
              style={{ gridTemplateColumns: `80px repeat(${row.segments.length}, 1fr)` }}
            >
              <span className="text-xs font-medium text-muted-foreground">
                {row.episode}
              </span>
              {row.segments.map((seg, i) => (
                <div
                  key={i}
                  className={`flex h-10 items-center justify-center rounded-md text-xs font-medium transition-transform hover:scale-105 ${getRiskColor(seg.risk)}`}
                  style={{ opacity: getRiskOpacity(seg.risk) }}
                  title={`${row.episode} - ${seg.label}: ${seg.risk}% risk`}
                >
                  <span className="text-foreground">{seg.risk}%</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-5 flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[#30a46c]/30" />
            <span>Low</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[#e5a100]/60" />
            <span>Moderate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[#e5a100]" />
            <span>High</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[#e5484d]" />
            <span>Critical</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
