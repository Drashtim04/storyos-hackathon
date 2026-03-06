"use client"

import { useState } from "react"
import { ChatInterface } from "@/components/app/chat-interface"
import { PlanReview } from "@/components/app/plan-review"
import { Dashboard } from "@/components/app/dashboard"
import type { StoryAnalysis } from "@/lib/api"

type AppStep = "chat" | "plan" | "dashboard"

export default function AppPage() {
  const [step, setStep] = useState<AppStep>("chat")
  const [storyIdea, setStoryIdea] = useState("")
  const [analysis, setAnalysis] = useState<StoryAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleStorySubmit(idea: string) {
    setStoryIdea(idea)
    setError(null)
    setStep("plan")
  }

  const [loading, setLoading] = useState(false)
  async function handlePlanApprove() {
    setError(null)
    setLoading(true)
    try {
      const { runAnalysis } = await import("@/lib/api")
      const result = await runAnalysis(storyIdea)
      setAnalysis(result.analysis)
      setStep("dashboard")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed")
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setStep("chat")
    setStoryIdea("")
    setAnalysis(null)
    setError(null)
  }

  return (
    <main className="min-h-screen bg-background">
      {step === "chat" && <ChatInterface onSubmit={handleStorySubmit} />}
      {step === "plan" && (
        <PlanReview
          storyIdea={storyIdea}
          onApprove={handlePlanApprove}
          error={error}
          loading={loading}
        />
      )}
      {step === "dashboard" && analysis && (
        <Dashboard
          storyIdea={storyIdea}
          analysis={analysis}
          onReset={handleReset}
        />
      )}
    </main>
  )
}
