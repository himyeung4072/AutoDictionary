/**
 * Unit Tests for HighlightManager
 * Feature: text-highlight-during-speech
 * 
 * These tests validate the splitText() method and DOM operations
 * as specified in the design document.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

// ===== Extract pure functions for testing =====

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

// ===== Task 5.1: Tests for splitText() method =====

describe('splitText() Method - Word Mode', () => {
    /**
     * Tests for word mode line splitting
     * _Requirements: 1.2_
     */
    
    it('should split text by lines in word mode', () => {
        const text = '蘋果\n香蕉\n橙子';
        const result = splitText(text, 'word');
        
        expect(result).toEqual(['蘋果', '香蕉', '橙子']);
    });

    it('should filter empty lines in word mode', () => {
        const text = '蘋果\n\n香蕉\n\n\n橙子';
        const result = splitText(text, 'word');
        
        expect(result).toEqual(['蘋果', '香蕉', '橙子']);
    });

    it('should trim whitespace from each line', () => {
        const text = '  蘋果  \n  香蕉  \n  橙子  ';
        const result = splitText(text, 'word');
        
        expect(result).toEqual(['蘋果', '香蕉', '橙子']);
    });

    it('should return empty array for empty string', () => {
        const result = splitText('', 'word');
        
        expect(result).toEqual([]);
    });

    it('should return empty array for whitespace-only string', () => {
        const result = splitText('   \n   \n   ', 'word');
        
        expect(result).toEqual([]);
    });

    it('should handle single line without newline', () => {
        const result = splitText('蘋果', 'word');
        
        expect(result).toEqual(['蘋果']);
    });

    it('should handle lines with only whitespace', () => {
        const text = '蘋果\n   \n香蕉\n\t\n橙子';
        const result = splitText(text, 'word');
        
        expect(result).toEqual(['蘋果', '香蕉', '橙子']);
    });

    it('should handle mixed Chinese and English words', () => {
        const text = 'Apple\n蘋果\nBanana\n香蕉';
        const result = splitText(text, 'word');
        
        expect(result).toEqual(['Apple', '蘋果', 'Banana', '香蕉']);
    });

    it('should preserve special characters within lines', () => {
        const text = '蘋果！\n香蕉？\n橙子。';
        const result = splitText(text, 'word');
        
        expect(result).toEqual(['蘋果！', '香蕉？', '橙子。']);
    });
});

describe('splitText() Method - Article Mode', () => {
    /**
     * Tests for article mode sentence splitting
     * _Requirements: 1.3_
     */
    
    it('should split text by Chinese punctuation', () => {
        const text = '今天天氣很好。我們一起去公園玩吧！';
        const result = splitText(text, 'article');
        
        expect(result).toEqual(['今天天氣很好。', '我們一起去公園玩吧！']);
    });

    it('should split text by comma', () => {
        const text = '蘋果，香蕉，橙子';
        const result = splitText(text, 'article');
        
        expect(result).toEqual(['蘋果，', '香蕉，', '橙子']);
    });

    it('should handle question marks', () => {
        const text = '你好嗎？我很好。';
        const result = splitText(text, 'article');
        
        expect(result).toEqual(['你好嗎？', '我很好。']);
    });

    it('should handle semicolons', () => {
        const text = '第一點；第二點；第三點';
        const result = splitText(text, 'article');
        
        expect(result).toEqual(['第一點；', '第二點；', '第三點']);
    });

    it('should handle English punctuation', () => {
        const text = 'Hello. How are you? I am fine!';
        const result = splitText(text, 'article');
        
        expect(result).toEqual(['Hello.', 'How are you?', 'I am fine!']);
    });

    it('should handle mixed Chinese and English punctuation', () => {
        const text = '你好。Hello!再見。';
        const result = splitText(text, 'article');
        
        expect(result).toEqual(['你好。', 'Hello!', '再見。']);
    });

    it('should return empty array for empty string', () => {
        const result = splitText('', 'article');
        
        expect(result).toEqual([]);
    });

    it('should handle text without punctuation', () => {
        const text = '這是一段沒有標點符號的文字';
        const result = splitText(text, 'article');
        
        expect(result).toEqual(['這是一段沒有標點符號的文字']);
    });

    it('should handle quotation marks', () => {
        const text = '他說「你好」我說「再見」';
        const result = splitText(text, 'article');
        
        expect(result).toEqual(['他說「', '你好」', '我說「', '再見」']);
    });

    it('should handle parentheses', () => {
        const text = '這是（括號內容）外面的文字';
        const result = splitText(text, 'article');
        
        expect(result).toEqual(['這是（', '括號內容）', '外面的文字']);
    });

    it('should handle colons', () => {
        const text = '注意：這是重點。';
        const result = splitText(text, 'article');
        
        expect(result).toEqual(['注意：', '這是重點。']);
    });
});

describe('splitText() Method - Edge Cases', () => {
    /**
     * Tests for boundary conditions and special characters
     * _Requirements: 1.2, 1.3_
     */
    
    it('should handle consecutive punctuation marks', () => {
        const text = '真的嗎？！太好了！！';
        const result = splitText(text, 'article');
        
        // Each punctuation creates a split point
        expect(result.length).toBeGreaterThan(0);
        expect(result.join('')).toContain('真的嗎');
    });

    it('should handle newlines in article mode', () => {
        const text = '第一行。\n第二行。';
        const result = splitText(text, 'article');
        
        expect(result).toEqual(['第一行。', '第二行。']);
    });

    it('should handle tabs and spaces', () => {
        const text = '蘋果\t香蕉  橙子';
        const result = splitText(text, 'word');
        
        // In word mode, this is a single line
        expect(result).toEqual(['蘋果\t香蕉  橙子']);
    });

    it('should handle Unicode characters', () => {
        const text = '日本語。한국어。中文。';
        const result = splitText(text, 'article');
        
        expect(result).toEqual(['日本語。', '한국어。', '中文。']);
    });

    it('should handle numbers', () => {
        const text = '123\n456\n789';
        const result = splitText(text, 'word');
        
        expect(result).toEqual(['123', '456', '789']);
    });

    it('should handle very long lines', () => {
        const longWord = '很長的詞語'.repeat(100);
        const text = `${longWord}\n短詞`;
        const result = splitText(text, 'word');
        
        expect(result.length).toBe(2);
        expect(result[0]).toBe(longWord);
        expect(result[1]).toBe('短詞');
    });

    it('should handle Windows-style line endings (CRLF)', () => {
        const text = '蘋果\r\n香蕉\r\n橙子';
        const result = splitText(text, 'word');
        
        // After trim, should work correctly
        expect(result.length).toBe(3);
    });
});


// ===== Task 5.2: Tests for DOM Operations =====

describe('switchToDisplayMode() - DOM Structure', () => {
    /**
     * Tests for DOM structure when switching to display mode
     * _Requirements: 6.2_
     */
    
    let textarea;
    let container;
    
    beforeEach(() => {
        // Set up DOM structure
        document.body.innerHTML = `
            <div id="test-container">
                <textarea id="words" placeholder="蘋果&#10;香蕉"></textarea>
            </div>
        `;
        textarea = document.getElementById('words');
        container = document.getElementById('test-container');
    });
    
    afterEach(() => {
        // Clean up DOM
        document.body.innerHTML = '';
    });
    
    // Helper function to simulate switchToDisplayMode
    function switchToDisplayMode(text, mode) {
        const items = splitText(text, mode);
        if (items.length === 0) return false;
        
        // Hide textarea
        textarea.classList.add('hidden');
        
        // Create display container
        let displayContainer = document.getElementById('textDisplayContainer');
        if (!displayContainer) {
            displayContainer = document.createElement('div');
            displayContainer.id = 'textDisplayContainer';
            textarea.parentNode.insertBefore(displayContainer, textarea.nextSibling);
        }
        
        // Set container attributes
        displayContainer.className = `text-display-container ${mode === 'word' ? 'word-mode' : 'article-mode'}`;
        displayContainer.setAttribute('role', 'region');
        displayContainer.setAttribute('aria-label', '朗讀文字區域');
        displayContainer.setAttribute('aria-live', 'polite');
        
        // Create highlight items
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
    
    it('should hide textarea when switching to display mode', () => {
        switchToDisplayMode('蘋果\n香蕉', 'word');
        
        expect(textarea.classList.contains('hidden')).toBe(true);
    });
    
    it('should create display container with correct id', () => {
        switchToDisplayMode('蘋果\n香蕉', 'word');
        
        const displayContainer = document.getElementById('textDisplayContainer');
        expect(displayContainer).not.toBeNull();
    });
    
    it('should set word-mode class for word mode', () => {
        switchToDisplayMode('蘋果\n香蕉', 'word');
        
        const displayContainer = document.getElementById('textDisplayContainer');
        expect(displayContainer.classList.contains('word-mode')).toBe(true);
        expect(displayContainer.classList.contains('article-mode')).toBe(false);
    });
    
    it('should set article-mode class for article mode', () => {
        switchToDisplayMode('今天天氣很好。明天也會很好。', 'article');
        
        const displayContainer = document.getElementById('textDisplayContainer');
        expect(displayContainer.classList.contains('article-mode')).toBe(true);
        expect(displayContainer.classList.contains('word-mode')).toBe(false);
    });
    
    it('should set correct ARIA attributes', () => {
        switchToDisplayMode('蘋果\n香蕉', 'word');
        
        const displayContainer = document.getElementById('textDisplayContainer');
        expect(displayContainer.getAttribute('role')).toBe('region');
        expect(displayContainer.getAttribute('aria-label')).toBe('朗讀文字區域');
        expect(displayContainer.getAttribute('aria-live')).toBe('polite');
    });
    
    it('should create correct number of highlight items', () => {
        switchToDisplayMode('蘋果\n香蕉\n橙子', 'word');
        
        const displayContainer = document.getElementById('textDisplayContainer');
        const items = displayContainer.querySelectorAll('.highlight-item');
        expect(items.length).toBe(3);
    });
    
    it('should set data-index attribute on each item', () => {
        switchToDisplayMode('蘋果\n香蕉\n橙子', 'word');
        
        const displayContainer = document.getElementById('textDisplayContainer');
        const items = displayContainer.querySelectorAll('.highlight-item');
        
        items.forEach((item, index) => {
            expect(item.getAttribute('data-index')).toBe(String(index));
        });
    });
    
    it('should set correct text content for each item', () => {
        switchToDisplayMode('蘋果\n香蕉\n橙子', 'word');
        
        const displayContainer = document.getElementById('textDisplayContainer');
        const items = displayContainer.querySelectorAll('.highlight-item');
        
        expect(items[0].textContent).toBe('蘋果');
        expect(items[1].textContent).toBe('香蕉');
        expect(items[2].textContent).toBe('橙子');
    });
    
    it('should return false for empty text', () => {
        const result = switchToDisplayMode('', 'word');
        
        expect(result).toBe(false);
    });
    
    it('should return true for valid text', () => {
        const result = switchToDisplayMode('蘋果\n香蕉', 'word');
        
        expect(result).toBe(true);
    });
});

describe('switchToEditMode() - Cleanup Behavior', () => {
    /**
     * Tests for cleanup behavior when switching back to edit mode
     * _Requirements: 6.3_
     */
    
    let textarea;
    let displayContainer;
    
    beforeEach(() => {
        // Set up DOM structure with display container already present
        document.body.innerHTML = `
            <div id="test-container">
                <textarea id="words" class="hidden" placeholder="蘋果&#10;香蕉">蘋果
香蕉
橙子</textarea>
                <div id="textDisplayContainer" class="text-display-container word-mode"
                     role="region" aria-label="朗讀文字區域" aria-live="polite">
                    <span class="highlight-item" data-index="0">蘋果</span>
                    <span class="highlight-item active" data-index="1">香蕉</span>
                    <span class="highlight-item" data-index="2">橙子</span>
                </div>
            </div>
        `;
        textarea = document.getElementById('words');
        displayContainer = document.getElementById('textDisplayContainer');
    });
    
    afterEach(() => {
        // Clean up DOM
        document.body.innerHTML = '';
    });
    
    // Helper function to simulate switchToEditMode
    function switchToEditMode() {
        // Hide display container
        if (displayContainer) {
            displayContainer.classList.add('hidden');
        }
        
        // Show textarea
        if (textarea) {
            textarea.classList.remove('hidden');
        }
    }
    
    it('should show textarea when switching to edit mode', () => {
        expect(textarea.classList.contains('hidden')).toBe(true);
        
        switchToEditMode();
        
        expect(textarea.classList.contains('hidden')).toBe(false);
    });
    
    it('should hide display container when switching to edit mode', () => {
        expect(displayContainer.classList.contains('hidden')).toBe(false);
        
        switchToEditMode();
        
        expect(displayContainer.classList.contains('hidden')).toBe(true);
    });
    
    it('should preserve textarea content after switching modes', () => {
        const originalContent = textarea.value;
        
        switchToEditMode();
        
        expect(textarea.value).toBe(originalContent);
    });
});

describe('highlightItem() - Highlight Behavior', () => {
    /**
     * Tests for highlight item behavior
     * _Requirements: 2.1, 2.2_
     */
    
    let displayContainer;
    
    beforeEach(() => {
        // Set up DOM structure with display container
        document.body.innerHTML = `
            <div id="textDisplayContainer" class="text-display-container word-mode"
                 role="region" aria-label="朗讀文字區域" aria-live="polite">
                <span class="highlight-item" data-index="0">蘋果</span>
                <span class="highlight-item" data-index="1">香蕉</span>
                <span class="highlight-item" data-index="2">橙子</span>
            </div>
        `;
        displayContainer = document.getElementById('textDisplayContainer');
    });
    
    afterEach(() => {
        document.body.innerHTML = '';
    });
    
    // Helper function to simulate highlightItem
    function highlightItem(index, itemCount) {
        if (index < 0 || index >= itemCount) return;
        
        // Clear previous highlight
        const activeItems = displayContainer.querySelectorAll('.highlight-item.active');
        activeItems.forEach(item => item.classList.remove('active'));
        
        // Add new highlight
        const item = displayContainer.querySelector(`[data-index="${index}"]`);
        if (item) {
            item.classList.add('active');
        }
    }
    
    it('should add active class to highlighted item', () => {
        highlightItem(0, 3);
        
        const item = displayContainer.querySelector('[data-index="0"]');
        expect(item.classList.contains('active')).toBe(true);
    });
    
    it('should remove active class from previous item when highlighting new item', () => {
        highlightItem(0, 3);
        highlightItem(1, 3);
        
        const item0 = displayContainer.querySelector('[data-index="0"]');
        const item1 = displayContainer.querySelector('[data-index="1"]');
        
        expect(item0.classList.contains('active')).toBe(false);
        expect(item1.classList.contains('active')).toBe(true);
    });
    
    it('should only have one active item at a time', () => {
        highlightItem(0, 3);
        highlightItem(1, 3);
        highlightItem(2, 3);
        
        const activeItems = displayContainer.querySelectorAll('.highlight-item.active');
        expect(activeItems.length).toBe(1);
    });
    
    it('should not highlight item with negative index', () => {
        highlightItem(-1, 3);
        
        const activeItems = displayContainer.querySelectorAll('.highlight-item.active');
        expect(activeItems.length).toBe(0);
    });
    
    it('should not highlight item with index out of bounds', () => {
        highlightItem(5, 3);
        
        const activeItems = displayContainer.querySelectorAll('.highlight-item.active');
        expect(activeItems.length).toBe(0);
    });
});

describe('clearHighlight() - Clear Behavior', () => {
    /**
     * Tests for clearing highlight behavior
     * _Requirements: 2.2, 4.1_
     */
    
    let displayContainer;
    
    beforeEach(() => {
        // Set up DOM structure with an active highlight
        document.body.innerHTML = `
            <div id="textDisplayContainer" class="text-display-container word-mode">
                <span class="highlight-item" data-index="0">蘋果</span>
                <span class="highlight-item active" data-index="1">香蕉</span>
                <span class="highlight-item" data-index="2">橙子</span>
            </div>
        `;
        displayContainer = document.getElementById('textDisplayContainer');
    });
    
    afterEach(() => {
        document.body.innerHTML = '';
    });
    
    // Helper function to simulate clearHighlight
    function clearHighlight() {
        const activeItems = displayContainer.querySelectorAll('.highlight-item.active');
        activeItems.forEach(item => item.classList.remove('active'));
    }
    
    it('should remove active class from all items', () => {
        // Verify there's an active item initially
        expect(displayContainer.querySelectorAll('.highlight-item.active').length).toBe(1);
        
        clearHighlight();
        
        const activeItems = displayContainer.querySelectorAll('.highlight-item.active');
        expect(activeItems.length).toBe(0);
    });
    
    it('should not affect non-active items', () => {
        clearHighlight();
        
        const allItems = displayContainer.querySelectorAll('.highlight-item');
        expect(allItems.length).toBe(3);
    });
    
    it('should handle case with no active items', () => {
        // Clear first
        clearHighlight();
        
        // Clear again - should not throw
        expect(() => clearHighlight()).not.toThrow();
        
        const activeItems = displayContainer.querySelectorAll('.highlight-item.active');
        expect(activeItems.length).toBe(0);
    });
});
