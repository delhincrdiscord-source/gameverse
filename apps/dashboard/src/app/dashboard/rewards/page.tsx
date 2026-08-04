"use client";

import { useState, useEffect, useTransition } from "react";
import { motion } from "framer-motion";
import { Gift, Sparkles, Coins, PackageCheck, AlertCircle, ShoppingBag, CheckCircle2 } from "lucide-react";

import { Card, CardContent } from "@gameverse/ui/card";
import { Badge } from "@gameverse/ui/badge";
import { Button } from "@gameverse/ui/button";
import { Skeleton } from "@gameverse/ui/skeleton";

import { getUserRewards } from "@/app/dashboard/_actions/gamification";

type AvailableReward = {
  id: string;
  name: string;
  description: string;
  icon: string;
  pointCost: number;
  stock: number;
};

type RedeemedReward = {
  id: string;
  name: string;
  icon: string;
  redeemedAt: Date;
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
};

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function RewardsPage() {
  const [available, setAvailable] = useState<AvailableReward[]>([]);
  const [redeemed, setRedeemed] = useState<RedeemedReward[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function fetchRewards() {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getUserRewards();
        if (!result.success) {
          setError(result.error ?? "Failed to load rewards");
          return;
        }
        setAvailable(result.data.available);
        setRedeemed(result.data.redeemed);
        setUserPoints(result.data.userPoints);
      } catch {
        setError("Something went wrong loading rewards");
      } finally {
        setIsLoading(false);
      }
    }
    fetchRewards();
  }, []);

  return (
    <div className="space-y-8 p-1">
      {/* ── Header Banner ────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-r from-amber-950/30 via-[var(--card)] to-purple-950/20 p-6 sm:p-8">
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />
        
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
              <Gift className="h-3.5 w-3.5" /> Rewards Store
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--foreground)] flex items-center gap-2">
              Festival Rewards
            </h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              Redeem your hard-earned GameVerse points for exclusive passes, merchandise, and perks!
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-5 py-3 shadow-lg shadow-amber-500/5">
              <Coins className="h-6 w-6 text-amber-400 animate-pulse" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300/70">Your Balance</p>
                <p className="text-xl font-black text-amber-300">{userPoints.toLocaleString()} <span className="text-xs font-semibold">PTS</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="rounded-2xl border border-[var(--border)] bg-[var(--card)]">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-14 w-14 rounded-2xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-[140px]" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-[80%]" />
                    <div className="flex gap-2 mt-3">
                      <Skeleton className="h-5 w-[70px] rounded-full" />
                      <Skeleton className="h-5 w-[60px] rounded-full" />
                    </div>
                    <Skeleton className="h-10 w-full mt-4 rounded-xl" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="rounded-2xl border border-[var(--border)] bg-[var(--card)]">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <AlertCircle className="h-12 w-12 text-red-400 mb-3" />
            <h3 className="text-lg font-bold text-[var(--foreground)]">Failed to Load Rewards</h3>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">{error}</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* ── Available Rewards ────────────────────────────────────────────────── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-purple-400" />
                Available Rewards
                <Badge variant="secondary" className="rounded-full bg-[var(--muted)] text-[var(--foreground)] text-xs px-2.5">
                  {available.length}
                </Badge>
              </h2>
            </div>

            {available.length === 0 ? (
              <Card className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)]">
                <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                  <PackageCheck className="h-12 w-12 text-[var(--muted-foreground)] opacity-40 mb-3" />
                  <p className="font-semibold text-[var(--foreground)]">No rewards available</p>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">Check back soon for new festival perks!</p>
                </CardContent>
              </Card>
            ) : (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
              >
                {available.map((reward) => {
                  const canAfford = userPoints >= reward.pointCost;
                  const inStock = reward.stock > 0;
                  const isDisabled = !canAfford || !inStock || isPending;

                  return (
                    <motion.div key={reward.id} variants={item}>
                      <Card className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300 flex flex-col justify-between h-full">
                        <CardContent className="p-6 flex flex-col justify-between h-full">
                          <div>
                            <div className="flex items-start justify-between gap-3 mb-4">
                              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-3xl group-hover:scale-110 transition-transform duration-300 shadow-inner">
                                {reward.icon}
                              </div>
                              <Badge
                                variant="outline"
                                className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                                  inStock
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                    : "bg-red-500/10 text-red-400 border-red-500/30"
                                }`}
                              >
                                {inStock ? `${reward.stock} in stock` : "Out of stock"}
                              </Badge>
                            </div>

                            <h3 className="text-base font-bold text-[var(--foreground)] group-hover:text-amber-400 transition-colors">
                              {reward.name}
                            </h3>
                            <p className="mt-1.5 text-xs text-[var(--muted-foreground)] leading-relaxed line-clamp-2">
                              {reward.description}
                            </p>
                          </div>

                          <div className="mt-6 pt-4 border-t border-[var(--border)]">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-xs text-[var(--muted-foreground)]">Price</span>
                              <span className="flex items-center gap-1 font-black text-amber-400 text-sm">
                                <Sparkles className="h-3.5 w-3.5" />
                                {reward.pointCost.toLocaleString()} PTS
                              </span>
                            </div>

                            <Button
                              size="lg"
                              className={`w-full rounded-xl font-bold transition-all duration-200 ${
                                canAfford && inStock
                                  ? "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 active:scale-[0.98]"
                                  : "bg-[var(--muted)] text-[var(--muted-foreground)] border border-[var(--border)] cursor-not-allowed opacity-70"
                              }`}
                              disabled={isDisabled}
                              onClick={() => {
                                if (isDisabled) return;
                                startTransition(async () => {
                                  setAvailable((prev) =>
                                    prev
                                      .map((r) =>
                                        r.id === reward.id
                                          ? { ...r, stock: r.stock - 1 }
                                          : r
                                      )
                                      .filter((r) => r.stock > 0)
                                  );
                                  setUserPoints((prev) => prev - reward.pointCost);
                                  setRedeemed((prev) => [
                                    {
                                      id: reward.id,
                                      name: reward.name,
                                      icon: reward.icon,
                                      redeemedAt: new Date(),
                                    },
                                    ...prev,
                                  ]);
                                });
                              }}
                            >
                              {!canAfford
                                ? `Need ${(reward.pointCost - userPoints).toLocaleString()} more pts`
                                : !inStock
                                ? "Out of Stock"
                                : "Redeem Reward"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>

          {/* ── Redeemed Rewards ──────────────────────────────────────────────────── */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                Your Redeemed Rewards
                <Badge variant="secondary" className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5">
                  {redeemed.length}
                </Badge>
              </h2>
            </div>

            {redeemed.length === 0 ? (
              <Card className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)]">
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                  <Gift className="h-10 w-10 text-[var(--muted-foreground)] opacity-30 mb-2" />
                  <p className="text-sm font-medium text-[var(--muted-foreground)]">
                    You haven&apos;t redeemed any rewards yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
              >
                {redeemed.map((reward) => (
                  <motion.div key={`${reward.id}-${reward.redeemedAt.toString()}`} variants={item}>
                    <Card className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/50 transition-colors">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-2xl">
                            {reward.icon}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-sm text-[var(--foreground)] truncate">
                              {reward.name}
                            </h3>
                            <p className="text-xs text-emerald-400/80 font-medium mt-0.5 flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" /> Redeemed on {formatDate(reward.redeemedAt)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
