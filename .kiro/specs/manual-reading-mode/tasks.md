# Implementation Plan: Manual Reading Mode

## Overview

本實作計劃將手動朗讀功能分為多個階段：首先建立狀態管理和核心邏輯，然後實作 UI 組件，最後加入鍵盤支援和測試。

## Tasks

- [x] 1. 建立 ManualReadingState 狀態管理物件
  - 在 auto_dic.html 的 JavaScript 區塊中加入 ManualReadingState 物件
  - 實作 reset(), initItems(), getCurrentItem(), moveNext(), movePrevious(), isAtFirst(), isAtLast() 方法
  - _Requirements: 3.2, 4.2, 5.2, 5.3_

- [x] 1.1 撰寫 ManualReadingState 屬性測試
  - **Property 3: Index Navigation Bounds**
  - **Validates: Requirements 4.2, 5.2, 5.3**

- [x] 2. 實作朗讀模式切換 UI
  - [x] 2.1 在朗讀設定面板中加入模式切換控制項
    - 使用現有的 segmented-control 樣式
    - 加入隱藏的 input 元素儲存值
    - _Requirements: 1.1, 1.2_

  - [x] 2.2 實作 switchReadingMode() 函數
    - 切換自動/手動控制按鈕的顯示
    - 停止任何進行中的朗讀
    - 儲存設定到 localStorage
    - _Requirements: 1.3, 1.4, 8.1, 8.2, 8.3_

  - [x] 2.3 更新 loadSettings() 和 saveSettings() 函數
    - 加入 readingMode 設定的儲存和載入
    - _Requirements: 1.5, 1.6_

- [x] 2.4 撰寫模式切換屬性測試
  - **Property 1: Control Visibility Matches Reading Mode**
  - **Property 2: Reading Mode Persistence Round Trip**
  - **Validates: Requirements 1.3, 1.4, 1.5, 1.6, 2.2**

- [x] 3. 實作手動控制按鈕 UI
  - [x] 3.1 在 player-controls-wrapper 中加入手動控制按鈕組
    - 四個按鈕：上一個、開始/重讀、取消、下一個
    - 預設隱藏 (hidden class)
    - 加入適當的 ARIA 標籤
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 3.2 加入手動控制按鈕的 CSS 樣式
    - 與現有按鈕樣式一致
    - 支援深色模式
    - _Requirements: 2.3_

- [x] 4. 實作手動朗讀核心功能
  - [x] 4.1 實作 manualStartOrReplay() 函數
    - 首次點擊初始化並朗讀第一個項目
    - 後續點擊重讀當前項目
    - 更新按鈕標籤
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [x] 4.2 實作 manualNext() 函數
    - 移動到下一個項目並朗讀
    - 更新進度和高亮
    - _Requirements: 4.2, 4.3, 4.5, 4.6_

  - [x] 4.3 實作 manualPrevious() 函數
    - 移動到上一個項目並朗讀
    - 第一個項目時重讀
    - 更新進度和高亮
    - _Requirements: 5.2, 5.3, 5.4, 5.5, 5.6_

  - [x] 4.4 實作 manualStop() 函數
    - 停止語音合成
    - 重置所有狀態
    - 切換回編輯模式
    - _Requirements: 6.2, 6.3, 6.4, 6.5, 6.6_

  - [x] 4.5 實作 readCurrentItem() 函數
    - 朗讀當前索引的項目
    - 更新高亮和狀態顯示
    - _Requirements: 3.6, 7.1_

- [x] 4.6 撰寫手動朗讀核心功能屬性測試
  - **Property 4: Button State Consistency**
  - **Property 5: Highlight Follows Index**
  - **Property 6: Progress Reflects Index**
  - **Property 7: Start Button Label State**
  - **Property 10: Cancel Resets All State**
  - **Validates: Requirements 3.1, 3.3, 3.5, 3.6, 4.1, 4.4, 4.5, 4.6, 5.1, 5.5, 5.6, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 7.3**

- [x] 5. 實作 UI 更新函數
  - [x] 5.1 實作 updateManualButtonStates() 函數
    - 根據 ManualReadingState 更新按鈕禁用狀態
    - _Requirements: 3.5, 4.1, 4.4, 5.1, 6.1_

  - [x] 5.2 實作 updateManualStartButtonLabel() 函數
    - 根據 hasStarted 更新按鈕標籤
    - _Requirements: 3.1, 3.3, 6.6_

  - [x] 5.3 實作 updateManualProgress() 函數
    - 更新進度條和狀態計數
    - _Requirements: 7.2, 7.3_

  - [x] 5.4 實作 updateKeyboardHint() 函數
    - 根據模式更新鍵盤提示文字
    - _Requirements: 9.1_

- [x] 6. Checkpoint - 確保基本功能正常運作
  - 確保所有測試通過，如有問題請詢問用戶

- [x] 7. 實作鍵盤快捷鍵支援
  - [x] 7.1 實作 handleManualKeyboard() 函數
    - 處理方向鍵、空白鍵、Escape 鍵
    - 檢查輸入框焦點狀態
    - _Requirements: 9.2, 9.3, 9.4, 9.5, 9.6_

  - [x] 7.2 更新現有的鍵盤事件監聽器
    - 根據朗讀模式分派到不同的處理函數
    - _Requirements: 9.1_

- [x] 7.3 撰寫鍵盤快捷鍵屬性測試
  - **Property 9: Keyboard Action Mapping**
  - **Validates: Requirements 9.2, 9.3, 9.4, 9.5**

- [x] 8. 實作模式切換時的狀態處理
  - [x] 8.1 更新 switchReadingMode() 處理進行中的朗讀
    - 停止當前朗讀
    - 重置狀態
    - _Requirements: 8.1, 8.2_

  - [x] 8.2 確保文字內容在切換時保持不變
    - _Requirements: 8.4_

- [x] 8.3 撰寫模式切換屬性測試
  - **Property 8: Text Preservation on Mode Switch**
  - **Validates: Requirements 8.4**

- [x] 9. 初始化和整合
  - [x] 9.1 在 initSegmentedControls() 中加入 readingModeSegments 初始化
    - _Requirements: 1.2_

  - [x] 9.2 在頁面載入時初始化手動朗讀狀態
    - 根據儲存的設定顯示正確的控制按鈕
    - _Requirements: 1.6_

  - [x] 9.3 加入觸覺反饋支援（如適用）
    - _Requirements: 2.3_

- [x] 10. Final Checkpoint - 確保所有功能正常運作
  - 確保所有測試通過，如有問題請詢問用戶

## Notes

- 所有任務（包括測試任務）都是必要的
- 每個任務都參考了具體的需求編號以確保可追溯性
- Checkpoint 任務用於確保階段性驗證
- 屬性測試驗證通用的正確性屬性
- 單元測試驗證具體的範例和邊界情況
