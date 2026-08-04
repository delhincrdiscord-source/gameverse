"use server";

import { prisma } from "@gameverse/database";
import { revalidatePath } from "next/cache";

export async function getCompetitionOverviewData() {
  try {
    const totalPointsAgg = await prisma.userPoints.aggregate({
      _sum: { points: true },
      _count: { id: true },
    });

    const topCompetitors = await prisma.userPoints.groupBy({
      by: ["userId"],
      _sum: { points: true },
      orderBy: {
        _sum: {
          points: "desc",
        },
      },
      take: 5,
    });

    const userDetails = await prisma.user.findMany({
      where: {
        id: { in: topCompetitors.map((c) => c.userId) },
      },
      select: {
        id: true,
        username: true,
        globalName: true,
        avatarUrl: true,
        email: true,
      },
    });

    const formattedCompetitors = topCompetitors.map((c, index) => {
      const u = userDetails.find((user) => user.id === c.userId);
      return {
        rank: index + 1,
        userId: c.userId,
        username: u?.username || u?.globalName || "Unknown",
        email: u?.email || "",
        avatarUrl: u?.avatarUrl,
        points: c._sum.points || 0,
      };
    });

    const totalAchievements = await prisma.userAchievement.count();
    const totalBadges = await prisma.userBadge.count();

    return {
      success: true,
      data: {
        totalPointsDistributed: totalPointsAgg._sum.points || 0,
        totalPointTransactions: totalPointsAgg._count.id || 0,
        totalAchievementsAwarded: totalAchievements,
        totalBadgesAwarded: totalBadges,
        topCompetitors: formattedCompetitors,
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to load competition stats" };
  }
}

export async function getPointsLeaderboard(limit = 20) {
  try {
    const leaderboard = await prisma.userPoints.groupBy({
      by: ["userId"],
      _sum: { points: true },
      orderBy: {
        _sum: { points: "desc" },
      },
      take: limit,
    });

    const userIds = leaderboard.map((item) => item.userId);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, username: true, globalName: true, avatarUrl: true, email: true },
    });

    const formatted = leaderboard.map((item, idx) => {
      const u = users.find((user) => user.id === item.userId);
      return {
        rank: idx + 1,
        userId: item.userId,
        username: u?.username || u?.globalName || "Anonymous Gamer",
        email: u?.email || "",
        avatarUrl: u?.avatarUrl,
        totalPoints: item._sum.points || 0,
      };
    });

    return { success: true, data: formatted };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch leaderboard" };
  }
}

export async function adjustUserPoints(userId: string, points: number, reason: string, source = "ADMIN_ADJUSTMENT") {
  try {
    const pointEntry = await prisma.userPoints.create({
      data: {
        userId,
        points,
        reason,
        source,
      },
    });

    revalidatePath("/dashboard/admin/competition");
    return { success: true, data: pointEntry };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to adjust points" };
  }
}

export async function getRecentPointLogs(limit = 15) {
  try {
    const logs = await prisma.userPoints.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { username: true, email: true, avatarUrl: true },
        },
      },
    });
    return { success: true, data: logs };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch point logs" };
  }
}

export async function assignEventWinner(userId: string, eventTitle: string, position: "1st" | "2nd" | "3rd", rewardPoints = 500) {
  try {
    const reason = `Winner (${position} Place) - ${eventTitle}`;
    await prisma.userPoints.create({
      data: {
        userId,
        points: rewardPoints,
        reason,
        source: "COMPETITION_WINNER",
      },
    });

    // Optionally create or award badge
    const badgeName = `${position} Place Champion`;
    let badge = await prisma.badge.findUnique({ where: { name: badgeName } });
    if (!badge) {
      badge = await prisma.badge.create({
        data: {
          name: badgeName,
          description: `Awarded for securing ${position} place in ${eventTitle}`,
          icon: "Trophy",
          tier: position === "1st" ? "GOLD" : position === "2nd" ? "SILVER" : "BRONZE",
          pointValue: rewardPoints,
        },
      });
    }

    await prisma.userBadge.upsert({
      where: { userId_badgeId: { userId, badgeId: badge.id } },
      create: { userId, badgeId: badge.id },
      update: {},
    });

    revalidatePath("/dashboard/admin/competition");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to assign winner" };
  }
}
