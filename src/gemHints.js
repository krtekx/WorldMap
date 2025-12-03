// Gem Hints System
// Maps location IDs to gem types for the collection game

const STORAGE_KEY = 'antigravity_gem_hints';
const REVEALED_GEMS_KEY = 'antigravity_revealed_gems';

// Initialize or load gem hints from localStorage
export function initGemHints(totalLocations = 25) {
    let hints = loadGemHints();

    if (!hints || Object.keys(hints).length === 0) {
        // Generate random hints: 5 random locations, one for each gem type
        hints = generateRandomHints(totalLocations);
        saveGemHints(hints);
    }

    return hints;
}

// Generate random location-to-gem-type mapping
function generateRandomHints(totalLocations) {
    const hints = {};
    const gemTypes = [1, 2, 3, 4, 5];
    const availableLocations = Array.from({ length: totalLocations }, (_, i) => i + 1);

    // Shuffle and pick 5 random locations
    const shuffled = availableLocations.sort(() => Math.random() - 0.5);
    const selectedLocations = shuffled.slice(0, 5);

    // Assign each gem type to a location
    selectedLocations.forEach((locationId, index) => {
        hints[locationId] = gemTypes[index];
    });

    return hints;
}

// Load hints from localStorage
export function loadGemHints() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch (e) {
        console.error('Error loading gem hints:', e);
        return {};
    }
}

// Save hints to localStorage
export function saveGemHints(hints) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(hints));
    } catch (e) {
        console.error('Error saving gem hints:', e);
    }
}

// Get gem type for a specific location (or null if no hint)
export function getGemHintForLocation(locationId) {
    const hints = loadGemHints();
    return hints[locationId] || null;
}

// Load revealed gems from localStorage
export function loadRevealedGems() {
    try {
        const stored = localStorage.getItem(REVEALED_GEMS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error('Error loading revealed gems:', e);
        return [];
    }
}

// Save revealed gems to localStorage
export function saveRevealedGems(revealedGemIds) {
    try {
        localStorage.setItem(REVEALED_GEMS_KEY, JSON.stringify(revealedGemIds));
    } catch (e) {
        console.error('Error saving revealed gems:', e);
    }
}

// Reveal all gems of a specific type
export function revealGemType(gemType, allGems) {
    const revealedGems = loadRevealedGems();

    // Find all gem IDs of this type
    const gemsOfType = allGems
        .filter(gem => gem.type === gemType)
        .map(gem => gem.id);

    // Add to revealed list (avoid duplicates)
    const updatedRevealed = [...new Set([...revealedGems, ...gemsOfType])];

    saveRevealedGems(updatedRevealed);
    return updatedRevealed;
}

// Check if a gem is revealed
export function isGemRevealed(gemId) {
    const revealedGems = loadRevealedGems();
    return revealedGems.includes(gemId);
}

// Reset all hints and revealed gems (for testing)
export function resetGemSystem() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(REVEALED_GEMS_KEY);
}
