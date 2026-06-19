import { Link } from 'expo-router';

import { Button, Box, Header, Screen, Text } from 'react-native-terra-ui';

import { ThemeConfigSection } from '../components/ThemeConfigSection';

const COMPONENTS = [
  { href: '/typography', label: 'Typography' },
  { href: '/surface', label: 'Surface' },
  { href: '/button', label: 'Button' },
  { href: '/icon', label: 'Icon' },
  { href: '/spinner', label: 'Spinner' },
  { href: '/page-indicator', label: 'Page Indicator' },
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
      <Screen.ScrollView>
        <ThemeConfigSection />

        <Box gap="2">
          <Text variant="label-sm" color="content.tertiary">
            Components
          </Text>
          {COMPONENTS.map(({ href, label }) => (
            <Link key={label} href={href} asChild>
              <Button variant="outline">
                {label}
              </Button>
            </Link>
          ))}
        </Box>
      </Screen.ScrollView>
    </Screen>
  );
}
