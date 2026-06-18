import { HStack, Icon, Text, VStack } from 'react-native-terra-ui';
import type { TerraSemanticIconName } from 'react-native-terra-ui/theme';

import { DemoSection } from '../components/DemoSection';
import { PropDemo, PropDemoGroup } from '../components/PropDemo';
import { ScreenShell } from '../components/ScreenShell';

const SEMANTIC_ICONS: TerraSemanticIconName[] = [
  'navigation.back',
  'navigation.forward',
  'navigation.close',
  'status.info',
  'status.success',
  'status.warning',
  'status.danger',
];

export function IconScreen() {
  return (
    <ScreenShell title="Icon">
      <DemoSection
        title="semantic icons"
        description="Built-in icons registered via configureTerraUI. Custom icons use the same API with names from your icon registry."
      >
        <PropDemoGroup>
          {SEMANTIC_ICONS.map((name) => (
            <PropDemo key={name} code={`name="${name}"`}>
              <VStack gap="1" align="center">
                <Icon name={name} size={24} />
                <Text variant="caption" color="content.tertiary">
                  {name}
                </Text>
              </VStack>
            </PropDemo>
          ))}
        </PropDemoGroup>
      </DemoSection>

      <DemoSection
        title="size & color"
        description="size is a raw number (dp). color accepts theme tokens or literals."
      >
        <HStack gap="4" align="center" wrap>
          <PropDemo code='size={16} color="content.primary"'>
            <Icon name="status.info" size={16} />
          </PropDemo>
          <PropDemo code='size={24} color="content.accent"'>
            <Icon name="status.info" size={24} color="content.accent" />
          </PropDemo>
          <PropDemo code='size={32} color="#e11d48"'>
            <Icon name="status.danger" size={32} color="#e11d48" />
          </PropDemo>
        </HStack>
      </DemoSection>
    </ScreenShell>
  );
}
