'use client';

import React, { useEffect } from 'react';
import { Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Reusable logo + wordmark + compliance-line decal, used for both cargo-box
// sides and the rear door. `rotation` controls which way the panel faces.
export default function BrandingPanel({ position, rotation = [0, 0, 0], logoSize = 0.6, textScale = 1 }) {
  const logoTexture = useTexture('/image/logo-transparent.png');

  useEffect(() => {
    if (logoTexture) {
      logoTexture.anisotropy = 16;
      logoTexture.needsUpdate = true;
    }
  }, [logoTexture]);

  const forceFrontSide = (t) => {
    if (t.material) t.material.side = THREE.FrontSide;
  };

  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, logoSize * 0.42, 0]}>
        <planeGeometry args={[logoSize, logoSize]} />
        <meshStandardMaterial
          map={logoTexture}
          transparent
          roughness={0.25}
          metalness={0.1}
          depthWrite={false}
          polygonOffset
          polygonOffsetFactor={-4}
          side={THREE.FrontSide}
        />
      </mesh>
      <Text
        material-side={THREE.FrontSide}
        onSync={forceFrontSide}
        position={[0, -logoSize * 0.16, 0]}
        fontSize={0.1 * textScale}
        letterSpacing={0.03}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        fontWeight="900"
      >
        BIG MACK TRUCKING
      </Text>
      <Text
        material-side={THREE.FrontSide}
        onSync={forceFrontSide}
        position={[0, -logoSize * 0.16 - 0.09 * textScale, 0]}
        fontSize={0.05 * textScale}
        letterSpacing={0.03}
        color="#C9A9E0"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        USDOT 3843409 • MC 1398475
      </Text>
    </group>
  );
}
