import { router } from 'expo-router';
import { useWindowDimensions, View } from 'react-native';
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {
  Header,
  HStack,
  Screen,
  Spinner,
  type SpinnerSize,
  Text,
  VStack,
} from 'react-native-terra-ui';

import { Pager } from '../components/Pager';

const SIZES: SpinnerSize[] = ['sm', 'md', 'lg'];

const COLORS = [
  { code: 'content.primary', color: 'content.primary' as const },
  { code: 'content.accent', color: 'content.accent' as const },
  { code: 'status.danger', color: 'status.danger' as const },
  { code: '#4f46e5', color: '#4f46e5' as const },
];

const PAGE_TITLES = ['Sizes', 'Colors'];

function SizesPage(props: { width: number }) {
  const { width } = props;

  return (
    <View
      style={{
        flex: 1,
        width,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <HStack gap="6" align="center">
        {SIZES.map((size) => (
          <VStack key={size} gap="1" align="center">
            <Spinner size={size} />
            <Text variant="caption" color="content.tertiary">
              {size}
            </Text>
          </VStack>
        ))}
      </HStack>
    </View>
  );
}

function ColorsPage(props: { width: number }) {
  const { width } = props;

  return (
    <View
      style={{
        flex: 1,
        width,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <VStack gap="6" align="start">
        {COLORS.map(({ code, color }) => (
          <HStack key={code} gap="3" align="center">
            <Spinner color={color} />
            <Text variant="caption" color="content.tertiary">
              {code}
            </Text>
          </HStack>
        ))}
      </VStack>
    </View>
  );
}

export function SpinnerScreen() {
  const { width } = useWindowDimensions();
  const pageProgress = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      pageProgress.value =
        width > 0 ? event.contentOffset.x / width : event.contentOffset.x;
    },
  });

  return (
    <Screen margins={false}>
      <Screen.Header>
        <Header.Title
          dismissAction="back"
          onDismiss={() => router.back()}
          title="Spinner"
        />
      </Screen.Header>

      <Screen.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollHandler={scrollHandler}
      >
        <SizesPage width={width} />
        <ColorsPage width={width} />
      </Screen.ScrollView>
      <Pager titles={PAGE_TITLES} progress={pageProgress} />
    </Screen>
  );
}
