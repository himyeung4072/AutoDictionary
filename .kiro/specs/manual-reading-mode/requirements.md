# Requirements Document

## Introduction

本功能為「默書神器」新增手動朗讀模式，讓使用者可以自行控制朗讀的節奏，逐詞/逐句手動操作，而非依賴自動播放。此功能與現有的自動朗讀模式並存，使用者可在朗讀設定中切換。

## Glossary

- **Manual_Reading_Mode**: 手動朗讀模式，使用者透過按鈕控制朗讀進度
- **Auto_Reading_Mode**: 自動朗讀模式，系統自動依序朗讀所有內容
- **Reading_Mode_Toggle**: 朗讀模式切換控制項，用於在自動/手動模式間切換
- **Current_Item**: 當前正在朗讀的詞語或句子
- **Reading_Index**: 當前朗讀位置的索引值
- **Manual_Controls**: 手動朗讀控制按鈕組（上一個、開始/重讀、取消、下一個）

## Requirements

### Requirement 1: 朗讀模式切換

**User Story:** As a user, I want to switch between automatic and manual reading modes, so that I can choose the reading style that suits my learning needs.

#### Acceptance Criteria

1. THE Reading_Mode_Toggle SHALL be displayed within the reading settings panel (朗讀設定)
2. THE Reading_Mode_Toggle SHALL provide two options: "自動朗讀" and "手動朗讀"
3. WHEN the user selects "自動朗讀", THE System SHALL display the automatic reading controls (開始、暫停、取消)
4. WHEN the user selects "手動朗讀", THE System SHALL display the manual reading controls (上一個/句、開始/重讀、取消、下一個/句)
5. THE System SHALL persist the selected reading mode to local storage
6. WHEN the page loads, THE System SHALL restore the previously selected reading mode from local storage

### Requirement 2: 手動朗讀控制按鈕

**User Story:** As a user, I want manual control buttons for reading, so that I can control the pace of reading at my own speed.

#### Acceptance Criteria

1. WHEN Manual_Reading_Mode is active, THE System SHALL display four control buttons in order from left to right: "上一個/句"、"開始/重讀"、"取消"、"下一個/句"
2. THE Manual_Controls SHALL replace the automatic controls (開始、暫停、取消) when Manual_Reading_Mode is active
3. THE Manual_Controls SHALL have consistent styling with the existing automatic controls
4. THE Manual_Controls SHALL be accessible with proper ARIA labels

### Requirement 3: 開始/重讀按鈕功能

**User Story:** As a user, I want a start/replay button, so that I can begin reading or replay the current item.

#### Acceptance Criteria

1. WHEN reading has not started, THE "開始/重讀" button SHALL display "開始"
2. WHEN the user clicks "開始", THE System SHALL read the first item (詞語 or 句子)
3. WHEN reading has started, THE "開始/重讀" button label SHALL change to "重讀"
4. WHEN the user clicks "重讀", THE System SHALL re-read the Current_Item
5. WHEN the Current_Item is being read, THE "重讀" button SHALL be disabled until reading completes
6. THE System SHALL highlight the Current_Item during reading

### Requirement 4: 下一個/句按鈕功能

**User Story:** As a user, I want a next button, so that I can advance to the next word or sentence.

#### Acceptance Criteria

1. WHEN reading has not started, THE "下一個/句" button SHALL be disabled
2. WHEN the user clicks "下一個/句", THE System SHALL advance Reading_Index by 1
3. WHEN the user clicks "下一個/句", THE System SHALL read the next item
4. WHEN Reading_Index reaches the last item, THE "下一個/句" button SHALL be disabled
5. THE System SHALL update the progress bar when advancing to the next item
6. THE System SHALL update the highlight to the new Current_Item

### Requirement 5: 上一個/句按鈕功能

**User Story:** As a user, I want a previous button, so that I can go back to the previous word or sentence.

#### Acceptance Criteria

1. WHEN reading has not started, THE "上一個/句" button SHALL be disabled
2. WHEN the user clicks "上一個/句" and Reading_Index is greater than 0, THE System SHALL decrease Reading_Index by 1
3. WHEN the user clicks "上一個/句" and Reading_Index is 0, THE System SHALL re-read the first item
4. WHEN the user clicks "上一個/句", THE System SHALL read the item at the new Reading_Index
5. THE System SHALL update the progress bar when going to the previous item
6. THE System SHALL update the highlight to the new Current_Item

### Requirement 6: 取消按鈕功能

**User Story:** As a user, I want a cancel button, so that I can stop all reading and reset the state.

#### Acceptance Criteria

1. WHEN reading has not started, THE "取消" button SHALL be disabled
2. WHEN the user clicks "取消", THE System SHALL stop any ongoing speech synthesis
3. WHEN the user clicks "取消", THE System SHALL reset Reading_Index to initial state
4. WHEN the user clicks "取消", THE System SHALL reset the progress bar to 0%
5. WHEN the user clicks "取消", THE System SHALL switch back to edit mode (顯示 textarea)
6. WHEN the user clicks "取消", THE "開始/重讀" button label SHALL change back to "開始"

### Requirement 7: 手動模式狀態顯示

**User Story:** As a user, I want to see the current reading status, so that I know which item is being read and my progress.

#### Acceptance Criteria

1. WHEN Manual_Reading_Mode is active and reading has started, THE System SHALL display the Current_Item in the status area
2. THE System SHALL display the current position in format "詞語 X/Y 個" or "句子 X/Y 個"
3. THE System SHALL update the progress bar to reflect the current Reading_Index
4. WHEN reading completes all items, THE System SHALL display "播放完畢" in the status area

### Requirement 8: 模式切換時的狀態處理

**User Story:** As a user, I want the system to handle mode switching gracefully, so that I don't lose my progress unexpectedly.

#### Acceptance Criteria

1. WHEN the user switches reading mode while reading is in progress, THE System SHALL stop the current reading
2. WHEN the user switches reading mode while reading is in progress, THE System SHALL reset to edit mode
3. WHEN the user switches reading mode, THE System SHALL update the control buttons immediately
4. THE System SHALL preserve the text content when switching between modes

### Requirement 9: 鍵盤快捷鍵支援

**User Story:** As a user, I want keyboard shortcuts for manual reading controls, so that I can control reading without using the mouse.

#### Acceptance Criteria

1. WHEN Manual_Reading_Mode is active, THE System SHALL support arrow key navigation
2. WHEN the user presses Right Arrow, THE System SHALL trigger "下一個/句" action
3. WHEN the user presses Left Arrow, THE System SHALL trigger "上一個/句" action
4. WHEN the user presses Space, THE System SHALL trigger "開始/重讀" action
5. WHEN the user presses Escape, THE System SHALL trigger "取消" action
6. THE keyboard shortcuts SHALL only work when no input field is focused
