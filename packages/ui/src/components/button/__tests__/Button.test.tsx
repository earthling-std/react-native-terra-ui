import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { Button } from '../Button';

describe('Button', () => {
  it('renders label text', () => {
    render(<Button onPress={jest.fn()}>Continue</Button>);
    expect(screen.getByText('Continue')).toBeTruthy();
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    render(
      <Button isDisabled onPress={onPress}>
        Save
      </Button>
    );

    fireEvent.press(screen.getByText('Save'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
