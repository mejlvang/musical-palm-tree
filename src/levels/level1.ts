import type { LevelData } from "../types/level";

/**
 * The first level uses world coordinates in pixels. The level is deliberately
 * wider than the viewport so it can demonstrate horizontal camera scrolling.
 */
export const level1: LevelData = {
  id: "level-1",
  name: "The Wobbleway",
  start: { x: 96, y: 420 },
  bounds: {
    min: { x: 0, y: 0 },
    max: { x: 3200, y: 720 },
  },
  platforms: [
    { id: "ground-start", x: 0, y: 520, width: 640, height: 40 },
    { id: "step-one", x: 760, y: 460, width: 260, height: 32 },
    { id: "step-two", x: 1120, y: 390, width: 260, height: 32 },
    { id: "middle-ground", x: 1480, y: 500, width: 520, height: 40 },
    { id: "high-road", x: 2140, y: 420, width: 360, height: 32 },
    { id: "goal-ground", x: 2650, y: 520, width: 550, height: 40 },
  ],
  obstacles: [
    { id: "wobble-crate", type: "crate", solid: true, x: 420, y: 456, width: 64, height: 64 },
    { id: "goal-wall", type: "wall", solid: true, x: 2920, y: 456, width: 40, height: 64 },
  ],
  hazards: [
    { id: "first-spikes", type: "spikes", x: 560, y: 488, width: 64, height: 32 },
    { id: "squish-pit", type: "pit", x: 1020, y: 488, width: 100, height: 32 },
    { id: "second-spikes", type: "spikes", x: 1940, y: 468, width: 96, height: 32 },
  ],
  goal: {
    id: "finish-flag",
    x: 3060,
    y: 440,
    width: 48,
    height: 80,
  },
};

export default level1;
