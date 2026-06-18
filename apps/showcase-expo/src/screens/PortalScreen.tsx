import { useEffect } from 'react';

import {
  PortalHost,
  PortalProvider,
  Text,
  usePortal,
  VStack,
} from 'react-native-terra-ui';

import { DemoSection } from '../components/DemoSection';
import { ScreenShell } from '../components/ScreenShell';

function TeleportedBanner() {
  const { registerContent, unregisterContent } = usePortal();
  const id = 'demo-banner';

  useEffect(() => {
    registerContent(
      id,
      <VStack
        p="3"
        gap="1"
        style={{
          backgroundColor: 'rgba(0, 153, 102, 0.12)',
          borderRadius: 12,
        }}
      >
        <Text variant="label-sm" color="content.accent">
          Teleported content
        </Text>
        <Text variant="body-sm" color="content.secondary">
          Registered via usePortal and rendered by PortalHost below.
        </Text>
      </VStack>
    );
    return () => unregisterContent(id);
  }, [registerContent, unregisterContent]);

  return null;
}

export function PortalScreen() {
  return (
    <PortalProvider>
      <ScreenShell title="Portal">
        <DemoSection
          title="usePortal + PortalHost"
          description="Components register content by id; PortalHost renders it elsewhere in the tree. Used internally by Header.LargeTitle."
        >
          <TeleportedBanner />
          <PortalHost />
        </DemoSection>
      </ScreenShell>
    </PortalProvider>
  );
}
