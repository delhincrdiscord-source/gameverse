"use client";

import React from "react";
import { TrendingUp, Users, Calendar, Trophy, CheckCircle2, Award, Zap } from "lucide-react";

export function FestivalAnalyticsView() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-2">
          <p className="text-xs text-[var(--muted-foreground)] font-semibold uppercase">Total Festivals Hosted</p>
          <p className="text-3xl font-bold text-yellow-400">4</p>
          <p className="text-xs text-[var(--muted-foreground)]">+1 Upcoming in Q3 2026</p>
        </div>
        <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-2">
          <p className="text-xs text-[var(--muted-foreground)] font-semibold uppercase">Total Registrations</p>
          <p className="text-3xl font-bold text-green-400">12,450</p>
          <p className="text-xs text-green-400">↑ 18.5% compared to 2025</p>
        </div>
        <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-2">
          <p className="text-xs text-[var(--muted-foreground)] font-semibold uppercase">Festival Check-in Rate</p>
          <p className="text-3xl font-bold text-blue-400">89.4%</p>
          <p className="text-xs text-[var(--muted-foreground)]">High physical attendance</p>
        </div>
      </div>
    </div>
  );
}

export function EventAnalyticsView() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-2">
          <p className="text-xs text-[var(--muted-foreground)] font-semibold uppercase">Most Popular Category</p>
          <p className="text-3xl font-bold text-purple-400">Esports (Valorant)</p>
          <p className="text-xs text-[var(--muted-foreground)]">4,200 participants</p>
        </div>
        <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-2">
          <p className="text-xs text-[var(--muted-foreground)] font-semibold uppercase">Average Capacity Utilized</p>
          <p className="text-3xl font-bold text-amber-400">92.1%</p>
          <p className="text-xs text-[var(--muted-foreground)]">Near max capacity across events</p>
        </div>
        <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-2">
          <p className="text-xs text-[var(--muted-foreground)] font-semibold uppercase">Peak Sign-up Time</p>
          <p className="text-3xl font-bold text-indigo-400">8:00 PM IST</p>
          <p className="text-xs text-[var(--muted-foreground)]">Evening registration spikes</p>
        </div>
      </div>
    </div>
  );
}

export function RegistrationAnalyticsView() {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
      <h3 className="text-base font-bold text-[var(--foreground)]">Registration Funnel Conversion Rate</h3>
      <div className="grid gap-3 md:grid-cols-4">
        {[
          { step: "1. Form Page Views", count: "28,400", pct: "100%" },
          { step: "2. Form Submissions", count: "14,200", pct: "50.0%" },
          { step: "3. Registrations Approved", count: "12,450", pct: "87.6%" },
          { step: "4. Checked-in at Venue", count: "11,130", pct: "89.4%" },
        ].map((s, i) => (
          <div key={i} className="p-4 rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 space-y-1">
            <span className="text-xs font-semibold text-[var(--muted-foreground)]">{s.step}</span>
            <p className="text-2xl font-bold text-[var(--foreground)]">{s.count}</p>
            <span className="text-xs font-bold text-emerald-400">{s.pct} conversion</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AttendanceAnalyticsView() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-2">
        <p className="text-xs text-[var(--muted-foreground)] font-semibold uppercase">Physical QR Scans</p>
        <p className="text-3xl font-bold text-emerald-400">9,840</p>
        <p className="text-xs text-[var(--muted-foreground)]">At Delhi NCR venue entrance</p>
      </div>
      <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-2">
        <p className="text-xs text-[var(--muted-foreground)] font-semibold uppercase">Online Voice/Stage Attendance</p>
        <p className="text-3xl font-bold text-indigo-400">1,290</p>
        <p className="text-xs text-[var(--muted-foreground)]">Via Discord Stage channels</p>
      </div>
      <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-2">
        <p className="text-xs text-[var(--muted-foreground)] font-semibold uppercase">Average Scan Velocity</p>
        <p className="text-3xl font-bold text-cyan-400">45 scans/min</p>
        <p className="text-xs text-[var(--muted-foreground)]">During peak hours (10:00 AM)</p>
      </div>
    </div>
  );
}

export function CompetitionAnalyticsView() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-2">
        <p className="text-xs text-[var(--muted-foreground)] font-semibold uppercase">Total Gamification Points</p>
        <p className="text-3xl font-bold text-amber-400">1,420,500 PTS</p>
        <p className="text-xs text-[var(--muted-foreground)]">Distributed to active players</p>
      </div>
      <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-2">
        <p className="text-xs text-[var(--muted-foreground)] font-semibold uppercase">Total Badges Earned</p>
        <p className="text-3xl font-bold text-purple-400">3,120</p>
        <p className="text-xs text-[var(--muted-foreground)]">Achievements unlocked</p>
      </div>
      <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-2">
        <p className="text-xs text-[var(--muted-foreground)] font-semibold uppercase">Active Competitors</p>
        <p className="text-3xl font-bold text-emerald-400">4,890</p>
        <p className="text-xs text-[var(--muted-foreground)]">Earned points in past 30 days</p>
      </div>
    </div>
  );
}
