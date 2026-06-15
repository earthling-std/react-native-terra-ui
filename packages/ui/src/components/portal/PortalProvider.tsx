import { type ReactNode, useCallback, useMemo, useState } from 'react';

import { PortalContext, type PortalContextValue } from './PortalContext';

export interface PortalProviderProps {
  children: ReactNode;
}

/**
 * Holds a registry of teleported content. Children register/unregister nodes by
 * id (see {@link usePortal}); a `PortalHost` placed anywhere below renders them.
 * Context-only — no animation dependency.
 */
export function PortalProvider({ children }: PortalProviderProps) {
  const [contents, setContents] = useState<Map<string, ReactNode>>(
    () => new Map()
  );

  const registerContent = useCallback((id: string, content: ReactNode) => {
    setContents((prev) => {
      const next = new Map(prev);
      next.set(id, content);
      return next;
    });
  }, []);

  const unregisterContent = useCallback((id: string) => {
    setContents((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const value = useMemo<PortalContextValue>(
    () => ({ registerContent, unregisterContent, contents }),
    [registerContent, unregisterContent, contents]
  );

  return (
    <PortalContext.Provider value={value}>{children}</PortalContext.Provider>
  );
}
