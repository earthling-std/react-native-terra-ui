/**
 * Themeable typography tokens — role-based scale, mobile-tuned.
 * See docs/design.md §4.3.
 */

export type TextVariant =
  | 'display-lg'
  | 'display-md'
  | 'display-sm'
  | 'headline-lg'
  | 'headline-md'
  | 'headline-sm'
  | 'title-lg'
  | 'title-md'
  | 'title-sm'
  | 'body-lg'
  | 'body-md'
  | 'body-sm'
  | 'label-lg'
  | 'label-md'
  | 'label-sm'
  | 'caption';

export type FontWeightToken = 'regular' | 'medium' | 'semibold' | 'bold';

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

export interface TypeStyle {
  fontSize: number;
  lineHeight: number;
  fontWeight: FontWeightToken;
  /** Tracking, dp. */
  letterSpacing: number;
  /** Cap OS Dynamic Type scaling to protect layout. */
  maxFontSizeMultiplier: number;
}

export interface Typography {
  /**
   * Weight token → font-family name. Defaults to the system font.
   * For custom fonts, point each weight at its own family
   * (e.g. { regular: 'Inter-Regular', semibold: 'Inter-SemiBold' }).
   */
  fonts: Record<FontWeightToken, string>;
  variants: Record<TextVariant, TypeStyle>;
}

/** RN's sentinel for the platform default font (SF on iOS, Roboto on Android). */
export const SYSTEM_FONT = 'System';

export const defaultTypography: Typography = {
  fonts: {
    regular: SYSTEM_FONT,
    medium: SYSTEM_FONT,
    semibold: SYSTEM_FONT,
    bold: SYSTEM_FONT,
  },
  variants: {
    'display-lg': {
      fontSize: 57,
      lineHeight: 64,
      fontWeight: 'regular',
      letterSpacing: -0.25,
      maxFontSizeMultiplier: 1.2,
    },
    'display-md': {
      fontSize: 45,
      lineHeight: 52,
      fontWeight: 'regular',
      letterSpacing: 0,
      maxFontSizeMultiplier: 1.2,
    },
    'display-sm': {
      fontSize: 36,
      lineHeight: 44,
      fontWeight: 'regular',
      letterSpacing: 0,
      maxFontSizeMultiplier: 1.2,
    },
    'headline-lg': {
      fontSize: 32,
      lineHeight: 40,
      fontWeight: 'semibold',
      letterSpacing: 0,
      maxFontSizeMultiplier: 1.3,
    },
    'headline-md': {
      fontSize: 28,
      lineHeight: 36,
      fontWeight: 'semibold',
      letterSpacing: 0,
      maxFontSizeMultiplier: 1.3,
    },
    'headline-sm': {
      fontSize: 24,
      lineHeight: 32,
      fontWeight: 'semibold',
      letterSpacing: 0,
      maxFontSizeMultiplier: 1.3,
    },
    'title-lg': {
      fontSize: 20,
      lineHeight: 28,
      fontWeight: 'semibold',
      letterSpacing: 0,
      maxFontSizeMultiplier: 1.4,
    },
    'title-md': {
      fontSize: 18,
      lineHeight: 26,
      fontWeight: 'semibold',
      letterSpacing: 0,
      maxFontSizeMultiplier: 1.4,
    },
    'title-sm': {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: 'semibold',
      letterSpacing: 0.1,
      maxFontSizeMultiplier: 1.4,
    },
    'body-lg': {
      fontSize: 18,
      lineHeight: 28,
      fontWeight: 'regular',
      letterSpacing: 0,
      maxFontSizeMultiplier: 1.8,
    },
    'body-md': {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: 'regular',
      letterSpacing: 0.15,
      maxFontSizeMultiplier: 1.8,
    },
    'body-sm': {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: 'regular',
      letterSpacing: 0.25,
      maxFontSizeMultiplier: 1.8,
    },
    'label-lg': {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: 'medium',
      letterSpacing: 0.1,
      maxFontSizeMultiplier: 1.5,
    },
    'label-md': {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: 'medium',
      letterSpacing: 0.5,
      maxFontSizeMultiplier: 1.5,
    },
    'label-sm': {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: 'medium',
      letterSpacing: 0.5,
      maxFontSizeMultiplier: 1.5,
    },
    caption: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: 'regular',
      letterSpacing: 0.4,
      maxFontSizeMultiplier: 1.4,
    },
  },
};
