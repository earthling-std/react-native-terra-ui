import { View } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PageIndicator } from 'react-native-terra-ui';

interface PagerProps {
  count: number;
  progress: SharedValue<number>;
  isLoading?: boolean;
}

export function Pager({ count, progress, isLoading }: PagerProps) {
  const { bottom } = useSafeAreaInsets();
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: bottom + 18,
        alignItems: 'center',
      }}
    >
      <PageIndicator
        count={count}
        progress={progress}
        variant="pill"
        isLoading={isLoading}
      />
    </View>
  );
}
