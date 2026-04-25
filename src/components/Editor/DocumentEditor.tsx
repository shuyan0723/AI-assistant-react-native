import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DocumentContent } from '../../types';

interface DocumentEditorProps {
  content: DocumentContent;
  onUpdate: (content: DocumentContent) => void;
}

export function DocumentEditor({ content, onUpdate }: DocumentEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(content.title);
  const [body, setBody] = useState(content.content);

  const handleSave = () => {
    onUpdate({ title, content: body });
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📝 文档编辑器</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
        >
          <Ionicons
            name={isEditing ? 'checkmark' : 'create-outline'}
            size={20}
            color="#007AFF"
          />
        </TouchableOpacity>
      </View>

      {isEditing ? (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="文档标题"
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.bodyInput}
            value={body}
            onChangeText={setBody}
            placeholder="开始输入内容..."
            placeholderTextColor="#999"
            multiline
            textAlignVertical="top"
          />
        </View>
      ) : (
        <View style={styles.viewContainer}>
          <Text style={styles.viewTitle}>{content.title}</Text>
          <Text style={styles.viewContent}>{content.content}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
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
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
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
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 8,
  },
  bodyInput: {
    fontSize: 15,
    color: '#333',
    minHeight: 150,
    lineHeight: 22,
  },
  viewContainer: {
    gap: 12,
  },
  viewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  viewContent: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
});
