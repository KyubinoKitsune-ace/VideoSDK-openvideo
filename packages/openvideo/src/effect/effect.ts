import { Filter, GlProgram, Sprite, Texture, RenderTexture } from 'pixi.js';

import type { EffectOptions, EffectRendererOptions } from './types';
import { vertex } from './vertex';
import { GL_EFFECTS } from './glsl/gl-effect';

export function makeEffect({ name, renderer }: EffectOptions) {
  let effect: undefined | any = undefined;
  const localKey = Object.keys(GL_EFFECTS).find(
    (key) => key.toLowerCase() === name.toLowerCase()
  ) as keyof typeof GL_EFFECTS | undefined;
  if (localKey) {
    effect = GL_EFFECTS[localKey] as any;
  }
  const { fragment, uniforms, label } = effect;
  const effectSprite = new Sprite();

  const effectTexture = RenderTexture.create({
    width: renderer.width,
    height: renderer.height,
  });

  const program = new GlProgram({
    vertex,
    fragment,
    name: `${label}-shader`,
  });

  const filter = new Filter({
    glProgram: program,
    resources: {
      effectUniforms: {
        ...uniforms,
      },
    },
  });

  effectSprite.filters = [filter];

  // effectSprite.filters = [filter];

  return {
    filter,
    render({ width, height, canvasTexture, progress }: EffectRendererOptions) {
      if (effectTexture.width !== width || effectTexture.height !== height) {
        effectTexture.resize(width, height);
      }

      const tex =
        canvasTexture instanceof RenderTexture
          ? canvasTexture
          : Texture.from(canvasTexture as HTMLCanvasElement);

      effectSprite.texture = tex;
      effectSprite.width = width;
      effectSprite.height = height;
      const effectUniforms = filter.resources.effectUniforms.uniforms;
      effectUniforms.uTime = progress;

      renderer.render({
        container: effectSprite,
        target: effectTexture,
        clear: true,
      });

      return effectTexture;
    },
  };
}
