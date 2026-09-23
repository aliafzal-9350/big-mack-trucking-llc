'use client';

import { useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const KEEP = new Set(['position', 'normal', 'uv']);
const toGroup = new THREE.Matrix4();
const local = new THREE.Matrix4();

function isDynamic(obj, root) {
  for (let o = obj; o && o !== root; o = o.parent) if (o.userData.dynamic) return true;
  return false;
}

/**
 * Static batching for props. After mount, meshes under this group that share a material are
 * baked into one geometry each: one draw call per material instead of one per box. The
 * original meshes stay in the React tree, just hidden, and every static transform is frozen
 * so the scene graph stops recomputing matrices each frame.
 *
 * Left alone: anything under an object with userData.dynamic, transparent materials,
 * instanced meshes, sprites and point clouds.
 */
export default function Merge({ children }) {
  const group = useRef();

  useLayoutEffect(() => {
    const root = group.current;
    root.updateWorldMatrix(true, true);
    toGroup.copy(root.matrixWorld).invert();

    const buckets = new Map();
    root.traverse((o) => {
      if (!o.isMesh || o.isInstancedMesh || Array.isArray(o.material) || o.material.transparent) return;
      if (isDynamic(o, root) || !o.geometry.index) return;
      let bucket = buckets.get(o.material);
      if (!bucket) buckets.set(o.material, (bucket = { meshes: [], renderOrder: o.renderOrder }));
      bucket.meshes.push(o);
    });

    const merged = [];
    const hidden = [];
    for (const [material, bucket] of buckets) {
      if (bucket.meshes.length < 2) continue;
      const parts = bucket.meshes.map((m) => {
        const g = m.geometry.clone();
        for (const name of Object.keys(g.attributes)) if (!KEEP.has(name)) g.deleteAttribute(name);
        g.applyMatrix4(local.multiplyMatrices(toGroup, m.matrixWorld));
        return g;
      });
      const geometry = parts.every((g) => Object.keys(g.attributes).length === 3) ? mergeGeometries(parts, false) : null;
      parts.forEach((g) => g.dispose());
      if (!geometry) continue;
      const mesh = new THREE.Mesh(geometry, material);
      mesh.renderOrder = bucket.renderOrder;
      mesh.matrixAutoUpdate = false;
      mesh.userData.merged = true;
      root.add(mesh);
      merged.push(mesh);
      bucket.meshes.forEach((m) => {
        m.visible = false;
        hidden.push(m);
      });
    }

    // Freeze static transforms (the merged meshes sit at the group origin).
    root.traverse((o) => {
      if (o === root || isDynamic(o, root)) return;
      o.updateMatrix();
      o.matrixAutoUpdate = false;
    });

    return () => {
      merged.forEach((m) => {
        root.remove(m);
        m.geometry.dispose();
      });
      hidden.forEach((m) => {
        m.visible = true;
      });
    };
  }, []);

  return <group ref={group}>{children}</group>;
}
