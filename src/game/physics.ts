export interface Vector {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PlayerState {
  position: Vector;
  velocity: Vector;
  width: number;
  height: number;
  grounded: boolean;
}

export interface InputState {
  moveLeft: boolean;
  moveRight: boolean;
  jump: boolean;
}

export interface PhysicsConfig {
  gravity: number;
  moveSpeed: number;
  jumpImpulse: number;
  maxDeltaTime: number;
}

export const DEFAULT_PHYSICS: PhysicsConfig = {
  gravity: 1800,
  moveSpeed: 260,
  jumpImpulse: 650,
  maxDeltaTime: 0.05,
};

const copyState = (state: PlayerState): PlayerState => ({
  ...state,
  position: { ...state.position },
  velocity: { ...state.velocity },
});

export function applyGravity(
  state: PlayerState,
  dt: number,
  config: PhysicsConfig = DEFAULT_PHYSICS,
): PlayerState {
  const next = copyState(state);
  next.velocity.y += config.gravity * Math.max(0, dt);
  return next;
}

export function applyHorizontalInput(
  state: PlayerState,
  direction: -1 | 0 | 1,
  config: PhysicsConfig = DEFAULT_PHYSICS,
): PlayerState {
  const next = copyState(state);
  next.velocity.x = direction * config.moveSpeed;
  return next;
}

export function triggerJump(
  state: PlayerState,
  config: PhysicsConfig = DEFAULT_PHYSICS,
): PlayerState {
  if (!state.grounded) return copyState(state);
  const next = copyState(state);
  next.velocity.y = -config.jumpImpulse;
  next.grounded = false;
  return next;
}

export function resolveCollision(state: PlayerState, solid: Rect): PlayerState {
  const next = copyState(state);
  const player = { ...next.position, width: next.width, height: next.height };
  const overlapsX = player.x < solid.x + solid.width && player.x + player.width > solid.x;
  const overlapsY = player.y < solid.y + solid.height && player.y + player.height > solid.y;

  if (overlapsX && overlapsY) {
    const fromLeft = player.x + player.width - solid.x;
    const fromRight = solid.x + solid.width - player.x;
    if (Math.min(fromLeft, fromRight) < Math.min(player.y + player.height - solid.y, solid.y + solid.height - player.y)) {
      if (fromLeft < fromRight) next.position.x = solid.x - player.width;
      else next.position.x = solid.x + solid.width;
      next.velocity.x = 0;
    }
  }

  const nowOverlapsX = next.position.x < solid.x + solid.width && next.position.x + next.width > solid.x;
  const nowOverlapsY = next.position.y < solid.y + solid.height && next.position.y + next.height > solid.y;
  if (nowOverlapsX && nowOverlapsY) {
    const fromTop = next.position.y + next.height - solid.y;
    const fromBottom = solid.y + solid.height - next.position.y;
    if (fromTop <= fromBottom) {
      next.position.y = solid.y - next.height;
      next.velocity.y = 0;
      next.grounded = true;
    } else {
      next.position.y = solid.y + solid.height;
      next.velocity.y = Math.max(0, next.velocity.y);
      next.grounded = false;
    }
  }
  return next;
}

const intersects = (state: PlayerState, solid: Rect): boolean =>
  state.position.x < solid.x + solid.width &&
  state.position.x + state.width > solid.x &&
  state.position.y < solid.y + solid.height &&
  state.position.y + state.height > solid.y;

export function update(
  state: PlayerState,
  input: InputState,
  dt: number,
  solids: readonly Rect[],
  config: PhysicsConfig = DEFAULT_PHYSICS,
): PlayerState {
  const elapsed = Math.min(Math.max(0, dt), config.maxDeltaTime);
  const direction: -1 | 0 | 1 = input.moveLeft === input.moveRight
    ? 0
    : input.moveLeft ? -1 : 1;
  let next = applyHorizontalInput(state, direction, config);
  if (input.jump) next = triggerJump(next, config);
  next = applyGravity(next, elapsed, config);
  next.position.x += next.velocity.x * elapsed;
  next.position.y += next.velocity.y * elapsed;
  next.grounded = false;
  for (const solid of solids) {
    if (intersects(next, solid)) next = resolveCollision(next, solid);
  }
  return next;
}
