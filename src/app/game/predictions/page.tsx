"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { GameLayout } from "@/components/game-layout";
import { useGuest } from "@/lib/guest-context";
import type { Prediction } from "@/types";

// ─── Data ────────────────────────────────────────────────────────────────────

interface PredictionCard extends Prediction {
  category: string;
  unit?: string;
}

const PREDICTIONS: PredictionCard[] = [
  {
    id: "p1",
    question: "Best man's speech length",
    type: "over_under",
    threshold: 5,
    unit: "min",
    category: "🎤 SPEECHES",
    resolved: false,
  },
  {
    id: "p2",
    question: "Will Nima cry during vows?",
    type: "yes_no",
    category: "😭 EMOTIONS",
    resolved: false,
  },
  {
    id: "p3",
    question: "Will Saba smash cake in Nima's face?",
    type: "yes_no",
    category: "🍰 FOOD & CAKE",
    resolved: false,
  },
  {
    id: "p4",
    question: "First dance song genre",
    type: "multiple_choice",
    options: ["Pop", "Persian", "R&B", "Surprise mashup"],
    category: "🎵 MUSIC",
    resolved: false,
  },
  {
    id: "p5",
    question: "Times 'forever' said in speeches",
    type: "over_under",
    threshold: 7,
    category: "🎤 SPEECHES",
    resolved: false,
  },
  {
    id: "p6",
    question: "First family member on the dance floor",
    type: "multiple_choice",
    options: ["Nima's mom", "Saba's dad", "A cousin", "The flower girl"],
    category: "💃 DANCE FLOOR",
    resolved: false,
  },
  {
    id: "p7",
    question: "Someone will spill a drink on the dance floor",
    type: "yes_no",
    category: "💃 DANCE FLOOR",
    resolved: false,
  },
  {
    id: "p8",
    question: "First dance duration",
    type: "over_under",
    threshold: 3,
    unit: "min",
    category: "🎵 MUSIC",
    resolved: false,
  },
  {
    id: "p9",
    question: "Saba's outfit changes tonight",
    type: "multiple_choice",
    options: ["Just 1", "2", "3", "4+"],
    category: "😭 EMOTIONS",
    resolved: false,
  },
  {
    id: "p10",
    question: "Last person standing on the dance floor",
    type: "multiple_choice",
    options: ["Nima", "Saba", "A groomsman", "That one aunt"],
    category: "💃 DANCE FLOOR",
    resolved: false,
  },
];

const STORAGE_KEY = "nima-saba-predictions";

// ─── Category config ──────────────────────────────────────────────────────────

const CATEGORY_STYLE: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  "🎤 SPEECHES": {
    bg: "rgba(167,139,250,0.15)",
    text: "#c4b5fd",
    border: "rgba(167,139,250,0.25)",
  },
  "💃 DANCE FLOOR": {
    bg: "rgba(244,114,182,0.15)",
    text: "#f9a8d4",
    border: "rgba(244,114,182,0.25)",
  },
  "🍰 FOOD & CAKE": {
    bg: "rgba(251,191,36,0.12)",
    text: "#fcd34d",
    border: "rgba(251,191,36,0.22)",
  },
  "😭 EMOTIONS": {
    bg: "rgba(96,165,250,0.13)",
    text: "#93c5fd",
    border: "rgba(96,165,250,0.22)",
  },
  "🎵 MUSIC": {
    bg: "rgba(52,211,153,0.12)",
    text: "#6ee7b7",
    border: "rgba(52,211,153,0.22)",
  },
};

function categoryStyle(label: string) {
  return (
    CATEGORY_STYLE[label] ?? {
      bg: "rgba(212,165,116,0.12)",
      text: "#d4a574",
      border: "rgba(212,165,116,0.22)",
    }
  );
}

// ─── Confetti ─────────────────────────────────────────────────────────────────

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
  size: number;
  shape: "square" | "circle" | "rect";
}

function Confetti() {
  const [pieces] = useState<ConfettiPiece[]>(() =>
    Array.from({ length: 70 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: [
        "#d4a574",
        "#e8c98a",
        "#f5e0b8",
        "#c9a84c",
        "#fbbf24",
        "#fde68a",
        "#fffbeb",
        "#d4a0a7",
        "#f0e6d3",
      ][Math.floor(Math.random() * 9)],
      delay: Math.random() * 1.0,
      duration: 2.0 + Math.random() * 1.8,
      size: 5 + Math.random() * 9,
      shape: (["square", "circle", "rect"] as const)[
        Math.floor(Math.random() * 3)
      ],
    }))
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className={p.shape === "circle" ? "absolute rounded-full" : "absolute rounded-sm"}
          style={{
            left: `${p.x}%`,
            top: "-20px",
            width: p.shape === "rect" ? p.size * 0.5 : p.size,
            height: p.shape === "rect" ? p.size * 1.8 : p.size,
            backgroundColor: p.color,
            opacity: 0.9,
          }}
          initial={{ y: -20, opacity: 0.9, rotate: 0 }}
          animate={{
            y: "115vh",
            opacity: [0.9, 0.9, 0.4, 0],
            rotate: Math.random() > 0.5 ? 540 : -540,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  );
}

// ─── Category pill ────────────────────────────────────────────────────────────

function CategoryTag({ label }: { label: string }) {
  const style = categoryStyle(label);
  return (
    <span
      className="inline-block text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full"
      style={{
        background: style.bg,
        color: style.text,
        border: `1px solid ${style.border}`,
        letterSpacing: "0.12em",
      }}
    >
      {label}
    </span>
  );
}

// ─── Gold gradient number ─────────────────────────────────────────────────────

const GOLD_GRADIENT =
  "linear-gradient(135deg, #f5c842 0%, #e8a020 40%, #f5c842 70%, #fde68a 100%)";

// ─── Over / Under card ────────────────────────────────────────────────────────

interface OverUnderCardProps {
  prediction: PredictionCard;
  selected: string | undefined;
  onSelect: (answer: string) => void;
}

function OverUnderCard({ prediction, selected, onSelect }: OverUnderCardProps) {
  return (
    <div className="flex flex-col items-center gap-7">
      <CategoryTag label={prediction.category} />

      <p
        className="text-center text-2xl font-bold leading-tight"
        style={{ fontFamily: "var(--font-display)", color: "#f0e6d3" }}
      >
        {prediction.question}
      </p>

      {/* Threshold display */}
      <div className="flex flex-col items-center gap-1">
        <span
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: "#8a8695", letterSpacing: "0.14em" }}
        >
          Threshold
        </span>
        <div className="flex items-end gap-2">
          <span
            className="text-8xl font-extrabold leading-none"
            style={{
              fontFamily: "var(--font-display)",
              background: GOLD_GRADIENT,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 2px 16px rgba(245,200,66,0.25))",
            }}
          >
            {prediction.threshold}
          </span>
          {prediction.unit && (
            <span
              className="text-2xl font-bold mb-2"
              style={{ color: "#8a8695" }}
            >
              {prediction.unit}
            </span>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-4 w-full">
        {(["UNDER", "OVER"] as const).map((choice) => {
          const isSelected = selected === choice;
          const isOver = choice === "OVER";
          return (
            <motion.button
              key={choice}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(choice)}
              className="relative py-5 rounded-2xl font-bold text-xl transition-all duration-200 backdrop-blur-sm"
              style={
                isSelected
                  ? {
                      background: isOver
                        ? "rgba(245,200,66,0.16)"
                        : "rgba(96,165,250,0.16)",
                      color: isOver ? "#fcd34d" : "#93c5fd",
                      border: isOver
                        ? "1.5px solid rgba(245,200,66,0.55)"
                        : "1.5px solid rgba(96,165,250,0.55)",
                      boxShadow: isOver
                        ? "0 0 24px rgba(245,200,66,0.18), inset 0 1px 0 rgba(255,255,255,0.06)"
                        : "0 0 24px rgba(96,165,250,0.18), inset 0 1px 0 rgba(255,255,255,0.06)",
                    }
                  : {
                      background: "rgba(255,255,255,0.05)",
                      color: isOver ? "#a1a1aa" : "#a1a1aa",
                      border: "1px solid rgba(255,255,255,0.08)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
                    }
              }
            >
              {choice === "UNDER" ? "↓ UNDER" : "↑ OVER"}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Yes / No card ────────────────────────────────────────────────────────────

interface YesNoCardProps {
  prediction: PredictionCard;
  selected: string | undefined;
  onSelect: (answer: string) => void;
}

function YesNoCard({ prediction, selected, onSelect }: YesNoCardProps) {
  return (
    <div className="flex flex-col items-center gap-7">
      <CategoryTag label={prediction.category} />

      <p
        className="text-center text-2xl font-bold leading-tight"
        style={{ fontFamily: "var(--font-display)", color: "#f0e6d3" }}
      >
        {prediction.question}
      </p>

      <div className="grid grid-cols-2 gap-4 w-full">
        {(["YES", "NO"] as const).map((choice) => {
          const isSelected = selected === choice;
          const isYes = choice === "YES";
          return (
            <motion.button
              key={choice}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(choice)}
              className="py-7 rounded-2xl font-bold text-2xl transition-all duration-200 backdrop-blur-sm"
              style={
                isSelected
                  ? {
                      background: isYes
                        ? "rgba(52,211,153,0.14)"
                        : "rgba(244,114,182,0.14)",
                      color: isYes ? "#6ee7b7" : "#f9a8d4",
                      border: isYes
                        ? "1.5px solid rgba(52,211,153,0.5)"
                        : "1.5px solid rgba(244,114,182,0.5)",
                      boxShadow: isYes
                        ? "0 0 24px rgba(52,211,153,0.16), inset 0 1px 0 rgba(255,255,255,0.06)"
                        : "0 0 24px rgba(244,114,182,0.16), inset 0 1px 0 rgba(255,255,255,0.06)",
                    }
                  : {
                      background: "rgba(255,255,255,0.05)",
                      color: "#a1a1aa",
                      border: "1px solid rgba(255,255,255,0.08)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
                    }
              }
            >
              {isYes ? "✓ YES" : "✗ NO"}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Multiple choice card ─────────────────────────────────────────────────────

interface MultipleChoiceCardProps {
  prediction: PredictionCard;
  selected: string | undefined;
  onSelect: (answer: string) => void;
}

const LETTER_COLORS = [
  { bg: "rgba(167,139,250,0.2)", text: "#c4b5fd", border: "rgba(167,139,250,0.35)" },
  { bg: "rgba(244,114,182,0.2)", text: "#f9a8d4", border: "rgba(244,114,182,0.35)" },
  { bg: "rgba(245,200,66,0.15)", text: "#fcd34d", border: "rgba(245,200,66,0.3)" },
  { bg: "rgba(52,211,153,0.15)", text: "#6ee7b7", border: "rgba(52,211,153,0.3)" },
];

function MultipleChoiceCard({
  prediction,
  selected,
  onSelect,
}: MultipleChoiceCardProps) {
  return (
    <div className="flex flex-col items-center gap-7">
      <CategoryTag label={prediction.category} />

      <p
        className="text-center text-2xl font-bold leading-tight"
        style={{ fontFamily: "var(--font-display)", color: "#f0e6d3" }}
      >
        {prediction.question}
      </p>

      <div className="flex flex-col gap-3 w-full">
        {(prediction.options ?? []).map((option, idx) => {
          const isSelected = selected === option;
          const lc = LETTER_COLORS[idx % LETTER_COLORS.length];
          return (
            <motion.button
              key={idx}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(option)}
              className="w-full py-4 px-5 rounded-2xl font-semibold text-lg text-left transition-all duration-200 flex items-center gap-3 backdrop-blur-sm"
              style={
                isSelected
                  ? {
                      background: lc.bg,
                      color: lc.text,
                      border: `1.5px solid ${lc.border}`,
                      boxShadow: `0 0 20px ${lc.bg}, inset 0 1px 0 rgba(255,255,255,0.06)`,
                    }
                  : {
                      background: "rgba(255,255,255,0.04)",
                      color: "#c4c0cc",
                      border: "1px solid rgba(255,255,255,0.07)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
                    }
              }
            >
              <span
                className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
                style={
                  isSelected
                    ? { background: lc.bg, color: lc.text, border: `1px solid ${lc.border}` }
                    : {
                        background: "rgba(255,255,255,0.06)",
                        color: "#8a8695",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }
                }
              >
                {String.fromCharCode(65 + idx)}
              </span>
              {option}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Progress dots ─────────────────────────────────────────────────────────────

function ProgressDots({
  total,
  current,
  answers,
}: {
  total: number;
  current: number;
  answers: Record<string, string>;
}) {
  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      {Array.from({ length: total }).map((_, i) => {
        const pred = PREDICTIONS[i];
        const answered = pred ? !!answers[pred.id] : false;
        const isCurrent = i === current;
        return (
          <motion.div
            key={i}
            animate={{ scale: isCurrent ? 1.4 : 1 }}
            className="rounded-full transition-all duration-200"
            style={{
              width: isCurrent ? 10 : 7,
              height: isCurrent ? 10 : 7,
              background: isCurrent
                ? "#f5c842"
                : answered
                ? "rgba(245,200,66,0.45)"
                : "rgba(255,255,255,0.12)",
              boxShadow: isCurrent
                ? "0 0 8px rgba(245,200,66,0.5)"
                : "none",
            }}
          />
        );
      })}
    </div>
  );
}

// ─── Review screen ─────────────────────────────────────────────────────────────

function AnswerPill({ value, category }: { value: string; category: string }) {
  const style = categoryStyle(category);
  return (
    <span
      className="text-sm font-bold px-3 py-1 rounded-full"
      style={{
        background: style.bg,
        color: style.text,
        border: `1px solid ${style.border}`,
      }}
    >
      {value}
    </span>
  );
}

function ReviewScreen({
  answers,
  onEdit,
}: {
  answers: Record<string, string>;
  onEdit: (idx: number) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {PREDICTIONS.map((pred, idx) => (
        <motion.div
          key={pred.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.04 }}
          className="flex items-start justify-between gap-3 rounded-2xl px-4 py-3.5 backdrop-blur-sm"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: categoryStyle(pred.category).text, letterSpacing: "0.1em" }}
            >
              {pred.category}
            </span>
            <p
              className="text-sm font-medium leading-snug"
              style={{ color: "#c4c0cc" }}
            >
              {pred.question}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <AnswerPill
              value={answers[pred.id] ?? "—"}
              category={pred.category}
            />
            <button
              onClick={() => onEdit(idx)}
              className="text-xs font-medium underline underline-offset-2"
              style={{ color: "#8a8695" }}
            >
              change
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Locked screen ─────────────────────────────────────────────────────────────

function LockedScreen({ guestName }: { guestName: string }) {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 4500);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {showConfetti && <Confetti />}
      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="flex flex-col items-center gap-6 py-8"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
          transition={{ duration: 0.65, delay: 0.3 }}
          className="text-7xl"
        >
          🎲
        </motion.div>

        <div className="text-center">
          <h2
            className="text-3xl font-bold"
            style={{ fontFamily: "var(--font-display)", color: "#f0e6d3" }}
          >
            Bets Locked In!
          </h2>
          <p className="mt-2 text-sm" style={{ color: "#8a8695" }}>
            Good luck,{" "}
            <span className="font-semibold" style={{ color: "#d4a574" }}>
              {guestName}
            </span>
            !
          </p>
          <p className="text-sm mt-1" style={{ color: "#8a8695" }}>
            We'll reveal the answers at the end of the night.
          </p>
        </div>

        {/* Count card */}
        <div
          className="w-full rounded-2xl p-5 text-center backdrop-blur-sm"
          style={{
            background: "rgba(245,200,66,0.07)",
            border: "1px solid rgba(245,200,66,0.22)",
            boxShadow: "0 0 40px rgba(245,200,66,0.06)",
          }}
        >
          <p
            className="text-5xl font-extrabold"
            style={{
              fontFamily: "var(--font-display)",
              background: GOLD_GRADIENT,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {PREDICTIONS.length}
          </p>
          <p className="text-sm mt-1" style={{ color: "#8a8695" }}>
            predictions placed
          </p>
        </div>
      </motion.div>
    </>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

type Phase = "playing" | "review" | "locked";

const DRAG_THRESHOLD = 60;

export default function PredictionsPage() {
  const { guest } = useGuest();
  const [phase, setPhase] = useState<Phase>("playing");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [direction, setDirection] = useState(0);

  // Load saved answers from localStorage
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const saved = JSON.parse(raw) as {
        answers: Record<string, string>;
        locked: boolean;
      };
      if (saved.answers) setAnswers(saved.answers);
      if (saved.locked) setPhase("locked");
    } catch {
      // ignore corrupt data
    }
  }, []);

  const navigate = useCallback(
    (delta: number) => {
      const next = currentIndex + delta;
      if (next < 0 || next >= PREDICTIONS.length) return;
      setDirection(delta);
      setCurrentIndex(next);
    },
    [currentIndex]
  );

  const handleAnswer = (answer: string) => {
    const pred = PREDICTIONS[currentIndex];
    const updated = { ...answers, [pred.id]: answer };
    setAnswers(updated);
    // Auto-advance after a short delay
    setTimeout(() => {
      if (currentIndex < PREDICTIONS.length - 1) {
        setDirection(1);
        setCurrentIndex((i) => i + 1);
      } else {
        // Last prediction — go to review
        setPhase("review");
      }
    }, 380);
  };

  const handleLockIn = () => {
    const payload = { answers, locked: true };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    setPhase("locked");
  };

  const handleEdit = (idx: number) => {
    setCurrentIndex(idx);
    setPhase("playing");
  };

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (Math.abs(info.offset.x) > DRAG_THRESHOLD) {
      navigate(info.offset.x < 0 ? 1 : -1);
    }
  };

  const pred = PREDICTIONS[currentIndex];
  const currentAnswer = answers[pred?.id ?? ""];
  const answeredCount = PREDICTIONS.filter((p) => answers[p.id]).length;
  const allAnswered = answeredCount === PREDICTIONS.length;

  const cardVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 280 : -280,
      opacity: 0,
      scale: 0.94,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -280 : 280,
      opacity: 0,
      scale: 0.94,
    }),
  };

  // ── Review phase ──────────────────────────────────────────────
  if (phase === "review") {
    return (
      <GameLayout
        title="Predict the Night"
        subtitle="Review your bets before locking in"
        emoji="🎲"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4"
        >
          <ReviewScreen answers={answers} onEdit={handleEdit} />

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleLockIn}
            disabled={!allAnswered}
            className="w-full py-4 rounded-2xl font-bold text-lg mt-2 transition-all duration-200"
            style={
              allAnswered
                ? {
                    background: GOLD_GRADIENT,
                    color: "#0a0a1a",
                    boxShadow: "0 8px 32px rgba(245,200,66,0.28)",
                  }
                : {
                    background: "rgba(255,255,255,0.06)",
                    color: "#8a8695",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }
            }
          >
            {allAnswered
              ? "Lock In My Bets 🔒"
              : `Answer All Predictions (${answeredCount}/${PREDICTIONS.length})`}
          </motion.button>

          {!allAnswered && (
            <button
              onClick={() => {
                const firstUnanswered = PREDICTIONS.findIndex(
                  (p) => !answers[p.id]
                );
                if (firstUnanswered >= 0) {
                  setCurrentIndex(firstUnanswered);
                  setPhase("playing");
                }
              }}
              className="text-center text-sm font-medium transition-opacity hover:opacity-70"
              style={{ color: "#d4a574" }}
            >
              Fill in missing predictions →
            </button>
          )}
        </motion.div>
      </GameLayout>
    );
  }

  // ── Locked phase ──────────────────────────────────────────────
  if (phase === "locked") {
    return (
      <GameLayout
        title="Predict the Night"
        subtitle="Your predictions are in!"
        emoji="🎲"
      >
        <LockedScreen guestName={guest?.name ?? "Friend"} />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6"
        >
          <button
            onClick={() => setPhase("review")}
            className="w-full py-3 rounded-2xl font-medium text-sm backdrop-blur-sm transition-opacity hover:opacity-80"
            style={{
              background: "rgba(255,255,255,0.05)",
              color: "#d4a574",
              border: "1.5px solid rgba(212,165,116,0.3)",
            }}
          >
            Review My Predictions
          </button>
        </motion.div>
      </GameLayout>
    );
  }

  // ── Playing phase ─────────────────────────────────────────────
  return (
    <GameLayout
      title="Predict the Night"
      subtitle="Make your bets for the reception"
      emoji="🎲"
    >
      <div className="flex flex-col gap-6">
        {/* Progress header */}
        <div className="flex items-center justify-between px-1">
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "#8a8695", letterSpacing: "0.12em" }}
          >
            {currentIndex + 1} / {PREDICTIONS.length}
          </span>
          <span className="text-xs font-medium" style={{ color: "#8a8695" }}>
            {answeredCount} answered
          </span>
        </div>

        {/* Card area */}
        <div className="relative overflow-hidden" style={{ minHeight: 390 }}>
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={pred.id}
              custom={direction}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 320, damping: 32 },
                opacity: { duration: 0.15 },
                scale: { duration: 0.15 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              onDragEnd={handleDragEnd}
              className="cursor-grab active:cursor-grabbing select-none rounded-3xl px-6 py-7 backdrop-blur-md"
              style={{
                background: "rgba(255,255,255,0.055)",
                border: "1px solid rgba(255,255,255,0.09)",
                boxShadow:
                  "0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.07)",
                touchAction: "pan-y",
              }}
            >
              {pred.type === "over_under" && (
                <OverUnderCard
                  prediction={pred}
                  selected={currentAnswer}
                  onSelect={handleAnswer}
                />
              )}
              {pred.type === "yes_no" && (
                <YesNoCard
                  prediction={pred}
                  selected={currentAnswer}
                  onSelect={handleAnswer}
                />
              )}
              {pred.type === "multiple_choice" && (
                <MultipleChoiceCard
                  prediction={pred}
                  selected={currentAnswer}
                  onSelect={handleAnswer}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => navigate(-1)}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full font-medium text-sm transition-all backdrop-blur-sm"
            style={
              currentIndex === 0
                ? {
                    background: "rgba(255,255,255,0.03)",
                    color: "#4a4754",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }
                : {
                    background: "rgba(212,165,116,0.1)",
                    color: "#d4a574",
                    border: "1px solid rgba(212,165,116,0.25)",
                  }
            }
          >
            ← Prev
          </motion.button>

          {currentIndex < PREDICTIONS.length - 1 ? (
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => navigate(1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full font-medium text-sm backdrop-blur-sm"
              style={{
                background: "rgba(212,165,116,0.1)",
                color: "#d4a574",
                border: "1px solid rgba(212,165,116,0.25)",
              }}
            >
              Next →
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setPhase("review")}
              className="flex items-center gap-1.5 px-5 py-2 rounded-full font-bold text-sm"
              style={{
                background: GOLD_GRADIENT,
                color: "#0a0a1a",
                boxShadow: "0 4px 20px rgba(245,200,66,0.28)",
              }}
            >
              Review →
            </motion.button>
          )}
        </div>

        {/* Progress dots */}
        <ProgressDots
          total={PREDICTIONS.length}
          current={currentIndex}
          answers={answers}
        />

        {/* Swipe hint — only on first card */}
        {currentIndex === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 1.4 }}
            className="text-center text-xs"
            style={{ color: "#8a8695" }}
          >
            Swipe to navigate
          </motion.p>
        )}
      </div>
    </GameLayout>
  );
}
