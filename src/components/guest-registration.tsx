"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Transition } from "framer-motion";
import { useGuest } from "@/lib/guest-context";
import { supabase } from "@/lib/supabase";

export function GuestRegistration() {
  const { setGuest } = useGuest();
  const [name, setName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !tableNumber.trim()) {
      setError("Please enter your name and table number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data, error: dbError } = await supabase
        .from("guests")
        .insert({
          name: name.trim(),
          table_number: parseInt(tableNumber),
          total_score: 0,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      setGuest({
        id: data.id,
        name: data.name,
        tableNumber: data.table_number,
      });
    } catch {
      // Fallback: use local ID if Supabase isn't configured yet
      const localId = `local_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      setGuest({
        id: localId,
        name: name.trim(),
        tableNumber: parseInt(tableNumber),
      });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (fieldName: string): React.CSSProperties => ({
    width: "100%",
    padding: "14px 18px",
    borderRadius: "12px",
    border: `1px solid ${focusedField === fieldName ? "#d4a574" : "rgba(255,255,255,0.08)"}`,
    background: "rgba(255,255,255,0.03)",
    color: "#f0e6d3",
    fontSize: "16px",
    outline: "none",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    boxShadow:
      focusedField === fieldName
        ? "0 0 0 3px rgba(212,165,116,0.15), inset 0 1px 0 rgba(255,255,255,0.04)"
        : "inset 0 1px 0 rgba(255,255,255,0.04)",
    boxSizing: "border-box",
  });

  const cardTransition: Transition = {
    duration: 0.7,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  };

  const ringTransition: Transition = {
    delay: 0.25,
    type: "spring",
    stiffness: 180,
    damping: 14,
  };

  const fieldTransition = (i: number): Transition => ({
    delay: 0.45 + i * 0.1,
    duration: 0.45,
    ease: "easeOut",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={cardTransition}
      className="w-full max-w-md mx-auto"
    >
      {/* Frosted glass card */}
      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "24px",
          padding: "48px 40px 40px",
          boxShadow:
            "0 32px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)",
        }}
      >
        {/* Header */}
        <div className="text-center" style={{ marginBottom: "36px" }}>
          {/* Ring SVG */}
          <motion.div
            initial={{ scale: 0, rotate: -30, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={ringTransition}
            style={{ marginBottom: "20px" }}
          >
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ margin: "0 auto", display: "block" }}
            >
              <defs>
                <linearGradient
                  id="ringGradient"
                  x1="16"
                  y1="20"
                  x2="48"
                  y2="52"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#f0d99e" />
                  <stop offset="50%" stopColor="#d4a574" />
                  <stop offset="100%" stopColor="#c49660" />
                </linearGradient>
                <linearGradient
                  id="diamondGradient"
                  x1="27"
                  y1="8"
                  x2="37"
                  y2="22"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="40%" stopColor="#e8f4ff" />
                  <stop offset="100%" stopColor="#b8d4f0" />
                </linearGradient>
              </defs>
              {/* Ring band */}
              <circle
                cx="32"
                cy="38"
                r="16"
                stroke="url(#ringGradient)"
                strokeWidth="4"
                fill="none"
              />
              {/* Band highlight arc */}
              <path
                d="M 20 38 Q 32 30 44 38"
                stroke="url(#ringGradient)"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
              {/* Diamond stone */}
              <polygon
                points="32,8 38,18 32,23 26,18"
                fill="url(#diamondGradient)"
              />
              {/* Diamond facet highlight */}
              <polygon
                points="32,8 38,18 32,14"
                fill="rgba(255,255,255,0.4)"
              />
              {/* Diamond bottom dark */}
              <polygon
                points="32,23 38,18 32,20"
                fill="rgba(0,0,0,0.15)"
              />
            </svg>
          </motion.div>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "28px",
              fontWeight: 600,
              color: "#f0e6d3",
              letterSpacing: "0.02em",
              marginBottom: "10px",
              margin: "0 0 10px",
            }}
          >
            Welcome
          </h2>
          <p
            style={{
              color: "#8a8695",
              fontSize: "15px",
              lineHeight: "1.5",
              margin: 0,
            }}
          >
            Enter your name to join the celebration
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Name field */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={fieldTransition(0)}
            >
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#8a8695",
                  marginBottom: "8px",
                }}
              >
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
                placeholder="e.g. Sarah"
                style={inputStyle("name")}
                autoFocus
                autoComplete="given-name"
              />
            </motion.div>

            {/* Table number field */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={fieldTransition(1)}
            >
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#8a8695",
                  marginBottom: "8px",
                }}
              >
                Table Number
              </label>
              <input
                type="number"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                onFocus={() => setFocusedField("table")}
                onBlur={() => setFocusedField(null)}
                placeholder="e.g. 5"
                min="1"
                max="50"
                style={inputStyle("table")}
              />
            </motion.div>

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  color: "#e07070",
                  fontSize: "13px",
                  textAlign: "center",
                  margin: 0,
                }}
              >
                {error}
              </motion.p>
            )}

            {/* Submit button */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={fieldTransition(2)}
              style={{ marginTop: "4px" }}
            >
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={
                  !loading
                    ? {
                        scale: 1.02,
                        boxShadow: "0 0 32px rgba(212,165,116,0.5)",
                      }
                    : {}
                }
                whileTap={!loading ? { scale: 0.97 } : {}}
                style={{
                  width: "100%",
                  padding: "15px 24px",
                  borderRadius: "9999px",
                  border: "none",
                  background: loading
                    ? "rgba(212,165,116,0.4)"
                    : "linear-gradient(135deg, #d4a574 0%, #c49660 100%)",
                  color: "#0a0a1a",
                  fontSize: "16px",
                  fontWeight: 700,
                  letterSpacing: "0.02em",
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: loading
                    ? "none"
                    : "0 0 20px rgba(212,165,116,0.3), 0 4px 16px rgba(0,0,0,0.3)",
                  transition: "background 0.2s ease, box-shadow 0.2s ease",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Joining..." : "Let's Play! ✨"}
              </motion.button>
            </motion.div>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
