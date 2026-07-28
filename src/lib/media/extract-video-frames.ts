/**
 * Sample still frames from a reel/video in the browser.
 * Claude's API accepts images, not video — frames let the demo review Reels/TikToks.
 */

export type ExtractedFrame = {
  base64: string;
  mediaType: "image/jpeg";
  timeSeconds: number;
};

function loadVideo(file: File): Promise<HTMLVideoElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    video.src = url;

    const cleanup = () => URL.revokeObjectURL(url);

    video.onloadedmetadata = () => {
      // Keep object URL until we finish seeking — revoke after extract
      resolve(video);
    };
    video.onerror = () => {
      cleanup();
      reject(new Error("Could not read that video. Try MP4 or WebM."));
    };
  });
}

function seekTo(video: HTMLVideoElement, time: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const onSeeked = () => {
      video.removeEventListener("seeked", onSeeked);
      resolve();
    };
    video.addEventListener("seeked", onSeeked);
    video.onerror = () => reject(new Error("Failed while sampling the video."));
    // Clamp slightly inside duration to avoid end-of-stream black frames
    const safe = Math.min(Math.max(time, 0.05), Math.max(video.duration - 0.05, 0));
    video.currentTime = safe;
  });
}

function frameToJpeg(
  video: HTMLVideoElement,
  maxWidth: number,
  quality: number,
): string {
  const scale = Math.min(1, maxWidth / Math.max(video.videoWidth, 1));
  const width = Math.max(1, Math.round(video.videoWidth * scale));
  const height = Math.max(1, Math.round(video.videoHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not prepare video frames.");
  ctx.drawImage(video, 0, 0, width, height);
  const dataUrl = canvas.toDataURL("image/jpeg", quality);
  const base64 = dataUrl.replace(/^data:image\/jpeg;base64,/, "");
  return base64;
}

/**
 * Pull evenly spaced stills from a video for Claude vision.
 * Default: 5 frames, max 960px wide — enough for a demo reel check.
 */
export async function extractVideoFrames(
  file: File,
  options?: { count?: number; maxWidth?: number; quality?: number },
): Promise<ExtractedFrame[]> {
  const count = options?.count ?? 5;
  const maxWidth = options?.maxWidth ?? 960;
  const quality = options?.quality ?? 0.72;

  const video = await loadVideo(file);
  const objectUrl = video.src;

  try {
    if (!Number.isFinite(video.duration) || video.duration <= 0) {
      throw new Error("This video has no readable duration.");
    }

    const times: number[] = [];
    if (count === 1) {
      times.push(video.duration / 2);
    } else {
      for (let i = 0; i < count; i++) {
        // Spread across the reel, avoiding exact 0 / end
        times.push((video.duration * (i + 0.5)) / count);
      }
    }

    const frames: ExtractedFrame[] = [];
    for (const time of times) {
      await seekTo(video, time);
      frames.push({
        base64: frameToJpeg(video, maxWidth, quality),
        mediaType: "image/jpeg",
        timeSeconds: Math.round(time * 10) / 10,
      });
    }
    return frames;
  } finally {
    video.removeAttribute("src");
    video.load();
    URL.revokeObjectURL(objectUrl);
  }
}

export function isVideoFile(file: File): boolean {
  if (file.type.startsWith("video/")) return true;
  // Some browsers leave .mov with empty type
  return /\.(mp4|webm|mov|m4v)$/i.test(file.name);
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}
