import { describe, expect, it } from '@jest/globals';

import { defaultLightTheme } from '../../theme/theme';
import { resolveThemeColor } from '../resolve-theme-color';

describe('resolveThemeColor', () => {
  it('resolves nested color tokens from the theme', () => {
    expect(resolveThemeColor('content.primary', defaultLightTheme)).toBe(
      defaultLightTheme.color.content.primary
    );
  });

  it('passes through raw color literals', () => {
    expect(resolveThemeColor('#ff0000', defaultLightTheme)).toBe('#ff0000');
    expect(resolveThemeColor('transparent', defaultLightTheme)).toBe(
      'transparent'
    );
  });

  it('resolves status group shorthand to solid', () => {
    expect(resolveThemeColor('status.danger', defaultLightTheme)).toBe(
      defaultLightTheme.color.status.danger.solid
    );
  });

  it('returns undefined for unknown tokens', () => {
    expect(resolveThemeColor('content.missing', defaultLightTheme)).toBe(
      undefined
    );
  });

  it('returns undefined when token is undefined', () => {
    expect(resolveThemeColor(undefined, defaultLightTheme)).toBe(undefined);
  });
});
