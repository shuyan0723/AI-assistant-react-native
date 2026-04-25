import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  MESSAGES: '@ai_assistant_messages',
  THEME: '@ai_assistant_theme',
};

export async function saveMessages(messages: any[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  } catch (error) {
    console.error('Failed to save messages:', error);
  }
}

export async function loadMessages(): Promise<any[] | null> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.MESSAGES);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load messages:', error);
    return null;
  }
}

export async function clearStoredMessages(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.MESSAGES);
  } catch (error) {
    console.error('Failed to clear messages:', error);
  }
}

export async function saveTheme(theme: string): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (error) {
    console.error('Failed to save theme:', error);
  }
}

export async function loadTheme(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.THEME);
  } catch (error) {
    console.error('Failed to load theme:', error);
    return null;
  }
}
