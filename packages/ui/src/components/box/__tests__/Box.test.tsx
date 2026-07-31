import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';

import { defaultLightTheme } from '../../../theme/theme';
import { Box } from '../Box';

describe('Box', () => {
  it('applies token spacing props', () => {
    render(<Box testID="box" p="4" />);
    const box = screen.getByTestId('box');

    expect(box.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ padding: defaultLightTheme.spacing[4] }),
      ])
    );
  });

  it('applies row layout', () => {
    render(<Box testID="box" row gap="2" />);
    const box = screen.getByTestId('box');

    expect(box.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          flexDirection: 'row',
          gap: defaultLightTheme.spacing[2],
        }),
      ])
    );
  });
});
