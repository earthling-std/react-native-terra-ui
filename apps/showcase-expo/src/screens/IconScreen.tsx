import { router } from 'expo-router';
import { useWindowDimensions, View } from 'react-native';
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {
  Header,
  HStack,
  Icon,
  Screen,
  Text,
  VStack,
} from 'react-native-terra-ui';
import type { TerraSemanticIconName } from 'react-native-terra-ui/theme';

import { Pager } from '../components/Pager';

const DEFAULT_ICONS: TerraSemanticIconName[] = [
  'navigation.back',
  'navigation.forward',
  'navigation.close',
  'status.info',
  'status.success',
  'status.warning',
  'status.danger',
];

const CUSTOM_ICONS = ['add', 'trash'] as const;

const SIZES = [16, 24, 32] as const;

const COLORS = [
  { code: 'content.primary', color: 'content.primary' as const },
  { code: 'content.accent', color: 'content.accent' as const },
  { code: 'status.danger', color: 'status.danger' as const },
  { code: '#e11d48', color: '#e11d48' as const },
];

const PAGE_TITLES = ['Default', 'Custom', 'Sizes', 'Colors'];

function DefaultIconsPage(props: { width: number }) {
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
        {DEFAULT_ICONS.map((name) => (
          <HStack key={name} gap="3" align="center">
            <Icon name={name} size={24} />
            <Text variant="caption" color="content.tertiary">
              {name}
            </Text>
          </HStack>
        ))}
      </VStack>
    </View>
  );
}

function CustomIconsPage(props: { width: number }) {
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
        {CUSTOM_ICONS.map((name) => (
          <HStack key={name} gap="3" align="center">
            <Icon name={name} size={24} />
            <Text variant="caption" color="content.tertiary">
              {name}
            </Text>
          </HStack>
        ))}
      </VStack>
    </View>
  );
}

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
            <Icon name="status.info" size={size} />
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
            <Icon name="status.info" size={24} color={color} />
            <Text variant="caption" color="content.tertiary">
              {code}
            </Text>
          </HStack>
        ))}
      </VStack>
    </View>
  );
}

export function IconScreen() {
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
          title="Icon"
        />
      </Screen.Header>

      <Screen.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollHandler={scrollHandler}
      >
        <DefaultIconsPage width={width} />
        <CustomIconsPage width={width} />
        <SizesPage width={width} />
        <ColorsPage width={width} />
      </Screen.ScrollView>
      <Pager titles={PAGE_TITLES} progress={pageProgress} />
    </Screen>
  );
}
