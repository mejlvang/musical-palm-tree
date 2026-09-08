import type { LevelData, Position } from "../types/level";

export function getPlayerSpawn(level: LevelData): Position {
  return { ...level.start };
}
