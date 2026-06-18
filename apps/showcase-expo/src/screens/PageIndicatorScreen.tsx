import { useState } from 'react';
import { Pressable } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { HStack, PageIndicator, Text, VStack } from 'react-native-terra-ui';

import { DemoSection } from '../components/DemoSection';
import { PropDemo } from '../components/PropDemo';
import { ScreenShell } from '../components/ScreenShell';

const PAGE_COUNT = 4;
const PAGES = ['Page 1', 'Page 2', 'Page 3', 'Page 4'] as const;

export function PageIndicatorScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const progress = useSharedValue(0);

  const goToPage = (index: number) => {
    setActiveIndex(index);
    progress.value = index;
  };

  return (
    <ScreenShell title="PageIndicator">
      <DemoSection
        title="pill variant"
        description="Default animated pill indicator. Tap a page control to change progress."
      >
        <VStack gap="4" align="center">
          <PageIndicator
            count={PAGE_COUNT}
            progress={progress}
            variant="pill"
          />
          <HStack gap="2">
            {PAGES.map((label, index) => (
              <Pressable key={label} onPress={() => goToPage(index)}>
                <Text
                  variant="label-sm"
                  color={
                    index === activeIndex
                      ? 'content.primary'
                      : 'content.tertiary'
                  }
                >
                  {label}
                </Text>
              </Pressable>
            ))}
          </HStack>
        </VStack>
      </DemoSection>

      <DemoSection
        title="dot variant"
        description='Dot indicators with optional loading ring (`isLoading`). Only applies to variant="dot".'
      >
        <VStack gap="4" align="center">
          <PropDemo code='variant="dot" isLoading={isLoading}'>
            <PageIndicator
              count={PAGE_COUNT}
              progress={progress}
              variant="dot"
              isLoading={isLoading}
            />
          </PropDemo>
          <HStack gap="2">
            <Pressable onPress={() => setIsLoading((value) => !value)}>
              <Text variant="label-sm" color="content.accent">
                Toggle loading
              </Text>
            </Pressable>
          </HStack>
        </VStack>
      </DemoSection>

      <DemoSection
        title="color overrides"
        description="Top-level activeColor / inactiveColor props override theme defaults."
      >
        <PageIndicator
          count={3}
          progress={progress}
          variant="pill"
          activeColor="content.accent"
          inactiveColor="content.tertiary"
        />
      </DemoSection>
    </ScreenShell>
  );
}
