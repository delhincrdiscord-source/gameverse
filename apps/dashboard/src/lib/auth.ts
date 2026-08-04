import { auth } from "@gameverse/auth/server";
import { prisma } from "@gameverse/database";
import { headers } from "next/headers";
import type { RoleName } from "@gameverse/constants";
import { ROLE_HIERARCHY } from "@gameverse/constants";
import { logger } from "./logger";

export interface AuthSession {
  userId: string;
  sessionId: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
    bannedAt: Date | null;
  };
}

export async function getSession(): Promise<AuthSession | null> {
  try {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({
      headers: reqHeaders,
    });

    if (!session?.user || !session?.session) return null;

    let user: {
      id: string;
      username: string;
      email: string;
      bannedAt: Date | null;
      userRoles: Array<{ role: { name: RoleName } }>;
    } | null = null;
    try {
      user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          username: true,
          email: true,
          bannedAt: true,
          userRoles: {
            select: {
              role: {
                select: { name: true },
              },
            },
          },
        },
      });
    } catch (dbError) {
      logger.error({ err: dbError, userId: session.user.id }, "DB lookup by id failed in getSession");
    }

    if (!user && session.user.email) {
      try {
        user = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: {
            id: true,
            username: true,
            email: true,
            bannedAt: true,
            userRoles: {
              select: {
                role: {
                  select: { name: true },
                },
              },
            },
          },
        });
      } catch (dbError) {
        logger.error({ err: dbError, email: session.user.email }, "DB lookup by email failed in getSession");
      }
    }

    if (!user) {
      return {
        userId: session.user.id,
        sessionId: session.session.id,
        user: {
          id: session.user.id,
          username: session.user.name || session.user.email?.split("@")[0] || "Player",
          email: session.user.email || "",
          role: "MEMBER",
          bannedAt: null,
        },
      };
    }

    if (user.bannedAt) return null;

    const firstUserRole = user.userRoles?.[0];
    const highestRole: string = firstUserRole
      ? (user.userRoles as Array<{ role: { name: string } }>).reduce<string>((highest: string, ur: { role: { name: string } }) => {
          const current: number = ROLE_HIERARCHY[ur.role.name as RoleName] ?? 0;
          const best: number = ROLE_HIERARCHY[highest as RoleName] ?? 0;
          return current > best ? ur.role.name : highest;
        }, firstUserRole.role.name)
      : "MEMBER";

    return {
      userId: user.id,
      sessionId: session.session.id,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: highestRole,
        bannedAt: user.bannedAt,
      },
    };
  } catch (error) {
    logger.error({ err: error }, "getSession failed unexpectedly");
    return null;
  }
}

export async function requireAuth(): Promise<AuthSession> {
  const session = await getSession();
  if (!session) {
    throw new AuthError("UNAUTHORIZED", "You must be signed in to perform this action");
  }
  return session;
}

export async function requireAdmin(): Promise<AuthSession> {
  const session = await requireAuth();
  if (session.user.role !== "ADMIN" && session.user.role !== "ORGANIZER") {
    throw new AuthError("FORBIDDEN", "You do not have permission to perform this action");
  }
  return session;
}

export async function requireRole(minRole: RoleName): Promise<AuthSession> {
  const session = await requireAuth();
  const userLevel = ROLE_HIERARCHY[session.user.role as RoleName] ?? 0;
  const requiredLevel = ROLE_HIERARCHY[minRole] ?? 0;
  if (userLevel < requiredLevel) {
    throw new AuthError("FORBIDDEN", "You do not have permission to perform this action");
  }
  return session;
}

export class AuthError extends Error {
  code: string;
  constructor(
    code: string,
    message: string,
  ) {
    super(message);
    this.code = code;
    this.name = "AuthError";
  }
}
