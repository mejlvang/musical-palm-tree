export type Action = "moveLeft" | "moveRight" | "jump" | "pause";

export const ACTIONS = [
  "moveLeft",
  "moveRight",
  "jump",
  "pause",
] as const satisfies readonly Action[];

export const KEY_BINDINGS: Readonly<Record<Action, readonly string[]>> = {
  moveLeft: ["ArrowLeft", "a"],
  moveRight: ["ArrowRight", "d"],
  jump: ["ArrowUp", "w", " "],
  pause: ["Escape"],
};

export interface InputEventTarget {
  addEventListener(
    type: "keydown" | "keyup",
    listener: (event: KeyboardEvent) => void,
  ): void;
  removeEventListener(
    type: "keydown" | "keyup",
    listener: (event: KeyboardEvent) => void,
  ): void;
}

type ActionHandler = () => void;

const discreteActions = new Set<Action>(["jump", "pause"]);
const pressedKeys = new Set<string>();
const handlers = new Map<Action, Set<ActionHandler>>(
  ACTIONS.map((action) => [action, new Set<ActionHandler>()]),
);

let attachedTarget: InputEventTarget | undefined;

const normalizeKey = (event: KeyboardEvent): string => {
  if (event.key === " " || event.key === "Space" || event.key === "Spacebar") {
    return " ";
  }

  if (event.key) {
    return event.key.length === 1 ? event.key.toLowerCase() : event.key;
  }

  // `code` makes the module work with test doubles and keyboard events that
  // do not provide a value for `key`.
  const codeKey = event.code;
  if (codeKey === "Space") {
    return " ";
  }
  if (codeKey.startsWith("Key") && codeKey.length === 4) {
    return codeKey.slice(3).toLowerCase();
  }
  return codeKey;
};

const actionForKey = (key: string): Action | undefined =>
  ACTIONS.find((action) => KEY_BINDINGS[action].includes(key));

const handleKeyDown = (event: KeyboardEvent): void => {
  const key = normalizeKey(event);
  const wasPressed = pressedKeys.has(key);
  pressedKeys.add(key);

  const action = actionForKey(key);
  if (
    action !== undefined &&
    discreteActions.has(action) &&
    !wasPressed &&
    !event.repeat
  ) {
    handlers.get(action)?.forEach((handler) => handler());
  }
};

const handleKeyUp = (event: KeyboardEvent): void => {
  pressedKeys.delete(normalizeKey(event));
};

const defaultTarget = (): InputEventTarget => {
  if (typeof window !== "undefined") {
    return window;
  }
  throw new Error("A browser event target is required to attach keyboard input.");
};

export function attachInput(target: InputEventTarget = defaultTarget()): void {
  if (attachedTarget !== undefined) {
    detachInput();
  }

  target.addEventListener("keydown", handleKeyDown);
  target.addEventListener("keyup", handleKeyUp);
  attachedTarget = target;
}

export function detachInput(): void {
  if (attachedTarget !== undefined) {
    attachedTarget.removeEventListener("keydown", handleKeyDown);
    attachedTarget.removeEventListener("keyup", handleKeyUp);
    attachedTarget = undefined;
  }
  pressedKeys.clear();
}

export function isPressed(action: Action): boolean {
  return KEY_BINDINGS[action].some((key) => pressedKeys.has(key));
}

export function onAction(action: Action, handler: ActionHandler): () => void {
  const actionHandlers = handlers.get(action);
  if (actionHandlers === undefined) {
    throw new Error(`Unknown input action: ${action}`);
  }

  actionHandlers.add(handler);
  return () => {
    actionHandlers.delete(handler);
  };
}
