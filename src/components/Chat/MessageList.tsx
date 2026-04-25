import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { Message } from '../../types';
import { TypingIndicator } from './TypingIndicator';

interface MessageListProps {
  messages: Message[];
  onDeleteMessage?: (id: string) => void;
  isLoading?: boolean;
}

export function MessageList({ messages, onDeleteMessage, isLoading }: MessageListProps) {
  const handleCopy = (content: string) => {
    // Web 平台使用 Clipboard API
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
        <Text
          style={[
            styles.messageText,
            styles.userText,
          ]}
        >
          {message.content}
        </Text>
      );
    }

    return (
      <Markdown style={markdownStyles}>
        {message.content}
      </Markdown>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
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
              message.role === 'user' ? styles.userBubble : styles.assistantBubble,
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
          <View style={[styles.messageBubble, styles.assistantBubble, styles.typingBubble]}>
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
    backgroundColor: '#f5f5f5',
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
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userText: {
    color: '#fff',
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

const markdownStyles = StyleSheet.create({
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
  },
  heading1: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    color: '#222',
  },
  heading2: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    color: '#222',
  },
  heading3: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#222',
  },
  strong: {
    fontWeight: '700',
    color: '#000',
  },
  em: {
    fontStyle: 'italic',
  },
  link: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  code_inline: {
    backgroundColor: '#f0f0f0',
    color: '#e83e8c',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    fontFamily: 'monospace',
    fontSize: 13,
  },
  code_block: {
    backgroundColor: '#1e1e1e',
    color: '#d4d4d4',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    fontFamily: 'monospace',
    fontSize: 13,
    overflow: 'hidden',
  },
  fence: {
    backgroundColor: '#1e1e1e',
    color: '#d4d4d4',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    fontFamily: 'monospace',
    fontSize: 13,
    overflow: 'hidden',
  },
  blockquote: {
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
    paddingLeft: 12,
    color: '#666',
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
    backgroundColor: '#e0e0e0',
    height: 1,
    marginVertical: 12,
  },
  table_container: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginVertical: 8,
    overflow: 'hidden',
  },
  table_row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  table_header: {
    backgroundColor: '#f5f5f5',
    fontWeight: '600',
  },
  table_cell: {
    flex: 1,
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
});
