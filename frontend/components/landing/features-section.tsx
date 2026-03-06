import {
  Activity,
  Flame,
  LayoutGrid,
  Lightbulb,
  LineChart,
} from "lucide-react"

const features = [
  {
    icon: LayoutGrid,
    title: "Episode Arc Planning",
    description:
      "Visualize the structure of every episode with AI-generated beat sheets, scene breakdowns, and pacing curves.",
  },
  {
    icon: Activity,
    title: "Emotional Arc Visualization",
    description:
      "Map tension, joy, surprise, and conflict across scenes. See exactly where emotional peaks and valleys land.",
  },
  {
    icon: Flame,
    title: "Cliffhanger Scoring",
    description:
      "Each episode ending gets a cliffhanger strength score based on unresolved tension, stakes, and audience hooks.",
  },
  {
    icon: LineChart,
    title: "Retention Risk Heatmap",
    description:
      "Predict where viewers are likely to drop off. Fix pacing issues before they cost you an audience.",
  },
  {
    icon: Lightbulb,
    title: "Optimization Suggestions",
    description:
      "Get AI-powered recommendations to improve emotional pacing, tighten arcs, and boost binge-worthiness.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Features
          </p>
          <h2 className="mt-4 text-balance text-3xl font-bold text-foreground md:text-4xl">
            Intelligence for every layer of your story
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
            From high-level arcs down to individual scene beats, NarrativeIQ gives you the visibility to make confident creative decisions.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border/50 bg-card p-8 transition-all duration-300 hover:border-primary/30"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-5 text-base font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
