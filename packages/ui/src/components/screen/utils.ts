import {
  type ComponentType,
  createElement,
  isValidElement,
  type ReactElement,
} from 'react';

export type ListHeaderComponent =
  | ComponentType
  | ReactElement
  | null
  | undefined;

/** Renders a `ListHeaderComponent`-shaped prop (element, component, or nullish) into an element. */
export function renderListHeader(
  ListHeaderComponent: ListHeaderComponent
): ReactElement | null {
  if (!ListHeaderComponent) return null;
  if (isValidElement(ListHeaderComponent)) return ListHeaderComponent;
  return createElement(ListHeaderComponent);
}
