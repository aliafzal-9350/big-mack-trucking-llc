'use client';

import { useLayoutEffect, useMemo, useRef } from 'react';
import { createPortal, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { run } from '@/lib/runStore';
import { frameAt, headingOf } from '@/lib/path';
import { applyXrayCut, createHoloMaterial, xray, XRAY_TOP, XRAY_BOTTOM } from './xray';
import Livery from './Livery';
import Headlights from './Headlights';
import Liftgate from './Liftgate';
import LoadPlan from './LoadPlan';
import { useTruckModel } from './model';

const WHEEL_RADIUS = 0.15;

// Points on the truck the HUD pins labels to (truck-local), with the direction they face.
export const TRUCK_ANCHORS = {
  box: { p: [0.46, 0.98, -0.25], n: [1, 0, 0] },
  dock: { p: [0, 0.4, -1.42], n: [0, 0, -1] },
  liftgate: { p: [-0.3, 0.1, -1.95], n: [-0.4, 0, -1] },
  straps: { p: [-0.45, 0.72, -1.0], n: [-1, 0, 0] },
};
const ANCHOR_LIST = Object.entries(TRUCK_ANCHORS).map(([id, a]) => ({ id, p: new THREE.Vector3(...a.p), n: new THREE.Vector3(...a.n) }));

const standard = (params) => new THREE.MeshStandardMaterial(params);

function setupModel(scene) {
  const truck = scene.getObjectByName('Truck');
  const wheelFront = scene.getObjectByName('WheelFront');
  const wheelRear = scene.getObjectByName('WheelRear');

  // Everything except the wheels rides on the suspension.
  const body = new THREE.Group();
  body.name = 'Body';
  [...truck.children].forEach((child) => {
    if (child !== wheelFront && child !== wheelRear) body.add(child);
  });
  truck.add(body);

  const cab = new THREE.MeshPhysicalMaterial({
    color: '#4c1d80', metalness: 0.5, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.07, envMapIntensity: 1.15,
  });
  const box = applyXrayCut(new THREE.MeshPhysicalMaterial({
    color: '#2a1842', metalness: 0.22, roughness: 0.4, clearcoat: 0.55, clearcoatRoughness: 0.2, side: THREE.DoubleSide,
  }));
  const trim = standard({ color: '#d7dae1', metalness: 0.95, roughness: 0.2 });
  const chrome = standard({ color: '#e9ecf2', metalness: 1, roughness: 0.1 });
  const headlight = standard({ color: '#ffffff', metalness: 0.9, roughness: 0.15, emissive: new THREE.Color('#fff1d6'), emissiveIntensity: 0 });
  const tail = standard({ color: '#5a0d10', metalness: 0.4, roughness: 0.3, emissive: new THREE.Color('#ff2418'), emissiveIntensity: 0 });
  const amberFront = standard({ color: '#ff8a1c', roughness: 0.1, transparent: true, opacity: 0.8, emissive: new THREE.Color('#ff7a0a'), emissiveIntensity: 0 });
  const amberRear = amberFront.clone();
  const redLens = standard({ color: '#b3141b', roughness: 0.1, transparent: true, opacity: 0.85, emissive: new THREE.Color('#ff1d12'), emissiveIntensity: 0 });
  const clearLens = standard({ color: '#ffffff', roughness: 0.02, metalness: 0.2, transparent: true, opacity: 0.22, emissive: new THREE.Color('#fff4e0'), emissiveIntensity: 0 });
  const glass = standard({ color: '#090b14', metalness: 0.9, roughness: 0.04, transparent: true, opacity: 0.86, envMapIntensity: 1.6 });

  let boxMesh = null;
  truck.traverse((obj) => {
    if (!obj.isMesh) return;
    const m = obj.material;
    switch (obj.name) {
      case 'CabPaint': obj.material = cab; break;
      case 'BoxPaint': obj.material = box; boxMesh = obj; break;
      case 'Trim': obj.material = trim; break;
      case 'GrilleFrame': obj.material = chrome; break;
      case 'Mirror': obj.material = chrome; break;
      case 'Glass': obj.material = glass; break;
      case 'LightsFront': obj.material = headlight; break;
      case 'LightsRear': obj.material = tail; break;
      case 'LampAmberFront': obj.material = amberFront; break;
      case 'LampAmberRear': obj.material = amberRear; break;
      case 'LampRed': obj.material = redLens; break;
      case 'LampClearFront':
      case 'LampClearRear': obj.material = clearLens; break;
      case 'Aluminium':
      case 'Aluminium2': m.color.set('#c9ced6'); m.metalness = 0.9; m.roughness = 0.28; break;
      case 'Grille': m.color.set('#9aa0ab'); m.metalness = 0.9; m.roughness = 0.3; break;
      case 'Chassis': m.color.set('#6b6b75'); m.metalness = 0.4; m.roughness = 0.7; break;
      case 'Interior': m.color.set('#8d8c96'); break;
      case 'Badges': m.metalness = 0.3; m.roughness = 0.5; break;
      default:
        if (obj.name.startsWith('Rim')) { m.color.set('#cfd3db'); m.metalness = 0.92; m.roughness = 0.24; }
        else if (obj.name.startsWith('Tire')) { m.color.set('#121215'); m.metalness = 0; m.roughness = 0.88; }
        else if (obj.name.startsWith('Brake')) { m.color.set('#4a4e58'); m.metalness = 0.7; m.roughness = 0.45; }
    }
  });

  // Hologram shell that replaces the box above the x-ray scan line.
  let holo = null;
  if (boxMesh) {
    holo = new THREE.Mesh(boxMesh.geometry, createHoloMaterial());
    holo.position.copy(boxMesh.position);
    holo.quaternion.copy(boxMesh.quaternion);
    holo.scale.copy(boxMesh.scale);
    holo.renderOrder = 10;
    boxMesh.parent.add(holo);
  }

  return { truck, body, wheelFront, wheelRear, holo, mats: { headlight, tail, amberFront, amberRear, redLens, clearLens } };
}

const pos = new THREE.Vector3();
const tan = new THREE.Vector3();
const ahead = new THREE.Vector3();
const v = new THREE.Vector3();
const n = new THREE.Vector3();
const camDir = new THREE.Vector3();
const smooth = (e0, e1, x) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

export default function Truck() {
  const { scene } = useTruckModel();
  const model = useMemo(() => setupModel(scene), [scene]);
  const root = useRef();
  const motion = useRef({ pitch: 0, roll: 0, lastSpeed: 0 });
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);

  useLayoutEffect(() => {
    // The truck is a hero object: never let it pop out at frame edges.
    scene.traverse((o) => { o.frustumCulled = false; });
  }, [scene]);

  // Place the truck on the run and animate everything that rides with it.
  useFrame((state, dt) => {
    const g = root.current;
    if (!g) return;
    const { d, speed } = run;
    frameAt(d, pos, tan);
    g.position.copy(pos);
    const heading = headingOf(tan);
    g.rotation.y = heading;

    // Wheels roll exactly with distance travelled.
    model.wheelFront.rotation.x = d / WHEEL_RADIUS;
    model.wheelRear.rotation.x = d / WHEEL_RADIUS;

    // Suspension: nose dives under braking, squats under acceleration, leans into curves.
    const m = motion.current;
    const accel = (speed - m.lastSpeed) / Math.max(dt, 1e-3);
    m.lastSpeed = speed;
    frameAt(d + 1.5, ahead, v);
    let dHeading = headingOf(v) - heading;
    dHeading = Math.atan2(Math.sin(dHeading), Math.cos(dHeading));
    const lateral = speed * speed * (dHeading / 1.5);
    const k = 1 - Math.exp(-6 * dt);
    m.pitch += (THREE.MathUtils.clamp(-accel * 0.0009, -0.014, 0.014) - m.pitch) * k;
    m.roll += (THREE.MathUtils.clamp(lateral * 0.0005, -0.018, 0.018) - m.roll) * k;
    // Diesel idle: a barely-there shiver when parked with the engine on.
    const idle = run.reducedMotion ? 0 : (1 - Math.min(1, Math.abs(speed) / 2)) * 0.00035;
    const t = state.clock.elapsedTime;
    model.body.rotation.x = m.pitch + Math.sin(t * 31) * idle;
    model.body.rotation.z = m.roll + Math.sin(t * 27 + 1.3) * idle;
    model.body.position.y = Math.abs(m.pitch) * 0.6 + Math.sin(t * 23) * idle * 0.4;

    // Lights.
    const night = run.night;
    const intro = run.stage === 'ready' ? 1 : run.intro;
    const lampsOn = run.stage === 'fallback' ? 1 : smooth(0.34, 0.4, intro);
    const { hazards } = run.sample.state;
    const blink = hazards > 0.5 && Math.sin(t * 6.6) > 0 ? 1 : 0;
    model.mats.headlight.emissiveIntensity = THREE.MathUtils.lerp(0.25, 6, night) * lampsOn;
    model.mats.clearLens.emissiveIntensity = THREE.MathUtils.lerp(0.05, 0.9, night) * lampsOn;
    const tailBase = THREE.MathUtils.lerp(0.15, 1.3, night) * lampsOn;
    model.mats.tail.emissiveIntensity = tailBase + run.braking * 5;
    model.mats.redLens.emissiveIntensity = tailBase * 0.8 + run.braking * 3;
    const markers = THREE.MathUtils.lerp(0, 1.4, night) * lampsOn;
    model.mats.amberFront.emissiveIntensity = markers + blink * 4;
    model.mats.amberRear.emissiveIntensity = markers + blink * 4;

    // X-ray scan line.
    const { xray: xr } = run.sample.state;
    xray.uCut.value = xr < 0.002 ? 2 : THREE.MathUtils.lerp(XRAY_TOP, XRAY_BOTTOM, smooth(0, 1, xr));
    xray.uTime.value = t;
    if (model.holo) model.holo.material.uniforms.uAmount.value = Math.min(1, xr * 3);

    g.updateMatrixWorld(true);
  }, -3);

  // Project HUD anchors after the camera has moved (priority -1 runs after the rig at -2).
  // DOM is only touched when a pin is (or was just) on screen and something changed.
  useFrame(({ clock }) => {
    const els = run.hotspotEls;
    if (!els) return;
    const now = clock.elapsedTime;
    const body = model.body;
    camera.getWorldDirection(camDir);
    for (const a of ANCHOR_LIST) {
      const el = els[a.id];
      if (!el) continue;
      const state = el._pin || (el._pin = { x: NaN, y: NaN, facing: '', until: 0 });
      if (el.dataset.active === 'true') state.until = now + 0.6; // keep tracking through the fade-out
      if (now > state.until) continue;
      v.copy(a.p).applyMatrix4(body.matrixWorld);
      n.copy(a.n).transformDirection(body.matrixWorld);
      const facing = -n.dot(camDir) > 0.05 ? 'yes' : 'no';
      v.project(camera);
      const x = Math.round((v.x * 0.5 + 0.5) * size.width * 2) / 2;
      const y = Math.round((-v.y * 0.5 + 0.5) * size.height * 2) / 2;
      const f = facing === 'yes' && v.z < 1 ? 'yes' : 'no';
      if (x !== state.x || y !== state.y) {
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        state.x = x;
        state.y = y;
      }
      if (f !== state.facing) {
        el.dataset.facing = f;
        state.facing = f;
      }
    }
  }, -1);

  return (
    <group ref={root}>
      <primitive object={scene} />
      {createPortal(
        <>
          <Livery />
          <Headlights />
          <Liftgate />
          <LoadPlan />
        </>,
        model.body,
      )}
      <ContactShadows
        position={[0, 0.004, 0.05]}
        scale={[1.7, 3.3]}
        resolution={512}
        frames={1}
        blur={1.6}
        far={0.9}
        opacity={0.85}
        color="#050309"
      />
    </group>
  );
}
