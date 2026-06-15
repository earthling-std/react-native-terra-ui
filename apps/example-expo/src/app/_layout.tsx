import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { TerraUIProvider } from 'react-native-terra-ui';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <TerraUIProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </TerraUIProvider>
    </SafeAreaProvider>
  );
}
