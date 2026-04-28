chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "read-with-genie",
        title: "用 Genie TTS 朗读",
        contexts: ["selection"]
    });
});

let creating; // 用于记录创建 Offscreen Document 的 Promise

async function setupOffscreenDocument(path) {
    // 检查是否已经存在 Offscreen Document
    if (await chrome.offscreen.hasDocument()) return;
    
    // 正在创建中
    if (creating) {
        await creating;
    } else {
        // 发起创建
        creating = chrome.offscreen.createDocument({
            url: path,
            reasons: ['AUDIO_PLAYBACK'],
            justification: '用于播放本地 TTS 返回的流式 PCM 音频'
        });
        await creating;
        creating = null;
    }
}

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "read-with-genie") {
        const text = info.selectionText;
        if (text) {
            // 确保创建了后台隐藏页面用于播放音频
            await setupOffscreenDocument('offscreen.html');
            
            // 向隐藏页面发送消息，触发朗读
            chrome.runtime.sendMessage({
                action: "play-tts",
                text: text
            });
        }
    }
});
