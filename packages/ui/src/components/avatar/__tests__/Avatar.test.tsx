import { describe, expect, it } from '@jest/globals';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { Image, StyleSheet } from 'react-native';

import { defaultLightTheme } from '../../../theme/theme';
import { Avatar } from '../Avatar';

describe('Avatar', () => {
  describe('fallback priority', () => {
    it('renders built-in placeholder when no source, name, or fallback', () => {
      render(<Avatar testID="av" />);
      // PersonIcon renders an Svg — no Text should appear
      expect(screen.queryByText(/./)).toBeNull();
    });

    it('renders initials from name when no source', () => {
      render(<Avatar name="Jane Doe" />);
      expect(screen.getByText('JD')).toBeTruthy();
    });

    it('uses only first letter when name is a single word', () => {
      render(<Avatar name="Madonna" />);
      expect(screen.getByText('M')).toBeTruthy();
    });

    it('renders custom fallback over initials', () => {
      render(
        <Avatar name="Jane Doe" fallback={<>{/* custom */}</>} testID="av" />
      );
      expect(screen.queryByText('JD')).toBeNull();
    });
  });

  describe('error handling', () => {
    it('switches to initials when image fails to load', async () => {
      render(
        <Avatar
          source={{ uri: 'https://broken.invalid/img.jpg' }}
          name="Error User"
        />
      );

      // Trigger the onError callback on the Image
      const img = screen.UNSAFE_getByType(Image);
      await act(async () => {
        fireEvent(img, 'error');
      });

      expect(screen.getByText('EU')).toBeTruthy();
    });
  });

  describe('size', () => {
    it('defaults to md size (40px)', () => {
      render(<Avatar testID="av" />);
      const container = screen.getByTestId('av');
      expect(container.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ width: 40, height: 40 }),
        ])
      );
    });

    it('applies xl size (64px)', () => {
      render(<Avatar testID="av" size="xl" />);
      const container = screen.getByTestId('av');
      expect(container.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ width: 64, height: 64 }),
        ])
      );
    });
  });

  describe('shape', () => {
    it('defaults to circle (borderRadius = size / 2)', () => {
      render(<Avatar testID="av" size="md" />);
      const container = screen.getByTestId('av');
      expect(container.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ borderRadius: 20 }), // 40 / 2
        ])
      );
    });

    it('applies rounded shape using theme radius.md', () => {
      render(<Avatar testID="av" size="md" shape="rounded" />);
      const container = screen.getByTestId('av');
      expect(container.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            borderRadius: defaultLightTheme.radius.md,
          }),
        ])
      );
    });

    it('applies square shape (borderRadius = 0)', () => {
      render(<Avatar testID="av" size="md" shape="square" />);
      const container = screen.getByTestId('av');
      expect(container.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ borderRadius: 0 })])
      );
    });

    it('clips the inner Image to match square shape (no radius)', () => {
      render(
        <Avatar
          size="md"
          shape="square"
          source={{ uri: 'https://example.invalid/photo.jpg' }}
        />
      );
      const img = screen.UNSAFE_getByType(Image);
      const containerStyle = StyleSheet.flatten(
        img.parent?.parent?.props.style
      );
      expect(containerStyle.borderRadius).toBe(0);
    });

    it('clips the inner Image to a circle to match circle shape', () => {
      render(
        <Avatar
          size="md"
          shape="circle"
          source={{ uri: 'https://example.invalid/photo.jpg' }}
        />
      );
      const img = screen.UNSAFE_getByType(Image);
      const containerStyle = StyleSheet.flatten(
        img.parent?.parent?.props.style
      );
      expect(containerStyle.borderRadius).toBe(defaultLightTheme.radius.full);
    });

    it('clips the inner Image to theme radius.md to match rounded shape', () => {
      render(
        <Avatar
          size="md"
          shape="rounded"
          source={{ uri: 'https://example.invalid/photo.jpg' }}
        />
      );
      const img = screen.UNSAFE_getByType(Image);
      const containerStyle = StyleSheet.flatten(
        img.parent?.parent?.props.style
      );
      expect(containerStyle.borderRadius).toBe(defaultLightTheme.radius.md);
    });
  });

  describe('color', () => {
    const T = defaultLightTheme.color as unknown as Record<
      string,
      string | undefined
    >;
    const get = (key: string): string => T[key] ?? '';

    it('defaults to secondary/solid', () => {
      render(<Avatar testID="av" name="Jane Doe" />);
      const container = screen.getByTestId('av');
      expect(container.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            backgroundColor: get('action.bg.secondary'),
          }),
        ])
      );
    });

    it('resolves secondary/solid and secondary/soft to different tokens', () => {
      const solidResult = render(
        <Avatar
          testID="av-solid"
          name="Jane Doe"
          color="secondary"
          variant="solid"
        />
      );
      const solid = solidResult.getByTestId('av-solid').props.style;
      solidResult.unmount();

      const softResult = render(
        <Avatar
          testID="av-soft"
          name="Jane Doe"
          color="secondary"
          variant="soft"
        />
      );
      const soft = softResult.getByTestId('av-soft').props.style;

      expect(solid).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            backgroundColor: get('action.bg.secondary'),
          }),
        ])
      );
      expect(soft).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            backgroundColor: get('action.bg.secondary.subtle'),
          }),
        ])
      );
    });

    it('resolves primary color to action tokens', () => {
      render(
        <Avatar testID="av" name="Jane Doe" color="primary" variant="solid" />
      );
      const container = screen.getByTestId('av');
      expect(container.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            backgroundColor: get('action.bg.primary'),
          }),
        ])
      );
      expect(screen.getByText('JD').props.style).toEqual(
        expect.objectContaining({ color: get('action.fg.primary') })
      );
    });

    it('resolves danger/soft to status subtle tokens', () => {
      render(
        <Avatar testID="av" name="Jane Doe" color="danger" variant="soft" />
      );
      const container = screen.getByTestId('av');
      expect(container.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            backgroundColor: get('status.bg.danger.subtle'),
          }),
        ])
      );
    });
  });
});
