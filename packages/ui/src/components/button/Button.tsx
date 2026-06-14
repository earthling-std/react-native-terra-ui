import {
  type ComponentRef,
  createContext,
  forwardRef,
  type ReactNode,
  useContext,
} from 'react';
import type { PressableProps } from 'react-native';
import { ActivityIndicator, Pressable, Text } from 'react-native';

import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { getDefaultRadius } from '#theme/configure';
import type { TerraTheme } from '#theme/types';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'neutral'
  | 'outline'
  | 'ghost'
  | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ButtonProps
  extends Omit<PressableProps, 'style' | 'children' | 'disabled'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  radius?: ButtonRadius;
  isDisabled?: boolean;
  isLoading?: boolean;
  /** Square (1:1) button — pass a single icon as children. */
  isIconOnly?: boolean;
  fullWidth?: boolean;
  children?: ReactNode;
}

// ─── Context (lets icons/labels read the resolved foreground + size) ───────────

interface ButtonContextValue {
  color: string;
  size: ButtonSize;
}

const ButtonContext = createContext<ButtonContextValue>({
  color: '',
  size: 'md',
});

export const useButtonContext = (): ButtonContextValue =>
  useContext(ButtonContext);

// ─── Colors per variant ───────────────────────────────────────────────────────

interface ButtonColors {
  bg: string;
  border: string;
  fg: string;
}

function getColors(variant: ButtonVariant, theme: TerraTheme): ButtonColors {
  const { action, status, border, content } = theme.color;
  switch (variant) {
    case 'primary':
      return {
        bg: action.primary.bg,
        border: action.primary.bg,
        fg: action.primary.fg,
      };
    case 'secondary':
      return {
        bg: action.secondary.bg,
        border: action.secondary.bg,
        fg: action.secondary.fg,
      };
    case 'neutral':
      return {
        bg: action.neutral.hover,
        border: action.neutral.hover,
        fg: action.neutral.fg,
      };
    case 'outline':
      return { bg: 'transparent', border: border.default, fg: content.primary };
    case 'ghost':
      return { bg: 'transparent', border: 'transparent', fg: content.primary };
    case 'danger':
      return {
        bg: status.danger.solid,
        border: status.danger.solid,
        fg: status.danger.onSolid,
      };
  }
}

// ─── Label sub-component ───────────────────────────────────────────────────────

const LABEL_STYLE: Record<ButtonSize, { fontSize: number; fontWeight: '500' | '600'; lineHeight: number; letterSpacing: number }> = {
  sm: { fontSize: 14, fontWeight: '500', lineHeight: 20, letterSpacing: 0.5 },
  md: { fontSize: 16, fontWeight: '500', lineHeight: 24, letterSpacing: 0.1 },
  lg: { fontSize: 16, fontWeight: '600', lineHeight: 24, letterSpacing: 0.1 },
};

const ButtonLabel = ({ children }: { children: ReactNode }) => {
  const { color, size } = useButtonContext();
  return (
    <Text style={[LABEL_STYLE[size], { color }]}>
      {children}
    </Text>
  );
};

function renderChildren(children: ReactNode): ReactNode {
  if (typeof children === 'string' || typeof children === 'number') {
    return <ButtonLabel>{children}</ButtonLabel>;
  }
  return children;
}

// ─── Component ────────────────────────────────────────────────────────────────

const ButtonRoot = forwardRef<ComponentRef<typeof Pressable>, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      size = 'md',
      radius = getDefaultRadius('button'),
      isDisabled = false,
      isLoading = false,
      isIconOnly = false,
      fullWidth = false,
      children,
      onPress,
      ...rest
    },
    ref
  ) {
    const { theme } = useUnistyles();
    styles.useVariants({ size, radius, fullWidth, iconOnly: isIconOnly });

    const { bg, border, fg } = getColors(variant, theme);
    const blocked = isDisabled || isLoading;

    return (
      <ButtonContext.Provider value={{ color: fg, size }}>
        <Pressable
          ref={ref}
          onPress={blocked ? undefined : onPress}
          disabled={blocked}
          accessibilityRole="button"
          accessibilityState={{ disabled: blocked, busy: isLoading }}
          style={({ pressed }) => [
            styles.base,
            { backgroundColor: bg, borderColor: border },
            pressed && !blocked ? { opacity: theme.opacity.pressed } : null,
            isDisabled ? { opacity: theme.opacity.disabled } : null,
          ]}
          {...rest}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={fg} />
          ) : (
            renderChildren(children)
          )}
        </Pressable>
      </ButtonContext.Provider>
    );
  }
);

type ButtonComponent = typeof ButtonRoot & { Label: typeof ButtonLabel };

export const Button = ButtonRoot as ButtonComponent;
Button.Label = ButtonLabel;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create((theme) => ({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    alignSelf: 'flex-start',
    variants: {
      size: {
        sm: { height: 36, paddingHorizontal: 14, gap: 6 },
        md: { height: 44, paddingHorizontal: 16, gap: 8 },
        lg: { height: 52, paddingHorizontal: 20, gap: 8 },
      },
      radius: {
        none: { borderRadius: theme.radius.none },
        sm: { borderRadius: theme.radius.sm },
        md: { borderRadius: theme.radius.md },
        lg: { borderRadius: theme.radius.lg },
        xl: { borderRadius: theme.radius.xl },
        full: { borderRadius: theme.radius.full },
      },
      fullWidth: {
        true: { alignSelf: 'stretch' },
        false: {},
      },
      iconOnly: {
        true: { paddingHorizontal: 0, aspectRatio: 1 },
        false: {},
      },
    },
  },
}));
