# SaveMammona

Webowa aplikacja do zarządzania subskrypcjami, cyklicznymi płatnościami i jednorazowymi wpisami w kalendarzu płatności (React + TypeScript + Vite).

## Wymagania

- Node.js >= 20.x
- npm

## Uruchomienie

```bash
npm ci
npm run dev
```

Aplikacja: [http://localhost:3000](http://localhost:3000)

## Komendy

| Komenda | Opis |
|---------|------|
| `npm run dev` | Serwer deweloperski z hot reload |
| `npm run build` | Build produkcyjny |
| `npm run preview` | Podgląd buildu |
| `npm run lint` | ESLint |

## Konto demonstracyjne

Przy pierwszym uruchomieniu tworzone jest konto testowe (dane w `localStorage`):

| Pole | Wartość |
|------|---------|
| E-mail | `demo@savemammona.app` |
| Hasło | `Demo12345` |

Zaloguj się na `/login` - po sukcesie aplikacja przekieruje Cię na `/dashboard`.

Możesz też założyć własne konto przez `/register`.

## Trasy

| Ścieżka | Opis |
|---------|------|
| `/` | Ekran powitalny |
| `/login` | Logowanie |
| `/register` | Rejestracja |
| `/dashboard` | Dashboard subskrypcji |
| `/subscriptions` | Moje subskrypcje |
| `/subscriptions/new` | Dodaj subskrypcję cykliczną |
| `/calendar` | Kalendarz płatności |
| `/calendar/new` | Dodaj jednorazowy wpis do kalendarza |
| `/savings` | Symulacja oszczędności z dynamicznym wykresem |
| `/profile` | Profil użytkownika i ustawienia konta |

## Dane lokalne

Po zalogowaniu dane demo subskrypcji ładują się automatycznie do `localStorage`.

Subskrypcje i ręczne wpisy są przechowywane osobno:

| Klucz | Zawartość |
|-------|-----------|
| `savemammona_subscriptions` | Subskrypcje cykliczne z cyklem miesięcznym lub rocznym |
| `savemammona_manual_entries` | Jednorazowe wpisy widoczne wyłącznie w kalendarzu |

Roczne subskrypcje pojawiają się w kalendarzu jako pełna płatność w dniu odnowienia, a w statystykach miesięcznych są przeliczane proporcjonalnie na koszt miesięczny.
