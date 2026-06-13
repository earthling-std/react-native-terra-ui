import type { DeepPartial } from './deep-merge';
import type { TerraTheme } from './theme';

/** A hue shorthand per scheme — expands to primary + accent token patches. */
export interface AccentShorthand {
  light: string;
  dark: string;
}

/** A full partial-theme override per scheme. */
export interface AccentOverride {
  light?: DeepPartial<TerraTheme>;
  dark?: DeepPartial<TerraTheme>;
}

/** A named, runtime-switchable theme override. */
export type Accent = AccentShorthand | AccentOverride;

export interface NormalizedAccent {
  light: DeepPartial<TerraTheme>;
  dark: DeepPartial<TerraTheme>;
}

const isShorthand = (accent: Accent): accent is AccentShorthand =>
  typeof (accent as AccentShorthand).light === 'string' ||
  typeof (accent as AccentShorthand).dark === 'string';

const hueToPartial = (hue?: string): DeepPartial<TerraTheme> =>
  hue
    ? { color: { action: { primary: { bg: hue } }, content: { accent: hue } } }
    : {};

/** Normalizes any accent input into per-scheme partial-theme overrides. */
export function normalizeAccent(accent: Accent): NormalizedAccent {
  if (isShorthand(accent)) {
    return {
      light: hueToPartial(accent.light),
      dark: hueToPartial(accent.dark),
    };
  }
  return { light: accent.light ?? {}, dark: accent.dark ?? {} };
}
