import { createAuthClient } from "better-auth/react";

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_DASHBOARD_URL || "https://dashboard.delhincr.fun";
};

export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
});
