# Design Document: Mobile UX Enhancement

## Overview

本設計文件描述「默書神器」手機用戶體驗優化的技術實現方案。主要改進包括固定底部播放控制列、進度指示器、大型模式切換標籤、可摺疊設定面板、字數統計、自動擴展輸入區域，以及 iPhone 安全區域適配。

所有改進將在現有的單一 HTML 文件 (`auto_dic.html`) 中實現，保持應用的簡潔性和可移植性。

## Architecture

### 現有架構

```
┌─────────────────────────────────────┐
│           auto_dic.html             │
├─────────────────────────────────────┤
│  <style>                            │
│    - 基礎樣式                        │
│    - 響應式媒體查詢                   │
│  </style>                           │
├─────────────────────────────────────┤
│  <body>                             │
│    - 語言/聲音選擇                   │
│    - 模式切換 (radio buttons)        │
│    - 輸入區域                        │
│    - 設定控制項                      │
│    - 播放按鈕                        │
│    - 狀態顯示                        │
│    - 調試區域                        │
│  </body>                            │
├─────────────────────────────────────┤
│  <script>                           │
│    - 語音合成邏輯                    │
│    - 設定管理                        │
│    - UI 控制                         │
│  </script>                          │
└─────────────────────────────────────┘
```

### 改進後架構

```
┌─────────────────────────────────────┐
│           auto_dic.html             │
├─────────────────────────────────────┤
│  <head>                             │
│    - viewport-fit=cover meta tag    │
│  </head>                            │
├─────────────────────────────────────┤
│  <style>                            │
│    - CSS 變數定義                    │
│    - 安全區域適配                    │
│    - 固定底部控制列樣式              │
│    - 進度條樣式                      │
│    - Tab 切換樣式                    │
│    - 摺疊面板樣式                    │
│    - 響應式媒體查詢                  │
│  </style>                           │
├─────────────────────────────────────┤
│  <body>                             │
│    ┌─────────────────────────────┐  │
│    │ .main-content               │  │
│    │  - 標題                      │  │
│    │  - 語言/聲音選擇             │  │
│    │  - Mode Tabs (新)           │  │
│    │  - 輸入區域 + 字數統計 (新)  │  │
│    │  - 摺疊設定面板 (新)         │  │
│    │  - 進度區域 (新)             │  │
│    └─────────────────────────────┘  │
│    ┌─────────────────────────────┐  │
│    │ .player-controls (fixed)    │  │
│    │  - 開始/暫停/停止按鈕        │  │
│    └─────────────────────────────┘  │
│  </body>                            │
├─────────────────────────────────────┤
│  <script>                           │
│    - DictationApp 物件 (封裝)       │
│    - 進度管理模組                   │
│    - 字數統計模組                   │
│    - 設定面板模組                   │
│    - 輸入區域自動調整               │
│  </script>                          │
└─────────────────────────────────────┘
```

## Components and Interfaces

### 1. Player Controls (固定底部控制列)

```html
<div class="player-controls">
    <button id="startBtn">開始</button>
    <button id="pauseBtn" disabled>暫停</button>
    <button id="stopBtn" disabled>取消</button>
</div>
```

```css
.player-controls {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    padding: 12px 16px;
    padding-bottom: calc(12px + env(safe-area-inset-bottom));
    box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
    z-index: 100;
    display: flex;
    gap: 10px;
}
```

### 2. Progress Section (進度區域)

```html
<div class="progress-section">
    <div class="progress-bar">
        <div class="progress-fill" id="progressFill"></div>
    </div>
    <div class="progress-info">
        <span class="current-word" id="currentWord">準備開始...</span>
        <span class="progress-count" id="progressCount"></span>
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
    width: 0%;
}
```

### 3. Mode Tabs (模式切換標籤)

```html
<div class="mode-tabs" role="tablist">
    <button class="mode-tab active" role="tab" data-mode="word" aria-selected="true">
        讀詞語
    </button>
    <button class="mode-tab" role="tab" data-mode="article" aria-selected="false">
        讀文章
    </button>
</div>
```

```css
.mode-tabs {
    display: flex;
    background: #f0f0f0;
    border-radius: 12px;
    padding: 4px;
    margin-bottom: 15px;
}

.mode-tab {
    flex: 1;
    padding: 14px;
    text-align: center;
    border-radius: 10px;
    font-weight: 600;
    border: none;
    background: transparent;
    cursor: pointer;
    transition: all 0.2s ease;
    min-height: 48px;
}

.mode-tab.active {
    background: white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
```

### 4. Settings Panel (摺疊設定面板)

```html
<details class="settings-panel" id="settingsPanel" open>
    <summary>
        <span class="settings-title">⚙️ 朗讀設定</span>
        <span class="settings-preview" id="settingsPreview">正常速度 · 3次 · 5秒間隔</span>
    </summary>
    <div class="settings-content">
        <!-- 設定選項 -->
    </div>
</details>
```

```css
.settings-panel {
    background: #f8f9fa;
    border-radius: 8px;
    margin-bottom: 15px;
}

.settings-panel summary {
    padding: 12px 16px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    list-style: none;
}

.settings-panel summary::-webkit-details-marker {
    display: none;
}

.settings-preview {
    font-size: 12px;
    color: #666;
}

.settings-content {
    padding: 0 16px 16px;
}
```

### 5. Word Counter (字數統計)

```html
<div class="word-counter" id="wordCounter">
    <span class="count">0 個詞語</span>
    <span class="language-tag">粵語</span>
</div>
```

```css
.word-counter {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #666;
    margin-top: 8px;
    padding: 0 4px;
}

.language-tag {
    background: #e9ecef;
    padding: 2px 8px;
    border-radius: 4px;
}
```

### 6. Auto-Expanding Textarea

```javascript
function autoExpandTextarea(textarea) {
    textarea.style.height = 'auto';
    const newHeight = Math.min(
        Math.max(textarea.scrollHeight, 100),
        300
    );
    textarea.style.height = newHeight + 'px';
}
```

```css
#words {
    min-height: 100px;
    max-height: 300px;
    resize: none;
    overflow-y: auto;
    transition: height 0.2s ease;
}
```

## Data Models

### Progress State

```javascript
const progressState = {
    currentIndex: 0,      // 當前項目索引 (0-based)
    totalItems: 0,        // 總項目數
    currentItem: '',      // 當前朗讀的內容
    isReading: false,     // 是否正在朗讀
    isPaused: false       // 是否暫停
};
```

### Settings State

```javascript
const settingsState = {
    mode: 'word',           // 'word' | 'article'
    language: 'zh-HK',      // 語言代碼
    voice: 'auto',          // 聲音名稱
    wordSpeechRate: 0.9,    // 詞語模式語速
    repeatCount: 3,         // 每詞朗讀次數
    interval: 5,            // 詞語間隔秒數
    speechRate: 0.9,        // 文章模式語速
    sentenceRepeat: 2,      // 句子朗讀次數
    charWaitTime: 3,        // 每字等待秒數
    settingsPanelOpen: true // 設定面板展開狀態
};
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Progress Calculation Accuracy

*For any* list of N items where N > 0, after completing item K (1 ≤ K ≤ N), the progress percentage SHALL equal (K / N) * 100.

**Validates: Requirements 2.2**

### Property 2: Progress Text Format

*For any* reading state with current index K and total N, the progress text SHALL display exactly "K / N" format.

**Validates: Requirements 2.4**

### Property 3: Current Word Display Consistency

*For any* word or sentence being read, that exact content SHALL be displayed in the current word display area.

**Validates: Requirements 2.6, 9.1**

### Property 4: Mode Tab State Consistency

*For any* mode selection, the active tab SHALL have the 'active' class, and the input label and placeholder SHALL match the selected mode.

**Validates: Requirements 3.6**

### Property 5: Settings Preview Accuracy

*For any* combination of settings values, the settings preview text SHALL accurately reflect the current speed, repeat count, and interval values.

**Validates: Requirements 4.2**

### Property 6: Word Count Accuracy (Word Mode)

*For any* input text in word mode, the word counter SHALL display the exact count of non-empty lines.

**Validates: Requirements 5.1**

### Property 7: Character Count Accuracy (Article Mode)

*For any* input text in article mode, the character counter SHALL display the exact count of Chinese characters (Unicode range \u4e00-\u9fff).

**Validates: Requirements 5.2**

### Property 8: Textarea Height Adjustment

*For any* content change in the textarea, the height SHALL adjust to fit the content within the bounds of minimum (100px) and maximum (300px) heights.

**Validates: Requirements 6.1, 6.5**

### Property 9: Touch Target Minimum Size

*For any* interactive element (buttons, tabs, form controls), the computed height SHALL be at least 48px.

**Validates: Requirements 10.2**

### Property 10: Form Input Font Size

*For any* form input element (input, select, textarea), the computed font size SHALL be at least 16px.

**Validates: Requirements 10.3**

## Error Handling

### 1. Safe Area Fallback

當瀏覽器不支援 `env()` 函數時，使用固定的 fallback 值：

```css
.player-controls {
    padding-bottom: 12px; /* fallback */
    padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
}
```

### 2. LocalStorage Errors

```javascript
function safeSetItem(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.warn('無法保存設定:', e);
    }
}

function safeGetItem(key, defaultValue) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
        console.warn('無法讀取設定:', e);
        return defaultValue;
    }
}
```

### 3. Progress State Validation

```javascript
function updateProgress(current, total) {
    if (total <= 0) {
        console.warn('Invalid total items count');
        return;
    }
    const safeIndex = Math.max(0, Math.min(current, total));
    const percentage = (safeIndex / total) * 100;
    // Update UI...
}
```

## Testing Strategy

### Unit Tests

使用 Jest 或 Vitest 進行單元測試：

1. **Progress Calculation Tests**
   - 測試進度百分比計算
   - 測試邊界情況 (0%, 100%)
   - 測試無效輸入處理

2. **Word Counter Tests**
   - 測試詞語模式行數計算
   - 測試文章模式字數計算
   - 測試空白輸入處理

3. **Settings Preview Tests**
   - 測試預覽文字生成
   - 測試不同設定組合

### Property-Based Tests

使用 fast-check 進行屬性測試：

1. **Progress Property Tests**
   - 生成隨機項目列表，驗證進度計算
   - 生成隨機索引，驗證進度文字格式

2. **Word Count Property Tests**
   - 生成隨機文字，驗證行數計算
   - 生成隨機中文文字，驗證字數計算

3. **Height Adjustment Property Tests**
   - 生成隨機長度內容，驗證高度在範圍內

### Integration Tests

1. **Mode Switching Flow**
   - 切換模式後驗證 UI 狀態一致性

2. **Settings Panel Interaction**
   - 展開/摺疊後驗證狀態保存

3. **Playback Flow**
   - 開始/暫停/停止後驗證進度顯示

### Visual Regression Tests

1. **Mobile Layout**
   - 在 375px 寬度下截圖比對

2. **Safe Area Rendering**
   - 在 iPhone 模擬器中驗證安全區域

3. **Dark Mode (Future)**
   - 驗證深色模式下的對比度
