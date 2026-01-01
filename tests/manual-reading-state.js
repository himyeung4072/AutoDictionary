/**
 * ManualReadingState Module
 * 
 * This module provides the ManualReadingState object for managing manual reading mode state.
 * Extracted for testing purposes.
 * 
 * Requirements: 3.2, 4.2, 5.2, 5.3
 */

// Import splitArticleSegments for article mode
import { splitArticleSegments } from './split-article-segments.js';

/**
 * ManualReadingState - 管理手動朗讀模式的狀態
 */
const ManualReadingState = {
    // 朗讀模式: 'auto' | 'manual'
    readingMode: 'auto',
    
    // 當前朗讀索引
    currentIndex: -1,
    
    // 是否已開始朗讀
    hasStarted: false,
    
    // 是否正在朗讀中（語音合成進行中）
    isReading: false,
    
    // 分割後的項目陣列
    items: [],
    
    // 總項目數
    totalItems: 0,
    
    /**
     * 重置狀態
     * 將所有狀態恢復到初始值
     */
    reset() {
        this.currentIndex = -1;
        this.hasStarted = false;
        this.isReading = false;
        this.items = [];
        this.totalItems = 0;
    },
    
    /**
     * 初始化項目
     * @param {string} text - 要朗讀的文字
     * @param {string} mode - 朗讀模式 ('word' 或 'article')
     * @returns {string[]} - 分割後的項目陣列
     */
    initItems(text, mode) {
        if (mode === 'word') {
            // 詞語模式：按行分割
            this.items = text.split('\n').map(s => s.trim()).filter(s => s !== '');
        } else {
            // 文章模式：使用 splitArticleSegments，只取文字段落
            this.items = splitArticleSegments(text).filter(s => s.type === 'text').map(s => s.content);
        }
        this.totalItems = this.items.length;
        return this.items;
    },
    
    /**
     * 取得當前項目
     * @returns {string|null} - 當前項目內容，若索引無效則返回 null
     */
    getCurrentItem() {
        if (this.currentIndex >= 0 && this.currentIndex < this.items.length) {
            return this.items[this.currentIndex];
        }
        return null;
    },
    
    /**
     * 移動到下一個項目
     * @returns {boolean} - 是否成功移動（若已在最後則返回 false）
     */
    moveNext() {
        if (this.currentIndex < this.items.length - 1) {
            this.currentIndex++;
            return true;
        }
        return false;
    },
    
    /**
     * 移動到上一個項目
     * @returns {boolean} - 是否成功移動（若已在第一個則返回 false）
     */
    movePrevious() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            return true;
        }
        return false; // 已在第一個
    },
    
    /**
     * 是否在第一個項目
     * @returns {boolean}
     */
    isAtFirst() {
        return this.currentIndex <= 0;
    },
    
    /**
     * 是否在最後一個項目
     * @returns {boolean}
     */
    isAtLast() {
        return this.currentIndex >= this.items.length - 1;
    }
};

/**
 * Create a fresh instance of ManualReadingState for testing
 * This avoids state pollution between tests
 * @returns {Object} - A new ManualReadingState instance
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
        },
        
        initItems(text, mode) {
            if (mode === 'word') {
                this.items = text.split('\n').map(s => s.trim()).filter(s => s !== '');
            } else {
                this.items = splitArticleSegments(text).filter(s => s.type === 'text').map(s => s.content);
            }
            this.totalItems = this.items.length;
            return this.items;
        },
        
        getCurrentItem() {
            if (this.currentIndex >= 0 && this.currentIndex < this.items.length) {
                return this.items[this.currentIndex];
            }
            return null;
        },
        
        moveNext() {
            if (this.currentIndex < this.items.length - 1) {
                this.currentIndex++;
                return true;
            }
            return false;
        },
        
        movePrevious() {
            if (this.currentIndex > 0) {
                this.currentIndex--;
                return true;
            }
            return false;
        },
        
        isAtFirst() {
            return this.currentIndex <= 0;
        },
        
        isAtLast() {
            return this.currentIndex >= this.items.length - 1;
        }
    };
}

export { ManualReadingState, createManualReadingState };
