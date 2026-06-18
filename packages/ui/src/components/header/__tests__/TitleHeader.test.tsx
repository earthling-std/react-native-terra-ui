import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { TitleHeader } from '../variants/TitleHeader';

describe('TitleHeader', () => {
  it('renders a back dismiss button with accessibility label', () => {
    const onDismiss = jest.fn();
    render(
      <TitleHeader
        title="Settings"
        dismissAction="back"
        onDismiss={onDismiss}
      />
    );

    const backButton = screen.getByLabelText('Back');
    expect(backButton).toBeTruthy();

    fireEvent.press(backButton);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('renders a close dismiss button on the trailing side', () => {
    render(
      <TitleHeader title="Modal" dismissAction="close" onDismiss={jest.fn()} />
    );
    expect(screen.getByLabelText('Close')).toBeTruthy();
  });
});
