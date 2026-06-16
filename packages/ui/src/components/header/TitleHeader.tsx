import type { ReactNode } from 'react';
import { View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';

import { Text } from '../text';

export interface TitleHeaderProps {
  title?: string;
  /** Content on the leading side (e.g. a back button). */
  LeftComponent?: ReactNode;
  /** Content on the trailing side (e.g. an action). */
  RightComponent?: ReactNode;
  /** Title placement within the bar. Defaults to `'center'`. */
  titleAlignment?: 'center' | 'left';
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
  titleAlignment = 'center',
}: TitleHeaderProps) {
  styles.useVariants({ titleAlignment });

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.bar}>
        {LeftComponent != null && (
          <View style={styles.slot}>{LeftComponent}</View>
        )}
        <View style={styles.titleContainer} pointerEvents="none">
          {!!title && (
            <Text variant="title-md" align={titleAlignment}>
              {title}
            </Text>
          )}
        </View>
        {RightComponent != null && (
          <View style={styles.slotEnd}>{RightComponent}</View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  safeArea: {
    zIndex: 1000,
    backgroundColor: theme.color.surface.base,
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
  },
  slotEnd: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
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
