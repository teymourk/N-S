"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useGuest } from "@/lib/guest-context";
import { GuestRegistration } from "@/components/guest-registration";
import { GameCard } from "@/components/game-card";
import { Leaderboard } from "@/components/leaderboard";
import { GAMES, COUPLE } from "@/lib/games";
import { useState, useEffect } from "react";

// Floating particle — pure CSS-driven drift via inline keyframes
function GoldParticle({ x, y, delay, size }: { x: number; y: number; delay: number; size: number }) {
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, #d4a574 0%, #d4a57400 100%)`,
        opacity: 0,
        animation: `floatParticle 8s ease-in-out ${delay}s infinite`,
        pointerEvents: "none",
      }}
    />
  );
}

const PARTICLES = [
  { x: 8,  y: 15, delay: 0,   size: 4 },
  { x: 92, y: 22, delay: 1.2, size: 3 },
  { x: 18, y: 70, delay: 2.4, size: 5 },
  { x: 78, y: 65, delay: 0.8, size: 3 },
  { x: 45, y: 10, delay: 3.1, size: 4 },
  { x: 60, y: 82, delay: 1.7, size: 3 },
  { x: 30, y: 40, delay: 4.2, size: 2 },
  { x: 85, y: 45, delay: 2.0, size: 4 },
  { x: 12, y: 88, delay: 0.5, size: 3 },
  { x: 55, y: 55, delay: 3.8, size: 2 },
  { x: 72, y: 30, delay: 1.4, size: 5 },
  { x: 25, y: 95, delay: 2.9, size: 3 },
];

// Typing effect for "The Game"
function TypingText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), 1200);
    return () => clearTimeout(startTimer);
  }, []);

  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) return;
    const t = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, 80);
    return () => clearTimeout(t);
  }, [started, displayed, text]);

  return (
    <span>
      {displayed}
      {displayed.length < text.length && started && (
        <span
          style={{
            display: "inline-block",
            width: "2px",
            height: "1em",
            background: "#d4a574",
            marginLeft: "2px",
            verticalAlign: "text-bottom",
            animation: "cursorBlink 1s step-end infinite",
          }}
        />
      )}
    </span>
  );
}

export default function HomePage() {
  const { guest, isRegistered } = useGuest();
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Demo: all games active so every round is playable
  const gamesWithStatus = GAMES.map((g) => ({
    ...g,
    status: "active" as const,
  }));

  const [introStep, setIntroStep] = useState(0);
  const [introDone, setIntroDone] = useState(false);

  // Intro plays for EVERYONE on every visit
  useEffect(() => {
    const t1 = setTimeout(() => setIntroStep(1), 300);
    const t2 = setTimeout(() => setIntroStep(2), 1000);
    const t3 = setTimeout(() => setIntroStep(3), 1700);
    const t4 = setTimeout(() => setIntroStep(4), 2500);
    const t5 = setTimeout(() => setIntroStep(5), 3400);
    const t6 = setTimeout(() => setIntroDone(true), 4600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); clearTimeout(t6); };
  }, []);

  if (!isRegistered) {
    return (
      <>
        <style>{`
          @keyframes floatParticle {
            0%   { opacity: 0;    transform: translateY(0px) scale(0.8); }
            20%  { opacity: 0.7; }
            80%  { opacity: 0.5; }
            100% { opacity: 0;    transform: translateY(-60px) scale(1.2); }
          }
          @keyframes cursorBlink {
            0%, 100% { opacity: 1; }
            50%       { opacity: 0; }
          }
          @keyframes goldShimmer {
            0%, 100% { background-position: 200% center; }
            50%       { background-position: -200% center; }
          }
          @keyframes softPulse {
            0%, 100% { opacity: 0.15; transform: scale(1); }
            50%       { opacity: 0.3;  transform: scale(1.08); }
          }
          @keyframes introGlow {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.1); }
          }
          @keyframes introShimmer {
            0% { background-position: 200% center; }
            100% { background-position: -200% center; }
          }
        `}</style>

        {/* === INTRO OVERLAY === */}
        <AnimatePresence>
          {!introDone && (
            <motion.div
              key="intro-overlay"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: "fixed", inset: 0, zIndex: 9999,
                backgroundColor: "#0a0a1a",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {/* Ambient glow */}
              <div style={{
                position: "absolute", width: "60vw", height: "60vw",
                maxWidth: 500, maxHeight: 500, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(212,165,116,0.12) 0%, rgba(139,92,246,0.04) 50%, transparent 70%)",
                animation: "introGlow 4s ease-in-out infinite",
                pointerEvents: "none",
              }} />

              {/* Gold line */}
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={introStep >= 1 ? { scaleX: 1, opacity: 1 } : {}}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{ width: 120, height: 1, background: "linear-gradient(90deg, transparent, #d4a574, transparent)", marginBottom: 32 }}
              />

              {/* N & S monogram */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, fontFamily: "var(--font-display)", fontSize: "clamp(3rem, 12vw, 6rem)", fontWeight: 700, letterSpacing: "0.06em", lineHeight: 1 }}>
                <motion.span
                  initial={{ opacity: 0, x: -30 }}
                  animate={introStep >= 2 ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  style={{ background: "linear-gradient(135deg, #d4a574 0%, #f0e6d3 40%, #d4a574 80%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
                >N</motion.span>

                <motion.span
                  initial={{ opacity: 0, scale: 0.3 }}
                  animate={introStep >= 3 ? { opacity: 1, scale: 1 } : {}}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  style={{ fontSize: "clamp(1.5rem, 5vw, 2.5rem)", color: "#8a8695" }}
                >&amp;</motion.span>

                <motion.span
                  initial={{ opacity: 0, x: 30 }}
                  animate={introStep >= 2 ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                  style={{ background: "linear-gradient(135deg, #d4a574 0%, #f0e6d3 40%, #d4a574 80%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
                >S</motion.span>
              </div>

              {/* Expanding line */}
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={introStep >= 3 ? { scaleX: 1, opacity: 1 } : {}}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                style={{ width: 200, height: 1, background: "linear-gradient(90deg, transparent 0%, rgba(212,165,116,0.6) 30%, #d4a574 50%, rgba(212,165,116,0.6) 70%, transparent 100%)", marginBottom: 28 }}
              />

              {/* Full names */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={introStep >= 4 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.4rem, 5vw, 2.2rem)", fontWeight: 600, letterSpacing: "0.12em", textAlign: "center" }}
              >
                <span style={{ background: "linear-gradient(135deg, #e8c99a 0%, #d4a574 30%, #f0e6d3 60%, #d4a574 100%)", backgroundSize: "300% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "introShimmer 3s ease-in-out infinite" }}>
                  Nima &amp; Saba
                </span>
              </motion.div>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={introStep >= 5 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: "easeOut" }}
                style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(0.9rem, 3vw, 1.15rem)", color: "#8a8695", letterSpacing: "0.15em", marginTop: 12 }}
              >
                invite you to play
              </motion.p>

              {/* Dots */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={introStep >= 5 ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.3 }}
                style={{ display: "flex", gap: 8, marginTop: 32 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div key={i} initial={{ scale: 0 }} animate={introStep >= 5 ? { scale: 1 } : {}} transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.4 + i * 0.1 }} style={{ width: i === 1 ? 6 : 4, height: i === 1 ? 6 : 4, borderRadius: "50%", backgroundColor: i === 1 ? "#d4a574" : "rgba(212,165,116,0.4)" }} />
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* === MAIN LANDING (visible after intro fades) === */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={introDone ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div
            style={{ backgroundColor: "#0a0a1a", minHeight: "100vh", position: "relative", overflow: "hidden" }}
            className="flex flex-col items-center justify-center px-4 py-12"
          >
            {/* Ambient glow blobs */}
            <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,165,116,0.08) 0%, transparent 70%)", animation: "softPulse 6s ease-in-out infinite", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: "5%", right: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,165,116,0.06) 0%, transparent 70%)", animation: "softPulse 8s ease-in-out 2s infinite", pointerEvents: "none" }} />

            {/* Floating particles */}
            {PARTICLES.map((p, i) => (
              <GoldParticle key={i} {...p} />
            ))}

            {/* Hero content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="text-center relative z-10"
              style={{ marginBottom: 48 }}
            >
              {/* Monogram */}
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, duration: 0.8, type: "spring", stiffness: 120, damping: 14 }}
                style={{ marginBottom: 24 }}
              >
                <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 96, height: 96, borderRadius: "50%", background: "rgba(212,165,116,0.08)", border: "1px solid rgba(212,165,116,0.3)", backdropFilter: "blur(12px)", marginBottom: 8 }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 700, background: "linear-gradient(135deg, #d4a574 0%, #f0e6d3 40%, #d4a574 70%, #c9904a 100%)", backgroundSize: "300% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "goldShimmer 4s ease-in-out infinite" }}>
                    N &amp; S
                  </span>
                </div>
              </motion.div>

              {/* Names */}
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.7 }}
                style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem, 7vw, 3.5rem)", fontWeight: 800, letterSpacing: "0.06em", background: "linear-gradient(135deg, #d4a574 0%, #f0e6d3 45%, #d4a574 75%, #c9904a 100%)", backgroundSize: "300% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "goldShimmer 5s ease-in-out infinite", lineHeight: 1.15, marginBottom: 12 }}
              >
                {COUPLE.person1.name} &amp; {COUPLE.person2.name}
              </motion.h1>

              {/* "The Game" with typing effect */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(1.1rem, 3.5vw, 1.5rem)", color: "#8a8695", letterSpacing: "0.1em", marginBottom: 20, minHeight: "1.8em" }}
              >
                <TypingText text="The Game" />
              </motion.p>

              {/* Divider */}
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 1.8, duration: 0.6 }}
                style={{ width: 80, height: 1, background: "linear-gradient(90deg, transparent, #d4a574, transparent)", margin: "0 auto 20px" }}
              />

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.0, duration: 0.6 }}
                style={{ color: "#8a8695", fontSize: "0.875rem", letterSpacing: "0.05em", lineHeight: 1.7 }}
              >
                7 rounds. 1 leaderboard. Infinite fun.
                <br />
                <span style={{ color: "#6a6478" }}>Play all night and compete for the crown.</span>
              </motion.p>
            </motion.div>

            {/* Registration form */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-sm"
            >
              <GuestRegistration />
            </motion.div>
          </div>
        </motion.div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @keyframes goldShimmer {
          0%, 100% { background-position: 200% center; }
          50%       { background-position: -200% center; }
        }
        @keyframes scoreGlow {
          0%, 100% { text-shadow: 0 0 20px rgba(212,165,116,0.3), 0 0 40px rgba(212,165,116,0.15); }
          50%       { text-shadow: 0 0 30px rgba(212,165,116,0.5), 0 0 60px rgba(212,165,116,0.25); }
        @keyframes introGlow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        @keyframes introShimmer {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        @keyframes softPulse {
          0%, 100% { opacity: 0.12; transform: scale(1); }
          50%       { opacity: 0.22; transform: scale(1.06); }
        }
      `}</style>

      {/* === INTRO OVERLAY (plays for returning users too) === */}
      <AnimatePresence>
        {!introDone && (
          <motion.div
            key="intro-overlay-hub"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed", inset: 0, zIndex: 9999,
              backgroundColor: "#0a0a1a",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", width: "60vw", height: "60vw", maxWidth: 500, maxHeight: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,165,116,0.12) 0%, rgba(139,92,246,0.04) 50%, transparent 70%)", animation: "introGlow 4s ease-in-out infinite", pointerEvents: "none" }} />

            <motion.div initial={{ scaleX: 0, opacity: 0 }} animate={introStep >= 1 ? { scaleX: 1, opacity: 1 } : {}} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} style={{ width: 120, height: 1, background: "linear-gradient(90deg, transparent, #d4a574, transparent)", marginBottom: 32 }} />

            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, fontFamily: "var(--font-display)", fontSize: "clamp(3rem, 12vw, 6rem)", fontWeight: 700, letterSpacing: "0.06em", lineHeight: 1 }}>
              <motion.span initial={{ opacity: 0, x: -30 }} animate={introStep >= 2 ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} style={{ background: "linear-gradient(135deg, #d4a574 0%, #f0e6d3 40%, #d4a574 80%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>N</motion.span>
              <motion.span initial={{ opacity: 0, scale: 0.3 }} animate={introStep >= 3 ? { opacity: 1, scale: 1 } : {}} transition={{ type: "spring", stiffness: 200, damping: 15 }} style={{ fontSize: "clamp(1.5rem, 5vw, 2.5rem)", color: "#8a8695" }}>&amp;</motion.span>
              <motion.span initial={{ opacity: 0, x: 30 }} animate={introStep >= 2 ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }} style={{ background: "linear-gradient(135deg, #d4a574 0%, #f0e6d3 40%, #d4a574 80%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>S</motion.span>
            </div>

            <motion.div initial={{ scaleX: 0, opacity: 0 }} animate={introStep >= 3 ? { scaleX: 1, opacity: 1 } : {}} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} style={{ width: 200, height: 1, background: "linear-gradient(90deg, transparent 0%, rgba(212,165,116,0.6) 30%, #d4a574 50%, rgba(212,165,116,0.6) 70%, transparent 100%)", marginBottom: 28 }} />

            <motion.div initial={{ opacity: 0, y: 16 }} animate={introStep >= 4 ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.4rem, 5vw, 2.2rem)", fontWeight: 600, letterSpacing: "0.12em", textAlign: "center" }}>
              <span style={{ background: "linear-gradient(135deg, #e8c99a 0%, #d4a574 30%, #f0e6d3 60%, #d4a574 100%)", backgroundSize: "300% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "introShimmer 3s ease-in-out infinite" }}>Nima &amp; Saba</span>
            </motion.div>

            <motion.p initial={{ opacity: 0, y: 12 }} animate={introStep >= 5 ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: "easeOut" }} style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(0.9rem, 3vw, 1.15rem)", color: "#8a8695", letterSpacing: "0.15em", marginTop: 12 }}>
              invite you to play
            </motion.p>

            <motion.div initial={{ opacity: 0 }} animate={introStep >= 5 ? { opacity: 1 } : {}} transition={{ duration: 0.5, delay: 0.3 }} style={{ display: "flex", gap: 8, marginTop: 32 }}>
              {[0, 1, 2].map((i) => (
                <motion.div key={i} initial={{ scale: 0 }} animate={introStep >= 5 ? { scale: 1 } : {}} transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.4 + i * 0.1 }} style={{ width: i === 1 ? 6 : 4, height: i === 1 ? 6 : 4, borderRadius: "50%", backgroundColor: i === 1 ? "#d4a574" : "rgba(212,165,116,0.4)" }} />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ backgroundColor: "#0a0a1a", minHeight: "100vh", position: "relative" }}>

        {/* Ambient glow */}
        <div style={{
          position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)",
          width: 800, height: 400, borderRadius: "0 0 50% 50%",
          background: "radial-gradient(ellipse, rgba(212,165,116,0.07) 0%, transparent 70%)",
          animation: "softPulse 7s ease-in-out infinite",
          pointerEvents: "none", zIndex: 0,
        }} />

        {/* Sticky frosted header */}
        <div style={{
          position: "sticky", top: 0, zIndex: 50,
          background: "rgba(10,10,26,0.75)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(212,165,116,0.12)",
        }}>
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
            {/* Guest name */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span style={{ fontSize: "0.8rem", color: "#8a8695", display: "block", lineHeight: 1.2 }}>
                Welcome back
              </span>
              <span style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#f0e6d3",
                letterSpacing: "0.02em",
              }}>
                {guest?.name}
              </span>
            </motion.div>

            {/* Monogram center */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{ textAlign: "center" }}
            >
              <span style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.1rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                background: "linear-gradient(135deg, #d4a574 0%, #f0e6d3 50%, #d4a574 100%)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "goldShimmer 4s ease-in-out infinite",
              }}>
                N &amp; S
              </span>
              <div style={{
                width: 24, height: 1,
                background: "linear-gradient(90deg, transparent, rgba(212,165,116,0.5), transparent)",
                margin: "2px auto 0",
              }} />
            </motion.div>

            {/* Leaderboard toggle */}
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              onClick={() => setShowLeaderboard(!showLeaderboard)}
              style={{
                fontSize: "0.8rem",
                fontWeight: 600,
                color: showLeaderboard ? "#f0e6d3" : "#d4a574",
                letterSpacing: "0.03em",
                background: showLeaderboard
                  ? "rgba(212,165,116,0.15)"
                  : "transparent",
                border: "1px solid rgba(212,165,116,0.25)",
                borderRadius: 20,
                padding: "5px 12px",
                cursor: "pointer",
                transition: "all 0.25s ease",
              }}
            >
              {showLeaderboard ? "Games" : "Scores"}
            </motion.button>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-lg mx-auto px-4 py-6 relative z-10">
          <AnimatePresence mode="wait">
            {showLeaderboard ? (
              <motion.div
                key="leaderboard"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.6rem",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    background: "linear-gradient(135deg, #d4a574 0%, #f0e6d3 50%, #d4a574 100%)",
                    backgroundSize: "200% 100%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    animation: "goldShimmer 4s ease-in-out infinite",
                    textAlign: "center",
                    marginBottom: 24,
                  }}
                >
                  Leaderboard
                </h2>
                <Leaderboard entries={[]} />
              </motion.div>
            ) : (
              <motion.div
                key="games"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                {/* Score banner */}
                <motion.div
                  initial={{ opacity: 0, y: -12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    border: "1px solid rgba(212,165,116,0.15)",
                    borderRadius: 20,
                    padding: "20px 24px",
                    textAlign: "center",
                    marginBottom: 24,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Subtle inner glow */}
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "radial-gradient(ellipse at 50% 0%, rgba(212,165,116,0.07) 0%, transparent 60%)",
                    pointerEvents: "none",
                  }} />

                  <p style={{
                    fontSize: "0.7rem",
                    color: "#8a8695",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    marginBottom: 6,
                  }}>
                    Your Score
                  </p>
                  <p style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "2.75rem",
                    fontWeight: 800,
                    background: "linear-gradient(135deg, #d4a574 0%, #f0e6d3 45%, #d4a574 80%, #c9904a 100%)",
                    backgroundSize: "200% 100%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    animation: "goldShimmer 5s ease-in-out infinite, scoreGlow 3s ease-in-out infinite",
                    fontVariantNumeric: "tabular-nums",
                    lineHeight: 1,
                    marginBottom: 6,
                  }}>
                    0
                  </p>
                  <p style={{
                    fontSize: "0.75rem",
                    color: "#6a6478",
                    letterSpacing: "0.05em",
                  }}>
                    pts &nbsp;&middot;&nbsp; Table {guest?.tableNumber}
                  </p>
                </motion.div>

                {/* Game list */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {gamesWithStatus.map((game, i) => (
                    <GameCard key={game.id} game={game} index={i} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
