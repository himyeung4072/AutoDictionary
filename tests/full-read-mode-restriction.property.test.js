/**
 * Property-Based Tests for Full Read Mode Restriction
 * 
 * Feature: auto-complete-full-read
 * Property 5: Mode Restriction
 * 
 * These tests validate that the full read control is only visible
 * when reading mode is 'auto'.
 * 
 * Each test runs minimum 100 iterations as per testing strategy.
 * 
 * **Validates: Requirements 5.1, 5.2**
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
    READING_MODES,
    shouldFullReadControlBeVisible,
    getExpectedControlState,
    simulateModeSwitch,
    shouldFullReadTrigger
} from './full-read-mode-restriction.js';

// ===== Custom Arbitraries =====

/**
 * Generate valid reading modes
 */
const readingModeArb = fc.constantFrom(...READING_MODES);

/**
 * Generate auto mode specifically
 */
const autoModeArb = fc.constant('auto');

/**
 * Generate manual mode specifically
 */
const manualModeArb = fc.constant('manual');

/**
 * Generate boolean for fullReadEnabled
 */
const fullReadEnabledArb = fc.boolean();

/**
 * Generate any string (for invalid mode testing)
 */
const anyStringArb = fc.string({ minLength: 0, maxLength: 20 });

// ===== Property Tests =====

describe('Property 5: Mode Restriction', () => {
    /**
     * Feature: auto-complete-full-read, Property 5: Mode Restriction
     * 
     * *For any* reading mode, the fullReadControlGroup SHALL be visible 
     * only when readingMode is 'auto'.
     * 
     * **Validates: Requirements 5.1, 5.2**
     */

    it('Property 5.1: Full read control should be visible only in auto mode', () => {
        /**
         * Requirement 5.1: THE Full_Read_Feature SHALL only be available in Auto_Mode
         */
        fc.assert(
            fc.property(
                readingModeArb,
                (readingMode) => {
                    const isVisible = shouldFullReadControlBeVisible(readingMode);
                    
                    // Visible only when mode is 'auto'
                    return isVisible === (readingMode === 'auto');
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 5.2: Auto mode should always show the control', () => {
        /**
         * Requirement 5.1: Full read available in auto mode
         */
        fc.assert(
            fc.property(
                autoModeArb,
                (readingMode) => {
                    const isVisible = shouldFullReadControlBeVisible(readingMode);
                    return isVisible === true;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 5.3: Manual mode should always hide the control', () => {
        /**
         * Requirement 5.2: Full read toggle hidden in manual mode
         */
        fc.assert(
            fc.property(
                manualModeArb,
                (readingMode) => {
                    const isVisible = shouldFullReadControlBeVisible(readingMode);
                    return isVisible === false;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 5.4: Control state should have hidden class only in non-auto modes', () => {
        /**
         * Requirement 5.2: Control should have 'hidden' class when not in auto mode
         */
        fc.assert(
            fc.property(
                readingModeArb,
                (readingMode) => {
                    const state = getExpectedControlState(readingMode);
                    
                    // hasHiddenClass should be true only when NOT in auto mode
                    return state.hasHiddenClass === (readingMode !== 'auto');
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 5.5: Switching from auto to manual should hide the control', () => {
        /**
         * Requirement 5.2: Switching to manual mode hides the control
         */
        fc.assert(
            fc.property(
                fc.constant({ from: 'auto', to: 'manual' }),
                ({ from, to }) => {
                    const { beforeVisible, afterVisible } = simulateModeSwitch(from, to);
                    
                    // Before: visible (auto), After: hidden (manual)
                    return beforeVisible === true && afterVisible === false;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 5.6: Switching from manual to auto should show the control', () => {
        /**
         * Requirement 5.1: Switching to auto mode shows the control
         */
        fc.assert(
            fc.property(
                fc.constant({ from: 'manual', to: 'auto' }),
                ({ from, to }) => {
                    const { beforeVisible, afterVisible } = simulateModeSwitch(from, to);
                    
                    // Before: hidden (manual), After: visible (auto)
                    return beforeVisible === false && afterVisible === true;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 5.7: Full read should only trigger in auto mode when enabled', () => {
        /**
         * Requirement 5.1, 5.3: Full read only triggers in auto mode
         */
        fc.assert(
            fc.property(
                readingModeArb,
                fullReadEnabledArb,
                (readingMode, fullReadEnabled) => {
                    const shouldTrigger = shouldFullReadTrigger(readingMode, fullReadEnabled);
                    
                    // Should only trigger when both conditions are met
                    const expected = readingMode === 'auto' && fullReadEnabled;
                    return shouldTrigger === expected;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 5.8: Full read should never trigger in manual mode regardless of enabled state', () => {
        /**
         * Requirement 5.1: Full read not available in manual mode
         */
        fc.assert(
            fc.property(
                manualModeArb,
                fullReadEnabledArb,
                (readingMode, fullReadEnabled) => {
                    const shouldTrigger = shouldFullReadTrigger(readingMode, fullReadEnabled);
                    
                    // Should never trigger in manual mode
                    return shouldTrigger === false;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 5.9: Invalid modes should not show the control', () => {
        /**
         * Edge case: Invalid modes should be treated as non-auto
         */
        fc.assert(
            fc.property(
                anyStringArb.filter(s => !READING_MODES.includes(s)),
                (invalidMode) => {
                    const isVisible = shouldFullReadControlBeVisible(invalidMode);
                    
                    // Invalid modes should not show the control
                    return isVisible === false;
                }
            ),
            { numRuns: 100 }
        );
    });
});
