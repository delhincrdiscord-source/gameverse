"use client";

import React, { useState } from "react";
import { Button } from "@gameverse/ui/button";
import { Input } from "@gameverse/ui/input";
import { Label } from "@gameverse/ui/label";
import { Calendar, Clock, Globe, Megaphone, Check } from "lucide-react";

export function AnnouncementScheduler() {
  const [title, setTitle] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [channels, setChannels] = useState<{ inApp: boolean; discord: boolean; email: boolean }>({
    inApp: true,
    discord: true,
    email: false,
  });
  const [success, setSuccess] = useState(false);

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-6">
      <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
          <Clock className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[var(--foreground)]">Schedule Future Announcement</h2>
          <p className="text-xs text-[var(--muted-foreground)]">Set launch timestamp and multi-channel publication target.</p>
        </div>
      </div>

      <form onSubmit={handleSchedule} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="schedTitle">Announcement Title</Label>
          <Input
            id="schedTitle"
            placeholder="e.g. Grand Finals Stream Link Release"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="schedDate">Publish Date</Label>
            <Input
              id="schedDate"
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="schedTime">Publish Time</Label>
            <Input
              id="schedTime"
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="timezone">Target Timezone</Label>
          <select
            id="timezone"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] p-2.5 text-sm"
          >
            <option value="Asia/Kolkata">Asia/Kolkata (IST - UTC+5:30)</option>
            <option value="UTC">UTC (Coordinated Universal Time)</option>
            <option value="America/New_York">America/New_York (EST)</option>
          </select>
        </div>

        <div className="space-y-2 pt-2">
          <Label>Target Notification Channels</Label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { key: "inApp", label: "In-App Notification" },
              { key: "discord", label: "Discord Server" },
              { key: "email", label: "Email Broadcast" },
            ].map((ch) => (
              <label
                key={ch.key}
                className="flex items-center gap-2 p-3 rounded-lg border border-[var(--border)] bg-[var(--muted)]/40 cursor-pointer text-xs font-semibold"
              >
                <input
                  type="checkbox"
                  checked={(channels as any)[ch.key]}
                  onChange={(e) => setChannels({ ...channels, [ch.key]: e.target.checked })}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                {ch.label}
              </label>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold">
          <Calendar className="h-4 w-4" /> Confirm & Schedule Announcement
        </Button>

        {success && (
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-semibold text-center flex items-center justify-center gap-2">
            <Check className="h-4 w-4" /> Announcement scheduled successfully!
          </div>
        )}
      </form>
    </div>
  );
}
