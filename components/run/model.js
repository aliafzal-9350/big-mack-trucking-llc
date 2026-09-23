import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

// The truck is meshopt-compressed with WebP textures (scripts/optimize-truck.mjs). Loading it
// with three's own GLTFLoader + the meshopt decoder avoids drei's useGLTF, which also bundles
// the Draco loader the model never needs.
export const TRUCK_MODEL = '/models/truck-run.glb';

const withMeshopt = (loader) => {
  loader.setMeshoptDecoder(MeshoptDecoder);
};

export const useTruckModel = () => useLoader(GLTFLoader, TRUCK_MODEL, withMeshopt);
export const preloadTruckModel = () => useLoader.preload(GLTFLoader, TRUCK_MODEL, withMeshopt);
