import { describe, expect, it } from '@jest/globals';

import { deepMerge } from '../deep-merge';

describe('deepMerge', () => {
  it('returns base when override is undefined', () => {
    const base = { a: 1, b: { c: 2 } };
    expect(deepMerge(base, undefined)).toBe(base);
  });

  it('merges nested plain objects without mutating inputs', () => {
    const base = { color: { primary: '#000', secondary: '#111' }, spacing: 4 };
    const override = { color: { primary: '#fff' } };
    const result = deepMerge(base, override);

    expect(result).toEqual({
      color: { primary: '#fff', secondary: '#111' },
      spacing: 4,
    });
    expect(base.color.primary).toBe('#000');
  });

  it('replaces arrays and non-plain values', () => {
    const base = { items: [1, 2], label: 'old' };
    const override = { items: [3], label: 'new' };
    expect(deepMerge(base, override)).toEqual({ items: [3], label: 'new' });
  });

  it('skips undefined override keys', () => {
    const base = { a: 1, b: 2 };
    expect(deepMerge(base, { a: undefined, b: 3 })).toEqual({ a: 1, b: 3 });
  });
});
