# B-CORE — GitHub i Render

Projekt uruchamia się jako **Web Service (Node)** z bazą PostgreSQL. Jedna usługa obsługuje stronę, panel administratora oraz formularz. Sam hosting statyczny nie uruchomi panelu i poczty.

## 1. Wgraj projekt do GitHuba

Rozpakuj ZIP. Zawartość katalogu `bcore-website` powinna trafić do głównego katalogu repozytorium `bcore-website`. Pliki `package.json`, `pnpm-lock.yaml` i `render.yaml` muszą znajdować się na tym samym poziomie. Nie dodawaj folderu `node_modules`, pliku `.env` ani sekretów.

Przy aktualizacji istniejącego repozytorium zachowaj jego historię Git i swoje ustawienia środowiska. Możesz użyć GitHub Desktop lub lokalnej kopii repozytorium:

```bash
git switch -c redesign/advisory-copper
# Skopiuj pliki projektu, zachowując katalog .git.
git add .
git commit -m "Redesign B-CORE advisory website"
git push -u origin redesign/advisory-copper
```

Po przejrzeniu zmian połącz tę gałąź z gałęzią podłączoną do Rendera. Paczka nie została automatycznie wypchnięta do Twojego repozytorium ani wdrożona.

## 2. Skonfiguruj usługę Render

**Jeśli masz już działającą usługę**, zaktualizuj ją. Zachowaj istniejący `DATABASE_URL`, aby nadal korzystać z tych samych ofert.

Ustawienia usługi:

| Pole | Wartość |
| --- | --- |
| Runtime / Language | Node |
| Root Directory | główny katalog repozytorium — pole puste |
| Build Command | `corepack enable && pnpm install --frozen-lockfile && pnpm run build:deploy` |
| Start Command | `pnpm start` |
| Health Check Path | `/api/healthz` |

Dla nowego wdrożenia możesz użyć **New → Blueprint** i wskazać repozytorium. Plik `render.yaml` zawiera te ustawienia oraz pola do uzupełnienia sekretów. Dołącz istniejącą lub utwórz nową bazę PostgreSQL i podaj jej adres połączenia. Nie trzeba ręcznie tworzyć tabeli ofert.

## 3. Ustaw zmienne środowiskowe

W ustawieniach Environment usługi dodaj:

| Zmienna | Co wpisać |
| --- | --- |
| `NODE_VERSION` | `22` |
| `NODE_ENV` | `production` |
| `BASE_PATH` | `/` |
| `DATABASE_URL` | Pełny adres połączenia z Twoją bazą PostgreSQL |
| `ADMIN_PASSWORD` | Własne, długie i unikalne hasło do panelu |
| `RESEND_API_KEY` | Klucz API utworzony w Twoim koncie Resend |
| `RESEND_FROM_EMAIL` | Nadawca w zweryfikowanej domenie, np. `B-CORE <kontakt@twoja-domena.pl>` |
| `CONTACT_TO_EMAIL` | Adres, na który mają przychodzić zapytania, np. Twój Gmail |

`PORT` ustawia Render. Sekrety pozostają po stronie serwera. Stare `SMTP_USER` i `SMTP_PASS` nie są używane przez tę wersję.

### Poczta krok po kroku

1. W Resend dodaj swoją domenę i skonfiguruj rekordy DNS wymagane do jej weryfikacji.
2. Utwórz klucz API z uprawnieniem do wysyłki i wpisz go w `RESEND_API_KEY` na Renderze.
3. W `RESEND_FROM_EMAIL` podaj adres w tej domenie. To nadawca techniczny wiadomości — nie adres klienta i nie prywatny Gmail.
4. W `CONTACT_TO_EMAIL` wpisz swój adres odbiorczy. Odpowiedź na otrzymaną wiadomość będzie kierowana do osoby, która wypełniła formularz.
5. Zapisz ustawienia i uruchom ponowne wdrożenie.

Domyślny adres `onboarding@resend.dev` nadaje się wyłącznie do ograniczonych testów Resend. Do działania formularza dla klientów skonfiguruj własną zweryfikowaną domenę. Sama obecność klucza nie oznacza, że domena jest zweryfikowana.

## 4. Uruchom i sprawdź

Po zakończeniu wdrożenia:

1. Otwórz stronę główną oraz bezpośrednio `/kontakt` i `/rozwiazania-dla-biznesu`.
2. Otwórz `/admin` i zaloguj się hasłem z `ADMIN_PASSWORD`.
3. Dodaj ofertę z wyłączoną opcją „Widoczna na stronie”. Sprawdź edycję, następnie opublikuj wybraną ofertę.
4. Wyślij próbne zapytanie ze strony i sprawdź skrzynkę odbiorczą oraz folder spam. Komunikat sukcesu pojawia się dopiero po zaakceptowaniu wiadomości przez Resend; ostateczne dostarczenie sprawdzisz także w jego dzienniku.
5. Sprawdź wygląd na telefonie oraz przycisk wstrzymywania animacji.

Nie zmieniaj `DATABASE_URL` podczas kolejnych aktualizacji, jeśli chcesz zachować oferty. Wykonuj kopie zapasowe bazy u wybranego dostawcy.

## Gdy coś wymaga poprawy

- **Strona nie startuje:** sprawdź logi wdrożenia, poprawność `DATABASE_URL` i dostępność bazy.
- **Brak dostępu do panelu:** sprawdź `ADMIN_PASSWORD`. Restart kończy poprzednie sesje. Po wielu błędnych próbach odczekaj 15 minut.
- **Formularz pokazuje błąd:** sprawdź trzy zmienne poczty oraz weryfikację domeny w Resend. Limit formularza to 5 prób na 10 minut z jednego adresu IP.
- **Brak ofert:** opublikuj je w `/admin` i upewnij się, że strona korzysta z właściwej bazy.

Dokumentacja dostawców: [Render — Node](https://render.com/docs/deploy-node-express-app), [Render — Blueprint](https://render.com/docs/blueprint-spec), [Resend — domeny](https://resend.com/docs/dashboard/domains/introduction), [Resend — wysyłka](https://resend.com/docs/api-reference/emails/send-email).
