"use client";

import { motion } from "framer-motion";
import { useGuest } from "@/lib/guest-context";
import { GuestRegistration } from "@/components/guest-registration";
import { GameCard } from "@/components/game-card";
import { Leaderboard } from "@/components/leaderboard";
import { GAMES, COUPLE } from "@/lib/games";
import { useState } from "react";

export default function HomePage() {
  const { guest, isRegistered } = useGuest();
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Demo: first game active, rest locked (admin will control this)
  const gamesWithStatus = GAMES.map((g, i) => ({
    ...g,
    status: i === 0 ? ("active" as const) : g.status,
  }));

  if (!isRegistered) {
    return (
      <div className="min-h-screen gradient-bg flex flex-col items-center justify-center px-4 py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
            className="text-6xl mb-4"
          >
            {COUPLE.person1.emoji} {COUPLE.person2.emoji}
          </motion.div>
          <h1 className="text-4xl font-bold shimmer" style={{ fontFamily: "var(--font-display)" }}>
            {COUPLE.person1.name} & {COUPLE.person2.name}
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-charcoal-light mt-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            The Game
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-sm text-charcoal-light/70 mt-4 max-w-xs mx-auto"
          >
            7 rounds. 1 leaderboard. Infinite fun.
            <br />Play all night and compete for the crown!
          </motion.p>
        </motion.div>

        <GuestRegistration />
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/70 backdrop-blur-lg border-b border-cream-dark/50">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-charcoal">
              Hey, {guest?.name}! 👋
            </span>
          </div>
          <div className="text-center">
            <span className="text-sm font-bold shimmer" style={{ fontFamily: "var(--font-display)" }}>
              N & S
            </span>
          </div>
          <button
            onClick={() => setShowLeaderboard(!showLeaderboard)}
            className="text-sm text-rose-gold font-medium"
          >
            {showLeaderboard ? "Games" : "🏆 Scores"}
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        {showLeaderboard ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2
              className="text-2xl font-bold text-charcoal mb-6 text-center"
              style={{ fontFamily: "var(--font-display)" }}
            >
              🏆 Leaderboard
            </h2>
            <Leaderboard entries={[]} />
          </motion.div>
        ) : (
          <>
            {/* Score Banner */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-game text-center mb-6 py-4"
            >
              <p className="text-xs text-charcoal-light uppercase tracking-wider mb-1">Your Score</p>
              <p className="text-3xl font-bold text-rose-gold tabular-nums">0 pts</p>
              <p className="text-xs text-charcoal-light mt-1">Table {guest?.tableNumber}</p>
            </motion.div>

            {/* Game List */}
            <div className="space-y-4">
              {gamesWithStatus.map((game, i) => (
                <GameCard key={game.id} game={game} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
