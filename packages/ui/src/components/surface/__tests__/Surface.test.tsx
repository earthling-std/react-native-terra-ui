import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';

import { defaultLightTheme } from '../../../theme/theme';
import { Surface } from '../Surface';

describe('Surface', () => {
  it('applies variant background and default raised elevation shadow', () => {
    render(<Surface testID="surface" variant="raised" />);
    const surface = screen.getByTestId('surface');
    const styles = surface.props.style as unknown[];

    expect(styles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          backgroundColor: defaultLightTheme.color.surface.raised,
        }),
      ])
    );
    expect(styles).toEqual(
      expect.arrayContaining([
        expect.arrayContaining([defaultLightTheme.elevation.sm]),
      ])
    );
  });

  it('omits shadow for transparent variant', () => {
    render(<Surface testID="surface" variant="transparent" />);
    const surface = screen.getByTestId('surface');

    expect(surface.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: 'transparent' }),
      ])
    );
    expect(surface.props.style).not.toEqual(
      expect.arrayContaining([defaultLightTheme.elevation.sm])
    );
  });

  it('applies variant hairline border defaults', () => {
    render(<Surface testID="surface" variant="raised" />);
    const surface = screen.getByTestId('surface');

    expect(surface.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          borderWidth: expect.any(Number),
          borderColor: defaultLightTheme.color.border.subtle,
        }),
      ])
    );
  });
});
