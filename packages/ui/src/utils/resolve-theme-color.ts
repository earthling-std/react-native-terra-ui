import type { ColorToken, TerraTheme } from '#theme/types';

const isColorLiteral = (value: string): boolean =>
  value.startsWith('#') ||
  value.startsWith('rgb') ||
  value.startsWith('hsl') ||
  value === 'transparent' ||
  value === 'currentColor';

const getNested = (obj: unknown, path: string): unknown => {
  const segments = path.split('.');
  let current: unknown = obj;
  for (const segment of segments) {
    if (current && typeof current === 'object') {
      current = (current as Record<string, unknown>)[segment];
    } else {
      return undefined;
    }
  }
  return current;
};

/**
 * Resolves a {@link ColorToken} to a concrete color string using the theme.
 * Raw literals pass through unchanged.
 *
 * @example
 * resolveThemeColor('content.primary', theme)    // → '#020618'
 * resolveThemeColor('action.primary.bg', theme)  // → '#009966'
 * resolveThemeColor('#ff0000', theme)            // → '#ff0000'
 */
export function resolveThemeColor(
  token: ColorToken | undefined,
  theme: TerraTheme
): string | undefined {
  if (!token) return undefined;
  if (isColorLiteral(token)) return token;
  const value = getNested(theme.color, token);
  if (typeof value === 'string') return value;
  // Status group shorthand (e.g. `status.danger`) resolves to `.solid`.
  if (value && typeof value === 'object' && 'solid' in value) {
    const solid = (value as { solid: unknown }).solid;
    return typeof solid === 'string' ? solid : undefined;
  }
  return undefined;
}
