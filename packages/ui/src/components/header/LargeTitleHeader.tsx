import { useEffect, useId } from 'react';
import { Text, View } from 'react-native';

import Animated, {
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { FONT_WEIGHT_VALUE } from '#utils/typography';

import { usePortal } from '../portal';
import { useScreen } from '../screen/ScreenContext';
import type { TitleHeaderProps } from './TitleHeader';

const AnimatedText = Animated.createAnimatedComponent(Text);

export interface LargeTitleHeaderProps extends TitleHeaderProps {
  /** Optional secondary line shown under the large title. */
  caption?: string;
  /** Hide the large title (keeps the compact bar). Defaults to `false`. */
  isLargeTitleHidden?: boolean;
  /**
   * Scroll distance (dp) over which the compact bar title fades in / the large
   * title collapses. Defaults to `60`.
   */
  collapseThreshold?: number;
}

function LargeTitlePortalContent({
  title,
  caption,
}: Pick<LargeTitleHeaderProps, 'title' | 'caption'>) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.portalContent}>
      <Text
        style={styles.largeTitle}
        maxFontSizeMultiplier={
          theme.typography.variants['headline-lg'].maxFontSizeMultiplier
        }
      >
        {title}
      </Text>
      {!!caption && (
        <Text
          style={styles.caption}
          maxFontSizeMultiplier={
            theme.typography.variants['title-sm'].maxFontSizeMultiplier
          }
        >
          {caption}
        </Text>
      )}
    </View>
  );
}

/**
 * iOS-style collapsing large-title header. The large title is injected (via the
 * `Screen`'s portal) into the top of the scroll content, so it scrolls away
 * naturally; the compact bar title cross-fades in as you scroll past
 * `collapseThreshold`.
 *
 * Must be used inside a `Screen` with a `Screen.ScrollView` / `Screen.FlatList`.
 *
 * @example
 * ```tsx
 * <Screen.Header>
 *   <Header.LargeTitle title="Meditate" caption="Good morning" />
 * </Screen.Header>
 * ```
 */
export function LargeTitleHeader({
  title,
  caption,
  LeftComponent,
  RightComponent,
  titleAlignment = 'center',
  headerHeight,
  isLargeTitleHidden = false,
  collapseThreshold = 60,
}: LargeTitleHeaderProps) {
  const { theme } = useUnistyles();
  const { scrollY } = useScreen();
  const { registerContent, unregisterContent } = usePortal();
  const portalId = useId();

  styles.useVariants({ titleAlignment });

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [0, collapseThreshold],
      [0, 1],
      'clamp'
    ),
  }));

  useEffect(() => {
    if (isLargeTitleHidden) {
      unregisterContent(portalId);
      return;
    }

    registerContent(
      portalId,
      <LargeTitlePortalContent title={title} caption={caption} />
    );

    return () => unregisterContent(portalId);
  }, [
    portalId,
    title,
    caption,
    isLargeTitleHidden,
    registerContent,
    unregisterContent,
  ]);

  return (
    <SafeAreaView edges={['top']}>
      <View
        style={[
          styles.bar,
          headerHeight != null && { height: headerHeight },
        ]}
      >
        <View style={styles.slot}>{LeftComponent}</View>
        <Animated.View
          style={[styles.titleContainer, titleAnimatedStyle]}
          pointerEvents="none"
        >
          <AnimatedText
            style={styles.compactTitle}
            maxFontSizeMultiplier={
              theme.typography.variants['title-md'].maxFontSizeMultiplier
            }
          >
            {title}
          </AnimatedText>
        </Animated.View>
        <View style={styles.slotEnd}>{RightComponent}</View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
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
  },
  slotEnd: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  portalContent: {
    marginVertical: theme.spacing['1'],
  },
  largeTitle: {
    fontSize: theme.typography.variants['headline-lg'].fontSize,
    letterSpacing: theme.typography.variants['headline-lg'].letterSpacing,
    fontWeight:
      FONT_WEIGHT_VALUE[theme.typography.variants['headline-lg'].fontWeight],
    color: theme.color.content.primary,
  },
  caption: {
    fontSize: theme.typography.variants['title-sm'].fontSize,
    letterSpacing: theme.typography.variants['title-sm'].letterSpacing,
    fontWeight: FONT_WEIGHT_VALUE.medium,
    color: theme.color.content.tertiary,
  },
  compactTitle: {
    fontSize: theme.typography.variants['title-md'].fontSize,
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
}));
