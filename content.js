// Translation state
let translationEnabled = false;
let translatedNodes = new WeakSet();
let isTranslating = false;
let displayMode = 'normal'; // 'normal' or 'learning'
let translationApi = 'google'; // 'google', 'chrome', 'openai'
let apiConfigs = []; // Store multiple OpenAI-compatible API configs
let selectedConfigId = null; // Currently selected config ID
let hideFloatingButton = false; // Hide floating button option

// Rate limiting and concurrency control
let activeTranslations = 0;
let maxConcurrentTranslations = 3; // Maximum concurrent translations
let translationDelay = 300; // Delay between translation requests (ms)
// Speed presets
const SPEED_PRESETS = {
  slow: { concurrent: 3, delay: 500 },
  medium: { concurrent: 3, delay: 300 },
  fast: { concurrent: 10, delay: 200 }
};

// Lazy loading with Intersection Observer
let intersectionObserver = null;
let pendingElements = new Set(); // Elements waiting to be translated
// Initialize
log('[Content] Content script loaded');
chrome.storage.sync.get(['translationEnabled', 'displayMode', 'translationApi', 'apiConfigs', 'selectedConfigId', 'hideFloatingButton'], (result) => {
  translationEnabled = result.translationEnabled === true;
  displayMode = result.displayMode || 'normal';
  translationApi = result.translationApi || 'google';
  apiConfigs = result.apiConfigs || [];
  selectedConfigId = result.selectedConfigId || null;
  hideFloatingButton = result.hideFloatingButton === true;

  log('[Content] Initialized - translationEnabled:', translationEnabled, 'displayMode:', displayMode, 'translationApi:', translationApi, 'configs:', apiConfigs.length, 'hideFloatingButton:', hideFloatingButton);

  // Create floating button after loading settings
  createFloatingButton();
});

// Apply speed settings
function applySpeedSettings(speed) {
  const preset = SPEED_PRESETS[speed] || SPEED_PRESETS.medium;
  maxConcurrentTranslations = preset.concurrent;
  translationDelay = preset.delay;
  log('[Content] Speed settings applied:', speed, '- concurrent:', maxConcurrentTranslations, 'delay:', translationDelay);
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  log('[Content] Received message:', request);

  if (request.action === 'translateNow') {
    log('[Content] Starting translation...');
    translationEnabled = true;
    if (request.mode) {
      displayMode = request.mode;
      log('[Content] Display mode set to:', displayMode);
    }
    if (request.api) {
      translationApi = request.api;
      log('[Content] Translation API set to:', translationApi);
    }
    translatePage();
    sendResponse({ status: 'translating' });
    log('[Content] Translation initiated');
  } else if (request.action === 'removeTranslations') {
    log('[Content] Removing translations...');
    translationEnabled = false;
    removeTranslations();
    sendResponse({ status: 'removed' });
    log('[Content] Translations removed');
  } else if (request.action === 'updateDisplayMode') {
    log('[Content] Updating display mode to:', request.mode);
    displayMode = request.mode;
    updateDisplayMode();
    sendResponse({ status: 'updated' });
    log('[Content] Display mode updated');
  } else if (request.action === 'updateDevMode') {
    log('[Content] Updating dev mode to:', request.devMode);
    setDevMode(request.devMode);
    sendResponse({ status: 'updated' });
    log('[Content] Dev mode updated');
} else if (request.action === 'updateHideFloatingButton') {
    log('[Content] Updating hide floating button to:', request.hide);
    hideFloatingButton = request.hide;
    updateFloatingButtonVisibility();
    sendResponse({ status: 'updated' });
    log('[Content] Hide floating button updated');
  }
  return true;
});

// Update display mode for existing translations
function updateDisplayMode() {
  const translatedElements = document.querySelectorAll('.bilingual-translation');
  log('[Content] Found', translatedElements.length, 'translated elements');

  translatedElements.forEach(element => {
    const zhSpan = element.querySelector('.translation-zh');
    if (zhSpan) {
      if (displayMode === 'learning') {
        zhSpan.classList.add('learning-mode');
      } else {
        zhSpan.classList.remove('learning-mode');
      }
    }
  });
  log('[Content] Display mode update complete');
}

async function translatePage() {
  log('[Content] translatePage called, isTranslating:', isTranslating);
  if (isTranslating) {
    log('[Content] Translation already in progress, skipping');
    return;
  }
  isTranslating = true;

  // Get all block elements
  log('[Content] Getting block elements from document.body');
  const blockElements = getBlockElements(document.body);
  log('[Content] Found', blockElements.length, 'block elements to translate');

  // Filter out already translated elements
  const elementsToTranslate = blockElements.filter(element => !translatedNodes.has(element));
  log('[Content] Elements to translate:', elementsToTranslate.length);

  // Setup lazy loading with Intersection Observer
  setupLazyTranslation(elementsToTranslate);

  log('[Content] Lazy translation setup completed');
  isTranslating = false;
}

// Translate elements in batches with concurrency control
async function translateElementsInBatches(elements) {
  for (let i = 0; i < elements.length; i++) {
    // Wait if we've reached the concurrent limit
    while (activeTranslations >= maxConcurrentTranslations) {
      await sleep(100); // Wait 100ms before checking again
    }

    const element = elements[i];
    activeTranslations++;

    // Start translation (don't await, let it run in background)
    translateElement(element).finally(() => {
      activeTranslations--;
    });

    // Add delay between starting translations to avoid rate limiting
    if (i < elements.length - 1) {
      await sleep(translationDelay);
    }
  }

  // Wait for all remaining translations to complete
  while (activeTranslations > 0) {
    await sleep(100);
  }
}

// Setup lazy translation with Intersection Observer
function setupLazyTranslation(elements) {
  log('[Content] Setting up lazy translation for', elements.length, 'elements');

  // Clear previous observer if exists
  if (intersectionObserver) {
    intersectionObserver.disconnect();
  }

  // Clear pending elements
  pendingElements.clear();

  // Add placeholder to elements
  elements.forEach(element => {
    if (!translatedNodes.has(element)) {
      // Add placeholder div
      const placeholder = document.createElement('div');
      placeholder.className = 'translation-zh translation-placeholder';
      placeholder.textContent = 'waiting...';
      placeholder.dataset.pending = 'true';

      element.classList.add('bilingual-translation');
      element.appendChild(placeholder);

      pendingElements.add(element);
    }
  });

  // Create Intersection Observer
  intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;

          // Check if element is pending translation
          if (pendingElements.has(element)) {
            log('[Content] Element entered viewport, translating:', element.tagName);

            // Remove from pending set
            pendingElements.delete(element);

            // Stop observing this element
            intersectionObserver.unobserve(element);

            // Translate with rate limiting
            queueTranslation(element);
          }
        }
      });
    },
    {
      root: null, // viewport
      rootMargin: '100px', // Start loading 100px before entering viewport
      threshold: 0.01 // Trigger when 1% visible
    }
  );

  // Observe all pending elements
  pendingElements.forEach(element => {
    intersectionObserver.observe(element);
  });

  log('[Content] Lazy translation observer setup completed');
}

// Queue translation with rate limiting
async function queueTranslation(element) {
  // Wait if we've reached the concurrent limit
  while (activeTranslations >= maxConcurrentTranslations) {
    await sleep(100);
  }

  activeTranslations++;

  // Remove placeholder
  const placeholder = element.querySelector('.translation-placeholder');
  if (placeholder) {
    placeholder.remove();
  }

  // Translate element
  try {
    await translateElement(element);
  } catch (error) {
    console.error('[Content] Translation error:', error);

    // Show error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'translation-zh translation-error';
    errorDiv.textContent = '❌ Translation failed';
    element.appendChild(errorDiv);
  } finally {
    activeTranslations--;
  }

  // Add delay for rate limiting
  await sleep(translationDelay);
}

// Helper function to sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getBlockElements(element) {
  const blockElements = [];

  // Block-level elements that should be translated as a whole
  const blockTags = ['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'TD', 'TH', 'BLOCKQUOTE', 'FIGCAPTION', 'LABEL', 'LEGEND', 'SUMMARY', 'CAPTION'];

  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_ELEMENT,
    {
      acceptNode: (node) => {
        // Skip script, style, and already translated nodes
        if (node.tagName === 'SCRIPT' ||
            node.tagName === 'STYLE' ||
            node.classList.contains('bilingual-translation') ||
            node.classList.contains('translation-floating-btn') ||
            translatedNodes.has(node)) {
          return NodeFilter.FILTER_REJECT;
        }

        // Only accept block-level elements
        if (!blockTags.includes(node.tagName)) {
          return NodeFilter.FILTER_SKIP;
        }

        // Check if this element has a block-level child that we'll process
        // If so, skip this element to avoid duplicate translation
        const hasBlockChild = Array.from(node.children).some(child =>
          blockTags.includes(child.tagName)
        );
        if (hasBlockChild) {
          return NodeFilter.FILTER_SKIP;
        }

        // Only process elements with meaningful English text
        const text = node.textContent.trim();
        if (text.length > 0 && hasEnglishContent(text)) {
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_SKIP;
      }
    }
  );

  let node;
  while (node = walker.nextNode()) {
    blockElements.push(node);
  }

  return blockElements;
}

function hasEnglishContent(text) {
  // Check if text contains English letters and is not just numbers/symbols
  const englishPattern = /[a-zA-Z]{2,}/;
  const chinesePattern = /[\u4e00-\u9fa5]/;

  // Has English and not already bilingual (contains Chinese)
  return englishPattern.test(text) && !chinesePattern.test(text);
}



// Translate a single node and immediately update DOM
async function translateElement(element) {
  const originalText = element.textContent.trim();
  if (!originalText || originalText.length < 3) return;

  log('[Content] Translating element:', element.tagName, originalText.substring(0, 50) + '...');

  try {
    // Translate text
    const translatedText = await translateText(originalText);
    log('[Content] Translation result:', translatedText ? translatedText.substring(0, 50) + '...' : 'null');

    if (translatedText && translatedText !== originalText) {
      // Store original HTML content
      const originalHTML = element.innerHTML;

      // Create translation div (block element)
      const zhDiv = document.createElement('div');
      zhDiv.className = 'translation-zh';
      if (displayMode === 'learning') {
        zhDiv.classList.add('learning-mode');
      }
      zhDiv.textContent = translatedText; // No parentheses

      // Mark element as translated
      element.classList.add('bilingual-translation');

      // Append translation after the original content
      element.appendChild(zhDiv);

      translatedNodes.add(element);
      log('[Content] Element translated and rendered to DOM');
    }
  } catch (error) {
    console.error('[Content] Translation error:', error);
  }
}

async function translateText(text) {
  log('[Content] Calling translation API for:', text.substring(0, 30) + '...', 'using API:', translationApi);

  switch (translationApi) {
    case 'chrome':
      return await translateWithChrome(text);
    case 'openai':
      return await translateWithOpenAI(text);
    case 'google':
    default:
      return await translateWithGoogle(text);
  }
}

// Chrome Built-in Translation API
// Reference: https://developer.chrome.com/docs/ai/translator-api
async function translateWithChrome(text) {
  log('[Content] Using Chrome Translation API');

  try {
    // Check if the Translator API is available
    if (!('Translator' in self)) {
      console.warn('[Content] Chrome Translator API not available, falling back to Google');
      return await translateWithGoogle(text);
    }

    // Check translator availability
    const availability = await Translator.availability({
      sourceLanguage: 'en',
      targetLanguage: 'zh'
    });

    log('[Content] Translator availability:', availability);

    if (availability === 'no') {
      console.warn('[Content] Chrome Translator not available for en->zh, falling back to Google');
      return await translateWithGoogle(text);
    }

    // Show download notification if needed
    if (availability === 'downloadable') {
      showDownloadNotification();
    }

    // Create translator with download progress monitor
    const translator = await Translator.create({
      sourceLanguage: 'en',
      targetLanguage: 'zh',
      monitor(m) {
        m.addEventListener('downloadprogress', (e) => {
          const progress = Math.round(e.loaded * 100);
          log(`[Content] Translation model downloaded ${progress}%`);
          updateDownloadNotification(progress);
        });
      }
    });

    log('[Content] Translator created successfully');
    hideDownloadNotification();

    // Translate the text
    const result = await translator.translate(text);
    log('[Content] Chrome translation result:', result);

    return result;
  } catch (error) {
    console.error('[Content] Chrome Translation API error:', error);
    log('[Content] Falling back to Google Translate');
    hideDownloadNotification();
    return await translateWithGoogle(text);
  }
}

// Show download notification
function showDownloadNotification() {
  let notification = document.getElementById('translation-download-notification');
  if (!notification) {
    notification = document.createElement('div');
    notification.id = 'translation-download-notification';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10001;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 14px;
      min-width: 250px;
    `;
    document.body.appendChild(notification);
  }
  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 10px;">
      <div style="width: 20px; height: 20px; border: 2px solid white; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
      <div>
        <div style="font-weight: 600;">Downloading translation model...</div>
        <div id="download-progress" style="font-size: 12px; margin-top: 4px;">Preparing...</div>
      </div>
    </div>
  `;

  // Add spin animation
  if (!document.getElementById('translation-spin-style')) {
    const style = document.createElement('style');
    style.id = 'translation-spin-style';
    style.textContent = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }
}

// Update download progress
function updateDownloadNotification(progress) {
  const progressElement = document.getElementById('download-progress');
  if (progressElement) {
    progressElement.textContent = `Progress: ${progress}%`;
  }
}

// Hide download notification
function hideDownloadNotification() {
  const notification = document.getElementById('translation-download-notification');
  if (notification) {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }
}

// Google Translate API
async function translateWithGoogle(text) {
  log('[Content] Using Google Translate API');

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&q=${encodeURIComponent(text)}`;
    log('[Content] API URL:', url);

    const response = await fetch(url);
    log('[Content] API response status:', response.status);

    const data = await response.json();
    log('[Content] API response data:', data);

    if (data && data[0] && Array.isArray(data[0])) {
      // Merge all translation segments
      const translationSegments = data[0];
      log('[Content] Found', translationSegments.length, 'translation segments');

      let fullTranslation = '';
      for (let i = 0; i < translationSegments.length; i++) {
        if (translationSegments[i] && translationSegments[i][0]) {
          fullTranslation += translationSegments[i][0];
          log(`[Content] Segment ${i}:`, translationSegments[i][0]);
        }
      }

      if (fullTranslation) {
        log('[Content] Full merged translation:', fullTranslation);
        return fullTranslation;
      }
    }
  } catch (error) {
    console.error('[Content] Google Translation API error:', error);
    // Fallback: return a placeholder
    return `[翻译: ${text.substring(0, 20)}...]`;
  }

  log('[Content] No translation found, returning null');
  return null;
}

// OpenAI-compatible API - Works with any OpenAI-compatible endpoint
async function translateWithOpenAI(text) {
  log('[Content] Using OpenAI-compatible API');

  // Find the selected config
  const selectedConfig = apiConfigs.find(config => config.id === selectedConfigId);

  if (!selectedConfig) {
    console.error('[Content] No API configuration selected');
    return '[请在设置中选择一个 API 配置]';
  }

  const { url, key, model } = selectedConfig;

  if (!url || !key) {
    console.error('[Content] OpenAI API URL or Key not configured');
    return '[请在设置中配置 API URL 和 API Key]';
  }

  try {
    // Ensure URL ends with /chat/completions
    let apiUrl = url.trim();
    if (!apiUrl.endsWith('/chat/completions')) {
      if (apiUrl.endsWith('/')) {
        apiUrl += 'chat/completions';
      } else {
        apiUrl += '/chat/completions';
      }
    }

    const requestBody = {
      model: model || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional translator. Translate the given English text to simplified Chinese. Only return the translation, no explanations.'
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    };

    log('[Content] API URL:', apiUrl);
    log('[Content] Request body:', requestBody);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    log('[Content] API response:', data);

    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content.trim();
    }
  } catch (error) {
    console.error('[Content] OpenAI API error:', error);
    return `[AI 翻译失败: ${error.message}]`;
  }

  return null;
}

// DOM observation removed - translation is now manual only

function removeTranslations() {
  log('[Content] Removing all translations');

  // Disconnect observer
  if (intersectionObserver) {
    intersectionObserver.disconnect();
    intersectionObserver = null;
  }

  // Clear pending elements
  pendingElements.clear();

  const translatedElements = document.querySelectorAll('.bilingual-translation');
  log('[Content] Found', translatedElements.length, 'elements to remove');

  translatedElements.forEach(element => {
    // Remove translation divs (including placeholders and errors)
    const translationDivs = element.querySelectorAll('.translation-zh');
    translationDivs.forEach(div => div.remove());

    // Remove bilingual class
    element.classList.remove('bilingual-translation');
  });

  translatedNodes = new WeakSet();
  log('[Content] All translations removed');
}

// Floating button functionality
function createFloatingButton() {
  log('[Content] Creating floating button');

  // Check if button already exists
  if (document.getElementById('translation-floating-btn')) {
    log('[Content] Floating button already exists');
    updateFloatingButtonVisibility();
    return;
  }

  const floatingBtn = document.createElement('div');
  floatingBtn.id = 'translation-floating-btn';
  floatingBtn.className = 'translation-floating-btn';
  floatingBtn.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" fill="currentColor"/>
    </svg>
  `;
  floatingBtn.title = 'Toggle Translation';

  // Add click event
  floatingBtn.addEventListener('click', toggleTranslation);

document.body.appendChild(floatingBtn);
  log('[Content] Floating button created and added to page');

  // Apply visibility setting
  updateFloatingButtonVisibility();
}

function updateFloatingButtonVisibility() {
  const floatingBtn = document.getElementById('translation-floating-btn');
  if (floatingBtn) {
    floatingBtn.style.display = hideFloatingButton ? 'none' : 'flex';
    log('[Content] Floating button visibility updated:', !hideFloatingButton);
  }
}

function toggleTranslation() {
  const floatingBtn = document.getElementById('translation-floating-btn');

  log('[Content] Floating button clicked, translationEnabled:', translationEnabled);

  if (translationEnabled) {
    // Remove translations
    log('[Content] Removing translations via floating button');
    translationEnabled = false;
    removeTranslations();
    floatingBtn.classList.remove('active');
    floatingBtn.title = 'Translate Page';
  } else {
    // Start translation
    log('[Content] Starting translation via floating button');
    translationEnabled = true;
    floatingBtn.classList.add('active');
    floatingBtn.title = 'Remove Translation';
    translatePage();
  }
}


