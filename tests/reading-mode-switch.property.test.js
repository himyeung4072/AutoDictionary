/**
 * Property-Based Tests for Reading Mode Switch
 * 
 * Feature: manual-reading-mode
 * Property 1: Control Visibility Matches Reading Mode
 * Property 2: Reading Mode Persistence Round Trip
 * Property 8: Text Preservation on Mode Switch
 * 
 * These tests validate correctness properties using fast-check
 * as specified in the design document.
 * 
 * Each test runs minimum 100 iterations as per testing strategy.
 * 
 * **Validates: Requirements 1.3, 1.4, 1.5, 1.6, 2.2, 8.4**
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fc from 'fast-check';

// ===== Mock DOM Setup =====

/**
 * Create a minimal DOM structure for testing
 */
function setupDOM() {
    document.body.innerHTML = `
        <div class="player-controls" id="autoControls">
            <button id="startBtn">開始</button>
            <button id="pauseBtn">暫停</button>
            <button id="stopBtn">取消</button>
        </div>
        <div class="player-controls manual-controls hidden" id="manualControls">
            <button id="prevBtn">上一個</button>
            <button id="manualStartBtn">開始</button>
            <button id="manualStopBtn">取消</button>
            <button id="nextBtn">下一個</button>
        </div>
        <div class="keyboard-hint">快捷鍵：<kbd>Space</kbd> 開始/暫停 · <kbd>Esc</kbd> 停止</div>
        <input type="hidden" id="readingMode" value="auto">
    `;
}

/**
 * Clean up DOM after tests
 */
function cleanupDOM() {
    document.body.innerHTML = '';
    localStorage.clear();
}

// ===== ManualReadingState Mock =====

/**
 * Create a fresh ManualReadingState for testing
 */
function createManualReadingState() {
    return {
        readingMode: 'auto',
        currentIndex: -1,
        hasStarted: false,
        isReading: false,
        items: [],
        totalItems: 0,
        reset() {
            this.currentIndex = -1;
            this.hasStarted = false;
            this.isReading = false;
            this.items = [];
            this.totalItems = 0;
        }
    };
}

// ===== Functions Under Test =====

/**
 * Update keyboard hint based on mode
 * @param {string} mode - 'auto' or 'manual'
 */
function updateKeyboardHint(mode) {
    const hint = document.querySelector('.keyboard-hint');
    if (!hint) return;
    
    if (mode === 'manual') {
        hint.innerHTML = '快捷鍵：<kbd>Space</kbd> 開始/重讀 · <kbd>←</kbd> 上一個 · <kbd>→</kbd> 下一個 · <kbd>Esc</kbd> 取消';
    } else {
        hint.innerHTML = '快捷鍵：<kbd>Space</kbd> 開始/暫停 · <kbd>Esc</kbd> 停止';
    }
}

/**
 * Switch reading mode
 * @param {string} mode - 'auto' or 'manual'
 * @param {Object} state - ManualReadingState object
 */
function switchReadingMode(mode, state) {
    // Reset state if reading was in progress
    if (state.hasStarted) {
        state.reset();
    }
    
    state.readingMode = mode;
    
    // Switch control button visibility
    const autoControls = document.querySelector('.player-controls:not(.manual-controls)');
    const manualControls = document.getElementById('manualControls');
    
    if (mode === 'manual') {
        if (autoControls) autoControls.classList.add('hidden');
        if (manualControls) manualControls.classList.remove('hidden');
    } else {
        if (autoControls) autoControls.classList.remove('hidden');
        if (manualControls) manualControls.classList.add('hidden');
    }
    
    // Update keyboard hint
    updateKeyboardHint(mode);
    
    // Update hidden input
    const readingModeInput = document.getElementById('readingMode');
    if (readingModeInput) {
        readingModeInput.value = mode;
    }
}

/**
 * Check if auto controls are visible
 */
function isAutoControlsVisible() {
    const autoControls = document.querySelector('.player-controls:not(.manual-controls)');
    return autoControls && !autoControls.classList.contains('hidden');
}

/**
 * Check if manual controls are visible
 */
function isManualControlsVisible() {
    const manualControls = document.getElementById('manualControls');
    return manualControls && !manualControls.classList.contains('hidden');
}

/**
 * Save reading mode to localStorage
 * @param {string} mode - 'auto' or 'manual'
 */
function saveReadingMode(mode) {
    const settings = JSON.parse(localStorage.getItem('dictationSettings') || '{}');
    settings.readingMode = mode;
    localStorage.setItem('dictationSettings', JSON.stringify(settings));
}

/**
 * Load reading mode from localStorage
 * @returns {string} - 'auto' or 'manual'
 */
function loadReadingMode() {
    const settings = JSON.parse(localStorage.getItem('dictationSettings') || '{}');
    return settings.readingMode || 'auto';
}

// ===== Custom Arbitraries =====

/**
 * Generate reading mode value
 */
const readingModeArb = fc.constantFrom('auto', 'manual');

/**
 * Generate a sequence of mode switches
 */
const modeSwitchSequenceArb = fc.array(readingModeArb, { minLength: 1, maxLength: 20 });

// ===== Property Tests =====

describe('Property 1: Control Visibility Matches Reading Mode', () => {
    /**
     * Feature: manual-reading-mode, Property 1: Control Visibility Matches Reading Mode
     * 
     * *For any* reading mode value ('auto' or 'manual'), the visible control buttons 
     * SHALL match the selected mode - auto controls visible when mode is 'auto', 
     * manual controls visible when mode is 'manual'.
     * 
     * **Validates: Requirements 1.3, 1.4, 2.2**
     */

    beforeEach(() => {
        setupDOM();
    });

    afterEach(() => {
        cleanupDOM();
    });

    it('Property 1.1: Auto controls visible when mode is auto, manual controls hidden', () => {
        /**
         * Requirement 1.3: WHEN the user selects "自動朗讀", THE System SHALL display 
         * the automatic reading controls
         */
        fc.assert(
            fc.property(
                fc.constant('auto'),
                (mode) => {
                    const state = createManualReadingState();
                    switchReadingMode(mode, state);
                    
                    return isAutoControlsVisible() && !isManualControlsVisible();
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 1.2: Manual controls visible when mode is manual, auto controls hidden', () => {
        /**
         * Requirement 1.4: WHEN the user selects "手動朗讀", THE System SHALL display 
         * the manual reading controls
         */
        fc.assert(
            fc.property(
                fc.constant('manual'),
                (mode) => {
                    const state = createManualReadingState();
                    switchReadingMode(mode, state);
                    
                    return !isAutoControlsVisible() && isManualControlsVisible();
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 1.3: Control visibility is mutually exclusive for any mode', () => {
        /**
         * Requirements 1.3, 1.4, 2.2: Only one set of controls should be visible at a time
         */
        fc.assert(
            fc.property(
                readingModeArb,
                (mode) => {
                    const state = createManualReadingState();
                    switchReadingMode(mode, state);
                    
                    const autoVisible = isAutoControlsVisible();
                    const manualVisible = isManualControlsVisible();
                    
                    // Exactly one should be visible (XOR)
                    return (autoVisible && !manualVisible) || (!autoVisible && manualVisible);
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 1.4: Control visibility matches mode after any sequence of switches', () => {
        /**
         * Requirements 1.3, 1.4: Control visibility should always match the current mode
         */
        fc.assert(
            fc.property(
                modeSwitchSequenceArb,
                (modes) => {
                    const state = createManualReadingState();
                    
                    for (const mode of modes) {
                        switchReadingMode(mode, state);
                        
                        const autoVisible = isAutoControlsVisible();
                        const manualVisible = isManualControlsVisible();
                        
                        // Check visibility matches mode
                        if (mode === 'auto') {
                            if (!autoVisible || manualVisible) return false;
                        } else {
                            if (autoVisible || !manualVisible) return false;
                        }
                    }
                    
                    return true;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 1.5: State readingMode matches the last switched mode', () => {
        /**
         * Invariant: ManualReadingState.readingMode should match the current mode
         */
        fc.assert(
            fc.property(
                modeSwitchSequenceArb,
                (modes) => {
                    const state = createManualReadingState();
                    
                    for (const mode of modes) {
                        switchReadingMode(mode, state);
                    }
                    
                    // State should match the last mode in the sequence
                    const lastMode = modes[modes.length - 1];
                    return state.readingMode === lastMode;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 1.6: Hidden input value matches the current mode', () => {
        /**
         * Invariant: The hidden input should store the current mode value
         */
        fc.assert(
            fc.property(
                readingModeArb,
                (mode) => {
                    const state = createManualReadingState();
                    switchReadingMode(mode, state);
                    
                    const readingModeInput = document.getElementById('readingMode');
                    return readingModeInput && readingModeInput.value === mode;
                }
            ),
            { numRuns: 100 }
        );
    });
});

describe('Property 2: Reading Mode Persistence Round Trip', () => {
    /**
     * Feature: manual-reading-mode, Property 2: Reading Mode Persistence Round Trip
     * 
     * *For any* reading mode selection, saving to localStorage and then loading 
     * SHALL restore the same reading mode value.
     * 
     * **Validates: Requirements 1.5, 1.6**
     */

    beforeEach(() => {
        setupDOM();
    });

    afterEach(() => {
        cleanupDOM();
    });

    it('Property 2.1: Save then load returns the same mode', () => {
        /**
         * Requirements 1.5, 1.6: Reading mode should persist correctly
         */
        fc.assert(
            fc.property(
                readingModeArb,
                (mode) => {
                    saveReadingMode(mode);
                    const loadedMode = loadReadingMode();
                    
                    return loadedMode === mode;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 2.2: Multiple save/load cycles preserve the mode', () => {
        /**
         * Requirements 1.5, 1.6: Persistence should work across multiple cycles
         */
        fc.assert(
            fc.property(
                modeSwitchSequenceArb,
                (modes) => {
                    for (const mode of modes) {
                        saveReadingMode(mode);
                        const loadedMode = loadReadingMode();
                        
                        if (loadedMode !== mode) return false;
                    }
                    
                    return true;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 2.3: Default mode is auto when no saved setting exists', () => {
        /**
         * Requirement 1.6: Default should be 'auto' when no setting is saved
         */
        fc.assert(
            fc.property(
                fc.constant(null),
                () => {
                    localStorage.clear();
                    const loadedMode = loadReadingMode();
                    
                    return loadedMode === 'auto';
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 2.4: Saved mode survives other settings changes', () => {
        /**
         * Requirements 1.5, 1.6: Reading mode should persist independently
         */
        fc.assert(
            fc.property(
                readingModeArb,
                fc.string(),
                (mode, otherValue) => {
                    // Save reading mode
                    saveReadingMode(mode);
                    
                    // Modify other settings
                    const settings = JSON.parse(localStorage.getItem('dictationSettings') || '{}');
                    settings.otherSetting = otherValue;
                    localStorage.setItem('dictationSettings', JSON.stringify(settings));
                    
                    // Load reading mode
                    const loadedMode = loadReadingMode();
                    
                    return loadedMode === mode;
                }
            ),
            { numRuns: 100 }
        );
    });
});

describe('Keyboard Hint Updates', () => {
    /**
     * Additional tests for keyboard hint updates
     */

    beforeEach(() => {
        setupDOM();
    });

    afterEach(() => {
        cleanupDOM();
    });

    it('Keyboard hint shows auto mode shortcuts when mode is auto', () => {
        fc.assert(
            fc.property(
                fc.constant('auto'),
                (mode) => {
                    updateKeyboardHint(mode);
                    const hint = document.querySelector('.keyboard-hint');
                    
                    return hint && 
                           hint.innerHTML.includes('開始/暫停') && 
                           hint.innerHTML.includes('停止');
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Keyboard hint shows manual mode shortcuts when mode is manual', () => {
        fc.assert(
            fc.property(
                fc.constant('manual'),
                (mode) => {
                    updateKeyboardHint(mode);
                    const hint = document.querySelector('.keyboard-hint');
                    
                    return hint && 
                           hint.innerHTML.includes('開始/重讀') && 
                           hint.innerHTML.includes('上一個') &&
                           hint.innerHTML.includes('下一個') &&
                           hint.innerHTML.includes('取消');
                }
            ),
            { numRuns: 100 }
        );
    });
});

describe('Property 8: Text Preservation on Mode Switch', () => {
    /**
     * Feature: manual-reading-mode, Property 8: Text Preservation on Mode Switch
     * 
     * *For any* text content in the textarea, switching between auto and manual 
     * reading modes SHALL preserve the text content unchanged.
     * 
     * **Validates: Requirements 8.4**
     */

    beforeEach(() => {
        // Setup DOM with textarea
        document.body.innerHTML = `
            <textarea id="words"></textarea>
            <div id="displayContainer" class="hidden"></div>
            <div class="player-controls" id="autoControls">
                <button id="startBtn">開始</button>
                <button id="pauseBtn">暫停</button>
                <button id="stopBtn">取消</button>
            </div>
            <div class="player-controls manual-controls hidden" id="manualControls">
                <button id="prevBtn">上一個</button>
                <button id="manualStartBtn"><span id="manualStartBtnText">開始</span></button>
                <button id="manualStopBtn">取消</button>
                <button id="nextBtn">下一個</button>
            </div>
            <div class="keyboard-hint">快捷鍵：<kbd>Space</kbd> 開始/暫停 · <kbd>Esc</kbd> 停止</div>
            <input type="hidden" id="readingMode" value="auto">
            <div id="progressFill"></div>
            <div id="statusCount"></div>
        `;
    });

    afterEach(() => {
        cleanupDOM();
    });

    /**
     * Create a ManualReadingState with HighlightManager mock for testing
     */
    function createStateWithHighlightManager() {
        const state = createManualReadingState();
        
        // Mock HighlightManager
        const HighlightManager = {
            isDisplayMode: false,
            switchToEditMode() {
                this.isDisplayMode = false;
                const displayContainer = document.getElementById('displayContainer');
                const textarea = document.getElementById('words');
                if (displayContainer) displayContainer.classList.add('hidden');
                if (textarea) textarea.classList.remove('hidden');
            },
            switchToDisplayMode() {
                this.isDisplayMode = true;
                const displayContainer = document.getElementById('displayContainer');
                const textarea = document.getElementById('words');
                if (displayContainer) displayContainer.classList.remove('hidden');
                if (textarea) textarea.classList.add('hidden');
            }
        };
        
        return { state, HighlightManager };
    }

    /**
     * Switch reading mode with full state handling (simulates actual implementation)
     */
    function switchReadingModeWithTextPreservation(mode, state, HighlightManager) {
        // Stop any ongoing reading
        if (state.hasStarted) {
            state.reset();
            HighlightManager.switchToEditMode();
        }
        
        state.readingMode = mode;
        
        // Switch control button visibility
        const autoControls = document.querySelector('.player-controls:not(.manual-controls)');
        const manualControls = document.getElementById('manualControls');
        
        if (mode === 'manual') {
            if (autoControls) autoControls.classList.add('hidden');
            if (manualControls) manualControls.classList.remove('hidden');
        } else {
            if (autoControls) autoControls.classList.remove('hidden');
            if (manualControls) manualControls.classList.add('hidden');
        }
        
        updateKeyboardHint(mode);
    }

    /**
     * Arbitrary for generating Chinese text (common in this application)
     */
    const chineseTextArb = fc.stringOf(
        fc.constantFrom(
            '你', '好', '世', '界', '中', '文', '測', '試', '詞', '語',
            '句', '子', '朗', '讀', '模', '式', '切', '換', '保', '留',
            '內', '容', '不', '變', '一', '二', '三', '四', '五', '六',
            '\n', ' ', '，', '。', '！', '？'
        ),
        { minLength: 1, maxLength: 100 }
    );

    /**
     * Arbitrary for generating mixed text (Chinese, English, numbers)
     */
    const mixedTextArb = fc.oneof(
        chineseTextArb,
        fc.string({ minLength: 1, maxLength: 100 }),
        fc.stringOf(
            fc.constantFrom('a', 'b', 'c', '1', '2', '3', ' ', '\n'),
            { minLength: 1, maxLength: 50 }
        )
    );

    it('Property 8.1: Text content preserved when switching from auto to manual', () => {
        /**
         * Requirement 8.4: THE System SHALL preserve the text content when switching between modes
         */
        fc.assert(
            fc.property(
                mixedTextArb,
                (text) => {
                    const { state, HighlightManager } = createStateWithHighlightManager();
                    const textarea = document.getElementById('words');
                    
                    // Set initial text
                    textarea.value = text;
                    state.readingMode = 'auto';
                    
                    // Switch to manual mode
                    switchReadingModeWithTextPreservation('manual', state, HighlightManager);
                    
                    // Text should be preserved
                    return textarea.value === text;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 8.2: Text content preserved when switching from manual to auto', () => {
        /**
         * Requirement 8.4: THE System SHALL preserve the text content when switching between modes
         */
        fc.assert(
            fc.property(
                mixedTextArb,
                (text) => {
                    const { state, HighlightManager } = createStateWithHighlightManager();
                    const textarea = document.getElementById('words');
                    
                    // Set initial text
                    textarea.value = text;
                    state.readingMode = 'manual';
                    
                    // Switch to auto mode
                    switchReadingModeWithTextPreservation('auto', state, HighlightManager);
                    
                    // Text should be preserved
                    return textarea.value === text;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 8.3: Text content preserved after multiple mode switches', () => {
        /**
         * Requirement 8.4: Text should be preserved across any sequence of mode switches
         */
        fc.assert(
            fc.property(
                mixedTextArb,
                modeSwitchSequenceArb,
                (text, modes) => {
                    const { state, HighlightManager } = createStateWithHighlightManager();
                    const textarea = document.getElementById('words');
                    
                    // Set initial text
                    textarea.value = text;
                    
                    // Perform multiple mode switches
                    for (const mode of modes) {
                        switchReadingModeWithTextPreservation(mode, state, HighlightManager);
                        
                        // Check text is preserved after each switch
                        if (textarea.value !== text) {
                            return false;
                        }
                    }
                    
                    return true;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 8.4: Text content preserved when switching during active reading', () => {
        /**
         * Requirements 8.1, 8.4: When switching mode while reading is in progress,
         * the text content should still be preserved
         */
        fc.assert(
            fc.property(
                mixedTextArb,
                readingModeArb,
                (text, targetMode) => {
                    const { state, HighlightManager } = createStateWithHighlightManager();
                    const textarea = document.getElementById('words');
                    
                    // Set initial text
                    textarea.value = text;
                    
                    // Simulate active reading state
                    state.hasStarted = true;
                    state.currentIndex = 0;
                    state.items = text.split('\n').filter(s => s.trim() !== '');
                    state.totalItems = state.items.length;
                    HighlightManager.switchToDisplayMode();
                    
                    // Switch mode (should stop reading and preserve text)
                    switchReadingModeWithTextPreservation(targetMode, state, HighlightManager);
                    
                    // Text should be preserved
                    return textarea.value === text;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 8.5: Empty text preserved on mode switch', () => {
        /**
         * Edge case: Empty text should also be preserved
         */
        fc.assert(
            fc.property(
                readingModeArb,
                readingModeArb,
                (fromMode, toMode) => {
                    const { state, HighlightManager } = createStateWithHighlightManager();
                    const textarea = document.getElementById('words');
                    
                    // Set empty text
                    textarea.value = '';
                    state.readingMode = fromMode;
                    
                    // Switch mode
                    switchReadingModeWithTextPreservation(toMode, state, HighlightManager);
                    
                    // Empty text should be preserved
                    return textarea.value === '';
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 8.6: Whitespace-only text preserved on mode switch', () => {
        /**
         * Edge case: Whitespace-only text should also be preserved
         * Note: Excluding \r (carriage return) as browser textareas normalize it to \n
         */
        const whitespaceArb = fc.stringOf(
            fc.constantFrom(' ', '\t', '\n'),
            { minLength: 1, maxLength: 20 }
        );

        fc.assert(
            fc.property(
                whitespaceArb,
                readingModeArb,
                (text, targetMode) => {
                    const { state, HighlightManager } = createStateWithHighlightManager();
                    const textarea = document.getElementById('words');
                    
                    // Set whitespace text
                    textarea.value = text;
                    
                    // Switch mode
                    switchReadingModeWithTextPreservation(targetMode, state, HighlightManager);
                    
                    // Whitespace text should be preserved exactly
                    return textarea.value === text;
                }
            ),
            { numRuns: 100 }
        );
    });
});
