import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { MealSummary } from '../services/mealdb';

const STORAGE_KEY = '@speedymeal_favourites';

interface FavouritesState {
  favourites: MealSummary[];
  isFavourite: (id: string) => boolean;
}

interface FavouritesActions {
  toggleFavourite: (meal: MealSummary) => void;
}

const FavouritesContext = createContext<(FavouritesState & FavouritesActions) | null>(null);

export function FavouritesProvider({ children }: { children: React.ReactNode }) {
  const [favourites, setFavourites] = useState<MealSummary[]>([]);

  // Load from storage on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) setFavourites(JSON.parse(raw));
    });
  }, []);

  // Persist whenever favourites changes
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
  }, [favourites]);

  const isFavourite = useCallback(
    (id: string) => favourites.some((m) => m.idMeal === id),
    [favourites],
  );

  const toggleFavourite = useCallback((meal: MealSummary) => {
    setFavourites((prev) =>
      prev.some((m) => m.idMeal === meal.idMeal)
        ? prev.filter((m) => m.idMeal !== meal.idMeal)
        : [...prev, meal],
    );
  }, []);

  return (
    <FavouritesContext.Provider value={{ favourites, isFavourite, toggleFavourite }}>
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites() {
  const ctx = useContext(FavouritesContext);
  if (!ctx) throw new Error('useFavourites must be used inside FavouritesProvider');
  return ctx;
}
