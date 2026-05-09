import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
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
  const [focused, setFocused] = useState(false);

  const screenOpacity = useRef(new Animated.Value(0)).current;
  const formTranslateY = useRef(new Animated.Value(24)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0.88)).current;
  const iconTranslateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(screenOpacity, { toValue: 1, duration: 280, useNativeDriver: true }),
      Animated.spring(formTranslateY, { toValue: 0, tension: 80, friction: 12, useNativeDriver: true }),
    ]).start();
  }, []);

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
      Animated.parallel([
        Animated.timing(successOpacity, { toValue: 1, duration: 320, useNativeDriver: true }),
        Animated.spring(successScale, { toValue: 1, tension: 60, friction: 10, useNativeDriver: true }),
      ]).start(() => {
        Animated.sequence([
          Animated.timing(iconTranslateY, { toValue: -14, duration: 180, useNativeDriver: true }),
          Animated.spring(iconTranslateY, { toValue: 0, tension: 80, friction: 6, useNativeDriver: true }),
        ]).start();
      });
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Animated.View style={[styles.container, { opacity: screenOpacity }]}>

          {!sent && (
            <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={styles.back}>
              <Text style={styles.backTxt}>←</Text>
            </Pressable>
          )}

          {sent ? (
            <Animated.View style={[
              styles.successWrap,
              { opacity: successOpacity, transform: [{ scale: successScale }] },
            ]}>
              <Animated.View style={[styles.successIcon, { transform: [{ translateY: iconTranslateY }] }]}>
                <Text style={styles.successIconTxt}>✉️</Text>
              </Animated.View>
              <Text style={styles.successTitle}>Check your inbox</Text>
              <Text style={styles.successSub}>
                We sent a reset link to{'\n'}
                <Text style={styles.successEmail}>{email}</Text>
              </Text>
              <Pressable
                style={({ pressed }) => [styles.primaryBtn, styles.primaryBtnFull, pressed && { opacity: 0.85 }]}
                onPress={() => navigation.navigate('Auth', { mode: 'login' })}
              >
                <Text style={styles.primaryBtnTxt}>Back to Log In</Text>
              </Pressable>
            </Animated.View>
          ) : (
            <Animated.View style={{ transform: [{ translateY: formTranslateY }] }}>
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
                style={[styles.input, focused && styles.inputFocused]}
                placeholder="hello@example.com"
                placeholderTextColor={Colors.t3}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleSend}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
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
            </Animated.View>
          )}

        </Animated.View>
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
  inputFocused: { borderColor: Colors.accent },

  primaryBtn: {
    backgroundColor: Colors.accent, borderRadius: Radius.lg,
    paddingVertical: 16, paddingHorizontal: 24, alignItems: 'center',
  },
  primaryBtnFull: { alignSelf: 'stretch' },
  primaryBtnTxt: { fontSize: 16, fontWeight: '600', color: Colors.white },

  successWrap: {
    flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 60,
  },
  successIcon: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: '#FDE8DC',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 24,
  },
  successIconTxt: { fontSize: 36 },
  successTitle: { fontSize: 24, fontWeight: '700', color: Colors.t1, marginBottom: 12 },
  successSub: {
    fontSize: 15, color: Colors.t2, textAlign: 'center',
    lineHeight: 22, marginBottom: 40,
  },
  successEmail: { fontWeight: '600', color: Colors.t1 },
});
