"use client";

import { useState, useEffect } from "react";
import { Reorder, useDragControls, motion, AnimatePresence } from "framer-motion";
import { GameLayout } from "@/components/game-layout";
import { TimelineEvent } from "@/types";
import { useGuest } from "@/lib/guest-context";

// ─── Data ────────────────────────────────────────────────────────────────────

interface TimelineEventWithEmoji extends TimelineEvent {
  emoji: string;
}

const EVENTS: TimelineEventWithEmoji[] = [
  {
    id: "1",
    order: 1,
    emoji: "🤝",
    title: "First Met",
    description: "At a friend's gathering — neither expected to click",
    date: "Spring 2020",
  },
  {
    id: "2",
    order: 2,
    emoji: "☕",
    title: "First Date",
    description: "Coffee that turned into a 5-hour conversation",
    date: "Summer 2020",
  },
  {
    id: "3",
    order: 3,
    emoji: "💑",
    title: "Made It Official",
    description: "Finally put a label on it",
    date: "Fall 2020",
  },
  {
    id: "4",
    order: 4,
    emoji: "✈️",
    title: "First Trip Together",
    description: "A spontaneous weekend road trip",
    date: "Spring 2021",
  },
  {
    id: "5",
    order: 5,
    emoji: "👨‍👩‍👧",
    title: "Met the Parents",
    description: "The most nerve-wracking dinner ever",
    date: "Summer 2021",
  },
  {
    id: "6",
    order: 6,
    emoji: "🏠",
    title: "Moved In Together",
    description: "Two lives, one tiny apartment",
    date: "Winter 2022",
  },
  {
    id: "7",
    order: 7,
    emoji: "💍",
    title: "The Proposal",
    description: "An unforgettable sunset moment",
    date: "Fall 2024",
  },
  {
    id: "8",
    order: 8,
    emoji: "🎊",
    title: "The Wedding",
    description: "Today — the best day of their lives",
    date: "2026",
  },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POINTS_PER_CORRECT = 15;

// ─── Drag handle ─────────────────────────────────────────────────────────────

function DragHandle({ controls }: { controls: ReturnType<typeof useDragControls> }) {
  return (
    <div
      onPointerDown={(e) => {
        e.preventDefault();
        controls.start(e);
      }}
      className="flex flex-col items-center justify-center gap-[4px] px-2 py-1 cursor-grab active:cursor-grabbing select-none shrink-0"
      aria-label="Drag to reorder"
      style={{ touchAction: "none" }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-4 h-[2px] rounded-full"
          style={{ backgroundColor: "#8a8695" }}
        />
      ))}
    </div>
  );
}

// ─── Single sortable card ─────────────────────────────────────────────────────

function MilestoneCard({ event }: { event: TimelineEventWithEmoji }) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={event}
      dragListener={false}
      dragControls={controls}
      className="w-full"
      whileDrag={{
        scale: 1.03,
        boxShadow: "0 16px 48px rgba(212,165,116,0.18), 0 0 0 1px rgba(212,165,116,0.30)",
        zIndex: 50,
      }}
      transition={{ duration: 0.15 }}
      layout
      style={{ touchAction: "none" }}
    >
      <div
        className="flex items-center gap-3 rounded-2xl px-4 py-3 w-full"
        style={{
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.10)",
          touchAction: "none",
        }}
      >
        <DragHandle controls={controls} />

        {/* Emoji badge with gold glow */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 relative"
        >
          {/* Glow layer */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(212,165,116,0.22) 0%, transparent 70%)",
            }}
          />
          <span className="relative z-10">{event.emoji}</span>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p
            className="font-semibold text-sm leading-snug"
            style={{ fontFamily: "var(--font-display)", color: "#f0e6d3" }}
          >
            {event.title}
          </p>
          <p
            className="text-xs mt-0.5 leading-snug truncate"
            style={{ color: "rgba(240,230,211,0.50)" }}
          >
            {event.description}
          </p>
        </div>
      </div>
    </Reorder.Item>
  );
}

// ─── Results timeline ─────────────────────────────────────────────────────────

interface ResultCardProps {
  event: TimelineEventWithEmoji;
  submittedIndex: number;
  isCorrect: boolean;
  index: number;
  isLast: boolean;
}

function ResultCard({ event, submittedIndex, isCorrect, index, isLast }: ResultCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35, ease: "easeOut" }}
      className="flex gap-4"
    >
      {/* Timeline spine */}
      <div className="flex flex-col items-center shrink-0">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 border-2"
          style={
            isCorrect
              ? {
                  background: "rgba(52,211,153,0.18)",
                  borderColor: "#34d399",
                  color: "#34d399",
                }
              : {
                  background: "transparent",
                  borderColor: "rgba(251,113,113,0.60)",
                  color: "rgba(251,113,113,0.80)",
                }
          }
        >
          {isCorrect ? "✓" : "✗"}
        </div>
        {!isLast && (
          <div
            className="w-[2px] flex-1 mt-1"
            style={{
              background: "rgba(212,165,116,0.22)",
              minHeight: 28,
            }}
          />
        )}
      </div>

      {/* Card */}
      <div
        className="flex-1 rounded-2xl px-4 py-3 mb-4"
        style={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: isCorrect
            ? "1px solid rgba(52,211,153,0.25)"
            : "1px solid rgba(251,113,113,0.20)",
        }}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">{event.emoji}</span>
          <p
            className="font-semibold text-sm"
            style={{ fontFamily: "var(--font-display)", color: "#f0e6d3" }}
          >
            {event.title}
          </p>
        </div>
        <p className="text-xs mb-2" style={{ color: "rgba(240,230,211,0.45)" }}>
          {event.description}
        </p>
        <div className="flex items-center justify-between">
          {/* Date badge */}
          <span
            className="inline-block text-xs font-medium px-2.5 py-0.5 rounded-full"
            style={{
              background: "rgba(212,165,116,0.18)",
              color: "#d4a574",
              border: "1px solid rgba(212,165,116,0.25)",
            }}
          >
            {event.date}
          </span>
          {!isCorrect && (
            <span className="text-xs" style={{ color: "rgba(240,230,211,0.35)" }}>
              You placed #{submittedIndex + 1}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Score ring ───────────────────────────────────────────────────────────────

function ScoreRing({ score, maxScore }: { score: number; maxScore: number }) {
  const pct = maxScore > 0 ? score / maxScore : 0;
  const r = 44;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;

  return (
    <div className="relative w-28 h-28 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        {/* Track */}
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="8"
        />
        {/* Gold fill */}
        <motion.circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="#d4a574"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          style={{
            filter: "drop-shadow(0 0 6px rgba(212,165,116,0.55))",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-2xl font-bold"
          style={{ fontFamily: "var(--font-display)", color: "#d4a574" }}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          {score}
        </motion.span>
        <span className="text-xs" style={{ color: "rgba(240,230,211,0.45)" }}>
          pts
        </span>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

type Phase = "playing" | "results";

export default function TimelineGamePage() {
  const { guest } = useGuest();

  const [items, setItems] = useState<TimelineEventWithEmoji[]>([]);
  const [phase, setPhase] = useState<Phase>("playing");
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [submitted, setSubmitted] = useState<TimelineEventWithEmoji[]>([]);

  // Shuffle on mount
  useEffect(() => {
    setItems(shuffle(EVENTS));
  }, []);

  function handleCheck() {
    const sortedCorrect = [...EVENTS].sort((a, b) => a.order - b.order);
    let correct = 0;
    items.forEach((item, idx) => {
      if (item.id === sortedCorrect[idx].id) correct++;
    });
    const earned = correct * POINTS_PER_CORRECT;
    setCorrectCount(correct);
    setScore(earned);
    setSubmitted([...items]);
    setPhase("results");
  }

  const maxScore = EVENTS.length * POINTS_PER_CORRECT;
  const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  const correctOrder = [...EVENTS].sort((a, b) => a.order - b.order);

  return (
    <div
      className="min-h-screen"
      style={{ background: "#0a0a1a" }}
    >
      {/* Custom dark header overlay — sits above GameLayout's own header via wrapper */}
      <GameLayout
        title="Love Story Timeline"
        subtitle="Drag the milestones into the right order"
        emoji="📅"
      >
        <AnimatePresence mode="wait">
          {phase === "playing" ? (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              {/* Instruction chip */}
              <div className="text-center mb-5">
                <span
                  className="inline-block text-xs font-medium px-3 py-1 rounded-full"
                  style={{
                    background: "rgba(212,165,116,0.12)",
                    color: "rgba(212,165,116,0.85)",
                    border: "1px solid rgba(212,165,116,0.20)",
                  }}
                >
                  Drag ≡ to reorder · earliest first
                </span>
              </div>

              {/* Sortable list */}
              {items.length > 0 && (
                <Reorder.Group
                  axis="y"
                  values={items}
                  onReorder={setItems}
                  className="flex flex-col gap-3 mb-8"
                  style={{ listStyle: "none", padding: 0, margin: 0, touchAction: "none" }}
                  as="ol"
                >
                  {items.map((event) => (
                    <MilestoneCard key={event.id} event={event} />
                  ))}
                </Reorder.Group>
              )}

              {/* Check button — gold gradient */}
              <div className="flex justify-center mt-2 pb-6">
                <button
                  onClick={handleCheck}
                  disabled={items.length === 0}
                  className="text-base px-8 py-3.5 rounded-2xl font-semibold disabled:opacity-40 transition-all active:scale-95"
                  style={{
                    background: "linear-gradient(135deg, #d4a574 0%, #c49060 100%)",
                    color: "#1a1208",
                    boxShadow: "0 8px 32px rgba(212,165,116,0.35), 0 2px 8px rgba(212,165,116,0.20)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  Check My Order
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Score summary card */}
              <div
                className="rounded-2xl px-5 py-6 mb-6 text-center"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.09)",
                }}
              >
                <p
                  className="text-lg font-semibold mb-4"
                  style={{ fontFamily: "var(--font-display)", color: "#f0e6d3" }}
                >
                  {pct === 100
                    ? "Perfect! You know their story!"
                    : pct >= 75
                    ? "Great memory!"
                    : pct >= 50
                    ? "Not bad!"
                    : "Love is still in the air!"}
                </p>

                <ScoreRing score={score} maxScore={maxScore} />

                <div
                  className="mt-4 flex items-center justify-center gap-6 text-sm"
                  style={{ color: "rgba(240,230,211,0.45)" }}
                >
                  <div className="text-center">
                    <p
                      className="text-xl font-bold"
                      style={{ color: "#f0e6d3" }}
                    >
                      {correctCount}
                    </p>
                    <p>correct</p>
                  </div>
                  <div
                    className="h-8 w-px"
                    style={{ background: "rgba(255,255,255,0.10)" }}
                  />
                  <div className="text-center">
                    <p
                      className="text-xl font-bold"
                      style={{ color: "#f0e6d3" }}
                    >
                      {EVENTS.length - correctCount}
                    </p>
                    <p>off</p>
                  </div>
                  <div
                    className="h-8 w-px"
                    style={{ background: "rgba(255,255,255,0.10)" }}
                  />
                  <div className="text-center">
                    <p className="text-xl font-bold" style={{ color: "#d4a574" }}>
                      {pct}%
                    </p>
                    <p>accuracy</p>
                  </div>
                </div>
              </div>

              {/* Section header */}
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-4 text-center"
                style={{ color: "rgba(212,165,116,0.55)" }}
              >
                The Real Timeline
              </p>

              {/* Vertical timeline */}
              <div className="pl-1 pr-1">
                {correctOrder.map((event, index) => {
                  const submittedIndex = submitted.findIndex((s) => s.id === event.id);
                  const isCorrect = submittedIndex === index;
                  return (
                    <ResultCard
                      key={event.id}
                      event={event}
                      submittedIndex={submittedIndex}
                      isCorrect={isCorrect}
                      index={index}
                      isLast={index === correctOrder.length - 1}
                    />
                  );
                })}
              </div>

              {/* Play again */}
              <div className="flex flex-col items-center gap-3 mt-6 pb-6">
                <button
                  onClick={() => {
                    setItems(shuffle(EVENTS));
                    setPhase("playing");
                    setScore(0);
                    setCorrectCount(0);
                    setSubmitted([]);
                  }}
                  className="text-sm px-6 py-2.5 rounded-xl font-medium transition-all active:scale-95"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "rgba(240,230,211,0.75)",
                  }}
                >
                  Play Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GameLayout>
    </div>
  );
}
