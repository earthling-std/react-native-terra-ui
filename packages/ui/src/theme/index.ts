// Public theme API for `react-native-terra-ui` / `react-native-terra-ui/theme`.
//
// Token DATA lives in ./tokens/*.ts (flat, Figma-style, untyped); TYPES live in
// ./types; pure helpers live in #/utils. Raw primitive data (palette, spacing,
// radius, elevation scales, typography) is intentionally NOT re-exported — the
// resolved `defaultLightTheme` / `defaultDarkTheme` are the public surface.

// ─── Utilities (color resolution + accent/merge/typography helpers) ──────────
export { normalizeAccent } from '#utils/accent-utils';
export { readableOn, shade, withAlpha } from '#utils/color-utils';
export type { DeepPartial } from '#utils/deep-merge';
export { deepMerge } from '#utils/deep-merge';
export { resolveThemeColor } from '#utils/resolve-theme-color';
export { FONT_WEIGHT_VALUE, SYSTEM_FONT } from '#utils/typography';
// ─── Config + runtime ───────────────────────────────────────────────────────
export {
  configureTerraUI,
  getAccentNames,
  getDefaultRadius,
  getIsConfigured,
  getSurfaceElevation,
  resolveTheme,
} from './configure';
export { applyAccent, applyScheme, getCurrentAccent } from './runtime';
// ─── Default themes ───────────────────────────────────────────────────────────
export { defaultDarkTheme, defaultLightTheme } from './theme';
// ─── Types ────────────────────────────────────────────────────────────────────
export type {
  Accent,
  AccentOverride,
  AccentShorthand,
  ActionColorToken,
  BackgroundColorToken,
  BorderColorToken,
  ColorToken,
  ButtonDefaults,
  ComponentDefaults,
  ContentColorToken,
  DefaultRadiusToken,
  ElevationKey,
  RadiusComponent,
  SurfaceDefaults,
  ElevationScale,
  ElevationStyle,
  FontWeightToken,
  InteractiveRole,
  LayoutTokens,
  OpacityTokens,
  RadiusKey,
  Scheme,
  SpacingKey,
  StatusColorToken,
  StatusRole,
  SurfaceColorToken,
  TerraConfig,
  TerraDefaults,
  TerraTheme,
  TextVariant,
  ThemeColor,
  TypeStyle,
  Typography,
} from './types';
