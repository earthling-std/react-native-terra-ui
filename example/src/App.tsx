import { UIKitProvider } from 'react-native-terra-ui';

import { Gallery } from './Gallery';

export default function App() {
  return (
    <UIKitProvider>
      <Gallery />
    </UIKitProvider>
  );
}
