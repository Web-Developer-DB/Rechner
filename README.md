# 📱 Taschenrechner Web App (PWA)

Ein moderner Taschenrechner als **Progressive Web App** mit **erweiterten wissenschaftlichen Funktionen**, **Haptik auf Mobilgeräten**, **Verlaufsanzeige**, **Einheiten- & Währungskonverter** sowie **Tests & Linting**.

---

## ✨ Features

* ✅ **Grundfunktionen**: +, −, ×, ÷, Prozent, ±, √, x², CE, AC
* ✅ **Wissenschaftlich**: π, e, sin, cos, tan, ln, log₁₀, exp, Fakultät, Potenzen, Speicher (MC, MR, M+, M−)
* ✅ **Eingabe-Historie**: klickbarer Verlauf (lokal gespeichert, bis zu 50 Rechnungen)
* ✅ **Einheiten-Konverter**:

  * Länge: m, km, cm, mm, mi, ft, in
  * Gewicht: kg, g, t, lb, oz
  * Währung: EUR, USD, GBP, TRY, CHF (manuelle Eingabe oder Live-Kurs via API)
* ✅ **Haptisches Feedback** (Vibration auf Mobilgeräten)
* ✅ **Dark-/Light-Mode** (automatisch oder manuell)
* ✅ **PWA**:

  * Installierbar auf Handy/PC
  * Offline-fähig durch Service Worker
  * Dynamisch generierte App-Icons

---

## 🚀 Installation & Nutzung

### 1. Direkt im Browser

* Datei `index.html` im Browser öffnen → läuft sofort.

### 2. Als PWA installieren

* Im Browser „Installieren“ wählen (oder Installations-Button in der App klicken).
* Funktioniert offline.

---

## 🧪 Entwicklung & Tests

### Lokale Entwicklung

```bash
# Repo klonen
git clone https://github.com/deinname/taschenrechner-pwa.git
cd taschenrechner-pwa

# (optional) lokalen Server starten, z. B. mit Vite oder serve
npm create vite@latest .
npm run dev
```

### Linting

```bash
npm init -y
npm i -D eslint
npx eslint --init
npm run lint
```

### Unit-Tests mit Jest

```bash
npm i -D jest @jest-environment/jsdom
npm run test
```

Beispiel (`tests/calc.test.js`):

```js
import { JSDOM } from 'jsdom';

test('3 + 4 * 2 = 11', () => {
  const tokens = window.Calc.tokenize('3 + 4 * 2');
  const rpn = window.Calc.toRPN(tokens);
  const res = window.Calc.evalRPN(rpn);
  expect(res).toBe(11);
});
```

### End-to-End-Tests mit Playwright

```bash
npm i -D @playwright/test
npx playwright test
```

Beispiel (`tests/calc.spec.ts`):

```ts
import { test, expect } from '@playwright/test';

test('78 * 25 = 1950', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.click('text=7');
  await page.click('text=8');
  await page.click('text=×');
  await page.click('text=2');
  await page.click('text=5');
  await page.click('text==');
  await expect(page.locator('#current')).toContainText('1950');
});
```

---

## 📂 Projektstruktur

```
📦 taschenrechner-pwa
 ┣ 📜 index.html        # Haupt-App (alle Funktionen in einer Datei)
 ┣ 📜 README.md         # Dokumentation
 ┣ 📂 tests             # Jest & Playwright Tests
 ┗ 📜 .eslintrc.js      # ESLint-Konfiguration
```

---

## 🔮 Roadmap

* [ ] Erweiterte Verlaufssuche
* [ ] Undo-/Redo-Funktion
* [ ] Mehr Konverter-Kategorien (Temperatur, Volumen)
* [ ] Deployment als GitHub Pages

---

## 📄 Lizenz

MIT © 2025 – Dein Name
