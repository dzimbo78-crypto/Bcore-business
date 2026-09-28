import {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";
import { Sun, RotateCcw } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLanguage } from "@/i18n/context";
const DisplayContext = createContext({
  brightness: 0,
  setBrightness: (_value: number) => {},
});
const mix = (a: number[], b: number[], t: number) =>
  `rgb(${a.map((n, i) => Math.round(n + (b[i] - n) * t)).join(" ")})`;
export function DisplayPreferences({ children }: { children: ReactNode }) {
  const [brightness, setValue] = useState(() => {
    try {
      const value = Number(localStorage.getItem("bcore-brightness") || 0);
      return Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
    } catch {
      return 0;
    }
  });
  const setBrightness = (value: number) => {
    const next = Math.min(100, Math.max(0, value));
    setValue(next);
    try {
      localStorage.setItem("bcore-brightness", String(next));
    } catch {}
  };
  useLayoutEffect(() => {
    const root = document.documentElement,
      t = brightness / 100;
    root.style.setProperty("--bc-bg", mix([16, 20, 21], [44, 50, 53], t));
    root.style.setProperty("--bc-surface", mix([25, 30, 31], [54, 62, 65], t));
    root.style.setProperty(
      "--bc-light",
      mix([238, 238, 232], [255, 255, 249], t),
    );
    root.style.setProperty(
      "--bc-muted",
      mix([161, 166, 165], [216, 222, 221], t),
    );
    root.style.setProperty(
      "--bc-copper",
      mix([207, 161, 124], [236, 197, 156], t),
    );
    root.style.setProperty("--bc-line", `rgba(255,255,255,${0.11 + t * 0.12})`);
    root.dataset.readability = brightness > 0 ? "enhanced" : "default";
  }, [brightness]);
  return (
    <DisplayContext.Provider value={{ brightness, setBrightness }}>
      {children}
    </DisplayContext.Provider>
  );
}
const copy = {
  pl: [
    "Jasność i czytelność",
    "Delikatnie rozjaśnij tło i tekst.",
    "Jasność strony",
    "Oryginalna",
    "Jaśniejsza",
    "Przywróć",
  ],
  en: [
    "Brightness & readability",
    "Gently brighten the background and text.",
    "Page brightness",
    "Original",
    "Brighter",
    "Reset",
  ],
  da: [
    "Lysstyrke og læsbarhed",
    "Gør baggrund og tekst lidt lysere.",
    "Sidens lysstyrke",
    "Original",
    "Lysere",
    "Nulstil",
  ],
  de: [
    "Helligkeit & Lesbarkeit",
    "Hintergrund und Text sanft aufhellen.",
    "Helligkeit der Seite",
    "Original",
    "Heller",
    "Zurücksetzen",
  ],
};
export function DisplayControl() {
  const { brightness, setBrightness } = useContext(DisplayContext),
    { lang } = useLanguage(),
    t = copy[lang];
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="icon-button display-button"
          aria-label={t[0]}
          title={t[0]}
        >
          <Sun size={16} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={14}
        collisionPadding={16}
        className="display-popover"
      >
        <div className="display-title">
          <Sun size={17} />
          <h2>{t[0]}</h2>
          <output>{brightness}%</output>
        </div>
        <p>{t[1]}</p>
        <label htmlFor="site-brightness" className="sr-only">
          {t[2]}
        </label>
        <input
          id="site-brightness"
          type="range"
          min="0"
          max="100"
          step="5"
          value={brightness}
          onChange={(e) => setBrightness(Number(e.target.value))}
          aria-valuetext={`${brightness}%`}
        />
        <div className="display-scale">
          <span>{t[3]}</span>
          <span>{t[4]}</span>
        </div>
        <button
          type="button"
          className="display-reset"
          onClick={() => setBrightness(0)}
        >
          <RotateCcw size={13} />
          {t[5]}
        </button>
      </PopoverContent>
    </Popover>
  );
}
