// ============================================
// 🧭 BOOT TIMELINE MONITOR + PROGRESS BAR (Bottom Center)
// ============================================
// Autor: Více Adm. Jiřík 🖖 & Adm. Chatbot 🚀
// Pozice: Spodní střed obrazovky

const BootTimeline = {
    checkpoints: new Map(),
    progress: 0,
    indicator: null,
    hidden: false,
    moduleCount: 6, // Počet sledovaných modulů

    mark(label) {
        if (this.hidden) return;
        const time = performance.now();
        this.checkpoints.set(label, time);
        console.log(`📍 [BOOT] ${label} zaznamenán v ${time.toFixed(2)} ms`);
        this.progress = Math.min((this.checkpoints.size / this.moduleCount) * 100, 100);
        this.updateProgress();
    },

    updateProgress() {
        if (!this.indicator) return;
        const bar = this.indicator.querySelector(".boot-progress-fill");
        bar.style.width = `${this.progress}%`;
        bar.textContent = `${Math.floor(this.progress)}%`;

        if (this.progress >= 100 && !this.hidden) {
            this.hidden = true;
            bar.textContent = "🟢 SYSTEM ONLINE";
            setTimeout(() => {
                this.indicator.style.opacity = "0";
                setTimeout(() => this.indicator.remove(), 2000);
            }, 6000); // ⏳ Skrytí po 6 sekundách
        }
    },

    createIndicator() {
        const el = document.createElement("div");
        el.id = "boot-progress";
        el.style.position = "fixed";
        el.style.bottom = "20px"; // 🧭 Posun dolů
        el.style.left = "50%";
        el.style.transform = "translateX(-50%)"; // 🧭 Centrované zarovnání
        el.style.width = "400px";
        el.style.height = "28px";
        el.style.background = "rgba(0, 0, 0, 0.6)";
        el.style.border = "2px solid #00ffff";
        el.style.borderRadius = "14px";
        el.style.overflow = "hidden";
        el.style.zIndex = "9999";
        el.style.backdropFilter = "blur(6px)";
        el.style.transition = "opacity 1.2s ease";

        const fill = document.createElement("div");
        fill.className = "boot-progress-fill";
        fill.style.height = "100%";
        fill.style.width = "0%";
        fill.style.background = "linear-gradient(90deg, #00ffcc, #00ffff)";
        fill.style.color = "#000";
        fill.style.fontWeight = "bold";
        fill.style.fontFamily = "Consolas, monospace";
        fill.style.fontSize = "1rem";
        fill.style.textAlign = "center";
        fill.style.lineHeight = "26px";
        fill.style.transition = "width 0.5s ease";

        el.appendChild(fill);
        document.body.appendChild(el);
        this.indicator = el;
    },

    report() {
        console.log("🧭 === BOOT TIMELINE REPORT ===");
        let previous = 0;
        this.checkpoints.forEach((time, label) => {
            const diff = (time - previous).toFixed(2);
            console.log(`→ ${label.padEnd(30)} +${diff} ms`);
            previous = time;
        });
        console.log("🧩 Celkový čas spuštění:", performance.now().toFixed(2), "ms");
        console.log("===============================");
    },

    start() {
        this.createIndicator();
        this.mark("HTML DOM připraven");

        window.addEventListener("load", () => {
            this.mark("Okno načteno");
            setTimeout(() => {
                if (typeof DebugModule !== "undefined") this.mark("DebugModule aktivní");
                if (typeof AtomicTime !== "undefined") this.mark("AtomicTime inicializován");
                if (typeof CountdownModule !== "undefined") this.mark("CountdownModule aktivní");
                if (typeof schedule !== "undefined") this.mark("Rozvrh načten");
                if (typeof ApiMonitor !== "undefined") this.mark("ApiMonitor připojen");
                this.report();
            }, 1000);
        });
    }
};

BootTimeline.start();
