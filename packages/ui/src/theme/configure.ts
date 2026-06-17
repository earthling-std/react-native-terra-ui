import { StyleSheet } from 'react-native-unistyles';

import { defaultIcons } from '#components/icon/utils';
import { normalizeAccent } from '#utils/accent-utils';
import { deepMerge } from '#utils/deep-merge';

import { buildRadiusScale, defaultDarkTheme, defaultLightTheme } from './theme';
import type {
  ComponentDefaults,
  DefaultRadiusToken,
  ElevationKey,
  NormalizedAccent,
  RadiusComponent,
  Scheme,
  TerraConfig,
  TerraIconComponent,
  TerraSemanticIconName,
  TerraTheme,
  TerraThemeOverride,
} from './types';

/** Fallback when a component's radius is not configured. */
const DEFAULT_RADIUS: DefaultRadiusToken = 'md';
/** Fallback when the surface elevation is not configured. */
const DEFAULT_ELEVATION: ElevationKey = 'none';

type ResolvedRadius = Record<RadiusComponent, DefaultRadiusToken>;

/** Resolves each component's default radius from the `components` config. */
const resolveDefaultRadius = (
  components?: ComponentDefaults
): ResolvedRadius => ({
  button: components?.button?.radius ?? DEFAULT_RADIUS,
  surface: components?.surface?.radius ?? DEFAULT_RADIUS,
});

// ─── Unistyles module augmentation ────────────────────────────────────────────
declare module 'react-native-unistyles' {
  export interface UnistylesThemes {
    light: TerraTheme;
    dark: TerraTheme;
  }
}

interface Registry {
  baseLight: TerraTheme;
  baseDark: TerraTheme;
  accents: Record<string, NormalizedAccent>;
  currentAccent?: string;
  defaultRadius: ResolvedRadius;
  surfaceElevation: ElevationKey;
  icons: Record<string, TerraIconComponent>;
  configured: boolean;
}

const registry: Registry = {
  baseLight: defaultLightTheme,
  baseDark: defaultDarkTheme,
  accents: {},
  currentAccent: undefined,
  defaultRadius: resolveDefaultRadius(),
  surfaceElevation: DEFAULT_ELEVATION,
  icons: {},
  configured: false,
};

/** @internal */
export const getRegistry = (): Registry => registry;

export const getIsConfigured = (): boolean => registry.configured;

export const getAccentNames = (): string[] => Object.keys(registry.accents);

export const getIcon = (name: string): TerraIconComponent | undefined =>
  registry.icons[name] ?? defaultIcons[name as TerraSemanticIconName];

export const getRequiredIcon = (
  name: TerraSemanticIconName
): TerraIconComponent => registry.icons[name] ?? defaultIcons[name];

/**
 * The configured default corner radius for a component (Button, Surface).
 * Set via {@link configureTerraUI}; defaults to `'md'`.
 */
export const getDefaultRadius = (
  component: RadiusComponent
): DefaultRadiusToken => registry.defaultRadius[component];

/**
 * The configured default drop-shadow depth for Surface (`'none'` = no shadow).
 * Set via {@link configureTerraUI}; defaults to `'none'`.
 */
export const getSurfaceElevation = (): ElevationKey =>
  registry.surfaceElevation;

/** Resolves a scheme's theme = base ⊕ the named accent's partial override. */
export function resolveTheme(scheme: Scheme, accentName?: string): TerraTheme {
  const base = scheme === 'light' ? registry.baseLight : registry.baseDark;
  const accent = accentName ? registry.accents[accentName] : undefined;
  return deepMerge(base, accent ? accent[scheme] : undefined);
}

const mergeThemeOverride = (
  theme: TerraTheme,
  override?: TerraThemeOverride
): TerraTheme => {
  if (!override) return theme;

  const { radius, ...rest } = override;
  let next = deepMerge(theme, rest);

  if (radius) {
    const { base, ...radiusTokens } = radius;
    if (base != null) {
      next = deepMerge(next, { radius: buildRadiusScale(base) });
    }
    next = deepMerge(next, { radius: radiusTokens });
  }

  return next;
};

/**
 * Configure Terra UI's themes. Call ONCE, as early as possible — before any
 * component renders (e.g. top of the app entry, imported from
 * `react-native-terra-ui/theme`). With no arguments it registers the default
 * theme; `<TerraUIProvider>` calls it for you if you haven't.
 */
export function configureTerraUI(config: TerraConfig = {}): void {
  if (registry.configured) {
    if (__DEV__ && Object.keys(config).length > 0) {
      console.warn(
        '[react-native-terra-ui] configureTerraUI() was called more than once; the later call was ignored.'
      );
    }
    return;
  }
  registry.configured = true;

  registry.baseLight = mergeThemeOverride(
    mergeThemeOverride(defaultLightTheme, config.shared),
    config.schemes?.light
  );
  registry.baseDark = mergeThemeOverride(
    mergeThemeOverride(defaultDarkTheme, config.shared),
    config.schemes?.dark
  );

  registry.defaultRadius = resolveDefaultRadius(config.components);
  registry.surfaceElevation =
    config.components?.surface?.elevation ?? DEFAULT_ELEVATION;
  registry.icons = config.icons ?? {};

  registry.accents = {};
  for (const [name, accent] of Object.entries(config.accents ?? {})) {
    registry.accents[name] = normalizeAccent(accent);
  }
  const { defaultAccent } = config;
  registry.currentAccent =
    defaultAccent && registry.accents[defaultAccent]
      ? defaultAccent
      : undefined;

  const themes = {
    light: resolveTheme('light', registry.currentAccent),
    dark: resolveTheme('dark', registry.currentAccent),
  };

  const adaptive = config.adaptiveThemes ?? true;
  const settings = config.initialScheme
    ? { initialTheme: config.initialScheme }
    : adaptive
      ? { adaptiveThemes: true as const }
      : { initialTheme: 'light' as const };

  StyleSheet.configure({ themes, settings });
}
