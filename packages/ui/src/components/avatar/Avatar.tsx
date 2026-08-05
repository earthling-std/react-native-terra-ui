import { useState } from 'react';
import { Text, View } from 'react-native';

import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import type { RadiusKey } from '#theme/types';

import { Icon } from '../icon';
import { Image } from '../image';
import type { AvatarProps, AvatarShape, AvatarSize } from './types';

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

// `Image` clips its own content to a `RadiusKey` theme token, independent of
// Avatar's own container radius — this keeps the two in sync per `shape`.
// `'full'` (theme.radius.full) clamps to a circle at any size, same as the
// container's computed `sizePx / 2`.
function getImageRadius(shape: AvatarShape): RadiusKey {
  if (shape === 'circle') return 'full';
  if (shape === 'rounded') return 'md';
  return 'none';
}

export function Avatar({
  size = 'md',
  shape = 'circle',
  source,
  name,
  fallback,
  contentFit = 'cover',
  color = 'secondary',
  variant = 'solid',
  style,
  ...rest
}: AvatarProps) {
  const { theme } = useUnistyles();
  const [hasError, setHasError] = useState(false);
  styles.useVariants({ color, variant });

  const sizePx = SIZE_PX[size];
  const borderRadius = getBorderRadius(shape, sizePx, theme.radius.md);
  const showFallback = !source || hasError;

  const bg = styles.base.backgroundColor ?? '';
  const fg = styles.base.color ?? '';

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
      <Icon name="person" size={sizePx} color={fg} />
    );

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
        <Image
          source={source}
          style={{ width: sizePx, height: sizePx }}
          radius={getImageRadius(shape)}
          contentFit={contentFit}
          accessibilityLabel={name}
          onError={() => setHasError(true)}
        />
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

// One compound variant per (color, variant) cell of the spec's token table —
// `variants` below only registers the axis names/options for the type
// system; the actual bg/fg values all come from `compoundVariants`.
const styles = StyleSheet.create((theme) => {
  const c = theme.color;

  return {
    base: {
      variants: {
        color: {
          secondary: {},
          primary: {},
          success: {},
          warning: {},
          danger: {},
        },
        variant: {
          solid: {},
          soft: {},
        },
      },
      compoundVariants: [
        {
          color: 'secondary',
          variant: 'solid',
          styles: {
            backgroundColor: c['action.bg.secondary'],
            color: c['action.fg.secondary'],
          },
        },
        {
          color: 'secondary',
          variant: 'soft',
          styles: {
            backgroundColor: c['action.bg.secondary.subtle'],
            color: c['action.fg.secondary.subtle'],
          },
        },
        {
          color: 'primary',
          variant: 'solid',
          styles: {
            backgroundColor: c['action.bg.primary'],
            color: c['action.fg.primary'],
          },
        },
        {
          color: 'primary',
          variant: 'soft',
          styles: {
            backgroundColor: c['action.bg.primary.subtle'],
            color: c['action.fg.primary.subtle'],
          },
        },
        {
          color: 'success',
          variant: 'solid',
          styles: {
            backgroundColor: c['status.bg.success'],
            color: c['status.fg.success'],
          },
        },
        {
          color: 'success',
          variant: 'soft',
          styles: {
            backgroundColor: c['status.bg.success.subtle'],
            color: c['status.fg.success.subtle'],
          },
        },
        {
          color: 'warning',
          variant: 'solid',
          styles: {
            backgroundColor: c['status.bg.warning'],
            color: c['status.fg.warning'],
          },
        },
        {
          color: 'warning',
          variant: 'soft',
          styles: {
            backgroundColor: c['status.bg.warning.subtle'],
            color: c['status.fg.warning.subtle'],
          },
        },
        {
          color: 'danger',
          variant: 'solid',
          styles: {
            backgroundColor: c['status.bg.danger'],
            color: c['status.fg.danger'],
          },
        },
        {
          color: 'danger',
          variant: 'soft',
          styles: {
            backgroundColor: c['status.bg.danger.subtle'],
            color: c['status.fg.danger.subtle'],
          },
        },
      ],
    },
  };
});
