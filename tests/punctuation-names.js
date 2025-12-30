/**
 * Punctuation Name Converter Module
 * 
 * This module provides punctuation name mapping and conversion functions
 * for the speech rules redesign feature.
 * 
 * Feature: speech-rules-redesign
 * Requirements: 6.4, 7.1, 7.3, 8.1
 */

/**
 * 中文標點符號對照表
 * Maps Chinese punctuation marks to their spoken names in Chinese
 * 
 * Requirements: 7.1, 7.3
 */
const CHINESE_PUNCTUATION_MAP = {
    '，': '逗號',
    '。': '句號',
    '！': '感嘆號',
    '？': '問號',
    '；': '分號',
    '：': '冒號',
    '、': '頓號',
    '\u201C': '左引號',    // " (left double quotation mark)
    '\u201D': '右引號',    // " (right double quotation mark)
    '\u2018': '左單引號',  // ' (left single quotation mark)
    '\u2019': '右單引號',  // ' (right single quotation mark)
    '「': '左引號',
    '」': '右引號',
    '『': '左雙引號',
    '』': '右雙引號',
    '（': '左括號',
    '）': '右括號',
    '【': '左方括號',
    '】': '右方括號',
    '—': '破折號',
    '…': '省略號',
    '．': '句號'
};

/**
 * 英文標點符號對照表
 * Maps English punctuation marks to their spoken names in English
 * 
 * Requirements: 8.1
 */
const ENGLISH_PUNCTUATION_MAP = {
    ',': 'comma',
    '.': 'period',
    '!': 'exclamation mark',
    '?': 'question mark',
    ';': 'semicolon',
    ':': 'colon',
    '—': 'dash',
    '–': 'dash',
    '\u201C': 'open quote',   // " (left double quotation mark)
    '\u201D': 'close quote',  // " (right double quotation mark)
    '\u2018': 'open quote',   // ' (left single quotation mark)
    '\u2019': 'close quote',  // ' (right single quotation mark)
    '(': 'open parenthesis',
    ')': 'close parenthesis',
    '[': 'open bracket',
    ']': 'close bracket',
    '{': 'open brace',
    '}': 'close brace',
    '...': 'ellipsis',
    '-': 'hyphen'
};

/**
 * 取得標點符號的朗讀名稱
 * Returns the spoken name of a punctuation mark based on the language
 * 
 * Requirements: 6.4, 7.1, 8.1
 * 
 * @param {string} punct - The punctuation mark to convert
 * @param {string} lang - The language code ('zh' for Chinese, 'en' for English)
 * @returns {string} - The spoken name of the punctuation, or the original punctuation if not found
 * 
 * @example
 * getPunctuationName('，', 'zh') // Returns: '逗號'
 * getPunctuationName(',', 'en')  // Returns: 'comma'
 * getPunctuationName('。', 'zh') // Returns: '句號'
 * getPunctuationName('.', 'en')  // Returns: 'period'
 */
function getPunctuationName(punct, lang) {
    // Handle edge cases
    if (punct === null || punct === undefined || punct === '') {
        return '';
    }
    
    if (typeof punct !== 'string') {
        punct = String(punct);
    }
    
    // Normalize language code to lowercase
    const normalizedLang = (lang || '').toLowerCase();
    
    // Select the appropriate map based on language
    // Chinese: 'zh', 'zh-tw', 'zh-hk', 'zh-cn', 'chinese', etc.
    // English: 'en', 'en-us', 'en-gb', 'english', etc.
    const isChinese = normalizedLang.startsWith('zh') || normalizedLang === 'chinese';
    
    if (isChinese) {
        return CHINESE_PUNCTUATION_MAP[punct] || punct;
    } else {
        return ENGLISH_PUNCTUATION_MAP[punct] || punct;
    }
}

// Export for testing and usage
export { 
    CHINESE_PUNCTUATION_MAP, 
    ENGLISH_PUNCTUATION_MAP, 
    getPunctuationName 
};
