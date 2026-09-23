import * as THREE from 'three';

// The cargo box "x-ray": a horizontal scan line sweeps down the box. Above the line the
// painted box (and its lettering) is cut away and a hologram shell shows the load inside.
// uCut is a world-space height; anything at or above 1.2 means "nothing cut".
export const xray = {
  uCut: { value: 2 },
  uCutColor: { value: new THREE.Color('#c9b3ee') },
  uTime: { value: 0 },
};

export const XRAY_TOP = 1.14;
export const XRAY_BOTTOM = 0.3;

/** Patch a built-in material so it is discarded above the scan line, with a glowing edge. */
export function applyXrayCut(material) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uCut = xray.uCut;
    shader.uniforms.uCutColor = xray.uCutColor;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying float vCutY;')
      .replace('#include <project_vertex>', '#include <project_vertex>\nvCutY = (modelMatrix * vec4(transformed, 1.0)).y;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying float vCutY;\nuniform float uCut;\nuniform vec3 uCutColor;')
      .replace('#include <clipping_planes_fragment>', '#include <clipping_planes_fragment>\nif (vCutY > uCut) discard;')
      .replace(
        '#include <dithering_fragment>',
        `#include <dithering_fragment>
        float cutEdge = (1.0 - smoothstep(0.0, 0.02, uCut - vCutY)) * step(uCut, 1.2);
        gl_FragColor.rgb = mix(gl_FragColor.rgb, uCutColor * 4.0, cutEdge);`
      );
  };
  material.customProgramCacheKey = () => 'xray-cut';
  material.needsUpdate = true;
  return material;
}

/** Additive hologram for the cut-away part of the box: fresnel rim + moving scan lines. */
export function createHoloMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uCut: xray.uCut,
      uTime: xray.uTime,
      uColor: { value: new THREE.Color('#b99cf0') },
      uAmount: { value: 0 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vNormalW;
      varying vec3 vViewW;
      varying float vY;
      void main() {
        vec4 world = modelMatrix * vec4(position, 1.0);
        vY = world.y;
        vNormalW = normalize(mat3(modelMatrix) * normal);
        vViewW = cameraPosition - world.xyz;
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uCut;
      uniform float uTime;
      uniform float uAmount;
      uniform vec3 uColor;
      varying vec3 vNormalW;
      varying vec3 vViewW;
      varying float vY;
      void main() {
        if (vY < uCut || uAmount < 0.001) discard;
        float facing = abs(dot(normalize(vNormalW), normalize(vViewW)));
        float rim = pow(1.0 - facing, 2.2);
        float lines = smoothstep(0.86, 1.0, fract(vY * 34.0 - uTime * 0.35));
        float a = (0.05 + rim * 0.65 + lines * 0.1) * uAmount;
        gl_FragColor = vec4(uColor * a, 1.0);
        #include <colorspace_fragment>
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    toneMapped: false,
  });
}
