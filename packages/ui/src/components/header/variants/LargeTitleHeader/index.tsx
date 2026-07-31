import { useEffect } from 'react';
import { Text, View } from 'react-native';

import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { resolveThemeColor } from '#utils/resolve-theme-color';
import { FONT_WEIGHT_VALUE } from '#utils/typography';

import { Portal } from '../../../portal';
import {
  SCREEN_HEADER_PORTAL_HOST,
  useScreen,
} from '../../../screen/ScreenContext';
import { HeaderDismissButton } from '../../header-buttons';
import { HeaderGradientOverlay } from '../../parts/HeaderGradientOverlay';
import type { TitleHeaderProps } from '../TitleHeader';

const AnimatedText = Animated.createAnimatedComponent(Text);

/** Compact title offset (px) when the large title is fully expanded. */
const COMPACT_TITLE_SLIDE_OFFSET = 8;
/** Large title offset (px) when fully collapsed. */
const LARGE_TITLE_SLIDE_OFFSET = 6;

export interface LargeTitleHeaderProps extends TitleHeaderProps {
  /** Optional secondary line shown under the large title. */
  caption?: string;
  /** Hide the large title (keeps the compact bar). Defaults to `false`. */
  isLargeTitleHidden?: boolean;
}

function LargeTitlePortalContent({
  title,
  caption,
  titleAlignment = 'center',
}: Pick<LargeTitleHeaderProps, 'title' | 'caption' | 'titleAlignment'>) {
  const { theme } = useUnistyles();
  const { scrollY } = useScreen();
  styles.useVariants({ titleAlignment });

  const largeTitleAnimatedStyle = useAnimatedStyle(() => {
    const height = theme.layout.header.height;
    if (height <= 0) {
      return { opacity: 1, transform: [{ translateY: 0 }] };
    }

    return {
      opacity: interpolate(scrollY.value, [0, height], [1, 0], 'clamp'),
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, height],
            [0, -LARGE_TITLE_SLIDE_OFFSET],
            'clamp'
          ),
        },
      ],
    };
  });

  return (
    <Animated.View style={[styles.portalContent, largeTitleAnimatedStyle]}>
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
            theme.typography.variants['body-lg'].maxFontSizeMultiplier
          }
        >
          {caption}
        </Text>
      )}
    </Animated.View>
  );
}

/**
 * iOS-style collapsing large-title header. The large title is injected (via the
 * `Screen`'s portal) into the top of the scroll content, so it scrolls away
 * naturally; the compact bar title cross-fades and slides in over the measured
 * portal height. Native scroll snap (`snapToOffsets`) settles between expanded
 * and collapsed when released mid-collapse.
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
  dismissAction = 'none',
  navigation,
  onDismiss,
  titleAlignment = 'center',
  isLargeTitleHidden = false,
  bg = 'surface.default',
}: LargeTitleHeaderProps) {
  const { theme } = useUnistyles();

  const bgColor =
    resolveThemeColor(bg, theme) ??
    (theme.color as unknown as Record<string, string | undefined>)[
      'surface.default'
    ] ??
    '';

  const isTransparent = bgColor === 'transparent';
  const gradientColor = isTransparent ? theme.color.background : bgColor;
  const { scrollY } = useScreen();
  const isLargeTitleHiddenValue = useSharedValue(isLargeTitleHidden);
  const headerCollapseHeight = theme.layout.header.height;
  styles.useVariants({ titleAlignment });

  // Animate the gradient overlay's opacity: 0 (expanded) → 1 (collapsed).
  const gradientOpacityStyle = useAnimatedStyle(() => {
    if (isLargeTitleHiddenValue.value) {
      return { opacity: 1 };
    }
    const height = headerCollapseHeight;
    if (height <= 0) {
      return { opacity: 0 };
    }
    return {
      opacity: interpolate(scrollY.value, [0, height], [0, 1], 'clamp'),
    };
  });

  const compactTitleAnimatedStyle = useAnimatedStyle(() => {
    if (isLargeTitleHiddenValue.value) {
      return { opacity: 1, transform: [{ translateY: 0 }] };
    }

    const height = headerCollapseHeight;
    if (height <= 0) {
      return {
        opacity: 0,
        transform: [{ translateY: COMPACT_TITLE_SLIDE_OFFSET }],
      };
    }

    return {
      opacity: interpolate(scrollY.value, [0, height], [0, 1], 'clamp'),
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, height],
            [COMPACT_TITLE_SLIDE_OFFSET, 0],
            'clamp'
          ),
        },
      ],
    };
  });

  useEffect(() => {
    isLargeTitleHiddenValue.value = isLargeTitleHidden;
  }, [isLargeTitleHidden, isLargeTitleHiddenValue]);

  // // biome-ignore lint/correctness/useExhaustiveDependencies: reset stale collapse height whenever content that resizes the portal (title/caption/visibility) changes, ahead of remeasurement
  // useEffect(() => {
  //   setHeaderCollapseHeight(0);
  // }, [title, caption, isLargeTitleHidden, setHeaderCollapseHeight]);

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
    <View style={styles.container}>
      {!isLargeTitleHidden && (
        <Portal hostName={SCREEN_HEADER_PORTAL_HOST}>
          <LargeTitlePortalContent
            title={title}
            caption={caption}
            titleAlignment={titleAlignment}
          />
        </Portal>
      )}
      <Animated.View
        style={[styles.safeArea(gradientColor), gradientOpacityStyle]}
      />
      <View style={styles.bar}>
        <Animated.View
          style={[styles.gradient, gradientOpacityStyle]}
          pointerEvents="none"
        >
          <HeaderGradientOverlay color={gradientColor} />
        </Animated.View>
        {leading != null && <View style={styles.slot}>{leading}</View>}
        <Animated.View
          style={[styles.titleContainer, compactTitleAnimatedStyle]}
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
        {trailing != null && <View style={styles.slotEnd}>{trailing}</View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme, runtime) => ({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  safeArea: (bgColor) => ({
    height: runtime.insets.top,
    backgroundColor: bgColor,
  }),
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
    paddingHorizontal: theme.layout.screen.margin.x,
    gap: theme.spacing['3'],
    justifyContent: 'space-between',
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
  portalContent: {
    minHeight: theme.layout.header.height,
    paddingTop: theme.spacing['1'],
    paddingBottom: theme.spacing['3'],
    paddingHorizontal: theme.layout.screen.margin.x,
  },
  largeTitle: {
    fontSize: theme.typography.variants['headline-lg'].fontSize,
    lineHeight: theme.typography.variants['headline-lg'].lineHeight,
    letterSpacing: theme.typography.variants['headline-lg'].letterSpacing,
    fontWeight:
      FONT_WEIGHT_VALUE[theme.typography.variants['headline-lg'].fontWeight],
    color:
      (theme.color as unknown as Record<string, string | undefined>)[
        'text.default'
      ] ?? '',
  },
  caption: {
    fontSize: theme.typography.variants['body-lg'].fontSize,
    lineHeight: theme.typography.variants['body-lg'].lineHeight,
    letterSpacing: theme.typography.variants['body-lg'].letterSpacing,
    color:
      (theme.color as unknown as Record<string, string | undefined>)[
        'text.subtle'
      ] ?? '',
    variants: {
      titleAlignment: {
        center: { textAlign: 'center' },
        left: { textAlign: 'left' },
      },
    },
  },
  compactTitle: {
    fontSize: theme.typography.variants['title-md'].fontSize,
    lineHeight: theme.typography.variants['title-md'].lineHeight,
    letterSpacing: theme.typography.variants['title-md'].letterSpacing,
    fontWeight:
      FONT_WEIGHT_VALUE[theme.typography.variants['title-md'].fontWeight],
    color:
      (theme.color as unknown as Record<string, string | undefined>)[
        'text.default'
      ] ?? '',
    variants: {
      titleAlignment: {
        center: { textAlign: 'center' },
        left: { textAlign: 'left' },
      },
    },
  },
  titleContainer: {
    flex: 1,
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
