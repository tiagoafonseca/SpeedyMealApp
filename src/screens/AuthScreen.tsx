import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Radius } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Auth'>;
type Mode = 'login' | 'signup';

export default function AuthScreen({ route, navigation }: Props) {
  const [mode, setMode] = useState<Mode>(route.params?.mode ?? 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [tabBarWidth, setTabBarWidth] = useState(0);

  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);
  const tabAnim = useRef(new Animated.Value(mode === 'login' ? 0 : 1)).current;
  const confirmOpacity = useRef(new Animated.Value(mode === 'signup' ? 1 : 0)).current;
  const confirmHeight = useRef(new Animated.Value(mode === 'signup' ? 1 : 0)).current;

  const { signIn, signUp } = useAuth();

  useEffect(() => {
    setError(null);
    setInfo(null);
    Animated.parallel([
      Animated.spring(tabAnim, {
        toValue: mode === 'login' ? 0 : 1,
        tension: 80, friction: 12,
        useNativeDriver: true,
      }),
      Animated.timing(confirmOpacity, {
        toValue: mode === 'signup' ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(confirmHeight, {
        toValue: mode === 'signup' ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [mode]);

  function validate(): string | null {
    if (!email.trim()) return 'Email is required.';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Enter a valid email address.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    if (mode === 'signup' && password !== confirmPassword) return 'Passwords do not match.';
    return null;
  }

  async function handleSubmit() {
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setError(null);
    setInfo(null);
    setLoading(true);

    if (mode === 'login') {
      const err = await signIn(email.trim(), password);
      if (err) setError(err);
      // On success AuthContext updates session → navigator switches to AppStack automatically
    } else {
      const { error: err, needsConfirmation } = await signUp(email.trim(), password);
      if (err) {
        setError(err);
      } else if (needsConfirmation) {
        setInfo('Check your email to confirm your account, then log in.');
        setMode('login');
      }
    }

    setLoading(false);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back */}
          <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={styles.back}>
            <Text style={styles.backTxt}>←</Text>
          </Pressable>

          {/* Logo */}
          <View style={styles.logoWrap}>
            <Image
              source={require('../../assets/speedymeal-icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.appName}>SpeedyMeal</Text>
          </View>

          {/* Tab switcher */}
          <View
            style={styles.tabBar}
            onLayout={(e) => setTabBarWidth(e.nativeEvent.layout.width)}
          >
            {/* Sliding pill */}
            <Animated.View
              style={[
                styles.tabPill,
                {
                  width: tabBarWidth > 0 ? tabBarWidth / 2 - 4 : '50%',
                  transform: [{
                    translateX: tabAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, tabBarWidth > 0 ? tabBarWidth / 2 : 0],
                    }),
                  }],
                },
              ]}
            />
            {(['login', 'signup'] as Mode[]).map((m) => (
              <Pressable
                key={m}
                style={styles.tab}
                onPress={() => setMode(m)}
              >
                <Text style={[styles.tabTxt, mode === m && styles.tabTxtActive]}>
                  {m === 'login' ? 'Log In' : 'Sign Up'}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Feedback banners */}
          {error ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorTxt}>{error}</Text>
            </View>
          ) : null}
          {info ? (
            <View style={styles.infoBanner}>
              <Text style={styles.infoTxt}>{info}</Text>
            </View>
          ) : null}

          {/* Fields */}
          <View style={styles.fields}>
            <Field
              label="Email"
              placeholder="hello@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />
            <Field
              ref={passwordRef}
              label="Password"
              placeholder="Min. 6 characters"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              returnKeyType={mode === 'signup' ? 'next' : 'done'}
              onSubmitEditing={() =>
                mode === 'signup' ? confirmRef.current?.focus() : handleSubmit()
              }
            />
            <Animated.View style={{
              opacity: confirmOpacity,
              maxHeight: confirmHeight.interpolate({ inputRange: [0, 1], outputRange: [0, 90] }),
              overflow: 'hidden',
            }}>
              <Field
                ref={confirmRef}
                label="Confirm Password"
                placeholder="Repeat password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
              />
            </Animated.View>
          </View>

          {/* Forgot password (login only) */}
          {mode === 'login' && (
            <Pressable
              style={styles.forgotWrap}
              hitSlop={8}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.forgotTxt}>Forgot password?</Text>
            </Pressable>
          )}

          {/* Submit */}
          <Pressable
            style={({ pressed }) => [styles.submitBtn, pressed && { opacity: 0.85 }, loading && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.submitTxt}>{mode === 'login' ? 'Log In' : 'Create Account'}</Text>
            )}
          </Pressable>

          {/* Terms */}
          {mode === 'signup' && (
            <Text style={styles.terms}>
              By continuing, you agree to our Terms & Privacy Policy.
            </Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Reusable field ─────────────────────────────────────────────────────────────
interface FieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address';
  returnKeyType?: 'next' | 'done';
  onSubmitEditing?: () => void;
}

const Field = React.forwardRef<TextInput, FieldProps>(
  ({ label, placeholder, value, onChangeText, secureTextEntry, keyboardType, returnKeyType, onSubmitEditing }, ref) => (
    <View style={fieldStyles.wrap}>
      <Text style={fieldStyles.label}>{label}</Text>
      <TextInput
        ref={ref}
        style={fieldStyles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.t3}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType ?? 'default'}
        returnKeyType={returnKeyType ?? 'done'}
        onSubmitEditing={onSubmitEditing}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  ),
);

const fieldStyles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '500', color: Colors.t2, marginBottom: 6 },
  input: {
    backgroundColor: '#F8F8F8',
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: '#EBEBEB',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.t1,
  },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  scroll: { paddingHorizontal: 24, paddingBottom: 40 },

  back: { marginTop: 8, marginBottom: 8 },
  backTxt: { fontSize: 22, color: Colors.t1 },

  logoWrap: { alignItems: 'center', marginTop: 16, marginBottom: 28 },
  logo: {
    width: 72, height: 72,
    marginBottom: 10,
  },
  appName: { fontSize: 20, fontWeight: '700', color: Colors.t1 },

  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: Radius.md,
    padding: 4,
    marginBottom: 24,
    position: 'relative',
  },
  tabPill: {
    position: 'absolute',
    top: 4,
    left: 4,
    bottom: 4,
    borderRadius: Radius.sm,
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  tab: {
    flex: 1, paddingVertical: 10,
    borderRadius: Radius.sm,
    alignItems: 'center',
  },
  tabTxt: { fontSize: 14, fontWeight: '500', color: Colors.t3 },
  tabTxtActive: { fontWeight: '600', color: Colors.t1 },

  errorBanner: {
    backgroundColor: '#FEE2E2', borderRadius: Radius.sm,
    padding: 12, marginBottom: 16,
  },
  errorTxt: { fontSize: 13, color: '#DC2626' },
  infoBanner: {
    backgroundColor: '#DCFCE7', borderRadius: Radius.sm,
    padding: 12, marginBottom: 16,
  },
  infoTxt: { fontSize: 13, color: '#16A34A' },

  fields: { marginBottom: 4 },

  forgotWrap: { alignSelf: 'flex-end', marginBottom: 24 },
  forgotTxt: { fontSize: 13, fontWeight: '500', color: Colors.accent },

  submitBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.lg,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitTxt: { fontSize: 16, fontWeight: '600', color: Colors.white },

  terms: {
    fontSize: 11, color: Colors.t3,
    textAlign: 'center', marginTop: 20, lineHeight: 16,
  },
});
