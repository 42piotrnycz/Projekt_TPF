# SaveMammona

Webowa aplikacja do zarządzania wydatkami (React + TypeScript + Vite).

## Wymagania

- Node.js >= 16.x
- npm

## Uruchomienie

```bash
npm install
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

Zaloguj się na `/login` — po sukcesie przekierowanie na `/dashboard`.

Możesz też założyć własne konto przez `/register`.

## Trasy

| Ścieżka | Opis |
|---------|------|
| `/` | Ekran powitalny |
| `/login` | Logowanie |
| `/register` | Rejestracja |
| `/dashboard` | Panel (chroniony, po zalogowaniu) |
