"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useGuest } from "@/lib/guest-context";
import { supabase } from "@/lib/supabase";

export function GuestRegistration() {
  const { setGuest } = useGuest();
  const [name, setName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-md mx-auto"
    >
      <div className="card-game p-8">
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="text-5xl mb-4"
          >
            💍
          </motion.div>
          <h2 className="text-2xl font-bold text-charcoal" style={{ fontFamily: "var(--font-display)" }}>
            Welcome!
          </h2>
          <p className="text-charcoal-light mt-2">
            Enter your name to join the fun
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal-light mb-1">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sarah"
              className="w-full px-4 py-3 rounded-xl border border-cream-dark
                         bg-white focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20
                         outline-none transition-all text-charcoal"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal-light mb-1">
              Table Number
            </label>
            <input
              type="number"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="e.g. 5"
              min="1"
              max="50"
              className="w-full px-4 py-3 rounded-xl border border-cream-dark
                         bg-white focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20
                         outline-none transition-all text-charcoal"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary w-full text-lg disabled:opacity-50"
          >
            {loading ? "Joining..." : "Let's Play! 🎉"}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}
