# Implementation Plan: Button State Sync Fix

## Overview

修復頁面刷新後滑動指示器位置與實際選中值不同步的問題。主要修改 `updateSegmentedControl()` 函數和 `loadSettings()` 函數中的語言標籤處理邏輯。

## Tasks

- [x] 1. 修改 updateSegmentedControl 函數
  - 在 `auto_dic.html` 中找到 `updateSegmentedControl` 函數
  - 在更新 active class 後，新增更新 segment-indicator 位置的程式碼
  - 使用 `transition: none` 避免載入時的動畫
  - _Requirements: 3.1, 3.2_

- [x] 2. 修改 loadSettings 函數中的語言標籤處理
  - 在 `loadSettings()` 函數中找到語言設定載入的部分
  - 在更新 lang-tab 的 active class 後，新增更新 tab-indicator 位置的程式碼
  - 確保使用 `transition: none` 避免載入時的動畫
  - _Requirements: 1.1, 1.2_

- [x] 3. 驗證模式標籤指示器同步
  - 檢查 `loadSettings()` 中模式標籤的處理是否已經有更新指示器的程式碼
  - 如果沒有，新增相應的程式碼
  - _Requirements: 2.1, 2.2_

- [x] 4. 處理設定面板關閉時的指示器更新
  - 在設定面板的 toggle 事件中，當面板開啟時更新內部的 segmented control 指示器
  - 使用 `updateSegmentedControlIndicators()` 函數
  - _Requirements: 4.1, 4.2_

- [x] 5. Checkpoint - 手動測試驗證
  - 設定不同的語言（英文、粵語）
  - 設定不同的模式（讀文章）
  - 修改朗讀設定中的各項設定
  - 刷新頁面，驗證所有滑動指示器位置正確
  - 確保所有測試通過，如有問題請詢問用戶

## Notes

- 此修復不需要新增測試檔案，因為主要是 DOM 操作的視覺同步
- 修改後應該在多種瀏覽器中測試（Chrome、Safari、Firefox）
- 注意 iOS Safari 的相容性
