import { beforeEach, describe, expect, it, jest } from '@jest/globals';

const mockStyleSheetConfigure = jest.fn();

describe('configureTerraUI', () => {
  beforeEach(() => {
    jest.resetModules();
    mockStyleSheetConfigure.mockClear();
    jest.doMock('react-native-unistyles', () => ({
      StyleSheet: { configure: mockStyleSheetConfigure },
    }));
  });

  it('registers default themes on first call', () => {
    const { configureTerraUI, getIsConfigured } = require('../registry');

    expect(getIsConfigured()).toBe(false);
    configureTerraUI();
    expect(getIsConfigured()).toBe(true);
    expect(mockStyleSheetConfigure).toHaveBeenCalledWith(
      expect.objectContaining({
        themes: expect.objectContaining({
          light: expect.any(Object),
          dark: expect.any(Object),
        }),
      })
    );
  });

  it('ignores a second configure call with a dev warning', () => {
    const warn = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);
    const { configureTerraUI, getAccentNames } = require('../registry');

    configureTerraUI({
      accents: { emerald: { light: '#00bc7d', dark: '#00bc7d' } },
      defaultAccent: 'emerald',
    });
    configureTerraUI({
      accents: { rose: { light: '#e11d48', dark: '#fb7185' } },
      defaultAccent: 'rose',
    });

    expect(getAccentNames()).toEqual(['emerald']);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('configureTerraUI() was called more than once')
    );
    warn.mockRestore();
  });

  it('applies component defaults from config', () => {
    const { configureTerraUI, getDefaultRadius, getSurfaceElevation } =
      require('../registry');

    configureTerraUI({
      components: {
        button: { radius: 'full' },
        surface: { radius: 'xl', elevation: 'md' },
      },
    });

    expect(getDefaultRadius('button')).toBe('full');
    expect(getDefaultRadius('surface')).toBe('xl');
    expect(getSurfaceElevation()).toBe('md');
  });

  it('resolves themes with the configured accent', () => {
    const { configureTerraUI, resolveTheme } = require('../registry');

    configureTerraUI({
      accents: { brand: { light: '#009966', dark: '#00bc7d' } },
      defaultAccent: 'brand',
    });

    const light = resolveTheme('light', 'brand');
    expect(light.color['action.bg.primary']).toBe('#009966');
  });
});
