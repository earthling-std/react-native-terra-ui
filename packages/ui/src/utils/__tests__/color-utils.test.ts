import { describe, expect, it } from '@jest/globals';

import { readableOn, shade, withAlpha } from '../color-utils';

describe('color-utils', () => {
  describe('shade', () => {
    it('lightens a hex color with positive amount', () => {
      expect(shade('#000000', 0.5)).toBe('#808080');
    });

    it('darkens a hex color with negative amount', () => {
      expect(shade('#ffffff', -0.5)).toBe('#808080');
    });

    it('returns input unchanged for invalid hex', () => {
      expect(shade('not-a-color', 0.5)).toBe('not-a-color');
    });
  });

  describe('withAlpha', () => {
    it('returns rgba for valid hex', () => {
      expect(withAlpha('#ff0000', 0.5)).toBe('rgba(255, 0, 0, 0.5)');
    });

    it('returns input unchanged for invalid hex', () => {
      expect(withAlpha('invalid', 0.5)).toBe('invalid');
    });
  });

  describe('readableOn', () => {
    it('returns black on light backgrounds', () => {
      expect(readableOn('#ffffff')).toBe('#000000');
    });

    it('returns white on dark backgrounds', () => {
      expect(readableOn('#000000')).toBe('#ffffff');
    });
  });
});
