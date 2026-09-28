import type { Lang } from "@/i18n/context";

export const serviceMeta = [
  {
    id: "business",
    path: "/doradztwo-biznesowe",
    image: "business.webp",
    label: "BUSINESS ADVISORY",
    number: "01",
  },
  {
    id: "property",
    path: "/nieruchomosci",
    image: "property.webp",
    label: "REAL ESTATE",
    number: "02",
  },
  {
    id: "solutions",
    path: "/rozwiazania-dla-biznesu",
    image: "trade.webp",
    label: "BUSINESS SOLUTIONS",
    number: "03",
  },
  {
    id: "steel",
    path: "/konstrukcje-stalowe",
    image: "steel.webp",
    label: "STEEL & ARCHITECTURE",
    number: "04",
  },
] as const;
export type ServiceId = (typeof serviceMeta)[number]["id"];
export const imagePath = (file: string) =>
  (window as unknown as { __BCORE_ASSETS__?: Record<string, string> })
    .__BCORE_ASSETS__?.[file] ||
  `${import.meta.env.BASE_URL}images/advisory/${file}`;
export const email = "przemyslaw.bugajski78@gmail.com";
export const phone = "+45 91 78 92 77";

type ServiceText = {
  title: string;
  headline: string;
  desc: string;
  tags: string[];
  intro: string;
  scope: [string, string][];
  deliver: string;
};
type Copy = {
  nav: string[];
  talk: string;
  eyebrow: string;
  hero: [string, string];
  heroDesc: string;
  explore: string;
  scroll: string;
  expertise: string;
  expertiseTitle: [string, string];
  expertiseDesc: string;
  discover: string;
  all: string;
  approach: string;
  approachTitle: string;
  approachDesc: string;
  steps: [string, string][];
  cta: string;
  ctaDesc: string;
  footer: string;
  privacy: string;
  terms: string;
  rights: string;
  back: string;
  scope: string;
  result: string;
  related: string;
  pause: string;
  play: string;
  contactTitle: string;
  contactDesc: string;
  name: string;
  mail: string;
  subject: string;
  message: string;
  send: string;
  sending: string;
  success: string;
  failure: string;
  required: string;
  projectPlaceholder: string;
  privacyNote: string;
  aboutTitle: string;
  aboutDesc: string;
  aboutBody: string;
  principles: [string, string][];
  offers: string;
  loading: string;
  empty: string;
  loadError: string;
  retry: string;
  inquire: string;
  location: string;
  minOrder: string;
  services: ServiceText[];
};

export const advisory: Record<Lang, Copy> = {
  pl: {
    nav: ["Obszary działania", "Jak pracujemy", "O B-CORE", "Kontakt"],
    talk: "Porozmawiajmy",
    eyebrow: "BUSINESS ADVISORY & BROKERAGE",
    hero: ["Dobry kierunek.", "Właściwe połączenia."],
    heroDesc:
      "Doradzamy, łączymy partnerów i pomagamy rozwijać projekty. Od potrzeby biznesowej do właściwego rozwiązania.",
    explore: "Poznaj nasze możliwości",
    scroll: "PRZEWIŃ I POZNAJ NAS",
    expertise: "OBSZARY WSPÓŁPRACY",
    expertiseTitle: ["Twój cel.", "Nasza perspektywa."],
    expertiseDesc:
      "Doradztwo i pośrednictwo dopasowane do potrzeb Twojego biznesu.",
    discover: "Poznaj możliwości",
    all: "Wszystkie obszary",
    approach: "SPOSÓB DZIAŁANIA",
    approachTitle: "Dobry projekt zaczyna się od właściwego połączenia.",
    approachDesc:
      "Porządkujemy złożone tematy. Łączymy perspektywę biznesową z technicznym zrozumieniem projektu i bezpośrednią komunikacją.",
    steps: [
      [
        "Rozumiemy cel",
        "Ustalamy potrzeby, budżet, termin i warunki, które mają znaczenie dla Twojej decyzji.",
      ],
      [
        "Szukamy rozwiązań",
        "Identyfikujemy partnerów, aktywa i dostawców. Porównujemy możliwości oraz kwestie do sprawdzenia.",
      ],
      [
        "Łączymy strony",
        "Organizujemy rozmowy i wspieramy uzgodnienia handlowe, zakres odpowiedzialności i kolejne kroki.",
      ],
      [
        "Koordynujemy proces",
        "Dbamy o przepływ informacji i kontynuujemy wsparcie w uzgodnionym zakresie.",
      ],
    ],
    cta: "Twój następny ruch.\nNasz wspólny projekt.",
    ctaDesc:
      "Masz konkretny temat albo dopiero szukasz kierunku? Zacznijmy od rozmowy.",
    footer:
      "Doradztwo biznesowe, pośrednictwo i koordynacja projektów. Łączymy cele z możliwościami rynku.",
    privacy: "Prywatność",
    terms: "Regulamin",
    rights: "Wszelkie prawa zastrzeżone.",
    back: "Wróć do obszarów",
    scope: "W czym możemy pomóc",
    result: "Co zyskujesz",
    related: "Pozostałe obszary",
    pause: "Wstrzymaj animacje",
    play: "Włącz animacje",
    contactTitle: "Porozmawiajmy\no możliwościach.",
    contactDesc:
      "Opisz swój cel. Ustalimy, jak możemy pomóc i jakie informacje będą potrzebne do kolejnego kroku.",
    name: "Imię i nazwisko / firma",
    mail: "Adres e-mail",
    subject: "Temat rozmowy",
    message: "Twój projekt",
    send: "Wyślij zapytanie",
    sending: "Wysyłanie…",
    success: "Dziękujemy. Twoja wiadomość została wysłana.",
    failure:
      "Nie udało się wysłać wiadomości. Spróbuj ponownie lub napisz bezpośrednio na nasz e-mail.",
    required: "Pola oznaczone * są wymagane.",
    projectPlaceholder:
      "Czego szukasz? Opisz zakres, lokalizację, orientacyjny budżet i termin.",
    privacyNote:
      "Dane z formularza wykorzystamy do obsługi Twojego zapytania. Szczegóły znajdziesz w polityce prywatności.",
    aboutTitle: "Szerokie spojrzenie.\nKonkretny kierunek.",
    aboutDesc: "B-CORE — Business Advisory & Brokerage",
    aboutBody:
      "B-CORE to partner w rozmowie o rozwoju biznesu. Pomagamy nazwać cel, ocenić możliwe kierunki i dotrzeć do odpowiednich ludzi. Łączymy doradztwo biznesowe, pośrednictwo oraz koordynację współpracy w obszarze projektów, nieruchomości i rozwiązań dla firm. Gdy temat wymaga specjalistycznej wiedzy, pomagamy zaangażować właściwych partnerów.",
    principles: [
      [
        "Jeden punkt kontaktu",
        "Spójny przepływ informacji między Tobą a partnerami zaangażowanymi w projekt.",
      ],
      [
        "Indywidualny zakres",
        "Najpierw poznajemy potrzebę. Dopiero później uzgadniamy zakres współpracy i wynagrodzenie.",
      ],
      [
        "Perspektywa międzynarodowa",
        "Łączymy zapotrzebowanie z możliwościami na rynku polskim i europejskim.",
      ],
    ],
    offers: "Oferty handlowe",
    loading: "Wczytywanie ofert…",
    empty:
      "Szukasz konkretnego towaru? Opowiedz nam, czego potrzebujesz. Zapytaj również o oferty dostępne bezpośrednio.",
    loadError:
      "Nie udało się pobrać ofert. Możesz ponowić próbę lub wysłać nam zapytanie.",
    retry: "Spróbuj ponownie",
    inquire: "Zapytaj o ofertę",
    location: "Lokalizacja",
    minOrder: "Minimalne zamówienie",
    services: [
      {
        title: "Doradztwo biznesowe",
        headline: "Perspektywa, która\npomaga iść dalej.",
        desc: "Pomagamy uporządkować pomysł, wybrać kierunek działania i dotrzeć do właściwych partnerów.",
        tags: ["Kierunek rozwoju", "Partnerstwa", "Projekty biznesowe"],
        intro:
          "Dobry pomysł potrzebuje właściwego kontekstu. Rozmawiamy o potrzebach, możliwościach i ograniczeniach, aby pomóc przełożyć założenia na konkretne działania. Wspieramy przedsiębiorców, właścicieli i osoby rozwijające nowe przedsięwzięcia.",
        scope: [
          [
            "Rozpoznanie potrzeb",
            "Porządkujemy cel, kluczowe założenia, zasoby i kwestie wymagające dalszego sprawdzenia.",
          ],
          [
            "Kierunki rozwoju",
            "Pomagamy rozpoznać możliwości współpracy, nowe rynki oraz potencjalnych partnerów handlowych i operacyjnych.",
          ],
          [
            "Projekty i partnerstwa",
            "Łączymy strony zainteresowane rozwojem projektu, współpracą, firmą lub wybranymi aktywami.",
          ],
          [
            "Koordynacja kolejnych kroków",
            "Wspieramy przygotowanie rozmów i przepływ informacji. W razie potrzeby angażujemy odpowiednich specjalistów.",
          ],
        ],
        deliver:
          "Jaśniejszy kierunek, uporządkowane możliwości i wsparcie w nawiązaniu właściwych relacji. Zakres działań oraz warunki współpracy ustalamy indywidualnie.",
      },
      {
        title: "Nieruchomości",
        headline: "Przestrzeń dla\nTwoich ambicji.",
        desc: "Łączymy właścicieli i inwestorów. Wyszukujemy nieruchomości oraz partnerów dopasowanych do celu projektu.",
        tags: ["Grunty inwestycyjne", "Nieruchomości komercyjne", "Off-market"],
        intro:
          "Dobra nieruchomość zaczyna się od właściwych kryteriów. Pomagamy określić kierunek poszukiwań, dotrzeć do właścicieli i uporządkować informacje potrzebne do rozmowy o transakcji.",
        scope: [
          [
            "Zakup i sprzedaż",
            "Identyfikacja potencjalnych nabywców, właścicieli i ofert dopasowanych do uzgodnionych kryteriów.",
          ],
          [
            "Grunty i projekty",
            "Poszukiwanie gruntów, obiektów komercyjnych, lokali oraz projektów z potencjałem rozwoju.",
          ],
          [
            "Możliwości off-market",
            "Bezpośrednie rozmowy i poszukiwanie możliwości poza publicznymi portalami — zależnie od dostępności.",
          ],
          [
            "Koordynacja rozmów",
            "Zebranie informacji, organizacja kontaktu i współpraca z właściwymi specjalistami przy dalszej weryfikacji.",
          ],
        ],
        deliver:
          "Uporządkowane możliwości, bezpośredni kontakt z partnerami i jasny plan kolejnych kroków. Decyzję podejmujesz na podstawie danych oraz niezależnej weryfikacji.",
      },
      {
        title: "Rozwiązania dla biznesu",
        headline: "Jedna potrzeba.\nWiele możliwości.",
        desc: "Znajdujemy partnerów i rozwiązania dla Twojej firmy — od technologii i wyposażenia po dostawy oraz handel.",
        tags: ["Dostawcy", "Technologie", "Handel B2B"],
        intro:
          "Nie musisz zaczynać od nazwy produktu. Wystarczy potrzeba, cel lub wyzwanie. Pomagamy przełożyć je na wymagania, znaleźć dostawców i porównać możliwe kierunki współpracy.",
        scope: [
          [
            "Dobór partnerów i dostawców",
            "Identyfikujemy firmy i kompetencje dopasowane do zakresu projektu, miejsca realizacji oraz budżetu.",
          ],
          [
            "Oczyszczalnie i rozwiązania środowiskowe",
            "Pomagamy dotrzeć do dostawców systemów oczyszczania ścieków i zebrać informacje potrzebne do doboru rozwiązania.",
          ],
          [
            "Okna, drzwi i rozwiązania budowlane",
            "Wspieramy kontakt z producentami stolarki oraz koordynację specyfikacji, ofert i warunków dostawy.",
          ],
          [
            "Giełda towarów i sourcing",
            "Łączymy dostawców i odbiorców. Pomagamy szukać produktów, prezentować oferty i uzgadniać warunki handlowe.",
          ],
          [
            "Indywidualne zapytania",
            "Masz temat wykraczający poza te obszary? Opisz go — sprawdzimy możliwości i ustalimy, gdzie możemy pomóc.",
          ],
        ],
        deliver:
          "Jeden punkt kontaktu dla różnych potrzeb biznesowych. Konkretne parametry, dostępność, dokumentację i zakres odpowiedzialności potwierdzamy z właściwymi dostawcami.",
      },
      {
        title: "Konstrukcje stalowe",
        headline: "Precyzja, którą\nwidać w detalu.",
        desc: "Balustrady, ogrodzenia i schody. Łączymy Twoją koncepcję z wykonawcami i rozwiązaniami dopasowanymi do inwestycji.",
        tags: ["Balustrady", "Ogrodzenia", "Schody"],
        intro:
          "Od prostego szkicu po indywidualne rozwiązania architektoniczne. Pomagamy określić wymagania, dobrać partnera wykonawczego i skoordynować ofertę na elementy stalowe.",
        scope: [
          [
            "Balustrady",
            "Rozwiązania balkonowe, tarasowe i wewnętrzne, dobierane do wymiarów oraz charakteru obiektu.",
          ],
          [
            "Ogrodzenia i bramy",
            "Przęsła, furtki i bramy — ustalenie wzoru, materiału, zabezpieczenia powierzchni i zakresu dostawy.",
          ],
          [
            "Schody i konstrukcje",
            "Schody wewnętrzne i zewnętrzne oraz indywidualne elementy stalowe według uzgodnionej dokumentacji.",
          ],
          [
            "Od zapytania do wykonawcy",
            "Zebranie wymiarów i inspiracji, konsultacja możliwości, koordynacja wyceny oraz zakresu wykonania i montażu.",
          ],
        ],
        deliver:
          "Spójną ścieżkę od koncepcji do oferty wykonawcy. Dobór konstrukcji, wymogi techniczne i ewentualny projekt potwierdza właściwy specjalista przed realizacją.",
      },
    ],
  },
  en: {
    nav: ["Expertise", "Our approach", "About B-CORE", "Contact"],
    talk: "Let's talk",
    eyebrow: "BUSINESS ADVISORY & BROKERAGE",
    hero: ["A clear direction.", "The right connections."],
    heroDesc:
      "We advise, connect partners and help projects move forward. From a business need to the right solution.",
    explore: "Explore the possibilities",
    scroll: "SCROLL TO DISCOVER",
    expertise: "AREAS OF COOPERATION",
    expertiseTitle: ["Your ambition.", "Our perspective."],
    expertiseDesc: "Advisory and brokerage tailored to your business needs.",
    discover: "Explore opportunities",
    all: "All areas",
    approach: "OUR APPROACH",
    approachTitle: "A good project starts with the right connection.",
    approachDesc:
      "We bring structure to complex challenges, combining a business perspective with technical understanding and direct communication.",
    steps: [
      [
        "Understand",
        "We establish your objectives, budget, timeline and decision criteria.",
      ],
      [
        "Explore",
        "We identify partners, assets and suppliers, comparing opportunities and points to verify.",
      ],
      [
        "Connect",
        "We organise conversations and help clarify commercial terms, responsibilities and next steps.",
      ],
      [
        "Coordinate",
        "We maintain the flow of information and provide support within the agreed scope.",
      ],
    ],
    cta: "Your next move.\nOur shared project.",
    ctaDesc:
      "Have a specific challenge or exploring a new direction? Let's start a conversation.",
    footer:
      "Business advisory, brokerage and project coordination. Connecting objectives with market opportunities.",
    privacy: "Privacy",
    terms: "Terms",
    rights: "All rights reserved.",
    back: "Back to expertise",
    scope: "How we can help",
    result: "What you gain",
    related: "Explore other areas",
    pause: "Pause animations",
    play: "Enable animations",
    contactTitle: "Let's talk\nabout possibilities.",
    contactDesc:
      "Tell us your goal. Together, we will define how we can help and what we need for the next step.",
    name: "Name / company",
    mail: "Email address",
    subject: "Subject",
    message: "Your project",
    send: "Send enquiry",
    sending: "Sending…",
    success: "Thank you. Your message has been sent.",
    failure:
      "Your message could not be sent. Please try again or email us directly.",
    required: "Fields marked * are required.",
    projectPlaceholder:
      "What are you looking for? Describe the scope, location, approximate budget and timeline.",
    privacyNote:
      "We will use these details to respond to your enquiry. See our privacy policy for further information.",
    aboutTitle: "A broader perspective.\nA clear direction.",
    aboutDesc: "B-CORE — Business Advisory & Brokerage",
    aboutBody:
      "B-CORE is a partner in the conversation about business growth. We help define objectives, consider possible directions and reach the right people. We combine business advisory, brokerage and coordination across projects, real estate and business solutions. Where specialist expertise is needed, we help involve the right partners.",
    principles: [
      [
        "One point of contact",
        "A consistent flow of information between you and the partners involved.",
      ],
      [
        "An individual scope",
        "We understand your needs before agreeing the scope and fees.",
      ],
      [
        "An international perspective",
        "Connecting demand and opportunities across Poland and Europe.",
      ],
    ],
    offers: "Trade offers",
    loading: "Loading offers…",
    empty:
      "Looking for a specific product? Tell us what you need and ask about opportunities available directly.",
    loadError:
      "We could not load the offers. Please try again or send us an enquiry.",
    retry: "Try again",
    inquire: "Enquire about this offer",
    location: "Location",
    minOrder: "Minimum order",
    services: [
      {
        title: "Business advisory",
        headline: "Perspective that\nmoves you forward.",
        desc: "Helping you structure an idea, choose a direction and reach the right partners.",
        tags: ["Business direction", "Partnerships", "Business projects"],
        intro:
          "A good idea needs the right context. We discuss needs, opportunities and constraints to help translate plans into practical steps. We support entrepreneurs, owners and people developing new ventures.",
        scope: [
          [
            "Understanding your needs",
            "Clarifying the objective, key assumptions, resources and matters requiring further review.",
          ],
          [
            "Business development",
            "Exploring cooperation, new markets and potential commercial and operational partners.",
          ],
          [
            "Projects and partnerships",
            "Connecting parties interested in a project, cooperation, a business or selected assets.",
          ],
          [
            "Coordinating next steps",
            "Preparing discussions and facilitating information flow, involving relevant specialists where needed.",
          ],
        ],
        deliver:
          "A clearer direction, structured opportunities and support in building the right relationships. Scope and terms are agreed individually.",
      },
      {
        title: "Real estate",
        headline: "Space for\nyour ambition.",
        desc: "Connecting owners and investors. Identifying properties and partners that fit your project's objectives.",
        tags: ["Investment land", "Commercial property", "Off-market"],
        intro:
          "The right property starts with the right criteria. We help define your search, reach owners and organise the information needed for a transaction discussion.",
        scope: [
          [
            "Buying and selling",
            "Identifying potential buyers, owners and properties that fit the agreed criteria.",
          ],
          [
            "Land and development",
            "Sourcing land, commercial buildings and development opportunities.",
          ],
          [
            "Off-market opportunities",
            "Direct conversations and opportunities beyond public listings, subject to availability.",
          ],
          [
            "Coordinating discussions",
            "Gathering information and connecting the parties and appropriate specialists for further verification.",
          ],
        ],
        deliver:
          "A structured view of opportunities, direct partner contacts and clear next steps. Decisions are supported by information and independent verification.",
      },
      {
        title: "Business solutions",
        headline: "One need.\nMany possibilities.",
        desc: "Finding partners and solutions for your business, from technology and equipment to sourcing and trade.",
        tags: ["Suppliers", "Technology", "B2B trade"],
        intro:
          "You do not need to start with a product name. Start with a need, objective or challenge. We help translate it into requirements, find suppliers and compare opportunities.",
        scope: [
          [
            "Partners and suppliers",
            "Identifying companies and expertise matching your scope, location and budget.",
          ],
          [
            "Wastewater and environmental solutions",
            "Connecting you with wastewater treatment suppliers and gathering information needed to select a solution.",
          ],
          [
            "Windows, doors and building solutions",
            "Supporting manufacturer contacts and coordination of specifications, quotations and delivery terms.",
          ],
          [
            "Trade marketplace and sourcing",
            "Connecting suppliers and buyers, sourcing products, presenting offers and discussing terms.",
          ],
          [
            "Individual enquiries",
            "Have a challenge beyond these areas? Describe it and we will explore where we can help.",
          ],
        ],
        deliver:
          "One point of contact for a range of business needs. Specifications, availability, documentation and responsibilities are confirmed with the relevant suppliers.",
      },
      {
        title: "Steel structures",
        headline: "Precision in\nevery detail.",
        desc: "Railings, fences and staircases. Connecting your concept with manufacturers and solutions tailored to your project.",
        tags: ["Railings", "Fences & gates", "Staircases"],
        intro:
          "From an initial sketch to bespoke architectural elements. We help clarify requirements, find manufacturing partners and coordinate quotations.",
        scope: [
          [
            "Railings",
            "Balcony, terrace and interior solutions tailored to dimensions and the building's character.",
          ],
          [
            "Fences and gates",
            "Panels, pedestrian gates and driveway gates, with agreed design, material, finish and delivery.",
          ],
          [
            "Stairs and structures",
            "Internal and external staircases and bespoke steel elements to agreed documentation.",
          ],
          [
            "From brief to supplier",
            "Dimensions, references, feasibility discussions, pricing and the scope of manufacturing and installation.",
          ],
        ],
        deliver:
          "A clear path from concept to a supplier quotation. Structural design, technical requirements and necessary engineering are confirmed by the appropriate specialist before production.",
      },
    ],
  },
  da: {
    nav: ["Kompetencer", "Sådan arbejder vi", "Om B-CORE", "Kontakt"],
    talk: "Lad os tale sammen",
    eyebrow: "BUSINESS ADVISORY & BROKERAGE",
    hero: ["En klar retning.", "De rette forbindelser."],
    heroDesc:
      "Vi rådgiver, forbinder partnere og hjælper projekter videre. Fra et forretningsbehov til den rette løsning.",
    explore: "Se mulighederne",
    scroll: "RUL NED OG LÆR OS AT KENDE",
    expertise: "SAMARBEJDSOMRÅDER",
    expertiseTitle: ["Dit mål.", "Vores perspektiv."],
    expertiseDesc: "Rådgivning og formidling tilpasset din virksomheds behov.",
    discover: "Se mulighederne",
    all: "Alle områder",
    approach: "VORES TILGANG",
    approachTitle: "Et godt projekt begynder med den rette forbindelse.",
    approachDesc:
      "Vi skaber struktur i komplekse projekter og kombinerer forretningsforståelse med teknisk indsigt og direkte kommunikation.",
    steps: [
      [
        "Forstå målet",
        "Vi afklarer behov, budget, tidsplan og de vigtigste kriterier.",
      ],
      [
        "Find løsninger",
        "Vi identificerer partnere, aktiver og leverandører og sammenligner muligheder.",
      ],
      [
        "Forbind parterne",
        "Vi organiserer samtaler og understøtter afklaring af vilkår og ansvar.",
      ],
      [
        "Koordiner processen",
        "Vi sikrer informationsflow og støtte inden for det aftalte omfang.",
      ],
    ],
    cta: "Dit næste skridt.\nVores fælles projekt.",
    ctaDesc:
      "Har du en konkret opgave, eller søger du en ny retning? Lad os begynde med en samtale.",
    footer:
      "Forretningsrådgivning, formidling og projektkoordinering. Vi forbinder mål med markedets muligheder.",
    privacy: "Privatliv",
    terms: "Vilkår",
    rights: "Alle rettigheder forbeholdes.",
    back: "Tilbage til kompetencer",
    scope: "Sådan kan vi hjælpe",
    result: "Det får du",
    related: "Andre områder",
    pause: "Sæt animationer på pause",
    play: "Aktivér animationer",
    contactTitle: "Lad os tale\nom mulighederne.",
    contactDesc:
      "Beskriv dit mål. Vi afklarer, hvordan vi kan hjælpe, og hvad der skal til for næste skridt.",
    name: "Navn / virksomhed",
    mail: "E-mailadresse",
    subject: "Emne",
    message: "Dit projekt",
    send: "Send forespørgsel",
    sending: "Sender…",
    success: "Tak. Din besked er sendt.",
    failure:
      "Beskeden kunne ikke sendes. Prøv igen, eller skriv direkte til os.",
    required: "Felter med * er obligatoriske.",
    projectPlaceholder: "Beskriv behov, sted, omtrentligt budget og tidsplan.",
    privacyNote:
      "Oplysningerne bruges til at besvare din forespørgsel. Se vores privatlivspolitik.",
    aboutTitle: "Et bredere perspektiv.\nEn klar retning.",
    aboutDesc: "B-CORE — Business Advisory & Brokerage",
    aboutBody:
      "B-CORE er din partner i samtalen om forretningsudvikling. Vi hjælper med at definere målet, vurdere mulige retninger og finde de rette mennesker. Vi kombinerer rådgivning, formidling og koordinering inden for projekter, ejendomme og erhvervsløsninger. Ved behov hjælper vi med at inddrage relevante specialister.",
    principles: [
      [
        "Én kontaktperson",
        "Et sammenhængende informationsflow mellem dig og projektets partnere.",
      ],
      [
        "Individuelt omfang",
        "Vi afklarer behov, før vi aftaler opgaver og honorar.",
      ],
      [
        "Internationalt perspektiv",
        "Vi forbinder efterspørgsel og muligheder i Polen og Europa.",
      ],
    ],
    offers: "Handelstilbud",
    loading: "Indlæser tilbud…",
    empty:
      "Søger du en bestemt vare? Fortæl os om dine behov, og spørg efter muligheder direkte.",
    loadError: "Tilbuddene kunne ikke indlæses. Prøv igen, eller kontakt os.",
    retry: "Prøv igen",
    inquire: "Spørg til tilbuddet",
    location: "Placering",
    minOrder: "Minimumsordre",
    services: [
      {
        title: "Forretningsrådgivning",
        headline: "Perspektiv, der\nbringer dig videre.",
        desc: "Vi hjælper med at strukturere idéer, vælge retning og finde de rette partnere.",
        tags: ["Udvikling", "Partnerskaber", "Forretningsprojekter"],
        intro:
          "En god idé har brug for den rette sammenhæng. Vi taler om behov, muligheder og begrænsninger for at omsætte planer til konkrete skridt.",
        scope: [
          [
            "Behovsafklaring",
            "Vi afklarer mål, forudsætninger, ressourcer og forhold til nærmere undersøgelse.",
          ],
          [
            "Udviklingsmuligheder",
            "Vi undersøger samarbejde, nye markeder og mulige handels- og driftspartnere.",
          ],
          [
            "Projekter og partnerskaber",
            "Vi forbinder parter med interesse i projekter, samarbejde, virksomheder eller aktiver.",
          ],
          [
            "Næste skridt",
            "Vi forbereder samtaler og informationsflow og inddrager relevante specialister ved behov.",
          ],
        ],
        deliver:
          "En klarere retning, strukturerede muligheder og støtte til de rette relationer. Omfang og vilkår aftales individuelt.",
      },
      {
        title: "Ejendomme",
        headline: "Plads til\ndine ambitioner.",
        desc: "Vi forbinder ejere og investorer og finder ejendomme og partnere, der passer til projektets mål.",
        tags: ["Investeringsgrunde", "Erhvervsejendomme", "Off-market"],
        intro:
          "Den rette ejendom begynder med de rette kriterier. Vi afklarer søgningen, skaber kontakt til ejere og samler oplysninger til dialogen.",
        scope: [
          [
            "Køb og salg",
            "Identifikation af potentielle købere, ejere og relevante ejendomme.",
          ],
          [
            "Grunde og udvikling",
            "Søgning efter grunde, erhvervsejendomme og udviklingsprojekter.",
          ],
          [
            "Off-market",
            "Direkte dialog om muligheder uden for offentlige portaler, afhængigt af tilgængelighed.",
          ],
          [
            "Koordinering",
            "Indsamling af oplysninger og kontakt til parter og relevante specialister.",
          ],
        ],
        deliver:
          "Et struktureret overblik, direkte kontakter og klare næste skridt. Beslutninger baseres på oplysninger og uafhængig kontrol.",
      },
      {
        title: "Erhvervsløsninger",
        headline: "Ét behov.\nMange muligheder.",
        desc: "Vi finder partnere og løsninger til din virksomhed, fra teknologi og udstyr til indkøb og handel.",
        tags: ["Leverandører", "Teknologi", "B2B-handel"],
        intro:
          "Begynd med et behov, et mål eller en udfordring. Vi hjælper med krav, leverandørsøgning og sammenligning af muligheder.",
        scope: [
          [
            "Partnere og leverandører",
            "Virksomheder og kompetencer, der matcher projektets omfang, sted og budget.",
          ],
          [
            "Spildevand og miljø",
            "Kontakt til leverandører af renseanlæg og oplysninger til valg af løsning.",
          ],
          [
            "Vinduer, døre og byggeri",
            "Kontakt til producenter samt koordinering af specifikationer, tilbud og levering.",
          ],
          [
            "Varehandel og sourcing",
            "Vi forbinder leverandører og købere, finder produkter og understøtter handelsvilkår.",
          ],
          [
            "Individuelle forespørgsler",
            "Beskriv opgaver uden for disse områder, så undersøger vi, hvor vi kan hjælpe.",
          ],
        ],
        deliver:
          "Én kontakt til forskellige forretningsbehov. Egenskaber, tilgængelighed, dokumentation og ansvar bekræftes med relevante leverandører.",
      },
      {
        title: "Stålkonstruktioner",
        headline: "Præcision i\nhver detalje.",
        desc: "Gelændere, hegn og trapper. Vi forbinder din idé med producenter og løsninger til dit projekt.",
        tags: ["Gelændere", "Hegn & porte", "Trapper"],
        intro:
          "Fra skitse til individuelle arkitektoniske elementer. Vi afklarer krav, finder udførende partnere og koordinerer tilbud.",
        scope: [
          [
            "Gelændere",
            "Løsninger til altaner, terrasser og indendørs brug tilpasset mål og bygning.",
          ],
          [
            "Hegn og porte",
            "Sektioner, låger og porte med aftalt design, materiale og overflade.",
          ],
          [
            "Trapper og konstruktioner",
            "Indvendige og udvendige trapper samt specialelementer efter aftalt dokumentation.",
          ],
          [
            "Fra idé til producent",
            "Mål, inspiration, muligheder, tilbud samt aftale om produktion og montage.",
          ],
        ],
        deliver:
          "En klar vej fra idé til tilbud. Konstruktion og tekniske krav bekræftes af relevant specialist før udførelse.",
      },
    ],
  },
  de: {
    nav: ["Kompetenzen", "Arbeitsweise", "Über B-CORE", "Kontakt"],
    talk: "Sprechen wir darüber",
    eyebrow: "BUSINESS ADVISORY & BROKERAGE",
    hero: ["Eine klare Richtung.", "Die richtigen Kontakte."],
    heroDesc:
      "Wir beraten, verbinden Partner und bringen Projekte voran. Vom geschäftlichen Bedarf zur passenden Lösung.",
    explore: "Möglichkeiten entdecken",
    scroll: "SCROLLEN UND ENTDECKEN",
    expertise: "BEREICHE DER ZUSAMMENARBEIT",
    expertiseTitle: ["Ihr Ziel.", "Unsere Perspektive."],
    expertiseDesc: "Beratung und Vermittlung passend zu Ihrem Unternehmen.",
    discover: "Möglichkeiten entdecken",
    all: "Alle Bereiche",
    approach: "UNSERE ARBEITSWEISE",
    approachTitle: "Ein gutes Projekt beginnt mit der richtigen Verbindung.",
    approachDesc:
      "Wir strukturieren komplexe Aufgaben und verbinden wirtschaftliches Denken mit technischem Verständnis und direkter Kommunikation.",
    steps: [
      [
        "Verstehen",
        "Wir klären Ziele, Budget, Zeitplan und Entscheidungskriterien.",
      ],
      [
        "Möglichkeiten finden",
        "Wir identifizieren Partner, Vermögenswerte und Lieferanten und vergleichen Optionen.",
      ],
      [
        "Verbinden",
        "Wir organisieren Gespräche und unterstützen die Klärung von Konditionen und Verantwortung.",
      ],
      [
        "Koordinieren",
        "Wir sichern den Informationsfluss und begleiten den vereinbarten Umfang.",
      ],
    ],
    cta: "Ihr nächster Schritt.\nUnser gemeinsames Projekt.",
    ctaDesc:
      "Eine konkrete Aufgabe oder eine neue Richtung? Beginnen wir mit einem Gespräch.",
    footer:
      "Unternehmensberatung, Vermittlung und Projektkoordination. Wir verbinden Ziele mit Marktchancen.",
    privacy: "Datenschutz",
    terms: "Bedingungen",
    rights: "Alle Rechte vorbehalten.",
    back: "Zurück zu den Kompetenzen",
    scope: "Wie wir unterstützen",
    result: "Ihr Mehrwert",
    related: "Weitere Bereiche",
    pause: "Animationen pausieren",
    play: "Animationen aktivieren",
    contactTitle: "Sprechen wir\nüber Möglichkeiten.",
    contactDesc:
      "Beschreiben Sie Ihr Ziel. Wir klären, wie wir helfen können und welche Informationen wir benötigen.",
    name: "Name / Unternehmen",
    mail: "E-Mail-Adresse",
    subject: "Thema",
    message: "Ihr Projekt",
    send: "Anfrage senden",
    sending: "Wird gesendet…",
    success: "Vielen Dank. Ihre Nachricht wurde gesendet.",
    failure:
      "Die Nachricht konnte nicht gesendet werden. Versuchen Sie es erneut oder schreiben Sie uns direkt.",
    required: "Mit * markierte Felder sind Pflichtfelder.",
    projectPlaceholder:
      "Beschreiben Sie Umfang, Standort, ungefähres Budget und Zeitplan.",
    privacyNote:
      "Wir nutzen Ihre Angaben zur Bearbeitung Ihrer Anfrage. Weitere Informationen finden Sie im Datenschutz.",
    aboutTitle: "Eine breite Perspektive.\nEine klare Richtung.",
    aboutDesc: "B-CORE — Business Advisory & Brokerage",
    aboutBody:
      "B-CORE ist Ihr Gesprächspartner für Geschäftsentwicklung. Wir helfen, Ziele zu definieren, mögliche Wege zu bewerten und die richtigen Menschen zu erreichen. Wir verbinden Unternehmensberatung, Vermittlung und Koordination in Projekten, Immobilien und Geschäftslösungen. Bei Bedarf unterstützen wir die Einbindung geeigneter Spezialisten.",
    principles: [
      [
        "Ein Ansprechpartner",
        "Ein abgestimmter Informationsfluss zwischen Ihnen und den Projektpartnern.",
      ],
      [
        "Individueller Umfang",
        "Wir klären den Bedarf, bevor wir Leistungsumfang und Vergütung vereinbaren.",
      ],
      [
        "Internationale Perspektive",
        "Wir verbinden Nachfrage und Möglichkeiten in Polen und Europa.",
      ],
    ],
    offers: "Handelsangebote",
    loading: "Angebote werden geladen…",
    empty:
      "Suchen Sie ein bestimmtes Produkt? Beschreiben Sie Ihren Bedarf und fragen Sie nach direkt verfügbaren Möglichkeiten.",
    loadError:
      "Die Angebote konnten nicht geladen werden. Versuchen Sie es erneut oder kontaktieren Sie uns.",
    retry: "Erneut versuchen",
    inquire: "Angebot anfragen",
    location: "Standort",
    minOrder: "Mindestbestellung",
    services: [
      {
        title: "Unternehmensberatung",
        headline: "Perspektiven, die\nSie weiterbringen.",
        desc: "Wir helfen, Ideen zu strukturieren, eine Richtung zu wählen und passende Partner zu erreichen.",
        tags: ["Entwicklung", "Partnerschaften", "Geschäftsprojekte"],
        intro:
          "Eine gute Idee braucht den richtigen Kontext. Wir besprechen Bedarf, Möglichkeiten und Grenzen, um Pläne in konkrete Schritte zu übersetzen.",
        scope: [
          [
            "Bedarf klären",
            "Ziele, Annahmen, Ressourcen und Themen für eine weitere Prüfung strukturieren.",
          ],
          [
            "Entwicklungsmöglichkeiten",
            "Zusammenarbeit, neue Märkte sowie mögliche Handels- und Betriebspartner erkennen.",
          ],
          [
            "Projekte und Partnerschaften",
            "Interessenten für Projekte, Zusammenarbeit, Unternehmen und Vermögenswerte verbinden.",
          ],
          [
            "Nächste Schritte",
            "Gespräche und Informationsfluss vorbereiten und bei Bedarf geeignete Fachleute einbeziehen.",
          ],
        ],
        deliver:
          "Eine klarere Richtung, strukturierte Möglichkeiten und Unterstützung beim Aufbau passender Beziehungen. Umfang und Konditionen werden individuell vereinbart.",
      },
      {
        title: "Immobilien",
        headline: "Raum für\nIhre Ambitionen.",
        desc: "Wir verbinden Eigentümer und Investoren und finden Immobilien und Partner passend zum Projektziel.",
        tags: ["Investitionsgrundstücke", "Gewerbeimmobilien", "Off-market"],
        intro:
          "Die passende Immobilie beginnt mit klaren Kriterien. Wir strukturieren die Suche, erreichen Eigentümer und ordnen relevante Informationen.",
        scope: [
          [
            "Kauf und Verkauf",
            "Identifikation potenzieller Käufer, Eigentümer und geeigneter Immobilien.",
          ],
          [
            "Grundstücke und Projekte",
            "Suche nach Grundstücken, Gewerbeobjekten und Entwicklungsmöglichkeiten.",
          ],
          [
            "Off-market",
            "Direkte Gespräche über Möglichkeiten außerhalb öffentlicher Portale, je nach Verfügbarkeit.",
          ],
          [
            "Koordination",
            "Informationen sammeln und Kontakte zu Beteiligten und geeigneten Fachleuten herstellen.",
          ],
        ],
        deliver:
          "Strukturierte Möglichkeiten, direkte Kontakte und klare nächste Schritte. Entscheidungen erfolgen auf Basis von Informationen und unabhängiger Prüfung.",
      },
      {
        title: "Geschäftslösungen",
        headline: "Ein Bedarf.\nViele Möglichkeiten.",
        desc: "Partner und Lösungen für Ihr Unternehmen, von Technik und Ausstattung bis zu Beschaffung und Handel.",
        tags: ["Lieferanten", "Technologie", "B2B-Handel"],
        intro:
          "Beginnen Sie mit einem Bedarf, Ziel oder einer Aufgabe. Wir helfen bei Anforderungen, Lieferantensuche und dem Vergleich von Möglichkeiten.",
        scope: [
          [
            "Partner und Lieferanten",
            "Unternehmen und Kompetenzen passend zu Umfang, Standort und Budget finden.",
          ],
          [
            "Abwasser und Umwelt",
            "Kontakte zu Anbietern von Kläranlagen und Informationen zur Auswahl einer Lösung.",
          ],
          [
            "Fenster, Türen und Baulösungen",
            "Herstellerkontakte sowie Koordination von Spezifikationen, Angeboten und Lieferbedingungen.",
          ],
          [
            "Warenmarkt und Sourcing",
            "Lieferanten und Käufer verbinden, Produkte suchen, Angebote präsentieren und Konditionen klären.",
          ],
          [
            "Individuelle Anfragen",
            "Beschreiben Sie Aufgaben außerhalb dieser Bereiche. Wir prüfen, wo wir unterstützen können.",
          ],
        ],
        deliver:
          "Ein Ansprechpartner für unterschiedliche Geschäftsbedürfnisse. Eigenschaften, Verfügbarkeit, Dokumentation und Verantwortung werden mit den jeweiligen Anbietern bestätigt.",
      },
      {
        title: "Stahlkonstruktionen",
        headline: "Präzision bis\nins Detail.",
        desc: "Geländer, Zäune und Treppen. Wir verbinden Ihre Idee mit Herstellern und passenden Lösungen.",
        tags: ["Geländer", "Zäune & Tore", "Treppen"],
        intro:
          "Von der Skizze zu individuellen Architekturelementen. Wir klären Anforderungen, finden Fertigungspartner und koordinieren Angebote.",
        scope: [
          [
            "Geländer",
            "Lösungen für Balkone, Terrassen und Innenräume nach Maß und Gebäudecharakter.",
          ],
          [
            "Zäune und Tore",
            "Zaunfelder, Türen und Tore mit vereinbartem Design, Material und Oberflächenschutz.",
          ],
          [
            "Treppen und Konstruktionen",
            "Innen- und Außentreppen sowie individuelle Stahlelemente nach vereinbarter Dokumentation.",
          ],
          [
            "Von der Idee zum Hersteller",
            "Maße, Referenzen, Machbarkeit, Angebote sowie Umfang von Fertigung und Montage.",
          ],
        ],
        deliver:
          "Ein klarer Weg von der Idee zum Herstellerangebot. Konstruktion und technische Anforderungen werden vor Ausführung durch geeignete Fachleute bestätigt.",
      },
    ],
  },
};
