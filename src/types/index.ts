// ============================================
// Nima & Saba Wedding Game — Type Definitions
// ============================================

export type GameId =
  | "who-said-it"
  | "trivia"
  | "timeline"
  | "predictions"
  | "finish-sentence"
  | "shoe-game"
  | "love-letter";

export type GameStatus = "locked" | "active" | "completed";

export interface GameConfig {
  id: GameId;
  title: string;
  subtitle: string;
  emoji: string;
  description: string;
  pointsPerCorrect: number;
  route: string;
  status: GameStatus;
  order: number;
}

export interface Guest {
  id: string;
  name: string;
  table_number: number;
  created_at: string;
  total_score: number;
}

export interface LeaderboardEntry {
  guest_id: string;
  guest_name: string;
  table_number: number;
  total_score: number;
  games_played: number;
}

// Game 1: Who Said It
export interface WhoSaidItQuestion {
  id: string;
  quote: string;
  said_by: "nima" | "saba";
  context?: string;
}

// Game 2: Trivia
export interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  correct_index: number;
  image_url?: string;
  time_limit_seconds: number;
  points: number;
}

// Game 3: Timeline
export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  image_url?: string;
  order: number;
}

// Game 4: Predictions
export interface Prediction {
  id: string;
  question: string;
  type: "over_under" | "yes_no" | "multiple_choice";
  threshold?: number;
  options?: string[];
  correct_answer?: string;
  resolved: boolean;
}

export interface PredictionAnswer {
  id: string;
  guest_id: string;
  prediction_id: string;
  answer: string;
  points_earned: number;
}

// Game 5: Finish Their Sentence
export interface SentencePrompt {
  id: string;
  starter_text: string;
  video_url?: string;
  actual_answer: string;
  said_by: "nima" | "saba";
}

// Game 6: Shoe Game
export interface ShoeGameQuestion {
  id: string;
  question: string;
  status: "pending" | "active" | "revealed";
  correct_answer?: "nima" | "saba" | "both";
}

// Game 7: Love Letter
export interface LoveLetter {
  id: string;
  guest_id: string;
  guest_name: string;
  message: string;
  open_on: "1year" | "5year" | "10year" | "25year";
  created_at: string;
}

// Admin
export interface AdminState {
  active_game: GameId | null;
  games: Record<GameId, GameStatus>;
  shoe_game_current_question: string | null;
}
