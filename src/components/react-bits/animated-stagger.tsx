"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface AnimatedStaggerItemProps {
  children: React.ReactNode;
  index: number;
  className?: string;
}

function AnimatedStaggerItem({ children, index, className }: AnimatedStaggerItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.2, once: true });
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedStaggerProps {
  children: React.ReactNode[];
  className?: string;
  itemClassName?: string;
}

export function AnimatedStagger({
  children,
  className,
  itemClassName,
}: AnimatedStaggerProps) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <AnimatedStaggerItem key={index} index={index} className={itemClassName}>
          {child}
        </AnimatedStaggerItem>
      ))}
    </div>
  );
}
