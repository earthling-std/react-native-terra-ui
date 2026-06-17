import {
  Button,
  type ButtonRadius,
  type ButtonSize,
  type ButtonVariant,
  HStack,
  VStack,
} from 'react-native-terra-ui';

import { DemoSection } from '../components/DemoSection';
import { PropDemo, PropDemoGroup } from '../components/PropDemo';
import { ScreenShell } from '../components/ScreenShell';

const noop = () => undefined;

const VARIANTS: ButtonVariant[] = [
  'primary',
  'secondary',
  'neutral',
  'outline',
  'ghost',
  'danger',
];

const SIZES: ButtonSize[] = ['sm', 'md', 'lg'];

const RADII: ButtonRadius[] = ['none', 'sm', 'md', 'lg', 'xl', 'full'];

export function ButtonScreen() {
  return (
    <ScreenShell title="Button">
      <DemoSection
        title="variant"
        description='Visual style. Defaults to "primary".'
      >
        <HStack gap="2" wrap>
          {VARIANTS.map((variant) => (
            <Button key={variant} variant={variant} size="sm" onPress={noop}>
              {variant}
            </Button>
          ))}
        </HStack>
      </DemoSection>

      <DemoSection
        title="size"
        description='Height and padding. Defaults to "md".'
      >
        <HStack gap="2" align="center" wrap>
          {SIZES.map((size) => (
            <PropDemo key={size} code={`size="${size}"`}>
              <Button size={size} onPress={noop}>
                {size}
              </Button>
            </PropDemo>
          ))}
        </HStack>
      </DemoSection>

      <DemoSection
        title="radius"
        description="Corner radius override. App default is full (see unistyles.ts)."
      >
        <HStack gap="2" wrap>
          {RADII.map((radius) => (
            <PropDemo key={radius} code={`radius="${radius}"`}>
              <Button radius={radius} size="sm" onPress={noop}>
                {radius}
              </Button>
            </PropDemo>
          ))}
        </HStack>
      </DemoSection>

      <DemoSection title="States">
        <PropDemoGroup>
          <PropDemo code="isLoading">
            <Button isLoading onPress={noop}>
              Saving…
            </Button>
          </PropDemo>
          <PropDemo code="isDisabled">
            <Button isDisabled onPress={noop}>
              Disabled
            </Button>
          </PropDemo>
          <PropDemo code="fullWidth">
            <Button fullWidth onPress={noop}>
              Full width
            </Button>
          </PropDemo>
          <PropDemo code='isIconOnly size="md"'>
            <Button
              isIconOnly
              size="md"
              onPress={noop}
              accessibilityLabel="Add"
            >
              <Button.Icon name="add" />
            </Button>
          </PropDemo>
        </PropDemoGroup>
      </DemoSection>

      <DemoSection
        title="Button.Icon"
        description="Compound icon slot resolved from configured icon names."
      >
        <PropDemoGroup>
          <PropDemo code='<Button.Icon name="add" />'>
            <Button onPress={noop}>
              <Button.Icon name="add" />
              Add new contact
            </Button>
          </PropDemo>
          <PropDemo code='<Button.Icon name="navigation.forward" />'>
            <Button variant="outline" onPress={noop}>
              Continue
              <Button.Icon name="navigation.forward" />
            </Button>
          </PropDemo>
          <PropDemo code='<Button.Icon name="trash" />'>
            <Button variant="danger" onPress={noop}>
              <Button.Icon name="trash" />
              Delete contact
            </Button>
          </PropDemo>
          <PropDemo code='<Button.Icon name="navigation.back" />'>
            <Button variant="ghost" onPress={noop}>
              <Button.Icon name="navigation.back" />
              Back
            </Button>
          </PropDemo>
        </PropDemoGroup>
      </DemoSection>

      <DemoSection
        title="Button.Label"
        description="Custom children via the label sub-component and useButtonContext()."
      >
        <PropDemo code="<Button><Button.Label>Custom label</Button.Label></Button>">
          <Button variant="secondary" onPress={noop}>
            <Button.Label>Custom label</Button.Label>
          </Button>
        </PropDemo>
      </DemoSection>

      <DemoSection title="Composition">
        <VStack gap="2">
          <PropDemo code='variant="outline" size="lg" fullWidth'>
            <Button variant="outline" size="lg" fullWidth onPress={noop}>
              Combined props
            </Button>
          </PropDemo>
          <PropDemo code='variant="danger" isLoading'>
            <Button variant="danger" isLoading onPress={noop}>
              Deleting…
            </Button>
          </PropDemo>
        </VStack>
      </DemoSection>
    </ScreenShell>
  );
}
