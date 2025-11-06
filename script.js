// ============================================
// 🎓 ŠKOLNÍ ROZVRH - DIGITÁLNÍ HODINY 🎓
// ============================================
// 🖖 Projekt: Digitální rozvrh s reálným časem
// 👨‍💻 Autor: Více admirál Jiřík
// 🤖 AI důstojník: Admirál Claude.AI (Anthropic)
// 📅 Datum: Říjen 2025
// ⚡ Verze: VARIANTA B + COUNTDOWN + DEBUG + ATOMIC TIME
// 🚀 Feature: World Time API + Drift Compensation + Fallback
// 
// "Přesnost je klíč k úspěšné misi!"
// ============================================

// ============================================
// ⏰ ATOMIC TIME MODULE - WORLD TIME API
// ============================================

const AtomicTime = {
    apiUrl: 'https://timeapi.io/api/Time/current/zone?timeZone=Europe/Prague',
    offset: 0,              // Rozdíl mezi API časem a lokálním
    lastSync: null,         // Poslední synchronizace
    syncInterval: 1800000,  // Re-sync každých 30 minut
    useFallback: false,     // Použít fallback (lokální čas)
    
    // Inicializace - stáhne čas z API
    async init() {
        if (DebugModule && DebugModule.config.enabled) {
            DebugModule.log('⏰ Inicializace Atomic Time...', 'INFO');
        }
        
        await this.sync();
        
        // Automatická re-synchronizace každých 30 minut
        setInterval(() => this.sync(), this.syncInterval);
    },
    
    // Synchronizace s World Time API
    async sync() {
        try {
            const response = await fetch(this.apiUrl);
            if (!response.ok) throw new Error('API request failed');
            
            const data = await response.json();
            const apiTime = new Date(data.dateTime);
            const localTime = new Date();
            
            // Vypočítej offset mezi API a lokálním časem
            this.offset = apiTime.getTime() - localTime.getTime();
            this.lastSync = Date.now();
            this.useFallback = false;
            
            if (DebugModule && DebugModule.config.enabled) {
                DebugModule.log(`✅ Atomic Time synced via TimeAPI.io | Offset: ${this.offset}ms`, 'SUCCESS');

            }
            
            return true;
        } catch (error) {
            this.useFallback = true;
            
            if (DebugModule && DebugModule.config.enabled) {
                DebugModule.log('⚠️ API sync failed - using local time', 'WARNING');
            }
            if (!this.useFallback) {
    try {
        const response = await fetch(fallbackUrl);
        const data = await response.json();
        const apiTime = new Date(data.datetime || data.dateTime);
        const localTime = new Date();
        this.offset = apiTime.getTime() - localTime.getTime();
        this.lastSync = Date.now();
        this.useFallback = false;
        DebugModule.log('✅ Fallback API (timeapi.world) úspěšně použito', 'SUCCESS');
        return true;
    } catch {}
}

            return false;
        }
    },
    
    // Získej přesný čas (s offsetem)
    now() {
        if (this.useFallback) {
            return new Date();
        }
        
        const localTime = Date.now();
        const adjustedTime = localTime + this.offset;
        return new Date(adjustedTime);
    },
    
    // Info o stavu synchronizace
    getStatus() {
        return {
            synced: !this.useFallback,
            offset: this.offset,
            lastSync: this.lastSync,
            timeSinceSync: this.lastSync ? Date.now() - this.lastSync : null
        };
    }
};

// ============================================
// 🛠 DEBUG MODULE - INICIALIZACE
// ============================================
if (typeof DebugModule !== 'undefined') {
    DebugModule.init({
        enabled: true,
        showPanel: false,
        maxLogs: 1000,
        fpsMonitoring: true,
        autoValidate: true,
        exportOnError: false,
        mobileMode: true,
        vibration: true,
        enableTouchPanelGesture: false,
        disableDeepFPS: true,
    });

    DebugModule.log('🚀 Aplikace inicializována', 'SUCCESS');
    DebugModule.log('🎯 Režim: ATOMIC TIME + COUNTDOWN + DEBUG', 'INFO');

    if (typeof schedule !== 'undefined') {
        const validation = DebugModule.schedule.validate(schedule);
        if (!validation.valid) {
            DebugModule.log('❌ Rozvrh obsahuje chyby!', 'ERROR');
        }
    } else {
        DebugModule.log('⚠️ Rozvrh nebyl nalezen!', 'WARNING');
    }
} else {
    console.warn('⚠️ Debug Module není načten!');
}

// ============================================
// HLAVNÍ KÓD APLIKACE
// ============================================

const days = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'];

// Cache systém
let cache = {
    timeString: '',
    dateString: '',
    lessonSubject: null,
    currentDay: -1,
    currentMinute: -1
};

// DOM elementy
const elements = {
    time: document.getElementById('time'),
    date: document.getElementById('date'),
    lessonBox: document.getElementById('lessonBox')
};

if (DebugModule && DebugModule.config.enabled) {
    DebugModule.log('📦 DOM elementy načteny', 'SUCCESS');
}

// Předpočítání rozvrhu
const scheduleOptimized = schedule.map(lesson => {
    const [startHour, startMin] = lesson.timeFrom.split(':').map(Number);
    const [endHour, endMin] = lesson.timeTo.split(':').map(Number);
    return {
        ...lesson,
        startMinutes: startHour * 60 + startMin,
        endMinutes: endHour * 60 + endMin
    };
});

if (DebugModule && DebugModule.config.enabled) {
    DebugModule.log(`📅 Rozvrh optimalizován (${scheduleOptimized.length} hodin)`, 'SUCCESS');
}

// Seskupení podle dnů
const scheduleByDay = {};
scheduleOptimized.forEach(lesson => {
    if (!scheduleByDay[lesson.day]) {
        scheduleByDay[lesson.day] = [];
    }
    scheduleByDay[lesson.day].push(lesson);
});

// ============================================
// ⚡ PŘESNÝ ČASOVÝ UPDATE - BEZ DRIFTU
// ============================================

let updateIntervalId = null;
let lastSecond = -1;

// Optimalizovaná aktualizace času
function updateTime() {
    // Použij Atomic Time místo Date()
    const now = AtomicTime.now();
    
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    const timeString = `${hours}:${minutes}:${seconds}`;
    
    // Aktualizuj čas pouze když se změní sekundy
    const currentSecond = now.getSeconds();
    if (currentSecond !== lastSecond) {
        elements.time.textContent = timeString;
        cache.timeString = timeString;
        lastSecond = currentSecond;
    }
    
    // Aktualizuj datum pouze když se změní den
    const currentDay = now.getDay();
    if (currentDay !== cache.currentDay) {
        const dayName = days[currentDay];
        const date = now.getDate();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        const dateString = `${dayName}, ${date}.${month}.${year}`;
        
        elements.date.textContent = dateString;
        cache.dateString = dateString;
        cache.currentDay = currentDay;

        if (DebugModule && DebugModule.config.enabled) {
            DebugModule.log(`📅 Den změněn: ${dayName}`, 'INFO');
        }
    }
    
    // Aktualizuj hodinu pouze když se změní minuta
    const currentMinute = now.getHours() * 60 + now.getMinutes();
    if (currentMinute !== cache.currentMinute || cache.lessonSubject === null) {
        updateCurrentLesson(now, currentDay, currentMinute);
        cache.currentMinute = currentMinute;
    }
}

// Přesný interval - kompenzuje execution time
function startPreciseInterval() {
    function tick() {
        const start = Date.now();
        updateTime();
        const executionTime = Date.now() - start;
        
        // Naplánuj další tick přesně na začátek další sekundy
        const delay = 1000 - (Date.now() % 1000) - executionTime;
        updateIntervalId = setTimeout(tick, Math.max(0, delay));
    }
    
    tick();
}

// Debounced DOM update pro hodinu
let lessonUpdateTimeout = null;

function updateCurrentLesson(now, currentDay, currentTime) {
    const todayLessons = scheduleByDay[currentDay] || [];
    
    let currentLesson = null;
    
    // 1) Hledání běžných hodin v aktuálním dni
    for (let i = 0; i < todayLessons.length; i++) {
        const lesson = todayLessons[i];
        
        // CROSS-DAY LOGIKA
        if (lesson.nextDay) {
            if (currentDay === lesson.day && currentTime >= lesson.startMinutes) {
                currentLesson = lesson;
                break;
            } else if (currentDay === lesson.nextDay && currentTime < lesson.endMinutes) {
                currentLesson = lesson;
                break;
            }
        } else {
            // Normální hodina
            if (currentTime >= lesson.startMinutes && currentTime < lesson.endMinutes) {
                currentLesson = lesson;
                break;
            }
        }
    }
    
    // 2) Pokud jsme nic nenašli, zkontroluj předchozí den (cross-day)
    if (!currentLesson) {
        const previousDay = currentDay === 0 ? 6 : currentDay - 1;
        const yesterdayLessons = scheduleByDay[previousDay] || [];
        
        for (let i = 0; i < yesterdayLessons.length; i++) {
            const lesson = yesterdayLessons[i];
            
            if (lesson.nextDay === currentDay && currentTime < lesson.endMinutes) {
                currentLesson = lesson;
                break;
            }
        }
    }
    
    const newLessonSubject = currentLesson ? currentLesson.subject : null;
    
    // Překresli pouze když se hodina změnila
    if (newLessonSubject !== cache.lessonSubject) {
        clearTimeout(lessonUpdateTimeout);
        lessonUpdateTimeout = setTimeout(() => {
            updateLessonDisplay(currentLesson);
            updateCountdown(currentLesson, currentTime, currentDay);
            
            if (DebugModule && DebugModule.config.enabled) {
                if (currentLesson) {
                    DebugModule.log(`📚 Hodina změněna: ${currentLesson.subject} (${currentLesson.timeFrom}-${currentLesson.timeTo})`, 'SCHEDULE');
                    
                    const validation = DebugModule.countdown.validate(currentLesson, currentTime, currentDay);
                    if (!validation.valid) {
                        DebugModule.log('❌ Countdown validace selhala!', 'ERROR');
                    }
                } else {
                    DebugModule.log('📅 Žádná hodina', 'SCHEDULE');
                }
            }
            
            cache.lessonSubject = newLessonSubject;
        }, 50);
    } else {
        updateCountdown(currentLesson, currentTime, currentDay);
    }
}

// Separovaná funkce pro aktualizaci displeje
function updateLessonDisplay(lesson) {
    const box = elements.lessonBox;
    
    if (lesson) {
        box.style.borderColor = lesson.color;
        
        let timeDisplay = `${lesson.timeFrom} - ${lesson.timeTo}`;
        if (lesson.nextDay) {
            const dayFrom = days[lesson.day];
            const dayTo = days[lesson.nextDay];
            timeDisplay = `${dayFrom} ${lesson.timeFrom} → ${dayTo} ${lesson.timeTo}`;
        }
        
        box.innerHTML = `
            <div class="lesson-name" style="color: ${lesson.color}">${lesson.subject}</div>
            <div class="lesson-time">${timeDisplay}</div>
        `;
    } else {
        box.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        box.innerHTML = '<div class="no-lesson">📅 Žádná hodina</div>';
    }
}

// ⚡ NOVÁ FUNKCE - AKTUALIZACE COUNTDOWN ⚡
function updateCountdown(lesson, currentMinutes, currentDay) {
    if (typeof CountdownModule !== 'undefined') {
        CountdownModule.update(lesson, currentMinutes, currentDay);
    }
}

// Detekce viditelnosti stránky
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (updateIntervalId) {
            clearTimeout(updateIntervalId);
            updateIntervalId = null;
        }

        if (DebugModule && DebugModule.config.enabled) {
            DebugModule.log('😴 Stránka skryta - timer pozastaven', 'INFO');
        }
    } else {
        if (!updateIntervalId) {
            startPreciseInterval();
        }
        cache.currentMinute = -1;

        if (DebugModule && DebugModule.config.enabled) {
            DebugModule.log('👁️ Stránka aktivní - timer obnoven', 'INFO');
        }
    }
});

// Cleanup při zavření stránky
window.addEventListener('beforeunload', () => {
    if (updateIntervalId) {
        clearTimeout(updateIntervalId);
    }
    clearTimeout(lessonUpdateTimeout);

    if (DebugModule && DebugModule.config.enabled) {
        DebugModule.log('👋 Aplikace ukončena', 'INFO');
        DebugModule.printStats();
    }
});

// ============================================
// 🚀 INICIALIZACE - ASYNC START
// ============================================

async function init() {
    // 1) Inicializuj Atomic Time
    await AtomicTime.init();
    
    // 2) Spusť časový update
    updateTime();
    startPreciseInterval();
    
    if (DebugModule && DebugModule.config.enabled) {
        DebugModule.log('✅ Aplikace spuštěna s Atomic Time', 'SUCCESS');
        
        // Info o sync stavu
        const status = AtomicTime.getStatus();
        if (status.synced) {
            DebugModule.log(`⏰ Time synced | Offset: ${status.offset}ms`, 'SUCCESS');
        } else {
            DebugModule.log('⚠️ Using fallback local time', 'WARNING');
        }
    }
}

// Spuštění aplikace
init();

// Performance monitoring
let frameCount = 0;
let lastFpsUpdate = Date.now();

function monitorPerformance() {
    frameCount++;
    const now = Date.now();
    if (now - lastFpsUpdate > 5000) {
        const fps = Math.round((frameCount / 5) * 10) / 10;
        
        const status = AtomicTime.getStatus();
        const syncStatus = status.synced ? '✅ SYNCED' : '⚠️ LOCAL';
        
        document.getElementById('perfMode').textContent = `⚡ ATOMIC TIME ${syncStatus} | ${fps} FPS`;
        
        frameCount = 0;
        lastFpsUpdate = now;
    }
    requestAnimationFrame(monitorPerformance);
}

monitorPerformance();

// ============================================
// 🖥️ FULLSCREEN FUNCTIONALITY
// ============================================

const fullscreenBtn = document.getElementById('fullscreenBtn');

function toggleFullscreen() {
    if (!document.fullscreenElement && 
        !document.webkitFullscreenElement && 
        !document.mozFullScreenElement) {
        enterFullscreen();
    } else {
        exitFullscreen();
    }
}

function enterFullscreen() {
    const elem = document.documentElement;
    
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    }

    if (DebugModule && DebugModule.config.enabled) {
        DebugModule.log('🖥️ Fullscreen aktivován', 'INFO');
    }
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }

    if (DebugModule && DebugModule.config.enabled) {
        DebugModule.log('🖥️ Fullscreen ukončen', 'INFO');
    }
}

if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', toggleFullscreen);
}

document.addEventListener('fullscreenchange', updateFullscreenButton);
document.addEventListener('webkitfullscreenchange', updateFullscreenButton);
document.addEventListener('mozfullscreenchange', updateFullscreenButton);
document.addEventListener('MSFullscreenChange', updateFullscreenButton);

function updateFullscreenButton() {
    const isFullscreen = !!(document.fullscreenElement || 
                           document.webkitFullscreenElement || 
                           document.mozFullScreenElement);
    
    if (isFullscreen) {
        document.body.classList.add('fullscreen-active');
        fullscreenBtn.title = 'Ukončit celou obrazovku (ESC)';
    } else {
        document.body.classList.remove('fullscreen-active');
        fullscreenBtn.title = 'Celá obrazovka';
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
    }
    if (e.key === 'f' || e.key === 'F') {
        if (document.activeElement.tagName !== 'INPUT' && 
            document.activeElement.tagName !== 'TEXTAREA') {
            toggleFullscreen();
        }
    }
});

// ============================================
// 🛠 DEBUG - TISK STATISTIK PO 60 SEKUNDÁCH
// ============================================
if (DebugModule && DebugModule.config.enabled) {
    setTimeout(() => {
        DebugModule.printStats();
        
        // Přidej info o Atomic Time
        const status = AtomicTime.getStatus();
        console.log('⏰ ATOMIC TIME STATUS:', {
            synced: status.synced,
            offset: status.offset + 'ms',
            lastSync: status.lastSync ? new Date(status.lastSync).toLocaleTimeString() : 'Never',
            timeSinceSync: status.timeSinceSync ? Math.round(status.timeSinceSync / 1000) + 's' : 'N/A'
        });
    }, 60000);
}
