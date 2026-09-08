# Level 1 verification

Level 1 uses world coordinates in pixels and spans `x = 0..3200`. When the
browser game loop is available, manually verify the following:

- Start the level and confirm McSquishy spawns at `(96, 420)`.
- Walk right through the crate, spikes, pit, and raised platforms to the
  finish flag near `x = 3060`.
- Confirm the camera follows the player while its offset remains clamped at
  both level edges.
- Hold left and right at the edges and confirm the player remains inside the
  level bounds. The current issue intentionally does not turn hazard contact
  or falling into a failure state.
