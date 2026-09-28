# Aktualizacja — 28.09.2026

## Lekkie przejścia i przewijanie — nowa wersja

- Wspólny, nieruchomy nagłówek i stopka podczas przejść między podstronami. Linki nawigacji otwierają treść bez przeładowania całego dokumentu.
- Krótkie wejście treści (około pół sekundy), miedziana linia przy zmianie widoku i delikatne reakcje strzałek na wskazanie. Kliknięcia działają od razu, bez kolejki i oczekiwania na zakończenie animacji.
- Sekcje pojawiają się pojedynczo, z krótkim przesunięciem i subtelnym odsłonięciem zdjęć. Jeden wspólny obserwator widoczności przestaje śledzić każdy pokazany element. Usunięto ciągłą paralaksę czterech sekcji i rozmycie tła nagłówka.
- Płynne przejście do wskazanej sekcji, poprawne linki z kotwicami także w podglądzie HTML oraz zachowane działanie Wstecz/Dalej. Zmiana podstrony przenosi fokus klawiatury do treści.
- Pauza i systemowe ograniczenie ruchu wyłączają nowe efekty. Animacje nie blokują treści; wersja do druku pokazuje wszystkie sekcje. Nie dodano bibliotek animacji ani nowych plików multimedialnych.

## Pozostałe zmiany z tej paczki

- Łagodne, jednorazowe pojawianie się kolejnych bloków: tekstu, fotografii, etapów współpracy i opisów usług. Przycisk pauzy oraz preferencja ograniczenia ruchu w systemie wyłączają te efekty.
- Globus: spokojny pełny obrót co około 120 sekund, przeciąganie, stopniowo wygaszana bezwładność i powrót do automatycznego ruchu. Na ekranie dotykowym poziomy gest obraca, pionowy przewija stronę. Klawiatura: po zaznaczeniu globusa użyj strzałek.
- Ikona słońca w nagłówku: delikatne rozjaśnienie tła i tekstu, suwak 0–100%, zapamiętanie wyboru, przywrócenie ustawienia oryginalnego. Zachowany ciemny charakter strony.
- Krótsza kreska wyłącznie w logo nagłówka. Usunięte podpisy zdjęć i napis „przeciągnij” pod globusem.
- Nowy regulamin i polityka prywatności w czterech językach, wygodniejsze okno dokumentów i osobne adresy stron. Dokumenty opisują osobistą witrynę osoby fizycznej, bez fikcyjnych danych firmy. Sprawdź dane autora w `legal-config.ts` — zobacz `LEGAL-SETUP.md`.
- Zachowane panel administratora, baza ofert i poczta. Wygasłe techniczne wpisy IP oraz sesje są regularnie usuwane z pamięci serwera.
- Blueprint Render: osobna usługa `bcore-business-web`, Frankfurt, Free. Zobacz `DEPLOY-RENDER.md`, aby aktualizacja właściwej gałęzi nie zmieniła równocześnie drugiej usługi.

## Podmiana

Rozpakuj paczkę i skopiuj zawartość `bcore-website` do odpowiedniego repozytorium/gałęzi. Zachowaj swój katalog `.git`, sekrety w Renderze oraz `DATABASE_URL` aktualizowanej usługi. Pliki paczki nie zawierają haseł ani kluczy API. Nie wgrywaj samego pliku podglądu HTML jako aplikacji z panelem administratora.

`BCORE-preview.html` służy do obejrzenia wyglądu i interakcji bez instalacji. Wysyłka formularza i admin wymagają wdrożonej aplikacji oraz konfiguracji środowiska.
