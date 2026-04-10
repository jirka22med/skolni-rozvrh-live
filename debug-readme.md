# 🐛 DEBUG MODULE - DOKUMENTACE

> **Profesionální debug systém pro projekt Školní Rozvrh**  
> Autor: Více admirál Jiřík | AI: Admirál Claude.AI  
> Datum: Říjen 2025

---

## 📋 OBSAH
1. [Co to je](#co-to-je)
2. [Funkce](#funkce)
3. [Instalace](#instalace)
4. [Použití](#použití)
5. [Klávesové zkratky](#klávesové-zkratky)
6. [API Reference](#api-reference)
7. [Tipy & Triky](#tipy--triky)

---

## 🎯 CO TO JE

**Debug Module** je samostatný JavaScript modul pro monitoring a debugování celé aplikace Školního rozvrhu.

**Výhody:**
- ✅ Automatické zachytávání chyb
- ✅ Real-time FPS monitoring
- ✅ Validace rozvrhu a countdown
- ✅ Export logů do souboru
- ✅ Vizuální debug panel
- ✅ Žádné závislosti

---

## 🚀 FUNKCE

### 1) 🐛 ERROR CATCHING
Automaticky zachytává **všechny JavaScript chyby** v aplikaci:
```
[21:18:14] [ERROR] ❌ JavaScript Error: Cannot read property 'endMinutes' of undefined
[21:18:14] [ERROR] 📍 Soubor: countdown-module.js:45
```

### 2) ⚡ FPS MONITORING
Sleduje výkon aplikace v reálném čase:
```
[21:18:20] [FPS] ⚡ FPS: 60 | Avg: 59 | Min: 58 | Max: 60
```

**Varování při poklesu:**
```
[21:18:25] [WARNING] ⚠️ Nízké FPS detekováno: 28
```

### 3) 📅 VALIDACE ROZVRHU
Kontroluje rozvrh při startu aplikace:
```
[21:18:14] [SCHEDULE] 📊 Celkem hodin v rozvrhu: 36
[21:18:14] [SCHEDULE] 📆 Pondělí: 2 hodin
[21:18:14] [SCHEDULE] 📆 Úterý: 2 hodin
...
[21:18:14] [SCHEDULE] ✅ Žádné duplicity nenalezeny
[21:18:14] [SCHEDULE] ✅ Žádné časové překryvy
[21:18:14] [SUCCESS] ✅ Validace rozvrhu úspěšná!
```

**Detekuje:**
- ❌ Duplicitní hodiny
- ❌ Časové překryvy
- ❌ Chybné cross-day bloky
- ⚠️ Podezřelé struktury

### 4) ⏱️ VALIDACE COUNTDOWN
Kontroluje výpočty odpočtu při každé změně hodiny:
```
[21:18:14] [COUNTDOWN] ⏱️ Validuji countdown pro: 🌙 Volno
[21:18:14] [COUNTDOWN] ⏱️ Zbývá: 10h 22min (622 minut)
[21:18:14] [COUNTDOWN] 📊 Progress: 37%
[21:18:14] [SUCCESS] ✅ Countdown validace úspěšná
```

### 5) 📥 EXPORT LOGŮ
Stáhni kompletní debug report jako `.txt` soubor:
```
==================================================
DEBUG LOG - 30.10.2025 21:18:14
==================================================
🚀 Start aplikace: 21:18:14
⏱️ Celková doba běhu: 3600 sekund
📊 Celkem logů: 245
❌ Celkem chyb: 0
⚠️ Celkem varování: 2

⚡ FPS Statistiky:
   Current: 60
   Average: 59
   Min: 58
   Max: 60

==================================================
VŠECHNY LOGY:
==================================================
[21:18:14] [INFO] Aplikace spuštěna
[21:18:14] [SUCCESS] Rozvrh načten (36 hodin)
...
```

### 6) 🎮 VIZUÁLNÍ DEBUG PANEL
Zobrazí panel s live statistikami přímo na stránce:

```
┌─────────────────────────┐
│ 🐛 DEBUG PANEL      [✕] │
├─────────────────────────┤
│ ⏱️ Uptime: 3600s        │
│ ⚡ FPS: 60 (avg: 59)    │
│ 📊 Logs: 245            │
│ ❌ Errors: 0            │
│ ⚠️ Warnings: 2          │
├─────────────────────────┤
│ Poslední logy:          │
│ [21:18:14] Aplikace...  │
│ [21:18:15] Hodina...    │
├─────────────────────────┤
│ [📥 Export] [🗑️ Clear] │
└─────────────────────────┘
```

---

## 📦 INSTALACE

### Krok 1: Přidat soubor
Zkopíruj `debug-module.js` do složky projektu:
```
📦 projekt/
├── 📄 index.html
├── 🎨 style.css
├── ⚙️ script.js
├── 📅 rozvrh-hodin.js
├── ⏱️ countdown-module.js
└── 🐛 debug-module.js  ← NOVÝ!
```

### Krok 2: Načíst v HTML
V `index.html` přidej **JAKO PRVNÍ** script:
```html
<!-- ⚡ SPRÁVNÉ POŘADÍ! ⚡ -->
<script src="debug-module.js"></script>      <!-- 1. DEBUG -->
<script src="rozvrh-hodin.js"></script>      <!-- 2. ROZVRH -->
<script src="countdown-module.js"></script>  <!-- 3. COUNTDOWN -->
<script src="script.js"></script>            <!-- 4. HLAVNÍ -->
```

### Krok 3: Inicializovat
V `script.js` (na začátku souboru):
```javascript
// Inicializace debug modulu
DebugModule.init({
    enabled: true,           // Zapnout debug
    fpsMonitoring: true,     // Sledovat FPS
    autoValidate: true,      // Validovat rozvrh při startu
    showPanel: false,        // Panel skrytý (klávesa D)
    exportOnError: false     // Neexportovat automaticky
});
```

### Krok 4: Použít
```javascript
// Logování
DebugModule.log('Aplikace spuštěna', 'INFO');

// Validace rozvrhu
DebugModule.schedule.validate(schedule);

// Validace countdown
DebugModule.countdown.validate(currentLesson, currentMinutes, currentDay);

// Export logů
DebugModule.exportLogs();
```

---

## ⌨️ KLÁVESOVÉ ZKRATKY

| Klávesa | Akce |
|---------|------|
| **D** | Zobrazit/skrýt debug panel |
| **Shift + E** | Exportovat logy |
| **F11** | Fullscreen (již existující) |
| **F** | Fullscreen (již existující) |

---

## 📚 API REFERENCE

### DebugModule.init(config)
**Inicializace modulu**

```javascript
DebugModule.init({
    enabled: true,           // Zapnout/vypnout
    showPanel: false,        // Zobrazit panel
    maxLogs: 1000,          // Max počet logů
    fpsMonitoring: true,    // FPS monitoring
    autoValidate: true,     // Automatická validace
    exportOnError: false    // Auto-export při chybě
});
```

---

### DebugModule.log(message, category)
**Zalogovat zprávu**

```javascript
DebugModule.log('Něco se stalo', 'INFO');
```

**Kategorie:**
- `INFO` - Obecná informace (cyan)
- `SUCCESS` - Úspěch (zelená)
- `WARNING` - Varování (oranžová)
- `ERROR` - Chyba (červená)
- `FPS` - FPS data (fialová)
- `SCHEDULE` - Rozvrh (žlutá)
- `COUNTDOWN` - Countdown (cyan)

---

### DebugModule.performance.startMonitoring()
**Spustit FPS monitoring**

```javascript
DebugModule.performance.startMonitoring();
```

---

### DebugModule.performance.getFPS()
**Získat FPS statistiky**

```javascript
const fps = DebugModule.performance.getFPS();
console.log(fps.current);  // Aktuální FPS
console.log(fps.avg);      // Průměrné FPS
console.log(fps.min);      // Minimální FPS
console.log(fps.max);      // Maximální FPS
```

---

### DebugModule.schedule.validate(scheduleData)
**Validovat rozvrh**

```javascript
const result = DebugModule.schedule.validate(schedule);

if (!result.valid) {
    console.error('Rozvrh obsahuje chyby:', result.errors);
}
```

**Vrací:**
```javascript
{
    valid: true/false,
    errors: [...],      // Kritické chyby
    warnings: [...]     // Varování
}
```

---

### DebugModule.countdown.validate(lesson, currentMinutes, currentDay)
**Validovat countdown**

```javascript
const result = DebugModule.countdown.validate(
    currentLesson,
    currentMinutes,
    currentDay
);

if (!result.valid) {
    console.error('Countdown chyba:', result.errors);
}
```

**Vrací:**
```javascript
{
    valid: true/false,
    errors: [...],
    remaining: 622,     // Zbývající minuty
    progress: 37        // Procenta
}
```

---

### DebugModule.exportLogs()
**Exportovat logy do souboru**

```javascript
DebugModule.exportLogs();
// Stáhne: debug-log-2025-10-30.txt
```

---

### DebugModule.showDebugPanel()
**Zobrazit debug panel**

```javascript
DebugModule.showDebugPanel();
```

---

### DebugModule.hideDebugPanel()
**Skrýt debug panel**

```javascript
DebugModule.hideDebugPanel();
```

---

### DebugModule.printStats()
**Vytisknout statistiky do console**

```javascript
DebugModule.printStats();
```

**Výstup:**
```
═══════════════════════════════════════
🐛 DEBUG MODULE - STATISTIKY
═══════════════════════════════════════
⏱️ Uptime: 3600s
📊 Celkem logů: 245
❌ Chyby: 0
⚠️ Varování: 2
⚡ FPS: 60 (avg: 59, min: 58, max: 60)
═══════════════════════════════════════
```

---

### DebugModule.getStats()
**Získat statistiky jako objekt**

```javascript
const stats = DebugModule.getStats();

console.log(stats.uptime);       // 3600
console.log(stats.totalLogs);    // 245
console.log(stats.errors);       // 0
console.log(stats.warnings);     // 2
console.log(stats.fps);          // { current, avg, min, max }
```

---

## 💡 TIPY & TRIKY

### 1) Zapnout panel defaultně
```javascript
DebugModule.init({
    enabled: true,
    showPanel: true  // ← Panel hned viditelný
});
```

---

### 2) Auto-export při chybě
```javascript
DebugModule.init({
    enabled: true,
    exportOnError: true  // ← Automaticky stáhne logy při chybě
});
```

---

### 3) Vypnout FPS monitoring
```javascript
DebugModule.init({
    enabled: true,
    fpsMonitoring: false  // ← Bez FPS monitoringu
});
```

---

### 4) Vlastní validace
```javascript
// Validovat rozvrh ručně kdykoliv
if (someCondition) {
    const validation = DebugModule.schedule.validate(schedule);
    if (!validation.valid) {
        alert('Rozvrh má chyby!');
    }
}
```

---

### 5) Logovat vlastní události
```javascript
// Při kliknutí na fullscreen
fullscreenBtn.addEventListener('click', () => {
    DebugModule.log('Fullscreen tlačítko stisknuto', 'INFO');
    toggleFullscreen();
});

// Při změně hodiny
DebugModule.log(`Nová hodina: ${lesson.subject}`, 'SCHEDULE');

// Při chybě
if (!countdownElement) {
    DebugModule.log('Countdown element nenalezen!', 'ERROR');
}
```

---

### 6) Debug pouze v development
```javascript
// Zapnout debug pouze lokálně
const isDevelopment = window.location.hostname === 'localhost';

DebugModule.init({
    enabled: isDevelopment,  // Jen na localhostu
    fpsMonitoring: isDevelopment
});
```

---

### 7) Sledovat memory usage
```javascript
// Custom log pro paměť
setInterval(() => {
    if (performance.memory) {
        const used = Math.round(performance.memory.usedJSHeapSize / 1048576);
        const total = Math.round(performance.memory.totalJSHeapSize / 1048576);
        DebugModule.log(`💾 Memory: ${used}MB / ${total}MB`, 'INFO');
    }
}, 60000); // Každou minutu
```

---

## 🚨 ČASTÉ PROBLÉMY

### "DebugModule is not defined"
**Problém:** Debug modul nebyl načten.  
**Řešení:** Zkontroluj pořadí scriptů v HTML. `debug-module.js` musí být PRVNÍ!

---

### Panel se nezobrazí
**Problém:** Panel je skrytý.  
**Řešení:** Stiskni klávesu **D** nebo volej `DebugModule.showDebugPanel()`

---

### FPS se nezobrazuje
**Problém:** FPS monitoring vypnutý.  
**Řešení:** 
```javascript
DebugModule.init({
    enabled: true,
    fpsMonitoring: true  // ← Zapni
});
```

---

### Logy nejdou exportovat
**Problém:** Prohlížeč blokuje download.  
**Řešení:** Zkontroluj nastavení prohlížeče (povolit stahování).

---

## 🎯 BEST PRACTICES

### 1) Loguj důležité události
```javascript
// ✅ GOOD
DebugModule.log('Rozvrh načten', 'SUCCESS');
DebugModule.log('Hodina změněna: Matematika', 'SCHEDULE');

// ❌ BAD (přehnaně)
DebugModule.log('i++', 'INFO');  // Zbytečné
```

---

### 2) Používej správné kategorie
```javascript
// ✅ GOOD
DebugModule.log('Countdown vypočítán', 'COUNTDOWN');
DebugModule.log('FPS pokles', 'WARNING');
DebugModule.log('Chyba načtení', 'ERROR');

// ❌ BAD
DebugModule.log('Countdown vypočítán', 'ERROR');  // Špatná kategorie
```

---

### 3) Validuj pravidelně
```javascript
// Při startu
DebugModule.schedule.validate(schedule);

// Při změně hodiny
DebugModule.countdown.validate(currentLesson, ...);

// Před exportem dat
const validation = DebugModule.schedule.validate(newSchedule);
if (validation.valid) {
    saveSchedule(newSchedule);
}
```

---

### 4) Vypni v produkci
```javascript
// config.js
const CONFIG = {
    DEBUG_MODE: false,  // ← Vypni v produkci
    FPS_MONITORING: false
};

// script.js
DebugModule.init({
    enabled: CONFIG.DEBUG_MODE,
    fpsMonitoring: CONFIG.FPS_MONITORING
});
```

---

## 📊 UKÁZKOVÝ OUTPUT

```
%c🐛 Debug Module loaded! Call DebugModule.init() to start.
[21:18:14] [SUCCESS] 🚀 Debug Module inicializován
[21:18:14] [INFO] ⚙️ Konfigurace: FPS=true, Validace=true
[21:18:14] [SUCCESS] 🛡️ Error handlers aktivní
[21:18:14] [SUCCESS] ⚡ FPS monitoring spuštěn
[21:18:14] [INFO] ⌨️ Klávesové zkratky: D (panel), Shift+E (export)
[21:18:14] [SUCCESS] 🚀 Aplikace inicializována
[21:18:14] [INFO] 🎯 Režim: VARIANTA B + COUNTDOWN + DEBUG
[21:18:14] [SCHEDULE] 📅 Zahajuji validaci rozvrhu...
[21:18:14] [SCHEDULE] 📊 Celkem hodin v rozvrhu: 36
[21:18:14] [SCHEDULE] 📆 Pondělí: 2 hodin
[21:18:14] [SCHEDULE] 📆 Úterý: 2 hodin
[21:18:14] [SCHEDULE] 📆 Středa: 2 hodin
[21:18:14] [SCHEDULE] 📆 Čtvrtek: 15 hodin
[21:18:14] [SCHEDULE] 📆 Pátek: 14 hodin
[21:18:14] [SCHEDULE] ✅ Žádné duplicity nenalezeny
[21:18:14] [SCHEDULE] 🌙 Cross-day bloky: 5
[21:18:14] [SCHEDULE] ✅ Žádné časové překryvy
[21:18:14] [SUCCESS] ✅ Validace rozvrhu úspěšná!
[21:18:14] [SUCCESS] 📦 DOM elementy načteny
[21:18:14] [SUCCESS] 📅 Rozvrh optimalizován (36 hodin)
[21:18:14] [SUCCESS] ✅ Aplikace spuštěna
[21:18:20] [FPS] ⚡ FPS: 60 | Avg: 59 | Min: 58 | Max: 60
[21:18:25] [SCHEDULE] 📚 Hodina změněna: 🌙 Volno (15:05-07:40)
[21:18:25] [COUNTDOWN] ⏱️ Validuji countdown pro: 🌙 Volno
[21:18:25] [COUNTDOWN] 🌙 Cross-day hodina detekována: 4 → 5
[21:18:25] [COUNTDOWN] ⏱️ Zbývá: 10h 22min (622 minut)
[21:18:25] [COUNTDOWN] 📊 Progress: 37%
[21:18:25] [SUCCESS] ✅ Countdown validace úspěšná
```

---

## 🎉 HOTOVO!

Debug Module je teď plně funkční! 🚀

**Klávesové zkratky:**
- `D` = Debug panel
- `Shift + E` = Export logů

**Happy debugging!** 🐛⚡🔥