# Design Document

## Overview

本設計文件詳細說明「默書神器」無障礙性與 UX 改進的技術實現方案。所有改進都在單一文件 `auto_dic.html` 中實現，包含 HTML 結構修改、CSS 樣式添加和 JavaScript 功能增強。

## Architecture

### 修改範圍

```
auto_dic.html
├── HTML 結構修改
│   ├── ARIA 屬性添加
│   ├── Skip Link 元素
│   ├── 進度條語義化
│   └── 載入指示器
├── CSS 樣式添加
│   ├── 焦點樣式
│   ├── 減少動畫媒體查詢
│   ├── 深色模式
│   ├── 錯誤提示樣式
│   └── 效能優化
└── JavaScript 功能
    ├── 鍵盤快捷鍵
    ├── ARIA 更新函數
    ├── 錯誤處理
    ├── 輸入驗證
    ├── 防抖處理
    └── 資源清理
```

## Components and Interfaces

### 1. ARIA Live Region 組件

```html
<!-- 狀態區域 -->
<span id="statusReading" aria-live="polite" aria-atomic="true"></span>
<span id="statusWaiting" aria-live="polite"></span>
<span id="statusCount" aria-live="polite">詞語 0 個</span>
```

### 2. 進度條組件

```html
<div class="progress-bar-inline" 
     id="progressBar"
     role="progressbar" 
     aria-valuenow="0" 
     aria-valuemin="0" 
     aria-valuemax="100" 
     aria-label="朗讀進度">
    <div class="progress-fill" id="progressFill"></div>
</div>
```

### 3. Skip Link 組件

```html
<a href="#main-content" class="skip-link">跳至主要內容</a>
```

### 4. 錯誤 Toast 組件

```javascript
function showErrorToast(message) {
    const toast = document.createElement('div');
    toast.className = 'error-toast';
    toast.setAttribute('role', 'alert');
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}
```

### 5. 輸入清理函數

```javascript
function sanitizeInput(text) {
    if (!text || typeof text !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.textContent;
}
```

### 6. 防抖函數

```javascript
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
```

### 7. 資源清理函數

```javascript
function cleanup() {
    stopProgressAnimation();
    if (window.currentTimer) {
        clearInterval(window.currentTimer);
        window.currentTimer = null;
    }
    if (synth) synth.cancel();
    isStopped = true;
    isPaused = false;
    isSpeaking = false;
}
```

## Data Models

### 動畫偏好狀態

```javascript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

### 進度條 ARIA 更新

```javascript
function updateProgressBarAria(current, total) {
    const progressBar = document.getElementById('progressBar');
    if (!progressBar) return;
    const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
    progressBar.setAttribute('aria-valuenow', percentage);
    progressBar.setAttribute('aria-valuetext', `已完成 ${current} / ${total}`);
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: ARIA Live Region 通知一致性

*For any* 狀態更新操作，更新後的 DOM 元素 SHALL 包含正確的 aria-live 屬性值，且 Screen Reader 能夠接收到通知。

**Validates: Requirements 1.1, 1.2, 1.3, 1.4**

### Property 2: 減少動畫偏好響應

*For any* 啟用 prefers-reduced-motion 的環境，所有 CSS transition 和 animation 的 duration SHALL 為 0 或極小值，且 JavaScript 動畫函數 SHALL 直接設定最終值。

**Validates: Requirements 2.1, 2.2, 2.3, 2.4**

### Property 3: 進度條 ARIA 值同步

*For any* 進度更新操作，aria-valuenow 的值 SHALL 等於 Math.round((current / total) * 100)，且 aria-valuetext SHALL 包含當前進度的文字描述。

**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

### Property 4: 焦點可見性

*For any* 可互動元素，當使用鍵盤導航獲得焦點時，SHALL 顯示符合 WCAG 標準的焦點指示器；當使用滑鼠點擊時，SHALL 不顯示焦點指示器。

**Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5**

### Property 5: 鍵盤快捷鍵條件執行

*For any* 鍵盤事件，當焦點在 textarea 或 input 元素時，快捷鍵 SHALL 不被攔截；當焦點在其他元素時，Space 和 Escape 鍵 SHALL 觸發對應功能。

**Validates: Requirements 6.1, 6.2, 6.3**

### Property 6: 輸入清理完整性

*For any* 包含 HTML 標籤的輸入字串，經過 sanitizeInput 處理後 SHALL 不包含任何 HTML 標籤，且原始文字內容 SHALL 被保留。

**Validates: Requirements 9.1, 9.2, 9.3**

### Property 7: 顏色對比度合規

*For any* 文字與背景顏色組合，對比度 SHALL 至少達到 4.5:1 (WCAG AA 標準)。

**Validates: Requirements 7.1, 7.2, 7.3**

### Property 8: 資源清理完整性

*For any* 頁面卸載事件，所有計時器 SHALL 被清除，語音合成 SHALL 被取消，狀態變數 SHALL 被重置。

**Validates: Requirements 11.1, 11.2, 11.3, 11.4**

### Property 9: 防抖函數行為

*For any* 連續快速調用 debounced 函數，實際執行次數 SHALL 遠小於調用次數，且最後一次調用的參數 SHALL 被使用。

**Validates: Requirements 14.1, 14.2, 14.3**

## Error Handling

### 語音合成錯誤

```javascript
async function startReading() {
    try {
        // 朗讀邏輯
    } catch (error) {
        console.error('朗讀過程發生錯誤:', error);
        updateStatus('發生錯誤，請重試', '');
        showErrorToast('語音功能暫時無法使用，請檢查瀏覽器設定');
        resetButtons();
    }
}
```

### 空輸入處理

```javascript
if (text.trim() === '') {
    updateStatus('請先輸入內容', '');
    document.getElementById('words').focus();
    const textarea = document.getElementById('words');
    textarea.classList.add('input-error');
    setTimeout(() => textarea.classList.remove('input-error'), 2000);
    return;
}
```

## Testing Strategy

### 單元測試

- 測試 `sanitizeInput()` 函數對各種輸入的處理
- 測試 `debounce()` 函數的延遲執行行為
- 測試 `updateProgressBarAria()` 函數的 ARIA 屬性更新

### Property-Based Testing

使用 fast-check 或類似框架進行屬性測試：

1. **Property 6 測試**: 生成隨機 HTML 字串，驗證 sanitizeInput 輸出不含標籤
2. **Property 9 測試**: 生成隨機調用序列，驗證 debounce 行為

### 無障礙性測試

- 使用 WAVE 工具檢測 ARIA 屬性
- 使用 axe DevTools 檢測對比度和語義
- 使用 VoiceOver/NVDA 測試螢幕閱讀器體驗
- 純鍵盤導航測試

### 跨瀏覽器測試

- Chrome、Safari、Firefox、Edge
- iOS Safari、Android Chrome

### 效能測試

- 使用 Chrome DevTools Performance 面板測試動畫幀率
- 驗證 localStorage 寫入頻率（防抖效果）
