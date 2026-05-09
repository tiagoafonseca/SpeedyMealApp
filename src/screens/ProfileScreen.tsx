import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Radius } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { useFavourites } from '../context/FavouritesContext';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { favourites } = useFavourites();
  const [signingOut, setSigningOut] = useState(false);

  const email = user?.email ?? '—';
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-GB', {
        month: 'long',
        year: 'numeric',
      })
    : '—';

  function confirmSignOut() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          setSigningOut(true);
          await signOut();
          // AuthContext updates session → navigator switches to AuthStack automatically
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Avatar + name */}
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLetter}>
              {email.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.emailTxt}>{email}</Text>
          <Text style={styles.memberTxt}>Member since {memberSince}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard value={favourites.length} label="Favourites" />
        </View>

        <View style={styles.divider} />

        {/* Account section */}
        <Text style={styles.sectionLabel}>Account</Text>
        <View style={styles.menuCard}>
          <MenuItem label="Email address" value={email} />
          <View style={styles.menuDivider} />
          <MenuItem label="Member since" value={memberSince} />
        </View>

        <View style={styles.divider} />

        {/* App section */}
        <Text style={styles.sectionLabel}>App</Text>
        <View style={styles.menuCard}>
          <MenuItem label="Version" value="1.0.0" />
          <View style={styles.menuDivider} />
          <MenuItem label="Data" value="Powered by TheMealDB" />
        </View>

        <View style={styles.divider} />

        {/* Sign out */}
        <Pressable
          style={({ pressed }) => [styles.signOutBtn, pressed && { opacity: 0.8 }]}
          onPress={confirmSignOut}
          disabled={signingOut}
        >
          {signingOut ? (
            <ActivityIndicator color={Colors.accent} />
          ) : (
            <Text style={styles.signOutTxt}>Sign Out</Text>
          )}
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function MenuItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.menuItem}>
      <Text style={styles.menuLabel}>{label}</Text>
      <Text style={styles.menuValue} numberOfLines={1}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingHorizontal: 24, paddingBottom: 48 },

  avatarWrap: { alignItems: 'center', paddingTop: 32, paddingBottom: 24 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.accent,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 14,
  },
  avatarLetter: { fontSize: 34, fontWeight: '700', color: Colors.white },
  emailTxt: { fontSize: 16, fontWeight: '600', color: Colors.t1, marginBottom: 4 },
  memberTxt: { fontSize: 13, color: Colors.t2 },

  statsRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 8 },
  statCard: {
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    paddingVertical: 18, paddingHorizontal: 40,
    alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06, shadowRadius: 14, elevation: 3,
  },
  statValue: { fontSize: 28, fontWeight: '700', color: Colors.accent },
  statLabel: { fontSize: 12, color: Colors.t2, marginTop: 2 },

  divider: { height: 1, backgroundColor: Colors.divider, marginVertical: 20 },
  sectionLabel: { fontSize: 12, fontWeight: '600', color: Colors.t2, marginBottom: 10, letterSpacing: 0.5, textTransform: 'uppercase' },

  menuCard: {
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05, shadowRadius: 12, elevation: 2,
  },
  menuItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14,
  },
  menuLabel: { fontSize: 14, color: Colors.t1, fontWeight: '500' },
  menuValue: { fontSize: 13, color: Colors.t2, maxWidth: '55%', textAlign: 'right' },
  menuDivider: { height: 1, backgroundColor: Colors.divider, marginHorizontal: 16 },

  signOutBtn: {
    borderWidth: 1.5, borderColor: Colors.accent, borderRadius: Radius.lg,
    paddingVertical: 14, alignItems: 'center',
  },
  signOutTxt: { fontSize: 15, fontWeight: '600', color: Colors.accent },
});
