# B-CORE — Business Advisory & Brokerage

Gotowa aplikacja firmowa w ciemnym graficie z miedzianymi akcentami. React + TypeScript, API Express, PostgreSQL oraz wysyłka formularza przez Resend. Frontend i API działają pod jednym adresem.

## Co zawiera projekt

- Autorski, obracający się globus 3D z rzeczywistym zarysem kontynentów i symbolicznymi połączeniami. Obsługuje przeciąganie i klawiaturę; nie wymaga WebGL ani zewnętrznych modeli.
- Cztery odrębne obszary z własnymi stronami: doradztwo biznesowe, nieruchomości, rozwiązania dla biznesu i konstrukcje stalowe.
- Oczyszczalnie, okna i drzwi, dostawcy oraz handel B2B zebrane pod „Rozwiązania dla biznesu”.
- Fotografie, subtelne animacje przewijania, mobilne menu, cztery języki: PL, EN, DA, DE, oraz wyłącznik animacji.
- Galeria balustrad, ogrodzeń i schodów z przełączaniem kategorii.
- Panel `/admin`: dodawanie, edycja, usuwanie, zdjęcia, kategorie i ukrywanie ofert. Oferty przechowuje PostgreSQL.
- Formularz `/kontakt`: walidacja, ochrona przed prostym spamem, limity wysyłki i poprawna obsługa błędów dostawcy poczty.
- Lokalnie przechowywane fotografie i fonty. Źródła: `ASSETS.md`.

**Wdrożenie opisuje plik [DEPLOY-RENDER.md](DEPLOY-RENDER.md).**

## Szybki start lokalny

Wymagane: Node.js 22, pnpm 10.15.1 i baza PostgreSQL.

```bash
corepack enable
pnpm install --frozen-lockfile
cp .env.example .env
```

Uzupełnij `.env`, następnie:

```bash
pnpm run build:deploy
node --env-file=.env artifacts/api-server/dist/index.cjs
```

Strona: `http://localhost:10000`. Tabela ofert powstanie przy pierwszym uruchomieniu. Aplikacja nie usuwa istniejących ofert.

Praca nad interfejsem:

```bash
pnpm dev
```

Vite uruchamia sam frontend i przekazuje `/api` do portu 8080. Aby lokalnie korzystać z formularza i panelu, uruchom w drugim terminalu zbudowany backend:

```bash
PORT=8080 node --env-file=.env artifacts/api-server/dist/index.cjs
```

## Gdzie zmieniać treści

| Element | Plik |
| --- | --- |
| Oferta, nagłówki, tłumaczenia i publiczne dane kontaktowe | `artifacts/sales-platform/src/data/advisory.ts` |
| Kolory, odstępy, układ i wersja mobilna | `artifacts/sales-platform/src/advisory.css` |
| Globus i jego animacja | `artifacts/sales-platform/src/components/CoreScene.tsx` |
| Zdjęcia | `artifacts/sales-platform/public/images/advisory/` |
| Panel ofert | `artifacts/sales-platform/src/pages/admin.tsx` |
| Odbiorca zapytań | `CONTACT_TO_EMAIL` w ustawieniach serwera |
| Informacje prawne zachowane i dostosowane z dostarczonego projektu | `artifacts/sales-platform/src/components/LegalModal.tsx` |

Zmiana `CONTACT_TO_EMAIL` ustawia miejsce dostarczania formularza. Publiczny adres widoczny na stronie zmienia się osobno w `advisory.ts`. Panel pokazuje adres odbiorcy i obecność konfiguracji poczty; nie ujawnia klucza API.

## Sprawdzenie projektu

```bash
pnpm run typecheck
pnpm test
pnpm run build:deploy
```

Testy obejmują logowanie i sesję, ochronę ustawień administratora, walidację ofert, limit zapytań, walidację formularza oraz sukces i błędy wysyłki. Dostawca poczty jest w testach zastąpiony atrapą — testy nie wysyłają e-maili. Pełny zapis ofert i rzeczywiste dostarczanie wiadomości sprawdź po podłączeniu swojej bazy i Resend.

## Samodzielny podgląd HTML

Po zbudowaniu frontendu:

```bash
pnpm run build:preview
```

Powstanie `deliverables/BCORE-preview.html` — pojedynczy plik z interaktywną stroną, zdjęciami i fontami. Możesz otworzyć go w przeglądarce bez hostingu. W tym pliku wysyłka, logowanie oraz pobieranie ofert są wyłączone; działają w pełnej aplikacji po wdrożeniu. Nie zastępuj nim produkcyjnego `index.html`.

## Informacje operacyjne

Sesja administratora wygasa po 8 godzinach i po restarcie serwera. Cookie jest HttpOnly, a w produkcji Secure. Limity prób logowania i wysyłki działają w pamięci pojedynczej instancji. Dla wielu instancji potrzebny byłby współdzielony magazyn sesji i limitów.

Fotografie są ilustracjami obszarów działalności, a połączenia na globusie wizualną metaforą współpracy. Nie przedstawiają deklarowanych realizacji ani biur B-CORE. Przed publikacją uzupełnij rzeczywiste dane podmiotu i sprawdź informacje o prywatności pod kątem swojej działalności, dostawców i okresów przechowywania danych.
