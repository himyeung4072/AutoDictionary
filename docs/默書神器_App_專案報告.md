# 默書神器 App 專案報告

## 📋 文檔資訊

| 項目 | 內容 |
|------|------|
| 專案名稱 | 默書神器 (Dictation Master) |
| 版本 | 1.0.0 |
| 文檔版本 | v1.0 |
| 建立日期 | 2026-01-03 |
| 目標平台 | iOS 15+, Android 10+ |
| 開發框架 | React Native / Expo |

---

## 1. 專案概述

### 1.1 專案背景

默書是香港及華語地區中小學生的重要學習活動。傳統默書需要家長或老師逐字朗讀，
耗時且不便。現有的網頁版「默書神器」已證明語音合成技術可有效輔助默書練習，
但缺乏移動端的便利性和完整的學習追蹤功能。

### 1.2 專案目標

開發一款功能完善的跨平台移動應用，讓中小學生能夠：
- 自主進行默書練習
- 追蹤學習進度
- 複習錯誤詞語

讓家長能夠：
- 建立和管理詞庫
- 監控孩子學習進度
- 設定學習目標

### 1.3 核心價值主張

1. **自主學習**：學生可獨立完成默書練習，無需家長全程陪同
2. **智能追蹤**：自動記錄學習數據，識別薄弱環節
3. **家長協作**：家長可遠程管理詞庫和查看進度
4. **多語言支援**：粵語、普通話、英語三語朗讀
5. **離線可用**：核心功能支援離線使用

---

## 2. 目標用戶分析

### 2.1 主要用戶群體

#### 2.1.1 小學生 (6-12歲)
- **特徵**：注意力集中時間短，需要視覺引導和即時反饋
- **需求**：簡單直觀的操作，遊戲化元素，成就感
- **痛點**：容易分心，需要家長監督
- **使用場景**：課後在家練習，考試前複習

#### 2.1.2 中學生 (12-18歲)
- **特徵**：自主學習能力較強，時間管理意識
- **需求**：高效的練習模式，進度追蹤，錯題複習
- **痛點**：學業繁忙，需要針對性練習
- **使用場景**：自習時間，通勤途中

#### 2.1.3 家長
- **特徵**：工作繁忙，關心孩子學業
- **需求**：遠程監控，簡易詞庫管理，學習報告
- **痛點**：無法全程陪伴，不了解學習進度
- **使用場景**：工作間隙查看，週末整理詞庫

### 2.2 用戶旅程地圖

```
學生用戶旅程：
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  下載    │ -> │  註冊   │ -> │ 選擇詞庫 │ -> │ 開始練習 │ -> │ 查看成績 │
│  App    │    │  登入   │    │ 或輸入  │    │  默書   │    │  複習   │
└─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘

家長用戶旅程：
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  下載    │ -> │  註冊   │ -> │ 綁定孩子 │ -> │ 建立詞庫 │ -> │ 查看報告 │
│  App    │    │  登入   │    │  帳號   │    │  指派   │    │  監控   │
└─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘
```

### 2.3 用戶故事 (User Stories)

#### 學生角色
| ID | 用戶故事 | 優先級 |
|----|---------|--------|
| S01 | 作為學生，我想快速開始默書練習，以便節省時間 | P0 |
| S02 | 作為學生，我想看到我的學習進度，以便了解自己的表現 | P0 |
| S03 | 作為學生，我想複習之前寫錯的詞語，以便加強記憶 | P0 |
| S04 | 作為學生，我想調整朗讀速度，以便配合我的書寫速度 | P1 |
| S05 | 作為學生，我想獲得成就徽章，以便增加學習動力 | P1 |
| S06 | 作為學生，我想在沒有網絡時也能練習，以便隨時學習 | P1 |

#### 家長角色
| ID | 用戶故事 | 優先級 |
|----|---------|--------|
| P01 | 作為家長，我想建立詞庫給孩子練習，以便配合學校進度 | P0 |
| P02 | 作為家長，我想查看孩子的學習報告，以便了解學習情況 | P0 |
| P03 | 作為家長，我想設定每日學習目標，以便培養學習習慣 | P1 |
| P04 | 作為家長，我想收到學習提醒通知，以便督促孩子練習 | P1 |
| P05 | 作為家長，我想分享詞庫給其他家長，以便互相幫助 | P2 |

---

## 3. 功能需求規格

### 3.1 功能架構圖

```
默書神器 App
├── 🏠 首頁模組
│   ├── 快速開始
│   ├── 今日任務
│   ├── 學習統計摘要
│   └── 最近練習
│
├── 📚 詞庫模組
│   ├── 我的詞庫
│   │   ├── 建立詞庫
│   │   ├── 編輯詞庫
│   │   ├── 刪除詞庫
│   │   └── 匯入/匯出
│   ├── 共享詞庫
│   │   ├── 瀏覽公開詞庫
│   │   ├── 搜尋詞庫
│   │   └── 收藏詞庫
│   └── 錯題本
│       ├── 自動收集錯詞
│       └── 針對性複習
│
├── 🎯 練習模組
│   ├── 詞語模式
│   │   ├── 自動朗讀
│   │   └── 手動朗讀
│   ├── 文章模式
│   │   ├── 自動朗讀
│   │   └── 手動朗讀
│   ├── 練習設定
│   │   ├── 語言選擇
│   │   ├── 語音選擇
│   │   ├── 朗讀速度
│   │   ├── 重讀次數
│   │   ├── 書寫時間
│   │   └── 標點朗讀
│   └── 練習結果
│       ├── 自我評分
│       ├── 錯詞標記
│       └── 成績記錄
│
├── 📊 統計模組
│   ├── 學習日曆
│   ├── 進度圖表
│   ├── 錯詞分析
│   └── 成就系統
│
├── 👨‍👩‍👧 家長模組
│   ├── 孩子管理
│   │   ├── 綁定孩子帳號
│   │   └── 切換孩子
│   ├── 任務指派
│   │   ├── 建立任務
│   │   └── 設定截止日期
│   ├── 學習報告
│   │   ├── 每日報告
│   │   ├── 每週報告
│   │   └── 錯詞報告
│   └── 提醒設定
│
└── ⚙️ 設定模組
    ├── 帳號設定
    ├── 通知設定
    ├── 外觀設定 (深色模式)
    ├── 語音設定
    ├── 資料同步
    └── 關於/幫助
```

### 3.2 核心功能詳細規格

#### 3.2.1 朗讀引擎 (核心功能)

**功能描述**：使用設備原生 TTS (Text-to-Speech) 引擎進行語音合成

**支援語言**：
| 語言 | 代碼 | iOS Voice | Android Voice |
|------|------|-----------|---------------|
| 粵語 | yue-HK | 善怡 (Sin-Ji) | Google 粵語 |
| 普通話 | zh-CN | 婷婷 (Ting-Ting) | Google 普通話 |
| 英語 | en-GB | Daniel | Google UK English |

**朗讀參數**：
```typescript
interface SpeechConfig {
  language: 'yue-HK' | 'zh-CN' | 'en-GB';
  voiceId?: string;           // 可選指定語音
  rate: number;               // 0.5 - 1.3 (預設 0.9)
  repeatCount: number;        // 1 - 10 (預設 1)
  charWaitTime: number;       // 0 - 10 秒 (預設 3)
  readPunctuation: boolean;   // 是否朗讀標點 (預設 true)
}
```

**朗讀模式**：
1. **自動朗讀模式**
   - 自動依序朗讀所有內容
   - 支援播放/暫停/停止
   - 可選「完整朗讀」功能（播放完畢後完整朗讀一次）

2. **手動朗讀模式**
   - 用戶控制朗讀進度
   - 上一個/重讀/下一個/取消
   - 適合逐詞練習

#### 3.2.2 詞庫管理

**詞庫資料結構**：
```typescript
interface WordList {
  id: string;
  name: string;
  description?: string;
  language: 'zh-HK' | 'zh-CN' | 'en-GB';
  mode: 'word' | 'article';
  items: WordItem[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;          // 用戶 ID
  isPublic: boolean;          // 是否公開分享
  tags: string[];             // 標籤 (年級、科目等)
  practiceCount: number;      // 練習次數
  averageScore?: number;      // 平均分數
}

interface WordItem {
  id: string;
  content: string;            // 詞語或句子
  pinyin?: string;            // 拼音 (可選)
  meaning?: string;           // 解釋 (可選)
  example?: string;           // 例句 (可選)
  errorCount: number;         // 錯誤次數
  lastPracticed?: Date;       // 最後練習時間
}
```

**詞庫功能**：
- 建立/編輯/刪除詞庫
- 批量匯入 (支援 TXT, CSV)
- 匯出詞庫
- 複製詞庫
- 分享詞庫 (生成分享連結或 QR Code)

#### 3.2.3 練習流程

**練習會話資料結構**：
```typescript
interface PracticeSession {
  id: string;
  userId: string;
  wordListId: string;
  startTime: Date;
  endTime?: Date;
  mode: 'word' | 'article';
  readingMode: 'auto' | 'manual';
  config: SpeechConfig;
  results: PracticeResult[];
  totalItems: number;
  completedItems: number;
  correctItems: number;
  score?: number;
}

interface PracticeResult {
  itemId: string;
  content: string;
  isCorrect: boolean;         // 用戶自評
  attempts: number;           // 嘗試次數
  timeSpent: number;          // 花費時間 (秒)
}
```

**練習流程**：
```
1. 選擇詞庫 → 2. 設定參數 → 3. 開始練習 → 4. 朗讀/書寫 
                                              ↓
7. 保存記錄 ← 6. 查看結果 ← 5. 自我評分
```

#### 3.2.4 學習統計

**統計指標**：
- 每日練習時長
- 每日練習詞數
- 正確率趨勢
- 連續學習天數
- 錯詞排行榜
- 進步曲線

**成就系統**：
| 成就名稱 | 條件 | 徽章 |
|---------|------|------|
| 初學者 | 完成第一次練習 | 🌱 |
| 勤奮學習 | 連續 7 天練習 | 🔥 |
| 詞彙達人 | 累計練習 1000 詞 | 📚 |
| 完美表現 | 單次練習 100% 正確 | ⭐ |
| 堅持不懈 | 連續 30 天練習 | 🏆 |

---

## 4. 技術架構設計

### 4.1 技術選型

| 層級 | 技術選擇 | 理由 |
|------|---------|------|
| 前端框架 | React Native + Expo | 跨平台、熱更新、豐富生態 |
| 狀態管理 | Zustand | 輕量、簡單、TypeScript 友好 |
| 導航 | React Navigation v6 | 官方推薦、功能完整 |
| UI 組件 | React Native Paper | Material Design、無障礙支援 |
| 本地存儲 | MMKV + SQLite | 高性能、支援大量數據 |
| 語音合成 | expo-speech | 跨平台 TTS 支援 |
| 後端服務 | Supabase | BaaS、即時同步、認證 |
| 推送通知 | Expo Notifications | 跨平台推送 |

### 4.2 系統架構圖

```
┌─────────────────────────────────────────────────────────────────┐
│                        客戶端 (React Native)                      │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   UI 層     │  │   業務邏輯   │  │   數據層    │              │
│  │             │  │             │  │             │              │
│  │ • Screens   │  │ • Hooks     │  │ • Zustand   │              │
│  │ • Components│  │ • Services  │  │ • MMKV      │              │
│  │ • Navigation│  │ • Utils     │  │ • SQLite    │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    原生模組層                                ││
│  │  • expo-speech (TTS)  • expo-av (Audio)  • expo-sqlite      ││
│  │  • expo-notifications • expo-secure-store                   ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS / WebSocket
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Supabase 後端                             │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   認證服務   │  │  數據庫     │  │  即時同步   │              │
│  │             │  │             │  │             │              │
│  │ • Email     │  │ • PostgreSQL│  │ • Realtime  │              │
│  │ • OAuth     │  │ • Row Level │  │ • Presence  │              │
│  │ • JWT       │  │   Security  │  │             │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  存儲服務   │  │  Edge Func  │  │  推送服務   │              │
│  │             │  │             │  │             │              │
│  │ • 詞庫備份  │  │ • 統計計算  │  │ • 學習提醒  │              │
│  │ • 用戶頭像  │  │ • 報告生成  │  │ • 任務通知  │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

### 4.3 目錄結構

```
dictation-master/
├── app/                          # Expo Router 頁面
│   ├── (auth)/                   # 認證相關頁面
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── forgot-password.tsx
│   ├── (tabs)/                   # 主要 Tab 頁面
│   │   ├── index.tsx             # 首頁
│   │   ├── library.tsx           # 詞庫
│   │   ├── practice.tsx          # 練習
│   │   ├── stats.tsx             # 統計
│   │   └── settings.tsx          # 設定
│   ├── practice/                 # 練習相關頁面
│   │   ├── [id].tsx              # 練習詳情
│   │   ├── session.tsx           # 練習會話
│   │   └── result.tsx            # 練習結果
│   ├── library/                  # 詞庫相關頁面
│   │   ├── [id].tsx              # 詞庫詳情
│   │   ├── create.tsx            # 建立詞庫
│   │   └── edit.tsx              # 編輯詞庫
│   ├── parent/                   # 家長功能頁面
│   │   ├── dashboard.tsx         # 家長儀表板
│   │   ├── children.tsx          # 孩子管理
│   │   └── reports.tsx           # 學習報告
│   └── _layout.tsx               # 根佈局
│
├── src/
│   ├── components/               # 可重用組件
│   │   ├── common/               # 通用組件
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── ...
│   │   ├── practice/             # 練習相關組件
│   │   │   ├── SpeechPlayer.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── HighlightText.tsx
│   │   │   └── ControlPanel.tsx
│   │   ├── library/              # 詞庫相關組件
│   │   │   ├── WordListCard.tsx
│   │   │   ├── WordItem.tsx
│   │   │   └── ImportModal.tsx
│   │   └── stats/                # 統計相關組件
│   │       ├── CalendarHeatmap.tsx
│   │       ├── ProgressChart.tsx
│   │       └── AchievementBadge.tsx
│   │
│   ├── hooks/                    # 自定義 Hooks
│   │   ├── useSpeech.ts          # TTS 控制
│   │   ├── usePractice.ts        # 練習邏輯
│   │   ├── useWordList.ts        # 詞庫操作
│   │   ├── useAuth.ts            # 認證狀態
│   │   └── useSync.ts            # 數據同步
│   │
│   ├── services/                 # 服務層
│   │   ├── speech.ts             # 語音合成服務
│   │   ├── storage.ts            # 本地存儲服務
│   │   ├── sync.ts               # 雲端同步服務
│   │   ├── notification.ts       # 通知服務
│   │   └── analytics.ts          # 統計分析服務
│   │
│   ├── stores/                   # Zustand 狀態管理
│   │   ├── authStore.ts          # 認證狀態
│   │   ├── practiceStore.ts      # 練習狀態
│   │   ├── libraryStore.ts       # 詞庫狀態
│   │   ├── settingsStore.ts      # 設定狀態
│   │   └── statsStore.ts         # 統計狀態
│   │
│   ├── types/                    # TypeScript 類型定義
│   │   ├── models.ts             # 數據模型
│   │   ├── api.ts                # API 類型
│   │   └── navigation.ts         # 導航類型
│   │
│   ├── utils/                    # 工具函數
│   │   ├── text.ts               # 文字處理
│   │   ├── punctuation.ts        # 標點符號處理
│   │   ├── validation.ts         # 驗證函數
│   │   └── format.ts             # 格式化函數
│   │
│   ├── constants/                # 常量定義
│   │   ├── languages.ts          # 語言配置
│   │   ├── voices.ts             # 語音配置
│   │   ├── achievements.ts       # 成就配置
│   │   └── theme.ts              # 主題配置
│   │
│   └── i18n/                     # 國際化
│       ├── zh-HK.json            # 繁體中文
│       ├── zh-CN.json            # 簡體中文
│       └── en.json               # 英文
│
├── assets/                       # 靜態資源
│   ├── images/
│   ├── icons/
│   ├── fonts/
│   └── sounds/
│
├── supabase/                     # Supabase 配置
│   ├── migrations/               # 數據庫遷移
│   ├── functions/                # Edge Functions
│   └── seed.sql                  # 種子數據
│
├── app.json                      # Expo 配置
├── package.json
├── tsconfig.json
└── README.md
```

### 4.4 數據流架構

```
┌─────────────────────────────────────────────────────────────────┐
│                         用戶操作                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      React Components                            │
│                    (UI 層 - 展示邏輯)                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
┌─────────────────────────┐   ┌─────────────────────────┐
│      Custom Hooks       │   │      Zustand Store      │
│   (業務邏輯封裝)         │   │     (全局狀態管理)       │
└─────────────────────────┘   └─────────────────────────┘
                    │                   │
                    └─────────┬─────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Services 層                               │
│              (API 調用、本地存儲、原生功能)                        │
└─────────────────────────────────────────────────────────────────┘
                              │
            ┌─────────────────┼─────────────────┐
            ▼                 ▼                 ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   Local Storage │  │   Supabase API  │  │  Native Modules │
│   (MMKV/SQLite) │  │   (雲端數據)     │  │  (TTS/通知)     │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

---

## 5. UI/UX 設計規範

### 5.1 設計原則

1. **簡潔直觀**：界面清晰，操作簡單，適合兒童使用
2. **視覺引導**：使用顏色、圖標和動畫引導用戶
3. **即時反饋**：每個操作都有明確的視覺/觸覺反饋
4. **無障礙設計**：支援螢幕閱讀器、大字體、高對比度
5. **一致性**：統一的設計語言和交互模式

### 5.2 色彩系統

```typescript
// Light Mode
const lightTheme = {
  primary: '#10B981',        // 翠綠色 - 主色調
  primaryDark: '#059669',    // 深翠綠 - 強調
  secondary: '#3B82F6',      // 藍色 - 次要操作
  success: '#22C55E',        // 綠色 - 成功
  warning: '#F59E0B',        // 橙色 - 警告
  error: '#EF4444',          // 紅色 - 錯誤
  background: '#F3F4F6',     // 淺灰 - 背景
  surface: '#FFFFFF',        // 白色 - 卡片
  text: '#1F2937',           // 深灰 - 主文字
  textSecondary: '#6B7280',  // 中灰 - 次要文字
  border: '#E5E7EB',         // 邊框
};

// Dark Mode
const darkTheme = {
  primary: '#34D399',        // 亮翠綠
  primaryDark: '#10B981',
  secondary: '#60A5FA',
  success: '#4ADE80',
  warning: '#FBBF24',
  error: '#F87171',
  background: '#111827',     // 深藍黑
  surface: '#1F2937',        // 深灰
  text: '#F9FAFB',           // 淺白
  textSecondary: '#9CA3AF',
  border: '#374151',
};
```

### 5.3 字體系統

```typescript
const typography = {
  // 字體家族
  fontFamily: {
    primary: 'System',       // 系統字體
    mono: 'Menlo',           // 等寬字體
  },
  
  // 字體大小
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  
  // 字重
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  // 行高
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};
```

### 5.4 間距系統

```typescript
const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
};
```

### 5.5 組件規範

#### 5.5.1 按鈕 (Button)

```typescript
// 按鈕變體
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

// 按鈕尺寸
type ButtonSize = 'sm' | 'md' | 'lg';

// 最小觸控區域: 48x48dp (符合 WCAG 標準)
const buttonStyles = {
  sm: { height: 36, paddingHorizontal: 12, fontSize: 14 },
  md: { height: 44, paddingHorizontal: 16, fontSize: 16 },
  lg: { height: 52, paddingHorizontal: 20, fontSize: 18 },
};
```

#### 5.5.2 卡片 (Card)

```typescript
const cardStyles = {
  borderRadius: 12,
  padding: 16,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
};
```

#### 5.5.3 輸入框 (Input)

```typescript
const inputStyles = {
  height: 48,
  borderRadius: 8,
  borderWidth: 1,
  paddingHorizontal: 12,
  fontSize: 16,
};
```

### 5.6 頁面線框圖

#### 5.6.1 首頁

```
┌─────────────────────────────────────┐
│  ☰                    默書神器    👤 │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────────┐│
│  │  👋 早安，小明！                 ││
│  │  今天已練習 15 分鐘              ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │  📝 今日任務                     ││
│  │  ┌───────────────────────────┐  ││
│  │  │ 第五課生字 (20詞)    ▶️   │  ││
│  │  │ 截止：今天 18:00          │  ││
│  │  └───────────────────────────┘  ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │  🚀 快速開始                     ││
│  │  ┌─────────┐  ┌─────────┐       ││
│  │  │ 📚      │  │ ✏️      │       ││
│  │  │ 詞語模式 │  │ 文章模式 │       ││
│  │  └─────────┘  └─────────┘       ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │  📊 本週統計                     ││
│  │  練習: 45分鐘  詞數: 120  正確率: 85% │
│  │  [====████████====]             ││
│  └─────────────────────────────────┘│
│                                     │
├─────────────────────────────────────┤
│  🏠    📚    ▶️    📊    ⚙️        │
│  首頁  詞庫  練習  統計  設定       │
└─────────────────────────────────────┘
```

#### 5.6.2 練習頁面

```
┌─────────────────────────────────────┐
│  ←                    練習中        │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────────┐│
│  │  第五課生字                      ││
│  │  粵語 · 詞語模式 · 自動朗讀      ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │                                 ││
│  │  ┌───────────────────────────┐  ││
│  │  │                           │  ││
│  │  │      🔊 天氣              │  ││
│  │  │                           │  ││
│  │  │      正在朗讀 (2/3)       │  ││
│  │  │                           │  ││
│  │  └───────────────────────────┘  ││
│  │                                 ││
│  │  ┌───────────────────────────┐  ││
│  │  │ 蘋果                      │  ││
│  │  │ 香蕉                      │  ││
│  │  │ [天氣] ← 當前高亮          │  ││
│  │  │ 晴朗                      │  ││
│  │  │ 下雨                      │  ││
│  │  └───────────────────────────┘  ││
│  │                                 ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │  [████████░░░░░░░░░░] 3/10      ││
│  │                                 ││
│  │  等待中 5秒                      ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │    ⏸️           ⏹️              ││
│  │   暫停          停止             ││
│  └─────────────────────────────────┘│
│                                     │
└─────────────────────────────────────┘
```

#### 5.6.3 練習結果頁面

```
┌─────────────────────────────────────┐
│                    練習完成！        │
├─────────────────────────────────────┤
│                                     │
│           ┌─────────────┐           │
│           │     🎉      │           │
│           │    85%      │           │
│           │   正確率    │           │
│           └─────────────┘           │
│                                     │
│  ┌─────────────────────────────────┐│
│  │  📊 練習統計                     ││
│  │  ─────────────────────────────  ││
│  │  總詞數:     10                  ││
│  │  正確:       8                   ││
│  │  錯誤:       2                   ││
│  │  用時:       5分30秒             ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │  ❌ 錯誤詞語                     ││
│  │  ─────────────────────────────  ││
│  │  ☐ 天氣    [重聽]               ││
│  │  ☐ 晴朗    [重聽]               ││
│  │                                 ││
│  │  [加入錯題本]                    ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │  [再練一次]    [返回首頁]        ││
│  └─────────────────────────────────┘│
│                                     │
└─────────────────────────────────────┘
```

### 5.7 動畫規範

```typescript
const animations = {
  // 過渡時間
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  
  // 緩動函數
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
  
  // 減少動畫偏好
  respectReducedMotion: true,
};
```

---

## 6. 數據模型設計

### 6.1 數據庫 Schema (Supabase PostgreSQL)

```sql
-- 用戶表
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL CHECK (role IN ('student', 'parent')),
  parent_id UUID REFERENCES users(id),  -- 學生關聯的家長
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 用戶設定表
CREATE TABLE user_settings (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  language TEXT DEFAULT 'zh-HK',
  theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  default_speech_rate DECIMAL(2,1) DEFAULT 0.9,
  default_repeat_count INTEGER DEFAULT 1,
  default_char_wait_time INTEGER DEFAULT 3,
  read_punctuation BOOLEAN DEFAULT true,
  notifications_enabled BOOLEAN DEFAULT true,
  daily_reminder_time TIME,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 詞庫表
CREATE TABLE word_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  language TEXT NOT NULL CHECK (language IN ('zh-HK', 'zh-CN', 'en-GB')),
  mode TEXT NOT NULL CHECK (mode IN ('word', 'article')),
  is_public BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  practice_count INTEGER DEFAULT 0,
  average_score DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 詞語項目表
CREATE TABLE word_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  word_list_id UUID NOT NULL REFERENCES word_lists(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  pinyin TEXT,
  meaning TEXT,
  example TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  last_practiced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 練習會話表
CREATE TABLE practice_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  word_list_id UUID NOT NULL REFERENCES word_lists(id) ON DELETE CASCADE,
  mode TEXT NOT NULL CHECK (mode IN ('word', 'article')),
  reading_mode TEXT NOT NULL CHECK (reading_mode IN ('auto', 'manual')),
  speech_rate DECIMAL(2,1) NOT NULL,
  repeat_count INTEGER NOT NULL,
  char_wait_time INTEGER NOT NULL,
  total_items INTEGER NOT NULL,
  completed_items INTEGER DEFAULT 0,
  correct_items INTEGER DEFAULT 0,
  score DECIMAL(5,2),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 練習結果表
CREATE TABLE practice_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES practice_sessions(id) ON DELETE CASCADE,
  word_item_id UUID NOT NULL REFERENCES word_items(id) ON DELETE CASCADE,
  is_correct BOOLEAN,
  attempts INTEGER DEFAULT 1,
  time_spent INTEGER,  -- 秒
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 錯題本表
CREATE TABLE error_words (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  word_item_id UUID NOT NULL REFERENCES word_items(id) ON DELETE CASCADE,
  error_count INTEGER DEFAULT 1,
  last_error_at TIMESTAMPTZ DEFAULT NOW(),
  mastered BOOLEAN DEFAULT false,
  mastered_at TIMESTAMPTZ,
  UNIQUE(user_id, word_item_id)
);

-- 任務表 (家長指派)
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  word_list_id UUID NOT NULL REFERENCES word_lists(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 成就表
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  achieved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_type)
);

-- 每日統計表
CREATE TABLE daily_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  practice_time INTEGER DEFAULT 0,  -- 秒
  words_practiced INTEGER DEFAULT 0,
  correct_count INTEGER DEFAULT 0,
  sessions_count INTEGER DEFAULT 0,
  UNIQUE(user_id, date)
);

-- 索引
CREATE INDEX idx_word_lists_user ON word_lists(user_id);
CREATE INDEX idx_word_items_list ON word_items(word_list_id);
CREATE INDEX idx_practice_sessions_user ON practice_sessions(user_id);
CREATE INDEX idx_practice_results_session ON practice_results(session_id);
CREATE INDEX idx_error_words_user ON error_words(user_id);
CREATE INDEX idx_tasks_student ON tasks(student_id);
CREATE INDEX idx_daily_stats_user_date ON daily_stats(user_id, date);

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE word_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE word_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies (示例)
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view own word lists" ON word_lists
  FOR SELECT USING (
    user_id = auth.uid() OR 
    is_public = true OR
    user_id IN (SELECT id FROM users WHERE parent_id = auth.uid())
  );

CREATE POLICY "Users can manage own word lists" ON word_lists
  FOR ALL USING (user_id = auth.uid());
```

### 6.2 本地數據模型 (SQLite)

```typescript
// 本地緩存的詞庫
interface LocalWordList {
  id: string;
  serverId?: string;        // 雲端 ID (同步用)
  name: string;
  description?: string;
  language: 'zh-HK' | 'zh-CN' | 'en-GB';
  mode: 'word' | 'article';
  items: LocalWordItem[];
  createdAt: number;        // timestamp
  updatedAt: number;
  syncedAt?: number;        // 最後同步時間
  isDirty: boolean;         // 是否有未同步的變更
}

interface LocalWordItem {
  id: string;
  serverId?: string;
  content: string;
  pinyin?: string;
  meaning?: string;
  example?: string;
  sortOrder: number;
  errorCount: number;
  lastPracticedAt?: number;
}

// 本地練習記錄
interface LocalPracticeSession {
  id: string;
  serverId?: string;
  wordListId: string;
  mode: 'word' | 'article';
  readingMode: 'auto' | 'manual';
  config: {
    speechRate: number;
    repeatCount: number;
    charWaitTime: number;
    readPunctuation: boolean;
  };
  totalItems: number;
  completedItems: number;
  correctItems: number;
  score?: number;
  startedAt: number;
  completedAt?: number;
  syncedAt?: number;
  isDirty: boolean;
}

// 本地設定
interface LocalSettings {
  language: string;
  theme: 'light' | 'dark' | 'system';
  defaultSpeechRate: number;
  defaultRepeatCount: number;
  defaultCharWaitTime: number;
  readPunctuation: boolean;
  notificationsEnabled: boolean;
  dailyReminderTime?: string;
  lastSyncAt?: number;
}
```

### 6.3 狀態管理 (Zustand Store)

```typescript
// authStore.ts
interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, role: 'student' | 'parent') => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

// practiceStore.ts
interface PracticeState {
  // 當前練習狀態
  currentSession: PracticeSession | null;
  currentIndex: number;
  isPlaying: boolean;
  isPaused: boolean;
  isSpeaking: boolean;
  
  // 設定
  config: SpeechConfig;
  
  // Actions
  startSession: (wordList: WordList, config: SpeechConfig) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  stopSession: () => void;
  nextItem: () => void;
  previousItem: () => void;
  markResult: (itemId: string, isCorrect: boolean) => void;
  completeSession: () => Promise<void>;
}

// libraryStore.ts
interface LibraryState {
  wordLists: WordList[];
  currentWordList: WordList | null;
  isLoading: boolean;
  
  // Actions
  fetchWordLists: () => Promise<void>;
  createWordList: (data: CreateWordListInput) => Promise<WordList>;
  updateWordList: (id: string, data: UpdateWordListInput) => Promise<void>;
  deleteWordList: (id: string) => Promise<void>;
  importWordList: (file: File) => Promise<WordList>;
  exportWordList: (id: string) => Promise<void>;
}

// statsStore.ts
interface StatsState {
  dailyStats: DailyStat[];
  achievements: Achievement[];
  errorWords: ErrorWord[];
  streakDays: number;
  
  // Actions
  fetchStats: (startDate: Date, endDate: Date) => Promise<void>;
  fetchAchievements: () => Promise<void>;
  fetchErrorWords: () => Promise<void>;
  markErrorWordMastered: (id: string) => Promise<void>;
}
```

---

## 7. API 設計

### 7.1 Supabase API 端點

由於使用 Supabase，大部分 CRUD 操作通過 Supabase Client 直接與數據庫交互。
以下是主要的 API 操作：

#### 7.1.1 認證 API

```typescript
// 註冊
const signUp = async (email: string, password: string, metadata: UserMetadata) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: metadata.displayName,
        role: metadata.role,
      },
    },
  });
  return { data, error };
};

// 登入
const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

// 登出
const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// 重設密碼
const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email);
  return { data, error };
};
```

#### 7.1.2 詞庫 API

```typescript
// 獲取用戶詞庫列表
const getWordLists = async (userId: string) => {
  const { data, error } = await supabase
    .from('word_lists')
    .select(`
      *,
      word_items (count)
    `)
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
  return { data, error };
};

// 獲取詞庫詳情（含詞語）
const getWordListWithItems = async (listId: string) => {
  const { data, error } = await supabase
    .from('word_lists')
    .select(`
      *,
      word_items (
        id,
        content,
        pinyin,
        meaning,
        example,
        sort_order,
        error_count
      )
    `)
    .eq('id', listId)
    .single();
  return { data, error };
};

// 建立詞庫
const createWordList = async (wordList: CreateWordListInput) => {
  const { data, error } = await supabase
    .from('word_lists')
    .insert(wordList)
    .select()
    .single();
  return { data, error };
};

// 批量新增詞語
const addWordItems = async (listId: string, items: CreateWordItemInput[]) => {
  const itemsWithListId = items.map((item, index) => ({
    ...item,
    word_list_id: listId,
    sort_order: index,
  }));
  
  const { data, error } = await supabase
    .from('word_items')
    .insert(itemsWithListId)
    .select();
  return { data, error };
};

// 搜尋公開詞庫
const searchPublicWordLists = async (query: string, tags?: string[]) => {
  let queryBuilder = supabase
    .from('word_lists')
    .select(`
      *,
      users (display_name),
      word_items (count)
    `)
    .eq('is_public', true)
    .ilike('name', `%${query}%`);
  
  if (tags && tags.length > 0) {
    queryBuilder = queryBuilder.contains('tags', tags);
  }
  
  const { data, error } = await queryBuilder
    .order('practice_count', { ascending: false })
    .limit(20);
  return { data, error };
};
```

#### 7.1.3 練習 API

```typescript
// 建立練習會話
const createPracticeSession = async (session: CreateSessionInput) => {
  const { data, error } = await supabase
    .from('practice_sessions')
    .insert(session)
    .select()
    .single();
  return { data, error };
};

// 更新練習會話
const updatePracticeSession = async (
  sessionId: string, 
  updates: UpdateSessionInput
) => {
  const { data, error } = await supabase
    .from('practice_sessions')
    .update(updates)
    .eq('id', sessionId)
    .select()
    .single();
  return { data, error };
};

// 批量保存練習結果
const savePracticeResults = async (results: CreateResultInput[]) => {
  const { data, error } = await supabase
    .from('practice_results')
    .insert(results)
    .select();
  return { data, error };
};

// 完成練習會話
const completePracticeSession = async (
  sessionId: string,
  results: CreateResultInput[]
) => {
  // 使用事務確保數據一致性
  const { data: session, error: sessionError } = await supabase
    .rpc('complete_practice_session', {
      p_session_id: sessionId,
      p_results: results,
    });
  return { data: session, error: sessionError };
};
```

#### 7.1.4 統計 API

```typescript
// 獲取每日統計
const getDailyStats = async (
  userId: string, 
  startDate: string, 
  endDate: string
) => {
  const { data, error } = await supabase
    .from('daily_stats')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true });
  return { data, error };
};

// 獲取錯題本
const getErrorWords = async (userId: string) => {
  const { data, error } = await supabase
    .from('error_words')
    .select(`
      *,
      word_items (
        content,
        pinyin,
        meaning,
        word_lists (name, language)
      )
    `)
    .eq('user_id', userId)
    .eq('mastered', false)
    .order('error_count', { ascending: false });
  return { data, error };
};

// 獲取成就
const getAchievements = async (userId: string) => {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('user_id', userId)
    .order('achieved_at', { ascending: false });
  return { data, error };
};

// 獲取學習連續天數
const getStreakDays = async (userId: string) => {
  const { data, error } = await supabase
    .rpc('get_streak_days', { p_user_id: userId });
  return { data, error };
};
```

### 7.2 Edge Functions

```typescript
// supabase/functions/generate-report/index.ts
// 生成學習報告

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const { userId, startDate, endDate, reportType } = await req.json();
  
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );
  
  // 獲取統計數據
  const { data: stats } = await supabase
    .from('daily_stats')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate);
  
  // 獲取練習記錄
  const { data: sessions } = await supabase
    .from('practice_sessions')
    .select(`
      *,
      word_lists (name),
      practice_results (*)
    `)
    .eq('user_id', userId)
    .gte('started_at', startDate)
    .lte('started_at', endDate);
  
  // 計算報告數據
  const report = generateReport(stats, sessions, reportType);
  
  return new Response(JSON.stringify(report), {
    headers: { 'Content-Type': 'application/json' },
  });
});

function generateReport(stats: any[], sessions: any[], type: string) {
  const totalPracticeTime = stats.reduce((sum, s) => sum + s.practice_time, 0);
  const totalWords = stats.reduce((sum, s) => sum + s.words_practiced, 0);
  const totalCorrect = stats.reduce((sum, s) => sum + s.correct_count, 0);
  const averageScore = totalWords > 0 ? (totalCorrect / totalWords) * 100 : 0;
  
  // 找出最常錯的詞語
  const errorWordMap = new Map();
  sessions.forEach(session => {
    session.practice_results
      .filter((r: any) => !r.is_correct)
      .forEach((r: any) => {
        const count = errorWordMap.get(r.word_item_id) || 0;
        errorWordMap.set(r.word_item_id, count + 1);
      });
  });
  
  return {
    summary: {
      totalPracticeTime,
      totalWords,
      totalCorrect,
      averageScore: averageScore.toFixed(1),
      sessionsCount: sessions.length,
    },
    dailyBreakdown: stats,
    topErrorWords: Array.from(errorWordMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10),
  };
}
```

### 7.3 即時同步

```typescript
// 訂閱任務更新 (學生端)
const subscribeToTasks = (studentId: string, onUpdate: (task: Task) => void) => {
  const subscription = supabase
    .channel('tasks')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: `student_id=eq.${studentId}`,
      },
      (payload) => {
        onUpdate(payload.new as Task);
      }
    )
    .subscribe();
  
  return () => subscription.unsubscribe();
};

// 訂閱孩子學習進度 (家長端)
const subscribeToChildProgress = (
  childId: string, 
  onUpdate: (session: PracticeSession) => void
) => {
  const subscription = supabase
    .channel('child_progress')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'practice_sessions',
        filter: `user_id=eq.${childId}`,
      },
      (payload) => {
        onUpdate(payload.new as PracticeSession);
      }
    )
    .subscribe();
  
  return () => subscription.unsubscribe();
};
```

---

## 8. 核心模組實現規格

### 8.1 語音合成模組 (Speech Service)

```typescript
// src/services/speech.ts

import * as Speech from 'expo-speech';
import { Platform } from 'react-native';

export interface SpeechOptions {
  language: 'yue-HK' | 'zh-CN' | 'en-GB';
  voice?: string;
  rate: number;        // 0.5 - 1.3
  pitch?: number;      // 0.5 - 2.0
  onStart?: () => void;
  onDone?: () => void;
  onError?: (error: Error) => void;
  onStopped?: () => void;
}

export interface Voice {
  identifier: string;
  name: string;
  language: string;
  quality: string;
}

class SpeechService {
  private isSpeaking = false;
  private isPaused = false;
  private availableVoices: Voice[] = [];
  
  // 初始化並獲取可用語音
  async initialize(): Promise<void> {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      this.availableVoices = voices;
    } catch (error) {
      console.error('Failed to get voices:', error);
    }
  }
  
  // 獲取指定語言的語音列表
  getVoicesForLanguage(language: string): Voice[] {
    const langMap: Record<string, string[]> = {
      'yue-HK': ['yue-HK', 'yue', 'zh-HK'],
      'zh-CN': ['zh-CN', 'cmn-CN', 'zh'],
      'en-GB': ['en-GB', 'en-US', 'en'],
    };
    
    const targetLangs = langMap[language] || [language];
    
    return this.availableVoices.filter(voice =>
      targetLangs.some(lang => 
        voice.language.toLowerCase().includes(lang.toLowerCase())
      )
    );
  }
  
  // 找到最佳匹配的語音
  findBestVoice(language: string): Voice | undefined {
    const voices = this.getVoicesForLanguage(language);
    
    // iOS 優先選擇特定語音
    if (Platform.OS === 'ios') {
      const preferredVoices: Record<string, string> = {
        'yue-HK': '善怡',
        'zh-CN': '婷婷',
        'en-GB': 'Daniel',
      };
      
      const preferred = voices.find(v => 
        v.name.includes(preferredVoices[language])
      );
      if (preferred) return preferred;
    }
    
    // 返回第一個匹配的語音
    return voices[0];
  }
  
  // 朗讀文字
  async speak(text: string, options: SpeechOptions): Promise<void> {
    if (this.isSpeaking) {
      await this.stop();
    }
    
    return new Promise((resolve, reject) => {
      const voice = options.voice || this.findBestVoice(options.language)?.identifier;
      
      const speechOptions: Speech.SpeechOptions = {
        language: options.language,
        voice,
        rate: options.rate,
        pitch: options.pitch || 1.0,
        onStart: () => {
          this.isSpeaking = true;
          this.isPaused = false;
          options.onStart?.();
        },
        onDone: () => {
          this.isSpeaking = false;
          options.onDone?.();
          resolve();
        },
        onError: (error) => {
          this.isSpeaking = false;
          options.onError?.(new Error(error.message));
          reject(error);
        },
        onStopped: () => {
          this.isSpeaking = false;
          options.onStopped?.();
          resolve();
        },
      };
      
      Speech.speak(text, speechOptions);
    });
  }
  
  // 暫停朗讀
  async pause(): Promise<void> {
    if (this.isSpeaking && !this.isPaused) {
      await Speech.pause();
      this.isPaused = true;
    }
  }
  
  // 繼續朗讀
  async resume(): Promise<void> {
    if (this.isPaused) {
      await Speech.resume();
      this.isPaused = false;
    }
  }
  
  // 停止朗讀
  async stop(): Promise<void> {
    await Speech.stop();
    this.isSpeaking = false;
    this.isPaused = false;
  }
  
  // 檢查是否正在朗讀
  async isSpeakingAsync(): Promise<boolean> {
    return Speech.isSpeakingAsync();
  }
  
  // 獲取狀態
  getStatus() {
    return {
      isSpeaking: this.isSpeaking,
      isPaused: this.isPaused,
    };
  }
}

export const speechService = new SpeechService();
```

### 8.2 文字處理模組 (Text Utils)

```typescript
// src/utils/text.ts

// 標點符號正則表達式
const PUNCTUATION_PATTERN = /[。！？；，、．.!?;,：:「」""''（）()—–…－\-《》·]/;

// 中文標點符號名稱對照表
const CHINESE_PUNCTUATION_MAP: Record<string, string> = {
  '，': '逗號',
  '。': '句號',
  '！': '感嘆號',
  '？': '問號',
  '；': '分號',
  '：': '冒號',
  '、': '頓號',
  '"': '開引號',
  '"': '關引號',
  ''': '開單引號',
  ''': '關單引號',
  '「': '開引號',
  '」': '關引號',
  '（': '開括號',
  '）': '關括號',
  '—': '破折號',
  '——': '破折號',
  '…': '省略號',
  '……': '省略號',
  '《': '開書名號',
  '》': '關書名號',
  '·': '間隔號',
};

// 英文標點符號名稱對照表
const ENGLISH_PUNCTUATION_MAP: Record<string, string> = {
  ',': 'comma',
  '.': 'full stop',
  '!': 'exclamation mark',
  '?': 'question mark',
  ';': 'semicolon',
  ':': 'colon',
  '"': 'quote',
  "'": 'apostrophe',
  '(': 'open parenthesis',
  ')': 'close parenthesis',
  '-': 'hyphen',
  '—': 'dash',
  '...': 'ellipsis',
};

export interface TextSegment {
  type: 'text' | 'punct';
  content: string;
}

/**
 * 將文章分割成文字和標點符號段落
 */
export function splitArticleSegments(text: string): TextSegment[] {
  if (!text || typeof text !== 'string') {
    return [];
  }
  
  const segments: TextSegment[] = [];
  let currentText = '';
  let currentPunct = '';
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    
    if (PUNCTUATION_PATTERN.test(char)) {
      // 保存之前的文字
      if (currentText.length > 0) {
        segments.push({ type: 'text', content: currentText });
        currentText = '';
      }
      
      // 合併連續相同標點符號
      if (currentPunct.length > 0 && currentPunct[0] === char) {
        currentPunct += char;
      } else {
        if (currentPunct.length > 0) {
          segments.push({ type: 'punct', content: currentPunct });
        }
        currentPunct = char;
      }
    } else {
      // 保存之前的標點符號
      if (currentPunct.length > 0) {
        segments.push({ type: 'punct', content: currentPunct });
        currentPunct = '';
      }
      currentText += char;
    }
  }
  
  // 處理剩餘內容
  if (currentPunct.length > 0) {
    segments.push({ type: 'punct', content: currentPunct });
  }
  if (currentText.length > 0) {
    segments.push({ type: 'text', content: currentText });
  }
  
  return segments;
}

/**
 * 獲取標點符號的朗讀名稱
 */
export function getPunctuationName(punct: string, language: string): string {
  if (!punct) return '';
  
  const isChinese = language.startsWith('zh') || language === 'yue-HK';
  const map = isChinese ? CHINESE_PUNCTUATION_MAP : ENGLISH_PUNCTUATION_MAP;
  
  return map[punct] || punct;
}

/**
 * 將詞語文字按行分割
 */
export function splitWordLines(text: string): string[] {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line !== '');
}

/**
 * 計算中文字數
 */
export function countChineseCharacters(text: string): number {
  const matches = text.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g);
  return matches ? matches.length : 0;
}

/**
 * 計算英文單詞數
 */
export function countEnglishWords(text: string): number {
  const words = text.split(/\s+/).filter(w => w.length > 0);
  return words.length;
}

/**
 * 計算書寫等待時間
 */
export function calculateWaitTime(
  content: string, 
  charWaitTime: number,
  language: string
): number {
  const chineseCount = countChineseCharacters(content);
  
  if (chineseCount > 0) {
    // 中文：按字數計算
    return chineseCount * charWaitTime * 1000;
  } else {
    // 英文：按單詞數計算
    const wordCount = countEnglishWords(content);
    return Math.max(1, wordCount) * charWaitTime * 1000;
  }
}

/**
 * 檢查文字是否包含中文
 */
export function containsChinese(text: string): boolean {
  return /[\u4e00-\u9fff\u3400-\u4dbf]/.test(text);
}

/**
 * 驗證文字與語言是否匹配
 */
export function validateTextLanguage(
  text: string, 
  language: string
): { valid: boolean; errorMessage?: string } {
  const trimmedText = text.replace(/\s/g, '');
  if (trimmedText === '') {
    return { valid: true };
  }
  
  const hasChinese = containsChinese(text);
  
  if (language === 'zh-HK' || language === 'zh-CN' || language === 'yue-HK') {
    if (!hasChinese) {
      return {
        valid: false,
        errorMessage: language === 'zh-CN' 
          ? '普通話模式請輸入中文文字'
          : '粵語模式請輸入中文文字',
      };
    }
  } else if (language === 'en-GB') {
    if (hasChinese) {
      return {
        valid: false,
        errorMessage: '英語模式請輸入英文文字',
      };
    }
  }
  
  return { valid: true };
}
```

### 8.3 練習控制 Hook (usePractice)

```typescript
// src/hooks/usePractice.ts

import { useState, useCallback, useRef, useEffect } from 'react';
import { speechService, SpeechOptions } from '../services/speech';
import { splitWordLines, splitArticleSegments, calculateWaitTime, getPunctuationName } from '../utils/text';
import { usePracticeStore } from '../stores/practiceStore';

export interface PracticeConfig {
  language: 'yue-HK' | 'zh-CN' | 'en-GB';
  voice?: string;
  rate: number;
  repeatCount: number;
  charWaitTime: number;
  readPunctuation: boolean;
  readingMode: 'auto' | 'manual';
}

export interface PracticeItem {
  id: string;
  type: 'text' | 'punct';
  content: string;
  displayContent: string;
}

export function usePractice(mode: 'word' | 'article') {
  const [items, setItems] = useState<PracticeItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [waitingTime, setWaitingTime] = useState(0);
  const [currentRepeat, setCurrentRepeat] = useState(0);
  
  const stopFlagRef = useRef(false);
  const waitTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const store = usePracticeStore();
  
  // 初始化練習項目
  const initializeItems = useCallback((text: string, config: PracticeConfig) => {
    let practiceItems: PracticeItem[];
    
    if (mode === 'word') {
      const lines = splitWordLines(text);
      practiceItems = lines.map((line, index) => ({
        id: `word-${index}`,
        type: 'text' as const,
        content: line,
        displayContent: line,
      }));
    } else {
      const segments = splitArticleSegments(text);
      practiceItems = segments
        .filter(seg => config.readPunctuation || seg.type === 'text')
        .map((seg, index) => ({
          id: `seg-${index}`,
          type: seg.type,
          content: seg.content,
          displayContent: seg.type === 'punct' 
            ? getPunctuationName(seg.content, config.language)
            : seg.content,
        }));
    }
    
    setItems(practiceItems);
    setCurrentIndex(-1);
    setIsPlaying(false);
    setIsPaused(false);
    stopFlagRef.current = false;
    
    return practiceItems;
  }, [mode]);
  
  // 朗讀單個項目
  const speakItem = useCallback(async (
    item: PracticeItem, 
    config: PracticeConfig
  ): Promise<boolean> => {
    if (stopFlagRef.current) return false;
    
    const textToSpeak = item.type === 'punct'
      ? getPunctuationName(item.content, config.language)
      : item.content;
    
    setIsSpeaking(true);
    
    try {
      await speechService.speak(textToSpeak, {
        language: config.language,
        voice: config.voice,
        rate: config.rate,
        onStart: () => setIsSpeaking(true),
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
      });
      return true;
    } catch (error) {
      console.error('Speech error:', error);
      setIsSpeaking(false);
      return false;
    }
  }, []);
  
  // 等待指定時間
  const wait = useCallback((ms: number): Promise<void> => {
    return new Promise((resolve) => {
      if (ms <= 0 || stopFlagRef.current) {
        resolve();
        return;
      }
      
      const startTime = Date.now();
      const updateInterval = 100;
      
      const tick = () => {
        if (stopFlagRef.current) {
          setWaitingTime(0);
          resolve();
          return;
        }
        
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, ms - elapsed);
        setWaitingTime(Math.ceil(remaining / 1000));
        
        if (remaining <= 0) {
          setWaitingTime(0);
          resolve();
        } else {
          waitTimerRef.current = setTimeout(tick, updateInterval);
        }
      };
      
      tick();
    });
  }, []);
  
  // 自動朗讀模式
  const startAutoReading = useCallback(async (config: PracticeConfig) => {
    setIsPlaying(true);
    setIsPaused(false);
    stopFlagRef.current = false;
    
    for (let i = 0; i < items.length; i++) {
      if (stopFlagRef.current) break;
      
      setCurrentIndex(i);
      const item = items[i];
      
      // 文字項目：重複朗讀 + 等待
      if (item.type === 'text') {
        const waitTime = calculateWaitTime(item.content, config.charWaitTime, config.language);
        const waitPerRepeat = waitTime / config.repeatCount;
        
        for (let r = 0; r < config.repeatCount; r++) {
          if (stopFlagRef.current) break;
          
          setCurrentRepeat(r + 1);
          await speakItem(item, config);
          
          if (!stopFlagRef.current && waitPerRepeat > 0) {
            await wait(waitPerRepeat);
          }
        }
      } else {
        // 標點符號：只讀一次
        await speakItem(item, config);
        await wait(500); // 短暫停頓
      }
    }
    
    setIsPlaying(false);
    setCurrentRepeat(0);
  }, [items, speakItem, wait]);
  
  // 手動模式：開始/重讀
  const manualStart = useCallback(async (config: PracticeConfig) => {
    if (currentIndex < 0) {
      setCurrentIndex(0);
    }
    
    const item = items[currentIndex >= 0 ? currentIndex : 0];
    if (item) {
      setIsPlaying(true);
      await speakItem(item, config);
      setIsPlaying(false);
    }
  }, [items, currentIndex, speakItem]);
  
  // 手動模式：下一個
  const manualNext = useCallback(async (config: PracticeConfig) => {
    if (currentIndex < items.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      
      setIsPlaying(true);
      await speakItem(items[nextIndex], config);
      setIsPlaying(false);
    }
  }, [items, currentIndex, speakItem]);
  
  // 手動模式：上一個
  const manualPrevious = useCallback(async (config: PracticeConfig) => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      
      setIsPlaying(true);
      await speakItem(items[prevIndex], config);
      setIsPlaying(false);
    }
  }, [items, currentIndex, speakItem]);
  
  // 暫停
  const pause = useCallback(async () => {
    setIsPaused(true);
    await speechService.pause();
  }, []);
  
  // 繼續
  const resume = useCallback(async () => {
    setIsPaused(false);
    await speechService.resume();
  }, []);
  
  // 停止
  const stop = useCallback(async () => {
    stopFlagRef.current = true;
    setIsPlaying(false);
    setIsPaused(false);
    setIsSpeaking(false);
    setWaitingTime(0);
    setCurrentRepeat(0);
    
    if (waitTimerRef.current) {
      clearTimeout(waitTimerRef.current);
    }
    
    await speechService.stop();
  }, []);
  
  // 清理
  useEffect(() => {
    return () => {
      stopFlagRef.current = true;
      if (waitTimerRef.current) {
        clearTimeout(waitTimerRef.current);
      }
      speechService.stop();
    };
  }, []);
  
  return {
    // 狀態
    items,
    currentIndex,
    currentItem: items[currentIndex] || null,
    isPlaying,
    isPaused,
    isSpeaking,
    waitingTime,
    currentRepeat,
    progress: items.length > 0 ? ((currentIndex + 1) / items.length) * 100 : 0,
    
    // 方法
    initializeItems,
    startAutoReading,
    manualStart,
    manualNext,
    manualPrevious,
    pause,
    resume,
    stop,
  };
}
```

---

## 9. 開發計劃

### 9.1 開發階段

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              開發時間線 (16 週)                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Phase 1: 基礎架構 (Week 1-3)                                               │
│  ├── Week 1: 專案初始化、技術選型確認                                         │
│  ├── Week 2: 基礎架構搭建、導航系統                                           │
│  └── Week 3: 認證系統、Supabase 整合                                         │
│                                                                             │
│  Phase 2: 核心功能 (Week 4-8)                                               │
│  ├── Week 4: 語音合成模組開發                                                │
│  ├── Week 5: 詞庫管理功能                                                    │
│  ├── Week 6: 練習模組 - 詞語模式                                             │
│  ├── Week 7: 練習模組 - 文章模式                                             │
│  └── Week 8: 練習結果與自評功能                                              │
│                                                                             │
│  Phase 3: 進階功能 (Week 9-12)                                              │
│  ├── Week 9: 統計與成就系統                                                  │
│  ├── Week 10: 錯題本功能                                                    │
│  ├── Week 11: 家長模組 - 孩子管理                                            │
│  └── Week 12: 家長模組 - 任務指派與報告                                       │
│                                                                             │
│  Phase 4: 優化與發布 (Week 13-16)                                           │
│  ├── Week 13: 離線功能、數據同步                                             │
│  ├── Week 14: UI/UX 優化、無障礙測試                                         │
│  ├── Week 15: 性能優化、Bug 修復                                             │
│  └── Week 16: App Store / Play Store 提交                                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 9.2 詳細任務分解

#### Phase 1: 基礎架構 (Week 1-3)

| 週次 | 任務 | 交付物 | 負責人 |
|------|------|--------|--------|
| W1 | 專案初始化 | Expo 專案、Git 倉庫 | 全端 |
| W1 | 目錄結構建立 | 完整目錄架構 | 全端 |
| W1 | 開發環境配置 | ESLint, Prettier, TypeScript | 全端 |
| W2 | 導航系統實現 | Tab Navigator, Stack Navigator | 前端 |
| W2 | 主題系統實現 | Light/Dark 主題切換 | 前端 |
| W2 | 基礎組件庫 | Button, Card, Input, Modal | 前端 |
| W3 | Supabase 專案建立 | 數據庫 Schema, RLS 策略 | 後端 |
| W3 | 認證流程實現 | 登入、註冊、登出 | 全端 |
| W3 | 用戶狀態管理 | AuthStore, 持久化 | 前端 |

#### Phase 2: 核心功能 (Week 4-8)

| 週次 | 任務 | 交付物 | 負責人 |
|------|------|--------|--------|
| W4 | TTS 服務封裝 | SpeechService 類 | 前端 |
| W4 | 語音選擇功能 | 語言/語音選擇 UI | 前端 |
| W4 | 語音測試頁面 | 語音預覽功能 | 前端 |
| W5 | 詞庫列表頁面 | 詞庫卡片、篩選 | 前端 |
| W5 | 詞庫建立/編輯 | 表單、批量輸入 | 前端 |
| W5 | 詞庫 CRUD API | Supabase 查詢 | 後端 |
| W6 | 詞語練習頁面 | 練習 UI、控制面板 | 前端 |
| W6 | 自動朗讀邏輯 | usePractice Hook | 前端 |
| W6 | 進度條與高亮 | ProgressBar, HighlightText | 前端 |
| W7 | 文章練習頁面 | 文章分段顯示 | 前端 |
| W7 | 手動朗讀邏輯 | 上一個/下一個控制 | 前端 |
| W7 | 標點符號處理 | 標點朗讀開關 | 前端 |
| W8 | 練習結果頁面 | 成績顯示、錯詞列表 | 前端 |
| W8 | 自評功能 | 正確/錯誤標記 | 前端 |
| W8 | 練習記錄保存 | Session API | 後端 |

#### Phase 3: 進階功能 (Week 9-12)

| 週次 | 任務 | 交付物 | 負責人 |
|------|------|--------|--------|
| W9 | 統計頁面 | 日曆熱力圖、圖表 | 前端 |
| W9 | 成就系統 | 徽章、解鎖邏輯 | 全端 |
| W9 | 統計 API | 聚合查詢、Edge Function | 後端 |
| W10 | 錯題本頁面 | 錯詞列表、複習功能 | 前端 |
| W10 | 錯詞自動收集 | 練習後自動添加 | 前端 |
| W10 | 掌握標記功能 | 移出錯題本 | 前端 |
| W11 | 家長儀表板 | 孩子列表、快速統計 | 前端 |
| W11 | 孩子綁定功能 | 邀請碼/QR Code | 全端 |
| W11 | 孩子切換功能 | 多孩子支援 | 前端 |
| W12 | 任務指派功能 | 建立任務、截止日期 | 全端 |
| W12 | 學習報告 | 每日/每週報告 | 全端 |
| W12 | 推送通知 | 任務提醒、學習提醒 | 全端 |

#### Phase 4: 優化與發布 (Week 13-16)

| 週次 | 任務 | 交付物 | 負責人 |
|------|------|--------|--------|
| W13 | 離線存儲 | SQLite 本地數據庫 | 前端 |
| W13 | 數據同步 | 衝突解決、增量同步 | 全端 |
| W13 | 離線練習 | 無網絡時可用 | 前端 |
| W14 | UI 細節優化 | 動畫、過渡效果 | 前端 |
| W14 | 無障礙測試 | VoiceOver/TalkBack | QA |
| W14 | 多語言支援 | i18n 完善 | 前端 |
| W15 | 性能優化 | 列表虛擬化、懶加載 | 前端 |
| W15 | Bug 修復 | 測試反饋處理 | 全端 |
| W15 | 安全審查 | 數據加密、權限檢查 | 後端 |
| W16 | App Store 準備 | 截圖、描述、隱私政策 | PM |
| W16 | TestFlight/內測 | Beta 測試 | QA |
| W16 | 正式發布 | App Store / Play Store | PM |

### 9.3 里程碑

| 里程碑 | 日期 | 交付物 |
|--------|------|--------|
| M1: 基礎架構完成 | Week 3 | 可登入的 App 骨架 |
| M2: 核心功能完成 | Week 8 | 可進行完整練習流程 |
| M3: 進階功能完成 | Week 12 | 家長功能、統計功能 |
| M4: Beta 版本 | Week 15 | 內測版本 |
| M5: 正式發布 | Week 16 | App Store / Play Store 上架 |

### 9.4 風險評估

| 風險 | 可能性 | 影響 | 緩解措施 |
|------|--------|------|----------|
| iOS TTS 語音限制 | 高 | 中 | 提供語音設定指引，支援多種語音 |
| 離線同步衝突 | 中 | 高 | 設計完善的衝突解決策略 |
| App Store 審核延遲 | 中 | 中 | 提前準備，預留緩衝時間 |
| 性能問題 (大詞庫) | 中 | 中 | 分頁加載，虛擬列表 |
| 用戶隱私合規 | 低 | 高 | 遵循 GDPR/PDPO，最小數據收集 |

---

## 10. 測試策略

### 10.1 測試層級

```
┌─────────────────────────────────────────────────────────────────┐
│                         測試金字塔                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                        ┌─────────┐                              │
│                        │  E2E   │  10%                          │
│                        │  測試   │  (Detox)                      │
│                       ┌┴─────────┴┐                             │
│                       │  整合測試  │  20%                        │
│                       │ (API/Hook)│                             │
│                      ┌┴───────────┴┐                            │
│                      │   單元測試   │  70%                       │
│                      │ (Jest/Vitest)│                           │
│                      └─────────────┘                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 10.2 單元測試

#### 10.2.1 文字處理函數測試

```typescript
// tests/utils/text.test.ts

import { describe, it, expect } from 'vitest';
import {
  splitArticleSegments,
  splitWordLines,
  getPunctuationName,
  countChineseCharacters,
  countEnglishWords,
  calculateWaitTime,
  validateTextLanguage,
} from '../../src/utils/text';

describe('splitArticleSegments', () => {
  it('should split text and punctuation correctly', () => {
    const result = splitArticleSegments('你好，世界！');
    expect(result).toEqual([
      { type: 'text', content: '你好' },
      { type: 'punct', content: '，' },
      { type: 'text', content: '世界' },
      { type: 'punct', content: '！' },
    ]);
  });
  
  it('should handle empty string', () => {
    expect(splitArticleSegments('')).toEqual([]);
  });
  
  it('should handle null/undefined', () => {
    expect(splitArticleSegments(null as any)).toEqual([]);
    expect(splitArticleSegments(undefined as any)).toEqual([]);
  });
  
  it('should merge consecutive same punctuation', () => {
    const result = splitArticleSegments('等等……');
    expect(result).toEqual([
      { type: 'text', content: '等等' },
      { type: 'punct', content: '……' },
    ]);
  });
  
  it('should handle text without punctuation', () => {
    const result = splitArticleSegments('你好世界');
    expect(result).toEqual([
      { type: 'text', content: '你好世界' },
    ]);
  });
});

describe('splitWordLines', () => {
  it('should split by newlines and trim', () => {
    const result = splitWordLines('蘋果\n  香蕉  \n橙');
    expect(result).toEqual(['蘋果', '香蕉', '橙']);
  });
  
  it('should filter empty lines', () => {
    const result = splitWordLines('蘋果\n\n香蕉\n  \n橙');
    expect(result).toEqual(['蘋果', '香蕉', '橙']);
  });
});

describe('getPunctuationName', () => {
  it('should return Chinese punctuation names', () => {
    expect(getPunctuationName('，', 'zh-HK')).toBe('逗號');
    expect(getPunctuationName('。', 'zh-CN')).toBe('句號');
    expect(getPunctuationName('！', 'yue-HK')).toBe('感嘆號');
  });
  
  it('should return English punctuation names', () => {
    expect(getPunctuationName(',', 'en-GB')).toBe('comma');
    expect(getPunctuationName('.', 'en-GB')).toBe('full stop');
    expect(getPunctuationName('!', 'en-GB')).toBe('exclamation mark');
  });
  
  it('should return original if not found', () => {
    expect(getPunctuationName('★', 'zh-HK')).toBe('★');
  });
});

describe('countChineseCharacters', () => {
  it('should count Chinese characters only', () => {
    expect(countChineseCharacters('你好世界')).toBe(4);
    expect(countChineseCharacters('Hello 世界')).toBe(2);
    expect(countChineseCharacters('Hello World')).toBe(0);
  });
});

describe('countEnglishWords', () => {
  it('should count words separated by spaces', () => {
    expect(countEnglishWords('Hello World')).toBe(2);
    expect(countEnglishWords('Good morning everyone')).toBe(3);
    expect(countEnglishWords('  spaced  out  ')).toBe(2);
  });
});

describe('calculateWaitTime', () => {
  it('should calculate based on Chinese characters', () => {
    // 2 characters × 3 seconds = 6000ms
    expect(calculateWaitTime('你好', 3, 'zh-HK')).toBe(6000);
  });
  
  it('should calculate based on English words', () => {
    // 2 words × 3 seconds = 6000ms
    expect(calculateWaitTime('Hello World', 3, 'en-GB')).toBe(6000);
  });
  
  it('should handle mixed content by Chinese count', () => {
    // Has Chinese, so use Chinese count: 2 × 3 = 6000ms
    expect(calculateWaitTime('Hello 世界', 3, 'zh-HK')).toBe(6000);
  });
});

describe('validateTextLanguage', () => {
  it('should validate Chinese text for Chinese languages', () => {
    expect(validateTextLanguage('你好', 'zh-HK').valid).toBe(true);
    expect(validateTextLanguage('你好', 'zh-CN').valid).toBe(true);
    expect(validateTextLanguage('Hello', 'zh-HK').valid).toBe(false);
  });
  
  it('should validate English text for English language', () => {
    expect(validateTextLanguage('Hello', 'en-GB').valid).toBe(true);
    expect(validateTextLanguage('你好', 'en-GB').valid).toBe(false);
  });
  
  it('should allow empty text', () => {
    expect(validateTextLanguage('', 'zh-HK').valid).toBe(true);
    expect(validateTextLanguage('   ', 'en-GB').valid).toBe(true);
  });
});
```

#### 10.2.2 狀態管理測試

```typescript
// tests/stores/practiceStore.test.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { usePracticeStore } from '../../src/stores/practiceStore';

describe('practiceStore', () => {
  beforeEach(() => {
    usePracticeStore.getState().reset();
  });
  
  it('should initialize with default state', () => {
    const state = usePracticeStore.getState();
    expect(state.currentSession).toBeNull();
    expect(state.currentIndex).toBe(-1);
    expect(state.isPlaying).toBe(false);
  });
  
  it('should start session correctly', () => {
    const store = usePracticeStore.getState();
    const mockWordList = {
      id: '1',
      name: 'Test',
      items: [{ id: '1', content: '蘋果' }],
    };
    
    store.startSession(mockWordList, {
      language: 'zh-HK',
      rate: 0.9,
      repeatCount: 1,
      charWaitTime: 3,
      readPunctuation: true,
      readingMode: 'auto',
    });
    
    expect(usePracticeStore.getState().currentSession).not.toBeNull();
    expect(usePracticeStore.getState().currentIndex).toBe(0);
  });
  
  it('should mark result correctly', () => {
    const store = usePracticeStore.getState();
    // Setup session first...
    
    store.markResult('item-1', true);
    
    const session = usePracticeStore.getState().currentSession;
    expect(session?.results.find(r => r.itemId === 'item-1')?.isCorrect).toBe(true);
  });
});
```

### 10.3 整合測試

```typescript
// tests/integration/practice-flow.test.ts

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { usePractice } from '../../src/hooks/usePractice';
import { speechService } from '../../src/services/speech';

// Mock speech service
vi.mock('../../src/services/speech', () => ({
  speechService: {
    speak: vi.fn().mockResolvedValue(undefined),
    stop: vi.fn().mockResolvedValue(undefined),
    pause: vi.fn().mockResolvedValue(undefined),
    resume: vi.fn().mockResolvedValue(undefined),
  },
}));

describe('Practice Flow Integration', () => {
  const mockConfig = {
    language: 'zh-HK' as const,
    rate: 0.9,
    repeatCount: 2,
    charWaitTime: 1,
    readPunctuation: true,
    readingMode: 'auto' as const,
  };
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('should initialize word mode items correctly', () => {
    const { result } = renderHook(() => usePractice('word'));
    
    act(() => {
      result.current.initializeItems('蘋果\n香蕉\n橙', mockConfig);
    });
    
    expect(result.current.items).toHaveLength(3);
    expect(result.current.items[0].content).toBe('蘋果');
    expect(result.current.items[1].content).toBe('香蕉');
    expect(result.current.items[2].content).toBe('橙');
  });
  
  it('should initialize article mode items with punctuation', () => {
    const { result } = renderHook(() => usePractice('article'));
    
    act(() => {
      result.current.initializeItems('你好，世界！', mockConfig);
    });
    
    expect(result.current.items).toHaveLength(4);
    expect(result.current.items[0]).toEqual({ 
      id: expect.any(String),
      type: 'text', 
      content: '你好',
      displayContent: '你好',
    });
    expect(result.current.items[1]).toEqual({ 
      id: expect.any(String),
      type: 'punct', 
      content: '，',
      displayContent: '逗號',
    });
  });
  
  it('should call speech service during auto reading', async () => {
    const { result } = renderHook(() => usePractice('word'));
    
    act(() => {
      result.current.initializeItems('蘋果', {
        ...mockConfig,
        repeatCount: 1,
        charWaitTime: 0,
      });
    });
    
    await act(async () => {
      await result.current.startAutoReading({
        ...mockConfig,
        repeatCount: 1,
        charWaitTime: 0,
      });
    });
    
    expect(speechService.speak).toHaveBeenCalledWith(
      '蘋果',
      expect.objectContaining({
        language: 'zh-HK',
        rate: 0.9,
      })
    );
  });
  
  it('should stop reading when stop is called', async () => {
    const { result } = renderHook(() => usePractice('word'));
    
    act(() => {
      result.current.initializeItems('蘋果\n香蕉', mockConfig);
    });
    
    // Start reading
    const readingPromise = act(async () => {
      result.current.startAutoReading(mockConfig);
    });
    
    // Stop immediately
    await act(async () => {
      await result.current.stop();
    });
    
    expect(result.current.isPlaying).toBe(false);
    expect(speechService.stop).toHaveBeenCalled();
  });
});
```

### 10.4 E2E 測試 (Detox)

```typescript
// e2e/practice.e2e.ts

import { device, element, by, expect } from 'detox';

describe('Practice Flow E2E', () => {
  beforeAll(async () => {
    await device.launchApp();
  });
  
  beforeEach(async () => {
    await device.reloadReactNative();
  });
  
  it('should complete a word practice session', async () => {
    // Navigate to practice
    await element(by.id('tab-practice')).tap();
    
    // Select word mode
    await element(by.id('mode-word')).tap();
    
    // Enter words
    await element(by.id('input-words')).typeText('蘋果\n香蕉\n橙');
    
    // Start practice
    await element(by.id('btn-start')).tap();
    
    // Wait for practice to complete (or tap through)
    await waitFor(element(by.id('practice-complete')))
      .toBeVisible()
      .withTimeout(30000);
    
    // Verify result screen
    await expect(element(by.id('result-score'))).toBeVisible();
    await expect(element(by.text('練習完成！'))).toBeVisible();
  });
  
  it('should allow manual mode navigation', async () => {
    await element(by.id('tab-practice')).tap();
    await element(by.id('mode-word')).tap();
    await element(by.id('input-words')).typeText('蘋果\n香蕉');
    
    // Switch to manual mode
    await element(by.id('reading-mode-manual')).tap();
    
    // Start
    await element(by.id('btn-manual-start')).tap();
    
    // Verify first item is highlighted
    await expect(element(by.id('highlight-0'))).toHaveStyle({
      backgroundColor: expect.any(String),
    });
    
    // Go to next
    await element(by.id('btn-next')).tap();
    
    // Verify second item is highlighted
    await expect(element(by.id('highlight-1'))).toHaveStyle({
      backgroundColor: expect.any(String),
    });
  });
  
  it('should save practice results', async () => {
    // Complete a practice session
    await element(by.id('tab-practice')).tap();
    await element(by.id('quick-start')).tap();
    
    // Wait for completion
    await waitFor(element(by.id('practice-complete')))
      .toBeVisible()
      .withTimeout(30000);
    
    // Mark some as correct/incorrect
    await element(by.id('item-0-correct')).tap();
    await element(by.id('item-1-incorrect')).tap();
    
    // Save results
    await element(by.id('btn-save-results')).tap();
    
    // Navigate to stats
    await element(by.id('tab-stats')).tap();
    
    // Verify today's stats updated
    await expect(element(by.id('today-practice-count'))).not.toHaveText('0');
  });
});
```

### 10.5 無障礙測試

```typescript
// tests/accessibility/a11y.test.ts

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react-native';
import { axe } from 'jest-axe';
import { PracticeScreen } from '../../src/screens/PracticeScreen';

describe('Accessibility', () => {
  it('should have no accessibility violations on PracticeScreen', async () => {
    const { container } = render(<PracticeScreen />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('should have proper labels on interactive elements', () => {
    const { getByLabelText } = render(<PracticeScreen />);
    
    expect(getByLabelText('開始朗讀')).toBeTruthy();
    expect(getByLabelText('暫停朗讀')).toBeTruthy();
    expect(getByLabelText('停止朗讀')).toBeTruthy();
  });
  
  it('should announce progress changes', () => {
    const { getByRole } = render(<PracticeScreen />);
    
    const progressBar = getByRole('progressbar');
    expect(progressBar.props.accessibilityValue).toBeDefined();
  });
});
```

### 10.6 測試覆蓋率目標

| 模組 | 目標覆蓋率 |
|------|-----------|
| Utils (文字處理) | 95% |
| Services (語音、存儲) | 85% |
| Hooks (業務邏輯) | 80% |
| Stores (狀態管理) | 80% |
| Components (UI) | 70% |
| 整體 | 80% |

---

## 11. 部署與發布

### 11.1 環境配置

```typescript
// app.config.ts (Expo 配置)

import { ExpoConfig, ConfigContext } from 'expo/config';

const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: IS_DEV ? '默書神器 (Dev)' : IS_PREVIEW ? '默書神器 (Preview)' : '默書神器',
  slug: 'dictation-master',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#10B981',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: IS_DEV 
      ? 'com.dictationmaster.dev' 
      : IS_PREVIEW 
        ? 'com.dictationmaster.preview'
        : 'com.dictationmaster.app',
    buildNumber: '1',
    infoPlist: {
      NSSpeechRecognitionUsageDescription: '用於語音朗讀功能',
      UIBackgroundModes: ['audio'],
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#10B981',
    },
    package: IS_DEV 
      ? 'com.dictationmaster.dev' 
      : IS_PREVIEW 
        ? 'com.dictationmaster.preview'
        : 'com.dictationmaster.app',
    versionCode: 1,
    permissions: [
      'android.permission.INTERNET',
      'android.permission.VIBRATE',
    ],
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    [
      'expo-notifications',
      {
        icon: './assets/notification-icon.png',
        color: '#10B981',
      },
    ],
  ],
  extra: {
    eas: {
      projectId: 'your-project-id',
    },
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  },
});
```

### 11.2 EAS Build 配置

```json
// eas.json

{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": {
        "APP_VARIANT": "development"
      },
      "ios": {
        "simulator": true
      },
      "android": {
        "buildType": "apk"
      }
    },
    "preview": {
      "distribution": "internal",
      "env": {
        "APP_VARIANT": "preview"
      },
      "ios": {
        "resourceClass": "m-medium"
      },
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "env": {
        "APP_VARIANT": "production"
      },
      "ios": {
        "resourceClass": "m-medium"
      },
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "your-app-store-connect-app-id",
        "appleTeamId": "your-team-id"
      },
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "production"
      }
    }
  }
}
```

### 11.3 CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/build.yml

name: Build and Deploy

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run type check
        run: npm run typecheck
      
      - name: Run tests
        run: npm run test -- --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}

  build-preview:
    needs: test
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build Preview
        run: eas build --platform all --profile preview --non-interactive

  build-production:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build Production
        run: eas build --platform all --profile production --non-interactive
      
      - name: Submit to App Stores
        if: startsWith(github.ref, 'refs/tags/v')
        run: eas submit --platform all --profile production --non-interactive
```

### 11.4 App Store 準備清單

#### iOS App Store

- [ ] App 名稱：默書神器 - Dictation Master
- [ ] 副標題：中小學生默書練習助手
- [ ] 類別：教育
- [ ] 年齡分級：4+
- [ ] 隱私政策 URL
- [ ] 支援 URL
- [ ] 行銷 URL (可選)
- [ ] 截圖 (6.5", 5.5", 12.9" iPad)
- [ ] App 預覽影片 (可選)
- [ ] 關鍵字
- [ ] 描述 (4000 字以內)
- [ ] 新功能說明
- [ ] 審核備註

#### Google Play Store

- [ ] App 名稱
- [ ] 簡短描述 (80 字)
- [ ] 完整描述 (4000 字)
- [ ] 截圖 (手機、7" 平板、10" 平板)
- [ ] 功能圖片 (1024x500)
- [ ] 高解析度圖示 (512x512)
- [ ] 內容分級問卷
- [ ] 隱私政策
- [ ] 資料安全性表單

### 11.5 版本管理策略

```
版本號格式: MAJOR.MINOR.PATCH

MAJOR: 重大更新，可能有不兼容的變更
MINOR: 新功能，向後兼容
PATCH: Bug 修復，向後兼容

範例:
1.0.0 - 首次發布
1.1.0 - 新增家長模組
1.1.1 - 修復 iOS TTS 問題
1.2.0 - 新增成就系統
2.0.0 - 重大 UI 改版
```

---

## 12. 附錄

### 12.1 術語表

| 術語 | 定義 |
|------|------|
| TTS | Text-to-Speech，文字轉語音技術 |
| 詞庫 | 用戶建立的詞語/文章集合 |
| 練習會話 | 一次完整的默書練習過程 |
| 錯題本 | 自動收集用戶標記為錯誤的詞語 |
| 完整朗讀 | 練習結束後不間斷朗讀全部內容 |

### 12.2 參考資源

- [Expo 官方文檔](https://docs.expo.dev/)
- [React Native 官方文檔](https://reactnative.dev/)
- [Supabase 官方文檔](https://supabase.com/docs)
- [expo-speech API](https://docs.expo.dev/versions/latest/sdk/speech/)
- [React Navigation](https://reactnavigation.org/)
- [Zustand](https://github.com/pmndrs/zustand)

### 12.3 設計資源

- Figma 設計稿連結 (待建立)
- 圖標庫：[Phosphor Icons](https://phosphoricons.com/)
- 字體：系統字體 (SF Pro / Roboto)

### 12.4 聯絡資訊

- 專案負責人：[待定]
- 技術負責人：[待定]
- 設計負責人：[待定]

---

## 文檔更新記錄

| 版本 | 日期 | 更新內容 | 作者 |
|------|------|----------|------|
| 1.0 | 2026-01-03 | 初始版本 | AI Assistant |

---

*本文檔由 AI 助手根據現有 auto_dic.html 網頁應用分析生成，供開發團隊參考使用。*
