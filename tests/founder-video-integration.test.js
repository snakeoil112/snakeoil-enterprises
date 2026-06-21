import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { FOUNDER_VIDEO } from "../apps/web/src/site-content.js";

describe("founder video integration readiness", () => {
  it("keeps founder video disabled until board approval", () => {
    expect(FOUNDER_VIDEO.enabled).toBe(false);
    expect(FOUNDER_VIDEO.variant).toBe("likeness");
    expect(FOUNDER_VIDEO.src).toBe("/founder-reel.mp4");
    expect(FOUNDER_VIDEO.social.linkedin16x9).toContain("linkedin");
    expect(FOUNDER_VIDEO.social.reels9x16).toContain("reels");
  });

  it("resolves ffmpeg-static for integration scripts", async () => {
    const mod = await import("ffmpeg-static");
    expect(mod.default).toBeTruthy();
  });

  it("ships the post-approval integration script", () => {
    const script = readFileSync("scripts/integrate-founder-video.mjs", "utf8");
    expect(script).toContain("founder-reel.mp4");
    expect(script).toContain("founder-card__video");
    expect(script).toContain("linkedin-16x9");
  });

  it("ships the v3 demo build script and preview page", () => {
    expect(existsSync("scripts/build-founder-demo-v3.mjs")).toBe(true);
    const preview = readFileSync(
      "apps/web/public/founder-video-demo/preview-v3.html",
      "utf8",
    );
    expect(preview).toContain("likeness-demo-v3.mp4");
    expect(preview).toContain("DEMO v3");
  });

  it("styles founder video media for homepage placement", () => {
    const css = readFileSync("apps/web/src/style.css", "utf8");
    expect(css).toContain(".founder-card__video");
    expect(css).toContain(".founder-card__media");
  });
});
