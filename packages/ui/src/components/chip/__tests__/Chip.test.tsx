import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import { StyleSheet, View } from 'react-native';

import { defaultLightTheme } from '../../../theme/theme';
import { readableOn } from '../../../utils/color-utils';
import { Chip } from '../Chip';

const T = defaultLightTheme.color as unknown as Record<
  string,
  string | undefined
>;
const get = (key: string): string => T[key] ?? '';
const HEX = '#7c3aed';

describe('Chip', () => {
  describe('content', () => {
    it('renders plain text children', () => {
      render(<Chip>Active</Chip>);
      expect(screen.getByText('Active')).toBeTruthy();
    });

    it('renders number children', () => {
      render(<Chip>{3}</Chip>);
      expect(screen.getByText('3')).toBeTruthy();
    });

    it('renders Chip.Icon followed by text', () => {
      render(
        <Chip>
          <Chip.Icon name="status.success" testID="icon" />
          Active
        </Chip>
      );
      expect(screen.getByTestId('icon')).toBeTruthy();
      expect(screen.getByText('Active')).toBeTruthy();
    });

    it('renders arbitrary/dynamic children untouched', () => {
      const isActive = true;
      render(
        <Chip>
          <Chip.Icon name="status.success" testID="icon-1" />
          <Chip.Icon name="status.warning" testID="icon-2" />
          <View testID="custom-el" />
          {isActive ? 'Active' : null}
        </Chip>
      );
      expect(screen.getByTestId('icon-1')).toBeTruthy();
      expect(screen.getByTestId('icon-2')).toBeTruthy();
      expect(screen.getByTestId('custom-el')).toBeTruthy();
      expect(screen.getByText('Active')).toBeTruthy();
    });
  });

  describe('size', () => {
    it('defaults to md size', () => {
      render(<Chip testID="chip">Label</Chip>);
      const style = StyleSheet.flatten(screen.getByTestId('chip').props.style);
      expect(style.minHeight).toBe(24);
      expect(style.paddingHorizontal).toBe(12);
    });

    it('applies sm size', () => {
      render(
        <Chip testID="chip" size="sm">
          Label
        </Chip>
      );
      const style = StyleSheet.flatten(screen.getByTestId('chip').props.style);
      expect(style.minHeight).toBe(20);
      expect(style.paddingHorizontal).toBe(8);
    });

    it('applies lg size', () => {
      render(
        <Chip testID="chip" size="lg">
          Label
        </Chip>
      );
      const style = StyleSheet.flatten(screen.getByTestId('chip').props.style);
      expect(style.minHeight).toBe(28);
      expect(style.paddingHorizontal).toBe(16);
    });
  });

  describe('variant', () => {
    it('defaults to soft', () => {
      render(
        <Chip testID="chip" color="primary">
          Label
        </Chip>
      );
      const style = StyleSheet.flatten(screen.getByTestId('chip').props.style);
      expect(style.backgroundColor).toBe(get('action.bg.subtle'));
      expect(style.borderWidth).toBe(0);
    });

    it('solid fills the background with no border', () => {
      render(
        <Chip testID="chip" color="primary" variant="solid">
          Label
        </Chip>
      );
      const style = StyleSheet.flatten(screen.getByTestId('chip').props.style);
      expect(style.backgroundColor).toBe(get('action.bg.primary'));
      expect(style.borderWidth).toBe(0);
    });

    it('outline renders a transparent background with a visible border', () => {
      render(
        <Chip testID="chip" color="primary" variant="outline">
          Label
        </Chip>
      );
      const style = StyleSheet.flatten(screen.getByTestId('chip').props.style);
      expect(style.backgroundColor).toBe('transparent');
      expect(style.borderWidth).toBe(1);
      expect(style.borderColor).toBe(get('border.accent'));
    });

    it.each([
      'primary',
      'secondary',
      'success',
      'warning',
      'danger',
      HEX,
    ])('ghost is transparent with text.default foreground, ignoring color=%s', (color) => {
      render(
        <Chip testID="chip" color={color} variant="ghost">
          Label
        </Chip>
      );
      const style = StyleSheet.flatten(screen.getByTestId('chip').props.style);
      const label = StyleSheet.flatten(screen.getByText('Label').props.style);
      expect(style.backgroundColor).toBe('transparent');
      expect(style.borderWidth).toBe(0);
      expect(label.color).toBe(get('text.default'));
    });
  });

  describe('color token mapping', () => {
    const MATRIX: Array<{
      color: string;
      variant: 'solid' | 'soft' | 'outline';
      bg: string;
      border: string;
      fg: string;
    }> = [
      {
        color: 'primary',
        variant: 'solid',
        bg: get('action.bg.primary'),
        border: get('action.bg.primary'),
        fg: get('action.fg.primary'),
      },
      {
        color: 'primary',
        variant: 'soft',
        bg: get('action.bg.subtle'),
        border: get('action.bg.subtle'),
        fg: get('action.fg.subtle'),
      },
      {
        color: 'primary',
        variant: 'outline',
        bg: 'transparent',
        border: get('border.accent'),
        fg: get('text.accent'),
      },
      {
        color: 'secondary',
        variant: 'solid',
        bg: get('action.bg.neutral.hover'),
        border: get('action.bg.neutral.hover'),
        fg: get('action.fg.neutral'),
      },
      {
        color: 'secondary',
        variant: 'soft',
        bg: get('surface.sunken'),
        border: get('surface.sunken'),
        fg: get('text.muted'),
      },
      {
        color: 'secondary',
        variant: 'outline',
        bg: 'transparent',
        border: get('border.default'),
        fg: get('text.default'),
      },
      {
        color: 'success',
        variant: 'solid',
        bg: get('status.bg.success'),
        border: get('status.bg.success'),
        fg: get('status.fg.success'),
      },
      {
        color: 'success',
        variant: 'soft',
        bg: get('status.bg.success.subtle'),
        border: get('status.bg.success.subtle'),
        fg: get('status.fg.success.subtle'),
      },
      {
        color: 'success',
        variant: 'outline',
        bg: 'transparent',
        border: get('status.border.success'),
        fg: get('status.fg.success.subtle'),
      },
      {
        color: 'warning',
        variant: 'solid',
        bg: get('status.bg.warning'),
        border: get('status.bg.warning'),
        fg: get('status.fg.warning'),
      },
      {
        color: 'warning',
        variant: 'soft',
        bg: get('status.bg.warning.subtle'),
        border: get('status.bg.warning.subtle'),
        fg: get('status.fg.warning.subtle'),
      },
      {
        color: 'warning',
        variant: 'outline',
        bg: 'transparent',
        border: get('status.border.warning'),
        fg: get('status.fg.warning.subtle'),
      },
      {
        color: 'danger',
        variant: 'solid',
        bg: get('status.bg.danger'),
        border: get('status.bg.danger'),
        fg: get('status.fg.danger'),
      },
      {
        color: 'danger',
        variant: 'soft',
        bg: get('status.bg.danger.subtle'),
        border: get('status.bg.danger.subtle'),
        fg: get('status.fg.danger.subtle'),
      },
      {
        color: 'danger',
        variant: 'outline',
        bg: 'transparent',
        border: get('status.border.danger'),
        fg: get('status.fg.danger.subtle'),
      },
    ];

    it.each(MATRIX)('resolves $color/$variant to the exact spec tokens', ({
      color,
      variant,
      bg,
      border,
      fg,
    }) => {
      render(
        <Chip testID="chip" color={color} variant={variant}>
          Label
        </Chip>
      );
      const style = StyleSheet.flatten(screen.getByTestId('chip').props.style);
      const label = StyleSheet.flatten(screen.getByText('Label').props.style);
      expect(style.backgroundColor).toBe(bg);
      expect(style.borderColor).toBe(border);
      expect(label.color).toBe(fg);
    });

    it('derives solid colors from a custom hex literal', () => {
      render(
        <Chip testID="chip" color={HEX} variant="solid">
          Label
        </Chip>
      );
      const style = StyleSheet.flatten(screen.getByTestId('chip').props.style);
      const label = StyleSheet.flatten(screen.getByText('Label').props.style);
      expect(style.backgroundColor).toBe(HEX);
      expect(label.color).toBe(readableOn(HEX));
    });

    it('derives a translucent tint from a custom hex literal for soft', () => {
      render(
        <Chip testID="chip" color={HEX} variant="soft">
          Label
        </Chip>
      );
      const style = StyleSheet.flatten(screen.getByTestId('chip').props.style);
      const label = StyleSheet.flatten(screen.getByText('Label').props.style);
      // #7c3aed → rgb(124, 58, 237)
      expect(style.backgroundColor).toMatch(/^rgba\(124, 58, 237,/);
      expect(label.color).toBe(HEX);
    });

    it('uses the custom hex literal directly for outline', () => {
      render(
        <Chip testID="chip" color={HEX} variant="outline">
          Label
        </Chip>
      );
      const style = StyleSheet.flatten(screen.getByTestId('chip').props.style);
      const label = StyleSheet.flatten(screen.getByText('Label').props.style);
      expect(style.backgroundColor).toBe('transparent');
      expect(style.borderColor).toBe(HEX);
      expect(label.color).toBe(HEX);
    });
  });

  describe('Chip.Icon', () => {
    it('inherits the chip foreground color and size by default', () => {
      render(
        <Chip color="success" variant="solid" size="lg">
          <Chip.Icon name="status.success" />
          Done
        </Chip>
      );
      expect(
        screen.UNSAFE_getByProps({ color: get('status.fg.success'), size: 16 })
      ).toBeTruthy();
    });

    it('respects explicit color/size overrides', () => {
      render(
        <Chip color="success" variant="solid" size="lg">
          <Chip.Icon name="status.success" color="#000000" size={30} />
          Done
        </Chip>
      );
      expect(
        screen.UNSAFE_getByProps({ color: '#000000', size: 30 })
      ).toBeTruthy();
    });
  });
});
