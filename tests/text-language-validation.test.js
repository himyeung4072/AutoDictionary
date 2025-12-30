/**
 * Unit Tests for Text Language Validation
 * Feature: text-language-validation
 * 
 * These tests validate specific examples and edge cases
 * for the language validation functions.
 */

import { describe, it, expect } from 'vitest';

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

// ===== Unit Tests for containsChinese() =====
// Requirements: 1.1, 2.1

describe('containsChinese()', () => {
    describe('純中文字串', () => {
        it('should return true for simple Chinese text', () => {
            expect(containsChinese('你好')).toBe(true);
        });

        it('should return true for traditional Chinese text', () => {
            expect(containsChinese('繁體中文')).toBe(true);
        });

        it('should return true for simplified Chinese text', () => {
            expect(containsChinese('简体中文')).toBe(true);
        });

        it('should return true for single Chinese character', () => {
            expect(containsChinese('中')).toBe(true);
        });
    });

    describe('純英文字串', () => {
        it('should return false for simple English text', () => {
            expect(containsChinese('Hello')).toBe(false);
        });

        it('should return false for English with numbers', () => {
            expect(containsChinese('Hello123')).toBe(false);
        });

        it('should return false for English with punctuation', () => {
            expect(containsChinese('Hello, World!')).toBe(false);
        });

        it('should return false for single English letter', () => {
            expect(containsChinese('A')).toBe(false);
        });
    });

    describe('混合字串', () => {
        it('should return true for Chinese mixed with English', () => {
            expect(containsChinese('你好Hello')).toBe(true);
        });

        it('should return true for English mixed with Chinese', () => {
            expect(containsChinese('Hello你好')).toBe(true);
        });

        it('should return true for Chinese mixed with numbers', () => {
            expect(containsChinese('中文123')).toBe(true);
        });

        it('should return true for Chinese mixed with punctuation', () => {
            expect(containsChinese('你好！')).toBe(true);
        });
    });

    describe('空字串', () => {
        it('should return false for empty string', () => {
            expect(containsChinese('')).toBe(false);
        });

        it('should return false for whitespace only', () => {
            expect(containsChinese('   ')).toBe(false);
        });

        it('should return false for tabs and newlines', () => {
            expect(containsChinese('\t\n\r')).toBe(false);
        });
    });
});


// ===== Unit Tests for validateTextForLanguage() =====
// Requirements: 1.4, 2.4, 3.4

describe('validateTextForLanguage()', () => {
    describe('粵語模式 (zh-HK)', () => {
        it('should return valid for Chinese text', () => {
            const result = validateTextForLanguage('你好世界', 'zh-HK');
            expect(result.valid).toBe(true);
            expect(result.errorMessage).toBeNull();
        });

        it('should return invalid for English text with correct error message', () => {
            const result = validateTextForLanguage('Hello World', 'zh-HK');
            expect(result.valid).toBe(false);
            expect(result.errorMessage).toBe('粵語模式請輸入中文文字');
        });

        it('should return valid for mixed Chinese and English text', () => {
            const result = validateTextForLanguage('你好Hello', 'zh-HK');
            expect(result.valid).toBe(true);
            expect(result.errorMessage).toBeNull();
        });

        it('should return valid for empty text (handled by existing logic)', () => {
            const result = validateTextForLanguage('', 'zh-HK');
            expect(result.valid).toBe(true);
            expect(result.errorMessage).toBeNull();
        });

        it('should return valid for whitespace-only text', () => {
            const result = validateTextForLanguage('   ', 'zh-HK');
            expect(result.valid).toBe(true);
            expect(result.errorMessage).toBeNull();
        });
    });

    describe('普通話模式 (zh-CN)', () => {
        it('should return valid for Chinese text', () => {
            const result = validateTextForLanguage('你好世界', 'zh-CN');
            expect(result.valid).toBe(true);
            expect(result.errorMessage).toBeNull();
        });

        it('should return invalid for English text with correct error message', () => {
            const result = validateTextForLanguage('Hello World', 'zh-CN');
            expect(result.valid).toBe(false);
            expect(result.errorMessage).toBe('普通話模式請輸入中文文字');
        });

        it('should return valid for mixed Chinese and English text', () => {
            const result = validateTextForLanguage('你好Hello', 'zh-CN');
            expect(result.valid).toBe(true);
            expect(result.errorMessage).toBeNull();
        });

        it('should return valid for empty text (handled by existing logic)', () => {
            const result = validateTextForLanguage('', 'zh-CN');
            expect(result.valid).toBe(true);
            expect(result.errorMessage).toBeNull();
        });

        it('should return valid for whitespace-only text', () => {
            const result = validateTextForLanguage('   ', 'zh-CN');
            expect(result.valid).toBe(true);
            expect(result.errorMessage).toBeNull();
        });
    });

    describe('英語模式 (en-GB)', () => {
        it('should return valid for English text', () => {
            const result = validateTextForLanguage('Hello World', 'en-GB');
            expect(result.valid).toBe(true);
            expect(result.errorMessage).toBeNull();
        });

        it('should return invalid for Chinese text with correct error message', () => {
            const result = validateTextForLanguage('你好世界', 'en-GB');
            expect(result.valid).toBe(false);
            expect(result.errorMessage).toBe('英語模式請輸入英文文字');
        });

        it('should return invalid for mixed Chinese and English text', () => {
            const result = validateTextForLanguage('Hello你好', 'en-GB');
            expect(result.valid).toBe(false);
            expect(result.errorMessage).toBe('英語模式請輸入英文文字');
        });

        it('should return valid for empty text (handled by existing logic)', () => {
            const result = validateTextForLanguage('', 'en-GB');
            expect(result.valid).toBe(true);
            expect(result.errorMessage).toBeNull();
        });

        it('should return valid for whitespace-only text', () => {
            const result = validateTextForLanguage('   ', 'en-GB');
            expect(result.valid).toBe(true);
            expect(result.errorMessage).toBeNull();
        });

        it('should return valid for English with numbers', () => {
            const result = validateTextForLanguage('Hello123', 'en-GB');
            expect(result.valid).toBe(true);
            expect(result.errorMessage).toBeNull();
        });

        it('should return valid for English with punctuation', () => {
            const result = validateTextForLanguage('Hello, World!', 'en-GB');
            expect(result.valid).toBe(true);
            expect(result.errorMessage).toBeNull();
        });
    });

    describe('錯誤訊息正確性', () => {
        it('should return correct error message for zh-HK mode', () => {
            const result = validateTextForLanguage('abc', 'zh-HK');
            expect(result.errorMessage).toBe('粵語模式請輸入中文文字');
        });

        it('should return correct error message for zh-CN mode', () => {
            const result = validateTextForLanguage('abc', 'zh-CN');
            expect(result.errorMessage).toBe('普通話模式請輸入中文文字');
        });

        it('should return correct error message for en-GB mode', () => {
            const result = validateTextForLanguage('中文', 'en-GB');
            expect(result.errorMessage).toBe('英語模式請輸入英文文字');
        });

        it('should return null error message when validation passes', () => {
            expect(validateTextForLanguage('中文', 'zh-HK').errorMessage).toBeNull();
            expect(validateTextForLanguage('中文', 'zh-CN').errorMessage).toBeNull();
            expect(validateTextForLanguage('English', 'en-GB').errorMessage).toBeNull();
        });
    });
});
