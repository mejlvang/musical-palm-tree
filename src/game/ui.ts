import { instructions } from "./input";
import type { GameState } from "./stateMachine";

export interface ScreenActions {
  start(): void;
  pause(): void;
  resume(): void;
  restart(): void;
}

function button(
  label: string,
  action: () => void,
  className = "game-button",
): HTMLButtonElement {
  const element = document.createElement("button");
  element.type = "button";
  element.className = className;
  element.textContent = label;
  element.addEventListener("click", action);
  return element;
}

function startScreen(actions: ScreenActions): HTMLElement {
  const screen = document.createElement("section");
  screen.className = "screen start-screen";
  screen.innerHTML = `
    <h1>McSquishy: Blob on the Run</h1>
    <p>Guide McSquishy through the strange and hazardous world.</p>
    <ul class="instructions"></ul>
    <p class="prompt">Press Space or Enter, or click Start</p>
  `;
  const list = screen.querySelector(".instructions");
  instructions().forEach(({ action, keys }) => {
    const item = document.createElement("li");
    item.textContent = `${action}: ${keys}`;
    list?.append(item);
  });
  screen.append(button("Start", actions.start));
  return screen;
}

function playingScreen(): HTMLElement {
  const screen = document.createElement("section");
  screen.className = "screen playing-screen";
  screen.innerHTML = `
    <h2>McSquishy is on the run!</h2>
    <p class="game-placeholder">Gameplay area</p>
    <p>Press Escape or P to pause.</p>
  `;
  return screen;
}

function pausedOverlay(actions: ScreenActions): HTMLElement {
  const overlay = document.createElement("div");
  overlay.className = "overlay paused-overlay";
  overlay.innerHTML = "<h2>Paused</h2><p>Take a breather, blob.</p>";
  overlay.append(button("Resume", actions.resume));
  return overlay;
}

function resultScreen(
  title: string,
  message: string,
  actions: ScreenActions,
): HTMLElement {
  const screen = document.createElement("section");
  screen.className = "screen result-screen";
  screen.innerHTML = `<h1>${title}</h1><p>${message}</p>`;
  screen.append(button("Restart", actions.restart));
  return screen;
}

export function renderGame(
  container: HTMLElement,
  state: GameState,
  actions: ScreenActions,
): void {
  container.replaceChildren();
  if (state === "start") {
    container.append(startScreen(actions));
  } else if (state === "playing") {
    container.append(playingScreen());
  } else if (state === "paused") {
    container.append(playingScreen(), pausedOverlay(actions));
  } else if (state === "gameOver") {
    container.append(
      resultScreen("Game Over", "McSquishy could not make it this time.", actions),
    );
  } else {
    container.append(
      resultScreen(
        "Level Complete!",
        "McSquishy made it to the end of the level.",
        actions,
      ),
    );
  }
}
