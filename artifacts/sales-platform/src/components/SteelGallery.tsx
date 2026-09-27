import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/i18n/context";
import { advisory, imagePath } from "@/data/advisory";
export function SteelGallery() {
  const { lang } = useLanguage(),
    t = advisory[lang],
    s = t.services[3];
  const images = ["railing.webp", "fence.webp", "steel.webp"];
  return (
    <section className="steel-gallery container">
      <p className="eyebrow">STEEL & ARCHITECTURE</p>
      <Tabs defaultValue="0">
        <TabsList className="steel-tabs">
          {s.tags.map((tag, i) => (
            <TabsTrigger key={tag} value={String(i)}>
              {tag}
            </TabsTrigger>
          ))}
        </TabsList>
        {images.map((img, i) => (
          <TabsContent
            key={img}
            value={String(i)}
            className="steel-tab-content"
          >
            <figure>
              <img
                src={imagePath(img)}
                alt={s.tags[i]}
                width="1200"
                height="900"
                loading="lazy"
              />
              <figcaption>{t.inspiration}</figcaption>
            </figure>
            <div>
              <span className="eyebrow">0{i + 1} / DETAIL</span>
              <h2>{s.scope[i][0]}</h2>
              <p>{s.scope[i][1]}</p>
              <Link href="/kontakt?obszar=steel" className="text-link">
                {t.talk}
                <ArrowUpRight size={20} />
              </Link>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
