# Requirements Document

## Introduction

修復「選擇語言」和「朗讀設定」內的按鈕在頁面刷新後，視覺狀態（滑動指示器位置）與實際值不同步的問題。目前刷新頁面後，按鈕的滑動指示器會回到預設位置，但實際儲存的值是正確的。

## Glossary

- **Sliding_Indicator**: 滑動指示器，用於視覺上標示當前選中的按鈕位置的白色背景元素
- **Segmented_Control**: 分段控制元件，用於朗讀設定中的速度、重複次數等選項
- **Lang_Tabs**: 語言選擇標籤，用於切換中文/英文/粵語
- **Mode_Tabs**: 模式選擇標籤，用於切換讀詞/讀文章模式
- **LocalStorage**: 瀏覽器本地儲存，用於保存用戶設定

## Requirements

### Requirement 1: 語言標籤指示器同步

**User Story:** As a user, I want the language tab indicator to show my saved language selection after page refresh, so that the visual state matches the actual setting.

#### Acceptance Criteria

1. WHEN the page loads and settings are restored from LocalStorage, THE Lang_Tabs Sliding_Indicator SHALL move to the position of the saved language tab
2. WHEN the language setting is loaded, THE Lang_Tabs Sliding_Indicator position SHALL be updated without animation to prevent visual glitches

### Requirement 2: 模式標籤指示器同步

**User Story:** As a user, I want the mode tab indicator to show my saved mode selection after page refresh, so that the visual state matches the actual setting.

#### Acceptance Criteria

1. WHEN the page loads and settings are restored from LocalStorage, THE Mode_Tabs Sliding_Indicator SHALL move to the position of the saved mode tab
2. WHEN the mode setting is loaded, THE Mode_Tabs Sliding_Indicator position SHALL be updated without animation to prevent visual glitches

### Requirement 3: 分段控制元件指示器同步

**User Story:** As a user, I want all segmented control indicators in the settings panel to show my saved selections after page refresh, so that the visual state matches the actual settings.

#### Acceptance Criteria

1. WHEN the page loads and settings are restored from LocalStorage, THE Segmented_Control Sliding_Indicator for each setting SHALL move to the position of the saved value
2. WHEN settings are loaded, THE Segmented_Control indicators SHALL be updated without animation to prevent visual glitches
3. THE following Segmented_Controls SHALL have their indicators synchronized:
   - 讀詞速度 (wordSpeedSegments)
   - 重複次數 (repeatCountSegments)
   - 間隔時間 (intervalSegments)
   - 讀文章速度 (articleSpeedSegments)
   - 句子重複 (sentenceRepeatSegments)
   - 字元等待時間 (charWaitTimeSegments)
   - 標點符號朗讀 (punctuationReadingSegments)

### Requirement 4: 指示器更新時機

**User Story:** As a user, I want the indicators to be correctly positioned when the settings panel is opened, so that I can see my saved settings accurately.

#### Acceptance Criteria

1. WHEN the settings panel is opened, THE Segmented_Control indicators within it SHALL be positioned correctly based on the current values
2. IF the settings panel was closed during page load, WHEN it is first opened, THE indicators SHALL be updated to reflect the saved values
