import { useCallback, useEffect, useId } from 'react';
import { type LayoutChangeEvent, Text, View } from 'react-native';

import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, {
  Defs,
  Rect,
  Stop,
  LinearGradient as SvgLinearGradient,
} from 'react-native-svg';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { resolveThemeColor } from '#utils/resolve-theme-color';
import { FONT_WEIGHT_VALUE } from '#utils/typography';

import { usePortal } from '../../../portal';
import { useScreen } from '../../../screen/ScreenContext';
import { HeaderDismissButton } from '../../header-buttons';
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
  onLayout,
}: Pick<LargeTitleHeaderProps, 'title' | 'caption'> & {
  onLayout: (event: LayoutChangeEvent) => void;
}) {
  const { theme } = useUnistyles();
  const { scrollY, headerCollapseHeight } = useScreen();

  const largeTitleAnimatedStyle = useAnimatedStyle(() => {
    const height = headerCollapseHeight.value;
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
    <Animated.View
      style={[styles.portalContent, largeTitleAnimatedStyle]}
      onLayout={onLayout}
    >
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
  const { top } = useSafeAreaInsets();
  const gradientId = useId();
  const bgColor =
    resolveThemeColor(bg, theme) ??
    (theme.color as unknown as Record<string, string | undefined>)[
      'surface.default'
    ] ??
    '';
  const isTransparent = bgColor === 'transparent';
  const gradientColor = isTransparent ? theme.color.background : bgColor;
  const { scrollY, headerCollapseHeight, setHeaderCollapseHeight } =
    useScreen();
  const { registerContent, unregisterContent } = usePortal();
  const portalId = useId();
  const isLargeTitleHiddenValue = useSharedValue(isLargeTitleHidden);

  styles.useVariants({ titleAlignment });

  const handlePortalLayout = useCallback(
    (event: LayoutChangeEvent) => {
      setHeaderCollapseHeight(event.nativeEvent.layout.height);
    },
    [setHeaderCollapseHeight]
  );

  // Animate the gradient overlay's opacity: 0 (expanded) → 1 (collapsed).
  const gradientOpacityStyle = useAnimatedStyle(() => {
    if (isLargeTitleHiddenValue.value) {
      return { opacity: 1 };
    }
    const height = headerCollapseHeight.value;
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

    const height = headerCollapseHeight.value;
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

  useEffect(() => {
    if (isLargeTitleHidden) {
      setHeaderCollapseHeight(0);
      unregisterContent(portalId);
      return;
    }

    setHeaderCollapseHeight(0);

    registerContent(
      portalId,
      <LargeTitlePortalContent
        title={title}
        caption={caption}
        onLayout={handlePortalLayout}
      />
    );

    return () => unregisterContent(portalId);
  }, [
    portalId,
    title,
    caption,
    isLargeTitleHidden,
    setHeaderCollapseHeight,
    handlePortalLayout,
    registerContent,
    unregisterContent,
  ]);

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
      <Animated.View
        style={[
          { height: top, backgroundColor: gradientColor },
          gradientOpacityStyle,
        ]}
      />
      <View style={styles.bar}>
        <Animated.View
          style={[styles.gradient, gradientOpacityStyle]}
          pointerEvents="none"
        >
          <Svg height="100%" width="100%">
            <Defs>
              <SvgLinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={gradientColor} stopOpacity="1" />
                <Stop offset="1" stopColor={gradientColor} stopOpacity="0" />
              </SvgLinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill={`url(#${gradientId})`} />
          </Svg>
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
  portalContent: {
    marginTop: theme.spacing['1'],
    marginBottom: theme.spacing['3'],
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
