document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('speedInput');
    const charInput = document.getElementById('charInput');

    // 从存储中加载上次设置的语速和角色
    chrome.storage.local.get(['ttsSpeed', 'ttsChar'], (result) => {
        const speed = result.ttsSpeed || 1.0;
        input.value = Number(speed).toFixed(1);
        charInput.value = result.ttsChar || "feibi";
    });

    // 当用户输入角色名时保存
    charInput.addEventListener('input', () => {
        chrome.storage.local.set({ ttsChar: charInput.value.trim() || "feibi" });
    });

    // 当用户输入数字时，实时保存到本地
    input.addEventListener('input', () => {
        let newSpeed = parseFloat(input.value);
        if (isNaN(newSpeed) || newSpeed <= 0) return; // 防止非法输入
        chrome.storage.local.set({ ttsSpeed: newSpeed });
    });
});
