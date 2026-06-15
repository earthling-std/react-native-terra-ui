import { unflatten } from '#utils/unflatten';

import { dark } from './tokens/dark';
import { light } from './tokens/light';
import { primitives } from './tokens/primitives';
import type {
  ElevationScale,
  LayoutTokens,
  OpacityTokens,
  RadiusKey,
  SpacingKey,
  TerraTheme,
  ThemeColor,
  Typography,
} from './types';

/**
 * Scheme-agnostic primitives, rebuilt once from the flat token data. Shared by
 * both default themes (matching the previous behavior where spacing / radius /
 * typography were singleton constants). `palette` is present at runtime for
 * Figma parity but is not part of {@link TerraTheme}. Only the radius BASE is
 * authored here (`radius.base`); the full scale is derived via
 * {@link buildRadiusScale}.
 */
const prim = unflatten<{
  spacing: Record<SpacingKey, number>;
  radius: { base: number };
  typography: Typography;
  opacity: OpacityTokens;
  layout: LayoutTokens;
}>(primitives);

/**
 * Default base corner radius (dp) — the `lg` (×1) step — taken from the
 * `radius.base` primitive. The rest of the scale is derived from it via
 * {@link RADIUS_MULTIPLIERS}; override at runtime with
 * `configureTerraUI({ radiusBase })`, or change the `radius.base` token.
 */
export const DEFAULT_RADIUS_BASE = prim.radius.base;

/**
 * Per-token multipliers applied to the base radius (DaisyUI-style). `none` (0)
 * and `full` (9999) are fixed and not scaled.
 */
export const RADIUS_MULTIPLIERS: Record<
  Exclude<RadiusKey, 'none' | 'full'>,
  number
> = {
  xs: 0.25,
  sm: 0.5,
  md: 0.75,
  lg: 1,
  xl: 1.5,
  '2xl': 2,
  '3xl': 3,
};

/**
 * Builds the full radius scale from a single base value. Derived steps keep
 * their exact (possibly fractional) dp; `none`/`full` are constant.
 */
export function buildRadiusScale(
  base: number = DEFAULT_RADIUS_BASE
): Record<RadiusKey, number> {
  const scale = { none: 0, full: 9999 } as Record<RadiusKey, number>;
  for (const key of Object.keys(
    RADIUS_MULTIPLIERS
  ) as (keyof typeof RADIUS_MULTIPLIERS)[]) {
    scale[key] = base * RADIUS_MULTIPLIERS[key];
  }
  return scale;
}

const defaultRadius = buildRadiusScale();

const lightTokens = unflatten<{ color: ThemeColor; elevation: ElevationScale }>(
  light
);
const darkTokens = unflatten<{ color: ThemeColor; elevation: ElevationScale }>(
  dark
);

export const defaultLightTheme: TerraTheme = {
  color: lightTokens.color,
  elevation: lightTokens.elevation,
  spacing: prim.spacing,
  radius: defaultRadius,
  typography: prim.typography,
  opacity: prim.opacity,
  layout: prim.layout,
};

export const defaultDarkTheme: TerraTheme = {
  color: darkTokens.color,
  elevation: darkTokens.elevation,
  spacing: prim.spacing,
  radius: defaultRadius,
  typography: prim.typography,
  opacity: prim.opacity,
  layout: prim.layout,
};
