export type ThemeMode = 'light' | 'dark';

export interface Theme {
  mode: ThemeMode;
  colors: {
    background: string;
    surface: string;
    primary: string;
    primaryLight: string;
    text: string;
    textSecondary: string;
    textLight: string;
    border: string;
    userBubble: string;
    assistantBubble: string;
    codeBlock: string;
    codeText: string;
    success: string;
  };
}

export const lightTheme: Theme = {
  mode: 'light',
  colors: {
    background: '#f5f5f5',
    surface: '#ffffff',
    primary: '#007AFF',
    primaryLight: '#F0F8FF',
    text: '#333333',
    textSecondary: '#666666',
    textLight: '#999999',
    border: '#e0e0e0',
    userBubble: '#007AFF',
    assistantBubble: '#ffffff',
    codeBlock: '#1e1e1e',
    codeText: '#d4d4d4',
    success: '#34C759',
  },
};

export const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    background: '#1a1a1a',
    surface: '#2a2a2a',
    primary: '#0A84FF',
    primaryLight: '#1a3a5c',
    text: '#ffffff',
    textSecondary: '#b0b0b0',
    textLight: '#808080',
    border: '#3a3a3a',
    userBubble: '#0A84FF',
    assistantBubble: '#2a2a2a',
    codeBlock: '#0d0d0d',
    codeText: '#c0c0c0',
    success: '#30D158',
  },
};
