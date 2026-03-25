"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface GameLayoutProps {
  title: string;
  subtitle: string;
  emoji: string;
  children: ReactNode;
  showBack?: boolean;
}

export function GameLayout({ title, subtitle, emoji, children, showBack = true }: GameLayoutProps) {
  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/70 backdrop-blur-lg border-b border-cream-dark/50">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          {showBack ? (
            <Link href="/" className="text-rose-gold font-medium text-sm flex items-center gap-1">
              ← Back
            </Link>
          ) : (
            <div />
          )}
          <div className="text-center">
            <span className="text-lg">{emoji}</span>
          </div>
          <div className="w-14" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Game Title */}
      <div className="max-w-lg mx-auto px-4 pt-6 pb-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-charcoal"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-charcoal-light mt-1"
        >
          {subtitle}
        </motion.p>
      </div>

      {/* Game Content */}
      <div className="max-w-lg mx-auto px-4 pb-24">
        {children}
      </div>
    </div>
  );
}
