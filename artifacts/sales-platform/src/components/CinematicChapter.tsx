import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { bindCinematicMotion, easeSegment } from "./cinematicMotion";
import { Link } from "wouter";
import { ArrowDownRight, ArrowUpRight, Check, Compass, Factory, Handshake, Layers3, PackageCheck, ScanSearch, Target, Truck } from "lucide-react";
import { useLanguage } from "@/i18n/context";
import { useMotionPreferences } from "@/components/MotionPreferences";
import type { Lang } from "@/i18n/context";
import { advisory, serviceMeta, imagePath, type ServiceId } from "@/data/advisory";
import "./CinematicChapter.css";

type ChapterText = {
  eyebrow: string;
  title: [string, string];
  description: string;
  steps: [string, string, string];
  action: string;
  tip: string;
  scene: string;
  node: [string, string, string, string];
  badge: string;
};

// Every subpage has its own visual metaphor, with localized and meaningful
// messaging rather than identical animation reused four times.
const stories: Record<Lang, Record<ServiceId, ChapterText>> = {
  pl: {
    business: {
      eyebrow: "DORADZTWO / STRATEGIA / RELACJE", title: ["Jasny kierunek.", "Właściwe relacje."],
      description: "Zaczynamy od zrozumienia celu. Łączymy kompetencje, doświadczenie i właściwe kontakty, aby nadać współpracy konkretny kierunek.",
      steps: ["Zrozumienie", "Dopasowanie", "Wspólny kierunek"], action: "Porozmawiajmy o współpracy", tip: "PRZEWIŃ — ZOBACZ, JAK POWSTAJE SIEĆ", scene: "Kompetencje, partnerzy i możliwości stopniowo tworzą spójną sieć współpracy.",
      node: ["CEL", "PARTNERZY", "KAPITAŁ", "WIEDZA"], badge: "OD KONTAKTU DO WSPÓŁPRACY",
    },
    property: {
      eyebrow: "NIERUCHOMOŚCI / ANALIZA / POTENCJAŁ", title: ["Najpierw szczegóły.", "Potem pełen obraz."],
      description: "Lokalizacja, parametry i możliwe scenariusze wykorzystania. Dopiero spojrzenie na wszystkie elementy pozwala ocenić potencjał nieruchomości.",
      steps: ["Kontekst", "Analiza", "Pełen obraz"], action: "Porozmawiajmy o nieruchomościach", tip: "PRZEWIŃ — ZOBACZ, JAK POWSTAJE CAŁOŚĆ", scene: "Od obrysu działki po ukończony wieżowiec: kolejne kondygnacje wznoszą się nad fundamentem.",
      node: ["LOKALIZACJA", "POTENCJAŁ", "STRUKTURA", "WARTOŚĆ"], badge: "Z DETALI POWSTAJE PERSPEKTYWA",
    },
    solutions: {
      eyebrow: "SOURCING / DOSTAWCY / REALIZACJA", title: ["Od briefu", "do sprawnej realizacji."],
      description: "Porządkujemy wymagania, szukamy odpowiednich partnerów i pomagamy połączyć kolejne etapy współpracy w przejrzysty proces.",
      steps: ["Zdefiniowanie potrzeby", "Dobór partnera", "Koordynacja"], action: "Opowiedz nam o potrzebie", tip: "PRZEWIŃ — POŁĄCZ ETAPY PROCESU", scene: "Potrzeba, partner i realizacja stopniowo łączą się w jeden uporządkowany proces.",
      node: ["POTRZEBA", "PARTNER", "REALIZACJA", "POŁĄCZENIE"], badge: "JEDEN SPÓJNY PROCES",
    },
    steel: {
      eyebrow: "KONSTRUKCJE STALOWE / FORMA / DETAL", title: ["Od koncepcji", "do przemyślanej konstrukcji."],
      description: "Czytelne założenia, odpowiedni układ i dopracowane połączenia. Zobacz, jak poszczególne elementy tworzą jedną strukturę.",
      steps: ["Koncepcja", "Układ konstrukcji", "Spójna struktura"], action: "Omówmy Twój projekt", tip: "PRZEWIŃ — ODKRYJ KOLEJNE ELEMENTY", scene: "Linie rysunku technicznego stopniowo przechodzą w przestrzenną konstrukcję stalową.",
      node: ["KONCEPCJA", "KONSTRUKCJA", "POŁĄCZENIA", "DETAL"], badge: "OD ZAŁOŻEŃ DO STRUKTURY",
    },
  },
  en: {
    business: {
      eyebrow: "ADVISORY / STRATEGY / RELATIONSHIPS", title: ["Clear direction.", "The right relationships."],
      description: "We start by understanding the objective, then bring together expertise, experience and relevant connections to shape a clear direction for collaboration.",
      steps: ["Understand", "Align", "Connect"], action: "Discuss a partnership", tip: "SCROLL — SEE THE NETWORK TAKE SHAPE", scene: "Expertise, partners and opportunities gradually form a connected network.",
      node: ["GOAL", "PARTNERS", "CAPITAL", "EXPERTISE"], badge: "FROM CONTACT TO COLLABORATION",
    },
    property: {
      eyebrow: "REAL ESTATE / INSIGHT / POTENTIAL", title: ["See the details.", "Understand the whole."],
      description: "Location, property characteristics and possible uses. Assessing the elements together helps reveal the asset’s potential.",
      steps: ["Context", "Assessment", "Full picture"], action: "Discuss real estate", tip: "SCROLL — BRING THE PIECES TOGETHER", scene: "From the building footprint to a completed tower: each floor rises into place above the foundation.",
      node: ["LOCATION", "POTENTIAL", "STRUCTURE", "VALUE"], badge: "DETAILS CREATE PERSPECTIVE",
    },
    solutions: {
      eyebrow: "SOURCING / SUPPLIERS / DELIVERY", title: ["From the brief", "to smooth delivery."],
      description: "We clarify requirements, identify suitable partners and help connect the stages of cooperation into a transparent process.",
      steps: ["Define the need", "Select a partner", "Coordinate"], action: "Tell us what you need", tip: "SCROLL — CONNECT THE PROCESS", scene: "Requirements, partners and delivery gradually align into one coordinated process.",
      node: ["NEED", "PARTNER", "DELIVERY", "CONNECTION"], badge: "ONE COHERENT PROCESS",
    },
    steel: {
      eyebrow: "STEEL STRUCTURES / FORM / DETAIL", title: ["From concept", "to coherent structure."],
      description: "A clear starting point, a considered layout and well-defined connections. See how individual elements become a unified structure.",
      steps: ["Concept", "Structural layout", "Complete form"], action: "Discuss your project", tip: "SCROLL — REVEAL THE STRUCTURE", scene: "Technical drawing lines gradually form a three-dimensional steel structure.",
      node: ["CONCEPT", "STRUCTURE", "CONNECTIONS", "DETAIL"], badge: "FROM CONCEPT TO STRUCTURE",
    },
  },
  da: {
    business: {
      eyebrow: "RÅDGIVNING / STRATEGI / RELATIONER", title: ["Klar retning.", "De rette relationer."],
      description: "Vi begynder med at forstå målet og samler derefter erfaring, kompetencer og relevante kontakter i en tydelig retning for samarbejdet.",
      steps: ["Forstå", "Afstemme", "Forbinde"], action: "Lad os tale om samarbejde", tip: "RUL NED — SE NETVÆRKET TAGE FORM", scene: "Kompetencer, partnere og muligheder danner gradvist et samlet netværk.",
      node: ["MÅL", "PARTNERE", "KAPITAL", "VIDEN"], badge: "FRA KONTAKT TIL SAMARBEJDE",
    },
    property: {
      eyebrow: "EJENDOMME / INDSIGT / POTENTIALE", title: ["Se detaljerne.", "Forstå helheden."],
      description: "Beliggenhed, ejendommens egenskaber og mulige anvendelser. Når detaljerne ses i sammenhæng, bliver potentialet tydeligere.",
      steps: ["Kontekst", "Vurdering", "Helhed"], action: "Tal med os om ejendomme", tip: "RUL NED — SAML BYGNINGEN", scene: "Fra grundplan til færdigt højhus: etagerne rejser sig gradvist over fundamentet.",
      node: ["BELIGGENHED", "POTENTIALE", "STRUKTUR", "VÆRDI"], badge: "DETALJER SKABER OVERBLIK",
    },
    solutions: {
      eyebrow: "SOURCING / LEVERANDØRER / LEVERING", title: ["Fra brief", "til sikker levering."],
      description: "Vi afklarer kravene, finder relevante partnere og hjælper med at skabe en overskuelig proces fra første kontakt til næste skridt.",
      steps: ["Afklare behov", "Vælge partner", "Koordinere"], action: "Fortæl os om dit behov", tip: "RUL NED — FORBIND PROCESSEN", scene: "Behov, partnere og levering samles gradvist i en koordineret proces.",
      node: ["BEHOV", "PARTNER", "LEVERING", "FORBINDELSE"], badge: "ÉN SAMMENHÆNGENDE PROCES",
    },
    steel: {
      eyebrow: "STÅLKONSTRUKTIONER / FORM / DETALJE", title: ["Fra idé", "til gennemtænkt konstruktion."],
      description: "Et klart udgangspunkt, en gennemtænkt opbygning og præcise forbindelser. Se de enkelte dele danne én samlet konstruktion.",
      steps: ["Idé", "Opbygning", "Helhed"], action: "Drøft dit projekt", tip: "RUL NED — SE KONSTRUKTIONEN", scene: "Linjer fra en teknisk tegning bliver gradvist til en rumlig stålkonstruktion.",
      node: ["IDÉ", "STRUKTUR", "SAMLINGER", "DETALJE"], badge: "FRA IDÉ TIL KONSTRUKTION",
    },
  },
  de: {
    business: {
      eyebrow: "BERATUNG / STRATEGIE / BEZIEHUNGEN", title: ["Klare Richtung.", "Die richtigen Beziehungen."],
      description: "Zuerst verstehen wir das Ziel. Anschließend bringen wir Erfahrung, Fachwissen und passende Kontakte für eine klare Zusammenarbeit zusammen.",
      steps: ["Verstehen", "Abstimmen", "Verbinden"], action: "Zusammenarbeit besprechen", tip: "SCROLLEN — DAS NETZWERK ENTSTEHT", scene: "Wissen, Partner und Möglichkeiten bilden schrittweise ein Netzwerk.",
      node: ["ZIEL", "PARTNER", "KAPITAL", "WISSEN"], badge: "VOM KONTAKT ZUR ZUSAMMENARBEIT",
    },
    property: {
      eyebrow: "IMMOBILIEN / ANALYSE / POTENZIAL", title: ["Details erkennen.", "Das Ganze verstehen."],
      description: "Lage, Eigenschaften und mögliche Nutzungen. Erst die Betrachtung aller Faktoren eröffnet eine fundierte Sicht auf das Potenzial einer Immobilie.",
      steps: ["Kontext", "Analyse", "Gesamtbild"], action: "Immobilien besprechen", tip: "SCROLLEN — DAS GEBÄUDE ENTSTEHT", scene: "Vom Grundriss zum fertigen Hochhaus: Geschoss für Geschoss wächst das Gebäude in die Höhe.",
      node: ["STANDORT", "POTENZIAL", "STRUKTUR", "WERT"], badge: "DETAILS SCHAFFEN PERSPEKTIVE",
    },
    solutions: {
      eyebrow: "SOURCING / LIEFERANTEN / UMSETZUNG", title: ["Vom Briefing", "zur sicheren Umsetzung."],
      description: "Wir klären Anforderungen, identifizieren geeignete Partner und helfen, die einzelnen Schritte der Zusammenarbeit sinnvoll zu verbinden.",
      steps: ["Bedarf klären", "Partner wählen", "Koordinieren"], action: "Bedarf besprechen", tip: "SCROLLEN — SCHRITTE VERBINDEN", scene: "Bedarf, Partner und Umsetzung verbinden sich zu einem abgestimmten Prozess.",
      node: ["BEDARF", "PARTNER", "UMSETZUNG", "VERBINDUNG"], badge: "EIN ABGESTIMMTER PROZESS",
    },
    steel: {
      eyebrow: "STAHLKONSTRUKTIONEN / FORM / DETAIL", title: ["Von der Idee", "zur durchdachten Struktur."],
      description: "Ein klarer Ansatz, eine sinnvoll aufgebaute Tragstruktur und passende Verbindungen. So entsteht aus einzelnen Elementen ein Ganzes.",
      steps: ["Konzept", "Tragstruktur", "Gesamtform"], action: "Projekt besprechen", tip: "SCROLLEN — STRUKTUR ENTDECKEN", scene: "Aus technischen Linien entsteht nach und nach eine räumliche Stahlkonstruktion.",
      node: ["KONZEPT", "STRUKTUR", "VERBINDUNGEN", "DETAIL"], badge: "VOM ENTWURF ZUR STRUKTUR",
    },
  },
};

const building = `${import.meta.env.BASE_URL}images/tower-exploded.webp`;
// Six actual image slices. Each storey starts close to the ground plane, then
// rises into place in sequence. The photo remains one 24 KB asset.
const towerPieces = [
  { a: 82, b: 100, rise: "6%", x: "-9px", tilt: "-1deg" },
  { a: 65, b: 82, rise: "23%", x: "12px", tilt: "2deg" },
  { a: 49, b: 65, rise: "40%", x: "-15px", tilt: "-2deg" },
  { a: 33, b: 49, rise: "56%", x: "14px", tilt: "2deg" },
  { a: 17, b: 33, rise: "72%", x: "-11px", tilt: "-1.5deg" },
  { a: 0, b: 17, rise: "88%", x: "7px", tilt: "1deg" },
] as const;

function VisualFrame({ children, kind, label }: { children: ReactNode; kind: ServiceId; label: string }) {
  return (
    <div className={`cinema-visual cinema-visual--${kind}`} role="img" aria-label={label}>
      <div className="cinema-grid" aria-hidden="true" />
      <div className="cinema-circle cinema-circle--outer" aria-hidden="true" />
      <div className="cinema-circle cinema-circle--inner" aria-hidden="true" />
      <div className="cinema-corner cinema-corner--tl" aria-hidden="true" />
      <div className="cinema-corner cinema-corner--br" aria-hidden="true" />
      {children}
    </div>
  );
}

function BusinessVisual({ text }: { text: ChapterText }) {
  const nodes = [
    { cls: "a", icon: <Target size={17} />, x: "-90px", y: "-67px", r: "-12deg" },
    { cls: "b", icon: <Handshake size={17} />, x: "89px", y: "-85px", r: "10deg" },
    { cls: "c", icon: <Compass size={17} />, x: "-76px", y: "93px", r: "-8deg" },
    { cls: "d", icon: <Layers3 size={17} />, x: "90px", y: "85px", r: "10deg" },
  ];
  return (
    <VisualFrame kind="business" label={text.scene}>
      <svg className="cinema-network-lines" viewBox="0 0 500 500" aria-hidden="true">
        <path d="M 250 250 L 109 116 M 250 250 L 390 115 M 250 250 L 105 374 M 250 250 L 393 376" />
        <circle cx="250" cy="250" r="160" className="cinema-network-outline" />
      </svg>
      <div className="cinema-network-core"><span>BC</span><small>CORE</small><i /></div>
      {nodes.map((n, i) => (
        <div className={`cinema-network-node cinema-network-node--${n.cls}`} key={n.cls} style={{ "--shift-x": n.x, "--shift-y": n.y, "--node-rotate": n.r } as CSSProperties}>
          <span className="cinema-node-icon">{n.icon}</span><span>0{i + 1} / {text.node[i]}</span>
        </div>
      ))}
    </VisualFrame>
  );
}

function PropertyVisual({ text }: { text: ChapterText }) {
  return (
    <VisualFrame kind="property" label={text.scene}>
      <div className="cinema-property-backdrop" style={{ "--property-photo": `url("${imagePath("property.webp")}")` } as CSSProperties} aria-hidden="true" />
      <svg viewBox="0 0 600 520" className="cinema-site-plan" aria-hidden="true">
        <defs>
          <linearGradient id="cinema-site-copper" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f4c99b" stopOpacity=".82" />
            <stop offset="1" stopColor="#b9784a" stopOpacity=".28" />
          </linearGradient>
          <radialGradient id="cinema-site-glow">
            <stop offset="0" stopColor="#e0a872" stopOpacity=".25" />
            <stop offset="1" stopColor="#e0a872" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse className="cinema-site-light" cx="300" cy="449" rx="183" ry="75" fill="url(#cinema-site-glow)" />
        <g className="cinema-site-grid">
          <path d="M300 302 L24 467 M300 302 L576 467 M300 302 L90 520 M300 302 L510 520 M300 302 L170 520 M300 302 L430 520 M300 302 L250 520 M300 302 L350 520" />
          <path d="M100 412 L500 412 M73 447 L527 447 M46 481 L554 481 M20 515 L580 515" />
        </g>
        <g className="cinema-site-footprint">
          <path d="M214 419 L300 380 L388 419 L300 459 Z" />
          <path d="M214 419 L214 433 L300 473 L300 459 M300 459 L388 419 L388 433 L300 473" />
        </g>
        <g className="cinema-site-columns">
          <path d="M214 419 V134 M388 419 V134 M300 459 V174 M300 380 V105" />
          <path d="M214 134 L300 105 L388 134 L300 174 Z" />
        </g>
        <g className="cinema-site-levels">
          <path d="M214 353 L300 393 L388 353 M214 289 L300 329 L388 289 M214 225 L300 265 L388 225" />
          <path d="M214 161 L300 201 L388 161" />
        </g>
        <g className="cinema-site-measures">
          <path d="M419 420 V118 M412 420 H426 M412 118 H426" />
          <circle cx="419" cy="420" r="3" /><circle cx="419" cy="118" r="3" />
        </g>
      </svg>
      <div className="cinema-property-foundation" aria-hidden="true" />
      <div className="cinema-tower">
        <img className="cinema-tower-shadow" src={building} alt="" width="342" height="582" loading="lazy" decoding="async" />
        {towerPieces.map((part, i) => (
          <div className="cinema-tower-piece" key={i} style={{
            clipPath: `inset(${part.a}% 0 ${100 - part.b}% 0)`,
            "--floor-progress": `var(--ci-floor-${i})`,
            "--rise": part.rise,
            "--offset-x": part.x,
            "--tilt": part.tilt,
          } as CSSProperties}>
            <img src={building} alt="" width="342" height="582" loading="lazy" decoding="async" />
          </div>
        ))}
      </div>
    </VisualFrame>
  );
}

function SolutionsVisual({ text }: { text: ChapterText }) {
  const cards = [
    { cl: "need", icon: <ScanSearch size={26} />, offsetX: "-90px", offsetY: "-125px", rotate: "-11deg" },
    { cl: "source", icon: <Factory size={26} />, offsetX: "30px", offsetY: "115px", rotate: "8deg" },
    { cl: "deliver", icon: <Truck size={26} />, offsetX: "114px", offsetY: "-100px", rotate: "12deg" },
  ];
  return (
    <VisualFrame kind="solutions" label={text.scene}>
      <svg viewBox="0 0 580 460" className="cinema-supply-lines" aria-hidden="true">
        <path d="M80 225 H500" className="cinema-supply-track" />
        <path d="M198 225 H386" className="cinema-supply-pulse" />
        <path d="M80 225 v-70 M500 225 v-70" className="cinema-supply-guides" />
        <circle cx="290" cy="225" r="180" className="cinema-supply-guide-circle" />
      </svg>
      <div className="cinema-supply-cards">
        {cards.map((item, i) => (
          <div className={`cinema-supply-card cinema-supply-card--${item.cl}`} key={item.cl} style={{ "--shift-x": item.offsetX, "--shift-y": item.offsetY, "--node-rotate": item.rotate } as CSSProperties}>
            <span className="cinema-supply-index">0{i + 1}</span>
            {item.icon}
            <strong>{text.node[i]}</strong>
            <span className="cinema-supply-check"><Check size={14} /></span>
          </div>
        ))}
      </div>
      <div className="cinema-supply-parcel"><PackageCheck size={22} /></div>
      <div className="cinema-supply-underline" aria-hidden="true"><i /></div>
    </VisualFrame>
  );
}

function SteelVisual({ text }: { text: ChapterText }) {
  return (
    <VisualFrame kind="steel" label={text.scene}>
      <svg viewBox="0 0 580 465" className="cinema-steel-drawing" aria-hidden="true">
        <g className="cinema-steel-guide">
          <path d="M86 360 H524 M86 420 H524 M130 90 V430 M420 90 V430 M55 207 H525" />
          <path d="M130 360 L290 95 L460 360 M130 360 H460 M178 277 H410" />
          <path d="M98 400 H492 M130 374 V410 M460 374 V410 M118 390 H472" />
        </g>
        <g className="cinema-steel-rear cinema-steel-beam">
          <path d="M212 280 V150 L330 76 L462 146 V281 M212 150 H462 M330 76 V280 M212 280 H462" />
        </g>
        <g className="cinema-steel-front cinema-steel-beam">
          <path d="M112 385 V194 L250 108 L394 191 V385 M112 194 H394 M250 108 V385 M112 385 H394" />
        </g>
        <g className="cinema-steel-connect cinema-steel-beam">
          <path d="M112 194 L212 150 M250 108 L330 76 M394 191 L462 146 M394 385 L462 281 M112 385 L212 280" />
          <path d="M112 194 L250 385 M394 191 L250 385 M212 150 L330 280 M462 146 L330 280" />
        </g>
        <g className="cinema-steel-solid">
          <path d="M112 385 V194 L250 108 L394 191 V385 M112 194 H394 M250 108 V385 M112 385 H394" />
          <path d="M212 280 V150 L330 76 L462 146 V281 M212 150 H462 M330 76 V280 M212 280 H462" />
          <path d="M112 194 L212 150 M250 108 L330 76 M394 191 L462 146 M394 385 L462 281 M112 385 L212 280" />
        </g>
        <circle className="cinema-steel-fastener" cx="250" cy="108" r="7" />
        <circle className="cinema-steel-fastener" cx="330" cy="76" r="7" />
        <circle className="cinema-steel-fastener" cx="394" cy="191" r="7" />
      </svg>
    </VisualFrame>
  );
}

const visuals = {
  business: BusinessVisual,
  property: PropertyVisual,
  solutions: SolutionsVisual,
  steel: SteelVisual,
};

/**
 * Event-driven scroll scrubbing: IntersectionObserver enables work only near
 * the chapter, passive scroll queues at most one rAF, and updates CSS variables
 * without a React re-render or WebGL/canvas loop. Static for reduced motion.
 */
export function CinematicChapter({ id, teaser = false }: { id: ServiceId; teaser?: boolean }) {
  const chapterRef = useRef<HTMLElement>(null);
  const { lang } = useLanguage();
  const { paused } = useMotionPreferences();
  const text = stories[lang][id];
  const service = serviceMeta.find((item) => item.id === id)!;
  const serviceCopy = advisory[lang].services[serviceMeta.indexOf(service)];
  const discoverLabel = { pl: "Dowiedz się więcej", en: "Learn more", da: "Læs mere", de: "Mehr erfahren" }[lang];
  const Visual = visuals[id];

  useEffect(() => {
    const section = chapterRef.current;
    const stage = section?.querySelector<HTMLElement>(".cinema-stage");
    if (!section || !stage) return;
    let previousPhase = "";
    return bindCinematicMotion(section, stage, (progress) => {
      // Independent choreography: detail / structure / completion.
      const assembly = easeSegment(progress, .04, .91);
      const a = easeSegment(progress, .07, .46);
      const b = easeSegment(progress, .29, .78);
      const c = easeSegment(progress, .64, .97);
      section.style.setProperty("--ci-p", assembly.toFixed(4));
      section.style.setProperty("--ci-a", a.toFixed(4));
      section.style.setProperty("--ci-b", b.toFixed(4));
      section.style.setProperty("--ci-c", c.toFixed(4));
      section.style.setProperty("--ci-scatter", (1 - assembly).toFixed(4));
      if (id === "property") {
        // Ground-to-roof construction: each floor is independently eased.
        // Progress is time-based (3.6 s), never tied 1:1 to a wheel delta.
        const starts = [.06, .15, .26, .37, .48, .59];
        const ends = [.39, .52, .63, .74, .85, .98];
        for (let i = 0; i < 6; i++) {
          section.style.setProperty(`--ci-floor-${i}`, easeSegment(progress, starts[i], ends[i]).toFixed(4));
        }
      }
      const phase = progress < .32 ? "0" : progress < .69 ? "1" : "2";
      if (phase !== previousPhase) {
        section.dataset.phase = phase;
        previousPhase = phase;
      }
    }, paused);
  }, [paused, id]);

  return (
    <section
      ref={chapterRef}
      className={`cinema-chapter cinema-chapter--${id}${teaser ? " cinema-chapter--teaser" : ""}${paused ? " is-static" : ""}`}
      data-phase={paused ? "2" : "0"}
      aria-labelledby={`cinema-heading-${id}`}
      style={{ "--ci-p": paused ? 1 : 0, "--ci-a": paused ? 1 : 0, "--ci-b": paused ? 1 : 0, "--ci-c": paused ? 1 : 0, "--ci-scatter": paused ? 0 : 1, ...Object.fromEntries(Array.from({length: 6}, (_, i) => [`--ci-floor-${i}`, paused ? 1 : 0])) } as CSSProperties}
    >
      <div className="cinema-stage">
        <div className="cinema-background-halo" aria-hidden="true" />
        <div className="cinema-frame container">
          <div className="cinema-story">
            <p className="eyebrow cinema-eyebrow"><span className="copper-line" /> {text.eyebrow}</p>
            <h2 id={`cinema-heading-${id}`}>{text.title[0]} <em>{text.title[1]}</em></h2>
            <p className="cinema-description">{teaser ? serviceCopy.desc : text.description}</p>
            {!teaser && <ol className="cinema-steps" aria-label={text.tip}>
              {text.steps.map((step, i) => <li key={step} data-step={i}><span>0{i + 1}</span><strong>{step}</strong><i /></li>)}
            </ol>}
            <Link className="cinema-cta" href={teaser ? service.path : `/kontakt?obszar=${id}`}>{teaser ? discoverLabel : text.action}<ArrowUpRight size={17} /></Link>
          </div>
          <Visual text={text} />
        </div>
        <div className="cinema-footer container"><span><ArrowDownRight size={16} /> {text.tip}</span><div className="cinema-progress"><i /></div></div>
      </div>
    </section>
  );
}
