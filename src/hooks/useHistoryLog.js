import { useCallback, useEffect, useState } from 'react';
import { clampPrecision } from '../utils/number.js';

const STORAGE_KEY = 'calc-log';
const MAX_ENTRIES = 50;

const readFromStorage = () => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((entry, index) => ({
        id: entry.id ?? entry.t ?? Date.now() + index,
        expression: entry.expression ?? entry.expr ?? '',
        result: clampPrecision(entry.result ?? entry.res ?? NaN),
        timestamp: entry.timestamp ?? entry.t ?? Date.now(),
      }));
    }
  } catch {
    // ignore
  }
  return [];
};

export const useHistoryLog = () => {
  const [entries, setEntries] = useState(readFromStorage);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
    } catch {
      // ignore
    }
  }, [entries]);

  const addEntry = useCallback((expression, result) => {
    const entry = {
      id: Date.now(),
      expression,
      result: clampPrecision(result),
      timestamp: Date.now(),
    };
    setEntries((prev) => [entry, ...prev].slice(0, MAX_ENTRIES));
  }, []);

  const clearEntries = useCallback(() => {
    setEntries([]);
  }, []);

  return {
    entries,
    addEntry,
    clearEntries,
  };
};
