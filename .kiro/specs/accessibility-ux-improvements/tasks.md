# Implementation Plan: Accessibility & UX Improvements

## Overview

本實現計劃將「默書神器」的無障礙性與 UX 改進分為三個階段執行：高優先級無障礙性修復、中優先級 UX 改進、低優先級效能優化。所有修改都在 `auto_dic.html` 單一文件中完成。

## Tasks

- [x] 1. Phase 1: 高優先級無障礙性修復

- [x] 1.1 添加 ARIA Live Region 到狀態區域
  - 為 `#statusReading` 添加 `aria-live="polite"` 和 `aria-atomic="true"`
  - 為 `#statusWaiting` 添加 `aria-live="polite"`
  - 為 `#statusCount` 添加 `aria-live="polite"`
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 1.2 添加 prefers-reduced-motion 支援
  - 在 CSS 中添加 `@media (prefers-reduced-motion: reduce)` 媒體查詢
  - 禁用 `.tab-indicator`、`.segment-indicator`、`.collapsible-content`、`.progress-fill` 的過渡動畫
  - 在 JavaScript 中檢測 `prefersReducedMotion` 並修改 `animateProgressTo()` 函數
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 1.3 進度條添加完整 ARIA 屬性
  - 為 `.progress-bar-inline` 添加 `id="progressBar"`、`role="progressbar"`
  - 添加 `aria-valuenow="0"`、`aria-valuemin="0"`、`aria-valuemax="100"`、`aria-label="朗讀進度"`
  - 創建 `updateProgressBarAria(current, total)` 函數
  - 在 `updateProgress()` 中調用 ARIA 更新函數
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 1.4 添加 Skip Link
  - 在 `<body>` 開頭添加 `<a href="#main-content" class="skip-link">跳至主要內容</a>`
  - 為主要內容區域添加 `id="main-content"`
  - 添加 `.skip-link` CSS 樣式（預設隱藏，focus 時顯示）
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 1.5 Checkpoint - Phase 1 驗證
  - 確保所有 ARIA 屬性正確添加
  - 使用螢幕閱讀器測試狀態播報
  - 測試 Tab 鍵導航 Skip Link 功能

- [x] 2. Phase 2: 中優先級 UX 改進

- [x] 2.1 增強 Focus 樣式
  - 添加基礎 `:focus` 和 `:focus-visible` 樣式
  - 添加 `:focus:not(:focus-visible)` 重置樣式
  - 為 button、input、select、textarea 添加 focus 樣式
  - 為 `.mode-tab`、`.lang-tab`、`.segment` 添加 focus 樣式
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 2.2 添加鍵盤快捷鍵
  - 創建 `initKeyboardShortcuts()` 函數
  - 實現 Space 鍵開始/暫停功能（排除 textarea/input 焦點）
  - 實現 Escape 鍵停止功能
  - 在 DOMContentLoaded 中初始化
  - 添加快捷鍵提示 UI
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 2.3 改進顏色對比度
  - 將 `--color-disabled` 從 `#ccc` 改為 `#767676`
  - 將 `--color-text-muted` 從 `#666` 改為 `#595959`
  - _Requirements: 7.1, 7.2, 7.3_

- [x] 2.4 添加錯誤邊界處理
  - 在 `startReading()` 中添加 try-catch 包裹
  - 創建 `showErrorToast(message)` 函數
  - 添加 `.error-toast` CSS 樣式和 fadeInOut 動畫
  - 確保錯誤時調用 `resetButtons()`
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 2.5 添加輸入驗證與 XSS 防護
  - 創建 `sanitizeInput(text)` 函數
  - 在 `startReading()` 中使用 sanitizeInput 處理輸入
  - _Requirements: 9.1, 9.2, 9.3_

- [x] 2.6 Write property test for sanitizeInput

  - **Property 6: 輸入清理完整性**
  - 生成包含 HTML 標籤的隨機字串
  - 驗證輸出不含任何 HTML 標籤
  - **Validates: Requirements 9.1, 9.2, 9.3**

- [x] 2.7 添加載入狀態指示
  - 添加 `.select-wrapper` 包裹 select 元素
  - 添加 `#voiceLoading` loading spinner HTML
  - 添加 `.loading-spinner` CSS 樣式和 spin 動畫
  - 在 `loadVoices()` 中控制 spinner 顯示/隱藏
  - _Requirements: 10.1, 10.2, 10.3_

- [x] 2.8 修復記憶體洩漏風險
  - 創建 `cleanup()` 函數
  - 添加 `beforeunload` 事件監聽器調用 cleanup
  - 添加 `visibilitychange` 事件處理（頁面隱藏時暫停）
  - _Requirements: 11.1, 11.2, 11.3, 11.4_

- [x] 2.9 Checkpoint - Phase 2 驗證
  - 測試純鍵盤導航體驗
  - 測試快捷鍵功能
  - 測試錯誤處理流程
  - 驗證顏色對比度

- [x] 3. Phase 3: 低優先級效能優化

- [x] 3.1 添加深色模式支援
  - 添加 `@media (prefers-color-scheme: dark)` 媒體查詢
  - 定義深色模式下的所有顏色變數
  - 調整 `.settings-panel`、`.segmented-control`、`.mode-tabs`、`.lang-tabs` 深色背景
  - _Requirements: 12.1, 12.2, 12.3_

- [x] 3.2 效能優化 - 動畫
  - 為 `.progress-fill` 添加 `will-change: width` 和 `transform: translateZ(0)`
  - 為 `.tab-indicator`、`.segment-indicator` 添加 `will-change: left, width`
  - 為 `.collapsible-content` 添加 `will-change: height`
  - _Requirements: 13.1, 13.2, 13.3_

- [x] 3.3 效能優化 - 防抖處理
  - 創建通用 `debounce(func, wait)` 函數
  - 創建 `debouncedSaveSettings = debounce(saveSettings, 500)`
  - 修改 textarea input 事件使用防抖版本
  - _Requirements: 14.1, 14.2, 14.3_

- [x] 3.4 Write property test for debounce

  - **Property 9: 防抖函數行為**
  - 生成隨機調用序列
  - 驗證實際執行次數符合預期
  - **Validates: Requirements 14.1, 14.2, 14.3**

- [x] 3.5 添加空狀態處理
  - 修改 `startReading()` 空輸入處理邏輯
  - 移除 `alert()` 改用 `updateStatus()`
  - 添加自動聚焦到輸入框
  - 添加 `.input-error` CSS 樣式和 shake 動畫
  - _Requirements: 15.1, 15.2, 15.3, 15.4_

- [x] 3.6 Final Checkpoint - 完整驗證
  - 使用 WAVE 工具檢測無障礙性
  - 使用 axe DevTools 檢測
  - 測試深色模式視覺效果
  - 測試減少動畫模式
  - 驗證所有原有功能正常運作

## Notes

- Tasks marked with `*` are optional property-based tests
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- All modifications are in the single file `auto_dic.html`
- Property tests validate universal correctness properties
