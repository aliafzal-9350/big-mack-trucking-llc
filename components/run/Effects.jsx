'use client';

import { memo, useEffect, useMemo, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette, ToneMapping, SMAA, Noise } from '@react-three/postprocessing';
import { ToneMappingMode, BlendFunction } from 'postprocessing';

// Bloom only catches what is actually emissive (lamps, headlights, HUD beacons, the x-ray
// edge), then a neutral tone map that keeps the brand violet from drifting.
//
// The pass list is memoized on purpose: EffectComposer rebuilds (and recompiles) every
// pass whenever its children change identity, which costs seconds on ANGLE/D3D11.
function Effects({ msaa }) {
  const composer = useRef();
  const dpr = useThree((s) => s.viewport.dpr);
  const size = useThree((s) => s.size);

  // The composer only resizes on CSS size changes; follow pixel-ratio steps too.
  useEffect(() => {
    composer.current?.setSize(size.width, size.height);
  }, [dpr, size]);

  const passes = useMemo(
    () => [
      <Bloom key="bloom" mipmapBlur intensity={0.85} luminanceThreshold={0.9} luminanceSmoothing={0.25} radius={0.72} />,
      <Vignette key="vignette" offset={0.28} darkness={0.55} />,
      <ToneMapping key="tonemap" mode={ToneMappingMode.NEUTRAL} />,
      ...(msaa === 0 && dpr <= 1 ? [<SMAA key="smaa" />] : []),
    ],
    [msaa, dpr],
  );

  return (
    <EffectComposer ref={composer} multisampling={msaa}>
      {passes}
    </EffectComposer>
  );
}

export default memo(Effects);
