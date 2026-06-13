// Primitive tokens

export type { Accent, AccentOverride, AccentShorthand } from './accents';
// Accents
export { normalizeAccent } from './accents';
export type {
  ActionColorToken,
  BackgroundColorToken,
  BorderColorToken,
  ColorToken,
  ContentColorToken,
  StatusColorToken,
  SurfaceColorToken,
} from './color-token';
// Color tokens + resolver
export { resolveThemeColor } from './color-token';
export type { Scheme, TerraConfig } from './configure';
// Config + runtime
export {
  configureTerraUI,
  getAccentNames,
  getIsConfigured,
  resolveTheme,
} from './configure';
export type { DeepPartial } from './deep-merge';
// Merge utility
export { deepMerge } from './deep-merge';
export { applyAccent, applyScheme, getCurrentAccent } from './runtime';
export type { LayoutTokens, OpacityTokens, TerraTheme } from './theme';
export {
  defaultDarkTheme,
  defaultLightTheme,
} from './theme';
export type {
  ElevationKey,
  ElevationScale,
  ElevationStyle,
} from './tokens/elevation';
export { darkElevation, lightElevation } from './tokens/elevation';
export type { Palette } from './tokens/palette';
export { palette } from './tokens/palette';
export type { RadiusKey, SpacingKey } from './tokens/scales';
export { radius, spacing } from './tokens/scales';
// Semantic tier + full theme
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
export {
  defaultTypography,
  FONT_WEIGHT_VALUE,
  SYSTEM_FONT,
} from './tokens/typography';
