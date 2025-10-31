// ============================================
// ⏱️ COUNTDOWN MODULE - OPRAVENÁ VERZE ⏱️
// ============================================
// 🖖 Projekt: Digitální rozvrh - Countdown modul
// 👨‍💻 Autor: Více admirál Jiřík
// 🤖 AI důstojník: Admirál Claude.AI (Anthropic)
// 📅 Datum: Říjen 2025
// 🚀 Feature: Odpočet pro OV, Vyučování, Volno, Víkend
// 🐛 FIX: Opravena cross-day logika (Volno a Víkend)
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
                // ✅ Stále jsme v původním dni (např. Čtvrtek večer)
                const minutesUntilMidnight = 1440 - currentMinutes;
                const minutesFromMidnight = endMinutes;
                remaining = minutesUntilMidnight + minutesFromMidnight;
            } else {
                // ✅ Už jsme v nextDay (např. Pátek ráno)
                remaining = endMinutes - currentMinutes;
            }
        } else {
            // ✅ Normální hodina (stejný den)
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
                // ✅ Stále jsme v původním dni (např. Čtvrtek večer)
                elapsed = currentMinutes - startMinutes;
            } else {
                // ✅ Už jsme v nextDay (např. Pátek ráno)
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
        
        // 🐛 DEBUG LOG (volitelné - můžeš odkomentovat)
        if (typeof DebugModule !== 'undefined' && DebugModule.config.enabled) {
            // Log pouze při cross-day hodinách
            if (isNextDay && currentMinutes % 5 === 0) { // Každých 5 minut
                const days = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'];
                DebugModule.log(
                    `🌙 Cross-day: ${days[lessonDay]} → ${days[lesson.nextDay]} | ` +
                    `Aktuální: ${days[currentDay]} | ` +
                    `Zbývá: ${timeLeft.hours}h ${timeLeft.minutes}min | ` +
                    `Progress: ${percentage}%`,
                    'COUNTDOWN'
                );
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

// Spusť v console pro test:
// CountdownModule.testCrossDay()

CountdownModule.testCrossDay = function() {
    console.log('%c═══════════════════════════════════════', 'color: #00ffff');
    console.log('%c🧪 TEST CROSS-DAY LOGIKY', 'color: #00ffff; font-weight: bold');
    console.log('%c═══════════════════════════════════════', 'color: #00ffff');
    
    const lesson = {
        day: 4,           // Čtvrtek
        nextDay: 5,       // Pátek
        timeFrom: '15:05',
        timeTo: '07:40',
        startMinutes: 905,
        endMinutes: 460,
        subject: '🌙 Volno'
    };
    
    // Test 1: Čtvrtek večer (20:00)
    console.log('');
    console.log('%c📅 SCÉNÁŘ 1: Čtvrtek 20:00', 'color: #ffaa00; font-weight: bold');
    const test1 = this.calculateTimeLeft(1200, 460, true, 4, 4);
    const prog1 = this.calculateProgress(905, 1200, 460, true, 4, 4);
    console.log(`⏱️ Zbývá: ${test1.hours}h ${test1.minutes}min (${test1.totalMinutes} min)`);
    console.log(`📊 Progress: ${prog1}%`);
    console.log(`✅ Správně: Zbývá ~11h 40min (700min), Progress ~29%`);
    
    // Test 2: Pátek ráno (06:00)
    console.log('');
    console.log('%c📅 SCÉNÁŘ 2: Pátek 06:00', 'color: #ffaa00; font-weight: bold');
    const test2 = this.calculateTimeLeft(360, 460, true, 5, 4);
    const prog2 = this.calculateProgress(905, 360, 460, true, 5, 4);
    console.log(`⏱️ Zbývá: ${test2.hours}h ${test2.minutes}min (${test2.totalMinutes} min)`);
    console.log(`📊 Progress: ${prog2}%`);
    console.log(`✅ Správně: Zbývá ~1h 40min (100min), Progress ~86%`);
    
    // Test 3: Pátek 07:30 (skoro konec)
    console.log('');
    console.log('%c📅 SCÉNÁŘ 3: Pátek 07:30', 'color: #ffaa00; font-weight: bold');
    const test3 = this.calculateTimeLeft(450, 460, true, 5, 4);
    const prog3 = this.calculateProgress(905, 450, 460, true, 5, 4);
    console.log(`⏱️ Zbývá: ${test3.hours}h ${test3.minutes}min (${test3.totalMinutes} min)`);
    console.log(`📊 Progress: ${prog3}%`);
    console.log(`✅ Správně: Zbývá ~10min, Progress ~98%`);
    
    console.log('');
    console.log('%c═══════════════════════════════════════', 'color: #00ff00');
    console.log('%c✅ TEST DOKONČEN', 'color: #00ff00; font-weight: bold');
    console.log('%c═══════════════════════════════════════', 'color: #00ff00');
};

// ============================================
// KONEC COUNTDOWN MODULU
// ============================================