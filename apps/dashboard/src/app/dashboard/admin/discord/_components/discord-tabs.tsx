"use client";

import React, { useState } from "react";
import { Button } from "@gameverse/ui/button";
import { Input } from "@gameverse/ui/input";
import { Label } from "@gameverse/ui/label";
import { Hash, Shield, Zap, Webhook, Terminal, CheckCircle2, Plus, Play } from "lucide-react";

export function DiscordChannelMapping() {
  const [channels, setChannels] = useState([
    { event: "Valorant Championship", discordChannel: "#valorant-tournament", type: "Text Channel" },
    { event: "BGMI Showdown", discordChannel: "#bgmi-stage-1", type: "Stage Channel" },
    { event: "Community Lounge", discordChannel: "🔊 Gaming Lounge", type: "Voice Channel" },
  ]);

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
          <Hash className="h-5 w-5 text-indigo-400" /> Channel Mapping
        </h2>
        <Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> Add Channel Mapping</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--border)] text-xs text-[var(--muted-foreground)] uppercase">
            <tr>
              <th className="py-3 px-4">Event / Module</th>
              <th className="py-3 px-4">Mapped Discord Channel</th>
              <th className="py-3 px-4">Channel Type</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {channels.map((ch, i) => (
              <tr key={i} className="hover:bg-[var(--muted)]/40">
                <td className="py-3 px-4 font-semibold text-[var(--foreground)]">{ch.event}</td>
                <td className="py-3 px-4 font-mono text-indigo-400 font-bold">{ch.discordChannel}</td>
                <td className="py-3 px-4 text-xs text-[var(--muted-foreground)]">{ch.type}</td>
                <td className="py-3 px-4 text-right">
                  <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                    Synced
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

export function DiscordRoleMapping() {
  const [roleMappings, setRoleMappings] = useState([
    { platformRole: "ADMIN", discordRole: "👑 Admin / Organizer", autoAssign: true },
    { platformRole: "MODERATOR", discordRole: "🛡️ Community Moderator", autoAssign: true },
    { platformRole: "MEMBER", discordRole: "🎮 Registered Gamer", autoAssign: true },
    { platformRole: "WINNER", discordRole: "🏆 Champion 2026", autoAssign: false },
  ]);

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
          <Shield className="h-5 w-5 text-indigo-400" /> Platform Role to Discord Role Mapping
        </h2>
        <Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> Add Role Mapping</Button>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {roleMappings.map((rm, i) => (
          <div key={i} className="p-4 rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-[var(--foreground)]">{rm.platformRole}</span>
              <span className="text-xs font-mono font-bold text-indigo-400">{rm.discordRole}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-[var(--muted-foreground)]">
              <span>Auto-assign on login:</span>
              <span className="font-semibold text-green-400">{rm.autoAssign ? "ENABLED" : "MANUAL"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DiscordSlashCommands() {
  const commands = [
    { name: "/register", desc: "Register for an active festival event directly in Discord", status: "Active" },
    { name: "/pass", desc: "View and get QR code link for your participant pass", status: "Active" },
    { name: "/leaderboard", desc: "Display current top 10 competition standings", status: "Active" },
    { name: "/profile", desc: "View player gamer tag, points, and badges", status: "Active" },
  ];

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
          <Terminal className="h-5 w-5 text-indigo-400" /> Registered Slash Commands
        </h2>
        <Button size="sm" variant="outline">Sync Commands to Guild</Button>
      </div>

      <div className="space-y-3">
        {commands.map((cmd, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-[var(--border)] bg-[var(--muted)]/30">
            <div className="space-y-1">
              <span className="font-mono font-bold text-sm text-indigo-400">{cmd.name}</span>
              <p className="text-xs text-[var(--muted-foreground)]">{cmd.desc}</p>
            </div>
            <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
              {cmd.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DiscordAutomationRules() {
  const rules = [
    { trigger: "ON Registration Approved", action: "Assign 'Registered Gamer' role + DM Participant Pass link" },
    { trigger: "ON Event Published", action: "Post Embed into #announcements-channel with RSVP button" },
    { trigger: "ON Winner Declared", action: "Assign 'Champion 2026' role + Post podium announcement" },
  ];

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
          <Zap className="h-5 w-5 text-amber-400" /> Trigger & Automation Rules
        </h2>
        <Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> Create Automation</Button>
      </div>

      <div className="space-y-3">
        {rules.map((r, i) => (
          <div key={i} className="p-4 rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase">
              <Zap className="h-3.5 w-3.5" /> {r.trigger}
            </div>
            <p className="text-sm font-semibold text-[var(--foreground)]">{r.action}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
