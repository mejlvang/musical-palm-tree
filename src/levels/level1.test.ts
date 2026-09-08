import assert from "node:assert/strict";
import test from "node:test";
import level1 from "./level1";

test("level 1 contains the required playable level data", () => {
  assert.ok(level1.start);
  assert.ok(level1.goal);
  assert.ok(level1.platforms.length > 0);
  assert.ok(level1.obstacles.length > 0);
  assert.ok(level1.hazards.length > 0);
  assert.ok(level1.bounds.min.x < level1.bounds.max.x);
  assert.ok(level1.bounds.min.y < level1.bounds.max.y);
});
