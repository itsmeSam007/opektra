"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={false} whileInView={reduced ? {} : { y: [12, 0] }} viewport={{ once: true, amount: .12 }} transition={{ duration: reduced ? 0 : .55, delay }}>{children}</motion.div>;
}
