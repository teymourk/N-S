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

export function GameLayout({
  title,
  subtitle,
  emoji,
  children,
  showBack = true,
}: GameLayoutProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0a0a1a" }}>
      {/* Frosted glass header */}
      <div
        className="sticky top-0 z-50 backdrop-blur-xl border-b"
        style={{
          backgroundColor: "rgba(10,10,26,0.80)",
          borderColor: "rgba(255,255,255,0.06)",
        }}
      >
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          {showBack ? (
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70"
              style={{ color: "#d4a574" }}
            >
              <span className="text-base leading-none">←</span>
              <span>Back</span>
            </Link>
          ) : (
            <div />
          )}

          {/* Centered emoji */}
          <span className="text-xl leading-none">{emoji}</span>

          {/* Spacer to balance the back button */}
          <div className="w-14" />
        </div>
      </div>

      {/* Title section */}
      <div className="max-w-lg mx-auto px-4 pt-8 pb-5 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-2xl font-bold leading-tight"
          style={{
            fontFamily: "var(--font-display)",
            color: "#f0e6d3",
          }}
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.12, duration: 0.4 }}
          className="mt-2 text-sm leading-relaxed"
          style={{ color: "#8a8695" }}
        >
          {subtitle}
        </motion.p>
      </div>

      {/* Game content */}
      <div className="max-w-lg mx-auto px-4 pb-24">{children}</div>
    </div>
  );
}
