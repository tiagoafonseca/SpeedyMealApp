import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import { Colors } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
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
      <Tab.Screen
        name="FavouritesTab"
        component={FavouritesNavigator}
        options={{ tabBarLabel: 'Favourites' }}
      />
      <Tab.Screen
        name="HomeTab"
        component={HomeNavigator}
        options={{ tabBarLabel: 'Discover' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileNavigator}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

// ── Root ───────────────────────────────────────────────────────────────────────
export default function RootNavigator() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.bg }}>
        <ActivityIndicator color={Colors.accent} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {session ? <TabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
