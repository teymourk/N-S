"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameLayout } from "@/components/game-layout";
import { SentencePrompt } from "@/types";
import { useGuest } from "@/lib/guest-context";
import { COUPLE } from "@/lib/games";

// ─── Prompts ────────────────────────────────────────────────────────────────

const PROMPTS: SentencePrompt[] = [
  {
    id: "1",
    said_by: "nima",
    starter_text: "The thing I love most about Saba is...",
    actual_answer: "her laugh — it's impossible not to smile",
  },
  {
    id: "2",
    said_by: "saba",
    starter_text: "If Nima could eat one food forever...",
    actual_answer: "his mom's ghormeh sabzi, no contest",
  },
  {
    id: "3",
    said_by: "nima",
    starter_text: "The most embarrassing thing Saba did is...",
    actual_answer:
      "waved at someone who was waving at the person behind her for 30 seconds",
  },
  {
    id: "4",
    said_by: "saba",
    starter_text: "Nima's secret talent is...",
    actual_answer: "falling asleep anywhere in under 2 minutes",
  },
  {
    id: "5",
    said_by: "nima",
    starter_text: "Our biggest fight was about...",
    actual_answer: "whether toilet paper goes over or under",
  },
  {
    id: "6",
    said_by: "saba",
    starter_text: "I knew Nima was the one when...",
    actual_answer: "he drove 2 hours in a snowstorm to bring me soup",
  },
  {
    id: "7",
    said_by: "nima",
    starter_text: "In 10 years I see us...",
    actual_answer:
      "somewhere warm with a dog, still arguing about the thermostat",
  },
  {
    id: "8",
    said_by: "saba",
    starter_text: "The one thing I'd change about Nima is...",
    actual_answer: "nothing. Okay fine, his snoring.",
  },
];

// ─── Types ───────────────────────────────────────────────────────────────────

type RoundState = "guessing" | "revealed";

interface RoundResult {
  prompt: SentencePrompt;
  guess: string;
  scored: boolean; // true = thumbs-up (20 pts)
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ProgressDots({
  total,
  current,
}: {
  total: number;
  current: number;
}) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          initial={false}
          animate={{
            scale: i === current ? 1.3 : 1,
            opacity: i < current ? 0.3 : 1,
          }}
          className="rounded-full"
          style={{
            width: i === current ? 10 : 7,
            height: i === current ? 10 : 7,
            background:
              i === current
                ? "linear-gradient(135deg, #d4a574, #e8c99a)"
                : i < current
                ? "rgba(212,165,116,0.3)"
                : "rgba(212,165,116,0.22)",
            boxShadow:
              i === current
                ? "0 0 8px rgba(212,165,116,0.6)"
                : "none",
          }}
        />
      ))}
    </div>
  );
}

function VideoPlaceholder({ prompt }: { prompt: SentencePrompt }) {
  const isNima = prompt.said_by === "nima";
  const person = isNima ? COUPLE.person1 : COUPLE.person2;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative w-full rounded-2xl overflow-hidden mb-5"
      style={{
        aspectRatio: "16/9",
        background: "#12101a",
        // Gradient border via padding + background trick
        padding: "1px",
      }}
    >
      {/* Gradient border layer */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(212,165,116,0.55) 0%, rgba(120,60,180,0.4) 50%, rgba(212,165,116,0.3) 100%)",
          borderRadius: "inherit",
          zIndex: 0,
        }}
      />

      {/* Inner card surface */}
      <div
        className="absolute inset-[1px] rounded-2xl overflow-hidden flex flex-col items-center justify-center gap-3"
        style={{ background: "#12101a", zIndex: 1 }}
      >
        {/* Subtle grain texture */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
            backgroundSize: "200px 200px",
          }}
        />

        {/* Ambient glow blob */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: "60%",
            height: "60%",
            top: "20%",
            left: "20%",
            background:
              "radial-gradient(ellipse at center, rgba(212,165,116,0.08) 0%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />

        {/* Person emoji with gold glow ring */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="relative flex items-center justify-center"
          style={{
            width: 76,
            height: 76,
            borderRadius: "50%",
            background: "rgba(212,165,116,0.08)",
            boxShadow:
              "0 0 0 8px rgba(212,165,116,0.06), 0 0 24px rgba(212,165,116,0.2)",
            animation: "glow-pulse 3s ease-in-out infinite",
          }}
        >
          <span style={{ fontSize: 38 }}>{person.emoji}</span>
        </motion.div>

        <div className="text-center relative z-10">
          <p
            className="font-semibold text-sm tracking-widest uppercase"
            style={{
              fontFamily: "var(--font-display)",
              color: "#d4a574",
              textShadow: "0 0 12px rgba(212,165,116,0.4)",
            }}
          >
            {person.name} says...
          </p>
          <p className="text-xs mt-0.5" style={{ color: "rgba(138,134,149,0.6)" }}>
            video clip
          </p>
        </div>

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.6) 100%)",
          }}
        />
      </div>
    </motion.div>
  );
}

function RevealCard({ answer }: { answer: string }) {
  return (
    <motion.div
      initial={{ y: 48, opacity: 0, clipPath: "inset(100% 0 0 0)" }}
      animate={{ y: 0, opacity: 1, clipPath: "inset(0% 0 0 0)" }}
      transition={{
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
        clipPath: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
      }}
      className="relative overflow-hidden rounded-2xl px-5 py-4 mb-4"
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(212,165,116,0.25)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow:
          "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      {/* Curtain shimmer stripe */}
      <motion.div
        initial={{ x: "-110%" }}
        animate={{ x: "110%" }}
        transition={{ duration: 0.75, ease: "easeOut", delay: 0.1 }}
        className="absolute inset-y-0 w-1/3 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(212,165,116,0.18), transparent)",
          zIndex: 1,
        }}
      />

      <p
        className="text-xs font-semibold uppercase tracking-widest mb-2"
        style={{ color: "#d4a574" }}
      >
        The real answer
      </p>

      <p
        className="text-lg leading-snug"
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          color: "#f0e6d3",
        }}
      >
        <span style={{ color: "#d4a574", fontStyle: "normal" }}>&ldquo;</span>
        {answer}
        <span style={{ color: "#d4a574", fontStyle: "normal" }}>&rdquo;</span>
      </p>
    </motion.div>
  );
}

function ScoringButtons({
  onScore,
}: {
  onScore: (scored: boolean) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.35 }}
      className="flex flex-col items-center gap-3"
    >
      <p
        className="text-sm font-medium"
        style={{
          fontFamily: "var(--font-display)",
          color: "#8a8695",
        }}
      >
        Were you close?
      </p>
      <div className="flex gap-4">
        {/* Thumbs up — emerald glass tint */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.06 }}
          onClick={() => onScore(true)}
          className="flex flex-col items-center gap-1.5 px-6 py-3 rounded-2xl font-medium text-sm transition-all"
          style={{
            background:
              "linear-gradient(135deg, rgba(52,211,153,0.14) 0%, rgba(16,185,129,0.07) 100%)",
            border: "1.5px solid rgba(52,211,153,0.35)",
            color: "#6ee7b7",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            boxShadow: "0 2px 12px rgba(52,211,153,0.1)",
          }}
        >
          <span style={{ fontSize: 26 }}>👍</span>
          <span>20 pts</span>
        </motion.button>

        {/* Thumbs down — red glass tint */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.06 }}
          onClick={() => onScore(false)}
          className="flex flex-col items-center gap-1.5 px-6 py-3 rounded-2xl font-medium text-sm transition-all"
          style={{
            background:
              "linear-gradient(135deg, rgba(239,68,68,0.14) 0%, rgba(220,38,38,0.07) 100%)",
            border: "1.5px solid rgba(239,68,68,0.3)",
            color: "rgba(252,165,165,0.9)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            boxShadow: "0 2px 12px rgba(239,68,68,0.1)",
          }}
        >
          <span style={{ fontSize: 26 }}>👎</span>
          <span>0 pts</span>
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Final Screen ─────────────────────────────────────────────────────────────

function FinalScreen({
  results,
  totalScore,
  guestName,
}: {
  results: RoundResult[];
  totalScore: number;
  guestName: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Score header */}
      <div
        className="rounded-3xl px-6 py-7 mb-6 text-center"
        style={{
          background:
            "linear-gradient(145deg, rgba(212,165,116,0.10) 0%, rgba(120,60,180,0.08) 100%)",
          border: "1px solid rgba(212,165,116,0.2)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow:
            "0 4px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        <p className="text-sm mb-1" style={{ color: "#8a8695" }}>
          Nice work, {guestName}
        </p>
        <motion.p
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 18 }}
          className="text-6xl font-bold mb-1"
          style={{
            fontFamily: "var(--font-display)",
            background: "linear-gradient(135deg, #e8c99a 0%, #d4a574 50%, #f0dfc0 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "none",
          }}
        >
          {totalScore}
        </motion.p>
        <p className="text-sm" style={{ color: "#8a8695" }}>
          out of {results.length * 20} possible pts
        </p>
      </div>

      {/* Per-round comparison list */}
      <div className="space-y-3">
        {results.map((r, i) => {
          const person =
            r.prompt.said_by === "nima" ? COUPLE.person1 : COUPLE.person2;
          return (
            <motion.div
              key={r.prompt.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.07, duration: 0.35 }}
              className="rounded-2xl overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
              }}
            >
              {/* Prompt header */}
              <div
                className="px-4 py-2 flex items-center gap-2"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(212,165,116,0.10) 0%, transparent 100%)",
                  borderBottom: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <span style={{ fontSize: 14 }}>{person.emoji}</span>
                <p
                  className="text-xs font-medium flex-1 truncate"
                  style={{ color: "#8a8695" }}
                >
                  {r.prompt.starter_text}
                </p>
                <span style={{ fontSize: 14 }}>{r.scored ? "👍" : "👎"}</span>
              </div>

              {/* Guess vs actual — side-by-side frosted glass cards */}
              <div className="px-4 py-3 grid grid-cols-2 gap-3">
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-wider mb-1"
                    style={{ color: "rgba(138,134,149,0.8)" }}
                  >
                    Your guess
                  </p>
                  <p
                    className="text-sm leading-snug italic"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "#f0e6d3",
                    }}
                  >
                    {r.guess.trim() || (
                      <span
                        className="not-italic"
                        style={{ color: "rgba(138,134,149,0.5)" }}
                      >
                        (no guess)
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-wider mb-1"
                    style={{ color: "#d4a574" }}
                  >
                    Real answer
                  </p>
                  <p
                    className="text-sm leading-snug italic"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "#f0e6d3",
                    }}
                  >
                    {r.prompt.actual_answer}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-8 text-center"
      >
        <p
          className="font-semibold text-base"
          style={{
            fontFamily: "var(--font-display)",
            background: "linear-gradient(135deg, #e8c99a, #d4a574)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {COUPLE.hashtag}
        </p>
        <p className="text-sm mt-1" style={{ color: "#8a8695" }}>
          Thanks for playing — see you on the dance floor!
        </p>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function FinishSentencePage() {
  const { guest } = useGuest();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [roundState, setRoundState] = useState<RoundState>("guessing");
  const [guess, setGuess] = useState("");
  const [results, setResults] = useState<RoundResult[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const prompt = PROMPTS[currentIndex];
  const isNima = prompt?.said_by === "nima";
  const person = isNima ? COUPLE.person1 : COUPLE.person2;

  // Focus input on each new round
  useEffect(() => {
    if (roundState === "guessing" && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [currentIndex, roundState]);

  function handleLockIn() {
    if (roundState !== "guessing") return;
    setRoundState("revealed");
  }

  function handleScore(scored: boolean) {
    const pts = scored ? 20 : 0;
    const result: RoundResult = {
      prompt,
      guess,
      scored,
    };
    const newResults = [...results, result];
    const newScore = totalScore + pts;

    setResults(newResults);
    setTotalScore(newScore);

    if (currentIndex + 1 >= PROMPTS.length) {
      setGameOver(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setRoundState("guessing");
      setGuess("");
    }
  }

  const guestName = guest?.name ?? "Friend";

  return (
    <GameLayout
      title="Finish Their Sentence"
      subtitle="What did they say?"
      emoji="🎬"
    >
      <AnimatePresence mode="wait">
        {gameOver ? (
          <motion.div
            key="final"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <FinalScreen
              results={results}
              totalScore={totalScore}
              guestName={guestName}
            />
          </motion.div>
        ) : (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -32 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            {/* Progress */}
            <ProgressDots total={PROMPTS.length} current={currentIndex} />

            {/* Round counter */}
            <p
              className="text-center text-xs mb-4 font-medium tracking-widest uppercase"
              style={{ color: "#8a8695" }}
            >
              Round {currentIndex + 1} of {PROMPTS.length}
            </p>

            {/* Video placeholder */}
            <VideoPlaceholder prompt={prompt} />

            {/* Sentence starter */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mb-5 text-center px-2"
            >
              <p
                className="text-xl leading-snug"
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  color: "#f0e6d3",
                }}
              >
                <span
                  className="not-italic text-xs font-semibold uppercase tracking-widest mr-2 align-middle"
                  style={{ color: "#d4a574" }}
                >
                  {person.name}:
                </span>
                <span style={{ color: "#d4a574", fontStyle: "normal" }}>&ldquo;</span>
                {prompt.starter_text}
                <span style={{ color: "#d4a574", fontStyle: "normal" }}>&rdquo;</span>
              </p>
            </motion.div>

            {/* Guess input */}
            <AnimatePresence>
              {roundState === "guessing" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ delay: 0.22, duration: 0.3 }}
                  className="mb-4"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLockIn()}
                    placeholder="What do you think they said?"
                    className="input-field"
                    style={{ fontFamily: "var(--font-body)" }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Locked-in guess pill (shown after reveal) */}
            <AnimatePresence>
              {roundState === "revealed" && guess.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-3 flex items-center gap-2"
                >
                  <span
                    className="text-xs font-medium"
                    style={{ color: "#8a8695" }}
                  >
                    You said:
                  </span>
                  <span
                    className="text-sm italic px-3 py-1 rounded-full"
                    style={{
                      background: "rgba(212,165,116,0.08)",
                      border: "1px solid rgba(212,165,116,0.2)",
                      fontFamily: "var(--font-display)",
                      color: "#f0e6d3",
                    }}
                  >
                    {guess}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Reveal card */}
            <AnimatePresence>
              {roundState === "revealed" && (
                <RevealCard answer={prompt.actual_answer} />
              )}
            </AnimatePresence>

            {/* Lock In button or scoring buttons */}
            <AnimatePresence mode="wait">
              {roundState === "guessing" ? (
                <motion.div
                  key="lock-in"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: 0.28, duration: 0.3 }}
                >
                  <button
                    onClick={handleLockIn}
                    className="btn-primary w-full text-base"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Lock In
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="scoring"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ScoringButtons onScore={handleScore} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Running score */}
            {totalScore > 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-xs mt-5"
                style={{ color: "#8a8695" }}
              >
                Running total:{" "}
                <span
                  className="font-semibold"
                  style={{ color: "#d4a574" }}
                >
                  {totalScore} pts
                </span>
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </GameLayout>
  );
}
