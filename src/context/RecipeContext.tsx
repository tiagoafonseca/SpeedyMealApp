import React, { createContext, useCallback, useContext, useState } from 'react';
import {
  Category,
  Meal,
  MealSummary,
  getCategories,
  getMealsByCategory,
  getRandomMeal,
  searchMeals,
} from '../services/mealdb';

interface RecipeState {
  query: string;
  results: MealSummary[];
  categories: Category[];
  activeCategory: string;
  isLoading: boolean;
  error: string | null;
}

interface RecipeActions {
  search: (q: string) => Promise<void>;
  setQuery: (q: string) => void;
  selectCategory: (cat: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  surprise: () => Promise<Meal | null>;
  clearResults: () => void;
}

const RecipeContext = createContext<(RecipeState & RecipeActions) | null>(null);

export function RecipeProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MealSummary[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const withLoading = useCallback(async (fn: () => Promise<void>) => {
    setIsLoading(true);
    setError(null);
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const search = useCallback(async (q: string) => {
    await withLoading(async () => {
      const meals = await searchMeals(q);
      setResults(meals);
    });
  }, [withLoading]);

  const selectCategory = useCallback(async (cat: string) => {
    setActiveCategory(cat);
    if (cat === 'All') {
      await withLoading(async () => {
        const diverseCategories = ['Beef', 'Chicken', 'Seafood', 'Vegetarian', 'Pasta', 'Dessert'];
        const buckets = await Promise.all(
          diverseCategories.map((c) => getMealsByCategory(c)),
        );
        // Interleave: take 2 from each category round-robin for a varied grid
        const interleaved: MealSummary[] = [];
        for (let i = 0; i < 2; i++) {
          for (let j = 0; j < buckets.length; j++) {
            const item = buckets[j][i];
            if (item) interleaved.push({ ...item, strCategory: diverseCategories[j] });
          }
        }
        setResults(interleaved);
      });
      return;
    }
    await withLoading(async () => {
      const meals = await getMealsByCategory(cat);
      setResults(meals.map((m) => ({ ...m, strCategory: cat })));
    });
  }, [withLoading]);

  const fetchCategories = useCallback(async () => {
    await withLoading(async () => {
      const cats = await getCategories();
      setCategories(cats);
    });
  }, [withLoading]);

  const surprise = useCallback(async (): Promise<Meal | null> => {
    setIsLoading(true);
    setError(null);
    try {
      return await getRandomMeal();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setQuery('');
  }, []);

  return (
    <RecipeContext.Provider
      value={{
        query, results, categories, activeCategory,
        isLoading, error,
        search, setQuery, selectCategory, fetchCategories, surprise, clearResults,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipes() {
  const ctx = useContext(RecipeContext);
  if (!ctx) throw new Error('useRecipes must be used inside RecipeProvider');
  return ctx;
}
