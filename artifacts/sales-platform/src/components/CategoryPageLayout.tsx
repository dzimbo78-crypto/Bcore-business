import { ReactNode, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLanguage } from "@/i18n/context";
import { useT } from "@/i18n/translations";

type TargetAudience = { title: string };
type Benefit = { title: string; description: string };
type ProcessStep = { title: string; description: string };
type GalleryImage = { src: string; alt: string; label?: string };

type CategoryPageLayoutProps = {
  heroImage: string;
  title: string;
  subtitle: string;
  ctaLabel?: string;
  topSection?: ReactNode;
  descriptionNode: ReactNode;
  targetAudience: TargetAudience[];
  benefits: Benefit[];
  processSteps: ProcessStep[];
  formOptions: string[];
  formTypeLabel?: string;
  galleryImages?: GalleryImage[];
  extraSections?: ReactNode;
};

export function CategoryPageLayout({
  heroImage,
  title,
  subtitle,
  ctaLabel,
  topSection,
  descriptionNode,
  targetAudience,
  benefits,
  processSteps,
  formOptions,
  formTypeLabel,
  galleryImages,
  extraSections,
}: CategoryPageLayoutProps) {
  const { lang } = useLanguage();
  const t = useT(lang);
  const c = t.common;

  const formSchema = z.object({
    name: z.string().min(2, c.validName),
    email: z.string().email(c.validEmail),
    phone: z.string().min(9, c.validPhone),
    selection: z.string().min(1, c.validSelection),
    message: z.string().min(10, c.validMessage),
  });

  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", phone: "", selection: "", message: "" },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          phone: values.phone,
          category: values.selection,
          message: values.message,
        }),
      });
    } catch {
    } finally {
      setIsSubmitting(false);
      toast({ title: c.toastTitle, description: c.toastDesc });
      form.reset();
    }
  };

  const scrollToForm = () => {
    const el = document.getElementById("contact-form");
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroImage} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/40 mix-blend-multiply" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center md:text-left pt-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-6">{title}</h1>
            <p className="text-xl md:text-2xl text-white/90 mb-10 text-balance leading-relaxed">{subtitle}</p>
            <Button size="lg" className="rounded-full px-8 text-lg" onClick={scrollToForm}>
              {ctaLabel ?? c.requestQuote} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {topSection}

      {/* Description */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {descriptionNode}
          </motion.div>
        </div>
      </section>

      {/* Target Audience */}
      {targetAudience.length > 0 && (
        <section className="py-24 bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-display font-bold text-foreground">{c.forWhom}</h2>
              <div className="w-20 h-1 bg-accent mx-auto mt-6 rounded-full" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {targetAudience.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-border/50 text-center flex items-center justify-center min-h-[100px]"
                >
                  <span className="font-semibold text-foreground text-lg">{item.title}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Benefits */}
      {benefits.length > 0 && (
        <section className="py-24 bg-primary text-primary-foreground">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-display font-bold text-white">{c.whyUs}</h2>
              <div className="w-20 h-1 bg-accent mx-auto mt-6 rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex gap-4"
                >
                  <CheckCircle className="w-8 h-8 text-accent shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-white">{benefit.title}</h3>
                    <p className="text-white/70 leading-relaxed">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Process */}
      {processSteps.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-display font-bold text-foreground">{c.process}</h2>
              <div className="w-20 h-1 bg-accent mx-auto mt-6 rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {processSteps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative"
                >
                  <div className="text-6xl font-display font-bold text-secondary-foreground/10 absolute -top-8 -left-4 z-0">
                    0{i + 1}
                  </div>
                  <div className="relative z-10 pt-4">
                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Extra Sections */}
      {extraSections}

      {/* Gallery */}
      {galleryImages && galleryImages.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-display font-bold text-foreground">{c.gallery}</h2>
              <div className="w-20 h-1 bg-accent mx-auto mt-6 rounded-full" />
              <p className="mt-6 text-muted-foreground text-lg max-w-2xl mx-auto">{c.galleryDesc}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.97 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group relative rounded-2xl overflow-hidden shadow-sm border border-border/50 aspect-[4/3] bg-secondary"
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {img.label && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary/90 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white font-medium text-sm">{img.label}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Form */}
      <section id="contact-form" className="py-24 bg-secondary">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-border/50">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-display font-bold text-foreground mb-4">{c.contactUs}</h2>
              <p className="text-muted-foreground">{c.contactDesc}</p>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{c.name}</FormLabel>
                      <FormControl>
                        <Input placeholder={c.namePlaceholder} className="bg-secondary/50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{c.phone}</FormLabel>
                      <FormControl>
                        <Input placeholder={c.phonePlaceholder} className="bg-secondary/50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{c.email}</FormLabel>
                      <FormControl>
                        <Input placeholder={c.emailPlaceholder} className="bg-secondary/50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="selection" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{formTypeLabel ?? c.message}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-secondary/50">
                            <SelectValue placeholder={c.select} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {formOptions.map((opt) => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="message" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{c.message}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={c.messagePlaceholder}
                        className="min-h-[120px] bg-secondary/50 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" size="lg" className="w-full rounded-xl text-lg h-14" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" />{c.sending}</>
                  ) : c.sendInquiry}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </section>
    </div>
  );
}
