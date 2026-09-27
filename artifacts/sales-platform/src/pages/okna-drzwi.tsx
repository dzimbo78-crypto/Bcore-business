import { motion } from "framer-motion";
import { Shield, Flame, Volume2, Thermometer, Award, ExternalLink, MapPin } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { CategoryPageLayout } from "@/components/CategoryPageLayout";
import { useLanguage } from "@/i18n/context";
import { useT } from "@/i18n/translations";

const BASE = import.meta.env.BASE_URL;

const specialParamIcons = [Flame, Shield, Volume2, Thermometer];

const referencesAll = [
  "Sąd i Prokuratura w Kwidzynie",
  "Sąd Rejonowy w Zambrowie",
  "Szkoła Zawodowa w Gdyni",
  "Aparthotel w Krynicy Morskiej",
  "Zespół Pałacowy w Mortęgach",
  "Aparthotel w Zakopanem",
  "Zespół domków w Gliczarowie Górnym",
  "Ośrodek Szkoleniowy w Nidzicy",
  "Obiekt wielorodzinny TBS w Kwidzynie",
  "Koszary w Dęblinie",
  "Bank Spółdzielczy — Lubawa i Mikołajki",
  "Ambasada Polski w Wilnie",
  "Obiekty apartamentowe 5★ — Kensington Row, Londyn",
  "Pensjonaty na Majorce",
  "Kamienice w Berlinie i Dreźnie",
  "V Liceum Prywatne w Krakowie",
];

const gallerySrcs = [
  "drzwi-db510-dom.jpg",
  "hotel-bohema-bydgoszcz.jpg",
  "okno-lukowe.jpg",
  "retro-drzwi-kamienica.jpg",
  "sad-kwidzyn-drzwi.jpg",
  "drzwi-pub-ral6005.jpg",
];

export default function OknaDrzwi() {
  const { lang } = useLanguage();
  const t = useT(lang);
  const o = t.okna;

  const galleryImages = o.galleryImages.map((img, i) => ({
    src: `${BASE}images/${gallerySrcs[i]}`,
    alt: img.alt,
    label: img.label,
  }));

  return (
    <PageLayout>
      <CategoryPageLayout
        heroImage={`${BASE}images/hero-windows.png`}
        title={o.title}
        subtitle={o.subtitle}
        descriptionNode={
          <>
            <h2 className="text-3xl font-display font-bold mb-6 text-foreground">{o.descH2}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">{o.desc1}</p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              {o.desc2.split(o.desc2Bold)[0]}
              <strong className="text-foreground">{o.desc2Bold}</strong>
              {o.desc2.split(o.desc2Bold)[1]}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">{o.desc3}</p>
          </>
        }
        targetAudience={o.audience.map((a) => ({ title: a }))}
        benefits={o.benefits}
        processSteps={o.processSteps}
        formOptions={o.formOptions}
        formTypeLabel={o.formTypeLabel}
        galleryImages={galleryImages}
        extraSections={
          <>
            {/* Material Types */}
            <section className="py-24 bg-secondary">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-3xl font-display font-bold text-foreground">{o.matTitle}</h2>
                  <div className="w-20 h-1 bg-accent mx-auto mt-6 rounded-full" />
                  <p className="mt-6 text-muted-foreground text-lg max-w-2xl mx-auto">{o.matDesc}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {o.materials.map((mat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.08 }}
                      className="bg-white rounded-2xl p-7 border border-border/50 shadow-sm hover:shadow-md hover:border-accent/40 transition-all duration-300"
                    >
                      <h3 className="text-xl font-bold mb-3 text-foreground">{mat.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{mat.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Special Parameters */}
            <section className="py-24 bg-primary text-primary-foreground">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-3xl font-display font-bold text-white">{o.specTitle}</h2>
                  <div className="w-20 h-1 bg-accent mx-auto mt-6 rounded-full" />
                  <p className="mt-6 text-white/70 text-lg max-w-2xl mx-auto">{o.specDesc}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {o.specialParams.map((param, i) => {
                    const Icon = specialParamIcons[i];
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="flex gap-5 p-7 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                      >
                        <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
                          <Icon className="w-7 h-7 text-accent" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold mb-2 text-white">{param.title}</h3>
                          <p className="text-white/70 leading-relaxed text-sm">{param.desc}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
                  {o.certs.map((cert) => (
                    <div key={cert} className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2">
                      <Award className="w-4 h-4 text-accent" />
                      <span className="text-white text-sm font-medium">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* References */}
            <section className="py-24 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-3xl font-display font-bold text-foreground">{o.refsTitle}</h2>
                  <div className="w-20 h-1 bg-accent mx-auto mt-6 rounded-full" />
                  <p className="mt-6 text-muted-foreground text-lg max-w-2xl mx-auto">{o.refsDesc}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {referencesAll.map((ref, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      className="flex items-start gap-3 p-4 rounded-xl border border-border/50 bg-secondary/50 hover:bg-white hover:shadow-sm transition-all duration-200"
                    >
                      <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground font-medium leading-snug">{ref}</span>
                    </motion.div>
                  ))}
                </div>
                <p className="text-center text-muted-foreground text-sm mt-8">{o.refsMore}</p>
              </div>
            </section>

            {/* Catalogs */}
            <section className="py-16 bg-secondary">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-display font-bold text-foreground">{o.catTitle}</h2>
                  <div className="w-20 h-1 bg-accent mx-auto mt-6 rounded-full" />
                  <p className="mt-6 text-muted-foreground text-lg max-w-xl mx-auto">{o.catDesc}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {o.catalogs.map((cat, i) => (
                    <a
                      key={i}
                      href={cat.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between gap-4 bg-white rounded-2xl px-6 py-5 border border-border/50 shadow-sm hover:shadow-md hover:border-accent/50 transition-all duration-300"
                    >
                      <span className="font-medium text-foreground group-hover:text-primary transition-colors">{cat.label}</span>
                      <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            </section>
          </>
        }
      />
    </PageLayout>
  );
}
