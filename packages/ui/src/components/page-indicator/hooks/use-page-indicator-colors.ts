import { useMemo } from 'react';

import { useUnistyles } from 'react-native-unistyles';

import type { ColorToken } from '#theme/types';

import { resolveThemeColor } from '#utils/resolve-theme-color';

/** Resolved color strings for Reanimated and SVG (worklets cannot use theme tokens). */
export interface ResolvedColors {
  activeColor: string;
  inactiveColor: string;
  loadingColor: string;
}

export type PageIndicatorColorInput = {
  activeColor?: ColorToken;
  inactiveColor?: ColorToken;
  loadingColor?: ColorToken;
};

const DEFAULT_COLOR_TOKENS: Required<PageIndicatorColorInput> = {
  activeColor: 'content.primary',
  inactiveColor: 'content.disabled',
  loadingColor: 'content.disabled',
};

export function usePageIndicatorColors(
  colors: PageIndicatorColorInput = {}
): ResolvedColors {
  const { theme } = useUnistyles();

  return useMemo(
    () => ({
      activeColor:
        resolveThemeColor(
          colors.activeColor ?? DEFAULT_COLOR_TOKENS.activeColor,
          theme
        ) ?? theme.color.content.primary,
      inactiveColor:
        resolveThemeColor(
          colors.inactiveColor ?? DEFAULT_COLOR_TOKENS.inactiveColor,
          theme
        ) ?? theme.color.content.disabled,
      loadingColor:
        resolveThemeColor(
          colors.loadingColor ?? DEFAULT_COLOR_TOKENS.loadingColor,
          theme
        ) ?? theme.color.content.disabled,
    }),
    [
      colors.activeColor,
      colors.inactiveColor,
      colors.loadingColor,
      theme,
    ]
  );
}
