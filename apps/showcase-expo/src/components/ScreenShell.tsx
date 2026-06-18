import { router } from 'expo-router';
import type { ReactNode } from 'react';

import { Header, Screen } from 'react-native-terra-ui';

export function ScreenShell({
  title,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <Screen>
      <Screen.Header>
        <Header.Title
          dismissAction="back"
          onDismiss={() => router.back()}
          title={title}
        />
      </Screen.Header>
      <Screen.ScrollView>{children}</Screen.ScrollView>
    </Screen>
  );
}
