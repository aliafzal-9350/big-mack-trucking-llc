'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { U } from './worldUniforms';

// Sky dome that travels with the camera. At night the horizon carries the orange-violet glow
// the city throws onto low cloud; by day it is an overcast haze.
const vertexShader = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    vec4 world = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * world;
    gl_Position.z = gl_Position.w; // pin to the far plane
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uSkyTop;
  uniform vec3 uSkyMid;
  uniform vec3 uSkyHorizon;
  uniform vec3 uFogColor;
  uniform float uNight;
  varying vec3 vDir;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }

  void main() {
    float h = vDir.y;
    vec3 col = mix(uSkyHorizon, uSkyMid, smoothstep(0.0, 0.16, h));
    col = mix(col, uSkyTop, smoothstep(0.12, 0.62, h));
    col = mix(uFogColor, col, smoothstep(-0.04, 0.03, h));
    // a few faint stars high up on the night shift
    vec2 cell = floor(vec2(atan(vDir.z, vDir.x + 1e-5) * 180.0, h * 180.0));
    float star = step(0.9965, hash(cell)) * smoothstep(0.25, 0.6, h) * uNight;
    col += vec3(0.8, 0.78, 1.0) * star * 0.5;
    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export default function Sky() {
  const mesh = useRef();
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: U,
        vertexShader,
        fragmentShader,
        side: THREE.BackSide,
        depthWrite: false,
      }),
    [],
  );
  useFrame(({ camera }) => mesh.current.position.copy(camera.position));
  return (
    <mesh ref={mesh} material={material} renderOrder={-10} frustumCulled={false}>
      <sphereGeometry args={[500, 48, 24]} />
    </mesh>
  );
}
