'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { frameAt, ROAD, RUN_END } from '@/lib/path';
import { U, HEADLIGHT_GLSL } from './worldUniforms';

// The road ribbon along the run. Its v coordinate is distance along the run, so markings,
// lamp pools and the map's route line are all drawn in "miles", not in world space.
function buildRoadGeometry() {
  const from = -3.2;
  const to = Math.min(RUN_END, 206);
  const step = 0.4;
  const p = new THREE.Vector3();
  const t = new THREE.Vector3();
  const positions = [];
  const uvs = [];
  const indices = [];
  let row = 0;
  for (let d = from; d <= to + 1e-6; d += step, row++) {
    frameAt(d, p, t);
    const lx = t.z;
    const lz = -t.x;
    const left = ROAD.center + ROAD.halfWidth;
    const right = ROAD.center - ROAD.halfWidth;
    positions.push(p.x + lx * left, 0, p.z + lz * left, p.x + lx * right, 0, p.z + lz * right);
    uvs.push(0, d, 1, d);
    if (row > 0) {
      const a = (row - 1) * 2;
      indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorld;
  void main() {
    vUv = uv;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uNight;
  uniform float uMap;
  uniform float uHeadlights;
  uniform float uFogDensity;
  uniform float uTruckD;
  uniform float uLampFrom;
  uniform float uLampTo;
  uniform float uLampStep;
  uniform float uRoadCenter;
  uniform float uRoadHalf;
  uniform float uGateD;
  uniform vec3 uTruckPos;
  uniform vec2 uTruckDir;
  uniform vec3 uRoad;
  uniform vec3 uRoadEdge;
  uniform vec3 uRoadCenterColor;
  uniform vec3 uSodium;
  uniform vec3 uFogColor;
  uniform vec3 uPointer;
  uniform vec4 uRipple;
  uniform vec3 uPointerColor;
  varying vec2 vUv;
  varying vec3 vWorld;

  ${HEADLIGHT_GLSL}

  float band(float x, float c, float w) {
    float aa = fwidth(x) * 1.2;
    return 1.0 - smoothstep(w * 0.5 - aa, w * 0.5 + aa, abs(x - c));
  }
  float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

  void main() {
    float lat = uRoadCenter + uRoadHalf - vUv.x * 2.0 * uRoadHalf; // lateral offset from the truck's path
    float d = vUv.y;
    float dist = length(cameraPosition - vWorld);

    vec3 col = uRoad * (0.94 + hash(floor(vWorld.xz * 22.0)) * 0.1);

    // markings: solid white edges, double yellow center, stop bar before the port gate
    float edges = band(lat, uRoadCenter + uRoadHalf - 0.1, 0.05) + band(lat, uRoadCenter - uRoadHalf + 0.1, 0.05);
    float yellow = band(lat, uRoadCenter + 0.045, 0.032) + band(lat, uRoadCenter - 0.045, 0.032);
    float stopBar = band(d, uGateD - 1.9, 0.2) * step(lat, uRoadCenter - 0.08) * step(uRoadCenter - uRoadHalf + 0.12, lat);
    float wear = 0.82 + hash(floor(vec2(d * 3.0, lat * 6.0))) * 0.18;
    col = mix(col, uRoadEdge, clamp(edges + stopBar, 0.0, 1.0) * 0.85 * wear);
    col = mix(col, uRoadCenterColor, yellow * 0.9 * wear);

    // sodium lamp pools under each pole pair
    float k = floor((d - uLampFrom) / uLampStep + 0.5);
    float lampD = uLampFrom + k * uLampStep;
    float inRange = step(uLampFrom - 0.1, lampD) * step(lampD, uLampTo + 0.1);
    float dd = d - lampD;
    float along = exp(-dd * dd / 6.0);
    float pl = lat - (uRoadCenter + uRoadHalf - 0.25);
    float pr = lat - (uRoadCenter - uRoadHalf + 0.25);
    float pools = along * (exp(-pl * pl * 0.55) + exp(-pr * pr * 0.55));
    col += uSodium * pools * inRange * uNight * 0.2;

    col += vec3(1.0, 0.92, 0.78) * headlightSpill(vWorld.xz) * uHeadlights * 0.42;

    // tracking map: the route along the truck's lane, solid where driven, marching dashes ahead
    float line = band(lat, 0.0, 0.14);
    float driven = step(d, uTruckD);
    float dash = step(0.45, fract(d * 0.45 - uTime * 0.9));
    float route = line * mix(dash * 0.75, 1.0, driven);
    col = mix(col, uSodium * 1.8, route * uMap);
    col += uSodium * exp(-lat * lat * 5.0) * uMap * mix(0.08, 0.22, driven);

    // the pointer lights the asphalt too, so the whole floor answers the cursor
    vec2 p = vWorld.xz;
    float nearP = (1.0 - smoothstep(0.0, 2.8, length(p - uPointer.xy))) * uPointer.z;
    col += uPointerColor * nearP * 0.14;
    float age = uTime - uRipple.z;
    float ringDist = (length(p - uRipple.xy) - age * 5.5) * 1.5;
    col += uPointerColor * exp(-ringDist * ringDist) * exp(-max(age, 0.0) * 1.2) * step(0.0, age) * uRipple.w * 0.35;

    float fog = 1.0 - exp(-uFogDensity * uFogDensity * dist * dist);
    col = mix(col, uFogColor, fog);
    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export default function Road() {
  const geometry = useMemo(buildRoadGeometry, []);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: U,
        vertexShader,
        fragmentShader,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1,
      }),
    [],
  );
  return <mesh geometry={geometry} material={material} position={[0, 0.001, 0]} renderOrder={-1} />;
}
