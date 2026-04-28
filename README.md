# 🧞 Genie TTS Extension

> **Genie TTS 划词朗读 (极简版)** —— 一个专为极速体验设计的 Chrome 浏览器扩展，支持选中网页文字后，通过本地 Genie TTS 服务进行高质量、低延迟的流式语音合成。

---

## ✨ 特性

- 🚀 **流式播放**：利用 Offscreen Canvas 技术实现 PCM 流式音频解码与播放，无需等待整句合成完毕。
- 🖱️ **划词唤起**：选中任意网页文本，右键即可一键朗读。
- 🛠️ **极简架构**：基于 Manifest V3 标准开发，轻量且高效。
- 📡 **本地优先**：直接连接本地 API，隐私安全，响应迅捷。

## 📸 预览

*(在此处添加演示截图或 GIF)*

## 🛠️ 安装指南

1. **下载本项目**：
   ```bash
   git clone https://github.com/your-username/Genie-TTS-Extension.git
   ```
2. **加载扩展**：
   - 打开 Chrome 浏览器，进入 `chrome://extensions/`。
   - 在右上角开启 **开发者模式**。
   - 点击 **加载已解压的扩展程序**。
   - 选择本项目所在的文件夹。

## ⚙️ 环境要求

- **本地 API**：默认连接到 `http://127.0.0.1:8000`。
- **Genie TTS 服务**：请确保您的本地 Genie TTS 服务已启动并可以接收来自浏览器的请求。

## 📂 项目结构

```text
.
├── manifest.json      # 扩展配置文件
├── background.js      # 后台服务脚本 (Context Menus)
├── offscreen.html     # 隐藏音频处理页面
├── offscreen.js       # 音频解码与流式播放逻辑
└── README.md          # 项目文档
```

## 📜 许可证

[MIT License](LICENSE)
