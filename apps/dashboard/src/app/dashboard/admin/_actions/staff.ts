"use server";

import { prisma } from "@gameverse/database";
import { revalidatePath } from "next/cache";

export async function getStaffRolesAndPermissions() {
  try {
    const roles = await prisma.role.findMany({
      include: {
        rolePermissions: {
          include: { permission: true },
        },
        userRoles: {
          include: {
            user: {
              select: { id: true, username: true, email: true, avatarUrl: true },
            },
          },
        },
      },
    });

    const allPermissions = await prisma.permission.findMany();

    return {
      success: true,
      data: {
        roles: roles.map((r) => ({
          id: r.id,
          name: r.name,
          description: r.description,
          assignedUserCount: r.userRoles.length,
          users: r.userRoles.map((ur) => ur.user),
          permissions: r.rolePermissions.map((rp) => rp.permission),
        })),
        allPermissions,
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch staff roles" };
  }
}

export async function banOrUnbanUser(userId: string, action: "ban" | "unban", banReason?: string) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        bannedAt: action === "ban" ? new Date() : null,
        banReason: action === "ban" ? banReason || "Banned by administrator" : null,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: action === "ban" ? "USER_BANNED" : "USER_UNBANNED",
        targetEntity: "User",
        targetId: userId,
        changesJson: { reason: banReason },
      },
    });

    revalidatePath("/dashboard/admin/staff");
    return { success: true, data: user };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to perform user moderation action" };
  }
}

export async function getSystemAuditLogs(limit = 25) {
  try {
    const logs = await prisma.auditLog.findMany({
      take: limit,
      orderBy: { timestamp: "desc" },
      include: {
        actor: {
          select: { username: true, email: true },
        },
      },
    });
    return { success: true, data: logs };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch audit logs" };
  }
}
