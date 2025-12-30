# Implementation Plan: Text Highlight During Speech

## Overview

實作文字高亮功能，在朗讀時於文字顯示區域高亮顯示正在朗讀的詞語或句子。採用漸進式實作方式，先建立核心高亮機制，再整合到現有朗讀流程。

## Tasks

- [x] 1. 新增高亮相關的 CSS 樣式
  - 在 `<style>` 區塊新增 `.text-display-container` 樣式
  - 新增 `.highlight-item` 和 `.highlight-item.active` 樣式
  - 新增深色模式和減少動畫偏好的樣式
  - _Requirements: 2.3, 5.2, 5.3_

- [x] 2. 實作 HighlightManager 模組
  - [x] 2.1 建立 HighlightManager 物件結構和狀態變數
    - 定義 `isDisplayMode`, `currentHighlightIndex`, `items` 等狀態
    - 實作 `init()` 方法建立 displayContainer DOM 元素
    - _Requirements: 1.1, 6.1_

  - [x] 2.2 實作 `splitText(text, mode)` 方法
    - 詞語模式：按行分割
    - 文章模式：使用現有的 `splitIntoSentences()` 函數
    - _Requirements: 1.2, 1.3_

  - [x] 2.3 實作 `switchToDisplayMode(text, mode)` 方法
    - 隱藏 textarea，建立並顯示 displayContainer
    - 為每個項目建立 `<span class="highlight-item">` 元素
    - 設定 ARIA 屬性
    - _Requirements: 1.1, 5.1, 6.2_

  - [x] 2.4 實作 `switchToEditMode()` 方法
    - 隱藏 displayContainer，顯示 textarea
    - 重置高亮狀態
    - _Requirements: 4.1, 6.3_

  - [x] 2.5 實作 `highlightItem(index)` 和 `clearHighlight()` 方法
    - 移除前一個高亮，添加新高亮
    - 呼叫 `scrollToHighlight()` 確保可見
    - _Requirements: 2.1, 2.2, 2.4_

  - [x] 2.6 實作 `scrollToHighlight()` 方法
    - 檢查高亮項目是否在可見區域
    - 只在需要時才捲動
    - 尊重減少動畫偏好
    - _Requirements: 3.1, 3.3, 5.3_

- [x] 3. 整合 HighlightManager 到朗讀流程
  - [x] 3.1 修改 `startDictation()` 函數
    - 在朗讀開始時呼叫 `HighlightManager.switchToDisplayMode()`
    - 傳入正確的文字和模式
    - _Requirements: 6.2_

  - [x] 3.2 修改 `readWords()` 函數整合高亮
    - 在每個詞語開始朗讀時呼叫 `highlightItem(lineIdx)`
    - 確保重複朗讀時維持高亮
    - _Requirements: 2.1, 4.4_

  - [x] 3.3 修改 `readArticle()` 函數整合高亮
    - 在每個句子開始朗讀時呼叫 `highlightItem(idx)`
    - 確保重複朗讀時維持高亮
    - _Requirements: 2.1, 4.4_

  - [x] 3.4 修改 `stopDictation()` 函數
    - 在停止時呼叫 `HighlightManager.switchToEditMode()`
    - 確保清理所有高亮狀態
    - _Requirements: 4.1, 6.3_

  - [x] 3.5 修改 `togglePause()` 函數
    - 暫停時維持當前高亮
    - 恢復時繼續正常高亮流程
    - _Requirements: 2.4, 4.2, 4.3_

- [x] 4. Checkpoint - 功能測試
  - 手動測試詞語模式和文章模式的高亮功能
  - 測試暫停/恢復/停止時的高亮行為
  - 測試捲動行為
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. 撰寫單元測試
  - [x] 5.1 測試 `splitText()` 方法
    - 測試詞語模式的行分割
    - 測試文章模式的句子分割
    - 測試邊界情況（空行、特殊字元）
    - _Requirements: 1.2, 1.3_

  - [x] 5.2 測試 DOM 操作方法
    - 測試 `switchToDisplayMode()` 的 DOM 結構
    - 測試 `switchToEditMode()` 的清理行為
    - _Requirements: 6.2, 6.3_

- [x] 6. 撰寫屬性測試
  - [x] 6.1 Property 1: 文字內容保留 round-trip 測試
    - **Property 1: Text Content Preservation**
    - **Validates: Requirements 1.4, 6.3**

  - [x] 6.2 Property 2: 文字分割正確性測試
    - **Property 2: Text Segmentation Correctness**
    - **Validates: Requirements 1.2, 1.3**

  - [x] 6.3 Property 6: 模式切換正確性測試
    - **Property 6: Mode Switching Correctness**
    - **Validates: Requirements 6.1, 6.2**

- [x] 7. Final Checkpoint
  - 確保所有測試通過
  - 確認無障礙功能正常
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- 此功能需要修改現有的 `auto_dic.html` 檔案
- 高亮功能應該是漸進增強，即使失敗也不影響核心朗讀功能
- 測試時需要注意 iOS Safari 的相容性
- 所有測試任務都是必要的，確保功能的正確性和穩定性
