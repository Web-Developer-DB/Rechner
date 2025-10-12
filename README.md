# 📱 Taschenrechner React PWA

Ein moderner, reaktiver Taschenrechner mit wissenschaftlichen Funktionen, klickbarem Verlauf, Einheiten- und Währungskonverter sowie optionaler PWA-Installation. Die Anwendung wurde in eine modulare React/Vite-Codebasis überführt, damit Struktur und Wartbarkeit klarer sind.

---

## ✨ Highlights

- **Umfangreicher Rechner**: Grundrechenarten, Prozent, Vorzeichen, Potenzen, Wurzel.
- **Wissenschaftlich**: π, e, sin, cos, tan, ln, log₁₀, exp, Fakultät, Speicherfunktionen.
- **Smartes UX**: Dark-/Light-Mode (mit LocalStorage), Grad/Bogenmaß-Umschaltung, Haptik (Vibration).
- **Verlauf**: Bis zu 50 Einträge, lokal gespeichert, per Klick wiederverwendbar.
- **Konverter**: Länge, Gewicht, Währung (manueller Kurs oder Live-Rate via API).
- **PWA-ready**: Dynamisches Manifest, Service Worker, Installations-Button.

---

## 🛠️ Tech-Stack

- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- Lokales State-Management via Hooks (`useCalculator`, `useHistoryLog`, `useConverter`)
- CSS mit Custom Properties (Dark-/Light-Theming)
- Progressive Web App Setup (Manifest + Service Worker)

---

## 🚀 Los geht's

```bash
# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev

# Produktion bauen
npm run build

# Production-Bundle lokal ansehen
npm run preview
```

Standardmäßig läuft der Dev-Server unter `http://localhost:5173`.

---

## 🧪 Tests & Qualität

- `npm run lint` – ESLint (Konfiguration bitte nach Bedarf ergänzen)
- `npm run test` – Vitest (Testdateien noch hinzufügen)

Empfehlungen:

- Unit-Tests für Parser/Mathe-Utilities (`src/utils/math.js`)
- Playwright-Tests für wichtige UI-Flows (z. B. 78 × 25 = 1950)

---

## 📂 Projektstruktur

```
.
├── index.html
├── package.json
├── vite.config.js
└── src
    ├── App.jsx
    ├── main.jsx
    ├── components
    │   ├── calculator
    │   │   └── Calculator.jsx
    │   ├── converter
    │   │   └── Converter.jsx
    │   └── history
    │       └── HistoryPanel.jsx
    ├── hooks
    │   ├── useCalculator.js
    │   ├── useConverter.js
    │   ├── useHistoryLog.js
    │   └── useTheme.js
    ├── pwa
    │   └── usePwaSetup.js
    ├── styles
    │   └── app.css
    └── utils
        ├── haptics.js
        ├── math.js
        └── number.js
```

Diese Struktur trennt UI, State-Logik, Utilities und Styling klar voneinander.

---

## 🧭 Roadmap-Ideen

- Weitere Konverter-Kategorien (Temperatur, Volumen, Energie)
- Undo-/Redo im Verlauf
- Umfangreichere Testabdeckung (Vitest + Playwright)
- Deployment via GitHub Pages oder Vercel

---

## 📄 Lizenz

MIT © 2025 – WebDevDB
