'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { run } from '@/lib/runStore';
import { frameAt } from '@/lib/path';
import { themed } from '@/lib/palette';
import { U } from './worldUniforms';
import { takeThemeDirty, updateThemed } from './themed';
import { lampWarmth } from './Lights';

const P = new THREE.Vector3();
const T = new THREE.Vector3();
const ndc = new THREE.Vector2();
const hit = new THREE.Vector3();
const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const raycaster = new THREE.Raycaster();

const INTERACTIVE = 'a, button, input, select, textarea, label, summary, [role="button"], .no-ripple';

// Feeds the shared world uniforms, fog and themed materials once per frame, and turns the
// pointer into a spot on the ground grid (hover glow + click ripple).
export default function WorldDriver() {
  const lastTheme = useRef({ night: NaN, warmth: NaN });
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const fog = useMemo(() => new THREE.FogExp2('#1b1229', 0.03), []);

  useEffect(() => {
    scene.fog = fog;
    return () => {
      scene.fog = null;
    };
  }, [scene, fog]);

  useEffect(() => {
    const onDown = (e) => {
      if (e.button !== 0 || e.target.closest?.(INTERACTIVE)) return;
      ndc.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
      raycaster.setFromCamera(ndc, camera);
      if (raycaster.ray.intersectPlane(groundPlane, hit)) {
        U.uRipple.value.set(hit.x, hit.z, U.uTime.value, 1);
      }
    };
    window.addEventListener('pointerdown', onDown);
    return () => window.removeEventListener('pointerdown', onDown);
  }, [camera]);

  useFrame(({ clock }, dt) => {
    const n = run.night;
    const state = run.sample.state;
    U.uTime.value = clock.elapsedTime;
    U.uNight.value = n;
    U.uMap.value = state.map;
    U.uTruckD.value = run.d;

    frameAt(run.d, P, T);
    U.uTruckPos.value.copy(P);
    U.uTruckDir.value.set(T.x, T.z).normalize();
    const intro = run.stage === 'ready' ? 1 : run.intro;
    const lampsOn = run.stage === 'fallback' ? 1 : THREE.MathUtils.smoothstep(intro, 0.34, 0.4);
    U.uHeadlights.value = lampsOn * THREE.MathUtils.lerp(0.12, 1, n);

    // Palette blends only need recomputing while the shift or the lamp warm-up is changing.
    const warmth = lampWarmth();
    const themeChanged = takeThemeDirty() || n !== lastTheme.current.night || warmth !== lastTheme.current.warmth;
    if (themeChanged) {
      lastTheme.current.night = n;
      lastTheme.current.warmth = warmth;
      themed('ground', n, U.uGround.value);
      themed('gridMinor', n, U.uGridMinor.value);
      themed('gridMajor', n, U.uGridMajor.value);
      themed('road', n, U.uRoad.value);
      themed('roadEdge', n, U.uRoadEdge.value);
      themed('roadCenter', n, U.uRoadCenterColor.value);
      themed('sodium', n, U.uSodium.value).multiplyScalar(warmth);
      themed('pointer', n, U.uPointerColor.value);
      themed('skyTop', n, U.uSkyTop.value);
      themed('skyMid', n, U.uSkyMid.value);
      themed('skyHorizon', n, U.uSkyHorizon.value);
      themed('fog', n, U.uFogColor.value);
      updateThemed(n, warmth);
    }

    // Fog thins out for the map view so the whole route reads.
    const density = THREE.MathUtils.lerp(THREE.MathUtils.lerp(0.02, 0.034, n), 0.0045, state.map);
    U.uFogDensity.value = density;
    fog.density = density;
    fog.color.copy(U.uFogColor.value);

    // Pointer over the grid (mouse only; touch gets the tap ripple).
    const p = run.pointer;
    let strength = 0;
    if (p.active && !run.reducedMotion) {
      ndc.set(p.nx, p.ny);
      raycaster.setFromCamera(ndc, camera);
      if (raycaster.ray.intersectPlane(groundPlane, hit)) {
        U.uPointer.value.x = hit.x;
        U.uPointer.value.y = hit.z;
        strength = 1;
      }
    }
    U.uPointer.value.z += (strength - U.uPointer.value.z) * (1 - Math.exp(-6 * dt));

  }, -3);

  return null;
}
