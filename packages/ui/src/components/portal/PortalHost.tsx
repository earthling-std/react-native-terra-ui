import { Fragment, useContext } from 'react';
import { View, type ViewProps } from 'react-native';

import { PortalContext } from './PortalContext';

export type PortalHostProps = Omit<ViewProps, 'children'> & {
  /** Renders every `Portal` registered under this host name, in insertion order. */
  name: string;
};

/**
 * Renders every entry currently registered under `name` on the nearest
 * {@link PortalProvider}. Place it where teleported content should appear
 * (e.g. at the top of a `Screen.ScrollView`).
 */
export function PortalHost({ name, ...viewProps }: PortalHostProps) {
  const context = useContext(PortalContext);
  const hostPortals = context?.portals[name] ?? [];

  return (
    <View {...viewProps}>
      {hostPortals.map((entry) => (
        <Fragment key={entry.key}>{entry.node}</Fragment>
      ))}
    </View>
  );
}
