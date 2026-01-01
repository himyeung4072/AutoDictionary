/**
 * Full Read Announcement Message Module
 * 
 * This module provides the getFullReadAnnouncementMessage function that returns
 * the appropriate announcement message based on the language code.
 * 
 * Feature: auto-complete-full-read
 * Requirements: 2.1, 2.2, 2.3
 */

/**
 * 根據語言取得完整朗讀提示訊息
 * 
 * Requirements:
 * - 2.1: zh-HK (粵語) returns "所有內容朗讀完畢，現在會完整朗讀一次"
 * - 2.2: zh-CN (普通話) returns "所有内容朗读完毕，现在会完整朗读一次"
 * - 2.3: en-GB (英語) returns "All content has been read aloud; now it will be read aloud in full once."
 * 
 * @param {string} lang - 語言代碼 (zh-HK, zh-CN, en-GB)
 * @returns {string} 提示訊息
 * 
 * @example
 * getFullReadAnnouncementMessage('zh-HK')
 * // Returns: '所有內容朗讀完畢，現在會完整朗讀一次'
 * 
 * getFullReadAnnouncementMessage('en-GB')
 * // Returns: 'All content has been read aloud; now it will be read aloud in full once.'
 * 
 * getFullReadAnnouncementMessage('invalid')
 * // Returns: '所有內容朗讀完畢，現在會完整朗讀一次' (default to zh-HK)
 */
function getFullReadAnnouncementMessage(lang) {
    const messages = {
        'zh-HK': '所有內容朗讀完畢，現在會完整朗讀一次',
        'zh-CN': '所有内容朗读完毕，现在会完整朗读一次',
        'en-GB': 'All content has been read aloud; now it will be read aloud in full once.'
    };
    // 使用 Object.hasOwn 避免原型鏈污染問題（如 valueOf, toString 等）
    return Object.hasOwn(messages, lang) ? messages[lang] : messages['zh-HK'];
}

// Supported languages for validation
const SUPPORTED_LANGUAGES = ['zh-HK', 'zh-CN', 'en-GB'];

// Expected messages for each language (for testing)
const EXPECTED_MESSAGES = {
    'zh-HK': '所有內容朗讀完畢，現在會完整朗讀一次',
    'zh-CN': '所有内容朗读完毕，现在会完整朗读一次',
    'en-GB': 'All content has been read aloud; now it will be read aloud in full once.'
};

// Export for testing
export { getFullReadAnnouncementMessage, SUPPORTED_LANGUAGES, EXPECTED_MESSAGES };
