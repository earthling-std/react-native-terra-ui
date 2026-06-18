import { type ComponentRef, forwardRef } from 'react';
import type { View } from 'react-native';

import { Box, type BoxProps } from './Box';

export interface StackProps extends BoxProps {
  /** Layout direction. Defaults to `column`. */
  direction?: 'row' | 'column';
}

type Ref = ComponentRef<typeof View>;

/**
 * A `Box` that lays children out along a direction (default column).
 *
 * @example
 * ```tsx
 * <Stack gap="4" p="4">
 *   <Text>One</Text>
 *   <Text>Two</Text>
 * </Stack>
 * ```
 */
export const Stack = forwardRef<Ref, StackProps>(function Stack(
  { direction = 'column', ...rest },
  ref
) {
  return <Box ref={ref} direction={direction} {...rest} />;
});

/** Horizontal `Stack` (`direction="row"`). */
export const HStack = forwardRef<Ref, Omit<StackProps, 'direction'>>(
  function HStack(props, ref) {
    return <Stack ref={ref} direction="row" {...props} />;
  }
);

/** Vertical `Stack` (`direction="column"`). */
export const VStack = forwardRef<Ref, Omit<StackProps, 'direction'>>(
  function VStack(props, ref) {
    return <Stack ref={ref} direction="column" {...props} />;
  }
);
