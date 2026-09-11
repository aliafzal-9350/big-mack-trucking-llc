'use client';

import React from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import BrandingPanel from './BrandingPanel';

// Door compliance text matching official NY/NJ commercial registration
const doorText = `BIG MACK TRUCKING\nUSDOT: 3843409\nMC: 1398475`;

function CabStencil({ side }) {
  // side: -1 for driver side (-X), +1 for passenger side (+X)
  // rotY = side * (Math.PI / 2) points outward from the cab door on both sides
  return (
    <group position={[side * 0.418, 0.405, 0.98]} rotation={[0, side * (Math.PI / 2), 0]}>
      <Text
        material-side={THREE.DoubleSide}
        onSync={(t) => {
          if (t.material) {
            t.material.side = THREE.DoubleSide;
            t.material.toneMapped = false;
          }
        }}
        fontSize={0.019}
        lineHeight={1.25}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        textAlign="center"
        fontWeight="bold"
        letterSpacing={0.02}
      >
        {doorText}
      </Text>
    </group>
  );
}

export default function TruckDecals() {
  // Cargo Box wall geometry derived from GLTF mesh bounds:
  // Side wall length: Z from -1.284 to +0.480 => True horizontal center = -0.402
  // Side wall height: Y from 0.393 to 1.042 => True vertical center = 0.718
  // Box side surface: X = ±0.439 => Placement at X = ±0.441
  // Cab side door stencils removed per user request (clean purple doors).
  return (
    <group>
      {/* Driver-side cargo box (outward facing normal: -X, perfectly centered) */}
      <BrandingPanel
        position={[-0.441, 0.71, -0.402]}
        rotation={[0, -Math.PI / 2, 0]}
        logoSize={0.42}
      />

      {/* Passenger-side cargo box (outward facing normal: +X, perfectly centered) */}
      <BrandingPanel
        position={[0.441, 0.71, -0.402]}
        rotation={[0, Math.PI / 2, 0]}
        logoSize={0.42}
      />

      {/* Rear roll-up door (outward facing normal: -Z, perfectly centered) */}
      <BrandingPanel
        position={[0, 0.71, -1.314]}
        rotation={[0, Math.PI, 0]}
        logoSize={0.46}
        textScale={1.05}
      />
    </group>
  );
}

