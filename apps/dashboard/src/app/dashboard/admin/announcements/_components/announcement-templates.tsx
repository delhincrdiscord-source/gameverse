"use client";

import React, { useState } from "react";
import { Button } from "@gameverse/ui/button";
import { FileText, Copy, Sparkles, Check } from "lucide-react";

const PRESET_TEMPLATES = [
  {
    id: "festival-launch",
    title: "🚀 Festival Registration Launch",
    summary: "Official launch announcement for Delhi NCR Gameverse 2026",
    content: "Attention Gamers! Registrations for Delhi NCR Gameverse 2026 are officially OPEN! Visit your dashboard to secure your participant pass.",
    priority: "HIGH",
  },
  {
    id: "winner-announcement",
    title: "🏆 Event Winner Declaration",
    summary: "Template for declaring tournament champions and prize pool winners",
    content: "Congratulations to our tournament champions! 1st Place: @Champion. Check out the full leaderboard in the Competition Center.",
    priority: "URGENT",
  },
  {
    id: "system-maintenance",
    title: "⚙️ Scheduled System Maintenance",
    summary: "Notice for upcoming maintenance window",
    content: "Please note that the Gameverse dashboard will undergo brief scheduled maintenance today from 2:00 AM to 3:00 AM IST.",
    priority: "NORMAL",
  },
];

export function AnnouncementTemplates() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
          <FileText className="h-5 w-5 text-amber-400" /> Announcement Templates Library
        </h2>
        <p className="text-xs text-[var(--muted-foreground)]">1-click copy template text for rapid distribution</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {PRESET_TEMPLATES.map((tmpl) => (
          <div key={tmpl.id} className="flex flex-col justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-[var(--foreground)]">{tmpl.title}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-semibold">
                  {tmpl.priority}
                </span>
              </div>
              <p className="text-xs text-[var(--muted-foreground)]">{tmpl.summary}</p>
              <div className="p-3 rounded-lg bg-[var(--muted)]/50 border border-[var(--border)] text-xs text-[var(--foreground)] font-mono whitespace-pre-line">
                {tmpl.content}
              </div>
            </div>

            <Button
              onClick={() => handleCopy(tmpl.id, tmpl.content)}
              variant="outline"
              className="w-full gap-2 text-xs"
            >
              {copiedId === tmpl.id ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedId === tmpl.id ? "Copied to Clipboard!" : "Copy Template Content"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
