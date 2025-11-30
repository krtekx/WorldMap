import { getGemHintForLocation, revealGemType, isGemRevealed } from '../gemHints.js';
import { gems } from '../gems.js';

let currentModal = null;

export function openModal(data, container, allLocations = [], onNavigate = null) {
  // Close existing if any
  closeModal();

  const overlay = document.createElement('div');
  overlay.classList.add('modal-overlay');

  // Find current index
  const currentIndex = allLocations.findIndex(l => l.id === data.id);
  const prevIndex = (currentIndex - 1 + allLocations.length) % allLocations.length;
  const nextIndex = (currentIndex + 1) % allLocations.length;

  // Check for gem hint
  const gemType = getGemHintForLocation(data.id);
  let gemHintHtml = '';

  if (gemType) {
    const isRevealed = gems.some(g => g.type === gemType && isGemRevealed(g.id));
    const buttonText = isRevealed ? "Gems Revealed!" : "Unhide Gems on Map";
    const buttonClass = isRevealed ? "gem-reveal-btn disabled" : "gem-reveal-btn";
    const buttonDisabled = isRevealed ? "disabled" : "";

    gemHintHtml = `
        <div class="gem-hint-bar">
            <div class="gem-hint-content">
                <img src="/assets/gems/gem_0${gemType}.png" alt="Gem Hint" class="gem-hint-icon">
                <div class="gem-hint-text">
                    <strong>Hidden Gem Detected!</strong>
                    <span>This location holds a clue to finding rare crystals.</span>
                </div>
                <button class="${buttonClass}" data-gem-type="${gemType}" ${buttonDisabled}>
                    ${buttonText}
                </button>
            </div>
        </div>
      `;
  }

  overlay.innerHTML = `
    <div class="modal-content">
      <div class="modal-image-container">
        ${gemHintHtml}
        <img src="${data.image}" alt="${data.title}" class="modal-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
        <div class="modal-image-placeholder" style="display: none;">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#444" stroke-width="1">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
            </svg>
            <span>Chybí fotografie</span>
        </div>
        <div class="modal-region-tag">${data.region}</div>
      </div>
      <div class="modal-info">
        <button class="close-button">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
        <div class="modal-location-label">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
            </svg>
            LOKACE Č. ${data.id}
        </div>
        <h2 class="modal-title">${data.title}</h2>
        ${data.visitDate ? `<div class="modal-visit-date">Navštíveno: ${data.visitDate}</div>` : ''}
        <div class="modal-divider"></div>
        <p class="modal-description">${data.description}</p>
        
        <div class="modal-nav-buttons">
            <button class="nav-btn prev-btn">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                Předchozí
            </button>
            <button class="nav-btn next-btn">
                Další
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </button>
        </div>

        <div class="modal-footer">Sbírka L. V. Holzmaistera</div>
      </div>
    </div>
    `;

  container.appendChild(overlay);

  // Force reflow for transition
  requestAnimationFrame(() => {
    overlay.classList.add('active');
  });

  // Event listeners
  const closeBtn = overlay.querySelector('.close-button');
  closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal();
    }
  });

  // Gem Reveal Listener
  const revealBtn = overlay.querySelector('.gem-reveal-btn');
  if (revealBtn && !revealBtn.classList.contains('disabled')) {
    revealBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const gemType = parseInt(revealBtn.dataset.gemType);

      // Reveal gems
      revealGemType(gemType, gems);

      // Update button state
      revealBtn.textContent = "Gems Revealed!";
      revealBtn.classList.add('disabled');
      revealBtn.disabled = true;

      // Dispatch event to update map
      window.dispatchEvent(new CustomEvent('gemRevealed', { detail: { gemType } }));
    });
  }

  // Navigation Listeners
  if (onNavigate) {
    overlay.querySelector('.prev-btn').addEventListener('click', () => {
      // Start fade out
      overlay.classList.remove('active');
      // Wait for fade out, then navigate
      setTimeout(() => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
        currentModal = null;
        onNavigate(prevIndex);
      }, 3000); // 3 second fade out
    });

    overlay.querySelector('.next-btn').addEventListener('click', () => {
      // Start fade out
      overlay.classList.remove('active');
      // Wait for fade out, then navigate
      setTimeout(() => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
        currentModal = null;
        onNavigate(nextIndex);
      }, 3000); // 3 second fade out
    });
  }

  currentModal = overlay;
}

export function closeModal() {
  if (currentModal) {
    const overlay = currentModal;
    overlay.classList.remove('active');

    // Wait for transition to finish before removing
    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    }, 3000); // Match the new 3s transition

    currentModal = null;
  }
}
