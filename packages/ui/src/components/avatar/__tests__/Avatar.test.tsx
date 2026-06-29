import { describe, expect, it } from '@jest/globals';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { Image } from 'react-native';

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
      render(<Avatar source={{ uri: 'https://broken.invalid/img.jpg' }} name="Error User" />);

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
          expect.objectContaining({ borderRadius: defaultLightTheme.radius.md }),
        ])
      );
    });

    it('applies square shape (borderRadius = 0)', () => {
      render(<Avatar testID="av" size="md" shape="square" />);
      const container = screen.getByTestId('av');
      expect(container.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ borderRadius: 0 }),
        ])
      );
    });
  });
});
