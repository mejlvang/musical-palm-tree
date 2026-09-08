import level1 from "./level1";
import type { LevelData } from "../types/level";

const levels: Readonly<Record<string, LevelData>> = {
  [level1.id]: level1,
};

export function loadLevel(id = level1.id): LevelData {
  const level = levels[id];
  if (!level) {
    throw new Error(`Unknown level "${id}"`);
  }
  return level;
}

export function getFirstLevel(): LevelData {
  return level1;
}
