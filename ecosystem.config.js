// ====================================================
// PM2 Ecosystem Config — Delhi NCR Gameverse 2026
// ====================================================

const path = require("path");
const fs = require("fs");

try {
  const dotenv = require("dotenv");
  const dbEnv = path.join(__dirname, "packages/database/.env");
  if (fs.existsSync(dbEnv)) {
    dotenv.config({ path: dbEnv });
  }
  const rootEnv = path.join(__dirname, ".env");
  if (fs.existsSync(rootEnv)) {
    dotenv.config({ path: rootEnv });
  }
} catch {
  // Fail-safe if dotenv is not installed in root
}

module.exports = {
  apps: [
    // ── Dashboard (Next.js) ──────────────────────
    {
      name: "gameverse-dashboard",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3090",
      cwd: path.join(__dirname, "apps/dashboard"),
      interpreter: "node",
      env: {
        NODE_ENV: "production",
        PORT: 3090,
        DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,
      },
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "512M",
      exp_backoff_restart_delay: 100,
      watch: false,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      error_file: "logs/dashboard-error.log",
      out_file: "logs/dashboard-out.log",
      merge_logs: true,
    },
  ],
};
