import { type ReactNode, useCallback, useMemo, useState } from 'react';

import {
  PortalContext,
  type PortalContextValue,
  type PortalStore,
} from './PortalContext';

export interface PortalProviderProps {
  children: ReactNode;
}

/**
 * Holds a registry of teleported content, keyed by host name. Descendant
 * `Portal` components register/unregister entries; a `PortalHost` placed
 * anywhere below renders the entries for its `name`.
 */
export function PortalProvider({ children }: PortalProviderProps) {
  const [portals, setPortals] = useState<PortalStore>({});

  const upsertPortal = useCallback(
    (hostName: string, key: number, node: ReactNode) => {
      setPortals((prev) => {
        const hostPortals = prev[hostName] ?? [];
        const existingIndex = hostPortals.findIndex(
          (entry) => entry.key === key
        );

        if (existingIndex === -1) {
          return {
            ...prev,
            [hostName]: [...hostPortals, { key, node }],
          };
        }

        if (hostPortals[existingIndex]?.node === node) {
          return prev;
        }

        const nextHostPortals = [...hostPortals];
        nextHostPortals[existingIndex] = { key, node };

        return {
          ...prev,
          [hostName]: nextHostPortals,
        };
      });
    },
    []
  );

  const removePortal = useCallback((hostName: string, key: number) => {
    setPortals((prev) => {
      const hostPortals = prev[hostName] ?? [];
      const nextHostPortals = hostPortals.filter((entry) => entry.key !== key);

      if (nextHostPortals.length === hostPortals.length) {
        return prev;
      }

      if (nextHostPortals.length === 0) {
        const { [hostName]: _removed, ...rest } = prev;
        return rest;
      }

      return {
        ...prev,
        [hostName]: nextHostPortals,
      };
    });
  }, []);

  const value = useMemo<PortalContextValue>(
    () => ({ portals, upsertPortal, removePortal }),
    [portals, removePortal, upsertPortal]
  );

  return (
    <PortalContext.Provider value={value}>{children}</PortalContext.Provider>
  );
}
