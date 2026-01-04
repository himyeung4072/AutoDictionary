/**
 * Article Segment Splitter Module
 * 
 * This module provides the splitArticleSegments function that splits text
 * BEFORE each punctuation mark, returning an array of segments.
 * 
 * Feature: speech-rules-redesign
 * Requirements: 4.1, 4.2, 4.3, 4.4
 */

// 標點符號正則表達式 - 匹配中英文標點符號（包含單引號）
// Based on design document: PUNCTUATION_PATTERN
// Includes: Chinese punctuation (。！？；，、：「」""''（）) and English punctuation (.!?;,:()—–)
const PUNCTUATION_PATTERN = /[。！？；，、．.!?;,：:「」\u201C\u201D\u2018\u2019（）\(\)—–]/;

// 英文模式下的標點符號正則表達式 - 不包含單引號（用於所有格和縮寫如 King's, don't）
const PUNCTUATION_PATTERN_ENGLISH = /[。！？；，、．.!?;,：:「」\u201C\u201D（）\(\)—–]/;

/**
 * 檢測文字是否包含中文字符
 * @param {string} text - 要檢查的文字
 * @returns {boolean} - 是否包含中文字符
 */
function containsChinese(text) {
    // 使用 Unicode 範圍檢測中文字符
    // CJK Unified Ideographs: \u4e00-\u9fff
    const chinesePattern = /[\u4e00-\u9fff]/;
    return chinesePattern.test(text);
}

/**
 * Segment 類型定義
 * @typedef {Object} Segment
 * @property {'text'|'punct'} type - 段落類型
 * @property {string} content - 段落內容
 */

/**
 * 將文章在標點符號「前」分割成 segments
 * 
 * Requirements:
 * - 4.1: Split text BEFORE each punctuation mark (not after)
 * - 4.2: Treat each text segment (before punctuation) as a sentence unit
 * - 4.3: Treat each punctuation mark as a separate speech unit
 * - 4.4: Treat consecutive punctuation marks as separate units
 * 
 * Note: For English text, single quotes (' \u2018 \u2019) are NOT treated as
 * punctuation to preserve possessives (King's) and contractions (don't).
 * 
 * @param {string} text - 要分割的文章文字
 * @returns {Segment[]} - 分割後的 segments 陣列
 * 
 * @example
 * splitArticleSegments('星期天，爸爸說：「我們一起去公園。」')
 * // Returns:
 * // [
 * //   { type: 'text', content: '星期天' },
 * //   { type: 'punct', content: '，' },
 * //   { type: 'text', content: '爸爸說' },
 * //   { type: 'punct', content: '：' },
 * //   { type: 'punct', content: '「' },
 * //   { type: 'text', content: '我們一起去公園' },
 * //   { type: 'punct', content: '。' },
 * //   { type: 'punct', content: '」' }
 * // ]
 */
function splitArticleSegments(text) {
    // Handle edge cases
    if (text === null || text === undefined) {
        return [];
    }
    
    if (typeof text !== 'string') {
        text = String(text);
    }
    
    if (text === '') {
        return [];
    }
    
    // 檢測是否為英文文字，如果是則不將單引號視為分隔符
    // 這樣可以正確處理 King's, don't 等英文所有格和縮寫
    const isEnglish = !containsChinese(text);
    const punctPattern = isEnglish ? PUNCTUATION_PATTERN_ENGLISH : PUNCTUATION_PATTERN;
    
    const segments = [];
    let currentText = '';
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        
        if (punctPattern.test(char)) {
            // If we have accumulated text, add it as a text segment
            if (currentText.length > 0) {
                segments.push({ type: 'text', content: currentText });
                currentText = '';
            }
            // Add the punctuation as its own segment
            segments.push({ type: 'punct', content: char });
        } else {
            // Accumulate non-punctuation characters
            currentText += char;
        }
    }
    
    // Don't forget any remaining text at the end
    if (currentText.length > 0) {
        segments.push({ type: 'text', content: currentText });
    }
    
    return segments;
}

// Export for testing
export { splitArticleSegments, PUNCTUATION_PATTERN, PUNCTUATION_PATTERN_ENGLISH, containsChinese };
