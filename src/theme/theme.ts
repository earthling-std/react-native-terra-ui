import {
  darkElevation,
  type ElevationScale,
  lightElevation,
} from './tokens/elevation';
import { radius, spacing } from './tokens/scales';
import { darkColor, lightColor, type ThemeColor } from './tokens/semantic';
import { defaultTypography, type Typography } from './tokens/typography';

export type { ElevationKey, ElevationStyle } from './tokens/elevation';
export type { RadiusKey, SpacingKey } from './tokens/scales';
export type {
  InteractiveRole,
  StatusRole,
  ThemeColor,
} from './tokens/semantic';
export type {
  FontWeightToken,
  TextVariant,
  TypeStyle,
  Typography,
} from './tokens/typography';

/** State-layer opacities for disabled / pressed feedback. */
export interface OpacityTokens {
  disabled: number;
  pressed: number;
}

/** The full resolved theme. `light` and `dark` are both `TerraTheme`. */
export interface TerraTheme {
  color: ThemeColor;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: Typography;
  elevation: ElevationScale;
  opacity: OpacityTokens;
}

const opacity: OpacityTokens = { disabled: 0.45, pressed: 0.85 };

export const defaultLightTheme: TerraTheme = {
  color: lightColor,
  spacing,
  radius,
  typography: defaultTypography,
  elevation: lightElevation,
  opacity,
};

export const defaultDarkTheme: TerraTheme = {
  color: darkColor,
  spacing,
  radius,
  typography: defaultTypography,
  elevation: darkElevation,
  opacity,
};
