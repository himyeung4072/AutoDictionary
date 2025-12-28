# Requirements Document

## Introduction

默書神器是一個基於瀏覽器的語音朗讀工具，幫助用戶進行詞語和文章的聽寫練習。本次改進旨在提升用戶體驗、增強功能性、改善代碼品質，並加強無障礙支援。

## Glossary

- **Dictation_App**: 默書神器應用程式的核心系統
- **Speech_Engine**: 瀏覽器語音合成引擎 (Web Speech API)
- **Progress_Indicator**: 進度指示器，顯示朗讀進度的視覺元件
- **Current_Word_Display**: 當前詞語顯示區，高亮顯示正在朗讀的內容
- **Word_List**: 詞語列表，用戶輸入的待朗讀詞語集合
- **Random_Mode**: 隨機播放模式，打亂詞語順序進行朗讀
- **Dark_Mode**: 深色模式，適應系統偏好的暗色主題
- **Keyboard_Shortcut**: 鍵盤快捷鍵，用於控制播放的按鍵組合
- **Punctuation_Map**: 標點符號對照表，將標點符號映射到其口語讀法

## Requirements

### Requirement 1: Progress Indicator

**User Story:** As a user, I want to see the overall reading progress, so that I know how much content remains to be read.

#### Acceptance Criteria

1. WHEN reading starts, THE Progress_Indicator SHALL display a progress bar showing 0% completion
2. WHEN each word or sentence is completed, THE Progress_Indicator SHALL update to reflect the current progress percentage
3. WHEN reading completes, THE Progress_Indicator SHALL display 100% completion
4. THE Progress_Indicator SHALL display text showing current item number and total items (e.g., "3 / 10")
5. WHILE reading is paused, THE Progress_Indicator SHALL maintain its current state without changes

### Requirement 2: Current Word Display

**User Story:** As a user, I want to see the currently spoken word prominently displayed, so that I can easily follow along while writing.

#### Acceptance Criteria

1. WHEN a word or sentence begins reading, THE Current_Word_Display SHALL show the content in large, highlighted text
2. WHEN reading is idle or stopped, THE Current_Word_Display SHALL show a placeholder message "準備開始..."
3. WHEN reading completes, THE Current_Word_Display SHALL show "播放完畢"
4. THE Current_Word_Display SHALL have a minimum height to prevent layout shifts during content changes

### Requirement 3: Random Playback Mode

**User Story:** As a user, I want to play words in random order, so that I can practice dictation more effectively without memorizing the sequence.

#### Acceptance Criteria

1. WHEN random mode is enabled and reading starts, THE Dictation_App SHALL shuffle the Word_List before playback
2. WHEN random mode is disabled, THE Dictation_App SHALL play words in their original input order
3. THE Dictation_App SHALL preserve the original Word_List and only shuffle a copy for playback
4. WHEN random mode setting changes, THE Dictation_App SHALL save the preference to local storage

### Requirement 4: Keyboard Shortcuts

**User Story:** As a user, I want to control playback using keyboard shortcuts, so that I can operate the app without using the mouse.

#### Acceptance Criteria

1. WHEN the Space key is pressed outside input fields, THE Dictation_App SHALL toggle pause/resume if reading is active
2. WHEN the Escape key is pressed, THE Dictation_App SHALL stop reading if reading is active
3. WHEN the Enter key is pressed outside input fields, THE Dictation_App SHALL start reading if not already active
4. WHILE focus is in a textarea or input field, THE Dictation_App SHALL NOT intercept keyboard shortcuts
5. THE Dictation_App SHALL prevent default browser behavior for intercepted shortcut keys

### Requirement 5: Dark Mode Support

**User Story:** As a user, I want the app to support dark mode, so that I can use it comfortably in low-light environments.

#### Acceptance Criteria

1. WHEN the system prefers dark color scheme, THE Dictation_App SHALL automatically apply dark mode styles
2. WHEN dark mode is active, THE Dictation_App SHALL use appropriate contrast colors for all text and UI elements
3. WHEN dark mode is active, THE Current_Word_Display SHALL remain clearly visible with adjusted background color
4. THE Dictation_App SHALL support smooth transitions when color scheme changes

### Requirement 6: Import/Export Word Lists

**User Story:** As a user, I want to import and export word lists, so that I can reuse and share my practice materials.

#### Acceptance Criteria

1. WHEN the export button is clicked, THE Dictation_App SHALL download the current Word_List as a text file
2. WHEN a text file is imported, THE Dictation_App SHALL load its contents into the Word_List textarea
3. WHEN importing a file, THE Dictation_App SHALL validate that the file is a text file
4. IF an invalid file type is imported, THEN THE Dictation_App SHALL display an error message and reject the file
5. WHEN a Word_List is exported, THE Dictation_App SHALL use UTF-8 encoding to preserve Chinese characters

### Requirement 7: Button Animation Effects

**User Story:** As a user, I want visual feedback when interacting with buttons, so that I can confirm my actions are registered.

#### Acceptance Criteria

1. WHEN hovering over an enabled button, THE Dictation_App SHALL apply a subtle lift animation
2. WHEN clicking an enabled button, THE Dictation_App SHALL apply a press-down animation
3. WHEN a button is disabled, THE Dictation_App SHALL NOT apply hover or click animations
4. THE Dictation_App SHALL use smooth CSS transitions for all button state changes

### Requirement 8: Code Architecture Refactoring

**User Story:** As a developer, I want the code to be well-organized and maintainable, so that future enhancements are easier to implement.

#### Acceptance Criteria

1. THE Dictation_App SHALL encapsulate all global variables within a single application object
2. THE Dictation_App SHALL use named constants for all configuration values (magic numbers)
3. THE Dictation_App SHALL cache DOM element references to minimize repeated queries
4. THE Dictation_App SHALL implement debounced settings saving to reduce storage operations

### Requirement 9: Enhanced Accessibility

**User Story:** As a user with accessibility needs, I want proper ARIA labels and keyboard navigation, so that I can use the app with assistive technologies.

#### Acceptance Criteria

1. THE Progress_Indicator SHALL include appropriate ARIA attributes (role, aria-valuenow, aria-valuemin, aria-valuemax)
2. THE Current_Word_Display SHALL use aria-live="polite" to announce content changes to screen readers
3. THE Dictation_App SHALL provide a skip link to jump directly to the input area
4. WHEN keyboard shortcuts are available, THE Dictation_App SHALL provide visible documentation of available shortcuts

### Requirement 10: Show/Hide Current Word Option

**User Story:** As a user, I want to optionally hide the current word display, so that I can practice without visual hints.

#### Acceptance Criteria

1. WHEN the "show current word" option is unchecked, THE Current_Word_Display SHALL be hidden
2. WHEN the "show current word" option is checked, THE Current_Word_Display SHALL be visible
3. THE Dictation_App SHALL save the show/hide preference to local storage
4. THE Dictation_App SHALL default to showing the current word display

### Requirement 11: Punctuation Reading in Article Mode

**User Story:** As a user, I want the app to read punctuation marks at the end of sentences in article mode, so that I can learn proper punctuation placement during dictation practice.

#### Acceptance Criteria

1. WHEN reading a sentence in article mode, THE Speech_Engine SHALL read the punctuation mark at the end of the sentence
2. WHEN a sentence ends with multiple punctuation marks, THE Speech_Engine SHALL read all punctuation marks in order
3. WHEN reading punctuation marks, THE Speech_Engine SHALL use the appropriate spoken form for each punctuation (e.g., "。" as "句號", "！" as "感嘆號", "？" as "問號", "，" as "逗號")
4. THE Dictation_App SHALL support reading common Chinese and English punctuation marks including: 。！？；，、．.!?;,
