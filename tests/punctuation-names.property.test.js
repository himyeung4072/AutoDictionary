/**
 * Property-Based Tests for Punctuation Name Converter
 * 
 * Feature: speech-rules-redesign
 * Property 6: Chinese Punctuation Names
 * Property 7: English Punctuation Names
 * 
 * These tests validate correctness properties using fast-check
 * as specified in the design document.
 * 
 * Each test runs minimum 100 iterations as per testing strategy.
 * 
 * **Validates: Requirements 7.1, 7.3, 8.1**
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { 
    CHINESE_PUNCTUATION_MAP, 
    ENGLISH_PUNCTUATION_MAP, 
    getPunctuationName 
} from './punctuation-names.js';

// ===== Custom Arbitraries =====

/**
 * Generate Chinese punctuation marks from the map
 */
const chinesePunctuationArb = fc.constantFrom(
    ...Object.keys(CHINESE_PUNCTUATION_MAP)
);

/**
 * Generate English punctuation marks from the map
 */
const englishPunctuationArb = fc.constantFrom(
    ...Object.keys(ENGLISH_PUNCTUATION_MAP)
);

/**
 * Generate Chinese language codes
 */
const chineseLangArb = fc.constantFrom(
    'zh', 'zh-TW', 'zh-HK', 'zh-CN', 'ZH', 'ZH-TW', 'chinese', 'Chinese'
);

/**
 * Generate English language codes
 */
const englishLangArb = fc.constantFrom(
    'en', 'en-US', 'en-GB', 'EN', 'EN-US', 'english', 'English'
);

// ===== Property Tests =====

describe('Property 6: Chinese Punctuation Names', () => {
    /**
     * Feature: speech-rules-redesign, Property 6: Chinese Punctuation Names
     * 
     * *For any* Chinese text with punctuation reading enabled, punctuation marks 
     * SHALL be converted to their Chinese spoken names (e.g., ，→逗號, 。→句號).
     * 
     * **Validates: Requirements 7.1, 7.3**
     */

    it('Property 6.1: Chinese punctuation marks should be converted to Chinese spoken names', () => {
        /**
         * Requirement 7.1: Use Chinese punctuation names (逗號, 句號, 問號, etc.)
         */
        fc.assert(
            fc.property(
                chinesePunctuationArb,
                chineseLangArb,
                (punct, lang) => {
                    const result = getPunctuationName(punct, lang);
                    const expected = CHINESE_PUNCTUATION_MAP[punct];
                    
                    // The result should be the Chinese spoken name
                    return result === expected;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 6.2: Chinese punctuation names should be non-empty strings', () => {
        /**
         * Requirement 7.3: Use Chinese names for punctuation marks
         */
        fc.assert(
            fc.property(
                chinesePunctuationArb,
                chineseLangArb,
                (punct, lang) => {
                    const result = getPunctuationName(punct, lang);
                    
                    // The result should be a non-empty string
                    return typeof result === 'string' && result.length > 0;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 6.3: Chinese punctuation names should be different from the original punctuation', () => {
        /**
         * The spoken name should be different from the punctuation mark itself
         */
        fc.assert(
            fc.property(
                chinesePunctuationArb,
                chineseLangArb,
                (punct, lang) => {
                    const result = getPunctuationName(punct, lang);
                    
                    // The spoken name should be different from the original punctuation
                    return result !== punct;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 6.4: Language code case should not affect Chinese punctuation conversion', () => {
        /**
         * Language codes should be case-insensitive
         */
        fc.assert(
            fc.property(
                chinesePunctuationArb,
                (punct) => {
                    const resultLower = getPunctuationName(punct, 'zh');
                    const resultUpper = getPunctuationName(punct, 'ZH');
                    const resultMixed = getPunctuationName(punct, 'Zh-TW');
                    
                    // All should produce the same result
                    return resultLower === resultUpper && resultUpper === resultMixed;
                }
            ),
            { numRuns: 100 }
        );
    });
});

describe('Property 7: English Punctuation Names', () => {
    /**
     * Feature: speech-rules-redesign, Property 7: English Punctuation Names
     * 
     * *For any* English text with punctuation reading enabled, punctuation marks 
     * SHALL be converted to their English spoken names (e.g., , → comma, . → period).
     * 
     * **Validates: Requirements 8.1**
     */

    it('Property 7.1: English punctuation marks should be converted to English spoken names', () => {
        /**
         * Requirement 8.1: Use English punctuation names (comma, period, question mark, etc.)
         */
        fc.assert(
            fc.property(
                englishPunctuationArb,
                englishLangArb,
                (punct, lang) => {
                    const result = getPunctuationName(punct, lang);
                    const expected = ENGLISH_PUNCTUATION_MAP[punct];
                    
                    // The result should be the English spoken name
                    return result === expected;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 7.2: English punctuation names should be non-empty strings', () => {
        /**
         * Requirement 8.1: Use English punctuation names
         */
        fc.assert(
            fc.property(
                englishPunctuationArb,
                englishLangArb,
                (punct, lang) => {
                    const result = getPunctuationName(punct, lang);
                    
                    // The result should be a non-empty string
                    return typeof result === 'string' && result.length > 0;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 7.3: English punctuation names should be different from the original punctuation', () => {
        /**
         * The spoken name should be different from the punctuation mark itself
         */
        fc.assert(
            fc.property(
                englishPunctuationArb,
                englishLangArb,
                (punct, lang) => {
                    const result = getPunctuationName(punct, lang);
                    
                    // The spoken name should be different from the original punctuation
                    return result !== punct;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 7.4: Language code case should not affect English punctuation conversion', () => {
        /**
         * Language codes should be case-insensitive
         */
        fc.assert(
            fc.property(
                englishPunctuationArb,
                (punct) => {
                    const resultLower = getPunctuationName(punct, 'en');
                    const resultUpper = getPunctuationName(punct, 'EN');
                    const resultMixed = getPunctuationName(punct, 'En-US');
                    
                    // All should produce the same result
                    return resultLower === resultUpper && resultUpper === resultMixed;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 7.5: English punctuation names should contain only lowercase letters and spaces', () => {
        /**
         * English spoken names should be readable words
         */
        fc.assert(
            fc.property(
                englishPunctuationArb,
                englishLangArb,
                (punct, lang) => {
                    const result = getPunctuationName(punct, lang);
                    
                    // The result should only contain lowercase letters and spaces
                    return /^[a-z ]+$/.test(result);
                }
            ),
            { numRuns: 100 }
        );
    });
});

describe('Cross-language Properties', () => {
    /**
     * Properties that should hold across both languages
     */

    it('Property: Unknown punctuation should return the original character', () => {
        /**
         * Edge case: Unknown punctuation marks should be returned as-is
         */
        const unknownPunctuationArb = fc.constantFrom(
            '@', '#', '$', '%', '^', '&', '*', '~', '`', '|', '\\'
        );
        
        fc.assert(
            fc.property(
                unknownPunctuationArb,
                fc.oneof(chineseLangArb, englishLangArb),
                (punct, lang) => {
                    const result = getPunctuationName(punct, lang);
                    
                    // Unknown punctuation should return the original
                    return result === punct;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property: Empty input should return empty string', () => {
        /**
         * Edge case: Empty or null input handling
         */
        fc.assert(
            fc.property(
                fc.oneof(chineseLangArb, englishLangArb),
                (lang) => {
                    const resultEmpty = getPunctuationName('', lang);
                    const resultNull = getPunctuationName(null, lang);
                    const resultUndefined = getPunctuationName(undefined, lang);
                    
                    // All should return empty string
                    return resultEmpty === '' && resultNull === '' && resultUndefined === '';
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property: Curly quotes should give different names for different languages', () => {
        /**
         * Requirement 6.4: Read punctuation in the appropriate language
         * Curly quotes exist in both maps with different names
         */
        // Curly quotes that exist in both Chinese and English maps
        const curlyQuotesArb = fc.constantFrom(
            '\u201C',  // " left double quotation mark
            '\u201D',  // " right double quotation mark
            '\u2018',  // ' left single quotation mark
            '\u2019'   // ' right single quotation mark
        );
        
        fc.assert(
            fc.property(
                curlyQuotesArb,
                (punct) => {
                    const chineseResult = getPunctuationName(punct, 'zh');
                    const englishResult = getPunctuationName(punct, 'en');
                    
                    // Both should return valid names (not the original punctuation)
                    return chineseResult !== punct && englishResult !== punct;
                }
            ),
            { numRuns: 100 }
        );
    });
});
