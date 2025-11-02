// ============================================
// ⏱️ COUNTDOWN MODULE - OPRAVENO PRO VÍKEND ⏱️
// ============================================
// 🖖 Projekt: Digitální rozvrh - Countdown modul
// 👨‍💻 Autor: Více admirál Jiřík
// 🤖 AI důstojník: Admirál Claude.AI (Anthropic)
// 📅 Datum: Říjen 2025
// 🚀 Feature: Odpočet pro OV, Vyučování, Volno, Víkend
// 🐛 FIX: Opravena logika pro Sobotu a Neděli
// ============================================

const CountdownModule = {
    
    // Cache pro DOM elementy
    elements: {
        box: null,
        timeDisplay: null,
        progressBar: null,
        startTime: null,
        endTime: null
    },
    
    // Inicializace modulu
    init: function() {
        this.elements.box = document.getElementById('countdownBox');
        if (!this.elements.box) return;
        
        this.elements.timeDisplay = this.elements.box.querySelector('.countdown-time');
        this.elements.progressBar = this.elements.box.querySelector('.progress-fill');
        this.elements.startTime = this.elements.box.querySelector('.start-time');
        this.elements.endTime = this.elements.box.querySelector('.end-time');
    },
    
    // ============================================
    // 🔧 OPRAVENÁ FUNKCE - VÝPOČET ČASU
    // ============================================
    calculateTimeLeft: function(currentMinutes, endMinutes, isNextDay, currentDay, lessonDay) {
        let remaining;
        
        if (isNextDay) {
            // 🔍 KONTROLA: Jsme ještě v původním dni nebo už v nextDay?
            if (currentDay === lessonDay) {
                // ✅ Stále jsme v původním dni (např. Pátek večer, Neděle ráno)
                const minutesUntilMidnight = 1440 - currentMinutes;
                const minutesFromMidnight = endMinutes;
                remaining = minutesUntilMidnight + minutesFromMidnight;
            } else {
                // ✅ Už jsme v nextDay (např. Pondělí ráno po víkendu)
                remaining = endMinutes - currentMinutes;
            }
        } else {
            // ✅ Normální hodina (stejný den) - Sobota celý den
            remaining = endMinutes - currentMinutes;
        }
        
        // Převod na hodiny a minuty
        const hours = Math.floor(remaining / 60);
        const minutes = remaining % 60;
        
        return { hours, minutes, totalMinutes: remaining };
    },
    
    // ============================================
    // 🔧 OPRAVENÁ FUNKCE - VÝPOČET PROCENT
    // ============================================
    calculateProgress: function(startMinutes, currentMinutes, endMinutes, isNextDay, currentDay, lessonDay) {
        let totalDuration, elapsed;
        
        if (isNextDay) {
            // Celková doba trvání (přes půlnoc)
            totalDuration = (1440 - startMinutes) + endMinutes;
            
            // 🔍 KONTROLA: Jsme ještě v původním dni nebo už v nextDay?
            if (currentDay === lessonDay) {
                // ✅ Stále jsme v původním dni
                elapsed = currentMinutes - startMinutes;
            } else {
                // ✅ Už jsme v nextDay
                elapsed = (1440 - startMinutes) + currentMinutes;
            }
        } else {
            // ✅ Normální hodina (stejný den)
            totalDuration = endMinutes - startMinutes;
            elapsed = currentMinutes - startMinutes;
        }
        
        const percentage = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
        return Math.round(percentage);
    },
    
    // Barva podle procent (zelená → žlutá → červená)
    getProgressColor: function(percentage) {
        if (percentage < 50) {
            // Zelená → Žlutá (0-50%)
            const green = 255;
            const red = Math.round((percentage / 50) * 255);
            return `rgb(${red}, ${green}, 100)`;
        } else {
            // Žlutá → Červená (50-100%)
            const red = 255;
            const green = Math.round(255 - ((percentage - 50) / 50) * 155);
            return `rgb(${red}, ${green}, 100)`;
        }
    },
    
    // Formátování času pro zobrazení
    formatTime: function(hours, minutes) {
        if (hours > 0) {
            return `${hours}h ${minutes}min`;
        } else {
            return `${minutes}min`;
        }
    },
    
    // ============================================
    // 🔧 OPRAVENÁ FUNKCE - HLAVNÍ UPDATE
    // ============================================
    update: function(lesson, currentMinutes, currentDay) {
        if (!this.elements.box) this.init();
        if (!lesson) {
            this.hide();
            return;
        }
        
        // 🔧 KONTROLA: Máme startMinutes a endMinutes?
        if (!lesson.startMinutes && lesson.startMinutes !== 0) {
            console.warn('⚠️ Countdown: Chybí startMinutes!', lesson);
            this.hide();
            return;
        }
        
        if (!lesson.endMinutes && lesson.endMinutes !== 0) {
            console.warn('⚠️ Countdown: Chybí endMinutes!', lesson);
            this.hide();
            return;
        }
        
        const isNextDay = lesson.nextDay !== undefined;
        const lessonDay = lesson.day;
        
        // 🔧 OPRAVENÝ VÝPOČET - Předáváme currentDay a lessonDay!
        const timeLeft = this.calculateTimeLeft(
            currentMinutes, 
            lesson.endMinutes, 
            isNextDay,
            currentDay,
            lessonDay
        );
        
        // 🔧 OPRAVENÝ VÝPOČET - Předáváme currentDay a lessonDay!
        const percentage = this.calculateProgress(
            lesson.startMinutes,
            currentMinutes,
            lesson.endMinutes,
            isNextDay,
            currentDay,
            lessonDay
        );
        
        // 🐛 DEBUG LOG (volitelné)
        if (typeof DebugModule !== 'undefined' && DebugModule.config.enabled) {
            // Log pouze každých 5 minut
            if (currentMinutes % 5 === 0) {
                const days = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'];
                if (isNextDay) {
                    DebugModule.log(
                        `🌙 Cross-day: ${days[lessonDay]} → ${days[lesson.nextDay]} | ` +
                        `Aktuální: ${days[currentDay]} | ` +
                        `Zbývá: ${timeLeft.hours}h ${timeLeft.minutes}min | ` +
                        `Progress: ${percentage}%`,
                        'COUNTDOWN'
                    );
                }
            }
        }
        
        // Barva progress baru
        const color = this.getProgressColor(percentage);
        
        // Aktualizace DOM
        if (this.elements.timeDisplay) {
            this.elements.timeDisplay.textContent = this.formatTime(
                timeLeft.hours, 
                timeLeft.minutes
            );
        }
        
        if (this.elements.progressBar) {
            this.elements.progressBar.style.width = `${percentage}%`;
            this.elements.progressBar.style.backgroundColor = color;
        }
        
        // Zobrazení času začátku/konce
        const days = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'];
        
        if (this.elements.startTime) {
            if (isNextDay) {
                this.elements.startTime.textContent = `📍 Začátek: ${days[lesson.day]} ${lesson.timeFrom}`;
            } else {
                this.elements.startTime.textContent = `📍 Začátek: ${lesson.timeFrom}`;
            }
        }
        
        if (this.elements.endTime) {
            if (isNextDay) {
                this.elements.endTime.textContent = `🏁 Konec: ${days[lesson.nextDay]} ${lesson.timeTo}`;
            } else {
                this.elements.endTime.textContent = `🏁 Konec: ${lesson.timeTo}`;
            }
        }
        
        // Zobrazit kontejner
        this.show();
    },
    
    // Zobrazit kontejner
    show: function() {
        if (this.elements.box) {
            this.elements.box.style.display = 'block';
        }
    },
    
    // Skrýt kontejner
    hide: function() {
        if (this.elements.box) {
            this.elements.box.style.display = 'none';
        }
    }
};

// ============================================
// 📊 TESTOVACÍ FUNKCE (VOLITELNÉ)
// ============================================

CountdownModule.testWeekend = function() {
    console.log('%c═══════════════════════════════════════', 'color: #00ffff');
    console.log('%c🧪 TEST VÍKENDOVÉ LOGIKY', 'color: #00ffff; font-weight: bold');
    console.log('%c═══════════════════════════════════════', 'color: #00ffff');
    
    // Test 1: Pátek večer
    console.log('');
    console.log('%c📅 SCÉNÁŘ 1: Pátek 18:00 (Víkend začíná)', 'color: #ffaa00; font-weight: bold');
    const test1 = this.calculateTimeLeft(1080, 1439, false, 5, 5); // 18:00, konec 23:59
    const prog1 = this.calculateProgress(730, 1080, 1439, false, 5, 5); // začátek 12:10
    console.log(`⏱️ Zbývá: ${test1.hours}h ${test1.minutes}min`);
    console.log(`📊 Progress: ${prog1}%`);
    
    // Test 2: Sobota odpoledne
    console.log('');
    console.log('%c📅 SCÉNÁŘ 2: Sobota 14:00 (celý den)', 'color: #ffaa00; font-weight: bold');
    const test2 = this.calculateTimeLeft(840, 1439, false, 6, 6); // 14:00, konec 23:59
    const prog2 = this.calculateProgress(0, 840, 1439, false, 6, 6); // začátek 00:00
    console.log(`⏱️ Zbývá: ${test2.hours}h ${test2.minutes}min`);
    console.log(`📊 Progress: ${prog2}%`);
    
    // Test 3: Neděle ráno (cross-day do Pondělí)
    console.log('');
    console.log('%c📅 SCÉNÁŘ 3: Neděle 06:00 (pokračuje do Pondělí 08:00)', 'color: #ffaa00; font-weight: bold');
    const test3 = this.calculateTimeLeft(360, 480, true, 0, 0); // 06:00, konec 08:00 Po
    const prog3 = this.calculateProgress(0, 360, 480, true, 0, 0); // začátek 00:00
    console.log(`⏱️ Zbývá: ${test3.hours}h ${test3.minutes}min`);
    console.log(`📊 Progress: ${prog3}%`);
    
    // Test 4: Pondělí 07:00 (ještě Neděle běží)
    console.log('');
    console.log('%c📅 SCÉNÁŘ 4: Pondělí 07:00 (Neděle stále běží)', 'color: #ffaa00; font-weight: bold');
    const test4 = this.calculateTimeLeft(420, 480, true, 1, 0); // 07:00 Po, konec 08:00 Po
    const prog4 = this.calculateProgress(0, 420, 480, true, 1, 0); // začátek 00:00 Ne
    console.log(`⏱️ Zbývá: ${test4.hours}h ${test4.minutes}min`);
    console.log(`📊 Progress: ${prog4}%`);
    
    console.log('');
    console.log('%c═══════════════════════════════════════', 'color: #00ff00');
    console.log('%c✅ TEST DOKONČEN', 'color: #00ff00; font-weight: bold');
    console.log('%c═══════════════════════════════════════', 'color: #00ff00');
};

// ============================================
// KONEC COUNTDOWN MODULU
// ============================================