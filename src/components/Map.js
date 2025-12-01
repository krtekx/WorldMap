import { locations } from '../data.js'
import { openModal } from './Modal.js'
import { resetIdleTimer } from './IdleTimer.js'
import { gems as initialGems } from '../gems.js'
import { openGemModal } from './GemModal.js'
import { initGemHints, isGemRevealed, resetGemSystem } from '../gemHints.js';

// Import map assets for proper Vite bundling
// Import map assets for proper Vite bundling
import tile16kAA from '../assets/16k_aa.jpg'
import tile16kAB from '../assets/16k_ab.jpg'
import tile16kBA from '../assets/16k_ba.jpg'
import tile16kAA from '../assets/16k_aa.jpg'
import tile16kAB from '../assets/16k_ab.jpg'
import tile16kBA from '../assets/16k_ba.jpg'
import tile16kBB from '../assets/16k_bb.jpg'
import map1k from '../assets/WorldMap_bg_1k.jpg'

// Import gem assets
import gem01 from '../assets/gems/gem_01.png'
import gem02 from '../assets/gems/gem_02.png'
import gem03 from '../assets/gems/gem_03.png'
import gem04 from '../assets/gems/gem_04.png'
import gem05 from '../assets/gems/gem_05.png'

const gemImages = {
    1: gem01,
    2: gem02,
    3: gem03,
    4: gem04,
    5: gem05
};

export function initMap(mapContainer, modalContainer) {
    // --- State ---
    let scale = 1;
    let panning = false;
    let pointX = 0;
    let pointY = 0;
    let startX = 0;
    let startY = 0;
    const ZOOM_MIN = 1;


    // Edit Mode State
    let isEditMode = false;
    let isDraggingPoint = false;
    let draggedPointId = null;
    let currentLocations = [...locations]; // Local copy for editing

    // Gem State
    let currentGems = [...initialGems];
    let isAddingGems = false;
    let mouseCoords = { x: 0, y: 0 }; // Track mouse position for debug

    // Reference Map State
    let refOffsetX = 0;
    let refOffsetY = 0;
    let refScaleX = 1.0;
    let refScaleY = 1.0;
    let refOpacity = 0.5;
    let isDraggingRef = false;
    let refDragStartX = 0;
    let refDragStartY = 0;
    let refDragInitialOffsetX = 0;
    let refDragInitialOffsetY = 0;

    // Initialize gem hints system
    initGemHints(locations.length);

    // --- DOM Setup ---
    // Create a wrapper for content to transform (bg + points)
    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add('map-content-wrapper');
    mapContainer.appendChild(contentWrapper);

    // Setup background images (moved into wrapper)
    const bgContainer = document.createElement('div');
    bgContainer.classList.add('map-background-container');

    // 16K tiles (4 quadrants)
    const tiles16k = [
        { src: tile16kAA, position: 'top-left', element: null },
        { src: tile16kAB, position: 'top-right', element: null },
        { src: tile16kBA, position: 'bottom-left', element: null },
        { src: tile16kBB, position: 'bottom-right', element: null }
    ];

    // Create 16K tile container
    const tiles16kContainer = document.createElement('div');
    tiles16kContainer.classList.add('tiles-16k-container');
    tiles16kContainer.style.cssText = `
        position: relative;
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        z-index: 1;
    `;

    tiles16k.forEach(tile => {
        const img = document.createElement('img');
        img.src = tile.src;
        img.style.cssText = 'width: 100%; height: auto; display: block; object-fit: cover;';
        img.ondragstart = (e) => e.preventDefault();
        tiles16kContainer.appendChild(img);
        tile.element = img;
    });

    bgContainer.appendChild(tiles16kContainer);

    contentWrapper.appendChild(bgContainer);

    // Resolution Switching Logic REMOVED - Always using 16k tiles

    // Determine which 16K tile is at the center of the screen (for debug only)
    function get16kTileAtCenter() {
        const rect = mapContainer.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Convert screen center to map coordinates (percentage)
        const contentX = (centerX - currentX) / currentScale;
        const contentY = (centerY - currentY) / currentScale;
        const mapWidth = contentWrapper.offsetWidth;
        const mapHeight = contentWrapper.offsetHeight;
        const percentX = (contentX / mapWidth) * 100;
        const percentY = (contentY / mapHeight) * 100;

        // Determine which quadrant (tile) the center is in
        let tileName = '';
        if (percentY < 50) {
            tileName = percentX < 50 ? '16k_aa.jpg' : '16k_ab.jpg';
        } else {
            tileName = percentX < 50 ? '16k_ba.jpg' : '16k_bb.jpg';
        }

        return tileName;
    }

    // Initial Render
    // renderPoints(); // Moved after moveToLocation definition


    // --- Zoom & Pan Logic ---

    // State for smooth animation
    let currentScale = 1;
    let currentX = 0;
    let currentY = 0;

    let targetScale = 1;
    let targetX = 0;
    let targetY = 0;

    // Physics constants
    const ZOOM_MAX = 16;

    // Animation Callback
    let animationCompletionCallback = null;

    // Auto-reset timer
    let mapResetTimer;
    const MAP_RESET_DELAY = 60000; // 1 minute

    function resetMapTimer() {
        clearTimeout(mapResetTimer);
        mapResetTimer = setTimeout(() => {
            // Reset to initial state
            const minScale = getMinScale();
            targetScale = minScale;
            targetX = 0;
            targetY = 0;
            clampTargetPosition();
        }, MAP_RESET_DELAY);
    }

    // Initialize timer
    resetMapTimer();

    function getMinScale() {
        const containerWidth = mapContainer.offsetWidth;
        const containerHeight = mapContainer.offsetHeight;
        const contentWidth = contentWrapper.offsetWidth || containerWidth;
        const contentHeight = contentWrapper.offsetHeight || containerHeight;

        if (contentHeight === 0) return 1;

        return Math.max(1, containerHeight / contentHeight);
    }

    // Saved zoom level for navigation
    let savedZoomScale = null;

    // Move to specific location index (with zoom)
    function moveToLocation(index, shouldZoom = true) {
        if (index < 0 || index >= currentLocations.length) return;

        const loc = currentLocations[index];

        // Remove active class from all points
        const allPoints = contentWrapper.querySelectorAll('.map-point');
        allPoints.forEach(p => p.classList.remove('active'));

        // Add active class to current point
        const currentPoint = contentWrapper.querySelector(`.map-point[data-id="${loc.id}"]`);
        if (currentPoint) {
            currentPoint.classList.add('active');
        }

        // Zoom to point logic
        const rect = mapContainer.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Calculate pixel position of the point in the contentWrapper
        const mapWidth = contentWrapper.offsetWidth;
        const mapHeight = contentWrapper.offsetHeight;
        const pointPixelX = (loc.x / 100) * mapWidth;
        const pointPixelY = (loc.y / 100) * mapHeight;

        if (shouldZoom) {
            // Zoom in 2x (clamped) - only on first click
            let newScale = targetScale * 2;
            if (newScale < 2) newScale = 2;
            if (newScale > ZOOM_MAX) newScale = ZOOM_MAX;

            targetScale = newScale;
            savedZoomScale = newScale; // Save this zoom level
        } else {
            // Use saved zoom level for navigation
            if (savedZoomScale) {
                targetScale = savedZoomScale;
            }
        }

        // Center the point
        targetX = centerX - (pointPixelX * targetScale);
        targetY = centerY - (pointPixelY * targetScale);

        clampTargetPosition();

        // Set callback to open modal when animation finishes
        animationCompletionCallback = () => {
            openModal(loc, modalContainer, currentLocations, (newIndex) => {
                // Navigate with pan only (no zoom)
                moveToLocation(newIndex, false);
            });
            resetIdleTimer();
            resetMapTimer();
        };
    }


    // --- Render Points Helper ---
    function renderPoints() {
        // Remove existing points
        const existingPoints = contentWrapper.querySelectorAll('.map-point');
        existingPoints.forEach(p => p.remove());

        currentLocations.forEach((loc, index) => {
            const point = document.createElement('div');
            point.classList.add('map-point');
            if (isEditMode) point.classList.add('draggable');

            point.style.left = `${loc.x}%`;
            point.style.top = `${loc.y}%`;
            point.dataset.id = loc.id;

            // Label for Edit Mode
            const label = document.createElement('div');
            label.classList.add('map-point-label');
            label.textContent = loc.title;
            point.appendChild(label);

            // Click / Touch Handler
            const handleInteraction = (e) => {
                if (isEditMode) return; // Don't open modal in edit mode
                e.stopPropagation();

                resetIdleTimer();
                resetMapTimer();

                moveToLocation(index);
            };

            point.addEventListener('click', handleInteraction);
            point.addEventListener('touchstart', (e) => {
                if (!isEditMode) handleInteraction(e);
            }, { passive: true });

            // Drag Logic (Edit Mode)
            point.addEventListener('mousedown', (e) => {
                if (!isEditMode) return;
                e.stopPropagation();
                isDraggingPoint = true;
                draggedPointId = loc.id;
                point.classList.add('dragging');
            });

            contentWrapper.appendChild(point);
        });
    }

    // Initial Render
    renderPoints();

    // --- Render Gems Helper ---
    function renderGems() {
        // Remove existing gems
        const existingGems = contentWrapper.querySelectorAll('.gem-point');
        existingGems.forEach(g => g.remove());

        currentGems.forEach(gem => {
            const gemEl = document.createElement('div');
            gemEl.classList.add('gem-point');
            gemEl.style.left = `${gem.x}%`;
            gemEl.style.top = `${gem.y}%`;
            gemEl.dataset.id = gem.id;

            // Set background image based on gem type
            const gemType = gem.type || ((gem.id % 5) + 1);
            gemEl.style.backgroundImage = `url('${gemImages[gemType]}')`;

            // Click handler
            gemEl.addEventListener('click', (e) => {
                if (isEditMode || isAddingGems) return; // Don't open in edit mode
                e.stopPropagation();
                openGemModal(gem, modalContainer, gemImages[gemType]);
                resetIdleTimer();
                resetMapTimer();
            });

            contentWrapper.appendChild(gemEl);
        });

        // Update visibility based on current zoom
        updateGemVisibility();
    }

    // Update gem visibility based on zoom level and revealed state
    function updateGemVisibility() {
        const gems = contentWrapper.querySelectorAll('.gem-point');
        gems.forEach(gemEl => {
            const gemId = parseInt(gemEl.dataset.id);
            const isRevealed = isGemRevealed(gemId);

            // Visible if zoomed in OR if revealed
            if (currentScale >= 8 || isRevealed) {
                gemEl.classList.add('visible');

                // Add special styling for revealed gems at low zoom
                if (isRevealed && currentScale < 8) {
                    gemEl.classList.add('revealed-low-zoom');
                } else {
                    gemEl.classList.remove('revealed-low-zoom');
                }
            } else {
                gemEl.classList.remove('visible');
                gemEl.classList.remove('revealed-low-zoom');
            }
        });
    }

    // Listen for gem reveal events
    window.addEventListener('gemRevealed', () => {
        updateGemVisibility();
    });

    // Zoom Reset Listener (1 minute idle)
    window.addEventListener('zoomReset', () => {
        console.log('Zoom resetting to initial view...');
        const minScale = getMinScale();
        targetScale = minScale;
        targetX = 0;
        targetY = 0;
        clampTargetPosition();
    });

    // Game Reset Listener (from Idle Timer - 2 minutes idle)
    window.addEventListener('gameReset', () => {
        console.log('Game Resetting...');

        // 1. Reset storage
        resetGemSystem();

        // 2. Shuffle gem types among existing locations
        // Create array of types (3 of each 1-5)
        const types = [];
        for (let i = 1; i <= 5; i++) {
            for (let j = 0; j < 3; j++) types.push(i);
        }

        // Shuffle types
        for (let i = types.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [types[i], types[j]] = [types[j], types[i]];
        }

        // Assign new types to gems
        currentGems.forEach((gem, index) => {
            if (index < types.length) {
                gem.type = types[index];
            }
        });

        // 3. Re-initialize hints (will generate new random hints)
        initGemHints(locations.length);

        // 4. Re-render
        renderGems();

        // Reset zoom to initial state
        const minScale = getMinScale();
        targetScale = minScale;
        targetX = 0;
        targetY = 0;
        clampTargetPosition();
    });

    // Initial Gem Render
    renderGems();

    // Zoom controls removed - users can zoom with mouse wheel/pinch

    function clampTargetPosition() {
        const containerWidth = mapContainer.offsetWidth;
        const containerHeight = mapContainer.offsetHeight;
        const contentWidth = contentWrapper.offsetWidth;
        const contentHeight = contentWrapper.offsetHeight;

        const minScale = getMinScale();
        if (targetScale < minScale) targetScale = minScale;
        if (targetScale > ZOOM_MAX) targetScale = ZOOM_MAX;

        const maxTranslateX = 0;
        const minTranslateX = containerWidth - (contentWidth * targetScale);

        const maxTranslateY = 0;
        const minTranslateY = containerHeight - (contentHeight * targetScale);

        targetX = Math.min(Math.max(targetX, minTranslateX), maxTranslateX);
        targetY = Math.min(Math.max(targetY, minTranslateY), maxTranslateY);
    }

    // Easing function for smoother animation
    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    // Base LERP factor (replaces LERP_FACTOR)
    const BASE_LERP_FACTOR = 0.05; // A smaller base for more control with dynamic easing

    // Debug Panel
    let debugPanel = null;
    let productionData = { version: '...', prompts: 0, timeSpentMinutes: 0 };

    async function fetchProductionData() {
        try {
            const response = await fetch('/production.json');
            productionData = await response.json();
            updateDebugPanel(get16kTileAtCenter());
        } catch (e) {
            console.error('Failed to load production data', e);
        }
    }

    function formatTime(minutes) {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}h ${m}m`;
    }

    function createDebugPanel() {
        debugPanel = document.createElement('div');
        debugPanel.classList.add('debug-panel');
        debugPanel.innerHTML = `
            <div class="debug-version">v${productionData.version} | P: ${productionData.prompts} | T: ${formatTime(productionData.timeSpentMinutes)}</div>
            <div class="debug-date">${new Date().toLocaleDateString('cs-CZ')}</div>
            <div class="debug-bg">BG: <span class="debug-bg-name">...</span></div>
            <div class="debug-zoom">Zoom: <span class="debug-zoom-value">1.00x</span></div>
            <div class="debug-coords">X: <span class="debug-x">0</span>% Y: <span class="debug-y">0</span>%</div>
        `;
        document.body.appendChild(debugPanel);
    }

    function updateDebugPanel(currentBgName) {
        if (!debugPanel) return;
        const versionEl = debugPanel.querySelector('.debug-version');
        const bgNameEl = debugPanel.querySelector('.debug-bg-name');
        const zoomValueEl = debugPanel.querySelector('.debug-zoom-value');
        const xEl = debugPanel.querySelector('.debug-x');
        const yEl = debugPanel.querySelector('.debug-y');

        if (versionEl) versionEl.textContent = `v${productionData.version} | P: ${productionData.prompts} | T: ${formatTime(productionData.timeSpentMinutes)}`;
        if (bgNameEl) bgNameEl.textContent = currentBgName;
        if (zoomValueEl) zoomValueEl.textContent = `${currentScale.toFixed(2)}x`;
        if (xEl) xEl.textContent = mouseCoords.x.toFixed(1);
        if (yEl) yEl.textContent = mouseCoords.y.toFixed(1);
    }

    createDebugPanel();
    fetchProductionData();


    function updateTransform() {
        // Calculate distance to target for easing
        const distX = Math.abs(targetX - currentX);
        const distY = Math.abs(targetY - currentY);
        const distScale = Math.abs(targetScale - currentScale);
        const totalDist = Math.sqrt(distX * distX + distY * distY) + distScale * 100;

        // Use easing for smoother acceleration/deceleration
        const maxDist = 1000; // Normalize distance
        const normalizedDist = Math.min(totalDist / maxDist, 1);
        const easedProgress = easeInOutCubic(1 - normalizedDist);
        const dynamicLerp = BASE_LERP_FACTOR + (easedProgress * 0.05);

        // Smoothly interpolate current values to target values
        currentX += (targetX - currentX) * dynamicLerp;
        currentY += (targetY - currentY) * dynamicLerp;
        currentScale += (targetScale - currentScale) * dynamicLerp;

        // Stop animation if close enough
        const isSettled = Math.abs(targetX - currentX) < 0.5 &&
            Math.abs(targetY - currentY) < 0.5 &&
            Math.abs(targetScale - currentScale) < 0.005;

        if (isSettled) {
            currentX = targetX;
            currentY = targetY;
            currentScale = targetScale;

            // Trigger callback if set
            if (animationCompletionCallback) {
                animationCompletionCallback();
                animationCompletionCallback = null;
            }
        }

        // Update DOM
        contentWrapper.style.transform = `translate(${currentX}px, ${currentY}px) scale(${currentScale})`;

        // Update Resolution based on current scale
        const currentBgName = get16kTileAtCenter();

        // Update debug panel
        updateDebugPanel(currentBgName);

        // Update gem visibility based on zoom
        updateGemVisibility();

        // Sync global state for other functions if needed
        scale = currentScale;
        pointX = currentX;
        pointY = currentY;

        requestAnimationFrame(updateTransform);
    }

    // Start Animation Loop
    requestAnimationFrame(updateTransform);


    // --- Input Handlers ---

    // Wheel Zoom
    mapContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        resetIdleTimer();
        resetMapTimer();

        const rect = mapContainer.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Calculate mouse position relative to map content (before zoom)
        const contentMouseX = (mouseX - targetX) / targetScale;
        const contentMouseY = (mouseY - targetY) / targetScale;

        const delta = -e.deltaY;
        const zoomFactor = 1.2;

        if (delta > 0) {
            targetScale *= zoomFactor;
        } else {
            targetScale /= zoomFactor;
        }

        clampTargetPosition();

        // Adjust position to keep mouse over same map point
        // newTargetX = mouseX - (contentMouseX * newTargetScale)
        targetX = mouseX - (contentMouseX * targetScale);
        targetY = mouseY - (contentMouseY * targetScale);

        clampTargetPosition();
    }, { passive: false });

    // Double Click Zoom
    mapContainer.addEventListener('dblclick', (e) => {
        e.preventDefault();
        resetIdleTimer();
        resetMapTimer();

        const rect = mapContainer.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Target: Zoom 2x
        const zoomFactor = 2;
        let newScale = targetScale * zoomFactor;

        // If we are already near max, zoom out to min? Or just clamp?
        // User said "zoom ability to 4x always zoom 2x".
        // Let's just zoom in 2x until max.
        if (newScale > ZOOM_MAX) newScale = ZOOM_MAX;

        // Calculate center of container
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // We want the point under mouse (mouseX, mouseY) to move to center (centerX, centerY)
        // Map point under mouse:
        const mapPointX = (mouseX - targetX) / targetScale;
        const mapPointY = (mouseY - targetY) / targetScale;

        targetScale = newScale;

        // New position:
        // center = newTargetX + mapPointX * newScale
        // newTargetX = center - mapPointX * newScale
        targetX = centerX - (mapPointX * targetScale);
        targetY = centerY - (mapPointY * targetScale);

        clampTargetPosition();
    });

    // Touch / Mouse Pan & Pinch
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    let initialPinchDistance = null;
    let initialPinchScale = 1;

    function getDistance(touches) {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.hypot(dx, dy);
    }

    function getMidpoint(touches) {
        const x = (touches[0].clientX + touches[1].clientX) / 2;
        const y = (touches[0].clientY + touches[1].clientY) / 2;
        return { x, y };
    }

    function onPointerDown(e) {
        if (isEditMode && isDraggingPoint) return;

        resetIdleTimer();
        resetMapTimer();

        // Handle Touch
        if (e.touches) {
            if (e.touches.length === 1) {
                isDragging = true;
                lastX = e.touches[0].clientX;
                lastY = e.touches[0].clientY;
                mapContainer.style.cursor = 'grabbing';
            } else if (e.touches.length === 2) {
                isDragging = false; // Pinching, not panning
                initialPinchDistance = getDistance(e.touches);
                initialPinchScale = targetScale;

                // Also track midpoint for pan during pinch
                const mid = getMidpoint(e.touches);
                lastX = mid.x;
                lastY = mid.y;
            }
        } else {
            // Mouse
            isDragging = true;
            lastX = e.clientX;
            lastY = e.clientY;
            mapContainer.style.cursor = 'grabbing';
        }
    }

    function onPointerMove(e) {
        resetIdleTimer();
        resetMapTimer();

        // Track mouse coordinates for debug panel
        const clientX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
        const clientY = e.clientY || (e.touches ? e.touches[0].clientY : 0);
        const mapRect = mapContainer.getBoundingClientRect();
        const mouseX = clientX - mapRect.left;
        const mouseY = clientY - mapRect.top;

        // Convert to content coordinates (percentage)
        const contentX = (mouseX - currentX) / currentScale;
        const contentY = (mouseY - currentY) / currentScale;
        const mapWidth = contentWrapper.offsetWidth;
        const mapHeight = contentWrapper.offsetHeight;
        mouseCoords.x = (contentX / mapWidth) * 100;
        mouseCoords.y = (contentY / mapHeight) * 100;

        // --- Point Dragging (Edit Mode) ---
        if (isEditMode && isDraggingPoint && draggedPointId) {
            e.preventDefault();

            let percentX = mouseCoords.x;
            let percentY = mouseCoords.y;

            // Clamp to 0-100%
            percentX = Math.max(0, Math.min(100, percentX));
            percentY = Math.max(0, Math.min(100, percentY));

            const pointEl = contentWrapper.querySelector(`.map-point[data-id="${draggedPointId}"]`);
            if (pointEl) {
                pointEl.style.left = `${percentX}%`;
                pointEl.style.top = `${percentY}%`;
            }

            const locIndex = currentLocations.findIndex(l => l.id === draggedPointId);
            if (locIndex !== -1) {
                currentLocations[locIndex].x = Math.round(percentX * 10) / 10;
                currentLocations[locIndex].y = Math.round(percentY * 10) / 10;
            }

            // Update UI coordinate display
            const coordXEl = ui.querySelector('.coord-x');
            const coordYEl = ui.querySelector('.coord-y');
            if (coordXEl && coordYEl) {
                coordXEl.textContent = percentX.toFixed(1);
                coordYEl.textContent = percentY.toFixed(1);
            }

            return;
        }

        // --- Map Interaction ---
        if (e.touches && e.touches.length === 2) {
            // Pinch Zoom
            e.preventDefault();
            const dist = getDistance(e.touches);
            if (initialPinchDistance) {
                const scaleChange = dist / initialPinchDistance;
                targetScale = initialPinchScale * scaleChange;

                // Pan with midpoint
                const mid = getMidpoint(e.touches);
                const dx = mid.x - lastX;
                const dy = mid.y - lastY;

                // We need to adjust targetX/Y to zoom around midpoint? 
                // Simple approach: just pan the midpoint and let scale happen around center?
                // Better: Zoom around midpoint.
                // But for now, let's just update scale and pan.

                targetX += dx;
                targetY += dy;

                lastX = mid.x;
                lastY = mid.y;

                clampTargetPosition();
            }
        } else if (isDragging) {
            // Pan
            e.preventDefault();
            // clientX and clientY are already defined at the top of the function
            // const clientX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
            // const clientY = e.clientY || (e.touches ? e.touches[0].clientY : 0);

            const dx = clientX - lastX;
            const dy = clientY - lastY;

            targetX += dx;
            targetY += dy;

            lastX = clientX;
            lastY = clientY;

            clampTargetPosition();
        }
    }

    function onPointerUp(e) {
        // Handle gem adding mode
        if (isAddingGems && !isDragging) {
            const clientX = e.clientX || (e.changedTouches ? e.changedTouches[0].clientX : 0);
            const clientY = e.clientY || (e.changedTouches ? e.changedTouches[0].clientY : 0);

            // Check if click is on map (not on UI)
            if (e.target.closest('.edit-mode-ui') || e.target.closest('.map-point')) {
                return;
            }

            // Add new gem at clicked position
            const newGem = {
                id: currentGems.length + 1,
                x: Math.round(mouseCoords.x * 10) / 10,
                y: Math.round(mouseCoords.y * 10) / 10,
                code: generateGemCode()
            };
            currentGems.push(newGem);
            renderGems();
            return;
        }

        isDragging = false;
        initialPinchDistance = null;
        mapContainer.style.cursor = 'default';

        if (isDraggingPoint) {
            isDraggingPoint = false;
            const pointEl = contentWrapper.querySelector(`.map-point[data-id="${draggedPointId}"]`);
            if (pointEl) pointEl.classList.remove('dragging');
            draggedPointId = null;
        }
    }

    // Generate random gem code
    function generateGemCode() {
        const prefixes = ['TRA', 'MOR', 'JAP', 'IND', 'AUS', 'EGY', 'CHN'];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const number = Math.floor(Math.random() * 9000) + 1000;
        return `${prefix}-${number}`;
    }

    // Event Listeners
    mapContainer.addEventListener('mousedown', onPointerDown);
    mapContainer.addEventListener('touchstart', onPointerDown, { passive: false });

    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('touchmove', onPointerMove, { passive: false });

    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('touchend', onPointerUp);

    // Handle Window Resize
    window.addEventListener('resize', () => {
        clampTargetPosition();
    });

    // Ensure initial clamp after images load
    if (tiles16k[0].element) {
        tiles16k[0].element.onload = () => {
            clampTargetPosition();
            // Force immediate update
            currentX = targetX;
            currentY = targetY;
            currentScale = targetScale;
        };
    }


    // --- Edit Mode / Admin ---

    // Create Trigger
    const trigger = document.createElement('div');
    trigger.classList.add('admin-trigger');
    trigger.innerHTML = `
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
        </svg>
    `;
    trigger.title = 'Edit Mode';
    document.body.appendChild(trigger);

    // Create Reference Overlay
    const refOverlay = document.createElement('div');
    refOverlay.classList.add('reference-overlay');
    refOverlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url('${map1k}');
        background-size: cover;
        z-index: 10;
        opacity: 0;
        pointer-events: none;
        display: none;
    `;
    contentWrapper.insertBefore(refOverlay, contentWrapper.firstChild); // Insert before points

    // Create Transform Handles
    const topHandle = document.createElement('div');
    topHandle.classList.add('ref-handle', 'ref-handle-top');
    topHandle.innerHTML = '<div class="handle-line"></div>';
    refOverlay.appendChild(topHandle);

    const bottomHandle = document.createElement('div');
    bottomHandle.classList.add('ref-handle', 'ref-handle-bottom');
    bottomHandle.innerHTML = '<div class="handle-line"></div>';
    refOverlay.appendChild(bottomHandle);

    // Mouse Drag for Reference Overlay
    refOverlay.addEventListener('mousedown', (e) => {
        if (!isEditMode || !refOverlay.classList.contains('active')) return;

        // Check if clicking on a handle
        if (e.target.closest('.ref-handle')) return;

        isDraggingRef = true;
        refDragStartX = e.clientX;
        refDragStartY = e.clientY;
        refDragInitialOffsetX = refOffsetX;
        refDragInitialOffsetY = refOffsetY;
        refOverlay.style.cursor = 'grabbing';
        e.stopPropagation();
    });

    window.addEventListener('mousemove', (e) => {
        if (isDraggingRef) {
            const deltaX = e.clientX - refDragStartX;
            const deltaY = e.clientY - refDragStartY;

            refOffsetX = refDragInitialOffsetX + deltaX;
            refOffsetY = refDragInitialOffsetY + deltaY;

            // Update UI inputs
            ui.querySelector('.input-ref-x').value = refOffsetX.toFixed(1);
            ui.querySelector('.input-ref-y').value = refOffsetY.toFixed(1);

            updateReferenceTransform();
        }
    });

    window.addEventListener('mouseup', () => {
        if (isDraggingRef) {
            isDraggingRef = false;
            refOverlay.style.cursor = 'grab';
        }
    });

    // Handle dragging for scale
    let isDraggingHandle = false;
    let handleType = null;
    let handleStartY = 0;
    let handleInitialScaleY = 1;

    function onHandleMouseDown(e, type) {
        if (!isEditMode || !refOverlay.classList.contains('active')) return;

        isDraggingHandle = true;
        handleType = type;
        handleStartY = e.clientY;
        handleInitialScaleY = refScaleY;
        e.stopPropagation();
        e.preventDefault();
    }

    topHandle.addEventListener('mousedown', (e) => onHandleMouseDown(e, 'top'));
    bottomHandle.addEventListener('mousedown', (e) => onHandleMouseDown(e, 'bottom'));

    window.addEventListener('mousemove', (e) => {
        if (isDraggingHandle) {
            const deltaY = e.clientY - handleStartY;
            const scaleChange = deltaY / 500; // Sensitivity factor

            if (handleType === 'top') {
                // Top handle: adjust both position and scale
                refScaleY = Math.max(0.1, Math.min(3, handleInitialScaleY - scaleChange));
                // Adjust offset to keep bottom edge fixed
                const mapHeight = mapContainer.offsetHeight;
                refOffsetY = refDragInitialOffsetY + (handleInitialScaleY - refScaleY) * mapHeight;
            } else if (handleType === 'bottom') {
                // Bottom handle: just adjust scale
                refScaleY = Math.max(0.1, Math.min(3, handleInitialScaleY + scaleChange));
            }

            ui.querySelector('.input-ref-scaley').value = refScaleY.toFixed(2);
            ui.querySelector('.input-ref-y').value = refOffsetY.toFixed(1);
            updateReferenceTransform();
        }
    });

    window.addEventListener('mouseup', () => {
        if (isDraggingHandle) {
            isDraggingHandle = false;
            handleType = null;
        }
    });


    // Create UI
    const ui = document.createElement('div');
    ui.classList.add('edit-mode-ui');
    ui.innerHTML = `
        <button class="btn-close-edit">X</button>
        <div class="edit-mode-indicator">EDIT MODE ACTIVE</div>
        <div style="display: flex; gap: 10px; margin-bottom: 10px;">
            <button class="btn-toggle-ref">Toggle Reference Map</button>
            <button class="btn-toggle-gems">Add Gems Mode</button>
            <button class="btn-submit">Save Locations</button>
            <button class="btn-save-gems">Save Gems</button>
        </div>
        
        <div class="ref-controls-panel">
            <div class="ref-controls-title">Reference Map Controls</div>
            
            <div class="control-group">
                <label>Position X:</label>
                <button class="btn-adjust" data-action="x-minus">-</button>
                <input type="number" class="input-ref-x" value="0" step="0.1">
                <button class="btn-adjust" data-action="x-plus">+</button>
            </div>
            
            <div class="control-group">
                <label>Position Y:</label>
                <button class="btn-adjust" data-action="y-minus">-</button>
                <input type="number" class="input-ref-y" value="0" step="0.1">
                <button class="btn-adjust" data-action="y-plus">+</button>
            </div>
            
            <div class="control-group">
                <label>Scale X:</label>
                <button class="btn-adjust" data-action="scalex-minus">-</button>
                <input type="number" class="input-ref-scalex" value="1.0" step="0.01" min="0.1" max="3">
                <button class="btn-adjust" data-action="scalex-plus">+</button>
            </div>
            
            <div class="control-group">
                <label>Scale Y:</label>
                <button class="btn-adjust" data-action="scaley-minus">-</button>
                <input type="number" class="input-ref-scaley" value="1.0" step="0.01" min="0.1" max="3">
                <button class="btn-adjust" data-action="scaley-plus">+</button>
            </div>
            
            <div class="control-group">
                <label>Opacity:</label>
                <input type="range" class="input-ref-opacity" min="0" max="1" step="0.05" value="0.5">
                <span class="opacity-value">0.5</span>
            </div>
            
            <div class="control-group">
                <button class="btn-reset-ref">Reset Reference Map</button>
            </div>
            
            <div class="control-group">
                <button class="btn-auto-position">Auto-Position All Points</button>
            </div>
            
            <div class="coordinate-display">
                <div>Mouse: <span class="coord-x">--</span>%, <span class="coord-y">--</span>%</div>
            </div>
        </div>
    `;
    document.body.appendChild(ui);

    // Toggle Edit Mode
    const toggleEditMode = (active) => {
        isEditMode = active;
        if (isEditMode) {
            ui.classList.add('active');
            renderPoints(); // Re-render to add drag listeners
        } else {
            ui.classList.remove('active');
            refOverlay.classList.remove('active'); // Auto-hide overlay
            renderPoints(); // Re-render to remove drag listeners
        }
    };

    trigger.addEventListener('click', () => toggleEditMode(true));

    // Close Button
    ui.querySelector('.btn-close-edit').addEventListener('click', () => toggleEditMode(false));

    // Toggle Reference Overlay
    ui.querySelector('.btn-toggle-ref').addEventListener('click', () => {
        refOverlay.classList.toggle('active');
        if (refOverlay.classList.contains('active')) {
            refOverlay.style.display = 'block';
            refOverlay.style.pointerEvents = 'auto';
            refOverlay.style.opacity = refOpacity;
        } else {
            refOverlay.style.display = 'none';
            refOverlay.style.pointerEvents = 'none';
            refOverlay.style.opacity = 0;
        }
    });

    // Toggle Add Gems Mode
    ui.querySelector('.btn-toggle-gems').addEventListener('click', (e) => {
        isAddingGems = !isAddingGems;
        e.target.textContent = isAddingGems ? 'Stop Adding Gems' : 'Add Gems Mode';
        e.target.style.backgroundColor = isAddingGems ? '#FF6B6B' : '';
        mapContainer.style.cursor = isAddingGems ? 'crosshair' : 'default';
    });

    // Save Locations
    ui.querySelector('.btn-submit').addEventListener('click', () => {
        const locDataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentLocations, null, 2));
        const locDownloadNode = document.createElement('a');
        locDownloadNode.setAttribute("href", locDataStr);
        locDownloadNode.setAttribute("download", "locations.json");
        document.body.appendChild(locDownloadNode);
        locDownloadNode.click();
        locDownloadNode.remove();
    });

    // Save Gems
    ui.querySelector('.btn-save-gems').addEventListener('click', () => {
        const gemDataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentGems, null, 2));
        const gemDownloadNode = document.createElement('a');
        gemDownloadNode.setAttribute("href", gemDataStr);
        gemDownloadNode.setAttribute("download", "gems.json");
        document.body.appendChild(gemDownloadNode);
        gemDownloadNode.click();
        gemDownloadNode.remove();
    });

    // --- Reference Map Controls ---

    // Update Reference Transform
    function updateReferenceTransform() {
        refOverlay.style.transform = `translate(${refOffsetX}px, ${refOffsetY}px) scale(${refScaleX}, ${refScaleY})`;
        refOverlay.style.opacity = refOpacity;
    }

    // Position X Controls
    ui.querySelector('[data-action="x-minus"]').addEventListener('click', () => {
        refOffsetX -= 0.1;
        ui.querySelector('.input-ref-x').value = refOffsetX.toFixed(1);
        updateReferenceTransform();
    });

    ui.querySelector('[data-action="x-plus"]').addEventListener('click', () => {
        refOffsetX += 0.1;
        ui.querySelector('.input-ref-x').value = refOffsetX.toFixed(1);
        updateReferenceTransform();
    });

    ui.querySelector('.input-ref-x').addEventListener('input', (e) => {
        refOffsetX = parseFloat(e.target.value) || 0;
        updateReferenceTransform();
    });

    // Position Y Controls
    ui.querySelector('[data-action="y-minus"]').addEventListener('click', () => {
        refOffsetY -= 0.1;
        ui.querySelector('.input-ref-y').value = refOffsetY.toFixed(1);
        updateReferenceTransform();
    });

    ui.querySelector('[data-action="y-plus"]').addEventListener('click', () => {
        refOffsetY += 0.1;
        ui.querySelector('.input-ref-y').value = refOffsetY.toFixed(1);
        updateReferenceTransform();
    });

    ui.querySelector('.input-ref-y').addEventListener('input', (e) => {
        refOffsetY = parseFloat(e.target.value) || 0;
        updateReferenceTransform();
    });

    // Scale X Controls
    ui.querySelector('[data-action="scalex-minus"]').addEventListener('click', () => {
        refScaleX = Math.max(0.1, refScaleX - 0.01);
        ui.querySelector('.input-ref-scalex').value = refScaleX.toFixed(2);
        updateReferenceTransform();
    });

    ui.querySelector('[data-action="scalex-plus"]').addEventListener('click', () => {
        refScaleX = Math.min(3, refScaleX + 0.01);
        ui.querySelector('.input-ref-scalex').value = refScaleX.toFixed(2);
        updateReferenceTransform();
    });

    ui.querySelector('.input-ref-scalex').addEventListener('input', (e) => {
        refScaleX = parseFloat(e.target.value) || 1;
        updateReferenceTransform();
    });

    // Scale Y Controls
    ui.querySelector('[data-action="scaley-minus"]').addEventListener('click', () => {
        refScaleY = Math.max(0.1, refScaleY - 0.01);
        ui.querySelector('.input-ref-scaley').value = refScaleY.toFixed(2);
        updateReferenceTransform();
    });

    ui.querySelector('[data-action="scaley-plus"]').addEventListener('click', () => {
        refScaleY = Math.min(3, refScaleY + 0.01);
        ui.querySelector('.input-ref-scaley').value = refScaleY.toFixed(2);
        updateReferenceTransform();
    });

    ui.querySelector('.input-ref-scaley').addEventListener('input', (e) => {
        refScaleY = parseFloat(e.target.value) || 1;
        updateReferenceTransform();
    });

    // Opacity Control
    ui.querySelector('.input-ref-opacity').addEventListener('input', (e) => {
        refOpacity = parseFloat(e.target.value);
        ui.querySelector('.opacity-value').textContent = refOpacity.toFixed(2);
        updateReferenceTransform();
    });

    // Reset Reference Map
    ui.querySelector('.btn-reset-ref').addEventListener('click', () => {
        refOffsetX = 0;
        refOffsetY = 0;
        refScaleX = 1.0;
        refScaleY = 1.0;
        refOpacity = 0.5;

        ui.querySelector('.input-ref-x').value = 0;
        ui.querySelector('.input-ref-y').value = 0;
        ui.querySelector('.input-ref-scalex').value = 1.0;
        ui.querySelector('.input-ref-scaley').value = 1.0;
        ui.querySelector('.input-ref-opacity').value = 0.5;
        ui.querySelector('.opacity-value').textContent = '0.50';

        updateReferenceTransform();
    });

    // Mouse Coordinate Display
    mapContainer.addEventListener('mousemove', (e) => {
        if (!isEditMode) return;

        const mapRect = mapContainer.getBoundingClientRect();
        const mouseRelX = e.clientX - mapRect.left - pointX;
        const mouseRelY = e.clientY - mapRect.top - pointY;

        let percentX = (mouseRelX / (mapRect.width * scale)) * 100;
        let percentY = (mouseRelY / (mapRect.height * scale)) * 100;

        percentX = Math.max(0, Math.min(100, percentX));
        percentY = Math.max(0, Math.min(100, percentY));

        ui.querySelector('.coord-x').textContent = percentX.toFixed(1);
        ui.querySelector('.coord-y').textContent = percentY.toFixed(1);
    });

    // Auto-Position All Points
    ui.querySelector('.btn-auto-position').addEventListener('click', () => {
        // Convert lat/lng to Mercator projection percentages
        function latLngToMercatorPercent(lat, lng) {
            // Mercator projection formulas
            // Longitude: simple linear mapping from -180 to 180 -> 0% to 100%
            const x = ((lng + 180) / 360) * 100;

            // Latitude: Mercator projection (non-linear)
            // Convert latitude to radians
            const latRad = lat * Math.PI / 180;
            // Mercator Y formula
            const mercatorY = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
            // Normalize to 0-100% (typical Mercator bounds are approximately ±85.05°)
            // Map from ~-π to ~π range to 0-100%
            const y = (1 - (mercatorY / Math.PI)) * 50;

            return { x, y };
        }

        // Get the map content dimensions (this is what the points are relative to)
        const mapWidth = contentWrapper.offsetWidth;
        const mapHeight = contentWrapper.offsetHeight;

        // Update all locations with calculated positions
        currentLocations.forEach(loc => {
            if (loc.lat !== undefined && loc.lng !== undefined) {
                // Step 1: Convert lat/lng to Mercator percentages (0-100%)
                const mercator = latLngToMercatorPercent(loc.lat, loc.lng);

                // Step 2: Convert Mercator percentages to pixel positions on the reference map
                // The reference map is 100% width/height of the contentWrapper
                let refPixelX = (mercator.x / 100) * mapWidth;
                let refPixelY = (mercator.y / 100) * mapHeight;

                // Step 3: Apply reference map transformations
                // The reference map is transformed with: translate(refOffsetX, refOffsetY) scale(refScaleX, refScaleY)
                // Transform origin is top-left (0, 0)

                // Apply scale first (around origin)
                refPixelX = refPixelX * refScaleX;
                refPixelY = refPixelY * refScaleY;

                // Then apply translation
                refPixelX = refPixelX + refOffsetX;
                refPixelY = refPixelY + refOffsetY;

                // Step 4: Convert back to percentages relative to the contentWrapper
                const finalX = (refPixelX / mapWidth) * 100;
                const finalY = (refPixelY / mapHeight) * 100;

                // Step 5: Update location data
                loc.x = Math.round(finalX * 10) / 10; // Round to 1 decimal place
                loc.y = Math.round(finalY * 10) / 10;
            }
        });

        // Re-render points with new positions
        renderPoints();

        alert('All points have been auto-positioned based on their geographic coordinates and the current reference map alignment!');
    });

    // Global click to reset timer
    document.addEventListener('click', resetIdleTimer);
    document.addEventListener('touchstart', resetIdleTimer, { passive: true });
}
