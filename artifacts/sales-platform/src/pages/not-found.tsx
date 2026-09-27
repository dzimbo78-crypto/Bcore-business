import { Link } from "wouter";
import { PageLayout } from "@/components/layout/PageLayout";
import { useLanguage } from "@/i18n/context";
export default function NotFound() {
  const { lang } = useLanguage();
  return (
    <PageLayout>
      <section className="container not-found">
        <span className="eyebrow">404</span>
        <h1>{lang === "pl" ? "Tego adresu nie ma." : "Page not found."}</h1>
        <Link className="button button-copper" href="/">
          {lang === "pl" ? "Wróć na stronę główną" : "Back to home"}
        </Link>
      </section>
    </PageLayout>
  );
}
