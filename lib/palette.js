import { Color } from 'three';

// Scene colors for the two shifts. Night is the NY/NJ harbor after dark: violet sky with
// the orange sodium glow that street and port lighting throws onto low cloud. Day is
// overcast concrete. Everything themed in 3D blends between the two with `run.night`.
const NIGHT = {
  skyTop: '#0b0817',
  skyMid: '#231637',
  skyHorizon: '#5a2f46',
  fog: '#1b1229',
  ground: '#0f0c17',
  gridMinor: '#2a2140',
  gridMajor: '#45366a',
  road: '#15121c',
  roadEdge: '#bdb3cf',
  roadCenter: '#d9952f',
  sodium: '#ffa54a',
  lilac: '#c9b3ee',
  violet: '#6b35a0',
  pointer: '#b48cf0',
  wall: '#1e1829',
  wallTrim: '#2c2439',
  skyline: '#140e20',
  hemiSky: '#6e5a9a',
  hemiGround: '#120c1c',
  key: '#d9ccff',
  rim: '#ff9d4d',
};

const DAY = {
  skyTop: '#bfb8d1',
  skyMid: '#ddd8e6',
  skyHorizon: '#f1e9e1',
  fog: '#e2dde7',
  ground: '#c9c4cf',
  gridMinor: '#b7b0c1',
  gridMajor: '#9d94ad',
  road: '#6f6b78',
  roadEdge: '#f4f2f7',
  roadCenter: '#e2a53a',
  sodium: '#8a8494',
  lilac: '#6b35a0',
  violet: '#5a2a8c',
  pointer: '#6b35a0',
  wall: '#b7b1bf',
  wallTrim: '#a39cab',
  skyline: '#b9b3c6',
  hemiSky: '#f1eef8',
  hemiGround: '#8d8697',
  key: '#fff5e8',
  rim: '#ffffff',
};

export const PALETTE = {};
for (const key of Object.keys(NIGHT)) {
  PALETTE[key] = { night: new Color(NIGHT[key]), day: new Color(DAY[key]) };
}

/** Writes the blend of a palette entry for `night` (0 = day, 1 = night) into `out`. */
export function themed(key, night, out) {
  const entry = PALETTE[key];
  return out.copy(entry.day).lerp(entry.night, night);
}

// Shipping-container paint, muted so the purple truck stays the brightest color in frame.
export const CONTAINER_COLORS = ['#7c3a33', '#2c4a6e', '#3d6b66', '#6d6f78', '#8a6a3f', '#4a2d6e', '#6f2f3c', '#35555f'];
