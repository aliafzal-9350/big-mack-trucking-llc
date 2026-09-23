import { CatmullRomCurve3, Vector3 } from 'three';

// The run, laid out on the ground plane (x, z). One scene unit ~ 2.8 m: the truck is 2.8 units long.
// `d` everywhere in the app is distance along this curve, measured from the dock (d = 0).
const POINTS = [
  [0, -14], [0, 0], [0, 18], [2, 36], [10, 58], [21, 80], [25, 102],
  [21, 124], [12, 142], [9, 160], [9, 180], [9, 200], [9, 222],
];

// Distance from the first control point to the dock (the first leg is a straight line).
const DOCK_OFFSET = 14;

export const curve = new CatmullRomCurve3(POINTS.map(([x, z]) => new Vector3(x, 0, z)), false, 'centripetal');
curve.arcLengthDivisions = 2400;
const LENGTH = curve.getLength();

export const RUN_END = LENGTH - DOCK_OFFSET - 0.01;

export { STOPS, ROAD } from './stops';

const tmp = new Vector3();

/** Position + unit tangent at distance `d` along the run. */
export function frameAt(d, position, tangent) {
  const u = Math.min(1, Math.max(0, (d + DOCK_OFFSET) / LENGTH));
  curve.getPointAt(u, position);
  if (tangent) curve.getTangentAt(u, tangent).setY(0).normalize();
  return position;
}

/** Heading (rotation about y) for a unit tangent: 0 when facing +z. */
export const headingOf = (tangent) => Math.atan2(tangent.x, tangent.z);

/** World position at distance `d` and lateral offset `lateral` (+ = left of travel). */
export function placeAt(d, lateral, out) {
  frameAt(d, out, tmp);
  // left of travel for a +z heading is +x
  out.x += tmp.z * lateral;
  out.z += -tmp.x * lateral;
  return out;
}
