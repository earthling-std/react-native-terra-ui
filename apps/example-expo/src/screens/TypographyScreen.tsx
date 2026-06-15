import {
  HStack,
  Text,
  type TextVariant,
} from 'react-native-terra-ui';

import { DemoSection } from '../components/DemoSection';
import { PropDemo, PropDemoGroup } from '../components/PropDemo';
import { ScreenShell } from '../components/ScreenShell';

const TEXT_VARIANTS: TextVariant[] = [
  'display-lg',
  'display-md',
  'display-sm',
  'headline-lg',
  'headline-md',
  'headline-sm',
  'title-lg',
  'title-md',
  'title-sm',
  'body-lg',
  'body-md',
  'body-sm',
  'label-lg',
  'label-md',
  'label-sm',
  'caption',
];

export function TypographyScreen() {
  return (
    <ScreenShell
      title="Typography"
      subtitle="Text — typographic scale, semantic colors, and text modifiers."
    >
      <DemoSection
        title="variant"
        description='Typographic role. Defaults to "body-md".'
      >
        <PropDemoGroup>
          {TEXT_VARIANTS.map((variant) => (
            <PropDemo key={variant} code={`variant="${variant}"`}>
              <Text variant={variant}>
                {variant} — The quick brown fox
              </Text>
            </PropDemo>
          ))}
        </PropDemoGroup>
      </DemoSection>

      <DemoSection
        title="color"
        description="Semantic color token from the theme palette."
      >
        <PropDemoGroup>
          <PropDemo code='color="content.primary"'>
            <Text variant="body-md" color="content.primary">
              Primary content
            </Text>
          </PropDemo>
          <PropDemo code='color="content.secondary"'>
            <Text variant="body-md" color="content.secondary">
              Secondary content
            </Text>
          </PropDemo>
          <PropDemo code='color="content.tertiary"'>
            <Text variant="body-md" color="content.tertiary">
              Tertiary content
            </Text>
          </PropDemo>
          <PropDemo code='color="content.link" underline'>
            <Text variant="body-md" color="content.link" underline>
              Link-colored text
            </Text>
          </PropDemo>
          <PropDemo code='color="status.danger.solid"'>
            <Text variant="body-md" color="status.danger.solid">
              Danger status
            </Text>
          </PropDemo>
        </PropDemoGroup>
      </DemoSection>

      <DemoSection
        title="weight"
        description="Override the variant's default font weight."
      >
        <PropDemoGroup>
          {(['regular', 'medium', 'semibold', 'bold'] as const).map((weight) => (
            <PropDemo key={weight} code={`weight="${weight}"`}>
              <Text variant="body-md" weight={weight}>
                {weight} weight
              </Text>
            </PropDemo>
          ))}
        </PropDemoGroup>
      </DemoSection>

      <DemoSection title="align" description="Horizontal text alignment.">
        <PropDemoGroup>
          {(['left', 'center', 'right'] as const).map((align) => (
            <PropDemo key={align} code={`align="${align}"`}>
              <Text variant="body-md" align={align}>
                {align} aligned text
              </Text>
            </PropDemo>
          ))}
        </PropDemoGroup>
      </DemoSection>

      <DemoSection title="Modifiers">
        <PropDemoGroup>
          <PropDemo code="italic">
            <Text variant="body-md" italic>
              Italic text
            </Text>
          </PropDemo>
          <PropDemo code="underline">
            <Text variant="body-md" underline>
              Underlined text
            </Text>
          </PropDemo>
          <PropDemo code="strikeThrough">
            <Text variant="body-md" strikeThrough>
              Strikethrough text
            </Text>
          </PropDemo>
          <PropDemo code="isTruncated">
            <Text variant="body-md" isTruncated>
              This long line is truncated to a single row with an ellipsis at
              the end when it overflows the container width.
            </Text>
          </PropDemo>
        </PropDemoGroup>
      </DemoSection>

      <DemoSection title="Composition">
        <PropDemo code='variant="title-md" color="content.secondary" weight="semibold" align="center"'>
          <HStack justify="center">
            <Text
              variant="title-md"
              color="content.secondary"
              weight="semibold"
              align="center"
            >
              Combined props
            </Text>
          </HStack>
        </PropDemo>
      </DemoSection>
    </ScreenShell>
  );
}
