# Requirements Document

## Introduction

本次改進專注於「默書神器」的手機用戶體驗優化。目標是改善視覺層次、播放控制、輸入體驗和手勢互動，使應用在移動設備上更易用、更直觀。

## Glossary

- **Dictation_App**: 默書神器應用程式的核心系統
- **Player_Controls**: 播放控制列，包含開始、暫停、停止按鈕
- **Mode_Tabs**: 模式切換標籤，用於切換「讀詞語」和「讀文章」模式
- **Progress_Bar**: 進度條，顯示整體朗讀進度的視覺元件
- **Progress_Text**: 進度文字，顯示當前項目和總數（如「3 / 10」）
- **Settings_Panel**: 設定面板，包含朗讀速度、次數、間隔等設定選項
- **Word_Counter**: 字數統計器，顯示輸入內容的字數或詞數
- **Safe_Area**: 安全區域，iPhone 瀏海和底部的系統保留區域
- **Input_Area**: 輸入區域，用戶輸入詞語或文章的文字框

## Requirements

### Requirement 1: Fixed Bottom Player Controls

**User Story:** As a mobile user, I want the playback controls to always be visible at the bottom of the screen, so that I can control playback without scrolling.

#### Acceptance Criteria

1. THE Player_Controls SHALL be fixed at the bottom of the viewport using CSS position: fixed
2. THE Player_Controls SHALL include padding for iPhone safe area using env(safe-area-inset-bottom)
3. THE Player_Controls SHALL have a white background with subtle shadow to distinguish from content
4. THE Player_Controls SHALL remain visible and accessible regardless of scroll position
5. WHEN the page content is scrolled, THE Player_Controls SHALL stay fixed at the bottom

### Requirement 2: Progress Indicator

**User Story:** As a user, I want to see a visual progress bar and text indicator, so that I know how much content has been read and how much remains.

#### Acceptance Criteria

1. WHEN reading starts, THE Progress_Bar SHALL display at 0% width
2. WHEN each word or sentence is completed, THE Progress_Bar SHALL update its width to reflect current progress
3. WHEN reading completes, THE Progress_Bar SHALL display at 100% width
4. THE Progress_Text SHALL display the current item number and total items (e.g., "3 / 10")
5. THE Progress_Bar SHALL use a gradient color from green (#28a745) to teal (#20c997)
6. THE Dictation_App SHALL display the currently reading word or sentence below the progress bar

### Requirement 3: Large Mode Toggle Tabs

**User Story:** As a mobile user, I want larger touch targets for switching between word and article modes, so that I can switch modes without accidental taps.

#### Acceptance Criteria

1. THE Mode_Tabs SHALL replace the current radio buttons with large tab-style buttons
2. THE Mode_Tabs SHALL have a minimum touch target height of 48px
3. WHEN a mode tab is active, THE Mode_Tabs SHALL display it with a white background and shadow
4. WHEN a mode tab is inactive, THE Mode_Tabs SHALL display it with a transparent background
5. THE Mode_Tabs SHALL use smooth CSS transitions when switching between modes
6. WHEN a mode is selected, THE Dictation_App SHALL update the input label and placeholder accordingly

### Requirement 4: Collapsible Settings Panel

**User Story:** As a mobile user, I want to collapse the settings section, so that I can reduce page length and focus on the main content.

#### Acceptance Criteria

1. THE Settings_Panel SHALL be implemented using HTML details/summary elements
2. THE Settings_Panel SHALL display a preview of current settings when collapsed (e.g., "正常速度 · 3次 · 5秒間隔")
3. WHEN the Settings_Panel is expanded, THE Dictation_App SHALL show all setting options
4. WHEN the Settings_Panel is collapsed, THE Dictation_App SHALL hide all setting options except the summary
5. THE Settings_Panel SHALL default to expanded state on first load
6. THE Dictation_App SHALL save the collapsed/expanded state to local storage

### Requirement 5: Word/Character Counter

**User Story:** As a user, I want to see a count of my input content, so that I can verify how much I have entered.

#### Acceptance Criteria

1. WHEN in word mode, THE Word_Counter SHALL display the number of lines (詞語數量)
2. WHEN in article mode, THE Word_Counter SHALL display the number of Chinese characters
3. WHEN the input content changes, THE Word_Counter SHALL update immediately
4. THE Word_Counter SHALL display the current language setting alongside the count
5. THE Word_Counter SHALL be positioned below the input area

### Requirement 6: Auto-Expanding Textarea

**User Story:** As a mobile user, I want the input area to expand as I type more content, so that I can see all my input without scrolling within the textarea.

#### Acceptance Criteria

1. WHEN content is entered, THE Input_Area SHALL automatically expand its height to fit the content
2. THE Input_Area SHALL have a minimum height of 100px
3. THE Input_Area SHALL have a maximum height of 300px on mobile devices
4. WHEN content exceeds the maximum height, THE Input_Area SHALL show a scrollbar
5. WHEN content is deleted, THE Input_Area SHALL shrink back to fit the remaining content

### Requirement 7: Safe Area Adaptation

**User Story:** As an iPhone user, I want the app to properly handle the notch and home indicator areas, so that no content is obscured by system UI elements.

#### Acceptance Criteria

1. THE Dictation_App SHALL apply padding-top using env(safe-area-inset-top) to the container
2. THE Dictation_App SHALL apply padding-bottom using env(safe-area-inset-bottom) to the body
3. THE Player_Controls SHALL include additional bottom padding for the home indicator area
4. THE Dictation_App SHALL use the viewport-fit=cover meta tag to enable safe area insets

### Requirement 8: Hide Debug Section for Regular Users

**User Story:** As a regular user, I want the debug section to be hidden by default, so that the interface is cleaner and less confusing.

#### Acceptance Criteria

1. THE Dictation_App SHALL hide the debug section by default on mobile devices
2. THE Dictation_App SHALL provide a way to access debug features through a hidden gesture or setting
3. WHEN on desktop devices, THE Dictation_App MAY show the debug section in a collapsed state
4. THE debug section visibility preference SHALL be saved to local storage

### Requirement 9: Enhanced Status Display

**User Story:** As a user, I want clearer status messages during playback, so that I always know what the app is doing.

#### Acceptance Criteria

1. WHEN reading is in progress, THE Dictation_App SHALL display the current word/sentence prominently
2. WHEN waiting between items, THE Dictation_App SHALL display a countdown timer
3. WHEN reading is paused, THE Dictation_App SHALL clearly indicate the paused state
4. THE status display SHALL use larger font size (minimum 16px) for better readability on mobile
5. THE status area SHALL have sufficient contrast for outdoor visibility

### Requirement 10: Responsive Layout Improvements

**User Story:** As a mobile user, I want the layout to be optimized for small screens, so that all elements are properly sized and spaced.

#### Acceptance Criteria

1. WHEN viewport width is 520px or less, THE Dictation_App SHALL use single-column layout for controls
2. THE Dictation_App SHALL ensure all touch targets are at least 48px in height
3. THE Dictation_App SHALL use 16px minimum font size for all form inputs to prevent iOS zoom
4. THE Dictation_App SHALL add appropriate spacing between interactive elements to prevent accidental taps
5. THE container SHALL have appropriate padding that accounts for safe areas

