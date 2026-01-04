# 默書神器 App 開發報告

## 📋 文檔資訊

| 項目 | 內容 |
|------|------|
| 專案名稱 | 默書神器 (Dictation Master) |
| 文檔類型 | 開發實現指南 |
| 版本 | 1.0 |
| 建立日期 | 2026-01-03 |
| 目標讀者 | AI 開發助手、開發人員 |

---

## 1. 開發環境設置

### 1.1 系統需求

```
Node.js: >= 18.0.0
npm: >= 9.0.0
Expo CLI: >= 6.0.0
EAS CLI: >= 5.0.0

iOS 開發:
- macOS 12+
- Xcode 14+
- iOS Simulator 15+

Android 開發:
- Android Studio
- Android SDK 33+
- Android Emulator API 30+
```

### 1.2 專案初始化命令

```bash
# 建立 Expo 專案
npx create-expo-app@latest dictation-master --template expo-template-blank-typescript

# 進入專案目錄
cd dictation-master

# 安裝核心依賴
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install expo-router expo-speech expo-secure-store expo-notifications
npm install @supabase/supabase-js
npm install zustand immer
npm install react-native-paper react-native-vector-icons
npm install react-native-mmkv expo-sqlite

# 安裝開發依賴
npm install -D typescript @types/react @types/react-native
npm install -D vitest @testing-library/react-native
npm install -D eslint prettier eslint-config-expo
```

### 1.3 環境變數配置

```bash
# .env.local (本地開發)
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# .env.production (生產環境)
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
```

---

## 2. 代碼規範與約定

### 2.1 TypeScript 配置

```json
// tsconfig.json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@services/*": ["./src/services/*"],
      "@stores/*": ["./src/stores/*"],
      "@utils/*": ["./src/utils/*"],
      "@types/*": ["./src/types/*"],
      "@constants/*": ["./src/constants/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}
```

### 2.2 ESLint 配置

```javascript
// .eslintrc.js
module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'react/react-in-jsx-scope': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
};
```

### 2.3 命名約定

```typescript
// 文件命名
// - 組件: PascalCase.tsx (e.g., SpeechPlayer.tsx)
// - Hook: camelCase.ts (e.g., usePractice.ts)
// - 工具函數: camelCase.ts (e.g., textUtils.ts)
// - 類型定義: camelCase.ts (e.g., models.ts)
// - 常量: camelCase.ts (e.g., languages.ts)
// - 測試: *.test.ts 或 *.spec.ts

// 變數命名
const userName: string;           // camelCase
const MAX_RETRY_COUNT = 3;        // SCREAMING_SNAKE_CASE (常量)
const isLoading: boolean;         // is/has/can 前綴 (布林值)

// 函數命名
function getUserById() {}         // camelCase
async function fetchWordLists() {} // 動詞開頭
const handleSubmit = () => {};    // handle 前綴 (事件處理)
const onPressButton = () => {};   // on 前綴 (回調)

// 組件命名
function WordListCard() {}        // PascalCase
function PracticeScreen() {}      // Screen 後綴 (頁面)

// 類型命名
interface User {}                 // PascalCase
type ButtonVariant = 'primary' | 'secondary';
enum ReadingMode { Auto, Manual } // PascalCase

// Hook 命名
function usePractice() {}         // use 前綴
function useWordList() {}
```

### 2.4 組件結構約定

```typescript
// 組件文件結構範例
// src/components/practice/SpeechPlayer.tsx

import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';

// 1. 類型定義
interface SpeechPlayerProps {
  text: string;
  language: string;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

// 2. 組件實現
export function SpeechPlayer({
  text,
  language,
  onComplete,
  onError,
}: SpeechPlayerProps) {
  // 2.1 狀態
  const [isPlaying, setIsPlaying] = useState(false);
  
  // 2.2 Hooks
  const { speak, stop } = useSpeech();
  
  // 2.3 回調函數
  const handlePlay = useCallback(async () => {
    try {
      setIsPlaying(true);
      await speak(text, { language });
      onComplete?.();
    } catch (error) {
      onError?.(error as Error);
    } finally {
      setIsPlaying(false);
    }
  }, [text, language, speak, onComplete, onError]);
  
  // 2.4 副作用
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);
  
  // 2.5 渲染
  return (
    <View style={styles.container}>
      <Text>{text}</Text>
      <Button onPress={handlePlay} disabled={isPlaying}>
        {isPlaying ? '播放中...' : '播放'}
      </Button>
    </View>
  );
}

// 3. 樣式
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});

// 4. 預設導出 (可選)
export default SpeechPlayer;
```

---

## 3. 核心模組實現指南

### 3.1 Supabase 客戶端配置

```typescript
// src/services/supabase.ts

import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Database } from '@/types/database';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// 自定義存儲適配器 (使用 SecureStore)
const ExpoSecureStoreAdapter = {
  getItem: async (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string) => {
    await SecureStore.setItemAsync(key, value);
  },
  removeItem: async (key: string) => {
    await SecureStore.deleteItemAsync(key);
  },
};

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// 認證輔助函數
export const auth = {
  signUp: async (email: string, password: string, metadata: { displayName: string; role: 'student' | 'parent' }) => {
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
  },
  
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },
  
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },
  
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    return { data, error };
  },
  
  getUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    return { data, error };
  },
};
```

### 3.2 類型定義

```typescript
// src/types/models.ts

// 用戶
export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  role: 'student' | 'parent';
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

// 用戶設定
export interface UserSettings {
  userId: string;
  language: 'zh-HK' | 'zh-CN' | 'en-GB';
  theme: 'light' | 'dark' | 'system';
  defaultSpeechRate: number;
  defaultRepeatCount: number;
  defaultCharWaitTime: number;
  readPunctuation: boolean;
  notificationsEnabled: boolean;
  dailyReminderTime?: string;
}

// 詞庫
export interface WordList {
  id: string;
  userId: string;
  name: string;
  description?: string;
  language: 'zh-HK' | 'zh-CN' | 'en-GB';
  mode: 'word' | 'article';
  isPublic: boolean;
  tags: string[];
  practiceCount: number;
  averageScore?: number;
  createdAt: string;
  updatedAt: string;
  items?: WordItem[];
}

// 詞語項目
export interface WordItem {
  id: string;
  wordListId: string;
  content: string;
  pinyin?: string;
  meaning?: string;
  example?: string;
  sortOrder: number;
  errorCount: number;
  lastPracticedAt?: string;
}

// 練習會話
export interface PracticeSession {
  id: string;
  userId: string;
  wordListId: string;
  mode: 'word' | 'article';
  readingMode: 'auto' | 'manual';
  speechRate: number;
  repeatCount: number;
  charWaitTime: number;
  totalItems: number;
  completedItems: number;
  correctItems: number;
  score?: number;
  startedAt: string;
  completedAt?: string;
}

// 練習結果
export interface PracticeResult {
  id: string;
  sessionId: string;
  wordItemId: string;
  isCorrect: boolean;
  attempts: number;
  timeSpent: number;
}

// 錯題
export interface ErrorWord {
  id: string;
  userId: string;
  wordItemId: string;
  errorCount: number;
  lastErrorAt: string;
  mastered: boolean;
  masteredAt?: string;
  wordItem?: WordItem;
}

// 任務
export interface Task {
  id: string;
  parentId: string;
  studentId: string;
  wordListId: string;
  title: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
}

// 成就
export interface Achievement {
  id: string;
  userId: string;
  achievementType: string;
  achievedAt: string;
}

// 每日統計
export interface DailyStat {
  id: string;
  userId: string;
  date: string;
  practiceTime: number;
  wordsPracticed: number;
  correctCount: number;
  sessionsCount: number;
}

// 語音配置
export interface SpeechConfig {
  language: 'yue-HK' | 'zh-CN' | 'en-GB';
  voice?: string;
  rate: number;
  repeatCount: number;
  charWaitTime: number;
  readPunctuation: boolean;
  readingMode: 'auto' | 'manual';
}

// 文字段落
export interface TextSegment {
  type: 'text' | 'punct';
  content: string;
}

// 練習項目
export interface PracticeItem {
  id: string;
  type: 'text' | 'punct';
  content: string;
  displayContent: string;
}
```

### 3.3 Zustand Store 實現

```typescript
// src/stores/authStore.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserSettings } from '@/types/models';
import { auth, supabase } from '@/services/supabase';

interface AuthState {
  user: User | null;
  settings: UserSettings | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  
  // Actions
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name: string, role: 'student' | 'parent') => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      settings: null,
      isLoading: true,
      isAuthenticated: false,
      error: null,
      
      initialize: async () => {
        try {
          set({ isLoading: true });
          
          const { data: sessionData } = await auth.getSession();
          
          if (sessionData.session) {
            const { data: userData } = await supabase
              .from('users')
              .select('*')
              .eq('id', sessionData.session.user.id)
              .single();
            
            const { data: settingsData } = await supabase
              .from('user_settings')
              .select('*')
              .eq('user_id', sessionData.session.user.id)
              .single();
            
            set({
              user: userData as User,
              settings: settingsData as UserSettings,
              isAuthenticated: true,
            });
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
        } finally {
          set({ isLoading: false });
        }
      },
      
      signIn: async (email, password) => {
        try {
          set({ isLoading: true, error: null });
          
          const { data, error } = await auth.signIn(email, password);
          
          if (error) {
            set({ error: error.message });
            return { success: false, error: error.message };
          }
          
          if (data.user) {
            const { data: userData } = await supabase
              .from('users')
              .select('*')
              .eq('id', data.user.id)
              .single();
            
            const { data: settingsData } = await supabase
              .from('user_settings')
              .select('*')
              .eq('user_id', data.user.id)
              .single();
            
            set({
              user: userData as User,
              settings: settingsData as UserSettings,
              isAuthenticated: true,
            });
          }
          
          return { success: true };
        } catch (error) {
          const message = error instanceof Error ? error.message : '登入失敗';
          set({ error: message });
          return { success: false, error: message };
        } finally {
          set({ isLoading: false });
        }
      },
      
      signUp: async (email, password, name, role) => {
        try {
          set({ isLoading: true, error: null });
          
          const { data, error } = await auth.signUp(email, password, {
            displayName: name,
            role,
          });
          
          if (error) {
            set({ error: error.message });
            return { success: false, error: error.message };
          }
          
          return { success: true };
        } catch (error) {
          const message = error instanceof Error ? error.message : '註冊失敗';
          set({ error: message });
          return { success: false, error: message };
        } finally {
          set({ isLoading: false });
        }
      },
      
      signOut: async () => {
        await auth.signOut();
        set({
          user: null,
          settings: null,
          isAuthenticated: false,
        });
      },
      
      updateSettings: async (newSettings) => {
        const { user, settings } = get();
        if (!user || !settings) return;
        
        const updatedSettings = { ...settings, ...newSettings };
        
        await supabase
          .from('user_settings')
          .update(newSettings)
          .eq('user_id', user.id);
        
        set({ settings: updatedSettings });
      },
      
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        settings: state.settings,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

```typescript
// src/stores/practiceStore.ts

import { create } from 'zustand';
import { PracticeSession, PracticeResult, SpeechConfig, PracticeItem } from '@/types/models';

interface PracticeState {
  // 當前練習狀態
  currentSession: PracticeSession | null;
  items: PracticeItem[];
  results: Map<string, PracticeResult>;
  currentIndex: number;
  
  // 播放狀態
  isPlaying: boolean;
  isPaused: boolean;
  isSpeaking: boolean;
  waitingTime: number;
  currentRepeat: number;
  
  // 配置
  config: SpeechConfig;
  
  // Actions
  setConfig: (config: Partial<SpeechConfig>) => void;
  startSession: (session: Omit<PracticeSession, 'id' | 'startedAt'>, items: PracticeItem[]) => void;
  setCurrentIndex: (index: number) => void;
  setPlayingState: (isPlaying: boolean, isPaused?: boolean) => void;
  setSpeakingState: (isSpeaking: boolean) => void;
  setWaitingTime: (time: number) => void;
  setCurrentRepeat: (repeat: number) => void;
  markResult: (itemId: string, isCorrect: boolean) => void;
  completeSession: () => PracticeSession | null;
  reset: () => void;
}

const defaultConfig: SpeechConfig = {
  language: 'zh-HK',
  rate: 0.9,
  repeatCount: 1,
  charWaitTime: 3,
  readPunctuation: true,
  readingMode: 'auto',
};

export const usePracticeStore = create<PracticeState>((set, get) => ({
  currentSession: null,
  items: [],
  results: new Map(),
  currentIndex: -1,
  isPlaying: false,
  isPaused: false,
  isSpeaking: false,
  waitingTime: 0,
  currentRepeat: 0,
  config: defaultConfig,
  
  setConfig: (newConfig) => {
    set((state) => ({
      config: { ...state.config, ...newConfig },
    }));
  },
  
  startSession: (sessionData, items) => {
    const session: PracticeSession = {
      ...sessionData,
      id: `session-${Date.now()}`,
      startedAt: new Date().toISOString(),
      completedItems: 0,
      correctItems: 0,
    };
    
    set({
      currentSession: session,
      items,
      results: new Map(),
      currentIndex: 0,
      isPlaying: false,
      isPaused: false,
    });
  },
  
  setCurrentIndex: (index) => set({ currentIndex: index }),
  
  setPlayingState: (isPlaying, isPaused) => {
    set((state) => ({
      isPlaying,
      isPaused: isPaused ?? state.isPaused,
    }));
  },
  
  setSpeakingState: (isSpeaking) => set({ isSpeaking }),
  
  setWaitingTime: (time) => set({ waitingTime: time }),
  
  setCurrentRepeat: (repeat) => set({ currentRepeat: repeat }),
  
  markResult: (itemId, isCorrect) => {
    const { results, currentSession } = get();
    
    const existingResult = results.get(itemId);
    const newResult: PracticeResult = {
      id: `result-${Date.now()}`,
      sessionId: currentSession?.id || '',
      wordItemId: itemId,
      isCorrect,
      attempts: (existingResult?.attempts || 0) + 1,
      timeSpent: 0,
    };
    
    const newResults = new Map(results);
    newResults.set(itemId, newResult);
    
    set({ results: newResults });
  },
  
  completeSession: () => {
    const { currentSession, results, items } = get();
    if (!currentSession) return null;
    
    const correctCount = Array.from(results.values()).filter(r => r.isCorrect).length;
    const completedSession: PracticeSession = {
      ...currentSession,
      completedAt: new Date().toISOString(),
      completedItems: results.size,
      correctItems: correctCount,
      score: items.length > 0 ? (correctCount / items.length) * 100 : 0,
    };
    
    set({ currentSession: completedSession });
    return completedSession;
  },
  
  reset: () => {
    set({
      currentSession: null,
      items: [],
      results: new Map(),
      currentIndex: -1,
      isPlaying: false,
      isPaused: false,
      isSpeaking: false,
      waitingTime: 0,
      currentRepeat: 0,
    });
  },
}));
```

---

## 4. 頁面實現指南

### 4.1 導航結構

```typescript
// app/_layout.tsx

import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { PaperProvider } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from '@/constants/theme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { initialize, isLoading } = useAuthStore();
  
  useEffect(() => {
    initialize();
  }, []);
  
  if (isLoading) {
    return null; // 或顯示 SplashScreen
  }
  
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  
  return (
    <PaperProvider theme={theme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="practice/session" options={{ presentation: 'fullScreenModal' }} />
        <Stack.Screen name="practice/result" />
      </Stack>
    </PaperProvider>
  );
}
```

```typescript
// app/(tabs)/_layout.tsx

import { Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
  const theme = useTheme();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.outline,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '首頁',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: '詞庫',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="book-open-variant" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="practice"
        options={{
          title: '練習',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="play-circle" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: '統計',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chart-line" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '設定',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
```

### 4.2 首頁實現

```typescript
// app/(tabs)/index.tsx

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Button, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { useTodayStats } from '@/hooks/useTodayStats';
import { useTasks } from '@/hooks/useTasks';

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useAuthStore();
  const { stats, isLoading: statsLoading } = useTodayStats();
  const { tasks, isLoading: tasksLoading } = useTasks();
  
  const greeting = getGreeting();
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* 問候語 */}
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.greeting}>
            {greeting}，{user?.displayName}！
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.outline }}>
            今天已練習 {stats?.practiceTime || 0} 分鐘
          </Text>
        </View>
        
        {/* 今日任務 */}
        {tasks.length > 0 && (
          <Card style={styles.card}>
            <Card.Title title="📝 今日任務" />
            <Card.Content>
              {tasks.slice(0, 3).map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </Card.Content>
          </Card>
        )}
        
        {/* 快速開始 */}
        <Card style={styles.card}>
          <Card.Title title="🚀 快速開始" />
          <Card.Content>
            <View style={styles.quickStartButtons}>
              <Button
                mode="contained"
                icon="format-list-bulleted"
                onPress={() => router.push('/practice?mode=word')}
                style={styles.quickStartButton}
              >
                詞語模式
              </Button>
              <Button
                mode="contained"
                icon="text"
                onPress={() => router.push('/practice?mode=article')}
                style={styles.quickStartButton}
              >
                文章模式
              </Button>
            </View>
          </Card.Content>
        </Card>
        
        {/* 本週統計 */}
        <Card style={styles.card}>
          <Card.Title title="📊 本週統計" />
          <Card.Content>
            <View style={styles.statsRow}>
              <StatItem label="練習時間" value={`${stats?.weeklyTime || 0}分鐘`} />
              <StatItem label="詞語數" value={`${stats?.weeklyWords || 0}`} />
              <StatItem label="正確率" value={`${stats?.weeklyAccuracy || 0}%`} />
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return '早安';
  if (hour < 18) return '午安';
  return '晚安';
}

function TaskItem({ task }: { task: Task }) {
  const router = useRouter();
  
  return (
    <View style={styles.taskItem}>
      <View style={styles.taskInfo}>
        <Text variant="bodyLarge">{task.title}</Text>
        <Text variant="bodySmall">截止：{formatDate(task.dueDate)}</Text>
      </View>
      <Button
        mode="text"
        onPress={() => router.push(`/practice/session?taskId=${task.id}`)}
      >
        開始
      </Button>
    </View>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statItem}>
      <Text variant="titleLarge">{value}</Text>
      <Text variant="bodySmall">{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 16,
  },
  quickStartButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  quickStartButton: {
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  taskInfo: {
    flex: 1,
  },
});
```

### 4.3 練習頁面實現

```typescript
// app/practice/session.tsx

import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import { Text, Button, ProgressBar, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePractice } from '@/hooks/usePractice';
import { usePracticeStore } from '@/stores/practiceStore';
import { HighlightText } from '@/components/practice/HighlightText';
import { ControlPanel } from '@/components/practice/ControlPanel';

export default function PracticeSessionScreen() {
  const theme = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ wordListId: string; text?: string }>();
  
  const { config } = usePracticeStore();
  const mode = config.readingMode === 'auto' ? 'word' : 'article';
  
  const {
    items,
    currentIndex,
    currentItem,
    isPlaying,
    isPaused,
    isSpeaking,
    waitingTime,
    currentRepeat,
    progress,
    initializeItems,
    startAutoReading,
    manualStart,
    manualNext,
    manualPrevious,
    pause,
    resume,
    stop,
  } = usePractice(mode);
  
  // 初始化
  useEffect(() => {
    if (params.text) {
      initializeItems(params.text, config);
    }
    // TODO: 如果有 wordListId，從 API 獲取詞庫內容
  }, [params.text, params.wordListId]);
  
  // 處理返回鍵
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isPlaying) {
        handleStop();
        return true;
      }
      return false;
    });
    
    return () => backHandler.remove();
  }, [isPlaying]);
  
  const handlePlayPause = useCallback(() => {
    if (config.readingMode === 'auto') {
      if (!isPlaying && !isPaused) {
        startAutoReading(config);
      } else if (isPlaying && !isPaused) {
        pause();
      } else if (isPaused) {
        resume();
      }
    } else {
      manualStart(config);
    }
  }, [config, isPlaying, isPaused, startAutoReading, pause, resume, manualStart]);
  
  const handleStop = useCallback(async () => {
    await stop();
    router.push('/practice/result');
  }, [stop, router]);
  
  const handleNext = useCallback(() => {
    if (config.readingMode === 'manual') {
      manualNext(config);
    }
  }, [config, manualNext]);
  
  const handlePrevious = useCallback(() => {
    if (config.readingMode === 'manual') {
      manualPrevious(config);
    }
  }, [config, manualPrevious]);
  
  return (
    <SafeAreaView style={styles.container}>
      {/* 頂部信息 */}
      <View style={styles.header}>
        <Text variant="titleMedium">練習中</Text>
        <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
          {config.language === 'zh-HK' ? '粵語' : config.language === 'zh-CN' ? '普通話' : '英語'}
          {' · '}
          {mode === 'word' ? '詞語模式' : '文章模式'}
          {' · '}
          {config.readingMode === 'auto' ? '自動朗讀' : '手動朗讀'}
        </Text>
      </View>
      
      {/* 當前朗讀內容 */}
      <View style={styles.currentContent}>
        {currentItem && (
          <>
            <Text variant="displaySmall" style={styles.currentText}>
              🔊 {currentItem.displayContent}
            </Text>
            {config.readingMode === 'auto' && config.repeatCount > 1 && (
              <Text variant="bodyMedium" style={{ color: theme.colors.outline }}>
                正在朗讀 ({currentRepeat}/{config.repeatCount})
              </Text>
            )}
          </>
        )}
      </View>
      
      {/* 文字列表（帶高亮） */}
      <View style={styles.textContainer}>
        <HighlightText
          items={items}
          currentIndex={currentIndex}
          mode={mode}
        />
      </View>
      
      {/* 進度條 */}
      <View style={styles.progressContainer}>
        <ProgressBar
          progress={progress / 100}
          color={theme.colors.primary}
          style={styles.progressBar}
        />
        <View style={styles.progressInfo}>
          <Text variant="bodySmall">
            {currentIndex + 1} / {items.length}
          </Text>
          {waitingTime > 0 && (
            <Text variant="bodySmall" style={{ color: theme.colors.primary }}>
              等待中 {waitingTime}秒
            </Text>
          )}
        </View>
      </View>
      
      {/* 控制面板 */}
      <ControlPanel
        readingMode={config.readingMode}
        isPlaying={isPlaying}
        isPaused={isPaused}
        isSpeaking={isSpeaking}
        canPrevious={currentIndex > 0}
        canNext={currentIndex < items.length - 1}
        onPlayPause={handlePlayPause}
        onStop={handleStop}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    alignItems: 'center',
  },
  currentContent: {
    padding: 24,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  currentText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
    padding: 16,
  },
  progressContainer: {
    padding: 16,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});
```

### 4.4 練習結果頁面

```typescript
// app/practice/result.tsx

import React, { useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Button, Checkbox, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { usePracticeStore } from '@/stores/practiceStore';
import { speechService } from '@/services/speech';

export default function PracticeResultScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { currentSession, items, results, markResult, completeSession, reset } = usePracticeStore();
  
  const [selectedErrors, setSelectedErrors] = useState<Set<string>>(new Set());
  
  // 計算統計
  const totalItems = items.filter(i => i.type === 'text').length;
  const correctCount = Array.from(results.values()).filter(r => r.isCorrect).length;
  const incorrectCount = totalItems - correctCount;
  const score = totalItems > 0 ? Math.round((correctCount / totalItems) * 100) : 0;
  
  // 獲取錯誤項目
  const errorItems = items.filter(item => {
    const result = results.get(item.id);
    return item.type === 'text' && (!result || !result.isCorrect);
  });
  
  const handleToggleCorrect = useCallback((itemId: string, isCorrect: boolean) => {
    markResult(itemId, isCorrect);
  }, [markResult]);
  
  const handleReplay = useCallback(async (content: string) => {
    const { config } = usePracticeStore.getState();
    await speechService.speak(content, {
      language: config.language,
      rate: config.rate,
    });
  }, []);
  
  const handleAddToErrorBook = useCallback(async () => {
    // TODO: 將選中的錯誤詞語加入錯題本
    const session = completeSession();
    if (session) {
      // 保存到 Supabase
    }
  }, [selectedErrors, completeSession]);
  
  const handleRetry = useCallback(() => {
    reset();
    router.back();
  }, [reset, router]);
  
  const handleGoHome = useCallback(() => {
    reset();
    router.replace('/(tabs)');
  }, [reset, router]);
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* 成績展示 */}
        <View style={styles.scoreContainer}>
          <Text variant="displayLarge" style={[styles.score, { color: getScoreColor(score, theme) }]}>
            {score}%
          </Text>
          <Text variant="titleMedium">正確率</Text>
          <Text variant="headlineMedium" style={styles.emoji}>
            {score >= 90 ? '🎉' : score >= 70 ? '👍' : score >= 50 ? '💪' : '📚'}
          </Text>
        </View>
        
        {/* 統計卡片 */}
        <Card style={styles.card}>
          <Card.Title title="📊 練習統計" />
          <Card.Content>
            <View style={styles.statsGrid}>
              <StatRow label="總詞數" value={totalItems.toString()} />
              <StatRow label="正確" value={correctCount.toString()} color={theme.colors.primary} />
              <StatRow label="錯誤" value={incorrectCount.toString()} color={theme.colors.error} />
              <StatRow label="用時" value={formatDuration(currentSession?.startedAt)} />
            </View>
          </Card.Content>
        </Card>
        
        {/* 錯誤詞語 */}
        {errorItems.length > 0 && (
          <Card style={styles.card}>
            <Card.Title title="❌ 錯誤詞語" />
            <Card.Content>
              {errorItems.map((item) => (
                <View key={item.id} style={styles.errorItem}>
                  <Checkbox
                    status={selectedErrors.has(item.id) ? 'checked' : 'unchecked'}
                    onPress={() => {
                      const newSelected = new Set(selectedErrors);
                      if (newSelected.has(item.id)) {
                        newSelected.delete(item.id);
                      } else {
                        newSelected.add(item.id);
                      }
                      setSelectedErrors(newSelected);
                    }}
                  />
                  <Text variant="bodyLarge" style={styles.errorText}>
                    {item.content}
                  </Text>
                  <Button
                    mode="text"
                    compact
                    onPress={() => handleReplay(item.content)}
                  >
                    重聽
                  </Button>
                  <Button
                    mode="text"
                    compact
                    onPress={() => handleToggleCorrect(item.id, true)}
                  >
                    標記正確
                  </Button>
                </View>
              ))}
              
              {selectedErrors.size > 0 && (
                <Button
                  mode="contained"
                  onPress={handleAddToErrorBook}
                  style={styles.addButton}
                >
                  加入錯題本 ({selectedErrors.size})
                </Button>
              )}
            </Card.Content>
          </Card>
        )}
        
        {/* 操作按鈕 */}
        <View style={styles.actions}>
          <Button
            mode="contained"
            onPress={handleRetry}
            style={styles.actionButton}
          >
            再練一次
          </Button>
          <Button
            mode="outlined"
            onPress={handleGoHome}
            style={styles.actionButton}
          >
            返回首頁
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View style={styles.statRow}>
      <Text variant="bodyMedium">{label}</Text>
      <Text variant="titleMedium" style={color ? { color } : undefined}>
        {value}
      </Text>
    </View>
  );
}

function getScoreColor(score: number, theme: any): string {
  if (score >= 90) return theme.colors.primary;
  if (score >= 70) return theme.colors.secondary;
  if (score >= 50) return theme.colors.tertiary;
  return theme.colors.error;
}

function formatDuration(startTime?: string): string {
  if (!startTime) return '0分0秒';
  const start = new Date(startTime);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - start.getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}分${remainingSeconds}秒`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  scoreContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  score: {
    fontWeight: 'bold',
  },
  emoji: {
    marginTop: 8,
  },
  card: {
    marginBottom: 16,
  },
  statsGrid: {
    gap: 8,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  errorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  errorText: {
    flex: 1,
  },
  addButton: {
    marginTop: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
  },
});
```

---

## 5. 組件庫實現

### 5.1 高亮文字組件

```typescript
// src/components/practice/HighlightText.tsx

import React, { useRef, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Animated } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { PracticeItem } from '@/types/models';

interface HighlightTextProps {
  items: PracticeItem[];
  currentIndex: number;
  mode: 'word' | 'article';
}

export function HighlightText({ items, currentIndex, mode }: HighlightTextProps) {
  const theme = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const itemRefs = useRef<Map<number, View>>(new Map());
  
  // 自動滾動到當前項目
  useEffect(() => {
    if (currentIndex >= 0 && scrollViewRef.current) {
      const itemRef = itemRefs.current.get(currentIndex);
      if (itemRef) {
        itemRef.measureLayout(
          scrollViewRef.current as any,
          (x, y) => {
            scrollViewRef.current?.scrollTo({
              y: y - 100, // 留出一些上方空間
              animated: true,
            });
          },
          () => {}
        );
      }
    }
  }, [currentIndex]);
  
  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {mode === 'word' ? (
        // 詞語模式：每個項目一行
        items.map((item, index) => (
          <HighlightItem
            key={item.id}
            ref={(ref) => {
              if (ref) itemRefs.current.set(index, ref);
            }}
            item={item}
            isActive={index === currentIndex}
            theme={theme}
            style={styles.wordItem}
          />
        ))
      ) : (
        // 文章模式：內聯顯示
        <View style={styles.articleContainer}>
          {items.map((item, index) => (
            <HighlightItem
              key={item.id}
              ref={(ref) => {
                if (ref) itemRefs.current.set(index, ref);
              }}
              item={item}
              isActive={index === currentIndex}
              theme={theme}
              style={item.type === 'punct' ? styles.punctItem : styles.textItem}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

interface HighlightItemProps {
  item: PracticeItem;
  isActive: boolean;
  theme: any;
  style?: any;
}

const HighlightItem = React.forwardRef<View, HighlightItemProps>(
  ({ item, isActive, theme, style }, ref) => {
    const animatedValue = useRef(new Animated.Value(0)).current;
    
    useEffect(() => {
      Animated.timing(animatedValue, {
        toValue: isActive ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }, [isActive]);
    
    const backgroundColor = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['transparent', theme.colors.primaryContainer],
    });
    
    const textColor = item.type === 'punct' 
      ? theme.colors.outline 
      : theme.colors.onSurface;
    
    return (
      <Animated.View
        ref={ref}
        style={[
          styles.highlightItem,
          style,
          { backgroundColor },
          isActive && styles.activeItem,
        ]}
      >
        <Text
          variant={item.type === 'punct' ? 'bodyMedium' : 'bodyLarge'}
          style={{ color: textColor }}
        >
          {item.content}
        </Text>
      </Animated.View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  articleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  highlightItem: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  activeItem: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  wordItem: {
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  textItem: {
    marginRight: 2,
  },
  punctItem: {
    marginRight: 4,
  },
});
```

### 5.2 控制面板組件

```typescript
// src/components/practice/ControlPanel.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';

interface ControlPanelProps {
  readingMode: 'auto' | 'manual';
  isPlaying: boolean;
  isPaused: boolean;
  isSpeaking: boolean;
  canPrevious: boolean;
  canNext: boolean;
  onPlayPause: () => void;
  onStop: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export function ControlPanel({
  readingMode,
  isPlaying,
  isPaused,
  isSpeaking,
  canPrevious,
  canNext,
  onPlayPause,
  onStop,
  onPrevious,
  onNext,
}: ControlPanelProps) {
  const theme = useTheme();
  
  if (readingMode === 'auto') {
    return (
      <View style={styles.container}>
        <View style={styles.controls}>
          <IconButton
            icon={isPlaying && !isPaused ? 'pause' : 'play'}
            mode="contained"
            size={48}
            iconColor={theme.colors.onPrimary}
            containerColor={theme.colors.primary}
            onPress={onPlayPause}
            accessibilityLabel={isPlaying && !isPaused ? '暫停' : '播放'}
          />
          <IconButton
            icon="stop"
            mode="contained"
            size={48}
            iconColor={theme.colors.onError}
            containerColor={theme.colors.error}
            onPress={onStop}
            disabled={!isPlaying && !isPaused}
            accessibilityLabel="停止"
          />
        </View>
      </View>
    );
  }
  
  // 手動模式
  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <IconButton
          icon="skip-previous"
          mode="contained"
          size={40}
          iconColor={theme.colors.onSecondary}
          containerColor={theme.colors.secondary}
          onPress={onPrevious}
          disabled={!canPrevious || isSpeaking}
          accessibilityLabel="上一個"
        />
        <IconButton
          icon={isSpeaking ? 'refresh' : 'play'}
          mode="contained"
          size={48}
          iconColor={theme.colors.onPrimary}
          containerColor={theme.colors.primary}
          onPress={onPlayPause}
          disabled={isSpeaking}
          accessibilityLabel={isSpeaking ? '重讀' : '開始'}
        />
        <IconButton
          icon="skip-next"
          mode="contained"
          size={40}
          iconColor={theme.colors.onSecondary}
          containerColor={theme.colors.secondary}
          onPress={onNext}
          disabled={!canNext || isSpeaking}
          accessibilityLabel="下一個"
        />
        <IconButton
          icon="stop"
          mode="contained"
          size={40}
          iconColor={theme.colors.onError}
          containerColor={theme.colors.error}
          onPress={onStop}
          accessibilityLabel="取消"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: 'transparent',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
});
```

### 5.3 詞庫卡片組件

```typescript
// src/components/library/WordListCard.tsx

import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, Chip, useTheme } from 'react-native-paper';
import { WordList } from '@/types/models';

interface WordListCardProps {
  wordList: WordList;
  onPress: () => void;
  onLongPress?: () => void;
}

export function WordListCard({ wordList, onPress, onLongPress }: WordListCardProps) {
  const theme = useTheme();
  
  const languageLabel = {
    'zh-HK': '粵語',
    'zh-CN': '普通話',
    'en-GB': '英語',
  }[wordList.language];
  
  const modeLabel = wordList.mode === 'word' ? '詞語' : '文章';
  
  return (
    <TouchableOpacity onPress={onPress} onLongPress={onLongPress}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" numberOfLines={1}>
            {wordList.name}
          </Text>
          
          {wordList.description && (
            <Text
              variant="bodySmall"
              numberOfLines={2}
              style={{ color: theme.colors.outline, marginTop: 4 }}
            >
              {wordList.description}
            </Text>
          )}
          
          <View style={styles.chips}>
            <Chip compact style={styles.chip}>
              {languageLabel}
            </Chip>
            <Chip compact style={styles.chip}>
              {modeLabel}
            </Chip>
            <Chip compact style={styles.chip}>
              {wordList.items?.length || 0} 項
            </Chip>
          </View>
          
          <View style={styles.stats}>
            <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
              練習 {wordList.practiceCount} 次
            </Text>
            {wordList.averageScore !== undefined && (
              <Text variant="bodySmall" style={{ color: theme.colors.primary }}>
                平均 {wordList.averageScore.toFixed(0)}%
              </Text>
            )}
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  chip: {
    height: 24,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
});
```

### 5.4 設定分段控制組件

```typescript
// src/components/common/SegmentedControl.tsx

import React from 'react';
import { View, StyleSheet, Pressable, Animated } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

interface SegmentedControlProps<T extends string | number> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
}

export function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  label,
}: SegmentedControlProps<T>) {
  const theme = useTheme();
  const [indicatorPosition] = React.useState(new Animated.Value(0));
  
  const selectedIndex = options.findIndex(opt => opt.value === value);
  const segmentWidth = 100 / options.length;
  
  React.useEffect(() => {
    Animated.spring(indicatorPosition, {
      toValue: selectedIndex * segmentWidth,
      useNativeDriver: false,
      tension: 300,
      friction: 30,
    }).start();
  }, [selectedIndex, segmentWidth]);
  
  return (
    <View style={styles.container}>
      {label && (
        <Text variant="labelMedium" style={styles.label}>
          {label}
        </Text>
      )}
      <View style={[styles.segmentContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
        <Animated.View
          style={[
            styles.indicator,
            {
              backgroundColor: theme.colors.surface,
              width: `${segmentWidth}%`,
              left: indicatorPosition.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
        {options.map((option, index) => (
          <Pressable
            key={option.value}
            style={styles.segment}
            onPress={() => onChange(option.value)}
            accessibilityRole="radio"
            accessibilityState={{ checked: option.value === value }}
          >
            <Text
              variant="labelMedium"
              style={[
                styles.segmentText,
                option.value === value && { color: theme.colors.primary, fontWeight: '600' },
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  segmentContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 2,
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    top: 2,
    bottom: 2,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  segmentText: {
    textAlign: 'center',
  },
});
```

---

## 6. 離線功能實現

### 6.1 本地數據庫設置

```typescript
// src/services/database.ts

import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('dictation.db');

export async function initDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // 詞庫表
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS word_lists (
          id TEXT PRIMARY KEY,
          server_id TEXT,
          name TEXT NOT NULL,
          description TEXT,
          language TEXT NOT NULL,
          mode TEXT NOT NULL,
          is_public INTEGER DEFAULT 0,
          tags TEXT,
          practice_count INTEGER DEFAULT 0,
          average_score REAL,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL,
          synced_at INTEGER,
          is_dirty INTEGER DEFAULT 0
        )
      `);
      
      // 詞語項目表
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS word_items (
          id TEXT PRIMARY KEY,
          server_id TEXT,
          word_list_id TEXT NOT NULL,
          content TEXT NOT NULL,
          pinyin TEXT,
          meaning TEXT,
          example TEXT,
          sort_order INTEGER NOT NULL,
          error_count INTEGER DEFAULT 0,
          last_practiced_at INTEGER,
          FOREIGN KEY (word_list_id) REFERENCES word_lists(id) ON DELETE CASCADE
        )
      `);
      
      // 練習會話表
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS practice_sessions (
          id TEXT PRIMARY KEY,
          server_id TEXT,
          word_list_id TEXT NOT NULL,
          mode TEXT NOT NULL,
          reading_mode TEXT NOT NULL,
          speech_rate REAL NOT NULL,
          repeat_count INTEGER NOT NULL,
          char_wait_time INTEGER NOT NULL,
          total_items INTEGER NOT NULL,
          completed_items INTEGER DEFAULT 0,
          correct_items INTEGER DEFAULT 0,
          score REAL,
          started_at INTEGER NOT NULL,
          completed_at INTEGER,
          synced_at INTEGER,
          is_dirty INTEGER DEFAULT 0
        )
      `);
      
      // 設定表
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS settings (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL
        )
      `);
    }, reject, resolve);
  });
}

// 詞庫操作
export const wordListDb = {
  async getAll(): Promise<LocalWordList[]> {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM word_lists ORDER BY updated_at DESC',
          [],
          (_, { rows }) => resolve(rows._array),
          (_, error) => { reject(error); return false; }
        );
      });
    });
  },
  
  async getById(id: string): Promise<LocalWordList | null> {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM word_lists WHERE id = ?',
          [id],
          (_, { rows }) => resolve(rows._array[0] || null),
          (_, error) => { reject(error); return false; }
        );
      });
    });
  },
  
  async insert(wordList: LocalWordList): Promise<void> {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `INSERT INTO word_lists 
           (id, server_id, name, description, language, mode, is_public, tags, 
            practice_count, average_score, created_at, updated_at, synced_at, is_dirty)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            wordList.id,
            wordList.serverId || null,
            wordList.name,
            wordList.description || null,
            wordList.language,
            wordList.mode,
            wordList.isPublic ? 1 : 0,
            JSON.stringify(wordList.tags || []),
            wordList.practiceCount || 0,
            wordList.averageScore || null,
            wordList.createdAt,
            wordList.updatedAt,
            wordList.syncedAt || null,
            wordList.isDirty ? 1 : 0,
          ],
          () => resolve(),
          (_, error) => { reject(error); return false; }
        );
      });
    });
  },
  
  async update(id: string, updates: Partial<LocalWordList>): Promise<void> {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields.map(f => `${toSnakeCase(f)} = ?`).join(', ');
    
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `UPDATE word_lists SET ${setClause}, is_dirty = 1 WHERE id = ?`,
          [...values, id],
          () => resolve(),
          (_, error) => { reject(error); return false; }
        );
      });
    });
  },
  
  async delete(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM word_lists WHERE id = ?',
          [id],
          () => resolve(),
          (_, error) => { reject(error); return false; }
        );
      });
    });
  },
  
  async getDirty(): Promise<LocalWordList[]> {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM word_lists WHERE is_dirty = 1',
          [],
          (_, { rows }) => resolve(rows._array),
          (_, error) => { reject(error); return false; }
        );
      });
    });
  },
  
  async markSynced(id: string, serverId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'UPDATE word_lists SET server_id = ?, synced_at = ?, is_dirty = 0 WHERE id = ?',
          [serverId, Date.now(), id],
          () => resolve(),
          (_, error) => { reject(error); return false; }
        );
      });
    });
  },
};

function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}
```

### 6.2 同步服務

```typescript
// src/services/sync.ts

import NetInfo from '@react-native-community/netinfo';
import { supabase } from './supabase';
import { wordListDb } from './database';
import { useAuthStore } from '@/stores/authStore';

class SyncService {
  private isSyncing = false;
  private syncQueue: string[] = [];
  
  // 檢查網絡狀態
  async isOnline(): Promise<boolean> {
    const state = await NetInfo.fetch();
    return state.isConnected === true;
  }
  
  // 同步所有未同步的數據
  async syncAll(): Promise<void> {
    if (this.isSyncing) return;
    
    const online = await this.isOnline();
    if (!online) return;
    
    this.isSyncing = true;
    
    try {
      // 同步詞庫
      await this.syncWordLists();
      
      // 同步練習記錄
      await this.syncPracticeSessions();
      
      // 從服務器拉取最新數據
      await this.pullFromServer();
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      this.isSyncing = false;
    }
  }
  
  // 同步詞庫到服務器
  private async syncWordLists(): Promise<void> {
    const dirtyLists = await wordListDb.getDirty();
    const userId = useAuthStore.getState().user?.id;
    
    if (!userId) return;
    
    for (const list of dirtyLists) {
      try {
        if (list.serverId) {
          // 更新現有記錄
          await supabase
            .from('word_lists')
            .update({
              name: list.name,
              description: list.description,
              language: list.language,
              mode: list.mode,
              is_public: list.isPublic,
              tags: list.tags,
              updated_at: new Date().toISOString(),
            })
            .eq('id', list.serverId);
          
          await wordListDb.markSynced(list.id, list.serverId);
        } else {
          // 創建新記錄
          const { data, error } = await supabase
            .from('word_lists')
            .insert({
              user_id: userId,
              name: list.name,
              description: list.description,
              language: list.language,
              mode: list.mode,
              is_public: list.isPublic,
              tags: list.tags,
            })
            .select()
            .single();
          
          if (data && !error) {
            await wordListDb.markSynced(list.id, data.id);
          }
        }
      } catch (error) {
        console.error('Failed to sync word list:', list.id, error);
      }
    }
  }
  
  // 同步練習記錄
  private async syncPracticeSessions(): Promise<void> {
    // 類似 syncWordLists 的實現
  }
  
  // 從服務器拉取數據
  private async pullFromServer(): Promise<void> {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;
    
    // 獲取最後同步時間
    const lastSync = await this.getLastSyncTime();
    
    // 拉取更新的詞庫
    const { data: serverLists } = await supabase
      .from('word_lists')
      .select('*')
      .eq('user_id', userId)
      .gt('updated_at', lastSync || '1970-01-01');
    
    if (serverLists) {
      for (const serverList of serverLists) {
        const localList = await wordListDb.getById(serverList.id);
        
        if (!localList) {
          // 本地不存在，創建
          await wordListDb.insert({
            id: `local-${Date.now()}`,
            serverId: serverList.id,
            name: serverList.name,
            description: serverList.description,
            language: serverList.language,
            mode: serverList.mode,
            isPublic: serverList.is_public,
            tags: serverList.tags,
            practiceCount: serverList.practice_count,
            averageScore: serverList.average_score,
            createdAt: new Date(serverList.created_at).getTime(),
            updatedAt: new Date(serverList.updated_at).getTime(),
            syncedAt: Date.now(),
            isDirty: false,
          });
        } else if (!localList.isDirty) {
          // 本地存在且未修改，更新
          await wordListDb.update(localList.id, {
            name: serverList.name,
            description: serverList.description,
            updatedAt: new Date(serverList.updated_at).getTime(),
            syncedAt: Date.now(),
          });
        }
        // 如果本地有未同步的修改，保留本地版本
      }
    }
    
    // 更新最後同步時間
    await this.setLastSyncTime(new Date().toISOString());
  }
  
  private async getLastSyncTime(): Promise<string | null> {
    // 從本地存儲獲取
    return null;
  }
  
  private async setLastSyncTime(time: string): Promise<void> {
    // 保存到本地存儲
  }
}

export const syncService = new SyncService();
```

---

## 7. 開發檢查清單

### 7.1 功能完成度檢查

- [ ] **認證模組**
  - [ ] 用戶註冊
  - [ ] 用戶登入
  - [ ] 密碼重設
  - [ ] 登出
  - [ ] Session 持久化

- [ ] **詞庫模組**
  - [ ] 詞庫列表顯示
  - [ ] 建立詞庫
  - [ ] 編輯詞庫
  - [ ] 刪除詞庫
  - [ ] 批量匯入
  - [ ] 匯出詞庫
  - [ ] 搜尋公開詞庫

- [ ] **練習模組**
  - [ ] 詞語模式 - 自動朗讀
  - [ ] 詞語模式 - 手動朗讀
  - [ ] 文章模式 - 自動朗讀
  - [ ] 文章模式 - 手動朗讀
  - [ ] 標點符號朗讀
  - [ ] 進度條顯示
  - [ ] 文字高亮
  - [ ] 練習結果頁面
  - [ ] 自我評分功能

- [ ] **統計模組**
  - [ ] 每日統計
  - [ ] 學習日曆
  - [ ] 進度圖表
  - [ ] 成就系統

- [ ] **家長模組**
  - [ ] 孩子綁定
  - [ ] 任務指派
  - [ ] 學習報告

- [ ] **設定模組**
  - [ ] 語言設定
  - [ ] 主題切換
  - [ ] 通知設定
  - [ ] 默認朗讀參數

### 7.2 品質檢查

- [ ] **代碼品質**
  - [ ] TypeScript 無錯誤
  - [ ] ESLint 無警告
  - [ ] 單元測試覆蓋率 > 80%
  - [ ] 整合測試通過

- [ ] **性能**
  - [ ] 首屏加載 < 3秒
  - [ ] 列表滾動流暢 (60fps)
  - [ ] 記憶體使用合理

- [ ] **無障礙**
  - [ ] VoiceOver 測試通過
  - [ ] TalkBack 測試通過
  - [ ] 觸控目標 >= 48dp
  - [ ] 顏色對比度符合 WCAG

- [ ] **安全**
  - [ ] 敏感數據加密存儲
  - [ ] API 請求使用 HTTPS
  - [ ] 輸入驗證完整

---

## 文檔更新記錄

| 版本 | 日期 | 更新內容 | 作者 |
|------|------|----------|------|
| 1.0 | 2026-01-03 | 初始版本 | AI Assistant |

---

*本文檔為開發實現指南，供 AI 開發助手和開發人員參考使用。*
