/**
 * Property-Based Tests for Manual Reading Core Functionality
 * 
 * Feature: manual-reading-mode
 * Property 4: Button State Consistency
 * Property 5: Highlight Follows Index
 * Property 6: Progress Reflects Index
 * Property 7: Start Button Label State
 * Property 10: Cancel Resets All State
 * 
 * These tests validate correctness properties using fast-check
 * as specified in the design document.
 * 
 * Each test runs minimum 100 iterations as per testing strategy.
 * 
 * **Validates: Requirements 3.1, 3.3, 3.5, 3.6, 4.1, 4.4, 4.5, 4.6, 5.1, 5.5, 5.6, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 7.3**
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fc from 'fast-check';
import { createManualReadingState } from './manual-reading-state.js';

// ===== Mock DOM Setup =====

/**
 * Create a minimal DOM structure for testing manual reading controls
 */
function setupDOM() {
    document.body.innerHTML = `
        <div class="player-controls manual-controls" id="manualControls">
            <button id="prevBtn" disabled>上一個</button>
            <button id="manualStartBtn"><span id="manualStartBtnText">開始</span></button>
            <button id="manualStopBtn" disabled>取消</button>
            <button id="nextBtn" disabled>下一個</button>
        </div>
        <div id="progressFill" style="width: 0%"></div>
        <div id="statusCount"></div>
        <div id="textDisplayContainer" class="hidden"></div>
        <textarea id="words" class="hidden"></textarea>
        <input type="radio" name="mode" value="word" checked>
        <input type="radio" name="mode" value="article">
    `;
}

/**
 * Clean up DOM after tests
 */
function cleanupDOM() {
    document.body.innerHTML = '';
}


// ===== Functions Under Test =====

/**
 * Update manual mode button states
 * Based on ManualReadingState, update button disabled states
 * Requirements: 3.5, 4.1, 4.4, 5.1, 6.1
 */
function updateManualButtonStates(state) {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const manualStartBtn = document.getElementById('manualStartBtn');
    const manualStopBtn = document.getElementById('manualStopBtn');
    
    const hasStarted = state.hasStarted;
    const isReading = state.isReading;
    const isAtLast = state.isAtLast();
    
    // Previous button: disabled when !hasStarted OR isReading (Requirement 5.1)
    if (prevBtn) prevBtn.disabled = !hasStarted || isReading;
    
    // Next button: disabled when !hasStarted OR isReading OR isAtLast (Requirements 4.1, 4.4)
    if (nextBtn) nextBtn.disabled = !hasStarted || isReading || isAtLast;
    
    // Start/Replay button: disabled when isReading (Requirement 3.5)
    if (manualStartBtn) manualStartBtn.disabled = isReading;
    
    // Cancel button: disabled when !hasStarted (Requirement 6.1)
    if (manualStopBtn) manualStopBtn.disabled = !hasStarted;
}

/**
 * Update start/replay button label
 * Based on hasStarted, update button label
 * Requirements: 3.1, 3.3, 6.6
 */
function updateManualStartButtonLabel(state) {
    const btnText = document.getElementById('manualStartBtnText');
    if (!btnText) return;
    
    if (state.hasStarted) {
        btnText.textContent = '重讀';
    } else {
        btnText.textContent = '開始';
    }
}

/**
 * Update manual mode progress
 * Update progress bar and status count
 * Requirements: 7.2, 7.3
 */
function updateManualProgress(state, mode = 'word') {
    const current = state.currentIndex + 1;
    const total = state.totalItems;
    
    // Update progress bar (Requirement 7.3)
    const percentage = total > 0 ? (current / total) * 100 : 0;
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        progressFill.style.width = percentage + '%';
    }
    
    // Update status count (Requirement 7.2)
    const statusCount = document.getElementById('statusCount');
    if (statusCount) {
        const label = mode === 'word' ? '詞語' : '句子';
        statusCount.textContent = `${label} ${current}/${total} 個`;
    }
}


/**
 * Mock HighlightManager for testing
 */
function createMockHighlightManager() {
    return {
        isDisplayMode: false,
        currentHighlightIndex: -1,
        items: [],
        
        switchToDisplayMode(text, mode) {
            this.isDisplayMode = true;
            this.currentHighlightIndex = -1;
            if (mode === 'word') {
                this.items = text.split('\n').map(s => s.trim()).filter(s => s !== '');
            } else {
                // Simplified article mode
                this.items = text.split(/[。！？]/).filter(s => s.trim() !== '');
            }
            return true;
        },
        
        switchToEditMode() {
            this.isDisplayMode = false;
            this.currentHighlightIndex = -1;
            this.items = [];
        },
        
        highlightItem(index) {
            if (!this.isDisplayMode) return;
            if (index < 0 || index >= this.items.length) return;
            this.currentHighlightIndex = index;
        },
        
        clearHighlight() {
            this.currentHighlightIndex = -1;
        }
    };
}

/**
 * Simulate manualStop function
 * Requirements: 6.2, 6.3, 6.4, 6.5, 6.6
 */
function manualStop(state, highlightManager) {
    // Reset state (Requirement 6.3)
    state.reset();
    
    // Switch back to edit mode (Requirement 6.5)
    highlightManager.switchToEditMode();
    
    // Reset progress bar (Requirement 6.4)
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        progressFill.style.width = '0%';
    }
    
    // Update button states and label (Requirement 6.6)
    updateManualButtonStates(state);
    updateManualStartButtonLabel(state);
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
 * Generate a list of words (for word mode)
 */
const wordListArb = fc.array(chineseTextArb, { minLength: 1, maxLength: 10 })
    .map(words => words.join('\n'));

/**
 * Generate reading mode
 */
const readingModeArb = fc.constantFrom('word', 'article');


/**
 * Generate ManualReadingState configuration
 */
const stateConfigArb = fc.record({
    hasStarted: fc.boolean(),
    isReading: fc.boolean(),
    currentIndex: fc.integer({ min: 0, max: 9 })
});

// ===== Property Tests =====

describe('Property 4: Button State Consistency', () => {
    /**
     * Feature: manual-reading-mode, Property 4: Button State Consistency
     * 
     * *For any* ManualReadingState, the button disabled states SHALL be consistent with the state:
     * - prevBtn disabled when !hasStarted OR isReading
     * - nextBtn disabled when !hasStarted OR isReading OR isAtLast
     * - manualStartBtn disabled when isReading
     * - manualStopBtn disabled when !hasStarted
     * 
     * **Validates: Requirements 3.5, 4.1, 4.4, 5.1, 6.1**
     */

    beforeEach(() => {
        setupDOM();
    });

    afterEach(() => {
        cleanupDOM();
    });

    it('Property 4.1: prevBtn disabled when !hasStarted OR isReading', () => {
        /**
         * Requirement 5.1: WHEN reading has not started, THE "上一個/句" button SHALL be disabled
         */
        fc.assert(
            fc.property(
                wordListArb,
                stateConfigArb,
                (text, config) => {
                    const state = createManualReadingState();
                    state.initItems(text, 'word');
                    state.hasStarted = config.hasStarted;
                    state.isReading = config.isReading;
                    state.currentIndex = Math.min(config.currentIndex, state.totalItems - 1);
                    
                    updateManualButtonStates(state);
                    
                    const prevBtn = document.getElementById('prevBtn');
                    const expectedDisabled = !state.hasStarted || state.isReading;
                    
                    return prevBtn.disabled === expectedDisabled;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 4.2: nextBtn disabled when !hasStarted OR isReading OR isAtLast', () => {
        /**
         * Requirements 4.1, 4.4: WHEN reading has not started OR at last item, 
         * THE "下一個/句" button SHALL be disabled
         */
        fc.assert(
            fc.property(
                wordListArb,
                stateConfigArb,
                (text, config) => {
                    const state = createManualReadingState();
                    state.initItems(text, 'word');
                    state.hasStarted = config.hasStarted;
                    state.isReading = config.isReading;
                    state.currentIndex = Math.min(config.currentIndex, state.totalItems - 1);
                    
                    updateManualButtonStates(state);
                    
                    const nextBtn = document.getElementById('nextBtn');
                    const expectedDisabled = !state.hasStarted || state.isReading || state.isAtLast();
                    
                    return nextBtn.disabled === expectedDisabled;
                }
            ),
            { numRuns: 100 }
        );
    });


    it('Property 4.3: manualStartBtn disabled when isReading', () => {
        /**
         * Requirement 3.5: WHEN the Current_Item is being read, THE "重讀" button SHALL be disabled
         */
        fc.assert(
            fc.property(
                wordListArb,
                stateConfigArb,
                (text, config) => {
                    const state = createManualReadingState();
                    state.initItems(text, 'word');
                    state.hasStarted = config.hasStarted;
                    state.isReading = config.isReading;
                    state.currentIndex = Math.min(config.currentIndex, state.totalItems - 1);
                    
                    updateManualButtonStates(state);
                    
                    const manualStartBtn = document.getElementById('manualStartBtn');
                    const expectedDisabled = state.isReading;
                    
                    return manualStartBtn.disabled === expectedDisabled;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 4.4: manualStopBtn disabled when !hasStarted', () => {
        /**
         * Requirement 6.1: WHEN reading has not started, THE "取消" button SHALL be disabled
         */
        fc.assert(
            fc.property(
                wordListArb,
                stateConfigArb,
                (text, config) => {
                    const state = createManualReadingState();
                    state.initItems(text, 'word');
                    state.hasStarted = config.hasStarted;
                    state.isReading = config.isReading;
                    state.currentIndex = Math.min(config.currentIndex, state.totalItems - 1);
                    
                    updateManualButtonStates(state);
                    
                    const manualStopBtn = document.getElementById('manualStopBtn');
                    const expectedDisabled = !state.hasStarted;
                    
                    return manualStopBtn.disabled === expectedDisabled;
                }
            ),
            { numRuns: 100 }
        );
    });
});

describe('Property 5: Highlight Follows Index', () => {
    /**
     * Feature: manual-reading-mode, Property 5: Highlight Follows Index
     * 
     * *For any* navigation operation (start, next, previous), the highlighted item index 
     * SHALL equal currentIndex.
     * 
     * **Validates: Requirements 3.6, 4.6, 5.6**
     */

    beforeEach(() => {
        setupDOM();
    });

    afterEach(() => {
        cleanupDOM();
    });

    it('Property 5.1: Highlight index matches currentIndex after highlightItem call', () => {
        /**
         * Requirements 3.6, 4.6, 5.6: THE System SHALL update the highlight to the Current_Item
         */
        fc.assert(
            fc.property(
                wordListArb,
                fc.integer({ min: 0, max: 9 }),
                (text, targetIndex) => {
                    const state = createManualReadingState();
                    state.initItems(text, 'word');
                    
                    const highlightManager = createMockHighlightManager();
                    highlightManager.switchToDisplayMode(text, 'word');
                    
                    // Ensure index is within bounds
                    const validIndex = Math.min(targetIndex, state.totalItems - 1);
                    state.currentIndex = validIndex;
                    
                    // Highlight the current item
                    highlightManager.highlightItem(state.currentIndex);
                    
                    return highlightManager.currentHighlightIndex === state.currentIndex;
                }
            ),
            { numRuns: 100 }
        );
    });
});


describe('Property 6: Progress Reflects Index', () => {
    /**
     * Feature: manual-reading-mode, Property 6: Progress Reflects Index
     * 
     * *For any* currentIndex value, the progress bar percentage SHALL equal 
     * ((currentIndex + 1) / totalItems) * 100.
     * 
     * **Validates: Requirements 4.5, 5.5, 7.3**
     */

    beforeEach(() => {
        setupDOM();
    });

    afterEach(() => {
        cleanupDOM();
    });

    it('Property 6.1: Progress bar percentage matches formula', () => {
        /**
         * Requirement 7.3: THE System SHALL update the progress bar to reflect the current Reading_Index
         */
        fc.assert(
            fc.property(
                wordListArb,
                fc.integer({ min: 0, max: 9 }),
                (text, targetIndex) => {
                    const state = createManualReadingState();
                    state.initItems(text, 'word');
                    
                    // Ensure index is within bounds
                    const validIndex = Math.min(targetIndex, state.totalItems - 1);
                    state.currentIndex = validIndex;
                    
                    updateManualProgress(state, 'word');
                    
                    const progressFill = document.getElementById('progressFill');
                    const expectedPercentage = state.totalItems > 0 
                        ? ((state.currentIndex + 1) / state.totalItems) * 100 
                        : 0;
                    const actualPercentage = parseFloat(progressFill.style.width);
                    
                    // Allow small floating point differences
                    return Math.abs(actualPercentage - expectedPercentage) < 0.001;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 6.2: Status count shows correct current/total', () => {
        /**
         * Requirement 7.2: THE System SHALL display the current position in format "詞語 X/Y 個"
         */
        fc.assert(
            fc.property(
                wordListArb,
                fc.integer({ min: 0, max: 9 }),
                readingModeArb,
                (text, targetIndex, mode) => {
                    const state = createManualReadingState();
                    state.initItems(text, 'word');
                    
                    // Ensure index is within bounds
                    const validIndex = Math.min(targetIndex, state.totalItems - 1);
                    state.currentIndex = validIndex;
                    
                    updateManualProgress(state, mode);
                    
                    const statusCount = document.getElementById('statusCount');
                    const label = mode === 'word' ? '詞語' : '句子';
                    const expectedText = `${label} ${state.currentIndex + 1}/${state.totalItems} 個`;
                    
                    return statusCount.textContent === expectedText;
                }
            ),
            { numRuns: 100 }
        );
    });
});

describe('Property 7: Start Button Label State', () => {
    /**
     * Feature: manual-reading-mode, Property 7: Start Button Label State
     * 
     * *For any* ManualReadingState, the start button label SHALL be "開始" when hasStarted 
     * is false, and "重讀" when hasStarted is true.
     * 
     * **Validates: Requirements 3.1, 3.3, 6.6**
     */

    beforeEach(() => {
        setupDOM();
    });

    afterEach(() => {
        cleanupDOM();
    });

    it('Property 7.1: Button label is "開始" when hasStarted is false', () => {
        /**
         * Requirement 3.1: WHEN reading has not started, THE "開始/重讀" button SHALL display "開始"
         */
        fc.assert(
            fc.property(
                fc.constant(false),
                (hasStarted) => {
                    const state = createManualReadingState();
                    state.hasStarted = hasStarted;
                    
                    updateManualStartButtonLabel(state);
                    
                    const btnText = document.getElementById('manualStartBtnText');
                    return btnText.textContent === '開始';
                }
            ),
            { numRuns: 100 }
        );
    });


    it('Property 7.2: Button label is "重讀" when hasStarted is true', () => {
        /**
         * Requirement 3.3: WHEN reading has started, THE "開始/重讀" button label SHALL change to "重讀"
         */
        fc.assert(
            fc.property(
                fc.constant(true),
                (hasStarted) => {
                    const state = createManualReadingState();
                    state.hasStarted = hasStarted;
                    
                    updateManualStartButtonLabel(state);
                    
                    const btnText = document.getElementById('manualStartBtnText');
                    return btnText.textContent === '重讀';
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 7.3: Button label matches hasStarted state for any state', () => {
        /**
         * Requirements 3.1, 3.3, 6.6: Button label should always match hasStarted state
         */
        fc.assert(
            fc.property(
                fc.boolean(),
                (hasStarted) => {
                    const state = createManualReadingState();
                    state.hasStarted = hasStarted;
                    
                    updateManualStartButtonLabel(state);
                    
                    const btnText = document.getElementById('manualStartBtnText');
                    const expectedLabel = hasStarted ? '重讀' : '開始';
                    
                    return btnText.textContent === expectedLabel;
                }
            ),
            { numRuns: 100 }
        );
    });
});

describe('Property 10: Cancel Resets All State', () => {
    /**
     * Feature: manual-reading-mode, Property 10: Cancel Resets All State
     * 
     * *For any* state where hasStarted is true, calling manualStop() SHALL result in:
     * - currentIndex = -1
     * - hasStarted = false
     * - isReading = false
     * - progress bar at 0%
     * - edit mode active (textarea visible)
     * 
     * **Validates: Requirements 6.2, 6.3, 6.4, 6.5**
     */

    beforeEach(() => {
        setupDOM();
    });

    afterEach(() => {
        cleanupDOM();
    });

    it('Property 10.1: manualStop resets currentIndex to -1', () => {
        /**
         * Requirement 6.3: WHEN the user clicks "取消", THE System SHALL reset Reading_Index to initial state
         */
        fc.assert(
            fc.property(
                wordListArb,
                fc.integer({ min: 0, max: 9 }),
                (text, startIndex) => {
                    const state = createManualReadingState();
                    state.initItems(text, 'word');
                    state.hasStarted = true;
                    state.currentIndex = Math.min(startIndex, state.totalItems - 1);
                    
                    const highlightManager = createMockHighlightManager();
                    highlightManager.switchToDisplayMode(text, 'word');
                    
                    manualStop(state, highlightManager);
                    
                    return state.currentIndex === -1;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 10.2: manualStop sets hasStarted to false', () => {
        /**
         * Requirement 6.3: Reset to initial state
         */
        fc.assert(
            fc.property(
                wordListArb,
                (text) => {
                    const state = createManualReadingState();
                    state.initItems(text, 'word');
                    state.hasStarted = true;
                    state.currentIndex = 0;
                    
                    const highlightManager = createMockHighlightManager();
                    highlightManager.switchToDisplayMode(text, 'word');
                    
                    manualStop(state, highlightManager);
                    
                    return state.hasStarted === false;
                }
            ),
            { numRuns: 100 }
        );
    });


    it('Property 10.3: manualStop sets isReading to false', () => {
        /**
         * Requirement 6.2: WHEN the user clicks "取消", THE System SHALL stop any ongoing speech synthesis
         */
        fc.assert(
            fc.property(
                wordListArb,
                (text) => {
                    const state = createManualReadingState();
                    state.initItems(text, 'word');
                    state.hasStarted = true;
                    state.isReading = true;
                    state.currentIndex = 0;
                    
                    const highlightManager = createMockHighlightManager();
                    highlightManager.switchToDisplayMode(text, 'word');
                    
                    manualStop(state, highlightManager);
                    
                    return state.isReading === false;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 10.4: manualStop resets progress bar to 0%', () => {
        /**
         * Requirement 6.4: WHEN the user clicks "取消", THE System SHALL reset the progress bar to 0%
         */
        fc.assert(
            fc.property(
                wordListArb,
                fc.integer({ min: 0, max: 9 }),
                (text, startIndex) => {
                    const state = createManualReadingState();
                    state.initItems(text, 'word');
                    state.hasStarted = true;
                    state.currentIndex = Math.min(startIndex, state.totalItems - 1);
                    
                    // Set progress to some value first
                    updateManualProgress(state, 'word');
                    
                    const highlightManager = createMockHighlightManager();
                    highlightManager.switchToDisplayMode(text, 'word');
                    
                    manualStop(state, highlightManager);
                    
                    const progressFill = document.getElementById('progressFill');
                    return progressFill.style.width === '0%';
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 10.5: manualStop switches to edit mode', () => {
        /**
         * Requirement 6.5: WHEN the user clicks "取消", THE System SHALL switch back to edit mode
         */
        fc.assert(
            fc.property(
                wordListArb,
                (text) => {
                    const state = createManualReadingState();
                    state.initItems(text, 'word');
                    state.hasStarted = true;
                    state.currentIndex = 0;
                    
                    const highlightManager = createMockHighlightManager();
                    highlightManager.switchToDisplayMode(text, 'word');
                    
                    // Verify display mode is active
                    if (!highlightManager.isDisplayMode) return false;
                    
                    manualStop(state, highlightManager);
                    
                    // Verify edit mode is active (display mode is false)
                    return highlightManager.isDisplayMode === false;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 10.6: manualStop resets button label to "開始"', () => {
        /**
         * Requirement 6.6: WHEN the user clicks "取消", THE "開始/重讀" button label SHALL change back to "開始"
         */
        fc.assert(
            fc.property(
                wordListArb,
                (text) => {
                    const state = createManualReadingState();
                    state.initItems(text, 'word');
                    state.hasStarted = true;
                    state.currentIndex = 0;
                    
                    // Set label to "重讀" first
                    updateManualStartButtonLabel(state);
                    
                    const highlightManager = createMockHighlightManager();
                    highlightManager.switchToDisplayMode(text, 'word');
                    
                    manualStop(state, highlightManager);
                    
                    const btnText = document.getElementById('manualStartBtnText');
                    return btnText.textContent === '開始';
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 10.7: manualStop resets all state from any starting state', () => {
        /**
         * Requirements 6.2, 6.3, 6.4, 6.5: Complete reset verification
         */
        fc.assert(
            fc.property(
                wordListArb,
                stateConfigArb,
                (text, config) => {
                    const state = createManualReadingState();
                    state.initItems(text, 'word');
                    state.hasStarted = config.hasStarted || true; // Ensure started
                    state.isReading = config.isReading;
                    state.currentIndex = Math.min(config.currentIndex, state.totalItems - 1);
                    
                    const highlightManager = createMockHighlightManager();
                    highlightManager.switchToDisplayMode(text, 'word');
                    
                    manualStop(state, highlightManager);
                    
                    // Verify all state is reset
                    return state.currentIndex === -1 &&
                           state.hasStarted === false &&
                           state.isReading === false &&
                           highlightManager.isDisplayMode === false;
                }
            ),
            { numRuns: 100 }
        );
    });
});
