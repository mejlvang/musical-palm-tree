export const GAME_STATES = [
  "start",
  "playing",
  "paused",
  "gameOver",
  "levelCompleted",
] as const;

export type GameState = (typeof GAME_STATES)[number];

export type GameAction =
  | "start"
  | "pause"
  | "resume"
  | "gameOver"
  | "levelCompleted"
  | "restart";

export const TRANSITIONS: Readonly<
  Record<GameState, Readonly<Partial<Record<GameAction, GameState>>>>
> = {
  start: { start: "playing" },
  playing: {
    pause: "paused",
    gameOver: "gameOver",
    levelCompleted: "levelCompleted",
  },
  paused: { resume: "playing" },
  gameOver: { restart: "start" },
  levelCompleted: { restart: "start", start: "playing" },
};

export type StateChangeListener = (state: GameState) => void;

export interface GameStateMachine {
  readonly state: GameState;
  transition(action: GameAction): boolean;
  subscribe(listener: StateChangeListener): () => void;
}

export function createGameStateMachine(
  initialState: GameState = "start",
): GameStateMachine {
  let state = initialState;
  const listeners = new Set<StateChangeListener>();

  return {
    get state() {
      return state;
    },
    transition(action) {
      const nextState = TRANSITIONS[state][action];
      if (!nextState) {
        return false;
      }

      state = nextState;
      listeners.forEach((listener) => listener(state));
      return true;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
