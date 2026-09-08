import assert from "node:assert/strict";
import test from "node:test";
import {
  applyGravity,
  applyHorizontalInput,
  resolveCollision,
  triggerJump,
  update,
  type PlayerState,
} from "./physics";

const state = (overrides: Partial<PlayerState> = {}): PlayerState => ({
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 0 },
  width: 20,
  height: 20,
  grounded: false,
  ...overrides,
});

test("gravity accumulates velocity over elapsed time", () => {
  const result = applyGravity(state(), 0.5, { gravity: 10, moveSpeed: 1, jumpImpulse: 1, maxDeltaTime: 1 });
  assert.equal(result.velocity.y, 5);
});

test("horizontal input sets movement speed and direction", () => {
  const config = { gravity: 1, moveSpeed: 100, jumpImpulse: 1, maxDeltaTime: 1 };
  assert.equal(applyHorizontalInput(state(), -1, config).velocity.x, -100);
  assert.equal(applyHorizontalInput(state(), 1, config).velocity.x, 100);
});

test("jump only triggers while grounded", () => {
  const config = { gravity: 1, moveSpeed: 1, jumpImpulse: 300, maxDeltaTime: 1 };
  assert.equal(triggerJump(state(), config).velocity.y, 0);
  const result = triggerJump(state({ grounded: true }), config);
  assert.equal(result.velocity.y, -300);
  assert.equal(result.grounded, false);
});

test("collision resolves a falling player onto a platform", () => {
  const result = resolveCollision(
    state({ position: { x: 40, y: 90 }, velocity: { x: 0, y: 30 } }),
    { x: 0, y: 100, width: 200, height: 20 },
  );
  assert.deepEqual(result.position, { x: 40, y: 80 });
  assert.equal(result.velocity.y, 0);
  assert.equal(result.grounded, true);
});

test("collision stops a player at a wall", () => {
  const result = resolveCollision(
    state({ position: { x: 90, y: 40 }, velocity: { x: 30, y: 0 } }),
    { x: 100, y: 0, width: 20, height: 200 },
  );
  assert.equal(result.position.x, 80);
  assert.equal(result.velocity.x, 0);
});

test("update composes input, gravity, movement, and collision", () => {
  const result = update(
    state({ position: { x: 40, y: 79 }, grounded: true }),
    { moveLeft: false, moveRight: true, jump: false },
    0.11,
    [{ x: 0, y: 100, width: 200, height: 20 }],
    { gravity: 100, moveSpeed: 100, jumpImpulse: 200, maxDeltaTime: 1 },
  );
  assert.equal(result.position.x, 51);
  assert.equal(result.position.y, 80);
  assert.equal(result.grounded, true);
});
