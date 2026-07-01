import { type ComponentRef, forwardRef } from 'react';
import {
  Text as RNText,
  type TextProps as RNTextProps,
  type TextStyle,
} from 'react-native';

import { useUnistyles } from 'react-native-unistyles';
import type {
  ColorToken,
  FontWeightToken,
  HeadingTextVariant,
  RoleTextVariant,
  TextVariant,
} from '#theme/types';
import type { Mutable } from '#types';
import { resolveThemeColor } from '#utils/resolve-theme-color';
import { FONT_WEIGHT_VALUE, SYSTEM_FONT } from '#utils/typography';

export type TextAlign = 'left' | 'center' | 'right' | 'justify';

const HEADING_VARIANT_ALIAS: Record<HeadingTextVariant, RoleTextVariant> = {
  h1: 'headline-lg',
  h2: 'headline-md',
  h3: 'title-lg',
  h4: 'title-md',
  h5: 'title-sm',
  h6: 'label-lg',
};

function resolveTextVariant(variant: TextVariant): RoleTextVariant {
  return variant in HEADING_VARIANT_ALIAS
    ? HEADING_VARIANT_ALIAS[variant as HeadingTextVariant]
    : (variant as RoleTextVariant);
}

export interface TextProps extends RNTextProps {
  /** Typographic role. Defaults to `body-md`. */
  variant?: TextVariant;
  /** Semantic color token (e.g. `content.secondary`, `status.danger.solid`). */
  color?: ColorToken;
  /** Override the variant's default weight. */
  weight?: FontWeightToken;
  align?: TextAlign;
  italic?: boolean;
  underline?: boolean;
  strikeThrough?: boolean;
  /** Truncate to a single line with a trailing ellipsis. */
  isTruncated?: boolean;
}

/**
 * Themed text primitive. Reads its scale from `theme.typography` and resolves
 * fonts by weight, honoring Dynamic Type with a per-variant scaling cap.
 */
export const Text = forwardRef<ComponentRef<typeof RNText>, TextProps>(
  function Text(
    {
      variant = 'body-md',
      color,
      weight,
      align,
      italic,
      underline,
      strikeThrough,
      isTruncated,
      style,
      numberOfLines,
      ellipsizeMode,
      maxFontSizeMultiplier,
      ...rest
    },
    ref
  ) {
    const { theme } = useUnistyles();
    const resolvedVariant = resolveTextVariant(variant);
    const v = theme.typography.variants[resolvedVariant];
    const effectiveWeight: FontWeightToken = weight ?? v.fontWeight;
    const fontFamily = theme.typography.fonts[effectiveWeight];
    const isSystemFont = fontFamily === SYSTEM_FONT;

    const base: Mutable<TextStyle> = {
      fontSize: v.fontSize,
      lineHeight: v.lineHeight,
      letterSpacing: v.letterSpacing,
      color:
        resolveThemeColor(color, theme) ??
        (theme.color as unknown as Record<string, string | undefined>)['text.default'] ??
        '',
    };
    // System font: apply numeric weight. Custom font: family encodes the weight.
    if (isSystemFont) base.fontWeight = FONT_WEIGHT_VALUE[effectiveWeight];
    else base.fontFamily = fontFamily;

    if (align) base.textAlign = align;
    if (italic) base.fontStyle = 'italic';
    if (underline && strikeThrough)
      base.textDecorationLine = 'underline line-through';
    else if (underline) base.textDecorationLine = 'underline';
    else if (strikeThrough) base.textDecorationLine = 'line-through';

    return (
      <RNText
        ref={ref}
        style={[base, style]}
        maxFontSizeMultiplier={maxFontSizeMultiplier ?? v.maxFontSizeMultiplier}
        numberOfLines={isTruncated ? 1 : numberOfLines}
        ellipsizeMode={isTruncated ? 'tail' : ellipsizeMode}
        {...rest}
      />
    );
  }
);
