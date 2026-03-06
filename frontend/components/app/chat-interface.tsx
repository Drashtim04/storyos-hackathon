"use client"

import { useState, type FormEvent } from "react"
import { Send, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface ChatInterfaceProps {
  onSubmit: (idea: string) => void
}

const examplePrompts = [
  "A time-looping detective who solves murders from different decades, but each loop changes the victim.",
  "A space opera about a diplomat caught between two alien civilizations on the verge of war.",
  "An anthology horror series set in a small town where each season focuses on a different urban legend.",
]

export function ChatInterface({ onSubmit }: ChatInterfaceProps) {
  const [input, setInput] = useState("")

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!input.trim()) return
    onSubmit(input.trim())
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-2xl">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            What story do you want to build?
          </h1>
          <p className="mt-2 text-muted-foreground">
            Describe your story idea and we will analyze it for emotional arcs, retention risks, and more.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your story idea... genre, characters, plot hooks, tone..."
            className="min-h-[140px] resize-none rounded-xl border-border bg-card pr-14 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute bottom-3 right-3 h-9 w-9 rounded-lg"
            disabled={!input.trim()}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Submit story idea</span>
          </Button>
        </form>

        <div className="mt-8">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Try an example
          </p>
          <div className="flex flex-col gap-2">
            {examplePrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => setInput(prompt)}
                className="rounded-lg border border-border/50 bg-card/50 px-4 py-3 text-left text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
