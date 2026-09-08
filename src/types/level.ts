export interface Vector2 {
  x: number;
  y: number;
}

export type Position = Vector2;

export interface Size {
  width: number;
  height: number;
}

export interface Rect extends Position, Size {}

export interface PlatformDef extends Rect {
  id: string;
  kind?: "static" | "moving";
}

export type ObstacleType = "crate" | "wall";

export interface ObstacleDef extends Rect {
  id: string;
  type: ObstacleType;
  solid: true;
}

export type HazardType = "spikes" | "pit";

export interface HazardDef extends Rect {
  id: string;
  type: HazardType;
}

export interface GoalDef extends Rect {
  id: string;
}

export interface LevelBounds {
  min: Position;
  max: Position;
}

export interface LevelData {
  id: string;
  name: string;
  start: Position;
  goal: GoalDef;
  bounds: LevelBounds;
  platforms: readonly PlatformDef[];
  obstacles: readonly ObstacleDef[];
  hazards: readonly HazardDef[];
}
