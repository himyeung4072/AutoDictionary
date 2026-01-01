/**
 * Property-Based Tests for Full Read Ignores Repeat Settings
 * 
 * Feature: auto-complete-full-read
 * Property 3: Full Read Ignores Repeat Settings
 * 
 * These tests validate that full read mode always reads each item exactly once,
 * regardless of the repeat count or sentence repeat settings.
 * 
 * Each test runs minimum 100 iterations as per testing strategy.
 * 
 * **Validates: Requirements 3.3**
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
    simulateWordFullRead,
    simulateArticleFullRead,
    calculateFullReadTotalCount,
    compareReadBehaviors,
    MIN_REPEAT_COUNT,
    MAX_REPEAT_COUNT,
    MIN_SENTENCE_REPEAT,
    MAX_SENTENCE_REPEAT
} from './full-read-repeat.js';

// ===== Custom Arbitraries =====

/**
 * Generate valid repeat count values (1-10)
 */
const repeatCountArb = fc.integer({ min: MIN_REPEAT_COUNT, max: MAX_REPEAT_COUNT });

/**
 * Generate valid sentence repeat values (1-10)
 */
const sentenceRepeatArb = fc.integer({ min: MIN_SENTENCE_REPEAT, max: MAX_SENTENCE_REPEAT });

/**
 * Generate non-empty word arrays
 */
const wordsArb = fc.array(
    fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
    { minLength: 1, maxLength: 50 }
);

/**
 * Generate non-empty segment arrays
 */
const segmentsArb = fc.array(
    fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
    { minLength: 1, maxLength: 30 }
);

/**
 * Generate positive item counts
 */
const itemCountArb = fc.integer({ min: 1, max: 100 });

// ===== Property Tests =====

describe('Property 3: Full Read Ignores Repeat Settings', () => {
    /**
     * Feature: auto-complete-full-read, Property 3: Full Read Ignores Repeat Settings
     * 
     * *For any* repeat count setting (1-10), when performing full read, 
     * each item SHALL be read exactly once regardless of the repeat count value.
     * 
     * **Validates: Requirements 3.3**
     */

    it('Property 3.1: Word mode full read should read each word exactly once regardless of repeat count', () => {
        /**
         * Requirement 3.3: Full read SHALL ignore the Repeat_Count setting
         */
        fc.assert(
            fc.property(
                wordsArb,
                repeatCountArb,
                (words, repeatCount) => {
                    const readCounts = simulateWordFullRead(words, repeatCount);
                    
                    // Every word should be read exactly once
                    return readCounts.every(count => count === 1);
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 3.2: Article mode full read should read each segment exactly once regardless of sentence repeat', () => {
        /**
         * Requirement 3.3: Full read SHALL ignore the Repeat_Count setting
         */
        fc.assert(
            fc.property(
                segmentsArb,
                sentenceRepeatArb,
                (segments, sentenceRepeat) => {
                    const readCounts = simulateArticleFullRead(segments, sentenceRepeat);
                    
                    // Every segment should be read exactly once
                    return readCounts.every(count => count === 1);
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 3.3: Total read count should equal item count regardless of repeat setting', () => {
        /**
         * Requirement 3.3: Each item read exactly once means total = item count
         */
        fc.assert(
            fc.property(
                itemCountArb,
                repeatCountArb,
                (itemCount, repeatCount) => {
                    const totalReads = calculateFullReadTotalCount(itemCount, repeatCount);
                    
                    // Total reads should equal item count (not itemCount * repeatCount)
                    return totalReads === itemCount;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 3.4: Full read total should differ from normal read when repeat > 1', () => {
        /**
         * Metamorphic property: Full read behavior differs from normal read
         * when repeat count is greater than 1
         */
        fc.assert(
            fc.property(
                itemCountArb,
                fc.integer({ min: 2, max: MAX_REPEAT_COUNT }), // repeat > 1
                (itemCount, repeatCount) => {
                    const { normalTotal, fullReadTotal } = compareReadBehaviors(itemCount, repeatCount);
                    
                    // Full read should have fewer total reads than normal read
                    return fullReadTotal < normalTotal && fullReadTotal === itemCount;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 3.5: Full read total should equal normal read when repeat = 1', () => {
        /**
         * Edge case: When repeat count is 1, both modes should have same total
         */
        fc.assert(
            fc.property(
                itemCountArb,
                (itemCount) => {
                    const { normalTotal, fullReadTotal } = compareReadBehaviors(itemCount, 1);
                    
                    // When repeat = 1, both should be equal
                    return fullReadTotal === normalTotal && fullReadTotal === itemCount;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 3.6: Read count array length should match input array length', () => {
        /**
         * Invariant: Output array length equals input array length
         */
        fc.assert(
            fc.property(
                wordsArb,
                repeatCountArb,
                (words, repeatCount) => {
                    const readCounts = simulateWordFullRead(words, repeatCount);
                    
                    return readCounts.length === words.length;
                }
            ),
            { numRuns: 100 }
        );
    });
});
