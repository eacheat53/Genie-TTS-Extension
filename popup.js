document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('speedInput');

    // 从存储中加载上次设置的语速（默认 1.0）
    chrome.storage.local.get(['ttsSpeed'], (result) => {
        const speed = result.ttsSpeed || 1.0;
        input.value = Number(speed).toFixed(1);
    });

    // 当用户输入数字时，实时保存到本地
    input.addEventListener('input', () => {
        let newSpeed = parseFloat(input.value);
        if (isNaN(newSpeed) || newSpeed <= 0) return; // 防止非法输入
        chrome.storage.local.set({ ttsSpeed: newSpeed });
    });
});
