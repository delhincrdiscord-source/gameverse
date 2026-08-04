import { NextResponse } from "next/server";
import { auth } from "@gameverse/auth/server";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const rawCallback = url.searchParams.get("callbackURL");
  const callbackURL = (rawCallback && rawCallback.startsWith("http"))
    ? rawCallback
    : "/dashboard";

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
      const cloned = apiRes.clone();
      const data = (await cloned.json().catch(() => null)) as { url?: string } | null;

      if (data?.url) {
        const response = NextResponse.redirect(data.url);
        
        // Forward set-cookie headers so the state token cookie is stored in the user's browser!
        const setCookies = apiRes.headers.getSetCookie?.() || [];
        if (setCookies.length > 0) {
          for (const cookie of setCookies) {
            response.headers.append("set-cookie", cookie);
          }
        } else {
          apiRes.headers.forEach((val, key) => {
            if (key.toLowerCase() === "set-cookie") {
              response.headers.append("set-cookie", val);
            }
          });
        }
        return response;
      }
    }

    return apiRes;
  } catch (error: unknown) {
    logger.error({ err: error }, "signInSocial failed in /api/auth/discord");
    return NextResponse.redirect(new URL("/login?error=oauth_init_failed", request.url));
  }
}
