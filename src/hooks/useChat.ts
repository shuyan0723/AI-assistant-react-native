import { useState, useCallback } from 'react';
import { Message, PageContext } from '../types';
import { streamChat, ChatMessage } from '../services/deepseek';

export function useChat(pageContext?: PageContext) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '你好！我是你的AI助手。我可以帮你编辑文档、管理待办事项，或者回答任何问题。有什么我可以帮你的吗？',
      timestamp: Date.now(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const buildSystemPrompt = useCallback((): string => {
    const context: string[] = [
      '你是一个智能助手，可以回答问题、编辑文档内容、管理待办事项。',
    ];

    if (pageContext?.documentContent) {
      context.push(`\n当前文档标题：${pageContext.documentContent.title}`);
      context.push(`文档内容：\n${pageContext.documentContent.content}`);
    }

    if (pageContext?.todos && pageContext.todos.length > 0) {
      const todoList = pageContext.todos
        .map((t, i) => `${i + 1}. ${t.completed ? '✓' : '○'} ${t.text}`)
        .join('\n');
      context.push(`\n待办事项列表：\n${todoList}`);
    }

    context.push('\n请用简洁、友好的语气回复。');
    return context.join('');
  }, [pageContext]);

  const sendMessage = useCallback(
    async (content: string) => {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      const chatMessages: ChatMessage[] = [
        { role: 'system', content: buildSystemPrompt() },
        ...messages.map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
        { role: 'user', content },
      ];

      const assistantMessageId = (Date.now() + 1).toString();
      let fullResponse = '';

      try {
        for await (const chunk of streamChat(chatMessages)) {
          fullResponse += chunk;
          setMessages((prev) => {
            const exists = prev.find((m) => m.id === assistantMessageId);
            if (exists) {
              return prev.map((m) =>
                m.id === assistantMessageId
                  ? { ...m, content: fullResponse }
                  : m
              );
            }
            return [
              ...prev,
              {
                id: assistantMessageId,
                role: 'assistant',
                content: fullResponse,
                timestamp: Date.now(),
              },
            ];
          });
        }
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          {
            id: assistantMessageId,
            role: 'assistant',
            content: '抱歉，连接出现错误，请稍后重试。',
            timestamp: Date.now(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, buildSystemPrompt]
  );

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: '对话已清空。有什么我可以帮你的吗？',
        timestamp: Date.now(),
      },
    ]);
  }, []);

  const deleteMessage = useCallback((id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }, []);

  return { messages, isLoading, sendMessage, clearMessages, deleteMessage };
}
