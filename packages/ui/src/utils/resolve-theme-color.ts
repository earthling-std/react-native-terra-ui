import type { ColorToken, TerraTheme } from '#theme/types';

const isColorLiteral = (value: string): boolean =>
  value.startsWith('#') ||
  value.startsWith('rgb') ||
  value.startsWith('hsl') ||
  value === 'transparent' ||
  value === 'currentColor';

/**
 * Resolves a {@link ColorToken} to a concrete color string using the theme.
 * Raw literals pass through unchanged.
 *
 * @example
 * resolveThemeColor('text.default', theme)         // → '#020618'
 * resolveThemeColor('action.bg.primary', theme)    // → '#009966'
 * resolveThemeColor('#ff0000', theme)              // → '#ff0000'
 */
export function resolveThemeColor(
  token: ColorToken | undefined,
  theme: TerraTheme
): string | undefined {
  if (!token) return undefined;
  if (isColorLiteral(token)) return token;
  const value = (theme.color as unknown as Record<string, unknown>)[token];
  return typeof value === 'string' ? value : undefined;
}
