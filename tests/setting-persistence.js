/**
 * Setting Persistence Module
 * 
 * This module provides functions for saving and loading the fullReadEnabled setting
 * to/from localStorage.
 * 
 * Feature: auto-complete-full-read
 * Requirements: 1.3, 1.4
 */

/**
 * Mock localStorage for testing
 */
class MockLocalStorage {
    constructor() {
        this.store = {};
    }
    
    getItem(key) {
        return this.store[key] || null;
    }
    
    setItem(key, value) {
        this.store[key] = String(value);
    }
    
    removeItem(key) {
        delete this.store[key];
    }
    
    clear() {
        this.store = {};
    }
}

/**
 * Save fullReadEnabled setting to localStorage
 * 
 * Requirements:
 * - 1.3: WHEN the user toggles the Full_Read_Feature, THE System SHALL persist the setting in local storage
 * 
 * @param {boolean} fullReadEnabled - The fullReadEnabled setting value
 * @param {Storage} storage - The storage object (localStorage or mock)
 * @returns {void}
 */
function saveFullReadSetting(fullReadEnabled, storage = localStorage) {
    const saved = storage.getItem('dictationSettings');
    let settings = {};
    
    if (saved) {
        try {
            settings = JSON.parse(saved);
        } catch (e) {
            settings = {};
        }
    }
    
    settings.fullReadEnabled = fullReadEnabled;
    storage.setItem('dictationSettings', JSON.stringify(settings));
}

/**
 * Load fullReadEnabled setting from localStorage
 * 
 * Requirements:
 * - 1.4: WHEN the page loads, THE System SHALL restore the Full_Read_Feature setting from local storage
 * 
 * @param {Storage} storage - The storage object (localStorage or mock)
 * @returns {boolean} The fullReadEnabled setting value (defaults to false)
 */
function loadFullReadSetting(storage = localStorage) {
    const saved = storage.getItem('dictationSettings');
    
    if (!saved) {
        return false; // Default value
    }
    
    try {
        const settings = JSON.parse(saved);
        return settings.fullReadEnabled !== undefined ? settings.fullReadEnabled : false;
    } catch (e) {
        return false; // Default value on error
    }
}

// Export for testing
export { 
    saveFullReadSetting, 
    loadFullReadSetting, 
    MockLocalStorage 
};
