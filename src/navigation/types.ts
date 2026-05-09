export type AuthStackParamList = {
  Onboarding: undefined;
  Auth: { mode: 'login' | 'signup' };
  ForgotPassword: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  Results: { query: string };
  Detail: { id: string; title: string };
};

export type FavouritesStackParamList = {
  Favourites: undefined;
  Detail: { id: string; title: string };
};

export type ProfileStackParamList = {
  Profile: undefined;
};

export type TabParamList = {
  FavouritesTab: undefined;
  HomeTab: undefined;
  ProfileTab: undefined;
};

// Backwards compat alias used inside screens
export type RootStackParamList = HomeStackParamList;
