import type { ReactNode } from 'react';
import { Pressable, ScrollView } from 'react-native';

import {
  Box,
  Button,
  type ButtonVariant,
  getAccentNames,
  HStack,
  Text,
  useTheme,
  VStack,
} from 'react-native-terra-ui';

const noop = () => undefined;

const BUTTON_VARIANTS: ButtonVariant[] = [
  'primary',
  'secondary',
  'neutral',
  'outline',
  'ghost',
  'danger',
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <VStack gap={3}>
      <Text variant="title-sm" color="content.secondary">
        {title}
      </Text>
      {children}
    </VStack>
  );
}

export function Gallery() {
  const { scheme, setScheme, accent, setAccent } = useTheme();
  const accents = getAccentNames();

  return (
    <Box flex={1} bg="background">
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingTop: 64, gap: 24 }}
      >
        <VStack gap={1}>
          <Text variant="headline-md">Terra UI</Text>
          <Text variant="body-sm" color="content.secondary">
            v1 component gallery
          </Text>
        </VStack>

        <Section title="Theme">
          <HStack gap={2} align="center" wrap>
            <Button
              size="sm"
              variant="outline"
              onPress={() => setScheme(scheme === 'light' ? 'dark' : 'light')}
            >
              {`Scheme: ${scheme}`}
            </Button>
          </HStack>
          <HStack gap={2} wrap>
            {accents.map((name) => (
              <Button
                key={name}
                size="sm"
                variant={accent === name ? 'primary' : 'outline'}
                onPress={() => setAccent(name)}
              >
                {name}
              </Button>
            ))}
          </HStack>
        </Section>

        <Section title="Typography">
          <VStack gap={2}>
            <Text variant="display-sm">Display</Text>
            <Text variant="headline-sm">Headline</Text>
            <Text variant="title-md">Title</Text>
            <Text variant="body-md">
              Body — the quick brown fox jumps over the lazy dog.
            </Text>
            <Text variant="body-sm" color="content.secondary">
              Secondary body text
            </Text>
            <Text variant="label-md" color="content.tertiary">
              LABEL / META
            </Text>
            <Text variant="body-md" color="content.link" underline>
              Link-colored text
            </Text>
          </VStack>
        </Section>

        <Section title="Buttons — variants">
          <HStack gap={2} wrap>
            {BUTTON_VARIANTS.map((v) => (
              <Button key={v} variant={v} size="sm" onPress={noop}>
                {v}
              </Button>
            ))}
          </HStack>
        </Section>

        <Section title="Buttons — sizes & states">
          <HStack gap={2} align="center" wrap>
            <Button size="sm" onPress={noop}>
              Small
            </Button>
            <Button size="md" onPress={noop}>
              Medium
            </Button>
            <Button size="lg" onPress={noop}>
              Large
            </Button>
          </HStack>
          <HStack gap={2} align="center" wrap>
            <Button isLoading onPress={noop}>
              Loading
            </Button>
            <Button isDisabled onPress={noop}>
              Disabled
            </Button>
          </HStack>
          <Button fullWidth onPress={noop}>
            Full width
          </Button>
        </Section>

        <Section title="Layout — Box & asChild">
          <Box
            p={4}
            gap={2}
            bg="surface.raised"
            radius="lg"
            borderWidth="hairline"
            borderColor="border.default"
          >
            <Text variant="title-sm">Surface card</Text>
            <Text variant="body-sm" color="content.secondary">
              A Box with padding, gap, raised surface, radius and a hairline
              border.
            </Text>
          </Box>

          <Box asChild p={3} radius="md" bg="surface.sunken">
            <Pressable onPress={noop}>
              <Text variant="label-lg">asChild → Pressable</Text>
            </Pressable>
          </Box>
        </Section>
      </ScrollView>
    </Box>
  );
}
