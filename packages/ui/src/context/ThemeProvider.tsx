import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { useUnistyles } from 'react-native-unistyles';

import { configureTerraUI, getIsConfigured } from '../theme/configure';
import { applyAccent, applyScheme, getCurrentAccent } from '../theme/runtime';
import type { Scheme, TerraTheme } from '../theme/types';

// Ensure the default theme is registered on first import, unless the app already
// configured a custom one (e.g. via `react-native-terra-ui/theme` at entry).
if (!getIsConfigured()) {
  configureTerraUI();
}

interface ThemeContextValue {
  accent: string | undefined;
  setAccent: (name: string) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Root provider for Terra UI. Wrap your app once near the root.
 *
 * @example
 * <TerraUIProvider>
 *   <RootNavigator />
 * </TerraUIProvider>
 */
export const TerraUIProvider = ({ children }: PropsWithChildren) => {
  const [accent, setAccentState] = useState<string | undefined>(() =>
    getCurrentAccent()
  );

  const setAccent = useCallback((name: string) => {
    applyAccent(name);
    setAccentState(name);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ accent, setAccent }),
    [accent, setAccent]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export interface UseThemeResult {
  /** The active resolved theme. */
  theme: TerraTheme;
  /** Active color scheme. */
  scheme: Scheme;
  /** Switch scheme (disables system-adaptive theming). */
  setScheme: (scheme: Scheme) => void;
  /** Active accent name, if any. */
  accent: string | undefined;
  /** Switch to a registered accent. */
  setAccent: (name: string) => void;
}

/**
 * Access the active theme and switch scheme / accent / radius.
 * Must be used under {@link TerraUIProvider}.
 */
export function useTheme(): UseThemeResult {
  const { theme, rt } = useUnistyles();
  const ctx = useContext(ThemeContext);

  const setScheme = useCallback((scheme: Scheme) => {
    applyScheme(scheme);
  }, []);

  return {
    theme,
    scheme: (rt.themeName ?? 'light') as Scheme,
    setScheme,
    accent: ctx?.accent,
    setAccent: ctx?.setAccent ?? noopSetAccent,
  };
}

const noopSetAccent = (_name: string): void => {
  if (__DEV__) {
    console.warn(
      '[react-native-terra-ui] setAccent called outside <TerraUIProvider>.'
    );
  }
};
