import { motion } from "framer-motion";
import { PageLayout } from "@/components/layout/PageLayout";
import { CategoryPageLayout } from "@/components/CategoryPageLayout";
import { useLanguage } from "@/i18n/context";
import { useT } from "@/i18n/translations";
import { TrendingUp, MapPin, Search, Users } from "lucide-react";

const BASE = import.meta.env.BASE_URL;

export default function Nieruchomosci() {
  const { lang } = useLanguage();
  const t = useT(lang);
  const re = t.nieruchomosci;


  return (
    <PageLayout>
      <CategoryPageLayout
        heroImage={`${BASE}images/hero-nieruchomosci.png`}
        title={re.title}
        subtitle={re.subtitle}
        ctaLabel={re.ctaLabel}
        topSection={
          <section className="py-16 bg-secondary">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 text-accent text-sm font-semibold mb-6">
                  <Search className="w-4 h-4" />
                  {re.offMarketTitle}
                </div>
                <p className="text-muted-foreground text-xl leading-relaxed max-w-3xl mx-auto">{re.offMarketDesc}</p>
              </motion.div>
            </div>
          </section>
        }
        descriptionNode={
          <>
            <h2 className="text-3xl font-display font-bold mb-6 text-foreground">{re.descH2}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">{re.desc1}</p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              {re.desc2.replace(re.desc2Bold, "")}{" "}
              <strong className="text-foreground">{re.desc2Bold}</strong>.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">{re.desc3}</p>
          </>
        }
        targetAudience={re.audience.map((a) => ({ title: a }))}
        benefits={re.benefits}
        processSteps={[]}
        formOptions={re.formOptions}
        formTypeLabel={re.formTypeLabel}
        extraSections={
          <>
            {/* Investment focus areas */}
            <section className="py-24 bg-secondary">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-3xl font-display font-bold text-foreground">{re.typesTitle}</h2>
                  <div className="w-20 h-1 bg-accent mx-auto mt-6 rounded-full" />
                  <p className="mt-6 text-muted-foreground text-lg max-w-2xl mx-auto">{re.typesDesc}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {re.types.map((type, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.08 }}
                      className="bg-white rounded-2xl p-7 border border-border/50 shadow-sm hover:shadow-md hover:border-accent/40 transition-all duration-300"
                    >
                      <div className="text-4xl mb-4">{type.icon}</div>
                      <h3 className="text-xl font-bold mb-3 text-foreground">{type.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{type.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Investment sourcing / Scouting */}
            <section className="py-24 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 text-accent text-sm font-semibold mb-6">
                    <Search className="w-4 h-4" />
                    {re.scoutingBadge}
                  </div>
                  <h2 className="text-3xl font-display font-bold text-foreground mb-4">{re.scoutingTitle}</h2>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{re.scoutingDesc}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {re.scoutingPoints.map((point, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.08 }}
                      className="bg-secondary rounded-2xl p-7 border border-border/50 hover:border-accent/40 hover:shadow-md transition-all duration-300"
                    >
                      <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-5">
                        <Search className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold mb-2 text-foreground">{point.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{point.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Who we are */}
            <section className="py-20 bg-primary text-primary-foreground">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-white/80 text-sm font-medium mb-8">
                    <Users className="w-4 h-4 text-accent" />
                    {re.whoWeAreTitle}
                  </div>
                  <p className="text-white/80 text-lg leading-relaxed mb-4 max-w-3xl mx-auto">{re.whoWeAreDesc1}</p>
                  <p className="text-white/80 text-lg leading-relaxed max-w-3xl mx-auto">{re.whoWeAreDesc2}</p>
                </motion.div>
              </div>
            </section>

            {/* Stats / Why Poland */}
            <section className="py-20 bg-secondary">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-14">
                  <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 text-accent text-sm font-semibold mb-6">
                    <TrendingUp className="w-4 h-4" />
                    {re.statsTitle}
                  </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                  {re.stats.map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-border/50 shadow-sm"
                    >
                      <span className="text-3xl md:text-4xl font-display font-bold text-accent mb-3">{stat.value}</span>
                      <span className="text-muted-foreground text-sm leading-snug">{stat.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Regional reach */}
            <section className="py-20 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 text-accent text-sm font-semibold mb-6">
                      <MapPin className="w-4 h-4" />
                      {re.regionalBadge}
                    </div>
                    <h2 className="text-3xl font-display font-bold text-foreground mb-6">{re.regionalTitle}</h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">{re.regionalDesc}</p>
                    <div className="grid grid-cols-2 gap-4">
                      {["Warszawa", "Wrocław", "Kraków", "Gdańsk / Gdynia", "Katowice", "Poznań"].map((city) => (
                        <div key={city} className="flex items-center gap-2 text-foreground font-medium">
                          <MapPin className="w-4 h-4 text-accent shrink-0" />
                          {city}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative"
                  >
                    <div className="rounded-3xl overflow-hidden shadow-xl border border-border/50 aspect-[4/3]">
                      <img
                        src={`${BASE}images/nieruchomosci-kamienica.png`}
                        alt={re.kamienicaCaption}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
                          <p className="text-white font-bold text-lg">{re.kamienicaCaption}</p>
                          <p className="text-white/70 text-sm">{re.kamienicaSubcaption}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Cooperation model */}
            <section className="py-20 bg-primary text-primary-foreground">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-white/80 text-sm font-medium mb-8">
                    <TrendingUp className="w-4 h-4 text-accent" />
                    {re.cooperationTitle}
                  </div>
                  <p className="text-white/80 text-lg leading-relaxed max-w-3xl mx-auto">{re.cooperationDesc}</p>
                </motion.div>
              </div>
            </section>

            {/* Scope of activity */}
            <section className="py-20 bg-secondary">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 text-accent text-sm font-semibold mb-6">
                    <TrendingUp className="w-4 h-4" />
                    {re.scopeTitle}
                  </div>
                  <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto italic border-l-4 border-accent/40 pl-6 text-left">
                    {re.scopeDesc}
                  </p>
                </motion.div>
              </div>
            </section>
          </>
        }
      />
    </PageLayout>
  );
}
