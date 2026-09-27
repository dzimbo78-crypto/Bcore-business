import { Droplets, Frame, Anchor, Building2, Briefcase, ShoppingBasket } from "lucide-react";
import React from "react";

export type Category = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  icon: React.ElementType;
  status: "active" | "coming-soon";
};

export const categories: Category[] = [
  {
    id: "oczyszczalnie",
    slug: "/oczyszczalnie",
    title: "Modułowe oczyszczalnie ścieków",
    shortDescription: "Zaawansowane systemy oczyszczania ścieków dla gmin, deweloperów, hoteli i przemysłu. Elastyczne, skalowalne i szybkie w montażu.",
    icon: Droplets,
    status: "active",
  },
  {
    id: "okna-drzwi",
    slug: "/okna-drzwi",
    title: "Okna i drzwi premium",
    shortDescription: "Stolarka budowlana najwyższej klasy — okna PVC i aluminiowe, drzwi wejściowe, systemy tarasowe i przesuwne. Doradztwo i wycena.",
    icon: Frame,
    status: "active",
  },
  {
    id: "tapicerstwo-jachtowe",
    slug: "/tapicerstwo-jachtowe",
    title: "Tapicerstwo jachtowe premium",
    shortDescription: "Ekskluzywne wyposażenie tapicerskie dla luksusowych jachtów i superjachtów. Fotele, wnętrza, systemy ochronne — najwyższa klasa od 30 lat.",
    icon: Anchor,
    status: "active",
  },
  {
    id: "nieruchomosci",
    slug: "/nieruchomosci",
    title: "Nieruchomości inwestycyjne",
    shortDescription: "Działki inwestycyjne, kamienice, nieruchomości komercyjne i mieszkalne — bezpośredni kontakt z właścicielami, indywidualne podejście.",
    icon: Building2,
    status: "active",
  },
  {
    id: "projekty-biznesowe",
    slug: "/projekty-biznesowe",
    title: "Projekty Biznesowe",
    shortDescription: "Wspieramy właścicieli firm i inwestorów w procesie identyfikacji partnerów zainteresowanych przejęciem firm, udziałów, aktywów oraz projektów inwestycyjnych.",
    icon: Briefcase,
    status: "active",
  },
  {
    id: "produkty",
    slug: "/produkty",
    title: "Giełda Towarów",
    shortDescription: "Aktualne oferty produktów — ze zdjęciami, opisami, lokalizacją, minimalnym zamówieniem i ceną. Przeglądaj i pytaj o wycenę.",
    icon: ShoppingBasket,
    status: "active",
  },
];
