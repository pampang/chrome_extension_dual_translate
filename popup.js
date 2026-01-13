log('[Popup] Popup script loaded');

let apiConfigs = [];
let selectedConfigId = null;
let editingConfigId = null;

// Load saved settings
log('[Popup] Loading saved settings...');
chrome.storage.sync.get(['displayMode', 'translationApi', 'devMode', 'apiConfigs', 'selectedConfigId', 'hideFloatingButton'], (result) => {
  const mode = result.displayMode || 'normal';
  const api = result.translationApi || 'google';
  const devModeValue = result.devMode === true;
  const hideButton = result.hideFloatingButton === true;
  apiConfigs = result.apiConfigs || [];
  selectedConfigId = result.selectedConfigId || null;
  setDevMode(devModeValue);
  log('[Popup] Loaded display mode:', mode, 'translation API:', api, 'dev mode:', devModeValue, 'hideFloatingButton:', hideButton, 'configs:', apiConfigs.length);
  document.getElementById('displayMode').value = mode;
  document.getElementById('translationApi').value = api;
  document.getElementById('devMode').value = devModeValue ? 'true' : 'false';
  document.getElementById('hideFloatingButton').value = hideButton ? 'true' : 'false';

  // Show API config input if needed
  updateApiConfigVisibility(api);

  // Load config list
  loadConfigList();
});
// Developer mode change handler
document.getElementById('devMode').addEventListener('change', async (e) => {
  const devModeValue = e.target.value === 'true';
  setDevMode(devModeValue);
  log('[Popup] Developer mode changed to:', devModeValue);

  // Save state
  await chrome.storage.sync.set({ devMode: devModeValue });
  log('[Popup] Developer mode saved to storage');

  // Notify content script
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.sendMessage(tab.id, {
    action: 'updateDevMode',
    devMode: devModeValue
  }, (response) => {
    if (chrome.runtime.lastError) {
      console.error('[Popup] Error updating dev mode:', chrome.runtime.lastError);
    } else {
      log('[Popup] Dev mode updated, response:', response);
    }
  });

  updateStatus(`Dev Mode: ${devModeValue ? 'On 🔧' : 'Off'}`);
  setTimeout(() => updateStatus('Ready'), 2000);
});

// Hide floating button change handler
document.getElementById('hideFloatingButton').addEventListener('change', async (e) => {
  const hideButton = e.target.value === 'true';
  log('[Popup] Hide floating button changed to:', hideButton);

  // Save state
  await chrome.storage.sync.set({ hideFloatingButton: hideButton });
  log('[Popup] Hide floating button saved to storage');

  // Notify content script
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.sendMessage(tab.id, {
    action: 'updateHideFloatingButton',
    hide: hideButton
  }, (response) => {
    if (chrome.runtime.lastError) {
      console.error('[Popup] Error updating hide floating button:', chrome.runtime.lastError);
    } else {
      log('[Popup] Hide floating button updated, response:', response);
    }
  });

  updateStatus(`Floating Button: ${hideButton ? 'Hidden 🙈' : 'Visible 👁️'}`);
  setTimeout(() => updateStatus('Ready'), 2000);
});

// Translation API change handler
document.getElementById('translationApi').addEventListener('change', async (e) => {
  const api = e.target.value;
  log('[Popup] Translation API changed to:', api);

  // Save state
  await chrome.storage.sync.set({ translationApi: api });
  log('[Popup] Translation API saved to storage');

  // Update API config visibility
  updateApiConfigVisibility(api);

  const apiNames = {
    google: 'Google Translate 🔤',
    chrome: 'Chrome Built-in 🌐',
    openai: 'OpenAI Compatible 🤖'
  };

  updateStatus(`API: ${apiNames[api] || api}`);
  setTimeout(() => updateStatus('Ready'), 2000);
});

// Display mode change handler
document.getElementById('displayMode').addEventListener('change', async (e) => {
  const mode = e.target.value;
  log('[Popup] Display mode changed to:', mode);

  // Save state
  await chrome.storage.sync.set({ displayMode: mode });
  log('[Popup] Display mode saved to storage');

  // Send message to content script to update display mode
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  log('[Popup] Current tab:', tab);

  chrome.tabs.sendMessage(tab.id, {
    action: 'updateDisplayMode',
    mode: mode
  }, (response) => {
    if (chrome.runtime.lastError) {
      console.error('[Popup] Error updating display mode:', chrome.runtime.lastError);
      updateStatus('Error: ' + chrome.runtime.lastError.message);
    } else {
      log('[Popup] Display mode updated, response:', response);
      updateStatus(`Display mode: ${mode === 'learning' ? 'Learning 🎓' : 'Normal 📖'}`);
      setTimeout(() => updateStatus('Ready'), 2000);
    }
  });
});
// Translate now button
document.getElementById('translateNow').addEventListener('click', async () => {
  log('[Popup] Translate Now button clicked');

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  log('[Popup] Current tab:', tab);

  const mode = document.getElementById('displayMode').value;
  const api = document.getElementById('translationApi').value;
  log('[Popup] Display mode:', mode, 'Translation API:', api);

  // Save settings
  await chrome.storage.sync.set({ displayMode: mode, translationApi: api });
  log('[Popup] Settings saved');

  // Send translate message
  log('[Popup] Sending translateNow message to tab:', tab.id);
  chrome.tabs.sendMessage(tab.id, {
    action: 'translateNow',
    mode: mode,
    api: api
  }, (response) => {
    if (chrome.runtime.lastError) {
      console.error('[Popup] Error sending message:', chrome.runtime.lastError);
      updateStatus('Error: Please refresh the page');
    } else {
      log('[Popup] Translation started, response:', response);
      updateStatus('Translating... ⏳');
      setTimeout(() => updateStatus('Translation complete ✓'), 2000);
    }
  });
});

// Remove translations button
document.getElementById('removeTranslations').addEventListener('click', async () => {
  log('[Popup] Remove Translations button clicked');

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  log('[Popup] Current tab:', tab);

  log('[Popup] Sending removeTranslations message to tab:', tab.id);
  chrome.tabs.sendMessage(tab.id, {
    action: 'removeTranslations'
  }, (response) => {
    if (chrome.runtime.lastError) {
      console.error('[Popup] Error removing translations:', chrome.runtime.lastError);
      updateStatus('Error: Please refresh the page');
    } else {
      log('[Popup] Translations removed, response:', response);
      updateStatus('Translations removed');
      setTimeout(() => updateStatus('Ready'), 2000);
    }
  });
});

function updateStatus(message) {
  log('[Popup] Updating status:', message);
  const statusText = document.getElementById('statusText');
  if (statusText) {
    statusText.textContent = message;
  } else {
    console.error('[Popup] Status text element not found!');
  }
}

// Update API config input visibility based on selected API
function updateApiConfigVisibility(api) {
  const apiConfigContainer = document.getElementById('apiConfigContainer');

  if (api === 'openai') {
    apiConfigContainer.style.display = 'block';
  } else {
    apiConfigContainer.style.display = 'none';
  }
}

// Load config list into dropdown
function loadConfigList() {
  const configSelect = document.getElementById('configSelect');
  configSelect.innerHTML = '';

  if (apiConfigs.length === 0) {
    configSelect.innerHTML = '<option value="">-- No configurations --</option>';
    configSelect.disabled = true;
  } else {
    configSelect.disabled = false;
    apiConfigs.forEach(config => {
      const option = document.createElement('option');
      option.value = config.id;
      option.textContent = config.name;
      if (config.id === selectedConfigId) {
        option.selected = true;
      }
      configSelect.appendChild(option);
    });
  }
}

// Show config editor
function showConfigEditor(configId = null) {
  const editorSection = document.getElementById('configEditorSection');
  const deleteBtn = document.getElementById('deleteConfigBtn');

  editorSection.style.display = 'block';
  editingConfigId = configId;

  if (configId) {
    // Edit existing config
    const config = apiConfigs.find(c => c.id === configId);
    if (config) {
      document.getElementById('configNameInput').value = config.name;
      document.getElementById('apiUrlInput').value = config.url;
      document.getElementById('apiKeyInput').value = config.key;
      document.getElementById('apiModelInput').value = config.model || '';
      deleteBtn.style.display = 'block';
    }
  } else {
    // New config
    document.getElementById('configNameInput').value = '';
    document.getElementById('apiUrlInput').value = '';
    document.getElementById('apiKeyInput').value = '';
    document.getElementById('apiModelInput').value = '';
    deleteBtn.style.display = 'none';
  }
}

// Hide config editor
function hideConfigEditor() {
  document.getElementById('configEditorSection').style.display = 'none';
  editingConfigId = null;
}

// Generate unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// New config button
document.getElementById('newConfigBtn').addEventListener('click', () => {
  showConfigEditor(null);
});

// Config select change
document.getElementById('configSelect').addEventListener('change', async (e) => {
  selectedConfigId = e.target.value || null;
  await chrome.storage.sync.set({ selectedConfigId });
  log('[Popup] Selected config changed to:', selectedConfigId);

  // If a config is selected, show it in editor
  if (selectedConfigId) {
    showConfigEditor(selectedConfigId);
    updateStatus('Configuration selected ✓');
  } else {
    hideConfigEditor();
  }

  setTimeout(() => updateStatus('Ready'), 2000);
});

// Save config button
document.getElementById('saveConfigBtn').addEventListener('click', async () => {
  const name = document.getElementById('configNameInput').value.trim();
  const url = document.getElementById('apiUrlInput').value.trim();
  const key = document.getElementById('apiKeyInput').value.trim();
  const model = document.getElementById('apiModelInput').value.trim();

  if (!name) {
    updateStatus('Please enter a configuration name');
    return;
  }

  if (!url || !key) {
    updateStatus('Please enter API URL and Key');
    return;
  }

  if (editingConfigId) {
    // Update existing config
    const index = apiConfigs.findIndex(c => c.id === editingConfigId);
    if (index !== -1) {
      apiConfigs[index] = { id: editingConfigId, name, url, key, model };
    }
  } else {
    // Create new config
    const newConfig = {
      id: generateId(),
      name,
      url,
      key,
      model
    };
    apiConfigs.push(newConfig);
    selectedConfigId = newConfig.id;
  }

  await chrome.storage.sync.set({ apiConfigs, selectedConfigId });
  log('[Popup] Config saved:', { name, url, model, keyLength: key.length });

  loadConfigList();
  hideConfigEditor();
  updateStatus('Configuration saved ✓');

  setTimeout(() => updateStatus('Ready'), 2000);
});

// Delete config button
document.getElementById('deleteConfigBtn').addEventListener('click', async () => {
  if (!editingConfigId) return;

  if (!confirm('Are you sure you want to delete this configuration?')) {
    return;
  }

  apiConfigs = apiConfigs.filter(c => c.id !== editingConfigId);

  if (selectedConfigId === editingConfigId) {
    selectedConfigId = apiConfigs.length > 0 ? apiConfigs[0].id : null;
  }

  await chrome.storage.sync.set({ apiConfigs, selectedConfigId });
  log('[Popup] Config deleted:', editingConfigId);

  loadConfigList();
  hideConfigEditor();
  updateStatus('Configuration deleted');

  setTimeout(() => updateStatus('Ready'), 2000);
});

// Cancel config button
document.getElementById('cancelConfigBtn').addEventListener('click', () => {
  hideConfigEditor();
  updateStatus('Cancelled');
  setTimeout(() => updateStatus('Ready'), 1000);
});
