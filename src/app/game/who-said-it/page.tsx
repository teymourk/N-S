"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import Link from "next/link";
import { WhoSaidItQuestion } from "@/types";
import { useGuest } from "@/lib/guest-context";
import { COUPLE } from "@/lib/games";

// ─────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────
const QUESTIONS: WhoSaidItQuestion[] = [
  { id: "1",  quote: "I knew you were the one when you ate my leftovers without asking.",           said_by: "saba" },
  { id: "2",  quote: "I once cried watching a commercial about puppies.",                            said_by: "nima" },
  { id: "3",  quote: "I'm the better driver and that's not up for debate.",                          said_by: "saba" },
  { id: "4",  quote: "I pretend to like your mom's cooking but honestly it needs more salt.",        said_by: "nima" },
  { id: "5",  quote: "My idea of a perfect Sunday is doing absolutely nothing.",                     said_by: "nima" },
  { id: "6",  quote: "I secretly check your phone when you're sleeping.",                            said_by: "saba" },
  { id: "7",  quote: "I fell in love with you because of your laugh.",                               said_by: "nima" },
  { id: "8",  quote: "I would choose sleep over almost any social event.",                           said_by: "nima" },
  { id: "9",  quote: "I'm convinced I was a cat in a past life.",                                    said_by: "saba" },
  { id: "10", quote: "The first thing I noticed about you was your smile.",                          said_by: "saba" },
  { id: "11", quote: "I've rewatched our wedding video more times than I'll ever admit.",            said_by: "saba" },
  { id: "12", quote: "I still get nervous around you sometimes.",                                    said_by: "nima" },
  { id: "13", quote: "I practice conversations in the shower.",                                      said_by: "nima" },
  { id: "14", quote: "If we didn't end up together, I'd still be eating cereal for dinner.",        said_by: "nima" },
  { id: "15", quote: "You're my favorite person to do nothing with.",                                said_by: "saba" },
];

const TOTAL = QUESTIONS.length;
const POINTS_PER_CORRECT = 10;

// ─────────────────────────────────────────────
// Rank helper
// ─────────────────────────────────────────────
function getRank(pct: number): { label: string; message: string } {
  if (pct === 100) return { label: "Mind Reader",    message: "You know them better than they know themselves." };
  if (pct >= 80)  return { label: "Couple Expert",   message: "Clearly you've been paying close attention." };
  if (pct >= 60)  return { label: "Good Friend",     message: "Not bad — you know the highlights at least." };
  if (pct >= 40)  return { label: "Casual Fan",      message: "You showed up. That counts for something." };
  return              { label: "Total Wildcard",  message: "Did you two just meet tonight?" };
}

// ─────────────────────────────────────────────
// Swipe Card
// ─────────────────────────────────────────────
const SWIPE_VELOCITY_THRESHOLD = 300;
const SWIPE_OFFSET_THRESHOLD   = 100;

interface SwipeCardProps {
  question: WhoSaidItQuestion;
  questionIndex: number;
  onSwipe: (direction: "left" | "right") => void;
}

function SwipeCard({ question, questionIndex, onSwipe }: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate      = useTransform(x, [-250, 250], [-18, 18]);
  const sabaOpacity = useTransform(x, [-80, -20, 0], [1, 0.3, 0]);
  const nimaOpacity = useTransform(x, [0, 20, 80],   [0, 0.3, 1]);

  function handleDragEnd(
    _: unknown,
    info: { offset: { x: number }; velocity: { x: number } }
  ) {
    const velocity = info.velocity.x;
    const offset   = info.offset.x;
    if (velocity > SWIPE_VELOCITY_THRESHOLD || offset > SWIPE_OFFSET_THRESHOLD) {
      onSwipe("right");
    } else if (velocity < -SWIPE_VELOCITY_THRESHOLD || offset < -SWIPE_OFFSET_THRESHOLD) {
      onSwipe("left");
    }
  }

  return (
    <motion.div
      key={question.id}
      className="absolute inset-0 m-auto w-full cursor-grab active:cursor-grabbing"
      style={{ x, rotate, zIndex: 1, touchAction: "none" }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.92, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{
        x: x.get() > 0 ? 500 : -500,
        rotate: x.get() > 0 ? 25 : -25,
        opacity: 0,
        transition: { duration: 0.35, ease: "easeOut" },
      }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
    >
      {/* Frosted glass card */}
      <div
        className="h-full flex flex-col select-none relative overflow-hidden rounded-3xl"
        style={{
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.10)",
        }}
      >
        {/* Gold shimmer top bar */}
        <div
          className="h-[2px] w-full rounded-full"
          style={{
            background: "linear-gradient(90deg, transparent 0%, #d4a574 40%, #f0e6d3 60%, #d4a574 80%, transparent 100%)",
          }}
        />

        {/* Question badge */}
        <div
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: "rgba(212,165,116,0.15)", border: "1px solid rgba(212,165,116,0.3)" }}
        >
          <span className="text-xs font-semibold" style={{ color: "#d4a574" }}>{questionIndex + 1}</span>
        </div>

        {/* Card body */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 gap-4">
          {/* Opening quote mark */}
          <span
            className="text-7xl leading-none select-none self-start -mb-4"
            aria-hidden
            style={{
              fontFamily: "var(--font-display)",
              color: "rgba(212,165,116,0.35)",
            }}
          >
            &ldquo;
          </span>

          <p
            className="text-xl leading-relaxed text-center italic font-medium px-2"
            style={{
              fontFamily: "var(--font-display)",
              color: "#f0e6d3",
            }}
          >
            {question.quote}
          </p>

          {/* Closing quote mark */}
          <span
            className="text-7xl leading-none select-none self-end -mt-4"
            aria-hidden
            style={{
              fontFamily: "var(--font-display)",
              color: "rgba(212,165,116,0.35)",
            }}
          >
            &rdquo;
          </span>
        </div>

        {/* Swipe hint row */}
        <div className="flex items-center justify-between px-6 pb-6 pt-2">
          <motion.div
            style={{ opacity: sabaOpacity }}
            className="flex items-center gap-2 font-semibold text-sm"
          >
            <span className="text-lg">{COUPLE.person2.emoji}</span>
            <span style={{ color: "#f4a0b0" }}>← Saba</span>
          </motion.div>

          <div className="text-xs text-center" style={{ color: "rgba(240,230,211,0.35)" }}>
            swipe to guess
          </div>

          <motion.div
            style={{ opacity: nimaOpacity }}
            className="flex items-center gap-2 font-semibold text-sm"
          >
            <span style={{ color: "#7eb8d4" }}>Nima →</span>
            <span className="text-lg">{COUPLE.person1.emoji}</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Answer Overlay
// ─────────────────────────────────────────────
interface AnswerOverlayProps {
  correct: boolean;
  actualPerson: "nima" | "saba";
  onDismiss: () => void;
}

function AnswerOverlay({ correct, actualPerson, onDismiss }: AnswerOverlayProps) {
  const personName  = actualPerson === "nima" ? COUPLE.person1.name : COUPLE.person2.name;
  const personEmoji = actualPerson === "nima" ? COUPLE.person1.emoji : COUPLE.person2.emoji;

  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-3xl"
      style={{
        background: correct
          ? "rgba(16, 185, 129, 0.20)"
          : "rgba(239, 68, 68, 0.20)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: correct
          ? "1px solid rgba(16, 185, 129, 0.35)"
          : "1px solid rgba(239, 68, 68, 0.35)",
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 350, damping: 28 }}
      onClick={onDismiss}
    >
      {/* Result icon */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 22, delay: 0.05 }}
        className="text-6xl mb-3"
        style={{ color: correct ? "#10b981" : "#ef4444" }}
      >
        {correct ? "✓" : "✗"}
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="font-bold text-lg mb-3"
        style={{ color: "#f0e6d3" }}
      >
        {correct ? "Correct!" : "Nope!"}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="flex items-center gap-2 rounded-full px-4 py-2"
        style={{
          background: "rgba(255,255,255,0.10)",
          border: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        <span className="text-xl">{personEmoji}</span>
        <span className="font-semibold" style={{ color: "#f0e6d3" }}>{personName} said that</span>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-xs mt-5"
        style={{ color: "rgba(240,230,211,0.45)" }}
      >
        tap to continue
      </motion.p>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Animated Score Counter
// ─────────────────────────────────────────────
function AnimatedScore({ score, large }: { score: number; large?: boolean }) {
  return (
    <motion.span
      key={score}
      initial={{ scale: 1.5, filter: "brightness(2)" }}
      animate={{ scale: 1, filter: "brightness(1)" }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={`tabular-nums font-bold ${large ? "text-5xl" : "text-3xl"}`}
      style={{
        fontFamily: "var(--font-display)",
        background: "linear-gradient(135deg, #d4a574 0%, #f0e6d3 50%, #d4a574 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {score}
    </motion.span>
  );
}

// ─────────────────────────────────────────────
// Progress Bar
// ─────────────────────────────────────────────
function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = (current / total) * 100;
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1.5" style={{ color: "rgba(240,230,211,0.45)" }}>
        <span>Question {current} of {total}</span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.08)" }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, #d4a574 0%, #f0e6d3 100%)",
          }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Glass Stat Card
// ─────────────────────────────────────────────
function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl ${className}`}
      style={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.09)",
      }}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────
// Results Screen
// ─────────────────────────────────────────────
interface ResultsScreenProps {
  score: number;
  correct: number;
  total: number;
  guestName: string | undefined;
}

function ResultsScreen({ score, correct, total, guestName }: ResultsScreenProps) {
  const pct  = Math.round((correct / total) * 100);
  const rank = getRank(pct);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 24 }}
      className="flex flex-col items-center gap-6 py-6"
    >
      {/* Trophy */}
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 250, damping: 20, delay: 0.1 }}
        className="text-7xl"
      >
        {pct >= 80 ? "🏆" : pct >= 60 ? "🌟" : pct >= 40 ? "🎉" : "😅"}
      </motion.div>

      {/* Rank */}
      <div className="text-center">
        <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "rgba(240,230,211,0.45)" }}>
          {guestName ? `${guestName}, you are` : "You are"}
        </p>
        <h2
          className="text-4xl font-bold"
          style={{
            fontFamily: "var(--font-display)",
            background: "linear-gradient(135deg, #d4a574 0%, #f0e6d3 50%, #d4a574 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {rank.label}
        </h2>
        <p className="mt-2 text-sm max-w-[240px] mx-auto leading-snug" style={{ color: "rgba(240,230,211,0.60)" }}>
          {rank.message}
        </p>
      </div>

      {/* Score tile */}
      <GlassCard className="w-full max-w-xs text-center py-6">
        <AnimatedScore score={score} large />
        <p className="text-xs uppercase tracking-wider mt-2" style={{ color: "rgba(240,230,211,0.45)" }}>
          points earned
        </p>
      </GlassCard>

      {/* Stats row */}
      <div className="flex gap-3 w-full max-w-xs">
        <GlassCard className="flex-1 text-center py-5">
          <p
            className="text-2xl font-bold tabular-nums"
            style={{
              background: "linear-gradient(135deg, #d4a574, #f0e6d3)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {correct}/{total}
          </p>
          <p className="text-xs mt-1" style={{ color: "rgba(240,230,211,0.45)" }}>correct</p>
        </GlassCard>
        <GlassCard className="flex-1 text-center py-5">
          <p
            className="text-2xl font-bold tabular-nums"
            style={{
              background: "linear-gradient(135deg, #d4a574, #f0e6d3)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {pct}%
          </p>
          <p className="text-xs mt-1" style={{ color: "rgba(240,230,211,0.45)" }}>accuracy</p>
        </GlassCard>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs">
        <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #d4a574 0%, #f0e6d3 100%)" }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
          />
        </div>
        <p className="text-xs text-center mt-2" style={{ color: "rgba(240,230,211,0.35)" }}>
          {pct}% accuracy
        </p>
      </div>

      {/* CTA */}
      <Link
        href="/"
        className="mt-2 px-8 py-3.5 rounded-full font-semibold text-sm transition-all duration-200 active:scale-95"
        style={{
          background: "transparent",
          border: "1px solid rgba(212,165,116,0.6)",
          color: "#d4a574",
        }}
      >
        Back to Games
      </Link>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Dark Layout Shell
// ─────────────────────────────────────────────
function DarkLayout({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div
      className="min-h-screen"
      style={{ background: "#0a0a1a" }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-50"
        style={{
          background: "rgba(10,10,26,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-medium flex items-center gap-1 transition-opacity hover:opacity-70"
            style={{ color: "#d4a574" }}
          >
            ← Back
          </Link>
          <span className="text-lg">💬</span>
          <div className="w-14" />
        </div>
      </div>

      {/* Title */}
      <div className="max-w-lg mx-auto px-4 pt-6 pb-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold"
          style={{
            fontFamily: "var(--font-display)",
            background: "linear-gradient(135deg, #d4a574 0%, #f0e6d3 50%, #d4a574 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-1 text-sm"
          style={{ color: "rgba(240,230,211,0.50)" }}
        >
          {subtitle}
        </motion.p>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 pb-24">
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────
type GamePhase = "playing" | "revealing" | "finished";

export default function WhoSaidItPage() {
  const { guest } = useGuest();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore]               = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [phase, setPhase]               = useState<GamePhase>("playing");
  const [lastCorrect, setLastCorrect]   = useState(false);

  const currentQuestion = QUESTIONS[currentIndex];
  const isDone          = currentIndex >= TOTAL;

  const handleSwipe = useCallback(
    (direction: "left" | "right") => {
      if (phase !== "playing") return;

      const guessed: "nima" | "saba" = direction === "right" ? "nima" : "saba";
      const correct = guessed === currentQuestion.said_by;

      setLastCorrect(correct);

      if (correct) {
        setScore((s) => s + POINTS_PER_CORRECT);
        setCorrectCount((c) => c + 1);
      }

      setPhase("revealing");
    },
    [phase, currentQuestion]
  );

  function handleOverlayDismiss() {
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    if (nextIndex >= TOTAL) {
      setPhase("finished");
    } else {
      setPhase("playing");
    }
  }

  function handleButtonSwipe(direction: "left" | "right") {
    handleSwipe(direction);
  }

  if (phase === "finished" || isDone) {
    return (
      <DarkLayout title="Who Said It?" subtitle="Results">
        <ResultsScreen
          score={score}
          correct={correctCount}
          total={TOTAL}
          guestName={guest?.name}
        />
      </DarkLayout>
    );
  }

  return (
    <DarkLayout title="Who Said It?" subtitle="Swipe to guess — Nima or Saba?">
      {/* Score + Progress */}
      <div className="mb-5 space-y-3">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <ProgressBar current={currentIndex + 1} total={TOTAL} />
          </div>
          <div className="flex-shrink-0 text-center leading-none">
            <AnimatedScore score={score} />
            <p className="text-xs mt-0.5" style={{ color: "rgba(240,230,211,0.40)" }}>pts</p>
          </div>
        </div>
      </div>

      {/* Card arena */}
      <div className="relative w-full" style={{ height: 380 }}>
        {/* Ghost card behind */}
        {currentIndex + 1 < TOTAL && (
          <div
            className="absolute inset-0 rounded-3xl"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              transform: "scale(0.95) translateY(10px)",
              zIndex: 0,
            }}
          />
        )}

        <AnimatePresence mode="wait">
          {(phase === "playing" || phase === "revealing") && (
            <motion.div
              key={currentQuestion.id}
              className="absolute inset-0"
              style={{ zIndex: 1 }}
            >
              <SwipeCard
                question={currentQuestion}
                questionIndex={currentIndex}
                onSwipe={handleSwipe}
              />

              <AnimatePresence>
                {phase === "revealing" && (
                  <AnswerOverlay
                    correct={lastCorrect}
                    actualPerson={currentQuestion.said_by}
                    onDismiss={handleOverlayDismiss}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tap buttons */}
      <div className="flex gap-3 mt-6">
        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={() => handleButtonSwipe("left")}
          disabled={phase !== "playing"}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm
                     transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            background: "transparent",
            border: "1px solid rgba(212,165,116,0.35)",
            color: "#f4a0b0",
          }}
        >
          <span className="text-lg">{COUPLE.person2.emoji}</span>
          <span>← Saba</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={() => handleButtonSwipe("right")}
          disabled={phase !== "playing"}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm
                     transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            background: "transparent",
            border: "1px solid rgba(212,165,116,0.35)",
            color: "#7eb8d4",
          }}
        >
          <span>Nima →</span>
          <span className="text-lg">{COUPLE.person1.emoji}</span>
        </motion.button>
      </div>

      {/* Swipe hint — first card only */}
      {currentIndex === 0 && phase === "playing" && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs mt-4"
          style={{ color: "rgba(240,230,211,0.30)" }}
        >
          Drag the card or tap the buttons below
        </motion.p>
      )}
    </DarkLayout>
  );
}
