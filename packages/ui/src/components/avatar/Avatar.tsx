import { useState } from 'react';
import { Text, View } from 'react-native';

import { useUnistyles } from 'react-native-unistyles';

import { getImageComponent } from '#theme/configure';
import type { TerraTheme } from '#theme/types';

import { PersonIcon } from './parts/PersonIcon';
import type {
  AvatarColor,
  AvatarProps,
  AvatarShape,
  AvatarSize,
  AvatarVariant,
} from './types';

const SIZE_PX: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

const INITIALS_FONT_SIZE: Record<AvatarSize, number> = {
  xs: 9,
  sm: 12,
  md: 15,
  lg: 18,
  xl: 24,
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return (first + last).toUpperCase();
}

function getBorderRadius(
  shape: AvatarShape,
  sizePx: number,
  radiusMd: number
): number {
  if (shape === 'circle') return sizePx / 2;
  if (shape === 'rounded') return radiusMd;
  return 0;
}

function resolveAvatarColors(
  color: AvatarColor,
  variant: AvatarVariant,
  theme: TerraTheme
): { bg: string; fg: string } {
  const c = theme.color;
  const get = (key: string): string =>
    (c as unknown as Record<string, string | undefined>)[key] ?? '';
  if (color === 'default') {
    return { bg: c['surface.sunken'], fg: c['text.muted'] };
  }
  if (color === 'accent') {
    return variant === 'soft'
      ? { bg: c['action.bg.subtle'], fg: c['action.fg.subtle'] }
      : { bg: c['action.bg.primary'], fg: c['action.fg.primary'] };
  }
  return variant === 'soft'
    ? {
        bg: get(`status.bg.${color}.subtle`),
        fg: get(`status.fg.${color}.subtle`),
      }
    : { bg: get(`status.bg.${color}`), fg: get(`status.fg.${color}`) };
}

export function Avatar({
  size = 'md',
  shape = 'circle',
  source,
  name,
  fallback,
  contentFit = 'cover',
  color = 'default',
  variant = 'default',
  style,
  ...rest
}: AvatarProps) {
  const { theme } = useUnistyles();
  const [hasError, setHasError] = useState(false);

  const sizePx = SIZE_PX[size];
  const borderRadius = getBorderRadius(shape, sizePx, theme.radius.md);
  const showFallback = !source || hasError;

  const { bg, fg } = resolveAvatarColors(color, variant, theme);

  const fallbackContent =
    fallback !== undefined ? (
      fallback
    ) : name ? (
      <Text
        style={{
          fontSize: INITIALS_FONT_SIZE[size],
          fontWeight: '600',
          color: fg,
          includeFontPadding: false,
        }}
        numberOfLines={1}
      >
        {getInitials(name)}
      </Text>
    ) : (
      <PersonIcon size={sizePx} color={fg} />
    );

  const ImageComponent = getImageComponent();

  return (
    <View
      {...rest}
      style={[
        {
          width: sizePx,
          height: sizePx,
          borderRadius,
          backgroundColor: bg,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        },
        style,
      ]}
    >
      {showFallback ? (
        fallbackContent
      ) : (
        <ImageComponent
          source={source}
          style={{ width: sizePx, height: sizePx }}
          contentFit={contentFit}
          accessibilityLabel={name}
          onError={() => setHasError(true)}
        />
      )}
    </View>
  );
}
