import { getSquashScale } from "./feel";
import type { PlayerState, Rect } from "./physics";

export function render(
  context: CanvasRenderingContext2D,
  player: PlayerState,
  solids: readonly Rect[],
): void {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  context.fillStyle = "#73b85b";
  for (const solid of solids) context.fillRect(solid.x, solid.y, solid.width, solid.height);

  const scale = getSquashScale(player);
  const centerX = player.position.x + player.width / 2;
  const centerY = player.position.y + player.height;
  context.save();
  context.translate(centerX, centerY);
  context.scale(scale.x, scale.y);
  context.fillStyle = "#e85d9e";
  context.beginPath();
  context.ellipse(0, -player.height / 2, player.width / 2, player.height / 2, 0, 0, Math.PI * 2);
  context.fill();
  context.restore();
}
