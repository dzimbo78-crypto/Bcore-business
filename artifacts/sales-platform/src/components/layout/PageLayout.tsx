import { type ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useMotionPreferences } from "@/components/MotionPreferences";
export function PageLayout({ children }: { children: ReactNode }) {
  const { paused } = useMotionPreferences();
  return (
    <div className={`bcore-site${paused ? " motion-paused" : ""}`}>
      <a className="skip-link" href="#main-content">
        Skip to content / Przejdź do treści
      </a>
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer />
    </div>
  );
}
