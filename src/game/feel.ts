import type { PlayerState } from "./physics";

export function getSquashScale(state: PlayerState, justLanded = false): { x: number; y: number } {
  if (justLanded) return { x: 1.18, y: 0.82 };
  if (state.velocity.y < 0) return { x: 0.9, y: 1.1 };
  if (state.velocity.y > 300) return { x: 1.08, y: 0.92 };
  return { x: 1, y: 1 };
}
