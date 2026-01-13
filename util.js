// Shared utility functions for the extension

// Developer mode state
let devMode = false;

// Initialize dev mode from storage
chrome.storage.sync.get(['devMode'], (result) => {
  devMode = result.devMode === true;
});

// Listen for dev mode changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.devMode) {
    devMode = changes.devMode.newValue === true;
  }
});

/**
 * Conditional logging function
 * Only logs when developer mode is enabled
 * @param {...any} args - Arguments to log
 */
function log(...args) {
  if (devMode) {
    console.log(...args);
  }
}

/**
 * Update dev mode state
 * @param {boolean} enabled - Whether dev mode should be enabled
 */
function setDevMode(enabled) {
  devMode = enabled;
}

/**
 * Get current dev mode state
 * @returns {boolean} Current dev mode state
 */
function getDevMode() {
  return devMode;
}
