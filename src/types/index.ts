export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface DocumentContent {
  title: string;
  content: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
}

export interface PageContext {
  documentContent?: DocumentContent;
  todos?: TodoItem[];
}
