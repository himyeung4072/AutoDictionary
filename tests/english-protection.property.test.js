/**
 * Property-Based Tests for English Special Character Protection
 * 
 * Feature: speech-rules-redesign
 * 
 * These tests validate the English special character protection properties:
 * - Property 8: Apostrophe Preservation in Possessives and Contractions
 * - Property 9: Abbreviation Period Preservation
 * - Property 10: Decimal Point Preservation
 * 
 * Each test runs minimum 100 iterations as per testing strategy.
 * 
 * **Validates: Requirements 8.3-8.5, 10.1-10.4, 11.1-11.4**
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';

// ===== Constants for Protection =====

/**
 * Placeholder constants used for protection (from design document)
 */
const APOSTROPHE_PLACEHOLDER = '\u0000APO\u0000';
const ABBREVIATION_DOT_PLACEHOLDER = '\u0000DOT\u0000';
const DECIMAL_PLACEHOLDER = '\u0000DEC\u0000';

/**
 * Common title abbreviations (Requirements 11.1)
 */
const TITLE_ABBREVIATIONS = ['Mr', 'Mrs', 'Ms', 'Dr', 'Prof', 'Jr', 'Sr'];

/**
 * Common abbreviations (Requirements 11.2)
 */
const COMMON_ABBREVIATIONS = ['Inc', 'Ltd', 'Corp', 'Co', 'etc', 'vs', 'St'];

/**
 * Multi-part abbreviations (Requirements 11.3)
 */
const MULTI_PART_ABBREVIATIONS = ['e.g.', 'i.e.', 'a.m.', 'p.m.', 'U.S.', 'U.K.'];

/**
 * All single-word abbreviations
 */
const ALL_ABBREVIATIONS = [...TITLE_ABBREVIATIONS, ...COMMON_ABBREVIATIONS];

// ===== Protection Functions (extracted from auto_dic.html) =====

/**
 * Convert punctuation to speech text for English
 * This mirrors the convertPunctuationToSpeech function logic for English
 * 
 * @param {string} text - The text to convert
 * @returns {string} - The converted text with protected characters restored
 */
function convertPunctuationToSpeechEnglish(text) {
    const pauseMarkEn = ',';
    let result = text;
    
    // Step 1: Protect apostrophes in possessives and contractions
    // Match word's, don't, I'm, you're, we've, they'll, he'd etc.
    // Handle both straight apostrophe ' (U+0027) and curly apostrophe ' (U+2019)
    result = result.replace(/(\w)[''](\w)/g, '$1' + APOSTROPHE_PLACEHOLDER + '$2');
    // Handle trailing possessives like teachers' (plural possessive)
    result = result.replace(/(\w)[''](\s|$)/g, '$1' + APOSTROPHE_PLACEHOLDER + '$2');
    
    // Step 2: Protect common abbreviation periods
    ALL_ABBREVIATIONS.forEach(abbr => {
        const regex = new RegExp(`\\b(${abbr})\\.`, 'gi');
        result = result.replace(regex, '$1' + ABBREVIATION_DOT_PLACEHOLDER);
    });
    // Special handling for multi-part abbreviations
    result = result.replace(/\be\.g\./gi, 'e' + ABBREVIATION_DOT_PLACEHOLDER + 'g' + ABBREVIATION_DOT_PLACEHOLDER);
    result = result.replace(/\bi\.e\./gi, 'i' + ABBREVIATION_DOT_PLACEHOLDER + 'e' + ABBREVIATION_DOT_PLACEHOLDER);
    result = result.replace(/\ba\.m\./gi, 'a' + ABBREVIATION_DOT_PLACEHOLDER + 'm' + ABBREVIATION_DOT_PLACEHOLDER);
    result = result.replace(/\bp\.m\./gi, 'p' + ABBREVIATION_DOT_PLACEHOLDER + 'm' + ABBREVIATION_DOT_PLACEHOLDER);
    result = result.replace(/\bU\.S\./gi, 'U' + ABBREVIATION_DOT_PLACEHOLDER + 'S' + ABBREVIATION_DOT_PLACEHOLDER);
    result = result.replace(/\bU\.K\./gi, 'U' + ABBREVIATION_DOT_PLACEHOLDER + 'K' + ABBREVIATION_DOT_PLACEHOLDER);
    
    // Step 3: Protect decimal points (digit.digit)
    result = result.replace(/(\d)\.(\d)/g, '$1' + DECIMAL_PLACEHOLDER + '$2');
    
    // Step 4: Convert English punctuation
    result = result
        .replace(/,/g, pauseMarkEn + ' comma ')
        .replace(/\./g, pauseMarkEn + ' period ')
        .replace(/!/g, pauseMarkEn + ' exclamation mark ')
        .replace(/\?/g, pauseMarkEn + ' question mark ')
        .replace(/;/g, pauseMarkEn + ' semicolon ')
        .replace(/:/g, pauseMarkEn + ' colon ')
        .replace(/—/g, pauseMarkEn + ' dash ')
        .replace(/–/g, pauseMarkEn + ' dash ')
        .replace(/，/g, pauseMarkEn + ' comma ')
        .replace(/。/g, pauseMarkEn + ' period ')
        .replace(/！/g, pauseMarkEn + ' exclamation mark ')
        .replace(/？/g, pauseMarkEn + ' question mark ')
        .replace(/；/g, pauseMarkEn + ' semicolon ')
        .replace(/：/g, pauseMarkEn + ' colon ')
        .replace(/、/g, pauseMarkEn + ' pause ')
        .replace(/"/g, pauseMarkEn + ' quote ')
        .replace(/"/g, pauseMarkEn + ' end quote ')
        .replace(/'/g, pauseMarkEn + ' quote ')
        .replace(/'/g, pauseMarkEn + ' end quote ')
        .replace(/「/g, pauseMarkEn + ' quote ')
        .replace(/」/g, pauseMarkEn + ' end quote ')
        .replace(/（/g, pauseMarkEn + ' left parenthesis ')
        .replace(/）/g, pauseMarkEn + ' right parenthesis ')
        .replace(/\(/g, pauseMarkEn + ' left parenthesis ')
        .replace(/\)/g, pauseMarkEn + ' right parenthesis ');
    
    // Step 5: Restore protected characters
    result = result
        .replace(new RegExp(APOSTROPHE_PLACEHOLDER.replace(/\u0000/g, '\\u0000'), 'g'), "'")
        .replace(new RegExp(ABBREVIATION_DOT_PLACEHOLDER.replace(/\u0000/g, '\\u0000'), 'g'), ".")
        .replace(new RegExp(DECIMAL_PLACEHOLDER.replace(/\u0000/g, '\\u0000'), 'g'), ".");
    
    return result;
}

// ===== Custom Arbitraries =====

/**
 * Generate English words (letters only)
 */
const englishWordArb = fc.string({
    unit: fc.constantFrom(...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')),
    minLength: 1,
    maxLength: 10
}).filter(s => s.length > 0);

/**
 * Generate possessive forms (word's)
 * Requirements: 10.1
 */
const possessiveArb = englishWordArb.map(word => word + "'s");

/**
 * Generate possessive forms with curly apostrophe (word's)
 * Requirements: 10.4
 */
const possessiveCurlyArb = englishWordArb.map(word => word + "'s");

/**
 * Generate plural possessive forms (words')
 * Requirements: 10.1
 */
const pluralPossessiveArb = englishWordArb.map(word => word + "'");

/**
 * Generate plural possessive forms with curly apostrophe (words')
 */
const pluralPossessiveCurlyArb = englishWordArb.map(word => word + "'");

/**
 * Common contractions (Requirements: 10.2)
 */
const CONTRACTIONS = [
    "don't", "doesn't", "didn't", "won't", "wouldn't", "can't", "couldn't",
    "shouldn't", "isn't", "aren't", "wasn't", "weren't", "haven't", "hasn't",
    "hadn't", "I'm", "I've", "I'll", "I'd", "you're", "you've", "you'll", "you'd",
    "he's", "he'll", "he'd", "she's", "she'll", "she'd", "it's", "it'll",
    "we're", "we've", "we'll", "we'd", "they're", "they've", "they'll", "they'd",
    "that's", "that'll", "that'd", "who's", "who'll", "who'd", "what's", "what'll",
    "there's", "there'll", "here's", "let's", "ain't", "o'clock"
];

/**
 * Generate contractions
 */
const contractionArb = fc.constantFrom(...CONTRACTIONS);

/**
 * Generate contractions with curly apostrophe
 */
const contractionCurlyArb = fc.constantFrom(...CONTRACTIONS.map(c => c.replace("'", "'")));

/**
 * Generate title abbreviations with period (Mr., Dr., etc.)
 * Requirements: 11.1
 */
const titleAbbreviationArb = fc.constantFrom(...TITLE_ABBREVIATIONS).map(abbr => abbr + '.');

/**
 * Generate common abbreviations with period (Inc., Ltd., etc.)
 * Requirements: 11.2
 */
const commonAbbreviationArb = fc.constantFrom(...COMMON_ABBREVIATIONS).map(abbr => abbr + '.');

/**
 * Generate multi-part abbreviations (e.g., i.e., etc.)
 * Requirements: 11.3
 */
const multiPartAbbreviationArb = fc.constantFrom(...MULTI_PART_ABBREVIATIONS);

/**
 * Generate decimal numbers (Requirements: 11.4)
 */
const decimalNumberArb = fc.tuple(
    fc.integer({ min: 0, max: 9999 }),
    fc.integer({ min: 0, max: 99 })
).map(([whole, decimal]) => `${whole}.${decimal.toString().padStart(2, '0')}`);

/**
 * Generate currency amounts with decimals
 */
const currencyAmountArb = fc.tuple(
    fc.constantFrom('$', '£', '€', ''),
    fc.integer({ min: 0, max: 9999 }),
    fc.integer({ min: 0, max: 99 })
).map(([symbol, whole, decimal]) => `${symbol}${whole}.${decimal.toString().padStart(2, '0')}`);

/**
 * Generate simple decimal numbers like 3.14
 */
const simpleDecimalArb = fc.tuple(
    fc.integer({ min: 0, max: 999 }),
    fc.integer({ min: 1, max: 999999 })
).map(([whole, decimal]) => `${whole}.${decimal}`);

// ===== Property Tests =====

describe('Property 8: Apostrophe Preservation in Possessives and Contractions', () => {
    /**
     * Feature: speech-rules-redesign, Property 8: Apostrophe Preservation
     * 
     * *For any* English text containing possessive forms (word's, teachers') or 
     * contractions (don't, I'm, we've, they'll, he'd), the apostrophe SHALL be 
     * preserved in the output regardless of the punctuation reading setting.
     * 
     * **Validates: Requirements 8.3, 10.1, 10.2, 10.4**
     */

    it('Property 8.1: Possessive apostrophes (straight) should be preserved', () => {
        /**
         * Requirement 10.1: Preserve apostrophes in possessive forms like "Reach's", "dog's"
         */
        fc.assert(
            fc.property(
                possessiveArb,
                (possessive) => {
                    const result = convertPunctuationToSpeechEnglish(possessive);
                    
                    // The apostrophe should be preserved (not converted to "quote")
                    // Result should contain the apostrophe character
                    return result.includes("'") && !result.includes(' quote ');
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 8.2: Possessive apostrophes (curly) should be preserved', () => {
        /**
         * Requirement 10.4: Handle curly apostrophe (') identically to straight apostrophe
         */
        fc.assert(
            fc.property(
                possessiveCurlyArb,
                (possessive) => {
                    const result = convertPunctuationToSpeechEnglish(possessive);
                    
                    // The apostrophe should be preserved (restored as straight apostrophe)
                    return result.includes("'");
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 8.3: Plural possessive apostrophes should be preserved', () => {
        /**
         * Requirement 10.1: Preserve apostrophes in possessive forms like "teachers'"
         */
        fc.assert(
            fc.property(
                pluralPossessiveArb,
                (possessive) => {
                    const result = convertPunctuationToSpeechEnglish(possessive);
                    
                    // The trailing apostrophe should be preserved
                    return result.includes("'");
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 8.4: Contraction apostrophes should be preserved', () => {
        /**
         * Requirement 10.2: Preserve apostrophes in contractions like "don't", "I'm", "we've"
         */
        fc.assert(
            fc.property(
                contractionArb,
                (contraction) => {
                    const result = convertPunctuationToSpeechEnglish(contraction);
                    
                    // The apostrophe should be preserved
                    return result.includes("'");
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 8.5: Curly apostrophe contractions should be handled identically', () => {
        /**
         * Requirement 10.4: Handle both straight (') and curly (') apostrophes identically
         */
        fc.assert(
            fc.property(
                fc.integer({ min: 0, max: CONTRACTIONS.length - 1 }),
                (index) => {
                    const straightContraction = CONTRACTIONS[index];
                    const curlyContraction = straightContraction.replace("'", "'");
                    
                    const straightResult = convertPunctuationToSpeechEnglish(straightContraction);
                    const curlyResult = convertPunctuationToSpeechEnglish(curlyContraction);
                    
                    // Both should produce equivalent results (apostrophe preserved)
                    return straightResult.includes("'") && curlyResult.includes("'");
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 8.6: Apostrophe in context should be preserved', () => {
        /**
         * Test apostrophe preservation in sentence context
         */
        fc.assert(
            fc.property(
                englishWordArb,
                possessiveArb,
                englishWordArb,
                (prefix, possessive, suffix) => {
                    const sentence = `${prefix} ${possessive} ${suffix}`;
                    const result = convertPunctuationToSpeechEnglish(sentence);
                    
                    // The apostrophe should be preserved in context
                    return result.includes("'");
                }
            ),
            { numRuns: 100 }
        );
    });
});

describe('Property 9: Abbreviation Period Preservation', () => {
    /**
     * Feature: speech-rules-redesign, Property 9: Abbreviation Period Preservation
     * 
     * *For any* English text containing common abbreviations (Mr., Dr., e.g., U.S., etc.), 
     * the periods within those abbreviations SHALL be preserved in the output regardless 
     * of the punctuation reading setting.
     * 
     * **Validates: Requirements 8.4, 11.1, 11.2, 11.3**
     */

    it('Property 9.1: Title abbreviation periods should be preserved', () => {
        /**
         * Requirement 11.1: Preserve periods in title abbreviations (Mr., Mrs., Ms., Dr., Prof., Jr., Sr.)
         */
        fc.assert(
            fc.property(
                titleAbbreviationArb,
                englishWordArb,
                (abbr, name) => {
                    const text = `${abbr} ${name}`;
                    const result = convertPunctuationToSpeechEnglish(text);
                    
                    // The period should be preserved (not converted to "period")
                    // The abbreviation should still have its period
                    const abbrWithoutPeriod = abbr.slice(0, -1);
                    return result.includes(abbrWithoutPeriod + '.') && !result.includes(abbrWithoutPeriod + ', period');
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 9.2: Common abbreviation periods should be preserved', () => {
        /**
         * Requirement 11.2: Preserve periods in common abbreviations (Inc., Ltd., Corp., Co., etc., vs., St.)
         */
        fc.assert(
            fc.property(
                commonAbbreviationArb,
                (abbr) => {
                    const result = convertPunctuationToSpeechEnglish(abbr);
                    
                    // The period should be preserved
                    const abbrWithoutPeriod = abbr.slice(0, -1);
                    return result.includes(abbrWithoutPeriod + '.');
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 9.3: Multi-part abbreviation periods should be preserved', () => {
        /**
         * Requirement 11.3: Preserve periods in multi-part abbreviations (e.g., i.e., a.m., p.m., U.S., U.K.)
         */
        fc.assert(
            fc.property(
                multiPartAbbreviationArb,
                (abbr) => {
                    const result = convertPunctuationToSpeechEnglish(abbr);
                    
                    // All periods in the abbreviation should be preserved
                    // Count periods in original and result
                    const originalPeriods = (abbr.match(/\./g) || []).length;
                    const resultPeriods = (result.match(/\./g) || []).length;
                    
                    return resultPeriods === originalPeriods;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 9.4: Abbreviation in sentence context should preserve period', () => {
        /**
         * Test abbreviation period preservation in sentence context
         */
        fc.assert(
            fc.property(
                titleAbbreviationArb,
                englishWordArb,
                (abbr, name) => {
                    const sentence = `Hello ${abbr} ${name} today`;
                    const result = convertPunctuationToSpeechEnglish(sentence);
                    
                    // The abbreviation period should be preserved
                    return result.includes('.');
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 9.5: Case insensitivity for abbreviations', () => {
        /**
         * Abbreviations should be recognized regardless of case
         */
        fc.assert(
            fc.property(
                fc.constantFrom(...TITLE_ABBREVIATIONS),
                (abbr) => {
                    const lowerCase = abbr.toLowerCase() + '.';
                    const upperCase = abbr.toUpperCase() + '.';
                    
                    const lowerResult = convertPunctuationToSpeechEnglish(lowerCase);
                    const upperResult = convertPunctuationToSpeechEnglish(upperCase);
                    
                    // Both should preserve the period
                    return lowerResult.includes('.') && upperResult.includes('.');
                }
            ),
            { numRuns: 100 }
        );
    });
});

describe('Property 10: Decimal Point Preservation', () => {
    /**
     * Feature: speech-rules-redesign, Property 10: Decimal Point Preservation
     * 
     * *For any* English text containing decimal numbers (like 3.14, $99.99), 
     * the decimal points SHALL be preserved in the output regardless of the 
     * punctuation reading setting.
     * 
     * **Validates: Requirements 8.5, 11.4**
     */

    it('Property 10.1: Decimal points in numbers should be preserved', () => {
        /**
         * Requirement 11.4: Preserve decimal points in numbers like 3.14, $99.99
         */
        fc.assert(
            fc.property(
                simpleDecimalArb,
                (decimal) => {
                    const result = convertPunctuationToSpeechEnglish(decimal);
                    
                    // The decimal point should be preserved (not converted to "period")
                    return result.includes('.') && !result.includes(' period ');
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 10.2: Currency amounts with decimals should preserve decimal point', () => {
        /**
         * Requirement 11.4: Preserve decimal points in currency amounts
         */
        fc.assert(
            fc.property(
                currencyAmountArb,
                (amount) => {
                    const result = convertPunctuationToSpeechEnglish(amount);
                    
                    // The decimal point should be preserved
                    return result.includes('.');
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 10.3: Decimal numbers in sentence context should preserve decimal point', () => {
        /**
         * Test decimal point preservation in sentence context
         */
        fc.assert(
            fc.property(
                simpleDecimalArb,
                englishWordArb,
                (decimal, word) => {
                    const sentence = `The value is ${decimal} ${word}`;
                    const result = convertPunctuationToSpeechEnglish(sentence);
                    
                    // The decimal point should be preserved
                    return result.includes('.');
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 10.4: Multiple decimal numbers should all preserve decimal points', () => {
        /**
         * Multiple decimal numbers in text should all have their decimal points preserved
         */
        fc.assert(
            fc.property(
                simpleDecimalArb,
                simpleDecimalArb,
                (decimal1, decimal2) => {
                    const text = `${decimal1} and ${decimal2}`;
                    const result = convertPunctuationToSpeechEnglish(text);
                    
                    // Count decimal points - should have at least 2
                    const periodCount = (result.match(/\./g) || []).length;
                    return periodCount >= 2;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 10.5: Decimal point vs sentence-ending period distinction', () => {
        /**
         * Decimal points should be preserved while sentence-ending periods are converted
         */
        fc.assert(
            fc.property(
                simpleDecimalArb,
                (decimal) => {
                    // Add a sentence-ending period
                    const sentence = `The value is ${decimal}.`;
                    const result = convertPunctuationToSpeechEnglish(sentence);
                    
                    // Should have the decimal point preserved AND the sentence period converted
                    // The decimal point should remain, and "period" should appear for the sentence end
                    return result.includes('.') && result.includes(' period ');
                }
            ),
            { numRuns: 100 }
        );
    });
});

describe('Combined Protection Properties', () => {
    /**
     * Test that all protections work together correctly
     */

    it('Property: Mixed content with apostrophes, abbreviations, and decimals', () => {
        /**
         * All protections should work together in complex text
         */
        fc.assert(
            fc.property(
                titleAbbreviationArb,
                englishWordArb,
                possessiveArb,
                simpleDecimalArb,
                (abbr, name, possessive, decimal) => {
                    const text = `${abbr} ${name} said ${possessive} value is ${decimal}`;
                    const result = convertPunctuationToSpeechEnglish(text);
                    
                    // All protected characters should be preserved
                    // Should have apostrophe, abbreviation period, and decimal point
                    const hasApostrophe = result.includes("'");
                    const hasPeriods = (result.match(/\./g) || []).length >= 2; // abbr + decimal
                    
                    return hasApostrophe && hasPeriods;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property: Contractions with abbreviations', () => {
        /**
         * Contractions and abbreviations should both be protected
         */
        fc.assert(
            fc.property(
                contractionArb,
                titleAbbreviationArb,
                englishWordArb,
                (contraction, abbr, name) => {
                    const text = `${contraction} ${abbr} ${name}`;
                    const result = convertPunctuationToSpeechEnglish(text);
                    
                    // Both apostrophe and period should be preserved
                    return result.includes("'") && result.includes('.');
                }
            ),
            { numRuns: 100 }
        );
    });
});

// Export functions for potential reuse
export { 
    convertPunctuationToSpeechEnglish,
    TITLE_ABBREVIATIONS,
    COMMON_ABBREVIATIONS,
    MULTI_PART_ABBREVIATIONS,
    ALL_ABBREVIATIONS,
    CONTRACTIONS
};
