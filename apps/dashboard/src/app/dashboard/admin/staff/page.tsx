"use client";

import React, { useState, useEffect } from "react";
import { Users, Shield, Key, Mic, Gavel, UserX, Activity, Search, Check, AlertTriangle } from "lucide-react";
import { Button } from "@gameverse/ui/button";
import { Input } from "@gameverse/ui/input";
import { Label } from "@gameverse/ui/label";
import { getStaffRolesAndPermissions, banOrUnbanUser, getSystemAuditLogs } from "../_actions/staff";

export default function StaffManagementPage() {
  const [activeTab, setActiveTab] = useState<"roles" | "permissions" | "hosts" | "judges" | "moderators" | "audit">("roles");
  const [staffData, setStaffData] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Moderation state
  const [modUserId, setModUserId] = useState("");
  const [banReason, setBanReason] = useState("");
  const [modSuccess, setModSuccess] = useState("");
  const [modError, setModError] = useState("");

  const loadData = async () => {
    setLoading(true);
    const [sRes, aRes] = await Promise.all([
      getStaffRolesAndPermissions(),
      getSystemAuditLogs(20),
    ]);
    if (sRes.success) setStaffData(sRes.data);
    if (aRes.success) setAuditLogs(aRes.data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleModeration = async (action: "ban" | "unban") => {
    setModSuccess("");
    setModError("");
    if (!modUserId) {
      setModError("Please enter a User ID");
      return;
    }
    const res = await banOrUnbanUser(modUserId, action, banReason);
    if (res.success) {
      setModSuccess(`User has been successfully ${action}ned.`);
      setModUserId("");
      setBanReason("");
      loadData();
    } else {
      setModError(res.error || "Moderation action failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-3">
            <Users className="h-8 w-8 text-emerald-400" /> Staff & RBAC Management
          </h1>
          <p className="text-[var(--muted-foreground)]">
            Manage system roles, permissions, event hosts, tournament judges, moderators, and audit logs.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[var(--border)] pb-2">
        {[
          { id: "roles", label: "Roles", icon: Shield },
          { id: "permissions", label: "Permissions", icon: Key },
          { id: "hosts", label: "Event Hosts", icon: Mic },
          { id: "judges", label: "Judges Panel", icon: Gavel },
          { id: "moderators", label: "Moderators & Ban Controls", icon: UserX },
          { id: "audit", label: "Activity & Audit Logs", icon: Activity },
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
      {modSuccess && (
        <div className="rounded-lg bg-green-500/10 border border-green-500/30 p-4 text-green-400 text-sm font-medium">
          ✅ {modSuccess}
        </div>
      )}
      {modError && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-4 text-red-400 text-sm font-medium">
          ❌ {modError}
        </div>
      )}

      {/* Tab 1: Roles */}
      {activeTab === "roles" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {staffData?.roles?.map((role: any) => (
            <div key={role.id} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-base text-[var(--foreground)]">{role.name}</h3>
                  <p className="text-xs text-[var(--muted-foreground)]">{role.description || "System RBAC Role"}</p>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                  {role.assignedUserCount} Users
                </span>
              </div>

              <div className="pt-2 border-t border-[var(--border)] text-xs text-[var(--muted-foreground)] space-y-1">
                <p className="font-semibold text-[var(--foreground)]">Assigned Permissions:</p>
                <div className="flex flex-wrap gap-1">
                  {role.permissions?.length > 0 ? (
                    role.permissions.map((p: any) => (
                      <span key={p.id} className="px-2 py-0.5 rounded bg-[var(--muted)] border border-[var(--border)] font-mono text-[10px]">
                        {p.key}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-[var(--muted-foreground)] italic">Default Member Permissions</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Permissions Matrix */}
      {activeTab === "permissions" && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
          <h2 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
            <Key className="h-5 w-5 text-emerald-400" /> System Permission Keys
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              { key: "manage_festivals", desc: "Create, edit, and publish festival editions" },
              { key: "manage_events", desc: "Create, edit, schedule, and delete community events" },
              { key: "manage_registrations", desc: "Approve, reject, check-in, or revoke registration passes" },
              { key: "manage_points", desc: "Grant, deduct, or recalculate player competition points" },
              { key: "manage_discord", desc: "Modify Discord bot settings, channel mappings, and slash commands" },
              { key: "manage_staff", desc: "Assign roles and permissions to other staff members" },
            ].map((p, i) => (
              <div key={i} className="p-4 rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-sm text-emerald-400">{p.key}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-500/10 text-green-400 uppercase">ACTIVE</span>
                </div>
                <p className="text-xs text-[var(--muted-foreground)]">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Hosts */}
      {activeTab === "hosts" && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
              <Mic className="h-5 w-5 text-indigo-400" /> Active Event Hosts & MCs
            </h2>
            <Button size="sm">Assign Event Host</Button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              { name: "Alex R.", handle: "@alex_host", event: "Valorant Championship Stage 1" },
              { name: "Priya S.", handle: "@priya_mc", event: "Cosplay Showcase 2026" },
            ].map((h, i) => (
              <div key={i} className="p-4 rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 flex justify-between items-center">
                <div>
                  <p className="font-bold text-sm text-[var(--foreground)]">{h.name}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">{h.handle}</p>
                </div>
                <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20">
                  {h.event}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Judges Panel */}
      {activeTab === "judges" && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
              <Gavel className="h-5 w-5 text-amber-400" /> Tournament Judges Panel
            </h2>
            <Button size="sm">Add Judge</Button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              { name: "Vikram K.", category: "Esports (FPS Referee)", assignedEvents: 3 },
              { name: "Sara M.", category: "Cosplay & Art Jury", assignedEvents: 2 },
            ].map((j, i) => (
              <div key={i} className="p-4 rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 flex justify-between items-center">
                <div>
                  <p className="font-bold text-sm text-[var(--foreground)]">{j.name}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">{j.category}</p>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400">{j.assignedEvents} Events Assigned</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Moderators & Ban Controls */}
      {activeTab === "moderators" && (
        <div className="max-w-2xl mx-auto rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-6">
          <h2 className="text-xl font-bold text-[var(--foreground)] flex items-center gap-2 text-red-400">
            <UserX className="h-6 w-6" /> User Moderation Controls (Ban / Unban)
          </h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="modUserId">Target User ID (UUID)</Label>
              <Input
                id="modUserId"
                placeholder="Enter User ID..."
                value={modUserId}
                onChange={(e) => setModUserId(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="banReason">Reason for Ban / Action</Label>
              <Input
                id="banReason"
                placeholder="e.g. Violation of community guidelines during tournament"
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => handleModeration("ban")}
                variant="destructive"
                className="gap-2 font-bold"
              >
                <UserX className="h-4 w-4" /> Ban User
              </Button>
              <Button
                onClick={() => handleModeration("unban")}
                variant="outline"
                className="gap-2 font-bold"
              >
                <Check className="h-4 w-4" /> Unban User
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Audit Logs */}
      {activeTab === "audit" && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-400" /> Global System Audit Trail
            </h2>
            <span className="text-xs text-[var(--muted-foreground)]">System action history</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[var(--border)] text-xs text-[var(--muted-foreground)] uppercase">
                <tr>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Target Entity</th>
                  <th className="py-3 px-4">Target ID</th>
                  <th className="py-3 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[var(--muted)]/40">
                    <td className="py-3 px-4 font-mono font-bold text-xs text-blue-400">{log.action}</td>
                    <td className="py-3 px-4 text-[var(--foreground)]">{log.targetEntity}</td>
                    <td className="py-3 px-4 font-mono text-xs text-[var(--muted-foreground)]">{log.targetId || "—"}</td>
                    <td className="py-3 px-4 text-right font-mono text-xs text-[var(--muted-foreground)]">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
