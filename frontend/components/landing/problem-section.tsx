import { AlertTriangle, Clock, TrendingDown } from "lucide-react"

const problems = [
  {
    icon: Clock,
    title: "Hours wasted on trial and error",
    description:
      "Creators spend weeks plotting arcs and pacing by gut instinct, only to discover retention drops after episode 3.",
  },
  {
    icon: TrendingDown,
    title: "Unpredictable audience drop-off",
    description:
      "Without data, you cannot pinpoint where viewers lose interest. Guessing leads to expensive rewrites and missed opportunities.",
  },
  {
    icon: AlertTriangle,
    title: "No visibility into emotional impact",
    description:
      "Traditional writing tools offer no insight into how tension, surprise, and emotional beats map across an entire season.",
  },
]

export function ProblemSection() {
  return (
    <section id="problem" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            The Problem
          </p>
          <h2 className="mt-4 text-balance text-3xl font-bold text-foreground md:text-4xl">
            Great stories fail without great data
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
            Creators are flying blind. The tools they rely on were built for word processing, not audience intelligence.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {problems.map((problem) => (
            <div
              key={problem.title}
              className="group rounded-xl border border-border/50 bg-card p-8 transition-all duration-300 hover:border-primary/30 hover:bg-card/80"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <problem.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-foreground">
                {problem.title}
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
