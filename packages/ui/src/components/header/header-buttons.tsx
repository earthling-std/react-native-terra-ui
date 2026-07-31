import { Pressable, type PressableProps } from 'react-native';

import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import type {
  ColorToken,
  TerraIconName,
  TerraSemanticIconName,
} from '#theme/types';

import { Icon } from '../icon';

export interface HeaderButtonProps
  extends Omit<PressableProps, 'children' | 'style'> {
  /** Icon to render. */
  icon: TerraIconName;
  /** Icon size in density-independent pixels. Defaults to `26`. */
  iconSize?: number;
  /** Theme color token for the icon. Defaults to `text.default`. */
  color?: ColorToken;
  /** Accessible label read by screen readers. */
  accessibilityLabel?: string;
}

/**
 * Pre-styled circular icon button sized for a header's leading/trailing slot.
 * Use it directly for custom header actions (search, share, menu, …); Terra
 * UI's built-in dismiss button (`HeaderDismissButton`) is also built on it.
 *
 * @example
 * ```tsx
 * <Header.Title
 *   title="Inbox"
 *   RightComponent={<HeaderButton icon="status.info" onPress={showInfo} />}
 * />
 * ```
 */
export function HeaderButton({
  icon,
  iconSize = 20,
  color = 'text.default',
  accessibilityLabel,
  onPress,
  ...rest
}: HeaderButtonProps) {
  const { theme } = useUnistyles();

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed ? { opacity: theme.opacity.pressed } : null,
      ]}
      {...rest}
    >
      <Icon size={iconSize} color={color} name={icon} />
    </Pressable>
  );
}

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

export function HeaderDismissButton({
  dismissAction = 'none',
  navigation,
  onDismiss,
}: HeaderDismissProps) {
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
  };

  return (
    <HeaderButton
      icon={getDismissIconName(dismissAction)}
      iconSize={24}
      accessibilityLabel={getDismissAccessibilityLabel(dismissAction)}
      onPress={handlePress}
    />
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
