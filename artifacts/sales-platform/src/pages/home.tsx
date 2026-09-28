import { Reveal, RevealArticle } from "@/components/Reveal";
import { Link } from "wouter";
import { ArrowDown, ArrowUpRight, ArrowRight, Plus } from "lucide-react";
import { ContactCTA } from "@/components/layout/Footer";
import { CoreScene } from "@/components/CoreScene";
import { useLanguage } from "@/i18n/context";
import { advisory, serviceMeta, imagePath } from "@/data/advisory";
function ServicePanel({ index }: { index: number }) {
  const { lang } = useLanguage(),
    t = advisory[lang],
    s = serviceMeta[index],
    c = t.services[index];
  return (
    <section
      className={`service-panel ${index % 2 ? "is-reversed" : ""}`}
      aria-labelledby={`service-${s.id}`}
    >
      <Reveal className="service-copy">
        <div className="service-kicker">
          <span>{s.number} / 04</span>
          <span>{s.label}</span>
        </div>
        <h3 id={`service-${s.id}`}>{c.headline}</h3>
        <p>{c.desc}</p>
        <ul className="service-tags">
          {c.tags.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <Link href={s.path} className="text-link">
          {t.discover}
          <ArrowUpRight size={22} />
        </Link>
      </Reveal>
      <Reveal className="service-visual-wrap" variant="image" delay={0.09}>
        <div className="service-visual">
          <img
            src={imagePath(s.image)}
            alt={c.title}
            loading="lazy"
            width="1200"
            height="1000"
          />
          <div className="image-shade" />
          <span className="visual-title">{c.title}</span>
          <span className="visual-number">{s.number}</span>
          <Link
            href={s.path}
            className="visual-link"
            aria-label={`${t.discover}: ${c.title}`}
          >
            <ArrowUpRight />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
export default function Home() {
  const { lang } = useLanguage(),
    t = advisory[lang];
  return (
    <>
      <section className="hero container">
        <div className="hero-main">
          <div className="hero-copy">
            <div>
              <p className="eyebrow hero-eyebrow">
                <span className="copper-line" />
                {t.eyebrow}
              </p>
              <h1>
                {t.hero[0]}
                <br />
                <em>{t.hero[1]}</em>
              </h1>
              <p className="hero-description">{t.heroDesc}</p>
              <div className="hero-actions">
                <Link href="/#obszary" className="button button-copper">
                  {t.explore}
                  <ArrowDown size={18} />
                </Link>
                <Link href="/kontakt" className="text-link hero-contact">
                  {t.talk}
                  <ArrowUpRight size={18} />
                </Link>
              </div>
            </div>
          </div>
          <CoreScene />
        </div>
        <div className="hero-bottom">
          <Link href="/#obszary" className="scroll-hint">
            <span>
              <ArrowDown size={16} />
            </span>
            {t.scroll}
          </Link>
          <span className="hero-geography">
            POLAND <span>/</span> DENMARK <span>/</span> EUROPE
          </span>
        </div>
        <div className="hero-service-index">
          {serviceMeta.map((s, i) => (
            <Link key={s.id} href={s.path}>
              <span className="index-number">{s.number}</span>
              <span>{t.services[i].title}</span>
              <ArrowUpRight size={18} />
            </Link>
          ))}
        </div>
      </section>
      <section id="obszary" className="expertise container">
        <Reveal className="section-heading">
          <p className="eyebrow">
            {t.expertise}
            <span className="heading-rule" />
          </p>
          <div className="heading-row">
            <h2>
              {t.expertiseTitle[0]}
              <br />
              <span>{t.expertiseTitle[1]}</span>
            </h2>
            <p>{t.expertiseDesc}</p>
          </div>
        </Reveal>
        {serviceMeta.map((s, i) => (
          <ServicePanel key={s.id} index={i} />
        ))}
      </section>
      <section id="podejscie" className="approach">
        <div className="container">
          <Reveal className="approach-intro">
            <p className="eyebrow">{t.approach}</p>
            <h2>{t.approachTitle}</h2>
            <p>{t.approachDesc}</p>
          </Reveal>
          <div className="process-grid">
            {t.steps.map(([title, desc], i) => (
              <RevealArticle key={title} delay={i * 0.06}>
                <div className="process-top">
                  <span>0{i + 1}</span>
                  <Plus size={20} />
                </div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </RevealArticle>
            ))}
          </div>
          <div className="approach-bottom">
            <span>FROM VISION TO CONNECTION.</span>
            <Link href="/o-nas" className="text-link">
              {t.nav[2]}
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
      <ContactCTA />
    </>
  );
}
