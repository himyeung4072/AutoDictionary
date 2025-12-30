# Requirements Document

## Introduction

此功能為默書神器應用程式新增文字高亮功能，在朗讀時於文字輸入區域高亮顯示正在朗讀的詞語或句子，讓使用者能夠清楚追蹤朗讀進度。

## Glossary

- **Text_Display**: 用於顯示輸入文字並支援高亮效果的元件，取代原本的 textarea
- **Highlight_Manager**: 負責管理文字高亮狀態的模組
- **Current_Item**: 目前正在朗讀的詞語或句子
- **Word_Mode**: 詞語模式，每行一個詞語進行朗讀
- **Article_Mode**: 文章模式，按句子進行朗讀

## Requirements

### Requirement 1: 文字顯示區域轉換

**User Story:** As a user, I want to see the text I entered displayed in a way that supports highlighting, so that I can visually track which word or sentence is being read.

#### Acceptance Criteria

1. WHEN the dictation starts, THE Text_Display SHALL render the input text with each item (word or sentence) as a separate highlightable element
2. WHEN in Word_Mode, THE Text_Display SHALL display each line as a separate highlightable unit
3. WHEN in Article_Mode, THE Text_Display SHALL display each sentence as a separate highlightable unit
4. THE Text_Display SHALL preserve the original text formatting and line breaks

### Requirement 2: 高亮顯示正在朗讀的文字

**User Story:** As a user, I want to see the currently spoken text highlighted, so that I can easily follow along with the dictation.

#### Acceptance Criteria

1. WHEN a word or sentence begins to be spoken, THE Highlight_Manager SHALL apply a visual highlight to the Current_Item
2. WHEN the speech of a word or sentence ends, THE Highlight_Manager SHALL remove the highlight from that item
3. THE highlight style SHALL be visually distinct with a background color that contrasts well with the text
4. WHEN the dictation is paused, THE Highlight_Manager SHALL maintain the highlight on the Current_Item

### Requirement 3: 自動捲動至可見區域

**User Story:** As a user, I want the highlighted text to always be visible, so that I don't have to manually scroll to follow the dictation.

#### Acceptance Criteria

1. WHEN a new item is highlighted, THE Text_Display SHALL scroll to ensure the highlighted item is visible within the viewport
2. THE scrolling behavior SHALL be smooth and not jarring to the user
3. IF the highlighted item is already visible, THE Text_Display SHALL NOT scroll unnecessarily

### Requirement 4: 高亮狀態與朗讀狀態同步

**User Story:** As a user, I want the highlight to accurately reflect the current reading state, so that I always know what is being read.

#### Acceptance Criteria

1. WHEN the dictation is stopped, THE Highlight_Manager SHALL remove all highlights and restore the original textarea
2. WHEN the dictation is paused, THE Highlight_Manager SHALL keep the current highlight visible
3. WHEN the dictation resumes from pause, THE Highlight_Manager SHALL continue highlighting from the current position
4. WHEN a word or sentence is repeated, THE Highlight_Manager SHALL maintain the highlight on that item throughout all repetitions

### Requirement 5: 無障礙支援

**User Story:** As a user with accessibility needs, I want the highlighting feature to be accessible, so that I can use the application effectively.

#### Acceptance Criteria

1. THE Text_Display SHALL maintain proper ARIA attributes for screen reader compatibility
2. THE highlight color contrast SHALL meet WCAG 2.1 AA standards (minimum 4.5:1 contrast ratio)
3. WHEN using reduced motion preferences, THE scrolling animation SHALL be instant rather than smooth

### Requirement 6: 編輯與顯示模式切換

**User Story:** As a user, I want to be able to edit my text when not dictating, so that I can make changes before starting.

#### Acceptance Criteria

1. WHEN the dictation is not active, THE system SHALL display the original editable textarea
2. WHEN the dictation starts, THE system SHALL switch to the read-only Text_Display with highlighting capability
3. WHEN the dictation stops, THE system SHALL restore the editable textarea with the original content
