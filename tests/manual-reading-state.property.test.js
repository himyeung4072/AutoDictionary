/**
 * Property-Based Tests for ManualReadingState
 * 
 * Feature: manual-reading-mode
 * Property 3: Index Navigation Bounds
 * 
 * These tests validate correctness properties using fast-check
 * as specified in the design document.
 * 
 * Each test runs minimum 100 iterations as per testing strategy.
 * 
 * **Validates: Requirements 4.2, 5.2, 5.3**
 */

import { describe, it, expect, beforeEach } from 'vitest';
import fc from 'fast-check';
import { createManualReadingState } from './manual-reading-state.js';

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
 * Generate a list of words (for word mode)
 * Each word is on a separate line
 */
const wordListArb = fc.array(chineseTextArb, { minLength: 1, maxLength: 10 })
    .map(words => words.join('\n'));

/**
 * Generate Chinese punctuation marks
 */
const chinesePunctuationArb = fc.constantFrom(
    '。', '！', '？', '；', '，', '、', '：', '「', '」'
);

/**
 * Generate a simple sentence: text + punctuation
 */
const simpleSentenceArb = fc.tuple(chineseTextArb, chinesePunctuationArb)
    .map(([text, punct]) => text + punct);

/**
 * Generate article text with multiple sentences
 */
const articleTextArb = fc.array(simpleSentenceArb, { minLength: 1, maxLength: 5 })
    .map(sentences => sentences.join(''));

/**
 * Generate a sequence of navigation operations
 * 'next' = moveNext(), 'prev' = movePrevious()
 */
const navigationSequenceArb = fc.array(
    fc.constantFrom('next', 'prev'),
    { minLength: 1, maxLength: 50 }
);

/**
 * Generate reading mode
 */
const readingModeArb = fc.constantFrom('word', 'article');

// ===== Property Tests =====

describe('Property 3: Index Navigation Bounds', () => {
    /**
     * Feature: manual-reading-mode, Property 3: Index Navigation Bounds
     * 
     * *For any* sequence of next/previous operations, the currentIndex SHALL 
     * always remain within bounds [0, totalItems - 1] after hasStarted is true.
     * 
     * **Validates: Requirements 4.2, 5.2, 5.3**
     */

    it('Property 3.1: currentIndex stays within bounds after any navigation sequence (word mode)', () => {
        /**
         * Requirements 4.2, 5.2, 5.3: Navigation should keep index within valid bounds
         */
        fc.assert(
            fc.property(
                wordListArb,
                navigationSequenceArb,
                (text, operations) => {
                    const state = createManualReadingState();
                    state.initItems(text, 'word');
                    
                    // Simulate starting reading
                    state.hasStarted = true;
                    state.currentIndex = 0;
                    
                    // Apply all navigation operations
                    for (const op of operations) {
                        if (op === 'next') {
                            state.moveNext();
                        } else {
                            state.movePrevious();
                        }
                    }
                    
                    // Index should always be within bounds
                    return state.currentIndex >= 0 && 
                           state.currentIndex < state.totalItems;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 3.2: currentIndex stays within bounds after any navigation sequence (article mode)', () => {
        /**
         * Requirements 4.2, 5.2, 5.3: Navigation should keep index within valid bounds
         */
        fc.assert(
            fc.property(
                articleTextArb,
                navigationSequenceArb,
                (text, operations) => {
                    const state = createManualReadingState();
                    state.initItems(text, 'article');
                    
                    // Skip if no items (edge case)
                    if (state.totalItems === 0) return true;
                    
                    // Simulate starting reading
                    state.hasStarted = true;
                    state.currentIndex = 0;
                    
                    // Apply all navigation operations
                    for (const op of operations) {
                        if (op === 'next') {
                            state.moveNext();
                        } else {
                            state.movePrevious();
                        }
                    }
                    
                    // Index should always be within bounds
                    return state.currentIndex >= 0 && 
                           state.currentIndex < state.totalItems;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 3.3: moveNext returns false and does not change index when at last item', () => {
        /**
         * Requirement 4.2: When Reading_Index reaches the last item, navigation should stop
         */
        fc.assert(
            fc.property(
                wordListArb,
                fc.nat({ max: 100 }),
                (text, extraNextCalls) => {
                    const state = createManualReadingState();
                    state.initItems(text, 'word');
                    state.hasStarted = true;
                    state.currentIndex = 0;
                    
                    // Move to the last item
                    while (state.moveNext()) {
                        // Keep moving until we can't
                    }
                    
                    const lastIndex = state.currentIndex;
                    
                    // Try to move next multiple times
                    for (let i = 0; i < extraNextCalls; i++) {
                        const result = state.moveNext();
                        // Should return false when at last
                        if (result !== false) return false;
                        // Index should not change
                        if (state.currentIndex !== lastIndex) return false;
                    }
                    
                    return true;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 3.4: movePrevious returns false and does not change index when at first item', () => {
        /**
         * Requirements 5.2, 5.3: When at first item, movePrevious should return false
         */
        fc.assert(
            fc.property(
                wordListArb,
                fc.nat({ max: 100 }),
                (text, extraPrevCalls) => {
                    const state = createManualReadingState();
                    state.initItems(text, 'word');
                    state.hasStarted = true;
                    state.currentIndex = 0;
                    
                    // Try to move previous multiple times from first item
                    for (let i = 0; i < extraPrevCalls; i++) {
                        const result = state.movePrevious();
                        // Should return false when at first
                        if (result !== false) return false;
                        // Index should stay at 0
                        if (state.currentIndex !== 0) return false;
                    }
                    
                    return true;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 3.5: isAtFirst and isAtLast are consistent with currentIndex', () => {
        /**
         * Invariant: isAtFirst/isAtLast should match the actual index position
         */
        fc.assert(
            fc.property(
                wordListArb,
                navigationSequenceArb,
                (text, operations) => {
                    const state = createManualReadingState();
                    state.initItems(text, 'word');
                    state.hasStarted = true;
                    state.currentIndex = 0;
                    
                    // Apply all navigation operations
                    for (const op of operations) {
                        if (op === 'next') {
                            state.moveNext();
                        } else {
                            state.movePrevious();
                        }
                        
                        // Check consistency after each operation
                        const atFirst = state.isAtFirst();
                        const atLast = state.isAtLast();
                        
                        // isAtFirst should be true only when index <= 0
                        if (atFirst !== (state.currentIndex <= 0)) return false;
                        
                        // isAtLast should be true only when index >= items.length - 1
                        if (atLast !== (state.currentIndex >= state.items.length - 1)) return false;
                    }
                    
                    return true;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 3.6: getCurrentItem returns correct item for current index', () => {
        /**
         * Invariant: getCurrentItem should return the item at currentIndex
         */
        fc.assert(
            fc.property(
                wordListArb,
                navigationSequenceArb,
                (text, operations) => {
                    const state = createManualReadingState();
                    state.initItems(text, 'word');
                    state.hasStarted = true;
                    state.currentIndex = 0;
                    
                    // Apply all navigation operations
                    for (const op of operations) {
                        if (op === 'next') {
                            state.moveNext();
                        } else {
                            state.movePrevious();
                        }
                        
                        // Check getCurrentItem returns correct value
                        const currentItem = state.getCurrentItem();
                        const expectedItem = state.items[state.currentIndex];
                        
                        if (currentItem !== expectedItem) return false;
                    }
                    
                    return true;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 3.7: reset clears all state correctly', () => {
        /**
         * Invariant: reset should restore all state to initial values
         */
        fc.assert(
            fc.property(
                wordListArb,
                navigationSequenceArb,
                (text, operations) => {
                    const state = createManualReadingState();
                    state.initItems(text, 'word');
                    state.hasStarted = true;
                    state.isReading = true;
                    state.currentIndex = 0;
                    
                    // Apply some navigation operations
                    for (const op of operations) {
                        if (op === 'next') {
                            state.moveNext();
                        } else {
                            state.movePrevious();
                        }
                    }
                    
                    // Reset the state
                    state.reset();
                    
                    // Verify all state is reset
                    return state.currentIndex === -1 &&
                           state.hasStarted === false &&
                           state.isReading === false &&
                           state.items.length === 0 &&
                           state.totalItems === 0;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 3.8: totalItems equals items.length after initItems', () => {
        /**
         * Invariant: totalItems should always equal items.length
         */
        fc.assert(
            fc.property(
                fc.oneof(wordListArb, articleTextArb),
                readingModeArb,
                (text, mode) => {
                    const state = createManualReadingState();
                    state.initItems(text, mode);
                    
                    return state.totalItems === state.items.length;
                }
            ),
            { numRuns: 100 }
        );
    });
});
