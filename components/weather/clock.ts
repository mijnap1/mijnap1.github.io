"use client";

import { useSyncExternalStore } from "react";

// One shared ticker, aligned to the start of each second, for every clock on the page.
let now: number | null = null;
let timer: number | null = null;
const listeners = new Set<() => void>();

function tick() {
  now = Date.now();
  listeners.forEach((listener) => listener());
  const delay = 1000 - (now % 1000);
  timer = window.setTimeout(tick, delay < 16 ? delay + 1000 : delay);
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  if (timer === null) {
    tick();
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer !== null) {
      window.clearTimeout(timer);
      timer = null;
    }
  };
}

/** Current time in ms, updated every second; null during server rendering. */
export function useNow(): number | null {
  return useSyncExternalStore(
    subscribe,
    () => now,
    () => null,
  );
}
