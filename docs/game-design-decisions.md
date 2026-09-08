# McSquishy: Blob on the Run — Game Design Decisions

This document records the decisions for issue #2 so the initial implementation and
downstream issues (#5, #6, #7, #9, and related level, hazard, and visual-feedback
work) have a single, traceable product definition. The decisions apply to the
first playable release and are aligned with `src/DESCRIPTION.md`,
`src/FUNCTIONAL_REQUIREMENTS.md`, and `src/TECHNICAL_REQUIREMENTS.md`.

## Q1. What is the failure model?

The game uses a single-attempt failure model: McSquishy has no lives counter, and
contact with a hazard or falling outside the playable area immediately ends the
attempt and enters the failure/game-over state; the player can then restart the
level from its start. This keeps the system accessible and easy to understand,
supports the short-level focus in `src/DESCRIPTION.md`, and satisfies Functional
Requirements §4 (hazard/fall failures and restart) and §6 (game-over and restart)
without introducing an additional progression system.

## Q2. How do checkpoints work in level 1?

Level 1 has no intermediate checkpoints: every failure restarts McSquishy at the
level's defined starting position. This is an intentional consequence of keeping
the first level short and the initial implementation focused, while directly
meeting Functional Requirements §4's allowance for restarting from the beginning
or from a defined checkpoint; checkpoint systems can be considered for later
levels without changing this level's behavior.

## Q3. Which hazards and obstacles are included?

Level 1 includes three hazards: stationary spikes, pits (with falling beyond the
playable area also treated as a pit failure), and one simple patrolling enemy.
It includes three solid obstacle types: static platforms, solid walls, and
moving platforms with predictable horizontal or vertical motion. These provide
the required platforms, obstacles, and hazards in Functional Requirements §3,
while keeping the first catalogue small enough for a single short level; new
hazards and obstacle types are deferred to future level-content work.

## Q4. What is the visual style direction?

Use bright, geometric placeholder shapes rather than production sprites for the
first iteration: McSquishy is a rounded blob in a saturated blue or teal, hazards
use a high-contrast red/orange treatment, solid geometry uses warm neutral tones,
and the goal uses a clear yellow/gold accent. McSquishy visibly squashes on
landing, stretches during a jump, and leans or slightly stretches while moving,
with the effect returning to the normal rounded shape when stationary. This
colourful, playful, slightly absurd direction follows `src/DESCRIPTION.md` and
keeps visual behavior implementation-agnostic while preserving the separation
between game logic and rendering required by `src/TECHNICAL_REQUIREMENTS.md`.

## Q5. How many levels are in the initial scope?

The initial implementation contains exactly one playable side-scrolling level,
with a defined start, hazards and obstacles, camera-follow behavior, and a
clearly identifiable goal. This meets Functional Requirements §3's minimum of
at least one level while keeping the first release consistent with the
short-level and focused-scope direction in `src/DESCRIPTION.md`; additional
levels are explicitly outside this issue's scope.
