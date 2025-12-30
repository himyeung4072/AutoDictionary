/**
 * Property-Based Tests for splitArticleSegments function
 * 
 * Feature: speech-rules-redesign
 * Property 1: Article Splitting Before Punctuation
 * 
 * These tests validate correctness properties using fast-check
 * as specified in the design document.
 * 
 * Each test runs minimum 100 iterations as per testing strategy.
 * 
 * **Validates: Requirements 4.1, 4.2, 4.3, 4.4**
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { splitArticleSegments, PUNCTUATION_PATTERN } from './split-article-segments.js';

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

// ===== Property Tests =====

describe('Property 1: Article Splitting Before Punctuation', () => {
    /**
     * Feature: speech-rules-redesign, Property 1: Article Splitting Before Punctuation
     * 
     * *For any* text in Article Mode, the text SHALL be split into segments where 
     * each punctuation mark is a separate segment, and text segments contain no 
     * punctuation marks.
     * 
     * **Validates: Requirements 4.1, 4.2, 4.3, 4.4**
     */

    it('Property 1.1: Each punctuation mark should be a separate segment', () => {
        /**
         * Requirement 4.3: Treat each punctuation mark as a separate speech unit
         */
        fc.assert(
            fc.property(
                multiSentenceTextArb,
                (text) => {
                    const segments = splitArticleSegments(text);
                    
                    // All punctuation segments should contain exactly one character
                    const punctSegments = segments.filter(s => s.type === 'punct');
                    return punctSegments.every(s => s.content.length === 1);
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 1.2: Text segments should contain no punctuation marks', () => {
        /**
         * Requirement 4.2: Treat each text segment (before punctuation) as a sentence unit
         */
        fc.assert(
            fc.property(
                multiSentenceTextArb,
                (text) => {
                    const segments = splitArticleSegments(text);
                    
                    // All text segments should not contain any punctuation
                    const textSegments = segments.filter(s => s.type === 'text');
                    return textSegments.every(s => {
                        // Check that no character in the text segment is a punctuation
                        for (const char of s.content) {
                            if (PUNCTUATION_PATTERN.test(char)) {
                                return false;
                            }
                        }
                        return true;
                    });
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 1.3: Concatenating all segments should reconstruct the original text', () => {
        /**
         * Round-trip property: splitting and joining should preserve the original text
         */
        fc.assert(
            fc.property(
                multiSentenceTextArb,
                (text) => {
                    const segments = splitArticleSegments(text);
                    const reconstructed = segments.map(s => s.content).join('');
                    return reconstructed === text;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 1.4: Consecutive punctuation marks should each be separate segments', () => {
        /**
         * Requirement 4.4: Treat consecutive punctuation marks as separate units
         */
        fc.assert(
            fc.property(
                textWithConsecutivePunctuationArb,
                (text) => {
                    const segments = splitArticleSegments(text);
                    
                    // Find consecutive punct segments
                    let consecutiveCount = 0;
                    let maxConsecutive = 0;
                    
                    for (const segment of segments) {
                        if (segment.type === 'punct') {
                            consecutiveCount++;
                            // Each punct segment should be exactly 1 character
                            if (segment.content.length !== 1) {
                                return false;
                            }
                        } else {
                            maxConsecutive = Math.max(maxConsecutive, consecutiveCount);
                            consecutiveCount = 0;
                        }
                    }
                    maxConsecutive = Math.max(maxConsecutive, consecutiveCount);
                    
                    // Should have at least 2 consecutive punct segments
                    return maxConsecutive >= 2;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 1.5: Punctuation segments should only contain punctuation characters', () => {
        /**
         * Requirement 4.3: Each punctuation mark is a separate speech unit
         */
        fc.assert(
            fc.property(
                multiSentenceTextArb,
                (text) => {
                    const segments = splitArticleSegments(text);
                    
                    // All punct segments should contain only punctuation
                    const punctSegments = segments.filter(s => s.type === 'punct');
                    return punctSegments.every(s => PUNCTUATION_PATTERN.test(s.content));
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 1.6: Number of punctuation segments equals number of punctuation chars in input', () => {
        /**
         * Invariant: The count of punctuation segments should match the count of 
         * punctuation characters in the original text
         */
        fc.assert(
            fc.property(
                multiSentenceTextArb,
                (text) => {
                    const segments = splitArticleSegments(text);
                    
                    // Count punctuation in original text
                    let punctCountInText = 0;
                    for (const char of text) {
                        if (PUNCTUATION_PATTERN.test(char)) {
                            punctCountInText++;
                        }
                    }
                    
                    // Count punct segments
                    const punctSegmentCount = segments.filter(s => s.type === 'punct').length;
                    
                    return punctCountInText === punctSegmentCount;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 1.7: Text without punctuation should result in single text segment', () => {
        /**
         * Edge case: Text with no punctuation should be a single text segment
         */
        fc.assert(
            fc.property(
                textWithoutPunctuationArb,
                (text) => {
                    const segments = splitArticleSegments(text);
                    
                    // Should have exactly one segment of type 'text'
                    return segments.length === 1 && 
                           segments[0].type === 'text' && 
                           segments[0].content === text;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 1.8: Segment order should preserve original text order', () => {
        /**
         * Requirement 4.1: Split text BEFORE each punctuation mark
         * The order of segments should match the order of characters in the original text
         */
        fc.assert(
            fc.property(
                multiSentenceTextArb,
                (text) => {
                    const segments = splitArticleSegments(text);
                    
                    // Build expected order by iterating through original text
                    let currentIndex = 0;
                    for (const segment of segments) {
                        const expectedContent = text.substring(currentIndex, currentIndex + segment.content.length);
                        if (segment.content !== expectedContent) {
                            return false;
                        }
                        currentIndex += segment.content.length;
                    }
                    
                    return currentIndex === text.length;
                }
            ),
            { numRuns: 100 }
        );
    });
});
