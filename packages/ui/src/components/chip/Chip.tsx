import {
  Children,
  type ComponentRef,
  createContext,
  forwardRef,
  type ReactNode,
  useContext,
} from 'react';
import { View, type ViewProps } from 'react-native';

import { StyleSheet } from 'react-native-unistyles';

import type { ColorToken, TerraIconName, TextVariant } from '#theme/types';

import { Icon } from '../icon';
import { Text } from '../text';
import type { ChipColor, ChipSize, ChipVariant } from './types';
import { getCustomColorColors } from './utils';

export interface ChipProps extends ViewProps {
  size?: ChipSize;
  variant?: ChipVariant;
  color?: ChipColor;
  children?: ReactNode;
}

// ─── Context (lets Chip.Icon read the resolved foreground + size) ─────────────

interface ChipContextValue {
  color: string;
  size: ChipSize;
}

const ChipContext = createContext<ChipContextValue>({
  color: '',
  size: 'md',
});

// ─── Colors ─────────────────────────────────────────────────────────────────
//
// Named schemes (primary/secondary/success/warning/danger) are resolved
// declaratively below via unistyles `compoundVariants` on `styles.base` — one
// entry per (color, variant) pair, straight from the spec's token table.
// A custom color literal (hex/rgb/hsl) isn't a bounded set of options, so it
// can't be a compound variant condition — see `getCustomColorColors` in
// `utils.ts` for how it's derived instead.

const SCHEME_NAMES = new Set([
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
]);

type ChipScheme = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

// ─── Label sub-component ───────────────────────────────────────────────────────

const LABEL_VARIANT: Record<ChipSize, TextVariant> = {
  sm: 'label-sm',
  md: 'label-md',
  lg: 'label-lg',
};

const ChipLabel = ({ children }: { children: ReactNode }) => {
  const { color, size } = useContext(ChipContext);
  return (
    <Text variant={LABEL_VARIANT[size]} weight="medium" style={{ color }}>
      {children}
    </Text>
  );
};

// ─── Icon sub-component ────────────────────────────────────────────────────────

const ICON_SIZE: Record<ChipSize, number> = {
  sm: 12,
  md: 14,
  lg: 16,
};

export interface ChipIconProps extends Omit<ViewProps, 'children'> {
  name: TerraIconName;
  size?: number;
  color?: ColorToken;
  strokeWidth?: number;
}

const ChipIcon = ({
  name,
  size: sizeProp,
  color,
  strokeWidth,
  style,
  ...rest
}: ChipIconProps) => {
  const { color: contextColor, size } = useContext(ChipContext);

  return (
    <Icon
      name={name}
      color={color || contextColor}
      size={sizeProp ?? ICON_SIZE[size]}
      strokeWidth={strokeWidth}
      style={style}
      {...rest}
    />
  );
};

function renderChildren(children: ReactNode): ReactNode {
  return Children.map(children, (child) => {
    if (typeof child === 'string') {
      return child.trim().length > 0 ? <ChipLabel>{child}</ChipLabel> : null;
    }
    if (typeof child === 'number') {
      return <ChipLabel>{child}</ChipLabel>;
    }
    return child;
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

const ChipRoot = forwardRef<ComponentRef<typeof View>, ChipProps>(function Chip(
  {
    size = 'md',
    variant = 'soft',
    color = 'secondary',
    children,
    style,
    ...rest
  },
  ref
) {
  // Compound variants only match the 5 named schemes above — an arbitrary
  // literal never matches one, so it's cast to satisfy `useVariants`'s
  // literal-union type while still comparing against the real value below.
  styles.useVariants({ color: color as ChipScheme, variant, size });

  const isCustomColor = variant !== 'ghost' && !SCHEME_NAMES.has(color);
  const customColors = isCustomColor
    ? getCustomColorColors(color, variant as 'solid' | 'soft' | 'outline')
    : null;

  const fg = customColors ? customColors.fg : (styles.base.color ?? '');

  return (
    <ChipContext.Provider value={{ color: fg, size }}>
      <View
        ref={ref}
        style={[
          styles.base,
          customColors
            ? {
                backgroundColor: customColors.bg,
                borderColor: customColors.border,
                borderWidth: customColors.borderWidth,
              }
            : null,
          style,
        ]}
        {...rest}
      >
        {renderChildren(children)}
      </View>
    </ChipContext.Provider>
  );
});

type ChipComponent = typeof ChipRoot & {
  Icon: typeof ChipIcon;
};

export const Chip = ChipRoot as ChipComponent;
Chip.Icon = ChipIcon;

// ─── Styles ───────────────────────────────────────────────────────────────────

// One compound variant per (color, variant) cell of the spec's token table —
// `variants` below only registers the axis names/options for the type
// system; the actual bg/border/color values all come from `compoundVariants`.
// `size` has no cross-axis interaction, so it's a plain variant.
const styles = StyleSheet.create((theme) => {
  const c = theme.color;

  return {
    base: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      borderRadius: theme.radius.full,
      variants: {
        size: {
          sm: {
            minHeight: 20,
            paddingVertical: 4,
            paddingHorizontal: 8,
            gap: 4,
          },
          md: {
            minHeight: 24,
            paddingVertical: 6,
            paddingHorizontal: 12,
            gap: 4,
          },
          lg: {
            minHeight: 28,
            paddingVertical: 8,
            paddingHorizontal: 16,
            gap: 4,
          },
        },
        color: {
          primary: {},
          secondary: {},
          success: {},
          warning: {},
          danger: {},
        },
        variant: {
          solid: {},
          soft: {},
          outline: {},
          ghost: {},
        },
      },
      compoundVariants: [
        {
          color: 'primary',
          variant: 'solid',
          styles: {
            backgroundColor: c['action.bg.primary'],
            borderColor: c['action.bg.primary'],
            borderWidth: 0,
            color: c['action.fg.primary'],
          },
        },
        {
          color: 'primary',
          variant: 'soft',
          styles: {
            backgroundColor: c['action.bg.primary.subtle'],
            borderColor: c['action.bg.primary.subtle'],
            borderWidth: 0,
            color: c['action.fg.primary.subtle'],
          },
        },
        {
          color: 'primary',
          variant: 'outline',
          styles: {
            backgroundColor: 'transparent',
            borderColor: c['border.accent'],
            borderWidth: 1,
            color: c['text.accent'],
          },
        },
        {
          color: 'secondary',
          variant: 'solid',
          styles: {
            backgroundColor: c['action.bg.secondary'],
            borderColor: c['action.bg.secondary'],
            borderWidth: 0,
            color: c['action.fg.secondary'],
          },
        },
        {
          color: 'secondary',
          variant: 'soft',
          styles: {
            backgroundColor: c['action.bg.secondary.subtle'],
            borderColor: c['action.bg.secondary.subtle'],
            borderWidth: 0,
            color: c['action.fg.secondary.subtle'],
          },
        },
        {
          color: 'secondary',
          variant: 'outline',
          styles: {
            backgroundColor: 'transparent',
            borderColor: c['border.default'],
            borderWidth: 1,
            color: c['text.default'],
          },
        },
        {
          color: 'success',
          variant: 'solid',
          styles: {
            backgroundColor: c['status.bg.success'],
            borderColor: c['status.bg.success'],
            borderWidth: 0,
            color: c['status.fg.success'],
          },
        },
        {
          color: 'success',
          variant: 'soft',
          styles: {
            backgroundColor: c['status.bg.success.subtle'],
            borderColor: c['status.bg.success.subtle'],
            borderWidth: 0,
            color: c['status.fg.success.subtle'],
          },
        },
        {
          color: 'success',
          variant: 'outline',
          styles: {
            backgroundColor: 'transparent',
            borderColor: c['status.border.success'],
            borderWidth: 1,
            color: c['status.fg.success.subtle'],
          },
        },
        {
          color: 'warning',
          variant: 'solid',
          styles: {
            backgroundColor: c['status.bg.warning'],
            borderColor: c['status.bg.warning'],
            borderWidth: 0,
            color: c['status.fg.warning'],
          },
        },
        {
          color: 'warning',
          variant: 'soft',
          styles: {
            backgroundColor: c['status.bg.warning.subtle'],
            borderColor: c['status.bg.warning.subtle'],
            borderWidth: 0,
            color: c['status.fg.warning.subtle'],
          },
        },
        {
          color: 'warning',
          variant: 'outline',
          styles: {
            backgroundColor: 'transparent',
            borderColor: c['status.border.warning'],
            borderWidth: 1,
            color: c['status.fg.warning.subtle'],
          },
        },
        {
          color: 'danger',
          variant: 'solid',
          styles: {
            backgroundColor: c['status.bg.danger'],
            borderColor: c['status.bg.danger'],
            borderWidth: 0,
            color: c['status.fg.danger'],
          },
        },
        {
          color: 'danger',
          variant: 'soft',
          styles: {
            backgroundColor: c['status.bg.danger.subtle'],
            borderColor: c['status.bg.danger.subtle'],
            borderWidth: 0,
            color: c['status.fg.danger.subtle'],
          },
        },
        {
          color: 'danger',
          variant: 'outline',
          styles: {
            backgroundColor: 'transparent',
            borderColor: c['status.border.danger'],
            borderWidth: 1,
            color: c['status.fg.danger.subtle'],
          },
        },
        // `ghost` has no `color` condition — it matches (and ignores color)
        // for every scheme, per the spec.
        {
          variant: 'ghost',
          styles: {
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            borderWidth: 0,
            color: c['text.default'],
          },
        },
      ],
    },
  };
});
