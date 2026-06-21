import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Vector2 } from 'three';

export const PostProcessingEffects = () => {
  return (
    <EffectComposer>
      {/* Soft bloom for the glowing artifact */}
      <Bloom
        intensity={1.5}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        mipmapBlur
      />

      {/* Chromatic aberration for that futuristic feel */}
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new Vector2(0.002, 0.002)}
        radialModulation={false}
        modulationOffset={0}
      />

      {/* Vignette for cinematic framing */}
      <Vignette
        offset={0.3}
        darkness={0.9}
        blendFunction={BlendFunction.NORMAL}
      />

      {/* Film grain noise */}
      <Noise
        blendFunction={BlendFunction.OVERLAY}
        opacity={0.15}
        premultiply
      />
    </EffectComposer>
  );
};
