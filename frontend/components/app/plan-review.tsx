"use client"

import { CheckCircle2, Loader2, ListChecks } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

interface PlanReviewProps {
  storyIdea: string
  onApprove: () => void | Promise<void>
  error?: string | null
  loading?: boolean
}

const planSteps = [
  {
    title: "Episode Arc Generation",
    description: "Structuring 8-episode season with AI-generated beat sheets, scene breakdowns, and pacing curves for each episode.",
  },
  {
    title: "Emotional Arc Mapping",
    description: "Analyzing emotional tension, joy, surprise, and conflict across all episodes to create a full-season emotional map.",
  },
  {
    title: "Cliffhanger Analysis",
    description: "Scoring each episode ending for unresolved tension, stakes escalation, and audience hook strength.",
  },
  {
    title: "Retention Risk Modeling",
    description: "Predicting audience drop-off points by analyzing pacing, scene energy, and narrative momentum at each beat.",
  },
  {
    title: "Optimization Engine",
    description: "Generating targeted suggestions to improve pacing, emotional peaks, and binge-worthiness metrics.",
  },
]

export function PlanReview({ storyIdea, onApprove, error, loading }: PlanReviewProps) {
  const [visibleSteps, setVisibleSteps] = useState(0)
  const [allRevealed, setAllRevealed] = useState(false)

  useEffect(() => {
    if (visibleSteps < planSteps.length) {
      const timer = setTimeout(() => {
        setVisibleSteps((prev) => prev + 1)
      }, 500)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => setAllRevealed(true), 300)
      return () => clearTimeout(timer)
    }
  }, [visibleSteps])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <ListChecks className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Analysis Plan</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Here is what NarrativeIQ will analyze for your story
          </p>
        </div>

        {/* Story idea summary */}
        <div className="mb-6 rounded-xl border border-border/50 bg-card p-5">
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Your Story Idea
          </p>
          <p className="text-sm leading-relaxed text-foreground">{storyIdea}</p>
        </div>

        {/* Plan steps */}
        <div className="flex flex-col gap-3">
          {planSteps.map((step, index) => {
            const isVisible = index < visibleSteps
            return (
              <div
                key={step.title}
                className={`rounded-xl border border-border/50 bg-card p-5 transition-all duration-500 ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {isVisible ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    ) : (
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {error && (
          <p className="mt-4 text-center text-sm text-destructive">{error}</p>
        )}
        {/* Approve button */}
        <div
          className={`mt-8 flex justify-center transition-all duration-500 ${
            allRevealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <Button
            size="lg"
            className="gap-2 px-8"
            onClick={() => onApprove()}
            disabled={!allRevealed || loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Running analysis…
              </>
            ) : (
              "Approve & Run Analysis"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
