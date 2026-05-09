import React from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Colors, Radius, Shadow } from '../constants/theme';

const CARD_WIDTH = (Dimensions.get('window').width - 24 * 2 - 16) / 2;

interface Props {
  id: string;
  title: string;
  thumb: string;
  category?: string;
  onPress: () => void;
}

export default function RecipeCard({ title, thumb, category, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}
    >
      <Image source={{ uri: thumb }} style={styles.image} resizeMode="cover" />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        {category ? (
          <Text style={styles.meta}>{category}</Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    marginBottom: 16,
    ...Shadow.card,
  },
  image: {
    width: '100%',
    height: 114,
  },
  info: {
    padding: 12,
    paddingBottom: 14,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.t1,
    lineHeight: 18,
    marginBottom: 4,
  },
  meta: {
    fontSize: 11,
    color: Colors.t2,
    marginTop: 2,
  },
});
