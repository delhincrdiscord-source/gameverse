"use client";

import React from "react";
import { History, CheckCircle2, AlertCircle, MessageSquare, Bell, Mail } from "lucide-react";

const HISTORY_DATA = [
  {
    id: "ann-1",
    title: "Valorant Tournament Bracket Live",
    sentAt: "2026-08-04 14:30 IST",
    author: "Admin",
    status: "DELIVERED",
    channels: ["In-App", "Discord"],
    reach: "1,240 Players",
  },
  {
    id: "ann-2",
    title: "Delhi NCR Gameverse Pass Verification Open",
    sentAt: "2026-08-03 11:00 IST",
    author: "Organizer",
    status: "DELIVERED",
    channels: ["In-App", "Discord", "Email"],
    reach: "4,850 Players",
  },
  {
    id: "ann-3",
    title: "Rules Update for FIFA 2026 Category",
    sentAt: "2026-08-01 18:15 IST",
    author: "Admin",
    status: "DELIVERED",
    channels: ["In-App"],
    reach: "620 Players",
  },
];

export function PublishHistory() {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
          <History className="h-5 w-5 text-purple-400" /> Broadcast & Publish History
        </h2>
        <span className="text-xs text-[var(--muted-foreground)]">Logged announcement delivery metrics</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--border)] text-xs text-[var(--muted-foreground)] uppercase">
            <tr>
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4">Author</th>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Channels</th>
              <th className="py-3 px-4">Audience Reach</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {HISTORY_DATA.map((item) => (
              <tr key={item.id} className="hover:bg-[var(--muted)]/40 transition-colors">
                <td className="py-3 px-4 font-semibold text-[var(--foreground)]">{item.title}</td>
                <td className="py-3 px-4 text-[var(--muted-foreground)]">{item.author}</td>
                <td className="py-3 px-4 text-xs font-mono text-[var(--muted-foreground)]">{item.sentAt}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-1.5">
                    {item.channels.map((c) => (
                      <span key={c} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)]">
                        {c}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4 font-mono font-bold text-emerald-400 text-xs">{item.reach}</td>
                <td className="py-3 px-4 text-right">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
                    <CheckCircle2 className="h-3 w-3" /> {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
