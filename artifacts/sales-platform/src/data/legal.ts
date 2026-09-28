import type { Lang } from "@/i18n/context";
type Section = { title: string; paragraphs: string[] };
type Copy = {
  privacy: string;
  terms: string;
  updated: string;
  close: string;
  fullPage: string;
  identity: string;
  operator: string;
  status: string;
  statusValue: string;
  missing: string;
  draft: string;
  privacyIntro: string;
  termsIntro: string;
  privacySections: Section[];
  termsSections: Section[];
  resources: string;
};
export const legalCopy: Record<Lang, Copy> = {
  pl: {
    privacy: "Polityka prywatności",
    terms: "Regulamin serwisu",
    updated: "Aktualizacja",
    close: "Zamknij",
    fullPage: "Otwórz pełną stronę",
    identity: "Właściciel witryny i administrator danych",
    operator: "Imię i nazwisko",
    missing: "Uzupełnij dane właściciela",
    draft:
      "Przed publikacją uzupełnij prawdziwe imię i nazwisko właściciela oraz adres do kontaktu.",
    privacyIntro:
      "B-CORE jest osobistą witryną o charakterze informacyjnym, prezentacyjnym i reklamowym. Jej właścicielem i administratorem danych jest osoba fizyczna wskazana poniżej. Ta polityka opisuje dane związane z przeglądaniem strony, kontaktem i obsługą panelu administratora. W sprawach prywatności napisz na podany e-mail.",
    termsIntro:
      "B-CORE jest nazwą osobistej witryny prezentującej obszary zainteresowania, kompetencje i możliwości kontaktu. Serwis ma charakter informacyjny, prezentacyjny i reklamowy; nie jest sklepem internetowym. Poniższy regulamin dotyczy korzystania ze strony, a nie warunków wykonania konkretnego zlecenia.",
    privacySections: [
      {
        title: "1. Jakie dane i w jakim celu",
        paragraphs: [
          "Formularz wymaga imienia lub nazwy, adresu e-mail, tematu i treści wiadomości. Przetwarzamy również dane dobrowolnie podane w korespondencji, np. telefon lub dane firmy. Służą obsłudze zapytania, przygotowaniu propozycji i dalszym uzgodnieniom. Nie przesyłaj danych szczególnych kategorii, kopii dokumentów tożsamości ani informacji zbędnych do sprawy.",
          "Podanie danych jest dobrowolne, ale bez danych oznaczonych jako wymagane nie można wysłać formularza. Możesz skontaktować się bezpośrednio e-mailem lub telefonicznie. Sam kontakt nie oznacza zgody na newsletter ani marketing.",
        ],
      },
      {
        title: "2. Podstawy prawne",
        paragraphs: [
          "Odpowiedź na wiadomości, utrzymywanie kontaktów, bezpieczeństwo strony oraz niezbędna ochrona praw opierają się na art. 6 ust. 1 lit. f RODO. Uzasadniony interes administratora polega na prowadzeniu korespondencji, prezentowaniu swojej aktywności, ochronie witryny przed nadużyciami i rozpatrywaniu zgłoszeń. Jeżeli na Twoje żądanie będą podejmowane działania przed zawarciem odrębnej umowy, której masz być stroną, zastosowanie może mieć art. 6 ust. 1 lit. b RODO. Obowiązek wynikający z przepisów realizowany jest na podstawie art. 6 ust. 1 lit. c RODO, gdy rzeczywiście wystąpi.",
        ],
      },
      {
        title: "3. Dostawcy i przekazywanie danych",
        paragraphs: [
          "Stronę obsługuje infrastruktura Render, wiadomości z formularza przekazuje Resend (Plus Five Five, Inc.), a korespondencja trafia do skonfigurowanej skrzynki odbiorczej. Przy podanym adresie Gmail dostawcą poczty jest Google. Dostawcy mogą przetwarzać treść, adresy i metadane potrzebne do wykonania usługi. Aplikacja nie zapisuje zapytań w bazie ofert ani nie udostępnia ich publicznie.",
          "Nie sprzedajemy danych. Udostępnienie informacji partnerowi w celu realizacji zapytania ograniczamy do uzgodnionego zakresu i właściwej podstawy prawnej. Dane mogą też otrzymać uprawnione organy lub doradcy, gdy jest to konieczne i zgodne z prawem.",
          "Dostawcy mogą przetwarzać dane poza EOG, w tym w USA. Region hostingu w UE nie oznacza, że wszystkie usługi pocztowe i wsparcie pozostają w UE. Podstawą transferu może być obowiązująca decyzja stwierdzająca odpowiedni stopień ochrony, jeżeli obejmuje odbiorcę, albo standardowe klauzule umowne i wymagane środki dodatkowe. Informacje o zastosowanych zabezpieczeniach lub ich kopię, z ochroną praw innych osób, można uzyskać przez kontakt z administratorem. Dokumenty dostawców są podlinkowane poniżej.",
        ],
      },
      {
        title: "4. Okres przechowywania",
        paragraphs: [
          "Korespondencję przechowujemy podczas obsługi sprawy, następnie oceniamy, czy jest potrzebna do ustaleń umownych, wykonania obowiązków prawnych albo dochodzenia lub obrony konkretnych roszczeń. Niepotrzebne wiadomości usuwamy; materiały związane z umową lub sporem pozostają wyłącznie przez okres uzasadniony odpowiednimi obowiązkami i terminami przedawnienia. Kryteriami są status sprawy, rodzaj dokumentu, właściwe przepisy oraz istnienie sporu.",
          "Techniczne liczniki ochrony przed nadużyciami w aplikacji zawierają adres IP i liczbę prób; wygasają po 10 minutach dla formularza i 15 minutach dla logowania, a przeterminowane wpisy są usuwane w ciągu kolejnej minuty. Logi infrastruktury i dane usług pocztowych podlegają również okresom wynikającym z konfiguracji i zasad danego dostawcy.",
        ],
      },
      {
        title: "5. Ustawienia przeglądarki i cookies",
        paragraphs: [
          "Serwis nie wykorzystuje narzędzi reklamowych, analityki marketingowej ani profilowania. Czcionki i podstawowe zdjęcia są dostarczane z plików strony. Po Twoim wyborze przeglądarka zapamiętuje język (lang), animacje (bcore-motion) oraz jasność (bcore-brightness) w localStorage, aby zachować zamówione ustawienia interfejsu. Wpisy pozostają do zmiany lub usunięcia danych witryny w przeglądarce; nie są wysyłane jako profil reklamowy.",
          "Cookie bcore_admin służy wyłącznie zalogowanemu administratorowi. Jest chronione przed odczytem przez JavaScript, na produkcji przesyłane przez HTTPS i wygasa po maksymalnie 8 godzinach; wylogowanie je usuwa. Publiczny formularz nie wymaga konta. Dane techniczne, takie jak IP, czas i parametry żądania, mogą być przetwarzane przez hosting dla dostarczenia strony, diagnostyki i bezpieczeństwa.",
        ],
      },
      {
        title: "6. Twoje prawa",
        paragraphs: [
          "Na warunkach określonych w RODO masz prawo do dostępu i kopii danych, ich sprostowania, usunięcia, ograniczenia przetwarzania oraz przenoszenia. Możesz wnieść sprzeciw z przyczyn związanych z Twoją szczególną sytuacją wobec przetwarzania opartego na uzasadnionym interesie. Jeżeli jakieś przetwarzanie będzie oparte na zgodzie, możesz ją wycofać bez wpływu na zgodność wcześniejszego przetwarzania z prawem.",
          "Wniosek wyślij na adres e-mail wskazany powyżej. W razie uzasadnionych wątpliwości możemy poprosić o proporcjonalne potwierdzenie tożsamości. Odpowiadamy co do zasady w ciągu miesiąca; ewentualne przedłużenie następuje na zasadach RODO, z wyjaśnieniem przyczyn. Możesz wnieść skargę do właściwego organu nadzorczego, w szczególności w państwie zamieszkania, pracy lub zarzucanego naruszenia, np. Datatilsynet w Danii lub Prezesa UODO w Polsce.",
          "Nie podejmujemy decyzji wywołujących skutki prawne lub podobnie istotnie wpływających na Ciebie wyłącznie automatycznie, w tym przez profilowanie.",
        ],
      },
      {
        title: "7. Zmiany informacji",
        paragraphs: [
          "Aktualizacja tej polityki odzwierciedla rzeczywiste zmiany usług lub sposobu przetwarzania. Data wersji znajduje się na początku. Nowy cel wymagający zgody nie będzie realizowany wyłącznie na podstawie zmiany tego dokumentu.",
        ],
      },
    ],
    termsSections: [
      {
        title: "1. Korzystanie z serwisu",
        paragraphs: [
          "Przeglądanie informacji i przesłanie zapytania są bezpłatne. Potrzebne są połączenie z internetem oraz aktualna przeglądarka z obsługą JavaScript. Dostęp do strony kończy się po jej zamknięciu; nie jest tworzony abonament ani konto klienta. Panel administratora jest przeznaczony wyłącznie dla uprawnionej osoby.",
          "Nie wolno przesyłać bezprawnych treści, spamu, cudzych danych bez podstawy prawnej ani próbować uzyskać nieuprawnionego dostępu. Zabezpieczenia mogą czasowo ograniczyć nadmierną liczbę zapytań.",
        ],
      },
      {
        title: "2. Zapytanie i zawarcie umowy",
        paragraphs: [
          "Opisy obszarów, wizualizacje i katalog służą przedstawieniu możliwości współpracy. Formularz nie składa zamówienia, nie rezerwuje produktu i nie zawiera automatycznie umowy. Potwierdzenie wysyłki oznacza techniczne przyjęcie wiadomości do obsługi, nie przyjęcie zlecenia.",
          "Ewentualna późniejsza współpraca wymaga odrębnego ustalenia jej zakresu, stron, warunków i — jeśli ma być odpłatna — wynagrodzenia lub prowizji, kosztów, terminów oraz odpowiedzialności. Nie wynikają one z samego wejścia na stronę ani wysłania wiadomości. Muszą odpowiadać rzeczywistemu statusowi stron i obowiązującym przepisom. Jeżeli zastosowanie mają prawa konsumenta, w tym obowiązki informacyjne, reklamacyjne lub prawo odstąpienia, pozostają one zachowane.",
        ],
      },
      {
        title: "3. Rola doradcza i pośrednictwo",
        paragraphs: [
          "B-CORE jest nazwą używaną do prezentacji osobistej aktywności właściciela witryny, a nie deklaracją istnienia odrębnej zarejestrowanej spółki lub firmy. Określenia „advisory”, „brokerage” i opisy branż wskazują tematykę oraz możliwe kierunki kontaktu. Nie stanowią same w sobie potwierdzenia uprawnień zawodowych, pełnomocnictwa do reprezentowania innych osób, przyjęcia zlecenia ani gwarancji dostępności danej usługi.",
          "Informacje na stronie nie stanowią indywidualnej porady prawnej, podatkowej, inwestycyjnej ani dokumentacji technicznej. Czynności wymagające uprawnień, zezwoleń lub specjalistycznej weryfikacji mogą być wykonywane tylko zgodnie z tymi wymaganiami. Nie zapewniamy z góry finansowania, stopy zwrotu, zawarcia transakcji ani realizacji każdego przedsięwzięcia.",
        ],
      },
      {
        title: "4. Informacje, zdjęcia i dostępność",
        paragraphs: [
          "Dbamy o aktualność opisów. Parametry, zgodność techniczna, dostępność i cena konkretnego rozwiązania wymagają potwierdzenia przed zawarciem umowy. Wizualizacje prezentują charakter usług i nie stanowią specyfikacji zamówienia; nie są deklaracją autorstwa lub wykonania przedstawionych obiektów przez B-CORE.",
          "Prawa do materiałów należą do ich uprawnionych właścicieli. Korzystanie z serwisu nie przenosi tych praw; dozwolony użytek oraz zakres właściwych licencji pozostają zachowane. Linki do zewnętrznych usług prowadzą do stron działających na własnych zasadach.",
          "Przerwy techniczne mogą wystąpić w związku z utrzymaniem lub awarią. W takim przypadku można skorzystać z podanego e-maila albo telefonu. Dla wygody dostępne są ograniczenie animacji i regulacja jasności.",
        ],
      },
      {
        title: "5. Zgłoszenia i odpowiedzialność",
        paragraphs: [
          "Problemy z serwisem lub zastrzeżenia można zgłaszać na podany adres e-mail. Opisz zdarzenie, datę, stronę lub funkcję oraz oczekiwany sposób rozwiązania. Zgłoszenia rozpatrujemy bez nieuzasadnionej zwłoki, z uwzględnieniem obowiązujących terminów ustawowych.",
          "Odpowiedzialność za usługi i transakcje wynika z prawa i odpowiedniej umowy. Ten regulamin nie wyłącza odpowiedzialności, której nie można wyłączyć, ani nie ogranicza praw konsumenta, prawa do reklamacji lub dostępu do sądu i właściwych organów. Nie narzuca wyłącznej właściwości sądu ani prawa pozbawiającego użytkownika ochrony wynikającej z bezwzględnie obowiązujących przepisów.",
        ],
      },
      {
        title: "6. Prywatność i aktualizacje",
        paragraphs: [
          "Zasady przetwarzania danych opisuje odrębna polityka prywatności dostępna w stopce i przy formularzu. Samo przeglądanie strony nie jest zgodą na marketing. Aktualizacje regulaminu stosuje się do późniejszego korzystania z serwisu; nie zmieniają wstecz warunków wcześniej zawartych umów ani nabytych praw.",
        ],
      },
    ],
    resources: "Dokumenty dostawców i organy nadzorcze",
    status: "Charakter witryny",
    statusValue: "Osobista wizytówka — serwis informacyjny i prezentacyjny",
  },
  en: {
    privacy: "Privacy policy",
    terms: "Website terms",
    updated: "Updated",
    close: "Close",
    fullPage: "Open full page",
    identity: "Website owner and data controller",
    operator: "Full name",
    missing: "Complete the owner details",
    draft:
      "Before publication, enter the owner’s real full name and contact email.",
    privacyIntro:
      "B-CORE is a personal website for information, presentation and promotion. Its owner and data controller is the individual identified below. This policy covers browsing, correspondence and the administrator area. Privacy questions can be sent to the email address shown here.",
    termsIntro:
      "B-CORE is the name of a personal website presenting areas of interest, capabilities and opportunities to connect. It provides information, presentation and promotion; it is not an online shop. These terms cover website use, not the performance of a particular engagement.",
    privacySections: [
      {
        title: "1. Data and purposes",
        paragraphs: [
          "The form requires your name or business name, email, subject and message. We also handle information you voluntarily provide, such as a phone number or company details, to answer your enquiry and discuss a potential engagement. Please do not send sensitive data, identity documents or unnecessary information.",
          "Providing data is voluntary, but the fields marked as required are needed to send the form. You may instead email or call us. Making contact does not subscribe you to a newsletter or authorise marketing.",
        ],
      },
      {
        title: "2. Legal bases",
        paragraphs: [
          "Replying to messages, maintaining contacts, website security and necessary protection of rights rely on Article 6(1)(f) GDPR. The controller’s legitimate interests are correspondence, presenting their activities, preventing abuse and addressing reports. If steps are later taken at your request before a separate contract to which you would be a party, Article 6(1)(b) may apply. Article 6(1)(c) applies where an actual legal obligation arises.",
        ],
      },
      {
        title: "3. Providers and transfers",
        paragraphs: [
          "Render provides hosting, Resend (Plus Five Five, Inc.) delivers form messages, and the configured mailbox receives correspondence. Google provides email for the Gmail address displayed. These providers may handle message content, addresses and delivery metadata. The application does not store enquiries in the offers database or publish them.",
          "We do not sell personal data. Sharing information with a project partner is limited to an agreed scope and an appropriate legal basis. Authorised authorities or advisers may receive data where necessary and lawful.",
          "Providers may process data outside the EEA, including the USA. An EU hosting region does not mean all email processing or support remains in the EU. Transfers may rely on an applicable adequacy decision or standard contractual clauses and any required supplementary safeguards. Contact the controller for details or a copy of the applicable safeguards, subject to other persons’ rights. Provider documents are linked below.",
        ],
      },
      {
        title: "4. Retention",
        paragraphs: [
          "We keep correspondence while handling the enquiry, then assess whether it is needed for contractual arrangements, legal obligations or specific legal claims. Unnecessary messages are deleted; contractual or dispute records remain only for periods justified by applicable obligations and limitation periods. The criteria are case status, document type, applicable law and any dispute.",
          "Application security counters contain IP addresses and request counts. They expire after 10 minutes for enquiries and 15 minutes for login, with expired records removed within one further minute. Infrastructure logs and email records are also subject to the provider’s settings and retention rules.",
        ],
      },
      {
        title: "5. Browser settings and cookies",
        paragraphs: [
          "The website has no advertising tools, marketing analytics or profiling. Fonts and main photographs are served from site files. After your selection, localStorage remembers language (lang), animation (bcore-motion) and brightness (bcore-brightness). These entries remain until changed or deleted through browser site-data settings and are not sent as an advertising profile.",
          "The bcore_admin cookie is only for an authenticated administrator. It is inaccessible to JavaScript, uses HTTPS in production and expires within 8 hours; signing out removes it. The public form does not require an account. Hosting may process IP addresses, request times and technical parameters for delivery, diagnostics and security.",
        ],
      },
      {
        title: "6. Your rights",
        paragraphs: [
          "Subject to the GDPR, you may request access and a copy, correction, erasure, restriction and portability. You may object to processing based on legitimate interests for reasons relating to your situation. Where consent is used, it may be withdrawn without affecting the lawfulness of earlier processing.",
          "Email the controller to exercise your rights. Where identity is reasonably in doubt, proportionate verification may be requested. We normally respond within one month; any extension follows GDPR rules and is explained. You may complain to a competent supervisory authority, particularly where you live, work or where an alleged infringement occurred, including Datatilsynet in Denmark or UODO in Poland.",
          "We do not make decisions with legal or similarly significant effects solely through automated processing, including profiling.",
        ],
      },
      {
        title: "7. Updates",
        paragraphs: [
          "This notice is updated to reflect actual changes in services or processing. A new purpose requiring consent will not be implemented merely by changing this notice. The version date appears above.",
        ],
      },
    ],
    termsSections: [
      {
        title: "1. Using the website",
        paragraphs: [
          "Browsing and making an enquiry are free. Internet access and an up-to-date browser with JavaScript are required. Closing the site ends your visit; no subscription or customer account is created. The administrator area is restricted to authorised users.",
          "Do not submit unlawful content, spam or personal data without a lawful basis, or attempt unauthorised access. Security controls may temporarily limit excessive requests.",
        ],
      },
      {
        title: "2. Enquiries and contracts",
        paragraphs: [
          "Service descriptions, images and the catalogue introduce possible cooperation. Sending the form does not place an order, reserve a product or automatically create a contract. A sending confirmation indicates technical acceptance for handling, not acceptance of an engagement.",
          "Any subsequent cooperation requires separate agreement on scope, parties, conditions and, if paid, fees or commission, costs, timelines and responsibility. None arises merely from visiting the website or sending a message. Arrangements must reflect the parties’ actual status and applicable law. Any applicable consumer rights, including information, complaints and withdrawal rights, remain unaffected.",
        ],
      },
      {
        title: "3. Advisory and brokerage role",
        paragraphs: [
          "B-CORE is a name used to present the website owner’s personal activities, not a statement that a separate registered business or company exists. The terms “advisory”, “brokerage” and sector descriptions indicate subject areas and possible conversations. They do not, by themselves, establish professional authorisations, authority to represent others, acceptance of an engagement or guaranteed availability of a service.",
          "Website information is not individual legal, tax or investment advice or technical documentation. Activities requiring licences, authorisations or specialist verification may only take place in compliance with those requirements. No financing, return, transaction or completion of every project is guaranteed.",
        ],
      },
      {
        title: "4. Content and availability",
        paragraphs: [
          "We seek to keep information current. Specifications, technical compliance, availability and prices require confirmation before a contract. Images illustrate the nature of services; they are not order specifications or a claim that B-CORE designed or completed the depicted properties or structures.",
          "Materials remain the property of their rights holders. Website use does not transfer rights; applicable licences and statutory permitted uses remain unaffected. Linked services operate under their own terms.",
          "Maintenance or failures may interrupt access. You can contact us by email or phone. Motion controls and brightness settings are available for reading comfort.",
        ],
      },
      {
        title: "5. Reports and liability",
        paragraphs: [
          "Email us about a website problem or concern, describing the incident, date, relevant page or feature and the requested solution. Reports are handled without undue delay and within applicable statutory deadlines.",
          "Liability for services and transactions follows applicable law and the relevant agreement. These terms do not exclude liability that cannot lawfully be excluded, restrict consumer rights or prevent complaints or access to courts and authorities. They do not impose exclusive jurisdiction or deprive users of mandatory legal protection.",
        ],
      },
      {
        title: "6. Privacy and changes",
        paragraphs: [
          "Data handling is explained in the privacy policy linked in the footer and beside the form. Browsing is not marketing consent. Changes to these terms apply to subsequent website use and do not retrospectively alter existing contracts or acquired rights.",
        ],
      },
    ],
    resources: "Provider documents and supervisory authorities",
    status: "Website type",
    statusValue: "Personal profile — an informational and presentation website",
  },
  da: {
    privacy: "Privatlivspolitik",
    terms: "Vilkår for hjemmesiden",
    updated: "Opdateret",
    close: "Luk",
    fullPage: "Åbn hele siden",
    identity: "Hjemmesidens ejer og dataansvarlige",
    operator: "Fulde navn",
    missing: "Udfyld ejerens oplysninger",
    draft:
      "Angiv ejerens korrekte fulde navn og kontaktadresse før offentliggørelse.",
    privacyIntro:
      "B-CORE er en personlig hjemmeside til information, præsentation og promovering. Ejeren og den dataansvarlige er den fysiske person angivet nedenfor. Politikken omfatter besøg, korrespondance og administratorområdet. Spørgsmål om persondata kan sendes til den viste e-mailadresse.",
    termsIntro:
      "B-CORE er navnet på en personlig hjemmeside, der præsenterer interesseområder, kompetencer og kontaktmuligheder. Siden er informativ, præsenterende og promoverende; den er ikke en webshop. Vilkårene gælder brugen af hjemmesiden, ikke udførelsen af en konkret opgave.",
    privacySections: [
      {
        title: "1. Oplysninger og formål",
        paragraphs: [
          "Formularen kræver navn eller virksomhedsnavn, e-mail, emne og besked. Vi behandler også oplysninger, du frivilligt sender, f.eks. telefonnummer og virksomhedsoplysninger, for at besvare henvendelsen og drøfte et samarbejde. Undlad følsomme oplysninger, identitetsdokumenter og unødvendige oplysninger.",
          "Det er frivilligt at give oplysninger, men obligatoriske felter skal udfyldes for at sende formularen. Du kan også kontakte os via e-mail eller telefon. En henvendelse tilmelder dig ikke et nyhedsbrev og er ikke samtykke til markedsføring.",
        ],
      },
      {
        title: "2. Retsgrundlag",
        paragraphs: [
          "Besvarelse af beskeder, kontakt, sikkerhed og nødvendig beskyttelse af rettigheder bygger på GDPR artikel 6, stk. 1, litra f. Den dataansvarliges legitime interesser er korrespondance, præsentation af egne aktiviteter, forebyggelse af misbrug og behandling af henvendelser. Hvis der senere på din anmodning tages skridt før en særskilt aftale, som du skal være part i, kan litra b anvendes. Litra c gælder, når en faktisk retlig forpligtelse opstår.",
        ],
      },
      {
        title: "3. Leverandører og overførsler",
        paragraphs: [
          "Render leverer hosting, Resend (Plus Five Five, Inc.) sender formularbeskeder, og den konfigurerede postkasse modtager korrespondancen. Google leverer e-mail til den viste Gmail-adresse. Leverandørerne kan behandle beskedindhold, adresser og leveringsoplysninger. Applikationen gemmer ikke henvendelser i tilbudsdatabasen og offentliggør dem ikke.",
          "Vi sælger ikke personoplysninger. Deling med en projektpartner begrænses til det aftalte omfang og et relevant retsgrundlag. Myndigheder eller rådgivere kan modtage oplysninger, når det er nødvendigt og lovligt.",
          "Leverandører kan behandle oplysninger uden for EØS, herunder i USA. Hosting i EU betyder ikke, at al e-mailbehandling og support foregår i EU. Overførsel kan bygge på en relevant tilstrækkelighedsafgørelse eller standardkontraktbestemmelser med nødvendige supplerende foranstaltninger. Kontakt den dataansvarlige for oplysninger om eller en kopi af garantierne, under hensyntagen til andres rettigheder. Leverandørernes dokumenter er linket nedenfor.",
        ],
      },
      {
        title: "4. Opbevaring",
        paragraphs: [
          "Korrespondance opbevares under sagens behandling. Derefter vurderes behovet for aftalegrundlag, lovpligtige forpligtelser eller konkrete retskrav. Unødvendige beskeder slettes. Aftale- og tvistmateriale opbevares kun i den periode, der er begrundet i relevante forpligtelser og forældelsesfrister. Kriterierne er sagens status, dokumenttype, gældende regler og eventuelle tvister.",
          "Applikationens sikkerhedstællere indeholder IP-adresser og antal forsøg. De udløber efter 10 minutter for formularen og 15 minutter for login; udløbne poster fjernes inden for yderligere ét minut. Infrastrukturens logs og e-maildata følger også leverandørens indstillinger og opbevaringsregler.",
        ],
      },
      {
        title: "5. Browserindstillinger og cookies",
        paragraphs: [
          "Hjemmesiden anvender ikke reklameværktøjer, markedsføringsanalyse eller profilering. Skrifttyper og de primære billeder leveres fra hjemmesidens filer. Efter dit valg husker localStorage sprog (lang), animation (bcore-motion) og lysstyrke (bcore-brightness). Indstillingerne gemmes, indtil de ændres eller slettes via browserens hjemmesidedata, og sendes ikke som en reklameprofil.",
          "Cookien bcore_admin bruges kun til en indlogget administrator. JavaScript kan ikke læse den; i produktion sendes den via HTTPS, og den udløber senest efter 8 timer. Den slettes ved logout. Den offentlige formular kræver ingen konto. Hosting kan behandle IP-adresse, tidspunkt og tekniske parametre med henblik på levering, fejlfinding og sikkerhed.",
        ],
      },
      {
        title: "6. Dine rettigheder",
        paragraphs: [
          "Efter GDPR’s betingelser kan du anmode om indsigt og kopi, berigtigelse, sletning, begrænsning og dataportabilitet. Du kan gøre indsigelse mod behandling baseret på legitime interesser på grund af din særlige situation. Hvor behandling bygger på samtykke, kan dette trækkes tilbage uden at påvirke tidligere lovlig behandling.",
          "Kontakt den dataansvarlige via e-mail. Ved rimelig tvivl om identiteten kan vi anmode om forholdsmæssig bekræftelse. Vi svarer normalt inden for en måned; en eventuel forlængelse følger GDPR og begrundes. Du kan klage til en kompetent tilsynsmyndighed, særligt i dit bopælsland, arbejdsland eller hvor den påståede overtrædelse er sket, f.eks. Datatilsynet i Danmark eller UODO i Polen.",
          "Vi træffer ikke afgørelser med retsvirkning eller tilsvarende væsentlig betydning udelukkende ved automatisk behandling, herunder profilering.",
        ],
      },
      {
        title: "7. Ændringer",
        paragraphs: [
          "Politikken opdateres ved faktiske ændringer i tjenester eller behandling. Et nyt formål, der kræver samtykke, iværksættes ikke alene ved at ændre denne tekst. Versionsdatoen står ovenfor.",
        ],
      },
    ],
    termsSections: [
      {
        title: "1. Brug af hjemmesiden",
        paragraphs: [
          "Det er gratis at læse siden og sende en forespørgsel. Internetadgang og en opdateret browser med JavaScript er nødvendige. Besøget slutter, når siden lukkes; der oprettes ikke abonnement eller kundekonto. Administratorområdet er kun for autoriserede personer.",
          "Ulovligt indhold, spam, andres personoplysninger uden retsgrundlag og forsøg på uautoriseret adgang er ikke tilladt. Sikkerhed kan midlertidigt begrænse for mange henvendelser.",
        ],
      },
      {
        title: "2. Forespørgsler og aftaler",
        paragraphs: [
          "Beskrivelser, billeder og kataloget præsenterer muligheder for samarbejde. Formularen afgiver ikke en ordre, reserverer ikke et produkt og indgår ikke automatisk en aftale. En afsendelsesbekræftelse er teknisk modtagelse til behandling og ikke accept af en opgave.",
          "Et eventuelt senere samarbejde kræver særskilt aftale om omfang, parter, vilkår og, ved betaling, honorar eller provision, omkostninger, tidsplan og ansvar. Dette følger ikke alene af et besøg eller en besked. Aftalen skal afspejle parternes faktiske status og gældende regler. Eventuelle forbrugerrettigheder, herunder oplysningskrav, klager og fortrydelsesret, berøres ikke.",
        ],
      },
      {
        title: "3. Rådgivning og formidling",
        paragraphs: [
          "B-CORE er et navn til præsentation af hjemmesideejerens personlige aktiviteter og er ikke en erklæring om, at en særskilt registreret virksomhed eller et selskab findes. “Advisory”, “brokerage” og branchebeskrivelser angiver emner og mulige samtaler. De dokumenterer ikke i sig selv autorisation, fuldmagt til at repræsentere andre, accept af en opgave eller garanteret tilgængelighed af en ydelse.",
          "Sidens indhold er ikke individuel juridisk, skatte- eller investeringsrådgivning eller teknisk dokumentation. Aktiviteter, der kræver autorisation, tilladelser eller faglig kontrol, må kun udføres i overensstemmelse med kravene. Finansiering, afkast, transaktioner eller gennemførelse af ethvert projekt garanteres ikke.",
        ],
      },
      {
        title: "4. Indhold og tilgængelighed",
        paragraphs: [
          "Vi søger at holde oplysninger ajour. Specifikationer, teknisk overensstemmelse, tilgængelighed og priser skal bekræftes før en aftale. Billeder illustrerer ydelsernes karakter, er ikke ordrespecifikationer og erklærer ikke, at B-CORE har tegnet eller udført de viste objekter.",
          "Materialers rettigheder tilhører rettighedshaverne. Brugen overfører ingen rettigheder; relevante licenser og lovlig brug berøres ikke. Eksterne tjenester følger egne vilkår.",
          "Vedligeholdelse og fejl kan afbryde adgang. Kontakt er fortsat mulig via e-mail eller telefon. Animation og lysstyrke kan indstilles for bedre læsekomfort.",
        ],
      },
      {
        title: "5. Henvendelser og ansvar",
        paragraphs: [
          "Problemer eller indsigelser kan sendes via e-mail. Beskriv hændelse, dato, side eller funktion og ønsket løsning. Henvendelser behandles uden unødig forsinkelse og inden for gældende lovbestemte frister.",
          "Ansvar for ydelser og transaktioner følger lovgivningen og den relevante aftale. Vilkårene udelukker ikke ufravigeligt ansvar, begrænser ikke forbrugerrettigheder og hindrer ikke klager eller adgang til domstole og myndigheder. De fastlægger ikke eksklusivt værneting eller fjerner ufravigelig lovbeskyttelse.",
        ],
      },
      {
        title: "6. Privatliv og opdateringer",
        paragraphs: [
          "Databehandling beskrives i privatlivspolitikken i sidefoden og ved formularen. Et besøg er ikke samtykke til markedsføring. Ændringer gælder senere brug af hjemmesiden og ændrer ikke tidligere aftaler eller erhvervede rettigheder med tilbagevirkende kraft.",
        ],
      },
    ],
    resources: "Leverandørdokumenter og tilsynsmyndigheder",
    status: "Hjemmesidens karakter",
    statusValue: "Personlig profil — information og præsentation",
  },
  de: {
    privacy: "Datenschutzerklärung",
    terms: "Nutzungsbedingungen",
    updated: "Stand",
    close: "Schließen",
    fullPage: "Vollständige Seite öffnen",
    identity: "Website-Inhaber und Verantwortlicher",
    operator: "Vollständiger Name",
    missing: "Angaben des Inhabers ergänzen",
    draft:
      "Vor Veröffentlichung den tatsächlichen vollständigen Namen und die Kontaktadresse des Inhabers eintragen.",
    privacyIntro:
      "B-CORE ist eine persönliche Website zur Information, Präsentation und Außendarstellung. Inhaber und datenschutzrechtlich Verantwortlicher ist die unten genannte natürliche Person. Diese Erklärung betrifft Besuche, Korrespondenz und den Administrationsbereich. Datenschutzfragen sind über die angegebene E-Mail-Adresse möglich.",
    termsIntro:
      "B-CORE ist der Name einer persönlichen Website für Interessenbereiche, Kompetenzen und Kontaktmöglichkeiten. Sie dient Information, Präsentation und Außendarstellung und ist kein Online-Shop. Die Bedingungen betreffen die Nutzung der Website, nicht die Ausführung eines bestimmten Auftrags.",
    privacySections: [
      {
        title: "1. Daten und Zwecke",
        paragraphs: [
          "Das Formular benötigt Name oder Firmenname, E-Mail, Betreff und Nachricht. Freiwillige Angaben, etwa Telefonnummer oder Firmendaten, werden ebenfalls zur Bearbeitung der Anfrage und Abstimmung eines möglichen Auftrags verarbeitet. Bitte übermitteln Sie keine sensiblen Daten, Ausweiskopien oder unnötigen Informationen.",
          "Die Angabe ist freiwillig; ohne Pflichtfelder kann das Formular jedoch nicht versendet werden. Alternativ erreichen Sie uns per E-Mail oder Telefon. Eine Anfrage ist weder eine Newsletter-Anmeldung noch eine Werbeeinwilligung.",
        ],
      },
      {
        title: "2. Rechtsgrundlagen",
        paragraphs: [
          "Die Beantwortung von Nachrichten, Kontaktpflege, Sicherheit und erforderliche Rechtswahrung beruhen auf Art. 6 Abs. 1 lit. f DSGVO. Berechtigte Interessen sind Korrespondenz, Darstellung eigener Aktivitäten, Missbrauchsprävention und Bearbeitung von Meldungen. Werden später auf Ihren Wunsch vorvertragliche Schritte für einen gesonderten Vertrag unternommen, dessen Partei Sie werden sollen, kann lit. b gelten. Lit. c gilt, wenn eine tatsächliche gesetzliche Pflicht entsteht.",
        ],
      },
      {
        title: "3. Dienstleister und Übermittlungen",
        paragraphs: [
          "Render stellt Hosting bereit, Resend (Plus Five Five, Inc.) übermittelt Formularnachrichten an das konfigurierte Postfach. Für die angegebene Gmail-Adresse ist Google der E-Mail-Anbieter. Dienstleister können Inhalte, Adressen und Zustellmetadaten verarbeiten. Die Anwendung speichert Anfragen nicht in der Angebotsdatenbank und veröffentlicht sie nicht.",
          "Wir verkaufen keine personenbezogenen Daten. Eine Weitergabe an Projektpartner erfolgt nur im abgestimmten Umfang und auf geeigneter Rechtsgrundlage. Befugte Behörden oder Berater können Daten erhalten, soweit dies erforderlich und rechtmäßig ist.",
          "Dienstleister können Daten außerhalb des EWR, insbesondere in den USA, verarbeiten. EU-Hosting bedeutet nicht, dass auch sämtliche E-Mail-Verarbeitung und Unterstützung in der EU stattfinden. Grundlage kann ein anwendbarer Angemessenheitsbeschluss oder können Standardvertragsklauseln mit erforderlichen zusätzlichen Maßnahmen sein. Informationen oder eine Kopie einschlägiger Garantien sind beim Verantwortlichen unter Wahrung der Rechte anderer erhältlich. Dokumente der Anbieter sind unten verlinkt.",
        ],
      },
      {
        title: "4. Speicherdauer",
        paragraphs: [
          "Korrespondenz wird während der Bearbeitung aufbewahrt. Anschließend prüfen wir die Erforderlichkeit für Vertragsabsprachen, gesetzliche Pflichten oder konkrete Rechtsansprüche. Nicht benötigte Nachrichten werden gelöscht. Vertrags- und Streitunterlagen bleiben nur für durch Pflichten und Verjährungsfristen begründete Zeiträume erhalten. Kriterien sind Bearbeitungsstand, Dokumentart, geltendes Recht und bestehende Streitigkeiten.",
          "Sicherheitszähler der Anwendung enthalten IP-Adresse und Anzahl der Versuche. Sie laufen nach 10 Minuten für Anfragen bzw. 15 Minuten für Anmeldung ab; abgelaufene Einträge werden innerhalb einer weiteren Minute entfernt. Infrastrukturprotokolle und E-Mail-Daten unterliegen außerdem den Einstellungen und Speicherregeln der Anbieter.",
        ],
      },
      {
        title: "5. Browsereinstellungen und Cookies",
        paragraphs: [
          "Die Website verwendet keine Werbewerkzeuge, Marketinganalyse oder Profiling. Schriftarten und Hauptbilder werden aus eigenen Website-Dateien geladen. Nach Ihrer Auswahl speichert localStorage Sprache (lang), Animation (bcore-motion) und Helligkeit (bcore-brightness). Die Einträge bleiben bis zur Änderung oder Löschung über die Browser-Websitedaten erhalten und werden nicht als Werbeprofil übermittelt.",
          "Das Cookie bcore_admin dient nur angemeldeten Administratoren. Es ist für JavaScript unzugänglich, wird im Produktivbetrieb über HTTPS übertragen und läuft nach höchstens 8 Stunden ab; Abmelden entfernt es. Das öffentliche Formular erfordert kein Konto. Hosting kann IP-Adresse, Zeitpunkt und technische Anfrageparameter für Auslieferung, Diagnose und Sicherheit verarbeiten.",
        ],
      },
      {
        title: "6. Ihre Rechte",
        paragraphs: [
          "Nach Maßgabe der DSGVO bestehen Rechte auf Auskunft und Kopie, Berichtigung, Löschung, Einschränkung und Datenübertragbarkeit. Gegen Verarbeitung auf Grundlage berechtigter Interessen können Sie aus Gründen Ihrer besonderen Situation Widerspruch einlegen. Bei einwilligungsbasierter Verarbeitung kann die Einwilligung ohne Auswirkungen auf die vorherige Rechtmäßigkeit widerrufen werden.",
          "Richten Sie Anfragen per E-Mail an den Verantwortlichen. Bei begründeten Identitätszweifeln kann eine verhältnismäßige Bestätigung verlangt werden. Wir antworten grundsätzlich innerhalb eines Monats; Verlängerungen erfolgen nach der DSGVO mit Begründung. Sie können sich bei einer zuständigen Aufsichtsbehörde beschweren, insbesondere am Wohnort, Arbeitsort oder Ort des vermuteten Verstoßes, etwa Datatilsynet in Dänemark oder UODO in Polen.",
          "Es erfolgen keine ausschließlich automatisierten Entscheidungen mit rechtlicher oder vergleichbar erheblicher Wirkung, einschließlich Profiling.",
        ],
      },
      {
        title: "7. Aktualisierungen",
        paragraphs: [
          "Änderungen dieser Erklärung bilden tatsächliche Änderungen der Dienste oder Verarbeitung ab. Ein neuer einwilligungspflichtiger Zweck wird nicht allein durch eine Textänderung eingeführt. Das Versionsdatum steht oben.",
        ],
      },
    ],
    termsSections: [
      {
        title: "1. Nutzung",
        paragraphs: [
          "Lesen und Anfragen sind kostenlos. Erforderlich sind Internetzugang und ein aktueller Browser mit JavaScript. Mit dem Schließen endet der Besuch; es entsteht weder Abonnement noch Kundenkonto. Der Administrationsbereich ist Befugten vorbehalten.",
          "Rechtswidrige Inhalte, Spam, fremde Daten ohne Rechtsgrundlage und unbefugte Zugriffe sind untersagt. Sicherheitsmaßnahmen können übermäßige Anfragen vorübergehend begrenzen.",
        ],
      },
      {
        title: "2. Anfragen und Verträge",
        paragraphs: [
          "Beschreibungen, Bilder und Katalog zeigen Möglichkeiten der Zusammenarbeit. Das Formular bestellt oder reserviert nichts und schließt nicht automatisch einen Vertrag. Die Versandbestätigung bedeutet technische Annahme zur Bearbeitung, keine Auftragsannahme.",
          "Eine spätere Zusammenarbeit erfordert eigene Vereinbarungen zu Umfang, Parteien, Bedingungen und bei entgeltlicher Tätigkeit zu Honorar oder Provision, Kosten, Terminen und Verantwortung. Weder ein Besuch noch eine Nachricht begründet dies allein. Vereinbarungen müssen dem tatsächlichen Status der Parteien und geltendem Recht entsprechen. Anwendbare Verbraucherrechte einschließlich Information, Beschwerden und Widerruf bleiben unberührt.",
        ],
      },
      {
        title: "3. Beratung und Vermittlung",
        paragraphs: [
          "B-CORE ist ein Name zur Darstellung der persönlichen Aktivitäten des Website-Inhabers und keine Erklärung über das Bestehen eines gesondert registrierten Unternehmens oder einer Gesellschaft. “Advisory”, “brokerage” und Branchenbeschreibungen kennzeichnen Themen und mögliche Kontakte. Sie belegen für sich keine berufliche Zulassung, Vertretungsmacht, Auftragsannahme oder garantierte Verfügbarkeit einer Leistung.",
          "Website-Inhalte sind keine individuelle Rechts-, Steuer- oder Anlageberatung und keine technische Dokumentation. Erlaubnis-, zulassungs- oder prüfungspflichtige Tätigkeiten dürfen nur unter Erfüllung dieser Anforderungen erfolgen. Finanzierung, Rendite, Transaktionen und die Umsetzung jedes Vorhabens werden nicht garantiert.",
        ],
      },
      {
        title: "4. Inhalte und Verfügbarkeit",
        paragraphs: [
          "Wir bemühen uns um aktuelle Informationen. Eigenschaften, technische Konformität, Verfügbarkeit und Preise sind vor Vertragsschluss zu bestätigen. Bilder veranschaulichen Leistungen; sie sind weder Bestellspezifikation noch die Behauptung, B-CORE habe dargestellte Objekte entworfen oder ausgeführt.",
          "Rechte verbleiben bei den jeweiligen Rechteinhabern. Die Nutzung überträgt keine Rechte; Lizenzen und gesetzlich erlaubte Nutzungen bleiben unberührt. Verlinkte Dienste haben eigene Bedingungen.",
          "Wartung und Störungen können die Verfügbarkeit unterbrechen. Kontakt bleibt über E-Mail und Telefon möglich. Animationen und Helligkeit sind für den Lesekomfort einstellbar.",
        ],
      },
      {
        title: "5. Meldungen und Haftung",
        paragraphs: [
          "Probleme oder Beanstandungen können per E-Mail gemeldet werden. Beschreiben Sie Ereignis, Datum, betroffene Seite oder Funktion und gewünschte Lösung. Meldungen bearbeiten wir ohne unangemessene Verzögerung innerhalb geltender gesetzlicher Fristen.",
          "Haftung für Leistungen und Geschäfte richtet sich nach Gesetz und jeweiliger Vereinbarung. Unabdingbare Haftung und Verbraucherrechte werden nicht ausgeschlossen oder beschränkt; Beschwerden sowie Zugang zu Gerichten und Behörden bleiben möglich. Es wird kein ausschließlicher Gerichtsstand festgelegt und kein zwingender gesetzlicher Schutz entzogen.",
        ],
      },
      {
        title: "6. Datenschutz und Änderungen",
        paragraphs: [
          "Die Datenschutzerklärung ist im Seitenfuß und am Formular zugänglich. Ein Besuch ist keine Werbeeinwilligung. Änderungen gelten für spätere Website-Nutzung, nicht rückwirkend für geschlossene Verträge oder erworbene Rechte.",
        ],
      },
    ],
    resources: "Anbieterdokumente und Aufsichtsbehörden",
    status: "Art der Website",
    statusValue: "Persönliches Profil — Information und Präsentation",
  },
};
