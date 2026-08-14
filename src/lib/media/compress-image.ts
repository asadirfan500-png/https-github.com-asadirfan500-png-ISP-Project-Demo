/**
 * Shrink still images before POST /api/evaluate.
 * Phone/Mac photos often exceed Vercel's ~4.5MB body limit when sent as raw base64,
 * which surfaces in Chrome as: Unexpected token 'R' ("Request Entity Too Large").
 */

export type CompressedImage = {
  base64: string;
  mediaType: "image/jpeg";
};

function loadImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(
        new Error(
          "Could not read that image. On Mac, export as JPG/PNG (HEIC can fail in some browsers).",
        ),
      );
    };
    img.src = url;
  });
}

/**
 * Resize to maxWidth and encode as JPEG so payloads stay under Vercel limits.
 */
export async function compressImageForReview(
  file: File,
  options?: { maxWidth?: number; quality?: number },
): Promise<CompressedImage> {
  const maxWidth = options?.maxWidth ?? 1280;
  const quality = options?.quality ?? 0.78;

  const img = await loadImageElement(file);
  const scale = Math.min(1, maxWidth / Math.max(img.naturalWidth, 1));
  const width = Math.max(1, Math.round(img.naturalWidth * scale));
  const height = Math.max(1, Math.round(img.naturalHeight * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not prepare the image for review.");
  }
  ctx.drawImage(img, 0, 0, width, height);

  const dataUrl = canvas.toDataURL("image/jpeg", quality);
  const base64 = dataUrl.replace(/^data:image\/jpeg;base64,/, "");
  if (!base64) {
    throw new Error("Image compression failed. Try a smaller JPG or PNG.");
  }

  return { base64, mediaType: "image/jpeg" };
}

export function isHeicLike(file: File): boolean {
  const type = file.type.toLowerCase();
  if (type === "image/heic" || type === "image/heif") return true;
  return /\.(heic|heif)$/i.test(file.name);
}
