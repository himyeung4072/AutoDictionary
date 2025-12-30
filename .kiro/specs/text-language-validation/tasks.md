# Implementation Plan: Text Language Validation

## Overview

本實作計劃將為「默書神器」應用程式新增文字語言驗證功能。所有修改都在 `auto_dic.html` 單一檔案中進行。

## Tasks

- [x] 1. 實作核心驗證函數
  - [x] 1.1 新增 `containsChinese(text)` 函數
    - 使用 Unicode 範圍 `[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]` 檢測中文字符
    - 返回 boolean 值
    - _Requirements: 1.1, 2.1, 3.3_

  - [x] 1.2 新增 `isEnglishOnly(text)` 函數
    - 移除空白字符後檢查是否包含中文
    - 返回 boolean 值
    - _Requirements: 3.1, 3.2_

  - [x] 1.3 新增 `validateTextForLanguage(text, lang)` 函數
    - 根據語言代碼 (zh-HK, zh-CN, en-GB) 執行對應驗證
    - 返回 `{valid: boolean, errorMessage: string|null}` 物件
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4_

  - [x] 1.4 撰寫 Property 1 測試：Chinese Mode Validation
    - **Property 1: Chinese Mode Validation**
    - **Validates: Requirements 1.1, 1.2, 1.3, 2.1, 2.2, 2.3**

  - [x] 1.5 撰寫 Property 2 測試：English Mode Validation
    - **Property 2: English Mode Validation**
    - **Validates: Requirements 3.1, 3.2, 3.3, 5.2**

- [x] 2. 整合驗證到 startReading() 函數
  - [x] 2.1 在空白檢查之後加入語言驗證邏輯
    - 呼叫 `validateTextForLanguage(text, lang)`
    - 驗證失敗時呼叫 `showErrorToast()` 顯示錯誤訊息
    - 驗證失敗時添加 `input-error` 類別到 textarea
    - 驗證失敗時 return 阻止朗讀
    - _Requirements: 1.3, 2.3, 3.3, 4.1, 4.3_

  - [x] 2.2 撰寫 Property 3 測試：Mixed Text Handling
    - **Property 3: Mixed Text Handling**
    - **Validates: Requirements 5.1, 5.3**

  - [x] 2.3 撰寫 Property 4 測試：Whitespace Invariance
    - **Property 4: Whitespace Invariance**
    - **Validates: Requirements 5.3**

- [x] 3. Checkpoint - 確保所有測試通過
  - 執行所有測試，確保驗證邏輯正確
  - 如有問題請詢問使用者

- [x] 4. 單元測試
  - [x] 4.1 撰寫 containsChinese() 單元測試
    - 測試純中文、純英文、混合字串、空字串
    - _Requirements: 1.1, 2.1_

  - [x] 4.2 撰寫 validateTextForLanguage() 單元測試
    - 測試各語言模式的驗證結果
    - 測試錯誤訊息的正確性
    - _Requirements: 1.4, 2.4, 3.4_

- [x] 5. Final Checkpoint - 確保所有測試通過
  - 執行完整測試套件
  - 如有問題請詢問使用者

## Notes

- All tasks are required for comprehensive test coverage
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- All modifications are in the single file `auto_dic.html`
- Property tests use fast-check library with minimum 100 iterations
