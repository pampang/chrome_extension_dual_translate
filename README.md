# 灵犀翻译 Chrome 扩展

一个 Chrome 扩展，可将网页上的英文内容翻译为中文，并并排显示双语内容，提供双语阅读体验。

## Features

- 🌐 **Manual Translation**: Click to translate English text to Chinese on demand
- 🔄 **Multiple Translation APIs**: Choose from 3 different translation methods:
  - Google Translate (free, no setup)
  - Chrome Built-in (offline capable)
  - OpenAI-Compatible (works with any OpenAI-compatible API)
- 🤖 **Universal AI Support**: Compatible with OpenAI, DeepSeek, Groq, OpenRouter, Ollama, and more
- 🎓 **Learning Mode**: Translations are blurred by default, revealed on hover - perfect for language learning
- 📖 **Normal Mode**: Clear translations displayed alongside original text
- 🎯 **Smart Detection**: Only translates meaningful English content
- 🎨 **Clean UI**: Subtle, non-intrusive translation display with fixed floating button
- ⚡ **Easy Control**: Simple popup interface with one-click translation
- 🚀 **Performance Optimized**: Progressive rendering for smooth user experience
- 🔌 **Offline Capable**: Chrome built-in API works offline (when available)
- 🔧 **Developer Mode**: Optional console logging for debugging and development
- 📦 **Block-Level Translation**: Translates entire paragraphs and blocks while preserving internal HTML structure (bold, links, etc.)
- 🔑 **Secure API Storage**: Safely store your API configurations in Chrome's sync storage
- 🏠 **Local Model Support**: Works with locally hosted models (Ollama, LM Studio, etc.)
- 📋 **Multiple Configurations**: Save and manage multiple API configurations, switch between them easily
- ⚡ **Rate Limiting Control**: Adjustable translation speed to prevent API rate limit errors
- 👁️ **Lazy Loading**: Translations load only when elements enter viewport - saves tokens and improves performance
- 🎨 **Block Display**: Translations shown as distinct blocks with clean styling (no parentheses)

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked"
5. Select the `chrome-bilingual-translator` folder

## Usage

1. Visit any English webpage
2. Click the extension icon in your Chrome toolbar
3. Select your preferred translation API:
   - **Google Translate**: Uses Google's free translation service (requires internet)
   - **Chrome Built-in**: Uses browser's native translation API (faster, can work offline)
   - **OpenAI Compatible**: Use any OpenAI-compatible API (OpenAI, DeepSeek, Groq, etc.)
4. Select your preferred display mode:
   - **Normal**: Translations are clearly visible
   - **Learning Mode**: Translations are blurred until you hover over them (great for testing your comprehension!)
5. Select **Translation Speed** to control API call frequency:
   - **Slow (Safe)**: 3 concurrent requests, 500ms delay - Best for avoiding rate limits
   - **Medium**: 3 concurrent requests, 300ms delay - Balanced speed and safety (Default)
   - **Fast**: 5 concurrent requests, 200ms delay - Fastest, but may hit rate limits
6. Toggle **Developer Mode** if you need console logging for debugging (Off by default)
7. Click \"Translate Current Page\" to translate the page
8. Click \"Remove Translations\" to clear all translations
9. Use the **floating button** (fixed in top-right corner) to quickly toggle translations on/off
10. Navigate to a new page and repeat - translations are manual per page

## File Structure

```
chrome-bilingual-translator/
├── manifest.json          # Extension configuration
├── popup.html            # Extension popup interface
├── popup.js              # Popup logic
├── content.js            # Main translation logic
├── content.css           # Translation styling
├── background.js         # Background service worker
├── util.js               # Shared utility functions
├── test.html             # Test page for development
├── OPENAI_API_GUIDE.md   # OpenAI-compatible API configuration guide
├── icons/                # Extension icons (add your own)
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md            # This file
```

## Translation APIs

The extension supports **3 translation methods**:

### 1. Google Translate (Default)

- Uses Google Translate's free API endpoint
- Requires internet connection
- Works on all Chrome versions
- Good translation quality
- **No setup required**

### 2. Chrome Built-in Translation API

- Uses Chrome's native Translation API (experimental)
- Can work offline after initial download
- Faster performance
- Available in Chrome 120+ with enabled flags
- Automatically falls back to Google Translate if unavailable
- **No setup required**

### 3. OpenAI-Compatible API 🤖

- Works with **any OpenAI-compatible API endpoint**
- **Multiple Configuration Support**: Save and manage multiple API configurations
- Supports multiple providers:
  - **OpenAI** - GPT-3.5, GPT-4, etc.
  - **DeepSeek** - Excellent Chinese translation
  - **Groq** - Fastest speed with LLaMA models
  - **OpenRouter** - Access to multiple models
  - **Local models** - Ollama, LM Studio, etc.
  - And many more!
- **Easy Configuration Management**:
  - Add multiple API configurations with custom names
  - Switch between configurations with a dropdown
  - Edit or delete existing configurations
  - Each configuration includes: Name, API URL, API Key, and Model

#### OpenAI-Compatible API Examples

| Provider | API URL | Model Example |
|----------|---------|---------------|
| OpenAI | `https://api.openai.com/v1` | `gpt-3.5-turbo` |
| DeepSeek | `https://api.deepseek.com/v1` | `deepseek-chat` |
| Groq | `https://api.groq.com/openai/v1` | `llama-3.1-70b-versatile` |
| OpenRouter | `https://openrouter.ai/api/v1` | `meta-llama/llama-3.1-8b-instruct:free` |
| Ollama (Local) | `http://localhost:11434/v1` | `llama3` |

> 💡 **Tip**: Most AI providers offer free tiers or credits for new users!

> 📖 **For detailed setup instructions**, see [OPENAI_API_GUIDE.md](OPENAI_API_GUIDE.md)

> 📋 **Multiple Configurations**: You can save and manage multiple API configurations! See [MULTI_CONFIG_GUIDE.md](MULTI_CONFIG_GUIDE.md)

**Note**: To enable Chrome's built-in Translation API:

1. Navigate to `chrome://flags/#translation-api`
2. Enable "Translation API"
3. Restart Chrome

**API Details** (Reference: <https://developer.chrome.com/docs/ai/translator-api>):

- Uses global `Translator` object (not `window.translation`)
- Method: `Translator.availability({ sourceLanguage, targetLanguage })` returns:
  - `'available'`: Ready to use immediately
  - `'after-download'`: Available after downloading language model
  - `'no'`: Not available (will fallback to Google Translate)
- Method: `Translator.create({ sourceLanguage, targetLanguage, monitor })` creates translator instance
- Supports download progress monitoring via `monitor` callback
- Requires Chrome 120+ with experimental flag enabled

**Example Usage:**

```javascript
// Check availability
const availability = await Translator.availability({
  sourceLanguage: 'en',
  targetLanguage: 'zh'
});

// Create translator with progress monitoring
const translator = await Translator.create({
  sourceLanguage: 'en',
  targetLanguage: 'zh',
  monitor(m) {
    m.addEventListener('downloadprogress', (e) => {
      console.log(`Downloaded ${e.loaded * 100}%`);
    });
  }
});

// Translate text
const result = await translator.translate('Hello world');
```

For production use, consider:

- Using official Google Cloud Translation API with API key
- Implementing other translation services (DeepL, Microsoft Translator, etc.)

## Customization

### Change Translation Style

Edit `content.css` to modify how translations appear:

```css
.translation-zh {
  color: #1976d2;  /* Change color */
  font-size: 0.95em;  /* Adjust size */
}

/* Customize learning mode blur effect */
.translation-zh.learning-mode {
  filter: blur(5px);  /* Adjust blur intensity */
}
```

### Adjust Translation Behavior

Modify `content.js`:

- Change `blockTags` array in `getBlockElements()` to add/remove element types for translation
- Adjust `hasEnglishContent()` to change detection logic
- Modify delay timings (currently 50ms stagger) for performance tuning
- Customize which elements are translated by editing the block-level element list

## Notes

- The extension requires internet connection for translation
- Some websites with strict Content Security Policy may block translations
- Translation quality depends on the API used
- Large pages may take a few seconds to fully translate

## Privacy

- No user data is collected or stored
- Translation requests are sent directly to the selected translation API
- Only preferences (displayMode, translationApi) are stored locally in Chrome storage
- Chrome built-in API processes translations locally when offline

## License

MIT License - Feel free to modify and distribute

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.
