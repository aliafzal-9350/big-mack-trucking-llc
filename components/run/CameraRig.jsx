'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { run } from '@/lib/runStore';
import { frameAt, headingOf } from '@/lib/path';

const DEG = Math.PI / 180;
const P = new THREE.Vector3();
const T = new THREE.Vector3();
const target = new THREE.Vector3();
const eye = new THREE.Vector3();
const local = new THREE.Vector3();

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);

/**
 * Orbit camera that follows the truck along the run.
 *  - pose comes from the beat table (lib/timeline.js), blended by scroll
 *  - framing uses a lens shift (setViewOffset) instead of aiming off-center, so the truck
 *    can sit beside the text without the perspective skewing
 *  - portrait screens pull back and widen so the whole truck stays in frame
 */
export default function CameraRig() {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const smoothed = useRef({ ready: false, eye: new THREE.Vector3(), target: new THREE.Vector3(), fov: 30, sx: 0, sy: 0 });

  useFrame((_, dt) => {
    const s = smoothed.current;
    const { cam, frame } = run.sample;
    const aspect = size.width / size.height;
    const portrait = clamp01((1.05 - aspect) / (1.05 - 0.46));

    // Ignition push-in: start wider and a little lower, settle into the hero pose.
    const intro = run.stage === 'ready' || run.reducedMotion ? 1 : run.intro;
    const settle = 1 - easeOutCubic(clamp01(intro / 0.92));

    const pointer = run.pointer.active && !run.reducedMotion ? run.pointer : { nx: 0, ny: 0 };
    const az = (cam.az + settle * 24 + pointer.nx * 2.2) * DEG;
    const el = (cam.el + settle * 3 - pointer.ny * 1.1) * DEG;
    const dist = cam.dist * (1 + settle * 0.42) * (1 + portrait * 0.5);

    frameAt(run.d, P, T);
    const heading = headingOf(T);
    local.fromArray(cam.target).applyAxisAngle(THREE.Object3D.DEFAULT_UP, heading);
    target.copy(P).add(local);
    local.set(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el)).multiplyScalar(dist);
    local.applyAxisAngle(THREE.Object3D.DEFAULT_UP, heading);
    eye.copy(target).add(local);
    if (eye.y < 0.18) eye.y = 0.18;

    const fov = cam.fov * (1 + portrait * 0.22);
    const f = portrait > 0.5 ? frame.tall : frame.wide;

    if (!s.ready) {
      s.eye.copy(eye);
      s.target.copy(target);
      s.fov = fov;
      s.sx = f[0];
      s.sy = f[1];
      s.ready = true;
    } else {
      // A second, lighter smoothing on top of the scroll damping gives the camera weight without dragging.
      const k = 1 - Math.exp(-(run.reducedMotion ? 30 : 14) * dt);
      s.eye.lerp(eye, k);
      s.target.lerp(target, k);
      s.fov += (fov - s.fov) * k;
      s.sx += (f[0] - s.sx) * k;
      s.sy += (f[1] - s.sy) * k;
    }

    camera.position.copy(s.eye);
    camera.lookAt(s.target);
    camera.fov = s.fov;
    camera.setViewOffset(size.width, size.height, -s.sx * size.width, s.sy * size.height, size.width, size.height);
    camera.updateProjectionMatrix();
  }, -2);

  return null;
}
