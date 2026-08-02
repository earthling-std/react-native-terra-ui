import { readableOn, withAlpha } from '#utils/color-utils';

// A custom color literal (hex/rgb/hsl) can't be a unistyles compound variant
// condition (it's not a bounded set of options), so it's derived here
// instead, the same way `utils/accent-utils.ts` expands a single hue into a
// full color scheme.

export interface CustomChipColors {
  bg: string;
  border: string;
  borderWidth: number;
  fg: string;
}

const CUSTOM_COLOR_SOFT_ALPHA = 0.16;

export function getCustomColorColors(
  literal: string,
  variant: 'solid' | 'soft' | 'outline'
): CustomChipColors {
  if (variant === 'outline') {
    return { bg: 'transparent', border: literal, borderWidth: 1, fg: literal };
  }
  if (variant === 'soft') {
    const bg = withAlpha(literal, CUSTOM_COLOR_SOFT_ALPHA);
    return { bg, border: bg, borderWidth: 0, fg: literal };
  }
  return {
    bg: literal,
    border: literal,
    borderWidth: 0,
    fg: readableOn(literal),
  };
}
