import { useCallback, useRef, useSyncExternalStore } from "react";
import { HistoryEntry } from "../types";

// Simple in-memory store for session history (not persisted)
let history: HistoryEntry[] = [];
let listeners: Set<() => void> = new Set();

function emitChange() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return history;
}

export function useHistory() {
  const entries = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const addEntry = useCallback((entry: Omit<HistoryEntry, "id" | "timestamp">) => {
    const newEntry: HistoryEntry = {
      ...entry,
      id: `hist-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: Date.now(),
    };
    history = [newEntry, ...history].slice(0, 50); // keep last 50
    emitChange();
  }, []);

  const clearHistory = useCallback(() => {
    history = [];
    emitChange();
  }, []);

  return { entries, addEntry, clearHistory };
}
