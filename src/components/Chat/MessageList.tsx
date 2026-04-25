import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { Message } from '../../types';
import { TypingIndicator } from './TypingIndicator';
import { useTheme } from '../../contexts/ThemeContext';

interface MessageListProps {
  messages: Message[];
  onDeleteMessage?: (id: string) => void;
  isLoading?: boolean;
}

export function MessageList({ messages, onDeleteMessage, isLoading }: MessageListProps) {
  const { theme } = useTheme();

  const handleCopy = (content: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(content);
      Alert.alert('成功', '已复制到剪贴板');
    }
  };

  const handleLongPress = (message: Message) => {
    Alert.alert(
      '消息操作',
      '选择操作',
      [
        { text: '复制', onPress: () => handleCopy(message.content) },
        { text: '删除', onPress: () => onDeleteMessage?.(message.id), style: 'destructive' },
        { text: '取消', style: 'cancel' },
      ]
    );
  };

  const renderMessageContent = (message: Message) => {
    if (message.role === 'user') {
      return (
        <Text style={[styles.messageText, { color: '#fff' }]}>
          {message.content}
        </Text>
      );
    }

    return (
      <Markdown style={getMarkdownStyles(theme)}>
        {message.content}
      </Markdown>
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} contentContainerStyle={styles.content}>
      {messages.map((message) => (
        <View
          key={message.id}
          style={[
            styles.messageRow,
            message.role === 'user' ? styles.userRow : styles.assistantRow,
          ]}
        >
          <TouchableOpacity
            style={[
              styles.messageBubble,
              message.role === 'user'
                ? [styles.userBubble, { backgroundColor: theme.colors.userBubble }]
                : [styles.assistantBubble, { backgroundColor: theme.colors.assistantBubble, borderColor: theme.colors.border }],
            ]}
            onLongPress={() => handleLongPress(message)}
            delayLongPress={500}
          >
            {renderMessageContent(message)}
            <Text style={styles.timestamp}>
              {new Date(message.timestamp).toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
      {isLoading && (
        <View style={styles.assistantRow}>
          <View style={[styles.messageBubble, styles.assistantBubble, styles.typingBubble, { backgroundColor: theme.colors.assistantBubble, borderColor: theme.colors.border }]}>
            <TypingIndicator />
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 12,
    gap: 8,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  assistantRow: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  },
  typingBubble: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});

const getMarkdownStyles = (theme: any) => StyleSheet.create({
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.text,
  },
  heading1: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    color: theme.colors.text,
  },
  heading2: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    color: theme.colors.text,
  },
  heading3: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: theme.colors.text,
  },
  strong: {
    fontWeight: '700',
    color: theme.colors.text,
  },
  em: {
    fontStyle: 'italic',
  },
  link: {
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
  code_inline: {
    backgroundColor: theme.colors.primaryLight,
    color: '#e83e8c',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    fontFamily: 'monospace',
    fontSize: 13,
  },
  code_block: {
    backgroundColor: theme.colors.codeBlock,
    color: theme.colors.codeText,
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    fontFamily: 'monospace',
    fontSize: 13,
    overflow: 'hidden',
  },
  fence: {
    backgroundColor: theme.colors.codeBlock,
    color: theme.colors.codeText,
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    fontFamily: 'monospace',
    fontSize: 13,
    overflow: 'hidden',
  },
  blockquote: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
    paddingLeft: 12,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    marginVertical: 4,
  },
  bullet_list: {
    marginLeft: 20,
    marginVertical: 4,
  },
  ordered_list: {
    marginLeft: 20,
    marginVertical: 4,
  },
  hr: {
    backgroundColor: theme.colors.border,
    height: 1,
    marginVertical: 12,
  },
  table_container: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    marginVertical: 8,
    overflow: 'hidden',
  },
  table_row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  table_header: {
    backgroundColor: theme.colors.primaryLight,
    fontWeight: '600',
  },
  table_cell: {
    flex: 1,
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: theme.colors.border,
  },
});
