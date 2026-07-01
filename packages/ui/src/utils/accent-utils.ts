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
 * Expands a single hue into a fuller per-scheme patch so primary AND subtle
 * actions (plus accent text) all recolor consistently:
 * - primary: solid hue with derived hover/active and a legible foreground,
 * - subtle: soft translucent tint of the hue with the hue as foreground,
 * - text.accent / text.link / text.on-accent.
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
  const fg = readableOn(hue);
  // Flat color keys to patch — deepMerge replaces string leaves directly.
  const color = {
    'action.bg.primary': hue,
    'action.fg.primary': fg,
    'action.bg.primary.hover': shade(hue, dir * 0.12),
    'action.bg.primary.active': shade(hue, dir * 0.24),
    'action.bg.subtle': withAlpha(hue, isLight ? 0.12 : 0.2),
    'action.fg.subtle': hue,
    'action.bg.subtle.hover': withAlpha(hue, isLight ? 0.18 : 0.28),
    'action.bg.subtle.active': withAlpha(hue, isLight ? 0.24 : 0.36),
    'text.accent': hue,
    'text.link': hue,
    'text.on-accent': fg,
  };
  return { color } as unknown as DeepPartial<TerraTheme>;
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
