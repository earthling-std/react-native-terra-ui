import { UnistylesRuntime } from 'react-native-unistyles';

import { getRegistry, resolveTheme } from './configure';
import type { Scheme } from './types';

/** Apply a named accent at runtime by updating both registered themes. */
export function applyAccent(name: string): void {
  const registry = getRegistry();
  if (!registry.accents[name]) {
    if (__DEV__) {
      console.warn(`[react-native-terra-ui] Unknown accent "${name}".`);
    }
    return;
  }
  registry.currentAccent = name;
  UnistylesRuntime.updateTheme('light', () => resolveTheme('light', name));
  UnistylesRuntime.updateTheme('dark', () => resolveTheme('dark', name));
}

export const getCurrentAccent = (): string | undefined =>
  getRegistry().currentAccent;

/** Switch the active color scheme, disabling adaptive (system) theming. */
export function applyScheme(scheme: Scheme): void {
  UnistylesRuntime.setAdaptiveThemes(false);
  UnistylesRuntime.setTheme(scheme);
}
