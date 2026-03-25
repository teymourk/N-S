"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useGuest } from "@/lib/guest-context";
import {
  GoldMedalIcon,
  SilverMedalIcon,
  BronzeMedalIcon,
  SparkleIcon,
} from "@/components/icons";

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

const MEDAL_ICONS = [
  <GoldMedalIcon key="gold" size={28} />,
  <SilverMedalIcon key="silver" size={26} />,
  <BronzeMedalIcon key="bronze" size={24} />,
];

const RANK_COLORS = {
  0: {
    border: "border-[#d4a574]",
    glow: "shadow-[0_0_32px_rgba(212,165,116,0.25)]",
    accent: "#d4a574",
    bg: "bg-[#d4a574]/[0.07]",
    label: "gold",
  },
  1: {
    border: "border-[#c0c0c0]",
    glow: "shadow-[0_0_20px_rgba(192,192,192,0.12)]",
    accent: "#c0c0c0",
    bg: "bg-[#c0c0c0]/[0.05]",
    label: "silver",
  },
  2: {
    border: "border-[#cd7f32]",
    glow: "shadow-[0_0_20px_rgba(205,127,50,0.12)]",
    accent: "#cd7f32",
    bg: "bg-[#cd7f32]/[0.05]",
    label: "bronze",
  },
} as const;

function TopPodiumCard({
  entry,
  i,
  isMe,
}: {
  entry: LeaderboardEntry;
  i: 0 | 1 | 2;
  isMe: boolean;
}) {
  const theme = RANK_COLORS[i];

  return (
    <motion.div
      key={entry.guest_id}
      layout
      layoutId={entry.guest_id}
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      whileHover={{ scale: i === 0 ? 1.025 : 1.02 }}
      transition={{
        layout: { type: "spring", stiffness: 400, damping: 30 },
        opacity: { duration: 0.25 },
        y: { duration: 0.3, delay: i * 0.05 },
        scale: { type: "spring", stiffness: 350, damping: 22 },
      }}
      className={`
        relative w-full mb-3 rounded-xl border backdrop-blur-sm overflow-hidden
        ${theme.border} ${theme.glow} ${theme.bg}
        ${i === 0 ? "py-5 px-5" : "py-3.5 px-5"}
        ${isMe ? "border-l-[3px] border-l-[#d4a574]" : ""}
      `}
    >
      {/* Ambient glow behind name for #1 */}
      {i === 0 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 80% at 30% 50%, rgba(212,165,116,0.12) 0%, transparent 70%)",
          }}
        />
      )}

      <div className="relative flex items-center justify-between gap-3">
        {/* Left: medal + name */}
        <div className="flex items-center gap-3 min-w-0">
          <motion.div
            className="shrink-0"
            aria-label={`Rank ${i + 1}`}
            initial={{ scale: 0.6, rotate: -15, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 18,
              delay: i * 0.07 + 0.1,
            }}
          >
            {MEDAL_ICONS[i]}
          </motion.div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`
                  font-semibold truncate leading-tight
                  ${i === 0 ? "text-[17px] text-[#f0e6d3]" : "text-[15px] text-[#d8cfc4]"}
                `}
                style={
                  i === 0
                    ? {
                        background:
                          "linear-gradient(90deg, #f0e6d3 0%, #d4a574 60%, #f0e6d3 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }
                    : {}
                }
              >
                {entry.guest_name}
              </span>

              {isMe && (
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0 leading-none"
                  style={{
                    background: "rgba(212,165,116,0.15)",
                    color: "#d4a574",
                    border: "1px solid rgba(212,165,116,0.3)",
                  }}
                >
                  You
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: score */}
        <motion.div
          key={entry.total_score}
          initial={{ scale: i === 0 ? 1.6 : 1.25, opacity: 0, y: i === 0 ? -6 : 0 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: i === 0 ? 320 : 500,
            damping: i === 0 ? 18 : 28,
            delay: i === 0 ? 0.15 : 0,
          }}
          className="shrink-0 text-right"
        >
          <span
            className={`
              tabular-nums font-bold tracking-tight
              ${i === 0 ? "text-xl" : "text-lg"}
            `}
            style={{ color: "#d4a574" }}
          >
            {entry.total_score.toLocaleString()}
          </span>
          <span className="text-[11px] ml-1" style={{ color: "#8a8695" }}>
            pts
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

function StandardRow({
  entry,
  i,
  isMe,
}: {
  entry: LeaderboardEntry;
  i: number;
  isMe: boolean;
}) {
  return (
    <motion.div
      key={entry.guest_id}
      layout
      layoutId={entry.guest_id}
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{
        layout: { type: "spring", stiffness: 400, damping: 30 },
        opacity: { duration: 0.2 },
        x: { duration: 0.25, delay: i * 0.05 },
      }}
      className={`
        relative flex items-center justify-between py-3 px-4 mb-2
        rounded-xl border backdrop-blur-sm
        bg-white/[0.04] border-white/[0.06]
        transition-colors duration-200
        hover:bg-white/[0.07]
        ${isMe ? "border-l-[3px] border-l-[#d4a574] pl-3.5" : ""}
      `}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span
          className="text-sm font-bold tabular-nums w-6 text-center shrink-0 leading-none"
          style={{ color: "#8a8695" }}
        >
          {entry.rank}
        </span>

        <div className="flex items-center gap-2 min-w-0">
          <span
            className="text-[14px] font-medium truncate"
            style={{ color: "#d8cfc4" }}
          >
            {entry.guest_name}
          </span>

          {isMe && (
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0 leading-none"
              style={{
                background: "rgba(212,165,116,0.15)",
                color: "#d4a574",
                border: "1px solid rgba(212,165,116,0.3)",
              }}
            >
              You
            </span>
          )}
        </div>
      </div>

      <motion.div
        key={entry.total_score}
        initial={{ scale: 1.2, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
        className="shrink-0"
      >
        <span
          className="tabular-nums font-semibold text-[15px]"
          style={{ color: "#d4a574" }}
        >
          {entry.total_score.toLocaleString()}
        </span>
        <span className="text-[11px] ml-1" style={{ color: "#8a8695" }}>
          pts
        </span>
      </motion.div>
    </motion.div>
  );
}

export function Leaderboard({ entries, compact = false }: LeaderboardProps) {
  const { guest } = useGuest();
  const displayed = compact ? entries.slice(0, 5) : entries;

  if (displayed.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full flex flex-col items-center justify-center py-14 gap-3"
      >
        <SparkleIcon size={32} />
        <p
          className="text-[15px] font-medium text-center"
          style={{ color: "#8a8695" }}
        >
          No scores yet
        </p>
        <p className="text-[13px] text-center" style={{ color: "#8a8695aa" }}>
          Be the first to play and claim the top spot.
        </p>
      </motion.div>
    );
  }

  const podium = displayed.slice(0, 3);
  const rest = displayed.slice(3);

  return (
    <div className="w-full">
      <AnimatePresence mode="popLayout">
        {podium.map((entry, i) => (
          <TopPodiumCard
            key={entry.guest_id}
            entry={entry}
            i={i as 0 | 1 | 2}
            isMe={entry.guest_id === guest?.id}
          />
        ))}

        {rest.length > 0 && (
          <motion.div
            key="divider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="my-3 flex items-center gap-3"
          >
            <div
              className="flex-1 h-px"
              style={{ background: "rgba(255,255,255,0.06)" }}
            />
            <span className="text-[11px] font-medium" style={{ color: "#8a8695" }}>
              Rankings
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: "rgba(255,255,255,0.06)" }}
            />
          </motion.div>
        )}

        {rest.map((entry, i) => (
          <StandardRow
            key={entry.guest_id}
            entry={entry}
            i={i + 3}
            isMe={entry.guest_id === guest?.id}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
