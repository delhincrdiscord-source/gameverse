import { auth } from "@gameverse/auth/server";
import { toNextJsHandler } from "better-auth/next-js";
import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

const handler = toNextJsHandler(auth);
const BETTER_AUTH_URL = process.env.BETTER_AUTH_URL || "https://dashboard.delhincr.fun";

function copyCookies(source: Response, target: NextResponse) {
  const setCookieHeader = source.headers.get("set-cookie");
  if (setCookieHeader) {
    target.headers.append("set-cookie", setCookieHeader);
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);

  if (
    url.pathname.includes("/api/auth/login/discord") ||
    url.pathname.includes("/api/auth/discord")
  ) {
    const rawCallback = url.searchParams.get("callbackURL");
    const callbackURL =
      rawCallback && rawCallback.startsWith("http")
        ? rawCallback
        : `${BETTER_AUTH_URL}/dashboard`;

    try {
      const apiRes = await auth.api.signInSocial({
        body: {
          provider: "discord",
          callbackURL,
        },
        headers: request.headers,
        asResponse: true,
      });

      if (apiRes) {
        const data = (await apiRes.clone().json().catch(() => null)) as
          | { url?: string }
          | null;
        if (data?.url) {
          const response = NextResponse.redirect(data.url);
          copyCookies(apiRes, response);
          return response;
        }
      }
    } catch (error: unknown) {
      logger.error({ err: error }, "signInSocial API call failed");
      return NextResponse.json(
        { error: "Discord sign-in failed" },
        { status: 500 }
      );
    }
  }

  try {
    const res = await handler.GET(request);
    return res;
  } catch (error: unknown) {
    logger.error({ err: error }, "Auth GET handler error");
    return NextResponse.json({ error: "Auth error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const res = await handler.POST(request);
    return res;
  } catch (error: unknown) {
    logger.error({ err: error }, "Auth POST handler error");
    return NextResponse.json({ error: "Auth error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  return handler.PATCH ? handler.PATCH(request) : NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PUT(request: Request) {
  return handler.PUT ? handler.PUT(request) : NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE(request: Request) {
  return handler.DELETE ? handler.DELETE(request) : NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
