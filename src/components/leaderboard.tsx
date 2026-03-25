"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useGuest } from "@/lib/guest-context";

interface LeaderboardEntry {
  guest_id: string;
  guest_name: string;
  total_score: number;
  rank: number;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  compact?: boolean;
}

const MEDAL = ["🥇", "🥈", "🥉"];

export function Leaderboard({ entries, compact = false }: LeaderboardProps) {
  const { guest } = useGuest();
  const displayed = compact ? entries.slice(0, 5) : entries;

  return (
    <div className="w-full">
      <AnimatePresence mode="popLayout">
        {displayed.map((entry, i) => {
          const isMe = entry.guest_id === guest?.id;
          return (
            <motion.div
              key={entry.guest_id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center justify-between py-3 px-4 rounded-xl mb-2
                ${isMe ? "bg-rose-gold/10 border border-rose-gold/30" : "bg-white/50"}
                ${i === 0 && !compact ? "scale-105 shadow-md" : ""}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl w-8 text-center">
                  {i < 3 ? MEDAL[i] : <span className="text-charcoal-light text-sm font-bold">{entry.rank}</span>}
                </span>
                <div>
                  <span className={`font-medium ${isMe ? "text-rose-gold-dark font-bold" : "text-charcoal"}`}>
                    {entry.guest_name}
                    {isMe && " (You)"}
                  </span>
                </div>
              </div>
              <motion.span
                key={entry.total_score}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                className="font-bold text-rose-gold tabular-nums"
              >
                {entry.total_score.toLocaleString()} pts
              </motion.span>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {entries.length === 0 && (
        <p className="text-center text-charcoal-light py-8">
          No scores yet — be the first to play!
        </p>
      )}
    </div>
  );
}
