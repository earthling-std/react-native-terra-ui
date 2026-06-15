import { Header, Screen, Surface, Text, VStack } from 'react-native-terra-ui';

const SECTIONS = Array.from({ length: 12 }, (_, i) => ({
  title: `Card ${i + 1}`,
  body: 'Scroll up — the large title collapses into the compact bar title.',
}));

export function ScreenScreen() {
  return (
    <Screen>
      <Screen.Header>
        <Header.LargeTitle title="Screen" caption="Collapsing large title" />
      </Screen.Header>
      <Screen.ScrollView bottomInset={32}>
        <VStack gap="3">
          {SECTIONS.map((section) => (
            <Surface key={section.title} p="4" radius="lg" elevation="sm">
              <Text variant="title-sm">{section.title}</Text>
              <Text variant="body-sm" color="content.secondary">
                {section.body}
              </Text>
            </Surface>
          ))}
        </VStack>
      </Screen.ScrollView>
    </Screen>
  );
}
