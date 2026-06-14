import type {
  Accent,
  AccentShorthand,
  NormalizedAccent,
  TerraTheme,
} from '#theme/types';

import { readableOn, shade, withAlpha } from './color-utils';
import type { DeepPartial } from './deep-merge';

const isShorthand = (accent: Accent): accent is AccentShorthand =>
  typeof (accent as AccentShorthand).light === 'string' ||
  typeof (accent as AccentShorthand).dark === 'string';

/**
 * Expands a single hue into a fuller per-scheme patch so primary AND secondary
 * actions (plus accent text) all recolor consistently:
 * - primary: solid hue with derived hover/active and a legible foreground,
 * - secondary: soft translucent tint of the hue with the hue as foreground,
 * - content.accent / link / onAccent.
 *
 * On `light` the hover/active darken; on `dark` they lighten.
 */
function hueToPartial(
  hue: string | undefined,
  scheme: 'light' | 'dark'
): DeepPartial<TerraTheme> {
  if (!hue) return {};
  const dir = scheme === 'light' ? -1 : 1;
  const isLight = scheme === 'light';
  return {
    color: {
      action: {
        primary: {
          bg: hue,
          fg: readableOn(hue),
          hover: shade(hue, dir * 0.12),
          active: shade(hue, dir * 0.24),
        },
        secondary: {
          bg: withAlpha(hue, isLight ? 0.12 : 0.2),
          fg: hue,
          hover: withAlpha(hue, isLight ? 0.18 : 0.28),
          active: withAlpha(hue, isLight ? 0.24 : 0.36),
        },
      },
      content: { accent: hue, link: hue, onAccent: readableOn(hue) },
    },
  };
}

/** Normalizes any accent input into per-scheme partial-theme overrides. */
export function normalizeAccent(accent: Accent): NormalizedAccent {
  if (isShorthand(accent)) {
    return {
      light: hueToPartial(accent.light, 'light'),
      dark: hueToPartial(accent.dark, 'dark'),
    };
  }
  return { light: accent.light ?? {}, dark: accent.dark ?? {} };
}
