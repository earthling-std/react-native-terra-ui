import type { ReactNode } from 'react';
import { ScrollView } from 'react-native';

import { router } from 'expo-router';

import { Box, Button, Text, VStack } from 'react-native-terra-ui';

export function ScreenShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <Box flex={1} bg="background">
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingTop: 64, gap: 24 }}
      >
        <VStack gap="3">
          <Button size="sm" variant="ghost" onPress={() => router.back()}>
            ← Gallery
          </Button>
          <VStack gap="1">
            <Text variant="headline-md">{title}</Text>
            {subtitle ? (
              <Text variant="body-sm" color="content.secondary">
                {subtitle}
              </Text>
            ) : null}
          </VStack>
        </VStack>
        {children}
      </ScrollView>
    </Box>
  );
}
