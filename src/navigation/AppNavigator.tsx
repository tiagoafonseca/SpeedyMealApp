import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useFocusEffect, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Colors } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { useRecipes } from '../context/RecipeContext';
import AuthScreen from '../screens/AuthScreen';
import DetailScreen from '../screens/DetailScreen';
import FavouritesScreen from '../screens/FavouritesScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import HomeScreen from '../screens/HomeScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ResultsScreen from '../screens/ResultsScreen';
import {
  AuthStackParamList,
  FavouritesStackParamList,
  HomeStackParamList,
  ProfileStackParamList,
  TabParamList,
} from './types';

// ── Auth Stack ─────────────────────────────────────────────────────────────────
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Onboarding" component={OnboardingScreen} />
      <AuthStack.Screen name="Auth" component={AuthScreen} />
      <AuthStack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
    </AuthStack.Navigator>
  );
}

// ── Home Stack ─────────────────────────────────────────────────────────────────
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
function HomeNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="Results" component={ResultsScreen} />
      <HomeStack.Screen
        name="Detail"
        component={DetailScreen}
        options={{ animation: 'slide_from_right' }}
      />
    </HomeStack.Navigator>
  );
}

// ── Favourites Stack ───────────────────────────────────────────────────────────
const FavStack = createNativeStackNavigator<FavouritesStackParamList>();
function FavouritesNavigator() {
  return (
    <FavStack.Navigator screenOptions={{ headerShown: false }}>
      <FavStack.Screen name="Favourites" component={FavouritesScreen} />
      <FavStack.Screen
        name="Detail"
        component={DetailScreen}
        options={{ animation: 'slide_from_right' }}
      />
    </FavStack.Navigator>
  );
}

// ── Profile Stack ──────────────────────────────────────────────────────────────
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
function ProfileNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
    </ProfileStack.Navigator>
  );
}

// ── Fade wrapper for tab transitions ──────────────────────────────────────────
function FadeScreen({ children }: { children: React.ReactNode }) {
  const opacity = useRef(new Animated.Value(1)).current;

  useFocusEffect(
    useCallback(() => {
      opacity.setValue(0);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }, [opacity]),
  );

  return (
    <Animated.View style={{ flex: 1, opacity }}>
      {children}
    </Animated.View>
  );
}

// ── Bottom Tabs ────────────────────────────────────────────────────────────────
const Tab = createBottomTabNavigator<TabParamList>();
function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.t3,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
          paddingTop: 6,
          paddingBottom: Platform.OS === 'ios' ? 24 : 10,
          height: Platform.OS === 'ios' ? 82 : 64,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 2,
        },
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            FavouritesTab: 'heart',
            HomeTab: 'search',
            ProfileTab: 'person',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="FavouritesTab" options={{ tabBarLabel: 'Favourites' }}>
        {() => <FadeScreen><FavouritesNavigator /></FadeScreen>}
      </Tab.Screen>
      <Tab.Screen name="HomeTab" options={{ tabBarLabel: 'Discover' }}>
        {() => <FadeScreen><HomeNavigator /></FadeScreen>}
      </Tab.Screen>
      <Tab.Screen name="ProfileTab" options={{ tabBarLabel: 'Profile' }}>
        {() => <FadeScreen><ProfileNavigator /></FadeScreen>}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// ── Surprise FAB ───────────────────────────────────────────────────────────────
function SurpriseFAB({ navigationRef }: { navigationRef: any }) {
  const { surprise } = useRecipes();
  const [loading, setLoading] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;
  const spin = useRef(new Animated.Value(0)).current;

  async function handlePress() {
    if (loading) return;

    Animated.parallel([
      Animated.sequence([
        Animated.spring(scale, { toValue: 0.85, speed: 50, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, speed: 20, useNativeDriver: true }),
      ]),
      Animated.timing(spin, { toValue: 1, duration: 420, useNativeDriver: true }),
    ]).start(() => spin.setValue(0));

    setLoading(true);
    const meal = await surprise();
    setLoading(false);

    if (meal) {
      navigationRef.navigate('HomeTab', {
        screen: 'Detail',
        params: { id: meal.idMeal, title: meal.strMeal },
      });
    }
  }

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Animated.View style={[fabStyles.fab, { transform: [{ scale }, { rotate }] }]}>
      <Pressable onPress={handlePress} style={fabStyles.inner} disabled={loading}>
        {loading
          ? <ActivityIndicator color={Colors.white} size="small" />
          : <Text style={fabStyles.icon}>🎲</Text>
        }
      </Pressable>
    </Animated.View>
  );
}

const fabStyles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 76,
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.accent,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  inner: {
    width: '100%',
    height: '100%',
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 22 },
});

// ── Root ───────────────────────────────────────────────────────────────────────
export default function RootNavigator() {
  const { session, isLoading } = useAuth();
  const navigationRef = useNavigationContainerRef();
  const [currentRoute, setCurrentRoute] = useState<string | undefined>();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.bg }}>
        <ActivityIndicator color={Colors.accent} size="large" />
      </View>
    );
  }

  const showFAB = session && currentRoute !== 'Detail' && currentRoute !== 'Profile';

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer
        ref={navigationRef}
        onStateChange={() => setCurrentRoute(navigationRef.getCurrentRoute()?.name)}
      >
        {session ? <TabNavigator /> : <AuthNavigator />}
      </NavigationContainer>
      {showFAB && <SurpriseFAB navigationRef={navigationRef} />}
    </View>
  );
}
