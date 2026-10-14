# B-CORE — finalna paczka wdrożeniowa

To jest **pełny kod aplikacji**, nie tylko demonstracyjny HTML. Frontend React/Vite, serwer Node/Express, baza PostgreSQL, panel `/admin`, formularz kontaktowy i cztery języki pozostają w projekcie.

## Co działa w kodzie

- Przełącznik PL / EN / DA / DE w górnym pasku; ustawienie języka jest zapamiętywane w przeglądarce.
- Przycisk jasności otwiera suwak 0–100%; wartość zapisywana jest lokalnie.
- Przycisk pauzy animacji; preferencja pozostaje po ponownym wejściu. Jest też wsparcie dla `prefers-reduced-motion`.
- Cztery osobne sekcje cinematic na stronie głównej (~3,6 s każda), z przejściem do podstron, a także ich wersje na odpowiednich podstronach.
- Zakresy usług w czterech językach, formularz i panel administracyjny w oryginalnej aplikacji.
- Premium wizualizacje zoptymalizowane do WebP, logo B-CORE z cienkim geometrycznym łącznikiem.

## Wdrożenie produkcyjne

1. Rozpakuj folder `bcore-website` i prześlij jego **zawartość** do istniejącego repozytorium GitHub, w którym plik `Dockerfile` jest w katalogu głównym.
2. W Koyeb wybierz GitHub, branch `main`, budowanie z `Dockerfile`, instancję Free (jeżeli dostępna).
3. Uzupełnij bezpośrednio w Koyeb (nigdy w GitHub) `DATABASE_URL` z Neon, `ADMIN_PASSWORD`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CONTACT_TO_EMAIL`. `PORT` hostingu będzie odczytywany z otoczenia.
4. Po wdrożeniu sprawdź `/api/health`, formularz i panel `/admin` na realnym serwerze. Baza i email nie działają bez poprawnych sekretów i aktywnej usługi.
5. W DNS ustaw własną domenę zgodnie z instrukcją Koyeb; konfigurację domeny nadawczej należy potwierdzić w Resend.

### Build lokalny

`corepack enable` (lub zainstaluj pnpm 10.x) → `pnpm install --frozen-lockfile` → `pnpm build:deploy` → `pnpm start`.

**Ważne:** bez dostępu do działających sekretów Neon/Resend oraz instalacji zależności nie jest możliwe potwierdzenie pełnego działania produkcyjnego w tym środowisku. Nie wklejaj haseł, connection stringów ani kluczy API do czatu.

## Podgląd bez uruchamiania serwera

Otwórz `PODGLAD-B-CORE-OTWORZ-W-PRZEGLADARCE.html` w Chrome/Edge. Zobaczysz nawigację po podstronach, cztery sceny i przełączniki języka / jasności / animacji. Obrazy są w nim osadzone bezpośrednio, więc nie potrzebujesz internetu.

Ten plik służy **do obejrzenia wyglądu**; nie udostępnia na lokalnym komputerze panelu administracyjnego ani wysyłki formularza. Produkcyjne funkcje zachowane są w pełnym projekcie i będą dostępne po konfiguracji bazy Neon i usługi Resend oraz wdrożeniu backendu.
