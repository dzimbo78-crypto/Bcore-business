import { email, phone } from "./advisory";

/** Dane właściciela osobistej wizytówki. Bez numerów firmy i fikcyjnych danych rejestrowych.
 * Imię i nazwisko przyjęto na podstawie istniejącego adresu kontaktowego: sprawdź przed publikacją.
 * Są to dane publiczne — nie wpisuj haseł ani kluczy API. Zobacz LEGAL-SETUP.md.
 */
export const legalConfig = {
  operatorName: "Przemysław Bugajski",
  email,
  phone,
  updated: "2026-09-28",
};
export const legalIdentityComplete = Boolean(
  legalConfig.operatorName.trim() && legalConfig.email.trim(),
);
