import React from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { Colors, Radius } from '../constants/theme';

interface Props {
  value: string;
  onChangeText: (t: string) => void;
  onSubmit: () => void;
  onFocus?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export default function SearchBar({
  value, onChangeText, onSubmit, onFocus,
  placeholder = 'Search recipes or ingredients…',
  autoFocus = false,
}: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        onFocus={onFocus}
        placeholder={placeholder}
        placeholderTextColor={Colors.t3}
        returnKeyType="search"
        autoFocus={autoFocus}
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="while-editing"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: '#EBEBEB',
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  input: {
    fontSize: 15,
    color: Colors.t1,
    padding: 0,
    margin: 0,
  },
});
