import { router } from 'expo-router';
import { useWindowDimensions, View } from 'react-native';
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {
  Box,
  Button,
  type ButtonSize,
  type ButtonVariant,
  Header,
  Screen,
  Text,
} from 'react-native-terra-ui';
import { useUnistyles } from 'react-native-unistyles';

import { Pager } from '../components/Pager';

const noop = () => undefined;

const VARIANTS: ButtonVariant[] = [
  'primary',
  'secondary',
  'neutral',
  'outline',
  'ghost',
  'danger',
];

const SIZES: ButtonSize[] = ['sm', 'md', 'lg'];

const PAGE_TITLES = ['Variants', 'Sizes', 'States', 'Icons'];

function pageStyle(width: number) {
  return {
    flex: 1,
    width,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };
}

function VariantsPage(props: { width: number }) {
  const { width } = props;

  return (
    <View style={pageStyle(width)}>
      <Box gap="4" align="center">
        {VARIANTS.map((variant) => (
          <View key={variant}>
            <Button variant={variant} size="sm" fullWidth={false} onPress={noop}>
              {variant}
            </Button>
          </View>
        ))}
      </Box>
    </View>
  );
}

function SizesPage(props: { width: number }) {
  const { width } = props;

  return (
    <View style={pageStyle(width)}>
      <Box row gap="4" align="center">
        {SIZES.map((size) => (
          <Box key={size} gap="1" align="center">
            <Button size={size} fullWidth={false} onPress={noop}>
              {size}
            </Button>
            <Text variant="caption" color="content.tertiary">
              {size}
            </Text>
          </Box>
        ))}
      </Box>
    </View>
  );
}

function StatesPage(props: { width: number }) {
  const { width } = props;
  const { theme } = useUnistyles();
  const contentWidth = width - theme.layout.screen.margin.x * 2;

  return (
    <View style={pageStyle(width)}>
      <Box gap="4" align="start" style={{ width: contentWidth }}>
        <Button isLoading onPress={noop}>
          Saving…
        </Button>
        <Button isDisabled onPress={noop}>
          Disabled
        </Button>
        <Box row gap="2" wrap>
          <Button fullWidth={false} variant="outline" onPress={noop}>
            Cancel
          </Button>
          <Button fullWidth={false} onPress={noop}>
            Save
          </Button>
        </Box>
        <Button isIconOnly size="md" onPress={noop} accessibilityLabel="Add">
          <Button.Icon name="add" />
        </Button>
      </Box>
    </View>
  );
}

function IconsPage(props: { width: number }) {
  const { width } = props;
  const { theme } = useUnistyles();
  const contentWidth = width - theme.layout.screen.margin.x * 2;

  return (
    <View style={pageStyle(width)}>
      <Box gap="3" align="start" style={{ width: contentWidth }}>
        <Button onPress={noop}>
          <Button.Icon name="add" />
          Add new contact
        </Button>
        <Button variant="outline" onPress={noop}>
          Continue
          <Button.Icon name="navigation.forward" />
        </Button>
        <Button variant="danger" onPress={noop}>
          <Button.Icon name="trash" />
          Delete contact
        </Button>
        <Button variant="ghost" onPress={noop}>
          <Button.Icon name="navigation.back" />
          Back
        </Button>
      </Box>
    </View>
  );
}

export function ButtonScreen() {
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
          title="Button"
        />
      </Screen.Header>

      <Screen.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollHandler={scrollHandler}
      >
        <VariantsPage width={width} />
        <SizesPage width={width} />
        <StatesPage width={width} />
        <IconsPage width={width} />
      </Screen.ScrollView>
      <Pager titles={PAGE_TITLES} progress={pageProgress} />
    </Screen>
  );
}
