import { isActionKey } from "./game/input";
import { createGameStateMachine } from "./game/stateMachine";
import { renderGame } from "./game/ui";
import type { GameStateMachine } from "./game/stateMachine";

export function createGameApp(container: HTMLElement): {
  stateMachine: GameStateMachine;
  destroy(): void;
} {
  const stateMachine = createGameStateMachine();
  const actions = {
    start: () => stateMachine.transition("start"),
    pause: () => stateMachine.transition("pause"),
    resume: () => stateMachine.transition("resume"),
    restart: () => stateMachine.transition("restart"),
  };

  const render = (state = stateMachine.state) =>
    renderGame(container, state, actions);
  const unsubscribe = stateMachine.subscribe(render);
  const onKeyDown = (event: KeyboardEvent) => {
    if (isActionKey("start", event.key) && stateMachine.state === "start") {
      event.preventDefault();
      actions.start();
    } else if (
      isActionKey("pause", event.key) &&
      stateMachine.state === "playing"
    ) {
      event.preventDefault();
      actions.pause();
    } else if (
      isActionKey("pause", event.key) &&
      stateMachine.state === "paused"
    ) {
      event.preventDefault();
      actions.resume();
    } else if (
      isActionKey("restart", event.key) &&
      (stateMachine.state === "gameOver" ||
        stateMachine.state === "levelCompleted")
    ) {
      event.preventDefault();
      actions.restart();
    }
  };

  document.addEventListener("keydown", onKeyDown);
  render();
  return {
    stateMachine,
    destroy() {
      unsubscribe();
      document.removeEventListener("keydown", onKeyDown);
    },
  };
}

const root = document.querySelector<HTMLElement>("#game");
if (root) {
  createGameApp(root);
}
