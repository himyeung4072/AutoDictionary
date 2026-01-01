/**
 * Property-Based Tests for getFullReadAnnouncementMessage function
 * 
 * Feature: auto-complete-full-read
 * Property 2: Announcement Message Language Consistency
 * 
 * These tests validate correctness properties using fast-check
 * as specified in the design document.
 * 
 * Each test runs minimum 100 iterations as per testing strategy.
 * 
 * **Validates: Requirements 2.1, 2.2, 2.3**
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { getFullReadAnnouncementMessage, SUPPORTED_LANGUAGES, EXPECTED_MESSAGES } from './full-read-announcement.js';

// ===== Custom Arbitraries =====

/**
 * Generate supported language codes
 */
const supportedLanguageArb = fc.constantFrom(...SUPPORTED_LANGUAGES);

/**
 * Generate random strings that are NOT supported language codes
 */
const unsupportedLanguageArb = fc.string({ minLength: 1, maxLength: 10 })
    .filter(s => !SUPPORTED_LANGUAGES.includes(s));

/**
 * Generate any language code (supported or unsupported)
 */
const anyLanguageArb = fc.oneof(
    supportedLanguageArb,
    unsupportedLanguageArb
);

// ===== Property Tests =====

describe('Property 2: Announcement Message Language Consistency', () => {
    /**
     * Feature: auto-complete-full-read, Property 2: Announcement Message Language Consistency
     * 
     * *For any* supported language (zh-HK, zh-CN, en-GB), the announcement message 
     * returned by getFullReadAnnouncementMessage SHALL match the expected message 
     * for that language.
     * 
     * **Validates: Requirements 2.1, 2.2, 2.3**
     */

    it('Property 2.1: Supported languages should return their expected messages', () => {
        /**
         * Requirements 2.1, 2.2, 2.3: Each supported language returns its specific message
         */
        fc.assert(
            fc.property(
                supportedLanguageArb,
                (lang) => {
                    const message = getFullReadAnnouncementMessage(lang);
                    return message === EXPECTED_MESSAGES[lang];
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 2.2: Unsupported languages should return the default (zh-HK) message', () => {
        /**
         * Requirement: Invalid language returns default message
         */
        fc.assert(
            fc.property(
                unsupportedLanguageArb,
                (lang) => {
                    const message = getFullReadAnnouncementMessage(lang);
                    return message === EXPECTED_MESSAGES['zh-HK'];
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 2.3: Function should always return a non-empty string', () => {
        /**
         * Invariant: The function should always return a valid message
         */
        fc.assert(
            fc.property(
                anyLanguageArb,
                (lang) => {
                    const message = getFullReadAnnouncementMessage(lang);
                    return typeof message === 'string' && message.length > 0;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 2.4: Same language should always return the same message (idempotence)', () => {
        /**
         * Idempotence: Calling the function multiple times with the same input
         * should always return the same result
         */
        fc.assert(
            fc.property(
                anyLanguageArb,
                (lang) => {
                    const message1 = getFullReadAnnouncementMessage(lang);
                    const message2 = getFullReadAnnouncementMessage(lang);
                    const message3 = getFullReadAnnouncementMessage(lang);
                    return message1 === message2 && message2 === message3;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 2.5: zh-HK message should be in Traditional Chinese', () => {
        /**
         * Requirement 2.1: zh-HK returns Traditional Chinese message
         */
        const message = getFullReadAnnouncementMessage('zh-HK');
        // Traditional Chinese characters: 內容、現在、會、讀
        expect(message).toContain('內容');
        expect(message).toContain('現在');
        expect(message).toContain('會');
        expect(message).toContain('朗讀');
    });

    it('Property 2.6: zh-CN message should be in Simplified Chinese', () => {
        /**
         * Requirement 2.2: zh-CN returns Simplified Chinese message
         */
        const message = getFullReadAnnouncementMessage('zh-CN');
        // Simplified Chinese characters: 内容、现在、会、读
        expect(message).toContain('内容');
        expect(message).toContain('现在');
        expect(message).toContain('会');
        expect(message).toContain('朗读');
    });

    it('Property 2.7: en-GB message should be in English', () => {
        /**
         * Requirement 2.3: en-GB returns English message
         */
        const message = getFullReadAnnouncementMessage('en-GB');
        // English words
        expect(message).toContain('All content');
        expect(message).toContain('read aloud');
        expect(message).toContain('full once');
    });
});
