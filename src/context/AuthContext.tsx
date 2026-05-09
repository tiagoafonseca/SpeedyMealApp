import { Session, User } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}

interface AuthActions {
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<{ error: string | null; needsConfirmation: boolean }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<(AuthState & AuthActions) | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signIn(email: string, password: string): Promise<string | null> {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? error.message : null;
  }

  async function signUp(
    email: string,
    password: string,
  ): Promise<{ error: string | null; needsConfirmation: boolean }> {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message, needsConfirmation: false };

    // Supabase silently fakes success for duplicate emails to prevent enumeration.
    // An empty identities array is the reliable signal that the email already exists.
    if (data.user && (data.user.identities?.length ?? 0) === 0) {
      return {
        error: 'An account with this email already exists. Please log in instead.',
        needsConfirmation: false,
      };
    }

    // No session means email confirmation is required before login
    const needsConfirmation = !!data.user && !data.session;
    return { error: null, needsConfirmation };
  }

  async function signOut(): Promise<void> {
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
