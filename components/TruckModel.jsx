'use client';

import React, { useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';

// Real-world scale (meters). Truck is built centered on the world origin,
// grille facing -Z, cargo box extending toward +Z, driver side toward -X.
export const TRUCK = {
  wheelRadius: 0.5,
  wheelWidth: 0.3,
  frameTop: 1.0,
  frameThickness: 0.15,
  cabWidth: 2.3,
  cabHeight: 1.5,
  hoodLength: 1.0,
  cabinLength: 1.3,
  gap: 0.35,
  boxWidth: 2.5,
  boxHeight: 2.6,
  boxLength: 7.9,
};

const totalLength = TRUCK.hoodLength + TRUCK.cabinLength + TRUCK.gap + TRUCK.boxLength;
const frontZ = -totalLength / 2;
const hoodEndZ = frontZ + TRUCK.hoodLength;
const cabinEndZ = hoodEndZ + TRUCK.cabinLength;
const boxStartZ = cabinEndZ + TRUCK.gap;
const rearZ = boxStartZ + TRUCK.boxLength;

export const TRUCK_LAYOUT = { totalLength, frontZ, hoodEndZ, cabinEndZ, boxStartZ, rearZ };

const PAINT_CAB = { color: '#4C1D7A', metalness: 0.55, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.15 };
const PAINT_BOX = { color: '#4C1D7A', metalness: 0.4, roughness: 0.32, clearcoat: 0.6, clearcoatRoughness: 0.25 };
const BLACK_TRIM = { color: '#0B0B0D', roughness: 0.7, metalness: 0.3 };
const CHROME = { color: '#E8EAED', metalness: 1, roughness: 0.12 };
const RIM_STEEL = { color: '#C9CDD3', metalness: 0.85, roughness: 0.25 };
const TIRE = { color: '#111114', roughness: 0.9, metalness: 0 };
const GLASS = { color: '#0A0E14', roughness: 0.05, metalness: 0.2, transparent: true, opacity: 0.55, side: THREE.DoubleSide };
const RUB_RAIL = { color: '#C7CBD1', metalness: 0.6, roughness: 0.4 };

function Wheel({ position, dual = false }) {
  const offsets = dual ? [-0.19, 0.19] : [0];
  return (
    <group position={position}>
      {offsets.map((o, i) => (
        <group key={i} position={[o, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[TRUCK.wheelRadius, TRUCK.wheelRadius, TRUCK.wheelWidth, 24]} />
            <meshStandardMaterial {...TIRE} />
          </mesh>
          <mesh position={[0, TRUCK.wheelWidth / 2 - 0.015, 0]}>
            <cylinderGeometry args={[TRUCK.wheelRadius * 0.58, TRUCK.wheelRadius * 0.58, 0.03, 24]} />
            <meshStandardMaterial {...RIM_STEEL} />
          </mesh>
          <mesh position={[0, -(TRUCK.wheelWidth / 2 - 0.015), 0]}>
            <cylinderGeometry args={[TRUCK.wheelRadius * 0.58, TRUCK.wheelRadius * 0.58, 0.03, 24]} />
            <meshStandardMaterial {...RIM_STEEL} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Mirror({ side }) {
  const x = side * (TRUCK.cabWidth / 2 + 0.1);
  const y = TRUCK.frameTop + TRUCK.cabHeight * 0.72;
  const z = hoodEndZ + 0.05;
  return (
    <group position={[x, y, z]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.22, 8]} />
        <meshStandardMaterial {...CHROME} />
      </mesh>
      <mesh position={[side * 0.11, 0.12, 0]}>
        <boxGeometry args={[0.16, 0.22, 0.05]} />
        <meshStandardMaterial {...CHROME} />
      </mesh>
      <mesh position={[side * 0.14, 0.12, 0.001]}>
        <planeGeometry args={[0.1, 0.16]} />
        <meshStandardMaterial {...GLASS} />
      </mesh>
    </group>
  );
}

function CorrugationRibs({ side }) {
  const ref = useRef();
  const count = Math.floor(TRUCK.boxLength / 0.19);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      const z = boxStartZ + 0.12 + (i * (TRUCK.boxLength - 0.24)) / (count - 1);
      dummy.position.set(side * (TRUCK.boxWidth / 2 + 0.012), TRUCK.frameTop + TRUCK.boxHeight / 2, z);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  }, [count, side]);

  return (
    <instancedMesh ref={ref} args={[null, null, count]}>
      <boxGeometry args={[0.02, TRUCK.boxHeight * 0.82, 0.07]} />
      <meshPhysicalMaterial {...PAINT_BOX} />
    </instancedMesh>
  );
}

function SideDoor() {
  const x = -(TRUCK.boxWidth / 2 + 0.013);
  const z0 = boxStartZ + 1.0;
  const w = 1.0;
  const h = 1.7;
  const cy = TRUCK.frameTop + 0.15 + h / 2;
  return (
    <group>
      <mesh position={[x, cy + h / 2, z0 + w / 2]}>
        <boxGeometry args={[0.02, 0.03, w]} />
        <meshStandardMaterial {...RUB_RAIL} />
      </mesh>
      <mesh position={[x, cy - h / 2, z0 + w / 2]}>
        <boxGeometry args={[0.02, 0.03, w]} />
        <meshStandardMaterial {...RUB_RAIL} />
      </mesh>
      <mesh position={[x, cy, z0]}>
        <boxGeometry args={[0.02, h, 0.03]} />
        <meshStandardMaterial {...RUB_RAIL} />
      </mesh>
      <mesh position={[x, cy, z0 + w]}>
        <boxGeometry args={[0.02, h, 0.03]} />
        <meshStandardMaterial {...RUB_RAIL} />
      </mesh>
      <mesh position={[x, cy, z0 + w / 2]}>
        <boxGeometry args={[0.02, h, 0.02]} />
        <meshStandardMaterial {...RUB_RAIL} />
      </mesh>
      <mesh position={[x - 0.02, cy, z0 + w * 0.75]}>
        <boxGeometry args={[0.05, 0.15, 0.03]} />
        <meshStandardMaterial {...CHROME} />
      </mesh>
    </group>
  );
}

function RearDoorTrim() {
  const z = rearZ + 0.013;
  const h = TRUCK.boxHeight * 0.94;
  const cy = TRUCK.frameTop + TRUCK.boxHeight / 2;
  return (
    <group>
      <mesh position={[0, cy + h / 2, z]}>
        <boxGeometry args={[TRUCK.boxWidth * 0.98, 0.05, 0.02]} />
        <meshStandardMaterial {...CHROME} />
      </mesh>
      <mesh position={[0, cy, z]}>
        <boxGeometry args={[0.03, h, 0.02]} />
        <meshStandardMaterial {...RUB_RAIL} />
      </mesh>
      {[-0.4, 0.4].map((s) => (
        <mesh key={s} position={[TRUCK.boxWidth * s, cy, z + 0.015]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.1, 10]} />
          <meshStandardMaterial {...CHROME} />
        </mesh>
      ))}
    </group>
  );
}

export default function TruckModel() {
  return (
    <group>
      {/* Chassis rails */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 1.0, TRUCK.frameTop - TRUCK.frameThickness / 2, 0]}>
          <boxGeometry args={[0.12, TRUCK.frameThickness, totalLength * 0.96]} />
          <meshStandardMaterial {...BLACK_TRIM} />
        </mesh>
      ))}
      {[0.15, 0.4, 0.65, 0.9].map((t, i) => (
        <mesh key={i} position={[0, TRUCK.frameTop - TRUCK.frameThickness / 2, frontZ + totalLength * t]}>
          <boxGeometry args={[2.0, TRUCK.frameThickness * 0.7, 0.1]} />
          <meshStandardMaterial {...BLACK_TRIM} />
        </mesh>
      ))}
      {/* Fuel tank */}
      <mesh position={[1.05, TRUCK.frameTop - 0.35, cabinEndZ + 0.3]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.22, 0.22, 0.75, 16]} />
        <meshStandardMaterial {...BLACK_TRIM} />
      </mesh>

      {/* Wheels */}
      <Wheel position={[-1.08, TRUCK.wheelRadius, frontZ + TRUCK.hoodLength * 0.92]} />
      <Wheel position={[1.08, TRUCK.wheelRadius, frontZ + TRUCK.hoodLength * 0.92]} />
      <Wheel position={[-1.2, TRUCK.wheelRadius, rearZ - 1.4]} dual />
      <Wheel position={[1.2, TRUCK.wheelRadius, rearZ - 1.4]} dual />

      {/* Hood */}
      <RoundedBox
        args={[TRUCK.cabWidth * 0.9, 0.5, TRUCK.hoodLength]}
        radius={0.09}
        smoothness={4}
        position={[0, TRUCK.frameTop + 0.28, frontZ + TRUCK.hoodLength / 2]}
      >
        <meshPhysicalMaterial {...PAINT_CAB} />
      </RoundedBox>

      {/* Grille */}
      <mesh position={[0, TRUCK.frameTop + 0.28, frontZ - 0.01]}>
        <planeGeometry args={[0.82, 0.46]} />
        <meshStandardMaterial {...BLACK_TRIM} />
      </mesh>
      {[-0.14, -0.047, 0.047, 0.14].map((y, i) => (
        <mesh key={i} position={[0, TRUCK.frameTop + 0.28 + y, frontZ - 0.02]}>
          <boxGeometry args={[0.78, 0.025, 0.02]} />
          <meshStandardMaterial {...CHROME} />
        </mesh>
      ))}
      <mesh position={[0, TRUCK.frameTop + 0.52, frontZ - 0.02]}>
        <boxGeometry args={[0.9, 0.03, 0.03]} />
        <meshStandardMaterial {...CHROME} />
      </mesh>
      <mesh position={[0, TRUCK.frameTop + 0.04, frontZ - 0.02]}>
        <boxGeometry args={[0.9, 0.03, 0.03]} />
        <meshStandardMaterial {...CHROME} />
      </mesh>
      <mesh position={[-0.44, TRUCK.frameTop + 0.28, frontZ - 0.02]}>
        <boxGeometry args={[0.03, 0.5, 0.03]} />
        <meshStandardMaterial {...CHROME} />
      </mesh>
      <mesh position={[0.44, TRUCK.frameTop + 0.28, frontZ - 0.02]}>
        <boxGeometry args={[0.03, 0.5, 0.03]} />
        <meshStandardMaterial {...CHROME} />
      </mesh>

      {/* Bumper */}
      <RoundedBox
        args={[TRUCK.cabWidth, 0.26, 0.18]}
        radius={0.05}
        smoothness={4}
        position={[0, TRUCK.frameTop - 0.15, frontZ - 0.06]}
      >
        <meshStandardMaterial {...BLACK_TRIM} />
      </RoundedBox>

      {/* Headlights */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.62, TRUCK.frameTop + 0.28, frontZ - 0.02]}>
          <boxGeometry args={[0.24, 0.18, 0.06]} />
          <meshStandardMaterial color="#FFFFFF" emissive="#F1F5F9" emissiveIntensity={0.6} roughness={0.1} metalness={0.2} />
        </mesh>
      ))}

      {/* Cab shell */}
      <RoundedBox
        args={[TRUCK.cabWidth, TRUCK.cabHeight, TRUCK.cabinLength]}
        radius={0.1}
        smoothness={4}
        position={[0, TRUCK.frameTop + TRUCK.cabHeight / 2, hoodEndZ + TRUCK.cabinLength / 2]}
      >
        <meshPhysicalMaterial {...PAINT_CAB} />
      </RoundedBox>

      {/* Windshield */}
      <mesh position={[0, TRUCK.frameTop + TRUCK.cabHeight * 0.78, hoodEndZ + 0.02]} rotation={[-0.18, 0, 0]}>
        <planeGeometry args={[TRUCK.cabWidth * 0.86, TRUCK.cabHeight * 0.5]} />
        <meshStandardMaterial {...GLASS} />
      </mesh>

      {/* Door windows */}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[side * (TRUCK.cabWidth / 2 + 0.005), TRUCK.frameTop + TRUCK.cabHeight * 0.78, hoodEndZ + TRUCK.cabinLength * 0.55]}
          rotation={[0, side * Math.PI / 2, 0]}
        >
          <planeGeometry args={[TRUCK.cabinLength * 0.7, TRUCK.cabHeight * 0.42]} />
          <meshStandardMaterial {...GLASS} />
        </mesh>
      ))}

      <Mirror side={-1} />
      <Mirror side={1} />

      {/* Roof marker lights */}
      {Array.from({ length: 5 }).map((_, i) => {
        const x = -0.9 + (i / 4) * 1.8;
        return (
          <mesh key={i} position={[x, TRUCK.frameTop + TRUCK.cabHeight + 0.03, hoodEndZ + 0.1]}>
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshStandardMaterial color="#FF9500" emissive="#FF9500" emissiveIntensity={1.2} />
          </mesh>
        );
      })}

      {/* Exhaust stack */}
      <mesh position={[-1.15, TRUCK.frameTop + 0.9, cabinEndZ + 0.1]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1.8, 12]} />
        <meshStandardMaterial {...CHROME} />
      </mesh>
      <mesh position={[-1.15, TRUCK.frameTop + 0.05, cabinEndZ + 0.1]}>
        <cylinderGeometry args={[0.07, 0.07, 0.15, 12]} />
        <meshStandardMaterial {...BLACK_TRIM} />
      </mesh>

      {/* Cargo box */}
      <RoundedBox
        args={[TRUCK.boxWidth, TRUCK.boxHeight, TRUCK.boxLength]}
        radius={0.03}
        smoothness={4}
        position={[0, TRUCK.frameTop + TRUCK.boxHeight / 2, boxStartZ + TRUCK.boxLength / 2]}
      >
        <meshPhysicalMaterial {...PAINT_BOX} />
      </RoundedBox>

      <CorrugationRibs side={-1} />
      <CorrugationRibs side={1} />

      <mesh position={[0, TRUCK.frameTop + TRUCK.boxHeight - 0.04, boxStartZ + TRUCK.boxLength / 2]}>
        <boxGeometry args={[TRUCK.boxWidth + 0.02, 0.08, TRUCK.boxLength]} />
        <meshStandardMaterial {...RUB_RAIL} />
      </mesh>
      <mesh position={[0, TRUCK.frameTop + 0.05, boxStartZ + TRUCK.boxLength / 2]}>
        <boxGeometry args={[TRUCK.boxWidth + 0.02, 0.08, TRUCK.boxLength]} />
        <meshStandardMaterial {...RUB_RAIL} />
      </mesh>

      <SideDoor />
      <RearDoorTrim />
    </group>
  );
}
