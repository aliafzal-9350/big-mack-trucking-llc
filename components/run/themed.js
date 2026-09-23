import * as THREE from 'three';
import { themed as blendPalette } from '@/lib/palette';

// Materials that follow the shift (day/night) and the ignition sequence. <WorldDriver /> calls
// updateThemed() whenever the shift blend or lamp warm-up changes (or a material registers);
// registering is a one-liner where the material is created.
const entries = new Set();
let dirty = true;

/** True once after a material was registered, so the next frame blends it in. */
export function takeThemeDirty() {
  const d = dirty;
  dirty = false;
  return d;
}

/**
 * @param material a three.js material
 * @param opts.color     palette key for material.color
 * @param opts.emissive  [dayIntensity, nightIntensity]
 * @param opts.sodium    true for sodium-vapor lamps: they warm up from a dull red when the
 *                       page loads, like real high-pressure sodium fixtures
 */
export function themedMaterial(material, opts) {
  entries.add({ material, ...opts });
  dirty = true;
  return material;
}

const SODIUM_COLD = new THREE.Color('#8a2410');
const SODIUM_WARM = new THREE.Color('#ffa54a');

export function updateThemed(night, lampWarmth) {
  for (const e of entries) {
    const m = e.material;
    if (e.color) blendPalette(e.color, night, m.color);
    if (e.emissive) {
      const on = e.sodium ? lampWarmth : 1;
      const intensity = THREE.MathUtils.lerp(e.emissive[0], e.emissive[1], night) * on;
      if ('emissiveIntensity' in m) m.emissiveIntensity = intensity;
      else if (m.opacity !== undefined) m.opacity = Math.min(1, intensity);
      if (e.sodium && m.emissive) m.emissive.copy(SODIUM_COLD).lerp(SODIUM_WARM, Math.min(1, lampWarmth * 1.2));
      if (e.sodium && m.isPointsMaterial) m.color.copy(SODIUM_COLD).lerp(SODIUM_WARM, Math.min(1, lampWarmth * 1.2)).multiplyScalar(1.6);
    }
  }
}
