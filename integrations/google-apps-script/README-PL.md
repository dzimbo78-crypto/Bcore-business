# B-CORE — Gmail bez własnej domeny

**Status:** kod integracji jest przygotowany, ale wysyłanie na Gmail NIE zacznie działać bez jednorazowej zgody właściciela Gmail na Google Apps Script. Zachowujemy stronę wyłącznie na onrender.com.

## Co otrzymuje właściciel B-CORE

Wszystkie dane klienta i zaawansowanego projektu SteelVision na przemyslaw.bugajski78@gmail.com: imię i nazwisko, telefon, adres e-mail, opis wyceny, PDF raportu, CSV parametrów oraz kompletny JSON. Zwykłe zapytania bez konfiguratora są również obsługiwane.

## Jednorazowe połączenie z Gmail

1. Zaloguj się do właściwego Gmail na komputerze. Otwórz https://script.google.com/home/projects/create i nazwij skrypt B-CORE Mail.
2. Skopiuj CAŁY kod z pliku Code.gs znajdującego się obok tego README do edytora Apps Script. Zapisz.
3. W Project Settings -> Script Properties ustaw klucz BCORE_GOOGLE_MAIL_SECRET z losowym sekretem o długości przynajmniej 32 znaków (wygeneruj w menedżerze haseł). Nie publikuj sekretu w GitHub, na stronie ani w e-mailu.
4. Deploy -> New Deployment -> Web app. Wybierz Execute as: Me, Who has access: Anyone. Zatwierdź żądanie Google MailApp o wysyłanie e-maili; skrypt nie uzyskuje dostępu do czytania skrzynki.
5. Skopiuj adres aplikacji, który kończy się /exec, np. https://script.google.com/macros/s/.../exec.
6. W Render dla obu usług B-CORE ustaw zmienne:
   - BCORE_GOOGLE_MAIL_URL = adres skryptu z pkt 5
   - BCORE_GOOGLE_MAIL_SECRET = dokładnie ten sam sekret co w pkt 3
   - CONTACT_TO_EMAIL = przemyslaw.bugajski78@gmail.com (już ustawiony)

Sam adres /exec możesz przekazać w rozmowie; sekret wpisuj wyłącznie w prywatnych ustawieniach Render i Apps Script. Nie udostępniaj hasła do Gmail ani kodów SMS.

## Bezpieczeństwo

Publiczny endpoint Apps Script (Anyone) jest konieczny dla połączenia z Render. Każde żądanie weryfikowane jest podpisem HMAC-SHA256, którego sekret znajduje się tylko po stronie serwerów. Bez podpisu żadna wiadomość nie może zostać wysłana. Google MailApp wykonuje wysyłkę w kontekście konta, które zatwierdziło skrypt.

## Test odbiorczy

Wyślij jedno testowe zapytanie ze SteelVision. W panelu B-CORE powinien pojawić się zapisany projekt z numerem, a odpowiedź API potwierdzi przyjęcie przez Google. Następnie właściciel sprawdza Gmail Odebrane/Spam i obecność PDF/CSV/JSON oraz zgodność wymiarów i danych klienta.

Uwaga: przyjęcie przez MailApp to nie dowód doręczenia do folderu Odebrane. Skrypt obowiązują dzienne limity Gmail, około 100 odbiorców na dobę dla osobistego konta według dokumentacji Google; limity mogą się zmieniać. Załączniki większe od limitu są odrzucane, a projekt nadal pozostaje zapisany w B-CORE.

Źródła:
https://developers.google.com/apps-script/reference/mail/mail-app
https://developers.google.com/apps-script/guides/services/quotas
