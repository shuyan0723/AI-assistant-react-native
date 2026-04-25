import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const { theme } = useTheme();
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSend(text.trim());
      setText('');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
      <View style={[styles.inputContainer, { backgroundColor: theme.colors.primaryLight }]}>
        <TextInput
          style={[styles.input, { color: theme.colors.text }]}
          value={text}
          onChangeText={setText}
          placeholder="输入消息..."
          placeholderTextColor={theme.colors.textLight}
          multiline
          maxLength={500}
          onSubmitEditing={handleSend}
          blurOnSubmit={false}
          editable={!disabled}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            { backgroundColor: text.trim() && !disabled ? theme.colors.primary : theme.colors.textLight },
          ]}
          onPress={handleSend}
          disabled={!text.trim() || disabled}
        >
          <Ionicons
            name="send"
            size={20}
            color={text.trim() && !disabled ? '#fff' : '#666'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    ...Platform.select({
      ios: {
        paddingBottom: 24,
      },
    }),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
