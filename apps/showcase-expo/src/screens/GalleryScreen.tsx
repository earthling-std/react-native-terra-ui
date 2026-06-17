import { Link } from 'expo-router';

import { Button, Header, Screen, Text, VStack } from 'react-native-terra-ui';

import { ThemeConfigSection } from '../components/ThemeConfigSection';

const COMPONENTS = [
  { href: '/typography', label: 'Typography' },
  { href: '/surface', label: 'Surface' },
  { href: '/button', label: 'Button' },
  { href: '/screen', label: 'Screen' },
] as const;

export function GalleryScreen() {
  return (
    <Screen>
      <Screen.Header>
        <Header.LargeTitle
          title="Gallery"
          caption="Terra UI component explorer"
          titleAlignment="left"
        />
      </Screen.Header>
      <Screen.ScrollView bottomInset={32} contentContainerStyle={{ gap: 32 }}>
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
      </Screen.ScrollView>
    </Screen>
  );
}
