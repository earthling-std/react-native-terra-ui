import { describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';

import { defaultLightTheme } from '../../../theme/theme';
import { DefaultToast, Toast } from '../Toast';
import { ToastProvider, useToast } from '../ToastProvider';

describe('Toast', () => {
  it('renders compound title and description', () => {
    render(
      <Toast>
        <Toast.Title>Saved</Toast.Title>
        <Toast.Description>Your changes are synced.</Toast.Description>
      </Toast>
    );

    expect(screen.getByText('Saved')).toBeTruthy();
    expect(screen.getByText('Your changes are synced.')).toBeTruthy();
  });

  it('keeps the surface neutral and applies status title color', () => {
    render(
      <Toast testID="toast" variant="success">
        <Toast.Title>Published</Toast.Title>
      </Toast>
    );

    expect(StyleSheet.flatten(screen.getByTestId('toast').props.style)).toEqual(
      expect.objectContaining({
        backgroundColor: defaultLightTheme.color.surface.raised,
        borderColor: defaultLightTheme.color.border.subtle,
      })
    );
    expect(
      StyleSheet.flatten(screen.getByText('Published').props.style)
    ).toEqual(
      expect.objectContaining({
        color: defaultLightTheme.color.status.success.solid,
      })
    );
  });

  it('calls hide and onClose when close is pressed', () => {
    const hide = jest.fn();
    const onClose = jest.fn();
    const onPress = jest.fn();

    render(
      <Toast id="toast-1" hide={hide} onClose={onClose}>
        <Toast.Close onPress={onPress} />
      </Toast>
    );

    fireEvent.press(screen.getByLabelText('Close'));
    expect(hide).toHaveBeenCalledWith('toast-1');
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe('DefaultToast', () => {
  it('renders label, description, and action', () => {
    const onActionPress = jest.fn();
    const hide = jest.fn();

    render(
      <DefaultToast
        id="toast-2"
        hide={hide}
        label="Invite sent"
        description="Alex will receive an email."
        actionLabel="Undo"
        onActionPress={onActionPress}
      />
    );

    fireEvent.press(screen.getByText('Undo'));
    expect(screen.getByText('Invite sent')).toBeTruthy();
    expect(screen.getByText('Alex will receive an email.')).toBeTruthy();
    expect(onActionPress).toHaveBeenCalledWith({ id: 'toast-2', hide });
  });
});

describe('ToastProvider', () => {
  it('renders and hides a toast through the static API', () => {
    render(<ToastProvider />);

    act(() => {
      Toast.show({
        label: 'You have 2 credits left',
        description: 'Get a paid plan for more credits',
        actionLabel: 'Close',
        duration: 'persistent',
        onActionPress: ({ hide }) => hide(),
      });
    });

    expect(screen.getByText('You have 2 credits left')).toBeTruthy();
    act(() => {
      Toast.hide('all');
    });
    expect(screen.queryByText('You have 2 credits left')).toBeNull();
  });

  it('renders a toast through useToast', () => {
    function HookToast() {
      const toast = useToast();

      useEffect(() => {
        toast.show({
          variant: 'accent',
          label: 'Hook toast',
          duration: 'persistent',
        });
      }, [toast]);

      return null;
    }

    render(
      <ToastProvider>
        <HookToast />
      </ToastProvider>
    );

    expect(screen.getByText('Hook toast')).toBeTruthy();
  });
});
