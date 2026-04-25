import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TodoItem } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

interface TodoListProps {
  todos: TodoItem[];
  onUpdate: (todos: TodoItem[]) => void;
}

export function TodoList({ todos, onUpdate }: TodoListProps) {
  const { theme } = useTheme();
  const [newTodo, setNewTodo] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const addTodo = () => {
    if (newTodo.trim()) {
      onUpdate([
        ...todos,
        {
          id: Date.now().toString(),
          text: newTodo.trim(),
          completed: false,
        },
      ]);
      setNewTodo('');
      setIsAdding(false);
      Keyboard.dismiss();
    }
  };

  const toggleTodo = (id: string) => {
    onUpdate(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    onUpdate(todos.filter((todo) => todo.id !== id));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>✓ 待办事项</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsAdding(!isAdding)}
        >
          <Ionicons name={isAdding ? 'close' : 'add'} size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {isAdding && (
        <View style={[styles.inputRow, { backgroundColor: theme.colors.primaryLight }]}>
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            value={newTodo}
            onChangeText={setNewTodo}
            placeholder="添加新任务..."
            placeholderTextColor={theme.colors.textLight}
            autoFocus
            onSubmitEditing={addTodo}
          />
          <TouchableOpacity style={[styles.checkButton, { backgroundColor: theme.colors.primary }]} onPress={addTodo}>
            <Ionicons name="checkmark" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {todos.length === 0 ? (
        <Text style={[styles.emptyText, { color: theme.colors.textLight }]}>暂无待办事项</Text>
      ) : (
        todos.map((todo) => (
          <View key={todo.id} style={[styles.todoItem, { borderBottomColor: theme.colors.border }]}>
            <TouchableOpacity
              style={styles.todoLeft}
              onPress={() => toggleTodo(todo.id)}
            >
              <View
                style={[
                  styles.checkbox,
                  { borderColor: todo.completed ? theme.colors.success : theme.colors.textLight },
                  todo.completed && { backgroundColor: theme.colors.success, borderColor: theme.colors.success },
                ]}
              >
                {todo.completed && (
                  <Ionicons name="checkmark" size={16} color="#fff" />
                )}
              </View>
              <Text
                style={[
                  styles.todoText,
                  { color: todo.completed ? theme.colors.textLight : theme.colors.text },
                  todo.completed && styles.todoTextCompleted,
                ]}
              >
                {todo.text}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteTodo(todo.id)}
            >
              <Ionicons name="close-circle" size={20} color={theme.colors.textLight} />
            </TouchableOpacity>
          </View>
        ))
      )}

      {todos.length > 0 && (
        <Text style={[styles.footerText, { color: theme.colors.textLight, borderTopColor: theme.colors.border }]}>
          {todos.filter((t) => t.completed).length} / {todos.length} 已完成
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    margin: 12,
    marginTop: 0,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    padding: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 10,
  },
  checkButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: 20,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  todoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  todoText: {
    fontSize: 15,
    flex: 1,
  },
  todoTextCompleted: {
    textDecorationLine: 'line-through',
  },
  deleteButton: {
    padding: 4,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 13,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
  },
});
