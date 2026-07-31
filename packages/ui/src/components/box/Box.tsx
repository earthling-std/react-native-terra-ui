import { type ComponentRef, forwardRef } from 'react';
import { View, type ViewProps } from 'react-native';

import { useUnistyles } from 'react-native-unistyles';

import { Slot } from '../slot';
import {
  BOX_STYLE_PROP_KEYS,
  type BoxStyleProps,
  resolveBoxStyle,
} from './utils';

export interface BoxProps extends ViewProps, BoxStyleProps {
  /** Merge Box's style/props onto a single child instead of rendering a View. */
  asChild?: boolean;
}

const STYLE_KEYS = new Set<string>(BOX_STYLE_PROP_KEYS as readonly string[]);

/**
 * Base layout primitive: a `View` styled through theme-token props.
 * The only component family exposing token style-props.
 */
export const Box = forwardRef<ComponentRef<typeof View>, BoxProps>(function Box(
  { asChild, style, children, ...rest },
  ref
) {
  const { theme } = useUnistyles();

  const styleProps: Record<string, unknown> = {};
  const viewProps: Record<string, unknown> = {};
  for (const key of Object.keys(rest)) {
    const value = (rest as Record<string, unknown>)[key];
    if (STYLE_KEYS.has(key)) styleProps[key] = value;
    else viewProps[key] = value;
  }

  const mergedStyle = [
    resolveBoxStyle(styleProps as BoxStyleProps, theme),
    style,
  ];

  if (asChild) {
    return (
      <Slot
        ownerName="Box"
        slotProps={{ ...viewProps, style: mergedStyle, ref }}
      >
        {children}
      </Slot>
    );
  }

  return (
    <View ref={ref} style={mergedStyle} {...(viewProps as ViewProps)}>
      {children}
    </View>
  );
});
