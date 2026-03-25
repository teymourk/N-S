"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ---------------------------------------------------------------------------
// Shared constants
// ---------------------------------------------------------------------------

const GOLD = "#d4a574";
const DARK_BG = "#0a0a1a";

// ---------------------------------------------------------------------------
// Confetti
// ---------------------------------------------------------------------------

interface ConfettiPiece {
  id: number;
  x: number;         // vw starting position
  dx: number;        // horizontal drift in vw
  size: number;      // px
  color: string;
  rotation: number;  // deg starting rotation
  rotationEnd: number;
  delay: number;     // seconds
  duration: number;  // seconds
  shape: "rect" | "circle";
}

const CONFETTI_COLORS = [GOLD, "#f0e6d3", "#b76e79", "#ffffff"];

function generatePieces(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    dx: (Math.random() - 0.5) * 30,
    size: 4 + Math.random() * 4,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    rotation: Math.random() * 360,
    rotationEnd: Math.random() * 720 - 360,
    delay: Math.random() * 0.6,
    duration: 2.4 + Math.random() * 0.8,
    shape: Math.random() > 0.4 ? "rect" : "circle",
  }));
}

interface ConfettiProps {
  trigger: boolean;
}

export function Confetti({ trigger }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!trigger) return;
    const count = 40 + Math.floor(Math.random() * 21); // 40–60
    setPieces(generatePieces(count));
    setActive(true);
    const t = setTimeout(() => setActive(false), 3600);
    return () => clearTimeout(t);
  }, [trigger]);

  if (!active) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 9999,
      }}
    >
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            x: `${p.x}vw`,
            y: "-8px",
            rotate: p.rotation,
            opacity: 1,
          }}
          animate={{
            x: `calc(${p.x}vw + ${p.dx}vw)`,
            y: "105vh",
            rotate: p.rotation + p.rotationEnd,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeIn",
            opacity: { times: [0, 0.7, 1], duration: p.duration, delay: p.delay },
          }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: p.size,
            height: p.shape === "rect" ? p.size * 1.6 : p.size,
            borderRadius: p.shape === "circle" ? "50%" : 2,
            backgroundColor: p.color,
          }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ScorePopup
// ---------------------------------------------------------------------------

interface ScorePopupProps {
  points: number;
  show: boolean;
}

export function ScorePopup({ points, show }: ScorePopupProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="score-popup"
          initial={{ opacity: 0, y: 0, scale: 0.8 }}
          animate={{ opacity: 1, y: -48, scale: 1 }}
          exit={{ opacity: 0, y: -80, scale: 0.9 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translateX(-50%)",
            pointerEvents: "none",
            zIndex: 200,
            color: GOLD,
            fontSize: "2.25rem",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            textShadow: `0 0 20px rgba(212,165,116,0.6)`,
            whiteSpace: "nowrap",
          }}
        >
          +{points} pts
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// CorrectFlash
// ---------------------------------------------------------------------------

interface FlashProps {
  show: boolean;
}

export function CorrectFlash({ show }: FlashProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="correct-flash"
          initial={{ opacity: 0.55 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(34,197,94,0.28)",
            pointerEvents: "none",
            zIndex: 9998,
          }}
        />
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// WrongFlash
// ---------------------------------------------------------------------------

export function WrongFlash({ show }: FlashProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="wrong-flash"
          initial={{ opacity: 0.55 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(239,68,68,0.28)",
            pointerEvents: "none",
            zIndex: 9998,
          }}
        />
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// CountdownNumber
// ---------------------------------------------------------------------------

interface CountdownNumberProps {
  number: number;
}

export function CountdownNumber({ number }: CountdownNumberProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={number}
        initial={{ scale: 2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.6, opacity: 0 }}
        transition={{
          scale: { type: "spring", stiffness: 280, damping: 22 },
          opacity: { duration: 0.18 },
        }}
        aria-live="polite"
        style={{
          fontSize: "6rem",
          fontWeight: 900,
          lineHeight: 1,
          background: `linear-gradient(135deg, ${GOLD} 0%, #f0e6d3 50%, ${GOLD} 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          textShadow: "none",
          userSelect: "none",
        }}
      >
        {number}
      </motion.div>
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// LiveBadge
// ---------------------------------------------------------------------------

export function LiveBadge() {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 10px",
        borderRadius: "9999px",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        backgroundColor: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.12)",
      }}
    >
      {/* Pulsing red dot */}
      <span
        style={{
          display: "block",
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: "#ef4444",
          animation: "livePulse 1.4s ease-in-out infinite",
        }}
      />
      {/* LIVE label */}
      <span
        style={{
          fontSize: "0.7rem",
          fontWeight: 700,
          letterSpacing: "0.12em",
          color: "#ef4444",
          lineHeight: 1,
        }}
      >
        LIVE
      </span>

      {/* Keyframe injected once via a style tag */}
      <style>{`
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(1.35); }
        }
      `}</style>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Re-export dark bg token for consumers
// ---------------------------------------------------------------------------

export { GOLD, DARK_BG };
