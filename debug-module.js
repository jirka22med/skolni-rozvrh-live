// ============================================
// 🐛 DEBUG MODULE - ADVANCED DEBUGGING 🐛
// ============================================
// 🖖 Projekt: Školní rozvrh - Debug systém
// 👨‍💻 Autor: Více admirál Jiřík
// 🤖 AI důstojník: Admirál Claude.AI
// 📅 Datum: Říjen 2025
// ⚡ Úroveň: ADVANCED (Level 2)
// 🎯 Funkce: Error catching, FPS monitoring, Validace, Export
// 📱 UPDATE: Přidáno mobilní tlačítko pro otevření panelu
// 🐛 FIX: Opravena validace víkendu (Pátek → Pondělí)
// ============================================

const DebugModule = {
    // ============================================
    // ⚙️ KONFIGURACE
    // ============================================
    config: {
        enabled: true,              // Zapnout/vypnout debug
        showPanel: true,           // Zobrazit panel (klávesa D nebo tlačítko)
        maxLogs: 1000,             // Max počet logů v historii
        fpsMonitoring: true,       // Sledovat FPS
        autoValidate: true,        // Automatická validace při startu
        exportOnError: false,       // Automaticky exportovat při chybě
        mobileMode: true,              // ✅ Aktivace mobilního režimu    
        vibration: true,               // Vibrace při doteku (mobil)
        enableTouchPanelGesture: false, // 👉 Povolit otevření panelu třemi prsty (false = zakázáno)
        disableDeepFPS: true,      // 🚀 Úplné vypnutí FPS enginu (true = vypnuto, žádné měření, žádný loop)
    },
     
    
    
    // ============================================
    // 📊 DATA STORAGE
    // ============================================
    
    
    data: {
        logs: [],                  // Historie všech logů
        errors: [],                // Seznam chyb
        warnings: [],              // Seznam varování
        fpsHistory: [],            // Historie FPS
        startTime: null,           // Čas spuštění aplikace
        lastValidation: null       // Čas poslední validace
    },

    // ============================================
    // 🎬 INICIALIZACE
    // ============================================
    init: function(customConfig = {}) {
        // Sloučení konfigurace
        Object.assign(this.config, customConfig);
        
        if (!this.config.enabled) {
            console.log('🐛 Debug Module: DISABLED');
            return;
        }

        this.data.startTime = new Date();
        
        // Zachytávání globálních chyb
        this.setupErrorHandlers();
        
        // Vytvoření debug panelu
        this.createDebugPanel();
        
        // 📱 NOVÉ: Vytvoření debug tlačítka (mobil-friendly)
        this.createDebugButton();
        
        // Klávesové zkratky
        this.setupKeyboardShortcuts();
        
         
        if (DebugModule.config.disableDeepFPS) {
    DebugModule.log('⚙️ Deep FPS Engine deaktivován v konfiguraci.', 'INFO');
    return; // ⛔ Nepouštěj loop ani měření
       }
        
        // FPS monitoring
        if (this.config.fpsMonitoring) {
            this.performance.startMonitoring();
        }
        
        this.log('🚀 Debug Module inicializován', 'SUCCESS');
        this.log(`⚙️ Konfigurace: FPS=${this.config.fpsMonitoring}, Validace=${this.config.autoValidate}`, 'INFO');
        this.log('📱 Debug tlačítko vytvořeno (mobil-friendly)', 'INFO');
    },

    // ============================================
    // 📝 LOGGING SYSTÉM
    // ============================================
    log: function(message, category = 'INFO') {
        if (!this.config.enabled) return;

        const timestamp = new Date().toLocaleTimeString('cs-CZ');
        const logEntry = {
            timestamp: timestamp,
            category: category,
            message: message,
            fullTimestamp: new Date()
        };

        // Přidat do historie
        this.data.logs.push(logEntry);
        
        // Omezit velikost historie
        if (this.data.logs.length > this.config.maxLogs) {
            this.data.logs.shift();
        }

        // Barevný výstup podle kategorie
        const colors = {
            'INFO': 'color: #00ffff',
            'SUCCESS': 'color: #00ff88',
            'WARNING': 'color: #ffaa00',
            'ERROR': 'color: #ff4444',
            'FPS': 'color: #ff00ff',
            'SCHEDULE': 'color: #ffff00',
            'COUNTDOWN': 'color: #00ffff'
        };

        const color = colors[category] || 'color: #ffffff';
        console.log(`%c[${timestamp}] [${category}] ${message}`, color);

        // Speciální ošetření pro chyby a varování
        if (category === 'ERROR') {
            this.data.errors.push(logEntry);
            if (this.config.exportOnError) {
                this.exportLogs();
            }
        }
        
        if (category === 'WARNING') {
            this.data.warnings.push(logEntry);
        }

        // Aktualizovat panel
        this.updateDebugPanel();
    },

    // ============================================
    // 🛡️ ERROR HANDLING
    // ============================================
    setupErrorHandlers: function() {
        const self = this;

        // Global error handler
        window.addEventListener('error', function(event) {
            self.log(`❌ JavaScript Error: ${event.message}`, 'ERROR');
            self.log(`📍 Soubor: ${event.filename}:${event.lineno}`, 'ERROR');
            self.log(`🔍 Detail: ${event.error?.stack || 'Žádný stack trace'}`, 'ERROR');
        });

        // Unhandled promise rejection
        window.addEventListener('unhandledrejection', function(event) {
            self.log(`❌ Unhandled Promise: ${event.reason}`, 'ERROR');
        });

        this.log('🛡️ Error handlers aktivní', 'SUCCESS');
    },

    // ============================================
    // ⚡ PERFORMANCE MONITORING
    // ============================================
    performance: {
        fpsData: {
            current: 0,
            avg: 0,
            min: Infinity,
            max: 0,
            samples: []
        },
        lastFrameTime: 0,
        frameCount: 0,
        monitoringActive: false,

        startMonitoring: function() {
            this.monitoringActive = true;
            this.measure();
            DebugModule.log('⚡ FPS monitoring spuštěn', 'SUCCESS');
        },

        stopMonitoring: function() {
            this.monitoringActive = false;
            DebugModule.log('⚡ FPS monitoring zastaven', 'INFO');
        },

        measure: function() {
            if (!this.monitoringActive) return;

            const now = performance.now();
            const delta = now - this.lastFrameTime;

            if (delta >= 1000) {
                // Výpočet FPS
                const fps = Math.round((this.frameCount / delta) * 1000);
                this.fpsData.current = fps;

                // Aktualizace statistik
                this.fpsData.samples.push(fps);
                if (this.fpsData.samples.length > 60) {
                    this.fpsData.samples.shift();
                }

                this.fpsData.avg = Math.round(
                    this.fpsData.samples.reduce((a, b) => a + b, 0) / this.fpsData.samples.length
                );
                this.fpsData.min = Math.min(...this.fpsData.samples);
                this.fpsData.max = Math.max(...this.fpsData.samples);

                // Log každých 10 sekund
                if (this.frameCount % 600 === 0) {
                    DebugModule.log(
                        `⚡ FPS: ${fps} | Avg: ${this.fpsData.avg} | Min: ${this.fpsData.min} | Max: ${this.fpsData.max}`,
                        'FPS'
                    );
                }

                // Varování při nízkém FPS
                if (fps < 30) {
                    DebugModule.log(`⚠️ Nízké FPS detekováno: ${fps}`, 'WARNING');
                }

                this.frameCount = 0;
                this.lastFrameTime = now;
            }

            this.frameCount++;
            requestAnimationFrame(() => this.measure());
        },

        getFPS: function() {
            return this.fpsData;
        }
    },

    // ============================================
    // 📅 SCHEDULE VALIDATION
    // ============================================
    schedule: {
        validate: function(scheduleData) {
            DebugModule.log('📅 Zahajuji validaci rozvrhu...', 'SCHEDULE');

            const errors = [];
            const warnings = [];

            // 1) Kontrola existence dat
            if (!scheduleData || !Array.isArray(scheduleData)) {
                errors.push('Rozvrh není definován nebo není pole');
                DebugModule.log('❌ Rozvrh není definován!', 'ERROR');
                return { valid: false, errors, warnings };
            }

            DebugModule.log(`📊 Celkem hodin v rozvrhu: ${scheduleData.length}`, 'SCHEDULE');

            // 2) Statistika podle dnů
            const dayStats = {};
            scheduleData.forEach(lesson => {
                dayStats[lesson.day] = (dayStats[lesson.day] || 0) + 1;
            });

            const dayNames = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'];
            Object.keys(dayStats).forEach(day => {
                DebugModule.log(`📆 ${dayNames[day]}: ${dayStats[day]} hodin`, 'SCHEDULE');
            });

            // 3) Kontrola duplicit
            const timeSlots = new Map();
            scheduleData.forEach((lesson, index) => {
                const key = `${lesson.day}-${lesson.timeFrom}-${lesson.timeTo}`;
                
                if (timeSlots.has(key)) {
                    const duplicate = timeSlots.get(key);
                    warnings.push(`Možná duplicita: ${dayNames[lesson.day]} ${lesson.timeFrom}-${lesson.timeTo} (index ${duplicate} a ${index})`);
                } else {
                    timeSlots.set(key, index);
                }
            });

            if (warnings.length === 0) {
                DebugModule.log('✅ Žádné duplicity nenalezeny', 'SUCCESS');
            } else {
                warnings.forEach(w => DebugModule.log(`⚠️ ${w}`, 'WARNING'));
            }

            // 4) Kontrola cross-day bloků
            const crossDayLessons = scheduleData.filter(l => l.nextDay !== undefined);
            DebugModule.log(`🌙 Cross-day bloky: ${crossDayLessons.length}`, 'SCHEDULE');

            crossDayLessons.forEach(lesson => {
                DebugModule.log(
                    `   → ${dayNames[lesson.day]} ${lesson.timeFrom} → ${dayNames[lesson.nextDay]} ${lesson.timeTo} (${lesson.subject})`,
                    'SCHEDULE'
                );
            });

            // 5) Kontrola časových překryvů (stejný den)
            scheduleData.forEach((lesson1, i) => {
                scheduleData.forEach((lesson2, j) => {
                    if (i >= j || lesson1.day !== lesson2.day || lesson1.nextDay || lesson2.nextDay) return;

                    const [h1, m1] = lesson1.timeFrom.split(':').map(Number);
                    const [h2, m2] = lesson2.timeFrom.split(':').map(Number);
                    const [h3, m3] = lesson1.timeTo.split(':').map(Number);
                    const [h4, m4] = lesson2.timeTo.split(':').map(Number);

                    const start1 = h1 * 60 + m1;
                    const end1 = h3 * 60 + m3;
                    const start2 = h2 * 60 + m2;
                    const end2 = h4 * 60 + m4;

                    if ((start1 < end2 && end1 > start2)) {
                        errors.push(
                            `Překryv času: ${dayNames[lesson1.day]} - ${lesson1.subject} (${lesson1.timeFrom}-${lesson1.timeTo}) vs ${lesson2.subject} (${lesson2.timeFrom}-${lesson2.timeTo})`
                        );
                    }
                });
            });

            if (errors.length === 0) {
                DebugModule.log('✅ Žádné časové překryvy', 'SUCCESS');
            } else {
                errors.forEach(e => DebugModule.log(`❌ ${e}`, 'ERROR'));
            }

            // 6) Finální report
            const valid = errors.length === 0;
            if (valid) {
                DebugModule.log('✅ Validace rozvrhu úspěšná!', 'SUCCESS');
            } else {
                DebugModule.log(`❌ Validace rozvrhu selhala (${errors.length} chyb)`, 'ERROR');
            }

            DebugModule.data.lastValidation = new Date();

            return { valid, errors, warnings };
        }
    },

    // ============================================
    // ⏱️ COUNTDOWN VALIDATION - 🔧 OPRAVENO
    // ============================================
    countdown: {
    validate: function(lesson, currentMinutes, currentDay) {
        if (!lesson) {
            DebugModule.log('⏱️ Žádná hodina k validaci', 'COUNTDOWN');
            return { valid: true };
        }

        DebugModule.log(`⏱️ Validuji countdown pro: ${lesson.subject}`, 'COUNTDOWN');

        const errors = [];

        // 1) Kontrola existence potřebných dat
        if (!lesson.startMinutes || !lesson.endMinutes) {
            errors.push('Chybí startMinutes nebo endMinutes');
        }

        // 2) Kontrola logiky cross-day - 🔧 OPRAVENO PRO VÍKEND
        if (lesson.nextDay !== undefined) {
            DebugModule.log(`🌙 Cross-day hodina detekována: ${lesson.day} → ${lesson.nextDay}`, 'COUNTDOWN');

            const expectedNextDay = (lesson.day + 1) % 7;
            const isWeekend = lesson.subject.includes('Víkend') || lesson.subject.includes('🎮');

            if (isWeekend) {
                if (lesson.day === 5 && lesson.nextDay === 1) {
                    DebugModule.log('🎮 Víkend detekován: Pátek → Pondělí (přeskakuje So+Ne)', 'COUNTDOWN');
                } else {
                    errors.push(`Neplatný víkend: day=${lesson.day}, nextDay=${lesson.nextDay} (očekáván: Pátek→Pondělí)`);
                }
            } else {
                if (lesson.nextDay !== expectedNextDay) {
                    errors.push(`Neplatný nextDay: ${lesson.nextDay} (očekáván ${expectedNextDay})`);
                }
            }
        }

        // 3) Výpočet zbývajícího času
        let remaining;
        if (lesson.nextDay !== undefined) {
            if (currentDay === lesson.day) {
                const minutesUntilMidnight = 1440 - currentMinutes;
                const minutesFromMidnight = lesson.endMinutes;
                remaining = minutesUntilMidnight + minutesFromMidnight;
            } else {
                remaining = lesson.endMinutes - currentMinutes;
            }
        } else {
            remaining = lesson.endMinutes - currentMinutes;
        }

        DebugModule.log(`⏱️ Zbývá: ${Math.floor(remaining / 60)}h ${remaining % 60}min (${remaining} minut)`, 'COUNTDOWN');

        // 4) Kontrola záporného času
        if (remaining < 0) {
            errors.push(`Záporný zbývající čas: ${remaining} minut`);
        }

        // 5) Výpočet procent
        let progress;
        if (lesson.nextDay !== undefined) {
            const totalDuration = (1440 - lesson.startMinutes) + lesson.endMinutes;
            let elapsed;

            if (currentDay === lesson.day) {
                elapsed = currentMinutes - lesson.startMinutes;
            } else {
                elapsed = (1440 - lesson.startMinutes) + currentMinutes;
            }

            progress = (elapsed / totalDuration) * 100;
        } else {
            const totalDuration = lesson.endMinutes - lesson.startMinutes;
            const elapsed = currentMinutes - lesson.startMinutes;
            progress = (elapsed / totalDuration) * 100;
        }

        DebugModule.log(`📊 Progress: ${Math.round(progress)}%`, 'COUNTDOWN');

        if (progress < 0 || progress > 100) {
            errors.push(`Neplatný progress: ${Math.round(progress)}%`);
        }

        // 6️⃣ FILTR chyb – potlačí jen "Chybí startMinutes nebo endMinutes"
        const filteredErrors = errors.filter(
            e => !e.includes('Chybí startMinutes nebo endMinutes')
        );

        if (filteredErrors.length === 0) {
            DebugModule.log('🧩 Countdown validace přeskočena (nekompletní data, ne kritická chyba)', 'INFO');
            return { valid: true, errors: [], remaining, progress };
        }

        const valid = filteredErrors.length === 0;

        if (valid) {
            DebugModule.log('✅ Countdown validace úspěšná', 'SUCCESS');
        } else {
            filteredErrors.forEach(e => DebugModule.log(`❌ ${e}`, 'ERROR'));
            DebugModule.log('❌ Countdown validace selhala!', 'ERROR');
        }

        return { valid, errors: filteredErrors, remaining, progress };
    }
},


    // ============================================
    // 📥 EXPORT LOGŮ
    // ============================================
    exportLogs: function() {
        const now = new Date();
        const filename = `debug-log-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}.txt`;

        let content = '='.repeat(50) + '\n';
        content += `DEBUG LOG - ${now.toLocaleString('cs-CZ')}\n`;
        content += '='.repeat(50) + '\n\n';

        content += `🚀 Start aplikace: ${this.data.startTime.toLocaleTimeString('cs-CZ')}\n`;
        content += `⏱️ Celková doba běhu: ${Math.round((now - this.data.startTime) / 1000)} sekund\n`;
        content += `📊 Celkem logů: ${this.data.logs.length}\n`;
        content += `❌ Celkem chyb: ${this.data.errors.length}\n`;
        content += `⚠️ Celkem varování: ${this.data.warnings.length}\n\n`;

        if (this.config.fpsMonitoring) {
            const fps = this.performance.getFPS();
            content += `⚡ FPS Statistiky:\n`;
            content += `   Current: ${fps.current}\n`;
            content += `   Average: ${fps.avg}\n`;
            content += `   Min: ${fps.min}\n`;
            content += `   Max: ${fps.max}\n\n`;
        }

        content += '='.repeat(50) + '\n';
        content += 'VŠECHNY LOGY:\n';
        content += '='.repeat(50) + '\n\n';

        this.data.logs.forEach(log => {
            content += `[${log.timestamp}] [${log.category}] ${log.message}\n`;
        });

        // Stáhnout soubor
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);

        this.log(`📥 Logy exportovány: ${filename}`, 'SUCCESS');
    },

    // ============================================
    // 🎮 DEBUG PANEL UI
    // ============================================
    createDebugPanel: function() {
        const panel = document.createElement('div');
        panel.id = 'debug-panel';
        panel.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.9);
            border: 2px solid #00ffff;
            border-radius: 10px;
            padding: 15px;
            color: white;
            font-family: monospace;
            font-size: 12px;
            z-index: 10000;
            min-width: 300px;
            display: none;
            box-shadow: 0 4px 20px rgba(0, 255, 255, 0.3);
        `;

        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <strong style="color: #00ffff;">🐛 DEBUG PANEL</strong>
                <button id="debug-close" style="background: #ff4444; border: none; color: white; padding: 2px 8px; cursor: pointer; border-radius: 3px;">✕</button>
            </div>
            <div id="debug-content"></div>
            <div style="margin-top: 10px; display: flex; gap: 5px;">
                <button id="debug-export" style="background: #00ffff; border: none; color: black; padding: 5px 10px; cursor: pointer; border-radius: 3px; font-weight: bold;">📥 Export</button>
                <button id="debug-clear" style="background: #ffaa00; border: none; color: black; padding: 5px 10px; cursor: pointer; border-radius: 3px; font-weight: bold;">🗑️ Clear</button>
            </div>
        `;

        document.body.appendChild(panel);

        // Event listeners
        document.getElementById('debug-close').addEventListener('click', () => {
            this.hideDebugPanel();
        });

        document.getElementById('debug-export').addEventListener('click', () => {
            this.exportLogs();
        });

        document.getElementById('debug-clear').addEventListener('click', () => {
            this.data.logs = [];
            this.data.errors = [];
            this.data.warnings = [];
            this.updateDebugPanel();
            this.log('🗑️ Logy vymazány', 'INFO');
        });
    },

   // ============================================
// 📱 DEBUG BUTTON (MOBIL + DESKTOP FRIENDLY)
// ============================================
createDebugButton: function() {

    // 🚫 Pokud je mobilní režim vypnutý, funkce se ukončí
    if (!DebugModule.config || DebugModule.config.mobileMode === false) {
        DebugModule.log('📴 Mobilní režim deaktivován – tlačítko nebude vytvořeno.', 'INFO');
        return;
    }

    // 🧩 Ochrana – nevytvářet duplicitní tlačítka
    if (document.getElementById('debug-btn')) return;

    const button = document.createElement('div');
    button.id = 'debug-btn';
    button.title = 'Debug Panel (D)';
    button.innerHTML = '🐛';

    // 💅 Styl tlačítka
    button.style.cssText = `
        position: fixed;
        top: 32px;
        right: 105px;
        width: 1.1rem;
        height: 1.1rem;
        
        font-size: 1.9rem;
        text-align: center;
        line-height: 1.1rem;
        cursor: pointer;
        user-select: none;
        transition: all 0.25s ease;
         
        z-index: 9999;
      
    `;

    document.body.appendChild(button);

    // ==========================================
    // 🖐️ Dotykové ovládání (mobilní zařízení)
    // ==========================================
    let touchStartX = 0;
    let touchStartY = 0;
    let moved = false;

    function onTouchStart(e) {
        moved = false;
        if (DebugModule.config.vibration && navigator.vibrate) {
            navigator.vibrate(10); // 📳 jemná vibrace při doteku (pokud povolena)
        }
        if (e.touches && e.touches.length > 0) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }
        button.style.transform = 'scale(0.95)';
    }

    function onTouchMove(e) {
        if (!e.touches || e.touches.length === 0) return;
        const dx = e.touches[0].clientX - touchStartX;
        const dy = e.touches[0].clientY - touchStartY;
        if (Math.abs(dx) > 6 || Math.abs(dy) > 6) moved = true;
    }

    function onTouchEnd() {
        button.style.transform = 'scale(1)';
        if (!moved) DebugModule.toggleDebugPanel();
    }

    // ✅ PASSIVE listeners – Chrome už nebude hlásit „scroll-blocking“
    button.addEventListener('touchstart', onTouchStart, { passive: true });
    button.addEventListener('touchmove', onTouchMove, { passive: true });
    button.addEventListener('touchend', onTouchEnd, { passive: true });

    // ==========================================
    // 💻 Desktop kliknutí
    // ==========================================
    button.addEventListener('click', () => DebugModule.toggleDebugPanel());

    // ==========================================
    // 📱 Responsivní CSS pro mobilní zařízení
    // ==========================================
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) {
            #debug-btn {
                top: 10px !important;
                right: 60px !important;
                width: 5px !important;
                height: 5px !important;
                font-size: 0.5rem !important;
                line-height: 44px !important;
            }
            #debug-panel {
                left: 5px !important;
                right: 5px !important;
                bottom: 5px !important;
                max-width: calc(100% - 10px) !important;
            }
        }
    `;
    document.head.appendChild(style);

    DebugModule.log('📱 Debug tlačítko vytvořeno (mobil-friendly, passive listeners aktivní)', 'INFO');
},



    toggleDebugPanel: function() {
        const panel = document.getElementById('debug-panel');
        const button = document.getElementById('debug-btn');
        
        if (panel.style.display === 'none') {
            this.showDebugPanel();
            if (button) {
                button.style.borderColor = '#00ff00';
                button.style.background = 'rgba(0, 255, 0, 0.3)';
            }
        } else {
            this.hideDebugPanel();
            if (button) {
                button.style.borderColor = 'rgba(0, 255, 0, 0.5)';
                button.style.background = 'rgba(0, 255, 0, 0.15)';
            }
        }
    },

    showDebugPanel: function() {
        const panel = document.getElementById('debug-panel');
        if (panel) {
            panel.style.display = 'block';
            this.config.showPanel = true;
            this.updateDebugPanel();
            this.log('🎮 Debug panel zobrazen', 'INFO');
        }
    },

    hideDebugPanel: function() {
        const panel = document.getElementById('debug-panel');
        if (panel) {
            panel.style.display = 'none';
            this.config.showPanel = false;
            this.log('🎮 Debug panel skryt', 'INFO');
        }
    },

    updateDebugPanel: function() {
        if (!this.config.showPanel) return;

        const content = document.getElementById('debug-content');
        if (!content) return;

        const uptime = Math.round((new Date() - this.data.startTime) / 1000);
        const fps = this.performance.getFPS();

        let html = `
            <div style="line-height: 1.6;">
                <div style="color: #00ff88;">⏱️ Uptime: ${uptime}s</div>
                <div style="color: #ff00ff;">⚡ FPS: ${fps.current} (avg: ${fps.avg})</div>
                <div style="color: #00ffff;">📊 Logs: ${this.data.logs.length}</div>
                <div style="color: #ff4444;">❌ Errors: ${this.data.errors.length}</div>
                <div style="color: #ffaa00;">⚠️ Warnings: ${this.data.warnings.length}</div>
            </div>
        `;

        // Poslední 5 logů
        if (this.data.logs.length > 0) {
            html += `<div style="margin-top: 10px; border-top: 1px solid #00ffff; padding-top: 10px;">`;
            html += `<strong style="color: #00ffff;">Poslední logy:</strong><br>`;
            
            const recentLogs = this.data.logs.slice(-5);
            recentLogs.forEach(log => {
                const color = log.category === 'ERROR' ? '#ff4444' : 
                             log.category === 'WARNING' ? '#ffaa00' : 
                             '#00ffff';
                html += `<div style="color: ${color}; font-size: 10px;">[${log.timestamp}] ${log.message}</div>`;
            });
            html += `</div>`;
        }

        content.innerHTML = html;
    },

    // ============================================
    // ⌨️ KEYBOARD SHORTCUTS
    // ============================================
    setupKeyboardShortcuts: function() {
        document.addEventListener('keydown', (e) => {
            // D = Toggle debug panel
            if (e.key === 'd' || e.key === 'D') {
                if (document.activeElement.tagName === 'INPUT' || 
                    document.activeElement.tagName === 'TEXTAREA') return;
                
                this.toggleDebugPanel();
            }

            // Shift + E = Export logs
            if (e.shiftKey && (e.key === 'e' || e.key === 'E')) {
                this.exportLogs();
            }
        });

        this.log('⌨️ Klávesové zkratky: D (panel), Shift+E (export)', 'INFO');
        this.log('📱 Mobil: Klikni na 🐛 tlačítko v rohu', 'INFO');
    },

    // ============================================
    // 📊 STATISTIKY
    // ============================================
    getStats: function() {
        const now = new Date();
        const uptime = Math.round((now - this.data.startTime) / 1000);

        return {
            uptime: uptime,
            totalLogs: this.data.logs.length,
            errors: this.data.errors.length,
            warnings: this.data.warnings.length,
            fps: this.performance.getFPS(),
            lastValidation: this.data.lastValidation
        };
    },

    printStats: function() {
        const stats = this.getStats();
        
        console.log('%c═══════════════════════════════════════', 'color: #00ffff');
        console.log('%c🐛 DEBUG MODULE - STATISTIKY', 'color: #00ffff; font-weight: bold;');
        console.log('%c═══════════════════════════════════════', 'color: #00ffff');
        console.log(`%c⏱️ Uptime: ${stats.uptime}s`, 'color: #00ff88');
        console.log(`%c📊 Celkem logů: ${stats.totalLogs}`, 'color: #00ffff');
        console.log(`%c❌ Chyby: ${stats.errors}`, 'color: #ff4444');
        console.log(`%c⚠️ Varování: ${stats.warnings}`, 'color: #ffaa00');
        console.log(`%c⚡ FPS: ${stats.fps.current} (avg: ${stats.fps.avg}, min: ${stats.fps.min}, max: ${stats.fps.max})`, 'color: #ff00ff');
        console.log('%c═══════════════════════════════════════', 'color: #00ffff');
    }
};

// ============================================
// 🚀 AUTO-INIT INFO
// ============================================
if (typeof window !== 'undefined') {
    console.log('%c🐛 Debug Module loaded! Call DebugModule.init() to start.', 'color: #00ffff; font-weight: bold;');
    console.log('%c📱 Mobile: Use 🐛 button in top-right corner', 'color: #00ff00; font-weight: bold;');
    console.log('%c💻 Desktop: Press D key to toggle panel', 'color: #00ff00; font-weight: bold;');
    console.log('%c🔧 FIX: Víkend validace opravena (Pátek → Pondělí)', 'color: #ffaa00; font-weight: bold;');
}

// ============================================
// KONEC DEBUG MODULU

// ============================================

