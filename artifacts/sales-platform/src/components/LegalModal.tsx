import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ArrowUpRight, FileText, Shield, X } from "lucide-react";
import { useLanguage } from "@/i18n/context";
import { legalCopy } from "@/data/legal";
import { legalConfig } from "@/data/legal-config";
import { LegalContent, type LegalTab } from "./LegalContent";
export function LegalModal({
  open,
  initialTab = "privacy",
  onClose,
}: {
  open: boolean;
  initialTab?: LegalTab;
  onClose: () => void;
}) {
  const [tab, setTab] = useState(initialTab),
    { lang } = useLanguage(),
    t = legalCopy[lang];
  useEffect(() => {
    if (open) setTab(initialTab);
  }, [open, initialTab]);
  const Icon = tab === "privacy" ? Shield : FileText;
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <DialogContent className="legal-dialog" aria-describedby={undefined}>
        <div className="legal-header">
          <div className="legal-heading">
            <Icon size={22} />
            <div>
              <DialogTitle>{t[tab]}</DialogTitle>
              <p>
                {t.updated}: {legalConfig.updated}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="icon-button"
          >
            <X size={17} />
          </button>
        </div>
        <nav
          className="legal-tabs"
          aria-label={lang === "pl" ? "Dokumenty serwisu" : "Website documents"}
        >
          {(["privacy", "terms"] as const).map((value) => (
            <button
              type="button"
              key={value}
              onClick={() => setTab(value)}
              aria-current={value === tab ? "page" : undefined}
            >
              {t[value]}
            </button>
          ))}
        </nav>
        <div className="legal-scroll" key={tab}>
          <LegalContent type={tab} />
        </div>
        <div className="legal-actions">
          <Link
            href={tab === "privacy" ? "/polityka-prywatnosci" : "/regulamin"}
            onClick={onClose}
          >
            {t.fullPage}
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
