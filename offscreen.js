// 初始化音频上下文 (匹配 Genie TTS 默认的 32000Hz 采样率)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 32000 });
let nextPlayTime = 0; // 用于记录下一段音频的播放时间，保证无缝衔接

// 监听 background.js 发来的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "play-tts") {
        streamTTS(message.text);
    }
});

async function streamTTS(textToRead) {
    // 确保 AudioContext 在用户交互后处于运行状态
    if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
    }

    // 防止下一段播放在历史时间线上导致叠加
    if (nextPlayTime < audioCtx.currentTime) {
        nextPlayTime = audioCtx.currentTime;
    }

    try {
        console.log("正在请求 TTS:", textToRead);
        
        const response = await fetch('http://127.0.0.1:8000/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                character_name: "feibi", // 请确保这个角色已经加载
                text: textToRead,
                text_language: "hybrid",
                split_sentence: true
            })
        });

        if (!response.ok) {
            console.error("API 返回错误:", await response.text());
            throw new Error("TTS Request Failed");
        }

        const reader = response.body.getReader();
        let leftover = null; // 用于保存未能凑成整 Int16 的落单字节

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            let buffer = value; // value 是 Uint8Array

            // 如果上次有剩余的一个字节，将它与这次的数据拼接
            if (leftover) {
                buffer = new Uint8Array(leftover.length + value.length);
                buffer.set(leftover);
                buffer.set(value, leftover.length);
                leftover = null;
            }

            // 16-bit PCM 每个采样占 2 个字节。如果是奇数个字节，将最后一个字节留到下一次处理
            if (buffer.length % 2 !== 0) {
                leftover = buffer.slice(-1);
                buffer = buffer.slice(0, -1);
            }

            // 将 Uint8 数组视图转换为 Int16 视图
            const int16Array = new Int16Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / 2);
            
            // Web Audio API 需要 Float32 格式 (-1.0 到 1.0 之间)
            const float32Array = new Float32Array(int16Array.length);
            for (let i = 0; i < int16Array.length; i++) {
                // 32768 是 16-bit 整数的最大值
                float32Array[i] = int16Array[i] / 32768.0; 
            }

            // 创建 AudioBuffer (单声道, 采样数, 采样率)
            const audioBuffer = audioCtx.createBuffer(1, float32Array.length, 32000);
            audioBuffer.copyToChannel(float32Array, 0);

            // 创建播放节点
            const source = audioCtx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioCtx.destination);

            // 安排播放时间：如果当前时间已经超过了预计播放时间，就立刻播放；否则排队播放
            if (nextPlayTime < audioCtx.currentTime) {
                nextPlayTime = audioCtx.currentTime;
            }
            source.start(nextPlayTime);
            
            // 更新下一段音频的播放时间
            nextPlayTime += audioBuffer.duration;
        }
        console.log("TTS 流式接收并播放完毕");

    } catch (error) {
        console.error("TTS 错误:", error);
    }
}
