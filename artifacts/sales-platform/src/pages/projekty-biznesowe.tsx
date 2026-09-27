import { motion } from "framer-motion";
import { PageLayout } from "@/components/layout/PageLayout";
import { CategoryPageLayout } from "@/components/CategoryPageLayout";
import { useLanguage } from "@/i18n/context";
import { useT } from "@/i18n/translations";
import { TrendingUp, Briefcase, Users, Search } from "lucide-react";

const BASE = import.meta.env.BASE_URL;

export default function ProjektyBiznesowe() {
  const { lang } = useLanguage();
  const t = useT(lang);
  const pb = t.projektyBiznesowe;

  const pillars = [
    {
      icon: Search,
      label:
        lang === "pl"
          ? "Sprzedaż firm"
          : lang === "en"
          ? "Company sales"
          : lang === "da"
          ? "Virksomhedssalg"
          : "Unternehmensverkauf",
    },
    {
      icon: TrendingUp,
      label:
        lang === "pl"
          ? "Pozyskiwanie inwestorów"
          : lang === "en"
          ? "Investor sourcing"
          : lang === "da"
          ? "Investorsourcing"
          : "Investorensuche",
    },
    {
      icon: Users,
      label:
        lang === "pl"
          ? "Koordynacja procesu"
          : lang === "en"
          ? "Process coordination"
          : lang === "da"
          ? "Proceskoordination"
          : "Prozesskoordination",
    },
    {
      icon: Briefcase,
      label:
        lang === "pl"
          ? "Due diligence"
          : lang === "en"
          ? "Due diligence"
          : lang === "da"
          ? "Due diligence"
          : "Due Diligence",
    },
  ];

  return (
    <PageLayout>
      <CategoryPageLayout
        heroImage={`${BASE}images/hero-nieruchomosci.png`}
        title={pb.title}
        subtitle={pb.subtitle}
        ctaLabel={pb.ctaLabel}
        topSection={
          <section className="py-16 bg-secondary">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {pillars.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="flex flex-col items-center gap-3 text-center"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                      <item.icon className="w-7 h-7 text-accent" />
                    </div>
                    <span className="text-foreground font-semibold text-base leading-snug">
                      {item.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        }
        descriptionNode={
          <>
            <h2 className="text-3xl font-display font-bold mb-6 text-foreground">
              {pb.descH2}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              {pb.desc1}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              {pb.desc2.replace(pb.desc2Bold, "")}{" "}
              <strong className="text-foreground">{pb.desc2Bold}</strong>.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {pb.desc3}
            </p>
          </>
        }
        targetAudience={pb.audience.map((a) => ({ title: a }))}
        benefits={pb.benefits}
        processSteps={pb.processSteps}
        formOptions={pb.formOptions}
        formTypeLabel={pb.formTypeLabel}
        extraSections={
          <>
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
                    {pb.cooperationTitle}
                  </div>
                  <p className="text-white/80 text-lg leading-relaxed max-w-3xl mx-auto">
                    {pb.cooperationDesc}
                  </p>
                </motion.div>
              </div>
            </section>

            {/* Scope disclaimer */}
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
                    {pb.scopeTitle}
                  </div>
                  <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto italic border-l-4 border-accent/40 pl-6 text-left">
                    {pb.scopeDesc}
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
