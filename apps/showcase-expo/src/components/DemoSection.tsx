import type { ReactNode } from 'react';

import { Text, VStack } from 'react-native-terra-ui';

export function DemoSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <VStack gap="3">
      <VStack gap="1">
        <Text variant="title-sm">{title}</Text>
        {description ? (
          <Text variant="body-sm" color="content.secondary">
            {description}
          </Text>
        ) : null}
      </VStack>
      {children}
    </VStack>
  );
}
