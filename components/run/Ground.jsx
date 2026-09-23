'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { U, HEADLIGHT_GLSL } from './worldUniforms';

// The terminal floor: an endless survey grid (1-unit cells, 5-unit majors) that answers the
// pointer. Cells near the cursor light up; a click sends a ripple across the grid.
const vertexShader = /* glsl */ `
  varying vec3 vWorld;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uMap;
  uniform float uHeadlights;
  uniform float uFogDensity;
  uniform vec3 uTruckPos;
  uniform vec2 uTruckDir;
  uniform vec3 uPointer;
  uniform vec4 uRipple;
  uniform vec3 uGround;
  uniform vec3 uGridMinor;
  uniform vec3 uGridMajor;
  uniform vec3 uPointerColor;
  uniform vec3 uFogColor;
  varying vec3 vWorld;

  ${HEADLIGHT_GLSL}

  float gridLine(vec2 p, float scale, float px) {
    vec2 q = p / scale;
    vec2 g = abs(fract(q - 0.5) - 0.5) / fwidth(q);
    return 1.0 - min(min(g.x, g.y) / px, 1.0);
  }

  void main() {
    vec2 p = vWorld.xz;
    float dist = length(cameraPosition - vWorld);
    float minor = gridLine(p, 1.0, 1.0) * (1.0 - smoothstep(9.0, 34.0, dist));
    float major = gridLine(p, 5.0, 1.25) * (1.0 - smoothstep(70.0, 240.0, dist));

    vec3 col = uGround;
    col = mix(col, uGridMinor, minor * 0.9);
    col = mix(col, uGridMajor, major * mix(0.75, 1.0, uMap));

    // pointer: nearby cells fill in, their edges brighten
    vec2 cell = floor(p) + 0.5;
    float near = (1.0 - smoothstep(0.3, 2.6, length(cell - uPointer.xy))) * uPointer.z;
    float nearLine = (1.0 - smoothstep(0.0, 3.2, length(p - uPointer.xy))) * uPointer.z;
    col += uPointerColor * near * 0.1;
    col = mix(col, uPointerColor, gridLine(p, 1.0, 1.5) * nearLine * 0.95);

    // click ripple
    float age = uTime - uRipple.z;
    float radius = age * 5.5;
    float ringDist = (length(p - uRipple.xy) - radius) * 1.5;
    float ring = exp(-ringDist * ringDist) * exp(-max(age, 0.0) * 1.2) * step(0.0, age) * uRipple.w;
    col += uPointerColor * ring * (0.12 + gridLine(p, 1.0, 1.4) * 0.9);

    col += vec3(1.0, 0.92, 0.78) * headlightSpill(p) * uHeadlights * 0.28;

    float fog = 1.0 - exp(-uFogDensity * uFogDensity * dist * dist);
    col = mix(col, uFogColor, fog);
    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export default function Ground() {
  const mesh = useRef();
  const material = useMemo(
    () => new THREE.ShaderMaterial({ uniforms: U, vertexShader, fragmentShader }),
    [],
  );

  // Keep the (finite) plane centered under the camera; the grid itself is in world space.
  useFrame(({ camera }) => {
    mesh.current.position.set(Math.round(camera.position.x / 5) * 5, -0.012, Math.round(camera.position.z / 5) * 5);
  });

  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]} material={material} renderOrder={-2}>
      <planeGeometry args={[900, 900]} />
    </mesh>
  );
}
