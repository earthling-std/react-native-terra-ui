import type { ReactNode } from 'react';

import { Surface, Text, VStack } from 'react-native-terra-ui';

export function PropDemo({
  code,
  children,
}: {
  code: string;
  children: ReactNode;
}) {
  return (
    <Surface variant="sunken" p="3" gap="2" borderWidth="hairline" borderColor="border.default">
      <Text variant="label-sm" color="content.tertiary">
        {code}
      </Text>
      {children}
    </Surface>
  );
}

export function PropDemoGroup({ children }: { children: ReactNode }) {
  return <VStack gap="2">{children}</VStack>;
}
