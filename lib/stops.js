// Where things are on the run, as distances `d` along the route (see lib/path.js).
// Kept free of three.js so the HUD can use it without pulling the 3D bundle.
export const STOPS = {
  dock: 0,
  lampsFrom: 10,
  lampsTo: 146,
  gantry: [70, 118],
  port: 150,
  portFrom: 127,
  portTo: 178,
  drop: 190,
};

// Lane geometry, as lateral offsets from the truck's path (+ = the truck's left / +x at the dock).
// The truck drives the right-hand lane of a two-lane road.
export const ROAD = {
  center: 0.72,
  halfWidth: 1.6,
};
