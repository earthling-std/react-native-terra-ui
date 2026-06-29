import { router } from 'expo-router';
import { useWindowDimensions, View } from 'react-native';
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {
  Avatar,
  type AvatarColor,
  type AvatarShape,
  type AvatarSize,
  Box,
  Header,
  Icon,
  Screen,
  Text,
} from 'react-native-terra-ui';

import { Pager } from '../components/Pager';

const SIZES: AvatarSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
const SHAPES: AvatarShape[] = ['circle', 'rounded', 'square'];
const COLORS: AvatarColor[] = ['default', 'accent', 'success', 'warning', 'danger'];

const SAMPLE_URI = 'https://i.pravatar.cc/150?img=12';

const PAGE_TITLES = ['Sizes', 'Shapes', 'Colors', 'Fallbacks'];

function SizesPage({ width }: { width: number }) {
  return (
    <View style={{ flex: 1, width, alignItems: 'center', justifyContent: 'center' }}>
      <Box row gap="4" align="center">
        {SIZES.map((size) => (
          <Box key={size} gap="2" align="center">
            <Avatar size={size} source={{ uri: SAMPLE_URI }} />
            <Text variant="caption" color="content.tertiary">
              {size}
            </Text>
          </Box>
        ))}
      </Box>
    </View>
  );
}

function ShapesPage({ width }: { width: number }) {
  return (
    <View style={{ flex: 1, width, alignItems: 'center', justifyContent: 'center' }}>
      <Box row gap="6" align="center">
        {SHAPES.map((shape) => (
          <Box key={shape} gap="2" align="center">
            <Avatar size="lg" shape={shape} source={{ uri: SAMPLE_URI }} />
            <Text variant="caption" color="content.tertiary">
              {shape}
            </Text>
          </Box>
        ))}
      </Box>
    </View>
  );
}

function ColorsPage({ width }: { width: number }) {
  return (
    <View style={{ flex: 1, width, alignItems: 'center', justifyContent: 'center' }}>
      <Box gap="5">
        <Box row gap="4" align="center" justify="center">
          <Text variant="label-sm" color="content.tertiary" style={{ width: 56 }} />
          <Text variant="label-sm" color="content.tertiary" align="center" style={{ width: 48 }}>
            default
          </Text>
          <Text variant="label-sm" color="content.tertiary" align="center" style={{ width: 48 }}>
            soft
          </Text>
        </Box>
        {COLORS.map((color) => (
          <Box key={color} row gap="4" align="center">
            <Text variant="label-sm" color="content.tertiary" style={{ width: 56 }}>
              {color}
            </Text>
            <Box style={{ width: 48 }} align="center">
              <Avatar size="md" name="JD" color={color} variant="default" />
            </Box>
            <Box style={{ width: 48 }} align="center">
              <Avatar size="md" name="JD" color={color} variant="soft" />
            </Box>
          </Box>
        ))}
      </Box>
    </View>
  );
}

function FallbacksPage({ width }: { width: number }) {
  return (
    <View style={{ flex: 1, width, alignItems: 'center', justifyContent: 'center' }}>
      <Box row gap="6" align="center">
        <Box gap="2" align="center">
          <Avatar size="lg" />
          <Text variant="caption" color="content.tertiary">
            placeholder
          </Text>
        </Box>

        <Box gap="2" align="center">
          <Avatar size="lg" name="Jane Doe" color="accent" />
          <Text variant="caption" color="content.tertiary">
            initials
          </Text>
        </Box>

        <Box gap="2" align="center">
          <Avatar
            size="lg"
            fallback={<Icon name="status.info" size={24} color="action.primary.fg" />}
          />
          <Text variant="caption" color="content.tertiary">
            custom
          </Text>
        </Box>

        <Box gap="2" align="center">
          <Avatar
            size="lg"
            name="Error User"
            source={{ uri: 'https://broken.invalid/img.jpg' }}
            color="danger"
            variant="soft"
          />
          <Text variant="caption" color="content.tertiary">
            error
          </Text>
        </Box>
      </Box>
    </View>
  );
}

export function AvatarScreen() {
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
          title="Avatar"
        />
      </Screen.Header>

      <Screen.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollHandler={scrollHandler}
      >
        <SizesPage width={width} />
        <ShapesPage width={width} />
        <ColorsPage width={width} />
        <FallbacksPage width={width} />
      </Screen.ScrollView>
      <Pager titles={PAGE_TITLES} progress={pageProgress} />
    </Screen>
  );
}
