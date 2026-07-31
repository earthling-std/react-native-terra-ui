import { createContext, type ReactNode } from 'react';

export interface PortalEntry {
  key: number;
  node: ReactNode;
}

export type PortalStore = Record<string, PortalEntry[]>;

export interface PortalContextValue {
  /** Portal entries currently registered, keyed by host name. */
  portals: PortalStore;
  /** Register (or replace) the entry `key` under `hostName`. */
  upsertPortal: (hostName: string, key: number, node: ReactNode) => void;
  /** Remove the entry `key` previously registered under `hostName`. */
  removePortal: (hostName: string, key: number) => void;
}

export const PortalContext = createContext<PortalContextValue | null>(null);
