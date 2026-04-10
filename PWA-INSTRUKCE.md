# 📱 PWA NASAZENÍ – ŠKOLNÍ ROZVRH
## Instrukce pro GitHub Pages

> Autor: Více admirál Jiřík 🚀 | AI: Admirál Claude 🤖

---

## 📁 NOVÉ SOUBORY K PŘIDÁNÍ DO REPOZITÁŘE

```
📦 skolni-rozvrh-live/
├── 📄 index.html          ← NAHRADIT (přidány PWA meta tagy)
├── 📱 manifest.json       ← NOVÝ
├── 🛰️ service-worker.js  ← NOVÝ
├── ⚙️ pwa-module.js       ← NOVÝ
├── 🖼️ icons/
│   ├── icon-72.png        ← NOVÝ
│   ├── icon-96.png        ← NOVÝ
│   ├── icon-128.png       ← NOVÝ
│   ├── icon-144.png       ← NOVÝ
│   ├── icon-152.png       ← NOVÝ
│   ├── icon-192.png       ← NOVÝ
│   ├── icon-384.png       ← NOVÝ
│   └── icon-512.png       ← NOVÝ
└── ... (ostatní soubory beze změn)
```

---

## ⚠️ DŮLEŽITÉ: UPRAV CESTY V SOUBORECH

### 1) `manifest.json`
Zkontroluj `start_url` a `scope` – musí odpovídat tvému GitHub Pages URL:

**Pokud je URL: `https://jirka22med.github.io/skolni-rozvrh-live/`**
```json
"start_url": "/skolni-rozvrh-live/",
"scope": "/skolni-rozvrh-live/"
```
✅ Toto je již nastaveno správně.

---

### 2) `service-worker.js`
Zkontroluj `STATIC_FILES` pole – všechny cesty musí začínat `/skolni-rozvrh-live/`:
```javascript
const STATIC_FILES = [
    '/skolni-rozvrh-live/',
    '/skolni-rozvrh-live/index.html',
    '/skolni-rozvrh-live/style.css',
    // ... atd.
];
```
✅ Toto je již nastaveno správně.

---

### 3) `pwa-module.js`
Zkontroluj cestu k service workeru:
```javascript
const registration = await navigator.serviceWorker.register(
    '/skolni-rozvrh-live/service-worker.js',
    { scope: '/skolni-rozvrh-live/' }
);
```
✅ Toto je již nastaveno správně.

---

## 🚀 POSTUP NASAZENÍ

### Krok 1: Zkopíruj soubory
Přidej všechny nové soubory do svého lokálního repozitáře.

### Krok 2: Git push
```bash
git add .
git commit -m "📱 Přidána PWA podpora (manifest, service worker, ikony)"
git push origin main
```

### Krok 3: Ověření
Po deploymentu otevři:
`https://jirka22med.github.io/skolni-rozvrh-live/`

V Chrome DevTools (F12) → Application tab:
- ✅ Manifest → načten
- ✅ Service Workers → aktivní
- ✅ Storage → Cache Storage viditelný

---

## 📲 JAK NAINSTALOVAT NA ZAŘÍZENÍ

### Android (Chrome):
1. Otevři stránku v Chrome
2. Zobrazí se banner "Přidat na plochu" NEBO
3. Klikni na tlačítko `📲 Nainstalovat` (vpravo dole)

### iOS (Safari):
1. Otevři stránku v Safari
2. Klikni na tlačítko **Sdílet** (čtverec se šipkou)
3. Zvolte **Přidat na plochu**

### Desktop Chrome:
1. Otevři stránku
2. Vpravo v adresním řádku se zobrazí ikona instalace
3. Klikni a nainstaluj

---

## 🔧 TESTOVÁNÍ PWA

### V konzoli prohlížeče (F12):
```javascript
// Zobrazit stav PWA
PWAModule.getStatus()

// Vymazat cache (pro debug)
PWAModule.clearCache()

// Zkontrolovat registraci SW
navigator.serviceWorker.getRegistrations().then(console.log)
```

### Lighthouse audit:
1. F12 → Lighthouse
2. Zaškrtni "Progressive Web App"
3. Klikni "Analyze page load"
4. Cíl: 100% PWA score ✅

---

## 🐛 ČASTÉ PROBLÉMY

### Service Worker se nezaregistroval
- Ověř, že `service-worker.js` je v ROOT složce repozitáře (ne v podsložce)
- GitHub Pages vyžaduje HTTPS (automaticky na `*.github.io`)

### Manifest nenalezen
- Zkontroluj cestu v `<link rel="manifest" href="manifest.json">`
- Relativní cesta = soubor ve stejné složce jako index.html ✅

### Ikony se nezobrazují
- Ověř, že složka `icons/` je v repozitáři
- Zkontroluj case sensitivity (Linux je case-sensitive!)

### Cache servuje starou verzi
- Změň `CACHE_NAME = 'skolni-rozvrh-v2'` (zvedni číslo verze)
- Nebo v DevTools: Application → Storage → Clear site data

---

## ✅ PWA CHECKLIST

- [ ] `manifest.json` přidán do repozitáře
- [ ] `service-worker.js` v root složce projektu
- [ ] `pwa-module.js` přidán a načten v index.html
- [ ] `index.html` aktualizován (PWA meta tagy)
- [ ] Složka `icons/` s 8 ikonami nahrána
- [ ] Cesty v souborech odpovídají GitHub repo URL
- [ ] Git push proveden
- [ ] Lighthouse PWA audit = 100% ✅

---

**🖖 Live Long and Prosper! – Více admirál Jiřík**
