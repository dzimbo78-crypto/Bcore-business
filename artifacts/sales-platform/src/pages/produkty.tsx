import { Reveal, RevealArticle } from "@/components/Reveal";
import { isStandalonePreview } from "@/lib/preview";
import { useEffect, useState } from "react";
import { Link, Redirect } from "wouter";
import { ArrowUpRight, Package, MapPin, RefreshCw } from "lucide-react";
import { useLanguage } from "@/i18n/context";
import { advisory } from "@/data/advisory";
type Product = {
  id: number;
  title: string;
  description: string | null;
  imageBase64: string | null;
  location: string | null;
  minOrder: string | null;
  price: string | null;
  currency: string | null;
  category: string | null;
  active: boolean;
};
export function ProductCatalogue() {
  const { lang } = useLanguage(),
    t = advisory[lang];
  const [products, setProducts] = useState<Product[]>([]),
    [state, setState] = useState<"loading" | "ready" | "error">("loading"),
    [category, setCategory] = useState("all"),
    [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (isStandalonePreview) {
      setState("error");
      return;
    }
    const controller = new AbortController();
    setState("loading");
    fetch(`${import.meta.env.BASE_URL}api/products`, {
      signal: controller.signal,
    })
      .then((r) => {
        if (!r.ok) throw new Error("Products unavailable");
        return r.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error("Invalid products");
        setProducts(data.filter((p) => p.active !== false));
        setState("ready");
      })
      .catch((e) => {
        if (e.name !== "AbortError") setState("error");
      });
    return () => controller.abort();
  }, [attempt]);
  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean)),
  ) as string[];
  const filtered = products.filter(
    (p) => category === "all" || p.category === category,
  );
  return (
    <section className="catalogue container" id="oferty">
      <Reveal className="catalogue-heading">
        <div>
          <p className="eyebrow">TRADE OPPORTUNITIES</p>
          <h2>{t.offers}</h2>
        </div>
        {categories.length > 0 && (
          <label className="catalogue-filter">
            <span className="sr-only">{t.all}</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">{t.all}</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        )}
      </Reveal>
      {state === "loading" ? (
        <div className="catalogue-state" role="status">
          {t.loading}
        </div>
      ) : state === "error" ? (
        <div className="catalogue-state" role="status">
          <p>
            {isStandalonePreview
              ? lang === "pl"
                ? "W podglądzie oferty nie są pobierane z bazy. Po wdrożeniu dodasz je przez panel administratora."
                : "This preview does not connect to the database. Add offers through the admin panel after deployment."
              : t.loadError}
          </p>
          {!isStandalonePreview && (
            <button
              className="text-link"
              onClick={() => setAttempt((n) => n + 1)}
            >
              <RefreshCw size={16} />
              {t.retry}
            </button>
          )}
        </div>
      ) : filtered.length === 0 ? (
        <div className="catalogue-state">
          <Package size={32} />
          <p>{t.empty}</p>
          <Link href="/kontakt?obszar=solutions" className="text-link">
            {t.talk}
            <ArrowUpRight size={18} />
          </Link>
        </div>
      ) : (
        <div className="product-grid">
          {filtered.map((p) => (
            <RevealArticle key={p.id} className="product-card">
              <div className="product-image">
                {p.imageBase64 &&
                /^(data:image\/(png|jpe?g|webp|gif);base64,|https?:\/\/)/i.test(
                  p.imageBase64,
                ) ? (
                  <img src={p.imageBase64} alt={p.title} loading="lazy" />
                ) : (
                  <Package size={40} />
                )}
              </div>
              <div className="product-body">
                {p.category && <span className="eyebrow">{p.category}</span>}
                <h3>{p.title}</h3>
                {p.description && <p>{p.description}</p>}
                <dl>
                  {p.price && (
                    <div>
                      <dt>{lang === "pl" ? "Cena" : "Price"}</dt>
                      <dd>
                        {p.price} {p.currency}
                      </dd>
                    </div>
                  )}
                  {p.location && (
                    <div>
                      <dt>
                        <MapPin size={14} />
                        {t.location}
                      </dt>
                      <dd>{p.location}</dd>
                    </div>
                  )}
                  {p.minOrder && (
                    <div>
                      <dt>{t.minOrder}</dt>
                      <dd>{p.minOrder}</dd>
                    </div>
                  )}
                </dl>
                <Link
                  href={`/kontakt?oferta=${encodeURIComponent(p.title)}`}
                  className="text-link"
                >
                  {t.inquire}
                  <ArrowUpRight size={18} />
                </Link>
              </div>
            </RevealArticle>
          ))}
        </div>
      )}
    </section>
  );
}
export default function Produkty() {
  return <Redirect to="/rozwiazania-dla-biznesu" />;
}
