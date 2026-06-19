import { router } from 'expo-router';
import { useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {
  Button,
  Header,
  HStack,
  PageIndicator,
  Screen,
  Surface,
  Text,
  VStack,
} from 'react-native-terra-ui';
import { useUnistyles } from 'react-native-unistyles';

import { Pager } from '../components/Pager';

const PAGE_COUNT = 4;
const PAGE_LABELS = Array.from({ length: PAGE_COUNT }, (_, index) => `${index + 1}`);

const MANY_PAGE_COUNT = 10;
const MANY_PAGE_LABELS = Array.from(
  { length: MANY_PAGE_COUNT },
  (_, index) => `${index + 1}`
);

const SCROLL_CARD_COUNT = 5;

const PAGE_TITLES = ['Pill variant', 'Dot variant', 'Scroll linked', 'Color override', 'Many pages'];

function pageStyle(width: number) {
  return {
    flex: 1,
    width,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };
}

function PagePicker(props: {
  compact?: boolean;
  labels: readonly string[];
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  const { labels, activeIndex, onSelect, compact = false } = props;

  return (
    <HStack gap="2" wrap justify="center">
      {labels.map((label, index) => (
        <Button
          key={label}
          size="sm"
          fullWidth={false}
          variant={index === activeIndex ? 'primary' : 'outline'}
          onPress={() => onSelect(index)}
        >
          {compact ? label : `Page ${label}`}
        </Button>
      ))}
    </HStack>
  );
}

function PillPage(props: { width: number }) {
  const { width } = props;
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View style={pageStyle(width)}>
      <VStack gap="6" align="center">
        <HStack gap="8" align="center">
          <PageIndicator
            count={PAGE_COUNT}
            current={activeIndex}
            variant="pill"
          />
          <PageIndicator
            count={PAGE_COUNT}
            current={activeIndex}
            variant="pill"
            vertical
          />
        </HStack>
        <PagePicker
          labels={PAGE_LABELS}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
        />
      </VStack>
    </View>
  );
}

function DotPage(props: { width: number }) {
  const { width } = props;
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  return (
    <View style={pageStyle(width)}>
      <VStack gap="6" align="center">
        <HStack gap="5" align="center">
          <PageIndicator
            count={PAGE_COUNT}
            current={activeIndex}
            variant="dot"
            loading={loading}
          />
          <PageIndicator
            count={PAGE_COUNT}
            current={activeIndex}
            variant="dot"
            loading={loading}
            vertical
          />
        </HStack>
        <PagePicker
          labels={PAGE_LABELS}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
        />
        <Button
          size="sm"
          variant="ghost"
          onPress={() => setLoading((value) => !value)}
        >
          {loading ? 'Stop loading' : 'Toggle loading'}
        </Button>
      </VStack>
    </View>
  );
}

function ScrollLinkedPage(props: { width: number }) {
  const { width } = props;
  const { theme } = useUnistyles();
  const contentWidth = width - theme.layout.screen.margin.x * 2;
  const progress = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      progress.value =
        contentWidth > 0 ? event.contentOffset.x / contentWidth : 0;
    },
  });

  return (
    <View style={pageStyle(width)}>
      <VStack gap="5" align="center" style={{ width: contentWidth }}>
      <Animated.ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          style={{ width: contentWidth }}
        >
          {Array.from({ length: SCROLL_CARD_COUNT }, (_, index) => {
            const cardNumber = index + 1;

            return (
              <Surface
                key={`scroll-card-${cardNumber}`}
                variant="raised"
                elevation="none"
                borderColor='border.default'
                borderWidth={1}
                radius="lg"
                p="5"
                style={{
                  width: contentWidth,
                  minHeight: 128,
                  justifyContent: 'center',
                }}
              >
                <Text variant="title-sm">Card {cardNumber}</Text>
                <Text variant="body-sm" color="content.secondary">
                Swipe the cards
                </Text>
              </Surface>
            );
          })}
        </Animated.ScrollView>
        <HStack gap="8" align="center">
          <PageIndicator
            count={SCROLL_CARD_COUNT}
            current={progress}
            variant="pill"
          />
          <PageIndicator
            count={SCROLL_CARD_COUNT}
            current={progress}
            variant="dot"
          />
        </HStack>
      </VStack>
    </View>
  );
}

function ColorsPage(props: { width: number }) {
  const { width } = props;
  const [activeIndex, setActiveIndex] = useState(0);
  const colorProps = {
    activeColor: 'content.accent' as const,
    inactiveColor: 'content.tertiary' as const,
  };

  return (
    <View style={pageStyle(width)}>
      <VStack gap="6" align="center">
        <VStack gap="5" align="center">
          <PageIndicator
            count={3}
            current={activeIndex}
            variant="pill"
            {...colorProps}
          />
          <PageIndicator
            count={3}
            current={activeIndex}
            variant="dot"
            {...colorProps}
          />
        </VStack>
        <PagePicker
          labels={['1', '2', '3']}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
        />
      </VStack>
    </View>
  );
}

function ManyPagesPage(props: { width: number }) {
  const { width } = props;
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View style={pageStyle(width)}>
      <VStack gap="5" align="center">
        <VStack gap="4" align="center">
          <PageIndicator
            count={MANY_PAGE_COUNT}
            current={activeIndex}
            variant="pill"
          />
          <PageIndicator
            count={MANY_PAGE_COUNT}
            current={activeIndex}
            variant="dot"
          />
        </VStack>
        <HStack gap="2" wrap justify="center">
          <Button
            size="sm"
            fullWidth={false}
            variant="outline"
            onPress={() => setActiveIndex(0)}
          >
            First
          </Button>
          <Button
            size="sm"
            fullWidth={false}
            variant="outline"
            onPress={() => setActiveIndex(MANY_PAGE_COUNT - 1)}
          >
            Last
          </Button>
          <Button
            size="sm"
            fullWidth={false}
            variant="outline"
            onPress={() => setActiveIndex(4)}
          >
            Jump to 5
          </Button>
        </HStack>
        <PagePicker
          compact
          labels={MANY_PAGE_LABELS}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
        />
      </VStack>
    </View>
  );
}

export function PageIndicatorScreen() {
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
          title="Page Indicator"
        />
      </Screen.Header>

      <Screen.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollHandler={scrollHandler}
      >
        <PillPage width={width} />
        <DotPage width={width} />
        <ScrollLinkedPage width={width} />
        <ColorsPage width={width} />
        <ManyPagesPage width={width} />
      </Screen.ScrollView>
      <Pager titles={PAGE_TITLES} progress={pageProgress} />
    </Screen>
  );
}
