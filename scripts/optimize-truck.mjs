// Rebuilds public/models/truck-run.glb from the archived Sketchfab source.
//
//   npm run model
//
// What it does, in order:
//  - bakes the Sketchfab node transforms and the x34 display scale into the vertices
//  - names meshes/materials by role (CabPaint, BoxPaint, Tire, ...) so the runtime can look them up
//  - splits rims/tires/brakes into two axle pivots (WheelFront / WheelRear) so the wheels can spin
//  - splits the lamp meshes into Front/Rear parts so headlights and tail lights glow different colors
//  - removes the GMC trademarks from the badge + interior textures
//  - drops KHR_materials_transmission (it forces three.js to render the scene twice per frame)
//    and KHR_materials_specular
//  - drops unused TEXCOORD_1 / TANGENT streams, resizes textures, encodes WebP
//  - quantizes + meshopt-compresses the geometry (drei's useGLTF decodes meshopt out of the box)
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, EXTTextureWebP } from '@gltf-transform/extensions';
import { transformMesh, transformPrimitive, compactPrimitive, prune, dedup, meshopt } from '@gltf-transform/functions';
import { MeshoptEncoder } from 'meshoptimizer';
import sharp from 'sharp';
import { mat4 } from 'gl-matrix';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, '_archive/truck.glb');
const DST = path.join(ROOT, 'public/models/truck-run.glb');

const SCALE = 34;
const AXLE_Y = 0.15;
const FRONT_Z = 1.128;
const REAR_Z = -0.833;
const AXLE_SPLIT_Z = (FRONT_Z + REAR_Z) / 2;

// Material name in the source file -> role name used by the site.
const ROLE = {
  gmcphong8SG1: 'CabPaint', gmcphong16SG1: 'BoxPaint', gmcphong5SG1: 'Chassis', gmcphong4SG1: 'Interior',
  gmcphong1SG1: 'Badges', gmcphong19SG1: 'Mirror', gmcphong9SG1: 'Glass', gmcphong6SG1: 'Grille',
  gmcphong11SG1: 'Aluminium', gmcphong14SG1: 'LampAmber', gmcphong13SG1: 'LampRed', gmcphong2SG1: 'LampClear',
  gmcphong7SG1: 'Trim', gmcphong12SG1: 'GrilleFrame', gmcphong3SG1: 'Rim', gmcphong18SG1: 'Tire',
  gmcphong17SG1: 'BrakeDrum', gmcphong15SG1: 'BrakeDisc', gmcphong10SG1: 'Lights',
};
const WHEEL_ROLES = new Set(['Rim', 'Tire', 'BrakeDrum', 'BrakeDisc']);
const FRONT_REAR_ROLES = new Set(['Lights', 'LampClear', 'LampAmber']);

await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder });
const doc = await io.read(SRC);
const root = doc.getRoot();
const scene = root.listScenes()[0];
const buffer = root.listBuffers()[0];

// ---- Bake world transforms (+ display scale) into each mesh --------------------------------
const meshNodes = [];
scene.traverse((node) => { if (node.getMesh()) meshNodes.push(node); });
const scaleMatrix = mat4.fromScaling([], [SCALE, SCALE, SCALE]);
const baked = meshNodes.map((node) => {
  const mesh = node.getMesh();
  transformMesh(mesh, mat4.multiply([], scaleMatrix, node.getWorldMatrix()));
  const sourceMaterial = mesh.listPrimitives()[0].getMaterial().getName();
  return { mesh, role: ROLE[sourceMaterial] ?? sourceMaterial };
});
for (const node of root.listNodes()) node.dispose();
for (const material of root.listMaterials()) material.setName(ROLE[material.getName()] ?? material.getName());

// ---- Rebuild a flat hierarchy with two wheel pivots ---------------------------------------
const truck = doc.createNode('Truck');
scene.addChild(truck);
const wheelFront = doc.createNode('WheelFront').setTranslation([0, AXLE_Y, FRONT_Z]);
const wheelRear = doc.createNode('WheelRear').setTranslation([0, AXLE_Y, REAR_Z]);
truck.addChild(wheelFront).addChild(wheelRear);

/** Copy of `prim` holding only the triangles whose centroid passes `keep`, with unused vertices removed. */
function subsetPrimitive(prim, keep) {
  const position = prim.getAttribute('POSITION');
  const source = prim.getIndices().getArray();
  const kept = [];
  const a = [], b = [], c = [];
  for (let t = 0; t < source.length; t += 3) {
    position.getElement(source[t], a);
    position.getElement(source[t + 1], b);
    position.getElement(source[t + 2], c);
    if (keep([(a[0] + b[0] + c[0]) / 3, (a[1] + b[1] + c[1]) / 3, (a[2] + b[2] + c[2]) / 3])) {
      kept.push(source[t], source[t + 1], source[t + 2]);
    }
  }
  const part = prim.clone();
  part.setIndices(doc.createAccessor().setType('SCALAR').setArray(new Uint32Array(kept)).setBuffer(buffer));
  compactPrimitive(part);
  return { part, triangles: kept.length / 3 };
}

function boundsOf(prim) {
  const position = prim.getAttribute('POSITION');
  const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity], v = [];
  for (let i = 0; i < position.getCount(); i++) {
    position.getElement(i, v);
    for (let k = 0; k < 3; k++) { min[k] = Math.min(min[k], v[k]); max[k] = Math.max(max[k], v[k]); }
  }
  return `min=${min.map((n) => n.toFixed(3))} max=${max.map((n) => n.toFixed(3))}`;
}

const seen = new Map();
const uniqueName = (role) => {
  const n = (seen.get(role) ?? 0) + 1;
  seen.set(role, n);
  return n === 1 ? role : `${role}${n}`;
};

for (const { mesh, role } of baked) {
  const prim = mesh.listPrimitives()[0];

  if (WHEEL_ROLES.has(role)) {
    for (const [side, pivot, axleZ] of [['Front', wheelFront, FRONT_Z], ['Rear', wheelRear, REAR_Z]]) {
      const { part, triangles } = subsetPrimitive(prim, (p) => (side === 'Front' ? p[2] > AXLE_SPLIT_Z : p[2] <= AXLE_SPLIT_Z));
      if (!triangles) continue;
      transformPrimitive(part, mat4.fromTranslation([], [0, -AXLE_Y, -axleZ]));
      const name = `${role}${side}`;
      pivot.addChild(doc.createNode(name).setMesh(doc.createMesh(name).addPrimitive(part)));
      console.log(`wheel  ${name.padEnd(16)} ${triangles} tris`);
    }
    mesh.dispose();
    continue;
  }

  if (FRONT_REAR_ROLES.has(role)) {
    for (const side of ['Front', 'Rear']) {
      const { part, triangles } = subsetPrimitive(prim, (p) => (side === 'Front' ? p[2] > 0 : p[2] <= 0));
      if (!triangles) continue;
      const name = `${role}${side}`;
      truck.addChild(doc.createNode(name).setMesh(doc.createMesh(name).addPrimitive(part)));
      console.log(`lamp   ${name.padEnd(16)} ${triangles} tris ${boundsOf(part)}`);
    }
    mesh.dispose();
    continue;
  }

  const name = uniqueName(role);
  mesh.setName(name);
  truck.addChild(doc.createNode(name).setMesh(mesh));
}

// ---- Strip expensive / unused material extensions ------------------------------------------
for (const extension of root.listExtensionsUsed()) {
  if (['KHR_materials_transmission', 'KHR_materials_specular'].includes(extension.extensionName)) extension.dispose();
}

// ---- Drop unused vertex streams -------------------------------------------------------------
for (const mesh of root.listMeshes()) {
  for (const prim of mesh.listPrimitives()) {
    const m = prim.getMaterial();
    const infos = m ? [m.getBaseColorTextureInfo(), m.getNormalTextureInfo(), m.getMetallicRoughnessTextureInfo(), m.getOcclusionTextureInfo(), m.getEmissiveTextureInfo()] : [];
    if (!infos.some((info) => info && info.getTexCoord() === 1)) prim.setAttribute('TEXCOORD_1', null);
    prim.setAttribute('TANGENT', null);
  }
}

// ---- Textures: remove trademarks, resize, WebP ---------------------------------------------
const solid = (width, height, background = { r: 0, g: 0, b: 0, alpha: 1 }) =>
  sharp({ create: { width, height, channels: 4, background } }).png().toBuffer();

const TEXTURE_EDITS = {
  // Grille logo band, model badge and model-number badge -> fully transparent (material is BLEND).
  'Badges.base': async (png) => sharp(png).composite([
    { input: await solid(1024, 262), left: 0, top: 0, blend: 'dest-out' },
    { input: await solid(500, 250), left: 0, top: 262, blend: 'dest-out' },
    { input: await solid(175, 250), left: 500, top: 265, blend: 'dest-out' },
  ]).png().toBuffer(),
  // Steering-wheel hub logo -> painted over with the surrounding plastic.
  'Interior.base': async (png) => sharp(png).composite([
    { input: await solid(300, 150, { r: 44, g: 44, b: 44, alpha: 1 }), left: 150, top: 160 },
  ]).png().toBuffer(),
};

async function processTexture(texture, key, maxSize, quality) {
  // Copy out of the glTF buffer and normalize every source (incl. the grey+alpha grille mask) to sRGBA.
  const source = Buffer.from(texture.getImage());
  const { width, height } = await sharp(source).metadata();
  let png = await sharp(source).toColourspace('srgb').ensureAlpha().png().toBuffer();
  if (TEXTURE_EDITS[key]) png = await TEXTURE_EDITS[key](png);
  const scale = Math.min(1, maxSize / Math.max(width, height));
  const w = Math.round(width * scale), h = Math.round(height * scale);
  const out = await sharp(png).resize(w, h, { kernel: 'lanczos3' }).webp({ quality, alphaQuality: 90, effort: 6 }).toBuffer();
  texture.setImage(out).setMimeType('image/webp');
  console.log(`tex    ${key.padEnd(18)} ${width}x${height} -> ${w}x${h} ${(out.length / 1024).toFixed(1)}KB`);
}

doc.createExtension(EXTTextureWebP).setRequired(true);
const done = new Set();
for (const material of root.listMaterials()) {
  const slots = { base: material.getBaseColorTexture(), normal: material.getNormalTexture(), mr: material.getMetallicRoughnessTexture() };
  for (const [slot, texture] of Object.entries(slots)) {
    if (!texture || done.has(texture)) continue;
    done.add(texture);
    const key = `${material.getName()}.${slot}`;
    await processTexture(texture, key, key === 'Badges.base' ? 1024 : 512, slot === 'normal' ? 90 : 84);
  }
}

// ---- Clean up + compress --------------------------------------------------------------------
await doc.transform(
  dedup(),
  prune(),
  meshopt({ encoder: MeshoptEncoder, level: 'medium', quantizePosition: 14, quantizeNormal: 10, quantizeTexcoord: 12 }),
);
await io.write(DST, doc);

const mb = (file) => (fs.statSync(file).size / 1024 / 1024).toFixed(2);
console.log(`\n${path.relative(ROOT, SRC)} ${mb(SRC)}MB -> ${path.relative(ROOT, DST)} ${mb(DST)}MB`);
