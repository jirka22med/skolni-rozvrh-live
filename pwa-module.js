// ============================================
// 📱 PWA MODULE - REGISTRACE & INSTALL PROMPT
// ============================================
// Autoři: Více Adm. Jiřík 🚀 & Adm. Claude 🤖
// Funkce: SW registrace, install banner, update notifikace
// ============================================

const PWAModule = {
    
    swRegistration: null,
    deferredPrompt: null,
    installBtn: null,
    updateBanner: null,

    // ============================================
    // 🚀 INIT
    // ============================================
    init() {
        if (!('serviceWorker' in navigator)) {
            console.warn('[PWA] ⚠️ Service Worker není podporován v tomto prohlížeči');
            return;
        }

        this.registerSW();
        this.listenForInstallPrompt();
        this.createInstallButton();
        this.createUpdateBanner();
        
        console.log('[PWA] ✅ PWA Module inicializován');
    },

    // ============================================
    // 🛰️ REGISTRACE SERVICE WORKERU
    // ============================================
    async registerSW() {
        try {
            // ⚠️ Uprav cestu pokud se liší (musí být v root adresáři repozitáře)
            const registration = await navigator.serviceWorker.register(
                '/skolni-rozvrh-live/service-worker.js',
                { scope: '/skolni-rozvrh-live/' }
            );

            this.swRegistration = registration;
            console.log('[PWA] ✅ Service Worker registrován:', registration.scope);

            // Sledovat aktualizace
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                console.log('[PWA] 🔄 Nalezena nová verze SW...');

                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        console.log('[PWA] 🔄 Nová verze připravena – zobrazuji banner');
                        this.showUpdateBanner();
                    }
                });
            });

            // Reagovat na zprávy SW
            navigator.serviceWorker.addEventListener('message', event => {
                console.log('[PWA] 📬 Zpráva od SW:', event.data);
            });

        } catch (err) {
            console.error('[PWA] ❌ Chyba registrace SW:', err);
        }
    },

    // ============================================
    // 💾 INSTALL PROMPT
    // ============================================
    listenForInstallPrompt() {
        window.addEventListener('beforeinstallprompt', event => {
            event.preventDefault();
            this.deferredPrompt = event;
            console.log('[PWA] 📲 Install prompt zachycen – zobrazuji tlačítko');
            this.showInstallButton();
        });

        window.addEventListener('appinstalled', () => {
            console.log('[PWA] 🎉 Aplikace nainstalována!');
            this.deferredPrompt = null;
            this.hideInstallButton();
            
            // Logovat do Debug modulu pokud existuje
            if (typeof DebugModule !== 'undefined') {
                DebugModule.log('📱 PWA nainstalována na zařízení!', 'SUCCESS');
            }
        });
    },

    // ============================================
    // 📲 INSTALL TLAČÍTKO
    // ============================================
    createInstallButton() {
        const btn = document.createElement('button');
        btn.id = 'pwa-install-btn';
        btn.innerHTML = '📲 Nainstalovat';
        btn.title = 'Nainstalovat jako aplikaci';
        btn.style.cssText = `
            display: none;
            position: fixed;
            bottom: 60px;
            right: 15px;
            background: rgba(0, 255, 136, 0.15);
            border: 2px solid rgba(0, 255, 136, 0.6);
            border-radius: 12px;
            padding: 10px 16px;
            color: #00ff88;
            font-size: 0.85rem;
            font-weight: 600;
            font-family: 'Segoe UI', sans-serif;
            cursor: pointer;
            z-index: 1001;
            backdrop-filter: blur(8px);
            box-shadow: 0 4px 15px rgba(0, 255, 136, 0.2);
            transition: all 0.3s ease;
            letter-spacing: 0.5px;
        `;

        btn.addEventListener('mouseenter', () => {
            btn.style.background = 'rgba(0, 255, 136, 0.25)';
            btn.style.transform = 'scale(1.05)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.background = 'rgba(0, 255, 136, 0.15)';
            btn.style.transform = 'scale(1)';
        });
        btn.addEventListener('click', () => this.triggerInstall());

        document.body.appendChild(btn);
        this.installBtn = btn;
    },

    showInstallButton() {
        if (this.installBtn) {
            this.installBtn.style.display = 'block';
            // Animace
            this.installBtn.style.opacity = '0';
            requestAnimationFrame(() => {
                this.installBtn.style.transition = 'opacity 0.5s ease';
                this.installBtn.style.opacity = '1';
            });
        }
    },

    hideInstallButton() {
        if (this.installBtn) {
            this.installBtn.style.opacity = '0';
            setTimeout(() => { this.installBtn.style.display = 'none'; }, 500);
        }
    },

    async triggerInstall() {
        if (!this.deferredPrompt) return;

        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;
        
        console.log(`[PWA] 📲 Výsledek instalace: ${outcome}`);
        
        if (outcome === 'accepted') {
            this.deferredPrompt = null;
            this.hideInstallButton();
        }
    },

    // ============================================
    // 🔄 UPDATE BANNER
    // ============================================
    createUpdateBanner() {
        const banner = document.createElement('div');
        banner.id = 'pwa-update-banner';
        banner.innerHTML = `
            <span>🔄 Nová verze aplikace je k dispozici!</span>
            <button id="pwa-update-btn">Aktualizovat</button>
            <button id="pwa-update-dismiss">✕</button>
        `;
        banner.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: rgba(0, 200, 255, 0.15);
            border-bottom: 2px solid rgba(0, 200, 255, 0.5);
            backdrop-filter: blur(10px);
            padding: 12px 20px;
            color: #00ccff;
            font-size: 0.9rem;
            font-family: 'Segoe UI', sans-serif;
            font-weight: 500;
            z-index: 9998;
            display: none;
            align-items: center;
            justify-content: center;
            gap: 15px;
        `;

        // Tlačítko aktualizace
        setTimeout(() => {
            const updateBtn = banner.querySelector('#pwa-update-btn');
            const dismissBtn = banner.querySelector('#pwa-update-dismiss');
            
            if (updateBtn) {
                updateBtn.style.cssText = `
                    background: rgba(0,200,255,0.2);
                    border: 1px solid #00ccff;
                    border-radius: 8px;
                    padding: 6px 14px;
                    color: #00ccff;
                    cursor: pointer;
                    font-size: 0.85rem;
                    font-weight: 600;
                `;
                updateBtn.addEventListener('click', () => this.applyUpdate());
            }

            if (dismissBtn) {
                dismissBtn.style.cssText = `
                    background: none;
                    border: none;
                    color: #00ccff;
                    cursor: pointer;
                    font-size: 1rem;
                    padding: 4px 8px;
                    opacity: 0.7;
                `;
                dismissBtn.addEventListener('click', () => this.hideUpdateBanner());
            }
        }, 100);

        document.body.appendChild(banner);
        this.updateBanner = banner;
    },

    showUpdateBanner() {
        if (this.updateBanner) {
            this.updateBanner.style.display = 'flex';
        }
    },

    hideUpdateBanner() {
        if (this.updateBanner) {
            this.updateBanner.style.display = 'none';
        }
    },

    applyUpdate() {
        if (this.swRegistration && this.swRegistration.waiting) {
            this.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
        window.location.reload();
    },

    // ============================================
    // 🔧 UTILITY - Zjistit stav PWA
    // ============================================
    getStatus() {
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches
            || window.navigator.standalone === true;
        
        return {
            swSupported: 'serviceWorker' in navigator,
            swRegistered: !!this.swRegistration,
            isInstalled: isStandalone,
            canInstall: !!this.deferredPrompt,
            online: navigator.onLine
        };
    },

    // Vymazat cache (debug funkce)
    clearCache() {
        if (this.swRegistration && this.swRegistration.active) {
            this.swRegistration.active.postMessage({ type: 'CLEAR_CACHE' });
            console.log('[PWA] 🗑️ Požadavek na vymazání cache odeslán');
        }
    }
};

// ============================================
// 🚀 AUTO-START po načtení DOMu
// ============================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => PWAModule.init());
} else {
    PWAModule.init();
}

// ============================================
// 🛠️ ONLINE/OFFLINE INDIKÁTOR
// ============================================
window.addEventListener('online', () => {
    console.log('[PWA] 🌐 Připojení obnoveno');
    if (typeof DebugModule !== 'undefined') {
        DebugModule.log('🌐 Připojení k internetu obnoveno', 'SUCCESS');
    }
});

window.addEventListener('offline', () => {
    console.log('[PWA] 📴 Offline režim aktivní');
    if (typeof DebugModule !== 'undefined') {
        DebugModule.log('📴 Offline – aplikace běží z cache', 'WARNING');
    }
});

// ============================================
// KONEC PWA MODULE
// ============================================
