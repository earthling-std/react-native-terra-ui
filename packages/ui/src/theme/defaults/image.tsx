import { createElement } from 'react';
import { Image } from 'react-native';

import type { TerraImageComponent, TerraImageContentFit } from '../types';

const CONTENT_FIT_MAP = {
  cover: 'cover',
  contain: 'contain',
  fill: 'stretch',
} as const satisfies Record<
  TerraImageContentFit,
  'cover' | 'contain' | 'stretch'
>;

/** Default image implementation, backed by React Native's `Image`. */
export const defaultImage: TerraImageComponent = ({
  contentFit = 'cover',
  source,
  style,
  accessibilityLabel,
  placeholder,
  onError,
}) =>
  createElement(Image, {
    source,
    style,
    accessibilityLabel,
    // RN splits "show this until loaded" across two platform-specific props:
    // `defaultSource` (iOS only) and `loadingIndicatorSource` (Android only).
    defaultSource: placeholder,
    loadingIndicatorSource: placeholder,
    resizeMode: CONTENT_FIT_MAP[contentFit],
    onError: onError ? () => onError() : undefined,
  });
