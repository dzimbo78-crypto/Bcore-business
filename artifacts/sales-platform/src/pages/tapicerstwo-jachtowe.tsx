import { motion } from "framer-motion";
import { Anchor, Award, Cog, Star, ExternalLink } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { CategoryPageLayout } from "@/components/CategoryPageLayout";
import { useLanguage } from "@/i18n/context";
import { useT } from "@/i18n/translations";

const BASE = import.meta.env.BASE_URL;

const techFeatureIcons = [Award, Star, Cog, Anchor];

export default function TapicerstwoJachtowe() {
  const { lang } = useLanguage();
  const t = useT(lang);
  const y = t.yacht;

  const galleryImages = y.galleryImages.map((img, i) => ({
    src: `${BASE}images/${["yacht-fotel-sternika.png","yacht-siedzenie-zewnetrzne.png","yacht-wnetrze-kabiny.png","yacht-fotele-kinowe.png","yacht-bimini.png","hero-yacht.png"][i]}`,
    alt: img.alt,
    label: img.label,
  }));

  return (
    <PageLayout>
      <CategoryPageLayout
        heroImage={`${BASE}images/hero-yacht.png`}
        title={y.title}
        subtitle={y.subtitle}
        descriptionNode={
          <>
            <h2 className="text-3xl font-display font-bold mb-6 text-foreground">{y.descH2}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">{y.desc1}</p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              {y.desc2.split(y.desc2Bold)[0]}
              <strong className="text-foreground">{y.desc2Bold}</strong>
              {y.desc2.split(y.desc2Bold)[1]}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {y.desc3.split(y.desc3Bold)[0]}
              <strong className="text-foreground">{y.desc3Bold}</strong>
              {y.desc3.split(y.desc3Bold).slice(1).join(y.desc3Bold).split(y.desc3Bold2)[0]}
              <strong className="text-foreground">{y.desc3Bold2}</strong>
              {y.desc3.split(y.desc3Bold2)[1]}
            </p>
          </>
        }
        targetAudience={y.audience.map((a) => ({ title: a }))}
        benefits={y.benefits}
        processSteps={y.processSteps}
        formOptions={y.formOptions}
        formTypeLabel={y.formTypeLabel}
        galleryImages={galleryImages}
        extraSections={
          <>
            {/* Stats banner */}
            <section className="py-16 bg-primary text-primary-foreground">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {y.stats.map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="text-center"
                    >
                      <p className="text-4xl md:text-5xl font-display font-bold text-accent mb-2">{stat.value}</p>
                      <p className="text-white/70 text-sm">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Product categories */}
            <section className="py-24 bg-secondary">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-3xl font-display font-bold text-foreground">{y.productsTitle}</h2>
                  <div className="w-20 h-1 bg-accent mx-auto mt-6 rounded-full" />
                  <p className="mt-6 text-muted-foreground text-lg max-w-2xl mx-auto">{y.productsDesc}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {y.products.map((cat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.08 }}
                      className="bg-white rounded-2xl p-7 border border-border/50 shadow-sm hover:shadow-md hover:border-accent/40 transition-all duration-300"
                    >
                      <div className="text-4xl mb-4">{cat.icon}</div>
                      <h3 className="text-xl font-bold mb-3 text-foreground">{cat.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{cat.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Reference yachts */}
            <section className="py-24 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-3xl font-display font-bold text-foreground">{y.yachtsTitle}</h2>
                  <div className="w-20 h-1 bg-accent mx-auto mt-6 rounded-full" />
                  <p className="mt-6 text-muted-foreground text-lg max-w-2xl mx-auto">{y.yachtsDesc}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {y.yachts.map((yacht, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: i === 0 ? -20 : 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                      className="group relative bg-primary rounded-3xl p-8 md:p-10 overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-48 h-48 bg-white/3 rounded-full -translate-y-1/2 translate-x-1/2" />
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                          <Anchor className="w-5 h-5 text-accent" />
                          <span className="text-white/60 text-sm font-medium">{yacht.spec}</span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">{yacht.name}</h3>
                        <p className="text-white/70 leading-relaxed mb-8">{yacht.desc}</p>
                        <a
                          href={yacht.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full px-6 py-3 text-sm font-medium transition-colors"
                        >
                          {y.seeYacht} <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Technology highlight */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="mt-12 bg-secondary rounded-3xl p-8 md:p-12 border border-border/50"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                          <Cog className="w-5 h-5 text-accent" />
                        </div>
                        <span className="text-sm font-semibold text-accent uppercase tracking-wide">{y.techBadge}</span>
                      </div>
                      <h3 className="text-2xl font-display font-bold text-foreground mb-4">{y.techTitle}</h3>
                      <p className="text-muted-foreground leading-relaxed">{y.techDesc}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {y.techFeatures.map((label, i) => {
                        const Icon = techFeatureIcons[i];
                        return (
                          <div key={i} className="flex flex-col items-center text-center p-5 rounded-2xl bg-white border border-border/50">
                            <Icon className="w-7 h-7 text-accent mb-3" />
                            <span className="text-sm font-medium text-foreground">{label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>
          </>
        }
      />
    </PageLayout>
  );
}
