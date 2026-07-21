"use client";

import { useReducedMotion } from "@/hooks/use-reduced-motion";

/** PS5 atmosphere — navy → burgundy */
export function Ps5AtmosphereBackground() {
  const reducedMotion = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(125deg,#05020D_0%,#1a0a18_42%,#3d1520_78%,#5D1F23_100%)]" />
      <div className="absolute -top-32 -left-20 h-[70vh] w-[70vw] rotate-[-12deg] bg-[radial-gradient(ellipse_at_center,rgba(120,80,140,0.35)_0%,transparent_70%)] blur-2xl" />
      <div className="absolute -right-24 bottom-[-10%] h-[55vh] w-[55vw] bg-[radial-gradient(ellipse_at_center,rgba(93,31,35,0.55)_0%,transparent_68%)] blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(5,2,13,0.65)_100%)]" />

      {!reducedMotion &&
        Array.from({ length: 22 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-[#c4a07a]/80 blur-[1px]"
            style={{
              width: `${3 + (i % 5) * 2.5}px`,
              height: `${3 + (i % 5) * 2.5}px`,
              left: `${6 + ((i * 19) % 88)}%`,
              top: `${40 + ((i * 13) % 48)}%`,
              opacity: 0.15 + (i % 4) * 0.08,
              animation: `ps5-drift ${7 + (i % 6)}s ease-in-out ${i * 0.28}s infinite alternate`,
            }}
          />
        ))}
    </div>
  );
}
