import { Stack } from 'expo-router';

import { TerraUIProvider } from 'react-native-terra-ui';

export default function RootLayout() {
  return (
    <TerraUIProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </TerraUIProvider>
  );
}
