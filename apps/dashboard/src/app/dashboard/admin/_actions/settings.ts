"use server";

import { prisma } from "@gameverse/database";
import { revalidatePath } from "next/cache";

export async function getSystemSettings(category = "GENERAL") {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: category },
    });
    return { success: true, data: setting ? setting.valueJson : null };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch settings" };
  }
}

export async function saveSystemSettings(category: string, valueJson: any) {
  try {
    const updated = await prisma.setting.upsert({
      where: { key: category },
      create: { key: category, valueJson },
      update: { valueJson },
    });

    revalidatePath("/dashboard/admin/settings");
    return { success: true, data: updated };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to save settings" };
  }
}

export async function generateApiKey(keyName: string) {
  try {
    const apiKey = `gv_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    // Save to settings array
    const existing = await prisma.setting.findUnique({ where: { key: "API_KEYS" } });
    const keysList = (existing?.valueJson as any[]) || [];
    keysList.push({ name: keyName, key: apiKey, createdAt: new Date().toISOString() });

    await prisma.setting.upsert({
      where: { key: "API_KEYS" },
      create: { key: "API_KEYS", valueJson: keysList },
      update: { valueJson: keysList },
    });

    revalidatePath("/dashboard/admin/settings");
    return { success: true, apiKey };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to generate API key" };
  }
}
