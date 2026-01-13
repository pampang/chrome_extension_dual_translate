# Multiple API Configurations Guide

## 🎯 Overview

The extension now supports **multiple API configurations**, allowing you to:

- Save multiple API configurations with custom names
- Quickly switch between different providers or models
- Manage (edit/delete) your configurations easily

This is perfect for:

- Testing different AI models
- Switching between free and paid services
- Using different configurations for different purposes
- Keeping work and personal API keys separate

---

## 📝 How to Use

### Step 1: Select OpenAI Compatible API

1. Open the extension popup
2. Select "**OpenAI Compatible**" from the Translation API dropdown
3. The configuration panel will appear

### Step 2: Create Your First Configuration

1. Click the "**+ New Configuration**" button
2. Fill in the configuration details:
   - **Configuration Name**: Give it a memorable name (e.g., "Groq Fast", "DeepSeek Chinese", "OpenAI GPT-4")
   - **API URL**: Enter the API endpoint URL
   - **API Key**: Enter your API key
   - **Model**: Enter the model name (optional)
3. Click "**Save**"

### Step 3: Use Your Configuration

- Your new configuration is automatically selected
- Start translating immediately!

### Step 4: Add More Configurations (Optional)

1. Click "**+ New Configuration**" again
2. Add another configuration (e.g., a different provider or model)
3. Save it

### Step 5: Switch Between Configurations

1. Use the "**Select Configuration**" dropdown
2. Choose the configuration you want to use
3. The selected configuration will be used for all translations

### Step 6: Edit or Delete Configurations

1. Select a configuration from the dropdown
2. The editor will show the configuration details
3. Make changes and click "**Save**", or
4. Click "**Delete**" to remove the configuration

---

## 💡 Example Configurations

### Configuration 1: Groq (Free & Fast)

```
Name: Groq Fast
API URL: https://api.groq.com/openai/v1
API Key: gsk_your_key_here
Model: llama-3.1-70b-versatile
```

### Configuration 2: DeepSeek (Chinese Quality)

```
Name: DeepSeek Chinese
API URL: https://api.deepseek.com/v1
API Key: sk_your_key_here
Model: deepseek-chat
```

### Configuration 3: OpenAI (Highest Quality)

```
Name: OpenAI GPT-4
API URL: https://api.openai.com/v1
API Key: sk_proj_your_key_here
Model: gpt-4-turbo
```

### Configuration 4: Ollama (Local & Private)

```
Name: Ollama Local
API URL: http://localhost:11434/v1
API Key: ollama
Model: llama3
```

---

## 🎨 UI Walkthrough

### When OpenAI Compatible is Selected

```
┌─────────────────────────────────────┐
│  Select Configuration:              │
│  [Groq Fast ▼]                      │
│  [+ New Configuration]              │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Configuration Name:                │
│  [Groq Fast                      ]  │
│                                     │
│  API URL:                           │
│  [https://api.groq.com/openai/v1 ]  │
│                                     │
│  API Key:                           │
│  [••••••••••••••••••••••••••••••]  │
│                                     │
│  Model (optional):                  │
│  [llama-3.1-70b-versatile        ]  │
│                                     │
│  [Save] [Delete] [Cancel]           │
└─────────────────────────────────────┘
```

---

## 🔄 Common Workflows

### Workflow 1: Testing Different Models

1. Create configurations for different models:
   - "GPT-3.5 Fast" with gpt-3.5-turbo
   - "GPT-4 Quality" with gpt-4-turbo
   - "Groq LLaMA" with llama-3.1-70b-versatile
2. Switch between them to compare translation quality
3. Keep the one you like best selected

### Workflow 2: Free vs Paid Services

1. Create a free configuration (e.g., Groq)
2. Create a paid configuration (e.g., OpenAI GPT-4)
3. Use free for casual browsing
4. Switch to paid for important documents

### Workflow 3: Work and Personal

1. Create "Work - Company API" with your company's API
2. Create "Personal - My API" with your personal API
3. Switch based on what you're working on

### Workflow 4: Different Languages

1. Create "Chinese - DeepSeek" optimized for Chinese
2. Create "General - GPT-4" for other languages
3. Switch based on content type

---

## 🛠️ Tips & Best Practices

### Naming Conventions

Use descriptive names that help you remember:

- **Provider + Feature**: "Groq Fast", "DeepSeek Chinese"
- **Use Case**: "Work API", "Personal API", "Testing"
- **Model Name**: "GPT-4 Turbo", "LLaMA 70B"

### Organization

- Keep 3-5 configurations for easy switching
- Delete configurations you no longer use
- Update API keys when they expire

### Testing New Services

1. Create a new configuration with "Test" in the name
2. Try it out on a few pages
3. If you like it, rename it properly
4. If not, delete it

### Backup Your Configurations

Your configurations are stored in Chrome's sync storage, but you can also:

1. Take screenshots of your configurations
2. Keep a text file with your API details
3. Use Chrome's sync to backup across devices

---

## 🔒 Security Notes

### API Key Storage

- All configurations are stored in Chrome's sync storage
- Keys are encrypted by Chrome
- Keys sync across your Chrome browsers (if signed in)
- Never share your configurations with others

### Best Practices

1. **Use separate keys** for different purposes
2. **Rotate keys regularly** for security
3. **Delete unused configurations** to minimize exposure
4. **Monitor API usage** on provider dashboards
5. **Set spending limits** on paid services

---

## ❓ FAQ

**Q: How many configurations can I save?**
A: Chrome's sync storage has a limit, but you can easily save 10-20 configurations.

**Q: Do configurations sync across devices?**
A: Yes! If you're signed into Chrome, your configurations sync automatically.

**Q: What happens if I delete the selected configuration?**
A: The extension will automatically select the first available configuration.

**Q: Can I export/import configurations?**
A: Not yet, but this feature may be added in the future.

**Q: Can I use the same API key in multiple configurations?**
A: Yes! You can use the same key with different models or settings.

**Q: What if I forget which configuration I'm using?**
A: The selected configuration is shown in the dropdown. You can also check the editor section.

**Q: Can I rename a configuration?**
A: Yes! Select it, change the name in the editor, and click Save.

**Q: What happens if my API key expires?**
A: Select the configuration, update the API key, and save.

---

## 🎯 Quick Reference

| Action | Steps |
|--------|-------|
| **Add new config** | Click "+ New Configuration" → Fill details → Save |
| **Switch config** | Select from dropdown |
| **Edit config** | Select from dropdown → Modify → Save |
| **Delete config** | Select from dropdown → Click Delete → Confirm |
| **Cancel editing** | Click Cancel button |

---

## 🚀 Getting Started Checklist

- [ ] Select "OpenAI Compatible" API
- [ ] Click "+ New Configuration"
- [ ] Enter a descriptive name
- [ ] Fill in API URL and Key
- [ ] (Optional) Enter model name
- [ ] Click "Save"
- [ ] Start translating!
- [ ] (Optional) Add more configurations
- [ ] (Optional) Switch between configurations to compare

---

## 💬 Need Help?

- Check [OPENAI_API_GUIDE.md](OPENAI_API_GUIDE.md) for provider-specific setup
- Check [QUICK_SETUP.md](QUICK_SETUP.md) for quick start guides
- Check [README.md](README.md) for general information

---

Happy translating with multiple configurations! 🌐✨
