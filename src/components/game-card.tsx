"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { GameConfig } from "@/types";
import { GameIcon, LockIcon, CheckIcon } from "@/components/icons";

interface GameCardProps {
  game: GameConfig;
  index: number;
}

export function GameCard({ game, index }: GameCardProps) {
  const isLocked = game.status === "locked";
  const isCompleted = game.status === "completed";

  const cardRef = useRef<HTMLDivElement>(null);

  // Raw pointer position relative to card center (-0.5 → 0.5)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring-smooth the raw values
  const springConfig = { stiffness: 300, damping: 30, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);
  const glowOpacity = useSpring(useTransform(mouseX, [-0.5, 0, 0.5], [0.3, 0.5, 0.3]), springConfig);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    mouseX.set((e.clientX - left) / width - 0.5);
    mouseY.set((e.clientY - top) / height - 0.5);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  const cardBase =
    "relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-lg p-4 h-full";

  const inner = (
    <div className="flex flex-col items-center text-center gap-2.5">
      {/* Icon with gold glow */}
      <div className="relative">
        <motion.div
          className="absolute inset-0 rounded-full blur-md"
          style={{
            background: "radial-gradient(circle, #d4a574 0%, transparent 70%)",
            transform: "scale(1.6)",
            opacity: glowOpacity,
          }}
        />
        <div className="relative">
          <GameIcon
            gameId={game.id}
            size={36}
            animated={!isLocked && !isCompleted}
          />
        </div>
      </div>

      {/* Round badge */}
      <span
        className="text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wide"
        style={{ backgroundColor: "#d4a574", color: "#0a0a1a" }}
      >
        Round {game.order}
      </span>

      {/* Title */}
      <h3
        className={`text-sm font-bold leading-tight ${
          isCompleted ? "text-[#f0e6d3]/60" : "text-[#f0e6d3]"
        }`}
        style={{ fontFamily: "var(--font-display)" }}
      >
        {game.title}
      </h3>

      {/* Points */}
      {game.pointsPerCorrect > 0 && (
        <span className="text-[10px] text-[#8a8695]">
          {game.pointsPerCorrect} pts each
        </span>
      )}
      {game.pointsPerCorrect === 0 && (
        <span className="text-[10px] text-[#8a8695] italic">no points</span>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 800 }}
    >
      {isLocked ? (
        <div className={`${cardBase} cursor-not-allowed`}>
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl backdrop-blur-md bg-black/40">
            <div className="opacity-60">
              <LockIcon size={28} />
            </div>
          </div>
          {inner}
        </div>
      ) : (
        <Link href={game.route} className="block h-full">
          <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={`${cardBase} cursor-pointer transition-colors duration-300
              ${isCompleted
                ? "border-emerald-500/20 opacity-75"
                : "hover:border-[#d4a574]/30 hover:shadow-[0_8px_30px_rgba(212,165,116,0.12)]"
              }`}
          >
            {isCompleted && (
              <div className="absolute top-2 right-2">
                <CheckIcon size={18} />
              </div>
            )}
            {inner}
          </motion.div>
        </Link>
      )}
    </motion.div>
  );
}
