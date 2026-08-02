import { router } from 'expo-router';
import { useWindowDimensions, View } from 'react-native';
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {
  Box,
  Chip,
  type ChipColor,
  type ChipSize,
  type ChipVariant,
  Header,
  Screen,
  Text,
} from 'react-native-terra-ui';

import { Pager } from '../components/Pager';

const VARIANTS: ChipVariant[] = ['solid', 'soft', 'outline', 'ghost'];
const SIZES: ChipSize[] = ['sm', 'md', 'lg'];
const COLORS: ChipColor[] = [
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
];
const CUSTOM_COLOR = '#7c3aed';

const PAGE_TITLES = ['Variants', 'Colors', 'Sizes', 'Icons'];

function pageStyle(width: number) {
  return {
    flex: 1,
    width,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };
}

function VariantsPage({ width }: { width: number }) {
  return (
    <View style={pageStyle(width)}>
      <Box gap="4" align="center">
        {VARIANTS.map((variant) => (
          <Chip key={variant} variant={variant} color="primary">
            {variant}
          </Chip>
        ))}
      </Box>
    </View>
  );
}

function ColorsPage({ width }: { width: number }) {
  return (
    <View style={pageStyle(width)}>
      <Box gap="3">
        <Box row gap="2" align="center">
          <Text variant="label-sm" color="text.subtle" style={{ width: 72 }} />
          {VARIANTS.map((variant) => (
            <Text
              key={variant}
              variant="label-sm"
              color="text.subtle"
              align="center"
              style={{ width: 72 }}
            >
              {variant}
            </Text>
          ))}
        </Box>
        {[...COLORS, CUSTOM_COLOR].map((color) => (
          <Box key={color} row gap="2" align="center">
            <Text variant="label-sm" color="text.subtle" style={{ width: 72 }}>
              {color === CUSTOM_COLOR ? 'custom' : color}
            </Text>
            {VARIANTS.map((variant) => (
              <Box key={variant} style={{ width: 72 }} align="center">
                <Chip color={color} variant={variant}>
                  Tag
                </Chip>
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </View>
  );
}

function SizesPage({ width }: { width: number }) {
  return (
    <View style={pageStyle(width)}>
      <Box row gap="4" align="center">
        {SIZES.map((size) => (
          <Box key={size} gap="2" align="center">
            <Chip size={size} color="primary">
              {size}
            </Chip>
            <Text variant="caption" color="text.subtle">
              {size}
            </Text>
          </Box>
        ))}
      </Box>
    </View>
  );
}

function IconsPage({ width }: { width: number }) {
  return (
    <View style={pageStyle(width)}>
      <Box gap="3" align="start">
        <Chip color="success" variant="solid">
          <Chip.Icon name="status.success" />
          Verified
        </Chip>
        <Chip color="danger" variant="soft">
          <Chip.Icon name="status.danger" />
          Failed
        </Chip>
        <Chip color="secondary" variant="outline">
          Removable
          <Chip.Icon name="navigation.close" />
        </Chip>
        <Chip color="primary" variant="ghost">
          Unselected
        </Chip>
      </Box>
    </View>
  );
}

export function ChipScreen() {
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
          title="Chip"
        />
      </Screen.Header>

      <Screen.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollHandler={scrollHandler}
      >
        <VariantsPage width={width} />
        <ColorsPage width={width} />
        <SizesPage width={width} />
        <IconsPage width={width} />
      </Screen.ScrollView>
      <Pager titles={PAGE_TITLES} progress={pageProgress} />
    </Screen>
  );
}
