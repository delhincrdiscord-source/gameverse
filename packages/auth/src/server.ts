import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@gameverse/database/client";
import { createAuthMiddleware } from "better-auth/api";
import { linkDiscordAccount, verifyGuildMembership, type DiscordProfile } from "./discord";
import { logger } from "./logger";

const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID;
const BETTER_AUTH_URL = process.env.BETTER_AUTH_URL || "https://dashboard.delhincr.fun";

export const auth = betterAuth({
  baseURL: BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET || "gameverse-secret-key-32-chars-min-length-production",
  advanced: {
    database: {
      generateId: () => crypto.randomUUID(),
    },
    crossSubdomainCookies: {
      enabled: true,
      domain: ".delhincr.fun",
    },
    defaultCookieAttributes: {
      sameSite: "lax",
      secure: true,
    },
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    modelName: "User",
    fields: {
      name: "username",
      image: "avatarUrl",
      password: "passwordHash",
    } as Record<string, string>,
  },
  session: {
    modelName: "Session",
    expiresIn: 60 * 60 * 24, // 24 hours
    updateAge: 60 * 60 * 12, // 12 hours
  },
  account: {
    modelName: "Account",
    fields: {
      accessTokenExpiresAt: "tokenExpiresAt",
      accountId: "providerAccountId",
      providerId: "provider",
    },
  },
  verification: {
    modelName: "VerificationToken",
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      scope: ["identify", "email", "guilds.members.read"],
      mapProfileToUser: (profile) => ({
        name: profile.username || profile.global_name || profile.id,
        email: profile.email ?? `${profile.id}@discord.placeholder.local`,
        username: profile.username || profile.id,
        globalName: profile.global_name,
        avatarUrl: profile.avatar
          ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
          : null,
      }),
    },
  },
  trustedOrigins: [
    process.env.NEXT_PUBLIC_LANDING_URL!,
    process.env.NEXT_PUBLIC_DASHBOARD_URL!,
    "https://dashboard.delhincr.fun",
    "https://gameverse.delhincr.fun",
  ],
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.includes("/callback/discord") || ctx.path.includes("/sign-in/social")) {
        const session = ctx.context.newSession;
        if (!session) return;

        const userId = session.user.id;

        try {
          const account = await prisma.account.findFirst({
            where: {
              userId,
              provider: "discord",
            },
            orderBy: { createdAt: "desc" },
          });

          if (account && account.accessToken) {
            const discordAccount = await prisma.discordAccount.findUnique({
              where: { userId },
            });

            if (!discordAccount) {
              const profileResponse = await fetch(
                "https://discord.com/api/v10/users/@me",
                {
                  headers: {
                    Authorization: `Bearer ${account.accessToken}`,
                  },
                }
              );

              if (profileResponse.ok) {
                const profile = await profileResponse.json() as DiscordProfile;

                await linkDiscordAccount(userId, profile, {
                  accessToken: account.accessToken,
                  refreshToken: account.refreshToken || "",
                  expiresIn: 3600,
                  scope: account.scope || "identify email guilds.members.read",
                });

                if (DISCORD_GUILD_ID) {
                  await verifyGuildMembership(profile.id, DISCORD_GUILD_ID);
                }
              }
            }
          }
        } catch (error) {
          logger.error(`Failed to link Discord account: ${error instanceof Error ? error.message : String(error)}`, { err: error });
        }
      }
    }),
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          return {
            data: {
              ...user,
              emailVerified: true,
              isVerified: true,
              username: user.username || user.name || `user_${Math.random().toString(36).substring(2, 8)}`,
            },
          };
        },
      },
    },
  },
});

export type Auth = typeof auth;
