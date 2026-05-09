import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CategoryChip from '../components/CategoryChip';
import RecipeCard from '../components/RecipeCard';
import SearchBar from '../components/SearchBar';
import { Colors, Radius } from '../constants/theme';
import { useRecipes } from '../context/RecipeContext';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const STATIC_CATEGORIES = ['All', 'Beef', 'Chicken', 'Seafood', 'Vegetarian', 'Pasta', 'Dessert'];

export default function HomeScreen({ navigation }: Props) {
  const { query, setQuery, results, selectCategory, activeCategory, isLoading } =
    useRecipes();
  const [popularMeals, setPopularMeals] = useState(results);

  // Load a diverse mix on mount
  useEffect(() => {
    selectCategory('All');
  }, []);

  useEffect(() => {
    setPopularMeals(activeCategory === 'All' ? results.slice(0, 12) : results);
  }, [results, activeCategory]);

  function handleSearch() {
    if (!query.trim()) return;
    navigation.navigate('Results', { query: query.trim() });
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Greeting */}
        <View style={styles.header}>
          <Text style={styles.greetLine1}>What are you</Text>
          <Text style={styles.greetLine2}>craving today?</Text>
        </View>

        {/* Search */}
        <View style={styles.section}>
          <SearchBar
            value={query}
            onChangeText={setQuery}
            onSubmit={handleSearch}
            onFocus={() => {
              if (query.trim()) navigation.navigate('Results', { query: query.trim() });
            }}
          />
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {STATIC_CATEGORIES.map((cat) => (
            <CategoryChip
              key={cat}
              label={cat}
              active={activeCategory === cat}
              onPress={() => selectCategory(cat)}
            />
          ))}
        </ScrollView>

        {/* Popular */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {activeCategory === 'All' ? 'Popular this week' : activeCategory}
          </Text>
        </View>

        {isLoading ? (
          <ActivityIndicator color={Colors.accent} style={{ marginTop: 32 }} />
        ) : (
          <FlatList
            data={popularMeals}
            keyExtractor={(item) => item.idMeal}
            numColumns={2}
            columnWrapperStyle={styles.row}
            scrollEnabled={false}
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

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingHorizontal: 24, paddingBottom: 40 },
  header: { marginTop: 16, marginBottom: 20 },
  greetLine1: { fontSize: 30, fontWeight: '700', color: Colors.t1 },
  greetLine2: { fontSize: 30, fontWeight: '700', color: Colors.accent },
  section: { marginBottom: 16 },
  chips: { paddingBottom: 16 },
  sectionHeader: { marginBottom: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: Colors.t1 },
  row: { justifyContent: 'space-between' },
});
