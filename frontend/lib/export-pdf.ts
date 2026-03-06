"use client"

import { jsPDF } from "jspdf"
import type { StoryAnalysis } from "./api"

export async function exportDashboardPdf(
  storyIdea: string,
  analysis: StoryAnalysis
): Promise<void> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
  const pageW = doc.internal.pageSize.getWidth()
  const margin = 18
  let y = 20

  doc.setFontSize(18)
  doc.text("NarrativeIQ – Story Intelligence Report", margin, y)
  y += 12

  doc.setFontSize(10)
  doc.setFont(undefined as unknown as string, "normal")
  doc.text("Story idea", margin, y)
  y += 6
  doc.setFontSize(9)
  const ideaLines = doc.splitTextToSize(storyIdea, pageW - 2 * margin)
  doc.text(ideaLines, margin, y)
  y += ideaLines.length * 5 + 10

  doc.setFontSize(12)
  doc.text("Episode Arc", margin, y)
  y += 8
  doc.setFontSize(9)
  for (const ep of analysis.episode_arc) {
    if (y > 270) {
      doc.addPage()
      y = 20
    }
    doc.text(`Ep ${ep.number}: ${ep.title} (${ep.type}) – ${ep.tension}`, margin, y)
    y += 5
    doc.text(ep.beats.join(", "), margin + 5, y)
    y += 8
  }
  y += 5

  if (y > 250) {
    doc.addPage()
    y = 20
  }
  doc.setFontSize(12)
  doc.text("Cliffhanger Scores", margin, y)
  y += 8
  doc.setFontSize(9)
  for (const c of analysis.cliffhanger_scores) {
    doc.text(`${c.episode}: ${c.score} – ${c.label}`, margin, y)
    y += 6
  }
  y += 8

  doc.setFontSize(12)
  doc.text("Optimization Suggestions", margin, y)
  y += 8
  doc.setFontSize(9)
  for (const s of analysis.optimization_suggestions) {
    if (y > 270) {
      doc.addPage()
      y = 20
    }
    doc.text(`[${s.impact}] ${s.title}`, margin, y)
    y += 5
    const descLines = doc.splitTextToSize(s.description, pageW - 2 * margin)
    doc.text(descLines, margin + 3, y)
    y += descLines.length * 5 + 2
    doc.text(`Episodes: ${s.episodes.join(", ")}`, margin + 3, y)
    y += 8
  }

  doc.save(`narrativeiq-report-${Date.now()}.pdf`)
}
