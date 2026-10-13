# KrishiSetu — Connecting Farms to Markets, Smarter.

Frontend prototype: React + Vite + Tailwind + React Router + Recharts + Lucide. All data is **Demo Data**.

```
npm install
npm run dev
```

## Connecting your backend
1. Copy `.env.example` to `.env`, set `VITE_USE_MOCK=false` and `VITE_API_URL`.
2. Implement the endpoints in `API.md`. Every call goes through `src/services/*`, which switch between mock data and `fetch` in one place (`src/services/api.js`).
3. No page imports `src/data/*` for live data any more, so nothing else needs to change.

Structure: `components/{common,layout,marketplace,dashboard,analytics,logistics,orders}`, `pages/`, `context/` (app + auth), `hooks/`, `utils/`, `data/`, `services/`.

Demo flow: Home → AI Insights (Tomato / Bhopal) → Smart Match (Tomatoes, 500 kg, Grade A, Bhopal) → Marketplace → Add 300 kg → Orders → Logistics → Optimize Route → Impact.

## Languages
English and Hindi are built in. Use the language selector in the navbar; the choice is remembered (`localStorage`).
- English text is the translation key: `tr('Some text')` in `src/i18n/index.js` returns the Hindi version from `src/i18n/hi.js`, or the English text if none exists.
- Add a language: create `src/i18n/<code>.js` (same shape as `hi.js`), register it in `src/i18n/index.js` (`dicts` and `languages`).
- Dynamic text uses placeholders: `tr('Signed in as {name}.',{name})`. A number in a string also matches a `{n}` entry (e.g. `'{n} km away'`).
- Not translated: seller and FPO names, long server-generated text, and number formats. Have a native speaker review `hi.js` before launch.
