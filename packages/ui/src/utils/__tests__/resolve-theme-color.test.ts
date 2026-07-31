import { describe, expect, it } from '@jest/globals';

import { defaultLightTheme } from '../../theme/theme';
import { resolveThemeColor } from '../resolve-theme-color';

describe('resolveThemeColor', () => {
  it('resolves flat color tokens from the theme', () => {
    expect(resolveThemeColor('text.default', defaultLightTheme)).toBe(
      defaultLightTheme.color['text.default']
    );
  });

  it('passes through raw color literals', () => {
    expect(resolveThemeColor('#ff0000', defaultLightTheme)).toBe('#ff0000');
    expect(resolveThemeColor('transparent', defaultLightTheme)).toBe(
      'transparent'
    );
  });

  it('resolves status tokens', () => {
    expect(resolveThemeColor('status.bg.danger', defaultLightTheme)).toBe(
      defaultLightTheme.color['status.bg.danger']
    );
  });

  it('returns undefined for unknown tokens', () => {
    expect(resolveThemeColor('text.missing', defaultLightTheme)).toBe(
      undefined
    );
  });

  it('returns undefined when token is undefined', () => {
    expect(resolveThemeColor(undefined, defaultLightTheme)).toBe(undefined);
  });
});
