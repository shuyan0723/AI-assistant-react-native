import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DocumentContent } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

interface DocumentEditorProps {
  content: DocumentContent;
  onUpdate: (content: DocumentContent) => void;
}

export function DocumentEditor({ content, onUpdate }: DocumentEditorProps) {
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(content.title);
  const [body, setBody] = useState(content.content);

  const handleSave = () => {
    onUpdate({ title, content: body });
    setIsEditing(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>📝 文档编辑器</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
        >
          <Ionicons
            name={isEditing ? 'checkmark' : 'create-outline'}
            size={20}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>

      {isEditing ? (
        <View style={styles.editContainer}>
          <TextInput
            style={[styles.titleInput, { color: theme.colors.text, borderBottomColor: theme.colors.border }]}
            value={title}
            onChangeText={setTitle}
            placeholder="文档标题"
            placeholderTextColor={theme.colors.textLight}
          />
          <TextInput
            style={[styles.bodyInput, { color: theme.colors.text }]}
            value={body}
            onChangeText={setBody}
            placeholder="开始输入内容..."
            placeholderTextColor={theme.colors.textLight}
            multiline
            textAlignVertical="top"
          />
        </View>
      ) : (
        <View style={styles.viewContainer}>
          <Text style={[styles.viewTitle, { color: theme.colors.text }]}>{content.title}</Text>
          <Text style={[styles.viewContent, { color: theme.colors.textSecondary }]}>{content.content}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    margin: 12,
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
  editButton: {
    padding: 4,
  },
  editContainer: {
    gap: 12,
  },
  titleInput: {
    fontSize: 18,
    fontWeight: '600',
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  bodyInput: {
    fontSize: 15,
    minHeight: 150,
    lineHeight: 22,
  },
  viewContainer: {
    gap: 12,
  },
  viewTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  viewContent: {
    fontSize: 15,
    lineHeight: 22,
  },
});
