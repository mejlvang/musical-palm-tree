import { createInput } from "./game/input";
import { testSolids } from "./game/level";
import { update, type PlayerState } from "./game/physics";
import { render } from "./game/renderer";

const canvas = document.querySelector<HTMLCanvasElement>("#game");
if (!canvas) throw new Error("Game canvas was not found");
const context = canvas.getContext("2d");
if (!context) throw new Error("2D canvas context is unavailable");
const gameContext = context;

const input = createInput();
let player: PlayerState = {
  position: { x: 80, y: 330 },
  velocity: { x: 0, y: 0 },
  width: 32,
  height: 40,
  grounded: false,
};
let previousTime = 0;

function frame(time: number): void {
  const dt = previousTime === 0 ? 0 : (time - previousTime) / 1000;
  previousTime = time;
  player = update(player, input.getState(), dt, testSolids);
  render(gameContext, player, testSolids);
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
