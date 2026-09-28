import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { LegalContent, type LegalTab } from "@/components/LegalContent";
import { useLanguage } from "@/i18n/context";
import { legalCopy } from "@/data/legal";
import { legalConfig } from "@/data/legal-config";
export default function LegalPage({ type }: { type: LegalTab }) {
  const { lang } = useLanguage(),
    t = legalCopy[lang];
  return (
    <>
      <article className="legal-page container">
        <Link href="/" className="back-link">
          <ArrowLeft size={16} />
          B-CORE
        </Link>
        <p className="eyebrow">INFORMATION & TRANSPARENCY</p>
        <h1>{t[type]}</h1>
        <p className="legal-date">
          {t.updated}: {legalConfig.updated}
        </p>
        <LegalContent type={type} />
      </article>
    </>
  );
}
