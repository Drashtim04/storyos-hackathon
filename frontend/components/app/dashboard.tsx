"use client"

import { useState } from "react"
import { ArrowLeft, Sparkles, FileDown, Link2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StoryScorePanel } from "@/components/app/panels/story-score-panel"
import { EpisodeArcPanel } from "@/components/app/panels/episode-arc-panel"
import { EmotionalArcPanel } from "@/components/app/panels/emotional-arc-panel"
import { CliffhangerScorePanel } from "@/components/app/panels/cliffhanger-panel"
import { RetentionHeatmapPanel } from "@/components/app/panels/retention-heatmap-panel"
import { OptimizationPanel } from "@/components/app/panels/optimization-panel"
import type { StoryAnalysis } from "@/lib/api"
import { exportDashboardPdf } from "@/lib/export-pdf"

interface DashboardProps {
  storyIdea: string
  analysis: StoryAnalysis
  onReset: () => void
  isShared?: boolean
}

export function Dashboard({ storyIdea, analysis, onReset, isShared }: DashboardProps) {
  const [shareCopied, setShareCopied] = useState(false)
  const [exporting, setExporting] = useState(false)

  const shareUrl =
    typeof window !== "undefined" && analysis.share_token
      ? `${window.location.origin}/share/${analysis.share_token}`
      : ""

  async function handleExportPdf() {
    setExporting(true)
    try {
      await exportDashboardPdf(storyIdea, analysis)
    } finally {
      setExporting(false)
    }
  }

  function handleCopyShareLink() {
    if (!shareUrl) return
    navigator.clipboard.writeText(shareUrl)
    setShareCopied(true)
    setTimeout(() => setShareCopied(false), 2000)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onReset} className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to chat</span>
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
                <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <span className="text-sm font-semibold text-foreground">NarrativeIQ</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {shareUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyShareLink}
                className="gap-1.5"
              >
                {shareCopied ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <Link2 className="h-3.5 w-3.5" />
                )}
                {shareCopied ? "Copied!" : "Share link"}
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPdf}
              disabled={exporting}
              className="gap-1.5"
            >
              <FileDown className="h-3.5 w-3.5" />
              Export PDF
            </Button>
            <Button variant="outline" size="sm" onClick={onReset}>
              {isShared ? "Back to app" : "New Story"}
            </Button>
          </div>
        </div>
      </header>

      {/* Story summary */}
      <div className="mx-auto max-w-7xl px-6 pt-6">
        <div className="rounded-xl border border-border/50 bg-card p-5">
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Analyzing
          </p>
          <p className="text-sm leading-relaxed text-foreground">{storyIdea}</p>
        </div>
      </div>

      {/* Tabs for panels */}
      <div className="mx-auto max-w-7xl px-6 py-6">
        <Tabs defaultValue="story-score" className="w-full">
          <TabsList className="mb-6 w-full flex-wrap justify-start gap-1 bg-secondary/30 p-1">
            <TabsTrigger value="story-score" className="text-xs sm:text-sm">Story Score</TabsTrigger>
            <TabsTrigger value="episode-arc" className="text-xs sm:text-sm">Episode Arc</TabsTrigger>
            <TabsTrigger value="emotional-arc" className="text-xs sm:text-sm">Emotional Arc</TabsTrigger>
            <TabsTrigger value="cliffhanger" className="text-xs sm:text-sm">Cliffhanger Score</TabsTrigger>
            <TabsTrigger value="retention" className="text-xs sm:text-sm">Retention Risk</TabsTrigger>
            <TabsTrigger value="optimization" className="text-xs sm:text-sm">Optimization</TabsTrigger>
          </TabsList>

          <TabsContent value="story-score">
            <StoryScorePanel data={analysis.story_score} />
          </TabsContent>
          <TabsContent value="episode-arc">
            <EpisodeArcPanel data={analysis.episode_arc} />
          </TabsContent>
          <TabsContent value="emotional-arc">
            <EmotionalArcPanel data={analysis.emotional_arc} />
          </TabsContent>
          <TabsContent value="cliffhanger">
            <CliffhangerScorePanel data={analysis.cliffhanger_scores} />
          </TabsContent>
          <TabsContent value="retention">
            <RetentionHeatmapPanel data={analysis.retention_heatmap} />
          </TabsContent>
          <TabsContent value="optimization">
            <OptimizationPanel data={analysis.optimization_suggestions} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
