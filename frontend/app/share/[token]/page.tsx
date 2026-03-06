"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Dashboard } from "@/components/app/dashboard"
import { getAnalysisByShareToken } from "@/lib/api"
import type { StoryAnalysis } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"

export default function SharePage() {
  const params = useParams()
  const token = typeof params?.token === "string" ? params.token : ""
  const [analysis, setAnalysis] = useState<StoryAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setError("Invalid share link")
      return
    }
    getAnalysisByShareToken(token)
      .then(setAnalysis)
      .catch(() => setError("This shared analysis could not be loaded."))
  }, [token])

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6">
        <p className="text-center text-muted-foreground">{error}</p>
        <Button asChild variant="outline">
          <Link href="/app" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to app
          </Link>
        </Button>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading shared analysis…</p>
      </div>
    )
  }

  return (
    <Dashboard
      storyIdea={analysis.story_idea}
      analysis={analysis}
      onReset={() => window.location.href = "/app"}
      isShared
    />
  )
}
