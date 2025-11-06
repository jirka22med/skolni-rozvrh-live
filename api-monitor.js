// ============================================
// 🛰️ API MONITOR MODULE (Left-Top Diagnostic v1.2)
// ============================================
// Autor: Adm. Chatbot 🖖 & Více Adm. Jiřík 🚀

const ApiMonitor = {
    url: "https://timeapi.io/api/Time/current/zone?timeZone=Europe/Prague",
    checkInterval: 24 * 60 * 60 * 1000, // 1x denně
    timeoutMs: 5000,
    indicator: null,

    async checkAPI() {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
        let status = "❌ OFFLINE";

        try {
            const res = await fetch(this.url, { signal: controller.signal });
            clearTimeout(timeout);
            status = res.ok && res.status === 200 ? "✅ ONLINE" : `⚠️ ERROR ${res.status}`;
        } catch {
            clearTimeout(timeout);
            status = "❌ OFFLINE";
        }

        this.updateIndicator(status);
        console.log(`[API MONITOR] ${status} (${new Date().toLocaleString()})`);
    },

    createIndicator() {
        const el = document.createElement("div");
        el.id = "api-indicator";
        el.style.position = "fixed";
        el.style.top = "10px";
        el.style.left = "10px";
        el.style.padding = "6px 10px";
        el.style.borderRadius = "8px";
        el.style.fontFamily = "Consolas, monospace";
        el.style.fontSize = "12px";
        el.style.color = "#fff";
        el.style.background = "rgba(0, 0, 0, 0.6)";
        el.style.border = "1px solid rgba(255, 255, 255, 0.2)";
        el.style.zIndex = "9999";
        el.style.backdropFilter = "blur(5px)";
        el.style.transition = "background 0.5s, border-color 0.5s";
        el.textContent = "🛰 Načítám API status...";
        document.body.appendChild(el);
        this.indicator = el;
    },

    updateIndicator(status) {
        if (!this.indicator) return;

        if (status.includes("ONLINE")) {
            this.indicator.textContent = "🟢 API: ONLINE";
            this.indicator.style.background = "rgba(0, 128, 0, 0.7)";
            this.indicator.style.borderColor = "#00ff88";
        } else if (status.includes("ERROR")) {
            this.indicator.textContent = "🟡 API: CHYBA";
            this.indicator.style.background = "rgba(180, 120, 0, 0.7)";
            this.indicator.style.borderColor = "#ffd900";
        } else {
            this.indicator.textContent = "🔴 API: OFFLINE";
            this.indicator.style.background = "rgba(128, 0, 0, 0.7)";
            this.indicator.style.borderColor = "#ff4444";
        }
    },

    start() {
        this.createIndicator();

        // 🚀 Zpožděný první test (2 sekundy)
        setTimeout(() => {
            this.checkAPI();
            // opakovaná kontrola jednou denně
            setInterval(() => this.checkAPI(), this.checkInterval);
        }, 2000);
    }
};

window.addEventListener("load", () => {
    ApiMonitor.start();
});
