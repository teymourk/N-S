"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { GameConfig } from "@/types";

interface GameCardProps {
  game: GameConfig;
  index: number;
}

export function GameCard({ game, index }: GameCardProps) {
  const isLocked = game.status === "locked";
  const isCompleted = game.status === "completed";

  const cardBase =
    "relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-lg p-5";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.45, ease: "easeOut" }}
    >
      {isLocked ? (
        <div className={`${cardBase} cursor-not-allowed`}>
          {/* Lock overlay */}
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl backdrop-blur-md bg-black/40">
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl opacity-70">🔒</span>
              <span className="text-xs text-[#8a8695] font-medium tracking-wider uppercase">
                Locked
              </span>
            </div>
          </div>
          <CardContent game={game} />
        </div>
      ) : (
        <Link href={game.route} className="block">
          <motion.div
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.985 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className={`${cardBase} cursor-pointer transition-all duration-300
              ${isCompleted
                ? "border-emerald-500/20 opacity-75"
                : "border-l-2 border-l-[#d4a574] border-t-white/[0.08] border-r-white/[0.08] border-b-white/[0.08] hover:border-white/[0.18]"
              }`}
            style={
              !isCompleted
                ? {
                    ["--hover-shadow" as string]:
                      "0 4px 20px rgba(212,165,116,0.1)",
                  }
                : undefined
            }
            onMouseEnter={(e) => {
              if (!isCompleted) {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 4px 20px rgba(212,165,116,0.1)";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            {isCompleted && (
              <div className="absolute top-3.5 right-4 flex items-center gap-1.5">
                <span className="text-emerald-400 text-xs">✓</span>
                <span className="text-emerald-400/70 text-xs font-medium">
                  Done
                </span>
              </div>
            )}
            <CardContent game={game} isCompleted={isCompleted} />
          </motion.div>
        </Link>
      )}
    </motion.div>
  );
}

function CardContent({
  game,
  isCompleted,
}: {
  game: GameConfig;
  isCompleted?: boolean;
}) {
  return (
    <div className="flex items-start gap-4">
      {/* Emoji with gold glow */}
      <div className="relative flex-shrink-0 mt-0.5">
        <div
          className="absolute inset-0 rounded-full opacity-40 blur-md"
          style={{
            background:
              "radial-gradient(circle, #d4a574 0%, transparent 70%)",
            transform: "scale(1.4)",
          }}
        />
        <span className="relative text-4xl leading-none">{game.emoji}</span>
      </div>

      {/* Text content */}
      <div className="flex-1 min-w-0">
        {/* Round badge + points */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wide"
            style={{
              backgroundColor: "#d4a574",
              color: "#0a0a1a",
            }}
          >
            Round {game.order}
          </span>
          {game.pointsPerCorrect > 0 && (
            <span className="text-[11px] text-[#8a8695]">
              {game.pointsPerCorrect} pts each
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          className={`text-lg font-bold mt-1.5 leading-snug ${
            isCompleted ? "text-[#f0e6d3]/60" : "text-[#f0e6d3]"
          }`}
          style={{ fontFamily: "var(--font-display)" }}
        >
          {game.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-[#8a8695] mt-1 line-clamp-2 leading-relaxed">
          {game.description}
        </p>
      </div>
    </div>
  );
}
