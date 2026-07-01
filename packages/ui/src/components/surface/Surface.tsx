import { type ComponentRef, forwardRef } from 'react';
import type { View, ViewStyle } from 'react-native';

import { useUnistyles } from 'react-native-unistyles';

import { getDefaultRadius, getSurfaceElevation } from '#theme/configure';
import type { ColorToken, ElevationKey } from '#theme/types';

import { type BorderWidthInput, Box, type BoxProps } from '../box';

/** Background level of a {@link Surface}. */
export type SurfaceVariant = 'base' | 'raised' | 'sunken' | 'transparent';

export interface SurfaceProps extends Omit<BoxProps, 'bg'> {
  /** Background surface level. Defaults to `'base'`. */
  variant?: SurfaceVariant;
  /**
   * Drop-shadow depth (platform-aware shadow + Android elevation).
   * Defaults to `'sm'` for `variant="raised"`, otherwise the configured
   * surface elevation (`'none'` if unset). Note: a shadow needs a
   * non-transparent background to render, so `variant="transparent"` shows no
   * shadow.
   */
  elevation?: ElevationKey;
}

const VARIANT_BG: Record<SurfaceVariant, ColorToken> = {
  base: 'surface.default',
  raised: 'surface.raised',
  sunken: 'surface.sunken',
  transparent: 'transparent',
};

/** Variant-aware hairline borders improve edge definition when fills are close. */
const VARIANT_BORDER: Record<
  SurfaceVariant,
  { borderWidth?: BorderWidthInput; borderColor?: ColorToken }
> = {
  base: {},
  raised: { borderWidth: 'hairline', borderColor: 'border.subtle' },
  sunken: { borderWidth: 'hairline', borderColor: 'border.default' },
  transparent: {},
};

const resolveElevation = (
  variant: SurfaceVariant,
  elevation?: ElevationKey
): ElevationKey => {
  if (elevation !== undefined) return elevation;
  if (variant === 'raised') return 'sm';
  return getSurfaceElevation();
};

/**
 * Themed container built on {@link Box}. Picks its background from a semantic
 * surface `variant`, its corner radius from the configured `surface`
 * default (overridable via `radius`), and an optional drop shadow via
 * `elevation`. All other Box style-props are accepted.
 *
 * @example
 * ```tsx
 * <Surface variant="raised" elevation="md" p="4" radius="lg">
 *   <Text variant="title-sm">Card title</Text>
 * </Surface>
 * ```
 */
export const Surface = forwardRef<ComponentRef<typeof View>, SurfaceProps>(
  function Surface(
    {
      variant = 'base',
      elevation,
      radius,
      borderWidth,
      borderColor,
      style,
      ...rest
    },
    ref
  ) {
    const { theme } = useUnistyles();
    const resolvedElevation = resolveElevation(variant, elevation);
    const variantBorder = VARIANT_BORDER[variant];
    const shadowStyle =
      variant !== 'transparent' && resolvedElevation !== 'none'
        ? (theme.elevation[resolvedElevation] as ViewStyle)
        : undefined;

    return (
      <Box
        ref={ref}
        bg={VARIANT_BG[variant]}
        radius={radius ?? getDefaultRadius('surface')}
        borderWidth={borderWidth ?? variantBorder.borderWidth}
        borderColor={borderColor ?? variantBorder.borderColor}
        style={shadowStyle ? [shadowStyle, style] : style}
        {...rest}
      />
    );
  }
);
