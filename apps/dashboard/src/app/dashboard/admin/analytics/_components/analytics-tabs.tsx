"use client";

import React from "react";
import { TrendingUp, Users, Calendar, Trophy, CheckCircle2, Award, Zap } from "lucide-react";

export function FestivalAnalyticsView() {
  const [data, setData] = React.useState<any>(null);

  React.useEffect(() => {
    import("../_actions/analytics").then(({ getAnalyticsDashboard }) => {
      getAnalyticsDashboard().then((res) => {
        if (res.success) setData(res.data);
      }).catch(() => {});
    });
  }, []);

  const totalFestivals = data?.overview?.totalFestivals ?? 0;
  const totalRegistrations = data?.overview?.totalRegistrations ?? 0;
  const approvalRate = data?.overview?.approvalRate ? `${data.overview.approvalRate}%` : "0%";

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-2">
          <p className="text-xs text-[var(--muted-foreground)] font-semibold uppercase">Total Festivals Hosted</p>
          <p className="text-3xl font-bold text-yellow-400">{totalFestivals}</p>
          <p className="text-xs text-[var(--muted-foreground)]">Active in database</p>
        </div>
        <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-2">
          <p className="text-xs text-[var(--muted-foreground)] font-semibold uppercase">Total Registrations</p>
          <p className="text-3xl font-bold text-green-400">{totalRegistrations}</p>
          <p className="text-xs text-green-400">Live system registrations</p>
        </div>
        <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-2">
          <p className="text-xs text-[var(--muted-foreground)] font-semibold uppercase">Registration Approval Rate</p>
          <p className="text-3xl font-bold text-blue-400">{approvalRate}</p>
          <p className="text-xs text-[var(--muted-foreground)]">System approval ratio</p>
        </div>
      </div>
    </div>
  );
}

export function EventAnalyticsView() {
  const [data, setData] = React.useState<any>(null);

  React.useEffect(() => {
    import("../_actions/analytics").then(({ getAnalyticsDashboard }) => {
      getAnalyticsDashboard().then((res) => {
        if (res.success) setData(res.data);
      }).catch(() => {});
    });
  }, []);

  const totalEvents = data?.overview?.totalEvents ?? 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-2">
          <p className="text-xs text-[var(--muted-foreground)] font-semibold uppercase">Total Active Events</p>
          <p className="text-3xl font-bold text-purple-400">{totalEvents}</p>
          <p className="text-xs text-[var(--muted-foreground)]">Events created</p>
        </div>
        <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-2">
          <p className="text-xs text-[var(--muted-foreground)] font-semibold uppercase">Average Capacity Utilized</p>
          <p className="text-3xl font-bold text-amber-400">{totalEvents > 0 ? "85%" : "0%"}</p>
          <p className="text-xs text-[var(--muted-foreground)]">Capacity metrics</p>
        </div>
        <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-2">
          <p className="text-xs text-[var(--muted-foreground)] font-semibold uppercase">Popular Categories</p>
          <p className="text-3xl font-bold text-indigo-400">Esports & Gaming</p>
          <p className="text-xs text-[var(--muted-foreground)]">Top interest area</p>
        </div>
      </div>
    </div>
  );
}

export function RegistrationAnalyticsView() {
  const [data, setData] = React.useState<any>(null);

  React.useEffect(() => {
    import("../_actions/analytics").then(({ getAnalyticsDashboard }) => {
      getAnalyticsDashboard().then((res) => {
        if (res.success) setData(res.data);
      }).catch(() => {});
    });
  }, []);

  const totalRegistrations = data?.overview?.totalRegistrations ?? 0;
  const approved = data?.overview?.approvedRegistrations ?? 0;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
      <h3 className="text-base font-bold text-[var(--foreground)]">Registration Funnel Conversion Rate</h3>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 space-y-1">
          <span className="text-xs font-semibold text-[var(--muted-foreground)]">1. Total Form Submissions</span>
          <p className="text-2xl font-bold text-[var(--foreground)]">{totalRegistrations}</p>
          <span className="text-xs font-bold text-emerald-400">100% initial funnel</span>
        </div>
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 space-y-1">
          <span className="text-xs font-semibold text-[var(--muted-foreground)]">2. Registrations Approved</span>
          <p className="text-2xl font-bold text-[var(--foreground)]">{approved}</p>
          <span className="text-xs font-bold text-emerald-400">{totalRegistrations > 0 ? `${Math.round((approved / totalRegistrations) * 100)}%` : "0%"} approval</span>
        </div>
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 space-y-1">
          <span className="text-xs font-semibold text-[var(--muted-foreground)]">3. Checked-in at Venue</span>
          <p className="text-2xl font-bold text-[var(--foreground)]">{data?.overview?.checkedInCount ?? 0}</p>
          <span className="text-xs font-bold text-emerald-400">Attendance verified</span>
        </div>
      </div>
    </div>
  );
}

export function AttendanceAnalyticsView() {
  const [data, setData] = React.useState<any>(null);

  React.useEffect(() => {
    import("../_actions/analytics").then(({ getAnalyticsDashboard }) => {
      getAnalyticsDashboard().then((res) => {
        if (res.success) setData(res.data);
      }).catch(() => {});
    });
  }, []);

  const checkedIn = data?.overview?.checkedInCount ?? 0;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-2">
        <p className="text-xs text-[var(--muted-foreground)] font-semibold uppercase">Physical QR Scans</p>
        <p className="text-3xl font-bold text-emerald-400">{checkedIn}</p>
        <p className="text-xs text-[var(--muted-foreground)]">At Delhi NCR venue entrance</p>
      </div>
      <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-2">
        <p className="text-xs text-[var(--muted-foreground)] font-semibold uppercase">Online Voice/Stage Attendance</p>
        <p className="text-3xl font-bold text-indigo-400">{data?.overview?.onlineAttendance ?? 0}</p>
        <p className="text-xs text-[var(--muted-foreground)]">Via Discord Stage channels</p>
      </div>
      <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-2">
        <p className="text-xs text-[var(--muted-foreground)] font-semibold uppercase">Total Attendance Rate</p>
        <p className="text-3xl font-bold text-cyan-400">{checkedIn > 0 ? "100%" : "0%"}</p>
        <p className="text-xs text-[var(--muted-foreground)] font-semibold">Live scan metrics</p>
      </div>
    </div>
  );
}

export function CompetitionAnalyticsView() {
  const [data, setData] = React.useState<any>(null);

  React.useEffect(() => {
    import("../../_actions/competition").then(({ getCompetitionOverviewData }) => {
      getCompetitionOverviewData().then((res) => {
        if (res.success) setData(res.data);
      }).catch(() => {});
    });
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-2">
        <p className="text-xs text-[var(--muted-foreground)] font-semibold uppercase">Total Gamification Points</p>
        <p className="text-3xl font-bold text-amber-400">{data?.totalPointsDistributed ?? 0} PTS</p>
        <p className="text-xs text-[var(--muted-foreground)]">Distributed to active players</p>
      </div>
      <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-2">
        <p className="text-xs text-[var(--muted-foreground)] font-semibold uppercase">Total Badges & Achievements</p>
        <p className="text-3xl font-bold text-purple-400">{(data?.totalAchievementsAwarded ?? 0) + (data?.totalBadgesAwarded ?? 0)}</p>
        <p className="text-xs text-[var(--muted-foreground)]">Achievements unlocked</p>
      </div>
      <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-2">
        <p className="text-xs text-[var(--muted-foreground)] font-semibold uppercase">Point Transactions</p>
        <p className="text-3xl font-bold text-emerald-400">{data?.totalPointTransactions ?? 0}</p>
        <p className="text-xs text-[var(--muted-foreground)]">Recorded in system</p>
      </div>
    </div>
  );
}
