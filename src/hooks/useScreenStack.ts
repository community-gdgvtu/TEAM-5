import { useState, useCallback } from "react";

interface StackEntry {
  name: string;
  params?: any;
}

/**
 * Minimal screen-stack navigation for role navigators.
 * No router dependency — just a call stack of screen names.
 */
export function useScreenStack(initial: string) {
  const [stack, setStack] = useState<StackEntry[]>([{ name: initial }]);

  const go = useCallback((name: string, params?: any) => {
    setStack((s) => [...s, { name, params }]);
  }, []);

  const back = useCallback(() => {
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  }, []);

  const replace = useCallback((name: string, params?: any) => {
    setStack((s) => [...s.slice(0, s.length - 1), { name, params }]);
  }, []);

  const current = stack[stack.length - 1];

  return { stack, current, go, back, replace };
}