"use client";

import { useCallback, useRef } from "react";
import { SAMPLE_POSTS } from "@/lib/data/citroen";
import { PLATFORMS } from "@/lib/data/platforms";
import {
  isImageFile,
  isVideoFile,
} from "@/lib/media/extract-video-frames";
import type { CreativeFormData, Platform } from "@/lib/types";
import ClickSpark from "@/components/react-bits/ClickSpark";
import StarBorder from "@/components/react-bits/StarBorder";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Film, ImagePlus, Loader2, RotateCcw, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const MAX_VIDEO_BYTES = 80 * 1024 * 1024; // 80MB — frames are sampled locally

interface CreativeInputFormProps {
  formData: CreativeFormData;
  onChange: (data: CreativeFormData) => void;
  onSubmit: () => void;
  onReset: () => void;
  isRunning: boolean;
  errors: { platform?: string; caption?: string };
}

export function CreativeInputForm({
  formData,
  onChange,
  onSubmit,
  onReset,
  isRunning,
  errors,
}: CreativeInputFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reducedMotion = useReducedMotion();

  const clearMedia = useCallback(() => {
    if (formData.mediaPreviewUrl) {
      URL.revokeObjectURL(formData.mediaPreviewUrl);
    }
    onChange({
      ...formData,
      mediaFile: null,
      mediaPreviewUrl: null,
      mediaKind: null,
    });
  }, [formData, onChange]);

  const handleMediaChange = useCallback(
    (file: File | null) => {
      if (formData.mediaPreviewUrl) {
        URL.revokeObjectURL(formData.mediaPreviewUrl);
      }

      if (!file) {
        onChange({
          ...formData,
          mediaFile: null,
          mediaPreviewUrl: null,
          mediaKind: null,
        });
        return;
      }

      const video = isVideoFile(file);
      const image = isImageFile(file);

      if (!video && !image) {
        toast.error("Use an image (JPG/PNG) or a reel video (MP4/WebM/MOV).");
        return;
      }

      if (video && file.size > MAX_VIDEO_BYTES) {
        toast.error("Keep reels under 80MB for the demo.");
        return;
      }

      onChange({
        ...formData,
        mediaFile: file,
        mediaPreviewUrl: URL.createObjectURL(file),
        mediaKind: video ? "video" : "image",
      });
    },
    [formData, onChange],
  );

  const loadSample = (sampleId: "good") => {
    const sample = SAMPLE_POSTS.find((s) => s.id === sampleId);
    if (!sample) return;

    if (formData.mediaPreviewUrl) {
      URL.revokeObjectURL(formData.mediaPreviewUrl);
    }

    onChange({
      ...formData,
      caption: sample.caption,
      mediaFile: null,
      mediaPreviewUrl: null,
      mediaKind: null,
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleMediaChange(file);
  };

  return (
    <div className="rounded-lg border border-border bg-card/80 shadow-sm backdrop-blur-sm">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold">Creative input</h2>
        <p className="text-xs text-muted-foreground">
          Platform, copy, and optional image or reel
        </p>
      </div>

      <div className="space-y-5 p-4">
        <div>
          <Label className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Quick fill
          </Label>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_POSTS.map((sample) => (
              <Button
                key={sample.id}
                type="button"
                variant="outline"
                size="sm"
                disabled={isRunning}
                onClick={() => loadSample(sample.id)}
              >
                {sample.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="platform">Platform</Label>
          <div className="flex flex-wrap gap-1.5">
            {PLATFORMS.map((platform) => (
              <button
                key={platform.id}
                type="button"
                disabled={isRunning}
                onClick={() =>
                  onChange({ ...formData, platform: platform.id as Platform })
                }
                className={cn(
                  "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                  formData.platform === platform.id
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground",
                  isRunning && "pointer-events-none opacity-50",
                )}
              >
                {platform.label}
              </button>
            ))}
          </div>
          {errors.platform && (
            <p className="text-sm text-destructive">{errors.platform}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="caption">Caption</Label>
          <Textarea
            id="caption"
            placeholder="Paste your post copy..."
            rows={6}
            value={formData.caption}
            onChange={(e) => onChange({ ...formData, caption: e.target.value })}
            disabled={isRunning}
            aria-invalid={!!errors.caption}
            className="resize-none text-sm"
          />
          {errors.caption && (
            <p className="text-sm text-destructive">{errors.caption}</p>
          )}
          <p className="text-xs text-muted-foreground">
            {formData.caption.length} characters
          </p>
        </div>

        <div className="space-y-2">
          <Label>Visual asset</Label>
          <p className="mb-2 text-xs text-muted-foreground">
            Optional still or reel. For video, the demo samples a few frames and
            reviews those with the caption.
          </p>
          <div
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                fileInputRef.current?.click();
              }
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-border bg-muted/20 p-4 transition-colors hover:border-primary/30 hover:bg-muted/40",
              isRunning && "pointer-events-none opacity-50",
            )}
          >
            {formData.mediaPreviewUrl ? (
              <div className="relative w-full">
                {formData.mediaKind === "video" ? (
                  <video
                    src={formData.mediaPreviewUrl}
                    className="mx-auto max-h-44 rounded object-contain"
                    controls
                    muted
                    playsInline
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={formData.mediaPreviewUrl}
                    alt="Upload preview"
                    className="mx-auto max-h-36 rounded object-contain"
                  />
                )}
                <Button
                  type="button"
                  variant="secondary"
                  size="icon-sm"
                  className="absolute top-0 right-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearMedia();
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                >
                  <X className="size-4" />
                </Button>
                {formData.mediaKind === "video" && (
                  <p className="mt-2 text-center text-xs text-muted-foreground">
                    Reel ready — frames will be sampled on submit
                  </p>
                )}
              </div>
            ) : (
              <>
                <div className="mb-1.5 flex items-center gap-2 text-muted-foreground">
                  <ImagePlus className="size-6" />
                  <Film className="size-6" />
                </div>
                <p className="text-xs font-medium">
                  Drop image or reel, or click to upload
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  JPG, PNG, WebP · MP4, WebM, MOV
                </p>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
            className="hidden"
            onChange={(e) => handleMediaChange(e.target.files?.[0] ?? null)}
          />
        </div>

        <div className="flex flex-wrap gap-2 border-t border-border pt-4">
          {reducedMotion ? (
            <Button onClick={onSubmit} disabled={isRunning} className="flex-1">
              {isRunning ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Reviewing...
                </>
              ) : (
                <>
                  <Send className="size-4" />
                  Submit for review
                </>
              )}
            </Button>
          ) : (
            <div className="hidden flex-1 md:block">
              <ClickSpark sparkColor="#EB4D4B">
                <StarBorder
                  as="button"
                  type="button"
                  color="#EB4D4B"
                  speed="5s"
                  className="w-full rounded-lg"
                  onClick={onSubmit}
                  disabled={isRunning}
                >
                  <span className="flex items-center justify-center gap-1.5 px-2 py-1 text-sm font-medium">
                    {isRunning ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Reviewing...
                      </>
                    ) : (
                      <>
                        <Send className="size-4" />
                        Submit for review
                      </>
                    )}
                  </span>
                </StarBorder>
              </ClickSpark>
            </div>
          )}
          {!reducedMotion && (
            <Button
              onClick={onSubmit}
              disabled={isRunning}
              className="flex-1 md:hidden"
            >
              {isRunning ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Reviewing...
                </>
              ) : (
                <>
                  <Send className="size-4" />
                  Submit for review
                </>
              )}
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={onReset}
            disabled={isRunning}
            className="w-full sm:w-auto"
          >
            <RotateCcw className="size-4" />
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}
