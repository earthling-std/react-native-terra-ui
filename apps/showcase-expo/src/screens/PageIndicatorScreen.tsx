import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, useWindowDimensions, View } from 'react-native';
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {
  Box,
  Header,
  HStack,
  PageIndicator,
  Screen,
  Text,
  VStack,
} from 'react-native-terra-ui';

import { Pager } from '../components/Pager';

const PAGES = ['1', '2', '3', '4', '5'] as const;
const PAGE_TITLES = ['Pill', 'Dot', 'Colors', 'Many'];

const MANY_PAGE_COUNT = 10;
const MANY_PAGES = Array.from(
  { length: MANY_PAGE_COUNT },
  (_, index) => `${index + 1}`
);

function pageStyle(width: number) {
  return {
    flex: 1,
    width,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };
}

function PageControls(props: {
  direction?: 'row' | 'column';
  pages: readonly string[];
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  const { pages, activeIndex, onSelect, direction = 'row' } = props;

  return (
    <Box gap="2" wrap direction={direction}>
      {pages.map((label, index) => (
        <Pressable key={label} onPress={() => onSelect(index)}>
          <Text
            variant="label-sm"
            color={
              index === activeIndex ? 'content.primary' : 'content.tertiary'
            }
          >
            Page {label}
          </Text>
        </Pressable>
      ))}
    </Box>
  );
}

function PillPage(props: { width: number }) {
  const { width } = props;
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View style={pageStyle(width)}>
      <VStack gap="4" align="center">
        <HStack gap="6" align="center">
          <PageIndicator count={PAGES.length} current={activeIndex} variant="pill" />
          <PageIndicator
            count={PAGES.length}
            current={activeIndex}
            variant="pill"
            vertical
          />
        </HStack>
        <PageControls
          pages={PAGES}
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
      <VStack gap="4" align="center">
        <VStack gap="6" align="center">
          <PageIndicator
            count={PAGES.length}
            current={activeIndex}
            variant="dot"
            loading={loading}
          />
          <PageIndicator
            count={PAGES.length}
            current={activeIndex}
            variant="dot"
            loading={loading}
            vertical
          />
        </VStack>
        <PageControls
          
          pages={PAGES}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
        />
        <Pressable onPress={() => setLoading((value) => !value)}>
          <Text variant="label-sm" color="content.accent">
            {loading ? 'Stop loading' : 'Toggle loading'}
          </Text>
        </Pressable>
      </VStack>
    </View>
  );
}

function ColorsPage(props: { width: number }) {
  const { width } = props;
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View style={pageStyle(width)}>
      <VStack gap="4" align="center">
        <PageIndicator
          count={3}
          current={activeIndex}
          variant="pill"
          activeColor="content.accent"
          inactiveColor="content.tertiary"
        />
        <PageIndicator
          count={3}
          current={activeIndex}
          variant="dot"
          activeColor="content.accent"
          inactiveColor="content.tertiary"
        />
        <HStack gap="2">
          {['Page 1', 'Page 2', 'Page 3'].map((label, index) => (
            <Pressable key={label} onPress={() => setActiveIndex(index)}>
              <Text
                variant="label-sm"
                color={
                  index === activeIndex ? 'content.primary' : 'content.tertiary'
                }
              >
                {label}
              </Text>
            </Pressable>
          ))}
        </HStack>
      </VStack>
    </View>
  );
}

function ManyPage(props: { width: number }) {
  const { width } = props;
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View style={pageStyle(width)}>
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
        <PageControls
          direction="column"
          pages={MANY_PAGES}
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
        <ColorsPage width={width} />
        <ManyPage width={width} />
      </Screen.ScrollView>
      <Pager titles={PAGE_TITLES} progress={pageProgress} />
    </Screen>
  );
}
