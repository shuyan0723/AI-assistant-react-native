import React, { useState, useCallback, useMemo } from 'react';
import { SafeAreaView, KeyboardAvoidingView, Platform, View, StyleSheet, Alert, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { TabBar, TabType } from './src/components/Layout/TabBar';
import { Header } from './src/components/Layout/Header';
import { MessageList } from './src/components/Chat/MessageList';
import { MessageInput } from './src/components/Chat/MessageInput';
import { QuickActions, QuickAction } from './src/components/Chat/QuickActions';
import { DocumentEditor } from './src/components/Editor/DocumentEditor';
import { TodoList } from './src/components/Editor/TodoList';
import { useChat } from './src/hooks/useChat';
import { DocumentContent, TodoItem } from './src/types';
import { ParsedAction } from './src/utils/actionParser';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';

function AppContent() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('chat');

  const [documentContent, setDocumentContent] = useState<DocumentContent>({
    title: '欢迎使用AI助手',
    content: '这是一个可以与AI对话并编辑内容的应用。\n\n功能介绍：\n• 自然对话交流\n• 编辑文档内容\n• 管理待办事项\n\n你可以随时切换标签页来使用不同功能，AI会根据当前页面内容提供帮助。\n\n✨ 新功能：\n• 深色模式 - 点击右上角月亮图标切换\n• 快捷指令 - 点击预设指令快速提问\n• AI可直接编辑文档和管理待办',
  });

  const [todos, setTodos] = useState<TodoItem[]>([
    { id: '1', text: '体验AI对话功能', completed: true },
    { id: '2', text: '尝试编辑文档内容', completed: false },
    { id: '3', text: '添加待办事项', completed: false },
  ]);

  const pageContext = useMemo(() => {
    const context: any = {};
    if (activeTab === 'document') {
      context.documentContent = documentContent;
    } else if (activeTab === 'todo') {
      context.todos = todos;
    }
    return context;
  }, [activeTab, documentContent, todos]);

  const handleActionExecute = useCallback((action: ParsedAction) => {
    switch (action.type) {
      case 'doc_edit':
        setDocumentContent({
          title: action.data.title,
          content: action.data.content,
        });
        Alert.alert('文档已更新', `标题：${action.data.title}`);
        break;
      case 'todo_add':
        setTodos((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            text: action.data.text,
            completed: false,
          },
        ]);
        break;
      case 'todo_complete':
        setTodos((prev) =>
          prev.map((t) =>
            t.text === action.data.text ? { ...t, completed: true } : t
          )
        );
        break;
      case 'todo_delete':
        setTodos((prev) => prev.filter((t) => t.text !== action.data.text));
        break;
    }
  }, []);

  const { messages, isLoading, error, sendMessage, clearMessages, deleteMessage } = useChat(
    pageContext,
    {
      onActionExecute: handleActionExecute,
    }
  );

  const handleSendMessage = useCallback(
    (content: string) => {
      sendMessage(content);
    },
    [sendMessage]
  );

  const handleQuickAction = useCallback((action: QuickAction) => {
    sendMessage(action.prompt);
  }, [sendMessage]);

  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'chat': return 'AI 助手';
      case 'document': return '文档编辑';
      case 'todo': return '待办事项';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return (
          <View style={styles.chatContainer}>
            <MessageList
              messages={messages}
              onDeleteMessage={deleteMessage}
              isLoading={isLoading}
            />
            {error && (
              <View style={[styles.errorContainer, { backgroundColor: theme.colors.surface }]}>
                <Text style={[styles.errorText, { color: theme.colors.text }]}>{error}</Text>
              </View>
            )}
            <QuickActions onActionPress={handleQuickAction} />
          </View>
        );
      case 'document':
        return (
          <View style={styles.editorContainer}>
            <DocumentEditor
              content={documentContent}
              onUpdate={setDocumentContent}
            />
          </View>
        );
      case 'todo':
        return (
          <View style={styles.editorContainer}>
            <TodoList todos={todos} onUpdate={setTodos} />
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <Header
          title={getHeaderTitle()}
          onClear={activeTab === 'chat' ? clearMessages : undefined}
          showClear={activeTab === 'chat' && messages.length > 1}
        />

        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

        <View style={styles.content}>{renderContent()}</View>

        {activeTab === 'chat' && (
          <MessageInput onSend={handleSendMessage} disabled={isLoading} />
        )}
      </KeyboardAvoidingView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
  },
  editorContainer: {
    flex: 1,
  },
  errorContainer: {
    padding: 12,
    marginHorizontal: 12,
    marginTop: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff3b30',
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
