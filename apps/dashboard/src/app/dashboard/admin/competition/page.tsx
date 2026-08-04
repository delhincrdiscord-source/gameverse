"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Award,
  Medal,
  TrendingUp,
  PlusCircle,
  History,
  ShieldCheck,
  BarChart2,
  Users,
  Search,
  Lock,
  Unlock,
  Sparkles,
} from "lucide-react";
import { Button } from "@gameverse/ui/button";
import { Input } from "@gameverse/ui/input";
import { Label } from "@gameverse/ui/label";
import {
  getCompetitionOverviewData,
  getPointsLeaderboard,
  adjustUserPoints,
  getRecentPointLogs,
  assignEventWinner,
} from "../_actions/competition";

export default function CompetitionCenterPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "points" | "leaderboard" | "winners" | "rules" | "history" | "analytics"
  >("overview");

  // Overview & Data States
  const [overview, setOverview] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLeaderboardFrozen, setIsLeaderboardFrozen] = useState(false);

  // Form States
  const [adjustUserId, setAdjustUserId] = useState("");
  const [adjustPoints, setAdjustPoints] = useState<number>(100);
  const [adjustReason, setAdjustReason] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");
  const [actionError, setActionError] = useState("");

  // Winner Form
  const [winnerUserId, setWinnerUserId] = useState("");
  const [winnerEvent, setWinnerEvent] = useState("");
  const [winnerPosition, setWinnerPosition] = useState<"1st" | "2nd" | "3rd">("1st");
  const [winnerBonus, setWinnerBonus] = useState(500);

  const loadData = async () => {
    setLoading(true);
    const [ovRes, lbRes, logRes] = await Promise.all([
      getCompetitionOverviewData(),
      getPointsLeaderboard(25),
      getRecentPointLogs(15),
    ]);

    if (ovRes.success) setOverview(ovRes.data);
    if (lbRes.success) setLeaderboard(lbRes.data || []);
    if (logRes.success) setLogs(logRes.data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePointAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionSuccess("");
    setActionError("");
    if (!adjustUserId || !adjustReason) {
      setActionError("Please fill in User ID and Reason");
      return;
    }
    const res = await adjustUserPoints(adjustUserId, Number(adjustPoints), adjustReason);
    if (res.success) {
      setActionSuccess(`Successfully adjusted ${adjustPoints} points for user.`);
      setAdjustUserId("");
      setAdjustReason("");
      loadData();
    } else {
      setActionError(res.error || "Failed to adjust points");
    }
  };

  const handleWinnerAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionSuccess("");
    setActionError("");
    if (!winnerUserId || !winnerEvent) {
      setActionError("Please fill in User ID and Event Name");
      return;
    }
    const res = await assignEventWinner(winnerUserId, winnerEvent, winnerPosition, winnerBonus);
    if (res.success) {
      setActionSuccess(`Awarded ${winnerPosition} Place winner badge & ${winnerBonus} points!`);
      setWinnerUserId("");
      setWinnerEvent("");
      loadData();
    } else {
      setActionError(res.error || "Failed to assign winner");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-3">
            <Trophy className="h-8 w-8 text-amber-400" /> Competition Center
          </h1>
          <p className="text-[var(--muted-foreground)]">
            Manage player points, leaderboards, event winners, and gamification rules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={isLeaderboardFrozen ? "destructive" : "outline"}
            onClick={() => setIsLeaderboardFrozen(!isLeaderboardFrozen)}
            className="gap-2"
          >
            {isLeaderboardFrozen ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
            {isLeaderboardFrozen ? "Leaderboard Frozen" : "Freeze Leaderboard"}
          </Button>
          <Button onClick={loadData} variant="default" className="gap-2">
            <Sparkles className="h-4 w-4" /> Refresh Data
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[var(--border)] pb-2">
        {[
          { id: "overview", label: "Overview", icon: Trophy },
          { id: "points", label: "Points Management", icon: PlusCircle },
          { id: "leaderboard", label: "Leaderboard", icon: Award },
          { id: "winners", label: "Winner Management", icon: Medal },
          { id: "rules", label: "Point Rules", icon: ShieldCheck },
          { id: "history", label: "Ranking History", icon: History },
          { id: "analytics", label: "Analytics", icon: BarChart2 },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 rounded-md px-3.5 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Feedback Messages */}
      {actionSuccess && (
        <div className="rounded-lg bg-green-500/10 border border-green-500/30 p-4 text-green-400 text-sm font-medium">
          ✅ {actionSuccess}
        </div>
      )}
      {actionError && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-4 text-red-400 text-sm font-medium">
          ❌ {actionError}
        </div>
      )}

      {/* Tab 1: Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <StatCard
              icon={TrendingUp}
              label="Total Points Awarded"
              value={overview?.totalPointsDistributed?.toLocaleString() || "0"}
              sub="Across all events"
              color="text-amber-400"
            />
            <StatCard
              icon={History}
              label="Point Transactions"
              value={overview?.totalPointTransactions?.toLocaleString() || "0"}
              sub="Total logs recorded"
              color="text-blue-400"
            />
            <StatCard
              icon={Award}
              label="Achievements Unlocked"
              value={overview?.totalAchievementsAwarded?.toLocaleString() || "0"}
              sub="Total achievements"
              color="text-purple-400"
            />
            <StatCard
              icon={Medal}
              label="Badges Distributed"
              value={overview?.totalBadgesAwarded?.toLocaleString() || "0"}
              sub="Trophy & placement badges"
              color="text-emerald-400"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Top 5 Hall of Fame */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-4">
              <h2 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-400" /> Current Top 5 Champions
              </h2>
              <div className="space-y-3">
                {overview?.topCompetitors?.map((comp: any) => (
                  <div
                    key={comp.userId}
                    className="flex items-center justify-between p-3 rounded-lg bg-[var(--muted)]/50 border border-[var(--border)]"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`font-black text-lg w-6 ${comp.rank === 1 ? "text-amber-400" : comp.rank === 2 ? "text-slate-300" : comp.rank === 3 ? "text-amber-700" : "text-[var(--muted-foreground)]"}`}>
                        #{comp.rank}
                      </span>
                      <div>
                        <p className="font-semibold text-sm text-[var(--foreground)]">{comp.username}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">{comp.email}</p>
                      </div>
                    </div>
                    <span className="font-mono text-sm font-bold text-amber-400">{comp.points} PTS</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-4">
              <h2 className="text-lg font-bold text-[var(--foreground)]">Quick Actions</h2>
              <div className="grid gap-3">
                <Button onClick={() => setActiveTab("points")} variant="outline" className="justify-start gap-3 h-12">
                  <PlusCircle className="h-5 w-5 text-amber-400" />
                  <div className="text-left">
                    <p className="font-semibold text-sm">Grant or Revoke Points</p>
                    <p className="text-xs text-[var(--muted-foreground)]">Manually add or deduct player points</p>
                  </div>
                </Button>
                <Button onClick={() => setActiveTab("winners")} variant="outline" className="justify-start gap-3 h-12">
                  <Medal className="h-5 w-5 text-purple-400" />
                  <div className="text-left">
                    <p className="font-semibold text-sm">Declare Event Winner</p>
                    <p className="text-xs text-[var(--muted-foreground)]">Award podium places and badges</p>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Points Management */}
      {activeTab === "points" && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Manual Adjustment Form */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
            <h2 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-amber-400" /> Manual Point Adjustment
            </h2>
            <form onSubmit={handlePointAdjust} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userId">User ID (UUID or Email)</Label>
                <Input
                  id="userId"
                  placeholder="Enter User ID..."
                  value={adjustUserId}
                  onChange={(e) => setAdjustUserId(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="points">Points Amount (+ or -)</Label>
                <Input
                  id="points"
                  type="number"
                  placeholder="e.g. 250 or -50"
                  value={adjustPoints}
                  onChange={(e) => setAdjustPoints(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason / Note</Label>
                <Input
                  id="reason"
                  placeholder="e.g. Bonus for organizing community tournament"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full gap-2">
                <ShieldCheck className="h-4 w-4" /> Save Point Adjustment
              </Button>
            </form>
          </div>

          {/* Recent Point Logs */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
            <h2 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
              <History className="h-5 w-5 text-blue-400" /> Recent Point Audit Logs
            </h2>
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {logs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 text-xs">
                  <div>
                    <p className="font-semibold text-sm text-[var(--foreground)]">{log.user?.username || log.userId}</p>
                    <p className="text-[var(--muted-foreground)]">{log.reason || log.source}</p>
                  </div>
                  <div className="text-right">
                    <span className={`font-bold font-mono text-sm ${log.points >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {log.points >= 0 ? `+${log.points}` : log.points}
                    </span>
                    <p className="text-[10px] text-[var(--muted-foreground)]">{new Date(log.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Leaderboard Management */}
      {activeTab === "leaderboard" && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-400" /> Overall Player Leaderboard
            </h2>
            <p className="text-xs text-[var(--muted-foreground)]">Showing top players by total point accumulation</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[var(--border)] text-xs text-[var(--muted-foreground)] uppercase">
                <tr>
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Player</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4 text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {leaderboard.map((item) => (
                  <tr key={item.userId} className="hover:bg-[var(--muted)]/40 transition-colors">
                    <td className="py-3 px-4 font-black">#{item.rank}</td>
                    <td className="py-3 px-4 font-semibold text-[var(--foreground)]">{item.username}</td>
                    <td className="py-3 px-4 text-[var(--muted-foreground)]">{item.email}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-amber-400">{item.totalPoints} PTS</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Winner Management */}
      {activeTab === "winners" && (
        <div className="max-w-2xl mx-auto rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-6">
          <h2 className="text-xl font-bold text-[var(--foreground)] flex items-center gap-2">
            <Medal className="h-6 w-6 text-amber-400" /> Declare Event Podium Winners
          </h2>

          <form onSubmit={handleWinnerAssign} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="winnerUserId">Winner User ID</Label>
              <Input
                id="winnerUserId"
                placeholder="Enter User ID..."
                value={winnerUserId}
                onChange={(e) => setWinnerUserId(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="winnerEvent">Event Name</Label>
              <Input
                id="winnerEvent"
                placeholder="e.g. Valorant Showdown 2026"
                value={winnerEvent}
                onChange={(e) => setWinnerEvent(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {(["1st", "2nd", "3rd"] as const).map((pos) => (
                <button
                  key={pos}
                  type="button"
                  onClick={() => {
                    setWinnerPosition(pos);
                    setWinnerBonus(pos === "1st" ? 500 : pos === "2nd" ? "300" as any : 150);
                  }}
                  className={`p-3 rounded-lg border text-center font-bold transition-colors ${
                    winnerPosition === pos
                      ? "border-amber-400 bg-amber-400/10 text-amber-400"
                      : "border-[var(--border)] hover:bg-[var(--muted)] text-[var(--muted-foreground)]"
                  }`}
                >
                  {pos} Place
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bonus">Bonus Prize Points</Label>
              <Input
                id="bonus"
                type="number"
                value={winnerBonus}
                onChange={(e) => setWinnerBonus(Number(e.target.value))}
              />
            </div>

            <Button type="submit" className="w-full gap-2 bg-amber-500 hover:bg-amber-600 text-black font-bold">
              <Trophy className="h-4 w-4" /> Award Champion Badge & Points
            </Button>
          </form>
        </div>
      )}

      {/* Tab 5: Point Rules */}
      {activeTab === "rules" && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
          <h2 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" /> Active Point Distribution Rules
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              { rule: "Event Registration", pts: "+50 PTS", desc: "Awarded automatically when a user registers for an event." },
              { rule: "QR Code Check-in", pts: "+100 PTS", desc: "Awarded when physical or online QR pass is scanned." },
              { rule: "1st Place Winner", pts: "+500 PTS", desc: "Podium bonus for securing first place in competition." },
              { rule: "2nd Place Winner", pts: "+300 PTS", desc: "Podium bonus for securing runner-up." },
              { rule: "3rd Place Winner", pts: "+150 PTS", desc: "Podium bonus for third place." },
              { rule: "Discord Community Activity", pts: "+25 PTS", desc: "Awarded for participating in official Discord activities." },
            ].map((r, i) => (
              <div key={i} className="p-4 rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm text-[var(--foreground)]">{r.rule}</span>
                  <span className="font-mono text-xs font-bold text-amber-400">{r.pts}</span>
                </div>
                <p className="text-xs text-[var(--muted-foreground)]">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Ranking History */}
      {activeTab === "history" && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4 text-center py-12">
          <History className="h-10 w-10 text-[var(--muted-foreground)] mx-auto" />
          <h3 className="text-base font-semibold text-[var(--foreground)]">Historical Season Rankings</h3>
          <p className="text-sm text-[var(--muted-foreground)] max-w-md mx-auto">
            Past season archives and historical leaderboards from Delhi NCR Gameverse 2025/2026.
          </p>
        </div>
      )}

      {/* Tab 7: Competition Analytics */}
      {activeTab === "analytics" && (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-2">
            <p className="text-xs text-[var(--muted-foreground)] font-medium">Average Points per Player</p>
            <p className="text-2xl font-bold text-amber-400">340 PTS</p>
          </div>
          <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-2">
            <p className="text-xs text-[var(--muted-foreground)] font-medium">Top Point Earner Source</p>
            <p className="text-2xl font-bold text-purple-400">QR Check-in</p>
          </div>
          <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-2">
            <p className="text-xs text-[var(--muted-foreground)] font-medium">Gamification Participation</p>
            <p className="text-2xl font-bold text-emerald-400">84.2%</p>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">{label}</span>
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      <p className="text-2xl font-bold text-[var(--foreground)]">{value}</p>
      <p className="text-xs text-[var(--muted-foreground)]">{sub}</p>
    </div>
  );
}
