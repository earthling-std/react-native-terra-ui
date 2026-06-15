import type { ReactNode } from 'react';
import { type StyleProp, View, type ViewStyle } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useUnistyles } from 'react-native-unistyles';

import { Text } from '../text';

export interface TitleHeaderProps {
  title?: string;
  /** Content on the leading side (e.g. a back button). */
  LeftComponent?: ReactNode;
  /** Content on the trailing side (e.g. an action). */
  RightComponent?: ReactNode;
  /** Title placement within the bar. Defaults to `'center'`. */
  titleAlignment?: 'center' | 'left';
  /** Bar height. Defaults to the `layout.header.height` token. */
  headerHeight?: number;
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
  headerHeight,
}: TitleHeaderProps) {
  const { theme } = useUnistyles();
  const height = headerHeight ?? theme.layout.header.height;

  const titleContainerStyle: StyleProp<ViewStyle> =
    titleAlignment === 'center'
      ? {
          position: 'absolute',
          left: 0,
          right: 0,
          alignItems: 'center',
        }
      : { flex: 1, alignItems: 'flex-start' };

  return (
    <SafeAreaView edges={['top']} style={{ zIndex: 1000 }}>
      <View
        style={{
          height,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: theme.layout.screen.margin.x,
          gap: theme.spacing['3'],
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {LeftComponent}
        </View>
        <View style={titleContainerStyle} pointerEvents="none">
          {!!title && (
            <Text variant="title-md" align={titleAlignment}>
              {title}
            </Text>
          )}
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          {RightComponent}
        </View>
      </View>
    </SafeAreaView>
  );
}
