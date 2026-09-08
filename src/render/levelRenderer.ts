import type { LevelData, Rect } from "../types/level";
import type { Position } from "../types/level";

export interface RenderContext {
  fillStyle: string;
  strokeStyle: string;
  lineWidth: number;
  fillRect(x: number, y: number, width: number, height: number): void;
  strokeRect(x: number, y: number, width: number, height: number): void;
  beginPath(): void;
  moveTo(x: number, y: number): void;
  lineTo(x: number, y: number): void;
  closePath(): void;
  fill(): void;
}

export function renderLevel(
  context: RenderContext,
  level: LevelData,
  camera: Position = { x: 0, y: 0 },
): void {
  for (const platform of level.platforms) {
    drawRect(context, platform, camera, "#5b3b83", "#2d1e43");
  }
  for (const obstacle of level.obstacles) {
    drawRect(context, obstacle, camera, obstacle.type === "crate" ? "#e28b35" : "#6c728a", "#382d50");
  }
  for (const hazard of level.hazards) {
    if (hazard.type === "spikes") {
      drawSpikes(context, hazard, camera);
    } else {
      drawRect(context, hazard, camera, "#35203d", "#1b1325");
    }
  }
  drawRect(context, level.goal, camera, "#f5d547", "#9f7321");
}

function drawRect(context: RenderContext, rect: Rect, camera: Position, fill: string, stroke: string): void {
  context.fillStyle = fill;
  context.strokeStyle = stroke;
  context.lineWidth = 2;
  context.fillRect(rect.x - camera.x, rect.y - camera.y, rect.width, rect.height);
  context.strokeRect(rect.x - camera.x, rect.y - camera.y, rect.width, rect.height);
}

function drawSpikes(context: RenderContext, rect: Rect, camera: Position): void {
  const left = rect.x - camera.x;
  const top = rect.y - camera.y;
  const step = rect.width / 4;
  context.fillStyle = "#ef5b72";
  context.beginPath();
  context.moveTo(left, top + rect.height);
  for (let index = 0; index < 4; index += 1) {
    context.lineTo(left + step * index + step / 2, top);
    context.lineTo(left + step * (index + 1), top + rect.height);
  }
  context.closePath();
  context.fill();
}
