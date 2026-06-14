import { type ComponentRef, forwardRef } from 'react';
import type { View, ViewStyle } from 'react-native';

import { useUnistyles } from 'react-native-unistyles';

import { getDefaultRadius, getSurfaceElevation } from '#theme/configure';
import type { ColorToken, ElevationKey } from '#theme/types';

import { Box, type BoxProps } from '../box';

/** Background level of a {@link Surface}. */
export type SurfaceVariant = 'base' | 'raised' | 'sunken' | 'transparent';

export interface SurfaceProps extends Omit<BoxProps, 'bg'> {
  /** Background surface level. Defaults to `'base'`. */
  variant?: SurfaceVariant;
  /**
   * Drop-shadow depth (platform-aware shadow + Android elevation). Defaults to
   * the configured `surface` elevation (`'none'` if unset). Note: a shadow
   * needs a non-transparent background to render, so `variant="transparent"`
   * shows no shadow.
   */
  elevation?: ElevationKey;
}

const VARIANT_BG: Record<SurfaceVariant, ColorToken> = {
  base: 'surface.base',
  raised: 'surface.raised',
  sunken: 'surface.sunken',
  transparent: 'transparent',
};

/**
 * Themed container built on {@link Box}. Picks its background from a semantic
 * surface `variant`, its corner radius from the configured `surface`
 * default (overridable via `radius`), and an optional drop shadow via
 * `elevation`. All other Box style-props are accepted.
 */
export const Surface = forwardRef<ComponentRef<typeof View>, SurfaceProps>(
  function Surface(
    { variant = 'base', elevation = getSurfaceElevation(), radius, style, ...rest },
    ref
  ) {
    const { theme } = useUnistyles();
    const shadow = theme.elevation[elevation] as ViewStyle;

    return (
      <Box
        ref={ref}
        bg={VARIANT_BG[variant]}
        radius={radius ?? getDefaultRadius('surface')}
        style={[shadow, style]}
        {...rest}
      />
    );
  }
);
