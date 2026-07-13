import { Pressable } from 'react-native';

import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import type { TerraSemanticIconName } from '#theme/types';

import { Icon } from '../icon';

export type HeaderDismissAction = 'back' | 'close' | 'none';

export interface HeaderDismissNavigation {
  canGoBack?: () => boolean;
  goBack?: () => void;
  dismiss?: () => void;
}

export interface HeaderDismissProps {
  /** Adds a built-in dismiss button to the leading/trailing header slot. */
  dismissAction?: HeaderDismissAction;
  /** Called before any navigation fallback. */
  onDismiss?: () => void;
  /** Optional navigation object, usually from `useNavigation()`. */
  navigation?: HeaderDismissNavigation;
}

const getDismissAccessibilityLabel = (
  dismissAction: HeaderDismissAction
): string => (dismissAction === 'close' ? 'Close' : 'Back');

const getDismissIconName = (
  dismissAction: HeaderDismissAction
): TerraSemanticIconName =>
  dismissAction === 'close' ? 'navigation.close' : 'navigation.back';

const warnUnavailableDismiss = (dismissAction: HeaderDismissAction): void => {
  if (__DEV__) {
    console.warn(
      `[react-native-terra-ui] Header.Title dismissAction="${dismissAction}" was pressed, but no dismiss handler or available navigation action was provided.`
    );
  }
};

export function HeaderDismissButton({
  dismissAction = 'none',
  navigation,
  onDismiss,
}: HeaderDismissProps) {
  const { theme } = useUnistyles();

  if (dismissAction === 'none') return null;

  const handlePress = () => {
    if (onDismiss) {
      onDismiss();
      return;
    }

    if (dismissAction === 'close' && navigation?.dismiss) {
      navigation.dismiss();
      return;
    }

    if (navigation?.goBack && navigation.canGoBack?.() !== false) {
      navigation.goBack();
      return;
    }

    warnUnavailableDismiss(dismissAction);
  };

  return (
    <Pressable
      accessibilityLabel={getDismissAccessibilityLabel(dismissAction)}
      accessibilityRole="button"
      hitSlop={8}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.button,
        pressed ? { opacity: theme.opacity.pressed } : null,
      ]}
    >
      <Icon
        size={26}
        color="text.default"
        name={getDismissIconName(dismissAction)}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  button: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.full,
    backgroundColor:
      (theme.color as unknown as Record<string, string | undefined>)[
        'surface.default'
      ] ?? '',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
