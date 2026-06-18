import {
  type ElevationKey,
  Surface,
  type SurfaceVariant,
  Text,
  VStack,
} from 'react-native-terra-ui';

import { DemoSection } from '../components/DemoSection';
import { PropDemo, PropDemoGroup } from '../components/PropDemo';
import { ScreenShell } from '../components/ScreenShell';

const SURFACE_VARIANTS: SurfaceVariant[] = [
  'base',
  'raised',
  'sunken',
  'transparent',
];

const ELEVATIONS: ElevationKey[] = ['none', 'sm', 'md', 'lg', 'xl'];

export function SurfaceScreen() {
  return (
    <ScreenShell
      title="Surface"
      subtitle="Themed container — background level, shadow depth, and Box layout props."
    >
      <DemoSection
        title="variant"
        description='Background surface level. In light mode base and raised share the same fill — raised adds a hairline border and defaults to elevation "sm". In dark mode raised is a step lighter than base.'
      >
        <PropDemoGroup>
          {SURFACE_VARIANTS.map((variant) => (
            <PropDemo key={variant} code={`variant="${variant}"`}>
              <Surface variant={variant} p="4" gap="1">
                <Text variant="title-sm">{variant}</Text>
                <Text variant="body-sm" color="content.secondary">
                  bg maps to surface.{variant === 'transparent' ? '…' : variant}
                </Text>
              </Surface>
            </PropDemo>
          ))}
        </PropDemoGroup>
      </DemoSection>

      <DemoSection
        title="elevation"
        description="Drop-shadow depth. Needs a non-transparent background to render."
      >
        <PropDemoGroup>
          {ELEVATIONS.map((elevation) => (
            <PropDemo
              key={elevation}
              code={`variant="raised" elevation="${elevation}"`}
            >
              <Surface variant="raised" elevation={elevation} p="4">
                <Text variant="label-md">elevation="{elevation}"</Text>
              </Surface>
            </PropDemo>
          ))}
        </PropDemoGroup>
      </DemoSection>

      <DemoSection
        title="radius"
        description="Override the configured surface default radius."
      >
        <PropDemoGroup>
          {(['sm', 'md', 'lg', 'xl', 'full'] as const).map((radius) => (
            <PropDemo key={radius} code={`radius="${radius}"`}>
              <Surface variant="raised" elevation="sm" radius={radius} p="4">
                <Text variant="label-md">radius="{radius}"</Text>
              </Surface>
            </PropDemo>
          ))}
        </PropDemoGroup>
      </DemoSection>

      <DemoSection
        title="Layout props"
        description="Surface extends Box — padding, gap, borders, etc."
      >
        <PropDemo code='p="4" gap="2" borderWidth="hairline" borderColor="border.default"'>
          <Surface
            variant="sunken"
            p="4"
            gap="2"
            borderWidth="hairline"
            borderColor="border.default"
          >
            <Text variant="title-sm">Card content</Text>
            <Text variant="body-sm" color="content.secondary">
              Nested layout with padding, gap, and a hairline border.
            </Text>
          </Surface>
        </PropDemo>
      </DemoSection>

      <DemoSection title="Stacked surfaces">
        <VStack gap="3">
          <PropDemo code='variant="base"'>
            <Surface variant="base" p="4">
              <Text variant="label-md">Outer base</Text>
            </Surface>
          </PropDemo>
          <PropDemo code='variant="raised"'>
            <Surface variant="raised" p="4">
              <Text variant="label-md">Raised (default sm elevation)</Text>
            </Surface>
          </PropDemo>
          <PropDemo code='variant="raised" elevation="md"'>
            <Surface variant="raised" elevation="md" p="4">
              <Text variant="label-md">Raised with shadow</Text>
            </Surface>
          </PropDemo>
          <PropDemo code='variant="sunken"'>
            <Surface variant="sunken" p="4">
              <Text variant="label-md">Sunken inset</Text>
            </Surface>
          </PropDemo>
        </VStack>
      </DemoSection>
    </ScreenShell>
  );
}
