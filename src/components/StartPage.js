import startJourneyBg from '../assets/start_jorney.png';
import startButtonImg from '../assets/start_button.png';

export class StartPage {
    constructor(onStart) {
        this.onStart = onStart;
        this.overlay = null;
        this.init();
    }

    init() {
        // Create overlay
        this.overlay = document.createElement('div');
        this.overlay.classList.add('idle-screen-overlay');
        this.overlay.innerHTML = `
            <div class="start-game-container">
                <img src="${startJourneyBg}" class="start-game-bg" alt="Start Journey">
                <button class="start-game-btn">
                    <img src="${startButtonImg}" alt="Start Game">
                </button>
            </div>
        `;

        // Force inline styles for reliability
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            z-index: 999999;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.5s ease;
        `;

        document.body.appendChild(this.overlay);

        // Setup button listener
        const btn = this.overlay.querySelector('.start-game-btn');
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.hide();
                if (this.onStart) this.onStart();
            });
        }
    }

    show() {
        if (this.overlay) {
            console.log('Showing Start Page');
            this.overlay.style.opacity = '1';
            this.overlay.style.pointerEvents = 'auto';

            // Trigger background reset when shown
            setTimeout(() => {
                window.dispatchEvent(new CustomEvent('gameReset'));
            }, 100);
        }
    }

    hide() {
        if (this.overlay) {
            console.log('Hiding Start Page');
            this.overlay.style.opacity = '0';
            this.overlay.style.pointerEvents = 'none';
        }
    }
}
