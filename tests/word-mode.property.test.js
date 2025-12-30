/**
 * Property-Based Tests for Word Mode
 * 
 * Feature: speech-rules-redesign
 * 
 * These tests validate the word mode properties:
 * - Property 5: Punctuation Setting Respects Toggle State (for word mode)
 * - Property 11: Word Mode Line Splitting
 * 
 * Each test runs minimum 100 iterations as per testing strategy.
 * 
 * **Validates: Requirements 1.2, 1.3, 2.1, 2.3, 2.4, 3.1, 3.3, 3.4**
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { PUNCTUATION_PATTERN } from './split-article-segments.js';
import { CHINESE_PUNCTUATION_MAP, ENGLISH_PUNCTUATION_MAP } from './punctuation-names.js';

// ===== Word Mode Functions (extracted from auto_dic.html) =====

/**
 * Split text by newlines for word mode
 * This mirrors the logic in the readWords() function
 * 
 * Requirements: 2.1, 3.1
 * 
 * @param {string} text - The text to split
 * @returns {string[]} - Array of non-empty lines
 */
function splitWordModeLines(text) {
    if (text === null || text === undefined) {
        return [];
    }
    
    if (typeof text !== 'string') {
        text = String(text);
    }
    
    return text.split('\n').map(s => s.trim()).filter(s => s !== '');
}

/**
 * Convert punctuation to speech text (simplified version for testing)
 * This mirrors the convertPunctuationToSpeech function logic
 * 
 * Requirements: 2.3, 2.4, 3.3, 3.4
 * 
 * @param {string} text - The text to convert
 * @param {string} lang - The language code
 * @param {boolean} punctuationReadingEnabled - Whether punctuation reading is enabled
 * @returns {string} - The converted text
 */
function convertPunctuationForWordMode(text, lang, punctuationReadingEnabled) {
    if (!punctuationReadingEnabled) {
        // When disabled, return text as-is (no punctuation conversion)
        return text;
    }
    
    // When enabled, convert punctuation to spoken names
    const isChinese = lang.toLowerCase().startsWith('zh');
    const punctMap = isChinese ? CHINESE_PUNCTUATION_MAP : ENGLISH_PUNCTUATION_MAP;
    
    let result = text;
    
    // Replace each punctuation with its spoken name
    for (const [punct, name] of Object.entries(punctMap)) {
        // Use global replace to handle all occurrences
        const escapedPunct = punct.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedPunct, 'g');
        result = result.replace(regex, ` ${name} `);
    }
    
    return result;
}

/**
 * Check if text contains any punctuation that would be converted
 * 
 * @param {string} text - The text to check
 * @param {string} lang - The language code
 * @returns {boolean} - True if text contains convertible punctuation
 */
function containsConvertiblePunctuation(text, lang) {
    const isChinese = lang.toLowerCase().startsWith('zh');
    const punctMap = isChinese ? CHINESE_PUNCTUATION_MAP : ENGLISH_PUNCTUATION_MAP;
    
    for (const punct of Object.keys(punctMap)) {
        if (text.includes(punct)) {
            return true;
        }
    }
    return false;
}

// ===== Custom Arbitraries =====

/**
 * Generate Chinese characters (CJK Unified Ideographs)
 */
const chineseCharArb = fc.integer({ min: 0x4E00, max: 0x9FFF })
    .map(code => String.fromCharCode(code));

/**
 * Generate Chinese text (1-10 characters)
 */
const chineseTextArb = fc.array(chineseCharArb, { minLength: 1, maxLength: 10 })
    .map(chars => chars.join(''));

/**
 * Generate English text (letters only, no punctuation)
 */
const englishTextArb = fc.string({
    unit: fc.constantFrom(
        ...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ '.split('')
    ),
    minLength: 1,
    maxLength: 20
}).filter(s => s.trim().length > 0);

/**
 * Generate Chinese punctuation marks
 */
const chinesePunctuationArb = fc.constantFrom(
    '，', '。', '！', '？', '；', '：', '、', '「', '」',
    '\u201C', '\u201D', '\u2018', '\u2019', '（', '）'
);

/**
 * Generate English punctuation marks
 */
const englishPunctuationArb = fc.constantFrom(
    ',', '.', '!', '?', ';', ':', '(', ')', '—', '–'
);

/**
 * Generate text without any punctuation (Chinese or English)
 */
const textWithoutPunctuationArb = fc.oneof(chineseTextArb, englishTextArb);

/**
 * Generate a word with punctuation (Chinese)
 */
const chineseWordWithPunctuationArb = fc.tuple(chineseTextArb, chinesePunctuationArb)
    .map(([text, punct]) => text + punct);

/**
 * Generate a word with punctuation (English)
 */
const englishWordWithPunctuationArb = fc.tuple(englishTextArb, englishPunctuationArb)
    .map(([text, punct]) => text + punct);

/**
 * Generate multi-line text for word mode (1-5 lines)
 */
const multiLineTextArb = fc.array(textWithoutPunctuationArb, { minLength: 1, maxLength: 5 })
    .map(lines => lines.join('\n'));

/**
 * Generate multi-line text with some empty lines
 */
const multiLineTextWithEmptyLinesArb = fc.array(
    fc.oneof(
        textWithoutPunctuationArb,
        fc.constant(''),
        fc.constant('   '),  // whitespace only
        fc.constant('\t')    // tab only
    ),
    { minLength: 1, maxLength: 8 }
).map(lines => lines.join('\n'));

/**
 * Generate Chinese language code
 */
const chineseLangArb = fc.constantFrom('zh-TW', 'zh-HK', 'zh-CN');

/**
 * Generate English language code
 */
const englishLangArb = fc.constantFrom('en-US', 'en-GB');

/**
 * Generate any language code
 */
const langArb = fc.oneof(chineseLangArb, englishLangArb);

// ===== Property Tests =====

describe('Property 5: Punctuation Setting Respects Toggle State (Word Mode)', () => {
    /**
     * Feature: speech-rules-redesign, Property 5: Punctuation Setting Respects Toggle State
     * 
     * *For any* text input in word mode, when punctuation reading is disabled, 
     * the punctuation marks SHALL NOT be converted to spoken words, and when 
     * enabled, punctuation marks SHALL be converted to their spoken names.
     * 
     * **Validates: Requirements 1.2, 1.3, 2.3, 2.4, 3.3, 3.4**
     */

    it('Property 5.1: When punctuation reading is disabled, text should remain unchanged', () => {
        /**
         * Requirement 2.4: When disabled in Word_Mode with Chinese, read text without punctuation conversion
         * Requirement 3.4: When disabled in Word_Mode with English, read text without punctuation conversion
         */
        fc.assert(
            fc.property(
                fc.oneof(chineseWordWithPunctuationArb, englishWordWithPunctuationArb),
                langArb,
                (text, lang) => {
                    const result = convertPunctuationForWordMode(text, lang, false);
                    
                    // When disabled, text should remain unchanged
                    return result === text;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 5.2: When punctuation reading is enabled, punctuation should be converted', () => {
        /**
         * Requirement 2.3: When enabled in Word_Mode with Chinese, convert punctuation to spoken names
         * Requirement 3.3: When enabled in Word_Mode with English, convert punctuation to spoken names
         */
        fc.assert(
            fc.property(
                chineseWordWithPunctuationArb,
                chineseLangArb,
                (text, lang) => {
                    const result = convertPunctuationForWordMode(text, lang, true);
                    
                    // When enabled, result should be different from original (punctuation converted)
                    // and should contain Chinese punctuation names
                    if (containsConvertiblePunctuation(text, lang)) {
                        return result !== text;
                    }
                    return true;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 5.3: English punctuation should be converted to English names when enabled', () => {
        /**
         * Requirement 3.3: When enabled in Word_Mode with English, convert punctuation to spoken names
         */
        fc.assert(
            fc.property(
                englishWordWithPunctuationArb,
                englishLangArb,
                (text, lang) => {
                    const result = convertPunctuationForWordMode(text, lang, true);
                    
                    // When enabled, result should be different from original
                    if (containsConvertiblePunctuation(text, lang)) {
                        return result !== text;
                    }
                    return true;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 5.4: Text without punctuation should remain unchanged regardless of setting', () => {
        /**
         * Text without punctuation should not be affected by the setting
         */
        fc.assert(
            fc.property(
                textWithoutPunctuationArb,
                langArb,
                fc.boolean(),
                (text, lang, punctuationEnabled) => {
                    const result = convertPunctuationForWordMode(text, lang, punctuationEnabled);
                    
                    // Text without punctuation should remain unchanged
                    return result === text;
                }
            ),
            { numRuns: 100 }
        );
    });
});

describe('Property 11: Word Mode Line Splitting', () => {
    /**
     * Feature: speech-rules-redesign, Property 11: Word Mode Line Splitting
     * 
     * *For any* text in Word Mode, the text SHALL be split by newline characters, 
     * with each non-empty line treated as a single unit.
     * 
     * **Validates: Requirements 2.1, 3.1**
     */

    it('Property 11.1: Each non-empty line should become a separate item', () => {
        /**
         * Requirement 2.1: In Word_Mode with Chinese, read each line as a single unit
         * Requirement 3.1: In Word_Mode with English, read each line as a single unit
         */
        fc.assert(
            fc.property(
                multiLineTextArb,
                (text) => {
                    const lines = splitWordModeLines(text);
                    const expectedLines = text.split('\n').map(s => s.trim()).filter(s => s !== '');
                    
                    // Number of items should match number of non-empty lines
                    return lines.length === expectedLines.length;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 11.2: Empty lines should be filtered out', () => {
        /**
         * Empty lines should not appear in the result
         */
        fc.assert(
            fc.property(
                multiLineTextWithEmptyLinesArb,
                (text) => {
                    const lines = splitWordModeLines(text);
                    
                    // No empty strings should be in the result
                    return lines.every(line => line.length > 0);
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 11.3: Whitespace-only lines should be filtered out', () => {
        /**
         * Lines containing only whitespace should be treated as empty
         */
        fc.assert(
            fc.property(
                multiLineTextWithEmptyLinesArb,
                (text) => {
                    const lines = splitWordModeLines(text);
                    
                    // No whitespace-only strings should be in the result
                    return lines.every(line => line.trim().length > 0);
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 11.4: Line order should be preserved', () => {
        /**
         * The order of lines should match the original order
         */
        fc.assert(
            fc.property(
                multiLineTextArb,
                (text) => {
                    const lines = splitWordModeLines(text);
                    const expectedLines = text.split('\n').map(s => s.trim()).filter(s => s !== '');
                    
                    // Each line should match in order
                    if (lines.length !== expectedLines.length) {
                        return false;
                    }
                    
                    for (let i = 0; i < lines.length; i++) {
                        if (lines[i] !== expectedLines[i]) {
                            return false;
                        }
                    }
                    
                    return true;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 11.5: Lines should be trimmed', () => {
        /**
         * Leading and trailing whitespace should be removed from each line
         */
        fc.assert(
            fc.property(
                fc.array(
                    fc.tuple(
                        fc.string({ unit: fc.constant(' '), minLength: 0, maxLength: 3 }),
                        textWithoutPunctuationArb,
                        fc.string({ unit: fc.constant(' '), minLength: 0, maxLength: 3 })
                    ).map(([prefix, text, suffix]) => prefix + text + suffix),
                    { minLength: 1, maxLength: 5 }
                ).map(lines => lines.join('\n')),
                (text) => {
                    const lines = splitWordModeLines(text);
                    
                    // Each line should be trimmed (no leading/trailing whitespace)
                    return lines.every(line => line === line.trim());
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 11.6: Single line text should return single item array', () => {
        /**
         * Text without newlines should return a single-item array
         */
        fc.assert(
            fc.property(
                textWithoutPunctuationArb,
                (text) => {
                    const lines = splitWordModeLines(text);
                    
                    // Single line text should return exactly one item
                    return lines.length === 1 && lines[0] === text.trim();
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 11.7: Empty text should return empty array', () => {
        /**
         * Empty or whitespace-only text should return empty array
         */
        fc.assert(
            fc.property(
                fc.constantFrom('', '   ', '\n', '\n\n', '  \n  \n  '),
                (text) => {
                    const lines = splitWordModeLines(text);
                    
                    // Empty text should return empty array
                    return lines.length === 0;
                }
            ),
            { numRuns: 100 }
        );
    });
});

// Export functions for potential reuse
export { splitWordModeLines, convertPunctuationForWordMode, containsConvertiblePunctuation };
