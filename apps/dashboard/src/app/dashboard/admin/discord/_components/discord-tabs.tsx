"use client";

import React, { useState } from "react";
import { Button } from "@gameverse/ui/button";
import { Input } from "@gameverse/ui/input";
import { Label } from "@gameverse/ui/label";
import { Hash, Shield, Zap, Webhook, Terminal, CheckCircle2, Plus, Play } from "lucide-react";

export function DiscordChannelMapping() {
  const [channels, setChannels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    import("../_actions/discord").then(({ getDiscordChannels }) => {
      getDiscordChannels().then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setChannels(res.data);
        }
        setLoading(false);
      }).catch(() => setLoading(false));
    });
  }, []);

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
          <Hash className="h-5 w-5 text-indigo-400" /> Channel Mapping
        </h2>
        <Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> Add Channel Mapping</Button>
      </div>

      {loading ? (
        <p className="text-xs text-[var(--muted-foreground)]">Loading channels...</p>
      ) : channels.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-[var(--border)] rounded-lg">
          <Hash className="h-8 w-8 text-[var(--muted-foreground)] mx-auto mb-2 opacity-50" />
          <p className="text-sm font-semibold text-[var(--foreground)]">No Discord Channels Mapped Yet</p>
          <p className="text-xs text-[var(--muted-foreground)]">Click "Add Channel Mapping" to map a Discord channel to your festival events.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--border)] text-xs text-[var(--muted-foreground)] uppercase">
              <tr>
                <th className="py-3 px-4">Channel Name</th>
                <th className="py-3 px-4">Discord Channel ID</th>
                <th className="py-3 px-4">Channel Type</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {channels.map((ch, i) => (
                <tr key={i} className="hover:bg-[var(--muted)]/40">
                  <td className="py-3 px-4 font-semibold text-[var(--foreground)]">{ch.name}</td>
                  <td className="py-3 px-4 font-mono text-indigo-400 font-bold">{ch.channelId}</td>
                  <td className="py-3 px-4 text-xs text-[var(--muted-foreground)]">{ch.type || "Text Channel"}</td>
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
      )}
    </div>
  );
}

export function DiscordRoleMapping() {
  const [roleMappings, setRoleMappings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    import("../_actions/discord").then(({ getDiscordRoleMappings }) => {
      getDiscordRoleMappings().then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setRoleMappings(res.data);
        }
        setLoading(false);
      }).catch(() => setLoading(false));
    });
  }, []);

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
          <Shield className="h-5 w-5 text-indigo-400" /> Platform Role to Discord Role Mapping
        </h2>
        <Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> Add Role Mapping</Button>
      </div>

      {loading ? (
        <p className="text-xs text-[var(--muted-foreground)]">Loading role mappings...</p>
      ) : roleMappings.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-[var(--border)] rounded-lg">
          <Shield className="h-8 w-8 text-[var(--muted-foreground)] mx-auto mb-2 opacity-50" />
          <p className="text-sm font-semibold text-[var(--foreground)]">No Role Mappings Configured Yet</p>
          <p className="text-xs text-[var(--muted-foreground)]">Map platform user roles to automatic Discord roles when users log in.</p>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {roleMappings.map((rm, i) => (
            <div key={i} className="p-4 rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[var(--foreground)]">{rm.platformRole}</span>
                <span className="text-xs font-mono font-bold text-indigo-400">{rm.discordRoleId}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-[var(--muted-foreground)]">
                <span>Auto-assign on login:</span>
                <span className="font-semibold text-green-400">{rm.autoAssign ? "ENABLED" : "MANUAL"}</span>
              </div>
            </div>
          ))}
        </div>
      )}
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
    <div className="space-y-6">
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

      <DiscordDirectMessageTester />
    </div>
  );
}

export function DiscordDirectMessageTester() {
  const [targetUserId, setTargetUserId] = useState("");
  const [messageText, setMessageText] = useState("Hello! Your registration pass for Delhi NCR Gameverse 2026 is confirmed! 🎫");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  const handleSendDm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUserId) return;
    setSending(true);
    setStatus("");
    try {
      const { sendDiscordDirectMessage } = await import("../_actions/discord");
      const res = await sendDiscordDirectMessage(targetUserId, messageText);
      if (res.success) {
        setStatus("✅ Direct Message (DM) successfully sent to Discord user!");
        setTargetUserId("");
      } else {
        setStatus(`❌ Error sending DM: ${res.error}`);
      }
    } catch (err: any) {
      setStatus(`❌ Error: ${err.message}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
      <h2 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
        <Play className="h-5 w-5 text-indigo-400" /> Direct Message (DM) Tester
      </h2>
      <p className="text-xs text-[var(--muted-foreground)]">
        Test sending automated DMs directly to a Discord user ID using the Bot token API.
      </p>

      <form onSubmit={handleSendDm} className="space-y-4">
        <div>
          <Label htmlFor="targetUserId">Discord User Snowflake ID</Label>
          <Input
            id="targetUserId"
            placeholder="e.g. 123456789012345678"
            value={targetUserId}
            onChange={(e) => setTargetUserId(e.target.value)}
            className="mt-1 font-mono"
            required
          />
        </div>

        <div>
          <Label htmlFor="messageText">DM Message Body</Label>
          <Input
            id="messageText"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="mt-1"
            required
          />
        </div>

        <Button type="submit" disabled={sending} className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
          <Play className="h-4 w-4" /> {sending ? "Sending DM..." : "Send DM to User"}
        </Button>

        {status && <p className="text-xs font-semibold mt-2">{status}</p>}
      </form>
    </div>
  );
}
