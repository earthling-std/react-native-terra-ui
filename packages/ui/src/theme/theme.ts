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
 * Figma parity but is not part of {@link TerraTheme}.
 */
const prim = unflatten<{
  spacing: Record<SpacingKey, number>;
  radius: Record<RadiusKey, number>;
  typography: Typography;
  opacity: OpacityTokens;
  layout: LayoutTokens;
}>(primitives);

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
  radius: prim.radius,
  typography: prim.typography,
  opacity: prim.opacity,
  layout: prim.layout,
};

export const defaultDarkTheme: TerraTheme = {
  color: darkTokens.color,
  elevation: darkTokens.elevation,
  spacing: prim.spacing,
  radius: prim.radius,
  typography: prim.typography,
  opacity: prim.opacity,
  layout: prim.layout,
};
