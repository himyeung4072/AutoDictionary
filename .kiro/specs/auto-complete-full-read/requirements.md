# Requirements Document

## Introduction

此功能為自動模式新增一個可開關的選項。當啟用此功能且自動模式播放完畢後，系統會先廣播提示訊息（根據當前語言），然後完整朗讀一次全文內容（忽略詞語重讀次數和每字書寫時間設定）。

## Glossary

- **Auto_Mode**: 自動模式，系統自動依序朗讀所有內容
- **Full_Read_Feature**: 完整朗讀功能，播放完畢後完整朗讀一次全文的功能
- **Announcement_Message**: 提示訊息，播放完畢後廣播的語音提示
- **Speech_Rate**: 朗讀速度，用戶設定的語音播放速度
- **Repeat_Count**: 詞語重讀次數，每個詞語重複朗讀的次數
- **Char_Wait_Time**: 每字書寫時間，每個字元的等待時間

## Requirements

### Requirement 1: 功能開關設定

**User Story:** As a user, I want to enable or disable the full read feature, so that I can choose whether to have a complete read-through after auto mode finishes.

#### Acceptance Criteria

1. THE System SHALL provide a toggle control for the Full_Read_Feature in the settings panel
2. THE Full_Read_Feature toggle SHALL default to disabled (off)
3. WHEN the user toggles the Full_Read_Feature, THE System SHALL persist the setting in local storage
4. WHEN the page loads, THE System SHALL restore the Full_Read_Feature setting from local storage

### Requirement 2: 提示訊息廣播

**User Story:** As a user, I want to hear an announcement in my selected language when auto mode completes, so that I know the full read-through is about to begin.

#### Acceptance Criteria

1. WHEN Auto_Mode completes AND Full_Read_Feature is enabled AND language is zh-HK (粵語), THE System SHALL speak "所有內容朗讀完畢，現在會完整朗讀一次"
2. WHEN Auto_Mode completes AND Full_Read_Feature is enabled AND language is zh-CN (普通話), THE System SHALL speak "所有內容朗讀完畢，現在會完整朗讀一次"
3. WHEN Auto_Mode completes AND Full_Read_Feature is enabled AND language is en-GB (英語), THE System SHALL speak "All content has been read aloud; now it will be read aloud in full once."
4. THE Announcement_Message SHALL be spoken using the same voice and Speech_Rate as the main content
5. IF the user stops playback during the Announcement_Message, THEN THE System SHALL cancel the announcement and not proceed with the full read

### Requirement 3: 完整朗讀執行

**User Story:** As a user, I want the system to read through all content once after the announcement, so that I can hear the complete text without interruptions.

#### Acceptance Criteria

1. WHEN the Announcement_Message completes, THE System SHALL read all content from beginning to end exactly once
2. THE full read SHALL use the current Speech_Rate setting
3. THE full read SHALL ignore the Repeat_Count setting (always read each item once)
4. THE full read SHALL ignore the Char_Wait_Time setting (no additional wait between characters)
5. WHILE performing the full read, THE System SHALL update the progress bar to reflect current position
6. WHILE performing the full read, THE System SHALL highlight the current word or sentence being read
7. IF the user stops playback during the full read, THEN THE System SHALL stop immediately

### Requirement 4: 狀態顯示

**User Story:** As a user, I want to see the current status during the full read phase, so that I know what the system is doing.

#### Acceptance Criteria

1. WHEN the Announcement_Message is being spoken, THE System SHALL display "準備完整朗讀..." in the status area
2. WHILE performing the full read, THE System SHALL display "完整朗讀中" in the status area
3. WHEN the full read completes, THE System SHALL display "播放完畢" in the status area

### Requirement 5: 功能限制

**User Story:** As a user, I want the full read feature to only apply to auto mode, so that manual mode behavior remains unchanged.

#### Acceptance Criteria

1. THE Full_Read_Feature SHALL only be available in Auto_Mode
2. THE Full_Read_Feature toggle SHALL be hidden or disabled when Manual_Mode is selected
3. WHEN switching from Auto_Mode to Manual_Mode, THE System SHALL not trigger the full read feature
