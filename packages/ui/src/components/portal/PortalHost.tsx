import { View } from 'react-native';

import { usePortal } from './PortalContext';

/**
 * Renders every node currently registered with the nearest
 * {@link PortalProvider}, in insertion order. Place it where teleported content
 * should appear (e.g. at the top of a `Screen.ScrollView`).
 */
export function PortalHost() {
  const { contents } = usePortal();

  return (
    <View collapsable={false}>
      {Array.from(contents.entries()).map(([id, content]) => (
        <View key={id}>{content}</View>
      ))}
    </View>
  );
}
