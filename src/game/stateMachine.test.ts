import assert from "node:assert/strict";
import test from "node:test";
import { createGameStateMachine } from "./stateMachine.ts";

test("starts in the start state", () => {
  assert.equal(createGameStateMachine().state, "start");
});

test("allows every declared transition", () => {
  const machine = createGameStateMachine();
  assert.equal(machine.transition("start"), true);
  assert.equal(machine.transition("pause"), true);
  assert.equal(machine.transition("resume"), true);
  assert.equal(machine.transition("gameOver"), true);
  assert.equal(machine.transition("restart"), true);
  assert.equal(machine.transition("start"), true);
  assert.equal(machine.transition("levelCompleted"), true);
  assert.equal(machine.transition("restart"), true);
  assert.equal(machine.transition("start"), true);
  assert.equal(machine.transition("levelCompleted"), true);
  assert.equal(machine.transition("start"), true);
  assert.equal(machine.state, "playing");
});

test("rejects invalid transitions without changing state", () => {
  const machine = createGameStateMachine();
  assert.equal(machine.transition("pause"), false);
  assert.equal(machine.state, "start");
  assert.equal(machine.transition("gameOver"), false);
  assert.equal(machine.state, "start");

  machine.transition("start");
  machine.transition("gameOver");
  assert.equal(machine.transition("pause"), false);
  assert.equal(machine.state, "gameOver");
});

test("pause and resume toggle correctly", () => {
  const machine = createGameStateMachine();
  machine.transition("start");
  assert.equal(machine.transition("pause"), true);
  assert.equal(machine.state, "paused");
  assert.equal(machine.transition("resume"), true);
  assert.equal(machine.state, "playing");
});
