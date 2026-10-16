import type { Lang } from "@/i18n/context";

export const serviceMeta = [
  {
    id: "business",
    path: "/doradztwo-biznesowe",
    image: "business.webp",
    label: "EXECUTIVE ADVISORY",
    number: "01",
  },
  {
    id: "property",
    path: "/nieruchomosci",
    image: "property.webp",
    label: "REAL ESTATE ADVISORY",
    number: "02",
  },
  {
    id: "solutions",
    path: "/rozwiazania-dla-biznesu",
    image: "trade.webp",
    label: "COMMERCIAL SOLUTIONS",
    number: "03",
  },
  {
    id: "steel",
    path: "/konstrukcje-stalowe",
    image: "steel.webp",
    label: "STEEL STRUCTURES",
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
  areaLabels: string[];
  visionLine: string;
  galleryEyebrow: string;
  galleryDetail: string;
  connectEyebrow: string;
  geography: string;
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
    areaLabels: ["DORADZTWO BIZNESOWE", "NIERUCHOMOŚCI INWESTYCYJNE", "ROZWIĄZANIA DLA BIZNESU", "KONSTRUKCJE STALOWE"],
    visionLine: "OD WIZJI DO WSPÓŁPRACY.",
    galleryEyebrow: "STAL I ARCHITEKTURA",
    galleryDetail: "DETAL",
    connectEyebrow: "POROZMAWIAJMY",
    geography: "POLSKA · DANIA · EUROPA",
    services: [
      {
        title: "Doradztwo biznesowe",
        headline: "Doradztwo, które\nporządkuje decyzje.",
        desc: "Wspieramy rozwój przedsiębiorstw, strategiczne rozmowy oraz pośrednictwo w poszukiwaniu i sprzedaży firm dopasowanych do indywidualnych kryteriów.",
        tags: ["Strategia i rozwój", "Partnerstwa i inwestorzy", "Kupno i sprzedaż firm"],
        intro:
          "Każdy biznes wymaga właściwego kierunku i odpowiednich relacji. Pomagamy uporządkować cele, zidentyfikować możliwości rozwoju oraz znaleźć partnerów, inwestorów, nabywców lub przedsiębiorstwa odpowiadające indywidualnym oczekiwaniom. Wspieramy kontakt i przygotowanie rozmów, a formalną i finansową ocenę transakcji pozostawiamy właściwym specjalistom.",
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
          ["Pośrednictwo w kupnie i sprzedaży firm", "Na podstawie ustalonych kryteriów poszukujemy przedsiębiorstw na sprzedaż, potencjalnych nabywców lub partnerów do przejęcia i rozwoju biznesu. Pomagamy zorganizować kontakt i kolejne etapy rozmów."]
        ],
        deliver:
          "Jaśniejszy kierunek, uporządkowane możliwości i wsparcie w nawiązaniu właściwych relacji. Zakres działań oraz warunki współpracy ustalamy indywidualnie.",
      },
      {
        title: "Nieruchomości",
        headline: "Przestrzeń dla\nTwoich ambicji.",
        desc: "Poszukujemy gruntów inwestycyjnych, budynków komercyjnych i gotowych projektów. Łączymy właścicieli, inwestorów oraz nabywców.",
        tags: ["Budynki komercyjne", "Grunty inwestycyjne", "Gotowe projekty", "Off-market"],
        intro:
          "Poszukujesz nieruchomości pod inwestycję albo chcesz sprzedać atrakcyjny obiekt? Pomagamy dotrzeć do gruntów inwestycyjnych, budynków i lokali komercyjnych, nieruchomości dochodowych oraz gotowych projektów deweloperskich. Pracujemy według indywidualnych kryteriów: lokalizacji, przeznaczenia, budżetu i potencjału przedsięwzięcia. Ułatwiamy bezpośredni kontakt właścicieli, inwestorów i partnerów.",
        scope: [
          [
                    "Budynki i obiekty komercyjne",
                    "Wyszukujemy i przedstawiamy możliwości dotyczące biurowców, magazynów, hal, lokali usługowych i innych obiektów inwestycyjnych."
          ],
          [
                    "Grunty inwestycyjne",
                    "Poszukujemy działek pod zabudowę mieszkaniową, usługową, logistyczną lub przemysłową, zgodnie z ustalonymi wymaganiami."
          ],
          [
                    "Gotowe projekty i inwestycje",
                    "Pomagamy dotrzeć do projektów deweloperskich, nieruchomości z dokumentacją lub obiektów o potencjale dalszego rozwoju."
          ],
          [
                    "Zakup, sprzedaż i off-market",
                    "Łączymy właścicieli, sprzedających i potencjalnych nabywców. Poszukujemy także ofert poza publicznymi portalami, zależnie od dostępności."
          ],
          [
                    "Indywidualne poszukiwania i koordynacja",
                    "Ustalamy kryteria, gromadzimy dostępne informacje i organizujemy kontakt. Analizy prawne, techniczne i finansowe wymagają niezależnej weryfikacji."
          ]
],
        deliver:
          "Uporządkowane możliwości, bezpośredni kontakt z partnerami i jasny plan kolejnych kroków. Decyzję podejmujesz na podstawie danych oraz niezależnej weryfikacji.",
      },
      {
        title: "Rozwiązania dla biznesu",
        headline: "Potrzeba, partner,\ni sprawna realizacja.",
        desc: "Oczyszczalnie ścieków, technologie środowiskowe, rozwiązania budowlane i sourcing B2B. Łączymy firmy z odpowiednimi producentami i dostawcami.",
        tags: ["Oczyszczalnie ścieków", "Technologie środowiskowe", "Okna i drzwi", "Sourcing B2B"],
        intro:
          "Od technologii oczyszczania ścieków po wyposażenie inwestycji i zamówienia przemysłowe — pomagamy znaleźć odpowiednie rozwiązania oraz producentów w Polsce i za granicą. Pracujemy na podstawie parametrów projektu, wymagań technicznych, budżetu i oczekiwanego terminu. Łączymy strony, porównujemy możliwości współpracy i wspieramy uzgodnienia handlowe.",
        scope: [
          [
                    "Oczyszczalnie ścieków",
                    "Pomagamy znaleźć producentów i dostawców oczyszczalni oraz technologii oczyszczania ścieków dla obiektów i inwestycji. Zakres, parametry i zgodność techniczną potwierdza dostawca."
          ],
          [
                    "Rozwiązania środowiskowe i techniczne",
                    "Poszukujemy urządzeń, instalacji i partnerów technologicznych dopasowanych do potrzeb przedsiębiorstw oraz realizowanych inwestycji."
          ],
          [
                    "Okna, drzwi i materiały budowlane",
                    "Ułatwiamy kontakt z producentami stolarki i dostawcami rozwiązań budowlanych, a także porównanie specyfikacji, ofert i dostaw."
          ],
          [
                    "Sourcing produktów i dostawców",
                    "Identyfikujemy producentów, dostawców i produkty na podstawie zapotrzebowania, parametrów oraz warunków zamówienia."
          ],
          [
                    "Pośrednictwo handlowe B2B",
                    "Łączymy dostawców i odbiorców, pomagamy przedstawiać oferty i koordynować rozmowy dotyczące dostaw oraz warunków współpracy."
          ],
          [
                    "Rozwiązania na indywidualne zamówienie",
                    "Jeśli potrzebujesz nietypowego produktu, technologii lub wykonawcy, przedstaw wymagania — sprawdzimy dostępne możliwości i partnerów."
          ]
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
    areaLabels: ["BUSINESS ADVISORY", "INVESTMENT REAL ESTATE", "BUSINESS SOLUTIONS", "STEEL STRUCTURES"],
    visionLine: "FROM VISION TO COLLABORATION.",
    galleryEyebrow: "STEEL & ARCHITECTURE",
    galleryDetail: "DETAIL",
    connectEyebrow: "LET’S CONNECT",
    geography: "POLAND · DENMARK · EUROPE",
    services: [
      {
        title: "Business advisory",
        headline: "Advisory that\nsharpens decisions.",
        desc: "We support business growth, strategic discussions and tailored brokerage for buying or selling companies based on individual criteria.",
        tags: ["Strategy & growth", "Partnerships & investors", "Buying & selling businesses"],
        intro:
          "Every business needs direction and the right relationships. We help clarify objectives, identify opportunities and connect with partners, investors, buyers or businesses that match specific requirements. We facilitate introductions and discussions; legal and financial due diligence is carried out by relevant independent specialists.",
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
          ["Business acquisition and sale introductions", "Based on agreed criteria, we look for businesses available for sale, potential buyers or acquisition partners. We help organise introductions and the next steps in discussions."]
        ],
        deliver:
          "A clearer direction, structured opportunities and support in building the right relationships. Scope and terms are agreed individually.",
      },
      {
        title: "Real estate",
        headline: "Space for\nyour ambition.",
        desc: "We source development land, commercial properties and ready-to-develop projects, connecting owners, investors and buyers.",
        tags: ["Commercial properties", "Development land", "Ready-to-develop projects", "Off-market"],
        intro:
          "Looking for an investment property or planning to sell an asset? We help source development land, commercial buildings and premises, income-generating property and ready-to-develop projects. Searches follow individual criteria: location, permitted use, budget and project potential. We facilitate direct introductions between owners, investors and partners.",
        scope: [
          [
                    "Commercial buildings and assets",
                    "We seek opportunities involving offices, warehouses, industrial units, retail premises and other investment properties."
          ],
          [
                    "Development land",
                    "We source land for residential, commercial, logistics or industrial use according to agreed requirements."
          ],
          [
                    "Ready-to-develop projects",
                    "We help identify development projects, properties with documentation and assets with potential for further development."
          ],
          [
                    "Acquisition, sale and off-market",
                    "We connect owners, sellers and potential buyers, including opportunities outside public listings where available."
          ],
          [
                    "Tailored searches and coordination",
                    "We define criteria, gather available information and arrange introductions. Legal, technical and financial checks require independent verification."
          ]
],
        deliver:
          "A structured view of opportunities, direct partner contacts and clear next steps. Decisions are supported by information and independent verification.",
      },
      {
        title: "Business solutions",
        headline: "A clear need.\nThe right execution.",
        desc: "Wastewater treatment plants, environmental technology, building solutions and B2B sourcing. We connect companies with suitable manufacturers and suppliers.",
        tags: ["Wastewater treatment", "Environmental technology", "Windows & doors", "B2B sourcing"],
        intro:
          "From wastewater treatment systems to construction products and industrial procurement, we help identify solutions and suppliers in Poland and abroad. We start with your project specifications, technical requirements, budget and timeline, then compare options and facilitate commercial discussions.",
        scope: [
          [
                    "Wastewater treatment plants",
                    "We help identify manufacturers and suppliers of wastewater treatment plants and treatment technologies for facilities and developments. The supplier confirms suitability, specifications and compliance."
          ],
          [
                    "Environmental and technical solutions",
                    "We source equipment, systems and technology partners that match operational or investment requirements."
          ],
          [
                    "Windows, doors and building products",
                    "We facilitate contact with manufacturers and suppliers and help compare specifications, quotations and delivery terms."
          ],
          [
                    "Product and supplier sourcing",
                    "We identify manufacturers, suppliers and products based on demand, technical parameters and purchasing conditions."
          ],
          [
                    "B2B trade brokerage",
                    "We introduce suppliers and buyers and support offers, delivery discussions and commercial arrangements."
          ],
          [
                    "Tailored solutions",
                    "For specialised products, technology or contractors, share your requirements and we will explore available partners and options."
          ]
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
    areaLabels: ["FORRETNINGSRÅDGIVNING", "INVESTERINGSEJENDOMME", "ERHVERVSLØSNINGER", "STÅLKONSTRUKTIONER"],
    visionLine: "FRA VISION TIL SAMARBEJDE.",
    galleryEyebrow: "STÅL OG ARKITEKTUR",
    galleryDetail: "DETALJE",
    connectEyebrow: "LAD OS TALE SAMMEN",
    geography: "POLEN · DANMARK · EUROPA",
    services: [
      {
        title: "Forretningsrådgivning",
        headline: "Rådgivning, der\nskaber klarhed.",
        desc: "Vi understøtter virksomheders udvikling, strategiske drøftelser og individuel formidling ved køb eller salg af virksomheder.",
        tags: ["Strategi og udvikling", "Partnere og investorer", "Køb og salg af virksomheder"],
        intro:
          "Enhver virksomhed har brug for en klar retning og de rette relationer. Vi hjælper med at afklare mål, identificere muligheder og finde partnere, investorer, købere eller virksomheder, der passer til konkrete ønsker. Vi formidler kontakten og understøtter dialogen; juridisk og økonomisk due diligence udføres af relevante uafhængige specialister.",
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
          ["Køb og salg af virksomheder", "På baggrund af aftalte kriterier søger vi virksomheder til salg, potentielle købere eller overtagelsespartnere. Vi formidler kontakt og hjælper med næste skridt i dialogen."]
        ],
        deliver:
          "En klarere retning, strukturerede muligheder og støtte til de rette relationer. Omfang og vilkår aftales individuelt.",
      },
      {
        title: "Ejendomme",
        headline: "Plads til\ndine ambitioner.",
        desc: "Vi søger erhvervsejendomme, investeringsgrunde og færdigudviklede projekter og forbinder ejere, investorer og købere.",
        tags: ["Erhvervsejendomme", "Investeringsgrunde", "Udviklingsklare projekter", "Off-market"],
        intro:
          "Leder du efter en investeringsejendom, eller ønsker du at sælge en ejendom? Vi hjælper med at finde investeringsgrunde, erhvervsbygninger, udlejningsejendomme og projekter klar til udvikling. Søgningen tilpasses beliggenhed, anvendelse, budget og udviklingsmuligheder. Vi skaber direkte kontakt mellem ejere, investorer og samarbejdspartnere.",
        scope: [
          [
                    "Erhvervsbygninger og -ejendomme",
                    "Vi søger kontorer, lager- og produktionsbygninger, butikslokaler og andre investeringsejendomme."
          ],
          [
                    "Investeringsgrunde",
                    "Vi finder grunde til bolig-, erhvervs-, logistik- eller industriformål efter aftalte kriterier."
          ],
          [
                    "Udviklingsklare projekter",
                    "Vi hjælper med at finde ejendomsprojekter, ejendomme med dokumentation og udviklingsmuligheder."
          ],
          [
                    "Køb, salg og off-market",
                    "Vi forbinder ejere, sælgere og potentielle købere, også uden for offentlige annoncer, når mulighederne findes."
          ],
          [
                    "Individuel søgning og koordinering",
                    "Vi afklarer kriterier, indsamler tilgængelige oplysninger og skaber kontakt. Juridiske, tekniske og økonomiske forhold kræver uafhængig kontrol."
          ]
],
        deliver:
          "Et struktureret overblik, direkte kontakter og klare næste skridt. Beslutninger baseres på oplysninger og uafhængig kontrol.",
      },
      {
        title: "Erhvervsløsninger",
        headline: "Et klart behov.\nDen rette løsning.",
        desc: "Renseanlæg, miljøteknologi, byggeløsninger og B2B-sourcing. Vi forbinder virksomheder med relevante producenter og leverandører.",
        tags: ["Renseanlæg", "Miljøteknologi", "Vinduer og døre", "B2B-sourcing"],
        intro:
          "Fra spildevandsrensning til byggeprodukter og industrielt indkøb hjælper vi med at finde løsninger og leverandører i Polen og udlandet. Vi tager udgangspunkt i projektets specifikationer, tekniske krav, budget og tidsplan og understøtter sammenligning af tilbud og handelsdialog.",
        scope: [
          [
                    "Renseanlæg og spildevandsrensning",
                    "Vi hjælper med at finde producenter og leverandører af renseanlæg og renseteknologier til bygninger og projekter. Leverandøren bekræfter egnethed, tekniske data og regeloverholdelse."
          ],
          [
                    "Miljø- og teknikløsninger",
                    "Vi finder udstyr, anlæg og teknologipartnere til virksomhedens drift eller investeringer."
          ],
          [
                    "Vinduer, døre og byggeprodukter",
                    "Vi formidler kontakt til producenter og leverandører og hjælper med at sammenligne specifikationer, tilbud og levering."
          ],
          [
                    "Produkter og leverandører",
                    "Vi identificerer producenter, leverandører og varer ud fra behov, tekniske krav og indkøbsvilkår."
          ],
          [
                    "B2B-handelsformidling",
                    "Vi forbinder leverandører og købere og understøtter tilbud, leveringsaftaler og kommerciel dialog."
          ],
          [
                    "Individuelle løsninger",
                    "Har du behov for et specialprodukt, en teknologi eller en udførende partner? Beskriv kravene, så undersøger vi mulighederne."
          ]
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
    areaLabels: ["UNTERNEHMENSBERATUNG", "ANLAGEIMMOBILIEN", "LÖSUNGEN FÜR UNTERNEHMEN", "STAHLKONSTRUKTIONEN"],
    visionLine: "VON DER VISION ZUR ZUSAMMENARBEIT.",
    galleryEyebrow: "STAHL & ARCHITEKTUR",
    galleryDetail: "DETAIL",
    connectEyebrow: "LASSEN SIE UNS SPRECHEN",
    geography: "POLEN · DÄNEMARK · EUROPA",
    services: [
      {
        title: "Unternehmensberatung",
        headline: "Beratung, die\nEntscheidungen schärft.",
        desc: "Wir unterstützen Unternehmenswachstum, strategische Gespräche sowie die individuelle Vermittlung beim Kauf und Verkauf von Unternehmen.",
        tags: ["Strategie & Wachstum", "Partner & Investoren", "Unternehmenskauf und -verkauf"],
        intro:
          "Jedes Unternehmen benötigt eine klare Richtung und die richtigen Kontakte. Wir helfen, Ziele zu strukturieren, Chancen zu erkennen und Partner, Investoren, Käufer oder Unternehmen nach individuellen Kriterien zu finden. Wir stellen Kontakte her und begleiten Gespräche; die rechtliche und finanzielle Due Diligence erfolgt durch geeignete unabhängige Fachleute.",
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
          ["Vermittlung beim Unternehmenskauf und -verkauf", "Anhand vereinbarter Kriterien suchen wir Unternehmen zum Verkauf, potenzielle Käufer oder Übernahmepartner. Wir unterstützen die Kontaktaufnahme und die nächsten Gesprächsschritte."]
        ],
        deliver:
          "Eine klarere Richtung, strukturierte Möglichkeiten und Unterstützung beim Aufbau passender Beziehungen. Umfang und Konditionen werden individuell vereinbart.",
      },
      {
        title: "Immobilien",
        headline: "Raum für\nIhre Ambitionen.",
        desc: "Wir suchen Gewerbeimmobilien, Bau- und Investmentgrundstücke sowie baureife Projekte und vernetzen Eigentümer, Investoren und Käufer.",
        tags: ["Gewerbeimmobilien", "Investmentgrundstücke", "Baureife Projekte", "Off-Market"],
        intro:
          "Sie suchen ein Investitionsobjekt oder möchten eine Immobilie verkaufen? Wir unterstützen die Suche nach Grundstücken, Gewerbegebäuden, Renditeobjekten und baureifen Entwicklungsprojekten. Maßgeblich sind Ihre Kriterien zu Lage, Nutzung, Budget und Entwicklungspotenzial. Wir vermitteln Kontakte zwischen Eigentümern, Investoren und Partnern.",
        scope: [
          [
                    "Gewerbegebäude und Anlageobjekte",
                    "Wir recherchieren Büroobjekte, Lagerhallen, Industriegebäude, Geschäftsflächen und weitere Investitionsimmobilien."
          ],
          [
                    "Bau- und Investmentgrundstücke",
                    "Wir suchen Grundstücke für Wohn-, Gewerbe-, Logistik- und Industrieprojekte nach vereinbarten Anforderungen."
          ],
          [
                    "Baureife Projekte und Investments",
                    "Wir helfen, Projektentwicklungen, Objekte mit Unterlagen und Immobilien mit weiterem Entwicklungspotenzial zu finden."
          ],
          [
                    "Kauf, Verkauf und Off-Market",
                    "Wir vernetzen Eigentümer, Verkäufer und Interessenten, bei Verfügbarkeit auch abseits öffentlicher Angebote."
          ],
          [
                    "Individuelle Suche und Koordination",
                    "Wir klären Kriterien, bündeln verfügbare Informationen und organisieren Kontakte. Rechtliche, technische und finanzielle Prüfungen erfolgen unabhängig."
          ]
],
        deliver:
          "Strukturierte Möglichkeiten, direkte Kontakte und klare nächste Schritte. Entscheidungen erfolgen auf Basis von Informationen und unabhängiger Prüfung.",
      },
      {
        title: "Geschäftslösungen",
        headline: "Ein klarer Bedarf.\nDie richtige Umsetzung.",
        desc: "Kläranlagen, Umwelttechnik, Baulösungen und B2B-Sourcing. Wir vernetzen Unternehmen mit passenden Herstellern und Lieferanten.",
        tags: ["Kläranlagen", "Umwelttechnik", "Fenster und Türen", "B2B-Sourcing"],
        intro:
          "Von Abwasserreinigung über Bauprodukte bis zur industriellen Beschaffung helfen wir, passende Lösungen und Lieferanten in Polen und im Ausland zu finden. Grundlage sind Projektdaten, technische Anforderungen, Budget und Zeitplan. Wir unterstützen den Vergleich von Angeboten und die geschäftliche Abstimmung.",
        scope: [
          [
                    "Kläranlagen und Abwasserreinigung",
                    "Wir helfen bei der Suche nach Herstellern und Anbietern von Kläranlagen und Abwassertechnik für Gebäude und Projekte. Eignung, technische Daten und Konformität bestätigt der Anbieter."
          ],
          [
                    "Umwelt- und technische Lösungen",
                    "Wir identifizieren Anlagen, Geräte und Technologiepartner nach betrieblichen und projektbezogenen Anforderungen."
          ],
          [
                    "Fenster, Türen und Bauprodukte",
                    "Wir vermitteln Kontakte zu Herstellern und Lieferanten und helfen beim Vergleich von Spezifikationen, Angeboten und Lieferbedingungen."
          ],
          [
                    "Produkt- und Lieferantensuche",
                    "Wir suchen Hersteller, Lieferanten und Produkte anhand von Bedarf, technischen Parametern und Einkaufsbedingungen."
          ],
          [
                    "B2B-Handelsvermittlung",
                    "Wir vernetzen Lieferanten und Abnehmer und begleiten Angebote, Lieferabsprachen und kommerzielle Gespräche."
          ],
          [
                    "Individuelle Lösungen",
                    "Für Spezialprodukte, Technik oder Dienstleister teilen Sie uns Ihre Anforderungen mit – wir prüfen mögliche Partner und Optionen."
          ]
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
