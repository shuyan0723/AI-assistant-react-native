/**
 * AI 操作指令解析器
 * 支持的指令格式：
 * - [DOC_EDIT]标题|内容[/DOC_EDIT]
 * - [TODO_ADD]任务内容[/TODO_ADD]
 * - [TODO_COMPLETE]任务ID[/TODO_COMPLETE]
 * - [TODO_DELETE]任务ID[/TODO_DELETE]
 */

export interface ParsedAction {
  type: 'doc_edit' | 'todo_add' | 'todo_complete' | 'todo_delete';
  data: any;
}

export function parseAIActions(content: string): { content: string; actions: ParsedAction[] } {
  const actions: ParsedAction[] = [];
  let cleanContent = content;

  // 解析文档编辑指令
  const docEditRegex = /\[DOC_EDIT\](.+?)\|(.+?)\[\/DOC_EDIT\]/gs;
  let matches = [...content.matchAll(docEditRegex)];
  matches.forEach((match) => {
    actions.push({
      type: 'doc_edit',
      data: { title: match[1].trim(), content: match[2].trim() },
    });
  });
  cleanContent = cleanContent.replace(docEditRegex, '');

  // 解析添加待办指令
  const todoAddRegex = /\[TODO_ADD\](.+?)\[\/TODO_ADD\]/g;
  matches = [...cleanContent.matchAll(todoAddRegex)];
  matches.forEach((match) => {
    actions.push({
      type: 'todo_add',
      data: { text: match[1].trim() },
    });
  });
  cleanContent = cleanContent.replace(todoAddRegex, '');

  // 解析完成待办指令
  const todoCompleteRegex = /\[TODO_COMPLETE\](.+?)\[\/TODO_COMPLETE\]/g;
  matches = [...cleanContent.matchAll(todoCompleteRegex)];
  matches.forEach((match) => {
    actions.push({
      type: 'todo_complete',
      data: { text: match[1].trim() },
    });
  });
  cleanContent = cleanContent.replace(todoCompleteRegex, '');

  // 解析删除待办指令
  const todoDeleteRegex = /\[TODO_DELETE\](.+?)\[\/TODO_DELETE\]/g;
  matches = [...cleanContent.matchAll(todoDeleteRegex)];
  matches.forEach((match) => {
    actions.push({
      type: 'todo_delete',
      data: { text: match[1].trim() },
    });
  });
  cleanContent = cleanContent.replace(todoDeleteRegex, '');

  return { content: cleanContent.trim(), actions };
}

export function buildActionSystemPrompt(): string {
  return `
你可以执行以下操作来帮助用户：

**文档操作**
- 编辑文档：[DOC_EDIT]新标题|新内容[/DOC_EDIT]

**待办事项操作**
- 添加任务：[TODO_ADD]任务内容[/TODO_ADD]
- 完成任务：[TODO_COMPLETE]任务内容[/TODO_COMPLETE]
- 删除任务：[TODO_DELETE]任务内容[/TODO_DELETE]

示例：
用户："帮我写一份周报"
你："好的，我为你创建一份周报模板。[DOC_EDIT]周报-2025第17周|本周工作：\n1. 完成AI助手项目\n2. 优化性能[/DOC_EDIT]已为你创建周报模板。"

用户："添加一个待办：明天开会"
你："[TODO_ADD]明天开会[/TODO_ADD]已添加待办事项。"

注意：执行操作后，用自然语言告诉用户你做了什么。
`;
}
