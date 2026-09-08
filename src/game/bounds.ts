import type { LevelBounds, Position, Size } from "../types/level";

/**
 * Applies the level's invisible solid boundary after physics integration.
 * This intentionally does not treat falling out of the level as failure.
 */
export function clampToLevelBounds(
  position: Position,
  actorSize: Size,
  bounds: LevelBounds,
): Position {
  const maxX = Math.max(bounds.min.x, bounds.max.x - actorSize.width);
  const maxY = Math.max(bounds.min.y, bounds.max.y - actorSize.height);
  return {
    x: clamp(position.x, bounds.min.x, maxX),
    y: clamp(position.y, bounds.min.y, maxY),
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
