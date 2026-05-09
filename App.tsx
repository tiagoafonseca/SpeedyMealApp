import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { FavouritesProvider } from './src/context/FavouritesContext';
import { RecipeProvider } from './src/context/RecipeContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <FavouritesProvider>
          <RecipeProvider>
            <AppNavigator />
          </RecipeProvider>
        </FavouritesProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
