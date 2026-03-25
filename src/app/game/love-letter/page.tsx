"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { GameLayout } from "@/components/game-layout";
import { LoveLetter } from "@/types";
import { useGuest } from "@/lib/guest-context";

// ─── Types ───────────────────────────────────────────────────────────────────

type OpenOn = LoveLetter["open_on"];

interface TimeCapsuleOption {
  value: OpenOn;
  years: number;
  label: string;
  emoji: string;
  tagline: string;
  ordinal: string;
  tint: string;
  tintBorder: string;
  tintGlow: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const TIME_OPTIONS: TimeCapsuleOption[] = [
  {
    value: "1year",
    years: 1,
    label: "1 Year",
    emoji: "🌱",
    tagline: "Just getting started",
    ordinal: "1st",
    tint: "rgba(52, 211, 153, 0.06)",
    tintBorder: "rgba(52, 211, 153, 0.18)",
    tintGlow: "rgba(52, 211, 153, 0.25)",
  },
  {
    value: "5year",
    years: 5,
    label: "5 Years",
    emoji: "🌳",
    tagline: "Growing together",
    ordinal: "5th",
    tint: "rgba(16, 185, 129, 0.07)",
    tintBorder: "rgba(16, 185, 129, 0.2)",
    tintGlow: "rgba(16, 185, 129, 0.25)",
  },
  {
    value: "10year",
    years: 10,
    label: "10 Years",
    emoji: "🏠",
    tagline: "Building a life",
    ordinal: "10th",
    tint: "rgba(212, 165, 116, 0.07)",
    tintBorder: "rgba(212, 165, 116, 0.22)",
    tintGlow: "rgba(212, 165, 116, 0.3)",
  },
  {
    value: "25year",
    years: 25,
    label: "25 Years",
    emoji: "💎",
    tagline: "A lifetime of love",
    ordinal: "25th",
    tint: "rgba(139, 92, 246, 0.08)",
    tintBorder: "rgba(139, 92, 246, 0.22)",
    tintGlow: "rgba(139, 92, 246, 0.3)",
  },
];

const STORAGE_KEY = "nima-saba-love-letter";
const MAX_CHARS = 500;
const MAX_PREDICTION_CHARS = 200;

// ─── Envelope SVG ────────────────────────────────────────────────────────────

function EnvelopeFlap({ isOpen }: { isOpen: boolean }) {
  return (
    <motion.div
      className="absolute inset-x-0 top-0 origin-top"
      style={{ zIndex: 10 }}
      animate={{ rotateX: isOpen ? -180 : 0 }}
      transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
    >
      <svg viewBox="0 0 280 120" className="w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="flapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e8c99a" />
            <stop offset="60%" stopColor="#d4a574" />
            <stop offset="100%" stopColor="#c08040" />
          </linearGradient>
        </defs>
        <path
          d="M0,0 L140,110 L280,0 Z"
          fill="url(#flapGrad)"
          stroke="#c08040"
          strokeWidth="1"
        />
        <path d="M0,0 L140,110" stroke="#b87040" strokeWidth="0.6" opacity="0.5" />
        <path d="M280,0 L140,110" stroke="#b87040" strokeWidth="0.6" opacity="0.5" />
      </svg>
    </motion.div>
  );
}

function EnvelopeBody() {
  return (
    <svg viewBox="0 0 280 180" className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2e2920" />
          <stop offset="100%" stopColor="#231f18" />
        </linearGradient>
        <linearGradient id="foldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3a3228" />
          <stop offset="100%" stopColor="#2a251c" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="280" height="180" rx="4" fill="url(#bodyGrad)" stroke="#c08040" strokeWidth="1.5" />
      <path d="M0,180 L140,90 L280,180 Z" fill="url(#foldGrad)" stroke="#c08040" strokeWidth="1" />
      <path d="M0,0 L140,90" stroke="#c08040" strokeWidth="0.7" opacity="0.4" />
      <path d="M280,0 L140,90" stroke="#c08040" strokeWidth="0.7" opacity="0.4" />
    </svg>
  );
}

// ─── Wax Seal ─────────────────────────────────────────────────────────────────

function WaxSeal({ animate: shouldAnimate, onComplete }: { animate: boolean; onComplete: () => void }) {
  const controls = useAnimation();

  useEffect(() => {
    if (!shouldAnimate) return;

    async function runSeal() {
      await controls.start({
        y: 0,
        scale: 1,
        opacity: 1,
        transition: { duration: 0.35, ease: "easeIn" },
      });
      await controls.start({
        scale: [1, 1.18, 0.92, 1.06, 0.98, 1],
        transition: { duration: 0.55, ease: "easeOut" },
      });
      await new Promise((r) => setTimeout(r, 400));
      onComplete();
    }

    runSeal();
  }, [shouldAnimate, controls, onComplete]);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ zIndex: 20 }}
      initial={{ y: -120, scale: 0.6, opacity: 0 }}
      animate={controls}
    >
      <div
        className="relative flex items-center justify-center rounded-full"
        style={{
          width: 72,
          height: 72,
          background: "radial-gradient(circle at 38% 35%, #d4956a, #b76e79 50%, #7a3a4a)",
          boxShadow:
            "0 6px 28px rgba(183, 110, 121, 0.6), inset 0 2px 4px rgba(255, 220, 200, 0.25), 0 0 0 2px rgba(212, 165, 116, 0.3)",
        }}
      >
        {/* Outer ring emboss */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: "2px solid rgba(212, 165, 116, 0.4)",
            margin: 4,
            borderRadius: "50%",
          }}
        />
        {/* Monogram in gold */}
        <span
          className="select-none relative z-10"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 13,
            fontWeight: 700,
            color: "#f0dfc0",
            letterSpacing: "0.04em",
            textShadow: "0 1px 3px rgba(60, 20, 30, 0.6)",
          }}
        >
          N&amp;S
        </span>
        {/* Radiating lines */}
        <svg className="absolute inset-0" viewBox="0 0 72 72" style={{ opacity: 0.22 }}>
          {[0, 30, 60, 90, 120, 150].map((deg) => (
            <line
              key={deg}
              x1="36"
              y1="36"
              x2={36 + 28 * Math.cos((deg * Math.PI) / 180)}
              y2={36 + 28 * Math.sin((deg * Math.PI) / 180)}
              stroke="#f0dfc0"
              strokeWidth="1"
            />
          ))}
        </svg>
      </div>
    </motion.div>
  );
}

// ─── Opening Envelope Animation ───────────────────────────────────────────────

function OpeningEnvelope({ onComplete }: { onComplete: () => void }) {
  const [flapOpen, setFlapOpen] = useState(false);
  const [letterRising, setLetterRising] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFlapOpen(true), 600);
    const t2 = setTimeout(() => setLetterRising(true), 1400);
    const t3 = setTimeout(() => onComplete(), 2600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-10"
      >
        <h1
          className="text-3xl font-bold mb-2"
          style={{
            fontFamily: "var(--font-display)",
            background: "linear-gradient(135deg, #e8c99a 0%, #d4a574 50%, #f0dfc0 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Love Letter
        </h1>
        <p style={{ color: "var(--color-charcoal-light)", fontSize: 14 }}>
          A message for the years ahead
        </p>
      </motion.div>

      {/* Envelope container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative"
        style={{ width: 280, height: 180 }}
      >
        {/* Subtle glow behind envelope */}
        <div
          className="absolute inset-0 rounded-lg"
          style={{
            background: "radial-gradient(ellipse at center, rgba(212,165,116,0.12) 0%, transparent 70%)",
            transform: "scale(1.3)",
            zIndex: 0,
          }}
        />

        {/* Envelope body */}
        <div className="absolute inset-0" style={{ zIndex: 1 }}>
          <EnvelopeBody />
        </div>

        {/* Rising letter */}
        <AnimatePresence>
          {letterRising && (
            <motion.div
              className="absolute left-1/2 bottom-8 -translate-x-1/2 flex flex-col items-center"
              style={{ zIndex: 5 }}
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: -30, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <div
                className="rounded-lg px-6 py-4 text-center"
                style={{
                  background: "linear-gradient(145deg, #2a2520, #1e1a15)",
                  border: "1px solid rgba(212, 165, 116, 0.3)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(212,165,116,0.1)",
                  width: 200,
                }}
              >
                <div
                  className="text-xs font-medium tracking-widest uppercase mb-1"
                  style={{ color: "#d4a574", fontFamily: "var(--font-display)" }}
                >
                  For
                </div>
                <div
                  className="font-semibold"
                  style={{ fontFamily: "var(--font-display)", fontSize: 14, color: "#f0dfc0" }}
                >
                  Nima &amp; Saba
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Flap on top */}
        <div className="absolute inset-x-0 top-0" style={{ perspective: 600, zIndex: 10 }}>
          <EnvelopeFlap isOpen={flapOpen} />
        </div>
      </motion.div>
    </div>
  );
}

// ─── Step 1: Choose when to open ──────────────────────────────────────────────

function StepChooseTime({
  selected,
  onSelect,
  onNext,
}: {
  selected: OpenOn | null;
  onSelect: (v: OpenOn) => void;
  onNext: () => void;
}) {
  return (
    <motion.div
      key="step-time"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center mb-6">
        <h2
          className="text-xl font-bold mb-1"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-charcoal)",
          }}
        >
          When should they open this?
        </h2>
        <p style={{ color: "var(--color-charcoal-light)", fontSize: 14 }}>
          Choose the anniversary to seal your message for
        </p>
      </div>

      {/* 2×2 grid */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {TIME_OPTIONS.map((opt, i) => {
          const isSelected = selected === opt.value;
          return (
            <motion.button
              key={opt.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
              onClick={() => onSelect(opt.value)}
              className="relative rounded-2xl p-4 text-left focus:outline-none focus-visible:ring-2"
              style={{
                background: isSelected
                  ? `rgba(255, 255, 255, 0.05)`
                  : "rgba(255, 255, 255, 0.04)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: isSelected
                  ? `1.5px solid rgba(212, 165, 116, 0.6)`
                  : `1.5px solid ${opt.tintBorder}`,
                boxShadow: isSelected
                  ? `0 0 0 3px rgba(212, 165, 116, 0.15), 0 4px 20px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)`
                  : "0 2px 12px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)",
                // per-card colour tint overlay via background gradient
                backgroundImage: `linear-gradient(135deg, ${opt.tint} 0%, rgba(255,255,255,0.02) 100%)`,
                focusVisibleRingColor: "#d4a574",
              } as React.CSSProperties}
              whileTap={{ scale: 0.97 }}
            >
              {/* Gold glow ring when selected */}
              {isSelected && (
                <motion.div
                  layoutId="card-glow"
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    boxShadow: `inset 0 0 0 1.5px rgba(212, 165, 116, 0.5), 0 0 20px ${opt.tintGlow}`,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}

              <span className="text-2xl block mb-2">{opt.emoji}</span>
              <div
                className="font-bold text-base leading-tight mb-0.5"
                style={{
                  fontFamily: "var(--font-display)",
                  color: isSelected ? "#e8c99a" : "var(--color-charcoal)",
                }}
              >
                {opt.label}
              </div>
              <div
                className="text-xs leading-snug"
                style={{ color: "var(--color-charcoal-light)" }}
              >
                {opt.tagline}
              </div>

              {/* Checkmark */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, #e8c99a, #d4a574)",
                      boxShadow: "0 2px 8px rgba(212, 165, 116, 0.4)",
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <svg viewBox="0 0 12 12" className="w-3 h-3">
                      <polyline
                        points="2,6 5,9 10,3"
                        fill="none"
                        stroke="#1a1510"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      <motion.button
        onClick={onNext}
        disabled={!selected}
        className="w-full py-4 rounded-full font-semibold text-base transition-all duration-300 focus:outline-none focus-visible:ring-2"
        style={{
          background: selected
            ? "linear-gradient(135deg, #e8c99a 0%, #d4a574 45%, #c08040 100%)"
            : "rgba(255,255,255,0.06)",
          color: selected ? "#0f0d15" : "rgba(255,255,255,0.25)",
          boxShadow: selected
            ? "0 4px 24px rgba(212, 165, 116, 0.4), inset 0 1px 0 rgba(255,255,255,0.25)"
            : "none",
          cursor: selected ? "pointer" : "not-allowed",
          fontWeight: 700,
          letterSpacing: "0.02em",
        }}
        whileTap={selected ? { scale: 0.97 } : {}}
      >
        Write Your Message
      </motion.button>
    </motion.div>
  );
}

// ─── Step 2: Write message ────────────────────────────────────────────────────

function StepWriteMessage({
  timeOption,
  message,
  onMessageChange,
  prediction,
  onPredictionChange,
  showPrediction,
  onTogglePrediction,
  onNext,
  onBack,
}: {
  timeOption: TimeCapsuleOption;
  message: string;
  onMessageChange: (v: string) => void;
  prediction: string;
  onPredictionChange: (v: string) => void;
  showPrediction: boolean;
  onTogglePrediction: () => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const remaining = MAX_CHARS - message.length;
  const isReady = message.trim().length >= 10;
  const isCounterLow = remaining < 50;

  useEffect(() => {
    const t = setTimeout(() => textareaRef.current?.focus(), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      key="step-write"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center mb-5">
        <h2
          className="text-xl font-bold mb-1"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-charcoal)" }}
        >
          Write Your Letter
        </h2>
        <p style={{ color: "var(--color-charcoal-light)", fontSize: 14 }}>
          Sealed until their{" "}
          <span style={{ color: "#d4a574", fontWeight: 600 }}>
            {timeOption.ordinal} anniversary
          </span>{" "}
          {timeOption.emoji}
        </p>
      </div>

      {/* Dark parchment textarea */}
      <div
        className="relative rounded-2xl mb-3"
        style={{
          background: "#1a1815",
          border: "1px solid rgba(212, 165, 116, 0.18)",
          boxShadow:
            "0 2px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        {/* Subtle bottom rule lines */}
        <div
          className="absolute inset-x-0 bottom-10"
          style={{ top: 52, zIndex: 0 }}
          aria-hidden
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 1,
              background: "rgba(212, 165, 116, 0.08)",
            }}
          />
        </div>

        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => {
            if (e.target.value.length <= MAX_CHARS) {
              onMessageChange(e.target.value);
            }
          }}
          onFocus={(e) => {
            (e.target.parentElement as HTMLElement).style.border =
              "1px solid rgba(212, 165, 116, 0.45)";
            (e.target.parentElement as HTMLElement).style.boxShadow =
              "0 2px 16px rgba(0,0,0,0.4), 0 0 0 3px rgba(212,165,116,0.1), inset 0 1px 0 rgba(255,255,255,0.04)";
          }}
          onBlur={(e) => {
            (e.target.parentElement as HTMLElement).style.border =
              "1px solid rgba(212, 165, 116, 0.18)";
            (e.target.parentElement as HTMLElement).style.boxShadow =
              "0 2px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)";
          }}
          placeholder="Dear Nima & Saba..."
          rows={7}
          className="relative w-full bg-transparent resize-none focus:outline-none"
          style={{
            zIndex: 1,
            padding: "18px 18px 12px",
            fontFamily: "var(--font-body)",
            fontSize: 15,
            lineHeight: "1.75",
            color: "#e8c99a",
            caretColor: "#d4a574",
          }}
        />

        {/* Character counter */}
        <div
          className="text-right pr-4 pb-3 text-xs transition-colors duration-300"
          style={{
            color: isCounterLow ? "#d4a574" : "rgba(138, 134, 149, 0.6)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {remaining} left
        </div>
      </div>

      {/* Prediction toggle */}
      <div className="mb-6">
        <button
          onClick={onTogglePrediction}
          className="flex items-center gap-2 text-sm font-medium focus:outline-none focus-visible:ring-2 rounded-lg px-1"
          style={{ color: "#d4a574" }}
        >
          <motion.div
            className="w-10 h-5 rounded-full relative flex-shrink-0"
            style={{
              background: showPrediction
                ? "linear-gradient(135deg, #e8c99a, #d4a574)"
                : "rgba(255,255,255,0.1)",
              border: showPrediction
                ? "1px solid rgba(212,165,116,0.5)"
                : "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <motion.div
              className="absolute top-0.5 w-4 h-4 rounded-full shadow"
              style={{
                background: showPrediction ? "#0f0d15" : "rgba(255,255,255,0.5)",
              }}
              animate={{ left: showPrediction ? 22 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </motion.div>
          Add a prediction
        </button>

        <AnimatePresence>
          {showPrediction && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <p
                className="text-xs mt-3 mb-2"
                style={{ color: "var(--color-charcoal-light)" }}
              >
                Where do you see them in{" "}
                {timeOption.years} {timeOption.years === 1 ? "year" : "years"}?
              </p>
              <div
                className="rounded-xl"
                style={{
                  background: "#1a1815",
                  border: "1px solid rgba(212, 165, 116, 0.15)",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)",
                }}
              >
                <textarea
                  value={prediction}
                  onChange={(e) => {
                    if (e.target.value.length <= MAX_PREDICTION_CHARS) {
                      onPredictionChange(e.target.value);
                    }
                  }}
                  placeholder="I predict they'll have..."
                  rows={3}
                  className="w-full bg-transparent resize-none focus:outline-none"
                  style={{
                    padding: "14px 16px 8px",
                    fontFamily: "var(--font-body)",
                    fontSize: 14,
                    lineHeight: "1.7",
                    color: "#e8c99a",
                    caretColor: "#d4a574",
                  }}
                />
                <div
                  className="text-right pr-4 pb-3 text-xs transition-colors duration-300"
                  style={{
                    color:
                      MAX_PREDICTION_CHARS - prediction.length < 30
                        ? "#d4a574"
                        : "rgba(138, 134, 149, 0.6)",
                  }}
                >
                  {MAX_PREDICTION_CHARS - prediction.length} left
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-none px-5 py-4 rounded-full text-sm font-medium focus:outline-none focus-visible:ring-2 transition-all"
          style={{
            background: "transparent",
            border: "1.5px solid rgba(212, 165, 116, 0.2)",
            color: "rgba(212, 165, 116, 0.6)",
          }}
        >
          Back
        </button>

        <motion.button
          onClick={onNext}
          disabled={!isReady}
          className="flex-1 py-4 rounded-full font-semibold text-base transition-all duration-300 focus:outline-none focus-visible:ring-2"
          style={{
            background: isReady
              ? "linear-gradient(135deg, #e8c99a 0%, #d4a574 45%, #c08040 100%)"
              : "rgba(255,255,255,0.06)",
            color: isReady ? "#0f0d15" : "rgba(255,255,255,0.2)",
            boxShadow: isReady
              ? "0 4px 24px rgba(212, 165, 116, 0.4), inset 0 1px 0 rgba(255,255,255,0.25)"
              : "none",
            cursor: isReady ? "pointer" : "not-allowed",
            fontWeight: 700,
            letterSpacing: "0.02em",
          }}
          whileTap={isReady ? { scale: 0.97 } : {}}
        >
          Seal Your Letter
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Step 3: Sealing animation ────────────────────────────────────────────────

function StepSealing({
  timeOption,
  onComplete,
}: {
  timeOption: TimeCapsuleOption;
  onComplete: () => void;
}) {
  const [sealDropped, setSealDropped] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSealDropped(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      key="step-sealing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[55vh] text-center px-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <h2
          className="text-2xl font-bold mb-2"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-charcoal)" }}
        >
          Sealing your letter...
        </h2>
        <p style={{ color: "var(--color-charcoal-light)", fontSize: 14 }}>
          Making it official {timeOption.emoji}
        </p>
      </motion.div>

      {/* Envelope with wax seal */}
      <motion.div
        className="relative"
        style={{ width: 240, height: 160 }}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Ambient glow */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(212,165,116,0.1) 0%, transparent 70%)",
            transform: "scale(1.4)",
          }}
        />

        {/* Envelope body */}
        <div className="absolute inset-0">
          <svg
            viewBox="0 0 280 180"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="sealBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2e2920" />
                <stop offset="100%" stopColor="#1e1a15" />
              </linearGradient>
            </defs>
            <rect
              x="0"
              y="0"
              width="280"
              height="180"
              rx="4"
              fill="url(#sealBodyGrad)"
              stroke="#c08040"
              strokeWidth="1.5"
            />
            <path d="M0,0 L140,90 L280,0 Z" fill="#2a2418" stroke="#c08040" strokeWidth="1" />
            <path d="M0,180 L140,90 L280,180 Z" fill="#2a2418" stroke="#c08040" strokeWidth="1" />
            <path d="M0,0 L140,90" stroke="#c08040" strokeWidth="0.7" opacity="0.4" />
            <path d="M280,0 L140,90" stroke="#c08040" strokeWidth="0.7" opacity="0.4" />
          </svg>
        </div>

        {/* Wax seal */}
        <WaxSeal animate={sealDropped} onComplete={onComplete} />
      </motion.div>
    </motion.div>
  );
}

// ─── Sealed State ─────────────────────────────────────────────────────────────

function SealedState({
  timeOption,
  guestName,
  onWriteAnother,
}: {
  timeOption: TimeCapsuleOption;
  guestName: string;
  onWriteAnother: () => void;
}) {
  return (
    <motion.div
      key="sealed"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.34, 1.2, 0.64, 1] }}
      className="flex flex-col items-center text-center px-2"
    >
      {/* Main sealed card */}
      <div
        className="w-full rounded-3xl p-8 mb-6"
        style={{
          background: "rgba(255, 255, 255, 0.04)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(212, 165, 116, 0.2)",
          boxShadow:
            "0 8px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 0 1px rgba(212,165,116,0.06)",
        }}
      >
        {/* Sealed envelope emoji with glow */}
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 18 }}
          className="text-6xl mb-5 inline-block"
          style={{ filter: "drop-shadow(0 0 12px rgba(212,165,116,0.4))" }}
        >
          💌
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold mb-3"
          style={{
            fontFamily: "var(--font-display)",
            background: "linear-gradient(135deg, #e8c99a 0%, #d4a574 60%, #f0dfc0 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Your letter is sealed
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42 }}
        >
          <p
            className="text-sm leading-relaxed mb-4"
            style={{ color: "var(--color-charcoal-light)" }}
          >
            Nima &amp; Saba will open this on their{" "}
            <span
              className="font-semibold"
              style={{ color: "#d4a574" }}
            >
              {timeOption.ordinal} anniversary
            </span>
            {" "}—{" "}
            {timeOption.years === 1 ? "1 year" : `${timeOption.years} years`} from today.
          </p>

          {/* Divider */}
          <div className="gold-divider mx-auto mb-4" style={{ width: 64 }} />

          {/* From badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm"
            style={{
              background: "rgba(212, 165, 116, 0.1)",
              border: "1px solid rgba(212, 165, 116, 0.2)",
            }}
          >
            <span style={{ fontSize: 12, color: "rgba(212,165,116,0.6)" }}>
              With love from
            </span>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                color: "#e8c99a",
              }}
            >
              {guestName}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Cannot be changed notice */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-xs mb-6"
        style={{ color: "rgba(138, 134, 149, 0.5)" }}
      >
        This letter cannot be changed
      </motion.p>

      {/* Write another */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.72 }}
        onClick={onWriteAnother}
        className="text-sm font-medium focus:outline-none focus-visible:ring-2 rounded-lg px-3 py-1.5 transition-all"
        style={{
          color: "#d4a574",
          borderBottom: "1px solid rgba(212, 165, 116, 0.3)",
        }}
        whileHover={{ opacity: 0.75 }}
        whileTap={{ scale: 0.97 }}
      >
        Write Another Letter
      </motion.button>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type Step = "opening" | "choose-time" | "write" | "sealing" | "sealed";

interface DraftState {
  openOn: OpenOn | null;
  message: string;
  prediction: string;
  showPrediction: boolean;
}

export default function LoveLetterPage() {
  const { guest } = useGuest();

  const [step, setStep] = useState<Step>("opening");
  const [draft, setDraft] = useState<DraftState>({
    openOn: null,
    message: "",
    prediction: "",
    showPrediction: false,
  });
  const [sealed, setSealed] = useState<LoveLetter | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const letter: LoveLetter = JSON.parse(raw);
        setSealed(letter);
        setStep("sealed");
        return;
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const selectedOption =
    TIME_OPTIONS.find((o) => o.value === draft.openOn) ?? TIME_OPTIONS[0];

  function handleSeal() {
    if (!draft.openOn || !guest) return;

    const letter: LoveLetter = {
      id: crypto.randomUUID(),
      guest_id: guest.id,
      guest_name: guest.name,
      message: draft.message,
      open_on: draft.openOn,
      created_at: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(letter));
    setSealed(letter);
    setStep("sealing");
  }

  function handleWriteAnother() {
    localStorage.removeItem(STORAGE_KEY);
    setSealed(null);
    setDraft({ openOn: null, message: "", prediction: "", showPrediction: false });
    setStep("choose-time");
  }

  const guestName = guest?.name ?? sealed?.guest_name ?? "Guest";

  return (
    <GameLayout title="Love Letter" subtitle="A message for the years ahead" emoji="💌">
      <AnimatePresence mode="wait">
        {step === "opening" && (
          <motion.div key="opening">
            <OpeningEnvelope
              onComplete={() => setStep(sealed ? "sealed" : "choose-time")}
            />
          </motion.div>
        )}

        {step === "choose-time" && (
          <motion.div key="choose-time">
            <StepChooseTime
              selected={draft.openOn}
              onSelect={(v) => setDraft((d) => ({ ...d, openOn: v }))}
              onNext={() => setStep("write")}
            />
          </motion.div>
        )}

        {step === "write" && draft.openOn && (
          <motion.div key="write">
            <StepWriteMessage
              timeOption={selectedOption}
              message={draft.message}
              onMessageChange={(v) => setDraft((d) => ({ ...d, message: v }))}
              prediction={draft.prediction}
              onPredictionChange={(v) => setDraft((d) => ({ ...d, prediction: v }))}
              showPrediction={draft.showPrediction}
              onTogglePrediction={() =>
                setDraft((d) => ({ ...d, showPrediction: !d.showPrediction }))
              }
              onNext={handleSeal}
              onBack={() => setStep("choose-time")}
            />
          </motion.div>
        )}

        {step === "sealing" && (
          <motion.div key="sealing">
            <StepSealing
              timeOption={selectedOption}
              onComplete={() => setStep("sealed")}
            />
          </motion.div>
        )}

        {step === "sealed" && sealed && (
          <motion.div key="sealed">
            <SealedState
              timeOption={
                TIME_OPTIONS.find((o) => o.value === sealed.open_on) ?? TIME_OPTIONS[0]
              }
              guestName={guestName}
              onWriteAnother={handleWriteAnother}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </GameLayout>
  );
}
