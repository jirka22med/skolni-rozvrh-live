// ============================================
// 🎓 ŠKOLNÍ ROZVRH - DIGITÁLNÍ HODINY 🎓
// ============================================
// 🖖 Projekt: Digitální rozvrh s reálným časem
// 👨‍💻 Autor: Více admirál Jiřík
// 🤖 AI důstojník: Admirál Claude.AI (Anthropic)
// 📅 Datum: Listopad 2025
// ⚡ Verze: ATOMIC TIME v2 + OPTIMIZED
// 🚀 Feature: TimeAPI.io + Zero Bottleneck + Retry
// 
// "Přesnost je klíč k úspěšné misi!"
// ============================================

// ============================================
// ⏰ ATOMIC TIME MODULE v2 - TIMEAPI.IO
// ============================================

const AtomicTime = {
    apiUrl: 'https://timeapi.io/api/Time/current/zone?timeZone=Europe/Prague',
    offset: 0,
    lastSync: null,
    syncInterval: 1800000,  // 30 minut
    useFallback: false,
    retryCount: 0,
    maxRetries: 3,
    
    // Rychlá inicializace - non-blocking
    init() {
        // Spusť sync na pozadí bez čekání
        this.sync();
        
        // Auto re-sync každých 30 minut
        setInterval(() => this.sync(), this.syncInterval);
        
        if (DebugModule && DebugModule.config.enabled) {
            DebugModule.log('⏰ Atomic Time init - async mode', 'INFO');
        }
    },
    
    // Async sync s retry mechanikou
    async sync() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout
            
            const response = await fetch(this.apiUrl, {
                signal: controller.signal,
                cache: 'no-cache'
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) throw new Error('API HTTP error');
            
            const data = await response.json();
            
            // TimeAPI.io vrací: { dateTime: "2025-11-06T16:05:43.123456" }
            const apiTime = new Date(data.dateTime);
            const localTime = new Date();
            
            this.offset = apiTime.getTime() - localTime.getTime();
            this.lastSync = Date.now();
            this.useFallback = false;
            this.retryCount = 0;
            
            if (DebugModule && DebugModule.config.enabled) {
                DebugModule.log(`✅ Time synced | Offset: ${this.offset}ms`, 'SUCCESS');
            }
            
            return true;
        } catch (error) {
            this.retryCount++;
            
            if (this.retryCount < this.maxRetries) {
                if (DebugModule && DebugModule.config.enabled) {
                    DebugModule.log(`⚠️ Sync fail (${this.retryCount}/${this.maxRetries}) - retrying...`, 'WARNING');
                }
                
                // Exponential backoff: 2s, 4s, 8s
                setTimeout(() => this.sync(), 2000 * Math.pow(2, this.retryCount - 1));
            } else {
                this.useFallback = true;
                
                if (DebugModule && DebugModule.config.enabled) {
                    DebugModule.log('❌ API failed - using local time', 'ERROR');
                }
            }
            
            return false;
        }
    },
    
    // Získej přesný čas
    now() {
        if (this.useFallback) {
            return new Date();
        }
        return new Date(Date.now() + this.offset);
    },
    
    getStatus() {
        return {
            synced: !this.useFallback,
            offset: this.offset,
            lastSync: this.lastSync,
            timeSinceSync: this.lastSync ? Date.now() - this.lastSync : null,
            retries: this.retryCount
        };
    }
};

// ============================================
// 🛠 DEBUG MODULE - INICIALIZACE
// ============================================
if (typeof DebugModule !== 'undefined') {
    DebugModule.init({
        enabled: true,
        showPanel: true,
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
    DebugModule.log('🎯 Režim: ATOMIC TIME v2 OPTIMIZED', 'INFO');

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
// HLAVNÍ KÓD - OPTIMALIZOVANÝ
// ============================================

const days = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'];

// Cache systém
const cache = {
    timeString: '',
    dateString: '',
    lessonSubject: null,
    currentDay: -1,
    currentMinute: -1,
    lastSecond: -1
};

// DOM elementy - cached při startu
const elements = {
    time: document.getElementById('time'),
    date: document.getElementById('date'),
    lessonBox: document.getElementById('lessonBox'),
    perfMode: document.getElementById('perfMode'),
    fullscreenBtn: document.getElementById('fullscreenBtn')
};

if (DebugModule && DebugModule.config.enabled) {
    DebugModule.log('📦 DOM elementy načteny', 'SUCCESS');
}

// Předpočítání rozvrhu - OPTIMALIZACE
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

// Seskupení podle dnů - OPTIMALIZACE
const scheduleByDay = {};
scheduleOptimized.forEach(lesson => {
    if (!scheduleByDay[lesson.day]) {
        scheduleByDay[lesson.day] = [];
    }
    scheduleByDay[lesson.day].push(lesson);
});

// ============================================
// ⚡ PŘESNÝ UPDATE - ZERO BOTTLENECK
// ============================================

let updateIntervalId = null;

function updateTime() {
    const now = AtomicTime.now();
    const currentSecond = now.getSeconds();
    
    // Update času - pouze když se změní sekunda
    if (currentSecond !== cache.lastSecond) {
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(currentSecond).padStart(2, '0');
        const timeString = `${hours}:${minutes}:${seconds}`;
        
        elements.time.textContent = timeString;
        cache.timeString = timeString;
        cache.lastSecond = currentSecond;
    }
    
    // Update data - pouze když se změní den
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
    
    // Update hodiny - pouze když se změní minuta
    const currentMinute = now.getHours() * 60 + now.getMinutes();
    if (currentMinute !== cache.currentMinute) {
        updateCurrentLesson(now, currentDay, currentMinute);
        cache.currentMinute = currentMinute;
    }
}

// Přesný interval - kompenzuje drift
function startPreciseInterval() {
    function tick() {
        const start = performance.now();
        updateTime();
        const executionTime = performance.now() - start;
        
        // Naplánuj další tick přesně na začátek další sekundy
        const now = Date.now();
        const delay = 1000 - (now % 1000);
        const adjustedDelay = Math.max(0, delay - executionTime);
        
        updateIntervalId = setTimeout(tick, adjustedDelay);
    }
    
    tick();
}

// Update hodiny - OPTIMALIZOVÁNO
function updateCurrentLesson(now, currentDay, currentTime) {
    const todayLessons = scheduleByDay[currentDay] || [];
    let currentLesson = null;
    
    // Rychlé hledání - break při prvním match
    for (const lesson of todayLessons) {
        if (lesson.nextDay) {
            if (currentDay === lesson.day && currentTime >= lesson.startMinutes) {
                currentLesson = lesson;
                break;
            } else if (currentDay === lesson.nextDay && currentTime < lesson.endMinutes) {
                currentLesson = lesson;
                break;
            }
        } else {
            if (currentTime >= lesson.startMinutes && currentTime < lesson.endMinutes) {
                currentLesson = lesson;
                break;
            }
        }
    }
    
    // Check předchozí den (cross-day)
    if (!currentLesson) {
        const previousDay = currentDay === 0 ? 6 : currentDay - 1;
        const yesterdayLessons = scheduleByDay[previousDay] || [];
        
        for (const lesson of yesterdayLessons) {
            if (lesson.nextDay === currentDay && currentTime < lesson.endMinutes) {
                currentLesson = lesson;
                break;
            }
        }
    }
    
    const newLessonSubject = currentLesson ? currentLesson.subject : null;
    
    // Update pouze když se změní hodina
    if (newLessonSubject !== cache.lessonSubject) {
        updateLessonDisplay(currentLesson);
        updateCountdown(currentLesson, currentTime, currentDay);
        
        if (DebugModule && DebugModule.config.enabled) {
            if (currentLesson) {
                DebugModule.log(`📚 Hodina: ${currentLesson.subject} (${currentLesson.timeFrom}-${currentLesson.timeTo})`, 'SCHEDULE');
            } else {
                DebugModule.log('📅 Žádná hodina', 'SCHEDULE');
            }
        }
        
        cache.lessonSubject = newLessonSubject;
    } else if (currentLesson) {
        // Aktualizuj countdown i když se hodina nezmění
        updateCountdown(currentLesson, currentTime, currentDay);
    }
}

// Display update - OPTIMALIZOVÁNO
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

// Countdown update
function updateCountdown(lesson, currentMinutes, currentDay) {
    if (typeof CountdownModule !== 'undefined') {
        CountdownModule.update(lesson, currentMinutes, currentDay);
    }
}

// Visibility change handler
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

// Cleanup
window.addEventListener('beforeunload', () => {
    if (updateIntervalId) {
        clearTimeout(updateIntervalId);
    }
    if (DebugModule && DebugModule.config.enabled) {
        DebugModule.log('👋 Aplikace ukončena', 'INFO');
        DebugModule.printStats();
    }
});

// ============================================
// 🚀 INICIALIZACE - NON-BLOCKING
// ============================================

function init() {
    // 1) Spusť Atomic Time sync na pozadí (non-blocking)
    AtomicTime.init();
    
    // 2) Okamžitě spusť UI update (neblokuje se na API)
    updateTime();
    startPreciseInterval();
    
    if (DebugModule && DebugModule.config.enabled) {
        DebugModule.log('✅ Aplikace spuštěna - OPTIMIZED MODE', 'SUCCESS');
    }
}

// Okamžitý start
init();

// ============================================
// 📊 PERFORMANCE MONITORING
// ============================================

let frameCount = 0;
let lastFpsUpdate = Date.now();

function monitorPerformance() {
    frameCount++;
    const now = Date.now();
    
    if (now - lastFpsUpdate > 5000) {
        const fps = Math.round((frameCount / 5) * 10) / 10;
        const status = AtomicTime.getStatus();
        const syncStatus = status.synced ? '✅ SYNCED' : '⚠️ LOCAL';
        
        if (elements.perfMode) {
            elements.perfMode.textContent = `⚡ ATOMIC v2 ${syncStatus} | ${fps} FPS`;
        }
        
        frameCount = 0;
        lastFpsUpdate = now;
    }
    
    requestAnimationFrame(monitorPerformance);
}

monitorPerformance();

// ============================================
// 🖥️ FULLSCREEN
// ============================================

function toggleFullscreen() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement) {
        enterFullscreen();
    } else {
        exitFullscreen();
    }
}

function enterFullscreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) elem.requestFullscreen();
    else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
    else if (elem.mozRequestFullScreen) elem.mozRequestFullScreen();
    else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
    
    if (DebugModule && DebugModule.config.enabled) {
        DebugModule.log('🖥️ Fullscreen aktivován', 'INFO');
    }
}

function exitFullscreen() {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
    
    if (DebugModule && DebugModule.config.enabled) {
        DebugModule.log('🖥️ Fullscreen ukončen', 'INFO');
    }
}

if (elements.fullscreenBtn) {
    elements.fullscreenBtn.addEventListener('click', toggleFullscreen);
}

document.addEventListener('fullscreenchange', updateFullscreenButton);
document.addEventListener('webkitfullscreenchange', updateFullscreenButton);
document.addEventListener('mozfullscreenchange', updateFullscreenButton);
document.addEventListener('MSFullscreenChange', updateFullscreenButton);

function updateFullscreenButton() {
    const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement);
    
    if (isFullscreen) {
        document.body.classList.add('fullscreen-active');
        if (elements.fullscreenBtn) elements.fullscreenBtn.title = 'Ukončit celou obrazovku (ESC)';
    } else {
        document.body.classList.remove('fullscreen-active');
        if (elements.fullscreenBtn) elements.fullscreenBtn.title = 'Celá obrazovka';
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
    }
    if (e.key === 'f' || e.key === 'F') {
        if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            toggleFullscreen();
        }
    }
});

// ============================================
// 🛠 DEBUG STATS
// ============================================
if (DebugModule && DebugModule.config.enabled) {
    setTimeout(() => {
        DebugModule.printStats();
        
        const status = AtomicTime.getStatus();
        console.log('⏰ ATOMIC TIME STATUS:', {
            synced: status.synced,
            offset: status.offset + 'ms',
            lastSync: status.lastSync ? new Date(status.lastSync).toLocaleTimeString() : 'Never',
            timeSinceSync: status.timeSinceSync ? Math.round(status.timeSinceSync / 1000) + 's' : 'N/A',
            retries: status.retries
        });
    }, 60000);
}
