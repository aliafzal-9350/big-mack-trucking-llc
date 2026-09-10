'use client';

import React, { useEffect } from 'react';
import { Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Reusable logo decal + small compliance line, used for both cargo-box
// sides and the rear door. The logo art already bakes in the "BIG MACK
// TRUCKING" wordmark, so we don't duplicate it as separate 3D text --
// matching a clean vinyl-wrap look instead of a stacked HTML-label feel.
// `rotation` controls which way the panel faces.
export default function BrandingPanel({ position, rotation = [0, 0, 0], logoSize = 0.62, textScale = 1 }) {
  const logoTexture = useTexture('/image/logo-transparent.png');

  useEffect(() => {
    if (logoTexture) {
      logoTexture.anisotropy = 16;
      logoTexture.needsUpdate = true;
    }
  }, [logoTexture]);

  // DoubleSide so the decal shows up regardless of which way the panel
  // ends up facing after rotation -- avoids invisible-decal bugs from a
  // flipped normal being fully backface-culled.
  const forceDoubleSide = (t) => {
    if (t.material) t.material.side = THREE.DoubleSide;
  };

  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, logoSize * 0.06, 0]}>
        <planeGeometry args={[logoSize, logoSize]} />
        <meshStandardMaterial
          map={logoTexture}
          transparent
          roughness={0.3}
          metalness={0.05}
          depthWrite={false}
          polygonOffset
          polygonOffsetFactor={-4}
          side={THREE.DoubleSide}
        />
      </mesh>
      <Text
        material-side={THREE.DoubleSide}
        onSync={forceDoubleSide}
        position={[0, -logoSize * 0.56, 0]}
        fontSize={0.048 * textScale}
        letterSpacing={0.03}
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
