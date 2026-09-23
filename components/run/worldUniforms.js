import * as THREE from 'three';
import { STOPS, ROAD } from '@/lib/path';

// Uniforms shared by the hand-written world shaders (ground grid, road, sky).
// Updated once per frame by <WorldDriver />.
export const U = {
  uTime: { value: 0 },
  uNight: { value: 1 },
  uTruckPos: { value: new THREE.Vector3() },
  uTruckDir: { value: new THREE.Vector2(0, 1) },
  uTruckD: { value: 0 },
  uHeadlights: { value: 0 },
  uMap: { value: 0 },
  uPointer: { value: new THREE.Vector3(0, 0, 0) }, // xz on the ground + strength
  uRipple: { value: new THREE.Vector4(0, 0, -100, 0) }, // xz, start time, strength
  uLampFrom: { value: STOPS.lampsFrom },
  uLampTo: { value: STOPS.lampsTo },
  uLampStep: { value: 12 },
  uRoadCenter: { value: ROAD.center },
  uRoadHalf: { value: ROAD.halfWidth },
  uGateD: { value: STOPS.port },
  uFogDensity: { value: 0.03 },

  uGround: { value: new THREE.Color() },
  uGridMinor: { value: new THREE.Color() },
  uGridMajor: { value: new THREE.Color() },
  uRoad: { value: new THREE.Color() },
  uRoadEdge: { value: new THREE.Color() },
  uRoadCenterColor: { value: new THREE.Color() },
  uSodium: { value: new THREE.Color() },
  uPointerColor: { value: new THREE.Color() },
  uSkyTop: { value: new THREE.Color() },
  uSkyMid: { value: new THREE.Color() },
  uSkyHorizon: { value: new THREE.Color() },
  uFogColor: { value: new THREE.Color() },
};

// Headlight pool thrown on the ground ahead of the truck (both lamps merge into one pool).
export const HEADLIGHT_GLSL = /* glsl */ `
  float headlightSpill(vec2 p) {
    vec2 rel = p - uTruckPos.xz;
    vec2 fwd = uTruckDir;
    vec2 side = vec2(fwd.y, -fwd.x);
    float along = dot(rel, fwd) - 1.38;
    float across = dot(rel, side);
    if (along < 0.0) return 0.0;
    float width = 0.42 + along * 0.3;
    float a = across / width;
    float lateral = exp(-a * a * 1.8);
    float falloff = exp(-along * 0.26) * smoothstep(0.0, 0.9, along);
    return lateral * falloff;
  }
`;
