#!/usr/bin/env node
/**
 * Build SNAAA-43 founder video demo v3:
 * - Preserves original likeness from source selfie video
 * - Cleans and enhances the founder's actual voice sample
 * - Produces a professional studio-style reel with branded overlay
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync } from "node:zlib";
import ffmpegPath from "ffmpeg-static";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const demoDir = join(root, "apps/web/public/founder-video-demo");
const workDir = join(demoDir, "work");

mkdirSync(workDir, { recursive: true });

const sourceMov = join(workDir, "source.mov");
const ffmpeg = ffmpegPath;

function run(cmd, args, label) {
  console.log(`[build] ${label}`);
  execFileSync(cmd, args, { stdio: "inherit" });
}

if (!existsSync(sourceMov)) {
  throw new Error(`Missing source video at ${sourceMov}`);
}

const voiceRaw = join(workDir, "voice-raw.wav");
const voiceClean = join(workDir, "voice-clean.wav");
const videoClean = join(workDir, "video-clean.mp4");
const overlayPng = join(workDir, "brand-overlay.png");
const output = join(demoDir, "likeness-demo-v3.mp4");
const voicePreview = join(demoDir, "voice-sample-clean.mp3");

// Extract founder voice sample (mono 48k)
run(
  ffmpeg,
  [
    "-y",
    "-i",
    sourceMov,
    "-map",
    "0:a:0",
    "-ac",
    "1",
    "-ar",
    "48000",
    voiceRaw,
  ],
  "extract voice",
);

// Denoise + normalize + light compression for confident delivery
run(
  ffmpeg,
  [
    "-y",
    "-i",
    voiceRaw,
    "-af",
    "highpass=f=90,lowpass=f=9000,afftdn=nf=-25,acompressor=threshold=-18dB:ratio=3:attack=5:release=80,loudnorm=I=-16:TP=-1.5:LRA=11",
    voiceClean,
  ],
  "clean voice",
);

run(
  ffmpeg,
  ["-y", "-i", voiceClean, "-codec:a", "libmp3lame", "-q:a", "2", voicePreview],
  "export voice preview mp3",
);

// Professional video pass: crop face, blur background, grade, sharpen
run(
  ffmpeg,
  [
    "-y",
    "-i",
    sourceMov,
    "-vf",
    [
      "scale=1080:1920:force_original_aspect_ratio=increase",
      "crop=1080:1920",
      "split[fg][bg]",
      "[bg]scale=1080:1920,gblur=sigma=28[blurred]",
      "[fg]scale=720:-1,crop=720:960:(iw-720)/2:(ih-960)/2+40,format=rgba,colorchannelmixer=aa=1[face]",
      "[blurred][face]overlay=(W-w)/2:(H-h)/2-40:format=auto",
      "eq=contrast=1.08:brightness=0.03:saturation=1.05",
      "unsharp=5:5:0.8:5:5:0.0",
    ].join(","),
    "-an",
    "-c:v",
    "libx264",
    "-preset",
    "medium",
    "-crf",
    "20",
    "-pix_fmt",
    "yuv420p",
    "-t",
    "13.2",
    videoClean,
  ],
  "enhance video",
);

// Branded lower-third overlay (1080x1920 PNG via sharp-free raw RGBA)
const w = 1080;
const h = 1920;
const png = Buffer.alloc(w * h * 4, 0);
const barTop = Math.floor(h * 0.78);
const barH = Math.floor(h * 0.14);
for (let y = barTop; y < barTop + barH; y++) {
  for (let x = 0; x < w; x++) {
    const i = (y * w + x) * 4;
    png[i] = 11;
    png[i + 1] = 18;
    png[i + 2] = 32;
    png[i + 3] = 210;
  }
}
// watermark stripe
for (let y = 48; y < 120; y++) {
  for (let x = 48; x < 520; x++) {
    const i = (y * w + x) * 4;
    png[i] = 251;
    png[i + 1] = 191;
    png[i + 2] = 36;
    png[i + 3] = 180;
  }
}
writeFileSync(overlayPng, encodePng(w, h, png));

run(
  ffmpeg,
  [
    "-y",
    "-i",
    videoClean,
    "-i",
    voiceClean,
    "-i",
    overlayPng,
    "-filter_complex",
    ["[0:v][2:v]overlay=0:0:format=auto[v]"].join(""),
    "-map",
    "[v]",
    "-map",
    "1:a",
    "-c:v",
    "libx264",
    "-preset",
    "medium",
    "-crf",
    "18",
    "-pix_fmt",
    "yuv420p",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    "-shortest",
    output,
  ],
  "mux final v3 demo",
);

console.log(`[build] wrote ${output}`);

function encodePng(width, height, rgba) {
  const stride = width * 4 + 1;
  const raw = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y++) {
    raw[y * stride] = 0;
    rgba.copy(raw, y * stride + 1, y * width * 4, (y + 1) * width * 4);
  }
  const compressed = deflateSync(raw);
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = createChunk("IHDR", ihdrData(width, height));
  const idat = createChunk("IDAT", compressed);
  const iend = createChunk("IEND", Buffer.alloc(0));
  return Buffer.concat([signature, ihdr, idat, iend]);
}

function ihdrData(width, height) {
  const buf = Buffer.alloc(13);
  buf.writeUInt32BE(width, 0);
  buf.writeUInt32BE(height, 4);
  buf[8] = 8;
  buf[9] = 6;
  buf[10] = 0;
  buf[11] = 0;
  buf[12] = 0;
  return buf;
}

function createChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crcBuf = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(crcBuf), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return (c ^ 0xffffffff) >>> 0;
}
