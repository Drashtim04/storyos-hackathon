import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="relative px-6 py-28">
      <div className="mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card p-12 text-center md:p-16">
          {/* Background accent */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-0 h-[300px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-[100px]" />
          </div>

          <div className="relative">
            <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-balance text-3xl font-bold text-foreground md:text-4xl">
              Start creating smarter stories today
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-pretty text-muted-foreground">
              Enter your first story idea and watch NarrativeIQ transform it into an actionable, data-backed narrative plan.
            </p>
            <div className="mt-8">
              <Button size="lg" className="gap-2 px-8" asChild>
                <Link href="/app">
                  Launch the Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mx-auto mt-20 flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
            <Sparkles className="h-3 w-3 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold text-foreground">NarrativeIQ</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Built for storytellers who want to win with data.
        </p>
      </div>
    </section>
  )
}
