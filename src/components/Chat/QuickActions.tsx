import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  prompt: string;
}

const DEFAULT_ACTIONS: QuickAction[] = [
  { id: '1', label: '写周报', icon: 'document-text-outline', prompt: '帮我写一份本周工作总结' },
  { id: '2', label: '总结文档', icon: 'list-outline', prompt: '请总结当前文档的内容' },
  { id: '3', label: '添加待办', icon: 'add-circle-outline', prompt: '添加一个待办事项：' },
  { id: '4', label: '优化文案', icon: 'create-outline', prompt: '帮我优化这段文案：' },
  { id: '5', label: '解释代码', icon: 'code-slash-outline', prompt: '请解释这段代码的作用：' },
  { id: '6', label: '写代码', icon: 'code-working-outline', prompt: '帮我写一个函数来：' },
];

interface QuickActionsProps {
  actions?: QuickAction[];
  onActionPress: (action: QuickAction) => void;
}

export function QuickActions({ actions = DEFAULT_ACTIONS, onActionPress }: QuickActionsProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { borderTopColor: theme.colors.border }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={[styles.actionButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
            onPress={() => onActionPress(action)}
          >
            <Ionicons name={action.icon as any} size={20} color={theme.colors.primary} />
            <Text style={[styles.actionLabel, { color: theme.colors.text }]}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  scrollContent: {
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
});
