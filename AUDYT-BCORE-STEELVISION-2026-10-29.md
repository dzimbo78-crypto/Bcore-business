# B-CORE / SteelVision – audyt produkcyjny (29.10.2026)

## Zakres i wynik

Audyt kodu na gałęzi \`fix/steelvision-quote-reports-2026-10-29\`. Testowane: aplikacja React i witryna cinematic, oba konfiguratory, most SteelVision→kontakt, API Express, PostgreSQL, raporty PDF/CSV/JSON, panel administratora, bezpieczne zachowanie przy awariach, regresje i headless Chrome. Ten dokument **nie jest potwierdzeniem wdrożenia ani dostarczenia wiadomości**.

### Wykryte i naprawione błędy

1. **Brak podłączonego bridge w zaawansowanym HTML** – żaden przycisk wysyłki pełnego projektu nie był instalowany przez sam plik JS. Dodano skrypt do strony.
2. **Błąd BIGSERIAL** – sterownik PostgreSQL zwraca \`id\` w postaci tekstu; wcześniejsza walidacja wymagała liczby i zgłaszała fałszywą awarię po udanym INSERT.
3. **Brak realnych załączników** – API tylko zapisywało JSON w DB, bez e-maila. Teraz backend generuje PDF, CSV, JSON i przekazuje je przez Resend; rozróżnia bazę i akceptację dostawcy.
4. **Duże pliki i limit 10 tys. znaków kontaktu** – pełny JSON jest przenoszony niezależnie od skróconego opisu formularza; zapasowy IndexedDB.
5. **Niechciane przywracanie starych projektów** – reset przy otwarciu obu konfiguratorów; ręczny import/backup zachowany.
6. **Utrata danych przy błędzie dostawcy** – projekt do ponowienia i pobranie kopii JSON.
7. **Duplikaty zapytań przy ponowieniu** – stabilny ID, unikalny \`quote_id\` z migracją DB, idempotentny klucz wysyłki i deterministyczne załączniki.
8. **Brak odzyskiwania projektów** – lista w panelu administratora, pobieranie 3 plików z DB i status przyjęcia przez Resend.
9. **Baza danych jako single point of failure** – kontakt i API email mogą uruchomić się mimo niedostępnego PostgreSQL, baza jest automatycznie inicjalizowana po przywróceniu połączenia.
10. **Zależność formularza standardowego od FormSubmit** – pierwszy wybór to API serwisu; FormSubmit jako opcja, gdy poczta backendu nie jest skonfigurowana.
11. **Brak PDF rzutu** – PDF zawiera również koncepcyjne rzuty elementów liniowych I/L/U oraz zastrzeżenie weryfikacji projektanta.
12. **Brak informacji o automatycznych poprawkach** – raport przed/po i niezrealizowane zalecenia, wykorzystując istniejące rozwiązania geometryczne.

### Bezpieczeństwo konstrukcji

Tylko drobne korekty geometryczne wynikające z limitów zadanych przez klienta są automatyczne. **Program nie wydaje automatycznych decyzji o nośności, obliczeniowym doborze spoin i kotew, zgodności z Eurokodem ani zwolnieniu do produkcji.** Screening i warunki normowe muszą sprawdzić uprawnieni specjaliści. Każdą zastosowaną korektę geometryczną raport oznacza jako wstępną.

### Testy uruchamiane w CI

- \`pnpm run typecheck\` – frontend, API i biblioteki TypeScript.
- \`pnpm test\` – logowanie, sesje administratora, produkty, walidacja, limity, e-mail, eksport JSON/CSV/PDF, poprawność struktury PDF, przypadki awarii Resend i Neon, deterministyczne ponowienia.
- \`pnpm run build:deploy\` – pełna produkcyjna kompilacja.
- \`node scripts/browser-smoke.mjs\` – rzeczywista przeglądarka Chrome, renderowanie formularza kontaktowego i przycisków zaawansowanego SteelVision; dodatkowo symulowany przepływ projektu do lokalnego fałszywego API (bez wysyłki prawdziwej poczty).

### Warunki uznania wysyłki za naprawdę działającą

1. Zatwierdzony workspace i usługa **Render** wyświetlają wdrożoną bieżącą gałąź/commit.
2. Ustawione \`DATABASE_URL\`, \`RESEND_API_KEY\`, **zweryfikowany** \`RESEND_FROM_EMAIL\`, \`CONTACT_TO_EMAIL\`, \`ADMIN_PASSWORD\`.
3. W panelu Resend domena nadawcza jest zweryfikowana (SPF/DKIM), konto nie jest w trybie ograniczonym.
4. Prawdziwy projekt U (np. 3,76 m) przechodzi ze SteelVision do \`/#/kontakt\`, a API przyjmuje go z poprawnym \`quoteId\`, \`state.items\`, \`report\`.
5. Panel administratora pokazuje ten rekord i e-mail **przyjęty przez dostawcę**, a PDF/CSV/JSON są pobieralne z panelu.
6. Resend pokazuje odpowiedni e-mail ze statusem \`delivered\`, bez bounce/reject. Odbiorca potwierdza 3 załączniki i odczytane pola.
7. Ponowna próba z takim samym quoteId nie powoduje duplikacji, awaria bazy nie pozbawia możliwości wysłania maila, a awaria poczty nadal umożliwia zapis DB.
8. Sprawdzenie desktop/mobile oraz błędów w konsoli produkcyjnej na urządzeniu użytkownika.

### Stan ograniczeń niezależnych od kodu

W chwili audytu połączone z ChatGPT konto Resend nie ujawniało zweryfikowanej domeny ani historii wysłanych e-maili (mimo obecności klucza „B-CORE Website Production”). Nie potwierdza to, że infrastruktura Render ma te same ustawienia. Bez wskazania właściwego workspace Render, skontrolowania zmiennych środowiskowych i rzeczywistego testu nie można oznaczyć doręczenia jako wykonanego. Testy z atrapą nie gwarantują dostarczenia wiadomości do Gmaila.

## Uruchomienie

\`\`\`bash
corepack enable
pnpm install --frozen-lockfile
pnpm run typecheck
pnpm test
pnpm run build:deploy
node scripts/browser-smoke.mjs
\`\`\`

**Publikacja:** merge PR #1 do main i sprawdzenie Render; w tej gałęzi zmiany produkcyjne nie zostały aktywowane automatycznie. Żadnych niezweryfikowanych sukcesów wysyłki nie należy komunikować klientom.
