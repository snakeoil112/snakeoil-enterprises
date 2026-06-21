#!/usr/bin/env node
/**
 * Integrate an approved SNAAA-43 founder video into the marketing homepage.
 * Run only after board approval — copies demo assets, exports social cutdowns,
 * and patches site markup/content for deploy.
 */
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const demoDir = join(root, "apps/web/public/founder-video-demo");
const publicDir = join(root, "apps/web/public");
const socialDir = join(publicDir, "social");
const indexPath = join(root, "apps/web/index.html");
const siteContentPath = join(root, "apps/web/src/site-content.js");

const variant = process.argv.includes("--grok") ? "grok" : "likeness";
const assets = {
  likeness: {
    video: "likeness-demo-v3.mp4",
    poster: "source-frame.jpg",
    label: "likeness",
  },
  grok: {
    video: "grok-portrait-talking-v3.mp4",
    poster: "founder-likeness-portrait-v3.jpg",
    label: "grok-portrait",
  },
}[variant];

const sourceVideo = join(demoDir, assets.video);
const sourcePoster = join(demoDir, assets.poster);
const destVideo = join(publicDir, "founder-reel.mp4");
const destPoster = join(publicDir, "founder-reel-poster.jpg");
const ffmpeg = ffmpegPath;

function run(cmd, args, label) {
  console.log(`[integrate] ${label}`);
  execFileSync(cmd, args, { stdio: "inherit" });
}

function requireFile(path, label) {
  if (!existsSync(path)) {
    throw new Error(`Missing ${label} at ${path}. Build demos first.`);
  }
}

requireFile(sourceVideo, `${variant} demo video`);
requireFile(sourcePoster, `${variant} poster`);

mkdirSync(socialDir, { recursive: true });
copyFileSync(sourceVideo, destVideo);
copyFileSync(sourcePoster, destPoster);

run(
  ffmpeg,
  [
    "-y",
    "-i",
    destVideo,
    "-vf",
    "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080",
    "-c:v",
    "libx264",
    "-preset",
    "medium",
    "-crf",
    "20",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    join(socialDir, "founder-reel-linkedin-16x9.mp4"),
  ],
  "export LinkedIn 16:9 cutdown",
);

run(
  ffmpeg,
  [
    "-y",
    "-i",
    destVideo,
    "-vf",
    "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920",
    "-c:v",
    "libx264",
    "-preset",
    "medium",
    "-crf",
    "20",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    join(socialDir, "founder-reel-reels-9x16.mp4"),
  ],
  "export Reels/TikTok 9:16 cutdown",
);

const portraitBlock = `        <img
          class="founder-card__portrait"
          src="/founder-portrait.svg"
          alt='Stylized portrait of Benny "The Snake" Sorensen, founder of Snakeoil Enterprises'
          width="320"
          height="384"
        />`;

const videoBlock = `        <div class="founder-card__media">
          <video
            class="founder-card__video"
            src="/founder-reel.mp4"
            poster="/founder-reel-poster.jpg"
            controls
            playsinline
            muted
            loop
            preload="metadata"
            width="320"
            height="384"
            aria-label='Founder introduction video featuring Benny "The Snake" Sorensen'
          ></video>
        </div>`;

let indexHtml = readFileSync(indexPath, "utf8");
if (!indexHtml.includes(portraitBlock)) {
  if (indexHtml.includes("founder-card__video")) {
    console.log("[integrate] homepage already uses founder video markup");
  } else {
    throw new Error("Could not locate founder portrait block in index.html");
  }
} else {
  indexHtml = indexHtml.replace(portraitBlock, videoBlock);
  writeFileSync(indexPath, indexHtml);
  console.log("[integrate] patched apps/web/index.html");
}

let siteContent = readFileSync(siteContentPath, "utf8");
siteContent = siteContent.replace(
  /export const FOUNDER_VIDEO = \{[\s\S]*?\};/,
  `export const FOUNDER_VIDEO = {
  enabled: true,
  src: "/founder-reel.mp4",
  posterSrc: "/founder-reel-poster.jpg",
  variant: "${assets.label}",
  social: {
    linkedin16x9: "/social/founder-reel-linkedin-16x9.mp4",
    reels9x16: "/social/founder-reel-reels-9x16.mp4",
  },
};`,
);
writeFileSync(siteContentPath, siteContent);
console.log("[integrate] enabled founder video in site-content.js");
console.log(`[integrate] ready to deploy (${variant} variant)`);