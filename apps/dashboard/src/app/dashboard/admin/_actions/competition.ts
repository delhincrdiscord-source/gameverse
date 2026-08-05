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

async function findUserId(userIdentifier: string): Promise<string | null> {
  const identifier = userIdentifier.trim();
  if (!identifier) return null;

  // 1. Valid UUID check
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(identifier)) {
    const userById = await prisma.user.findUnique({
      where: { id: identifier },
      select: { id: true },
    });
    if (userById) return userById.id;
  }

  // 2. Search User by email
  const userByEmail = await prisma.user.findFirst({
    where: { email: { equals: identifier, mode: "insensitive" } },
    select: { id: true },
  });
  if (userByEmail) return userByEmail.id;

  // 3. Search User by username
  const userByUsername = await prisma.user.findFirst({
    where: { username: { equals: identifier, mode: "insensitive" } },
    select: { id: true },
  });
  if (userByUsername) return userByUsername.id;

  // 4. Search User by globalName
  const userByGlobalName = await prisma.user.findFirst({
    where: { globalName: { equals: identifier, mode: "insensitive" } },
    select: { id: true },
  });
  if (userByGlobalName) return userByGlobalName.id;

  // 5. Search Registration by discordUsername or email
  const reg = await prisma.registration.findFirst({
    where: {
      OR: [
        { discordUsername: { equals: identifier, mode: "insensitive" } },
        { email: { equals: identifier, mode: "insensitive" } },
      ],
    },
    select: { userId: true },
  });
  if (reg?.userId) return reg.userId;

  return null;
}

export async function adjustUserPoints(userIdentifier: string, points: number, reason: string, source = "ADMIN_ADJUSTMENT") {
  try {
    const userId = await findUserId(userIdentifier);
    if (!userId) {
      return {
        success: false,
        error: `User "${userIdentifier}" not found. Please provide a valid User ID (UUID), Email, Username, or Discord username.`
      };
    }

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

export async function assignEventWinner(userIdentifier: string, eventTitle: string, position: "1st" | "2nd" | "3rd", rewardPoints = 500) {
  try {
    const userId = await findUserId(userIdentifier);
    if (!userId) {
      return {
        success: false,
        error: `User "${userIdentifier}" not found. Please provide a valid User ID (UUID), Email, Username, or Discord username.`
      };
    }

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
