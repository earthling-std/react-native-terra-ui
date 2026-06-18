import { Spinner, type SpinnerSize, Text, VStack } from 'react-native-terra-ui';

import { DemoSection } from '../components/DemoSection';
import { PropDemo, PropDemoGroup } from '../components/PropDemo';
import { ScreenShell } from '../components/ScreenShell';

const SIZES: SpinnerSize[] = ['sm', 'md', 'lg'];

export function SpinnerScreen() {
  return (
    <ScreenShell title="Spinner">
      <DemoSection
        title="size"
        description='Loading indicator sizes. Defaults to "md".'
      >
        <PropDemoGroup>
          {SIZES.map((size) => (
            <PropDemo key={size} code={`size="${size}"`}>
              <VStack gap="1" align="center">
                <Spinner size={size} />
                <Text variant="caption" color="content.tertiary">
                  {size}
                </Text>
              </VStack>
            </PropDemo>
          ))}
        </PropDemoGroup>
      </DemoSection>

      <DemoSection
        title="color"
        description="Accepts theme color tokens or raw CSS colors."
      >
        <PropDemoGroup>
          <PropDemo code='color="content.accent"'>
            <Spinner color="content.accent" />
          </PropDemo>
          <PropDemo code='color="status.danger"'>
            <Spinner color="status.danger" />
          </PropDemo>
          <PropDemo code='color="#4f46e5"'>
            <Spinner color="#4f46e5" />
          </PropDemo>
        </PropDemoGroup>
      </DemoSection>
    </ScreenShell>
  );
}
