import { useEffect, useState } from "react";

export default function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value]);

  return debouncedValue;
}

export const functionDebounce = (fn: any, delay: number) => {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: any) => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(fn, delay, ...args);
  };
};
