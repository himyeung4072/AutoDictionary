/**
 * Full Read Mode Restriction Module
 * 
 * This module provides functions to test that the full read control
 * is only visible in auto mode.
 * 
 * Feature: auto-complete-full-read
 * Property 5: Mode Restriction
 * Requirements: 5.1, 5.2
 */

/**
 * Valid reading modes
 */
const READING_MODES = ['auto', 'manual'];

/**
 * Determines if the full read control should be visible based on reading mode.
 * 
 * Requirements:
 * - 5.1: THE Full_Read_Feature SHALL only be available in Auto_Mode
 * - 5.2: THE Full_Read_Feature toggle SHALL be hidden when Manual_Mode is selected
 * 
 * @param {string} readingMode - The current reading mode ('auto' or 'manual')
 * @returns {boolean} True if the control should be visible, false otherwise
 */
function shouldFullReadControlBeVisible(readingMode) {
    return readingMode === 'auto';
}

/**
 * Simulates the updateFullReadControlVisibility function behavior.
 * Returns the expected CSS class state for the control group.
 * 
 * @param {string} readingMode - The current reading mode
 * @returns {{ hasHiddenClass: boolean }} The expected class state
 */
function getExpectedControlState(readingMode) {
    return {
        hasHiddenClass: readingMode !== 'auto'
    };
}

/**
 * Validates that mode switching correctly updates visibility.
 * 
 * @param {string} fromMode - The mode switching from
 * @param {string} toMode - The mode switching to
 * @returns {{ beforeVisible: boolean, afterVisible: boolean }}
 */
function simulateModeSwitch(fromMode, toMode) {
    return {
        beforeVisible: shouldFullReadControlBeVisible(fromMode),
        afterVisible: shouldFullReadControlBeVisible(toMode)
    };
}

/**
 * Checks if full read feature should trigger based on mode and enabled state.
 * 
 * Requirements:
 * - 5.1: Full read only available in auto mode
 * - 5.3: Switching to manual mode should not trigger full read
 * 
 * @param {string} readingMode - The current reading mode
 * @param {boolean} fullReadEnabled - Whether full read is enabled
 * @returns {boolean} True if full read should trigger
 */
function shouldFullReadTrigger(readingMode, fullReadEnabled) {
    // Full read only triggers in auto mode AND when enabled
    return readingMode === 'auto' && fullReadEnabled;
}

// Export for testing
export {
    READING_MODES,
    shouldFullReadControlBeVisible,
    getExpectedControlState,
    simulateModeSwitch,
    shouldFullReadTrigger
};
