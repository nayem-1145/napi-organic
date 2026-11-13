import { useSyncExternalStore } from 'react';

/** Minimal shared state for values produced by the 3D engine (no extra dependency). */
type State = {
  engine: 'idle' | 'loading' | 'ready' | 'failed';
  /** Rendered still of the final scene (package + filled bowl) */
  finalShot: string | null;
};

let state: State = { engine: 'idle', finalShot: null };
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
