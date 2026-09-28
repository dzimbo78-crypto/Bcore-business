import {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";
import { MotionConfig, useReducedMotion } from "framer-motion";
const MotionContext = createContext({ paused: false, toggle: () => {} });
export function MotionPreferences({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const [manual, setManual] = useState<boolean | null>(() => {
    try {
      const value = localStorage.getItem("bcore-motion");
      return value === "off" ? true : value === "on" ? false : null;
    } catch {
      return null;
    }
  });
  const paused = manual ?? !!reduced;
  useLayoutEffect(() => {
    document.documentElement.dataset.motion = paused ? "paused" : "active";
    return () => {
      delete document.documentElement.dataset.motion;
    };
  }, [paused]);
  const toggle = () => {
    const next = !paused;
    setManual(next);
    try {
      localStorage.setItem("bcore-motion", next ? "off" : "on");
    } catch {}
  };
  return (
    <MotionContext.Provider value={{ paused, toggle }}>
      <MotionConfig reducedMotion={paused ? "always" : "never"}>
        {children}
      </MotionConfig>
    </MotionContext.Provider>
  );
}
export const useMotionPreferences = () => useContext(MotionContext);
