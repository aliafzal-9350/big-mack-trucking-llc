'use client';

import React from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import BrandingPanel from './BrandingPanel';
import { TRUCK, TRUCK_LAYOUT } from './TruckModel';

// Small monochrome compliance stencil on each cab door, matching the real truck.
function CabStencil({ side }) {
  const x = side * (TRUCK.cabWidth / 2 + 0.008);
  const y = TRUCK.frameTop + TRUCK.cabHeight * 0.42;
  const z = TRUCK_LAYOUT.hoodEndZ + TRUCK.cabinLength * 0.42;

  return (
    <group position={[x, y, z]} rotation={[0, side * (Math.PI / 2), 0]}>
      <Text
        material-side={THREE.FrontSide}
        onSync={(t) => { if (t.material) t.material.side = THREE.FrontSide; }}
        fontSize={0.028}
        lineHeight={1.35}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        textAlign="center"
        fontWeight="bold"
        letterSpacing={0.02}
      >
        {`BIG MACK TRUCKING\nUSDOT: 3843409\nMC: 1398475`}
      </Text>
    </group>
  );
}

export default function TruckDecals() {
  const boxMidZ = (TRUCK_LAYOUT.boxStartZ + TRUCK_LAYOUT.rearZ) / 2;
  const boxCenterY = TRUCK.frameTop + TRUCK.boxHeight * 0.56;

  return (
    <group>
      <CabStencil side={-1} />
      <CabStencil side={1} />

      {/* Driver-side box branding (panel faces -X, outward) */}
      <BrandingPanel
        position={[-(TRUCK.boxWidth / 2 + 0.02), boxCenterY, boxMidZ]}
        rotation={[0, -Math.PI / 2, 0]}
        logoSize={0.62}
      />
      {/* Passenger-side box branding (panel faces +X, outward) */}
      <BrandingPanel
        position={[TRUCK.boxWidth / 2 + 0.02, boxCenterY, boxMidZ]}
        rotation={[0, Math.PI / 2, 0]}
        logoSize={0.62}
      />
      {/* Rear door branding (panel faces +Z, outward — no rotation needed) */}
      <BrandingPanel
        position={[0, boxCenterY, TRUCK_LAYOUT.rearZ + 0.02]}
        rotation={[0, 0, 0]}
        logoSize={0.72}
        textScale={1.1}
      />
    </group>
  );
}
