import { closeModal } from './Modal.js';
import { StartPage } from './StartPage.js';

let idleTimeout;
let zoomResetTimeout;
const ZOOM_RESET_LIMIT = 60000; // 1 minute in ms
const IDLE_LIMIT = 120000; // 2 minutes in ms
let startPage = null;

export function initIdleTimer() {
    console.log('=== IDLE TIMER INIT START ===');

    // Initialize Start Page
    startPage = new StartPage(() => {
        // Callback when Start Game is clicked
        console.log('Start Game clicked - starting idle tracking');
        startIdleTracking();
    });

    // Always show on initialization (every reload)
    console.log('Initializing IdleTimer - Showing Start Page');

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
        startPage.show();
        // Trigger game reset in background
        setTimeout(() => {
            window.dispatchEvent(new CustomEvent('gameReset'));
        }, 100);
    });

    console.log('=== IDLE TIMER INIT END ===');
}

function startIdleTracking() {
    console.log('Starting idle tracking...');
    resetIdleTimer();

    // Events that reset the timer
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
        document.addEventListener(event, resetIdleTimer, { passive: true });
    });
}

export function resetIdleTimer() {
    clearTimeout(idleTimeout);
    clearTimeout(zoomResetTimeout);
    // hideIdleScreen(); // This is now handled by StartPage component when its callback is triggered

    // Set 1-minute timer for zoom reset
    zoomResetTimeout = setTimeout(onZoomReset, ZOOM_RESET_LIMIT);

    // Set 2-minute timer for Start Game page
    idleTimeout = setTimeout(onIdle, IDLE_LIMIT);
}

function onZoomReset() {
    console.log('1 minute idle - resetting zoom...');
    window.dispatchEvent(new CustomEvent('zoomReset'));
}

function onIdle() {
    console.log('2 minutes idle - showing Start Game page...');
    closeModal();
    if (startPage) {
        startPage.show();
    }
    // Trigger game reset when idle screen appears
    window.dispatchEvent(new CustomEvent('gameReset'));
}
