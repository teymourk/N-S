"use client";

import { GameLayout } from "@/components/game-layout";

export default function GamePage() {
  return (
    <GameLayout title="Loading..." subtitle="" emoji="">
      <div className="text-center py-12">
        <p className="text-charcoal-light">Building this game...</p>
      </div>
    </GameLayout>
  );
}
