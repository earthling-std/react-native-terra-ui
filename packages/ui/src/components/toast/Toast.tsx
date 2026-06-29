import {
  type ComponentRef,
  createContext,
  forwardRef,
  type ReactNode,
  useContext,
  useId,
  useMemo,
} from "react";
import type { GestureResponderEvent, PressableProps, View } from "react-native";
import { Pressable, StyleSheet } from "react-native";

import { useUnistyles } from "react-native-unistyles";

import type { ColorToken, TerraIconName, TerraTheme } from "#theme/types";

import { Box } from "../box";
import { Button, type ButtonProps } from "../button";
import { Icon, type IconProps } from "../icon";
import { Surface, type SurfaceProps } from "../surface";
import { Text, type TextProps } from "../text";
import type { ToastId as StackToastId, ToastShowOptions } from "./types";
import { hideToast, showToast } from "./utils/controller";

export type ToastVariant =
  | "default"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "danger";

type ToastInstanceId = string | number;

export interface ToastControls {
  hide?: (id: ToastInstanceId) => void;
  id?: ToastInstanceId;
}

interface ToastContextValue extends ToastControls {
  nativeID: string;
  variant: ToastVariant;
  onClose?: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

function useToastContext(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error(
      "Toast compound components must be rendered inside <Toast>.",
    );
  }
  return context;
}

interface ToastColors {
  bg: ColorToken;
  border: ColorToken;
  title: ColorToken;
  description: ColorToken;
  icon: ColorToken;
  actionBg: string;
  actionFg: string;
}

function getToastColors(variant: ToastVariant, theme: TerraTheme): ToastColors {
  const base = {
    bg: theme.color.surface.base,
    border: theme.color.border.subtle,
    description: theme.color.content.secondary,
  };

  switch (variant) {
    case "accent":
      return {
        ...base,
        title: theme.color.action.secondary.fg,
        icon: theme.color.content.accent,
        actionBg: theme.color.action.primary.bg,
        actionFg: theme.color.action.primary.fg,
      };
    case "info":
    case "success":
    case "warning": {
      const status = theme.color.status[variant];
      return {
        ...base,
        title: status.solid,
        icon: status.solid,
        actionBg: status.solid,
        actionFg: status.onSolid,
      };
    }
    case "danger": {
      const status = theme.color.status.danger;
      return {
        ...base,
        title: status.solid,
        icon: status.solid,
        actionBg: status.solid,
        actionFg: status.onSolid,
      };
    }
    case "default":
      return {
        ...base,
        title: theme.color.content.primary,
        icon: theme.color.content.tertiary,
        actionBg: theme.color.action.neutral.hover,
        actionFg: theme.color.action.neutral.fg,
      };
  }
}

export interface ToastProps extends Omit<SurfaceProps, "id" | "variant"> {
  /** Visual tone for the toast. Defaults to `default`. */
  variant?: ToastVariant;
  /** Optional identifier passed back to `hide` when `Toast.Close` is pressed. */
  id?: ToastInstanceId;
  /** Imperative hide callback used by toast queues/providers. */
  hide?: (id: ToastInstanceId) => void;
  /** Local close callback used by `Toast.Close`. */
  onClose?: () => void;
}

const ToastRoot = forwardRef<ComponentRef<typeof View>, ToastProps>(
  function Toast(
    {
      variant = "default",
      id,
      hide,
      onClose,
      children,
      nativeID: nativeIDProp,
      style,
      accessibilityRole = "alert",
      ...rest
    },
    ref,
  ) {
    const { theme } = useUnistyles();
    const generatedNativeID = useId();
    const nativeID = nativeIDProp ?? String(id ?? generatedNativeID);
    const colors = getToastColors(variant, theme);
    const contextValue = useMemo<ToastContextValue>(
      () => ({ nativeID, variant, id, hide, onClose }),
      [nativeID, variant, id, hide, onClose],
    );

    return (
      <ToastContext.Provider value={contextValue}>
        <Surface
          ref={ref}
          variant="raised"
          elevation="md"
          radius="xl"
          p="4"
          row
          align="center"
          gap="3"
          accessibilityRole={accessibilityRole}
          accessibilityLiveRegion="polite"
          borderWidth="hairline"
          nativeID={nativeID}
          style={[
            styles.root,
            {
              backgroundColor: colors.bg,
              borderColor: colors.border,
            },
            style,
          ]}
          {...rest}
        >
          {children}
        </Surface>
      </ToastContext.Provider>
    );
  },
);

export interface ToastTitleProps extends TextProps {}

const ToastTitle = forwardRef<ComponentRef<typeof Text>, ToastTitleProps>(
  function ToastTitle(
    {
      accessibilityRole = "header",
      color,
      nativeID,
      variant = "label-lg",
      weight,
      ...rest
    },
    ref,
  ) {
    const { theme } = useUnistyles();
    const { nativeID: rootNativeID, variant: toastVariant } = useToastContext();
    const colors = getToastColors(toastVariant, theme);

    return (
      <Text
        ref={ref}
        accessibilityRole={accessibilityRole}
        color={color ?? colors.title}
        nativeID={nativeID ?? `${rootNativeID}_label`}
        variant={variant}
        weight={weight ?? "semibold"}
        {...rest}
      />
    );
  },
);

export interface ToastDescriptionProps extends TextProps {}

const ToastDescription = forwardRef<
  ComponentRef<typeof Text>,
  ToastDescriptionProps
>(function ToastDescription(
  { color, nativeID, variant = "body-sm", ...rest },
  ref,
) {
  const { theme } = useUnistyles();
  const { nativeID: rootNativeID, variant: toastVariant } = useToastContext();
  const colors = getToastColors(toastVariant, theme);

  return (
    <Text
      ref={ref}
      color={color ?? colors.description}
      nativeID={nativeID ?? `${rootNativeID}_desc`}
      variant={variant}
      {...rest}
    />
  );
});

export interface ToastActionProps extends Omit<
  PressableProps,
  "children" | "disabled" | "style"
> {
  children?: ReactNode;
  /** Override the action button colour. Defaults to the parent Toast variant. */
  variant?: ToastVariant;
  fullWidth?: boolean;
  isDisabled?: boolean;
  size?: "sm" | "md" | "lg";
  style?: PressableProps["style"];
}

function renderActionChildren(children: ReactNode, color: string): ReactNode {
  if (typeof children === "string" || typeof children === "number") {
    return (
      <Text variant="label-lg" weight="semibold" style={{ color }}>
        {children}
      </Text>
    );
  }
  return children;
}

const ToastAction = forwardRef<
  ComponentRef<typeof Pressable>,
  ToastActionProps
>(function ToastAction(
  {
    children,
    variant,
    fullWidth = false,
    isDisabled = false,
    size = "sm",
    style,
    onPress,
    ...rest
  },
  ref,
) {
  const { theme } = useUnistyles();
  const { variant: toastVariant } = useToastContext();
  const colors = getToastColors(variant ?? toastVariant, theme);

  return (
    <Pressable
      ref={ref}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      onPress={isDisabled ? undefined : onPress}
      {...rest}
      style={(state) => [
        styles.action,
        styles[`action_${size}`],
        fullWidth ? styles.actionFullWidth : null,
        {
          backgroundColor: colors.actionBg,
          opacity:
            state.pressed && !isDisabled
              ? theme.opacity.pressed
              : isDisabled
                ? theme.opacity.disabled
                : 1,
        },
        typeof style === "function" ? style(state) : style,
      ]}
    >
      {renderActionChildren(children, colors.actionFg)}
    </Pressable>
  );
});

export interface ToastCloseProps extends Omit<ButtonProps, "children"> {
  children?: ReactNode;
  iconProps?: Omit<IconProps, "name">;
}

const ToastClose = forwardRef<ComponentRef<typeof Button>, ToastCloseProps>(
  function ToastClose(
    {
      children,
      iconProps,
      size = "sm",
      fullWidth = false,
      isIconOnly = true,
      variant = "ghost",
      accessibilityLabel = "Close",
      onPress,
      ...rest
    },
    ref,
  ) {
    const { theme } = useUnistyles();
    const { id, hide, onClose, variant: toastVariant } = useToastContext();
    const colors = getToastColors(toastVariant, theme);
    const handlePress = (event: GestureResponderEvent) => {
      if (id !== undefined) hide?.(id);
      onClose?.();
      onPress?.(event);
    };

    return (
      <Button
        ref={ref}
        accessibilityLabel={accessibilityLabel}
        fullWidth={fullWidth}
        isIconOnly={isIconOnly}
        onPress={handlePress}
        size={size}
        compact
        variant={variant}
        {...rest}
      >
        {children ?? (
          <Icon
            name="navigation.close"
            size={iconProps?.size ?? 20}
            color={iconProps?.color ?? colors.icon}
            strokeWidth={iconProps?.strokeWidth}
            style={iconProps?.style}
          />
        )}
      </Button>
    );
  },
);

export interface ToastIconProps extends Omit<IconProps, "name"> {
  name?: TerraIconName;
}

const VARIANT_ICON: Partial<Record<ToastVariant, TerraIconName>> = {
  info: "status.info",
  success: "status.success",
  warning: "status.warning",
  danger: "status.danger",
};

const ToastIcon = forwardRef<ComponentRef<typeof View>, ToastIconProps>(
  function ToastIcon({ name, color, size = 20, ...rest }, ref) {
    const { theme } = useUnistyles();
    const { variant } = useToastContext();
    const colors = getToastColors(variant, theme);
    const iconName = name ?? VARIANT_ICON[variant] ?? "status.info";

    return (
      <Icon
        ref={ref}
        color={color ?? colors.icon}
        name={iconName}
        size={size}
        {...rest}
      />
    );
  },
);

export interface DefaultToastProps extends Omit<ToastProps, "children"> {
  label?: ReactNode;
  description?: ReactNode;
  actionLabel?: ReactNode;
  onActionPress?: (controls: ToastControls) => void;
  icon?: ReactNode | false;
  showCloseButton?: boolean;
}

export function DefaultToast({
  label,
  description,
  actionLabel,
  onActionPress,
  icon,
  showCloseButton,
  id,
  hide,
  variant = "default",
  ...rest
}: DefaultToastProps) {
  const shouldRenderIcon = icon !== false && (icon || variant !== "default");
  const handleActionPress = () => {
    onActionPress?.({ id, hide });
  };

  return (
    <ToastRoot id={id} hide={hide} variant={variant} {...rest}>
      {shouldRenderIcon ? (
        <Box alignSelf="start">{icon ?? <ToastIcon />}</Box>
      ) : null}
      <Box flex={1} gap="1">
        {label ? <ToastTitle>{label}</ToastTitle> : null}
        {description ? (
          <ToastDescription>{description}</ToastDescription>
        ) : null}
      </Box>
      {actionLabel ? (
        <ToastAction onPress={handleActionPress}>{actionLabel}</ToastAction>
      ) : null}
      {showCloseButton ? <ToastClose /> : null}
    </ToastRoot>
  );
}

type ToastComponent = typeof ToastRoot & {
  Title: typeof ToastTitle;
  Description: typeof ToastDescription;
  Action: typeof ToastAction;
  Close: typeof ToastClose;
  Icon: typeof ToastIcon;
  show: (options: ToastShowOptions) => StackToastId;
  hide: (id?: StackToastId | StackToastId[] | "all") => void;
};

export const Toast = ToastRoot as ToastComponent;
Toast.Title = ToastTitle;
Toast.Description = ToastDescription;
Toast.Action = ToastAction;
Toast.Close = ToastClose;
Toast.Icon = ToastIcon;
Toast.show = showToast;
Toast.hide = hideToast;

const styles = StyleSheet.create({
  root: {
    alignSelf: "stretch",
    minHeight: 64,
  },
  action: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 9999,
    justifyContent: "center",
  },
  action_sm: {
    minHeight: 36,
    paddingHorizontal: 14,
  },
  action_md: {
    minHeight: 44,
    paddingHorizontal: 16,
  },
  action_lg: {
    minHeight: 52,
    paddingHorizontal: 20,
  },
  actionFullWidth: {
    alignSelf: "stretch",
  },
});
