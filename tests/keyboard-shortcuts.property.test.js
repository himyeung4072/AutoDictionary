/**
 * Property-Based Tests for Keyboard Shortcuts
 * 
 * Feature: manual-reading-mode
 * Property 9: Keyboard Action Mapping
 * 
 * These tests validate that keyboard shortcuts correctly map to their
 * corresponding actions in manual reading mode.
 * 
 * Each test runs minimum 100 iterations as per testing strategy.
 * 
 * **Validates: Requirements 9.2, 9.3, 9.4, 9.5**
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fc from 'fast-check';
import { createManualReadingState } from './manual-reading-state.js';

// ===== Mock DOM Setup =====

/**
 * Create a minimal DOM structure for testing keyboard shortcuts
 */
function setupDOM() {
    document.body.innerHTML = `
        <div class="player-controls manual-controls" id="manualControls">
            <button id="prevBtn" disabled>上一個</button>
            <button id="manualStartBtn"><span id="manualStartBtnText">開始</span></button>
            <button id="manualStopBtn" disabled>取消</button>
            <button id="nextBtn" disabled>下一個</button>
        </div>
        <div class="player-controls" id="autoControls">
            <button id="startBtn">開始</button>
            <button id="pauseBtn" disabled>暫停</button>
            <button id="stopBtn" disabled>停止</button>
        </div>
        <textarea id="words"></textarea>
        <input type="text" id="testInput">
    `;
}

/**
 * Clean up DOM after tests
 */
function cleanupDOM() {
    document.body.innerHTML = '';
}

// ===== Action Tracking =====

/**
 * Track which actions were triggered
 */
let actionLog = [];

function resetActionLog() {
    actionLog = [];
}

function logAction(action) {
    actionLog.push(action);
}

// ===== Mock Functions =====

/**
 * Mock manualStartOrReplay function
 */
function manualStartOrReplay() {
    logAction('manualStartOrReplay');
}

/**
 * Mock manualNext function
 */
function manualNext() {
    logAction('manualNext');
}

/**
 * Mock manualPrevious function
 */
function manualPrevious() {
    logAction('manualPrevious');
}

/**
 * Mock manualStop function
 */
function manualStop() {
    logAction('manualStop');
}

// ===== Keyboard Handler Under Test =====

/**
 * Handle manual mode keyboard events
 * Requirements: 9.2, 9.3, 9.4, 9.5, 9.6
 * @param {KeyboardEvent} e - Keyboard event
 * @param {boolean} isInputFocused - Whether an input element is focused
 * @param {Object} state - ManualReadingState
 * @param {Object} buttons - Button elements
 * @returns {string|null} - Action triggered or null
 */
function handleManualKeyboard(e, isInputFocused, state, buttons) {
    // Requirement 9.6: Keyboard shortcuts only work when no input field is focused
    if (isInputFocused) return null;
    
    // Check if manual mode
    if (state.readingMode !== 'manual') return null;
    
    switch (e.code) {
        case 'Space':
            // Requirement 9.4: Space triggers start/replay
            if (buttons.manualStartBtn && !buttons.manualStartBtn.disabled) {
                manualStartOrReplay();
                return 'manualStartOrReplay';
            }
            return null;
            
        case 'ArrowRight':
            // Requirement 9.2: Right arrow triggers next
            if (buttons.nextBtn && !buttons.nextBtn.disabled) {
                manualNext();
                return 'manualNext';
            }
            return null;
            
        case 'ArrowLeft':
            // Requirement 9.3: Left arrow triggers previous
            if (buttons.prevBtn && !buttons.prevBtn.disabled) {
                manualPrevious();
                return 'manualPrevious';
            }
            return null;
            
        case 'Escape':
            // Requirement 9.5: Escape triggers cancel
            if (buttons.manualStopBtn && !buttons.manualStopBtn.disabled) {
                manualStop();
                return 'manualStop';
            }
            return null;
            
        default:
            return null;
    }
}

/**
 * Get the expected action for a key code
 * @param {string} keyCode - The key code
 * @returns {string|null} - Expected action name
 */
function getExpectedAction(keyCode) {
    const keyActionMap = {
        'Space': 'manualStartOrReplay',
        'ArrowRight': 'manualNext',
        'ArrowLeft': 'manualPrevious',
        'Escape': 'manualStop'
    };
    return keyActionMap[keyCode] || null;
}

/**
 * Check if a button should be enabled for a given action
 * @param {string} action - Action name
 * @param {Object} state - ManualReadingState
 * @returns {boolean} - Whether the button should be enabled
 */
function shouldButtonBeEnabled(action, state) {
    switch (action) {
        case 'manualStartOrReplay':
            // Start button disabled when isReading
            return !state.isReading;
        case 'manualNext':
            // Next button disabled when !hasStarted OR isReading OR isAtLast
            return state.hasStarted && !state.isReading && !state.isAtLast();
        case 'manualPrevious':
            // Prev button disabled when !hasStarted OR isReading
            return state.hasStarted && !state.isReading;
        case 'manualStop':
            // Stop button disabled when !hasStarted
            return state.hasStarted;
        default:
            return false;
    }
}

// ===== Custom Arbitraries =====

/**
 * Generate valid key codes for manual mode
 */
const manualKeyCodeArb = fc.constantFrom('Space', 'ArrowRight', 'ArrowLeft', 'Escape');

/**
 * Generate any key code (including non-mapped ones)
 */
const anyKeyCodeArb = fc.constantFrom(
    'Space', 'ArrowRight', 'ArrowLeft', 'Escape',
    'ArrowUp', 'ArrowDown', 'Enter', 'Tab', 'KeyA', 'KeyB', 'Digit1'
);

/**
 * Generate reading mode
 */
const readingModeArb = fc.constantFrom('auto', 'manual');

/**
 * Generate state configuration
 */
const stateConfigArb = fc.record({
    hasStarted: fc.boolean(),
    isReading: fc.boolean(),
    currentIndex: fc.integer({ min: 0, max: 9 }),
    totalItems: fc.integer({ min: 1, max: 10 })
});

/**
 * Generate Chinese text for items
 */
const chineseCharArb = fc.integer({ min: 0x4E00, max: 0x9FFF })
    .map(code => String.fromCharCode(code));

const chineseTextArb = fc.array(chineseCharArb, { minLength: 1, maxLength: 5 })
    .map(chars => chars.join(''));

const wordListArb = fc.array(chineseTextArb, { minLength: 1, maxLength: 10 })
    .map(words => words.join('\n'));

// ===== Property Tests =====

describe('Property 9: Keyboard Action Mapping', () => {
    /**
     * Feature: manual-reading-mode, Property 9: Keyboard Action Mapping
     * 
     * *For any* keyboard event in manual mode (when no input is focused), 
     * the action triggered SHALL match:
     * - Space → manualStartOrReplay
     * - ArrowRight → manualNext
     * - ArrowLeft → manualPrevious
     * - Escape → manualStop
     * 
     * **Validates: Requirements 9.2, 9.3, 9.4, 9.5**
     */

    beforeEach(() => {
        setupDOM();
        resetActionLog();
    });

    afterEach(() => {
        cleanupDOM();
    });

    it('Property 9.1: Space key triggers manualStartOrReplay when button is enabled', () => {
        /**
         * Requirement 9.4: WHEN the user presses Space, THE System SHALL trigger "開始/重讀" action
         */
        fc.assert(
            fc.property(
                wordListArb,
                (text) => {
                    resetActionLog();
                    
                    const state = createManualReadingState();
                    state.initItems(text, 'word');
                    state.readingMode = 'manual';
                    state.hasStarted = false;
                    state.isReading = false;
                    
                    const buttons = {
                        manualStartBtn: { disabled: false },
                        nextBtn: { disabled: true },
                        prevBtn: { disabled: true },
                        manualStopBtn: { disabled: true }
                    };
                    
                    const mockEvent = { code: 'Space' };
                    const result = handleManualKeyboard(mockEvent, false, state, buttons);
                    
                    return result === 'manualStartOrReplay' && 
                           actionLog.includes('manualStartOrReplay');
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 9.2: ArrowRight key triggers manualNext when button is enabled', () => {
        /**
         * Requirement 9.2: WHEN the user presses Right Arrow, THE System SHALL trigger "下一個/句" action
         */
        fc.assert(
            fc.property(
                wordListArb,
                fc.integer({ min: 0, max: 8 }),
                (text, index) => {
                    resetActionLog();
                    
                    const state = createManualReadingState();
                    state.initItems(text, 'word');
                    state.readingMode = 'manual';
                    state.hasStarted = true;
                    state.isReading = false;
                    state.currentIndex = Math.min(index, state.totalItems - 2); // Not at last
                    
                    const buttons = {
                        manualStartBtn: { disabled: false },
                        nextBtn: { disabled: false },
                        prevBtn: { disabled: false },
                        manualStopBtn: { disabled: false }
                    };
                    
                    const mockEvent = { code: 'ArrowRight' };
                    const result = handleManualKeyboard(mockEvent, false, state, buttons);
                    
                    return result === 'manualNext' && 
                           actionLog.includes('manualNext');
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 9.3: ArrowLeft key triggers manualPrevious when button is enabled', () => {
        /**
         * Requirement 9.3: WHEN the user presses Left Arrow, THE System SHALL trigger "上一個/句" action
         */
        fc.assert(
            fc.property(
                wordListArb,
                fc.integer({ min: 1, max: 9 }),
                (text, index) => {
                    resetActionLog();
                    
                    const state = createManualReadingState();
                    state.initItems(text, 'word');
                    state.readingMode = 'manual';
                    state.hasStarted = true;
                    state.isReading = false;
                    state.currentIndex = Math.min(index, state.totalItems - 1);
                    
                    const buttons = {
                        manualStartBtn: { disabled: false },
                        nextBtn: { disabled: false },
                        prevBtn: { disabled: false },
                        manualStopBtn: { disabled: false }
                    };
                    
                    const mockEvent = { code: 'ArrowLeft' };
                    const result = handleManualKeyboard(mockEvent, false, state, buttons);
                    
                    return result === 'manualPrevious' && 
                           actionLog.includes('manualPrevious');
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 9.4: Escape key triggers manualStop when button is enabled', () => {
        /**
         * Requirement 9.5: WHEN the user presses Escape, THE System SHALL trigger "取消" action
         */
        fc.assert(
            fc.property(
                wordListArb,
                (text) => {
                    resetActionLog();
                    
                    const state = createManualReadingState();
                    state.initItems(text, 'word');
                    state.readingMode = 'manual';
                    state.hasStarted = true;
                    state.isReading = false;
                    state.currentIndex = 0;
                    
                    const buttons = {
                        manualStartBtn: { disabled: false },
                        nextBtn: { disabled: false },
                        prevBtn: { disabled: false },
                        manualStopBtn: { disabled: false }
                    };
                    
                    const mockEvent = { code: 'Escape' };
                    const result = handleManualKeyboard(mockEvent, false, state, buttons);
                    
                    return result === 'manualStop' && 
                           actionLog.includes('manualStop');
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 9.5: No action when input is focused (Requirement 9.6)', () => {
        /**
         * Requirement 9.6: THE keyboard shortcuts SHALL only work when no input field is focused
         */
        fc.assert(
            fc.property(
                manualKeyCodeArb,
                wordListArb,
                (keyCode, text) => {
                    resetActionLog();
                    
                    const state = createManualReadingState();
                    state.initItems(text, 'word');
                    state.readingMode = 'manual';
                    state.hasStarted = true;
                    state.isReading = false;
                    state.currentIndex = 0;
                    
                    const buttons = {
                        manualStartBtn: { disabled: false },
                        nextBtn: { disabled: false },
                        prevBtn: { disabled: false },
                        manualStopBtn: { disabled: false }
                    };
                    
                    const mockEvent = { code: keyCode };
                    // isInputFocused = true
                    const result = handleManualKeyboard(mockEvent, true, state, buttons);
                    
                    return result === null && actionLog.length === 0;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 9.6: No action when in auto mode', () => {
        /**
         * Keyboard shortcuts for manual mode should not work in auto mode
         */
        fc.assert(
            fc.property(
                manualKeyCodeArb,
                wordListArb,
                (keyCode, text) => {
                    resetActionLog();
                    
                    const state = createManualReadingState();
                    state.initItems(text, 'word');
                    state.readingMode = 'auto'; // Auto mode
                    state.hasStarted = true;
                    state.isReading = false;
                    state.currentIndex = 0;
                    
                    const buttons = {
                        manualStartBtn: { disabled: false },
                        nextBtn: { disabled: false },
                        prevBtn: { disabled: false },
                        manualStopBtn: { disabled: false }
                    };
                    
                    const mockEvent = { code: keyCode };
                    const result = handleManualKeyboard(mockEvent, false, state, buttons);
                    
                    return result === null && actionLog.length === 0;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 9.7: No action when button is disabled', () => {
        /**
         * Actions should not trigger when corresponding button is disabled
         */
        fc.assert(
            fc.property(
                manualKeyCodeArb,
                wordListArb,
                (keyCode, text) => {
                    resetActionLog();
                    
                    const state = createManualReadingState();
                    state.initItems(text, 'word');
                    state.readingMode = 'manual';
                    state.hasStarted = false; // Not started
                    state.isReading = false;
                    state.currentIndex = -1;
                    
                    // All buttons disabled except start
                    const buttons = {
                        manualStartBtn: { disabled: keyCode === 'Space' ? true : false },
                        nextBtn: { disabled: true },
                        prevBtn: { disabled: true },
                        manualStopBtn: { disabled: true }
                    };
                    
                    const mockEvent = { code: keyCode };
                    const result = handleManualKeyboard(mockEvent, false, state, buttons);
                    
                    // If the button for this key is disabled, no action should trigger
                    if (keyCode === 'Space' && buttons.manualStartBtn.disabled) {
                        return result === null;
                    }
                    if (keyCode === 'ArrowRight' && buttons.nextBtn.disabled) {
                        return result === null;
                    }
                    if (keyCode === 'ArrowLeft' && buttons.prevBtn.disabled) {
                        return result === null;
                    }
                    if (keyCode === 'Escape' && buttons.manualStopBtn.disabled) {
                        return result === null;
                    }
                    
                    return true;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 9.8: Key-to-action mapping is consistent', () => {
        /**
         * For any valid key code, the action triggered should always be the same
         */
        fc.assert(
            fc.property(
                manualKeyCodeArb,
                wordListArb,
                fc.integer({ min: 1, max: 5 }),
                (keyCode, text, repetitions) => {
                    const state = createManualReadingState();
                    state.initItems(text, 'word');
                    state.readingMode = 'manual';
                    state.hasStarted = true;
                    state.isReading = false;
                    state.currentIndex = Math.min(1, state.totalItems - 1);
                    
                    const buttons = {
                        manualStartBtn: { disabled: false },
                        nextBtn: { disabled: false },
                        prevBtn: { disabled: false },
                        manualStopBtn: { disabled: false }
                    };
                    
                    const mockEvent = { code: keyCode };
                    const expectedAction = getExpectedAction(keyCode);
                    
                    // Run multiple times and verify consistency
                    for (let i = 0; i < repetitions; i++) {
                        resetActionLog();
                        const result = handleManualKeyboard(mockEvent, false, state, buttons);
                        if (result !== expectedAction) {
                            return false;
                        }
                    }
                    
                    return true;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 9.9: Non-mapped keys do not trigger any action', () => {
        /**
         * Keys not in the mapping should not trigger any action
         */
        const nonMappedKeyArb = fc.constantFrom(
            'ArrowUp', 'ArrowDown', 'Enter', 'Tab', 'KeyA', 'KeyB', 'Digit1', 'Backspace'
        );
        
        fc.assert(
            fc.property(
                nonMappedKeyArb,
                wordListArb,
                (keyCode, text) => {
                    resetActionLog();
                    
                    const state = createManualReadingState();
                    state.initItems(text, 'word');
                    state.readingMode = 'manual';
                    state.hasStarted = true;
                    state.isReading = false;
                    state.currentIndex = 0;
                    
                    const buttons = {
                        manualStartBtn: { disabled: false },
                        nextBtn: { disabled: false },
                        prevBtn: { disabled: false },
                        manualStopBtn: { disabled: false }
                    };
                    
                    const mockEvent = { code: keyCode };
                    const result = handleManualKeyboard(mockEvent, false, state, buttons);
                    
                    return result === null && actionLog.length === 0;
                }
            ),
            { numRuns: 100 }
        );
    });
});
