# Implementation Plan: Auto Complete Full Read

## Overview

實作自動模式播放完畢後的完整朗讀功能，包含設定開關、提示訊息廣播、完整朗讀執行和狀態顯示。

## Tasks

- [x] 1. 新增 UI 設定開關
  - [x] 1.1 在設定面板中新增完整朗讀開關控制項
    - 在「朗讀模式」設定之後新增 segmented control
    - 包含 hidden input 儲存值
    - 新增說明提示文字
    - _Requirements: 1.1, 1.2_

  - [x] 1.2 實作模式切換時的可見性控制
    - 新增 updateFullReadControlVisibility 函數
    - 在 toggleReadingMode 中呼叫
    - 自動模式顯示，手動模式隱藏
    - _Requirements: 5.1, 5.2_

- [x] 2. 實作核心功能函數
  - [x] 2.1 實作 getFullReadAnnouncementMessage 函數
    - 根據語言代碼返回對應提示訊息
    - 支援 zh-HK、zh-CN、en-GB
    - 無效語言返回預設訊息
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 2.2 寫屬性測試：Announcement Message Language Consistency
    - **Property 2: Announcement Message Language Consistency**
    - **Validates: Requirements 2.1, 2.2, 2.3**

  - [x] 2.3 實作 readWordsOnce 函數
    - 詞語模式的完整朗讀
    - 每個詞語只朗讀一次
    - 更新進度條和高亮
    - _Requirements: 3.1, 3.3, 3.4, 3.5, 3.6_

  - [x] 2.4 實作 readArticleOnce 函數
    - 文章模式的完整朗讀
    - 每個句子只朗讀一次
    - 更新進度條和高亮
    - _Requirements: 3.1, 3.3, 3.4, 3.5, 3.6_

  - [x] 2.5 實作 performFullRead 函數
    - 根據模式呼叫對應的朗讀函數
    - 使用當前朗讀速度設定
    - 更新狀態顯示
    - _Requirements: 3.1, 3.2, 4.2_

- [x] 3. 修改 startReading 函數
  - [x] 3.1 在自動朗讀完成後檢查完整朗讀設定
    - 檢查 fullReadEnabled 和 readingMode
    - 只在自動模式且功能啟用時執行
    - _Requirements: 5.1, 5.3_

  - [x] 3.2 實作提示訊息廣播
    - 更新狀態為「準備完整朗讀...」
    - 使用 speakPromise 廣播提示訊息
    - 使用相同的語音和速度設定
    - _Requirements: 2.4, 4.1_

  - [x] 3.3 實作完整朗讀流程
    - 重置進度條
    - 重新啟用高亮
    - 呼叫 performFullRead
    - 完成後顯示「播放完畢」
    - _Requirements: 3.1, 3.5, 3.6, 4.3_

  - [x] 3.4 實作停止處理
    - 提示訊息期間可停止
    - 完整朗讀期間可停止
    - 停止後不繼續執行
    - _Requirements: 2.5, 3.7_

- [x] 4. 實作設定持久化
  - [x] 4.1 修改 saveSettings 函數
    - 新增 fullReadEnabled 到設定物件
    - _Requirements: 1.3_

  - [x] 4.2 修改 loadSettings 函數
    - 載入 fullReadEnabled 設定
    - 更新 segmented control 狀態
    - _Requirements: 1.4_

  - [x] 4.3 寫屬性測試：Setting Persistence Round Trip
    - **Property 1: Setting Persistence Round Trip**
    - **Validates: Requirements 1.3, 1.4**

- [x] 5. Checkpoint - 確保所有測試通過
  - 執行所有測試
  - 確認功能正常運作
  - 如有問題請詢問用戶

- [x] 6. 實作額外屬性測試
  - [x] 6.1 寫屬性測試：Full Read Ignores Repeat Settings
    - **Property 3: Full Read Ignores Repeat Settings**
    - **Validates: Requirements 3.3**

  - [x] 6.2 寫屬性測試：Mode Restriction
    - **Property 5: Mode Restriction**
    - **Validates: Requirements 5.1, 5.2**

- [x] 7. Final Checkpoint - 確保所有測試通過
  - 執行所有測試
  - 確認功能完整
  - 如有問題請詢問用戶

## Notes

- All tasks are required for comprehensive testing
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
