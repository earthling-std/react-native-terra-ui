import { TerraUIProvider } from 'react-native-terra-ui';

import { Gallery } from './Gallery';

export default function App() {
  return (
    <TerraUIProvider>
      <Gallery />
    </TerraUIProvider>
  );
}
