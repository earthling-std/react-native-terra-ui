import { useRef, useState } from 'react';
import { View } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import {
  runOnJS,
  useAnimatedReaction,
} from 'react-native-reanimated';
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Rect,
  Stop,
} from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Box, PageIndicator, Text } from 'react-native-terra-ui';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

interface PagerProps {
  titles: string[];
  progress: SharedValue<number>;
}

let pagerGradientInstance = 0;

function PagerTitle(props: {
  titles: string[];
  progress: SharedValue<number>;
}) {
  const { titles, progress } = props;
  const [index, setIndex] = useState(0);

  useAnimatedReaction(
    () => Math.round(progress.value),
    (current, previous) => {
      if (current !== previous) {
        const nextIndex = Math.min(Math.max(current, 0), titles.length - 1);
        runOnJS(setIndex)(nextIndex);
      }
    },
    [titles.length]
  );

  return (
    <Text variant="body-md" weight="bold" color="content.primary">
      {titles[index]}
    </Text>
  );
}

export function Pager({ titles, progress }: PagerProps) {
  const { bottom } = useSafeAreaInsets();
  const { theme } = useUnistyles();
  const gradientId = useRef(`pager-gradient-${++pagerGradientInstance}`).current;
  const gradientColor = theme.color.background;

  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <View
        style={{
          paddingTop: theme.spacing[8],
          paddingBottom: bottom + theme.spacing[2],
        }}
      >
        <View style={styles.gradient} pointerEvents="none">
          <Svg height="100%" width="100%">
            <Defs>
              <SvgLinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={gradientColor} stopOpacity="0" />
                <Stop offset="0.55" stopColor={gradientColor} stopOpacity="0.85" />
                <Stop offset="1" stopColor={gradientColor} stopOpacity="1" />
              </SvgLinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill={`url(#${gradientId})`} />
          </Svg>
        </View>

        <Box row justify="between" align="center" gap="1" px="5">
          <PagerTitle titles={titles} progress={progress} />
          <PageIndicator
            style={styles.page}
            count={titles.length}
            current={progress}
            variant="pill"
          />
        </Box>
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  page: {
    backgroundColor: theme.color.surface.base,
    padding: theme.spacing[2],
    borderRadius: theme.radius.full,
  },
}));
