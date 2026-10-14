import { useEffect, useRef, type CSSProperties } from "react";
import { bindCinematicMotion, easeSegment } from "./cinematicMotion";
import { Link } from "wouter";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/i18n/context";
import { useMotionPreferences } from "./MotionPreferences";
import "./ArchitectureScroll.css";

/**
 * A real building cut from the photograph already used in the property section.
 * One ~24 kB WebP asset is reused for six GPU-composited layers. No WebGL,
 * animation library, network requests or state updates on each scroll frame.
 */
const towerImage = `${import.meta.env.BASE_URL}images/tower-exploded.webp`;

const pieces = [
  { from: 0, to: 17, x: -155, y: -145, rotate: -8 },
  { from: 17, to: 33, x: 166, y: -115, rotate: 9 },
  { from: 33, to: 49, x: -176, y: -35, rotate: -7 },
  { from: 49, to: 65, x: 168, y: 35, rotate: 8 },
  { from: 65, to: 82, x: -145, y: 112, rotate: -6 },
  { from: 82, to: 100, x: 162, y: 148, rotate: 8 },
];

const labels = {
  pl: {
    eyebrow: "ARCHITEKTURA MOŻLIWOŚCI / 001",
    title: "Różne elementy. Jedna spójna wizja.",
    accent: "Jedna spójna wizja.",
    description:
      "Liczy się nie tylko każdy szczegół, ale także relacje między nimi. Zobacz, jak rozproszone elementy tworzą przemyślaną całość.",
    phases: ["Elementy", "Dopasowanie", "Spójna całość"],
    action: "Odkryj nieruchomości",
    tip: "PRZEWIŃ — ODKRYJ KOLEJNE ETAPY",
    figure: "Animacja sześciu fragmentów wieżowca, które podczas przewijania łączą się w jeden budynek. Ilustracja koncepcyjna.",
    result: "6 ELEMENTÓW / 1 SPÓJNA CAŁOŚĆ",
  },
  en: {
    eyebrow: "ARCHITECTURE OF OPPORTUNITY / 001",
    title: "Many parts. One vision.",
    accent: "One vision.",
    description:
      "Every detail matters, but the connections between them matter just as much. Watch separate elements form one considered whole.",
    phases: ["Potential", "Alignment", "One vision"],
    action: "Explore real estate",
    tip: "SCROLL TO ASSEMBLE THE BUILDING",
    figure: "Concept illustration of six sections of an office tower joining as the page scrolls.",
    result: "6 ELEMENTS / 1 UNIFIED WHOLE",
  },
  da: {
    eyebrow: "MULIGHEDERNES ARKITEKTUR / 001",
    title: "Mange dele. Én vision.",
    accent: "Én vision.",
    description:
      "Hver detalje tæller, men sammenhængen mellem delene er lige så vigtig. Se hvordan enkelte elementer bliver til en gennemtænkt helhed.",
    phases: ["Potentiale", "Samling", "Én vision"],
    action: "Udforsk ejendomme",
    tip: "SCROLL FOR AT SAMLE BYGNINGEN",
    figure: "Konceptillustration af seks bygningsdele, der samles under scroll.",
    result: "6 DELE / 1 SAMLET HELHED",
  },
  de: {
    eyebrow: "ARCHITEKTUR DER MÖGLICHKEITEN / 001",
    title: "Viele Teile. Eine Vision.",
    accent: "Eine Vision.",
    description:
      "Jedes Detail zählt. Entscheidend ist aber auch das Zusammenspiel der Elemente. Sehen Sie, wie daraus ein durchdachtes Ganzes entsteht.",
    phases: ["Potenzial", "Verbindung", "Eine Vision"],
    action: "Immobilien entdecken",
    tip: "SCROLLEN, UM DAS GEBÄUDE ZUSAMMENZUSETZEN",
    figure: "Konzeptillustration von sechs Gebäudeteilen, die beim Scrollen zusammenkommen.",
    result: "6 ELEMENTE / 1 GANZES",
  },
} as const;

export function ArchitectureScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const { lang } = useLanguage();
  const { paused } = useMotionPreferences();
  const copy = labels[lang];

  useEffect(() => {
    const section = sectionRef.current;
    const stage = section?.querySelector<HTMLElement>(".architecture-stage");
    if (!section || !stage) return;
    let previousPhase = "";
    return bindCinematicMotion(section, stage, (progress) => {
      const assembly = easeSegment(progress, .05, .92);
      section.style.setProperty("--breakup", (1 - assembly).toFixed(4));
      section.style.setProperty("--assemble", assembly.toFixed(4));
      const phase = progress < .32 ? "fragmented" : progress < .71 ? "aligning" : "complete";
      if (previousPhase !== phase) {
        section.dataset.phase = phase;
        previousPhase = phase;
      }
    }, paused);
  }, [paused]);

  return (
    <section
      ref={sectionRef}
      id="architektura"
      className={`architecture-scroll${paused ? " is-static" : ""}`}
      data-phase={paused ? "complete" : "fragmented"}
      aria-labelledby="architecture-title"
      style={{ "--breakup": paused ? 0 : 1, "--assemble": paused ? 1 : 0 } as CSSProperties}
    >
      <div className="architecture-stage">
        <div className="architecture-grid" aria-hidden="true" />
        <div className="architecture-content container">
          <div className="architecture-copy">
            <p className="eyebrow"><span className="copper-line" />{copy.eyebrow}</p>
            <h2 id="architecture-title">
              {copy.title.slice(0, -copy.accent.length)}
              <em>{copy.accent}</em>
            </h2>
            <p className="architecture-description">{copy.description}</p>
            <ol className="architecture-phases" aria-label={copy.tip}>
              {copy.phases.map((phase, i) => (
                <li key={phase} data-step={i}>
                  <span className="architecture-phase-number">0{i + 1}</span>
                  <span>{phase}</span>
                  <span className="architecture-phase-line" aria-hidden="true" />
                </li>
              ))}
            </ol>
            <Link href="/nieruchomosci" className="text-link architecture-link">
              {copy.action} <ArrowUpRight size={19} />
            </Link>
          </div>
          <div className="architecture-art" role="img" aria-label={copy.figure}>
            <div className="architecture-ring architecture-ring-outer" aria-hidden="true" />
            <div className="architecture-ring architecture-ring-inner" aria-hidden="true" />
            <span className="architecture-coordinate architecture-coordinate-top" aria-hidden="true">CONCEPT / 001</span>
            <span className="architecture-coordinate architecture-coordinate-bottom" aria-hidden="true">B-CORE / VISION 001</span>
            <div className="architecture-model" aria-hidden="true">
              <img className="architecture-ghost" src={towerImage} alt="" width="342" height="582" loading="lazy" decoding="async" />
              {pieces.map((piece, i) => (
                <div
                  key={i}
                  className="architecture-piece"
                  style={{
                    clipPath: `inset(${piece.from}% 0 ${100 - piece.to}% 0)`,
                    "--fly-x": `${piece.x}px`,
                    "--fly-y": `${piece.y}px`,
                    "--mobile-x": `${Math.round(piece.x * 0.55)}px`,
                    "--mobile-y": `${Math.round(piece.y * 0.55)}px`,
                    "--fly-rotate": `${piece.rotate}deg`,
                    "--piece-delay": `${i * .055}`,
                  } as CSSProperties}
                >
                  <img src={towerImage} alt="" width="342" height="582" loading="lazy" decoding="async" />
                </div>
              ))}
              <span className="architecture-ground" />
            </div>
            <div className="architecture-art-caption" aria-hidden="true">
              <span className="architecture-caption-square" />
              {copy.result}
            </div>
          </div>
        </div>
        <div className="architecture-scroll-footer container" aria-hidden="true">
          <span>{copy.tip}</span>
          <div className="architecture-progress"><i /></div>
          <ArrowDownRight size={18} />
        </div>
      </div>
    </section>
  );
}
