import { describe, expect, it } from '@jest/globals';

import { defaultDarkTheme, defaultLightTheme } from '../theme';
import { dark } from '../tokens/dark';
import { light } from '../tokens/light';
import { primitives } from '../tokens/primitives';

// Mirrors theme.ts's own ALPHA_REF_PATTERN so this test discovers whatever
// `{palette.key}/NN` tokens currently exist, rather than pinning specific
// design values that are still being tuned.
const ALPHA_REF_PATTERN = /^\{([\w.]+)\}\/(\d{1,3})$/;

function percentToHexAlpha(percent: number): string {
  return Math.round((percent / 100) * 255)
    .toString(16)
    .padStart(2, '0');
}

function alphaRefEntries(tokens: Record<string, unknown>) {
  const entries: Array<{ colorKey: string; refKey: string; percent: number }> =
    [];
  for (const [key, value] of Object.entries(tokens)) {
    const match =
      typeof value === 'string' ? value.match(ALPHA_REF_PATTERN) : null;
    if (match) {
      entries.push({
        colorKey: key.replace(/^color\./, ''),
        refKey: match[1] as string,
        percent: Number(match[2]),
      });
    }
  }
  return entries;
}

function expectAlphaRefsResolved(
  tokens: Record<string, unknown>,
  theme: Record<string, unknown>
) {
  const prim = primitives as Record<string, unknown>;
  for (const { colorKey, refKey, percent } of alphaRefEntries(tokens)) {
    expect(theme[colorKey]).toBe(
      `${prim[refKey]}${percentToHexAlpha(percent)}`
    );
  }
}

describe('resolveRefs alpha suffix ({palette.key}/NN)', () => {
  it('resolves every light-theme {palette.key}/NN token to base hex + alpha byte', () => {
    // Guards against the regex silently matching nothing and the loop below
    // passing vacuously - light.ts is expected to use this syntax today.
    expect(alphaRefEntries(light).length).toBeGreaterThan(0);
    expectAlphaRefsResolved(
      light,
      defaultLightTheme.color as unknown as Record<string, unknown>
    );
  });

  it('resolves every dark-theme {palette.key}/NN token to base hex + alpha byte', () => {
    expectAlphaRefsResolved(
      dark,
      defaultDarkTheme.color as unknown as Record<string, unknown>
    );
  });
});
