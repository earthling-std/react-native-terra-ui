import { StyleSheet } from 'react-native-unistyles';

import { type Accent, type NormalizedAccent, normalizeAccent } from './accents';
import { type DeepPartial, deepMerge } from './deep-merge';
import { defaultDarkTheme, defaultLightTheme, type TerraTheme } from './theme';

export type Scheme = 'light' | 'dark';

// ─── Unistyles module augmentation ────────────────────────────────────────────
declare module 'react-native-unistyles' {
  export interface UnistylesThemes {
    light: TerraTheme;
    dark: TerraTheme;
  }
}

export interface TerraConfig {
  /** Per-project base override, deep-merged onto the shipped base (set once). */
  theme?: { light?: DeepPartial<TerraTheme>; dark?: DeepPartial<TerraTheme> };
  /** Runtime-switchable named overrides (hue shorthand or full partial). */
  accents?: Record<string, Accent>;
  defaultAccent?: string;
  /** Follow the system color scheme. Default `true`. */
  adaptiveThemes?: boolean;
  /** Force a starting scheme (disables adaptive theming). */
  initialScheme?: Scheme;
}

interface Registry {
  baseLight: TerraTheme;
  baseDark: TerraTheme;
  accents: Record<string, NormalizedAccent>;
  currentAccent?: string;
  configured: boolean;
}

const registry: Registry = {
  baseLight: defaultLightTheme,
  baseDark: defaultDarkTheme,
  accents: {},
  currentAccent: undefined,
  configured: false,
};

/** @internal */
export const getRegistry = (): Registry => registry;

export const getIsConfigured = (): boolean => registry.configured;

export const getAccentNames = (): string[] => Object.keys(registry.accents);

/** Resolves a scheme's theme = base ⊕ the named accent's partial override. */
export function resolveTheme(scheme: Scheme, accentName?: string): TerraTheme {
  const base = scheme === 'light' ? registry.baseLight : registry.baseDark;
  const accent = accentName ? registry.accents[accentName] : undefined;
  return deepMerge(base, accent ? accent[scheme] : undefined);
}

/**
 * Configure Terra UI's themes. Call ONCE, as early as possible — before any
 * component renders (e.g. top of the app entry, imported from
 * `react-native-terra-ui/theme`). With no arguments it registers the default
 * theme; `<UIKitProvider>` calls it for you if you haven't.
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

  registry.baseLight = deepMerge(defaultLightTheme, config.theme?.light);
  registry.baseDark = deepMerge(defaultDarkTheme, config.theme?.dark);

  registry.accents = {};
  for (const [name, accent] of Object.entries(config.accents ?? {})) {
    registry.accents[name] = normalizeAccent(accent);
  }
  registry.currentAccent =
    config.defaultAccent && registry.accents[config.defaultAccent]
      ? config.defaultAccent
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
