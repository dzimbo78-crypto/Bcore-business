import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, Pause, Play } from "lucide-react";
import { useScroll, motion } from "framer-motion";
import { useLanguage, type Lang } from "@/i18n/context";
import { advisory, serviceMeta } from "@/data/advisory";
import { DisplayControl } from "@/components/DisplayPreferences";
import { useMotionPreferences } from "@/components/MotionPreferences";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
export function Brand({ compactDash = false }: { compactDash?: boolean }) {
  return (
    <Link href="/" className="brand" aria-label="B-CORE — home">
      <span className="brand-name">
        B<span className="brand-dash">{compactDash ? "–" : "—"}</span>CORE
        <span className="brand-period">.</span>
      </span>
      <span className="brand-descriptor">ADVISORY & BROKERAGE</span>
    </Link>
  );
}
export function Navbar() {
  const { lang, setLang } = useLanguage(),
    t = advisory[lang];
  const [location] = useLocation(),
    [open, setOpen] = useState(false);
  const { paused, toggle } = useMotionPreferences(),
    { scrollYProgress } = useScroll();
  useEffect(() => setOpen(false), [location]);
  const links = ["/#obszary", "/#podejscie", "/o-nas", "/kontakt"];
  return (
    <header className="site-header">
      <motion.div
        className="reading-progress"
        style={{ scaleX: scrollYProgress }}
      />
      <span key={location} className="navigation-glint" aria-hidden="true" />
      <div className="header-inner">
        <Brand compactDash />
        <nav
          className="desktop-nav"
          aria-label={lang === "pl" ? "Nawigacja główna" : "Main navigation"}
        >
          {links.slice(0, 3).map((href, i) => (
            <Link
              key={href}
              href={href}
              className={location === href ? "active" : ""}
            >
              {t.nav[i]}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <label className="language-select">
            <span className="sr-only">Language / Język</span>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
              aria-label="Language / Język"
            >
              {["pl", "en", "da", "de"].map((l) => (
                <option value={l} key={l}>
                  {l.toUpperCase()}
                </option>
              ))}
            </select>
          </label>
          <DisplayControl />
          <button
            type="button"
            className="icon-button motion-button"
            onClick={toggle}
            aria-label={paused ? t.play : t.pause}
            title={paused ? t.play : t.pause}
            aria-pressed={paused}
          >
            {paused ? <Play size={16} /> : <Pause size={16} />}
          </button>
          <Link href="/kontakt" className="header-cta">
            {t.talk}
            <ArrowUpRight size={17} />
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="icon-button mobile-menu" aria-label="Menu">
                <Menu />
              </button>
            </SheetTrigger>
            <SheetContent className="bcore-menu" side="right">
              <SheetTitle>
                <span className="brand-name">B—CORE.</span>
              </SheetTitle>
              <SheetDescription>ADVISORY & BROKERAGE</SheetDescription>
              <nav>
                {links.map((href, i) => (
                  <Link key={href} href={href} onClick={() => setOpen(false)}>
                    {t.nav[i]}
                    <ArrowUpRight size={22} />
                  </Link>
                ))}
                <div className="menu-services">
                  {serviceMeta.map((s, i) => (
                    <Link
                      key={s.id}
                      href={s.path}
                      onClick={() => setOpen(false)}
                    >
                      {s.number} / {t.services[i].title}
                    </Link>
                  ))}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
