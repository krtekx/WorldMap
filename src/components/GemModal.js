let currentGemModal = null;

export function openGemModal(gem, container, gemImageSrc) {
    closeGemModal();

    const overlay = document.createElement('div');
    overlay.classList.add('gem-modal-overlay');

    // Determine gem image
    const gemImage = gemImageSrc;

    overlay.innerHTML = `
        <div class="gem-modal-content">
            <div class="gem-modal-icon">
                <img src="${gemImage}" alt="Gem" style="width: 80px; height: 80px; object-fit: contain;">
            </div>
            <h2 class="gem-modal-title">Hidden Artifact Found!</h2>
            <p class="gem-modal-subtitle">You have discovered a secret location.</p>
            <div class="gem-modal-code-label">SECRET CODE</div>
            <div class="gem-modal-code">${gem.code}</div>
            <button class="gem-modal-close">Close</button>
        </div>
    `;

    container.appendChild(overlay);

    requestAnimationFrame(() => {
        overlay.classList.add('active');
    });

    const closeBtn = overlay.querySelector('.gem-modal-close');
    closeBtn.addEventListener('click', closeGemModal);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeGemModal();
        }
    });

    currentGemModal = overlay;
}

export function closeGemModal() {
    if (currentGemModal) {
        const overlay = currentGemModal;
        overlay.classList.remove('active');

        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 500);

        currentGemModal = null;
    }
}
