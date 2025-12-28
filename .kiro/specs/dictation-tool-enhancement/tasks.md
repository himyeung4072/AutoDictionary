# Implementation Plan: Dictation Tool Enhancement

## Overview

This implementation plan transforms the approved design into actionable coding tasks. The approach prioritizes core UI enhancements first (progress indicator, current word display), followed by new features (random mode, keyboard shortcuts, import/export), and concludes with code refactoring and accessibility improvements.

## Tasks

- [ ] 1. Set up testing infrastructure
  - [ ] 1.1 Initialize npm project and install dependencies (Jest, fast-check)
    - Create package.json with test scripts
    - Install jest and fast-check as dev dependencies
    - Configure Jest for browser environment testing
    - _Requirements: Testing Strategy_

- [ ] 2. Add progress indicator UI
  - [ ] 2.1 Add progress bar HTML structure
    - Add progress container with progress bar and fill elements
    - Add progress text span for "current / total" display
    - Include ARIA attributes (role, aria-valuenow, aria-valuemin, aria-valuemax)
    - _Requirements: 1.1, 1.4, 9.1_
  - [ ] 2.2 Add progress bar CSS styles
    - Style progress bar container with height and background
    - Style fill element with gradient and transition
    - _Requirements: 1.1_
  - [ ] 2.3 Implement progress update logic in JavaScript
    - Create progress.update(current, total) function
    - Update fill width based on percentage
    - Update progress text with current/total format
    - Update ARIA aria-valuenow attribute
    - _Requirements: 1.2, 1.3, 1.5_
  - [ ] 2.4 Write property test for progress calculation
    - **Property 1: Progress Calculation Accuracy**
    - **Validates: Requirements 1.2, 1.4**

- [ ] 3. Add current word display
  - [ ] 3.1 Add current word display HTML structure
    - Add div with id="currentWord" and class="current-word"
    - Include aria-live="polite" and aria-atomic="true"
    - Set initial placeholder text "準備開始..."
    - _Requirements: 2.1, 2.2, 9.2_
  - [ ] 3.2 Add current word display CSS styles
    - Style with large font, centered text, highlighted background
    - Set min-height to prevent layout shifts
    - _Requirements: 2.1, 2.4_
  - [ ] 3.3 Implement current word update logic
    - Update display when reading each word/sentence
    - Show placeholder when idle
    - Show "播放完畢" when complete
    - _Requirements: 2.1, 2.2, 2.3_

- [ ] 4. Implement show/hide current word option
  - [ ] 4.1 Add checkbox control for show/hide option
    - Add checkbox with id="showWord" in extra controls section
    - Default to checked state
    - _Requirements: 10.1, 10.2, 10.4_
  - [ ] 4.2 Implement visibility toggle logic
    - Toggle current word display visibility based on checkbox
    - Save preference to localStorage
    - Load preference on page load
    - _Requirements: 10.1, 10.2, 10.3_

- [ ] 5. Implement random playback mode
  - [ ] 5.1 Add random mode checkbox control
    - Add checkbox with id="randomMode" in extra controls section
    - _Requirements: 3.1, 3.2_
  - [ ] 5.2 Implement Fisher-Yates shuffle function
    - Create shuffle function that returns new shuffled array
    - Ensure original array is not mutated
    - _Requirements: 3.1, 3.3_
  - [ ] 5.3 Write property test for shuffle function
    - **Property 2: Shuffle Preserves Elements**
    - **Validates: Requirements 3.1, 3.3**
  - [ ] 5.4 Integrate shuffle into reading flow
    - Apply shuffle when random mode enabled and reading starts
    - Preserve original order when random mode disabled
    - Save random mode preference to localStorage
    - _Requirements: 3.1, 3.2, 3.4_

- [ ] 6. Checkpoint - Core UI features complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Implement keyboard shortcuts
  - [ ] 7.1 Add keyboard event listener
    - Listen for keydown events on document
    - Check if target is input field before processing
    - _Requirements: 4.4_
  - [ ] 7.2 Implement shortcut handlers
    - Space key: toggle pause/resume when reading active
    - Escape key: stop reading when active
    - Enter key: start reading when not active
    - Prevent default browser behavior for handled keys
    - _Requirements: 4.1, 4.2, 4.3, 4.5_
  - [ ] 7.3 Write property test for keyboard focus handling
    - **Property 4: Keyboard Shortcuts Respect Focus**
    - **Validates: Requirements 4.4**
  - [ ] 7.4 Add keyboard shortcuts documentation
    - Add visible help text showing available shortcuts
    - _Requirements: 9.4_

- [ ] 8. Implement import/export functionality
  - [ ] 8.1 Add import/export buttons to UI
    - Add export button with onclick handler
    - Add import button with hidden file input
    - Style buttons consistently with existing UI
    - _Requirements: 6.1, 6.2_
  - [ ] 8.2 Implement export function
    - Create Blob with UTF-8 encoding
    - Trigger download with filename "詞表.txt"
    - _Requirements: 6.1, 6.5_
  - [ ] 8.3 Implement import function
    - Validate file type is text
    - Read file content with UTF-8 encoding
    - Load content into textarea
    - Show error for invalid file types
    - _Requirements: 6.2, 6.3, 6.4, 6.5_
  - [ ] 8.4 Write property test for file content round-trip
    - **Property 5: File Content Round-Trip**
    - **Validates: Requirements 6.5**

- [ ] 9. Add dark mode support
  - [ ] 9.1 Add dark mode CSS with media query
    - Use prefers-color-scheme: dark media query
    - Define dark theme colors for body, container, inputs
    - Adjust current word display for dark mode
    - Add smooth color transitions
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 10. Add button animation effects
  - [ ] 10.1 Add CSS transitions and hover effects
    - Add transition property to buttons
    - Add hover transform (translateY) for enabled buttons
    - Add active transform for click feedback
    - Ensure disabled buttons have no animations
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 11. Implement punctuation reading in article mode
  - [ ] 11.1 Create PUNCTUATION_MAP constant
    - Define mapping for Chinese punctuation (。！？；，、．：)
    - Define mapping for English punctuation (.!?;,:)
    - Map each punctuation to its spoken form (e.g., "。" → "句號")
    - _Requirements: 11.3, 11.4_
  - [ ] 11.2 Implement extractTrailingPunctuation function
    - Use regex to extract trailing punctuation from sentence
    - Return empty string if no trailing punctuation
    - _Requirements: 11.1, 11.2_
  - [ ] 11.3 Implement toSpokenForm function
    - Convert punctuation string to spoken form using PUNCTUATION_MAP
    - Handle multiple consecutive punctuation marks
    - Preserve order of punctuation marks
    - _Requirements: 11.2, 11.3_
  - [ ] 11.4 Integrate punctuation reading into readArticle function
    - Modify speakPromise call to include punctuation spoken form
    - Append spoken punctuation after sentence content
    - _Requirements: 11.1, 11.2_
  - [ ] 11.5 Write property test for punctuation mapping completeness
    - **Property 7: Punctuation Mapping Completeness**
    - **Validates: Requirements 11.3, 11.4**
  - [ ] 11.6 Write property test for punctuation extraction order
    - **Property 8: Punctuation Extraction Preserves Order**
    - **Validates: Requirements 11.1, 11.2**
  - [ ] 11.7 Write property test for punctuation spoken form
    - **Property 9: Punctuation Spoken Form Round-Trip**
    - **Validates: Requirements 11.2, 11.3**

- [ ] 12. Checkpoint - All features complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 13. Refactor code architecture
  - [ ] 13.1 Create DictationApp object structure
    - Define CONFIG object with all constants
    - Define state object with all state variables
    - Define elements object for DOM cache
    - _Requirements: 8.1, 8.2, 8.3_
  - [ ] 13.2 Migrate functions to DictationApp methods
    - Move all functions into DictationApp object
    - Update function references throughout code
    - Ensure all functionality preserved
    - _Requirements: 8.1_
  - [ ] 13.3 Implement debounced settings saving
    - Add debounce wrapper for saveSettings
    - Use CONFIG.DEBOUNCE_DELAY constant
    - _Requirements: 8.4_
  - [ ] 13.4 Write property test for settings round-trip
    - **Property 3: Settings Round-Trip**
    - **Validates: Requirements 3.4, 10.3**

- [ ] 14. Enhance accessibility
  - [ ] 14.1 Add skip link for keyboard navigation
    - Add skip link at top of page
    - Style to be visible only on focus
    - Link to words textarea
    - _Requirements: 9.3_
  - [ ] 14.2 Write property test for ARIA attributes
    - **Property 6: ARIA Progress Attributes**
    - **Validates: Requirements 9.1**

- [ ] 15. Final checkpoint - All tasks complete
  - Ensure all tests pass, ask the user if questions arise.
  - Verify all requirements are implemented
  - Test in multiple browsers (Chrome, Edge, Safari)

## Notes

- All tasks are required for comprehensive coverage
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- The refactoring task (13) is placed after features to avoid disrupting feature development
- Task 11 implements punctuation reading for article mode (Requirement 11)
