import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { getImageComponent } from '#theme/registry';
import type { RadiusKey } from '#theme/types.js';
import type { ImageProps } from './types';

/**
 * Renders the image implementation configured via
 * `configureTerraUI({ image })` (defaults to React Native's `Image`).
 *
 * @example
 * ```tsx
 * <Image
 *   source={{ uri: 'https://example.com/photo.jpg' }}
 *   contentFit="cover"
 *   style={{ width: 40, height: 40 }}
 * />
 * ```
 */
export function Image({
  contentFit = 'cover',
  width,
  height,
  radius = 'md',
  style,
  ...rest
}: ImageProps) {
  const ImageComponent = getImageComponent();

  return (
    <View style={[styles.container(width, height, radius), style]}>
      <ImageComponent contentFit={contentFit} style={styles.image} {...rest} />
    </View>
  );
}

const styles = StyleSheet.create((_theme) => ({
  container: (w: number | undefined, h: number | undefined, r: RadiusKey) => ({
    ...(w ? { width: w } : {}),
    ...(h ? { height: h } : {}),
    borderRadius: _theme.radius[r],
    overflow: 'hidden',
  }),
  image: {
    width: '100%',
    height: '100%',
  },
}));
