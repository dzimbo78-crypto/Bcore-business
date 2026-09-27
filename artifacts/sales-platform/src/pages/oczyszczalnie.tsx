import { motion } from "framer-motion";
import { CheckCircle2, Building2, Factory, Hotel, TreePine, School, Wrench, Shield, TrendingUp, Clock, Wifi, AlertTriangle } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { CategoryPageLayout } from "@/components/CategoryPageLayout";
import { useLanguage } from "@/i18n/context";
import { useT } from "@/i18n/translations";

const BASE = import.meta.env.BASE_URL;

const areaIcons = [Building2, Factory, Hotel, School, Factory, TreePine];
const omIcons = [Wrench, Shield, Wifi];

export default function Oczyszczalnie() {
  const { lang } = useLanguage();
  const t = useT(lang);
  const o = t.oczyszczalnie;

  return (
    <PageLayout>
      <CategoryPageLayout
        heroImage={`${BASE}images/hero-water.png`}
        title={o.title}
        subtitle={o.subtitle}
        descriptionNode={
          <>
            <h2 className="text-3xl font-display font-bold mb-6 text-foreground">{o.descH2}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              {o.desc1.split(o.desc1Bold)[0]}
              <strong className="text-foreground">{o.desc1Bold}</strong>
              {o.desc1.split(o.desc1Bold)[1]}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              {o.desc2.split(o.desc2Bold)[0]}
              <strong className="text-foreground">{o.desc2Bold}</strong>
              {o.desc2.split(o.desc2Bold)[1]}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {o.desc3.split(o.desc3Bold)[0]}
              <strong className="text-foreground">{o.desc3Bold}</strong>
              {o.desc3.split(o.desc3Bold)[1]}
            </p>
          </>
        }
        targetAudience={o.audience.map((a) => ({ title: a }))}
        benefits={o.benefits}
        processSteps={o.processSteps}
        formOptions={o.formOptions}
        formTypeLabel={o.formTypeLabel}
        extraSections={
          <>
            {/* Application areas */}
            <section className="py-24 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-3xl font-display font-bold text-foreground">{o.appAreasTitle}</h2>
                  <div className="w-20 h-1 bg-accent mx-auto mt-6 rounded-full" />
                  <p className="mt-6 text-muted-foreground text-lg max-w-2xl mx-auto">{o.appAreasDesc}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {o.appAreas.map((area, i) => {
                    const Icon = areaIcons[i];
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="flex gap-5 p-6 rounded-2xl border border-border/50 bg-secondary/50 hover:bg-white hover:shadow-md transition-all duration-300"
                      >
                        <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center shrink-0">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-2 text-foreground">{area.title}</h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">{area.desc}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Technical highlights */}
                <div className="mt-20 bg-primary rounded-3xl p-10 md:p-16 text-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-display font-bold mb-6">{o.paramsTitle}</h3>
                      <ul className="space-y-4">
                        {o.params.map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                            <span className="text-white/90 text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      {o.stats.map((stat, i) => (
                        <div key={i} className="text-center p-6 rounded-2xl bg-white/5 border border-white/10">
                          <p className="text-3xl font-display font-bold text-accent mb-2">{stat.value}</p>
                          <p className="text-white/70 text-sm">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* O&M models */}
            <section className="py-24 bg-secondary">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-3xl font-display font-bold text-foreground">{o.omTitle}</h2>
                  <div className="w-20 h-1 bg-accent mx-auto mt-6 rounded-full" />
                  <p className="mt-6 text-muted-foreground text-lg max-w-2xl mx-auto">{o.omDesc}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {o.omModels.map((model, i) => {
                    const Icon = omIcons[i];
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="bg-white rounded-2xl p-8 border border-border/50 shadow-sm hover:shadow-md hover:border-accent/40 transition-all duration-300"
                      >
                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5">
                          <Icon className="w-6 h-6 text-accent" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-foreground">{model.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">{model.desc}</p>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Timeline */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="mt-12 bg-white rounded-3xl p-8 md:p-12 border border-border/50 flex flex-col md:flex-row gap-8 items-center"
                >
                  <div className="flex items-center gap-5 shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
                      <Clock className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-4xl font-display font-bold text-primary">{o.timelineWeeks}</p>
                      <p className="text-muted-foreground font-medium">{o.timelineLabel}</p>
                    </div>
                  </div>
                  <div className="h-px md:h-16 w-full md:w-px bg-border" />
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {o.timelineDesc.split(o.timelineDescBold)[0]}
                    <strong className="text-foreground">{o.timelineDescBold}</strong>
                    {o.timelineDesc.split(o.timelineDescBold)[1]}
                  </p>
                </motion.div>
              </div>
            </section>

            {/* References & Limitations */}
            <section className="py-24 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-accent" />
                      </div>
                      <span className="text-sm font-semibold text-accent uppercase tracking-wide">{o.refsBadge}</span>
                    </div>
                    <h2 className="text-3xl font-display font-bold text-foreground mb-6">{o.refsTitle}</h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">{o.refsDesc}</p>
                    <ul className="space-y-3">
                      {o.refsList.map((item, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                          <span className="text-foreground text-sm font-medium">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                      </div>
                      <span className="text-sm font-semibold text-red-500 uppercase tracking-wide">{o.limBadge}</span>
                    </div>
                    <h2 className="text-3xl font-display font-bold text-foreground mb-6">{o.limTitle}</h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">{o.limDesc}</p>
                    <ul className="space-y-3">
                      {o.limitations.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 p-4 rounded-xl bg-red-50/50 border border-red-100">
                          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                          <span className="text-foreground text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 text-muted-foreground text-sm">{o.limNote}</p>
                  </div>
                </div>
              </div>
            </section>
          </>
        }
      />
    </PageLayout>
  );
}
