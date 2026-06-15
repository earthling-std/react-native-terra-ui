import { createContext, type ReactNode, useContext } from 'react';

export interface PortalContextValue {
  /** Register (or replace) portal content under a stable id. */
  registerContent: (id: string, content: ReactNode) => void;
  /** Remove the content previously registered under `id`. */
  unregisterContent: (id: string) => void;
  /** Currently registered content, keyed by id, rendered by `PortalHost`. */
  contents: Map<string, ReactNode>;
}

export const PortalContext = createContext<PortalContextValue | null>(null);

/**
 * Access the nearest {@link PortalProvider}. Used by components that need to
 * teleport content into a `PortalHost` rendered elsewhere in the tree (e.g. the
 * large-title header injecting its title into the scroll content).
 *
 * @throws if called outside a `PortalProvider`.
 */
export function usePortal(): PortalContextValue {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
}
