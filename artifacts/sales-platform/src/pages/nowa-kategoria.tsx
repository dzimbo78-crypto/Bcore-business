import { PageLayout } from "@/components/layout/PageLayout";
import { motion } from "framer-motion";
import { ArrowRight, Layers } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NowaKategoria() {
  return (
    <PageLayout>
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-primary pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-foreground/5 via-primary to-primary" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-white/10 mb-8">
              <Layers className="w-10 h-10 text-accent" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              Rozwiązania specjalistyczne
            </h1>
            
            <div className="w-24 h-1 bg-accent mx-auto mb-8 rounded-full" />
            
            <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed text-balance">
              Ta kategoria jest aktualnie rozwijana. Wkrótce zostanie udostępniona pełna oferta zaawansowanych rozwiązań branżowych klasy premium.
            </p>
            
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-white mb-4">Masz nietypowe zapytanie?</h3>
              <p className="text-white/70 mb-8">
                Już teraz możesz skontaktować się z nami w sprawie indywidualnego projektu. 
                Znajdziemy rozwiązanie dopasowane do Twoich potrzeb.
              </p>
              <Button asChild size="lg" className="rounded-full px-8 bg-accent hover:bg-accent/90 text-primary font-semibold">
                <Link href="/kontakt">
                  Napisz do nas <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
