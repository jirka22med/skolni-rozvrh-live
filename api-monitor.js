// ============================================
// 🛰️ API MONITOR MODULE v2.0 - FIXED & ENHANCED
// ============================================
// Autoři: Adm. Chatbot 🖖 & Více Adm. Jiřík 🚀 & Adm. Claude 🤖
// Účel: Monitorování TimeAPI.io + vizuální indikátor
// Pozice: Levý horní roh
// Vylepšení: Bug fixes, integrace s AtomicTime, lepší UX
// ============================================

const ApiMonitor = {
    url: "https://timeapi.io/api/Time/current/zone?timeZone=Europe/Prague",
    checkInterval: 3600000, // 1 hodina (změň na 1800000 pro 30 min)
    timeoutMs: 5000,
    indicator: null,
    delayBeforeCheck: 10000, // 10 sekund delay
    lastStatus: null,
    checkCount: 0,
    
    // ✅ OPRAVENÁ FUNKCE - API CHECK
    async checkAPI() {
        this.checkCount++;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
        
        let status = "❌ OFFLINE";
        let statusCode = null;
        
        try {
            const startTime = performance.now();
            const res = await fetch(this.url, { 
                signal: controller.signal,
                cache: 'no-cache'
            });
            const endTime = performance.now();
            const responseTime = Math.round(endTime - startTime);
            
            clearTimeout(timeout);
            statusCode = res.status;
            
            if (res.ok && res.status === 200) {
                status = `✅ ONLINE (${responseTime}ms)`;
            } else {
                status = `⚠️ ERROR ${res.status}`;
            }
        } catch (error) {
            clearTimeout(timeout);
            
            if (error.name === 'AbortError') {
                status = "⏱️ TIMEOUT";
            } else if (error.message.includes('Failed to fetch')) {
                status = "❌ NETWORK ERROR";
            } else {
                status = "❌ OFFLINE";
            }
        }
        
        this.lastStatus = status;
        this.updateIndicator(status);
        
        // ✅ OPRAVENÝ CONSOLE.LOG
        console.log(`[API MONITOR #${this.checkCount}] ${status} | ${new Date().toLocaleString()}`);
        
        // Integrace s AtomicTime (pokud existuje)
        if (typeof AtomicTime !== 'undefined') {
            const atomicStatus = AtomicTime.getStatus();
            console.log(`[ATOMIC TIME] Synced: ${atomicStatus.synced} | Offset: ${atomicStatus.offset}ms`);
        }
        
        return status;
    },
    
    // ✅ VYLEPŠENÝ INDIKÁTOR
    createIndicator() {
        const el = document.createElement("div");
        el.id = "api-indicator";
        el.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            padding: 8px 12px;
            border-radius: 8px;
            font-family: 'Consolas', 'Courier New', monospace;
            font-size: 12px;
            font-weight: 600;
            color: #fff;
            background: rgba(0, 0, 0, 0.7);
            border: 2px solid rgba(255, 255, 255, 0.3);
            z-index: 9999;
            backdrop-filter: blur(8px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
            transition: all 0.4s ease;
            cursor: pointer;
            user-select: none;
        `;
        
        el.textContent = "🛰️ Inicializace...";
        
        // Kliknutí = manuální check
        el.addEventListener('click', () => {
            el.textContent = "🔄 Kontroluji...";
            this.checkAPI();
        });
        
        // Hover efekt
        el.addEventListener('mouseenter', () => {
            el.style.transform = "scale(1.05)";
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = "scale(1)";
        });
        
        document.body.appendChild(el);
        this.indicator = el;
    },
    
    // ✅ VYLEPŠENÝ COUNTDOWN
    startCountdown() {
        if (!this.indicator) return;
        
        let countdown = this.delayBeforeCheck / 1000;
        
        const timer = setInterval(() => {
            countdown--;
            
            if (countdown > 0) {
                this.indicator.textContent = `🛰️ Start za ${countdown}s...`;
                this.indicator.style.background = "rgba(50, 50, 150, 0.7)";
                this.indicator.style.borderColor = "#4488ff";
            } else {
                clearInterval(timer);
                this.indicator.textContent = "🔄 Kontroluji API...";
                this.indicator.style.background = "rgba(100, 100, 0, 0.7)";
                this.indicator.style.borderColor = "#ffcc00";
            }
        }, 1000);
    },
    
    // ✅ VYLEPŠENÁ AKTUALIZACE INDIKÁTORU
    updateIndicator(status) {
        if (!this.indicator) return;
        
        // Základní nastavení
        let bgColor, borderColor, emoji, text;
        
        if (status.includes("ONLINE")) {
            emoji = "🟢";
            text = status.replace("✅ ", "");
            bgColor = "rgba(0, 150, 0, 0.8)";
            borderColor = "#00ff88";
        } else if (status.includes("ERROR")) {
            emoji = "🟡";
            text = status.replace("⚠️ ", "");
            bgColor = "rgba(200, 150, 0, 0.8)";
            borderColor = "#ffd900";
        } else if (status.includes("TIMEOUT")) {
            emoji = "⏱️";
            text = "TIMEOUT (>5s)";
            bgColor = "rgba(150, 80, 0, 0.8)";
            borderColor = "#ff8800";
        } else {
            emoji = "🔴";
            text = status.replace("❌ ", "");
            bgColor = "rgba(150, 0, 0, 0.8)";
            borderColor = "#ff4444";
        }
        
        this.indicator.textContent = `${emoji} API: ${text}`;
        this.indicator.style.background = bgColor;
        this.indicator.style.borderColor = borderColor;
        
        // Animace při změně stavu
        this.indicator.style.animation = "pulse 0.5s ease";
        setTimeout(() => {
            this.indicator.style.animation = "";
        }, 500);
    },
    
    // ✅ HLAVNÍ START FUNKCE
    start() {
        console.log("[API MONITOR] Inicializace...");
        
        // Vytvoř indikátor
        this.createIndicator();
        
        // Spusť countdown
        this.startCountdown();
        
        // První check po delay
        setTimeout(() => {
            this.checkAPI();
            
            // Pravidelné checky
            setInterval(() => this.checkAPI(), this.checkInterval);
            
        }, this.delayBeforeCheck);
        
        console.log(`[API MONITOR] Delay: ${this.delayBeforeCheck / 1000}s | Interval: ${this.checkInterval / 1000 / 60} min`);
    },
    
    // ✅ NOVÁ FUNKCE - GET STATUS
    getStatus() {
        return {
            lastStatus: this.lastStatus,
            checkCount: this.checkCount,
            nextCheck: this.checkInterval
        };
    }
};

// ============================================
// 🎨 CSS ANIMACE (přidej do <style> tagu)
// ============================================
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
    
    #api-indicator:hover {
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.7) !important;
    }
`;
document.head.appendChild(style);

// ============================================
// 🚀 AUTO-START
// ============================================
window.addEventListener("load", () => {
    ApiMonitor.start();
});

// ============================================
// 🛠️ DEBUG - Manuální příkazy v console
// ============================================
// ApiMonitor.checkAPI() - Okamžitý check
// ApiMonitor.getStatus() - Zobraz stav
