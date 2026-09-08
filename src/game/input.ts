export const INPUT_MAPPING = {
  left: ["ArrowLeft", "a"],
  right: ["ArrowRight", "d"],
  jump: ["ArrowUp", "w", " "],
  pause: ["Escape", "p"],
  start: ["Enter", " "],
  restart: ["Enter", " "],
} as const;

export type InputAction = keyof typeof INPUT_MAPPING;

export function keysForAction(action: InputAction): readonly string[] {
  return INPUT_MAPPING[action];
}

export function instructions(): ReadonlyArray<{
  action: string;
  keys: string;
}> {
  const displayKeys = (action: InputAction): string =>
    keysForAction(action)
      .map((key) => (key === " " ? "Space" : key))
      .join(" / ");

  return [
    {
      action: "Move",
      keys: `${displayKeys("left")} / ${displayKeys("right")}`,
    },
    { action: "Jump", keys: displayKeys("jump") },
    { action: "Pause", keys: displayKeys("pause") },
  ];
}

export function isActionKey(action: InputAction, key: string): boolean {
  const mappedKeys: readonly string[] = INPUT_MAPPING[action];
  return mappedKeys.includes(key);
}
