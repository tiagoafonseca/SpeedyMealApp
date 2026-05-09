import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Radius } from '../constants/theme';
import { useFavourites } from '../context/FavouritesContext';
import { Meal, getIngredients, getMealById } from '../services/mealdb';
import { HomeStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<HomeStackParamList, 'Detail'>;

function parseSteps(instructions: string): string[] {
  // Some recipes use double newlines as paragraph breaks — prefer those
  let chunks = instructions.split(/\r?\n\r?\n/).map((s) => s.trim()).filter(Boolean);

  // If no paragraph breaks, fall back to single newlines
  if (chunks.length <= 1) {
    chunks = instructions.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  }

  return chunks
    // Drop standalone step labels: "STEP 1", "Step 2", "1.", "2" alone on a line
    .filter((s) => !/^(step\s*)?\d+\.?\s*$/i.test(s))
    // Strip leading "1. " or "Step 1: " prefixes from steps that have real content
    .map((s) => s.replace(/^(step\s*\d+\s*[.:]?\s*|\d+\.\s*)/i, '').trim())
    .filter(Boolean);
}

export default function DetailScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const { isFavourite, toggleFavourite } = useFavourites();

  useEffect(() => {
    getMealById(id)
      .then(setMeal)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.accent} size="large" />
      </View>
    );
  }

  if (!meal) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Recipe not found.</Text>
      </View>
    );
  }

  const saved = isFavourite(meal.idMeal);
  const ingredients = getIngredients(meal);
  const steps = parseSteps(meal.strInstructions);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* Hero image */}
      <Image source={{ uri: meal.strMealThumb }} style={styles.hero} resizeMode="cover" />

      {/* Dark overlay */}
      <View style={styles.heroOverlay} />

      {/* Floating controls */}
      <SafeAreaView style={styles.controls} edges={['top']}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn} hitSlop={8}>
          <Text style={styles.iconBtnTxt}>←</Text>
        </Pressable>
        <Pressable onPress={() => toggleFavourite({ idMeal: meal.idMeal, strMeal: meal.strMeal, strMealThumb: meal.strMealThumb })} style={styles.iconBtn} hitSlop={8}>
          <Text style={[styles.iconBtnTxt, saved && { color: Colors.accent }]}>
            {saved ? '♥' : '♡'}
          </Text>
        </Pressable>
      </SafeAreaView>

      {/* Content sheet */}
      <ScrollView
        style={styles.sheet}
        contentContainerStyle={styles.sheetContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title + meta */}
        <Text style={styles.title}>{meal.strMeal}</Text>
        <View style={styles.metaRow}>
          {meal.strCategory ? <MetaChip label={`🍽 ${meal.strCategory}`} /> : null}
          {meal.strArea ? <MetaChip label={`🌍 ${meal.strArea}`} /> : null}
          <MetaChip label={`${ingredients.length} ingredients`} />
        </View>

        <View style={styles.divider} />

        {/* Ingredients */}
        <Text style={styles.sectionTitle}>Ingredients</Text>
        {ingredients.map(({ ingredient, measure }, i) => (
          <View key={i} style={styles.ingredientRow}>
            <View style={styles.dot} />
            <Text style={styles.ingredientText}>
              <Text style={styles.measure}>{measure} </Text>
              {ingredient}
            </Text>
          </View>
        ))}

        <View style={styles.divider} />

        {/* Steps */}
        <Text style={styles.sectionTitle}>Steps</Text>
        {steps.map((step, i) => (
          <View key={i} style={styles.stepRow}>
            <View style={styles.stepNum}>
              <Text style={styles.stepNumTxt}>{i + 1}</Text>
            </View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}

        {/* CTA */}
        <Pressable
          style={({ pressed }) => [styles.ctaBtn, pressed && { opacity: 0.85 }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.ctaTxt}>Back to recipes</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function MetaChip({ label }: { label: string }) {
  return (
    <View style={styles.metaChip}>
      <Text style={styles.metaChipTxt}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.white },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.bg },
  errorText: { fontSize: 16, color: Colors.t2 },

  hero: { position: 'absolute', top: 0, left: 0, right: 0, height: 310 },
  heroOverlay: {
    position: 'absolute', top: 190, left: 0, right: 0, height: 120,
    backgroundColor: '#000', opacity: 0.2,
  },

  controls: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 8,
  },
  iconBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center', justifyContent: 'center',
  },
  iconBtnTxt: { fontSize: 17, color: Colors.t1 },

  sheet: { marginTop: 288, borderTopLeftRadius: 28, borderTopRightRadius: 28, backgroundColor: Colors.white },
  sheetContent: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 48 },

  title: { fontSize: 26, fontWeight: '700', color: Colors.t1, marginBottom: 14 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  metaChip: {
    backgroundColor: '#F5F5F5', borderRadius: Radius.sm,
    paddingHorizontal: 10, paddingVertical: 6,
  },
  metaChipTxt: { fontSize: 12, fontWeight: '500', color: Colors.t2 },

  divider: { height: 1, backgroundColor: Colors.divider, marginVertical: 20 },

  sectionTitle: { fontSize: 17, fontWeight: '600', color: Colors.t1, marginBottom: 14 },

  ingredientRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  dot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: Colors.accent, marginTop: 6, marginRight: 12,
  },
  ingredientText: { flex: 1, fontSize: 14, color: Colors.t1, lineHeight: 20 },
  measure: { fontWeight: '600', color: Colors.t1 },

  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  stepNum: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: Colors.accent,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 12, marginTop: 1, flexShrink: 0,
  },
  stepNumTxt: { fontSize: 11, fontWeight: '600', color: Colors.white },
  stepText: { flex: 1, fontSize: 13, color: Colors.t2, lineHeight: 20 },

  ctaBtn: {
    backgroundColor: Colors.accent, borderRadius: Radius.lg,
    paddingVertical: 16, alignItems: 'center', marginTop: 24,
  },
  ctaTxt: { fontSize: 15, fontWeight: '600', color: Colors.white },
});
