import { MessageSquare, ListChecks, BarChart3 } from "lucide-react"

const steps = [
  {
    step: "01",
    icon: MessageSquare,
    title: "Describe your story",
    description:
      "Enter your story idea in plain language. Genre, tone, character concepts, plot hooks -- anything you have in mind.",
  },
  {
    step: "02",
    icon: ListChecks,
    title: "Review the plan",
    description:
      "Our AI generates an analysis plan covering episode arcs, emotional mapping, cliffhanger scoring, and retention risk modeling.",
  },
  {
    step: "03",
    icon: BarChart3,
    title: "Explore the intelligence",
    description:
      "Dive into rich dashboards with actionable insights. See emotional arcs, retention heatmaps, and optimization suggestions in real time.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            How It Works
          </p>
          <h2 className="mt-4 text-balance text-3xl font-bold text-foreground md:text-4xl">
            Three steps to smarter stories
          </h2>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((item) => (
            <div key={item.step} className="relative">
              <div className="mb-6 text-5xl font-bold text-border">{item.step}</div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
