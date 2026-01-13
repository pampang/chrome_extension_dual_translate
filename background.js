// Background service worker
// Import shared utilities
importScripts('util.js');

chrome.runtime.onInstalled.addListener(() => {
log('灵犀翻译扩展已安装');

  // Set default settings
  chrome.storage.sync.set({
    displayMode: 'normal',
    translationApi: 'google',
    devMode: false
  });
});
// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  log('[Background] Received message:', request);
  if (request.action === 'getTranslation') {
    // Handle translation requests if needed
    sendResponse({ status: 'ok' });
  }
  return true;
});
