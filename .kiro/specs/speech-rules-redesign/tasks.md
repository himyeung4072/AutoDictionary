# Implementation Plan: Speech Rules Redesign

## Overview

重新設計朗讀規則系統，實作新的文章分割邏輯和朗讀順序，加入標點符號朗讀開關設定。

## Tasks

- [x] 1. 新增標點符號朗讀設定 UI
  - [x] 1.1 在設定面板加入標點符號朗讀開關
    - 在 `articleControls` 區域加入 toggle switch
    - 使用現有的 segmented control 樣式63
    
    - 預設為開啟
    - _Requirements: 1.1, 1.5_
  
  - [x] 1.2 更新 saveSettings() 和 loadSettings() 函數
    - 加入 `punctuationReadingEnabled` 設定項
    - 確保設定持久化到 localStorage
    - _Requirements: 1.4_

- [x] 2. 實作文章分割模組
  - [x] 2.1 建立 `splitArticleSegments(text)` 函數
    - 在標點符號「前」分割文字
    - 返回 `[{type: 'text'|'punct', content: string}]` 陣列
    - 處理連續標點符號（每個標點為獨立 segment）
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  
  - [x] 2.2 撰寫 splitArticleSegments 屬性測試
    - **Property 1: Article Splitting Before Punctuation**
    - **Validates: Requirements 4.1, 4.2, 4.3**

- [x] 3. 實作標點符號名稱轉換
  - [x] 3.1 建立 `CHINESE_PUNCTUATION_MAP` 常量
    - 定義中文標點符號對應的朗讀名稱
    - _Requirements: 7.1, 7.3_
  
  - [x] 3.2 建立 `ENGLISH_PUNCTUATION_MAP` 常量
    - 定義英文標點符號對應的朗讀名稱
    - _Requirements: 8.1_
  
  - [x] 3.3 建立 `getPunctuationName(punct, lang)` 函數
    - 根據語言返回標點符號的朗讀名稱
    - _Requirements: 6.4, 7.1, 8.1_
  
  - [x] 3.4 撰寫標點符號名稱轉換屬性測試
    - **Property 6: Chinese Punctuation Names**
    - **Property 7: English Punctuation Names**
    - **Validates: Requirements 7.1, 7.3, 8.1**

- [x] 4. 重構 readArticle() 函數
  - [x] 4.1 修改 readArticle() 使用新的分割邏輯
    - 呼叫 `splitArticleSegments()` 取得 segments
    - 遍歷 segments 進行朗讀
    - _Requirements: 4.1, 5.1_
  
  - [x] 4.2 實作文字段落朗讀邏輯
    - 文字段落可重複 N 次（根據 sentenceRepeat 設定）
    - 每次朗讀後加入停頓
    - _Requirements: 5.1, 5.2, 6.2, 6.3_
  
  - [x] 4.3 實作標點符號朗讀邏輯
    - 標點符號只讀 1 次（不受重讀次數影響）
    - 檢查 punctuationReadingEnabled 設定
    - 朗讀後加入停頓
    - _Requirements: 5.3, 5.4, 6.1, 6.2_
  
  - [x] 4.4 實作連續標點符號處理
    - 連續標點符號之間加入停頓
    - _Requirements: 4.4, 5.4_
  
  - [x] 4.5 撰寫朗讀順序屬性測試
    - **Property 2: Punctuation Read Once Only**
    - **Property 3: Reading Sequence Order**
    - **Property 4: Consecutive Punctuation Handling**
    - **Validates: Requirements 5.1-5.4, 6.1-6.3**

- [x] 5. Checkpoint - 文章朗讀功能測試
  - 確保所有測試通過
  - 手動測試「星期天，爸爸說：「我們一起去公園。」」範例
  - 確認朗讀順序正確

- [x] 6. 實作詞語模式標點符號處理
  - [x] 6.1 修改詞語模式的標點符號轉換
    - 檢查 punctuationReadingEnabled 設定
    - 關閉時不轉換標點符號
    - _Requirements: 2.3, 2.4, 3.3, 3.4_
  
  - [x] 6.2 撰寫詞語模式屬性測試
    - **Property 5: Punctuation Setting Respects Toggle State**
    - **Property 11: Word Mode Line Splitting**
    - **Validates: Requirements 1.2, 1.3, 2.1, 3.1**

- [x] 7. 實作英文特殊字元保護（詞語模式）
  - [x] 7.1 保護所有格和縮寫撇號
    - 處理 word's, don't, I'm 等
    - 同時處理 ' (U+0027) 和 ' (U+2019)
    - _Requirements: 3.2, 3.5, 10.1, 10.2, 10.4_
  
  - [x] 7.2 保護縮寫句號
    - 處理 Mr., Dr., e.g., U.S. 等
    - _Requirements: 8.4, 11.1, 11.2, 11.3_
  
  - [x] 7.3 保護小數點
    - 處理 3.14, $99.99 等
    - _Requirements: 8.5, 11.4_
  
  - [x] 7.4 撰寫英文特殊字元保護屬性測試
    - **Property 8: Apostrophe Preservation**
    - **Property 9: Abbreviation Period Preservation**
    - **Property 10: Decimal Point Preservation**
    - **Validates: Requirements 8.3-8.5, 10.1-10.4, 11.1-11.4**

- [x] 8. 更新高亮功能
  - [x] 8.1 修改 HighlightManager 支援新的 segment 結構
    - 高亮當前朗讀的 segment（文字或標點）
    - _Requirements: 相關高亮需求_

- [x] 9. Final Checkpoint - 完整功能測試
  - 確保所有測試通過
  - 測試中文文章朗讀
  - 測試英文文章朗讀
  - 測試標點符號開關功能
  - 測試詞語模式

## Notes

- 新的朗讀邏輯只影響文章模式，詞語模式保持原有邏輯
- 標點符號朗讀開關同時影響詞語模式和文章模式
- 英文特殊字元保護主要用於詞語模式
