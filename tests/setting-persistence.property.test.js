/**
 * Property-Based Tests for Setting Persistence (fullReadEnabled)
 * 
 * Feature: auto-complete-full-read
 * Property 1: Setting Persistence Round Trip
 * 
 * These tests validate correctness properties using fast-check
 * as specified in the design document.
 * 
 * Each test runs minimum 100 iterations as per testing strategy.
 * 
 * **Validates: Requirements 1.3, 1.4**
 */

import { describe, it, expect, beforeEach } from 'vitest';
import fc from 'fast-check';
import { 
    saveFullReadSetting, 
    loadFullReadSetting, 
    MockLocalStorage 
} from './setting-persistence.js';

// ===== Property Tests =====

describe('Property 1: Setting Persistence Round Trip', () => {
    /**
     * Feature: auto-complete-full-read, Property 1: Setting Persistence Round Trip
     * 
     * *For any* fullReadEnabled setting value (true or false), saving to localStorage 
     * and then loading SHALL restore the same value.
     * 
     * **Validates: Requirements 1.3, 1.4**
     */

    let mockStorage;

    beforeEach(() => {
        mockStorage = new MockLocalStorage();
    });

    it('Property 1.1: Round trip - save then load should return the same boolean value', () => {
        /**
         * Requirements 1.3, 1.4: Save and load should preserve the value
         */
        fc.assert(
            fc.property(
                fc.boolean(),
                (fullReadEnabled) => {
                    // Clear storage before each test
                    mockStorage.clear();
                    
                    // Save the setting
                    saveFullReadSetting(fullReadEnabled, mockStorage);
                    
                    // Load the setting
                    const loaded = loadFullReadSetting(mockStorage);
                    
                    // Should be the same value
                    return loaded === fullReadEnabled;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 1.2: Multiple saves should preserve the last value', () => {
        /**
         * Requirement 1.3: Each toggle should persist the new value
         */
        fc.assert(
            fc.property(
                fc.array(fc.boolean(), { minLength: 1, maxLength: 10 }),
                (values) => {
                    // Clear storage before each test
                    mockStorage.clear();
                    
                    // Save multiple values
                    for (const value of values) {
                        saveFullReadSetting(value, mockStorage);
                    }
                    
                    // Load should return the last saved value
                    const loaded = loadFullReadSetting(mockStorage);
                    const lastValue = values[values.length - 1];
                    
                    return loaded === lastValue;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 1.3: Loading from empty storage should return default (false)', () => {
        /**
         * Requirement 1.2: Default to disabled (off)
         */
        fc.assert(
            fc.property(
                fc.constant(null), // Just run the test multiple times
                () => {
                    // Clear storage
                    mockStorage.clear();
                    
                    // Load from empty storage
                    const loaded = loadFullReadSetting(mockStorage);
                    
                    // Should return default value (false)
                    return loaded === false;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 1.4: Save should not affect other settings', () => {
        /**
         * Invariant: Saving fullReadEnabled should preserve other settings
         */
        fc.assert(
            fc.property(
                fc.boolean(),
                fc.string(),
                fc.string(),
                (fullReadEnabled, otherKey, otherValue) => {
                    // Clear storage
                    mockStorage.clear();
                    
                    // Set up initial settings with other values
                    const initialSettings = {
                        lang: 'zh-HK',
                        mode: 'word',
                        [otherKey]: otherValue
                    };
                    mockStorage.setItem('dictationSettings', JSON.stringify(initialSettings));
                    
                    // Save fullReadEnabled
                    saveFullReadSetting(fullReadEnabled, mockStorage);
                    
                    // Load and verify other settings are preserved
                    const saved = JSON.parse(mockStorage.getItem('dictationSettings'));
                    
                    return saved.lang === 'zh-HK' && 
                           saved.mode === 'word' && 
                           saved.fullReadEnabled === fullReadEnabled;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 1.5: Idempotence - saving the same value twice should have no additional effect', () => {
        /**
         * Idempotence: f(x) = f(f(x))
         */
        fc.assert(
            fc.property(
                fc.boolean(),
                (fullReadEnabled) => {
                    // Clear storage
                    mockStorage.clear();
                    
                    // Save once
                    saveFullReadSetting(fullReadEnabled, mockStorage);
                    const afterFirst = mockStorage.getItem('dictationSettings');
                    
                    // Save again with same value
                    saveFullReadSetting(fullReadEnabled, mockStorage);
                    const afterSecond = mockStorage.getItem('dictationSettings');
                    
                    // Both should be equivalent
                    return JSON.parse(afterFirst).fullReadEnabled === JSON.parse(afterSecond).fullReadEnabled;
                }
            ),
            { numRuns: 100 }
        );
    });
});
