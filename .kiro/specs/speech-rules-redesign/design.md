# Design Document: Speech Rules Redesign

## Overview

重新設計「默書神器」的朗讀規則系統，將標點符號處理邏輯按照四種組合（中文/英文 × 詞語/文章）進行分離，並加入標點符號朗讀的開關設定。

核心設計原則：
1. **分離關注點**：不同模式和語言有獨立的處理邏輯
2. **保護優先**：先保護特殊字元（撇號、縮寫句號、小數點），再進行轉換
3. **設定驅動**：標點符號朗讀由用戶設定控制

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Speech System                          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────────────────────┐ │
│  │ Settings Module │───▶│ Punctuation Reading Toggle      │ │
│  │                 │    │ (enabled/disabled)              │ │
│  │                 │    │ Pause Duration Setting          │ │
│  └─────────────────┘    └─────────────────────────────────┘ │
│           │                                                  │
│           ▼                                                  │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    Mode Router                           ││
│  │  ┌───────────────────┐    ┌────────────────────────────┐││
│  │  │    Word Mode      │    │      Article Mode          │││
│  │  │  (per-line)       │    │  (sentence + punctuation)  │││
│  │  │  Simple reading   │    │                            │││
│  │  └───────────────────┘    │  ┌──────────────────────┐  │││
│  │                           │  │ Article Splitter     │  │││
│  │                           │  │ Split BEFORE punct   │  │││
│  │                           │  └──────────────────────┘  │││
│  │                           │            │               │││
│  │                           │            ▼               │││
│  │                           │  ┌──────────────────────┐  │││
│  │                           │  │ Reading Sequence     │  │││
│  │                           │  │ 1. Read sentence     │  │││
│  │                           │  │ 2. Pause             │  │││
│  │                           │  │ 3. Read punctuation  │  │││
│  │                           │  │ 4. Pause             │  │││
│  │                           │  │ 5. Next sentence     │  │││
│  │                           │  └──────────────────────┘  │││
│  │                           └────────────────────────────┘││
│  └─────────────────────────────────────────────────────────┘│
│                              │                               │
│                              ▼                               │
│  ┌─────────────────────────────────────────────────────────┐│
│  │              Language Processor                          ││
│  │  ┌───────────────┐    ┌───────────────────────────────┐ ││
│  │  │    Chinese    │    │         English               │ ││
│  │  │  Processor    │    │        Processor              │ ││
│  │  │               │    │  ┌─────────────────────────┐  │ ││
│  │  │ - 逗號        │    │  │ Protection Layer        │  │ ││
│  │  │ - 句號        │    │  │ - Apostrophes           │  │ ││
│  │  │ - 問號        │    │  │ - Abbreviations         │  │ ││
│  │  │ - ...         │    │  │ - Decimals              │  │ ││
│  │  │               │    │  └─────────────────────────┘  │ ││
│  │  │               │    │  ┌─────────────────────────┐  │ ││
│  │  │               │    │  │ - comma                 │  │ ││
│  │  │               │    │  │ - period                │  │ ││
│  │  │               │    │  │ - question mark         │  │ ││
│  │  │               │    │  └─────────────────────────┘  │ ││
│  │  └───────────────┘    └───────────────────────────────┘ ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

## Article Reading Flow (New Logic)

### 範例：「星期天，爸爸說：「我們一起去公園。」」

```
輸入文章: 星期天，爸爸說：「我們一起去公園。」

Step 1: 分割（在標點符號前分割）
┌─────────────────────────────────────────────────────────────┐
│ segments = [                                                │
│   { type: 'text', content: '星期天' },                      │
│   { type: 'punct', content: '，' },                         │
│   { type: 'text', content: '爸爸說' },                      │
│   { type: 'punct', content: '：' },                         │
│   { type: 'punct', content: '「' },                         │
│   { type: 'text', content: '我們一起去公園' },              │
│   { type: 'punct', content: '。' },                         │
│   { type: 'punct', content: '」' }                          │
│ ]                                                           │
└─────────────────────────────────────────────────────────────┘

Step 2: 朗讀順序（標點符號只讀一次，不受重讀次數影響）
┌─────────────────────────────────────────────────────────────┐
│ 1. 朗讀「星期天」 (可重複 N 次)                             │
│ 2. 停頓                                                     │
│ 3. 朗讀「逗號」 (只讀 1 次)                                 │
│ 4. 停頓                                                     │
│ 5. 朗讀「爸爸說」 (可重複 N 次)                             │
│ 6. 停頓                                                     │
│ 7. 朗讀「冒號」 (只讀 1 次)                                 │
│ 8. 停頓                                                     │
│ 9. 朗讀「左引號」 (只讀 1 次)                               │
│ 10. 停頓                                                    │
│ 11. 朗讀「我們一起去公園」 (可重複 N 次)                    │
│ 12. 停頓                                                    │
│ 13. 朗讀「句號」 (只讀 1 次)                                │
│ 14. 停頓                                                    │
│ 15. 朗讀「右引號」 (只讀 1 次)                              │
└─────────────────────────────────────────────────────────────┘
```

### 流程圖

```
                    輸入文章
                        │
                        ▼
            ┌───────────────────────┐
            │ splitArticleSegments()│
            │ 在標點符號前分割      │
            └───────────────────────┘
                        │
                        ▼
            segments[] = [{type, content}, ...]
                        │
                        ▼
            ┌───────────────────────┐
            │   for each segment    │
            └───────────────────────┘
                        │
            ┌───────────┴───────────┐
            │                       │
            ▼                       ▼
    type === 'text'         type === 'punct'
            │                       │
            ▼                       ▼
    ┌───────────────┐       ┌───────────────┐
    │ 重複朗讀 N 次 │       │ 朗讀 1 次     │
    │ (句子重讀設定)│       │ (不受重讀影響)│
    └───────────────┘       └───────────────┘
            │                       │
            ▼                       ▼
    ┌───────────────┐       ┌───────────────┐
    │ 停頓          │       │ 停頓          │
    │ (等待時間)    │       │ (標點後停頓)  │
    └───────────────┘       └───────────────┘
            │                       │
            └───────────┬───────────┘
                        │
                        ▼
                  下一個 segment
```

## Components and Interfaces

### 1. Settings Module

負責管理標點符號朗讀設定的開關和停頓時間。

```javascript
// 設定介面
interface SpeechSettings {
    punctuationReadingEnabled: boolean;  // 標點符號朗讀開關
    punctuationPauseDuration: number;    // 標點符號後停頓時間 (毫秒)
    // ... 其他現有設定
}

// 設定存取函數
function getPunctuationReadingEnabled(): boolean;
function setPunctuationReadingEnabled(enabled: boolean): void;
function getPunctuationPauseDuration(): number;
function setPunctuationPauseDuration(duration: number): void;
```

### 2. Article Splitter Module

負責將文章在標點符號前分割成 segments。

```javascript
// Segment 類型定義
interface Segment {
    type: 'text' | 'punct';
    content: string;
}

// 分割函數
function splitArticleSegments(text: string): Segment[];
```

### 3. Article Reader Module

負責按照新的朗讀順序執行文章朗讀。

```javascript
// 文章朗讀函數
async function readArticle(
    text: string, 
    lang: string, 
    selectedVoice: string
): Promise<void>;

// 內部函數
async function readTextSegment(
    content: string, 
    lang: string, 
    voice: string, 
    repeatCount: number
): Promise<void>;

async function readPunctuationSegment(
    content: string, 
    lang: string, 
    voice: string,
    punctuationEnabled: boolean
): Promise<void>;

async function pauseForDuration(duration: number): Promise<void>;
```

### 4. Punctuation Name Converter

負責將標點符號轉換為可朗讀的名稱。

```javascript
// 取得標點符號的朗讀名稱
function getPunctuationName(punct: string, lang: string): string;
```

### 5. English Protection Layer

專門處理英文特殊字元保護的子模組（用於詞語模式）。

```javascript
// 保護函數
function protectApostrophes(text: string): string;
function protectAbbreviations(text: string): string;
function protectDecimals(text: string): string;

// 還原函數
function restoreProtectedCharacters(text: string): string;

// 常量定義
const APOSTROPHE_PLACEHOLDER = '\u0000APO\u0000';
const ABBREVIATION_DOT_PLACEHOLDER = '\u0000DOT\u0000';
const DECIMAL_PLACEHOLDER = '\u0000DEC\u0000';
```

## Data Models

### Segment Data Structure

```javascript
// 文章分割後的 segment 結構
const segments = [
    { type: 'text', content: '星期天' },
    { type: 'punct', content: '，' },
    { type: 'text', content: '爸爸說' },
    { type: 'punct', content: '：' },
    { type: 'punct', content: '「' },
    { type: 'text', content: '我們一起去公園' },
    { type: 'punct', content: '。' },
    { type: 'punct', content: '」' }
];
```

### Punctuation Mapping Tables

```javascript
// 中文標點符號對照表
const CHINESE_PUNCTUATION_MAP = {
    '，': '逗號',
    '。': '句號',
    '！': '感嘆號',
    '？': '問號',
    '；': '分號',
    '：': '冒號',
    '、': '頓號',
    '"': '左引號',
    '"': '右引號',
    ''': '左單引號',
    ''': '右單引號',
    '「': '左引號',
    '」': '右引號',
    '（': '左括號',
    '）': '右括號'
};

// 英文標點符號對照表
const ENGLISH_PUNCTUATION_MAP = {
    ',': 'comma',
    '.': 'period',
    '!': 'exclamation mark',
    '?': 'question mark',
    ';': 'semicolon',
    ':': 'colon',
    '—': 'dash',
    '–': 'dash',
    '"': 'open quote',
    '"': 'close quote',
    ''': 'open quote',
    ''': 'close quote',
    '(': 'open parenthesis',
    ')': 'close parenthesis'
};

// 需要保護的英文縮寫列表（用於詞語模式）
const PROTECTED_ABBREVIATIONS = [
    'Mr', 'Mrs', 'Ms', 'Dr', 'Prof', 'Jr', 'Sr',
    'Inc', 'Ltd', 'Corp', 'Co', 'etc', 'vs', 'St'
];

// 多部分縮寫（需要特殊處理）
const MULTI_PART_ABBREVIATIONS = [
    'e.g.', 'i.e.', 'a.m.', 'p.m.', 'U.S.', 'U.K.'
];

// 標點符號正則表達式
const PUNCTUATION_PATTERN = /([。！？；，、．.!?;,：:「」""''（）\(\)—–])/;
```

### Settings Storage Schema

```javascript
// localStorage 中的設定結構
{
    "dictationSettings": {
        // ... 現有設定
        "punctuationReadingEnabled": true,  // 新增：標點符號朗讀開關
        "punctuationPauseDuration": 500     // 新增：標點符號後停頓時間 (毫秒)
    }
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Article Splitting Before Punctuation

*For any* text in Article Mode, the text SHALL be split into segments where each punctuation mark is a separate segment, and text segments contain no punctuation marks.

**Validates: Requirements 4.1, 4.2, 4.3**

### Property 2: Punctuation Read Once Only

*For any* article reading with sentence repeat count > 1, each punctuation mark SHALL be read exactly once, while text segments are repeated according to the repeat count setting.

**Validates: Requirements 6.1, 6.2, 6.3**

### Property 3: Reading Sequence Order

*For any* article reading, the sequence SHALL follow: text segment → pause → punctuation → pause → next segment, with pauses between each element.

**Validates: Requirements 5.1, 5.2, 5.3, 5.4**

### Property 4: Consecutive Punctuation Handling

*For any* text with consecutive punctuation marks (e.g., 。」), each punctuation mark SHALL be read separately with a pause between them.

**Validates: Requirements 4.4, 5.4**

### Property 5: Punctuation Setting Respects Toggle State

*For any* text input, when punctuation reading is disabled, the punctuation segments SHALL be skipped (only pauses added), and when enabled, punctuation names SHALL be read.

**Validates: Requirements 1.2, 1.3, 7.2, 8.2**

### Property 6: Chinese Punctuation Names

*For any* Chinese text with punctuation reading enabled, punctuation marks SHALL be converted to their Chinese spoken names (e.g., ，→逗號, 。→句號).

**Validates: Requirements 7.1, 7.3**

### Property 7: English Punctuation Names

*For any* English text with punctuation reading enabled, punctuation marks SHALL be converted to their English spoken names (e.g., , → comma, . → period).

**Validates: Requirements 8.1**

### Property 8: Apostrophe Preservation in Possessives and Contractions

*For any* English text containing possessive forms (word's, teachers') or contractions (don't, I'm, we've, they'll, he'd), the apostrophe SHALL be preserved in the output regardless of the punctuation reading setting.

**Validates: Requirements 8.3, 10.1, 10.2**

### Property 9: Abbreviation Period Preservation

*For any* English text containing common abbreviations (Mr., Dr., e.g., U.S., etc.), the periods within those abbreviations SHALL be preserved in the output regardless of the punctuation reading setting.

**Validates: Requirements 8.4, 11.1, 11.2, 11.3**

### Property 10: Decimal Point Preservation

*For any* English text containing decimal numbers (like 3.14, $99.99), the decimal points SHALL be preserved in the output regardless of the punctuation reading setting.

**Validates: Requirements 8.5, 11.4**

### Property 11: Word Mode Line Splitting

*For any* text in Word Mode, the text SHALL be split by newline characters, with each non-empty line treated as a single unit.

**Validates: Requirements 2.1, 3.1**

## Error Handling

### Invalid Input Handling

1. **Empty Text**: Return empty string without processing
2. **Null/Undefined**: Return empty string with console warning
3. **Non-string Input**: Convert to string before processing

### Settings Errors

1. **localStorage Unavailable**: Use default settings (punctuation enabled)
2. **Corrupted Settings**: Reset to defaults and log warning
3. **Missing Setting Key**: Use default value (true for punctuationReadingEnabled)

### Processing Errors

1. **Regex Errors**: Catch and return original text with console error
2. **Placeholder Collision**: Use Unicode null character (\u0000) which won't appear in normal text

## Testing Strategy

### Unit Tests

單元測試用於驗證特定範例和邊界情況：

1. **Settings Toggle Tests**
   - Toggle switch renders correctly
   - Setting persists to localStorage
   - Default value is enabled

2. **Edge Case Tests**
   - Empty string input
   - Text with no punctuation
   - Mixed Chinese and English text
   - Multiple consecutive punctuation marks

3. **Specific Example Tests**
   - "Reach's approach" → apostrophe preserved
   - "Dr. Smith" → abbreviation period preserved
   - "3.14" → decimal point preserved

### Property-Based Tests

使用 Vitest 和 fast-check 進行屬性測試，每個屬性至少執行 100 次迭代：

1. **Property 1**: Generate random text with punctuation, verify no spoken names when disabled
2. **Property 2**: Generate random text with punctuation, verify spoken names present when enabled
3. **Property 3**: Generate random possessives/contractions, verify apostrophe preservation
4. **Property 4**: Generate text with both apostrophe types, verify identical handling
5. **Property 5**: Generate text with abbreviations, verify period preservation
6. **Property 6**: Generate decimal numbers, verify decimal point preservation
7. **Property 7**: Generate multi-line text, verify line-based splitting
8. **Property 8**: Generate text with sentence-ending punctuation, verify sentence splitting
9. **Property 9**: Generate Chinese text with punctuation, verify Chinese names used
10. **Property 10**: Generate text with standalone quotes, verify conversion

### Test Configuration

```javascript
// vitest.config.js
export default {
    test: {
        // Property test iterations
        fuzz: {
            iterations: 100
        }
    }
};
```

### Test File Structure

```
tests/
├── punctuation-converter.test.js      # Unit tests
├── punctuation-converter.property.test.js  # Property-based tests
└── settings.test.js                   # Settings module tests
```
