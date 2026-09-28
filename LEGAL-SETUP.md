# Dane i dokumenty przed publikacją

Regulamin i polityka prywatności zostały dopasowane do tej wersji strony: zapytania zamiast zakupów online, indywidualne umowy, Resend, hosting Render, skrzynka e-mail, panel administratora oraz zapamiętane ustawienia języka, ruchu i jasności. Dokumenty mają wersje PL, EN, DA i DE. Nie stanowią gwarancji zgodności całej działalności ani braku roszczeń.

## 1. Sprawdź dane właściciela

W `artifacts/sales-platform/src/data/legal-config.ts` wpisano **Przemysław Bugajski**, na podstawie adresu kontaktowego istniejącego na stronie. Sprawdź poprawność imienia i nazwiska przed publikacją. E-mail i telefon pochodzą z `data/advisory.ts`; zmiana odbiorcy w `CONTACT_TO_EMAIL` nie zmienia automatycznie danych publicznych.

Dokumenty opisują właściciela jako osobę fizyczną prowadzącą osobistą witrynę o charakterze informacyjnym, prezentacyjnym i reklamowym. Nie zawierają fikcyjnej nazwy firmy, numeru CVR/NIP ani wymogu założenia spółki. Nazwa B-CORE, hasło ADVISORY & BROKERAGE i opisy pozostają zachowane zgodnie z Twoją dyspozycją.

Samo nazwanie strony wizytówką nie przesądza o kwalifikacji faktycznie wykonywanych czynności. Jeśli zaczniesz przyjmować płatne zlecenia, pośredniczyć w transakcjach lub regularnie sprzedawać, sprawdź obowiązki właściwe dla tej aktywności i kraju. Aktualizacja tekstu nie zastępuje tych ustaleń. Polityka nadal opisuje ochronę danych z formularza — prywatny właściciel nie oznacza automatycznie braku obowiązków związanych z publiczną witryną.

## 2. Potwierdź faktyczny przepływ danych

- Dokumenty zakładają hosting Render, wysyłkę Resend i wskazany Gmail. Gdy zmienisz dostawcę poczty, hostingu, bazę, formularz, analitykę albo osadzone materiały, zaktualizuj `data/legal.ts` we wszystkich czterech językach.
- Region Frankfurt dotyczy hostingu aplikacji. Resend i dostawcy wsparcia mogą przetwarzać dane poza EOG. Nie deklaruj, że wszystkie dane pozostają wyłącznie w UE.
- Zweryfikuj warunki i umowy przetwarzania dostawców, transfery poza EOG, podwykonawców oraz ich rzeczywiste okresy retencji dla wybranego planu. Zwykłe konto Gmail nie jest automatycznie firmową umową Google Workspace.
- Korespondencja jest przechowywana przez usługi pocztowe, nie w tabeli ofert. Ustal i stosuj przegląd skrzynki: usuwaj sprawy zakończone, dla których nie ma dalszej podstawy przechowywania; oznacz korespondencję konieczną do umów, obowiązków ustawowych lub konkretnego sporu. Okresy dokumentów księgowych i roszczeń zależą od rzeczywistej działalności i prawa. Sam tekst strony nie usuwa poczty.
- Liczniki ochrony przed nadużyciami automatycznie usuwają wygasłe wpisy IP co minutę. Sesja admina trwa maksymalnie 8 godzin; wygasłe wpisy serwera są sprzątane co minutę. Wylogowanie kończy daną sesję. Logi API nie zawierają celowo treści formularza ani haseł.
- W tej wersji nie dodano narzędzi marketingowych ani statystycznych. localStorage jest zapisywane po wyborze języka, animacji lub jasności; cookie administratora jest tworzone po zalogowaniu. Dodanie analityki, reklam, zewnętrznych map lub filmów może wymagać zmiany informacji i mechanizmu zgód przed ich uruchomieniem.

## 3. Zweryfikuj zakres usług

Regulamin obejmuje korzystanie z witryny i zapytania, nie zastępuje umowy doradczej, pośrednictwa, sprzedaży nieruchomości, dostawy ani wykonania konstrukcji. W każdej transakcji ustal rolę B-CORE, stronę umowy, prowizję, koszty, podatki, zakres odpowiedzialności i wymagane uprawnienia. Jeśli działasz na rynku regulowanym, sprawdź odpowiednie wymogi przed zaoferowaniem usługi. Przy ewentualnym zawieraniu umów z konsumentem przekaż wymagane informacje, zasady reklamacji i odstąpienia, jeśli ma zastosowanie. Warto zlecić końcową weryfikację prawnikowi znającemu kraj siedziby i rynki, na których rzeczywiście działasz.

Podpisy zdjęć zostały usunięte zgodnie z projektem wizualnym. Zdjęcia nadal nie są opisane jako realizacje B-CORE. Rejestr źródeł i licencji znajduje się w `ASSETS.md`; dodawaj tylko zdjęcia i logotypy, do których masz odpowiednie prawa.

## Źródła do weryfikacji

Sprawdzone 27–28.09.2026:

- [Datatilsynet — obowiązek informacyjny dla małych firm](https://www.datatilsynet.dk/regler-og-vejledning/gdpr-univers-for-smaa-virksomheder/trin-4-oplys-om-at-du-behandler-personoplysninger)
- [Komisja Europejska — prawa osób](https://commission.europa.eu/law/law-topic/data-protection/information-individuals_en)
- [Komisja Europejska — zasady przetwarzania](https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/principles-gdpr_en)
- [Forbrugerombudsmanden — E-handelsloven, identyfikacja przedsiębiorcy](https://forbrugerombudsmanden.dk/alle-emner/anden-lovgivning/e-handelsloven)
- [Digitaliseringsstyrelsen — cookies i podobne technologie](https://digst.dk/sikkerhed/digitale-tilsyn/tilsyn-med-sporingsteknologiomraadet/cookievejledningen/)
- [Render — DPA](https://render.com/dpa)
- [Resend — DPA](https://resend.com/legal/dpa)
- [Google — polityka prywatności](https://policies.google.com/privacy)

Pełne strony dokumentów: `/polityka-prywatnosci` i `/regulamin`. Są także dostępne bez opuszczania formularza w oknie dialogowym, z możliwością przełączenia dokumentu i otwarcia pełnej strony.
