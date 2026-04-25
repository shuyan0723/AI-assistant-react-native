// DeepSeek API service with retry logic
const API_KEY = process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY || '';
const BASE_URL = process.env.EXPO_PUBLIC_DEEPSEEK_BASE_URL || 'https://api.deepseek.com';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1秒

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface StreamChunk {
  choices: Array<{
    delta: {
      content?: string;
    };
  }>;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = MAX_RETRIES
): Promise<Response> {
  try {
    const response = await fetch(url, options);

    // 如果是 429 (Too Many Requests) 或 5xx 错误，进行重试
    if ((response.status === 429 || response.status >= 500) && retries > 0) {
      console.warn(`API error ${response.status}, retrying... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
      await sleep(RETRY_DELAY * (MAX_RETRIES - retries + 1)); // 递增延迟
      return fetchWithRetry(url, options, retries - 1);
    }

    return response;
  } catch (error) {
    // 网络错误，进行重试
    if (retries > 0) {
      console.warn(`Network error, retrying... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`, error);
      await sleep(RETRY_DELAY * (MAX_RETRIES - retries + 1));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}

export async function* streamChat(
  messages: ChatMessage[],
  onChunk?: (chunk: string) => void,
  signal?: AbortSignal
): AsyncGenerator<string> {
  try {
    const response = await fetchWithRetry(`${BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        stream: true,
      }),
      signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No reader');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed === 'data: [DONE]') continue;
        if (trimmed.startsWith('data: ')) {
          try {
            const data = JSON.parse(trimmed.slice(6));
            const content = data.choices?.[0]?.delta?.content;
            if (content) {
              yield content;
              onChunk?.(content);
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('请求已取消');
      }
      if (error.message.includes('fetch')) {
        throw new Error('网络连接失败，请检查网络设置');
      }
      throw error;
    }
    throw new Error('未知错误');
  }
}
