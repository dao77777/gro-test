import { useEffect } from "react";

export const useInterval = (callback: () => void, milliseconds: number) => {
  useEffect(() => {
    const interval = setInterval(callback, milliseconds);
    return () => clearInterval(interval);
  }, []);
};