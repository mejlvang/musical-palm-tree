import type { InputState } from "./physics";

export function createInput(element: Window = window): {
  getState: () => InputState;
  dispose: () => void;
} {
  const keys = new Set<string>();
  const onKeyDown = (event: KeyboardEvent) => {
    if (["ArrowLeft", "ArrowRight", "a", "d", " ", "w", "ArrowUp"].includes(event.key)) {
      event.preventDefault();
      keys.add(event.key);
    }
  };
  const onKeyUp = (event: KeyboardEvent) => keys.delete(event.key);
  element.addEventListener("keydown", onKeyDown);
  element.addEventListener("keyup", onKeyUp);
  return {
    getState: () => ({
      moveLeft: keys.has("ArrowLeft") || keys.has("a"),
      moveRight: keys.has("ArrowRight") || keys.has("d"),
      jump: keys.has(" ") || keys.has("w") || keys.has("ArrowUp"),
    }),
    dispose: () => {
      element.removeEventListener("keydown", onKeyDown);
      element.removeEventListener("keyup", onKeyUp);
    },
  };
}
