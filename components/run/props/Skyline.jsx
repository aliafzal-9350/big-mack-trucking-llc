'use client';

import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { themedMaterial } from '../themed';
import { seeded } from './shared';

// A ring of distant blocks and towers against the horizon glow: the city around the harbor.
export default function Skyline({ count = 240 }) {
  const mesh = useRef();
  const material = useMemo(
    () => themedMaterial(new THREE.MeshBasicMaterial({ fog: false }), { color: 'skyline' }),
    [],
  );
  const blocks = useMemo(() => {
    const rand = seeded(3843409);
    return Array.from({ length: count }, () => {
      const angle = rand() * Math.PI * 2;
      const radius = 190 + rand() * 90;
      const tower = rand() > 0.86;
      const h = tower ? 22 + rand() * 38 : 4 + rand() * 14;
      return {
        x: 12 + Math.cos(angle) * radius,
        z: 100 + Math.sin(angle) * radius,
        w: 4 + rand() * 9,
        d: 4 + rand() * 9,
        h,
        r: rand() * Math.PI,
      };
    });
  }, [count]);

  useLayoutEffect(() => {
    const o = new THREE.Object3D();
    blocks.forEach((b, i) => {
      o.position.set(b.x, b.h / 2 - 0.5, b.z);
      o.rotation.set(0, b.r, 0);
      o.scale.set(b.w, b.h, b.d);
      o.updateMatrix();
      mesh.current.setMatrixAt(i, o.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
    mesh.current.computeBoundingSphere();
  }, [blocks]);

  return (
    <instancedMesh ref={mesh} args={[undefined, material, blocks.length]} renderOrder={-5}>
      <boxGeometry args={[1, 1, 1]} />
    </instancedMesh>
  );
}
