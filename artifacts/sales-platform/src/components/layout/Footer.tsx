import { Reveal } from "@/components/Reveal";
import { useState } from "react";
import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { LegalModal } from "@/components/LegalModal";
import { useLanguage } from "@/i18n/context";
import { advisory, email, phone, serviceMeta } from "@/data/advisory";
import { Brand } from "./Navbar";
export function ContactCTA() {
  const { lang } = useLanguage(),
    t = advisory[lang];
  return (
    <section className="contact-cta">
      <Reveal className="container cta-inner">
        <span className="eyebrow">LET’S CONNECT</span>
        <div>
          <h2>{t.cta}</h2>
          <p>{t.ctaDesc}</p>
        </div>
        <Link href="/kontakt" className="cta-circle" aria-label={t.talk}>
          <ArrowUpRight />
        </Link>
      </Reveal>
    </section>
  );
}
export function Footer() {
  const { lang } = useLanguage(),
    t = advisory[lang];
  const [legal, setLegal] = useState<"privacy" | "terms" | null>(null);
  return (
    <>
      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <Brand />
              <p className="footer-description">{t.footer}</p>
              <span className="footer-location">POLAND · DENMARK · EUROPE</span>
            </div>
            <div className="footer-links">
              <span className="eyebrow">{t.expertise}</span>
              {serviceMeta.map((s, i) => (
                <Link key={s.id} href={s.path}>
                  {t.services[i].title}
                </Link>
              ))}
            </div>
            <div className="footer-links">
              <span className="eyebrow">{t.nav[3]}</span>
              <a href={`mailto:${email}`}>{email}</a>
              <a href="tel:+4591789277">{phone}</a>
              <Link href="/kontakt">
                {t.talk}
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} B-CORE. {t.rights}
            </span>
            <div>
              <button onClick={() => setLegal("privacy")}>{t.privacy}</button>
              <button onClick={() => setLegal("terms")}>{t.terms}</button>
              <Link href="/admin">Admin</Link>
            </div>
          </div>
        </div>
      </footer>
      <LegalModal
        open={legal !== null}
        initialTab={legal || "privacy"}
        onClose={() => setLegal(null)}
      />
    </>
  );
}
