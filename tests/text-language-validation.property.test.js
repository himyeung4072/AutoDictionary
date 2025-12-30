/**
 * Property-Based Tests for Text Language Validation
 * Feature: text-language-validation
 * 
 * These tests validate correctness properties using fast-check
 * as specified in the design document.
 * 
 * Each test runs minimum 100 iterations as per testing strategy.
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';

// ===== Extract pure functions for testing =====

/**
 * 檢查文字是否包含中文字符
 * @param {string} text - 要檢查的文字
 * @returns {boolean} - 是否包含中文字符
 */
function containsChinese(text) {
    const chineseRegex = /[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/;
    return chineseRegex.test(text);
}

/**
 * 檢查文字是否為純英文（不含中文）
 * @param {string} text - 要檢查的文字
 * @returns {boolean} - 是否為純英文
 */
function isEnglishOnly(text) {
    const trimmedText = text.replace(/\s/g, '');
    if (trimmedText === '') return true;
    return !containsChinese(text);
}

/**
 * 根據語言驗證文字
 * @param {string} text - 輸入文字
 * @param {string} lang - 語言代碼 ('zh-HK', 'zh-CN', 'en-GB')
 * @returns {{valid: boolean, errorMessage: string|null}}
 */
function validateTextForLanguage(text, lang) {
    const trimmedText = text.replace(/\s/g, '');
    
    if (trimmedText === '') {
        return { valid: true, errorMessage: null };
    }
    
    if (lang === 'zh-HK') {
        if (!containsChinese(text)) {
            return { 
                valid: false, 
                errorMessage: '粵語模式請輸入中文文字' 
            };
        }
    } else if (lang === 'zh-CN') {
        if (!containsChinese(text)) {
            return { 
                valid: false, 
                errorMessage: '普通話模式請輸入中文文字' 
            };
        }
    } else if (lang === 'en-GB') {
        if (containsChinese(text)) {
            return { 
                valid: false, 
                errorMessage: '英語模式請輸入英文文字' 
            };
        }
    }
    
    return { valid: true, errorMessage: null };
}

// ===== Custom Arbitraries =====

/**
 * Generate Chinese characters (CJK Unified Ideographs)
 */
const chineseCharArb = fc.integer({ min: 0x4E00, max: 0x9FFF })
    .map(code => String.fromCharCode(code));

/**
 * Generate Chinese text (1-20 characters)
 */
const chineseTextArb = fc.array(chineseCharArb, { minLength: 1, maxLength: 20 })
    .map(chars => chars.join(''));

/**
 * Generate pure ASCII English text (letters, numbers, punctuation)
 */
const englishTextArb = fc.string({ 
    unit: fc.constantFrom(
        ...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,!?;:\'"()-'.split('')
    ),
    minLength: 1, 
    maxLength: 50 
});

/**
 * Generate mixed text (Chinese + English)
 */
const mixedTextArb = fc.tuple(chineseTextArb, englishTextArb)
    .map(([chinese, english]) => chinese + english);

/**
 * Generate whitespace strings
 */
const whitespaceArb = fc.string({ 
    unit: fc.constantFrom(' ', '\t', '\n', '\r'),
    minLength: 0, 
    maxLength: 10 
});

/**
 * Generate Chinese mode language codes
 */
const chineseModeArb = fc.constantFrom('zh-HK', 'zh-CN');

// ===== Property Tests =====

describe('Property 1: Chinese Mode Validation', () => {
    /**
     * Feature: text-language-validation, Property 1: Chinese Mode Validation
     * 
     * *For any* text string and Chinese language mode (zh-HK or zh-CN), 
     * the validation function should return `valid: true` if and only if 
     * the text contains at least one Chinese character.
     * 
     * **Validates: Requirements 1.1, 1.2, 1.3, 2.1, 2.2, 2.3**
     */
    
    it('should return valid:true for text containing Chinese characters in Chinese mode', () => {
        fc.assert(
            fc.property(
                chineseTextArb,
                chineseModeArb,
                (text, lang) => {
                    const result = validateTextForLanguage(text, lang);
                    return result.valid === true && result.errorMessage === null;
                }
            ),
            { numRuns: 100 }
        );
    });
    
    it('should return valid:false for pure English text in Chinese mode', () => {
        fc.assert(
            fc.property(
                englishTextArb,
                chineseModeArb,
                (text, lang) => {
                    const result = validateTextForLanguage(text, lang);
                    return result.valid === false && result.errorMessage !== null;
                }
            ),
            { numRuns: 100 }
        );
    });
    
    it('should return valid:true for mixed text (Chinese + English) in Chinese mode', () => {
        fc.assert(
            fc.property(
                mixedTextArb,
                chineseModeArb,
                (text, lang) => {
                    const result = validateTextForLanguage(text, lang);
                    return result.valid === true && result.errorMessage === null;
                }
            ),
            { numRuns: 100 }
        );
    });
    
    it('should return correct error message for zh-HK mode', () => {
        fc.assert(
            fc.property(
                englishTextArb,
                (text) => {
                    const result = validateTextForLanguage(text, 'zh-HK');
                    return result.errorMessage === '粵語模式請輸入中文文字';
                }
            ),
            { numRuns: 100 }
        );
    });
    
    it('should return correct error message for zh-CN mode', () => {
        fc.assert(
            fc.property(
                englishTextArb,
                (text) => {
                    const result = validateTextForLanguage(text, 'zh-CN');
                    return result.errorMessage === '普通話模式請輸入中文文字';
                }
            ),
            { numRuns: 100 }
        );
    });
});


describe('Property 2: English Mode Validation', () => {
    /**
     * Feature: text-language-validation, Property 2: English Mode Validation
     * 
     * *For any* text string and English language mode (en-GB), 
     * the validation function should return `valid: true` if and only if 
     * the text does not contain any Chinese characters.
     * 
     * **Validates: Requirements 3.1, 3.2, 3.3, 5.2**
     */
    
    it('should return valid:true for pure English text in English mode', () => {
        fc.assert(
            fc.property(
                englishTextArb,
                (text) => {
                    const result = validateTextForLanguage(text, 'en-GB');
                    return result.valid === true && result.errorMessage === null;
                }
            ),
            { numRuns: 100 }
        );
    });
    
    it('should return valid:false for text containing Chinese characters in English mode', () => {
        fc.assert(
            fc.property(
                chineseTextArb,
                (text) => {
                    const result = validateTextForLanguage(text, 'en-GB');
                    return result.valid === false && result.errorMessage !== null;
                }
            ),
            { numRuns: 100 }
        );
    });
    
    it('should return valid:false for mixed text (Chinese + English) in English mode', () => {
        fc.assert(
            fc.property(
                mixedTextArb,
                (text) => {
                    const result = validateTextForLanguage(text, 'en-GB');
                    return result.valid === false && result.errorMessage !== null;
                }
            ),
            { numRuns: 100 }
        );
    });
    
    it('should return correct error message for en-GB mode', () => {
        fc.assert(
            fc.property(
                chineseTextArb,
                (text) => {
                    const result = validateTextForLanguage(text, 'en-GB');
                    return result.errorMessage === '英語模式請輸入英文文字';
                }
            ),
            { numRuns: 100 }
        );
    });
    
    it('should return valid:true for whitespace-only text in English mode', () => {
        fc.assert(
            fc.property(
                whitespaceArb.filter(s => s.length > 0),
                (text) => {
                    const result = validateTextForLanguage(text, 'en-GB');
                    // Whitespace-only text is handled by existing empty check logic
                    return result.valid === true && result.errorMessage === null;
                }
            ),
            { numRuns: 100 }
        );
    });
});


describe('Property 3: Mixed Text Handling', () => {
    /**
     * Feature: text-language-validation, Property 3: Mixed Text Handling
     * 
     * *For any* text string containing both Chinese and non-Chinese characters, 
     * the validation function should:
     * - Return `valid: true` for Chinese modes (zh-HK, zh-CN)
     * - Return `valid: false` for English mode (en-GB)
     * 
     * **Validates: Requirements 5.1, 5.3**
     */
    
    it('should return valid:true for mixed text in Chinese modes', () => {
        fc.assert(
            fc.property(
                mixedTextArb,
                chineseModeArb,
                (text, lang) => {
                    const result = validateTextForLanguage(text, lang);
                    // Mixed text containing Chinese should be valid in Chinese modes
                    return result.valid === true && result.errorMessage === null;
                }
            ),
            { numRuns: 100 }
        );
    });
    
    it('should return valid:false for mixed text in English mode', () => {
        fc.assert(
            fc.property(
                mixedTextArb,
                (text) => {
                    const result = validateTextForLanguage(text, 'en-GB');
                    // Mixed text containing Chinese should be invalid in English mode
                    return result.valid === false && result.errorMessage === '英語模式請輸入英文文字';
                }
            ),
            { numRuns: 100 }
        );
    });
    
    it('should handle text with Chinese characters mixed with numbers', () => {
        const chineseWithNumbersArb = fc.tuple(
            chineseTextArb,
            fc.string({ unit: fc.constantFrom(...'0123456789'.split('')), minLength: 1, maxLength: 10 })
        ).map(([chinese, numbers]) => chinese + numbers);
        
        fc.assert(
            fc.property(
                chineseWithNumbersArb,
                chineseModeArb,
                (text, lang) => {
                    const result = validateTextForLanguage(text, lang);
                    return result.valid === true;
                }
            ),
            { numRuns: 100 }
        );
    });
    
    it('should handle text with Chinese characters mixed with punctuation', () => {
        const chineseWithPunctuationArb = fc.tuple(
            chineseTextArb,
            fc.string({ unit: fc.constantFrom(...'.,!?;:\'"()-'.split('')), minLength: 1, maxLength: 10 })
        ).map(([chinese, punctuation]) => chinese + punctuation);
        
        fc.assert(
            fc.property(
                chineseWithPunctuationArb,
                chineseModeArb,
                (text, lang) => {
                    const result = validateTextForLanguage(text, lang);
                    return result.valid === true;
                }
            ),
            { numRuns: 100 }
        );
    });
});


describe('Property 4: Whitespace Invariance', () => {
    /**
     * Feature: text-language-validation, Property 4: Whitespace Invariance
     * 
     * *For any* text string, adding or removing whitespace characters 
     * (spaces, tabs, newlines) should not change the validation result.
     * 
     * **Validates: Requirements 5.3**
     */
    
    it('should produce same result when whitespace is added to Chinese text', () => {
        fc.assert(
            fc.property(
                chineseTextArb,
                whitespaceArb,
                chineseModeArb,
                (text, whitespace, lang) => {
                    const originalResult = validateTextForLanguage(text, lang);
                    const withLeadingWhitespace = validateTextForLanguage(whitespace + text, lang);
                    const withTrailingWhitespace = validateTextForLanguage(text + whitespace, lang);
                    const withBothWhitespace = validateTextForLanguage(whitespace + text + whitespace, lang);
                    
                    return originalResult.valid === withLeadingWhitespace.valid &&
                           originalResult.valid === withTrailingWhitespace.valid &&
                           originalResult.valid === withBothWhitespace.valid;
                }
            ),
            { numRuns: 100 }
        );
    });
    
    it('should produce same result when whitespace is added to English text', () => {
        fc.assert(
            fc.property(
                englishTextArb,
                whitespaceArb,
                (text, whitespace) => {
                    const originalResult = validateTextForLanguage(text, 'en-GB');
                    const withLeadingWhitespace = validateTextForLanguage(whitespace + text, 'en-GB');
                    const withTrailingWhitespace = validateTextForLanguage(text + whitespace, 'en-GB');
                    const withBothWhitespace = validateTextForLanguage(whitespace + text + whitespace, 'en-GB');
                    
                    return originalResult.valid === withLeadingWhitespace.valid &&
                           originalResult.valid === withTrailingWhitespace.valid &&
                           originalResult.valid === withBothWhitespace.valid;
                }
            ),
            { numRuns: 100 }
        );
    });
    
    it('should produce same result when whitespace is interspersed in text', () => {
        const textWithInterspersedWhitespaceArb = fc.tuple(
            chineseTextArb,
            fc.array(whitespaceArb, { minLength: 1, maxLength: 5 })
        ).map(([text, whitespaces]) => {
            // Intersperse whitespace between characters
            const chars = text.split('');
            let result = '';
            for (let i = 0; i < chars.length; i++) {
                result += chars[i];
                if (i < whitespaces.length) {
                    result += whitespaces[i];
                }
            }
            return result;
        });
        
        fc.assert(
            fc.property(
                chineseTextArb,
                textWithInterspersedWhitespaceArb,
                chineseModeArb,
                (originalText, textWithWhitespace, lang) => {
                    // Both should be valid since they contain Chinese characters
                    const originalResult = validateTextForLanguage(originalText, lang);
                    const whitespaceResult = validateTextForLanguage(textWithWhitespace, lang);
                    
                    return originalResult.valid === whitespaceResult.valid;
                }
            ),
            { numRuns: 100 }
        );
    });
    
    it('should handle all language modes consistently with whitespace', () => {
        const allLanguagesArb = fc.constantFrom('zh-HK', 'zh-CN', 'en-GB');
        
        fc.assert(
            fc.property(
                chineseTextArb,
                whitespaceArb,
                allLanguagesArb,
                (text, whitespace, lang) => {
                    const originalResult = validateTextForLanguage(text, lang);
                    const withWhitespace = validateTextForLanguage(whitespace + text + whitespace, lang);
                    
                    // Validation result should be the same regardless of whitespace
                    return originalResult.valid === withWhitespace.valid;
                }
            ),
            { numRuns: 100 }
        );
    });
});
