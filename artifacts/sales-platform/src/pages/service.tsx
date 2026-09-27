import { SteelGallery } from "@/components/SteelGallery";
import { Link } from "wouter";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { ContactCTA } from "@/components/layout/Footer";
import { useLanguage } from "@/i18n/context";
import {
  advisory,
  serviceMeta,
  imagePath,
  type ServiceId,
} from "@/data/advisory";
import { ProductCatalogue } from "./produkty";
export default function Service({ id }: { id: ServiceId }) {
  const { lang } = useLanguage(),
    t = advisory[lang],
    i = serviceMeta.findIndex((s) => s.id === id),
    s = serviceMeta[i],
    c = t.services[i];
  return (
    <PageLayout>
      <section className="detail-hero container">
        <Link href="/#obszary" className="back-link">
          <ArrowLeft size={16} />
          {t.back}
        </Link>
        <div className="detail-intro">
          <div>
            <p className="eyebrow">
              {s.number} / {s.label}
            </p>
            <h1>{c.headline}</h1>
          </div>
          <div>
            <p>{c.desc}</p>
            <Link
              href={`/kontakt?obszar=${s.id}`}
              className="button button-copper"
            >
              {t.talk}
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
        <figure className="detail-image">
          <img
            src={imagePath(s.image)}
            alt={c.title}
            width="1600"
            height="800"
          />
          <figcaption>{t.inspiration}</figcaption>
        </figure>
        <ul className="detail-tags">
          {c.tags.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </section>
      <section className="scope-section container">
        <div className="scope-intro">
          <p className="eyebrow">{t.scope}</p>
          <h2>{c.title}</h2>
          <p>{c.intro}</p>
        </div>
        <div className="scope-list">
          {c.scope.map(([title, desc], j) => (
            <article key={title}>
              <span>0{j + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
              <Check size={20} />
            </article>
          ))}
        </div>
      </section>
      {id === "steel" && <SteelGallery />}
      <section className="outcome container">
        <p className="eyebrow">{t.result}</p>
        <p>{c.deliver}</p>
      </section>
      {id === "solutions" && <ProductCatalogue />}
      <section className="related container">
        <p className="eyebrow">{t.related}</p>
        <div>
          {serviceMeta.map(
            (item, j) =>
              item.id !== id && (
                <Link key={item.id} href={item.path}>
                  <span>
                    {item.number} / {t.services[j].title}
                  </span>
                  <ArrowUpRight size={22} />
                </Link>
              ),
          )}
        </div>
      </section>
      <ContactCTA />
    </PageLayout>
  );
}
