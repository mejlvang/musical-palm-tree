# Keyboard input

The keyboard input module exposes `attachInput`, `detachInput`, `isPressed`,
and `onAction` from `keyboard-input.ts`. Call `attachInput()` after the game
has initialized, and call `detachInput()` when the game is disposed.

Default bindings are:

| Action | Keys |
| --- | --- |
| Move left | `ArrowLeft`, `A` |
| Move right | `ArrowRight`, `D` |
| Jump | `ArrowUp`, `W`, `Space` |
| Pause | `Escape` |

`isPressed` is intended for continuously held actions. `onAction` handlers for
jump and pause run once per key press and ignore repeated `keydown` events
until the key is released.
