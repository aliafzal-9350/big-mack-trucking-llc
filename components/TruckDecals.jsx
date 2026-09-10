'use client';

import React from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import BrandingPanel from './BrandingPanel';

// Coordinates below are already in the primitive's FINAL rendered scale
// (i.e. post the primitive's own scale={34} in BigMackCanvas.jsx) -- do not
// wrap this in another scale, or every position ends up ~34x too far from
// the truck (invisible, off in empty space). Tuned against this specific
// truck.glb's geometry. Model convention: front (grille) faces +Z, rear
// faces -Z, driver side -X.
const doorText = `BIG MACK TRUCKING\nUSDOT: 3843409\nMC: 1398475`;

function CabStencil({ side }) {
  return (
    <group position={[side * 0.416, 0.48, 0.92]} rotation={[0, side * (-Math.PI / 2), 0]}>
      <Text
        material-side={THREE.DoubleSide}
        onSync={(t) => { if (t.material) t.material.side = THREE.DoubleSide; }}
        fontSize={0.026}
        lineHeight={1.3}
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
  return (
    <group>
      <CabStencil side={-1} />
      <CabStencil side={1} />

      {/* Driver-side cargo box (panel faces -X, outward) */}
      <BrandingPanel position={[-0.441, 0.68, -0.39]} rotation={[0, -Math.PI / 2, 0]} logoSize={0.62} />
      {/* Passenger-side cargo box (panel faces +X, outward) */}
      <BrandingPanel position={[0.441, 0.68, -0.39]} rotation={[0, Math.PI / 2, 0]} logoSize={0.62} />
      {/* Rear roll-up door (panel faces -Z, outward) */}
      <BrandingPanel position={[0, 0.68, -1.312]} rotation={[0, Math.PI, 0]} logoSize={0.7} textScale={1.1} />
    </group>
  );
}
