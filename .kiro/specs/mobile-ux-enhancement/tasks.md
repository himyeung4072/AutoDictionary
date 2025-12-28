# Implementation Plan: Mobile UX Enhancement

## Overview

本實施計劃將「默書神器」的手機 UX 改進分解為可執行的編碼任務。所有改動將在 `auto_dic.html` 單一文件中完成，按優先級順序實施。

## Tasks

- [x] 1. Update viewport meta tag and add CSS variables
  - Add viewport-fit=cover to enable safe area insets
  - Define CSS custom properties for colors, spacing, and safe areas
  - Add fallback values for browsers without env() support
  - _Requirements: 7.4_

- [x] 2. Implement fixed bottom player controls
  - [x] 2.1 Restructure HTML to separate main content and player controls
    - Wrap existing content in .main-content div
    - Move button group to new .player-controls div at bottom
    - Add padding-bottom to main content to prevent overlap
    - _Requirements: 1.1, 1.4_
  - [x] 2.2 Add CSS for fixed positioning and safe area padding
    - Apply position: fixed with bottom: 0
    - Add safe area padding using env(safe-area-inset-bottom)
    - Add white background and shadow
    - _Requirements: 1.2, 1.3, 1.5_

- [x] 3. Implement progress indicator
  - [x] 3.1 Add progress section HTML structure
    - Create progress bar container with fill element
    - Add current word display area
    - Add progress count text (e.g., "3 / 10")
    - _Requirements: 2.1, 2.4_
  - [x] 3.2 Add progress bar CSS styles
    - Style progress bar with gradient fill
    - Add smooth transition for width changes
    - Style current word display with prominent text
    - _Requirements: 2.5, 2.6_
  - [x] 3.3 Implement progress update JavaScript functions
    - Create updateProgress(current, total) function
    - Create updateCurrentWord(word) function
    - Integrate with existing reading loop
    - _Requirements: 2.2, 2.3_
  - [x] 3.4 Write property test for progress calculation
    - **Property 1: Progress Calculation Accuracy**
    - **Property 2: Progress Text Format**
    - **Validates: Requirements 2.2, 2.4**

- [x] 4. Implement large mode toggle tabs
  - [x] 4.1 Replace radio buttons with tab-style buttons
    - Create .mode-tabs container with two tab buttons
    - Add proper ARIA attributes for accessibility
    - Remove old radio button markup
    - _Requirements: 3.1, 3.2_
  - [x] 4.2 Add tab CSS styles
    - Style tabs with 48px minimum height
    - Add active/inactive state styles
    - Add smooth transitions
    - _Requirements: 3.3, 3.4, 3.5_
  - [x] 4.3 Implement tab switching JavaScript
    - Add click handlers for tab buttons
    - Update active state and ARIA attributes
    - Call existing toggleMode() function
    - _Requirements: 3.6_
  - [x] 4.4 Write property test for mode tab state
    - **Property 4: Mode Tab State Consistency**
    - **Validates: Requirements 3.6**

- [x] 5. Implement collapsible settings panel
  - [x] 5.1 Wrap settings in details/summary elements
    - Create details element with settings-panel class
    - Add summary with title and preview text
    - Move existing settings controls into details content
    - _Requirements: 4.1, 4.3, 4.4_
  - [x] 5.2 Add settings panel CSS styles
    - Style summary with flex layout
    - Hide default marker
    - Add background and border radius
    - _Requirements: 4.5_
  - [x] 5.3 Implement settings preview text generation
    - Create updateSettingsPreview() function
    - Generate preview from current settings values
    - Call on settings change
    - _Requirements: 4.2_
  - [x] 5.4 Add panel state persistence to localStorage
    - Save open/closed state on toggle
    - Restore state on page load
    - _Requirements: 4.6_
  - [x] 5.5 Write property test for settings preview
    - **Property 5: Settings Preview Accuracy**
    - **Validates: Requirements 4.2**

- [x] 6. Implement word/character counter
  - [x] 6.1 Add word counter HTML element
    - Create .word-counter div below textarea
    - Add count span and language tag span
    - _Requirements: 5.5_
  - [x] 6.2 Implement count calculation functions
    - Create countWords(text) for word mode (line count)
    - Create countCharacters(text) for article mode (Chinese chars)
    - _Requirements: 5.1, 5.2_
  - [x] 6.3 Add input event listener for real-time updates
    - Listen to textarea input events
    - Update counter display immediately
    - Update language tag from current selection
    - _Requirements: 5.3, 5.4_
  - [x] 6.4 Write property tests for word counting
    - **Property 6: Word Count Accuracy (Word Mode)**
    - **Property 7: Character Count Accuracy (Article Mode)**
    - **Validates: Requirements 5.1, 5.2**

- [x] 7. Implement auto-expanding textarea
  - [x] 7.1 Add CSS for textarea height constraints
    - Set min-height: 100px
    - Set max-height: 300px on mobile
    - Add resize: none and overflow-y: auto
    - _Requirements: 6.2, 6.3, 6.4_
  - [x] 7.2 Implement auto-expand JavaScript function
    - Create autoExpandTextarea() function
    - Calculate height based on scrollHeight
    - Clamp between min and max values
    - _Requirements: 6.1, 6.5_
  - [x] 7.3 Write property test for textarea height
    - **Property 8: Textarea Height Adjustment**
    - **Validates: Requirements 6.1, 6.5**

- [x] 8. Add safe area adaptations
  - [x] 8.1 Add container padding for top safe area
    - Apply padding-top with env(safe-area-inset-top)
    - _Requirements: 7.1_
  - [x] 8.2 Add body padding for bottom safe area
    - Apply padding-bottom with env(safe-area-inset-bottom)
    - _Requirements: 7.2_
  - [x] 8.3 Verify player controls safe area padding
    - Ensure bottom padding includes safe area inset
    - _Requirements: 7.3_

- [x] 9. Hide debug section on mobile
  - [x] 9.1 Add CSS to hide debug section on mobile viewport
    - Use media query for max-width: 520px
    - Set display: none for debug details element
    - _Requirements: 8.1_
  - [x] 9.2 Add localStorage persistence for debug visibility
    - Save visibility preference
    - Restore on page load
    - _Requirements: 8.4_

- [x] 10. Enhance status display
  - [x] 10.1 Update status area CSS for better visibility
    - Increase font size to minimum 16px
    - Ensure sufficient color contrast
    - _Requirements: 9.4, 9.5_
  - [x] 10.2 Verify countdown timer display during wait
    - Ensure existing countdown is visible
    - _Requirements: 9.2_
  - [x] 10.3 Add clear paused state indication
    - Update status text styling when paused
    - _Requirements: 9.3_

- [x] 11. Responsive layout improvements
  - [x] 11.1 Update media query for single-column layout
    - Ensure controls use single column at 520px breakpoint
    - _Requirements: 10.1_
  - [x] 11.2 Verify all touch targets meet 48px minimum
    - Check buttons, tabs, and form controls
    - _Requirements: 10.2_
  - [x] 11.3 Verify form input font sizes are 16px minimum
    - Check input, select, and textarea elements
    - _Requirements: 10.3_
  - [x] 11.4 Add spacing between interactive elements
    - Ensure adequate gap to prevent accidental taps
    - _Requirements: 10.4_
  - [x] 11.5 Write property tests for touch targets and font sizes
    - **Property 9: Touch Target Minimum Size**
    - **Property 10: Form Input Font Size**
    - **Validates: Requirements 10.2, 10.3**

- [x] 12. Checkpoint - Ensure all changes work correctly
  - Test on mobile viewport (375px width)
  - Test fixed controls scrolling behavior
  - Test progress indicator during playback
  - Test mode switching
  - Test settings panel collapse/expand
  - Ensure all tests pass, ask the user if questions arise.

- [x] 13. Integration and final polish
  - [x] 13.1 Integrate progress updates with reading functions
    - Update readWords() to call progress functions
    - Update readArticle() to call progress functions
    - _Requirements: 2.2, 2.6, 9.1_
  - [x] 13.2 Update saveSettings() and loadSettings()
    - Add new settings (panel state, debug visibility)
    - Ensure backward compatibility
    - _Requirements: 4.6, 8.4_
  - [x] 13.3 Add main content bottom padding
    - Prevent content from being hidden behind fixed controls
    - Account for safe area
    - _Requirements: 1.4, 10.5_

- [x] 14. Final checkpoint - Verify complete implementation
  - Run through complete user flow
  - Verify all requirements are met
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- All tasks including property-based tests are required
- All changes are made to the single `auto_dic.html` file
- Implementation follows the priority order from the improvement plan
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
