import {
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';

import { composeRefs, mergeProps } from './utils';

type AnyProps = Record<string, unknown>;

export interface SlotProps {
  /** Props (incl. pre-merged `style` and optional `ref`) to merge onto the child. */
  slotProps: AnyProps;
  /** Name used in dev warnings. */
  ownerName?: string;
  children: ReactNode;
}

/**
 * Radix-style Slot: merges `slotProps` onto a single child element instead of
 * rendering a wrapper. Composes `on*` handlers (child first), `style`
 * (`[slotStyle, childStyle]`), and refs.
 */
export function Slot({
  slotProps,
  ownerName = 'Component',
  children,
}: SlotProps): ReactElement | null {
  if (!isValidElement(children)) {
    if (__DEV__ && children != null) {
      console.error(
        `[${ownerName}] \`asChild\` expects exactly one React element child.`
      );
    }
    return null;
  }

  const child = children as ReactElement;
  const childProps = (child.props ?? {}) as AnyProps;

  const { ref: slotRef, ...restSlotProps } = slotProps;
  const { ref: childRef, ...restChildProps } = childProps;

  const merged = mergeProps(restSlotProps, restChildProps);
  const composedRef = composeRefs(
    slotRef as Ref<unknown> | undefined,
    childRef as Ref<unknown> | undefined
  );

  return cloneElement(child, {
    ...merged,
    ref: composedRef,
  } as Partial<unknown> & AnyProps);
}
