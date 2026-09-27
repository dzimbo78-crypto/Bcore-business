import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { ContactCTA } from "@/components/layout/Footer";
import { useLanguage } from "@/i18n/context";
import { advisory, imagePath } from "@/data/advisory";
export default function About() {
  const { lang } = useLanguage(),
    t = advisory[lang];
  return (
    <PageLayout>
      <section className="about-hero container">
        <p className="eyebrow">{t.aboutDesc}</p>
        <h1>{t.aboutTitle}</h1>
        <div className="about-body">
          <img
            src={imagePath("business.webp")}
            alt={t.nav[2]}
            width="800"
            height="900"
          />
          <div>
            <span className="about-wordmark">B—CORE.</span>
            <p>{t.aboutBody}</p>
            <Link className="text-link" href="/kontakt">
              {t.talk}
              <ArrowUpRight />
            </Link>
          </div>
        </div>
      </section>
      <section className="principles container">
        {t.principles.map(([title, desc], i) => (
          <article key={title}>
            <span className="eyebrow">0{i + 1}</span>
            <h2>{title}</h2>
            <p>{desc}</p>
          </article>
        ))}
      </section>
      <ContactCTA />
    </PageLayout>
  );
}
