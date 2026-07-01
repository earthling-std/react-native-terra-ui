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
  getIcon,
  getImageComponent,
  getIsConfigured,
  getRequiredIcon,
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
  ButtonDefaults,
  ColorToken,
  ComponentDefaults,
  ContentColorToken,
  DefaultRadiusToken,
  ElevationKey,
  ElevationScale,
  ElevationStyle,
  FontWeightToken,
  LayoutTokens,
  OpacityTokens,
  RadiusComponent,
  RadiusKey,
  Scheme,
  SpacingKey,
  StatusColorToken,
  SurfaceColorToken,
  SurfaceDefaults,
  TerraConfig,
  TerraIconComponent,
  TerraIconName,
  TerraIconProps,
  TerraImageComponent,
  TerraImageContentFit,
  TerraImageProps,
  TerraSemanticIconName,
  TerraTheme,
  TerraThemeOverride,
  TextColorToken,
  TextVariant,
  ThemeColor,
  ThemeRadiusOverride,
  TypeStyle,
  Typography,
} from './types';
