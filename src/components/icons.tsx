"use client";

import { motion } from "framer-motion";

// ─────────────────────────────────────────────────────────────
// Shared gradient defs for all icons
// ─────────────────────────────────────────────────────────────

const GOLD_GRADIENT_ID = "icon-gold-grad";
const GOLD_LIGHT_GRADIENT_ID = "icon-gold-light-grad";
const DIAMOND_GRADIENT_ID = "icon-diamond-grad";

export function IconGradientDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }}>
      <defs>
        <linearGradient id={GOLD_GRADIENT_ID} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f0d99e" />
          <stop offset="50%" stopColor="#d4a574" />
          <stop offset="100%" stopColor="#c49660" />
        </linearGradient>
        <linearGradient id={GOLD_LIGHT_GRADIENT_ID} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f5e6c8" />
          <stop offset="100%" stopColor="#d4a574" />
        </linearGradient>
        <linearGradient id={DIAMOND_GRADIENT_ID} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#e8f4ff" />
          <stop offset="100%" stopColor="#b8d4f0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Base icon props
// ─────────────────────────────────────────────────────────────

interface IconProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

const goldStroke = "url(#icon-gold-grad)";
const goldFill = "url(#icon-gold-grad)";

// ─────────────────────────────────────────────────────────────
// Game Icons
// ─────────────────────────────────────────────────────────────

// 💬 Who Said It → Elegant speech bubbles
export function ChatBubbleIcon({ size = 32, className, animated = true }: IconProps) {
  const svg = (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      {/* Back bubble */}
      <path
        d="M22 6H14C11.2 6 9 8.2 9 11V15C9 17.8 11.2 20 14 20H15L18 24L19 20H22C24.8 20 27 17.8 27 15V11C27 8.2 24.8 6 22 6Z"
        fill="rgba(212,165,116,0.15)"
        stroke={goldStroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Front bubble */}
      <path
        d="M18 12H10C7.2 12 5 14.2 5 17V21C5 23.8 7.2 26 10 26H11L14 29L15 26H18C20.8 26 23 23.8 23 21V17C23 14.2 20.8 12 18 12Z"
        fill="rgba(212,165,116,0.08)"
        stroke={goldStroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Dots in front bubble */}
      <circle cx="10.5" cy="19" r="1" fill={goldFill} opacity="0.7" />
      <circle cx="14" cy="19" r="1" fill={goldFill} opacity="0.7" />
      <circle cx="17.5" cy="19" r="1" fill={goldFill} opacity="0.7" />
    </svg>
  );

  if (!animated) return svg;
  return (
    <motion.div
      whileHover={{ scale: 1.1, rotate: [-2, 2, -2, 0] }}
      transition={{ rotate: { duration: 0.4 }, scale: { type: "spring", stiffness: 400 } }}
    >
      {svg}
    </motion.div>
  );
}

// 🧠 Trivia → Brain with sparkle
export function BrainIcon({ size = 32, className, animated = true }: IconProps) {
  const svg = (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      {/* Left hemisphere */}
      <path
        d="M16 28V16M16 16C16 16 10 15 8 12C6 9 7 5 10 4C13 3 15 5 16 7"
        stroke={goldStroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 12C5 13 4 16 5 19C6 22 9 23 12 22"
        stroke={goldStroke}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Right hemisphere */}
      <path
        d="M16 16C16 16 22 15 24 12C26 9 25 5 22 4C19 3 17 5 16 7"
        stroke={goldStroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 12C27 13 28 16 27 19C26 22 23 23 20 22"
        stroke={goldStroke}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Sparkle */}
      <path
        d="M26 3L26.8 5.2L29 6L26.8 6.8L26 9L25.2 6.8L23 6L25.2 5.2L26 3Z"
        fill="#f0d99e"
        opacity="0.9"
      />
    </svg>
  );

  if (!animated) return svg;
  return (
    <motion.div
      whileHover={{ scale: 1.12 }}
      transition={{ type: "spring", stiffness: 400 }}
      style={{ position: "relative" }}
    >
      {svg}
    </motion.div>
  );
}

// 📅 Timeline → Flowing timeline path
export function TimelineIcon({ size = 32, className, animated = true }: IconProps) {
  const svg = (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      {/* Vertical line */}
      <line x1="10" y1="4" x2="10" y2="28" stroke="rgba(212,165,116,0.3)" strokeWidth="1.5" />
      {/* Dots */}
      <circle cx="10" cy="8" r="2.5" fill={goldFill} />
      <circle cx="10" cy="16" r="2.5" fill={goldFill} />
      <circle cx="10" cy="24" r="2.5" fill={goldFill} />
      {/* Branch lines */}
      <line x1="13" y1="8" x2="26" y2="8" stroke={goldStroke} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="13" y1="16" x2="22" y2="16" stroke={goldStroke} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="13" y1="24" x2="24" y2="24" stroke={goldStroke} strokeWidth="1.2" strokeLinecap="round" />
      {/* Heart at top */}
      <path
        d="M26 6.5C26 5.5 25.2 5 24.5 5C23.5 5 23 5.8 23 6.5C23 5.8 22.5 5 21.5 5C20.8 5 20 5.5 20 6.5C20 8.5 23 10 23 10C23 10 26 8.5 26 6.5Z"
        fill={goldFill}
        opacity="0.8"
      />
    </svg>
  );

  if (!animated) return svg;
  return (
    <motion.div
      whileHover={{ scale: 1.1, y: -2 }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      {svg}
    </motion.div>
  );
}

// 🎲 Predictions → Elegant dice
export function DiceIcon({ size = 32, className, animated = true }: IconProps) {
  const svg = (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      {/* Dice body */}
      <rect
        x="4" y="4" width="24" height="24" rx="5"
        fill="rgba(212,165,116,0.1)"
        stroke={goldStroke}
        strokeWidth="1.5"
      />
      {/* Inner shine */}
      <rect
        x="5" y="5" width="22" height="12" rx="4"
        fill="rgba(255,255,255,0.04)"
      />
      {/* Dots */}
      <circle cx="11" cy="11" r="2" fill={goldFill} />
      <circle cx="21" cy="11" r="2" fill={goldFill} />
      <circle cx="16" cy="16" r="2" fill={goldFill} />
      <circle cx="11" cy="21" r="2" fill={goldFill} />
      <circle cx="21" cy="21" r="2" fill={goldFill} />
    </svg>
  );

  if (!animated) return svg;
  return (
    <motion.div
      whileHover={{ rotate: [0, -10, 10, -5, 0], scale: 1.1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {svg}
    </motion.div>
  );
}

// 🎬 Finish Sentence → Clapperboard
export function ClapperboardIcon({ size = 32, className, animated = true }: IconProps) {
  const svg = (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      {/* Board body */}
      <rect
        x="4" y="12" width="24" height="16" rx="3"
        fill="rgba(212,165,116,0.1)"
        stroke={goldStroke}
        strokeWidth="1.5"
      />
      {/* Clapper top */}
      <path
        d="M4 12L6 5H26L28 12"
        fill="rgba(212,165,116,0.15)"
        stroke={goldStroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Stripes on clapper */}
      <line x1="10" y1="5.5" x2="8.5" y2="12" stroke={goldStroke} strokeWidth="1.2" />
      <line x1="16" y1="5" x2="15" y2="12" stroke={goldStroke} strokeWidth="1.2" />
      <line x1="22" y1="5.5" x2="21.5" y2="12" stroke={goldStroke} strokeWidth="1.2" />
      {/* Play triangle */}
      <path
        d="M14 17L14 24L21 20.5L14 17Z"
        fill={goldFill}
        opacity="0.7"
      />
    </svg>
  );

  if (!animated) return svg;
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      {svg}
    </motion.div>
  );
}

// 👠 Shoe Game → Elegant high heel
export function HighHeelIcon({ size = 32, className, animated = true }: IconProps) {
  const svg = (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      <path
        d="M5 24H27C27 24 27 22 25 21C23 20 20 20 18 19C16 18 14 16 13 13C12 10 10 8 8 8C6 8 5 10 5 12V24Z"
        fill="rgba(212,165,116,0.12)"
        stroke={goldStroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Heel */}
      <path
        d="M5 24L5 28"
        stroke={goldStroke}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Sole */}
      <line x1="5" y1="24" x2="27" y2="24" stroke={goldStroke} strokeWidth="1.5" strokeLinecap="round" />
      {/* Sparkle on toe */}
      <circle cx="23" cy="22" r="1.2" fill="#f0d99e" opacity="0.8" />
    </svg>
  );

  if (!animated) return svg;
  return (
    <motion.div
      whileHover={{ scale: 1.1, rotate: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {svg}
    </motion.div>
  );
}

// 💌 Love Letter → Envelope with heart
export function LoveLetterIcon({ size = 32, className, animated = true }: IconProps) {
  const svg = (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      {/* Envelope body */}
      <rect
        x="3" y="9" width="26" height="18" rx="3"
        fill="rgba(212,165,116,0.1)"
        stroke={goldStroke}
        strokeWidth="1.5"
      />
      {/* Envelope flap */}
      <path
        d="M3 12L16 20L29 12"
        stroke={goldStroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Heart seal */}
      <path
        d="M19 5.5C19 4 17.8 3 16.8 3C15.5 3 15 4 15 5C15 4 14.5 3 13.2 3C12.2 3 11 4 11 5.5C11 8.5 15 11 15 11C15 11 19 8.5 19 5.5Z"
        fill={goldFill}
      />
    </svg>
  );

  if (!animated) return svg;
  return (
    <motion.div
      whileHover={{ scale: 1.1, y: -3 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
    >
      {svg}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// UI Icons
// ─────────────────────────────────────────────────────────────

// Lock icon
export function LockIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect
        x="5" y="11" width="14" height="10" rx="2.5"
        fill="rgba(212,165,116,0.15)"
        stroke="rgba(212,165,116,0.5)"
        strokeWidth="1.5"
      />
      <path
        d="M8 11V7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7V11"
        stroke="rgba(212,165,116,0.5)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="16" r="1.5" fill="rgba(212,165,116,0.6)" />
    </svg>
  );
}

// Checkmark icon
export function CheckIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <circle cx="8" cy="8" r="7" fill="rgba(110,231,183,0.15)" stroke="#6ee7b7" strokeWidth="1.2" />
      <path
        d="M4.5 8L7 10.5L11.5 5.5"
        stroke="#6ee7b7"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Sparkle icon
export function SparkleIcon({ size = 24, className, animated = true }: IconProps) {
  const svg = (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z"
        fill={goldFill}
        opacity="0.9"
      />
      <path
        d="M20 16L20.6 18.4L23 19L20.6 19.6L20 22L19.4 19.6L17 19L19.4 18.4L20 16Z"
        fill="#f0d99e"
        opacity="0.7"
      />
      <path
        d="M5 16L5.4 17.6L7 18L5.4 18.4L5 20L4.6 18.4L3 18L4.6 17.6L5 16Z"
        fill="#f0d99e"
        opacity="0.5"
      />
    </svg>
  );

  if (!animated) return svg;
  return (
    <motion.div
      animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      {svg}
    </motion.div>
  );
}

// Back arrow icon
export function BackArrowIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M12 4L6 10L12 16"
        stroke="#d4a574"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Trophy / crown for leaderboard header
export function TrophyIcon({ size = 28, className, animated = true }: IconProps) {
  const svg = (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className={className}>
      {/* Cup body */}
      <path
        d="M7 5H21V13C21 17.4 17.9 21 14 21C10.1 21 7 17.4 7 13V5Z"
        fill="rgba(212,165,116,0.15)"
        stroke={goldStroke}
        strokeWidth="1.5"
      />
      {/* Left handle */}
      <path
        d="M7 7H5C3.9 7 3 8 3 9V11C3 12.1 3.9 13 5 13H7"
        stroke={goldStroke}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Right handle */}
      <path
        d="M21 7H23C24.1 7 25 8 25 9V11C25 12.1 24.1 13 23 13H21"
        stroke={goldStroke}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Base */}
      <line x1="11" y1="24" x2="17" y2="24" stroke={goldStroke} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14" y1="21" x2="14" y2="24" stroke={goldStroke} strokeWidth="1.5" />
      {/* Star */}
      <path
        d="M14 9L15 11.5L17.5 11.8L15.7 13.5L16.2 16L14 14.8L11.8 16L12.3 13.5L10.5 11.8L13 11.5L14 9Z"
        fill="#f0d99e"
        opacity="0.8"
      />
    </svg>
  );

  if (!animated) return svg;
  return (
    <motion.div
      animate={{ y: [0, -2, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      {svg}
    </motion.div>
  );
}

// Medal icons for podium
export function GoldMedalIcon({ size = 28 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      {/* Ribbon */}
      <path d="M10 2L14 10L18 2" stroke="#d4a574" strokeWidth="2" fill="rgba(212,165,116,0.1)" />
      {/* Medal circle */}
      <circle cx="14" cy="17" r="8" fill="rgba(212,165,116,0.2)" stroke="#d4a574" strokeWidth="1.5" />
      <circle cx="14" cy="17" r="5.5" stroke="#f0d99e" strokeWidth="0.8" />
      {/* Star */}
      <path
        d="M14 12.5L15 15L17.5 15.3L15.7 17L16.2 19.5L14 18.3L11.8 19.5L12.3 17L10.5 15.3L13 15L14 12.5Z"
        fill="#f0d99e"
      />
    </svg>
  );
}

export function SilverMedalIcon({ size = 26 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 26 26" fill="none">
      {/* Ribbon */}
      <path d="M9 2L13 9L17 2" stroke="#c0c0c0" strokeWidth="1.8" fill="rgba(192,192,192,0.1)" />
      {/* Medal circle */}
      <circle cx="13" cy="16" r="7.5" fill="rgba(192,192,192,0.15)" stroke="#c0c0c0" strokeWidth="1.5" />
      <circle cx="13" cy="16" r="5" stroke="#d8d8d8" strokeWidth="0.8" />
      {/* Number */}
      <text x="13" y="18.5" textAnchor="middle" fontSize="8" fontWeight="700" fill="#d8d8d8" fontFamily="var(--font-display)">2</text>
    </svg>
  );
}

export function BronzeMedalIcon({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Ribbon */}
      <path d="M8 2L12 8L16 2" stroke="#cd7f32" strokeWidth="1.5" fill="rgba(205,127,50,0.1)" />
      {/* Medal circle */}
      <circle cx="12" cy="15" r="7" fill="rgba(205,127,50,0.15)" stroke="#cd7f32" strokeWidth="1.5" />
      <circle cx="12" cy="15" r="4.5" stroke="#daa06d" strokeWidth="0.8" />
      {/* Number */}
      <text x="12" y="17.5" textAnchor="middle" fontSize="7" fontWeight="700" fill="#daa06d" fontFamily="var(--font-display)">3</text>
    </svg>
  );
}

// Leaderboard/Scores icon
export function LeaderboardIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" className={className}>
      <rect x="1" y="10" width="4" height="7" rx="1" fill="rgba(212,165,116,0.4)" stroke="#d4a574" strokeWidth="0.8" />
      <rect x="7" y="4" width="4" height="13" rx="1" fill="rgba(212,165,116,0.6)" stroke="#d4a574" strokeWidth="0.8" />
      <rect x="13" y="7" width="4" height="10" rx="1" fill="rgba(212,165,116,0.3)" stroke="#d4a574" strokeWidth="0.8" />
      <path d="M9 1.5L9.6 3L11 3.2L10 4.1L10.3 5.5L9 4.8L7.7 5.5L8 4.1L7 3.2L8.4 3L9 1.5Z" fill="#f0d99e" />
    </svg>
  );
}

// Games grid icon
export function GamesGridIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" className={className}>
      <rect x="1" y="1" width="7" height="7" rx="2" stroke="#d4a574" strokeWidth="1.2" fill="rgba(212,165,116,0.1)" />
      <rect x="10" y="1" width="7" height="7" rx="2" stroke="#d4a574" strokeWidth="1.2" fill="rgba(212,165,116,0.1)" />
      <rect x="1" y="10" width="7" height="7" rx="2" stroke="#d4a574" strokeWidth="1.2" fill="rgba(212,165,116,0.1)" />
      <rect x="10" y="10" width="7" height="7" rx="2" stroke="#d4a574" strokeWidth="1.2" fill="rgba(212,165,116,0.1)" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Icon Registry — maps GameId to icon component
// ─────────────────────────────────────────────────────────────

import { GameId } from "@/types";

const GAME_ICON_MAP: Record<GameId, React.FC<IconProps>> = {
  "who-said-it": ChatBubbleIcon,
  trivia: BrainIcon,
  timeline: TimelineIcon,
  predictions: DiceIcon,
  "finish-sentence": ClapperboardIcon,
  "shoe-game": HighHeelIcon,
  "love-letter": LoveLetterIcon,
};

export function GameIcon({
  gameId,
  size = 32,
  className,
  animated = true,
}: IconProps & { gameId: GameId }) {
  const IconComponent = GAME_ICON_MAP[gameId];
  if (!IconComponent) return null;
  return <IconComponent size={size} className={className} animated={animated} />;
}
