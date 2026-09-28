import { type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useMotionPreferences } from "@/components/MotionPreferences";
export function PageLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { paused } = useMotionPreferences();
  return (
    <div className={`bcore-site${paused ? " motion-paused" : ""}`}>
      <Link className="skip-link" href={`${location}#main-content`}>
        Skip to content / Przejdź do treści
      </Link>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <div key={location} className="route-content">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
