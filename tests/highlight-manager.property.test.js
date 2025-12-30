/**
 * Property-Based Tests for HighlightManager
 * Feature: text-highlight-during-speech
 * 
 * These tests validate correctness properties using fast-check
 * as specified in the design document.
 * 
 * Each test runs minimum 100 iterations as per testing strategy.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fc from 'fast-check';

// ===== Extract pure functions for testing (same as unit tests) =====

/**
 * Split text based on mode (word or article)
 * Word mode: split by lines, filter empty lines
 * Article mode: split by punctuation into sentences
 * 
 * @param {string} text - Input text to split
 * @param {string} mode - 'word' or 'article'
 * @returns {string[]} Array of split items
 */
function splitText(text, mode) {
    if (mode === 'word') {
        // 詞語模式：按行分割，過濾空行
        return text.split('\n').map(s => s.trim()).filter(s => s !== '');
    } else {
        // 文章模式：使用 splitIntoSentences 函數
        return splitIntoSentences(text);
    }
}

/**
 * Split text into sentences based on punctuation
 * Matches the implementation in auto_dic.html
 * 
 * @param {string} text - Input text to split
 * @returns {string[]} Array of sentences
 */
function splitIntoSentences(text) {
    // 包含所有需要分割的標點符號，包括引號
    const punctuationPattern = /([。！？；，、．.!?;,：:「」""''（）\(\)])/g;
    const parts = text.split(punctuationPattern).filter(s => s !== '');
    
    const sentences = [];
    let currentSentence = '';
    
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        
        // 檢查是否為標點符號
        if (/^[。！？；，、．.!?;,：:「」""''（）\(\)]$/.test(part)) {
            // 將標點符號加到當前句子
            currentSentence += part;
            
            // 在這些標點符號後分割句子
            if (currentSentence.trim() !== '') {
                sentences.push(currentSentence.trim());
                currentSentence = '';
            }
        } else {
            // 普通文字
            currentSentence += part;
        }
    }
    
    // 處理最後剩餘的文字
    if (currentSentence.trim() !== '') {
        sentences.push(currentSentence.trim());
    }
    
    return sentences;
}

// ===== Custom Arbitraries =====

/**
 * Generate non-empty lines for word mode testing
 * Generates strings without newlines that can be used as individual words/lines
 */
const nonEmptyLineArb = fc.string({ minLength: 1, maxLength: 50 })
    .filter(s => s.trim().length > 0 && !s.includes('\n'));

/**
 * Generate multi-line text for word mode
 * Creates text with multiple lines separated by newlines
 */
const multiLineTextArb = fc.array(nonEmptyLineArb, { minLength: 1, maxLength: 20 })
    .map(lines => lines.join('\n'));

/**
 * Generate Chinese characters for more realistic testing
 */
const chineseCharArb = fc.integer({ min: 0x4E00, max: 0x9FFF })
    .map(code => String.fromCharCode(code));

/**
 * Generate Chinese word (1-4 characters)
 */
const chineseWordArb = fc.array(chineseCharArb, { minLength: 1, maxLength: 4 })
    .map(chars => chars.join(''));

/**
 * Generate Chinese sentence with punctuation
 */
const chineseSentenceArb = fc.tuple(
    fc.array(chineseWordArb, { minLength: 1, maxLength: 10 }),
    fc.constantFrom('。', '！', '？', '，', '；')
).map(([words, punct]) => words.join('') + punct);

/**
 * Generate article text (multiple sentences)
 */
const articleTextArb = fc.array(chineseSentenceArb, { minLength: 1, maxLength: 10 })
    .map(sentences => sentences.join(''));

// ===== Property Tests =====

describe('Property 1: Text Content Preservation (Round-Trip)', () => {
    /**
     * Feature: text-highlight-during-speech, Property 1: Text Content Preservation
     * 
     * *For any* input text in the textarea, when switching to display mode 
     * and back to edit mode, the textarea content SHALL remain identical 
     * to the original input.
     * 
     * **Validates: Requirements 1.4, 6.3**
     */
    
    let textarea;
    let displayContainer;
    let originalContent;
    
    // Simulate HighlightManager state
    let highlightState = {
        isDisplayMode: false,
        items: [],
        mode: null
    };
    
    function switchToDisplayMode(text, mode) {
        const items = splitText(text, mode);
        if (items.length === 0) return false;
        
        // Store original content
        originalContent = textarea.value;
        
        // Hide textarea
        textarea.classList.add('hidden');
        
        // Create display container
        displayContainer = document.getElementById('textDisplayContainer');
        if (!displayContainer) {
            displayContainer = document.createElement('div');
            displayContainer.id = 'textDisplayContainer';
            textarea.parentNode.insertBefore(displayContainer, textarea.nextSibling);
        }
        
        displayContainer.className = `text-display-container ${mode === 'word' ? 'word-mode' : 'article-mode'}`;
        displayContainer.innerHTML = '';
        
        items.forEach((item, index) => {
            const span = document.createElement('span');
            span.className = 'highlight-item';
            span.setAttribute('data-index', index);
            span.textContent = item;
            displayContainer.appendChild(span);
        });
        
        displayContainer.classList.remove('hidden');
        
        highlightState.isDisplayMode = true;
        highlightState.items = items;
        highlightState.mode = mode;
        
        return true;
    }
    
    function switchToEditMode() {
        if (displayContainer) {
            displayContainer.classList.add('hidden');
        }
        
        if (textarea) {
            textarea.classList.remove('hidden');
            // Content should be preserved - we don't modify textarea.value
        }
        
        highlightState.isDisplayMode = false;
        highlightState.items = [];
        highlightState.mode = null;
    }
    
    beforeEach(() => {
        document.body.innerHTML = `
            <div id="test-container">
                <textarea id="words"></textarea>
            </div>
        `;
        textarea = document.getElementById('words');
        displayContainer = null;
        highlightState = { isDisplayMode: false, items: [], mode: null };
    });
    
    afterEach(() => {
        document.body.innerHTML = '';
    });
    
    it('should preserve text content after round-trip in word mode', () => {
        fc.assert(
            fc.property(multiLineTextArb, (text) => {
                // Set initial content
                textarea.value = text;
                
                // Switch to display mode
                const switched = switchToDisplayMode(text, 'word');
                
                if (switched) {
                    // Switch back to edit mode
                    switchToEditMode();
                    
                    // Verify content is preserved
                    return textarea.value === text;
                }
                
                // If no switch happened (empty text after split), content should still be preserved
                return textarea.value === text;
            }),
            { numRuns: 100 }
        );
    });
    
    it('should preserve text content after round-trip in article mode', () => {
        fc.assert(
            fc.property(articleTextArb, (text) => {
                // Set initial content
                textarea.value = text;
                
                // Switch to display mode
                const switched = switchToDisplayMode(text, 'article');
                
                if (switched) {
                    // Switch back to edit mode
                    switchToEditMode();
                    
                    // Verify content is preserved
                    return textarea.value === text;
                }
                
                return textarea.value === text;
            }),
            { numRuns: 100 }
        );
    });
    
    it('should preserve arbitrary string content after round-trip', () => {
        fc.assert(
            fc.property(
                fc.string({ minLength: 1, maxLength: 500 }),
                fc.constantFrom('word', 'article'),
                (text, mode) => {
                    // Set initial content
                    textarea.value = text;
                    const originalValue = text;
                    
                    // Switch to display mode
                    switchToDisplayMode(text, mode);
                    
                    // Switch back to edit mode
                    switchToEditMode();
                    
                    // Verify content is preserved
                    return textarea.value === originalValue;
                }
            ),
            { numRuns: 100 }
        );
    });
});


describe('Property 2: Text Segmentation Correctness', () => {
    /**
     * Feature: text-highlight-during-speech, Property 2: Text Segmentation Correctness
     * 
     * *For any* multi-line text in Word_Mode, the number of highlightable elements 
     * SHALL equal the number of non-empty lines in the input text.
     * 
     * *For any* text with multiple sentences in Article_Mode, the number of 
     * highlightable elements SHALL equal the number of sentences detected 
     * by the sentence splitter.
     * 
     * **Validates: Requirements 1.2, 1.3**
     */
    
    it('word mode: split count equals non-empty line count', () => {
        fc.assert(
            fc.property(
                fc.array(fc.string({ maxLength: 50 }), { minLength: 0, maxLength: 30 }),
                (lines) => {
                    const text = lines.join('\n');
                    const result = splitText(text, 'word');
                    
                    // Count non-empty lines (after trim)
                    const expectedCount = lines.filter(line => line.trim() !== '').length;
                    
                    return result.length === expectedCount;
                }
            ),
            { numRuns: 100 }
        );
    });
    
    it('word mode: each result item is non-empty and trimmed', () => {
        fc.assert(
            fc.property(multiLineTextArb, (text) => {
                const result = splitText(text, 'word');
                
                // All items should be non-empty and trimmed
                return result.every(item => 
                    item.length > 0 && 
                    item === item.trim()
                );
            }),
            { numRuns: 100 }
        );
    });
    
    it('word mode: preserves content (joined result contains all non-empty lines)', () => {
        fc.assert(
            fc.property(
                fc.array(nonEmptyLineArb, { minLength: 1, maxLength: 20 }),
                (lines) => {
                    const text = lines.join('\n');
                    const result = splitText(text, 'word');
                    
                    // Each original line (trimmed) should appear in result
                    const trimmedLines = lines.map(l => l.trim()).filter(l => l !== '');
                    
                    return trimmedLines.length === result.length &&
                           trimmedLines.every((line, i) => result[i] === line);
                }
            ),
            { numRuns: 100 }
        );
    });
    
    it('article mode: split produces non-empty segments', () => {
        fc.assert(
            fc.property(articleTextArb, (text) => {
                const result = splitText(text, 'article');
                
                // All segments should be non-empty
                return result.every(segment => segment.trim().length > 0);
            }),
            { numRuns: 100 }
        );
    });
    
    it('article mode: concatenated segments preserve all characters', () => {
        fc.assert(
            fc.property(articleTextArb, (text) => {
                const result = splitText(text, 'article');
                
                // Joining all segments should give us back all non-whitespace content
                const joinedResult = result.join('');
                const normalizedOriginal = text.replace(/\s+/g, '');
                const normalizedResult = joinedResult.replace(/\s+/g, '');
                
                return normalizedResult === normalizedOriginal;
            }),
            { numRuns: 100 }
        );
    });
    
    it('article mode: each sentence ends with punctuation or is the last segment', () => {
        fc.assert(
            fc.property(articleTextArb, (text) => {
                const result = splitText(text, 'article');
                const punctuationPattern = /[。！？；，、．.!?;,：:「」""''（）\(\)]$/;
                
                // All segments except possibly the last should end with punctuation
                // (last segment might not have punctuation if original text didn't end with one)
                return result.slice(0, -1).every(segment => 
                    punctuationPattern.test(segment)
                );
            }),
            { numRuns: 100 }
        );
    });
});

describe('Property 6: Mode Switching Correctness', () => {
    /**
     * Feature: text-highlight-during-speech, Property 6: Mode Switching Correctness
     * 
     * *For any* dictation state transition:
     * - When dictation starts: textarea SHALL be hidden AND displayContainer SHALL be visible
     * - When dictation stops: textarea SHALL be visible AND displayContainer SHALL be hidden
     * 
     * **Validates: Requirements 6.1, 6.2**
     */
    
    let textarea;
    let displayContainer;
    
    function switchToDisplayMode(text, mode) {
        const items = splitText(text, mode);
        if (items.length === 0) return false;
        
        textarea.classList.add('hidden');
        
        displayContainer = document.getElementById('textDisplayContainer');
        if (!displayContainer) {
            displayContainer = document.createElement('div');
            displayContainer.id = 'textDisplayContainer';
            textarea.parentNode.insertBefore(displayContainer, textarea.nextSibling);
        }
        
        displayContainer.className = `text-display-container ${mode === 'word' ? 'word-mode' : 'article-mode'}`;
        displayContainer.innerHTML = '';
        
        items.forEach((item, index) => {
            const span = document.createElement('span');
            span.className = 'highlight-item';
            span.setAttribute('data-index', index);
            span.textContent = item;
            displayContainer.appendChild(span);
        });
        
        displayContainer.classList.remove('hidden');
        return true;
    }
    
    function switchToEditMode() {
        displayContainer = document.getElementById('textDisplayContainer');
        if (displayContainer) {
            displayContainer.classList.add('hidden');
        }
        
        if (textarea) {
            textarea.classList.remove('hidden');
        }
    }
    
    beforeEach(() => {
        document.body.innerHTML = `
            <div id="test-container">
                <textarea id="words"></textarea>
            </div>
        `;
        textarea = document.getElementById('words');
        displayContainer = null;
    });
    
    afterEach(() => {
        document.body.innerHTML = '';
    });
    
    it('display mode: textarea hidden AND displayContainer visible', () => {
        fc.assert(
            fc.property(
                multiLineTextArb,
                fc.constantFrom('word', 'article'),
                (text, mode) => {
                    textarea.value = text;
                    
                    const switched = switchToDisplayMode(text, mode);
                    
                    if (switched) {
                        const container = document.getElementById('textDisplayContainer');
                        
                        // Textarea should be hidden
                        const textareaHidden = textarea.classList.contains('hidden');
                        
                        // Display container should exist and be visible
                        const containerVisible = container !== null && 
                                                !container.classList.contains('hidden');
                        
                        return textareaHidden && containerVisible;
                    }
                    
                    // If not switched (empty content), textarea should remain visible
                    return !textarea.classList.contains('hidden');
                }
            ),
            { numRuns: 100 }
        );
    });
    
    it('edit mode: textarea visible AND displayContainer hidden', () => {
        fc.assert(
            fc.property(
                multiLineTextArb,
                fc.constantFrom('word', 'article'),
                (text, mode) => {
                    textarea.value = text;
                    
                    // First switch to display mode
                    const switched = switchToDisplayMode(text, mode);
                    
                    if (switched) {
                        // Then switch back to edit mode
                        switchToEditMode();
                        
                        const container = document.getElementById('textDisplayContainer');
                        
                        // Textarea should be visible
                        const textareaVisible = !textarea.classList.contains('hidden');
                        
                        // Display container should be hidden
                        const containerHidden = container === null || 
                                               container.classList.contains('hidden');
                        
                        return textareaVisible && containerHidden;
                    }
                    
                    return true; // No switch happened, test passes
                }
            ),
            { numRuns: 100 }
        );
    });
    
    it('mode switching is idempotent: multiple switches maintain correct state', () => {
        fc.assert(
            fc.property(
                multiLineTextArb,
                fc.constantFrom('word', 'article'),
                fc.integer({ min: 1, max: 5 }),
                (text, mode, switchCount) => {
                    textarea.value = text;
                    
                    // Perform multiple round-trips
                    for (let i = 0; i < switchCount; i++) {
                        switchToDisplayMode(text, mode);
                        switchToEditMode();
                    }
                    
                    // After all switches, should be in edit mode
                    const textareaVisible = !textarea.classList.contains('hidden');
                    const container = document.getElementById('textDisplayContainer');
                    const containerHidden = container === null || 
                                           container.classList.contains('hidden');
                    
                    return textareaVisible && containerHidden;
                }
            ),
            { numRuns: 100 }
        );
    });
    
    it('display mode creates correct number of highlight items', () => {
        fc.assert(
            fc.property(multiLineTextArb, (text) => {
                textarea.value = text;
                
                const switched = switchToDisplayMode(text, 'word');
                
                if (switched) {
                    const container = document.getElementById('textDisplayContainer');
                    const items = container.querySelectorAll('.highlight-item');
                    const expectedItems = splitText(text, 'word');
                    
                    return items.length === expectedItems.length;
                }
                
                return true;
            }),
            { numRuns: 100 }
        );
    });
    
    it('display mode sets correct data-index attributes', () => {
        fc.assert(
            fc.property(multiLineTextArb, (text) => {
                textarea.value = text;
                
                const switched = switchToDisplayMode(text, 'word');
                
                if (switched) {
                    const container = document.getElementById('textDisplayContainer');
                    const items = container.querySelectorAll('.highlight-item');
                    
                    // Each item should have correct sequential data-index
                    return Array.from(items).every((item, index) => 
                        item.getAttribute('data-index') === String(index)
                    );
                }
                
                return true;
            }),
            { numRuns: 100 }
        );
    });
});
