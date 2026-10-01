"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({ children, className, delay = 0 }: { children?: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 32 }} whileInView={reduced ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.16 }} transition={{ duration: 0.8, delay, ease }}>{children}</motion.div>;
}

export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={{ hidden: {}, visible: { transition: reduced ? undefined : { staggerChildren: 0.1 } } }}>{children}</motion.div>;
}

export function StaggerItem({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  return <motion.div variants={{ hidden: reduced ? { opacity: 1 } : { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.72, ease } } }}>{children}</motion.div>;
}
