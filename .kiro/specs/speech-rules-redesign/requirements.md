# Requirements Document

## Introduction

重新設計「默書神器」的朗讀規則系統，將中英文詞語和文章的朗讀邏輯分離，並加入標點符號朗讀的開關設定。目前系統有兩種模式（讀詞語、讀文章）和兩種語言（中文、英文），但朗讀邏輯沒有針對這四種組合進行優化。

## Glossary

- **Speech_System**: 負責文字轉語音的核心系統，使用 Web Speech API
- **Punctuation_Converter**: 將標點符號轉換為可朗讀文字的模組
- **Word_Mode**: 詞語朗讀模式，每行一個詞語，逐行朗讀
- **Article_Mode**: 文章朗讀模式，按句子分割並朗讀
- **Punctuation_Setting**: 標點符號朗讀開關設定
- **Apostrophe**: 撇號，用於英文所有格（如 Reach's）和縮寫（如 don't）
- **Abbreviation**: 縮寫詞，如 Mr., Dr., e.g. 等

## Requirements

### Requirement 1: 標點符號朗讀設定

**User Story:** As a user, I want to toggle punctuation reading on or off, so that I can choose whether to hear punctuation names during dictation practice.

#### Acceptance Criteria

1. THE Settings_Panel SHALL include a toggle switch for enabling or disabling punctuation reading
2. WHEN punctuation reading is disabled, THE Speech_System SHALL not convert punctuation marks to spoken words
3. WHEN punctuation reading is enabled, THE Speech_System SHALL convert punctuation marks to their spoken names
4. THE Punctuation_Setting SHALL persist across browser sessions using localStorage
5. THE Punctuation_Setting SHALL default to enabled for new users

### Requirement 2: 中文詞語朗讀

**User Story:** As a user practicing Chinese vocabulary, I want simple line-by-line reading without complex punctuation processing, so that I can focus on learning individual words.

#### Acceptance Criteria

1. WHEN in Word_Mode with Chinese language, THE Speech_System SHALL read each line as a single unit
2. WHEN in Word_Mode with Chinese language, THE Speech_System SHALL apply minimal text processing
3. WHEN punctuation reading is enabled in Word_Mode with Chinese, THE Punctuation_Converter SHALL convert Chinese punctuation marks to their spoken names
4. WHEN punctuation reading is disabled in Word_Mode with Chinese, THE Speech_System SHALL read text without punctuation conversion

### Requirement 3: 英文詞語朗讀

**User Story:** As a user practicing English vocabulary, I want simple line-by-line reading that correctly handles apostrophes in possessives and contractions, so that words like "Reach's" are read naturally.

#### Acceptance Criteria

1. WHEN in Word_Mode with English language, THE Speech_System SHALL read each line as a single unit
2. WHEN in Word_Mode with English language, THE Punctuation_Converter SHALL preserve apostrophes in possessives and contractions
3. WHEN punctuation reading is enabled in Word_Mode with English, THE Punctuation_Converter SHALL convert English punctuation marks to their spoken names
4. WHEN punctuation reading is disabled in Word_Mode with English, THE Speech_System SHALL read text without punctuation conversion
5. THE Punctuation_Converter SHALL correctly handle both straight apostrophe (U+0027) and curly apostrophe (U+2019)

### Requirement 4: 文章分割邏輯

**User Story:** As a user practicing dictation, I want the article to be split before each punctuation mark, so that I can hear the sentence first, then the punctuation separately.

#### Acceptance Criteria

1. WHEN in Article_Mode, THE Speech_System SHALL split text before each punctuation mark (not after)
2. THE Speech_System SHALL treat each text segment (before punctuation) as a sentence unit
3. THE Speech_System SHALL treat each punctuation mark as a separate speech unit
4. WHEN consecutive punctuation marks appear, THE Speech_System SHALL treat each punctuation mark as a separate unit

### Requirement 5: 文章朗讀順序

**User Story:** As a user, I want a clear reading sequence of sentence → pause → punctuation → pause → next sentence, so that I can clearly distinguish between content and punctuation during dictation practice.

#### Acceptance Criteria

1. THE Speech_System SHALL follow this reading sequence: read sentence → pause → read punctuation → pause → read next sentence
2. WHEN a sentence has been read, THE Speech_System SHALL add a pause before reading the punctuation
3. WHEN a punctuation mark has been read, THE Speech_System SHALL add a pause before reading the next sentence
4. WHEN consecutive punctuation marks appear, THE Speech_System SHALL add a pause between each punctuation reading
5. THE pause duration SHALL be configurable by the user

### Requirement 6: 標點符號朗讀規則

**User Story:** As a user, I want punctuation marks to be read only once regardless of repeat settings, so that I don't hear the same punctuation multiple times.

#### Acceptance Criteria

1. WHEN punctuation reading is enabled, THE Speech_System SHALL read each punctuation mark exactly once
2. THE punctuation reading SHALL NOT be affected by the sentence repeat count setting
3. WHEN the sentence repeat count is greater than 1, THE Speech_System SHALL repeat only the sentence, not the punctuation
4. THE Speech_System SHALL read punctuation in the appropriate language (Chinese names for Chinese mode, English names for English mode)

### Requirement 7: 中文文章朗讀

**User Story:** As a user practicing Chinese dictation, I want article reading that properly handles Chinese punctuation, so that I can learn correct punctuation usage.

#### Acceptance Criteria

1. WHEN in Article_Mode with Chinese language, THE Speech_System SHALL use Chinese punctuation names (逗號, 句號, 問號, etc.)
2. WHEN punctuation reading is disabled, THE Speech_System SHALL skip punctuation reading and only add pauses
3. THE Punctuation_Converter SHALL use Chinese names for punctuation marks when reading Chinese text

### Requirement 8: 英文文章朗讀

**User Story:** As a user practicing English dictation, I want article reading that correctly handles English punctuation, apostrophes, and abbreviations, so that I can learn correct punctuation usage without errors.

#### Acceptance Criteria

1. WHEN in Article_Mode with English language, THE Speech_System SHALL use English punctuation names (comma, period, question mark, etc.)
2. WHEN punctuation reading is disabled, THE Speech_System SHALL skip punctuation reading and only add pauses
3. THE Punctuation_Converter SHALL preserve apostrophes in possessives and contractions regardless of punctuation setting
4. THE Punctuation_Converter SHALL preserve periods in common abbreviations regardless of punctuation setting
5. THE Punctuation_Converter SHALL preserve decimal points in numbers regardless of punctuation setting

### Requirement 9: 標點符號處理邏輯分離

**User Story:** As a developer, I want separate punctuation processing logic for different mode and language combinations, so that the code is maintainable and each scenario can be optimized independently.

#### Acceptance Criteria

1. THE Punctuation_Converter SHALL have separate processing paths for Chinese and English languages
2. THE Punctuation_Converter SHALL have separate processing paths for Word_Mode and Article_Mode
3. WHEN processing English text, THE Punctuation_Converter SHALL protect apostrophes before any punctuation conversion
4. WHEN processing English text, THE Punctuation_Converter SHALL protect abbreviation periods before any punctuation conversion
5. WHEN processing English text, THE Punctuation_Converter SHALL protect decimal points before any punctuation conversion
6. THE Punctuation_Converter SHALL restore protected characters after punctuation conversion

### Requirement 10: 英文撇號智慧處理

**User Story:** As a user, I want the system to correctly distinguish between apostrophes used in possessives/contractions and quotation marks, so that words are read naturally.

#### Acceptance Criteria

1. THE Punctuation_Converter SHALL preserve apostrophes in possessive forms like "Reach's", "dog's", "teachers'"
2. THE Punctuation_Converter SHALL preserve apostrophes in contractions like "don't", "I'm", "we've", "they'll", "he'd"
3. WHEN punctuation reading is enabled, THE Punctuation_Converter SHALL convert standalone single quotes to "quote" or "end quote"
4. THE Punctuation_Converter SHALL handle both straight apostrophe (') and curly apostrophe (') identically

### Requirement 11: 英文縮寫句號處理

**User Story:** As a user, I want abbreviation periods to be preserved during reading, so that "Dr. Smith" is read naturally without saying "period".

#### Acceptance Criteria

1. THE Punctuation_Converter SHALL preserve periods in common title abbreviations including Mr., Mrs., Ms., Dr., Prof., Jr., Sr.
2. THE Punctuation_Converter SHALL preserve periods in common abbreviations including Inc., Ltd., Corp., Co., etc., vs., St.
3. THE Punctuation_Converter SHALL preserve periods in multi-part abbreviations including e.g., i.e., a.m., p.m., U.S., U.K.
4. THE Punctuation_Converter SHALL preserve decimal points in numbers like 3.14, $99.99
