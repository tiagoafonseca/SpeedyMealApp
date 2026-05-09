import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RecipeCard from '../components/RecipeCard';
import SearchBar from '../components/SearchBar';
import { Colors, Radius } from '../constants/theme';
import { useRecipes } from '../context/RecipeContext';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Results'>;

export default function ResultsScreen({ route, navigation }: Props) {
  const { query: routeQuery } = route.params;
  const { query, setQuery, results, search, isLoading } = useRecipes();

  useEffect(() => {
    setQuery(routeQuery);
    search(routeQuery);
  }, [routeQuery]);

  function handleSearch() {
    if (!query.trim()) return;
    search(query.trim());
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      {/* Header row */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={12}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <View style={styles.searchWrap}>
          <SearchBar
            value={query}
            onChangeText={setQuery}
            onSubmit={handleSearch}
            autoFocus={false}
          />
        </View>
      </View>

      {/* Count */}
      {!isLoading && (
        <Text style={styles.count}>
          {results.length} recipe{results.length !== 1 ? 's' : ''} found
        </Text>
      )}

      {isLoading ? (
        <ActivityIndicator color={Colors.accent} style={{ marginTop: 40 }} />
      ) : results.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No recipes found</Text>
          <Text style={styles.emptySubtitle}>Try a different ingredient or dish name</Text>
        </View>
      ) : (
        <FlatList
          data={results}
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
              category={item.strCategory}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 12,
  },
  backBtn: { justifyContent: 'center' },
  backArrow: { fontSize: 22, color: Colors.t1 },
  searchWrap: { flex: 1 },
  count: {
    paddingHorizontal: 24,
    marginBottom: 12,
    fontSize: 13,
    color: Colors.t2,
  },
  list: { paddingHorizontal: 24, paddingBottom: 40 },
  row: { justifyContent: 'space-between' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: Colors.t1, marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: Colors.t2, textAlign: 'center' },
});
