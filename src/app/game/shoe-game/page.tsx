"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoeGameQuestion } from "@/types";
import { useGuest } from "@/lib/guest-context";
import { COUPLE } from "@/lib/games";

// ─── Data ───────────────────────────────────────────────────────────────────

const QUESTIONS: ShoeGameQuestion[] = [
  { id: "q1",  question: "Who is the better cook?",               correct_answer: "saba",  status: "pending" },
  { id: "q2",  question: "Who said 'I love you' first?",          correct_answer: "nima",  status: "pending" },
  { id: "q3",  question: "Who takes longer to get ready?",        correct_answer: "saba",  status: "pending" },
  { id: "q4",  question: "Who is more stubborn?",                 correct_answer: "both",  status: "pending" },
  { id: "q5",  question: "Who controls the TV remote?",           correct_answer: "nima",  status: "pending" },
  { id: "q6",  question: "Who is funnier?",                       correct_answer: "nima",  status: "pending" },
  { id: "q7",  question: "Who is the better driver?",             correct_answer: "saba",  status: "pending" },
  { id: "q8",  question: "Who spends more money?",                correct_answer: "saba",  status: "pending" },
  { id: "q9",  question: "Who apologizes first after a fight?",   correct_answer: "nima",  status: "pending" },
  { id: "q10", question: "Who made the first move?",              correct_answer: "saba",  status: "pending" },
  { id: "q11", question: "Who cries more at movies?",             correct_answer: "nima",  status: "pending" },
  { id: "q12", question: "Who snores louder?",                    correct_answer: "nima",  status: "pending" },
  { id: "q13", question: "Who has the crazier family?",           correct_answer: "both",  status: "pending" },
  { id: "q14", question: "Who is always right?",                  correct_answer: "saba",  status: "pending" },
  { id: "q15", question: "Who loves the other more?",             correct_answer: "both",  status: "pending" },
];

const TOTAL = QUESTIONS.length;

// ─── Types ───────────────────────────────────────────────────────────────────

type Phase =
  | "intro"
  | "choosing"
  | "locked"
  | "revealing"
  | "result"
  | "countdown"
  | "final";

type Choice = "nima" | "saba" | null;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function funMessage(correct: number, total: number): string {
  const pct = correct / total;
  if (pct === 1)    return "Mind reader! You know them better than they know themselves.";
  if (pct >= 0.8)   return "Basically their personal matchmaker. Impressive.";
  if (pct >= 0.6)   return "Not bad — you clearly pay attention at dinner parties.";
  if (pct >= 0.4)   return "You tried. They appreciate the effort, really.";
  if (pct >= 0.2)   return "Bold strategy — predict the opposite of your gut next time.";
  return "Were you even at the right wedding?";
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function LiveBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-2 rounded-full px-3 py-1"
      style={{
        background: "rgba(239,68,68,0.12)",
        border: "1px solid rgba(239,68,68,0.35)",
        boxShadow: "0 0 12px rgba(239,68,68,0.25)",
      }}
    >
      <motion.span
        className="w-2 h-2 rounded-full block"
        style={{ background: "#ef4444", boxShadow: "0 0 6px 2px rgba(239,68,68,0.7)" }}
        animate={{ opacity: [1, 0.3, 1], scale: [1, 0.8, 1] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <span
        className="font-bold text-xs tracking-widest uppercase"
        style={{ color: "#ef4444" }}
      >
        LIVE
      </span>
    </motion.div>
  );
}

interface ChoiceButtonProps {
  person: "nima" | "saba";
  choice: Choice;
  locked: boolean;
  onChoose: (p: "nima" | "saba") => void;
}

function ChoiceButton({ person, choice, locked, onChoose }: ChoiceButtonProps) {
  const isNima = person === "nima";
  const isSelected = choice === person;
  const isOther = choice !== null && !isSelected;

  const emoji = isNima ? COUPLE.person1.emoji : COUPLE.person2.emoji;
  const name  = isNima ? COUPLE.person1.name  : COUPLE.person2.name;

  // Nima: deep navy to medium blue; Saba: deep rose to medium pink
  const gradientBase = isNima
    ? "linear-gradient(180deg, #1a1a3e 0%, #2a2a5e 100%)"
    : "linear-gradient(180deg, #3e1a2a 0%, #5e2a3e 100%)";

  const gradientSelected = isNima
    ? "linear-gradient(180deg, #0d0d2a 0%, #1e1e52 100%)"
    : "linear-gradient(180deg, #2e0f1e 0%, #4a1e30 100%)";

  const glowColor = isNima
    ? "rgba(80,100,220,0.45)"
    : "rgba(200,80,120,0.45)";

  const nameColor = isNima ? "#aab8ff" : "#ffaac0";

  return (
    <motion.button
      onClick={() => !locked && onChoose(person)}
      disabled={locked}
      className="relative flex flex-col items-center justify-center select-none overflow-hidden"
      style={{
        flex: 1,
        minHeight: 200,
        background: isSelected ? gradientSelected : gradientBase,
        borderRadius: 0,
        border: "none",
        outline: "none",
      }}
      animate={{
        scale: isSelected ? 1.03 : isOther ? 0.97 : 1,
        opacity: locked && !isSelected ? 0.3 : 1,
      }}
      whileTap={locked ? {} : { scale: 0.95 }}
      transition={{ type: "spring", stiffness: 480, damping: 26 }}
    >
      {/* Gold border when selected */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            key="gold-border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              border: "2.5px solid #d4a574",
              boxShadow: `inset 0 0 32px ${glowColor}, 0 0 20px ${glowColor}`,
              borderRadius: "inherit",
            }}
          />
        )}
      </AnimatePresence>

      {/* Shimmer overlay on selected */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            key="shimmer"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.08, 0.18, 0.08] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="absolute inset-0 bg-white pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Checkmark top-right */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            key="check"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 520, damping: 20 }}
            className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(212,165,116,0.2)",
              border: "2px solid #d4a574",
            }}
          >
            <span className="text-xs font-bold" style={{ color: "#d4a574" }}>✓</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.span
        className="leading-none"
        style={{ fontSize: "clamp(3rem, 10vw, 5rem)" }}
        animate={{ scale: isSelected ? 1.18 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        {emoji}
      </motion.span>

      <motion.span
        className="mt-4 font-bold tracking-wide"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.4rem, 5vw, 2rem)",
          color: nameColor,
        }}
        animate={{ scale: isSelected ? 1.08 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        {name}
      </motion.span>

      {isSelected && (
        <motion.span
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm font-medium tracking-wide"
          style={{ color: "rgba(212,165,116,0.8)" }}
        >
          My pick
        </motion.span>
      )}
    </motion.button>
  );
}

function AnticipateDots() {
  return (
    <div className="flex items-center gap-3 justify-center">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-3 h-3 rounded-full block"
          style={{ background: "#d4a574", boxShadow: "0 0 8px rgba(212,165,116,0.6)" }}
          animate={{ scale: [1, 1.7, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

interface ResultFlashProps {
  correct: boolean | "both";
  correctAnswer: "nima" | "saba" | "both";
  choice: Choice;
  onDone: () => void;
}

function ResultFlash({ correct, correctAnswer, choice, onDone }: ResultFlashProps) {
  const isBoth  = correctAnswer === "both";
  const isRight = correct === true || correct === "both";

  // gold for correct, deep red for wrong
  const bgFrom = isRight ? "#1a1200" : "#1a0000";
  const bgTo   = isRight ? "#0a0812" : "#0a0812";

  const overlayColor = isRight ? "rgba(212,165,116,0.15)" : "rgba(239,68,68,0.15)";

  const emoji = isBoth
    ? "🤵❤️👰"
    : correctAnswer === "nima"
    ? COUPLE.person1.emoji
    : COUPLE.person2.emoji;

  const label = isBoth
    ? `${COUPLE.person1.name} & ${COUPLE.person2.name}!`
    : `${correctAnswer === "nima" ? COUPLE.person1.name : COUPLE.person2.name} wins this one`;

  const resultText = isRight ? (isBoth ? "Nailed it!" : "Correct!") : "Nope!";
  const resultColor = isRight ? "#d4a574" : "#ef4444";

  useEffect(() => {
    const t = setTimeout(onDone, 2400);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: `linear-gradient(180deg, ${bgFrom} 0%, ${bgTo} 100%)` }}
    >
      {/* Full-screen tinted flash */}
      <motion.div
        initial={{ opacity: 0.85 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.45 }}
        className="absolute inset-0 pointer-events-none"
        style={{ background: overlayColor }}
      />

      {/* White strobe flash */}
      <motion.div
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="absolute inset-0 bg-white pointer-events-none"
      />

      <motion.div
        initial={{ scale: 0.3, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 16, delay: 0.08 }}
        className="text-center px-6"
      >
        <motion.p
          className="leading-none mb-8"
          style={{ fontSize: "clamp(5rem, 18vw, 7rem)" }}
          animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
          transition={{ duration: 0.65, delay: 0.18 }}
        >
          {emoji}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-bold mb-3"
          style={{ fontFamily: "var(--font-display)", color: resultColor }}
        >
          {resultText}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.44 }}
          className="text-lg"
          style={{ color: "rgba(245,240,235,0.75)" }}
        >
          {label}
        </motion.p>

        {!isRight && choice && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.58 }}
            className="text-base mt-2"
            style={{ color: "rgba(138,134,149,0.9)" }}
          >
            You picked {choice === "nima" ? COUPLE.person1.name : COUPLE.person2.name}
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
}

interface CountdownProps {
  onDone: () => void;
}

function Countdown({ onDone }: CountdownProps) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count === 0) {
      onDone();
      return;
    }
    const t = setTimeout(() => setCount((c) => c - 1), 900);
    return () => clearTimeout(t);
  }, [count, onDone]);

  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-6 py-16">
      <p className="text-sm font-medium tracking-widest uppercase" style={{ color: "rgba(138,134,149,0.8)" }}>
        Next question in...
      </p>
      <AnimatePresence mode="wait">
        <motion.span
          key={count}
          initial={{ scale: 2.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          transition={{ type: "spring", stiffness: 360, damping: 18 }}
          className="font-bold leading-none"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(6rem, 25vw, 9rem)",
            color: "#d4a574",
            textShadow: "0 0 40px rgba(212,165,116,0.5), 0 0 80px rgba(212,165,116,0.2)",
          }}
        >
          {count === 0 ? "Go!" : count}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

interface ScoreBarProps {
  correct: number;
  total: number;
  currentIndex: number;
}

function ScoreBar({ correct, total, currentIndex }: ScoreBarProps) {
  const pct = currentIndex === 0 ? 0 : (correct / currentIndex) * 100;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 safe-area-bottom"
      style={{
        background: "rgba(10,10,26,0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(212,165,116,0.15)",
      }}
    >
      <div className="max-w-lg mx-auto px-4 py-3">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-medium tracking-wide" style={{ color: "rgba(138,134,149,0.9)" }}>
            Question {Math.min(currentIndex + 1, total)} of {total}
          </span>
          <span className="font-bold" style={{ color: "#d4a574" }}>
            {correct}
            <span className="font-normal ml-1" style={{ color: "rgba(138,134,149,0.9)" }}>correct</span>
          </span>
        </div>
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.07)" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, #c08040 0%, #d4a574 50%, #e8c99a 100%)",
              boxShadow: "0 0 8px rgba(212,165,116,0.6)",
            }}
            animate={{ width: `${pct}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ShoeGamePage() {
  const { guest } = useGuest();

  const [phase, setPhase] = useState<Phase>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [choice, setChoice] = useState<Choice>(null);
  const [score, setScore] = useState(0);
  const [showFlash, setShowFlash] = useState(false);
  const [flashResult, setFlashResult] = useState<boolean | "both">(false);

  const currentQ = QUESTIONS[questionIndex];

  // ── handlers ──

  const handleChoose = useCallback((p: "nima" | "saba") => {
    if (phase !== "choosing") return;
    setChoice(p);
    setPhase("locked");
  }, [phase]);

  const handleReveal = useCallback(() => {
    if (!currentQ.correct_answer) return;
    const answer = currentQ.correct_answer;

    let result: boolean | "both";
    if (answer === "both") {
      result = "both";
      if (choice !== null) {
        setScore((s) => s + 1);
      }
    } else if (choice === answer) {
      result = true;
      setScore((s) => s + 1);
    } else {
      result = false;
    }

    setFlashResult(result);
    setPhase("revealing");
    setShowFlash(true);
  }, [currentQ, choice]);

  const handleFlashDone = useCallback(() => {
    setShowFlash(false);
    setPhase("result");
  }, []);

  const handleNext = useCallback(() => {
    const nextIndex = questionIndex + 1;
    if (nextIndex >= TOTAL) {
      setPhase("final");
    } else {
      setPhase("countdown");
    }
  }, [questionIndex]);

  const handleCountdownDone = useCallback(() => {
    setQuestionIndex((i) => i + 1);
    setChoice(null);
    setPhase("choosing");
  }, []);

  const handleStart = useCallback(() => {
    setPhase("choosing");
  }, []);

  // ── Render ──

  return (
    <>
      {/* Full-screen result flash — outside layout */}
      <AnimatePresence>
        {showFlash && currentQ.correct_answer && (
          <ResultFlash
            key={`flash-${questionIndex}`}
            correct={flashResult}
            correctAnswer={currentQ.correct_answer}
            choice={choice}
            onDone={handleFlashDone}
          />
        )}
      </AnimatePresence>

      {/* Final screen */}
      <AnimatePresence>
        {phase === "final" && (
          <FinalScreen score={score} total={TOTAL} guestName={guest?.name} />
        )}
      </AnimatePresence>

      {phase !== "final" && (
        <div
          className="min-h-screen flex flex-col"
          style={{ background: "#0a0a1a" }}
        >
          {/* ── Header ── */}
          <div
            className="sticky top-0 z-30"
            style={{
              background: "rgba(10,10,26,0.85)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
              <a
                href="/"
                className="text-sm font-medium transition-colors"
                style={{ color: "rgba(212,165,116,0.8)" }}
              >
                ← Back
              </a>
              <LiveBadge />
              <div className="w-14" />
            </div>
          </div>

          {/* ── Intro ── */}
          {phase === "intro" && (
            <IntroScreen onStart={handleStart} guestName={guest?.name} />
          )}

          {/* ── Choosing / Locked / Result ── */}
          {(phase === "choosing" || phase === "locked" || phase === "revealing" || phase === "result") && (
            <div className="flex flex-col flex-1" style={{ paddingBottom: 80 }}>
              {/* Question */}
              <div className="max-w-lg mx-auto w-full px-5 pt-7 pb-5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`q-${questionIndex}`}
                    initial={{ opacity: 0, y: -18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 18 }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    className="text-center"
                  >
                    <p
                      className="text-xs font-medium tracking-widest uppercase mb-3"
                      style={{ color: "rgba(138,134,149,0.8)" }}
                    >
                      Question {questionIndex + 1} of {TOTAL}
                    </p>
                    <h2
                      className="font-bold leading-tight px-2"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(1.5rem, 5.5vw, 2.25rem)",
                        color: "#f0e6d3",
                      }}
                    >
                      {currentQ.question}
                    </h2>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Giant choice buttons */}
              {(phase === "choosing" || phase === "locked") && (
                <div
                  className="flex mx-4 overflow-hidden shadow-2xl"
                  style={{
                    minHeight: 200,
                    flex: 1,
                    borderRadius: 24,
                    gap: 3,
                    maxWidth: 520,
                    alignSelf: "center",
                    width: "calc(100% - 2rem)",
                  }}
                >
                  <ChoiceButton
                    person="nima"
                    choice={choice}
                    locked={phase === "locked"}
                    onChoose={handleChoose}
                  />
                  <ChoiceButton
                    person="saba"
                    choice={choice}
                    locked={phase === "locked"}
                    onChoose={handleChoose}
                  />
                </div>
              )}

              {/* Locked state */}
              {phase === "locked" && (
                <div className="max-w-lg mx-auto w-full px-4 pt-7 flex flex-col items-center gap-5">
                  <motion.p
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="font-semibold text-lg"
                    style={{ color: "#f0e6d3" }}
                  >
                    Locked in!
                  </motion.p>
                  <AnticipateDots />
                  <motion.button
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.28 }}
                    onClick={handleReveal}
                    className="btn-primary text-base px-10 py-3.5"
                    whileTap={{ scale: 0.96 }}
                  >
                    Tap to reveal
                  </motion.button>
                </div>
              )}

              {/* Result state */}
              {phase === "result" && (
                <ResultSummary
                  key={`result-${questionIndex}`}
                  correct={flashResult}
                  correctAnswer={currentQ.correct_answer!}
                  choice={choice}
                  score={score}
                  questionIndex={questionIndex}
                  total={TOTAL}
                  onNext={handleNext}
                />
              )}
            </div>
          )}

          {/* Countdown */}
          {phase === "countdown" && (
            <div className="flex-1 flex flex-col">
              <Countdown onDone={handleCountdownDone} />
            </div>
          )}

          {/* Score bar */}
          {phase !== "intro" && phase !== "countdown" && (
            <ScoreBar
              correct={score}
              total={TOTAL}
              currentIndex={questionIndex}
            />
          )}
        </div>
      )}
    </>
  );
}

// ─── Intro Screen ─────────────────────────────────────────────────────────────

interface IntroScreenProps {
  onStart: () => void;
  guestName?: string;
}

function IntroScreen({ onStart, guestName }: IntroScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 240, damping: 22 }}
      className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-7 py-12"
    >
      <motion.div
        animate={{ rotate: [-6, 6, -6] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ fontSize: "4.5rem" }}
      >
        👠
      </motion.div>

      <div>
        <h1
          className="font-bold mb-2"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.75rem, 6vw, 2.5rem)",
            background: "linear-gradient(135deg, #e8c99a 0%, #d4a574 40%, #f0dfc0 80%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Shoe Game LIVE
        </h1>
        <p className="text-base" style={{ color: "rgba(138,134,149,0.9)" }}>
          {guestName ? `Hey ${guestName}! ` : ""}
          Nima &amp; Saba are playing on stage. Predict each answer before they reveal it!
        </p>
      </div>

      <div
        className="w-full max-w-sm text-left space-y-2 p-5 rounded-2xl"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <p className="font-semibold text-sm mb-1" style={{ color: "#f0e6d3" }}>How it works:</p>
        <ul className="text-sm space-y-1.5" style={{ color: "rgba(138,134,149,0.9)" }}>
          <li>→ A question appears on screen</li>
          <li>→ Tap Nima or Saba as your prediction</li>
          <li>→ Hit <strong style={{ color: "#f0e6d3" }}>"Tap to reveal"</strong> to see who wins</li>
          <li>→ Score points for every correct guess</li>
        </ul>
      </div>

      <div className="flex items-center gap-8 text-center">
        <div>
          <div style={{ fontSize: "2.5rem" }} className="mb-1">{COUPLE.person1.emoji}</div>
          <div className="text-sm font-semibold" style={{ color: "#aab8ff" }}>{COUPLE.person1.name}</div>
          <div className="text-xs mt-0.5" style={{ color: "rgba(138,134,149,0.7)" }}>Blue</div>
        </div>
        <div
          className="text-xl font-bold"
          style={{ color: "rgba(212,165,116,0.7)" }}
        >
          vs
        </div>
        <div>
          <div style={{ fontSize: "2.5rem" }} className="mb-1">{COUPLE.person2.emoji}</div>
          <div className="text-sm font-semibold" style={{ color: "#ffaac0" }}>{COUPLE.person2.name}</div>
          <div className="text-xs mt-0.5" style={{ color: "rgba(138,134,149,0.7)" }}>Rose</div>
        </div>
      </div>

      <motion.button
        onClick={onStart}
        className="btn-primary text-lg px-10 py-4"
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.03 }}
      >
        Let&apos;s play!
      </motion.button>

      <p className="text-xs" style={{ color: "rgba(138,134,149,0.5)" }}>
        {TOTAL} questions total
      </p>
    </motion.div>
  );
}

// ─── Result Summary (after flash) ────────────────────────────────────────────

interface ResultSummaryProps {
  correct: boolean | "both";
  correctAnswer: "nima" | "saba" | "both";
  choice: Choice;
  score: number;
  questionIndex: number;
  total: number;
  onNext: () => void;
}

function ResultSummary({
  correct,
  correctAnswer,
  choice,
  score,
  questionIndex,
  total,
  onNext,
}: ResultSummaryProps) {
  const isRight = correct === true || correct === "both";
  const isBoth  = correctAnswer === "both";
  const isLast  = questionIndex === total - 1;

  const answerLabel =
    isBoth
      ? `${COUPLE.person1.name} & ${COUPLE.person2.name}`
      : correctAnswer === "nima"
      ? COUPLE.person1.name
      : COUPLE.person2.name;

  const cardBorderColor = isRight
    ? "rgba(212,165,116,0.35)"
    : "rgba(239,68,68,0.3)";

  const cardBg = isRight
    ? "rgba(212,165,116,0.07)"
    : "rgba(239,68,68,0.07)";

  const resultColor = isRight ? "#d4a574" : "#ef4444";

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
      className="max-w-lg mx-auto w-full px-4 pt-6 flex flex-col items-center gap-5"
    >
      <div
        className="w-full text-center p-5 rounded-2xl"
        style={{
          background: cardBg,
          border: `2px solid ${cardBorderColor}`,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <p
          className="text-2xl font-bold mb-1.5"
          style={{ fontFamily: "var(--font-display)", color: resultColor }}
        >
          {isRight ? (isBoth ? "Bonus point!" : "You got it!") : "Not quite!"}
        </p>

        <p className="text-sm mb-3" style={{ color: "rgba(138,134,149,0.9)" }}>
          The answer was{" "}
          <span className="font-semibold" style={{ color: "#f0e6d3" }}>{answerLabel}</span>
          {isBoth && " — everyone gets a point for this one"}
        </p>

        {choice && !isBoth && (
          <p className="text-xs" style={{ color: "rgba(138,134,149,0.8)" }}>
            You picked:{" "}
            <span className="font-medium" style={{ color: "#f0e6d3" }}>
              {choice === "nima" ? COUPLE.person1.name : COUPLE.person2.name}
            </span>
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 text-sm" style={{ color: "rgba(138,134,149,0.8)" }}>
        <span>Running score:</span>
        <span
          className="font-bold text-xl"
          style={{ color: "#d4a574", textShadow: "0 0 12px rgba(212,165,116,0.4)" }}
        >
          {score}
        </span>
        <span>/ {questionIndex + 1}</span>
      </div>

      <motion.button
        onClick={onNext}
        className="btn-primary text-base px-10 py-3.5"
        whileTap={{ scale: 0.96 }}
        whileHover={{ scale: 1.02 }}
      >
        {isLast ? "See my score" : "Next question →"}
      </motion.button>
    </motion.div>
  );
}

// ─── Final Screen ─────────────────────────────────────────────────────────────

interface FinalScreenProps {
  score: number;
  total: number;
  guestName?: string;
}

function FinalScreen({ score, total, guestName }: FinalScreenProps) {
  const pct   = score / total;
  const stars = Math.round(pct * 5);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-6"
      style={{ background: "#0a0a1a" }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 16, delay: 0.1 }}
        style={{ fontSize: "4.5rem" }}
      >
        🎊
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1
          className="font-bold mb-2"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.75rem, 6vw, 2.5rem)",
            background: "linear-gradient(135deg, #e8c99a 0%, #d4a574 40%, #f0dfc0 80%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {guestName ? `Nice work, ${guestName}!` : "Game over!"}
        </h1>
        <p style={{ color: "rgba(138,134,149,0.9)" }}>
          Here&apos;s how well you know the couple
        </p>
      </motion.div>

      {/* Score ring */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.3 }}
        className="relative w-44 h-44"
      >
        <ScoreRing score={score} total={total} />
      </motion.div>

      {/* Stars */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex gap-2"
      >
        {Array.from({ length: 5 }, (_, i) => (
          <motion.span
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.55 + i * 0.08, type: "spring", stiffness: 400 }}
            className="text-2xl"
            style={{ opacity: i < stars ? 1 : 0.18 }}
          >
            ⭐
          </motion.span>
        ))}
      </motion.div>

      {/* Fun message — glass card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="max-w-sm p-5 rounded-2xl"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <p className="text-base leading-relaxed" style={{ color: "#f0e6d3" }}>
          {funMessage(score, total)}
        </p>
      </motion.div>

      {/* Stats — glass cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.85 }}
        className="flex gap-4"
      >
        {[
          { value: score,         label: "Correct",  color: "#d4a574" },
          { value: total - score, label: "Missed",   color: "rgba(239,68,68,0.9)" },
          { value: score * 10,    label: "Points",   color: "#e8c99a" },
        ].map(({ value, label, color }) => (
          <div
            key={label}
            className="text-center px-4 py-3 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
          >
            <p
              className="text-3xl font-bold"
              style={{
                fontFamily: "var(--font-display)",
                color,
                textShadow: `0 0 16px ${color}55`,
              }}
            >
              {value}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "rgba(138,134,149,0.8)" }}>
              {label}
            </p>
          </div>
        ))}
      </motion.div>

      <motion.a
        href="/"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="btn-primary mt-2"
      >
        Back to games
      </motion.a>
    </motion.div>
  );
}

// ─── Score Ring (SVG) ─────────────────────────────────────────────────────────

interface ScoreRingProps {
  score: number;
  total: number;
}

function ScoreRing({ score, total }: ScoreRingProps) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const pct = score / total;

  return (
    <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
      {/* Track */}
      <circle
        cx={80}
        cy={80}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.07)"
        strokeWidth={10}
      />
      {/* Progress — gold gradient via filter trick */}
      <motion.circle
        cx={80}
        cy={80}
        r={radius}
        fill="none"
        stroke="#d4a574"
        strokeWidth={10}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: circumference * (1 - pct) }}
        transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
        style={{ filter: "drop-shadow(0 0 6px rgba(212,165,116,0.7))" }}
      />
      {/* Center text */}
      <text
        x={80}
        y={80}
        dominantBaseline="middle"
        textAnchor="middle"
        transform="rotate(90, 80, 80)"
        style={{ fontFamily: "var(--font-display)" }}
      >
        <tspan
          x={80}
          dy="-10"
          style={{ fontSize: 28, fontWeight: 700, fill: "#d4a574" }}
        >
          {score}/{total}
        </tspan>
        <tspan
          x={80}
          dy="22"
          style={{ fontSize: 11, fill: "rgba(138,134,149,0.9)" }}
        >
          correct
        </tspan>
      </text>
    </svg>
  );
}
