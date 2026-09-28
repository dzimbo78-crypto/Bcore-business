import { useSearch } from "wouter";
import { isStandalonePreview } from "@/lib/preview";
import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowUpRight,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useLanguage } from "@/i18n/context";
import { advisory, email, phone, serviceMeta } from "@/data/advisory";
import { LegalModal } from "@/components/LegalModal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
export default function Kontakt() {
  const { lang } = useLanguage(),
    t = advisory[lang],
    search = useSearch();
  const [status, setStatus] = useState<
      "idle" | "sending" | "success" | "error"
    >("idle"),
    [legal, setLegal] = useState(false);
  const [subject, setSubject] = useState(""),
    [category, setCategory] = useState("");
  useEffect(() => {
    const params = new URLSearchParams(search);
    const id = params.get("obszar");
    const i = serviceMeta.findIndex((s) => s.id === id);
    if (i >= 0) {
      setSubject(t.services[i].title);
      setCategory(t.services[i].title);
    } else if (params.get("oferta"))
      setSubject(params.get("oferta")!.slice(0, 200));
  }, [lang, search]);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (isStandalonePreview) return;
    if (!form.reportValidity() || status === "sending") return;
    setStatus("sending");
    const values = Object.fromEntries(new FormData(form));
    try {
      const response = await fetch(
        `${import.meta.env.BASE_URL}api/send-email`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...values, category }),
          signal: AbortSignal.timeout(20000),
        },
      );
      const body = await response.json();
      if (!response.ok || body.ok !== true) throw new Error("Send failed");
      setStatus("success");
      form.reset();
      setSubject("");
    } catch {
      setStatus("error");
    }
  }
  return (
    <>
      <section className="contact-page container">
        <p className="eyebrow">LET’S CONNECT</p>
        <div className="contact-grid">
          <div className="contact-info">
            <h1>{t.contactTitle}</h1>
            <p>{t.contactDesc}</p>
            <div className="contact-details">
              <a href={`mailto:${email}`}>
                <Mail size={20} />
                <span>{email}</span>
                <ArrowUpRight size={18} />
              </a>
              <a href="tel:+4591789277">
                <Phone size={20} />
                <span>{phone}</span>
                <ArrowUpRight size={18} />
              </a>
            </div>
            <div className="contact-locations">POLAND / DENMARK / EUROPE</div>
          </div>
          <form className="contact-form" onSubmit={submit}>
            <div className="form-row">
              <label>
                {t.name} *
                <Input
                  name="name"
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={120}
                  placeholder={lang === "pl" ? "Jak się nazywasz?" : t.name}
                />
              </label>
              <label>
                {t.mail} *
                <Input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  placeholder="you@company.com"
                />
              </label>
            </div>
            <label>
              {t.subject} *
              <Input
                name="subject"
                required
                minLength={3}
                maxLength={200}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={t.subject}
              />
            </label>
            <label>
              {t.message} *
              <Textarea
                name="message"
                required
                minLength={10}
                maxLength={10000}
                rows={6}
                placeholder={t.projectPlaceholder}
              />
            </label>
            <div className="honeypot" aria-hidden="true">
              <label>
                Website
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            <p className="form-note">
              {t.privacyNote}{" "}
              <button type="button" onClick={() => setLegal(true)}>
                {t.privacy}
              </button>
            </p>
            {isStandalonePreview && (
              <p className="form-note">
                {lang === "pl"
                  ? "Podgląd lokalny — wysyłka formularza wymaga wdrożenia aplikacji i konfiguracji Resend."
                  : "Local preview — sending requires the deployed app and Resend configuration."}
              </p>
            )}
            <div className="form-submit">
              <button
                className="button button-copper"
                type="submit"
                disabled={status === "sending" || isStandalonePreview}
              >
                {status === "sending" ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    {t.sending}
                  </>
                ) : (
                  <>
                    {t.send}
                    <ArrowUpRight size={18} />
                  </>
                )}
              </button>
              <span>{t.required}</span>
            </div>
            {status === "success" && (
              <p className="form-status success" role="status">
                <CheckCircle2 size={20} />
                {t.success}
              </p>
            )}
            {status === "error" && (
              <p className="form-status error" role="alert">
                <AlertCircle size={20} />
                {t.failure}
              </p>
            )}
          </form>
        </div>
      </section>
      <LegalModal
        open={legal}
        initialTab="privacy"
        onClose={() => setLegal(false)}
      />
    </>
  );
}
