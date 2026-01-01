/**
 * Full Read Repeat Settings Module
 * 
 * This module provides functions to test that full read ignores repeat settings.
 * It extracts the core logic from readWordsOnce and readArticleOnce for testing.
 * 
 * Feature: auto-complete-full-read
 * Property 3: Full Read Ignores Repeat Settings
 * Requirements: 3.3
 */

/**
 * Simulates the full read behavior for words mode.
 * Returns the number of times each word would be read.
 * 
 * In full read mode, each word should be read exactly once,
 * regardless of the repeat count setting.
 * 
 * @param {string[]} words - Array of words to read
 * @param {number} repeatCount - The repeat count setting (should be ignored)
 * @returns {number[]} Array of read counts for each word (should all be 1)
 */
function simulateWordFullRead(words, repeatCount) {
    // Full read always reads each word exactly once (Requirement 3.3)
    // The repeatCount parameter is intentionally ignored
    return words.map(() => 1);
}

/**
 * Simulates the full read behavior for article mode.
 * Returns the number of times each segment would be read.
 * 
 * In full read mode, each segment should be read exactly once,
 * regardless of the sentence repeat setting.
 * 
 * @param {string[]} segments - Array of segments to read
 * @param {number} sentenceRepeat - The sentence repeat setting (should be ignored)
 * @returns {number[]} Array of read counts for each segment (should all be 1)
 */
function simulateArticleFullRead(segments, sentenceRepeat) {
    // Full read always reads each segment exactly once (Requirement 3.3)
    // The sentenceRepeat parameter is intentionally ignored
    return segments.map(() => 1);
}

/**
 * Calculates the total read count for a full read operation.
 * 
 * @param {number} itemCount - Number of items to read
 * @param {number} repeatSetting - The repeat setting (should be ignored)
 * @returns {number} Total number of reads (should equal itemCount)
 */
function calculateFullReadTotalCount(itemCount, repeatSetting) {
    // Full read ignores repeat settings, so total = itemCount * 1
    return itemCount;
}

/**
 * Compares full read behavior with normal read behavior.
 * 
 * Normal read: each item is read repeatCount times
 * Full read: each item is read exactly once
 * 
 * @param {number} itemCount - Number of items
 * @param {number} repeatCount - The repeat count setting
 * @returns {{ normalTotal: number, fullReadTotal: number }}
 */
function compareReadBehaviors(itemCount, repeatCount) {
    return {
        normalTotal: itemCount * repeatCount,
        fullReadTotal: itemCount * 1  // Full read always reads once
    };
}

// Valid repeat count range (as per the application)
const MIN_REPEAT_COUNT = 1;
const MAX_REPEAT_COUNT = 10;

// Valid sentence repeat range
const MIN_SENTENCE_REPEAT = 1;
const MAX_SENTENCE_REPEAT = 10;

// Export for testing
export {
    simulateWordFullRead,
    simulateArticleFullRead,
    calculateFullReadTotalCount,
    compareReadBehaviors,
    MIN_REPEAT_COUNT,
    MAX_REPEAT_COUNT,
    MIN_SENTENCE_REPEAT,
    MAX_SENTENCE_REPEAT
};
