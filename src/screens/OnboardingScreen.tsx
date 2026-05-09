import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Radius } from '../constants/theme';
import { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Onboarding'>;

const PROPS = [
  { title: 'Search', desc: 'Find recipes by ingredient or dish name' },
  { title: 'Discover', desc: 'Get personalised meal suggestions' },
  { title: 'Cook', desc: 'Step-by-step guides for every level' },
];

export default function OnboardingScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      {/* Illustration */}
      <View style={styles.illuContainer}>
        <View style={styles.illuBg}>
          {/* Decorative food shapes */}
          <View style={[styles.foodShape, { width: 90, height: 60, backgroundColor: '#D4E8C2', borderRadius: 30, top: 60, left: 30 }]} />
          <View style={[styles.foodShape, { width: 70, height: 55, backgroundColor: '#F5D5B8', borderRadius: 28, top: 55, left: 110 }]} />
          <View style={[styles.foodShape, { width: 50, height: 40, backgroundColor: '#F0C8C8', borderRadius: 20, top: 45, left: 80 }]} />
          <View style={[styles.foodShape, { width: 34, height: 34, backgroundColor: Colors.accent, borderRadius: 17, top: 40, left: 158 }]} />
          {/* Bowl */}
          <View style={styles.bowl} />
        </View>
      </View>

      {/* Text content */}
      <View style={styles.content}>
        <Text style={styles.appName}>SpeedyMeal</Text>
        <Text style={styles.tagline}>Never wonder what to eat again.</Text>

        <View style={styles.props}>
          {PROPS.map(({ title, desc }) => (
            <View key={title} style={styles.propRow}>
              <View style={styles.propDot} />
              <Text style={styles.propText}>
                <Text style={styles.propTitle}>{title}</Text>
                {' — '}{desc}
              </Text>
            </View>
          ))}
        </View>

        {/* Page dots */}
        <View style={styles.dots}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>

      {/* CTAs */}
      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.85 }]}
          onPress={() => navigation.navigate('Auth', { mode: 'signup' })}
        >
          <Text style={styles.primaryBtnTxt}>Get Started</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.secondaryBtn, pressed && { opacity: 0.7 }]}
          onPress={() => navigation.navigate('Auth', { mode: 'login' })}
        >
          <Text style={styles.secondaryBtnTxt}>I already have an account →</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF8F5' },

  illuContainer: { alignItems: 'center', marginTop: 24 },
  illuBg: {
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#FDE8DC',
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  foodShape: { position: 'absolute' },
  bowl: {
    width: 200,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.white,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },

  content: { paddingHorizontal: 32, marginTop: 32 },
  appName: { fontSize: 34, fontWeight: '700', color: Colors.t1, textAlign: 'center' },
  tagline: { fontSize: 16, color: Colors.t2, textAlign: 'center', marginTop: 8, marginBottom: 28 },

  props: { gap: 14 },
  propRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  propDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: Colors.accent, marginTop: 5, flexShrink: 0,
  },
  propText: { flex: 1, fontSize: 14, color: Colors.t2, lineHeight: 20 },
  propTitle: { fontWeight: '600', color: Colors.t1 },

  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 32 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#D8D8D8' },
  dotActive: { width: 20, backgroundColor: Colors.accent },

  footer: { paddingHorizontal: 24, paddingBottom: 16, marginTop: 'auto', gap: 12 },
  primaryBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.lg,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryBtnTxt: { fontSize: 16, fontWeight: '600', color: Colors.white },
  secondaryBtn: { alignItems: 'center', paddingVertical: 8 },
  secondaryBtnTxt: { fontSize: 14, fontWeight: '500', color: Colors.accent },
});
