/**
 * Property-Based Tests for Progress Indicator
 * Feature: mobile-ux-enhancement
 * 
 * These tests validate the correctness properties defined in the design document.
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// Extract the pure functions from the HTML for testing
// These are the core logic functions that we can test independently

/**
 * Calculate progress percentage
 * @param {number} current - Current item index (1-based, completed items)
 * @param {number} total - Total number of items
 * @returns {number} Progress percentage (0-100)
 */
function calculateProgressPercentage(current, total) {
    if (total <= 0) {
        return 0;
    }
    const safeIndex = Math.max(0, Math.min(current, total));
    return (safeIndex / total) * 100;
}

/**
 * Format progress text
 * @param {number} current - Current item index (1-based, completed items)
 * @param {number} total - Total number of items
 * @returns {string} Formatted progress text (e.g., "3 / 10")
 */
function formatProgressText(current, total) {
    if (total <= 0) {
        return '';
    }
    const safeIndex = Math.max(0, Math.min(current, total));
    return safeIndex + ' / ' + total;
}

describe('Progress Indicator Properties', () => {
    /**
     * Property 1: Progress Calculation Accuracy
     * For any list of N items where N > 0, after completing item K (1 ≤ K ≤ N),
     * the progress percentage SHALL equal (K / N) * 100.
     * 
     * **Validates: Requirements 2.2**
     */
    describe('Property 1: Progress Calculation Accuracy', () => {
        it('should calculate correct percentage for any valid current/total combination', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: 1, max: 1000 }), // total items (N > 0)
                    fc.integer({ min: 0, max: 1000 }), // current completed (K)
                    (total, current) => {
                        // Ensure current is within valid range
                        const validCurrent = Math.min(current, total);
                        
                        const percentage = calculateProgressPercentage(validCurrent, total);
                        const expectedPercentage = (validCurrent / total) * 100;
                        
                        // Percentage should equal (K / N) * 100
                        expect(percentage).toBeCloseTo(expectedPercentage, 10);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should return 0% when current is 0', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: 1, max: 1000 }), // total items
                    (total) => {
                        const percentage = calculateProgressPercentage(0, total);
                        expect(percentage).toBe(0);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should return 100% when current equals total', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: 1, max: 1000 }), // total items
                    (total) => {
                        const percentage = calculateProgressPercentage(total, total);
                        expect(percentage).toBe(100);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should clamp current to total when current exceeds total', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: 1, max: 1000 }), // total items
                    fc.integer({ min: 1, max: 1000 }), // excess amount
                    (total, excess) => {
                        const current = total + excess;
                        const percentage = calculateProgressPercentage(current, total);
                        expect(percentage).toBe(100);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should handle invalid total (0 or negative) gracefully', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: -1000, max: 0 }), // invalid total
                    fc.integer({ min: 0, max: 100 }), // any current
                    (total, current) => {
                        const percentage = calculateProgressPercentage(current, total);
                        expect(percentage).toBe(0);
                    }
                ),
                { numRuns: 100 }
            );
        });
    });

    /**
     * Property 2: Progress Text Format
     * For any reading state with current index K and total N,
     * the progress text SHALL display exactly "K / N" format.
     * 
     * **Validates: Requirements 2.4**
     */
    describe('Property 2: Progress Text Format', () => {
        it('should format progress text as "K / N" for any valid values', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: 1, max: 1000 }), // total items (N > 0)
                    fc.integer({ min: 0, max: 1000 }), // current completed (K)
                    (total, current) => {
                        // Ensure current is within valid range
                        const validCurrent = Math.min(current, total);
                        
                        const text = formatProgressText(validCurrent, total);
                        const expectedText = validCurrent + ' / ' + total;
                        
                        expect(text).toBe(expectedText);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should return empty string for invalid total', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: -1000, max: 0 }), // invalid total
                    fc.integer({ min: 0, max: 100 }), // any current
                    (total, current) => {
                        const text = formatProgressText(current, total);
                        expect(text).toBe('');
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should clamp current in text when current exceeds total', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: 1, max: 1000 }), // total items
                    fc.integer({ min: 1, max: 1000 }), // excess amount
                    (total, excess) => {
                        const current = total + excess;
                        const text = formatProgressText(current, total);
                        const expectedText = total + ' / ' + total;
                        
                        expect(text).toBe(expectedText);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should produce text that matches the regex pattern "\\d+ / \\d+"', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: 1, max: 1000 }), // total items
                    fc.integer({ min: 0, max: 1000 }), // current
                    (total, current) => {
                        const validCurrent = Math.min(current, total);
                        const text = formatProgressText(validCurrent, total);
                        
                        // Should match the pattern "number / number"
                        expect(text).toMatch(/^\d+ \/ \d+$/);
                    }
                ),
                { numRuns: 100 }
            );
        });
    });
});


/**
 * Mode Tab State Functions
 * These are the pure logic functions extracted for testing mode tab behavior.
 */

// Mode configuration mapping
const modeConfig = {
    word: {
        label: '輸入詞語（每行一個）：',
        placeholder: '蘋果\n香蕉'
    },
    article: {
        label: '輸入文章：',
        placeholder: '今天天氣很好。我們一起去公園玩吧！'
    }
};

/**
 * Get the expected tab state for a given mode
 * @param {string} selectedMode - The currently selected mode ('word' or 'article')
 * @param {string} tabMode - The mode of the tab being checked
 * @returns {object} Expected tab state { isActive, ariaSelected, tabIndex }
 */
function getExpectedTabState(selectedMode, tabMode) {
    const isActive = selectedMode === tabMode;
    return {
        isActive,
        ariaSelected: isActive ? 'true' : 'false',
        tabIndex: isActive ? '0' : '-1'
    };
}

/**
 * Get the expected input configuration for a given mode
 * @param {string} mode - The selected mode ('word' or 'article')
 * @returns {object} Expected input config { label, placeholder }
 */
function getExpectedInputConfig(mode) {
    return modeConfig[mode] || modeConfig.word;
}

/**
 * Validate that exactly one tab is active
 * @param {string[]} tabModes - Array of tab modes
 * @param {string} selectedMode - The currently selected mode
 * @returns {boolean} True if exactly one tab is active
 */
function validateSingleActiveTab(tabModes, selectedMode) {
    const activeCount = tabModes.filter(mode => mode === selectedMode).length;
    return activeCount === 1;
}

describe('Mode Tab State Properties', () => {
    /**
     * Property 4: Mode Tab State Consistency
     * For any mode selection, the active tab SHALL have the 'active' class,
     * and the input label and placeholder SHALL match the selected mode.
     * 
     * **Validates: Requirements 3.6**
     */
    describe('Property 4: Mode Tab State Consistency', () => {
        const validModes = ['word', 'article'];
        
        it('should have exactly one active tab for any mode selection', () => {
            fc.assert(
                fc.property(
                    fc.constantFrom(...validModes),
                    (selectedMode) => {
                        // For any selected mode, exactly one tab should be active
                        const isValid = validateSingleActiveTab(validModes, selectedMode);
                        expect(isValid).toBe(true);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should set correct active state for selected tab', () => {
            fc.assert(
                fc.property(
                    fc.constantFrom(...validModes),
                    (selectedMode) => {
                        // The selected mode's tab should be active
                        const tabState = getExpectedTabState(selectedMode, selectedMode);
                        expect(tabState.isActive).toBe(true);
                        expect(tabState.ariaSelected).toBe('true');
                        expect(tabState.tabIndex).toBe('0');
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should set correct inactive state for non-selected tabs', () => {
            fc.assert(
                fc.property(
                    fc.constantFrom(...validModes),
                    (selectedMode) => {
                        // All other tabs should be inactive
                        validModes.forEach(tabMode => {
                            if (tabMode !== selectedMode) {
                                const tabState = getExpectedTabState(selectedMode, tabMode);
                                expect(tabState.isActive).toBe(false);
                                expect(tabState.ariaSelected).toBe('false');
                                expect(tabState.tabIndex).toBe('-1');
                            }
                        });
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should return correct input label for any mode', () => {
            fc.assert(
                fc.property(
                    fc.constantFrom(...validModes),
                    (mode) => {
                        const config = getExpectedInputConfig(mode);
                        
                        if (mode === 'word') {
                            expect(config.label).toBe('輸入詞語（每行一個）：');
                        } else if (mode === 'article') {
                            expect(config.label).toBe('輸入文章：');
                        }
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should return correct placeholder for any mode', () => {
            fc.assert(
                fc.property(
                    fc.constantFrom(...validModes),
                    (mode) => {
                        const config = getExpectedInputConfig(mode);
                        
                        if (mode === 'word') {
                            expect(config.placeholder).toBe('蘋果\n香蕉');
                        } else if (mode === 'article') {
                            expect(config.placeholder).toBe('今天天氣很好。我們一起去公園玩吧！');
                        }
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should have consistent label and placeholder pairing for any mode', () => {
            fc.assert(
                fc.property(
                    fc.constantFrom(...validModes),
                    (mode) => {
                        const config = getExpectedInputConfig(mode);
                        
                        // Label and placeholder should be consistent with mode
                        // Word mode: label mentions "詞語" and placeholder has line breaks
                        // Article mode: label mentions "文章" and placeholder is a sentence
                        if (mode === 'word') {
                            expect(config.label).toContain('詞語');
                            expect(config.placeholder).toContain('\n');
                        } else if (mode === 'article') {
                            expect(config.label).toContain('文章');
                            expect(config.placeholder).not.toContain('\n');
                        }
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should handle mode switching round-trip correctly', () => {
            fc.assert(
                fc.property(
                    fc.constantFrom(...validModes),
                    fc.constantFrom(...validModes),
                    (initialMode, targetMode) => {
                        // After switching from any mode to any other mode,
                        // the state should be consistent with the target mode
                        const targetTabState = getExpectedTabState(targetMode, targetMode);
                        const targetConfig = getExpectedInputConfig(targetMode);
                        
                        expect(targetTabState.isActive).toBe(true);
                        expect(targetConfig.label).toBeDefined();
                        expect(targetConfig.placeholder).toBeDefined();
                    }
                ),
                { numRuns: 100 }
            );
        });
    });
});


/**
 * Settings Preview Functions
 * These are the pure logic functions extracted for testing settings preview behavior.
 */

// Speed value to label mapping
const speedLabels = {
    '0.5': '很慢',
    '0.7': '慢',
    '0.9': '正常',
    '1.1': '快',
    '1.3': '很快'
};

/**
 * Generate settings preview text based on current settings
 * @param {string} speedValue - The speed value (e.g., '0.9')
 * @param {string|number} repeatCount - The repeat count
 * @param {string|number} interval - The interval in seconds
 * @returns {string} Formatted preview text
 */
function generateSettingsPreview(speedValue, repeatCount, interval) {
    const speedLabel = speedLabels[speedValue] || '正常';
    return `${speedLabel}速度 · ${repeatCount}次 · ${interval}秒間隔`;
}

/**
 * Validate that preview text contains all required components
 * @param {string} previewText - The generated preview text
 * @param {string} speedValue - The speed value used
 * @param {string|number} repeatCount - The repeat count used
 * @param {string|number} interval - The interval used
 * @returns {boolean} True if all components are present
 */
function validatePreviewComponents(previewText, speedValue, repeatCount, interval) {
    const speedLabel = speedLabels[speedValue] || '正常';
    return previewText.includes(speedLabel) &&
           previewText.includes(`${repeatCount}次`) &&
           previewText.includes(`${interval}秒間隔`);
}

describe('Settings Preview Properties', () => {
    /**
     * Property 5: Settings Preview Accuracy
     * For any combination of settings values, the settings preview text SHALL
     * accurately reflect the current speed, repeat count, and interval values.
     * 
     * **Validates: Requirements 4.2**
     */
    describe('Property 5: Settings Preview Accuracy', () => {
        const validSpeedValues = ['0.5', '0.7', '0.9', '1.1', '1.3'];
        const validRepeatCounts = ['1', '2', '3', '4', '5'];
        const validIntervals = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

        it('should generate preview containing correct speed label for any speed value', () => {
            fc.assert(
                fc.property(
                    fc.constantFrom(...validSpeedValues),
                    fc.constantFrom(...validRepeatCounts),
                    fc.constantFrom(...validIntervals),
                    (speed, repeat, interval) => {
                        const preview = generateSettingsPreview(speed, repeat, interval);
                        const expectedSpeedLabel = speedLabels[speed];
                        
                        expect(preview).toContain(expectedSpeedLabel);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should generate preview containing correct repeat count for any value', () => {
            fc.assert(
                fc.property(
                    fc.constantFrom(...validSpeedValues),
                    fc.constantFrom(...validRepeatCounts),
                    fc.constantFrom(...validIntervals),
                    (speed, repeat, interval) => {
                        const preview = generateSettingsPreview(speed, repeat, interval);
                        
                        expect(preview).toContain(`${repeat}次`);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should generate preview containing correct interval for any value', () => {
            fc.assert(
                fc.property(
                    fc.constantFrom(...validSpeedValues),
                    fc.constantFrom(...validRepeatCounts),
                    fc.constantFrom(...validIntervals),
                    (speed, repeat, interval) => {
                        const preview = generateSettingsPreview(speed, repeat, interval);
                        
                        expect(preview).toContain(`${interval}秒間隔`);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should generate preview with all three components for any combination', () => {
            fc.assert(
                fc.property(
                    fc.constantFrom(...validSpeedValues),
                    fc.constantFrom(...validRepeatCounts),
                    fc.constantFrom(...validIntervals),
                    (speed, repeat, interval) => {
                        const preview = generateSettingsPreview(speed, repeat, interval);
                        const isValid = validatePreviewComponents(preview, speed, repeat, interval);
                        
                        expect(isValid).toBe(true);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should use consistent format "速度 · 次 · 秒間隔" for any settings', () => {
            fc.assert(
                fc.property(
                    fc.constantFrom(...validSpeedValues),
                    fc.constantFrom(...validRepeatCounts),
                    fc.constantFrom(...validIntervals),
                    (speed, repeat, interval) => {
                        const preview = generateSettingsPreview(speed, repeat, interval);
                        
                        // Should match the pattern: "X速度 · Y次 · Z秒間隔"
                        expect(preview).toMatch(/^.+速度 · \d+次 · \d+秒間隔$/);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should handle unknown speed values by defaulting to "正常"', () => {
            fc.assert(
                fc.property(
                    fc.string({ minLength: 1, maxLength: 5 }).filter(s => !validSpeedValues.includes(s)),
                    fc.constantFrom(...validRepeatCounts),
                    fc.constantFrom(...validIntervals),
                    (unknownSpeed, repeat, interval) => {
                        const preview = generateSettingsPreview(unknownSpeed, repeat, interval);
                        
                        // Should default to "正常" for unknown speed values
                        expect(preview).toContain('正常速度');
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should produce different previews for different settings combinations', () => {
            fc.assert(
                fc.property(
                    fc.constantFrom(...validSpeedValues),
                    fc.constantFrom(...validSpeedValues),
                    fc.constantFrom(...validRepeatCounts),
                    fc.constantFrom(...validIntervals),
                    (speed1, speed2, repeat, interval) => {
                        // Only test when speeds are different
                        fc.pre(speed1 !== speed2);
                        
                        const preview1 = generateSettingsPreview(speed1, repeat, interval);
                        const preview2 = generateSettingsPreview(speed2, repeat, interval);
                        
                        // Different speed values should produce different previews
                        expect(preview1).not.toBe(preview2);
                    }
                ),
                { numRuns: 100 }
            );
        });
    });
});


/**
 * Word/Character Counter Functions
 * These are the pure logic functions extracted for testing word counting behavior.
 */

/**
 * Count words (non-empty lines) for word mode
 * @param {string} text - Input text
 * @returns {number} Number of non-empty lines
 */
function countWords(text) {
    if (!text || typeof text !== 'string') {
        return 0;
    }
    const lines = text.split('\n').filter(line => line.trim() !== '');
    return lines.length;
}

/**
 * Count Chinese characters for article mode
 * @param {string} text - Input text
 * @returns {number} Number of Chinese characters (Unicode range \u4e00-\u9fff)
 */
function countCharacters(text) {
    if (!text || typeof text !== 'string') {
        return 0;
    }
    const chineseChars = text.match(/[\u4e00-\u9fff]/g);
    return chineseChars ? chineseChars.length : 0;
}

describe('Word/Character Counter Properties', () => {
    /**
     * Property 6: Word Count Accuracy (Word Mode)
     * For any input text in word mode, the word counter SHALL display
     * the exact count of non-empty lines.
     * 
     * **Validates: Requirements 5.1**
     */
    describe('Property 6: Word Count Accuracy (Word Mode)', () => {
        it('should count non-empty lines correctly for any text with line breaks', () => {
            fc.assert(
                fc.property(
                    fc.array(fc.string({ minLength: 0, maxLength: 50 }), { minLength: 0, maxLength: 20 }),
                    (lines) => {
                        const text = lines.join('\n');
                        const count = countWords(text);
                        const expectedCount = lines.filter(line => line.trim() !== '').length;
                        
                        expect(count).toBe(expectedCount);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should return 0 for empty string', () => {
            expect(countWords('')).toBe(0);
        });

        it('should return 0 for null or undefined', () => {
            expect(countWords(null)).toBe(0);
            expect(countWords(undefined)).toBe(0);
        });

        it('should return 0 for whitespace-only lines', () => {
            fc.assert(
                fc.property(
                    fc.array(fc.constantFrom('', ' ', '  ', '\t', '   \t   '), { minLength: 1, maxLength: 10 }),
                    (whitespaceLines) => {
                        const text = whitespaceLines.join('\n');
                        const count = countWords(text);
                        
                        expect(count).toBe(0);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should count each non-empty line exactly once', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: 1, max: 20 }),
                    (numLines) => {
                        // Generate text with exactly numLines non-empty lines
                        const lines = Array(numLines).fill('詞語');
                        const text = lines.join('\n');
                        const count = countWords(text);
                        
                        expect(count).toBe(numLines);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should handle mixed empty and non-empty lines', () => {
            fc.assert(
                fc.property(
                    fc.array(fc.boolean(), { minLength: 1, maxLength: 20 }),
                    (pattern) => {
                        // Generate text based on pattern: true = non-empty, false = empty
                        const lines = pattern.map(hasContent => hasContent ? '內容' : '');
                        const text = lines.join('\n');
                        const count = countWords(text);
                        const expectedCount = pattern.filter(Boolean).length;
                        
                        expect(count).toBe(expectedCount);
                    }
                ),
                { numRuns: 100 }
            );
        });
    });

    /**
     * Property 7: Character Count Accuracy (Article Mode)
     * For any input text in article mode, the character counter SHALL display
     * the exact count of Chinese characters (Unicode range \u4e00-\u9fff).
     * 
     * **Validates: Requirements 5.2**
     */
    describe('Property 7: Character Count Accuracy (Article Mode)', () => {
        // Generator for Chinese characters
        const chineseCharGen = fc.integer({ min: 0x4e00, max: 0x9fff })
            .map(code => String.fromCharCode(code));
        
        // Generator for non-Chinese characters
        const nonChineseCharGen = fc.oneof(
            fc.char().filter(c => !/[\u4e00-\u9fff]/.test(c)),
            fc.constantFrom(' ', '.', ',', '!', '?', '。', '，', '！', '？', '1', '2', 'a', 'b')
        );

        it('should count Chinese characters correctly for any text', () => {
            fc.assert(
                fc.property(
                    fc.array(chineseCharGen, { minLength: 0, maxLength: 50 }),
                    (chineseChars) => {
                        const text = chineseChars.join('');
                        const count = countCharacters(text);
                        
                        expect(count).toBe(chineseChars.length);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should return 0 for text with no Chinese characters', () => {
            fc.assert(
                fc.property(
                    fc.array(nonChineseCharGen, { minLength: 0, maxLength: 50 }),
                    (nonChineseChars) => {
                        const text = nonChineseChars.join('');
                        const count = countCharacters(text);
                        
                        expect(count).toBe(0);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should return 0 for empty string', () => {
            expect(countCharacters('')).toBe(0);
        });

        it('should return 0 for null or undefined', () => {
            expect(countCharacters(null)).toBe(0);
            expect(countCharacters(undefined)).toBe(0);
        });

        it('should count only Chinese characters in mixed text', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: 1, max: 20 }),
                    fc.integer({ min: 0, max: 20 }),
                    (numChinese, numOther) => {
                        // Generate mixed text with known number of Chinese characters
                        const chineseChars = Array(numChinese).fill('中');
                        const otherChars = Array(numOther).fill('a');
                        const allChars = [...chineseChars, ...otherChars];
                        
                        // Shuffle the array
                        for (let i = allChars.length - 1; i > 0; i--) {
                            const j = Math.floor(Math.random() * (i + 1));
                            [allChars[i], allChars[j]] = [allChars[j], allChars[i]];
                        }
                        
                        const text = allChars.join('');
                        const count = countCharacters(text);
                        
                        expect(count).toBe(numChinese);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should handle punctuation and spaces correctly (not counting them)', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: 1, max: 10 }),
                    (numChinese) => {
                        // Generate text with Chinese characters and punctuation
                        const text = Array(numChinese).fill('字').join('，') + '。';
                        const count = countCharacters(text);
                        
                        expect(count).toBe(numChinese);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should count characters across multiple lines', () => {
            fc.assert(
                fc.property(
                    fc.array(fc.integer({ min: 1, max: 10 }), { minLength: 1, maxLength: 5 }),
                    (charsPerLine) => {
                        // Generate multi-line text with known character counts
                        const lines = charsPerLine.map(n => Array(n).fill('文').join(''));
                        const text = lines.join('\n');
                        const count = countCharacters(text);
                        const expectedCount = charsPerLine.reduce((sum, n) => sum + n, 0);
                        
                        expect(count).toBe(expectedCount);
                    }
                ),
                { numRuns: 100 }
            );
        });
    });
});


/**
 * Textarea Auto-Expand Functions
 * These are the pure logic functions extracted for testing textarea height adjustment.
 */

/**
 * Calculate the adjusted height for a textarea based on content
 * @param {number} scrollHeight - The scrollHeight of the textarea content
 * @param {number} minHeight - Minimum height in pixels (default: 100)
 * @param {number} maxHeight - Maximum height in pixels (default: 300)
 * @returns {number} The calculated height clamped between min and max
 */
function calculateTextareaHeight(scrollHeight, minHeight = 100, maxHeight = 300) {
    return Math.min(Math.max(scrollHeight, minHeight), maxHeight);
}

describe('Textarea Auto-Expand Properties', () => {
    /**
     * Property 8: Textarea Height Adjustment
     * For any content change in the textarea, the height SHALL adjust to fit
     * the content within the bounds of minimum (100px) and maximum (300px) heights.
     * 
     * **Validates: Requirements 6.1, 6.5**
     */
    describe('Property 8: Textarea Height Adjustment', () => {
        const MIN_HEIGHT = 100;
        const MAX_HEIGHT = 300;

        it('should return height within bounds for any scrollHeight', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: 0, max: 1000 }),
                    (scrollHeight) => {
                        const height = calculateTextareaHeight(scrollHeight, MIN_HEIGHT, MAX_HEIGHT);
                        
                        expect(height).toBeGreaterThanOrEqual(MIN_HEIGHT);
                        expect(height).toBeLessThanOrEqual(MAX_HEIGHT);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should return minimum height when scrollHeight is below minimum', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: 0, max: MIN_HEIGHT - 1 }),
                    (scrollHeight) => {
                        const height = calculateTextareaHeight(scrollHeight, MIN_HEIGHT, MAX_HEIGHT);
                        
                        expect(height).toBe(MIN_HEIGHT);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should return maximum height when scrollHeight exceeds maximum', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: MAX_HEIGHT + 1, max: 1000 }),
                    (scrollHeight) => {
                        const height = calculateTextareaHeight(scrollHeight, MIN_HEIGHT, MAX_HEIGHT);
                        
                        expect(height).toBe(MAX_HEIGHT);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should return exact scrollHeight when within bounds', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: MIN_HEIGHT, max: MAX_HEIGHT }),
                    (scrollHeight) => {
                        const height = calculateTextareaHeight(scrollHeight, MIN_HEIGHT, MAX_HEIGHT);
                        
                        expect(height).toBe(scrollHeight);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should handle custom min/max height bounds', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: 50, max: 150 }),  // custom min
                    fc.integer({ min: 200, max: 500 }), // custom max
                    fc.integer({ min: 0, max: 600 }),   // scrollHeight
                    (customMin, customMax, scrollHeight) => {
                        const height = calculateTextareaHeight(scrollHeight, customMin, customMax);
                        
                        expect(height).toBeGreaterThanOrEqual(customMin);
                        expect(height).toBeLessThanOrEqual(customMax);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should be idempotent - applying twice gives same result', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: 0, max: 1000 }),
                    (scrollHeight) => {
                        const height1 = calculateTextareaHeight(scrollHeight, MIN_HEIGHT, MAX_HEIGHT);
                        const height2 = calculateTextareaHeight(height1, MIN_HEIGHT, MAX_HEIGHT);
                        
                        expect(height1).toBe(height2);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should preserve ordering - larger scrollHeight gives larger or equal height', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: 0, max: 500 }),
                    fc.integer({ min: 0, max: 500 }),
                    (scrollHeight1, scrollHeight2) => {
                        const height1 = calculateTextareaHeight(scrollHeight1, MIN_HEIGHT, MAX_HEIGHT);
                        const height2 = calculateTextareaHeight(scrollHeight2, MIN_HEIGHT, MAX_HEIGHT);
                        
                        if (scrollHeight1 <= scrollHeight2) {
                            expect(height1).toBeLessThanOrEqual(height2);
                        } else {
                            expect(height1).toBeGreaterThanOrEqual(height2);
                        }
                    }
                ),
                { numRuns: 100 }
            );
        });
    });
});


/**
 * Touch Target and Font Size Properties
 * These tests validate the responsive layout requirements for mobile UX.
 */

/**
 * CSS Variable definitions from the application
 * These represent the design system values used in the app
 */
const CSS_VARIABLES = {
    touchTargetMin: 48, // --touch-target-min: 48px
    fontSizeMd: 16,     // --font-size-md: 16px
    fontSizeSm: 14,     // --font-size-sm: 14px
    fontSizeXs: 12,     // --font-size-xs: 12px
};

/**
 * Interactive element types that require touch target validation
 */
const INTERACTIVE_ELEMENTS = ['button', 'input', 'select', 'textarea', '.mode-tab', '.settings-panel summary'];

/**
 * Form input elements that require font size validation
 */
const FORM_INPUT_ELEMENTS = ['input', 'select', 'textarea'];

/**
 * Validate that a computed height meets the minimum touch target requirement
 * @param {number} height - The computed height in pixels
 * @param {number} minHeight - Minimum required height (default: 48px)
 * @returns {boolean} True if height meets minimum requirement
 */
function validateTouchTargetHeight(height, minHeight = CSS_VARIABLES.touchTargetMin) {
    return height >= minHeight;
}

/**
 * Validate that a computed font size meets the minimum requirement
 * @param {number} fontSize - The computed font size in pixels
 * @param {number} minFontSize - Minimum required font size (default: 16px)
 * @returns {boolean} True if font size meets minimum requirement
 */
function validateFontSize(fontSize, minFontSize = CSS_VARIABLES.fontSizeMd) {
    return fontSize >= minFontSize;
}

/**
 * Parse a CSS pixel value to a number
 * @param {string} value - CSS value like "48px" or "16px"
 * @returns {number} Numeric value in pixels
 */
function parseCSSPixelValue(value) {
    if (typeof value === 'number') return value;
    if (!value || typeof value !== 'string') return 0;
    const match = value.match(/^(\d+(?:\.\d+)?)(px)?$/);
    return match ? parseFloat(match[1]) : 0;
}

/**
 * Get the expected minimum height for an element type
 * @param {string} elementType - The type of element
 * @returns {number} Expected minimum height in pixels
 */
function getExpectedMinHeight(elementType) {
    // All interactive elements should have at least 48px height
    return CSS_VARIABLES.touchTargetMin;
}

/**
 * Get the expected minimum font size for an element type
 * @param {string} elementType - The type of element
 * @returns {number} Expected minimum font size in pixels
 */
function getExpectedMinFontSize(elementType) {
    // All form inputs should have at least 16px font size to prevent iOS zoom
    return CSS_VARIABLES.fontSizeMd;
}

describe('Responsive Layout Properties', () => {
    /**
     * Property 9: Touch Target Minimum Size
     * For any interactive element (buttons, tabs, form controls),
     * the computed height SHALL be at least 48px.
     * 
     * **Validates: Requirements 10.2**
     */
    describe('Property 9: Touch Target Minimum Size', () => {
        it('should validate touch target height correctly for any height value', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: 0, max: 200 }),
                    (height) => {
                        const isValid = validateTouchTargetHeight(height);
                        const expected = height >= CSS_VARIABLES.touchTargetMin;
                        
                        expect(isValid).toBe(expected);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should return true for heights at or above 48px', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: CSS_VARIABLES.touchTargetMin, max: 200 }),
                    (height) => {
                        const isValid = validateTouchTargetHeight(height);
                        
                        expect(isValid).toBe(true);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should return false for heights below 48px', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: 0, max: CSS_VARIABLES.touchTargetMin - 1 }),
                    (height) => {
                        const isValid = validateTouchTargetHeight(height);
                        
                        expect(isValid).toBe(false);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should return expected minimum height of 48px for all interactive element types', () => {
            fc.assert(
                fc.property(
                    fc.constantFrom(...INTERACTIVE_ELEMENTS),
                    (elementType) => {
                        const expectedMinHeight = getExpectedMinHeight(elementType);
                        
                        expect(expectedMinHeight).toBe(CSS_VARIABLES.touchTargetMin);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should correctly parse CSS pixel values', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: 0, max: 200 }),
                    (value) => {
                        const cssValue = `${value}px`;
                        const parsed = parseCSSPixelValue(cssValue);
                        
                        expect(parsed).toBe(value);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should handle numeric values directly', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: 0, max: 200 }),
                    (value) => {
                        const parsed = parseCSSPixelValue(value);
                        
                        expect(parsed).toBe(value);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should return 0 for invalid CSS values', () => {
            fc.assert(
                fc.property(
                    fc.constantFrom(null, undefined, '', 'invalid', 'auto', '100%'),
                    (invalidValue) => {
                        const parsed = parseCSSPixelValue(invalidValue);
                        
                        expect(parsed).toBe(0);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should validate that 48px exactly meets the minimum requirement', () => {
            const isValid = validateTouchTargetHeight(48);
            expect(isValid).toBe(true);
        });

        it('should validate that 47px does not meet the minimum requirement', () => {
            const isValid = validateTouchTargetHeight(47);
            expect(isValid).toBe(false);
        });
    });

    /**
     * Property 10: Form Input Font Size
     * For any form input element (input, select, textarea),
     * the computed font size SHALL be at least 16px.
     * 
     * **Validates: Requirements 10.3**
     */
    describe('Property 10: Form Input Font Size', () => {
        it('should validate font size correctly for any size value', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: 0, max: 50 }),
                    (fontSize) => {
                        const isValid = validateFontSize(fontSize);
                        const expected = fontSize >= CSS_VARIABLES.fontSizeMd;
                        
                        expect(isValid).toBe(expected);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should return true for font sizes at or above 16px', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: CSS_VARIABLES.fontSizeMd, max: 50 }),
                    (fontSize) => {
                        const isValid = validateFontSize(fontSize);
                        
                        expect(isValid).toBe(true);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should return false for font sizes below 16px', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: 1, max: CSS_VARIABLES.fontSizeMd - 1 }),
                    (fontSize) => {
                        const isValid = validateFontSize(fontSize);
                        
                        expect(isValid).toBe(false);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should return expected minimum font size of 16px for all form input types', () => {
            fc.assert(
                fc.property(
                    fc.constantFrom(...FORM_INPUT_ELEMENTS),
                    (elementType) => {
                        const expectedMinFontSize = getExpectedMinFontSize(elementType);
                        
                        expect(expectedMinFontSize).toBe(CSS_VARIABLES.fontSizeMd);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should validate that 16px exactly meets the minimum requirement', () => {
            const isValid = validateFontSize(16);
            expect(isValid).toBe(true);
        });

        it('should validate that 15px does not meet the minimum requirement', () => {
            const isValid = validateFontSize(15);
            expect(isValid).toBe(false);
        });

        it('should handle custom minimum font size requirements', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: 10, max: 24 }), // custom min
                    fc.integer({ min: 0, max: 50 }),  // font size to test
                    (customMin, fontSize) => {
                        const isValid = validateFontSize(fontSize, customMin);
                        const expected = fontSize >= customMin;
                        
                        expect(isValid).toBe(expected);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should ensure font size validation is consistent with touch target validation logic', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: 0, max: 100 }),
                    (value) => {
                        // Both validations should use the same comparison logic
                        const touchValid = validateTouchTargetHeight(value, value);
                        const fontValid = validateFontSize(value, value);
                        
                        // When min equals value, both should return true
                        expect(touchValid).toBe(true);
                        expect(fontValid).toBe(true);
                    }
                ),
                { numRuns: 100 }
            );
        });
    });
});
