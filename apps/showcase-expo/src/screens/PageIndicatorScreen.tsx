import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, useWindowDimensions, View } from 'react-native';
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {
  Header,
  HStack,
  PageIndicator,
  Screen,
  Text,
  VStack,
} from 'react-native-terra-ui';

import { Pager } from '../components/Pager';

const PAGE_COUNT = 4;
const PAGES = ['Page 1', 'Page 2', 'Page 3', 'Page 4'] as const;

const PAGE_TITLES = ['Pill', 'Dot', 'Colors'];

function pageStyle(width: number) {
  return {
    flex: 1,
    width,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };
}

function PageControls(props: {
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  const { activeIndex, onSelect } = props;

  return (
    <HStack gap="2">
      {PAGES.map((label, index) => (
        <Pressable key={label} onPress={() => onSelect(index)}>
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
  );
}

function PillPage(props: { width: number }) {
  const { width } = props;
  const [activeIndex, setActiveIndex] = useState(0);
  const progress = useSharedValue(0);

  const goToPage = (index: number) => {
    setActiveIndex(index);
    progress.value = index;
  };

  return (
    <View style={pageStyle(width)}>
      <VStack gap="4" align="center">
        <PageIndicator count={PAGE_COUNT} progress={progress} variant="pill" />
        <PageControls activeIndex={activeIndex} onSelect={goToPage} />
      </VStack>
    </View>
  );
}

function DotPage(props: { width: number }) {
  const { width } = props;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const progress = useSharedValue(0);

  const goToPage = (index: number) => {
    setActiveIndex(index);
    progress.value = index;
  };

  return (
    <View style={pageStyle(width)}>
      <VStack gap="4" align="center">
        <PageIndicator
          count={PAGE_COUNT}
          progress={progress}
          variant="dot"
          isLoading={isLoading}
        />
        <PageControls activeIndex={activeIndex} onSelect={goToPage} />
        <Pressable onPress={() => setIsLoading((value) => !value)}>
          <Text variant="label-sm" color="content.accent">
            {isLoading ? 'Stop loading' : 'Toggle loading'}
          </Text>
        </Pressable>
      </VStack>
    </View>
  );
}

function ColorsPage(props: { width: number }) {
  const { width } = props;
  const [activeIndex, setActiveIndex] = useState(0);
  const progress = useSharedValue(0);

  const goToPage = (index: number) => {
    setActiveIndex(index);
    progress.value = index;
  };

  return (
    <View style={pageStyle(width)}>
      <VStack gap="4" align="center">
        <PageIndicator
          count={3}
          progress={progress}
          variant="pill"
          activeColor="content.accent"
          inactiveColor="content.tertiary"
        />
        <HStack gap="2">
          {['Page 1', 'Page 2', 'Page 3'].map((label, index) => (
            <Pressable key={label} onPress={() => goToPage(index)}>
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
      </Screen.ScrollView>
      <Pager titles={PAGE_TITLES} progress={pageProgress} />
    </Screen>
  );
}
