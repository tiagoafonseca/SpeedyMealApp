import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RecipeCard from '../components/RecipeCard';
import { Colors } from '../constants/theme';
import { useFavourites } from '../context/FavouritesContext';
import { HomeStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<HomeStackParamList, 'Home'>;

export default function FavouritesScreen() {
  const { favourites } = useFavourites();
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.title}>Favourites</Text>
        {favourites.length > 0 && (
          <Text style={styles.count}>{favourites.length} saved</Text>
        )}
      </View>

      {favourites.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>♡</Text>
          <Text style={styles.emptyTitle}>No favourites yet</Text>
          <Text style={styles.emptySubtitle}>
            Tap the heart on any recipe to save it here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favourites}
          keyExtractor={(item) => item.idMeal}
          numColumns={2}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <RecipeCard
              id={item.idMeal}
              title={item.strMeal}
              thumb={item.strMealThumb}
              onPress={() =>
                navigation.navigate('Detail', { id: item.idMeal, title: item.strMeal })
              }
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
  },
  title: { fontSize: 28, fontWeight: '700', color: Colors.t1 },
  count: { fontSize: 14, color: Colors.t2 },

  list: { paddingHorizontal: 24, paddingBottom: 40 },
  row: { justifyContent: 'space-between' },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyIcon: { fontSize: 52, color: Colors.t3, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: Colors.t1, marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: Colors.t2, textAlign: 'center', lineHeight: 20 },
});
