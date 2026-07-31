import type { ReactNode } from 'react';
import type { ViewProps } from 'react-native';

import type { TerraImageContentFit } from '#theme/types';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'rounded' | 'square';
/** Semantic color scheme for the fallback state (initials / placeholder icon). */
export type AvatarColor =
  | 'default'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger';
/** Visual weight of the fallback background. */
export type AvatarVariant = 'default' | 'soft';

export interface AvatarProps extends ViewProps {
  /** Predefined size token. Defaults to `'md'`. */
  size?: AvatarSize;
  /** Corner shape. Defaults to `'circle'`. */
  shape?: AvatarShape;
  /** Remote URL or local asset. When omitted or on load error, the fallback is shown. */
  source?: { uri: string } | number;
  /** Used to derive initials when no `source` or `fallback` is provided. */
  name?: string;
  /** Custom fallback content — takes priority over initials and the built-in placeholder. */
  fallback?: ReactNode;
  /** How the image fills its container. Defaults to `'cover'`. */
  contentFit?: TerraImageContentFit;
  /** Fallback color theme. Defaults to `'default'`. */
  color?: AvatarColor;
  /** Visual style variant. Defaults to `'default'`. */
  variant?: AvatarVariant;
}
