import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

interface HeaderProps {
  title?: string;
  onClear?: () => void;
  showClear?: boolean;
  showThemeToggle?: boolean;
}

export function Header({
  title = 'AI 助手',
  onClear,
  showClear = true,
  showThemeToggle = true
}: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      <View style={styles.actions}>
        {showThemeToggle && (
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: theme.colors.primaryLight }]}
            onPress={toggleTheme}
          >
            <Ionicons
              name={theme.mode === 'light' ? 'moon-outline' : 'sunny-outline'}
              size={20}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        )}
        {showClear && onClear && (
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: theme.colors.primaryLight }]}
            onPress={onClear}
          >
            <Ionicons name="trash-outline" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
  },
});
