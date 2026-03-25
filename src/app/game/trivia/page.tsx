"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { GameLayout } from "@/components/game-layout";
import { TriviaQuestion } from "@/types";
import { useGuest } from "@/lib/guest-context";

// ─── Questions ────────────────────────────────────────────────────────────────

const QUESTIONS: TriviaQuestion[] = [
  {
    id: "q1",
    question: "Where did Nima and Saba first meet?",
    options: ["Dating app", "Through mutual friends", "At university", "At a coffee shop"],
    correct_index: 1,
    time_limit_seconds: 15,
    points: 10,
  },
  {
    id: "q2",
    question: "What was their first date?",
    options: ["Movie night", "A long walk that turned into dinner", "Cooking together", "Concert"],
    correct_index: 1,
    time_limit_seconds: 15,
    points: 10,
  },
  {
    id: "q3",
    question: "What's Nima's most annoying habit?",
    options: [
      "Forgetting to reply to texts",
      "Leaving cabinet doors open",
      "Humming constantly",
      "Being chronically late",
    ],
    correct_index: 1,
    time_limit_seconds: 15,
    points: 10,
  },
  {
    id: "q4",
    question: "What's Saba's go-to comfort food?",
    options: ["Pizza", "Ghormeh sabzi", "Sushi", "Pasta"],
    correct_index: 1,
    time_limit_seconds: 15,
    points: 10,
  },
  {
    id: "q5",
    question: "How long did they date before getting engaged?",
    options: ["1 year", "2 years", "3 years", "5 years"],
    correct_index: 2,
    time_limit_seconds: 15,
    points: 10,
  },
  {
    id: "q6",
    question: "What's their favorite show to binge together?",
    options: ["Succession", "Schitt's Creek", "The Bear", "Severance"],
    correct_index: 1,
    time_limit_seconds: 15,
    points: 10,
  },
  {
    id: "q7",
    question: "Who is the early bird in the relationship?",
    options: ["Nima", "Saba", "Neither — they're both night owls", "Both wake up at dawn"],
    correct_index: 1,
    time_limit_seconds: 15,
    points: 10,
  },
  {
    id: "q8",
    question: "What city was the proposal in?",
    options: ["Rome", "Istanbul", "Vancouver", "Paris"],
    correct_index: 2,
    time_limit_seconds: 15,
    points: 10,
  },
  {
    id: "q9",
    question: "👶 Baby Photo Round — Whose baby photo is this?",
    options: ["Saba", "Nima", "Neither — that's a stock photo", "Both look the same"],
    correct_index: 1,
    time_limit_seconds: 15,
    points: 10,
  },
  {
    id: "q10",
    question: "What's Nima's hidden talent?",
    options: [
      "He can juggle three balls",
      "He can solve a Rubik's cube",
      "He can do a perfect split",
      "He can beatbox",
    ],
    correct_index: 1,
    time_limit_seconds: 15,
    points: 10,
  },
  {
    id: "q11",
    question: "What would Saba's dream vacation be?",
    options: ["Safari in Kenya", "Road trip across Japan", "Amalfi Coast, Italy", "New Zealand hiking"],
    correct_index: 2,
    time_limit_seconds: 15,
    points: 10,
  },
  {
    id: "q12",
    question: "What's the couple's inside joke word?",
    options: ["Spaghetti", "Bloop", "Snorgle", "Flumph"],
    correct_index: 2,
    time_limit_seconds: 15,
    points: 10,
  },
];

const TOTAL_QUESTIONS = QUESTIONS.length;
const MAX_BONUS = 5;
const TIME_LIMIT = 15;

// ─── Rank Helpers ─────────────────────────────────────────────────────────────

function getRank(correct: number): { title: string; subtitle: string } {
  const pct = correct / TOTAL_QUESTIONS;
  if (pct <= 0.3) return { title: "Wrong wedding?", subtitle: "You might be in the wrong venue..." };
  if (pct <= 0.6) return { title: "You've met them... once", subtitle: "Acquaintance level unlocked." };
  if (pct <= 0.8) return { title: "Inner circle", subtitle: "You clearly pay attention." };
  return { title: "Basically family", subtitle: "Have you been living with them?" };
}

// ─── Bonus calculation ────────────────────────────────────────────────────────

function calcBonus(elapsed: number): number {
  const ratio = Math.max(0, 1 - elapsed / TIME_LIMIT);
  return Math.round(ratio * MAX_BONUS);
}

// ─── Timer Bar ────────────────────────────────────────────────────────────────

interface TimerBarProps {
  running: boolean;
  onExpire: () => void;
  resetKey: number;
  onTick: (remaining: number) => void;
}

function TimerBar({ running, onExpire, resetKey, onTick }: TimerBarProps) {
  const [remaining, setRemaining] = useState(TIME_LIMIT);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const expiredRef = useRef(false);

  useEffect(() => {
    setRemaining(TIME_LIMIT);
    expiredRef.current = false;
  }, [resetKey]);

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        const next = Math.max(0, prev - 0.1);
        onTick(next);
        if (next <= 0 && !expiredRef.current) {
          expiredRef.current = true;
          onExpire();
        }
        return next;
      });
    }, 100);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, onExpire, onTick]);

  const pct = (remaining / TIME_LIMIT) * 100;

  // Gold gradient when healthy, transitions to red as time runs low
  const isLow = pct <= 30;
  const isMid = pct > 30 && pct <= 60;

  const barStyle = isLow
    ? { background: "linear-gradient(90deg, #ef4444, #dc2626)", width: `${pct}%` }
    : isMid
    ? { background: "linear-gradient(90deg, #d4a574, #f59e0b)", width: `${pct}%` }
    : { background: "linear-gradient(90deg, #d4a574, #c49660)", width: `${pct}%` };

  return (
    <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
      <motion.div
        className="h-full rounded-full"
        style={barStyle}
        transition={{ duration: 0.1, ease: "linear" }}
      />
    </div>
  );
}

// ─── Floating Score Bubble ────────────────────────────────────────────────────

function FloatingScore({ pts, id }: { pts: number; id: string }) {
  return (
    <motion.div
      key={id}
      initial={{ opacity: 1, y: 0, scale: 1 }}
      animate={{ opacity: 0, y: -60, scale: 1.4 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className="absolute top-0 right-4 pointer-events-none z-20"
    >
      <span
        className="text-lg font-bold"
        style={{
          fontFamily: "var(--font-display)",
          background: "linear-gradient(135deg, #d4a574, #c49660)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        +{pts} pts
      </span>
    </motion.div>
  );
}

// ─── Option Card ──────────────────────────────────────────────────────────────

type CardState = "idle" | "correct" | "wrong" | "missed";

interface OptionCardProps {
  text: string;
  index: number;
  state: CardState;
  disabled: boolean;
  onClick: () => void;
}

function OptionCard({ text, index, state, disabled, onClick }: OptionCardProps) {
  const controls = useAnimation();

  useEffect(() => {
    if (state === "wrong") {
      controls.start({
        x: [0, -8, 8, -6, 6, -4, 4, 0],
        transition: { duration: 0.45, ease: "easeInOut" },
      });
    } else {
      controls.start({ x: 0 });
    }
  }, [state, controls]);

  const labels = ["A", "B", "C", "D"];

  // Base frosted glass card
  const baseStyle: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.06)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
  };

  const stateStyle: Record<CardState, React.CSSProperties> = {
    idle: baseStyle,
    correct: {
      ...baseStyle,
      background: "rgba(16, 185, 129, 0.20)",
      border: "1px solid rgba(52, 211, 153, 0.50)",
      boxShadow: "0 0 20px rgba(52, 211, 153, 0.20)",
    },
    wrong: {
      ...baseStyle,
      background: "rgba(239, 68, 68, 0.20)",
      border: "1px solid rgba(248, 113, 113, 0.50)",
    },
    missed: {
      ...baseStyle,
      background: "rgba(16, 185, 129, 0.08)",
      border: "1px solid rgba(52, 211, 153, 0.30)",
    },
  };

  const labelStyle: Record<CardState, React.CSSProperties> = {
    idle: {
      border: "1px solid rgba(212, 165, 116, 0.40)",
      color: "#d4a574",
      background: "rgba(212, 165, 116, 0.10)",
    },
    correct: {
      border: "1px solid rgba(52, 211, 153, 0.60)",
      color: "#34d399",
      background: "rgba(16, 185, 129, 0.15)",
    },
    wrong: {
      border: "1px solid rgba(248, 113, 113, 0.60)",
      color: "#f87171",
      background: "rgba(239, 68, 68, 0.15)",
    },
    missed: {
      border: "1px solid rgba(52, 211, 153, 0.40)",
      color: "#6ee7b7",
      background: "rgba(16, 185, 129, 0.10)",
    },
  };

  return (
    <motion.div animate={controls}>
      <button
        onClick={onClick}
        disabled={disabled}
        className="w-full text-left px-4 py-3.5 rounded-2xl font-medium relative overflow-hidden cursor-pointer select-none group"
        style={stateStyle[state]}
        onMouseEnter={(e) => {
          if (state === "idle") {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.20)";
          }
        }}
        onMouseLeave={(e) => {
          if (state === "idle") {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.10)";
          }
        }}
      >
        {/* Correct flash overlay */}
        {state === "correct" && (
          <motion.div
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ background: "rgba(52, 211, 153, 0.25)" }}
          />
        )}
        <div className="flex items-center gap-3">
          <span
            className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
            style={labelStyle[state]}
          >
            {labels[index]}
          </span>
          <span className="leading-snug" style={{ color: "rgba(255,255,255,0.88)" }}>
            {text}
          </span>
        </div>
      </button>
    </motion.div>
  );
}

// ─── Results Screen ───────────────────────────────────────────────────────────

interface ResultsScreenProps {
  score: number;
  correct: number;
  onPlayAgain: () => void;
}

function ResultsScreen({ score, correct, onPlayAgain }: ResultsScreenProps) {
  const { title, subtitle } = getRank(correct);
  const pct = Math.round((correct / TOTAL_QUESTIONS) * 100);

  const rankPct = correct / TOTAL_QUESTIONS;

  const rankBadgeStyle: React.CSSProperties =
    rankPct >= 0.8
      ? {
          background: "rgba(212, 165, 116, 0.15)",
          border: "1px solid rgba(212, 165, 116, 0.40)",
        }
      : rankPct >= 0.6
      ? {
          background: "rgba(212, 165, 116, 0.10)",
          border: "1px solid rgba(212, 165, 116, 0.25)",
        }
      : rankPct >= 0.3
      ? {
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.12)",
        }
      : {
          background: "rgba(239,68,68,0.08)",
          border: "1px solid rgba(248,113,113,0.25)",
        };

  const rankTitleStyle: React.CSSProperties =
    rankPct >= 0.6
      ? {
          fontFamily: "var(--font-display)",
          background: "linear-gradient(135deg, #d4a574, #c49660)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontSize: "1.25rem",
          fontWeight: 700,
        }
      : rankPct >= 0.3
      ? {
          fontFamily: "var(--font-display)",
          color: "rgba(240,230,211,0.80)",
          fontSize: "1.25rem",
          fontWeight: 700,
        }
      : {
          fontFamily: "var(--font-display)",
          color: "#f87171",
          fontSize: "1.25rem",
          fontWeight: 700,
        };

  // Glass card style for stat boxes
  const glassCard: React.CSSProperties = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.10)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderRadius: "1rem",
    padding: "1rem",
    textAlign: "center",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="text-center mt-4"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderRadius: "1.5rem",
        padding: "2rem 1.5rem",
      }}
    >
      {/* Trophy emoji */}
      <motion.div
        initial={{ scale: 0, rotate: -15 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.15 }}
        className="text-6xl mb-5"
      >
        {correct / TOTAL_QUESTIONS >= 0.8
          ? "🏆"
          : correct / TOTAL_QUESTIONS >= 0.6
          ? "🌹"
          : correct / TOTAL_QUESTIONS >= 0.3
          ? "👀"
          : "😅"}
      </motion.div>

      {/* Score — gold gradient */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mb-5"
      >
        <p
          className="text-6xl font-bold"
          style={{
            fontFamily: "var(--font-display)",
            background: "linear-gradient(135deg, #d4a574 0%, #e8c898 50%, #c49660 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {score}
        </p>
        <p className="text-sm mt-1" style={{ color: "rgba(138, 134, 149, 1)" }}>
          points
        </p>
      </motion.div>

      {/* Stat row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32 }}
        className="grid grid-cols-2 gap-3 mb-5"
      >
        <div style={glassCard}>
          <p className="text-2xl font-bold" style={{ color: "#f0e6d3" }}>
            {correct}/{TOTAL_QUESTIONS}
          </p>
          <p className="text-xs mt-1" style={{ color: "rgba(138,134,149,1)" }}>
            correct
          </p>
        </div>
        <div style={glassCard}>
          <p className="text-2xl font-bold" style={{ color: "#f0e6d3" }}>
            {pct}%
          </p>
          <p className="text-xs mt-1" style={{ color: "rgba(138,134,149,1)" }}>
            accuracy
          </p>
        </div>
      </motion.div>

      {/* Progress bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
        style={{ originX: 0 }}
        className="w-full h-2 rounded-full overflow-hidden mb-5"
        aria-hidden="true"
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            background: "rgba(255,255,255,0.08)",
            position: "relative",
          }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${pct}%`,
              background: "linear-gradient(90deg, #d4a574, #c49660)",
            }}
          />
        </div>
      </motion.div>

      {/* Rank badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl px-4 py-4 mb-6"
        style={rankBadgeStyle}
      >
        <p style={rankTitleStyle}>{title}</p>
        <p className="text-sm mt-1" style={{ color: "rgba(138,134,149,1)" }}>
          {subtitle}
        </p>
      </motion.div>

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65 }}
        onClick={onPlayAgain}
        className="w-full py-3.5 rounded-full font-medium text-sm transition-all duration-200 active:scale-95"
        style={{
          background: "linear-gradient(135deg, #d4a574, #c49660)",
          color: "#0a0a1a",
          fontWeight: 600,
          letterSpacing: "0.02em",
        }}
      >
        Play Again
      </motion.button>
    </motion.div>
  );
}

// ─── Main Game ────────────────────────────────────────────────────────────────

type Phase = "question" | "result" | "finished";

export default function TriviaPage() {
  useGuest();

  const [questionIndex, setQuestionIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("question");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timerRunning, setTimerRunning] = useState(true);
  const [timerResetKey, setTimerResetKey] = useState(0);
  const [elapsedRef] = useState({ value: 0 });
  const [floatKey, setFloatKey] = useState(0);
  const [floatPts, setFloatPts] = useState(0);
  const [showFloat, setShowFloat] = useState(false);

  const resultTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const question = QUESTIONS[questionIndex];

  const handleTick = useCallback(
    (remaining: number) => {
      elapsedRef.value = TIME_LIMIT - remaining;
    },
    [elapsedRef]
  );

  const revealResult = useCallback(
    (chosenIndex: number | null) => {
      setTimerRunning(false);
      setPhase("result");

      const isCorrect = chosenIndex === question.correct_index;
      if (isCorrect) {
        const bonus = calcBonus(elapsedRef.value);
        const pts = question.points + bonus;
        setScore((s) => s + pts);
        setCorrectCount((c) => c + 1);
        setFloatPts(pts);
        setFloatKey((k) => k + 1);
        setShowFloat(true);
        setTimeout(() => setShowFloat(false), 1000);
      }

      resultTimerRef.current = setTimeout(() => {
        if (questionIndex + 1 >= TOTAL_QUESTIONS) {
          setPhase("finished");
        } else {
          setQuestionIndex((i) => i + 1);
          setSelectedIndex(null);
          setPhase("question");
          setTimerRunning(true);
          setTimerResetKey((k) => k + 1);
          elapsedRef.value = 0;
        }
      }, 2000);
    },
    [question.correct_index, question.points, questionIndex, elapsedRef]
  );

  const handleSelect = useCallback(
    (index: number) => {
      if (phase !== "question") return;
      setSelectedIndex(index);
      revealResult(index);
    },
    [phase, revealResult]
  );

  const handleExpire = useCallback(() => {
    if (phase !== "question") return;
    revealResult(null);
  }, [phase, revealResult]);

  const handlePlayAgain = () => {
    if (resultTimerRef.current) clearTimeout(resultTimerRef.current);
    setQuestionIndex(0);
    setSelectedIndex(null);
    setScore(0);
    setCorrectCount(0);
    setPhase("question");
    setTimerRunning(true);
    setTimerResetKey((k) => k + 1);
    elapsedRef.value = 0;
  };

  useEffect(() => {
    return () => {
      if (resultTimerRef.current) clearTimeout(resultTimerRef.current);
    };
  }, []);

  const showMissedState = (index: number): CardState => {
    if (phase === "question") return "idle";
    if (index === question.correct_index) {
      if (selectedIndex === null) return "missed";
      return "correct";
    }
    if (index === selectedIndex) return "wrong";
    return "idle";
  };

  return (
    <GameLayout
      title="How Well Do You Know Them?"
      subtitle="12 questions · 15 seconds each"
      emoji="🧠"
    >
      {/*
        Full-bleed dark overlay — sits behind all game content.
        A negative-margin trick pulls it outside the GameLayout padding
        while keeping the layout intact.
      */}
      <div
        className="relative -mx-4 px-4 pb-10 pt-2 min-h-screen"
        style={{ background: "#0a0a1a" }}
      >
        <AnimatePresence mode="wait">
          {phase === "finished" ? (
            <ResultsScreen
              key="results"
              score={score}
              correct={correctCount}
              onPlayAgain={handlePlayAgain}
            />
          ) : (
            <motion.div
              key={questionIndex}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="relative"
            >
              {/* Floating score */}
              <AnimatePresence>
                {showFloat && (
                  <FloatingScore pts={floatPts} id={`float-${floatKey}`} />
                )}
              </AnimatePresence>

              {/* Progress + Timer */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium" style={{ color: "#8a8695" }}>
                    Question {questionIndex + 1} of {TOTAL_QUESTIONS}
                  </span>
                  <span className="text-xs font-medium" style={{ color: "#8a8695" }}>
                    {score} pts
                  </span>
                </div>

                {/* Question progress dots */}
                <div className="flex gap-1 mb-3">
                  {QUESTIONS.map((_, i) => (
                    <div
                      key={i}
                      className="h-1 flex-1 rounded-full transition-all duration-300"
                      style={{
                        background:
                          i < questionIndex
                            ? "linear-gradient(90deg, #d4a574, #c49660)"
                            : i === questionIndex
                            ? "rgba(212,165,116,0.45)"
                            : "rgba(255,255,255,0.08)",
                      }}
                    />
                  ))}
                </div>

                {/* Timer bar */}
                <TimerBar
                  running={timerRunning}
                  onExpire={handleExpire}
                  resetKey={timerResetKey}
                  onTick={handleTick}
                />
              </div>

              {/* Question card — frosted glass */}
              <div
                className="rounded-3xl px-6 py-5 mb-4"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                }}
              >
                <p
                  className="text-lg font-semibold leading-snug"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "#f0e6d3",
                  }}
                >
                  {question.question}
                </p>
              </div>

              {/* Options */}
              <div className="flex flex-col gap-3">
                {question.options.map((opt, i) => (
                  <OptionCard
                    key={i}
                    text={opt}
                    index={i}
                    state={showMissedState(i)}
                    disabled={phase !== "question"}
                    onClick={() => handleSelect(i)}
                  />
                ))}
              </div>

              {/* Result feedback banner */}
              <AnimatePresence>
                {phase === "result" && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.25 }}
                    className="mt-4 rounded-2xl px-4 py-3 text-center font-semibold text-sm"
                    style={
                      selectedIndex === question.correct_index
                        ? {
                            background: "rgba(16,185,129,0.12)",
                            border: "1px solid rgba(52,211,153,0.30)",
                            color: "#6ee7b7",
                          }
                        : {
                            background: "rgba(239,68,68,0.10)",
                            border: "1px solid rgba(248,113,113,0.25)",
                            color: "#fca5a5",
                          }
                    }
                  >
                    {selectedIndex === null
                      ? "Time's up! Moving on..."
                      : selectedIndex === question.correct_index
                      ? `Correct! +${question.points + calcBonus(elapsedRef.value)} pts`
                      : `Not quite — the answer was "${question.options[question.correct_index]}"`}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GameLayout>
  );
}
