'use client';

import React, { useEffect } from 'react';
import { Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Reusable logo decal + compliance line, centered across cargo-box sides
// and rear rollup door. Tuned to ensure high fidelity, non-mirrored reading,
// and balanced vertical/horizontal centroid.
export default function BrandingPanel({ position, rotation = [0, 0, 0], logoSize = 0.44, textScale = 1 }) {
  const logoTexture = useTexture('/image/logo-transparent.png');

  useEffect(() => {
    if (logoTexture) {
      logoTexture.anisotropy = 16;
      logoTexture.generateMipmaps = true;
      logoTexture.minFilter = THREE.LinearMipmapLinearFilter;
      logoTexture.magFilter = THREE.LinearFilter;
      logoTexture.needsUpdate = true;
    }
  }, [logoTexture]);

  const forceDoubleSide = (t) => {
    if (t.material) {
      t.material.side = THREE.DoubleSide;
      t.material.toneMapped = false;
    }
  };

  return (
    <group position={position} rotation={rotation}>
      {/* High resolution circular emblem */}
      <mesh position={[0, logoSize * 0.12, 0]}>
        <planeGeometry args={[logoSize, logoSize]} />
        <meshStandardMaterial
          map={logoTexture}
          transparent
          roughness={0.22}
          metalness={0.08}
          depthWrite={false}
          polygonOffset
          polygonOffsetFactor={-4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Official compliance wordmark */}
      <Text
        material-side={THREE.DoubleSide}
        onSync={forceDoubleSide}
        position={[0, -logoSize * 0.48, 0]}
        fontSize={0.044 * textScale}
        letterSpacing={0.04}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        USDOT 3843409 • MC 1398475
      </Text>
    </group>
  );
}

