# Taschenrechner React PWA

Eine reaktive Taschenrechner-Anwendung mit wissenschaftlichen Funktionen, klickbarem Verlauf, Einheiten- & Währungskonverter sowie optionaler PWA-Installation. Die App wurde vollständig in React (Vite) modularisiert und nutzt lokale Persistenz für Nutzerpräferenzen.

---

## Inhaltsverzeichnis

1. [Funktionen](#funktionen)
2. [Technischer Überblick](#technischer-überblick)
3. [Schnellstart](#schnellstart)
4. [Projektstruktur](#projektstruktur)
5. [Scripts & Tooling](#scripts--tooling)
6. [PWA-Integration](#pwa-integration)
7. [Bedienung & Barrierefreiheit](#bedienung--barrierefreiheit)
8. [Tests & Qualitätssicherung](#tests--qualitätssicherung)
9. [Bekannte Einschränkungen](#bekannte-einschränkungen)
10. [Weiterführende Ideen](#weiterführende-ideen)

---

## Funktionen

- **Standard-Rechner**: Grundrechenarten, Prozent, Vorzeichenwechsel, Quadrat, Quadratwurzel.
- **Wissenschaftlich**: π, e, Potenz, Fakultät, exp, ln, log₁₀ sowie sin/cos/tan (Grad/Bogenmaß umschaltbar).
- **Speicherfunktionen**: MC, MR, M+, M−.
- **Verlauf**: Bis zu 50 Einträge, lokal gespeichert und per Klick erneut nutzbar.
- **Einheiten & Währungen**:
  - Länge (m, km, cm, mm, mi, ft, in)
  - Gewicht (kg, g, t, lb, oz)
  - Währung (EUR, USD, GBP, TRY, CHF) mit manuellem Kurs oder Live-Abfrage.
- **Theme & Haptik**: Dark-/Light-Mode per LocalStorage, Vibrationsfeedback auf unterstützten Geräten.
- **PWA-ready**: Dynamisches Manifest, Service Worker, Installations-Prompt, Offline-Fallback.

---

## Technischer Überblick

- **Framework**: React 18 + React DOM.
- **Build-Tool**: Vite 5 mit `@vitejs/plugin-react`.
- **Styling**: Globale CSS-Datei (`src/styles/app.css`) mit CSS Custom Properties für Themenwechsel.
- **State-Management**: Lokale Hooks (`useCalculator`, `useHistoryLog`, `useConverter`, `useTheme`).
- **Persistenz**:
  - Theme- & Winkelmodus über `localStorage`.
  - Verlaufseinträge (`calc-log`) lokal gespeichert.
- **Utilities**:
  - Mathematische Parser-Funktionen (Tokenizing, RPN, Evaluierung).
  - Zahlformatierung & Präzisions-Clamping.
  - Haptisches Feedback abstrahiert in `utils/haptics.js`.

---

## Schnellstart

### Voraussetzungen

- Node.js ≥ 18 (inkl. npm) installiert.

### Installation & Entwicklung

```bash
# Abhängigkeiten installieren
npm install

# Entwicklungsserver mit HMR starten
npm run dev
```

Vite läuft standardmäßig unter `http://localhost:5173`. Die Ausgabe im Terminal zeigt die tatsächliche URL.

### Produktionsbuild & Vorschau

```bash
# Produktionsbundle bauen (Output in dist/)
npm run build

# Produktionsbundle lokal ansehen
npm run preview
```

---

## Projektstruktur

```
.
├── index.html                 # Vite Entry (bindet src/main.jsx ein)
├── package.json
├── vite.config.js             # Vite-Konfiguration (React-Plugin)
├── src
│   ├── App.jsx                # Komposition von Rechner, Verlauf und Konverter
│   ├── main.jsx               # React Einstiegspunkt
│   ├── components
│   │   ├── calculator
│   │   │   └── Calculator.jsx
│   │   ├── converter
│   │   │   └── Converter.jsx
│   │   └── history
│   │       └── HistoryPanel.jsx
│   ├── hooks
│   │   ├── useCalculator.js   # Kernlogik des Rechners inkl. Parser & Speicher
│   │   ├── useConverter.js    # Einheit-/Währungs-Konverter inkl. Live-Rate
│   │   ├── useHistoryLog.js   # Verlauf mit LocalStorage-Persistenz
│   │   └── useTheme.js        # Dark-/Light-Mode
│   ├── pwa
│   │   └── usePwaSetup.js     # Manifest- & Service-Worker-Registrierung, Install-Prompt
│   ├── styles
│   │   └── app.css            # Globales Styling & Layout
│   └── utils
│       ├── haptics.js         # Vibrations-Feedback
│       ├── math.js            # Tokenizer, Shunting-Yard & RPN-Auswertung
│       └── number.js          # Formatierungs-Helpers
└── .gitignore
```

---

## Scripts & Tooling

| Script          | Beschreibung                                               |
|-----------------|------------------------------------------------------------|
| `npm run dev`   | Startet den Vite-Dev-Server mit Hot Module Reloading.      |
| `npm run build` | Baut ein optimiertes Produktionsbundle in `dist/`.        |
| `npm run preview` | Vorschau-Server für das Produktionsbundle.             |
| `npm run lint`  | Führt ESLint aus (Konfiguration muss ggf. ergänzt werden). |
| `npm run test`  | Startet Vitest (derzeit keine Tests hinterlegt).          |

> Hinweis: ESLint- und Vitest-Konfigurationen sind vorbereitet, aber noch ohne Regeln bzw. Tests. Bitte bei Bedarf ergänzen.

---

## PWA-Integration

- `usePwaSetup` generiert zur Laufzeit ein Manifest samt Icons (Canvas) und registriert einen Service Worker.
- Beim `beforeinstallprompt`-Event wird ein Installationsbutton aktiviert.
- Service Worker cached `.` als Fallback und versucht Netzwerk-Requests bei Bedarf zu cachen.

Für produktive Deployments sollte das dynamische Manifest ggf. durch statische Assets ersetzt und der Cache-Umfang geprüft werden.

---

## Bedienung & Barrierefreiheit

- **Tastatursteuerung**:
  - Ziffern, `.` / `,`, Operatoren (`+ - * / ^`)
  - `Enter` oder `=` → Ergebnis
  - `Backspace` → DEL, `Delete` → CE, `Escape` → AC
  - Klammern `(` `)` werden unterstützt.
- **Aria-Live**: Das Display (`role="region"`) aktualisiert den aktuellen Wert für Screenreader.
- **Buttons** besitzen sinnvolle `aria-label`-Attribute und `aria-expanded` (Advanced Panel).

---

## Tests & Qualitätssicherung

- Unit-Tests geplant via **Vitest** (`npm run test`), aktuell keine Testdateien vorhanden.
- ESLint ist installiert; Ruleset muss über `.eslintrc.*` ergänzt und an Projektstil angepasst werden.
- Empfohlene Testabdeckung:
  - Parser-/Mathe-Utilities (`src/utils/math.js`)
  - Konverter-Hooks (Währung, Einheiten, Fehlerfälle)
  - UI-E2E-Tests mit Playwright für zentrale Flows (z. B. 78 × 25 = 1950).

---

## Bekannte Einschränkungen

- Live-Wechselkurse erfordern Netzwerkzugriff; fehlgeschlagene Requests führen nur zu haptischem Fehlerfeedback.
- Währungslogik geht davon aus, dass Kursangaben als „1 FROM = rate TO“ eingegeben werden.
- Der Service Worker cached aktuell lediglich die Root-Route (`.`); tiefere Routen benötigen zusätzliche Einträge.
- ESLint/ Vitest-Konfigurationen sind placeholders – bitte Regeln/Tests hinzufügen, bevor `lint`/`test` produktiv eingesetzt werden.

---

## Weiterführende Ideen

- Weitere Konverter-Kategorien (Temperatur, Volumen, Energie, Zeit).
- Undo-/Redo-Schritte im Verlauf.
- Internationalisierung (z. B. Sprachenumschaltung, Zahlformatierung).
- Verbesserte PWA-Assets & deploy-spezifische Service-Worker-Strategien.
- Integration einer robusteren Persistenz (z. B. IndexedDB) für größere Verlaufsdaten.

---

Viel Spaß beim Rechnen! Bei Fragen oder Erweiterungswünschen gerne melden. 😊
