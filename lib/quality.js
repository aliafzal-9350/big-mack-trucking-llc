// Rendering budgets, chosen once when the canvas mounts. `dpr` clamps the device pixel
// ratio. It is not adapted at runtime: resizing the composer's targets stalls for seconds
// on ANGLE/D3D11, which is worse than a steady, slightly softer image.
// Post-processing antialiases with SMAA rather than MSAA: multisampled half-float targets
// produced NaN frames on some Intel/D3D11 drivers, which bloom then smeared across the screen.
export const TIERS = {
  // pointLights: the dock's interior glow and passing streetlights.
  // dpr is kept at full native resolution (minimum 1.0, up to 2.0 on Retina) so the canvas is never downscaled or blurry.
  high: { dpr: [1, 2], post: true, msaa: 0, lampStep: 1, containers: 1, liveReflections: false, pointLights: true },
  medium: { dpr: [1, 2], post: true, msaa: 0, lampStep: 1, containers: 0.9, liveReflections: false, pointLights: true },
  low: { dpr: [1, 1.5], post: false, msaa: 0, lampStep: 1, containers: 0.75, liveReflections: false, pointLights: false },
};

export function pickQualityTier() {
  if (typeof window === 'undefined') return 'high';
  const forced = new URLSearchParams(window.location.search).get('tier');
  if (forced && TIERS[forced]) return forced;
  const cores = navigator.hardwareConcurrency || 4;
  const memory = navigator.deviceMemory || 4;
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  const touch = window.matchMedia('(pointer: coarse)').matches;
  if (saveData || memory <= 2 || cores <= 2) return 'low';
  if (touch || window.innerWidth < 900) return 'medium';
  return /intel|mali|adreno|powervr|swiftshader|llvmpipe|microsoft basic/i.test(gpuName()) ? 'medium' : 'high';
}

function gpuName() {
  try {
    const gl = document.createElement('canvas').getContext('webgl');
    const ext = gl && gl.getExtension('WEBGL_debug_renderer_info');
    const name = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : '';
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    return String(name);
  } catch {
    return '';
  }
}
