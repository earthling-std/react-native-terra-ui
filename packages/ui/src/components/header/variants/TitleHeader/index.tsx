import { type ReactNode, useId } from 'react';
import { Text, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, {
  Defs,
  Rect,
  Stop,
  LinearGradient as SvgLinearGradient,
} from 'react-native-svg';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import type { ColorToken } from '#theme/types';
import { resolveThemeColor } from '#utils/resolve-theme-color';
import { FONT_WEIGHT_VALUE } from '#utils/typography';

import {
  HeaderDismissButton,
  type HeaderDismissProps,
} from '../../header-buttons';

export interface TitleHeaderProps extends HeaderDismissProps {
  title?: string;
  /** Content on the leading side (e.g. a back button). */
  LeftComponent?: ReactNode;
  /** Content on the trailing side (e.g. an action). */
  RightComponent?: ReactNode;
  /** Title placement within the bar. Defaults to `'center'`. */
  titleAlignment?: 'center' | 'left';
  /** Background color token. Defaults to `surface.base`. */
  bg?: ColorToken;
}

/**
 * Compact title bar (leading slot · title · trailing slot) with a top safe-area
 * inset. The inline counterpart to `Header.LargeTitle`; use it for screens that
 * don't need a collapsing large title.
 *
 * @example
 * ```tsx
 * <Screen.Header>
 *   <Header.Title title="Stats" RightComponent={<Button>Edit</Button>} />
 * </Screen.Header>
 * ```
 */
export function TitleHeader({
  title,
  LeftComponent,
  RightComponent,
  dismissAction = 'none',
  navigation,
  onDismiss,
  titleAlignment = 'center',
  bg = 'surface.base',
}: TitleHeaderProps) {
  const { theme } = useUnistyles();
  const { top } = useSafeAreaInsets();
  const gradientId = useId();
  const bgColor = resolveThemeColor(bg, theme) as string;
  const isTransparent = bgColor === 'transparent';
  const gradientColor = isTransparent ? theme.color.background : bgColor;

  styles.useVariants({ titleAlignment });

  const leading =
    dismissAction === 'back' ? (
      <>
        <HeaderDismissButton
          dismissAction={dismissAction}
          navigation={navigation}
          onDismiss={onDismiss}
        />
        {LeftComponent}
      </>
    ) : (
      LeftComponent
    );

  const trailing =
    dismissAction === 'close' ? (
      <>
        {RightComponent}
        <HeaderDismissButton
          dismissAction={dismissAction}
          navigation={navigation}
          onDismiss={onDismiss}
        />
      </>
    ) : (
      RightComponent
    );
  return (
    <View style={styles.safeArea}>
      <View
        style={{
          height: top,
          backgroundColor: isTransparent ? 'transparent' : bgColor,
        }}
      />
      <View style={styles.bar}>
        <View style={styles.gradient} pointerEvents="none">
          <Svg height="100%" width="100%">
            <Defs>
              <SvgLinearGradient id={gradientId} x1="0" y1="0.4" x2="0" y2="1">
                <Stop offset="0" stopColor={gradientColor} stopOpacity="0.9" />
                <Stop offset="1" stopColor={gradientColor} stopOpacity="0.2" />
              </SvgLinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill={`url(#${gradientId})`} />
          </Svg>
        </View>
        {leading != null && <View style={styles.slot}>{leading}</View>}
        <View style={styles.titleContainer} pointerEvents="none">
          {!!title && <Text style={styles.title}>{title}</Text>}
        </View>
        {trailing != null && <View style={styles.slotEnd}>{trailing}</View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  safeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bar: {
    height: theme.layout.header.height,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.layout.screen.margin.x,
    gap: theme.spacing['3'],
  },
  slot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing['2'],
  },
  slotEnd: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: theme.spacing['2'],
  },
  titleContainer: {
    variants: {
      titleAlignment: {
        center: {
          position: 'absolute',
          left: 0,
          right: 0,
          alignItems: 'center',
        },
        left: {
          flex: 1,
          alignItems: 'flex-start',
        },
      },
    },
  },
  title: {
    fontSize: theme.typography.variants['title-md'].fontSize,
    lineHeight: theme.typography.variants['title-md'].lineHeight,
    letterSpacing: theme.typography.variants['title-md'].letterSpacing,
    fontWeight:
      FONT_WEIGHT_VALUE[theme.typography.variants['title-md'].fontWeight],
    color: theme.color.content.primary,
    variants: {
      titleAlignment: {
        center: { textAlign: 'center' },
        left: { textAlign: 'left' },
      },
    },
  },
}));
