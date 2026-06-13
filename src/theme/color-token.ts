import type { TerraTheme, ThemeColor } from './theme';

type C = ThemeColor;

export type BackgroundColorToken = 'background';
export type SurfaceColorToken = `surface.${keyof C['surface'] & string}`;
export type ContentColorToken = `content.${keyof C['content'] & string}`;
export type BorderColorToken = `border.${keyof C['border'] & string}`;

export type ActionColorToken = {
  [K in keyof C['action']]: `action.${K & string}.${keyof C['action'][K] & string}`;
}[keyof C['action']];

export type StatusColorToken = {
  [K in keyof C['status']]: `status.${K & string}.${keyof C['status'][K] & string}`;
}[keyof C['status']];

/**
 * Any color value a component accepts:
 * semantic token (`content.primary`, `surface.raised`, `action.primary.bg`),
 * or a raw CSS color literal (`#fff`, `rgb(...)`, `transparent`).
 */
export type ColorToken =
  | BackgroundColorToken
  | SurfaceColorToken
  | ContentColorToken
  | BorderColorToken
  | ActionColorToken
  | StatusColorToken
  // literals last so token autocomplete still surfaces
  | (string & {});

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
  return typeof value === 'string' ? value : undefined;
}
