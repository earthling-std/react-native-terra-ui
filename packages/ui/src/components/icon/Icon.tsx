import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { View, type ViewProps } from 'react-native';

import { useUnistyles } from 'react-native-unistyles';

import { getIcon } from '#theme/configure';
import type { ColorToken, TerraIconName } from '#theme/types';
import { resolveThemeColor } from '#utils/resolve-theme-color';

export interface IconProps extends Omit<ViewProps, 'children'> {
  name: TerraIconName;
  size?: number;
  color?: ColorToken;
  strokeWidth?: number;
}

export const Icon = forwardRef<ComponentRef<typeof View>, IconProps>(
  function Icon(
    { name, size = 20, color = 'content.primary', strokeWidth, style, ...rest },
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
      resolveThemeColor(color, theme) ?? theme.color.content.primary;

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
