import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Colors, Radius } from '../constants/theme';

interface Props {
  label: string;
  active: boolean;
  onPress: () => void;
}

export default function CategoryChip({ label, active, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        active ? styles.active : styles.inactive,
        pressed && { opacity: 0.75 },
      ]}
    >
      <Text style={[styles.label, active ? styles.labelActive : styles.labelInactive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.full,
    marginRight: 8,
  },
  active: {
    backgroundColor: Colors.accent,
  },
  inactive: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#DEDEDE',
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
  labelActive: {
    color: Colors.white,
  },
  labelInactive: {
    color: Colors.t2,
  },
});
