import * as THREE from 'three';
import { frameAt, headingOf } from '@/lib/path';

const P = new THREE.Vector3();
const T = new THREE.Vector3();

/** Group transform for an object at distance `d` along the run, `lateral` units to the left of it. */
export function placement(d, lateral = 0, y = 0) {
  frameAt(d, P, T);
  return {
    position: [P.x + T.z * lateral, y, P.z - T.x * lateral],
    rotation: [0, headingOf(T), 0],
  };
}

/** Deterministic pseudo-random sequence so the world is laid out the same on every visit. */
export function seeded(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

export const standard = (params) => new THREE.MeshStandardMaterial(params);
