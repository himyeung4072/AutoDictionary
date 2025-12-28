# 📱 「默書神器」手機 UX 改進計劃

## 一、現有優點 ✅

| 項目 | 說明 |
|------|------|
| 響應式設計 | 已有 `@media (max-width: 520px)` 適配 |
| 觸控友好 | 按鈕最小高度 48px，符合 Apple HIG 標準 |
| 字體大小 | input/select 使用 16px，避免 iOS 自動縮放 |
| 狀態反饋 | 播放時有倒數計時顯示「等待中... (7 秒)」 |
| 設定記憶 | localStorage 保存用戶偏好 |

---

## 二、需要改善的問題 🔧

### 1. 視覺層次與資訊架構

| 問題 | 影響 | 建議 |
|------|------|------|
| 所有控制項平鋪展示 | 頁面過長，需要滾動才能看到按鈕 | 使用摺疊面板或分步驟設計 |
| 模式切換不明顯 | Radio button 太小，容易誤觸 | 改用大型 Toggle 或 Tab 切換 |
| 缺乏視覺分組 | 設定項目之間沒有明確區隔 | 加入卡片分組或分隔線 |

### 2. 播放控制區域

| 問題 | 影響 | 建議 |
|------|------|------|
| 按鈕位置不固定 | 滾動後找不到控制按鈕 | 固定在底部 (Sticky Footer) |
| 狀態顯示太小 | 「正在朗讀...」文字不夠醒目 | 加大字體、加入進度條 |
| 缺乏視覺進度 | 不知道整體進度 | 加入進度指示器 |

### 3. 輸入體驗

| 問題 | 影響 | 建議 |
|------|------|------|
| Textarea 高度固定 | 輸入長文章時不方便 | 自動擴展高度 |
| 缺乏快捷輸入 | 每次都要手動輸入 | 加入歷史記錄或範本 |
| 無字數統計 | 不知道輸入了多少內容 | 顯示字數/詞數 |

### 4. 手勢與互動

| 問題 | 影響 | 建議 |
|------|------|------|
| 缺乏手勢支援 | 只能點擊按鈕 | 支援滑動切換模式 |
| 無觸覺反饋 | 點擊沒有震動回饋 | 加入 Haptic Feedback |
| 調試區域外露 | 普通用戶不需要看到 | 隱藏或移到設定頁 |

---

## 三、建議的新版介面架構

```
┌─────────────────────────────┐
│      默書神器               │  ← 精簡標題
├─────────────────────────────┤
│  ┌─────────┬─────────┐      │
│  │ 讀詞語  │ 讀文章  │      │  ← 大型 Tab 切換
│  └─────────┴─────────┘      │
├─────────────────────────────┤
│  ┌─────────────────────┐    │
│  │ 輸入區域            │    │  ← 自動擴展
│  │                     │    │
│  └─────────────────────┘    │
│  12 字 · 粵語                │  ← 字數統計 + 語言標籤
├─────────────────────────────┤
│  ⚙️ 設定 ──────────── ▼     │  ← 可摺疊設定區
│  │ 速度: 正常  次數: 3     │
│  │ 間隔: 5秒               │
│  └─────────────────────────┘│
├─────────────────────────────┤
│  ████████░░░░░░░░  3/10     │  ← 進度條
│  正在朗讀: 蘋果 (第2次)     │  ← 當前狀態
├─────────────────────────────┤
│  ┌─────┐ ┌─────┐ ┌─────┐   │
│  │ ▶️  │ │ ⏸️  │ │ ⏹️  │   │  ← 固定底部控制列
│  │ 開始 │ │ 暫停 │ │ 停止 │   │
│  └─────┘ └─────┘ └─────┘   │
└─────────────────────────────┘
```

---

## 四、具體改善建議

### A. 固定底部播放控制列

```css
.player-controls {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    padding: 12px 16px;
    padding-bottom: calc(12px + env(safe-area-inset-bottom)); /* iPhone 瀏海適配 */
    box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
    z-index: 100;
}
```

### B. 大型模式切換 Tab

```css
.mode-tabs {
    display: flex;
    background: #f0f0f0;
    border-radius: 12px;
    padding: 4px;
}
.mode-tab {
    flex: 1;
    padding: 14px;
    text-align: center;
    border-radius: 10px;
    font-weight: 600;
    transition: all 0.2s;
}
.mode-tab.active {
    background: white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
```

### C. 進度指示器

```html
<div class="progress-section">
    <div class="progress-bar">
        <div class="progress-fill" style="width: 30%"></div>
    </div>
    <div class="progress-text">
        <span class="current-word">蘋果</span>
        <span class="progress-count">3 / 10</span>
    </div>
</div>
```

```css
.progress-bar {
    height: 6px;
    background: #e0e0e0;
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 8px;
}
.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #28a745, #20c997);
    border-radius: 3px;
    transition: width 0.3s ease;
}
```

### D. 可摺疊設定區

```html
<details class="settings-panel" open>
    <summary>
        <span>⚙️ 朗讀設定</span>
        <span class="settings-preview">正常速度 · 3次 · 5秒間隔</span>
    </summary>
    <div class="settings-content">
        <!-- 設定選項 -->
    </div>
</details>
```

### E. 安全區域適配 (iPhone 瀏海/底部)

```css
body {
    padding-bottom: env(safe-area-inset-bottom);
}
.container {
    padding-top: env(safe-area-inset-top);
}
```

### F. 字數統計功能

```javascript
function updateWordCount() {
    const text = document.getElementById('words').value;
    const mode = document.querySelector('input[name="mode"]:checked').value;
    
    if (mode === 'word') {
        const lines = text.split('\n').filter(s => s.trim() !== '');
        return `${lines.length} 個詞語`;
    } else {
        const chars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
        return `${chars} 字`;
    }
}
```

---

## 五、優先級建議

| 優先級 | 改善項目 | 預期效果 | 工作量 |
|--------|----------|----------|--------|
| 🔴 高 | 固定底部控制列 | 隨時可控制播放 | 小 |
| 🔴 高 | 加入進度指示器 | 清楚知道進度 | 中 |
| 🟡 中 | 大型 Tab 切換模式 | 減少誤觸 | 小 |
| 🟡 中 | 摺疊設定區域 | 減少頁面長度 | 中 |
| 🟡 中 | 字數統計 | 方便確認輸入 | 小 |
| 🟢 低 | 歷史記錄功能 | 方便重複使用 | 大 |
| 🟢 低 | 觸覺反饋 | 提升互動感 | 小 |
| 🟢 低 | 深色模式 | 夜間使用舒適 | 中 |

---

## 六、額外建議

1. **深色模式支援** - 加入 `@media (prefers-color-scheme: dark)` 適配
2. **PWA 支援** - 加入 manifest.json 讓用戶可以「加到主畫面」
3. **離線使用** - Service Worker 緩存，無網絡也能用
4. **快捷鍵** - 空白鍵暫停/恢復，方便配合實體鍵盤
5. **語音預覽** - 設定語言後可快速試聽

---

## 七、實施順序建議

### 第一階段（核心體驗）
1. 固定底部控制列
2. 進度指示器
3. 大型 Tab 切換

### 第二階段（優化細節）
4. 摺疊設定區域
5. 字數統計
6. 安全區域適配

### 第三階段（進階功能）
7. 歷史記錄
8. 深色模式
9. PWA 支援

---

*文件建立日期：2025-12-28*
