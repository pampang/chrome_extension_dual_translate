# Quick Setup Examples

## 🚀 5-Minute Setup Guide

### Option 1: Free & Fast (Groq)

1. Visit [console.groq.com](https://console.groq.com)
2. Sign up and create an API key
3. In the extension popup:
   - Select "OpenAI Compatible"
   - API URL: `https://api.groq.com/openai/v1`
   - API Key: `gsk_your_key_here`
   - Model: `llama-3.1-70b-versatile`
   - Click "Save Configuration"

**Benefits**: 14,400 free requests/day, extremely fast!

---

### Option 2: Best Chinese Quality (DeepSeek)

1. Visit [platform.deepseek.com](https://platform.deepseek.com)
2. Sign up and create an API key
3. In the extension popup:
   - Select "OpenAI Compatible"
   - API URL: `https://api.deepseek.com/v1`
   - API Key: `sk_your_key_here`
   - Model: `deepseek-chat`
   - Click "Save Configuration"

**Benefits**: Excellent Chinese translation, affordable pricing

---

### Option 3: Completely Free & Private (Ollama)

1. Install Ollama:
   ```bash
   curl -fsSL https://ollama.com/install.sh | sh
   ```

2. Pull a model:
   ```bash
   ollama pull llama3
   ```

3. In the extension popup:
   - Select "OpenAI Compatible"
   - API URL: `http://localhost:11434/v1`
   - API Key: `ollama` (any value works)
   - Model: `llama3`
   - Click "Save Configuration"

**Benefits**: Completely free, works offline, private!

---

### Option 4: No Setup Required (Google Translate)

1. In the extension popup:
   - Select "Google Translate"
   - Click "Translate Current Page"

**Benefits**: No configuration needed, works immediately!

---

## 🎯 Which Option Should I Choose?

| Your Priority | Recommended Option |
|---------------|-------------------|
| **No setup, just works** | Google Translate |
| **Best free option** | Groq |
| **Best Chinese quality** | DeepSeek |
| **Privacy & offline** | Ollama |
| **Highest quality** | OpenAI GPT-4 |

---

## 📝 Configuration Template

Copy and paste this template, then fill in your details:

```
API URL: [paste your API URL here]
API Key: [paste your API key here]
Model: [paste model name here]
```

### Common API URLs:
- OpenAI: `https://api.openai.com/v1`
- DeepSeek: `https://api.deepseek.com/v1`
- Groq: `https://api.groq.com/openai/v1`
- OpenRouter: `https://openrouter.ai/api/v1`
- Ollama: `http://localhost:11434/v1`

---

## ✅ Testing Your Configuration

1. After saving your configuration
2. Visit any English webpage
3. Click "Translate Current Page"
4. You should see Chinese translations appear below English text

If it doesn't work, check the [troubleshooting guide](OPENAI_API_GUIDE.md#-troubleshooting).

---

## 💡 Pro Tips

1. **Start with Groq** - It's free and fast, perfect for testing
2. **Try different models** - Each has different strengths
3. **Use local models for privacy** - Ollama keeps everything on your computer
4. **Enable Developer Mode** - Helps debug any issues

---

For more detailed information, see [OPENAI_API_GUIDE.md](OPENAI_API_GUIDE.md)
