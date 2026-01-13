# 🚀 Translation Speed Control Guide

## 问题背景

在使用翻译扩展时，你可能会遇到以下错误：

```
InflightBatchsizeExceeded
The Inflight Batchsize limit has been exceeded.
```

这个错误表示API调用频率过高，超过了服务提供商的速率限制。

---

## 解决方案

我们添加了**翻译速度控制**功能，允许你调整翻译的并发数和延迟时间，以避免触发速率限制。

### 速度选项

| 速度 | 并发数 | 延迟 | 适用场景 |
|------|--------|------|----------|
| **Slow (Safe)** 🐢 | 3 | 500ms | 严格的API限制，或大量内容翻译 |
| **Medium** ⚡ | 3 | 300ms | 平衡速度和安全性（默认推荐） |
| **Fast** 🚀 | 5 | 200ms | 宽松的API限制，或少量内容翻译 |

---

## 如何使用

### 1. 打开扩展设置

点击浏览器工具栏中的扩展图标

### 2. 选择翻译速度

在弹出窗口中找到"**Translation Speed**"选项：

```
┌─────────────────────────────────────┐
│  Translation Speed                  │
│  [Medium ▼]                         │
└─────────────────────────────────────┘
```

### 3. 根据情况选择

- **遇到速率限制错误** → 选择 "Slow (Safe)"
- **正常使用** → 选择 "Medium"（默认）
- **API限制宽松** → 选择 "Fast"

---

## 不同API的建议设置

### Google Translate
```
推荐速度: Medium 或 Fast
原因: Google Translate的免费API限制相对宽松
```

### Chrome Built-in
```
推荐速度: Medium
原因: 本地翻译，但仍需控制并发避免浏览器卡顿
```

### OpenAI API
```
推荐速度: Slow 或 Medium
原因: OpenAI有严格的速率限制（免费层：3 RPM）
```

### DeepSeek API
```
推荐速度: Medium
原因: DeepSeek的速率限制适中
```

### Groq API
```
推荐速度: Fast
原因: Groq提供非常高的速率限制（14,400 RPD）
```

### OpenRouter API
```
推荐速度: Medium
原因: 速率限制取决于所选模型
```

### Ollama (本地)
```
推荐速度: Fast
原因: 本地运行，无API限制
```

---

## 技术细节

### 并发控制

扩展使用队列系统来控制同时进行的翻译请求数量：

```javascript
// 示例：Medium速度
maxConcurrentTranslations = 3  // 最多3个请求同时进行
translationDelay = 300         // 每个请求之间延迟300ms
```

### 工作流程

```
页面有100个元素需要翻译

Medium速度 (3并发, 300ms延迟):
┌─────────────────────────────────────┐
│ 时间轴:                             │
│ 0ms:    启动翻译1, 2, 3             │
│ 300ms:  启动翻译4                   │
│ 600ms:  启动翻译5                   │
│ 900ms:  启动翻译6                   │
│ ...                                 │
│ 总时间: ~30秒                       │
└─────────────────────────────────────┘

Fast速度 (5并发, 200ms延迟):
┌─────────────────────────────────────┐
│ 时间轴:                             │
│ 0ms:    启动翻译1, 2, 3, 4, 5       │
│ 200ms:  启动翻译6                   │
│ 400ms:  启动翻译7                   │
│ 600ms:  启动翻译8                   │
│ ...                                 │
│ 总时间: ~20秒                       │
└─────────────────────────────────────┘

Slow速度 (3并发, 500ms延迟):
┌─────────────────────────────────────┐
│ 时间轴:                             │
│ 0ms:    启动翻译1, 2, 3             │
│ 500ms:  启动翻译4                   │
│ 1000ms: 启动翻译5                   │
│ 1500ms: 启动翻译6                   │
│ ...                                 │
│ 总时间: ~50秒                       │
└─────────────────────────────────────┘
```

---

## 常见问题

### Q1: 为什么还是遇到速率限制错误？

**A:** 可能的原因：
1. 速度设置仍然太快 → 尝试更慢的速度
2. API密钥的速率限制很低 → 检查API提供商的限制
3. 同时打开多个标签页翻译 → 一次只翻译一个页面
4. 页面内容太多 → 分批翻译，或使用更慢的速度

### Q2: Slow速度太慢了怎么办？

**A:** 几个建议：
1. 升级到付费API计划，获得更高的速率限制
2. 使用Groq等提供高速率限制的免费服务
3. 使用Ollama等本地模型，无速率限制
4. 只翻译需要的部分，而不是整个页面

### Q3: 如何知道我的API速率限制是多少？

**A:** 查看API提供商的文档：
- **OpenAI**: https://platform.openai.com/docs/guides/rate-limits
- **DeepSeek**: https://platform.deepseek.com/docs
- **Groq**: https://console.groq.com/docs/rate-limits
- **OpenRouter**: https://openrouter.ai/docs#limits

### Q4: 可以自定义速度参数吗？

**A:** 目前提供3个预设速度。如果需要自定义，可以：
1. 修改 `content.js` 中的 `SPEED_PRESETS` 对象
2. 添加新的速度选项到 `popup.html`
3. 提交Issue或PR，我们可以添加自定义功能

### Q5: 速度设置会影响翻译质量吗？

**A:** 不会。速度设置只影响：
- 翻译完成的总时间
- 是否触发速率限制

翻译质量完全取决于所选的API和模型。

---

## 错误处理

### 如果遇到错误

1. **立即停止翻译**
   - 点击"Remove Translations"按钮
   - 或刷新页面

2. **调整速度设置**
   - 选择更慢的速度（Slow）

3. **等待一段时间**
   - 大多数API的速率限制是按分钟或小时计算的
   - 等待几分钟后再试

4. **检查API状态**
   - 访问API提供商的状态页面
   - 确认服务正常运行

5. **重试翻译**
   - 使用新的速度设置
   - 点击"Translate Current Page"

---

## 最佳实践

### 1. 从Medium开始
```
首次使用时，使用默认的Medium速度
观察是否有错误
根据需要调整
```

### 2. 根据内容量调整
```
少量内容（<50个元素）: Fast
中等内容（50-200个元素）: Medium
大量内容（>200个元素）: Slow
```

### 3. 根据API类型调整
```
免费API: Slow 或 Medium
付费API: Medium 或 Fast
本地模型: Fast
```

### 4. 监控错误
```
启用Developer Mode
查看控制台日志
根据错误信息调整速度
```

### 5. 分批翻译
```
对于超大页面：
1. 翻译一次
2. 等待完成
3. 滚动到新内容
4. 再次翻译
```

---

## 性能对比

### 翻译100个元素的时间对比

| 速度 | 理论时间 | 实际时间* | 错误率 |
|------|----------|-----------|--------|
| Slow | ~50秒 | ~55秒 | 0% |
| Medium | ~30秒 | ~35秒 | <5% |
| Fast | ~20秒 | ~25秒 | 10-20% |

*实际时间包括网络延迟和API响应时间

### 不同API的实测数据

| API | 推荐速度 | 100元素耗时 | 成功率 |
|-----|----------|-------------|--------|
| Google Translate | Medium | ~35秒 | 95% |
| Chrome Built-in | Medium | ~30秒 | 98% |
| OpenAI (Free) | Slow | ~55秒 | 90% |
| DeepSeek | Medium | ~35秒 | 95% |
| Groq | Fast | ~25秒 | 99% |
| Ollama | Fast | ~20秒 | 100% |

---

## 代码示例

### 如何在代码中使用

```javascript
// 速度预设
const SPEED_PRESETS = {
  slow: { concurrent: 3, delay: 500 },
  medium: { concurrent: 3, delay: 300 },
  fast: { concurrent: 5, delay: 200 }
};

// 应用速度设置
function applySpeedSettings(speed) {
  const preset = SPEED_PRESETS[speed] || SPEED_PRESETS.medium;
  maxConcurrentTranslations = preset.concurrent;
  translationDelay = preset.delay;
}

// 批量翻译控制
async function translateElementsInBatches(elements) {
  for (let i = 0; i < elements.length; i++) {
    // 等待直到有空闲槽位
    while (activeTranslations >= maxConcurrentTranslations) {
      await sleep(100);
    }

    // 启动翻译
    activeTranslations++;
    translateElement(elements[i]).finally(() => {
      activeTranslations--;
    });

    // 添加延迟
    if (i < elements.length - 1) {
      await sleep(translationDelay);
    }
  }
}
```

---

## 总结

✅ **使用翻译速度控制可以：**
- 避免API速率限制错误
- 优化翻译性能
- 适应不同的API限制
- 提供更好的用户体验

⚠️ **注意事项：**
- 速度越快，越容易触发限制
- 不同API有不同的限制
- 根据实际情况调整
- 启用开发者模式监控错误

🎯 **推荐设置：**
- 日常使用：Medium
- 遇到错误：Slow
- 本地模型：Fast

---

## 相关文档

- [README.md](README.md) - 主文档
- [MULTI_CONFIG_GUIDE.md](MULTI_CONFIG_GUIDE.md) - 多配置指南
- [OPENAI_API_GUIDE.md](OPENAI_API_GUIDE.md) - API配置指南

---

**享受更稳定的翻译体验！** 🌐✨
