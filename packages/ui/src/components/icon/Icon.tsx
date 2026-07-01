import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { View, type ViewProps } from 'react-native';

import { useUnistyles } from 'react-native-unistyles';

import { getIcon } from '#theme/configure';
import type { ColorToken, TerraIconName } from '#theme/types';
import { resolveThemeColor } from '#utils/resolve-theme-color';

export interface IconProps extends Omit<ViewProps, 'children'> {
  /** Semantic or configured icon name from the theme registry. */
  name: TerraIconName;
  /** Icon size in density-independent pixels. Defaults to `20`. */
  size?: number;
  /** Theme color token or raw CSS color. Defaults to `text.default`. */
  color?: ColorToken;
  strokeWidth?: number;
}

/**
 * Renders an icon from the Terra UI icon registry (`configureTerraUI({ icons })`
 * plus built-in semantic names like `navigation.back`).
 *
 * @example
 * ```tsx
 * <Icon name="navigation.close" size={24} color="text.default" />
 * ```
 */
export const Icon = forwardRef<ComponentRef<typeof View>, IconProps>(
  function Icon(
    { name, size = 20, color = 'text.default', strokeWidth, style, ...rest },
    ref
  ) {
    const { theme } = useUnistyles();
    const IconComponent = getIcon(name);

    if (!IconComponent) {
      if (__DEV__) {
        console.warn(`[react-native-terra-ui] Unknown icon "${name}".`);
      }
      return null;
    }

    const resolvedColor =
      resolveThemeColor(color, theme) ??
      (theme.color as unknown as Record<string, string | undefined>)['text.default'] ??
      '';

    return (
      <View
        ref={ref}
        style={[
          {
            width: size,
            height: size,
            alignItems: 'center',
            justifyContent: 'center',
          },
          style,
        ]}
        {...rest}
      >
        <IconComponent
          color={resolvedColor}
          size={size}
          strokeWidth={strokeWidth}
        />
      </View>
    );
  }
);
