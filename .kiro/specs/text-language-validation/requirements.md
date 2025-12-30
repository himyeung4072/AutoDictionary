# Requirements Document

## Introduction

本功能為「默書神器」應用程式新增文字語言驗證功能。當使用者選擇特定語言進行朗讀時，系統會檢查輸入文字欄的內容是否符合該語言的要求，以確保語音合成能正確發音。

## Glossary

- **Text_Validator**: 負責驗證輸入文字是否符合所選語言要求的模組
- **Language_Selector**: 語言選擇介面，包含粵語、普通話、英語三個選項
- **Input_Field**: 使用者輸入朗讀文字的文字欄 (textarea)
- **Chinese_Text**: 包含繁體中文或簡體中文字符的文字
- **English_Text**: 僅包含英文字母、數字及常見標點符號的文字
- **Validation_Error**: 當輸入文字不符合所選語言要求時顯示的錯誤訊息

## Requirements

### Requirement 1: 粵語模式文字驗證

**User Story:** 作為使用者，我希望在選擇粵語時，系統能檢查輸入文字是否為中文，以確保朗讀功能正常運作。

#### Acceptance Criteria

1. WHEN 使用者選擇粵語並點擊開始朗讀 THEN THE Text_Validator SHALL 檢查 Input_Field 內容是否包含中文字符
2. WHEN Input_Field 包含有效的中文字符 THEN THE Text_Validator SHALL 允許朗讀繼續進行
3. IF Input_Field 不包含任何中文字符 THEN THE Text_Validator SHALL 顯示錯誤訊息並阻止朗讀
4. WHEN 驗證失敗 THEN THE Text_Validator SHALL 顯示「粵語模式請輸入中文文字」的錯誤提示

### Requirement 2: 普通話模式文字驗證

**User Story:** 作為使用者，我希望在選擇普通話時，系統能檢查輸入文字是否為中文，以確保朗讀功能正常運作。

#### Acceptance Criteria

1. WHEN 使用者選擇普通話並點擊開始朗讀 THEN THE Text_Validator SHALL 檢查 Input_Field 內容是否包含中文字符
2. WHEN Input_Field 包含有效的中文字符 THEN THE Text_Validator SHALL 允許朗讀繼續進行
3. IF Input_Field 不包含任何中文字符 THEN THE Text_Validator SHALL 顯示錯誤訊息並阻止朗讀
4. WHEN 驗證失敗 THEN THE Text_Validator SHALL 顯示「普通話模式請輸入中文文字」的錯誤提示

### Requirement 3: 英語模式文字驗證

**User Story:** 作為使用者，我希望在選擇英語時，系統能檢查輸入文字是否為英文，以確保朗讀功能正常運作。

#### Acceptance Criteria

1. WHEN 使用者選擇英語並點擊開始朗讀 THEN THE Text_Validator SHALL 檢查 Input_Field 內容是否為英文
2. WHEN Input_Field 僅包含英文字母、數字及常見標點符號 THEN THE Text_Validator SHALL 允許朗讀繼續進行
3. IF Input_Field 包含中文字符 THEN THE Text_Validator SHALL 顯示錯誤訊息並阻止朗讀
4. WHEN 驗證失敗 THEN THE Text_Validator SHALL 顯示「英語模式請輸入英文文字」的錯誤提示

### Requirement 4: 錯誤提示使用者體驗

**User Story:** 作為使用者，我希望錯誤提示清晰可見且不會干擾操作，以便我能快速修正輸入內容。

#### Acceptance Criteria

1. WHEN 驗證失敗 THEN THE Text_Validator SHALL 使用現有的 error toast 樣式顯示錯誤訊息
2. WHEN 錯誤訊息顯示 THEN THE Text_Validator SHALL 在 3 秒後自動隱藏錯誤訊息
3. WHEN 驗證失敗 THEN THE Text_Validator SHALL 為 Input_Field 添加視覺錯誤指示（紅色邊框）
4. WHEN 使用者修改 Input_Field 內容 THEN THE Text_Validator SHALL 移除視覺錯誤指示

### Requirement 5: 混合文字處理

**User Story:** 作為使用者，我希望系統能智能處理混合文字，以提供合理的驗證結果。

#### Acceptance Criteria

1. WHEN 粵語或普通話模式下 Input_Field 包含中文字符（即使混有英文或數字）THEN THE Text_Validator SHALL 允許朗讀繼續進行
2. WHEN 英語模式下 Input_Field 包含任何中文字符 THEN THE Text_Validator SHALL 顯示錯誤訊息
3. THE Text_Validator SHALL 忽略空白字符和換行符進行驗證
4. WHEN Input_Field 為空或僅包含空白字符 THEN THE Text_Validator SHALL 使用現有的空白檢查邏輯處理
