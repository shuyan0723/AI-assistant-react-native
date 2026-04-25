import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

export type TabType = 'chat' | 'document' | 'todo';

interface TabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TABS = [
  { id: 'chat' as TabType, label: '对话', icon: 'chatbubbles-outline' },
  { id: 'document' as TabType, label: '文档', icon: 'document-text-outline' },
  { id: 'todo' as TabType, label: '待办', icon: 'list-outline' },
];

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
      {TABS.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[styles.tab, activeTab === tab.id && { backgroundColor: theme.colors.primaryLight }]}
          onPress={() => onTabChange(tab.id)}
        >
          <Ionicons
            name={tab.icon as any}
            size={22}
            color={activeTab === tab.id ? theme.colors.primary : theme.colors.textLight}
          />
          <Text
            style={[
              styles.tabLabel,
              { color: activeTab === tab.id ? theme.colors.primary : theme.colors.textLight },
            ]}
          >
            {tab.label}
          </Text>
          {activeTab === tab.id && <View style={[styles.indicator, { backgroundColor: theme.colors.primary }]} />}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
    position: 'relative',
  },
  tabLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: [{ translateX: -50 }],
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
