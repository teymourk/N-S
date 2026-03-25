"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IntroSequenceProps {
  children: React.ReactNode;
}

export function IntroSequence({ children }: IntroSequenceProps) {
  const [phase, setPhase] = useState<"intro" | "done">("intro");
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Step timeline
    const timers = [
      setTimeout(() => setStep(1), 400),    // Gold line draws
      setTimeout(() => setStep(2), 1200),    // "N" and "S" appear
      setTimeout(() => setStep(3), 2000),    // "&" sparkles in
      setTimeout(() => setStep(4), 2800),    // Full names reveal
      setTimeout(() => setStep(5), 3800),    // "invite you to play"
      setTimeout(() => setStep(6), 5000),    // Begin fade out
      setTimeout(() => setPhase("done"), 5800), // Show content
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <>
      <AnimatePresence>
        {phase === "intro" && (
          <motion.div
            key="intro"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              backgroundColor: "#0a0a1a",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {/* Ambient glow behind everything */}
            <div
              style={{
                position: "absolute",
                width: "60vw",
                height: "60vw",
                maxWidth: 500,
                maxHeight: 500,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(212,165,116,0.12) 0%, rgba(139,92,246,0.04) 50%, transparent 70%)",
                animation: "introGlow 4s ease-in-out infinite",
                pointerEvents: "none",
              }}
            />

            {/* Horizontal gold line */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={
                step >= 1
                  ? { scaleX: 1, opacity: 1 }
                  : { scaleX: 0, opacity: 0 }
              }
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: 120,
                height: 1,
                background:
                  "linear-gradient(90deg, transparent, #d4a574, transparent)",
                marginBottom: 32,
              }}
            />

            {/* Monogram: N & S */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 24,
                fontFamily: "var(--font-display)",
                fontSize: "clamp(3rem, 12vw, 6rem)",
                fontWeight: 700,
                letterSpacing: "0.06em",
                lineHeight: 1,
              }}
            >
              {/* N */}
              <motion.span
                initial={{ opacity: 0, x: -30 }}
                animate={
                  step >= 2
                    ? { opacity: 1, x: 0 }
                    : { opacity: 0, x: -30 }
                }
                transition={{
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  background:
                    "linear-gradient(135deg, #d4a574 0%, #f0e6d3 40%, #d4a574 80%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                N
              </motion.span>

              {/* & with sparkle */}
              <motion.span
                initial={{ opacity: 0, scale: 0.3, rotate: -20 }}
                animate={
                  step >= 3
                    ? { opacity: 1, scale: 1, rotate: 0 }
                    : { opacity: 0, scale: 0.3, rotate: -20 }
                }
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
                style={{
                  fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
                  color: "#8a8695",
                  position: "relative",
                }}
              >
                <span>&</span>
                {/* Sparkle particles */}
                {step >= 3 && (
                  <>
                    {[...Array(6)].map((_, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 1, scale: 1 }}
                        animate={{
                          opacity: 0,
                          scale: 0,
                          x: Math.cos((i * Math.PI) / 3) * 40,
                          y: Math.sin((i * Math.PI) / 3) * 40,
                        }}
                        transition={{
                          duration: 0.8,
                          delay: i * 0.05,
                          ease: "easeOut",
                        }}
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          width: 3,
                          height: 3,
                          borderRadius: "50%",
                          backgroundColor: "#d4a574",
                          pointerEvents: "none",
                        }}
                      />
                    ))}
                  </>
                )}
              </motion.span>

              {/* S */}
              <motion.span
                initial={{ opacity: 0, x: 30 }}
                animate={
                  step >= 2
                    ? { opacity: 1, x: 0 }
                    : { opacity: 0, x: 30 }
                }
                transition={{
                  duration: 0.7,
                  delay: 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  background:
                    "linear-gradient(135deg, #d4a574 0%, #f0e6d3 40%, #d4a574 80%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                S
              </motion.span>
            </div>

            {/* Decorative expanding line */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={
                step >= 3
                  ? { scaleX: 1, opacity: 1 }
                  : { scaleX: 0, opacity: 0 }
              }
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: 200,
                height: 1,
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(212,165,116,0.6) 30%, #d4a574 50%, rgba(212,165,116,0.6) 70%, transparent 100%)",
                marginBottom: 28,
              }}
            />

            {/* Full names */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={
                step >= 4
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 16 }
              }
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.4rem, 5vw, 2.2rem)",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textAlign: "center",
                lineHeight: 1.3,
              }}
            >
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #e8c99a 0%, #d4a574 30%, #f0e6d3 60%, #d4a574 100%)",
                  backgroundSize: "300% 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  animation: "introShimmer 3s ease-in-out infinite",
                }}
              >
                Nima & Saba
              </span>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={
                step >= 5
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 12 }
              }
              transition={{ duration: 0.7, ease: "easeOut" }}
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "clamp(0.9rem, 3vw, 1.15rem)",
                color: "#8a8695",
                letterSpacing: "0.15em",
                marginTop: 12,
              }}
            >
              invite you to play
            </motion.p>

            {/* Bottom decorative dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={step >= 5 ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{
                display: "flex",
                gap: 8,
                marginTop: 32,
              }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={step >= 5 ? { scale: 1 } : { scale: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                    delay: 0.4 + i * 0.1,
                  }}
                  style={{
                    width: i === 1 ? 6 : 4,
                    height: i === 1 ? 6 : 4,
                    borderRadius: "50%",
                    backgroundColor:
                      i === 1 ? "#d4a574" : "rgba(212,165,116,0.4)",
                  }}
                />
              ))}
            </motion.div>

            {/* Injected keyframes */}
            <style>{`
              @keyframes introGlow {
                0%, 100% { opacity: 0.6; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.1); }
              }
              @keyframes introShimmer {
                0% { background-position: 200% center; }
                100% { background-position: -200% center; }
              }
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content — always mounted but hidden behind intro */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={phase === "done" ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {children}
      </motion.div>
    </>
  );
}
