/**
 * Unit Tests for splitArticleSegments function
 * 
 * Feature: speech-rules-redesign
 * Requirements: 4.1, 4.2, 4.3, 4.4
 */

import { describe, it, expect } from 'vitest';
import { splitArticleSegments, PUNCTUATION_PATTERN } from './split-article-segments.js';

describe('splitArticleSegments', () => {
    describe('Basic functionality', () => {
        it('should split text before punctuation marks', () => {
            const result = splitArticleSegments('星期天，爸爸說');
            expect(result).toEqual([
                { type: 'text', content: '星期天' },
                { type: 'punct', content: '，' },
                { type: 'text', content: '爸爸說' }
            ]);
        });

        it('should handle the example from design document', () => {
            const result = splitArticleSegments('星期天，爸爸說：「我們一起去公園。」');
            expect(result).toEqual([
                { type: 'text', content: '星期天' },
                { type: 'punct', content: '，' },
                { type: 'text', content: '爸爸說' },
                { type: 'punct', content: '：' },
                { type: 'punct', content: '「' },
                { type: 'text', content: '我們一起去公園' },
                { type: 'punct', content: '。' },
                { type: 'punct', content: '」' }
            ]);
        });

        it('should handle consecutive punctuation marks as separate segments', () => {
            const result = splitArticleSegments('好。」');
            expect(result).toEqual([
                { type: 'text', content: '好' },
                { type: 'punct', content: '。' },
                { type: 'punct', content: '」' }
            ]);
        });
    });

    describe('Edge cases', () => {
        it('should return empty array for empty string', () => {
            expect(splitArticleSegments('')).toEqual([]);
        });

        it('should return empty array for null', () => {
            expect(splitArticleSegments(null)).toEqual([]);
        });

        it('should return empty array for undefined', () => {
            expect(splitArticleSegments(undefined)).toEqual([]);
        });

        it('should handle text with no punctuation', () => {
            const result = splitArticleSegments('這是一段沒有標點的文字');
            expect(result).toEqual([
                { type: 'text', content: '這是一段沒有標點的文字' }
            ]);
        });

        it('should handle text starting with punctuation', () => {
            const result = splitArticleSegments('「開始」');
            expect(result).toEqual([
                { type: 'punct', content: '「' },
                { type: 'text', content: '開始' },
                { type: 'punct', content: '」' }
            ]);
        });

        it('should handle only punctuation marks', () => {
            const result = splitArticleSegments('。！？');
            expect(result).toEqual([
                { type: 'punct', content: '。' },
                { type: 'punct', content: '！' },
                { type: 'punct', content: '？' }
            ]);
        });
    });

    describe('English punctuation', () => {
        it('should handle English punctuation marks', () => {
            const result = splitArticleSegments('Hello, world!');
            expect(result).toEqual([
                { type: 'text', content: 'Hello' },
                { type: 'punct', content: ',' },
                { type: 'text', content: ' world' },
                { type: 'punct', content: '!' }
            ]);
        });

        it('should handle English sentence with period', () => {
            const result = splitArticleSegments('This is a test.');
            expect(result).toEqual([
                { type: 'text', content: 'This is a test' },
                { type: 'punct', content: '.' }
            ]);
        });
    });
});

describe('PUNCTUATION_PATTERN', () => {
    it('should match Chinese punctuation marks', () => {
        const chinesePunctuation = ['。', '！', '？', '；', '，', '、', '：', '「', '」', '\u201C', '\u201D', '\u2018', '\u2019', '（', '）'];
        chinesePunctuation.forEach(punct => {
            expect(PUNCTUATION_PATTERN.test(punct)).toBe(true);
        });
    });

    it('should match English punctuation marks', () => {
        const englishPunctuation = ['.', '!', '?', ';', ',', ':', '(', ')', '—', '–'];
        englishPunctuation.forEach(punct => {
            expect(PUNCTUATION_PATTERN.test(punct)).toBe(true);
        });
    });

    it('should not match regular characters', () => {
        const regularChars = ['a', 'Z', '中', '文', '1', '9', ' '];
        regularChars.forEach(char => {
            expect(PUNCTUATION_PATTERN.test(char)).toBe(false);
        });
    });
});
