import pino from "pino";

const isDev = process.env.NODE_ENV !== "production";
const isBrowser = typeof window !== "undefined";

const stream =
  !isBrowser && typeof pino.destination === "function"
    ? pino.destination(1)
    : undefined;

export const logger = pino(
  {
    level: process.env.LOG_LEVEL || (isDev ? "debug" : "info"),
    serializers: {
      err: pino.stdSerializers?.err,
      req: pino.stdSerializers?.req,
      res: pino.stdSerializers?.res,
    },
    redact: {
      paths: [
        "req.headers.authorization",
        "req.headers.cookie",
        "password",
        "botToken",
        "clientSecret",
        "token",
        "secret",
      ],
      remove: true,
    },
    browser: {
      asObject: true,
    },
  },
  stream as any,
);

export function createChildLogger(name: string) {
  return logger.child({ module: name });
}

