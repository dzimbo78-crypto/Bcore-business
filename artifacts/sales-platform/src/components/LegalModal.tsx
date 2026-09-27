import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X, Shield, FileText, ChevronRight } from "lucide-react";

type Tab = "privacy" | "terms";

type Props = {
  open: boolean;
  initialTab?: Tab;
  onClose: () => void;
};

export function LegalModal({ open, initialTab = "privacy", onClose }: Props) {
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <DialogContent className="legal-dialog" aria-describedby={undefined}>
        {initialTab === "privacy" ? (
          <PrivacyContent onClose={onClose} />
        ) : (
          <TermsContent onClose={onClose} />
        )}
      </DialogContent>
    </Dialog>
  );
}

function ModalHeader({
  icon: Icon,
  title,
  subtitle,
  onClose,
}: {
  icon: typeof Shield;
  title: string;
  subtitle: string;
  onClose: () => void;
}) {
  return (
    <div className="bg-primary text-white px-8 py-6 shrink-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2.5 rounded-xl">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <DialogTitle className="font-display font-bold text-xl">
              {title}
            </DialogTitle>
            <p className="text-white/50 text-xs mt-0.5">{subtitle}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="bg-white/10 hover:bg-white/20 transition-colors p-2 rounded-lg shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <ChevronRight className="w-4 h-4 text-accent shrink-0" />
        <h3 className="font-display font-semibold text-base text-foreground">
          {title}
        </h3>
      </div>
      <div className="pl-6 text-sm text-muted-foreground leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );
}

function PrivacyContent({ onClose }: { onClose: () => void }) {
  return (
    <>
      <ModalHeader
        icon={Shield}
        title="Polityka Prywatności"
        subtitle="B-CORE / Informacje o serwisie"
        onClose={onClose}
      />
      <div className="overflow-y-auto flex-1 px-8 py-6 text-sm">
        <p className="text-muted-foreground mb-6 text-sm leading-relaxed border-l-2 border-accent pl-4 bg-accent/5 py-3 pr-3 rounded-r-lg">
          Niniejsza Polityka Prywatności określa zasady przetwarzania i ochrony
          danych osobowych przekazywanych przez Użytkowników w związku z
          korzystaniem z serwisu internetowego B-CORE.
        </p>

        <Section title="Administrator danych osobowych">
          <p>
            Administratorem danych osobowych jest firma <strong>B-CORE</strong>,
            prowadząca działalność na terenie Danii. Kontakt z Administratorem
            możliwy jest pod adresem e-mail:{" "}
            <a
              href="mailto:przemyslaw.bugajski78@gmail.com"
              className="text-primary underline underline-offset-2"
            >
              przemyslaw.bugajski78@gmail.com
            </a>{" "}
            lub telefonicznie: <strong>+45 91 78 92 77</strong>.
          </p>
        </Section>

        <Section title="Zakres zbieranych danych">
          <p>
            Administrator zbiera następujące dane osobowe przekazywane
            dobrowolnie przez Użytkowników:
          </p>
          <ul className="list-disc pl-4 space-y-1 mt-2">
            <li>imię i nazwisko,</li>
            <li>adres e-mail,</li>
            <li>numer telefonu,</li>
            <li>
              treść wiadomości przesyłanej za pośrednictwem formularza
              kontaktowego.
            </li>
          </ul>
        </Section>

        <Section title="Cel i podstawa prawna przetwarzania danych">
          <p>Dane osobowe przetwarzane są w celu:</p>
          <ul className="list-disc pl-4 space-y-1 mt-2">
            <li>
              obsługi zapytań ofertowych i kontaktowych (art. 6 ust. 1 lit. b
              RODO),
            </li>
            <li>
              przedstawienia oferty handlowej na życzenie Użytkownika (art. 6
              ust. 1 lit. b RODO),
            </li>
            <li>
              wypełnienia obowiązków prawnych ciążących na Administratorze (art.
              6 ust. 1 lit. c RODO),
            </li>
            <li>
              realizacji prawnie uzasadnionych interesów Administratora (art. 6
              ust. 1 lit. f RODO).
            </li>
          </ul>
        </Section>

        <Section title="Okres przechowywania danych">
          <p>
            Dane osobowe przechowywane są przez okres niezbędny do realizacji
            celu, w jakim zostały zebrane, nie dłużej jednak niż przez{" "}
            <strong>3 lata</strong> od ostatniego kontaktu, chyba że
            obowiązujące przepisy prawa wymagają ich dłuższego przechowywania.
          </p>
        </Section>

        <Section title="Prawa Użytkownika">
          <p>Każdy Użytkownik ma prawo do:</p>
          <ul className="list-disc pl-4 space-y-1 mt-2">
            <li>dostępu do swoich danych osobowych,</li>
            <li>sprostowania nieprawidłowych danych,</li>
            <li>usunięcia danych („prawo do bycia zapomnianym"),</li>
            <li>ograniczenia przetwarzania danych,</li>
            <li>przenoszenia danych,</li>
            <li>wniesienia sprzeciwu wobec przetwarzania danych,</li>
            <li>
              wniesienia skargi do organu nadzorczego (Datatilsynet w Danii).
            </li>
          </ul>
        </Section>

        <Section title="Pliki cookies">
          <p>
            Serwis może korzystać z plików cookies (ciasteczek) — małych plików
            tekstowych zapisywanych na urządzeniu Użytkownika. Służą one
            wyłącznie do poprawnego funkcjonowania serwisu i nie są
            wykorzystywane do śledzenia Użytkowników. Sesja administratora
            korzysta z cookie. Wybrany język i ustawienie animacji są zapisywane
            lokalnie w przeglądarce. Użytkownik może usunąć te ustawienia w
            swojej przeglądarce.
          </p>
        </Section>

        <Section title="Przekazywanie danych osobom trzecim">
          <p>
            Dane osobowe Użytkowników nie są sprzedawane ani udostępniane osobom
            trzecim w celach marketingowych. Administrator może przekazać dane
            podmiotom świadczącym usługi techniczne (np. Render w zakresie
            hostingu, Resend w zakresie wysyłki formularza oraz dostawca
            skrzynki e-mail) wyłącznie w zakresie niezbędnym do realizacji celu
            przetwarzania.
          </p>
        </Section>

        <Section title="Bezpieczeństwo danych">
          <p>
            Administrator stosuje odpowiednie środki techniczne i organizacyjne
            zapewniające ochronę przetwarzanych danych, w szczególności
            zabezpiecza dane przed nieuprawnionym dostępem, ujawnieniem, utratą
            lub zniszczeniem.
          </p>
        </Section>

        <Section title="Zmiany Polityki Prywatności">
          <p>
            Administrator zastrzega sobie prawo do wprowadzania zmian w
            niniejszej Polityce Prywatności. O wszelkich istotnych zmianach
            Użytkownicy będą informowani poprzez aktualizację daty publikacji na
            stronie serwisu.
          </p>
        </Section>

        <div className="mt-8 pt-6 border-t border-border text-center">
          <button
            onClick={onClose}
            className="bg-primary text-white px-8 py-2.5 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Zamknij
          </button>
        </div>
      </div>
    </>
  );
}

function TermsContent({ onClose }: { onClose: () => void }) {
  return (
    <>
      <ModalHeader
        icon={FileText}
        title="Regulamin"
        subtitle="B-CORE / Informacje o serwisie"
        onClose={onClose}
      />
      <div className="overflow-y-auto flex-1 px-8 py-6 text-sm">
        <p className="text-muted-foreground mb-6 text-sm leading-relaxed border-l-2 border-accent pl-4 bg-accent/5 py-3 pr-3 rounded-r-lg">
          Niniejszy Regulamin określa zasady korzystania z serwisu internetowego
          B-CORE oraz warunki świadczenia usług przez Administratora serwisu.
        </p>

        <Section title="Postanowienia ogólne">
          <p>
            Serwis internetowy B-CORE dostępny pod adresem domenowym prowadzony
            jest przez firmę <strong>B-CORE</strong> z siedzibą w Danii.
            Korzystanie z serwisu oznacza akceptację niniejszego Regulaminu w
            całości.
          </p>
        </Section>

        <Section title="Charakter serwisu">
          <p>
            B-CORE jest serwisem informacyjno-handlowym o charakterze B2B i B2C.
            Serwis pełni rolę platformy prezentującej oferty i produkty oraz
            umożliwia nawiązanie kontaktu handlowego pomiędzy Użytkownikiem a
            firmą B-CORE.
          </p>
          <p className="mt-2">
            Prezentowane oferty mają charakter informacyjny i nie stanowią
            oferty handlowej w rozumieniu Kodeksu Cywilnego. Wiążąca oferta
            handlowa przekazywana jest Użytkownikowi indywidualnie po nawiązaniu
            kontaktu.
          </p>
        </Section>

        <Section title="Usługi świadczone przez B-CORE">
          <p>B-CORE świadczy usługi polegające na:</p>
          <ul className="list-disc pl-4 space-y-1 mt-2">
            <li>prezentacji ofert produktów i usług klasy premium,</li>
            <li>pośrednictwie w zakupie towarów i rozwiązań technicznych,</li>
            <li>doradztwie inwestycyjnym i handlowym,</li>
            <li>
              obsłudze zapytań ofertowych i przygotowaniu wycen indywidualnych,
            </li>
            <li>pośrednictwie w obrocie nieruchomościami i towarami.</li>
          </ul>
        </Section>

        <Section title="Warunki korzystania z serwisu">
          <p>Użytkownik zobowiązuje się do:</p>
          <ul className="list-disc pl-4 space-y-1 mt-2">
            <li>korzystania z serwisu zgodnie z obowiązującym prawem,</li>
            <li>niedziałania na szkodę B-CORE lub innych Użytkowników,</li>
            <li>
              podawania prawdziwych i aktualnych danych w formularzach
              kontaktowych,
            </li>
            <li>
              niepodejmowania prób nieuprawnionego dostępu do zasobów serwisu.
            </li>
          </ul>
        </Section>

        <Section title="Odpowiedzialność">
          <p>
            B-CORE dokłada wszelkich starań, aby informacje prezentowane w
            serwisie były rzetelne i aktualne. Jednocześnie B-CORE zastrzega,
            że:
          </p>
          <ul className="list-disc pl-4 space-y-1 mt-2">
            <li>
              nie ponosi odpowiedzialności za decyzje inwestycyjne podejmowane
              przez Użytkownika na podstawie informacji zawartych w serwisie,
            </li>
            <li>
              zastrzega sobie prawo do zmiany, usunięcia lub zawieszenia dostępu
              do serwisu bez uprzedniego powiadomienia,
            </li>
            <li>
              nie gwarantuje nieprzerwanego dostępu do serwisu ani braku błędów
              technicznych.
            </li>
          </ul>
        </Section>

        <Section title="Własność intelektualna">
          <p>
            Wszystkie treści, zdjęcia, grafiki, logotypy i materiały
            zamieszczone w serwisie B-CORE stanowią własność B-CORE lub
            podmiotów, które udzieliły licencji na ich wykorzystanie.
            Kopiowanie, powielanie lub rozpowszechnianie materiałów bez pisemnej
            zgody B-CORE jest zabronione.
          </p>
        </Section>

        <Section title="Formularze kontaktowe i zapytania">
          <p>
            Wypełnienie formularza kontaktowego jest dobrowolne i równoznaczne z
            wyrażeniem zgody na kontakt ze strony B-CORE w celu przedstawienia
            oferty handlowej. Odpowiedź na zapytanie jest przesyłana na wskazany
            adres e-mail.
          </p>
        </Section>

        <Section title="Prawo właściwe i rozstrzyganie sporów">
          <p>
            W sprawach nieuregulowanych niniejszym Regulaminem zastosowanie mają
            przepisy prawa duńskiego (dansk ret). Wszelkie spory wynikające z
            korzystania z serwisu będą rozstrzygane przez właściwe sądy duńskie
            lub w drodze mediacji.
          </p>
        </Section>

        <Section title="Zmiany Regulaminu">
          <p>
            B-CORE zastrzega sobie prawo do zmiany niniejszego Regulaminu w
            dowolnym czasie. Zmiany wchodzą w życie z chwilą ich opublikowania w
            serwisie. Dalsze korzystanie z serwisu po wprowadzeniu zmian oznacza
            ich akceptację.
          </p>
        </Section>

        <Section title="Kontakt">
          <p>W sprawach dotyczących Regulaminu prosimy o kontakt:</p>
          <ul className="mt-2 space-y-1">
            <li>
              <strong>E-mail:</strong>{" "}
              <a
                href="mailto:przemyslaw.bugajski78@gmail.com"
                className="text-primary underline underline-offset-2"
              >
                przemyslaw.bugajski78@gmail.com
              </a>
            </li>
            <li>
              <strong>Telefon:</strong> +45 91 78 92 77
            </li>
            <li>
              <strong>Siedziba:</strong> Dania
            </li>
          </ul>
        </Section>

        <div className="mt-8 pt-6 border-t border-border text-center">
          <button
            onClick={onClose}
            className="bg-primary text-white px-8 py-2.5 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Zamknij
          </button>
        </div>
      </div>
    </>
  );
}
