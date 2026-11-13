import { useSyncExternalStore } from 'react';
import { site } from '../config/site';

/** Minimal shared state for values produced by the 3D engine (no extra dependency). */
type State = {
  engine: 'idle' | 'loading' | 'ready' | 'failed';
  /** Rendered still of the final scene (package + filled bowl) */
  finalShot: string | null;
  /** Bundle preselected in the order form (set by any "order" button on the page) */
  selectedBundle: string;
  /** Mobile sticky order bar is on screen — floating buttons lift above it */
  stickyBarVisible: boolean;
};

const defaultBundle = (site.bundles.find((b) => b.featured) ?? site.bundles[0]).id;

let state: State = { engine: 'idle', finalShot: null, selectedBundle: defaultBundle, stickyBarVisible: false };
const listeners = new Set<() => void>();

export const setStore = (patch: Partial<State>) => {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
};

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function useStore<T>(select: (s: State) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => select(state),
    () => select(state),
  );
}
