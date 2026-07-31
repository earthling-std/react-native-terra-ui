import type { FontWeightToken } from '#theme/types';

/** RN's sentinel for the platform default font (SF on iOS, Roboto on Android). */
export const SYSTEM_FONT = 'System';

/** Numeric fontWeight applied when a weight token maps to the system font. */
export const FONT_WEIGHT_VALUE: Record<
  FontWeightToken,
  '400' | '500' | '600' | '700'
> = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};
