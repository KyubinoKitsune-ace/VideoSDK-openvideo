//@ts-ignore
import glTransitions from 'gl-transitions';
import { RADIAL_SWIPE_FRAGMENT } from './custom-glsl';

export interface GlTransition {
  label: string;
  fragment: string;
  uniforms?: Record<string, { value: any; type: string }>;
  previewDynamic?: string;
  previewStatic?: string;
}

// Custom transitions that override or extend the library
const CUSTOM_TRANSITIONS = {
  radialSwipe: {
    label: 'Radial Swipe',
    fragment: RADIAL_SWIPE_FRAGMENT,
  },
} as const satisfies Record<string, GlTransition>;

// Combine library transitions with custom ones
export const GL_TRANSITIONS = {
  ...glTransitions.reduce((acc: Record<string, any>, t: any) => {
    acc[t.name] = {
      label: t.name,
      fragment: t.glsl,
      uniforms: t.defaultParams,
      previewDynamic: `transition: ${t.name}`,
    };
    return acc;
  }, {}),
  ...CUSTOM_TRANSITIONS,
} as Record<string, GlTransition>;

export type TransitionKey = keyof typeof GL_TRANSITIONS;

export const GL_TRANSITION_OPTIONS: Array<{
  key: TransitionKey;
  label: string;
  previewStatic: string | undefined;
  previewDynamic: string | undefined;
}> = Object.entries(GL_TRANSITIONS).map(([key, value]) => ({
  key: key as TransitionKey,
  label: value.label,
  previewStatic: `https://cdn.subgen.co/previews/static/transition_${key}_static.webp`,
  previewDynamic: `https://cdn.subgen.co/previews/dynamic/transition_${key}_dynamic.webp`,
}));
