import assert from "node:assert/strict";
import test from "node:test";
import {
  attachInput,
  detachInput,
  isPressed,
  onAction,
  type InputEventTarget,
} from "./keyboard-input.ts";

type KeyboardEventData = {
  key: string;
  code?: string;
  repeat?: boolean;
};

class TestInputTarget implements InputEventTarget {
  private readonly listeners = {
    keydown: new Set<(event: KeyboardEvent) => void>(),
    keyup: new Set<(event: KeyboardEvent) => void>(),
  };

  addEventListener(
    type: "keydown" | "keyup",
    listener: (event: KeyboardEvent) => void,
  ): void {
    this.listeners[type].add(listener);
  }

  removeEventListener(
    type: "keydown" | "keyup",
    listener: (event: KeyboardEvent) => void,
  ): void {
    this.listeners[type].delete(listener);
  }

  dispatch(type: "keydown" | "keyup", data: KeyboardEventData): void {
    const event = data as KeyboardEvent;
    this.listeners[type].forEach((listener) => listener(event));
  }
}

test.afterEach(() => {
  detachInput();
});

test("maps every movement key and clears its held state on keyup", () => {
  const target = new TestInputTarget();
  attachInput(target);

  for (const [key, action] of [
    ["ArrowLeft", "moveLeft"],
    ["a", "moveLeft"],
    ["ArrowRight", "moveRight"],
    ["d", "moveRight"],
    ["ArrowUp", "jump"],
    ["w", "jump"],
    [" ", "jump"],
  ] as const) {
    target.dispatch("keydown", { key });
    assert.equal(isPressed(action), true, `${key} should press ${action}`);
    target.dispatch("keyup", { key });
    assert.equal(isPressed(action), false, `${key} should release ${action}`);
  }
});

test("triggers jump once for a held key and supports unsubscribe", () => {
  const target = new TestInputTarget();
  attachInput(target);
  let jumps = 0;
  const unsubscribe = onAction("jump", () => {
    jumps += 1;
  });

  target.dispatch("keydown", { key: "w" });
  target.dispatch("keydown", { key: "w", repeat: true });
  target.dispatch("keydown", { key: "w" });
  assert.equal(jumps, 1);

  target.dispatch("keyup", { key: "w" });
  target.dispatch("keydown", { key: "w" });
  assert.equal(jumps, 2);

  unsubscribe();
  target.dispatch("keyup", { key: "w" });
  target.dispatch("keydown", { key: "w" });
  assert.equal(jumps, 2);
});

test("triggers pause once per Escape press", () => {
  const target = new TestInputTarget();
  attachInput(target);
  let pauses = 0;
  onAction("pause", () => {
    pauses += 1;
  });

  target.dispatch("keydown", { key: "Escape" });
  target.dispatch("keydown", { key: "Escape", repeat: true });
  assert.equal(pauses, 1);
  target.dispatch("keyup", { key: "Escape" });
  target.dispatch("keydown", { key: "Escape" });
  assert.equal(pauses, 2);
});

test("detach removes listeners and clears held keys", () => {
  const target = new TestInputTarget();
  attachInput(target);
  target.dispatch("keydown", { key: "ArrowLeft" });
  assert.equal(isPressed("moveLeft"), true);

  detachInput();
  target.dispatch("keyup", { key: "ArrowLeft" });
  target.dispatch("keydown", { key: "ArrowRight" });
  assert.equal(isPressed("moveLeft"), false);
  assert.equal(isPressed("moveRight"), false);
});
