import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import type { ColorToken } from '#theme/types';
import { resolveThemeColor } from '#utils/resolve-theme-color';
import { FONT_WEIGHT_VALUE } from '#utils/typography';

import {
  HeaderDismissButton,
  type HeaderDismissProps,
} from './HeaderDismissButton';

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
  const backgroundColor =
    resolveThemeColor(bg, theme) ?? theme.color.surface.base;

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
    <SafeAreaView
      edges={['top']}
      style={[styles.safeArea, { backgroundColor }]}
    >
      <View style={styles.bar}>
        {leading != null && <View style={styles.slot}>{leading}</View>}
        <View style={styles.titleContainer} pointerEvents="none">
          {!!title && <Text style={styles.title}>{title}</Text>}
        </View>
        {trailing != null && <View style={styles.slotEnd}>{trailing}</View>}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  safeArea: {
    zIndex: 1000,
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
