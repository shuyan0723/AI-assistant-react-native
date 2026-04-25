import { useState, useCallback, useEffect, useRef } from 'react';
import { Message, PageContext } from '../types';
import { streamChat, ChatMessage } from '../services/deepseek';
import { parseAIActions, buildActionSystemPrompt, ParsedAction } from '../utils/actionParser';
import { saveMessages, loadMessages, clearStoredMessages } from '../utils/storage';

interface UseChatOptions {
  onActionExecute?: (action: ParsedAction) => void;
}

const DEFAULT_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: '你好！我是你的AI助手。我可以帮你编辑文档、管理待办事项，或者回答任何问题。\n\n你可以这样问我：\n• "帮我写一份周报"\n• "添加待办：明天开会"\n• "总结一下文档内容"',
    timestamp: Date.now(),
  },
];

export function useChat(pageContext?: PageContext, options?: UseChatOptions) {
  const [messages, setMessages] = useState<Message[]>(DEFAULT_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [executedActions, setExecutedActions] = useState<ParsedAction[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  // 加载保存的消息
  useEffect(() => {
    loadMessages().then((savedMessages) => {
      if (savedMessages && savedMessages.length > 0) {
        setMessages(savedMessages);
      }
    });
  }, []);

  // 保存消息到存储
  useEffect(() => {
    if (messages.length > 0 && messages !== DEFAULT_MESSAGES) {
      saveMessages(messages);
    }
  }, [messages]);

  // 清理 effect
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const buildSystemPrompt = useCallback((): string => {
    const context: string[] = [
      '你是一个智能助手，可以回答问题、编辑文档内容、管理待办事项。',
      buildActionSystemPrompt(),
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

    context.push('\n请用简洁、友好的语气回复。当用户要求执行操作时，使用相应的指令格式。');
    return context.join('');
  }, [pageContext]);

  const executeAction = useCallback((action: ParsedAction) => {
    setExecutedActions((prev) => [...prev, action]);
    options?.onActionExecute?.(action);
  }, [options]);

  const retryLastMessage = useCallback(() => {
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMessage) {
      sendMessage(lastUserMessage.content);
    }
  }, [messages]);

  const sendMessage = useCallback(
    async (content: string) => {
      // 取消之前的请求
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);
      setExecutedActions([]);

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
        for await (const chunk of streamChat(chatMessages, undefined, abortControllerRef.current.signal)) {
          fullResponse += chunk;

          // 实时解析并执行操作
          const { content: cleanContent, actions } = parseAIActions(fullResponse);

          // 执行新的操作
          actions.forEach((action) => {
            const alreadyExecuted = executedActions.some(
              (a) => a.type === action.type && JSON.stringify(a.data) === JSON.stringify(action.data)
            );
            if (!alreadyExecuted) {
              executeAction(action);
            }
          });

          setMessages((prev) => {
            const exists = prev.find((m) => m.id === assistantMessageId);
            if (exists) {
              return prev.map((m) =>
                m.id === assistantMessageId
                  ? { ...m, content: cleanContent }
                  : m
              );
            }
            return [
              ...prev,
              {
                id: assistantMessageId,
                role: 'assistant',
                content: cleanContent,
                timestamp: Date.now(),
              },
            ];
          });
        }

        // 最终再执行一次确保所有操作都被处理
        const { actions } = parseAIActions(fullResponse);
        actions.forEach((action) => {
          executeAction(action);
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '发生未知错误';
        setError(errorMessage);

        setMessages((prev) => [
          ...prev,
          {
            id: assistantMessageId,
            role: 'assistant',
            content: `❌ ${errorMessage}`,
            timestamp: Date.now(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, buildSystemPrompt, executedActions, executeAction]
  );

  const clearMessages = useCallback(() => {
    const clearedMessages = [
      {
        id: Date.now().toString(),
        role: 'assistant' as const,
        content: '对话已清空。有什么我可以帮你的吗？',
        timestamp: Date.now(),
      },
    ];
    setMessages(clearedMessages);
    clearStoredMessages();
    setError(null);
  }, []);

  const deleteMessage = useCallback((id: string) => {
    setMessages((prev) => {
      const filtered = prev.filter((m) => m.id !== id);
      return filtered.length > 0 ? filtered : DEFAULT_MESSAGES;
    });
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    deleteMessage,
    executedActions,
    retryLastMessage,
  };
}
