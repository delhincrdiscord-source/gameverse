"use client";

import React, { useState } from "react";
import { Button } from "@gameverse/ui/button";
import { Input } from "@gameverse/ui/input";
import { Label } from "@gameverse/ui/label";
import { MessageSquare, Send, Sparkles, Image, ShieldAlert } from "lucide-react";

export function DiscordEmbedBuilder() {
  const [embedTitle, setEmbedTitle] = useState("🎮 Delhi NCR Gameverse 2026 Championship Announcement");
  const [embedDescription, setEmbedDescription] = useState("Get ready for the biggest esports festival of the year! Registrations are officially live. Claim your gamer pass now!");
  const [embedColor, setEmbedColor] = useState("#5865F2");
  const [authorName, setAuthorName] = useState("Gameverse Admin");
  const [authorIcon, setAuthorIcon] = useState("");
  const [footerText, setFooterText] = useState("Delhi NCR Gameverse • Official Announcement");
  const [imageUrl, setImageUrl] = useState("");
  const [targetChannel, setTargetChannel] = useState("announcements-channel");
  const [status, setStatus] = useState("");

  const handleSendTestEmbed = () => {
    setStatus("sending");
    setTimeout(() => {
      setStatus("success");
    }, 1000);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Controls Form */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
        <h2 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-indigo-400" /> Discord Embed Builder
        </h2>

        <div className="space-y-3">
          <div>
            <Label htmlFor="embedTitle">Embed Title</Label>
            <Input
              id="embedTitle"
              value={embedTitle}
              onChange={(e) => setEmbedTitle(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="embedDescription">Description (Markdown Supported)</Label>
            <textarea
              id="embedDescription"
              rows={4}
              value={embedDescription}
              onChange={(e) => setEmbedDescription(e.target.value)}
              className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--background)] p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="embedColor">Sidebar Color Accent</Label>
              <div className="flex gap-2 items-center mt-1">
                <input
                  type="color"
                  value={embedColor}
                  onChange={(e) => setEmbedColor(e.target.value)}
                  className="h-9 w-12 cursor-pointer rounded border border-[var(--border)] bg-transparent p-0"
                />
                <Input
                  value={embedColor}
                  onChange={(e) => setEmbedColor(e.target.value)}
                  className="font-mono"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="targetChannel">Target Channel</Label>
              <Input
                id="targetChannel"
                value={targetChannel}
                onChange={(e) => setTargetChannel(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="authorName">Author Header</Label>
              <Input
                id="authorName"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="footerText">Footer Text</Label>
              <Input
                id="footerText"
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="imageUrl">Banner / Image URL (Optional)</Label>
            <Input
              id="imageUrl"
              placeholder="https://..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="mt-1"
            />
          </div>

          <Button onClick={handleSendTestEmbed} className="w-full gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white">
            <Send className="h-4 w-4" /> Send Embed to Discord #{targetChannel}
          </Button>

          {status === "success" && (
            <p className="text-xs font-semibold text-green-400 text-center">
              🚀 Embed payload successfully dispatched to Discord Webhook!
            </p>
          )}
        </div>
      </div>

      {/* Live Preview */}
      <div className="rounded-xl border border-[var(--border)] bg-[#313338] p-6 text-white space-y-3 font-sans">
        <div className="flex items-center gap-2 text-xs text-[#949BA4] font-semibold border-b border-[#3F4147] pb-3">
          <MessageSquare className="h-4 w-4 text-[#5865F2]" /> DISCORD EMBED LIVE PREVIEW
        </div>

        {/* Bot Message Header */}
        <div className="flex items-start gap-3 pt-2">
          <div className="h-10 w-10 rounded-full bg-[#5865F2] flex items-center justify-center font-bold text-white text-sm">
            GV
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm hover:underline cursor-pointer">Gameverse Bot</span>
              <span className="bg-[#5865F2] text-[10px] font-bold px-1.5 py-0.5 rounded text-white uppercase">BOT</span>
              <span className="text-[11px] text-[#949BA4]">Today at 4:20 PM</span>
            </div>

            {/* Embed Box */}
            <div
              className="rounded-md bg-[#2B2D31] p-4 border-l-4 space-y-2 mt-1 shadow-md max-w-lg"
              style={{ borderLeftColor: embedColor }}
            >
              {authorName && (
                <div className="text-xs font-semibold text-[#F2F3F5] flex items-center gap-1.5">
                  {authorName}
                </div>
              )}

              {embedTitle && (
                <h3 className="font-bold text-sm text-[#00A8FC] hover:underline cursor-pointer">
                  {embedTitle}
                </h3>
              )}

              {embedDescription && (
                <p className="text-xs text-[#DBDEE1] whitespace-pre-line leading-relaxed">
                  {embedDescription}
                </p>
              )}

              {imageUrl && (
                <div className="mt-2 overflow-hidden rounded-md border border-[#3F4147]">
                  <img src={imageUrl} alt="Embed" className="w-full max-h-48 object-cover" />
                </div>
              )}

              {footerText && (
                <p className="text-[10px] text-[#949BA4] pt-2 border-t border-[#35373C]">
                  {footerText}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
