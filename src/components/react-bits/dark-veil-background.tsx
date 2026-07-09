"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const DarkVeil = dynamic(() => import("@/components/react-bits/DarkVeil"), {
  ssr: false,
});

export function DarkVeilBackground() {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-br from-background via-background to-primary/10"
      />
    );
  }

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 opacity-40">
      <DarkVeil hueShift={15} speed={0.35} noiseIntensity={0.02} scanlineIntensity={0.04} />
    </div>
  );
}
