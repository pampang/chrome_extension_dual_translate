# OpenAI-Compatible API Configuration Guide

This extension supports any OpenAI-compatible API endpoint, giving you maximum flexibility to choose your preferred AI translation service.

## 🚀 Quick Start

1. Open the extension popup
2. Select "OpenAI Compatible" from the Translation API dropdown
3. Enter your API configuration:
   - **API URL**: The base URL of your API endpoint
   - **API Key**: Your authentication key
   - **Model**: The model name to use (optional, defaults to gpt-3.5-turbo)
4. Click "Save Configuration"
5. Start translating!

---

## 🌐 Supported Providers

### 1. OpenAI (Official)

**API URL**: `https://api.openai.com/v1`

**Get API Key**: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

**Recommended Models**:

- `gpt-3.5-turbo` - Fast and cost-effective
- `gpt-4` - Highest quality (requires paid account)
- `gpt-4-turbo` - Balance of speed and quality

**Pricing**: Pay-as-you-go, $5 free credit for new users

---

### 2. DeepSeek (Excellent for Chinese)

**API URL**: `https://api.deepseek.com/v1`

**Get API Key**: [platform.deepseek.com](https://platform.deepseek.com)

**Recommended Models**:

- `deepseek-chat` - Optimized for Chinese translation

**Pricing**: Free tier available, very affordable pricing

**Why DeepSeek?**

- Excellent understanding of Chinese language and culture
- High-quality technical translation
- Cost-effective

---

### 3. Groq (Fastest Speed)

**API URL**: `https://api.groq.com/openai/v1`

**Get API Key**: [console.groq.com](https://console.groq.com)

**Recommended Models**:

- `llama-3.1-70b-versatile` - Best quality
- `llama-3.1-8b-instant` - Fastest speed

**Pricing**: **14,400 requests/day FREE!**

**Why Groq?**

- Extremely fast inference (fastest in the market)
- Generous free tier
- High-quality LLaMA models

---

### 4. OpenRouter (Multiple Models)

**API URL**: `https://openrouter.ai/api/v1`

**Get API Key**: [openrouter.ai/keys](https://openrouter.ai/keys)

**Recommended Models**:

- `meta-llama/llama-3.1-8b-instruct:free` - Completely free
- `google/gemini-flash-1.5` - Fast and free
- `anthropic/claude-3-haiku` - High quality

**Pricing**: Multiple free models available

**Why OpenRouter?**

- Access to many different models
- Several completely free options
- Easy to switch between models

---

### 5. Ollama (Local/Offline)

**API URL**: `http://localhost:11434/v1`

**Get Started**: [ollama.com](https://ollama.com)

**Recommended Models**:

- `llama3` - General purpose
- `qwen2` - Excellent for Chinese
- `mistral` - Fast and efficient

**Setup**:

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull a model
ollama pull llama3

# Start Ollama (runs automatically)
ollama serve
```

**Why Ollama?**

- Completely free and private
- Works offline
- No API key needed
- Full control over your data

---

### 6. LM Studio (Local/Offline)

**API URL**: `http://localhost:1234/v1`

**Get Started**: [lmstudio.ai](https://lmstudio.ai)

**Setup**:

1. Download and install LM Studio
2. Download a model (e.g., Llama 3, Qwen)
3. Start the local server
4. Use `http://localhost:1234/v1` as API URL
5. Leave API Key empty or use any placeholder

**Why LM Studio?**

- User-friendly GUI
- Easy model management
- Works offline
- No API key needed

---

## 📝 Configuration Examples

### Example 1: OpenAI GPT-3.5

```
API URL: https://api.openai.com/v1
API Key: sk-proj-xxxxxxxxxxxxxxxxxxxxx
Model: gpt-3.5-turbo
```

### Example 2: DeepSeek

```
API URL: https://api.deepseek.com/v1
API Key: sk-xxxxxxxxxxxxxxxxxxxxx
Model: deepseek-chat
```

### Example 3: Groq (Free)

```
API URL: https://api.groq.com/openai/v1
API Key: gsk_xxxxxxxxxxxxxxxxxxxxx
Model: llama-3.1-70b-versatile
```

### Example 4: OpenRouter (Free Model)

```
API URL: https://openrouter.ai/api/v1
API Key: sk-or-v1-xxxxxxxxxxxxxxxxxxxxx
Model: meta-llama/llama-3.1-8b-instruct:free
```

### Example 5: Ollama (Local)

```
API URL: http://localhost:11434/v1
API Key: ollama
Model: llama3
```

---

## 🔧 Troubleshooting

### "Please configure API URL and Key"

- Make sure you've entered both API URL and API Key
- Click "Save Configuration" button
- Refresh the page and try again

### "API error: 401"

- Your API key is invalid or expired
- Generate a new API key from your provider
- Make sure there are no extra spaces in the key

### "API error: 404"

- Check your API URL is correct
- Make sure the URL ends with `/v1` (not `/v1/chat/completions`)
- The extension will automatically append `/chat/completions`

### "API error: 429"

- You've exceeded your rate limit
- Wait a few minutes and try again
- Consider switching to a provider with higher limits (e.g., Groq)

### Translation fails with local models (Ollama/LM Studio)

- Make sure the local server is running
- Check the model is loaded
- Verify the port number (11434 for Ollama, 1234 for LM Studio)
- Try accessing `http://localhost:11434/v1/models` in your browser

### Slow translation speed

- Try a faster model (e.g., Groq's llama-3.1-8b-instant)
- Use a local model for instant translation
- Check your internet connection

---

## 💡 Best Practices

### For Best Translation Quality

1. **DeepSeek** - Best for Chinese content
2. **OpenAI GPT-4** - Best overall quality (paid)
3. **Groq llama-3.1-70b** - Best free quality

### For Fastest Speed

1. **Local models** (Ollama/LM Studio) - Instant
2. **Groq** - Extremely fast cloud API
3. **OpenAI GPT-3.5** - Fast and reliable

### For Privacy

1. **Ollama** - Completely local and private
2. **LM Studio** - Local with GUI
3. **Self-hosted** - Deploy your own API

### For Cost Efficiency

1. **Groq** - 14,400 free requests/day
2. **OpenRouter free models** - Completely free
3. **Ollama** - Free forever
4. **DeepSeek** - Very affordable pricing

---

## 🔒 Security & Privacy

### API Key Storage

- API keys are stored in Chrome's sync storage
- Keys are encrypted by Chrome
- Keys sync across your Chrome browsers (if signed in)
- Never share your API keys with others

### Data Privacy

- When using cloud APIs, your text is sent to their servers
- For maximum privacy, use local models (Ollama/LM Studio)
- Read your provider's privacy policy
- Consider using local models for sensitive content

### Best Practices

- Rotate your API keys regularly
- Use separate keys for different applications
- Monitor your API usage
- Set up billing alerts if using paid services

---

## 📊 Provider Comparison

| Provider | Speed | Quality | Privacy | Cost | Setup |
|----------|-------|---------|---------|------|-------|
| **OpenAI** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | 💰💰 | Easy |
| **DeepSeek** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | 💰 | Easy |
| **Groq** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | Free | Easy |
| **OpenRouter** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | Free/💰 | Easy |
| **Ollama** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Free | Medium |
| **LM Studio** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Free | Easy |

---

## 🎯 Recommendations

### For Beginners

Start with **Groq** - it's free, fast, and easy to set up!

### For Chinese Translation

Use **DeepSeek** - specifically optimized for Chinese language.

### For Privacy-Conscious Users

Use **Ollama** or **LM Studio** - completely local and private.

### For Professional Use

Use **OpenAI GPT-4** - highest quality, worth the cost.

### For High Volume

Use **Groq** (14,400/day free) or **Ollama** (unlimited local).

---

## 🔗 Useful Links

- **OpenAI**: [platform.openai.com](https://platform.openai.com)
- **DeepSeek**: [platform.deepseek.com](https://platform.deepseek.com)
- **Groq**: [console.groq.com](https://console.groq.com)
- **OpenRouter**: [openrouter.ai](https://openrouter.ai)
- **Ollama**: [ollama.com](https://ollama.com)
- **LM Studio**: [lmstudio.ai](https://lmstudio.ai)

---

## ❓ FAQ

**Q: Can I use multiple providers?**
A: Yes! You can switch between providers anytime in the popup. Just change the API configuration and save.

**Q: Do I need to pay for API access?**
A: No! Groq, OpenRouter (free models), and Ollama are completely free. OpenAI and DeepSeek offer free credits for new users.

**Q: Which provider is best for Chinese translation?**
A: DeepSeek is specifically optimized for Chinese and provides excellent results.

**Q: Can I use this offline?**
A: Yes! Use Ollama or LM Studio with local models for completely offline translation.

**Q: Is my data secure?**
A: API keys are stored securely in Chrome. For maximum privacy, use local models (Ollama/LM Studio).

**Q: What if I hit rate limits?**
A: Switch to a different provider or use Ollama for unlimited local translation.

---

Happy translating! 🌐✨
