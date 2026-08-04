import { logger } from "@/lib/logger";

const ADMIN_REGISTRATION_CHANNEL_ID = "1533252061452308682";

interface RegistrationNotificationPayload {
  passNumber: string;
  name: string;
  email: string;
  interest: string;
  discordUserId: string;
  discordUsername: string;
  festivalName: string;
}

/**
 * Generates an SVG ticket image and converts it to a Data URL / Buffer for Discord
 */
export function generateTicketSvg(payload: {
  passNumber: string;
  name: string;
  interest: string;
  festivalName: string;
}): string {
  const svg = `
  <svg width="600" height="240" viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f0728"/>
        <stop offset="50%" stop-color="#180e3d"/>
        <stop offset="100%" stop-color="#090518"/>
      </linearGradient>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#f59e0b"/>
        <stop offset="100%" stop-color="#fbbf24"/>
      </linearGradient>
      <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#8b5cf6"/>
        <stop offset="100%" stop-color="#ec4899"/>
      </linearGradient>
      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#ffffff" stroke-opacity="0.04" stroke-width="1"/>
      </pattern>
    </defs>

    <!-- Outer Card Background -->
    <rect width="600" height="240" rx="16" fill="url(#bgGrad)" stroke="#8b5cf6" stroke-opacity="0.3" stroke-width="2"/>
    <rect width="600" height="240" rx="16" fill="url(#grid)"/>

    <!-- Top Accent Bar -->
    <rect x="0" y="0" width="600" height="6" fill="url(#purpleGrad)"/>

    <!-- Decorative Glow Circles -->
    <circle cx="50" cy="50" r="100" fill="#8b5cf6" fill-opacity="0.08" filter="blur(30px)"/>
    <circle cx="550" cy="190" r="120" fill="#f59e0b" fill-opacity="0.08" filter="blur(30px)"/>

    <!-- Header / Branding -->
    <text x="30" y="42" font-family="system-ui, sans-serif" font-size="12" font-weight="800" fill="#a78bfa" letter-spacing="3">DELHI NCR GAMEVERSE 2026</text>
    <text x="30" y="65" font-family="system-ui, sans-serif" font-size="20" font-weight="900" fill="#ffffff" letter-spacing="1">OFFICIAL FESTIVAL PASS</text>

    <!-- Dashed Ticket Divider -->
    <line x1="420" y1="20" x2="420" y2="220" stroke="#ffffff" stroke-opacity="0.15" stroke-dasharray="6,6" stroke-width="2"/>

    <!-- Left Section: Participant Info -->
    <text x="30" y="105" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#9ca3af" letter-spacing="1">PASS HOLDER</text>
    <text x="30" y="128" font-family="system-ui, sans-serif" font-size="18" font-weight="800" fill="#ffffff">${escapeXml(payload.name)}</text>

    <text x="30" y="165" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#9ca3af" letter-spacing="1">CATEGORY / INTEREST</text>
    <text x="30" y="186" font-family="system-ui, sans-serif" font-size="14" font-weight="700" fill="#f59e0b">${escapeXml(payload.interest)}</text>

    <text x="220" y="165" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#9ca3af" letter-spacing="1">STATUS</text>
    <text x="220" y="186" font-family="system-ui, sans-serif" font-size="14" font-weight="800" fill="#34d399">✓ CONFIRMED</text>

    <!-- Right Stub: Pass Code -->
    <text x="445" y="65" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#9ca3af" letter-spacing="1">PASS CODE</text>
    <rect x="440" y="78" width="135" height="42" rx="8" fill="#1e1b4b" stroke="#8b5cf6" stroke-opacity="0.5" stroke-width="1.5"/>
    <text x="507" y="105" font-family="monospace" font-size="13" font-weight="900" fill="#fbbf24" text-anchor="middle" letter-spacing="1">${payload.passNumber}</text>

    <!-- Barcode style lines -->
    <g transform="translate(440, 135)">
      <rect x="0" y="0" width="3" height="45" fill="#ffffff" fill-opacity="0.8"/>
      <rect x="5" y="0" width="1" height="45" fill="#ffffff" fill-opacity="0.8"/>
      <rect x="8" y="0" width="4" height="45" fill="#ffffff" fill-opacity="0.8"/>
      <rect x="14" y="0" width="2" height="45" fill="#ffffff" fill-opacity="0.8"/>
      <rect x="18" y="0" width="5" height="45" fill="#ffffff" fill-opacity="0.8"/>
      <rect x="25" y="0" width="2" height="45" fill="#ffffff" fill-opacity="0.8"/>
      <rect x="29" y="0" width="1" height="45" fill="#ffffff" fill-opacity="0.8"/>
      <rect x="32" y="0" width="4" height="45" fill="#ffffff" fill-opacity="0.8"/>
      <rect x="38" y="0" width="2" height="45" fill="#ffffff" fill-opacity="0.8"/>
      <rect x="42" y="0" width="6" height="45" fill="#ffffff" fill-opacity="0.8"/>
      <rect x="50" y="0" width="1" height="45" fill="#ffffff" fill-opacity="0.8"/>
      <rect x="53" y="0" width="3" height="45" fill="#ffffff" fill-opacity="0.8"/>
      <rect x="58" y="0" width="2" height="45" fill="#ffffff" fill-opacity="0.8"/>
      <rect x="62" y="0" width="5" height="45" fill="#ffffff" fill-opacity="0.8"/>
      <rect x="69" y="0" width="1" height="45" fill="#ffffff" fill-opacity="0.8"/>
      <rect x="72" y="0" width="4" height="45" fill="#ffffff" fill-opacity="0.8"/>
      <rect x="78" y="0" width="2" height="45" fill="#ffffff" fill-opacity="0.8"/>
      <rect x="82" y="0" width="6" height="45" fill="#ffffff" fill-opacity="0.8"/>
      <rect x="90" y="0" width="2" height="45" fill="#ffffff" fill-opacity="0.8"/>
      <rect x="94" y="0" width="4" height="45" fill="#ffffff" fill-opacity="0.8"/>
      <rect x="100" y="0" width="1" height="45" fill="#ffffff" fill-opacity="0.8"/>
      <rect x="103" y="0" width="5" height="45" fill="#ffffff" fill-opacity="0.8"/>
      <rect x="110" y="0" width="2" height="45" fill="#ffffff" fill-opacity="0.8"/>
      <rect x="114" y="0" width="4" height="45" fill="#ffffff" fill-opacity="0.8"/>
      <rect x="120" y="0" width="2" height="45" fill="#ffffff" fill-opacity="0.8"/>
      <rect x="124" y="0" width="5" height="45" fill="#ffffff" fill-opacity="0.8"/>
      <rect x="131" y="0" width="4" height="45" fill="#ffffff" fill-opacity="0.8"/>
    </g>

    <text x="507" y="195" font-family="system-ui, sans-serif" font-size="9" font-weight="700" fill="#9ca3af" text-anchor="middle">SCAN AT ENTRY</text>

    <!-- Bottom Footer -->
    <text x="30" y="222" font-family="system-ui, sans-serif" font-size="10" font-weight="600" fill="#6b7280">Delhi NCR Discord Community • gameverse.delhincr.fun</text>
  </svg>
  `;
  return svg;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "\'": return "&apos;";
      case '"': return "&quot;";
      default: return c;
    }
  });
}

/**
 * Sends Discord notifications for a new registration:
 * 1. Embed notification to Admin Channel (1533252061452308682)
 * 2. Ticket DM to the user with full pass card
 */
export async function sendRegistrationDiscordNotifications(payload: RegistrationNotificationPayload): Promise<void> {
  const botToken = process.env.DISCORD_BOT_TOKEN;

  if (!botToken) {
    logger.warn("DISCORD_BOT_TOKEN not set in environment, skipping Discord registration notifications");
    return;
  }

  logger.info({ passNumber: payload.passNumber, discordUserId: payload.discordUserId }, "Initiating Discord registration notifications");

  const timestamp = new Date().toISOString();

  // ── 1. Send Admin Embed Notification ──────────────────────────────────────────
  try {
    const adminEmbed = {
      title: "🎮 NEW FESTIVAL REGISTRATION",
      description: `**${payload.name}** has registered for **${payload.festivalName}**!`,
      color: 0x5865F2, // Discord Blurple
      fields: [
        { name: "👤 Participant Name", value: payload.name, inline: true },
        { name: "🏷️ Discord Tag", value: `@${payload.discordUsername}`, inline: true },
        { name: "🎫 Pass Number", value: `\`${payload.passNumber}\``, inline: true },
        { name: "📧 Email", value: payload.email, inline: true },
        { name: "🎯 Primary Interest", value: payload.interest, inline: true },
        { name: "🆔 Discord User ID", value: `\`${payload.discordUserId}\``, inline: true },
      ],
      footer: { text: "Delhi NCR GameVerse 2026 • Registration System" },
      timestamp,
    };

    await fetch(`https://discord.com/api/v10/channels/${ADMIN_REGISTRATION_CHANNEL_ID}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bot ${botToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        embeds: [adminEmbed],
      }),
    });
    logger.info({ passNumber: payload.passNumber }, "Sent admin notification embed to registration channel");
  } catch (err) {
    logger.error({ err }, "Failed to send admin registration embed");
  }

  // ── 2. Send User DM Ticket Notification ─────────────────────────────────────────
  try {
    // A. Open DM Channel with user
    const dmChannelRes = await fetch("https://discord.com/api/v10/users/@me/channels", {
      method: "POST",
      headers: {
        Authorization: `Bot ${botToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipient_id: payload.discordUserId,
      }),
    });

    if (!dmChannelRes.ok) {
      const errText = await dmChannelRes.text();
      logger.warn({ errText, userId: payload.discordUserId }, "Could not open DM channel with user");
      return;
    }

    const dmChannel = (await dmChannelRes.json()) as { id: string };

    // B. Create DM Pass Embed
    const userTicketEmbed = {
      title: "🎫 DELHI NCR GAMEVERSE 2026 — OFFICIAL FESTIVAL PASS",
      description: `Congratulations **${payload.name}**! You are officially registered for **${payload.festivalName}**.\n\nKeep this ticket code safe for event check-in and exclusive tournament access!`,
      color: 0xF59E0B, // Amber Gold
      fields: [
        { name: "🎫 Official Pass Code", value: `\`${payload.passNumber}\``, inline: true },
        { name: "🟢 Status", value: "CONFIRMED", inline: true },
        { name: "🎯 Registered Interest", value: payload.interest, inline: true },
        { name: "👤 Pass Holder", value: payload.name, inline: false },
        { name: "🌐 Dashboard Portal", value: "[Manage Pass & Event Schedule](https://dashboard.delhincr.fun)", inline: false },
      ],
      footer: { text: "Delhi NCR Discord Community • Official Pass Ticket" },
      timestamp,
    };

    await fetch(`https://discord.com/api/v10/channels/${dmChannel.id}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bot ${botToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: `Hey <@${payload.discordUserId}>! 🎉 Your **Delhi NCR GameVerse 2026** Registration is complete!`,
        embeds: [userTicketEmbed],
      }),
    });
    logger.info({ userId: payload.discordUserId }, "Successfully sent DM ticket to user");
  } catch (err) {
    logger.error({ err }, "Failed to send DM ticket to user");
  }
}
