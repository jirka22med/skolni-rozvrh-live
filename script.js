// ============================================
// 🎓 ŠKOLNÍ ROZVRH - DIGITÁLNÍ HODINY 🎓
// ============================================
// 🖖 Projekt: Digitální rozvrh s reálným časem
// 👨‍💻 Autor: Více admirál Jiřík
// 🤖 AI důstojník: Admirál Claude.AI (Anthropic)
// 📅 Datum: Říjen 2025
// ⚡ Verze: VARIANTA B + COUNTDOWN + DEBUG MODULE
// 🚀 Feature: Cross-Day Support + Odpočet hodin + Debug systém
// 
// "Hvězdy krásně plují, když technika funguje!"
// ============================================

// ============================================
// 🐛 DEBUG MODULE - INICIALIZACE
// ============================================
if (typeof DebugModule !== 'undefined') {
    DebugModule.init({
        enabled: true,           // Zapnout debug
        fpsMonitoring: true,    // Sledovat FPS
        autoValidate: true,     // Automatická validace
        showPanel: false,       // Panel defaultně skrytý (klávesa D)
        exportOnError: false    // Neexportovat automaticky při chybě
    });

    DebugModule.log('🚀 Aplikace inicializována', 'SUCCESS');
    DebugModule.log('🎯 Režim: VARIANTA B + COUNTDOWN + DEBUG', 'INFO');

    // Validace rozvrhu při startu
    if (typeof schedule !== 'undefined') {
        const validation = DebugModule.schedule.validate(schedule);
        if (!validation.valid) {
            DebugModule.log('❌ Rozvrh obsahuje chyby! Zkontroluj console.', 'ERROR');
        }
    } else {
        DebugModule.log('⚠️ Rozvrh nebyl nalezen!', 'WARNING');
    }
} else {
    console.warn('⚠️ Debug Module není načten! Spuštění bez debug režimu.');
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

// DOM elementy - cachované pro rychlý přístup
const elements = {
    time: document.getElementById('time'),
    date: document.getElementById('date'),
    lessonBox: document.getElementById('lessonBox')
};

// Log načtení elementů
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

// RequestAnimationFrame handler
let animationFrameId = null;
let lastFrameTime = 0;
const FRAME_INTERVAL = 1000; // Aktualizace každou sekundu

// Optimalizovaná aktualizace času
function updateTime(timestamp) {
    // Throttling - aktualizuj pouze každou sekundu
    if (timestamp - lastFrameTime < FRAME_INTERVAL) {
        animationFrameId = requestAnimationFrame(updateTime);
        return;
    }
    
    lastFrameTime = timestamp;
    
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    const timeString = `${hours}:${minutes}:${seconds}`;
    
    // Aktualizuj čas pouze když se změní
    if (timeString !== cache.timeString) {
        elements.time.textContent = timeString;
        cache.timeString = timeString;
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
    
    // Pokračuj v animační smyčce
    animationFrameId = requestAnimationFrame(updateTime);
}

// Debounced DOM update pro hodinu
let lessonUpdateTimeout = null;

function updateCurrentLesson(now, currentDay, currentTime) {
    // Použij předpřipravený rozvrh
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
            
            // ⚡ AKTUALIZACE COUNTDOWN ⚡
            updateCountdown(currentLesson, currentTime, currentDay);
            
            // 🐛 DEBUG LOG - Změna hodiny
            if (DebugModule && DebugModule.config.enabled) {
                if (currentLesson) {
                    DebugModule.log(`📚 Hodina změněna: ${currentLesson.subject} (${currentLesson.timeFrom}-${currentLesson.timeTo})`, 'SCHEDULE');
                    
                    // Validace countdown při změně hodiny
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
        // I když se hodina nezměnila, aktualizuj countdown (čas se mění)
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
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }

        if (DebugModule && DebugModule.config.enabled) {
            DebugModule.log('😴 Stránka skryta - animace pozastavena', 'INFO');
        }
    } else {
        if (!animationFrameId) {
            animationFrameId = requestAnimationFrame(updateTime);
        }
        cache.currentMinute = -1;

        if (DebugModule && DebugModule.config.enabled) {
            DebugModule.log('👁️ Stránka aktivní - animace obnovena', 'INFO');
        }
    }
});

// Cleanup při zavření stránky
window.addEventListener('beforeunload', () => {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    clearTimeout(lessonUpdateTimeout);

    if (DebugModule && DebugModule.config.enabled) {
        DebugModule.log('👋 Aplikace ukončena', 'INFO');
        DebugModule.printStats();
    }
});

// Inicializace
updateTime(0);
animationFrameId = requestAnimationFrame(updateTime);

if (DebugModule && DebugModule.config.enabled) {
    DebugModule.log('✅ Aplikace spuštěna', 'SUCCESS');
}

// Performance monitoring
let frameCount = 0;
let lastFpsUpdate = Date.now();

function monitorPerformance() {
    frameCount++;
    const now = Date.now();
    if (now - lastFpsUpdate > 5000) {
        const fps = Math.round((frameCount / 5) * 10) / 10;
        document.getElementById('perfMode').textContent = `⚡ VARIANTA B + DEBUG | ${fps} FPS`;
        
        if (DebugModule && DebugModule.config.enabled) {
            // FPS už loguje performance modul každých 10s, tak tady nelogujeme
        }
        
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
// 🐛 DEBUG - TISK STATISTIK PO 60 SEKUNDÁCH
// ============================================
if (DebugModule && DebugModule.config.enabled) {
    setTimeout(() => {
        DebugModule.printStats();
    }, 60000); // Po 1 minutě
}