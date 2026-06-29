import {
  Children,
  type ComponentRef,
  createContext,
  forwardRef,
  type ReactNode,
  useContext,
} from 'react';
import type { PressableProps } from 'react-native';
import { Pressable } from 'react-native';

import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { getDefaultRadius } from '#theme/configure';
import type {
  ColorToken,
  FontWeightToken,
  TerraIconName,
  TerraTheme,
  TextVariant,
} from '#theme/types';

import { Icon } from '../icon';
import { Spinner } from '../spinner';
import { Text } from '../text';

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
  /**
   * Stretch to the parent width in column layouts. Defaults to `true`.
   * Icon-only buttons always stay square regardless of this prop.
   */
  fullWidth?: boolean;
  /** Remove the button's built-in horizontal padding. */
  compact?: boolean;
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
  borderWidth: number;
  fg: string;
}

function getColors(variant: ButtonVariant, theme: TerraTheme): ButtonColors {
  const { action, status, border, content } = theme.color;
  switch (variant) {
    case 'primary':
      return {
        bg: action.primary.bg,
        border: action.primary.bg,
        borderWidth: 0,
        fg: action.primary.fg,
      };
    case 'secondary':
      return {
        bg: action.secondary.bg,
        border: action.secondary.bg,
        borderWidth: 0,
        fg: action.secondary.fg,
      };
    case 'neutral':
      return {
        bg: action.neutral.hover,
        border: action.neutral.hover,
        borderWidth: 0,
        fg: action.neutral.fg,
      };
    case 'outline':
      return {
        bg: 'transparent',
        border: border.default,
        borderWidth: 1,
        fg: content.primary,
      };
    case 'ghost':
      return {
        bg: 'transparent',
        border: 'transparent',
        borderWidth: 0,
        fg: content.primary,
      };
    case 'danger':
      return {
        bg: status.danger.solid,
        border: status.danger.solid,
        borderWidth: 0,
        fg: status.danger.onSolid,
      };
  }
}

// ─── Label sub-component ───────────────────────────────────────────────────────

const LABEL_TYPOGRAPHY: Record<
  ButtonSize,
  {
    variant: TextVariant;
    weight?: FontWeightToken;
  }
> = {
  sm: { variant: 'label-md', weight: 'semibold' },
  md: { variant: 'label-lg', weight: 'semibold' },
  lg: { variant: 'label-lg', weight: 'bold' },
};

const ButtonLabel = ({ children }: { children: ReactNode }) => {
  const { color, size } = useButtonContext();
  const typography = LABEL_TYPOGRAPHY[size];
  return (
    <Text
      variant={typography.variant}
      weight={typography.weight}
      style={{ color }}
    >
      {children}
    </Text>
  );
};

// ─── Icon sub-component ────────────────────────────────────────────────────────

const ICON_SIZE: Record<ButtonSize, number> = {
  sm: 16,
  md: 18,
  lg: 20,
};

export interface ButtonIconProps {
  name: TerraIconName;
  size?: number;
  color?: ColorToken;
  strokeWidth?: number;
}

const ButtonIcon = ({
  name,
  size: sizeProp,
  color: colorProp,
  strokeWidth,
}: ButtonIconProps) => {
  const { color, size } = useButtonContext();

  return (
    <Icon
      color={colorProp ?? color}
      name={name}
      size={sizeProp ?? ICON_SIZE[size]}
      strokeWidth={strokeWidth}
    />
  );
};

function renderChildren(children: ReactNode): ReactNode {
  return Children.map(children, (child) => {
    if (typeof child === 'string') {
      return child.trim().length > 0 ? (
        <ButtonLabel>{child}</ButtonLabel>
      ) : null;
    }
    if (typeof child === 'number') {
      return <ButtonLabel>{child}</ButtonLabel>;
    }
    return child;
  });
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
      fullWidth = true,
      compact = false,
      children,
      onPress,
      ...rest
    },
    ref
  ) {
    const { theme } = useUnistyles();
    styles.useVariants({
      size,
      radius,
      fullWidth: fullWidth && !isIconOnly,
      iconOnly: isIconOnly,
    });

    const { bg, border, borderWidth, fg } = getColors(variant, theme);
    const blocked = isDisabled || isLoading;
    const { style: externalStyle, ...pressableRest } = rest as typeof rest & {
      style?: PressableProps['style'];
    };

    return (
      <ButtonContext.Provider value={{ color: fg, size }}>
        <Pressable
          ref={ref}
          onPress={blocked ? undefined : onPress}
          disabled={blocked}
          accessibilityRole="button"
          accessibilityState={{ disabled: blocked, busy: isLoading }}
          {...pressableRest}
          style={(state) => [
            styles.base,
            { backgroundColor: bg, borderColor: border, borderWidth },
            compact ? styles.compact : null,
            state.pressed && !blocked
              ? { opacity: theme.opacity.pressed }
              : null,
            isDisabled ? { opacity: theme.opacity.disabled } : null,
            typeof externalStyle === 'function'
              ? externalStyle(state)
              : externalStyle,
          ]}
        >
          {isLoading ? (
            <Spinner size="sm" color={fg} />
          ) : (
            renderChildren(children)
          )}
        </Pressable>
      </ButtonContext.Provider>
    );
  }
);

type ButtonComponent = typeof ButtonRoot & {
  Icon: typeof ButtonIcon;
  Label: typeof ButtonLabel;
};

export const Button = ButtonRoot as ButtonComponent;
Button.Icon = ButtonIcon;
Button.Label = ButtonLabel;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create((theme) => ({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    variants: {
      size: {
        sm: { minHeight: 36, paddingHorizontal: 14, gap: 6 },
        md: { minHeight: 44, paddingHorizontal: 16, gap: 8 },
        lg: { minHeight: 52, paddingHorizontal: 20, gap: 8 },
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
  compact: {
    paddingHorizontal: 2,
    paddingVertical: 2,
    minHeight: 0
  },
}));
