# Design Document: Button State Sync Fix

## Overview

修復頁面刷新後，滑動指示器（Sliding Indicator）位置與實際選中值不同步的問題。問題根源在於 `loadSettings()` 函數更新了按鈕的 `active` class 和隱藏 input 的值，但沒有更新對應的滑動指示器位置。

## Architecture

### 問題分析

目前的程式碼流程：
1. 頁面載入時，HTML 中的按鈕預設為第一個選項（如中文、讀詞）
2. `initLangTabs()` 和 `initSegmentedControl()` 建立滑動指示器，並根據當時的 `.active` class 設定初始位置
3. `loadSettings()` 從 localStorage 載入設定，更新 `.active` class 和隱藏 input 值
4. **問題**：滑動指示器已經在步驟 2 定位到預設位置，步驟 3 沒有重新定位它們

### 解決方案

在 `loadSettings()` 中，每次更新 `.active` class 後，同時更新對應的滑動指示器位置。

## Components and Interfaces

### 需要修改的函數

#### 1. `updateSegmentedControl(containerId, value)`

現有功能：更新 segment 的 `active` class
需要新增：更新 `segment-indicator` 的位置

```javascript
function updateSegmentedControl(containerId, value) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.querySelectorAll('.segment').forEach(segment => {
        const isActive = segment.getAttribute('data-value') === value;
        segment.classList.toggle('active', isActive);
        segment.setAttribute('aria-checked', isActive ? 'true' : 'false');
    });
    
    // 新增：更新滑動指示器位置
    const activeSegment = container.querySelector('.segment.active');
    const indicator = container.querySelector('.segment-indicator');
    if (activeSegment && indicator) {
        indicator.style.transition = 'none';
        indicator.style.left = activeSegment.offsetLeft + 'px';
        indicator.style.width = activeSegment.offsetWidth + 'px';
        indicator.offsetHeight; // Force reflow
        indicator.style.transition = '';
    }
}
```

#### 2. `loadSettings()` - 語言標籤部分

現有功能：更新 lang-tab 的 `active` class
需要新增：更新 `tab-indicator` 的位置

```javascript
if (settings.lang) {
    document.getElementById('langSelect').value = settings.lang;
    const langTabs = document.querySelectorAll('.lang-tab');
    langTabs.forEach(tab => {
        if (tab.getAttribute('data-lang') === settings.lang) {
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            tab.setAttribute('tabindex', '0');
        } else {
            tab.classList.remove('active');
            tab.setAttribute('aria-selected', 'false');
            tab.setAttribute('tabindex', '-1');
        }
    });
    
    // 新增：更新語言標籤的滑動指示器
    const activeLangTab = document.querySelector('.lang-tab.active');
    const langIndicator = document.querySelector('.lang-tabs .tab-indicator');
    if (activeLangTab && langIndicator) {
        langIndicator.style.transition = 'none';
        langIndicator.style.left = activeLangTab.offsetLeft + 'px';
        langIndicator.style.width = activeLangTab.offsetWidth + 'px';
        langIndicator.offsetHeight; // Force reflow
        langIndicator.style.transition = '';
    }
}
```

### 新增輔助函數

#### `updateTabIndicator(tabsContainerSelector)`

通用函數，用於更新任何 tab 容器的滑動指示器：

```javascript
/**
 * Update tab indicator position to match the active tab
 * @param {string} tabsContainerSelector - CSS selector for the tabs container
 */
function updateTabIndicator(tabsContainerSelector) {
    const container = document.querySelector(tabsContainerSelector);
    if (!container) return;
    
    const activeTab = container.querySelector('.active');
    const indicator = container.querySelector('.tab-indicator');
    
    if (activeTab && indicator) {
        indicator.style.transition = 'none';
        indicator.style.left = activeTab.offsetLeft + 'px';
        indicator.style.width = activeTab.offsetWidth + 'px';
        indicator.offsetHeight; // Force reflow
        indicator.style.transition = '';
    }
}
```

## Data Models

無需新增資料模型，此修復僅涉及 UI 狀態同步。

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Tab Indicator Position Matches Active Tab

*For any* tab container (lang-tabs or mode-tabs) and any saved setting value, after `loadSettings()` is called, the tab indicator's `left` position SHALL equal the active tab's `offsetLeft`, and the indicator's `width` SHALL equal the active tab's `offsetWidth`.

**Validates: Requirements 1.1, 2.1**

### Property 2: Segmented Control Indicator Position Matches Active Segment

*For any* segmented control and any saved setting value, after `loadSettings()` is called, the segment indicator's `left` position SHALL equal the active segment's `offsetLeft`, and the indicator's `width` SHALL equal the active segment's `offsetWidth`.

**Validates: Requirements 3.1**

### Property 3: Settings Panel Open Triggers Indicator Update

*For any* settings panel that was closed during page load, when the panel is opened, all segmented control indicators within it SHALL have their positions updated to match their respective active segments.

**Validates: Requirements 4.1, 4.2**

## Error Handling

- 如果找不到指示器元素（indicator 尚未建立），函數應該安全地跳過更新
- 如果找不到 active 元素，函數應該安全地跳過更新
- 使用 `if (element && indicator)` 檢查確保不會拋出錯誤

## Testing Strategy

### Unit Tests

1. 測試 `updateSegmentedControl` 函數是否正確更新指示器位置
2. 測試 `updateTabIndicator` 函數是否正確更新 tab 指示器位置
3. 測試 `loadSettings` 後各指示器位置是否正確

### Property-Based Tests

由於此修復主要涉及 DOM 操作和視覺狀態同步，property-based testing 的價值有限。主要測試應該是：

1. **Indicator Position Property**: 對於任意有效的設定值，載入後指示器位置應該與 active 元素位置一致
2. **Round-trip Property**: 保存設定 → 刷新頁面 → 載入設定後，視覺狀態應該與保存前一致

### Manual Testing

1. 設定各種不同的語言和模式組合
2. 刷新頁面
3. 驗證所有滑動指示器位置正確
4. 開啟/關閉設定面板，驗證指示器位置正確
