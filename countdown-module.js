// ============================================
// ⏱️ COUNTDOWN MODULE - ODPOČET HODIN ⏱️
// ============================================
// 🖖 Projekt: Digitální rozvrh - Countdown modul
// 👨‍💻 Autor: Více admirál Jiřík
// 🤖 AI důstojník: Admirál Claude.AI (Anthropic)
// 📅 Datum: Říjen 2025
// 🚀 Feature: Odpočet pro OV, Vyučování, Volno, Víkend
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
    
    // Výpočet zbývajícího času
    calculateTimeLeft: function(currentMinutes, endMinutes, isNextDay) {
        let remaining;
        
        if (isNextDay) {
            // Cross-day výpočet (přes půlnoc)
            const minutesUntilMidnight = 1440 - currentMinutes; // Do půlnoci
            const minutesFromMidnight = endMinutes; // Od půlnoci do konce
            remaining = minutesUntilMidnight + minutesFromMidnight;
        } else {
            // Normální výpočet (stejný den)
            remaining = endMinutes - currentMinutes;
        }
        
        // Převod na hodiny a minuty
        const hours = Math.floor(remaining / 60);
        const minutes = remaining % 60;
        
        return { hours, minutes, totalMinutes: remaining };
    },
    
    // Výpočet procent
    calculateProgress: function(startMinutes, currentMinutes, endMinutes, isNextDay) {
        let totalDuration, elapsed;
        
        if (isNextDay) {
            // Cross-day výpočet
            totalDuration = (1440 - startMinutes) + endMinutes;
            elapsed = currentMinutes >= startMinutes 
                ? currentMinutes - startMinutes 
                : (1440 - startMinutes) + currentMinutes;
        } else {
            // Normální výpočet
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
    
    // Aktualizace zobrazení
    update: function(lesson, currentMinutes, currentDay) {
        if (!this.elements.box) this.init();
        if (!lesson) {
            this.hide();
            return;
        }
        
        const isNextDay = lesson.nextDay !== undefined;
        
        // Výpočet zbývajícího času
        const timeLeft = this.calculateTimeLeft(
            currentMinutes, 
            lesson.endMinutes, 
            isNextDay
        );
        
        // Výpočet procent
        const percentage = this.calculateProgress(
            lesson.startMinutes,
            currentMinutes,
            lesson.endMinutes,
            isNextDay
        );
        
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
        if (this.elements.startTime) {
            if (isNextDay) {
                const days = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'];
                this.elements.startTime.textContent = `📍 Začátek: ${days[lesson.day]} ${lesson.timeFrom}`;
            } else {
                this.elements.startTime.textContent = `📍 Začátek: ${lesson.timeFrom}`;
            }
        }
        
        if (this.elements.endTime) {
            if (isNextDay) {
                const days = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'];
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
// KONEC COUNTDOWN MODULU
// ============================================