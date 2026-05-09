import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Radius } from '../constants/theme';
import { supabase } from '../lib/supabase';
import { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSend() {
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Enter a valid email address.'); return; }

    setError(null);
    setLoading(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim());
    setLoading(false);

    if (err) {
      setError(err.message);
    } else {
      setSent(true);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>

          {/* Back */}
          <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={styles.back}>
            <Text style={styles.backTxt}>←</Text>
          </Pressable>

          {sent ? (
            // ── Success state ──────────────────────────────────────────────
            <View style={styles.successWrap}>
              <View style={styles.successIcon}>
                <Text style={styles.successIconTxt}>✉</Text>
              </View>
              <Text style={styles.successTitle}>Check your inbox</Text>
              <Text style={styles.successSub}>
                We sent a password reset link to{'\n'}
                <Text style={styles.successEmail}>{email}</Text>
              </Text>
              <Pressable
                style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.85 }]}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.primaryBtnTxt}>Back to Log In</Text>
              </Pressable>
            </View>
          ) : (
            // ── Form state ─────────────────────────────────────────────────
            <>
              <View style={styles.header}>
                <Text style={styles.title}>Forgot password?</Text>
                <Text style={styles.subtitle}>
                  Enter the email linked to your account and we'll send you a reset link.
                </Text>
              </View>

              {error ? (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorTxt}>{error}</Text>
                </View>
              ) : null}

              <Text style={styles.fieldLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="hello@example.com"
                placeholderTextColor={Colors.t3}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleSend}
                autoFocus
              />

              <Pressable
                style={({ pressed }) => [
                  styles.primaryBtn,
                  pressed && { opacity: 0.85 },
                  loading && { opacity: 0.7 },
                ]}
                onPress={handleSend}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  <Text style={styles.primaryBtnTxt}>Send Reset Link</Text>
                )}
              </Pressable>
            </>
          )}

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  container: { flex: 1, paddingHorizontal: 24 },

  back: { marginTop: 8, marginBottom: 32 },
  backTxt: { fontSize: 22, color: Colors.t1 },

  header: { marginBottom: 28 },
  title: { fontSize: 28, fontWeight: '700', color: Colors.t1, marginBottom: 10 },
  subtitle: { fontSize: 15, color: Colors.t2, lineHeight: 22 },

  errorBanner: {
    backgroundColor: '#FEE2E2', borderRadius: Radius.sm,
    padding: 12, marginBottom: 16,
  },
  errorTxt: { fontSize: 13, color: '#DC2626' },

  fieldLabel: { fontSize: 12, fontWeight: '500', color: Colors.t2, marginBottom: 6 },
  input: {
    backgroundColor: '#F8F8F8', borderRadius: Radius.md,
    borderWidth: 1.5, borderColor: '#EBEBEB',
    paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 15, color: Colors.t1, marginBottom: 24,
  },

  primaryBtn: {
    backgroundColor: Colors.accent, borderRadius: Radius.lg,
    paddingVertical: 16, alignItems: 'center',
  },
  primaryBtnTxt: { fontSize: 16, fontWeight: '600', color: Colors.white },

  // Success state
  successWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 60 },
  successIcon: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#FDE8DC',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 24,
  },
  successIconTxt: { fontSize: 34 },
  successTitle: { fontSize: 24, fontWeight: '700', color: Colors.t1, marginBottom: 12 },
  successSub: {
    fontSize: 15, color: Colors.t2, textAlign: 'center',
    lineHeight: 22, marginBottom: 40,
  },
  successEmail: { fontWeight: '600', color: Colors.t1 },
});
