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

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
    >
      {isLocked ? (
        <div className="card-game opacity-50 cursor-not-allowed relative overflow-hidden">
          <div className="absolute inset-0 bg-charcoal/5 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <span className="text-4xl">🔒</span>
          </div>
          <CardContent game={game} />
        </div>
      ) : (
        <Link href={game.route}>
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`card-game cursor-pointer relative overflow-hidden
              ${isCompleted ? "border-sage/50 bg-sage/5" : "border-rose-gold/20 hover:border-rose-gold/50"}`}
          >
            {isCompleted && (
              <div className="absolute top-3 right-3">
                <span className="text-sage text-sm font-medium flex items-center gap-1">
                  ✓ Done
                </span>
              </div>
            )}
            <CardContent game={game} />
          </motion.div>
        </Link>
      )}
    </motion.div>
  );
}

function CardContent({ game }: { game: GameConfig }) {
  return (
    <div className="flex items-start gap-4">
      <div className="text-4xl flex-shrink-0 mt-1">{game.emoji}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-rose-gold bg-rose-gold/10 px-2 py-0.5 rounded-full">
            Round {game.order}
          </span>
          {game.pointsPerCorrect > 0 && (
            <span className="text-xs text-charcoal-light">
              {game.pointsPerCorrect} pts each
            </span>
          )}
        </div>
        <h3 className="text-lg font-bold text-charcoal mt-1" style={{ fontFamily: "var(--font-display)" }}>
          {game.title}
        </h3>
        <p className="text-sm text-charcoal-light mt-1 line-clamp-2">
          {game.description}
        </p>
      </div>
    </div>
  );
}
