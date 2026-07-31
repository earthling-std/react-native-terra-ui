import type { MutableRefObject, Ref } from 'react';

function assignRef<T>(ref: Ref<T> | undefined, value: T | null): void {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref != null) {
    (ref as MutableRefObject<T | null>).current = value;
  }
}

/** Composes multiple refs so each receives the node. */
export function composeRefs<T>(...refs: (Ref<T> | undefined)[]): Ref<T> {
  return (node: T | null) => {
    for (const ref of refs) {
      assignRef(ref, node);
    }
  };
}

type AnyProps = Record<string, unknown>;

const isEventHandler = (key: string): boolean => /^on[A-Z]/.test(key);

/**
 * Merges slot props with the child's own props (child wins), following the
 * Radix Slot rules:
 * - `on*` handlers are composed (child runs first, then slot),
 * - `style` is merged as `[slotStyle, childStyle]`,
 * - all other child props override slot props.
 *
 * `ref`/`style` are intentionally not handled here — the caller composes refs
 * and passes a pre-merged `style` via `slotProps`.
 */
export function mergeProps(
  slotProps: AnyProps,
  childProps: AnyProps
): AnyProps {
  const merged: AnyProps = { ...slotProps };

  for (const key of Object.keys(childProps)) {
    const slotValue = slotProps[key];
    const childValue = childProps[key];

    if (isEventHandler(key)) {
      if (typeof slotValue === 'function' && typeof childValue === 'function') {
        merged[key] = (...args: unknown[]) => {
          (childValue as (...a: unknown[]) => void)(...args);
          (slotValue as (...a: unknown[]) => void)(...args);
        };
      } else {
        merged[key] = childValue ?? slotValue;
      }
    } else if (key === 'style') {
      merged.style = [slotValue, childValue].filter(Boolean);
    } else {
      merged[key] = childValue;
    }
  }

  return merged;
}
