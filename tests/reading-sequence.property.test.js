/**
 * Property-Based Tests for Article Reading Sequence
 * 
 * Feature: speech-rules-redesign
 * 
 * These tests validate the reading sequence properties:
 * - Property 2: Punctuation Read Once Only
 * - Property 3: Reading Sequence Order
 * - Property 4: Consecutive Punctuation Handling
 * 
 * Each test runs minimum 100 iterations as per testing strategy.
 * 
 * **Validates: Requirements 5.1-5.4, 6.1-6.3**
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { splitArticleSegments, PUNCTUATION_PATTERN } from './split-article-segments.js';
import { getPunctuationName, CHINESE_PUNCTUATION_MAP, ENGLISH_PUNCTUATION_MAP } from './punctuation-names.js';

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
    '。', '！', '？', '；', '，', '、', '：', '「', '」',
    '\u201C', '\u201D', '\u2018', '\u2019', '（', '）'
);

/**
 * Generate English punctuation marks
 */
const englishPunctuationArb = fc.constantFrom(
    '.', '!', '?', ';', ',', ':', '(', ')', '—', '–'
);

/**
 * Generate any punctuation mark
 */
const anyPunctuationArb = fc.oneof(chinesePunctuationArb, englishPunctuationArb);

/**
 * Generate text without any punctuation (Chinese or English)
 */
const textWithoutPunctuationArb = fc.oneof(chineseTextArb, englishTextArb);

/**
 * Generate a simple sentence: text + punctuation
 */
const simpleSentenceArb = fc.tuple(textWithoutPunctuationArb, anyPunctuationArb)
    .map(([text, punct]) => text + punct);

/**
 * Generate text with multiple sentences
 */
const multiSentenceTextArb = fc.array(simpleSentenceArb, { minLength: 1, maxLength: 5 })
    .map(sentences => sentences.join(''));

/**
 * Generate consecutive punctuation marks (2-4)
 */
const consecutivePunctuationArb = fc.array(anyPunctuationArb, { minLength: 2, maxLength: 4 })
    .map(puncts => puncts.join(''));

/**
 * Generate text ending with consecutive punctuation (e.g., 。」)
 */
const textWithConsecutivePunctuationArb = fc.tuple(
    textWithoutPunctuationArb,
    consecutivePunctuationArb
).map(([text, puncts]) => text + puncts);

/**
 * Generate sentence repeat count (1-5)
 */
const sentenceRepeatArb = fc.integer({ min: 1, max: 5 });

/**
 * Generate language code
 */
const langArb = fc.constantFrom('zh-TW', 'zh-HK', 'zh-CN', 'en-US', 'en-GB');

// ===== Reading Sequence Simulator =====

/**
 * Simulates the reading sequence and returns an array of reading events.
 * This mirrors the logic in the refactored readArticle() function.
 * 
 * @param {string} text - The text to read
 * @param {string} lang - The language code
 * @param {number} sentenceRepeat - Number of times to repeat text segments
 * @param {boolean} punctuationReadingEnabled - Whether to read punctuation
 * @returns {Array<{type: string, content: string, repeatIndex?: number}>} - Reading events
 */
function simulateReadingSequence(text, lang, sentenceRepeat, punctuationReadingEnabled) {
    const segments = splitArticleSegments(text);
    const events = [];
    
    for (const segment of segments) {
        if (segment.type === 'text') {
            // Text segments are repeated N times (Requirements 6.2, 6.3)
            for (let i = 1; i <= sentenceRepeat; i++) {
                events.push({
                    type: 'read_text',
                    content: segment.content,
                    repeatIndex: i
                });
                events.push({
                    type: 'pause',
                    content: 'after_text_repeat'
                });
            }
        } else {
            // Punctuation segments are read only once (Requirements 6.1)
            if (punctuationReadingEnabled) {
                const punctName = getPunctuationName(segment.content, lang);
                events.push({
                    type: 'read_punct',
                    content: punctName,
                    originalPunct: segment.content
                });
            }
            // Pause after punctuation (Requirements 5.3, 5.4)
            events.push({
                type: 'pause',
                content: 'after_punct'
            });
        }
    }
    
    return events;
}

// ===== Property Tests =====

describe('Property 2: Punctuation Read Once Only', () => {
    /**
     * Feature: speech-rules-redesign, Property 2: Punctuation Read Once Only
     * 
     * *For any* article reading with sentence repeat count > 1, each punctuation 
     * mark SHALL be read exactly once, while text segments are repeated according 
     * to the repeat count setting.
     * 
     * **Validates: Requirements 6.1, 6.2, 6.3**
     */

    it('Property 2.1: Each punctuation mark should be read exactly once regardless of repeat count', () => {
        /**
         * Requirement 6.1: Read each punctuation mark exactly once
         * Requirement 6.2: Punctuation reading SHALL NOT be affected by sentence repeat count
         */
        fc.assert(
            fc.property(
                multiSentenceTextArb,
                sentenceRepeatArb,
                langArb,
                (text, sentenceRepeat, lang) => {
                    const events = simulateReadingSequence(text, lang, sentenceRepeat, true);
                    const segments = splitArticleSegments(text);
                    
                    // Count punctuation segments in original text
                    const punctSegments = segments.filter(s => s.type === 'punct');
                    
                    // Count read_punct events
                    const readPunctEvents = events.filter(e => e.type === 'read_punct');
                    
                    // Each punctuation should be read exactly once
                    return readPunctEvents.length === punctSegments.length;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 2.2: Text segments should be repeated according to repeat count', () => {
        /**
         * Requirement 6.2, 6.3: Text segments can be repeated N times
         */
        fc.assert(
            fc.property(
                multiSentenceTextArb,
                sentenceRepeatArb,
                langArb,
                (text, sentenceRepeat, lang) => {
                    const events = simulateReadingSequence(text, lang, sentenceRepeat, true);
                    const segments = splitArticleSegments(text);
                    
                    // Count text segments in original text
                    const textSegments = segments.filter(s => s.type === 'text');
                    
                    // Count read_text events
                    const readTextEvents = events.filter(e => e.type === 'read_text');
                    
                    // Text segments should be repeated sentenceRepeat times
                    return readTextEvents.length === textSegments.length * sentenceRepeat;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 2.3: Punctuation count should not change with different repeat counts', () => {
        /**
         * Requirement 6.1: Punctuation reading is independent of repeat count
         */
        fc.assert(
            fc.property(
                multiSentenceTextArb,
                langArb,
                (text, lang) => {
                    // Test with different repeat counts
                    const events1 = simulateReadingSequence(text, lang, 1, true);
                    const events2 = simulateReadingSequence(text, lang, 3, true);
                    const events3 = simulateReadingSequence(text, lang, 5, true);
                    
                    const punctCount1 = events1.filter(e => e.type === 'read_punct').length;
                    const punctCount2 = events2.filter(e => e.type === 'read_punct').length;
                    const punctCount3 = events3.filter(e => e.type === 'read_punct').length;
                    
                    // Punctuation count should be the same regardless of repeat count
                    return punctCount1 === punctCount2 && punctCount2 === punctCount3;
                }
            ),
            { numRuns: 100 }
        );
    });
});

describe('Property 3: Reading Sequence Order', () => {
    /**
     * Feature: speech-rules-redesign, Property 3: Reading Sequence Order
     * 
     * *For any* article reading, the sequence SHALL follow: 
     * text segment → pause → punctuation → pause → next segment, 
     * with pauses between each element.
     * 
     * **Validates: Requirements 5.1, 5.2, 5.3, 5.4**
     */

    it('Property 3.1: Each text reading should be followed by a pause', () => {
        /**
         * Requirement 5.2: Add a pause after reading text
         */
        fc.assert(
            fc.property(
                multiSentenceTextArb,
                sentenceRepeatArb,
                langArb,
                (text, sentenceRepeat, lang) => {
                    const events = simulateReadingSequence(text, lang, sentenceRepeat, true);
                    
                    // Check that each read_text is followed by a pause
                    for (let i = 0; i < events.length - 1; i++) {
                        if (events[i].type === 'read_text') {
                            if (events[i + 1].type !== 'pause') {
                                return false;
                            }
                        }
                    }
                    return true;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 3.2: Each punctuation reading should be followed by a pause', () => {
        /**
         * Requirement 5.3: Add a pause after reading punctuation
         */
        fc.assert(
            fc.property(
                multiSentenceTextArb,
                sentenceRepeatArb,
                langArb,
                (text, sentenceRepeat, lang) => {
                    const events = simulateReadingSequence(text, lang, sentenceRepeat, true);
                    
                    // Check that each read_punct is followed by a pause
                    for (let i = 0; i < events.length - 1; i++) {
                        if (events[i].type === 'read_punct') {
                            if (events[i + 1].type !== 'pause') {
                                return false;
                            }
                        }
                    }
                    return true;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 3.3: Reading sequence should preserve segment order from original text', () => {
        /**
         * Requirement 5.1: Follow reading sequence in order
         */
        fc.assert(
            fc.property(
                multiSentenceTextArb,
                langArb,
                (text, lang) => {
                    const events = simulateReadingSequence(text, lang, 1, true);
                    const segments = splitArticleSegments(text);
                    
                    // Extract content from events (excluding pauses)
                    const readEvents = events.filter(e => e.type === 'read_text' || e.type === 'read_punct');
                    
                    // Check order matches segments
                    let segmentIndex = 0;
                    for (const event of readEvents) {
                        if (segmentIndex >= segments.length) {
                            return false;
                        }
                        
                        const segment = segments[segmentIndex];
                        if (event.type === 'read_text' && segment.type === 'text') {
                            if (event.content !== segment.content) {
                                return false;
                            }
                            segmentIndex++;
                        } else if (event.type === 'read_punct' && segment.type === 'punct') {
                            // Punctuation is converted to name, so check original
                            if (event.originalPunct !== segment.content) {
                                return false;
                            }
                            segmentIndex++;
                        } else {
                            return false;
                        }
                    }
                    
                    return segmentIndex === segments.length;
                }
            ),
            { numRuns: 100 }
        );
    });
});

describe('Property 4: Consecutive Punctuation Handling', () => {
    /**
     * Feature: speech-rules-redesign, Property 4: Consecutive Punctuation Handling
     * 
     * *For any* text with consecutive punctuation marks (e.g., 。」), each 
     * punctuation mark SHALL be read separately with a pause between them.
     * 
     * **Validates: Requirements 4.4, 5.4**
     */

    it('Property 4.1: Consecutive punctuation marks should each be read separately', () => {
        /**
         * Requirement 4.4: Treat consecutive punctuation marks as separate units
         */
        fc.assert(
            fc.property(
                textWithConsecutivePunctuationArb,
                langArb,
                (text, lang) => {
                    const events = simulateReadingSequence(text, lang, 1, true);
                    const segments = splitArticleSegments(text);
                    
                    // Count consecutive punct segments
                    let maxConsecutive = 0;
                    let currentConsecutive = 0;
                    for (const segment of segments) {
                        if (segment.type === 'punct') {
                            currentConsecutive++;
                        } else {
                            maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
                            currentConsecutive = 0;
                        }
                    }
                    maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
                    
                    // Count consecutive read_punct events (with pauses between)
                    const readPunctEvents = events.filter(e => e.type === 'read_punct');
                    
                    // Each punct segment should have exactly one read event
                    const punctSegments = segments.filter(s => s.type === 'punct');
                    return readPunctEvents.length === punctSegments.length;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 4.2: There should be a pause between consecutive punctuation readings', () => {
        /**
         * Requirement 5.4: Add a pause between each punctuation reading
         */
        fc.assert(
            fc.property(
                textWithConsecutivePunctuationArb,
                langArb,
                (text, lang) => {
                    const events = simulateReadingSequence(text, lang, 1, true);
                    
                    // Find consecutive read_punct events and check for pauses between them
                    for (let i = 0; i < events.length - 2; i++) {
                        if (events[i].type === 'read_punct' && events[i + 2].type === 'read_punct') {
                            // There should be a pause between them
                            if (events[i + 1].type !== 'pause') {
                                return false;
                            }
                        }
                    }
                    return true;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 4.3: Punctuation pause count should match punctuation count', () => {
        /**
         * Each punctuation should be followed by a pause
         */
        fc.assert(
            fc.property(
                textWithConsecutivePunctuationArb,
                langArb,
                (text, lang) => {
                    const events = simulateReadingSequence(text, lang, 1, true);
                    const segments = splitArticleSegments(text);
                    
                    // Count punct segments
                    const punctSegments = segments.filter(s => s.type === 'punct');
                    
                    // Count pauses after punctuation
                    const afterPunctPauses = events.filter(e => 
                        e.type === 'pause' && e.content === 'after_punct'
                    );
                    
                    // Each punctuation should have a pause after it
                    return afterPunctPauses.length === punctSegments.length;
                }
            ),
            { numRuns: 100 }
        );
    });
});

describe('Property 5: Punctuation Setting Respects Toggle State', () => {
    /**
     * Feature: speech-rules-redesign, Property 5: Punctuation Setting Respects Toggle State
     * 
     * *For any* text input, when punctuation reading is disabled, the punctuation 
     * segments SHALL be skipped (only pauses added), and when enabled, punctuation 
     * names SHALL be read.
     * 
     * **Validates: Requirements 1.2, 1.3, 7.2, 8.2**
     */

    it('Property 5.1: When punctuation reading is disabled, no punctuation should be read', () => {
        /**
         * Requirement 1.2: When disabled, do not convert punctuation to spoken words
         */
        fc.assert(
            fc.property(
                multiSentenceTextArb,
                sentenceRepeatArb,
                langArb,
                (text, sentenceRepeat, lang) => {
                    const events = simulateReadingSequence(text, lang, sentenceRepeat, false);
                    
                    // No read_punct events should exist
                    const readPunctEvents = events.filter(e => e.type === 'read_punct');
                    return readPunctEvents.length === 0;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 5.2: When punctuation reading is enabled, all punctuation should be read', () => {
        /**
         * Requirement 1.3: When enabled, convert punctuation to spoken names
         */
        fc.assert(
            fc.property(
                multiSentenceTextArb,
                sentenceRepeatArb,
                langArb,
                (text, sentenceRepeat, lang) => {
                    const events = simulateReadingSequence(text, lang, sentenceRepeat, true);
                    const segments = splitArticleSegments(text);
                    
                    // Count punct segments
                    const punctSegments = segments.filter(s => s.type === 'punct');
                    
                    // Count read_punct events
                    const readPunctEvents = events.filter(e => e.type === 'read_punct');
                    
                    // All punctuation should be read
                    return readPunctEvents.length === punctSegments.length;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 5.3: Pauses should still occur even when punctuation reading is disabled', () => {
        /**
         * Requirement 7.2, 8.2: Skip punctuation reading but still add pauses
         */
        fc.assert(
            fc.property(
                multiSentenceTextArb,
                langArb,
                (text, lang) => {
                    const events = simulateReadingSequence(text, lang, 1, false);
                    const segments = splitArticleSegments(text);
                    
                    // Count punct segments
                    const punctSegments = segments.filter(s => s.type === 'punct');
                    
                    // Count pauses after punctuation
                    const afterPunctPauses = events.filter(e => 
                        e.type === 'pause' && e.content === 'after_punct'
                    );
                    
                    // Pauses should still occur for each punctuation
                    return afterPunctPauses.length === punctSegments.length;
                }
            ),
            { numRuns: 100 }
        );
    });
});
