import { Link } from 'expo-router';
import { ScrollView } from 'react-native';

import { Box, Button, Text, VStack } from 'react-native-terra-ui';

import { ThemeConfigSection } from '../components/ThemeConfigSection';

const COMPONENTS = [
  { href: '/typography', label: 'Typography' },
  { href: '/surface', label: 'Surface' },
  { href: '/button', label: 'Button' },
] as const;

export function GalleryScreen() {
  return (
    <Box flex={1} bg="background">
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 64, gap: 32 }}>
        <VStack gap="1">
          <Text variant="headline-md">Gallery</Text>
          <Text variant="body-sm" color="content.secondary">
            Terra UI component explorer
          </Text>
        </VStack>

        <ThemeConfigSection />

        <VStack gap="2">
          <Text variant="label-sm" color="content.tertiary">
            Components
          </Text>
          {COMPONENTS.map(({ href, label }) => (
            <Link key={label} href={href} asChild>
              <Button variant="outline" fullWidth>
                {label}
              </Button>
            </Link>
          ))}
        </VStack>
      </ScrollView>
    </Box>
  );
}
