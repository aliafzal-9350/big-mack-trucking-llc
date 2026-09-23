'use client';

import { useLayoutEffect, useMemo, useRef } from 'react';
import { createPortal, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { run, useRun } from '@/lib/runStore';
import { TIERS } from '@/lib/quality';
import { frameAt, headingOf, placeAt, ROAD, STOPS } from '@/lib/path';
import { themed } from '@/lib/palette';

const P = new THREE.Vector3();
const T = new THREE.Vector3();
const tmp = new THREE.Color();
const lerp = THREE.MathUtils.lerp;

export function lampWarmth() {
  // Sodium lamps strike dull red and take a moment to reach full amber.
  if (run.stage === 'ready' || run.stage === 'fallback' || run.reducedMotion) return 1;
  return THREE.MathUtils.smoothstep(run.intro, 0.05, 0.75);
}

// Key + rim + sky fill follow the truck; two point lights stand in for the nearest
// streetlights so the paint catches passing sodium light on the night shift.
export function Lights() {
  const hemi = useRef();
  const key = useRef();
  const rim = useRef();
  const lampA = useRef();
  const lampB = useRef();
  const scene = useThree((s) => s.scene);
  const pointLights = useRun((r) => TIERS[r.tier].pointLights);

  useLayoutEffect(() => {
    scene.add(key.current.target, rim.current.target);
    return () => scene.remove(key.current?.target, rim.current?.target);
  }, [scene]);

  useFrame(() => {
    const n = run.night;
    frameAt(run.d, P, T);
    // Light rig offsets in the truck's frame: x = left, z = forward (T is the forward axis).
    const toWorld = (x, y, z, out) => out.set(P.x + x * T.z + z * T.x, y, P.z - x * T.x + z * T.z);

    themed('hemiSky', n, hemi.current.color);
    themed('hemiGround', n, hemi.current.groundColor);
    hemi.current.intensity = lerp(1.45, 0.6, n);

    themed('key', n, key.current.color);
    key.current.intensity = lerp(2.4, 0.75, n);
    toWorld(5, 8, 6, key.current.position);
    key.current.target.position.copy(P);
    key.current.target.updateMatrixWorld();

    themed('rim', n, rim.current.color);
    rim.current.intensity = lerp(0.7, 2.6, n);
    toWorld(-3, 5, -9, rim.current.position);
    rim.current.target.position.copy(P);
    rim.current.target.updateMatrixWorld();

    // Nearest streetlight pair ahead/behind the cab.
    const warmth = lampWarmth();
    if (lampA.current) {
      const k = Math.round((run.d - STOPS.lampsFrom) / 12);
      for (let i = 0; i < 2; i++) {
        const light = i === 0 ? lampA.current : lampB.current;
        const d = STOPS.lampsFrom + (k + i) * 12;
        const inRange = d >= STOPS.lampsFrom && d <= STOPS.lampsTo;
        placeAt(d, ROAD.center + (i === 0 ? 1 : -1) * (ROAD.halfWidth - 0.1), light.position);
        light.position.y = 2.8;
        light.intensity = inRange ? n * warmth * 9 : 0;
      }
    }
  }, -3);

  return (
    <>
      <hemisphereLight ref={hemi} />
      <directionalLight ref={key} />
      <directionalLight ref={rim} />
      {pointLights ? (
        <>
          <pointLight ref={lampA} color="#ffa54a" distance={9} decay={2} />
          <pointLight ref={lampB} color="#ffa54a" distance={9} decay={2} />
        </>
      ) : null}
    </>
  );
}

// ---- reflections -------------------------------------------------------------------------------
// A tiny studio of glowing panels, captured by a cube camera into scene.environment. It is
// re-rendered only when something visible changes: the truck moving (the streetlight
// strips sweep across the paint) or the shift fading between night and day. Parked, it
// costs nothing, which matters: every capture re-filters the whole reflection map.

function Panel({ position, rotation, scale, lookAtOrigin = false, panelRef }) {
  const mesh = useRef();
  useLayoutEffect(() => {
    if (lookAtOrigin) mesh.current.lookAt(0, 0, 0);
    if (panelRef) panelRef.current = mesh.current;
  });
  return (
    <mesh ref={mesh} position={position} rotation={rotation} scale={scale}>
      <planeGeometry />
      <meshBasicMaterial toneMapped={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

export function Reflections() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const studio = useMemo(() => new THREE.Scene(), []);
  const target = useMemo(() => {
    const t = new THREE.WebGLCubeRenderTarget(256);
    t.texture.type = THREE.HalfFloatType;
    return t;
  }, []);
  const cubeCamera = useMemo(() => new THREE.CubeCamera(0.1, 100, target), [target]);

  useLayoutEffect(() => {
    scene.environment = target.texture;
    return () => {
      if (scene.environment === target.texture) scene.environment = null;
      target.dispose();
    };
  }, [scene, target]);

  const top = useRef();
  const fill = useRef();
  const bounce = useRef();
  const rimPanel = useRef();
  const last = useRef({ night: NaN, built: false });
  const colors = useMemo(
    () => ({
      white: new THREE.Color('#ffffff'),
      lilac: new THREE.Color('#d8c8ff'),
      sodium: new THREE.Color('#ffa24a'),
      sky: new THREE.Color('#eef0ff'),
      warm: new THREE.Color('#f3e6d6'),
    }),
    [],
  );
  const apply = (mesh, color, intensity) => {
    if (mesh) mesh.material.color.copy(color).multiplyScalar(intensity);
  };

  useFrame(() => {
    const n = run.night;
    const l = last.current;
    if (l.built && Math.abs(n - l.night) < 1e-4) return;
    l.built = true;
    l.night = n;

    apply(top.current, tmp.copy(colors.sky).lerp(colors.lilac, n), lerp(2.2, 0.9, n));
    apply(fill.current, colors.white, lerp(1.1, 0.35, n));
    apply(bounce.current, colors.warm, lerp(0.5, 0.12, n));
    apply(rimPanel.current, tmp.copy(colors.white).lerp(colors.lilac, n), lerp(0.8, 1.6, n));

    const autoClear = gl.autoClear;
    gl.autoClear = true;
    cubeCamera.update(gl, studio);
    gl.autoClear = autoClear;
  }, -3);

  return createPortal(
    <>
      <Panel panelRef={top} position={[0, 7, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[14, 10, 1]} />
      <Panel panelRef={fill} position={[9, 2.5, 3]} scale={[8, 3, 1]} lookAtOrigin />
      <Panel panelRef={rimPanel} position={[-8, 3, -8]} scale={[10, 2.5, 1]} lookAtOrigin />
      <Panel panelRef={bounce} position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[16, 16, 1]} />
    </>,
    studio,
  );
}
