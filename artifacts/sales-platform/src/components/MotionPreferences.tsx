import { createContext, useContext, useState, type ReactNode } from "react";
import { MotionConfig, useReducedMotion } from "framer-motion";
const MotionContext = createContext({ paused: false, toggle: () => {} });
export function MotionPreferences({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const [manual, setManual] = useState(() => {
    try {
      return localStorage.getItem("bcore-motion") === "off";
    } catch {
      return false;
    }
  });
  const paused = !!reduced || manual;
  const toggle = () =>
    setManual((value) => {
      try {
        localStorage.setItem("bcore-motion", value ? "on" : "off");
      } catch {}
      return !value;
    });
  return (
    <MotionContext.Provider value={{ paused, toggle }}>
      <MotionConfig reducedMotion={paused ? "always" : "user"}>
        {children}
      </MotionConfig>
    </MotionContext.Provider>
  );
}
export const useMotionPreferences = () => useContext(MotionContext);
