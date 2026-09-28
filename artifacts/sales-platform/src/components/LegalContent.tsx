import { useLanguage } from "@/i18n/context";
import { legalCopy } from "@/data/legal";
import { legalConfig, legalIdentityComplete } from "@/data/legal-config";
export type LegalTab = "privacy" | "terms";
export function LegalContent({ type }: { type: LegalTab }) {
  const { lang } = useLanguage(),
    t = legalCopy[lang];
  const sections = type === "privacy" ? t.privacySections : t.termsSections;
  return (
    <div className="legal-content">
      <p className="legal-lead">
        {type === "privacy" ? t.privacyIntro : t.termsIntro}
      </p>
      <section className="legal-identity">
        <h3>{t.identity}</h3>
        {!legalIdentityComplete && <p className="legal-draft">{t.draft}</p>}
        <dl>
          <div>
            <dt>{t.operator}</dt>
            <dd>{legalConfig.operatorName || t.missing}</dd>
          </div>
          <div>
            <dt>{t.status}</dt>
            <dd>{t.statusValue}</dd>
          </div>
          <div>
            <dt>E-mail</dt>
            <dd>
              <a href={`mailto:${legalConfig.email}`}>{legalConfig.email}</a>
            </dd>
          </div>
          <div>
            <dt>Tel.</dt>
            <dd>
              <a href={`tel:${legalConfig.phone.replace(/\s/g, "")}`}>
                {legalConfig.phone}
              </a>
            </dd>
          </div>
        </dl>
      </section>
      {sections.map((section) => (
        <section className="legal-section" key={section.title}>
          <h3>{section.title}</h3>
          {section.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </section>
      ))}
      {type === "privacy" && (
        <section className="legal-section legal-resources">
          <h3>{t.resources}</h3>
          <ul>
            <li>
              <a
                href="https://render.com/dpa"
                target="_blank"
                rel="noopener noreferrer"
              >
                Render — Data Processing Addendum
              </a>
            </li>
            <li>
              <a
                href="https://resend.com/legal/dpa"
                target="_blank"
                rel="noopener noreferrer"
              >
                Resend — Data Processing Addendum
              </a>
            </li>
            <li>
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google — Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="https://www.datatilsynet.dk"
                target="_blank"
                rel="noopener noreferrer"
              >
                Datatilsynet
              </a>{" "}
              ·{" "}
              <a
                href="https://uodo.gov.pl"
                target="_blank"
                rel="noopener noreferrer"
              >
                UODO
              </a>
            </li>
          </ul>
        </section>
      )}
    </div>
  );
}
