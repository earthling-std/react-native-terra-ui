import { type FC, type ReactNode, useContext, useEffect, useRef } from 'react';

import { PortalContext } from './PortalContext';
import { PortalHost, type PortalHostProps } from './PortalHost';
import { PortalProvider, type PortalProviderProps } from './PortalProvider';

let nextPortalKey = 1;

export interface PortalProps {
  /** Name of the `PortalHost` to teleport `children` into. */
  hostName: string;
  children?: ReactNode;
}

const PortalComponent: FC<PortalProps> = ({ hostName, children }) => {
  const context = useContext(PortalContext);
  const upsertPortal = context?.upsertPortal;
  const removePortal = context?.removePortal;
  const portalKeyRef = useRef<number>(nextPortalKey++);

  useEffect(() => {
    if (!upsertPortal || !removePortal) {
      return;
    }

    upsertPortal(hostName, portalKeyRef.current, children ?? null);

    return () => {
      removePortal(hostName, portalKeyRef.current);
    };
  }, [children, hostName, removePortal, upsertPortal]);

  return null;
};

type PortalWithCompatApi = FC<PortalProps> & {
  Provider: FC<PortalProviderProps>;
  Host: FC<PortalHostProps>;
};

/**
 * Declaratively teleports `children` into the `PortalHost` named `hostName`,
 * for as long as this component stays mounted.
 *
 * @example
 * ```tsx
 * <Portal hostName="screen-header">
 *   <LargeTitle />
 * </Portal>
 * ```
 */
export const Portal = Object.assign(PortalComponent, {
  Provider: PortalProvider,
  Host: PortalHost,
}) as PortalWithCompatApi;
