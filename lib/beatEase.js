/**
 * How the camera and truck travel between two story beats.
 *
 * `t` is raw scroll progress between beat A (t = 0, its text is centered on screen)
 * and beat B (t = 1). Return the eased progress (0..1) used for the camera, the truck's
 * position on the route and every other scene state.
 *
 * Near t = 0 and t = 1 the reader is looking at a block of text, so this curve decides
 * how long the scene holds still for reading versus how long it spends travelling.
 */
export function beatEase(t) {
  // TODO(you): shape the travel between beats (see notes in the handoff).
  return t;
}
