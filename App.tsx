import React, { useState, useCallback, useMemo } from 'react';
import { SafeAreaView, KeyboardAvoidingView, Platform, View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { TabBar, TabType } from './src/components/Layout/TabBar';
import { Header } from './src/components/Layout/Header';
import { MessageList } from './src/components/Chat/MessageList';
import { MessageInput } from './src/components/Chat/MessageInput';
import { DocumentEditor } from './src/components/Editor/DocumentEditor';
import { TodoList } from './src/components/Editor/TodoList';
import { useChat } from './src/hooks/useChat';
import { DocumentContent, TodoItem } from './src/types';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('chat');

  const [documentContent, setDocumentContent] = useState<DocumentContent>({
    title: '欢迎使用AI助手',
    content: '这是一个可以与AI对话并编辑内容的应用。\n\n功能介绍：\n• 自然对话交流\n• 编辑文档内容\n• 管理待办事项\n\n你可以随时切换标签页来使用不同功能，AI会根据当前页面内容提供帮助。',
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

  const { messages, isLoading, sendMessage, clearMessages, deleteMessage } = useChat(pageContext);

  const handleSendMessage = useCallback(
    (content: string) => {
      sendMessage(content);
    },
    [sendMessage]
  );

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
    <SafeAreaView style={styles.container}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
});
